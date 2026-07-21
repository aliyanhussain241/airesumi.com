import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Target, Sparkles, RefreshCw, AlertCircle, CheckCircle2, XCircle, Lightbulb, ArrowRight, Wand2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ToolContentSection } from "../app/components/ToolContentSection";
import { toolSchemaScripts } from "@/lib/tool-schemas";
import { BlogHighlights } from "@/app/components/BlogHighlights";
import type { ToolContent } from "../app/components/toolContent";

const TAILOR_CONTENT: ToolContent = {
  whatTitle: "What is a Resume Tailor?",
  whatParagraphs: [
    "A resume tailor compares your resume to a specific job description, scores the match, and rewrites your existing experience bullets so they naturally include the exact keywords, tools, and skills the employer is asking for.",
    "It's the fastest way to turn one generic resume into an ATS-ready application for every posting you send — without starting from scratch each time.",
  ],
  howToTitle: "How to Tailor a Resume to Any Job Description",
  howToSteps: [
    { title: "Paste the exact job description", desc: "Use the posting you're actually applying to. Every posting has slightly different priorities — the tailor picks up on them." },
    { title: "Read the match score", desc: "Aim for 70%+. Below 60% means your resume is unlikely to pass the ATS filter for this role. Above 80% is shortlist territory." },
    { title: "Rewrite bullets, don't invent skills", desc: "Only weave in keywords tied to work you've actually done. The suggested rewrites use your existing bullets as a base." },
    { title: "Re-tailor per posting", desc: "The same role at two different companies weights different skills. Rerun the tailor for each application — it takes 30 seconds." },
  ],
  faqs: [
    { q: "What is a resume job description matcher?", a: "A tool that reads your resume and a target job description, calculates how well they overlap, and shows you which keywords are missing plus AI-rewritten bullets that fix the gaps." },
    { q: "Is Resume Tailor free?", a: "Yes — free to use with no sign-up required for your first tailoring pass. Logged-in users get 3 free credits, and Airesumi Pro unlocks unlimited tailoring." },
    { q: "How is this different from the ATS Checker?", a: "The ATS Checker scores your resume against generic ATS rules (formatting, structure, keyword density). Resume Tailor scores your resume against ONE specific job description and rewrites your bullets to close the gap." },
    { q: "Will the rewritten bullets be honest?", a: "Yes. The AI is instructed to only weave keywords into bullets tied to work you've actually done — it never fabricates skills or experience." },
  ],
  features: [
    { title: "Instant Match Score", desc: "0–100% score showing how well your resume covers the job description's keywords and skills." },
    { title: "Missing Keyword List", desc: "Every important skill, tool, or phrase from the JD your resume is missing — ranked by weight." },
    { title: "AI-Rewritten Bullets", desc: "For each missing keyword, an experience bullet rewritten to include it naturally with a strong verb and metric." },
    { title: "One-Click to Builder", desc: "Jump straight into the Airesumi builder and apply the changes — or use the standalone tailor for quick fixes." },
    { title: "No Sign-Up Required", desc: "First tailoring pass is completely free — no account, no credit card." },
    { title: "Re-Run Per Job", desc: "Every posting is different. Re-tailor as many times as you need before hitting Apply." },
  ],
};

function ScoreRing({ score }: { score: number }) {
  const color = score >= 70 ? "#22c55e" : score >= 50 ? "#f59e0b" : "#ef4444";
  const label = score >= 70 ? "Strong Match" : score >= 50 ? "Decent Match" : "Needs Tailoring";
  const circumference = 2 * Math.PI * 52;
  const offset = circumference - (score / 100) * circumference;
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-36 h-36">
        <svg className="w-36 h-36 -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="52" fill="none" stroke="#f3f4f6" strokeWidth="12" />
          <motion.circle
            cx="60" cy="60" r="52" fill="none" stroke={color} strokeWidth="12" strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.1, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[34px] font-bold text-[#111827] leading-none">{score}%</span>
          <span className="text-[11px] text-[#6b7280] font-medium mt-1">Match</span>
        </div>
      </div>
      <span className="text-[13px] font-semibold mt-3" style={{ color }}>{label}</span>
    </div>
  );
}

