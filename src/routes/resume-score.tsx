import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Flame, Sparkles, AlertCircle, CheckCircle2, XCircle, Wrench, ArrowRight, Loader2, FileSearch, Brain, Target, Zap } from "lucide-react";

const LOADING_STEPS = [
  { icon: FileSearch, label: "Scanning your resume...", detail: "Reading every line, word, and bullet point" },
  { icon: Target, label: "Checking ATS compatibility...", detail: "Testing how applicant tracking systems parse it" },
  { icon: Brain, label: "Analyzing content quality...", detail: "Measuring impact language and achievements" },
  { icon: Zap, label: "Matching keywords...", detail: "Cross-referencing with job market signals" },
  { icon: Flame, label: "Preparing the roast...", detail: "Getting brutally honest — brace yourself" },
];


type Result = {
  score: number;
  grade: string;
  ats: number;
  content: number;
  impact: number;
  keywords: number;
  strengths: string[];
  weaknesses: string[];
  quickFixes: string[];
  roast: string;
};

const FAQS = [
  {
    q: "How accurate is the AI resume score?",
    a: "The score reflects what ATS software and recruiters typically look for — keyword density, formatting, measurable achievements, and section structure.",
  },
  {
    q: "What does “roast” mean?",
    a: "The AI gives blunt, honest feedback like a senior recruiter would. If your summary is weak, it'll say so.",
  },
  {
    q: "Is my resume data safe?",
    a: "Your resume text is sent to the AI for analysis only and not stored.",
  },
  {
    q: "Will it work for any industry?",
    a: "Yes — tech, finance, healthcare, marketing — the scorer evaluates universal resume quality signals.",
  },
  {
    q: "How is this different from resume templates?",
    a: "Templates fix how your resume looks. The scorer fixes what it says.",
  },
];

function scoreColor(n: number) {
  if (n >= 70) return "#16a34a";
  if (n >= 40) return "#eab308";
  return "#dc2626";
}

function MetricBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex justify-between text-[13px] mb-1.5">
        <span className="font-medium text-[#1a202c]">{label}</span>
        <span className="font-semibold" style={{ color: scoreColor(value) }}>{value}/100</span>
      </div>
      <div className="h-2.5 rounded-full bg-[#f1f5f9] overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ background: scoreColor(value) }}
        />
      </div>
    </div>
  );
}

