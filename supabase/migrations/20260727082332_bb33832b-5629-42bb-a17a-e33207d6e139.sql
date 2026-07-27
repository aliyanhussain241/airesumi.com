CREATE TABLE public.cover_letter_examples (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  job_title TEXT NOT NULL,
  industry TEXT,
  intro_content TEXT,
  example_letter TEXT NOT NULL,
  key_tips JSONB NOT NULL DEFAULT '[]'::jsonb,
  seo_title TEXT,
  seo_description TEXT,
  published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.cover_letter_examples TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cover_letter_examples TO authenticated;
GRANT ALL ON public.cover_letter_examples TO service_role;

ALTER TABLE public.cover_letter_examples ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published cover letter examples are public"
  ON public.cover_letter_examples FOR SELECT
  USING (published = true);

CREATE POLICY "Admins view all cover letter examples"
  ON public.cover_letter_examples FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins insert cover letter examples"
  ON public.cover_letter_examples FOR INSERT
  TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins update cover letter examples"
  ON public.cover_letter_examples FOR UPDATE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins delete cover letter examples"
  ON public.cover_letter_examples FOR DELETE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_cover_letter_examples_updated_at
  BEFORE UPDATE ON public.cover_letter_examples
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.cover_letter_examples (slug, job_title, industry, intro_content, example_letter, key_tips, seo_title, seo_description, published) VALUES
('general-cover-letter', 'General', 'All Industries',
'A flexible, all-purpose cover letter you can adapt to almost any role. Use it when you want a clean, professional starting point and plan to customize a few sentences per application.',
'Dear Hiring Manager,

I am writing to express my strong interest in the [Job Title] position at [Company Name]. With [X years] of experience in [industry/field] and a proven track record of [key achievement], I am confident I can contribute meaningfully to your team from day one.

In my current role at [Current Company], I [describe a measurable win — e.g., "led a project that increased revenue by 22%"]. I bring a combination of [Skill 1], [Skill 2], and [Skill 3] that aligns closely with what you''re looking for in this role.

What excites me most about [Company Name] is [specific reason — mission, product, recent news]. I''d welcome the opportunity to discuss how my background can help you [company goal].

Thank you for your time and consideration. I look forward to hearing from you.

Sincerely,
[Your Name]',
'["Keep it under 300 words — recruiters skim.", "Open with the role and one measurable win, not a life story.", "Reference something specific about the company to prove it isn''t a mass send.", "End with a confident call to action, not just \"hope to hear back\"."]'::jsonb,
'General Cover Letter Example (Free Template) | Airesumi',
'A flexible, professional cover letter template you can adapt to any job in minutes. Free to copy, customize, and download.',
true),

('short-cover-letter', 'Short & Concise', 'All Industries',
'A tight, three-paragraph cover letter for when the job posting says "keep it brief" or the application form has a small text box. Every sentence earns its place.',
'Dear [Hiring Manager Name],

I''m applying for the [Job Title] role at [Company Name]. In my last position, I [one specific, measurable achievement — e.g., "cut onboarding time by 40% across a 50-person team"], and I''d like to bring the same focus on [key skill] to your team.

Your posting mentions [specific requirement], which is exactly where I''ve spent the last [X years]. I''d be glad to walk you through how I''d approach it at [Company Name].

Thank you — I look forward to speaking with you.

[Your Name]',
'["Aim for 120–180 words total.", "Cut every adjective that doesn''t change the meaning.", "One achievement is enough — pick the strongest, most relevant one.", "Skip the ''I am writing to apply'' opener; get straight to value."]'::jsonb,
'Short Cover Letter Example (Under 200 Words) | Airesumi',
'A concise, three-paragraph cover letter template built for short application forms. Copy, edit, and send in minutes.',
true),

('entry-level-cover-letter', 'Entry-Level', 'All Industries',
'A cover letter designed for recent graduates and career starters. It leans on coursework, internships, and transferable skills instead of years of experience.',
'Dear Hiring Manager,

As a recent [Degree] graduate from [University] with hands-on experience through [internship / project / volunteer role], I''m excited to apply for the [Job Title] position at [Company Name].

During my internship at [Company], I [specific accomplishment — e.g., "built a dashboard used by the marketing team to track 6 weekly KPIs"]. That experience sharpened my skills in [Skill 1] and [Skill 2], both of which I noticed are central to this role.

I''m drawn to [Company Name] because [specific reason — a product, a value, a recent launch]. I know I''m early in my career, but I bring strong fundamentals, a fast learning curve, and a genuine interest in [industry/field].

I''d love the chance to contribute and grow with your team. Thank you for considering my application.

Sincerely,
[Your Name]',
'["Lead with a project or internship win, not ''I recently graduated''.", "Name the specific skills the job asks for — even from coursework.", "Show curiosity about the company; entry-level hires are chosen on potential + fit.", "Don''t apologize for lack of experience. Frame what you do have."]'::jsonb,
'Entry-Level Cover Letter Example for Graduates | Airesumi',
'A free entry-level cover letter template for recent grads and first-time job seekers. Highlights internships, coursework, and skills.',
true),

('career-change-cover-letter', 'Career Change', 'All Industries',
'A cover letter for professionals pivoting into a new field. Frames past experience as transferable strengths and answers the "why the switch?" question head-on.',
'Dear [Hiring Manager Name],

I''m applying for the [New Job Title] role at [Company Name] as I transition from [Previous Field] into [New Field]. My decision isn''t a leap — it''s the natural next step after [reason: e.g., "leading cross-functional projects that consistently pulled me toward the product side"].

Over [X years] in [Previous Field], I built strengths that directly apply here: [Transferable Skill 1], [Transferable Skill 2], and [Transferable Skill 3]. For example, I [specific measurable win that translates to the new field].

To close the gap, I''ve [reskilling proof — bootcamp, certification, portfolio project, freelance work]. I''m already producing [concrete output] and I''m ready to keep building in a full-time role at [Company Name].

I''d welcome the chance to talk through how my background maps to what your team needs.

Sincerely,
[Your Name]',
'["Address the switch in paragraph one — don''t leave the recruiter guessing.", "Translate old wins into the new field''s language.", "Show proof of reskilling: courses, certs, side projects, freelance work.", "Focus on outcomes, not job titles — outcomes travel across industries."]'::jsonb,
'Career Change Cover Letter Example | Airesumi',
'A free career change cover letter template that frames transferable skills and answers ''why the switch?'' with confidence.',
true),

('software-engineer-cover-letter', 'Software Engineer', 'Technology',
'A technical cover letter for software engineers. Pairs shipped-product outcomes with the specific stack and scale the role calls for.',
'Dear Hiring Manager,

I''m applying for the Software Engineer position at [Company Name]. Over the last [X years], I''ve shipped [type of software — e.g., "high-throughput backend services"] in production, most recently at [Current Company], where I [measurable win — e.g., "cut p95 latency on our checkout API from 480ms to 120ms by rewriting the pricing service in Go"].

Your posting emphasizes [specific requirement — e.g., "distributed systems and observability"], which is exactly what I''ve been doing. At [Current Company] I [specific example: system I designed, incident I led, migration I owned]. I''m comfortable across [Language 1], [Language 2], and [Framework], and I default to writing tests and instrumentation, not against them.

What draws me to [Company Name] is [specific technical or product reason — a public engineering post, a product decision, an open-source contribution]. I''d love to talk about how I can help your team [team goal].

Thank you for your time.

Sincerely,
[Your Name]',
'["Lead with a shipped, measurable outcome — latency, uptime, throughput, revenue.", "Name the specific stack from the job description; don''t list everything you know.", "Reference something specific from the company''s engineering blog or product.", "Mention testing, observability, or on-call — signals of a mature engineer."]'::jsonb,
'Software Engineer Cover Letter Example | Airesumi',
'A free software engineer cover letter template with measurable engineering wins and stack-specific language. Copy and customize.',
true);
