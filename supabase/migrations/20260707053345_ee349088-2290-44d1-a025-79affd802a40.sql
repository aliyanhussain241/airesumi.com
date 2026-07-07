
CREATE TABLE public.user_credits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  credits_remaining INTEGER NOT NULL DEFAULT 3,
  total_credits_used INTEGER NOT NULL DEFAULT 0,
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free','pro')),
  last_reset_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.user_credits TO authenticated;
GRANT ALL ON public.user_credits TO service_role;

ALTER TABLE public.user_credits ENABLE ROW LEVEL SECURITY;

-- Users can only read their own row. No INSERT/UPDATE/DELETE policies = blocked for users.
CREATE POLICY "Users view own credits" ON public.user_credits
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Auto-touch updated_at
CREATE TRIGGER update_user_credits_updated_at
  BEFORE UPDATE ON public.user_credits
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-provision on signup: extend existing handle_new_user to also seed credits.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)))
  ON CONFLICT DO NOTHING;

  INSERT INTO public.user_credits (user_id, credits_remaining, plan)
  VALUES (NEW.id, 3, 'free')
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$;

-- Make sure the trigger exists (idempotent).
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Backfill for existing users
INSERT INTO public.user_credits (user_id, credits_remaining, plan)
SELECT id, 3, 'free' FROM auth.users
ON CONFLICT (user_id) DO NOTHING;

-- Atomic consume: single UPDATE, race-safe.
CREATE OR REPLACE FUNCTION public.consume_credit(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _updated INTEGER;
  _plan TEXT;
BEGIN
  -- Pro users never consume; still return true.
  SELECT plan INTO _plan FROM public.user_credits WHERE user_id = _user_id;
  IF _plan IS NULL THEN
    INSERT INTO public.user_credits (user_id, credits_remaining, plan)
    VALUES (_user_id, 3, 'free')
    ON CONFLICT (user_id) DO NOTHING;
  END IF;

  IF _plan = 'pro' THEN
    UPDATE public.user_credits
       SET total_credits_used = total_credits_used + 1,
           updated_at = now()
     WHERE user_id = _user_id;
    RETURN TRUE;
  END IF;

  UPDATE public.user_credits
     SET credits_remaining = credits_remaining - 1,
         total_credits_used = total_credits_used + 1,
         updated_at = now()
   WHERE user_id = _user_id
     AND credits_remaining > 0;

  GET DIAGNOSTICS _updated = ROW_COUNT;
  RETURN _updated > 0;
END;
$$;

REVOKE ALL ON FUNCTION public.consume_credit(UUID) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.consume_credit(UUID) TO service_role;

-- Grant credits (used after Stripe payment).
CREATE OR REPLACE FUNCTION public.grant_credits(_user_id UUID, _amount INTEGER, _new_plan TEXT DEFAULT NULL)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_credits (user_id, credits_remaining, plan)
  VALUES (_user_id, GREATEST(_amount, 0), COALESCE(_new_plan, 'free'))
  ON CONFLICT (user_id) DO UPDATE
    SET credits_remaining = public.user_credits.credits_remaining + _amount,
        plan = COALESCE(_new_plan, public.user_credits.plan),
        updated_at = now();
END;
$$;

REVOKE ALL ON FUNCTION public.grant_credits(UUID, INTEGER, TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.grant_credits(UUID, INTEGER, TEXT) TO service_role;