function ResumeScore() {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);

  useEffect(() => {
    if (!loading) {
      setLoadingStep(0);
      return;
    }
    const id = setInterval(() => {
      setLoadingStep((s) => (s + 1) % LOADING_STEPS.length);
    }, 1800);
    return () => clearInterval(id);
  }, [loading]);

  async function analyze() {
    setError(null);
    if (resumeText.trim().length < 50) {
      setError("Paste at least a few lines of your resume to get a real score.");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/roast-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, jobDescription }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed");
      setResult(data);
      setTimeout(() => {
        document.getElementById("results")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch (e: any) {
      setError(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const faqSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  });

  return (
    <div className="min-h-screen bg-white pt-[68px]">
      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-14 pb-8 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FF6321]/10 text-[#FF6321] text-[13px] font-medium mb-5">
          <Flame size={14} /> Brutally honest AI feedback
        </div>
        <h1 className="text-[42px] sm:text-[52px] font-semibold leading-[1.1] text-[#1a202c] tracking-tight">
          Your Resume Score — <span className="text-[#FF6321]">Brutally Honest</span> AI Feedback
        </h1>
        <p className="mt-5 text-[17px] text-[#4a5568] max-w-2xl mx-auto leading-relaxed">
          Paste your resume. Get a real score. Find out why recruiters aren't calling.
        </p>
      </section>

      {/* Tool */}
      <section className="max-w-3xl mx-auto px-6 pb-16">
        <div className="bg-white border border-[#e5e7eb] rounded-2xl p-6 sm:p-8 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.15)]">
          <label className="block text-[14px] font-medium text-[#1a202c] mb-2">Your resume</label>
          <textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Paste your resume text here..."
            className="w-full h-56 sm:h-64 rounded-xl border border-[#e5e7eb] bg-[#fafafa] p-4 text-[14px] text-[#1a202c] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#FF6321]/40 focus:border-[#FF6321] transition resize-none font-mono"
          />

          <label className="block text-[14px] font-medium text-[#1a202c] mt-5 mb-2">
            Job description <span className="text-[#9ca3af] font-normal">(optional — for keyword match)</span>
          </label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste job description (optional — for keyword match)"
            className="w-full h-32 rounded-xl border border-[#e5e7eb] bg-[#fafafa] p-4 text-[14px] text-[#1a202c] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#FF6321]/40 focus:border-[#FF6321] transition resize-none"
          />

          {error && (
            <div className="mt-4 flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-[13px]">
              <AlertCircle size={16} className="mt-0.5 shrink-0" /> {error}
            </div>
          )}

          <button
            onClick={analyze}
            disabled={loading}
            className="mt-6 w-full flex items-center justify-center gap-2 bg-[#FF6321] hover:bg-[#e6551a] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-[16px] py-4 rounded-xl transition-all shadow-[0_10px_30px_-10px_rgba(255,99,33,0.6)] hover:scale-[1.01]"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Analyzing your resume...
              </>
            ) : (
              <>
                <Flame size={18} /> Roast My Resume <ArrowRight size={18} />
              </>
            )}
          </button>
        </div>

        {/* Results */}
        <AnimatePresence>
          {result && (
            <motion.div
              id="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-10 space-y-8"
            >
              {/* Score + grade */}
              <div className="bg-white border border-[#e5e7eb] rounded-2xl p-8 flex flex-col sm:flex-row items-center gap-8">
                <div className="relative w-40 h-40 shrink-0">
                  <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                    <circle cx="60" cy="60" r="52" stroke="#f1f5f9" strokeWidth="12" fill="none" />
                    <motion.circle
                      cx="60"
                      cy="60"
                      r="52"
                      stroke={scoreColor(result.score)}
                      strokeWidth="12"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 52}
                      initial={{ strokeDashoffset: 2 * Math.PI * 52 }}
                      animate={{ strokeDashoffset: 2 * Math.PI * 52 * (1 - result.score / 100) }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-[42px] font-bold leading-none" style={{ color: scoreColor(result.score) }}>
                      {result.score}
                    </div>
                    <div className="text-[12px] text-[#6b7280] mt-1">out of 100</div>
                  </div>
                </div>
                <div className="text-center sm:text-left">
                  <div className="text-[13px] uppercase tracking-wider text-[#9ca3af] font-medium mb-1">Grade</div>
                  <div className="text-[72px] font-bold leading-none" style={{ color: scoreColor(result.score) }}>
                    {result.grade}
                  </div>
                  <div className="text-[14px] text-[#4a5568] mt-2 max-w-xs">
                    {result.score >= 70
                      ? "Solid work. Small tweaks will push it higher."
                      : result.score >= 40
                        ? "Not bad — but recruiters need more from you."
                        : "This needs serious work before you send it out."}
                  </div>
                </div>
              </div>

              {/* Metrics */}
              <div className="bg-white border border-[#e5e7eb] rounded-2xl p-8 space-y-5">
                <h2 className="text-[20px] font-semibold text-[#1a202c] mb-2">Detailed Metrics</h2>
                <MetricBar label="ATS Compatibility" value={result.ats} />
                <MetricBar label="Content Quality" value={result.content} />
                <MetricBar label="Impact Language" value={result.impact} />
                <MetricBar label="Keyword Density" value={result.keywords} />
              </div>

              {/* What recruiters see */}
              <div>
                <h2 className="text-[22px] font-semibold text-[#1a202c] mb-5">What Recruiters See</h2>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
                    <div className="flex items-center gap-2 mb-3 text-green-700 font-semibold">
                      <CheckCircle2 size={18} /> Strengths
                    </div>
                    <ul className="space-y-2 text-[14px] text-[#1a202c]">
                      {result.strengths?.map((s, i) => (
                        <li key={i} className="flex gap-2"><span className="text-green-600">•</span>{s}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
                    <div className="flex items-center gap-2 mb-3 text-red-700 font-semibold">
                      <XCircle size={18} /> Weaknesses
                    </div>
                    <ul className="space-y-2 text-[14px] text-[#1a202c]">
                      {result.weaknesses?.map((s, i) => (
                        <li key={i} className="flex gap-2"><span className="text-red-600">•</span>{s}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6">
                    <div className="flex items-center gap-2 mb-3 text-[#FF6321] font-semibold">
                      <Wrench size={18} /> Quick Fixes
                    </div>
                    <ul className="space-y-2 text-[14px] text-[#1a202c]">
                      {result.quickFixes?.map((s, i) => (
                        <li key={i} className="flex gap-2"><span className="text-[#FF6321]">•</span>{s}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Roast */}
              <div className="bg-[#0f172a] text-white rounded-2xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF6321]/20 blur-3xl rounded-full -mr-20 -mt-20" />
                <div className="relative">
                  <div className="flex items-center gap-2 text-[13px] uppercase tracking-wider text-[#FF6321] font-semibold mb-3">
                    <span className="text-2xl">💀</span> The Roast
                  </div>
                  <p className="text-[18px] leading-relaxed font-medium text-white/95">
                    {result.roast}
                  </p>
                </div>
              </div>

              {/* CTA */}
              <div className="text-center py-4">
                <Link
                  to="/resume"
                  className="inline-flex items-center gap-2 bg-[#FF6321] hover:bg-[#e6551a] text-white font-semibold text-[16px] px-8 py-4 rounded-full transition-all shadow-[0_10px_30px_-10px_rgba(255,99,33,0.6)] hover:scale-105 no-underline"
                >
                  <Sparkles size={18} /> Fix My Resume with AI <ArrowRight size={18} />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-6 pb-24">
        <h2 className="text-[30px] font-semibold text-[#1a202c] mb-8 text-center">
          Frequently Asked Questions
        </h2>
        <div className="space-y-3">
          {FAQS.map((f, i) => (
            <details key={i} className="border border-[#e5e7eb] rounded-xl p-5 bg-white group">
              <summary className="font-semibold text-[#1a202c] text-[16px] list-none flex justify-between items-center gap-4 cursor-pointer">
                <span>{f.q}</span>
                <span className="text-[#FF6321] text-2xl shrink-0 group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="mt-3 text-[#4a5568] text-[15px] leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqSchema }} />
    </div>
  );
}

export const Route = createFileRoute("/resume-score")({
  head: () => ({
    meta: [
      { title: "Resume Score & Roast — Brutally Honest AI Feedback | airesumi" },
      {
        name: "description",
        content:
          "Get a brutally honest AI resume score in seconds. See your ATS compatibility, content quality, and what recruiters really think — free.",
      },
      { property: "og:title", content: "Resume Score & Roast — Brutally Honest AI Feedback" },
      {
        property: "og:description",
        content: "Paste your resume. Get a real score. Find out why recruiters aren't calling.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://airesumi.com/resume-score" }],
  }),
  component: ResumeScore,
});
