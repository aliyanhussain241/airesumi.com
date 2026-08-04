REVOKE ALL ON public.user_credits FROM anon;
REVOKE ALL ON public.user_credits FROM PUBLIC;
GRANT SELECT ON public.user_credits TO authenticated;
GRANT ALL ON public.user_credits TO service_role;
ALTER TABLE public.user_credits REPLICA IDENTITY DEFAULT;