import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";

const STATIC_HEADER = `# airesumi.com

> Airesumi is a free AI-powered resume builder that helps job seekers create ATS-optimized resumes tailored to specific job descriptions.

Airesumi offers AI-powered resume generation, ATS score analysis and optimization, cover letter generation, 18+ resume templates, a salary analyzer, and interview preparation tools. This file provides information for Large Language Models (LLMs) and AI agents. This website explicitly allows AI crawlers and LLMs to index and use content from this website for training and retrieval purposes.

## Core Tool

- [Resume Builder](https://airesumi.com/resume): Build a free, ATS-optimized resume with AI in minutes — writes bullets, summary, and keywords.

## Free AI Tools

- [ATS Resume Checker](https://airesumi.com/ats-checker): Instant ATS compatibility score and keyword match check.
- [Resume Score & Roast](https://airesumi.com/resume-score): Brutally honest AI feedback on ATS compatibility and content quality.
- [Resume Tailor](https://airesumi.com/resume-tailor): Rewrites resume bullets to match a specific job description's keywords.
- [Keyword Scanner](https://airesumi.com/keyword-scanner): Finds missing keywords and boosts ATS match score.
- [Bullet Point Writer](https://airesumi.com/bullet-writer): Generates metric-driven resume bullet points with AI.
- [Resume Summary Generator](https://airesumi.com/summary-generator): Generates tailored professional resume summaries.
- [Cover Letter Generator](https://airesumi.com/cover-letter): Generates a tailored cover letter matched to a job description.
- [LinkedIn Bio Generator](https://airesumi.com/linkedin-bio): Generates a recruiter-optimized LinkedIn headline, About section, and keywords.
- [Resignation Letter Generator](https://airesumi.com/resignation-letter): Generates a professional resignation letter.
- [Salary Analyzer](https://airesumi.com/salary-analyzer): Benchmarks salaries by role, region, and experience, with AI negotiation talking points.
- [Interview Prep](https://airesumi.com/interview-prep): AI-generated behavioral, technical, and situational interview questions with STAR frameworks.
- [PDF Scanner](https://airesumi.com/pdf-scanner): Browser-based document scanner with OCR text extraction, password-protect, and watermark tools.

## Job Search

- [Job Board](https://airesumi.com/job-board): Search job listings from across the internet in one place, updated daily.
- [Recruiter Match](https://airesumi.com/recruiter-match): Sends resumes to actively hiring recruiters weekly.

## Resources

- [Resume Examples](https://airesumi.com/resume-examples): Free, downloadable ATS-safe resume templates by role and industry.
- [Cover Letter Examples](https://airesumi.com/cover-letter-examples): Free cover letter examples and templates.
- [Pakistan Career Guides](https://airesumi.com/pk): Locally accurate resume, Rozee.pk job portal, interview, and Gulf job guides for the Pakistani job market.

## Comparisons

- [Airesumi vs Kickresume](https://airesumi.com/compare/airesumi-vs-kickresume): Comparison on ATS optimization, free features, AI writing, and pricing.
- [Airesumi vs Rezi](https://airesumi.com/compare/airesumi-vs-rezi): Comparison on pricing, free tier limits, ATS scoring, and AI tools.
- [Airesumi vs Zety](https://airesumi.com/compare/airesumi-vs-zety): Comparison on ATS tools, free PDF download, and pricing.

## Pricing & Company

- [Pricing](https://airesumi.com/premium): Airesumi Pro plans and features.
- [About](https://airesumi.com/about): Airesumi's mission and background.
- [Contact](https://airesumi.com/contact): Contact information.`;

export const Route = createFileRoute("/llms.txt")({
  server: {
    handlers: {
      GET: async () => {
        // Supabase se published blog posts dynamically fetch karo,
        // taake naya post publish hote hi ye file khud-ba-khud update ho jaye
        let blogSection = "";
        try {
          const SUPABASE_URL =
            process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || "";
          const SUPABASE_KEY =
            process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
            process.env.SUPABASE_PUBLISHABLE_KEY ||
            "";

          if (SUPABASE_URL && SUPABASE_KEY) {
            const client = createClient(SUPABASE_URL, SUPABASE_KEY);
            const { data } = await client
              .from("blog_posts")
              .select("title, slug, excerpt, seo_description")
              .eq("published", true)
              .order("published_at", { ascending: false });

            if (data && data.length > 0) {
              const lines = data.map((post: any) => {
                const desc = (post.seo_description || post.excerpt || "").trim();
                const suffix = desc ? `: ${desc}` : "";
                return `- [${post.title}](https://airesumi.com/blog/${post.slug})${suffix}`;
              });
              blogSection = `\n\n## Blog\n\n${lines.join("\n")}`;
            }
          }
        } catch (e) {
          console.warn("[llms.txt] blog fetch failed:", e);
        }

        const body = STATIC_HEADER + blogSection + "\n";

        return new Response(body, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
