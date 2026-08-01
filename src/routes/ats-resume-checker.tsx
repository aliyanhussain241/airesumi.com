import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "motion/react";
import {
  ShieldCheck, ScanLine, ArrowRight, Check, FileType2, Type,
  Columns3, Heading2, KeyRound, FileSignature, ImageOff, MapPin, Plus,
} from "lucide-react";
import { ATSChecker } from "../app/ATSChecker";
import { useStepNavigate } from "../app/lib/navigation";
import { BlogHighlights } from "@/app/components/BlogHighlights";

const CANONICAL = "https://airesumi.com/ats-resume-checker";

const FAQS = [
  {
    q: "Does an ATS reject resumes automatically?",
    a: "Not on its own. An ATS is a database and workflow tool — it stores applications, parses them into fields, and lets recruiters search and filter. Rejections come from a recruiter's filters or review, not from a hidden compliance gate. The real risk is that poor parsing leaves your skills or job titles out of the database, so you never appear in the searches recruiters run.",
  },
  {
    q: "Is PDF or Word better for ATS?",
    a: "Both work with modern systems. A text-based PDF preserves your layout everywhere, which makes it the safer default when the posting does not specify a format. Choose .docx when the application form explicitly asks for Word, or when you are sending your resume to a recruiter who may want to edit or annotate it.",
  },
  {
    q: "Do ATS systems read tables and columns?",
    a: "Many can, but results vary. Tables and multi-column layouts can be read out of order, which mixes up dates, employers, and bullets. Keep dates, job titles, employers, and skills in a single-column flow, and reserve any visual grid for decoration rather than for information you need extracted.",
  },
  {
    q: "How do I know which ATS a company uses?",
    a: "Look at the URL of the application page. Job forms hosted on domains such as myworkdayjobs.com, greenhouse.io, lever.co, icims.com, or taleo.net tell you the platform directly. You do not need to optimise per platform, though — clean parsing works across all of them.",
  },
  {
    q: "Is there an official ATS compliance certification?",
    a: "No. There is no standards body, no certificate, and no score that employers see. Any tool claiming an official ATS pass mark, including ours, is giving you an estimate of how well your resume parses and matches a job description — useful as a diagnostic, not as an official verdict.",
  },
  {
    q: "How can I check if my resume is ATS-friendly for free?",
    a: "Upload or paste your resume into the scanner on this page. It extracts the text the way a parser would, shows which sections it detected, and flags formatting patterns that commonly break extraction. It is free, and you can run it as many times as you like while you edit.",
  },
];

const CHECKLIST = [
  { icon: FileType2, t: "File format: .docx vs PDF", d: "A text-based PDF keeps your layout intact and is the safer default. Use .docx when the application form asks for Word or a recruiter needs to edit the file." },
  { icon: MapPin, t: "Keep contact details out of headers and footers", d: "Some parsers skip header and footer regions entirely. Put your name, email, phone, and location in the first lines of the document body." },
  { icon: Columns3, t: "No tables, columns, text boxes, or graphics for key content", d: "These can be read out of order or dropped. Keep dates, titles, employers, and skills in a single-column text flow." },
  { icon: Heading2, t: "Standard section headings", d: "Use Experience, Skills, Education, and Summary. Creative headings make it harder for a parser to map your content to the right fields." },
  { icon: Type, t: "Standard, readable fonts", d: "Stick to widely available fonts such as Arial, Calibri, Helvetica, or Georgia. Unusual or icon fonts can extract as garbled characters." },
  { icon: KeyRound, t: "Match keywords to the job description", d: "Recruiters search the ATS database by skill and title. Mirror the exact wording of the posting for skills you genuinely have." },
  { icon: FileSignature, t: "Sensible file naming", d: "Name the file something like Firstname-Lastname-Resume.pdf. It is not parsed, but it makes your application easy to find and looks deliberate." },
  { icon: ImageOff, t: "Never submit images of text or scans", d: "A scanned or exported-as-image resume has no extractable text at all. Always export from your editor so the text layer survives." },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl border border-black/[0.07] dark:border-white/10 bg-white/70 dark:bg-white/[0.04] backdrop-blur-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-4 text-left px-5 py-4"
      >
        <span className="text-[15px] sm:text-[16px] font-semibold text-[#111827] dark:text-zinc-100">{q}</span>
        <Plus
          size={18}
          className={`shrink-0 text-[#FF6321] transition-transform duration-200 ${open ? "rotate-45" : ""}`}
        />
      </button>
      {open && (
        <p className="px-5 pb-5 text-[14px] leading-relaxed text-[#4a5568] dark:text-zinc-400">{a}</p>
      )}
    </div>
  );
}

