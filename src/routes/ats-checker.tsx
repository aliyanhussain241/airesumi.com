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
        "text": "Use keywords from the job description, avoid tables and graphics, use standard section headings like Experience and Education, and save your resume as a PDF or Word doc. Airesumi's ATS checker shows you exactly what to fix."
      }
    },
    {
      "@type": "Question",
      "name": "Is the Airesumi ATS checker free?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, the Airesumi ATS resume checker is completely free to use. Paste your resume and job description to get an instant ATS score and improvement suggestions."
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
          What Does an ATS Resume Checker Actually Do?
        </h2>
        <p className="text-[#4a5568] text-[16px] leading-relaxed mb-4">
          When you apply to a job online, your resume usually doesn't go straight to a recruiter. It goes through software first — an Applicant Tracking System (ATS) — that scans it for keywords, checks the formatting, and scores it against the job description.
        </p>
        <p className="text-[#4a5568] text-[16px] leading-relaxed mb-4">
          If your score is too low, the system filters you out. The recruiter never sees your name. It doesn't matter how qualified you are.
        </p>
        <p className="text-[#4a5568] text-[16px] leading-relaxed">
          An ATS checker runs your resume through that same logic before you submit. It tells you where you're falling short — missing keywords, bad formatting, sections that confuse the parser — so you can fix it before it costs you an opportunity. The Airesumi ATS checker is free. Paste your resume and the job description, and you'll get a score with specific suggestions, not just a number.
        </p>
      </div>

      {/* Common Reasons */}
      <div className="mb-16">
        <h2 className="text-3xl font-medium text-[#2d3748] mb-6">
          5 Reasons Resumes Fail ATS Scans
        </h2>
        <div className="space-y-4">
          {[
            { num: "1", title: "Using a template with columns or text boxes", desc: "Most ATS software reads top-to-bottom, left-to-right. Two-column layouts often get read out of order or skip sections entirely. Keep it single-column." },
            { num: "2", title: "Missing keywords from the job description", desc: "ATS systems match your resume to the job posting word-by-word. If the posting says 'project management' and your resume says 'managing projects,' some systems won't count it as a match." },
            { num: "3", title: "Using non-standard section headings", desc: "'Where I've Worked' instead of 'Work Experience.' 'Things I Know' instead of 'Skills.' Non-standard headings confuse parsers and your sections get skipped." },
            { num: "4", title: "Submitting the wrong file format", desc: "Some ATS systems handle PDFs badly; others handle Word badly. If the job posting doesn't specify, PDF is usually the safer choice." },
            { num: "5", title: "Putting contact info in the header or footer", desc: "Many ATS tools don't parse headers and footers correctly. Put your name, email, and phone number in the main body of the document." },
          ].map((item) => (
            <div key={item.num} className="flex gap-5 bg-[#fff5ef] rounded-xl p-6">
              <div className="w-10 h-10 rounded-full bg-[#FF6321] text-white font-bold flex items-center justify-center shrink-0 text-lg">
                {item.num}
              </div>
              <div>
                <h3 className="font-semibold text-[#1a202c] text-[17px] mb-1">{item.title}</h3>
                <p className="text-[#4a5568] text-[15px] leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
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
              desc: "Paste your resume and the job description into Airesumi's ATS checker. Get an instant score and a list of exactly what to improve before you submit.",
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
              a: "Use keywords from the job description, avoid tables and graphics, use standard section headings like Experience and Education, and save your resume as a PDF or Word doc. Airesumi's ATS checker shows you exactly what to fix.",
            },
            {
              q: "Is the Airesumi ATS checker free?",
              a: "Yes, completely free. Paste your resume and job description to get an instant ATS score and improvement suggestions — no sign-up required.",
            },
            {
              q: "Can a well-qualified candidate still fail an ATS scan?",
              a: "Yes — and it happens all the time. ATS doesn't evaluate your actual qualifications. It scores keyword coverage and formatting. A 10-year veteran who used a two-column template and didn't match the exact phrasing in the job posting can score below a less-experienced candidate who did.",
            },
            {
              q: "Should I use exact keywords from the job posting or paraphrase?",
              a: "Match exactly where honest. If the posting says 'Python' and you know Python, write 'Python' — not 'Python programming' or 'scripting languages.' Modern ATS handles some synonyms, but exact matches score highest. Never add a skill you don't actually have.",
            },
            {
              q: "How often should I re-check my resume with an ATS checker?",
              a: "Every time you apply to a different role. Keywords change between postings — even for the same job title at different companies. Tailoring and re-checking for each application takes 5 minutes and meaningfully increases your callback rate.",
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

      {/* Cross-tool CTA — link to Resume Tailor */}
      <div className="max-w-3xl mx-auto px-6 -mt-4">
        <a href="/resume-tailor"
          className="flex items-center justify-between gap-3 bg-gradient-to-r from-orange-50 to-orange-100/60 border border-orange-200 rounded-2xl px-5 py-4 hover:border-[#FF6321] hover:shadow-md transition-all group">
          <div>
            <p className="text-[15px] font-bold text-[#111827]">Want to match against a specific job?</p>
            <p className="text-[13px] text-[#6b7280]">Resume Tailor scores your resume against any job description and rewrites bullets to close the gap.</p>
          </div>
          <span className="text-[14px] font-semibold text-[#EA580C] whitespace-nowrap group-hover:translate-x-1 transition-transform">Try Resume Tailor →</span>
        </a>
      </div>

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
      { title: "Free ATS Resume Checker — Score Your Resume Instantly | Airesumi.com" },
      { name: "description", content: "Run your resume through a free ATS checker. Get an instant keyword match score, see what is missing, and fix it before you apply. Sign up required." },
      { name: "robots", content: "index, follow" },
      { name: "keywords", content: "ATS resume checker, ATS score, applicant tracking system, resume scanner, ATS optimization" },
      { property: "og:title", content: "Free ATS Resume Checker — Score Your Resume | Airesumi.com" },
      { property: "og:description", content: "Instantly check your resume's ATS score and get keyword fixes. Free tool by Airesumi." },
      { property: "og:url", content: "https://Airesumi.com/ats-checker" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Free ATS Resume Checker | Airesumi.com" },
    ],
    links: [{ rel: "canonical", href: "https://Airesumi.com/ats-checker" }],
  }),
  component: Page,
});
