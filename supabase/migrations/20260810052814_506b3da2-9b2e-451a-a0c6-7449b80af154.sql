ALTER TABLE public.resume_role_examples
  ADD COLUMN IF NOT EXISTS role_faqs jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS certifications jsonb NOT NULL DEFAULT '[]'::jsonb;