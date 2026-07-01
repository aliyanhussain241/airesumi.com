import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  Wand2,
  Target,
  Building2,
  Search,
  Sparkles,
  FileText,
  CheckCircle2,
  Lightbulb,
  Zap,
  TrendingUp,
  Clipboard,
  X,
  Hash,
} from "lucide-react";
import { Step } from "./App";
import { JobDescription } from "./lib/types";
import { MultiStepFormShell } from "./components/MultiStepFormShell";

interface JobFormProps {
  jobData: JobDescription;
  setJobData: React.Dispatch<React.SetStateAction<JobDescription>>;
  setStep: (step: Step) => void;
  error?: string | null;
  handleGenerate: () => Promise<void>;
}

const POPULAR_ROLES = [
  "Senior Frontend Engineer",
  "Product Manager",
  "Data Scientist",
  "UX Designer",
  "DevOps Engineer",
  "Marketing Manager",
];

const SAMPLE_JD = `We're looking for a Senior Frontend Engineer to join our product team. You'll build performant, accessible interfaces in React and TypeScript, collaborate with designers on a modern design system, and ship features that reach millions of users.

Requirements:
- 5+ years building production React applications
- Strong TypeScript, testing, and performance skills
- Experience with modern build tools (Vite, Turbopack)
- A collaborative, user-first mindset`;

// Very small stop-word set for keyword extraction
const STOP = new Set(
  "the a an and or of to in for with on at by from as is are be will you your our we they this that these those it its into not have has our their them who whom which what when where why how".split(
    " "
  )
);

function extractKeywords(text: string, limit = 12): string[] {
  if (!text) return [];
  const counts: Record<string, number> = {};
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9+.#\-\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP.has(w) && !/^\d+$/.test(w));
  for (const w of words) counts[w] = (counts[w] || 0) + 1;
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([w]) => w);
}

