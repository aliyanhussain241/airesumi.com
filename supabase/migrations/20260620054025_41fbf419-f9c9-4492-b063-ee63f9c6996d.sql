CREATE TABLE IF NOT EXISTS public.saved_resumes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  job_title text,
  company text,
  design_id text NOT NULL,
  resume_data jsonb NOT NULL,
  user_data jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS saved_resumes_user_id_idx ON public.saved_resumes(user_id);
CREATE INDEX IF NOT EXISTS saved_resumes_updated_at_idx ON public.saved_resumes(updated_at DESC);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.saved_resumes TO authenticated;
GRANT ALL ON public.saved_resumes TO service_role;

ALTER TABLE public.saved_resumes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own resumes"
  ON public.saved_resumes FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own resumes"
  ON public.saved_resumes FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own resumes"
  ON public.saved_resumes FOR UPDATE TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own resumes"
  ON public.saved_resumes FOR DELETE TO authenticated
  USING (auth.uid() = user_id);