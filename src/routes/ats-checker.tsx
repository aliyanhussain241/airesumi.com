import { createFileRoute } from "@tanstack/react-router";
import { BlogHighlights } from "@/app/components/BlogHighlights";
import { motion } from "motion/react";
import { ATSChecker } from "../app/ATSChecker";
import { useStepNavigate } from "../app/lib/navigation";

const ATS_FAQ_SCHEMA = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is an ATS resume checker?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "An ATS resume checker analyzes your resume against Applicant Tracking System criteria used by employers. It scores your resume on keyword match, formatting, and structure to tell you if a recruiter will actually see it."
      }
    },
    {
      "@type": "Question",
      "name": "Why is ATS optimization important?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Over 99% of Fortune 500 companies use ATS software to filter resumes before a human ever reads them. If your resume is not ATS-optimized, it gets rejected automatically — no matter how qualified you are."
      }
    },
    {
      "@type": "Question",
      "name": "What ATS score should I aim for?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Aim for a score of 80% or higher. A score above 80% means your resume is well-matched to the job description and likely to pass ATS filters and reach a human recruiter."
      }
    },
    {
      "@type": "Question",
      "name": "How do I improve my ATS score?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Use keywords from the job description, avoid tables and graphics, use standard section headings like Experience and Education, and save your resume as a PDF or Word doc. airesumi's ATS checker shows you exactly what to fix."
      }
    },
    {
      "@type": "Question",
      "name": "Is the airesumi ATS checker free?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, the airesumi ATS resume checker is completely free to use. Paste your resume and job description to get an instant ATS score and improvement suggestions."
      }
    }
  ]
});

function ATSContentSection() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-20">

      {/* What is ATS */}
      <div className="mb-16">
        <h2 className="text-3xl font-medium text-[#2d3748] mb-6">
          What is an ATS Resume Checker?
        </h2>
        <p className="text-[#4a5568] text-[16px] leading-relaxed mb-4">
          An ATS (Applicant Tracking System) resume checker scans your resume the same way employer software does — checking for the right keywords, formatting, and structure before a human ever reads it.
        </p>
        <p className="text-[#4a5568] text-[16px] leading-relaxed">
          Over 99% of Fortune 500 companies use ATS to filter applications. Without optimization, even the most qualified candidates get automatically rejected. airesumi's free ATS checker tells you exactly where your resume falls short and how to fix it instantly.
        </p>
      </div>

      {/* How it works */}
      <div className="mb-16">
        <h2 className="text-3xl font-medium text-[#2d3748] mb-6">
          How to Pass an ATS in 3 Steps
        </h2>
        <div className="space-y-4">
          {[
            {
              step: "1",
              title: "Match keywords from the job description",
              desc: "ATS systems scan for exact keywords from the job posting. If your resume is missing them, it gets filtered out. Use the same language the employer uses.",
            },
            {
              step: "2",
              title: "Use clean, simple formatting",
              desc: "Avoid tables, columns, images, and graphics. ATS software cannot read these. Use standard section headings like Experience, Education, and Skills.",
            },
            {
              step: "3",
              title: "Check your score before applying",
              desc: "Paste your resume and the job description into airesumi's ATS checker. Get an instant score and a list of exactly what to improve before you submit.",
            },
          ].map((item) => (
            <div key={item.step} className="flex gap-5 bg-[#f8fafc] rounded-xl p-6">
              <div className="w-10 h-10 rounded-full bg-[#FF6321] text-white font-bold flex items-center justify-center shrink-0 text-lg">
                {item.step}
              </div>
              <div>
                <h3 className="font-semibold text-[#1a202c] text-[17px] mb-1">{item.title}</h3>
                <p className="text-[#4a5568] text-[15px] leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div>
        <h2 className="text-3xl font-medium text-[#2d3748] mb-8">
          Frequently Asked Questions
        </h2>
        <div className="space-y-3">
          {[
            {
              q: "What is an ATS resume checker?",
              a: "An ATS resume checker analyzes your resume against Applicant Tracking System criteria. It scores your resume on keyword match, formatting, and structure to tell you if a recruiter will actually see it.",
            },
            {
              q: "Why is ATS optimization important?",
              a: "Over 99% of Fortune 500 companies use ATS software to filter resumes before a human ever reads them. If your resume is not ATS-optimized, it gets rejected automatically — no matter how qualified you are.",
            },
            {
              q: "What ATS score should I aim for?",
              a: "Aim for a score of 80% or higher. A score above 80% means your resume is well-matched to the job description and likely to pass ATS filters and reach a human recruiter.",
            },
            {
              q: "How do I improve my ATS score?",
              a: "Use keywords from the job description, avoid tables and graphics, use standard section headings like Experience and Education, and save your resume as a PDF or Word doc. airesumi's ATS checker shows you exactly what to fix.",
            },
            {
              q: "Is the airesumi ATS checker free?",
              a: "Yes, completely free. Paste your resume and job description to get an instant ATS score and improvement suggestions — no sign-up required.",
            },
          ].map((item, i) => (
            <details
              key={i}
              className="border border-[#e2e8f0] rounded-xl p-5 cursor-pointer group bg-white"
            >
              <summary className="font-semibold text-[#1a202c] text-[17px] list-none flex justify-between items-center gap-4">
                <span>{item.q}</span>
                <span className="text-[#FF6321] text-2xl shrink-0 group-open:rotate-45 transition-transform duration-200">+</span>
              </summary>
              <p className="mt-3 text-[#4a5568] leading-relaxed text-[15px]">{item.a}</p>
            </details>
          ))}
        </div>
      </div>

    </div>
  );
}

function Page() {
  const onNavigate = useStepNavigate();
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full bg-[#F8FAFC]">
      <ATSChecker onNavigate={onNavigate} />
      <ATSContentSection />

      <BlogHighlights posts={[
                { title: "ATS Resume Score: What Number Do You Actually Need?", href: "/blog/ats-resume-checker-what-score-do-you-need" },
                { title: "How to Tailor Your Resume for Every Job with AI", href: "/blog/how-to-tailor-resume-for-every-job" },
                { title: "How to Build a Resume with AI in 2026", href: "/blog/build-resume-with-ai" },
              ]} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: ATS_FAQ_SCHEMA }}
      />
    </motion.div>
  );
}

export const Route = createFileRoute("/ats-checker")({
  head: () => ({
    meta: [
      { title: "Free ATS Resume Checker — Score Your Resume Instantly | airesumi.com" },
      { name: "description", content: "Check how your resume scores against Applicant Tracking Systems. Get an instant ATS score, keyword analysis, and fixes. Free — no sign-up required." },
      { name: "robots", content: "index, follow" },
      { name: "keywords", content: "ATS resume checker, ATS score, applicant tracking system, resume scanner, ATS optimization" },
      { property: "og:title", content: "Free ATS Resume Checker — Score Your Resume | airesumi.com" },
      { property: "og:description", content: "Instantly check your resume's ATS score and get keyword fixes. Free tool by airesumi." },
      { property: "og:url", content: "https://airesumi.com/ats-checker" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Free ATS Resume Checker | airesumi.com" },
    ],
    links: [{ rel: "canonical", href: "https://airesumi.com/ats-checker" }],
  }),
  component: Page,
});