function Page() {
  const onNavigate = useStepNavigate();

  return (
    <div className="w-full bg-[#F8FAFC] dark:bg-[#0b0d12]">
      {/* Hero */}
      <section className="relative overflow-hidden pt-[104px] pb-14 sm:pb-20">
        <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[680px] h-[680px] rounded-full bg-gradient-to-br from-orange-200/50 via-orange-100/30 to-transparent blur-3xl dark:from-orange-500/10 dark:via-orange-500/5" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/60 dark:border-white/10 bg-white/70 dark:bg-white/[0.06] backdrop-blur-xl px-4 py-1.5 text-[12px] font-semibold uppercase tracking-widest text-[#c2410c] dark:text-orange-300 mb-6"
          >
            <ShieldCheck size={13} /> Free ATS scan · no sign-up
          </motion.div>
          <h1 className="text-[30px] sm:text-[42px] lg:text-[50px] font-extrabold tracking-tight leading-[1.12] text-[#111827] dark:text-zinc-50 mb-5">
            Is Your Resume ATS-Friendly?{" "}
            <span className="text-[#FF6321]">Check for Free in 30 Seconds</span>
          </h1>
          <p className="text-[16px] sm:text-[18px] leading-relaxed text-[#4a5568] dark:text-zinc-400 max-w-2xl mx-auto mb-8">
            Applicant tracking software reads and files your resume before a recruiter ever opens it — and anything it
            fails to extract is effectively invisible. Paste or upload your resume below and see exactly what a parser
            picks up.
          </p>
          <a
            href="#scan"
            className="inline-flex items-center gap-2 rounded-2xl bg-[#FF6321] px-7 py-4 text-[15px] font-bold text-white shadow-[0_16px_32px_-14px_rgba(255,99,33,0.7)] hover:bg-[#EA580C] hover:-translate-y-0.5 transition-all"
          >
            <ScanLine size={18} /> Scan My Resume Free
          </a>
        </div>
      </section>

      {/* Myth-busting */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-16 sm:pb-20">
        <h2 className="text-[24px] sm:text-[30px] font-semibold tracking-tight text-[#2d3748] dark:text-zinc-100 mb-6">
          First, the truth about ATS “compliance”
        </h2>
        <div className="rounded-3xl border border-black/[0.06] dark:border-white/10 bg-white/70 dark:bg-white/[0.04] backdrop-blur-xl p-6 sm:p-8 space-y-4">
          <p className="text-[15px] sm:text-[16px] leading-relaxed text-[#4a5568] dark:text-zinc-400">
            There is no official ATS compliance certification. No standards body issues one, and no employer sees a
            compliance badge on your application. Tools that imply otherwise — including scoring tools like ours — are
            producing an estimate, not a verdict.
          </p>
          <p className="text-[15px] sm:text-[16px] leading-relaxed text-[#4a5568] dark:text-zinc-400">
            An ATS also does not sit there rejecting qualified candidates on its own. It is primarily a database:
            it stores applications, parses them into structured fields, and gives recruiters search and filter tools.
            Decisions are made by people using those filters. And most modern systems keep your original file, so a
            recruiter can open and read it even when parsing was imperfect.
          </p>
          <div className="rounded-2xl bg-[#FFF7ED] dark:bg-orange-500/10 border border-[#FED7AA] dark:border-orange-500/20 p-5">
            <h3 className="text-[16px] font-bold text-[#111827] dark:text-zinc-100 mb-2">So what actually matters?</h3>
            <p className="text-[15px] leading-relaxed text-[#4a5568] dark:text-zinc-300">
              Whether the system can correctly extract your information — contact details, employers, dates, job titles,
              skills, and education — into its fields. When extraction is clean, you show up in the searches recruiters
              run for candidates like you. When it is not, your resume sits in the database without the details that
              would surface it. Everything in the checklist below exists to protect that one outcome.
            </p>
          </div>
        </div>
      </section>

      {/* Embedded scanner */}
      <section id="scan" className="scroll-mt-24 pb-4">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center mb-8">
          <h2 className="text-[24px] sm:text-[30px] font-semibold tracking-tight text-[#2d3748] dark:text-zinc-100 mb-3">
            Scan your resume free
          </h2>
          <p className="text-[15px] sm:text-[16px] leading-relaxed text-[#4a5568] dark:text-zinc-400">
            Upload a PDF, DOC, DOCX, or TXT file — or paste the text. Add a job description for a keyword match.
            You will see the extracted text, the sections detected, and the formatting issues worth fixing.
          </p>
        </div>
        <ATSChecker onNavigate={onNavigate} embedded />
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <a
            href="/resume"
            className="group flex items-center justify-between gap-3 rounded-2xl border border-orange-200 dark:border-orange-500/25 bg-gradient-to-r from-orange-50 to-orange-100/60 dark:from-orange-500/10 dark:to-orange-500/5 px-5 py-4 hover:border-[#FF6321] hover:shadow-md transition-all"
          >
            <div>
              <p className="text-[15px] font-bold text-[#111827] dark:text-zinc-100">
                Fix these issues automatically
              </p>
              <p className="text-[13px] text-[#6b7280] dark:text-zinc-400">
                Build an ATS-optimized resume with Airesumi — single-column, parser-safe, keyword aware.
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-[14px] font-semibold text-[#EA580C] dark:text-orange-300 whitespace-nowrap group-hover:translate-x-1 transition-transform">
              Build mine <ArrowRight size={15} />
            </span>
          </a>
        </div>
      </section>

      {/* Checklist */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <h2 className="text-[24px] sm:text-[30px] font-semibold tracking-tight text-[#2d3748] dark:text-zinc-100 mb-3">
          The 8-point ATS-friendly checklist
        </h2>
        <p className="text-[15px] text-[#4a5568] dark:text-zinc-400 mb-8 max-w-2xl">
          These are the technical factors that genuinely affect whether a parser extracts your resume correctly.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {CHECKLIST.map((item) => (
            <div
              key={item.t}
              className="rounded-2xl border border-black/[0.06] dark:border-white/10 bg-white/70 dark:bg-white/[0.04] backdrop-blur-xl p-5 flex gap-4"
            >
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#FFF7ED] dark:bg-orange-500/15 text-[#EA580C] dark:text-orange-300">
                <item.icon size={18} />
              </div>
              <div className="min-w-0">
                <h3 className="flex items-start gap-1.5 text-[15px] font-bold text-[#111827] dark:text-zinc-100 mb-1">
                  <Check size={15} className="mt-[3px] shrink-0 text-green-500" />
                  <span>{item.t}</span>
                </h3>
                <p className="text-[14px] leading-relaxed text-[#4a5568] dark:text-zinc-400">{item.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-16 sm:pb-20">
        <h2 className="text-[24px] sm:text-[30px] font-semibold tracking-tight text-[#2d3748] dark:text-zinc-100 mb-8">
          Frequently asked questions
        </h2>
        <div className="space-y-3">
          {FAQS.map((f) => (
            <FaqItem key={f.q} q={f.q} a={f.a} />
          ))}
        </div>
      </section>

      {/* Closing CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-20">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#111827] to-[#1f2937] px-6 sm:px-10 py-10 sm:py-12 text-center">
          <div className="pointer-events-none absolute -top-24 right-0 h-64 w-64 rounded-full bg-[#FF6321]/25 blur-3xl" />
          <div className="relative">
            <h2 className="text-[22px] sm:text-[28px] font-extrabold tracking-tight text-white mb-3">
              Skip the guesswork — build an ATS-optimized resume from scratch
            </h2>
            <p className="text-[15px] leading-relaxed text-zinc-300 max-w-xl mx-auto mb-7">
              Airesumi writes into a single-column, parser-safe structure with standard headings, so everything on the
              checklist above is handled for you.
            </p>
            <a
              href="/resume"
              className="inline-flex items-center gap-2 rounded-2xl bg-[#FF6321] px-7 py-4 text-[15px] font-bold text-white hover:bg-[#EA580C] hover:-translate-y-0.5 transition-all"
            >
              Build my resume <ArrowRight size={17} />
            </a>
          </div>
        </div>
      </section>

      <BlogHighlights
        posts={[
          { title: "ATS Resume Score: What Number Do You Actually Need?", href: "/blog/ats-resume-checker-what-score-do-you-need" },
          { title: "How to Tailor Your Resume for Every Job with AI", href: "/blog/how-to-tailor-resume-for-every-job" },
          { title: "How to Build a Resume with AI in 2026", href: "/blog/build-resume-with-ai" },
        ]}
      />
    </div>
  );
}

export const Route = createFileRoute("/ats-resume-checker")({
  head: () => ({
    meta: [
      { title: "ATS Resume Checker – Free Scan in 30 Seconds | Airesumi" },
      {
        name: "description",
        content:
          "Check if your resume is ATS-friendly for free. Upload or paste it, see what a parser actually extracts, and fix the formatting issues that hide your experience.",
      },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: "ATS Resume Checker – Free Scan in 30 Seconds | Airesumi" },
      {
        property: "og:description",
        content:
          "Free ATS resume checker: see the text a parser extracts, the sections it detects, and an 8-point checklist for ATS-friendly formatting.",
      },
      { property: "og:url", content: CANONICAL },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "ATS Resume Checker – Free Scan | Airesumi" },
    ],
    links: [{ rel: "canonical", href: CANONICAL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
  }),
  component: Page,
});