export const JobForm: React.FC<JobFormProps> = ({
  jobData,
  setJobData,
  setStep,
  error,
  handleGenerate,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const wordCount = useMemo(
    () => jobData.description.trim().split(/\s+/).filter(Boolean).length,
    [jobData.description]
  );
  const charCount = jobData.description.length;

  const keywords = useMemo(
    () => extractKeywords(jobData.description),
    [jobData.description]
  );

  const filledCount =
    (jobData.title ? 1 : 0) +
    (jobData.company ? 1 : 0) +
    (jobData.description ? 1 : 0);
  const completion = Math.round((filledCount / 3) * 100);

  const targetingQuality =
    wordCount === 0
      ? { label: "General resume", color: "text-muted-foreground", pct: 20 }
      : wordCount < 50
      ? { label: "Light targeting", color: "text-amber-500", pct: 45 }
      : wordCount < 150
      ? { label: "Good targeting", color: "text-orange-500", pct: 75 }
      : { label: "Highly tailored", color: "text-emerald-500", pct: 100 };

  const onGenerate = async () => {
    setIsGenerating(true);
    try {
      await handleGenerate();
    } finally {
      setIsGenerating(false);
    }
  };

  const pasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setJobData({ ...jobData, description: text });
    } catch {
      /* ignore */
    }
  };

  return (
    <MultiStepFormShell
      key="target-role"
      className="py-12"
    >
      {/* Header */}
      <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
        <div>
          <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#FF6321] mb-3 block">
            Step 03 / 03 · Almost there
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
            Who are you targeting?
          </h2>
          <p className="mt-3 text-muted-foreground max-w-2xl">
            Add job details and our AI will tailor keywords, tone, and structure to match. All fields optional — skip to generate a general resume.
          </p>
        </div>

        {/* Progress ring */}
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 shadow-sm">
          <div className="relative w-12 h-12">
            <svg viewBox="0 0 36 36" className="w-12 h-12 -rotate-90">
              <circle
                cx="18"
                cy="18"
                r="15"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                className="text-muted/40"
              />
              <circle
                cx="18"
                cy="18"
                r="15"
                fill="none"
                stroke="#FF6321"
                strokeWidth="3"
                strokeDasharray={`${(completion / 100) * 94.2} 94.2`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-foreground">
              {completion}%
            </div>
          </div>
          <div className="text-sm">
            <div className="font-semibold text-foreground">Ready to generate</div>
            <div className="text-muted-foreground text-xs">
              {filledCount}/3 fields filled
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-8">
        {/* Main card */}
        <div className="bg-card border border-border rounded-3xl p-6 sm:p-10 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.08)] space-y-10 relative overflow-hidden">
          {/* Callout */}
          <div className="relative rounded-2xl p-6 flex items-start gap-4 bg-gradient-to-br from-orange-50 to-amber-50/60 dark:from-orange-500/10 dark:to-amber-500/5 border border-orange-100 dark:border-orange-500/20">
            <div className="bg-[#FF6321] text-white p-2.5 rounded-xl shrink-0 shadow-lg shadow-orange-500/30">
              <Target size={20} />
            </div>
            <div>
              <h3 className="font-bold text-foreground text-lg mb-1 flex items-center gap-2">
                Pass the ATS automatically
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-[#FF6321] text-white px-2 py-0.5 rounded-full">
                  <Sparkles size={10} /> AI
                </span>
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Paste the job description below and our AI will tailor your resume to match.{" "}
                <span className="text-[#FF6321] font-semibold">All fields are optional</span> — fill them for a targeted resume, or skip and hit Generate for a general one.
              </p>
            </div>
          </div>

          {/* Title & Company */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
                Job Title{" "}
                <span className="text-muted-foreground/70 normal-case font-normal">
                  (Optional)
                </span>
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-[#FF6321] transition-colors">
                  <Search size={18} />
                </div>
                <input
                  type="text"
                  className="w-full bg-muted/40 border border-border rounded-xl pl-12 pr-4 py-3.5 focus:ring-2 focus:ring-[#FF6321]/20 focus:border-[#FF6321] focus:bg-background outline-none transition-all placeholder:text-muted-foreground/60 font-medium text-foreground"
                  placeholder="e.g. Senior Frontend Engineer"
                  value={jobData.title}
                  onChange={(e) => setJobData({ ...jobData, title: e.target.value })}
                />
              </div>

              {/* Popular role chips */}
              <div className="mt-3 flex flex-wrap gap-2">
                {POPULAR_ROLES.slice(0, 4).map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setJobData({ ...jobData, title: role })}
                    className="text-xs px-3 py-1.5 rounded-full border border-border bg-background hover:border-[#FF6321] hover:text-[#FF6321] transition-colors text-muted-foreground font-medium"
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
                Company Name{" "}
                <span className="text-muted-foreground/70 normal-case font-normal">
                  (Optional)
                </span>
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-[#FF6321] transition-colors">
                  <Building2 size={18} />
                </div>
                <input
                  type="text"
                  className="w-full bg-muted/40 border border-border rounded-xl pl-12 pr-4 py-3.5 focus:ring-2 focus:ring-[#FF6321]/20 focus:border-[#FF6321] focus:bg-background outline-none transition-all placeholder:text-muted-foreground/60 font-medium text-foreground"
                  placeholder="e.g. Acme Corp"
                  value={jobData.company}
                  onChange={(e) => setJobData({ ...jobData, company: e.target.value })}
                />
              </div>
              <p className="mt-3 text-xs text-muted-foreground flex items-center gap-1.5">
                <Lightbulb size={12} className="text-amber-500" />
                We'll subtly weave the company culture into your summary.
              </p>
            </div>
          </div>

          {/* Job description */}
          <div>
            <div className="flex flex-wrap justify-between items-baseline mb-2 gap-2">
              <label className="block text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                Job Description{" "}
                <span className="text-muted-foreground/70 normal-case font-normal">
                  (Optional)
                </span>
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={pasteFromClipboard}
                  className="text-xs px-2.5 py-1 rounded-md border border-border bg-background text-muted-foreground hover:text-foreground hover:border-[#FF6321] transition-colors inline-flex items-center gap-1.5"
                >
                  <Clipboard size={12} /> Paste
                </button>
                <button
                  type="button"
                  onClick={() => setJobData({ ...jobData, description: SAMPLE_JD })}
                  className="text-xs px-2.5 py-1 rounded-md border border-border bg-background text-muted-foreground hover:text-foreground hover:border-[#FF6321] transition-colors inline-flex items-center gap-1.5"
                >
                  <FileText size={12} /> Use sample
                </button>
                {jobData.description && (
                  <button
                    type="button"
                    onClick={() => setJobData({ ...jobData, description: "" })}
                    className="text-xs px-2.5 py-1 rounded-md border border-border bg-background text-muted-foreground hover:text-red-500 hover:border-red-300 transition-colors inline-flex items-center gap-1.5"
                  >
                    <X size={12} /> Clear
                  </button>
                )}
              </div>
            </div>

            <div className="relative">
              <textarea
                rows={10}
                className="w-full bg-muted/40 border border-border rounded-xl px-5 py-4 focus:ring-2 focus:ring-[#FF6321]/20 focus:border-[#FF6321] focus:bg-background outline-none transition-all resize-y text-[15px] leading-relaxed placeholder:text-muted-foreground/60 text-foreground"
                placeholder="Paste the full job description here (optional). The more context you provide, the better we can tailor your resume..."
                value={jobData.description}
                onChange={(e) => setJobData({ ...jobData, description: e.target.value })}
              />
              <div className="absolute bottom-3 right-4 flex items-center gap-3 text-[11px] text-muted-foreground bg-background/80 backdrop-blur px-2 py-1 rounded-md">
                <span>{wordCount} words</span>
                <span className="text-muted-foreground/40">·</span>
                <span>{charCount} chars</span>
              </div>
            </div>

            {/* Targeting quality meter */}
            <div className="mt-4 flex items-center gap-3">
              <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-emerald-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${targetingQuality.pct}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <span className={`text-xs font-semibold ${targetingQuality.color}`}>
                {targetingQuality.label}
              </span>
            </div>

            {/* Detected keywords */}
            <AnimatePresence>
              {keywords.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-5"
                >
                  <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    <Hash size={12} className="text-[#FF6321]" /> Detected keywords
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {keywords.map((kw) => (
                      <span
                        key={kw}
                        className="text-xs px-2.5 py-1 rounded-full bg-orange-50 dark:bg-orange-500/10 text-[#FF6321] font-medium border border-orange-100 dark:border-orange-500/20"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm font-medium border border-red-100 dark:border-red-500/20">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="pt-8 border-t border-border flex flex-wrap gap-4 justify-between items-center">
            <button
              onClick={() => setStep(Step.DESIGN)}
              className="flex items-center gap-2 px-6 py-4 bg-muted/60 border border-border text-foreground font-bold rounded-xl hover:bg-muted transition-colors"
            >
              <ArrowLeft size={18} /> <span className="hidden sm:inline">Back to Design</span>
              <span className="sm:hidden">Back</span>
            </button>
            <button
              onClick={onGenerate}
              disabled={isGenerating}
              className="group relative flex items-center gap-3 bg-gradient-to-r from-[#FF6321] to-amber-500 text-white px-8 py-4 rounded-xl font-bold text-base shadow-xl shadow-orange-500/30 hover:shadow-orange-500/50 hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:translate-y-0"
            >
              {isGenerating ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full"
                  />
                  Generating your resume...
                </>
              ) : (
                <>
                  <Wand2 size={18} className="group-hover:rotate-12 transition-transform" />
                  Generate Resume
                  <Sparkles size={14} className="opacity-80" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6 lg:sticky lg:top-24 self-start">
          {/* Pro tips */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-500/10 flex items-center justify-center text-[#FF6321]">
                <Lightbulb size={16} />
              </div>
              <h4 className="font-bold text-foreground">Pro tips</h4>
            </div>
            <ul className="space-y-3 text-sm">
              {[
                "Paste the full JD — the more context, the better the match.",
                "Include the company name for tone and culture alignment.",
                "Even a rough JD outperforms a generic resume by ~40%.",
              ].map((tip) => (
                <li key={tip} className="flex gap-2 text-muted-foreground">
                  <CheckCircle2
                    size={16}
                    className="text-emerald-500 shrink-0 mt-0.5"
                  />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* What AI does */}
          <div className="bg-gradient-to-br from-[#FF6321] to-amber-500 text-white rounded-2xl p-6 shadow-lg shadow-orange-500/20 relative overflow-hidden">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <Zap size={16} />
                </div>
                <h4 className="font-bold">What our AI does</h4>
              </div>
              <ul className="space-y-2.5 text-sm text-white/90">
                {[
                  "Extracts keywords ATS scanners look for",
                  "Rewrites bullets with impact metrics",
                  "Matches tone to the company culture",
                  "Prioritizes your most relevant experience",
                ].map((t) => (
                  <li key={t} className="flex gap-2">
                    <Sparkles size={14} className="shrink-0 mt-0.5" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Stat */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-2 text-muted-foreground text-xs font-bold uppercase tracking-widest">
              <TrendingUp size={12} /> Success rate
            </div>
            <div className="text-3xl font-bold text-foreground">3.2×</div>
            <p className="text-sm text-muted-foreground mt-1">
              more interviews when a JD is provided vs. a generic resume.
            </p>
          </div>
        </aside>
      </div>
    </MultiStepFormShell>
  );
};
