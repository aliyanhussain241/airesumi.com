CREATE TABLE public.resume_role_examples (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  job_title TEXT NOT NULL,
  industry TEXT,
  seo_title TEXT,
  seo_description TEXT,
  intro_content TEXT,
  sample_bullet_points JSONB NOT NULL DEFAULT '[]'::jsonb,
  key_skills JSONB NOT NULL DEFAULT '[]'::jsonb,
  resume_tips JSONB NOT NULL DEFAULT '[]'::jsonb,
  related_role_slugs JSONB NOT NULL DEFAULT '[]'::jsonb,
  published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.resume_role_examples TO anon;
GRANT SELECT ON public.resume_role_examples TO authenticated;
GRANT ALL ON public.resume_role_examples TO service_role;

ALTER TABLE public.resume_role_examples ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published role examples are viewable by everyone"
  ON public.resume_role_examples FOR SELECT
  USING (published = true);

CREATE POLICY "Admins can view all role examples"
  ON public.resume_role_examples FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert role examples"
  ON public.resume_role_examples FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update role examples"
  ON public.resume_role_examples FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete role examples"
  ON public.resume_role_examples FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_resume_role_examples_updated_at
  BEFORE UPDATE ON public.resume_role_examples
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_resume_role_examples_published ON public.resume_role_examples (published);
CREATE INDEX idx_resume_role_examples_industry ON public.resume_role_examples (industry);

INSERT INTO public.resume_role_examples (
  slug, job_title, industry, seo_title, seo_description, intro_content,
  sample_bullet_points, key_skills, resume_tips, related_role_slugs, published
) VALUES (
  'test-role',
  'Test Role',
  'Technology',
  'Test Role Resume Example | Airesumi',
  'Test SEO description for the test-role resume example page. This confirms SSR is rendering role data correctly.',
  'This is a placeholder intro paragraph for the test role. It exists to verify that the /resume-examples/[slug] SSR loader, meta tags, and JSON-LD schema all render correctly before we populate real content.',
  '["Led a team of 5 engineers to deliver a test project on schedule", "Improved test coverage from 40% to 92% using automated tooling", "Reduced deployment time by 60% through CI/CD optimization"]'::jsonb,
  '["Test Skill A", "Test Skill B", "Test Skill C", "Test Skill D"]'::jsonb,
  '[{"heading":"Quantify everything","content":"Use numbers to demonstrate impact wherever possible."},{"heading":"Match the job description","content":"Mirror keywords from the target job posting to pass ATS filters."}]'::jsonb,
  '[]'::jsonb,
  true
);