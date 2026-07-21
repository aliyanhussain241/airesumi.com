CREATE TABLE public.recruiter_match_waitlist (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.recruiter_match_waitlist TO anon, authenticated;
GRANT ALL ON public.recruiter_match_waitlist TO service_role;

ALTER TABLE public.recruiter_match_waitlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can join the waitlist"
  ON public.recruiter_match_waitlist
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);