type TailorResult = {
  score: number;
  matched_keywords: string[];
  missing_keywords: string[];
  suggested_bullets: { keyword: string; original: string; rewrite: string }[];
  summary_tip?: string;
};

function ResumeTailor() {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState<TailorResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleTailor() {
    if (!resumeText.trim() || !jobDescription.trim()) {
      setError("Please paste both your resume and the job description.");
      return;
    }
    setError(null);
    setLoading(true);
    setResult(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (session?.access_token) headers.Authorization = `Bearer ${session.access_token}`;
      const res = await fetch("/api/tailor-resume", {
        method: "POST",
        headers,
        body: JSON.stringify({ resumeText, jobDescription }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f9fafb] pt-[68px]">
      <div className="max-w-4xl mx-auto px-6 py-10">

        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-orange-50 text-[#EA580C] text-[13px] font-semibold px-4 py-2 rounded-full mb-4">
            <Wand2 size={15} /> Resume Tailor
          </div>
          <h1 className="text-[32px] md:text-[38px] font-bold text-[#111827] tracking-tight mb-3">
            Tailor Your Resume to <span className="text-[#FF6321]">Any Job</span> in Seconds
          </h1>
          <p className="text-[15px] text-[#6b7280] max-w-2xl mx-auto">
            Paste your resume and a job description. Get an instant match score, missing keywords, and AI-tailored bullet rewrites — free, no sign-up required.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-white border border-[#e5e7eb] rounded-2xl p-5">
            <label className="text-[13px] font-semibold text-[#374151] mb-2 block">Your Resume Text</label>
            <textarea value={resumeText} onChange={e => setResumeText(e.target.value)} rows={12}
              placeholder="Paste your full resume text here..."
              className="w-full bg-[#f9fafb] border border-[#e5e7eb] rounded-xl px-4 py-3 text-[13px] focus:outline-none focus:border-[#FF6321] resize-none" />
          </div>
          <div className="bg-white border border-[#e5e7eb] rounded-2xl p-5">
            <label className="text-[13px] font-semibold text-[#374151] mb-2 block">Job Description</label>
            <textarea value={jobDescription} onChange={e => setJobDescription(e.target.value)} rows={12}
              placeholder="Paste the full job description you're targeting..."
              className="w-full bg-[#f9fafb] border border-[#e5e7eb] rounded-xl px-4 py-3 text-[13px] focus:outline-none focus:border-[#FF6321] resize-none" />
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-[13px] mb-4">
            <AlertCircle size={15} /> {error}
          </div>
        )}

        <button onClick={handleTailor} disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-[#FF6321] text-white font-bold text-[15px] py-4 rounded-2xl hover:bg-[#ea580c] hover:shadow-lg hover:shadow-orange-500/25 hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed mb-6">
          {loading
            ? <><RefreshCw size={18} className="animate-spin" /> Tailoring your resume...</>
            : <><Sparkles size={18} /> Match My Resume</>}
        </button>

        <AnimatePresence>
          {result && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              {/* Score */}
              <div className="bg-white border border-[#e5e7eb] rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-center md:text-left">
                  <h2 className="text-[22px] font-bold text-[#111827] mb-1">Resume ↔ Job Match Score</h2>
                  <p className="text-[14px] text-[#6b7280] max-w-md">
                    Based on {(result.matched_keywords?.length || 0) + (result.missing_keywords?.length || 0)} keywords analyzed from the job description.
                  </p>
                  {result.summary_tip && (
                    <p className="text-[13px] text-[#374151] mt-3 bg-orange-50 border border-orange-100 rounded-lg px-3 py-2 inline-block">
                      <span className="font-semibold text-[#EA580C]">Tip:</span> {result.summary_tip}
                    </p>
                  )}
                </div>
                <ScoreRing score={result.score || 0} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Matched */}
                <div className="bg-white border border-[#e5e7eb] rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 size={16} className="text-green-500" />
                    <h3 className="text-[14px] font-bold text-[#111827]">Matched Keywords ({result.matched_keywords?.length || 0})</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {result.matched_keywords?.map((k) => (
                      <span key={k} className="bg-green-50 text-green-700 text-[12px] font-medium px-3 py-1 rounded-full border border-green-100">{k}</span>
                    ))}
                  </div>
                </div>

                {/* Missing */}
                <div className="bg-white border border-[#e5e7eb] rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <XCircle size={16} className="text-red-400" />
                    <h3 className="text-[14px] font-bold text-[#111827]">Missing Keywords ({result.missing_keywords?.length || 0})</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {result.missing_keywords?.map((k) => (
                      <span key={k} className="bg-red-50 text-red-600 text-[12px] font-medium px-3 py-1 rounded-full border border-red-100">{k}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Suggested Bullet Rewrites */}
              {result.suggested_bullets?.length > 0 && (
                <div className="bg-white border border-[#e5e7eb] rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Lightbulb size={16} className="text-[#EA580C]" />
                    <h3 className="text-[14px] font-bold text-[#111827]">Suggested Bullet Rewrites</h3>
                  </div>
                  <div className="space-y-4">
                    {result.suggested_bullets.map((b, i) => (
                      <div key={i} className="border border-[#e5e7eb] rounded-xl p-4">
                        <div className="inline-flex items-center gap-1 bg-orange-50 text-[#EA580C] text-[11px] font-bold px-2 py-1 rounded-md mb-3">
                          + {b.keyword}
                        </div>
                        <p className="text-[12px] text-[#6b7280] mb-1"><span className="font-semibold text-[#9ca3af]">Original:</span> {b.original}</p>
                        <p className="text-[13px] text-[#111827] font-medium"><span className="font-semibold text-[#22c55e]">Rewrite:</span> {b.rewrite}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CTAs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Link to="/resume"
                  className="flex items-center justify-center gap-2 bg-[#FF6321] text-white font-bold text-[14px] py-3 rounded-xl hover:bg-[#ea580c] transition-all">
                  Tailor This Resume in Builder <ArrowRight size={16} />
                </Link>
                <button onClick={() => { setResult(null); setResumeText(""); setJobDescription(""); }}
                  className="py-3 border border-[#e5e7eb] rounded-xl text-[14px] font-medium text-[#374151] hover:border-[#FF6321] hover:text-[#FF6321] transition-all flex items-center justify-center gap-2">
                  <RefreshCw size={14} /> Tailor Another Job
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

const TAILOR_FAQ_SCHEMA = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: TAILOR_CONTENT.faqs.map(f => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
});

export const Route = createFileRoute("/resume-tailor")({
  head: () => ({
    meta: [
      { title: "Resume Tailor — Match Your Resume to Any Job Description | Airesumi" },
      { name: "description", content: "Paste your resume and a job description to get an instant match score, missing keywords, and AI-tailored bullet suggestions. Free, no sign-up required." },
      { name: "robots", content: "index, follow" },
      { name: "keywords", content: "resume tailor, job description matcher, resume matcher, tailor resume to job, resume keyword matcher" },
      { property: "og:title", content: "Resume Tailor — Match Your Resume to Any Job | Airesumi" },
      { property: "og:description", content: "Instant match score + AI-tailored bullet rewrites for any job description. Free, no sign-up." },
      { property: "og:url", content: "https://airesumi.com/resume-tailor" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Resume Tailor — Match Your Resume to Any Job | Airesumi" },
      { name: "twitter:description", content: "Instant match score + AI-tailored bullet rewrites for any job description. Free, no sign-up." },
    ],
    links: [{ rel: "canonical", href: "https://airesumi.com/resume-tailor" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "Resume Tailor",
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        }),
      },
      { type: "application/ld+json", children: TAILOR_FAQ_SCHEMA },
      ...toolSchemaScripts(TAILOR_CONTENT),
    ],
  }),
  component: () => (
    <>
      <ResumeTailor />
      <ToolContentSection {...TAILOR_CONTENT} />
      <BlogHighlights posts={[
        { title: "How to Tailor Your Resume for Every Job", href: "/blog/how-to-tailor-resume-for-every-job" },
        { title: "ATS Resume Score: What Number Do You Actually Need?", href: "/blog/ats-resume-checker-what-score-do-you-need" },
        { title: "How to Build a Resume with AI in 2026", href: "/blog/build-resume-with-ai" },
      ]} />
    </>
  ),
});
