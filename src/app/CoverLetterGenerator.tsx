import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Loader2,
  UploadCloud,
  Wand2,
  Download,
  Copy,
  Check,
  Mail,
  RefreshCw,
  FileText,
  Sparkles,
  Target,
  Gauge,
  Palette,
  Type as TypeIcon,
  Eye,
  Pencil,
  Zap,
} from "lucide-react";
import { Step } from "./App";
import { UserData, JobDescription, CoverLetterData } from "./lib/types";

interface CoverLetterGeneratorProps {
  coverLetterState: "IDLE" | "GENERATING" | "DONE";
  coverLetterData: CoverLetterData | null;
  coverLetterTone: string;
  setCoverLetterTone: (tone: string) => void;
  userData: UserData;
  jobData: JobDescription;
  setJobData: React.Dispatch<React.SetStateAction<JobDescription>>;
  setStep: (step: Step) => void;
  error?: string | null;
  isUploading: boolean;
  handleCVUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleGenerateCoverLetter: () => Promise<void>;
  handlePrintCoverLetter: () => void;
}

const TONES = [
  { name: "Professional", desc: "Polished, formal, safe for corporates & finance." },
  { name: "Confident", desc: "Assertive and results-driven for senior roles." },
  { name: "Friendly", desc: "Warm and approachable — great for startups." },
  { name: "Creative", desc: "Storytelling-first for design & marketing roles." },
];

const TEMPLATES = [
  { id: "classic", name: "Classic", accent: "#111827" },
  { id: "modern", name: "Modern", accent: "#FF6321" },
  { id: "minimal", name: "Minimal", accent: "#0a0a0a" },
];

const LOADING_STEPS = [
  { label: "Reading job description", icon: FileText },
  { label: "Matching your experience", icon: Target },
  { label: "Choosing the right tone", icon: Palette },
  { label: "Writing your opening hook", icon: Sparkles },
  { label: "Polishing final draft", icon: Wand2 },
];

function useTypedList<T>(items: T[], intervalMs = 1400, active = false) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (!active) return;
    setI(0);
    const t = setInterval(() => setI((v) => (v + 1 < items.length ? v + 1 : v)), intervalMs);
    return () => clearInterval(t);
  }, [active, items.length, intervalMs]);
  return i;
}

const highlightKeywords = (text: string, keywords: string[]) => {
  if (!keywords?.length) return text;
  const escaped = keywords
    .filter(Boolean)
    .map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  if (!escaped.length) return text;
  const re = new RegExp(`\\b(${escaped.join("|")})\\b`, "gi");
  const parts = text.split(re);
  return parts.map((p, i) =>
    escaped.some((k) => new RegExp(`^${k}$`, "i").test(p)) ? (
      <mark
        key={i}
        className="bg-orange-100 text-[#c2410c] rounded px-0.5 print:bg-transparent print:text-black"
      >
        {p}
      </mark>
    ) : (
      <React.Fragment key={i}>{p}</React.Fragment>
    ),
  );
};

export const CoverLetterGenerator: React.FC<CoverLetterGeneratorProps> = ({
  coverLetterState,
  coverLetterData,
  coverLetterTone,
  setCoverLetterTone,
  userData,
  jobData,
  setJobData,
  setStep,
  error,
  isUploading,
  handleCVUpload,
  handleGenerateCoverLetter,
  handlePrintCoverLetter,
}) => {
  const [template, setTemplate] = useState<string>("modern");
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(true);

  const jdWords = jobData.description.trim().split(/\s+/).filter(Boolean).length;
  const jdQuality = Math.min(100, Math.round((jdWords / 120) * 100));
  const jdLabel = jdWords < 25 ? "Too short" : jdWords < 80 ? "Okay" : jdWords < 200 ? "Great" : "Excellent";

  const readyToGenerate =
    !!userData.fullName && !!userData.experience[0] && !!jobData.description && !!jobData.title;

  const loadingStepIndex = useTypedList(LOADING_STEPS, 1400, coverLetterState === "GENERATING");

  const wordCount = useMemo(
    () => (coverLetterData?.content || "").trim().split(/\s+/).filter(Boolean).length,
    [coverLetterData],
  );
  const readMin = Math.max(1, Math.round(wordCount / 220));

  const onCopy = async () => {
    if (!coverLetterData) return;
    await navigator.clipboard.writeText(coverLetterData.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const onEmail = () => {
    if (!coverLetterData) return;
    const subject = encodeURIComponent(
      `Application for ${jobData.title || "the role"}${jobData.company ? ` at ${jobData.company}` : ""}`,
    );
    const body = encodeURIComponent(coverLetterData.content);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const activeAccent = TEMPLATES.find((t) => t.id === template)?.accent || "#FF6321";

  return (
    <motion.div
      key="cover_letter"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20 }}
      className={`flex flex-col min-h-screen ${
        coverLetterState === "GENERATING" ? "items-center justify-center" : ""
      } bg-gradient-to-b from-[#f9fafb] via-white to-[#f9fafb] relative pb-20 pt-[68px]`}
    >
      {/* ================= IDLE ================= */}
      {coverLetterState === "IDLE" && (
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 pt-10 lg:pt-14">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-[#c2410c] text-xs font-semibold uppercase tracking-widest mb-3">
                <Sparkles size={12} /> AI Cover Letter Studio
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#0a0a0a]">
                Write a cover letter that gets replies.
              </h1>
              <p className="text-[#6b7280] mt-2 max-w-2xl text-[15px]">
                Upload your resume, paste the job — get a tailored, keyword-matched letter in under 30 seconds.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#6b7280]">
              <span className="flex items-center gap-1"><Check size={14} className="text-green-500" /> ATS-friendly</span>
              <span className="flex items-center gap-1"><Check size={14} className="text-green-500" /> Free</span>
              <span className="flex items-center gap-1"><Check size={14} className="text-green-500" /> No sign-up</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-5 gap-6">
            {/* LEFT: Form (3 cols) */}
            <div className="lg:col-span-3 space-y-5">
              {/* Step 1: Profile */}
              <section className="bg-white p-6 rounded-2xl border border-[#e5e7eb] shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-[#0a0a0a]">
                    <span className="text-[#FF6321] mr-2">01</span>Your Profile
                  </h3>
                  {userData.fullName && (
                    <span className="text-[11px] font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full flex items-center gap-1">
                      <Check size={12} /> Loaded
                    </span>
                  )}
                </div>

                {!userData.fullName && !userData.experience[0] ? (
                  <label
                    className={`relative block border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                      isUploading ? "border-[#FF6321] bg-orange-50" : "border-[#e5e7eb] hover:border-[#FF6321] hover:bg-orange-50/50"
                    }`}
                  >
                    <input
                      type="file"
                      accept=".pdf,.txt,.doc,.docx"
                      onChange={handleCVUpload}
                      disabled={isUploading}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-wait"
                      aria-label="Upload your resume"
                    />
                    {isUploading ? (
                      <div className="flex flex-col items-center gap-3">
                        <Loader2 size={32} className="text-[#FF6321] animate-spin" />
                        <p className="text-[#FF6321] font-semibold text-sm">Extracting CV data via AI…</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-14 h-14 rounded-2xl bg-orange-50 text-[#FF6321] flex items-center justify-center">
                          <UploadCloud size={26} />
                        </div>
                        <div>
                          <h4 className="font-bold text-[#111827]">Drop your resume to auto-fill</h4>
                          <p className="text-xs text-[#6b7280] mt-1">PDF, DOC, DOCX, TXT — up to 5 MB</p>
                        </div>
                        <div className="flex gap-2 mt-1 text-[11px] text-[#6b7280]">
                          <span className="px-2 py-1 rounded-full bg-[#f3f4f6]">🔒 Private</span>
                          <span className="px-2 py-1 rounded-full bg-[#f3f4f6]">⚡ 5-sec parse</span>
                        </div>
                      </div>
                    )}
                  </label>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-3 text-sm">
                    <ProfileStat label="Name" value={userData.fullName || "—"} />
                    <ProfileStat label="Current Role" value={userData.currentRole || "—"} />
                    <ProfileStat
                      label="Experience"
                      value={`${userData.experience.filter((e) => e.trim()).length} entries`}
                    />
                    <ProfileStat
                      label="Skills"
                      value={userData.skills.filter((s) => s.trim()).length ? "Ready" : "None"}
                    />
                    <button
                      onClick={() => setStep(Step.DETAILS)}
                      className="sm:col-span-2 text-[#FF6321] font-semibold text-xs uppercase tracking-widest hover:underline flex items-center gap-1"
                    >
                      <Pencil size={12} /> Edit profile data
                    </button>
                  </div>
                )}
              </section>

              {/* Step 2: Job */}
              <section className="bg-white p-6 rounded-2xl border border-[#e5e7eb] shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-[#0a0a0a]">
                    <span className="text-[#FF6321] mr-2">02</span>Target Job
                  </h3>
                  <div className="flex items-center gap-2">
                    <Gauge size={14} className="text-[#6b7280]" />
                    <div className="w-24 h-1.5 bg-[#f3f4f6] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-orange-400 to-[#FF6321] transition-all"
                        style={{ width: `${jdQuality}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-semibold text-[#4b5563] w-16">{jdLabel}</span>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <FieldInput
                    label="Job Title"
                    value={jobData.title}
                    onChange={(v) => setJobData({ ...jobData, title: v })}
                    placeholder="e.g. Senior Frontend Engineer"
                  />
                  <FieldInput
                    label="Company"
                    value={jobData.company}
                    onChange={(v) => setJobData({ ...jobData, company: v })}
                    placeholder="e.g. Acme Corp"
                  />
                </div>
                <div className="mt-3">
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-[#4b5563] mb-1">
                    Job Description
                  </label>
                  <textarea
                    value={jobData.description}
                    onChange={(e) => setJobData({ ...jobData, description: e.target.value })}
                    placeholder="Paste the full job posting for best results (requirements, responsibilities, tech stack)…"
                    className="w-full h-40 p-3 bg-[#f9fafb] border border-[#e5e7eb] rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#FF6321] focus:bg-white resize-none transition-all"
                  />
                  <div className="flex justify-between text-[11px] text-[#6b7280] mt-1.5">
                    <span>{jdWords} words</span>
                    <span>Tip: 100–200 words yields the sharpest match</span>
                  </div>
                </div>
              </section>

              {/* Step 3: Tone */}
              <section className="bg-white p-6 rounded-2xl border border-[#e5e7eb] shadow-sm">
                <h3 className="text-sm font-bold uppercase tracking-widest text-[#0a0a0a] mb-4">
                  <span className="text-[#FF6321] mr-2">03</span>Tone of Voice
                </h3>
                <div className="grid sm:grid-cols-2 gap-2.5">
                  {TONES.map((t) => {
                    const active = coverLetterTone === t.name;
                    return (
                      <button
                        key={t.name}
                        onClick={() => setCoverLetterTone(t.name)}
                        className={`text-left p-3.5 rounded-xl border transition-all ${
                          active
                            ? "border-[#FF6321] bg-orange-50 ring-2 ring-orange-200"
                            : "border-[#e5e7eb] hover:border-[#FF6321]/50 hover:bg-orange-50/40"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-sm font-semibold ${active ? "text-[#FF6321]" : "text-[#111827]"}`}>
                            {t.name}
                          </span>
                          {active && <Check size={14} className="text-[#FF6321]" />}
                        </div>
                        <p className="text-[12px] text-[#6b7280] leading-snug">{t.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </section>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium">
                  {error}
                </div>
              )}

              <button
                onClick={handleGenerateCoverLetter}
                disabled={!readyToGenerate}
                className="w-full py-4 bg-[#FF6321] hover:bg-[#E85B1F] text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_10px_30px_-10px_rgba(255,99,33,0.6)]"
              >
                <Wand2 size={20} />
                Generate Cover Letter
                <Zap size={16} className="opacity-80" />
              </button>
              {!readyToGenerate && (
                <p className="text-center text-xs text-[#6b7280] -mt-2">
                  Add your resume + job title + description to continue
                </p>
              )}
            </div>

            {/* RIGHT: Live Preview (2 cols) */}
            <div className="lg:col-span-2">
              <div className="lg:sticky lg:top-24 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#0a0a0a]">
                    <Eye size={14} /> Live Preview
                  </div>
                  <div className="flex gap-1 bg-[#f3f4f6] p-1 rounded-lg">
                    {TEMPLATES.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setTemplate(t.id)}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                          template === t.id ? "bg-white text-[#111827] shadow-sm" : "text-[#6b7280]"
                        }`}
                      >
                        {t.name}
                      </button>
                    ))}
                  </div>
                </div>

                <MockLetterPreview
                  userData={userData}
                  jobData={jobData}
                  tone={coverLetterTone}
                  accent={activeAccent}
                  template={template}
                />

                <div className="bg-white p-4 rounded-2xl border border-[#e5e7eb] shadow-sm">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#0a0a0a] mb-2">
                    <TypeIcon size={14} /> What you'll get
                  </div>
                  <ul className="space-y-1.5 text-[13px] text-[#4b5563]">
                    {[
                      "Tailored opening hook mentioning the company",
                      "2–3 achievements matched to the JD",
                      "Keyword insights (matched + missing)",
                      "Editable, one-click PDF export",
                    ].map((x) => (
                      <li key={x} className="flex gap-2">
                        <Check size={14} className="text-[#FF6321] shrink-0 mt-0.5" />
                        <span>{x}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= GENERATING ================= */}
      {coverLetterState === "GENERATING" && (
        <div className="text-center z-10 p-6 mt-10 max-w-lg w-full">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block mb-8 relative"
          >
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#FF6321] to-orange-400 flex items-center justify-center shadow-[0_20px_40px_-10px_rgba(255,99,33,0.5)]">
              <Wand2 size={32} className="text-white" />
            </div>
            <motion.div
              className="absolute inset-0 rounded-3xl border-2 border-[#FF6321]"
              animate={{ scale: [1, 1.4], opacity: [0.6, 0] }}
              transition={{ duration: 1.6, repeat: Infinity }}
            />
          </motion.div>

          <h3 className="text-2xl font-bold text-[#111827] mb-1">Crafting your cover letter…</h3>
          <p className="text-[#6b7280] text-sm mb-8">Analyzing your resume against the job description</p>

          <div className="space-y-2.5 text-left bg-white rounded-2xl border border-[#e5e7eb] p-5 shadow-sm">
            {LOADING_STEPS.map((s, i) => {
              const Icon = s.icon;
              const done = i < loadingStepIndex;
              const active = i === loadingStepIndex;
              return (
                <div key={s.label} className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all ${
                      done
                        ? "bg-green-100 text-green-600"
                        : active
                          ? "bg-orange-100 text-[#FF6321]"
                          : "bg-[#f3f4f6] text-[#9ca3af]"
                    }`}
                  >
                    {done ? <Check size={16} /> : active ? <Loader2 size={16} className="animate-spin" /> : <Icon size={16} />}
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      done ? "text-[#111827]" : active ? "text-[#FF6321]" : "text-[#9ca3af]"
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= DONE ================= */}
      {coverLetterState === "DONE" && coverLetterData && (
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 pt-10 lg:pt-14 grid lg:grid-cols-3 gap-6 print:block print:p-0 print:m-0 print:max-w-none">
          <div className="lg:col-span-2 space-y-4 print:space-y-0">
            <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
              <div>
                <h2 className="text-2xl font-bold text-[#111827]">Your Cover Letter</h2>
                <p className="text-xs text-[#6b7280] mt-0.5">
                  {wordCount} words · ~{readMin} min read · tone: <span className="font-semibold text-[#FF6321]">{coverLetterTone}</span>
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <ActionBtn onClick={onCopy} icon={copied ? Check : Copy} label={copied ? "Copied" : "Copy"} tone={copied ? "success" : undefined} />
                <ActionBtn onClick={handlePrintCoverLetter} icon={Download} label="PDF" />
                <ActionBtn onClick={onEmail} icon={Mail} label="Email" />
                <ActionBtn onClick={handleGenerateCoverLetter} icon={RefreshCw} label="Regenerate" tone="primary" />
              </div>
            </div>

            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#e5e7eb] w-fit print:hidden">
              <button
                onClick={() => setShowPreview(true)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 ${
                  showPreview ? "bg-[#111827] text-white" : "text-[#6b7280]"
                }`}
              >
                <Eye size={12} /> Preview
              </button>
              <button
                onClick={() => setShowPreview(false)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 ${
                  !showPreview ? "bg-[#111827] text-white" : "text-[#6b7280]"
                }`}
              >
                <Pencil size={12} /> Edit
              </button>
            </div>

            <div
              id="cover-letter-document"
              className="bg-white p-8 sm:p-12 rounded-2xl border border-[#e5e7eb] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] min-h-[600px] print:p-0 print:border-none print:shadow-none print:min-h-0"
            >
              <div className="pb-6 mb-6 border-b border-[#e5e7eb] print:border-black">
                <h1 className="text-2xl font-bold text-[#0a0a0a] tracking-tight">{userData.fullName || "Your Name"}</h1>
                <p className="text-sm text-[#6b7280] mt-1">
                  {[userData.email, userData.phone, userData.linkedin].filter(Boolean).join(" · ")}
                </p>
                <div className="h-1 w-14 mt-3 rounded-full" style={{ background: activeAccent }} />
              </div>

              {showPreview ? (
                <div className="text-[#374151] font-sans leading-[1.75] text-[14.5px] whitespace-pre-wrap print:text-black print:text-[12pt]">
                  {highlightKeywords(coverLetterData.content, coverLetterData.insights.matchedSkills)}
                </div>
              ) : (
                <div
                  contentEditable
                  suppressContentEditableWarning
                  className="w-full outline-none text-[#374151] font-sans leading-[1.75] text-[14.5px] bg-transparent whitespace-pre-wrap min-h-[400px] focus:bg-orange-50/30 rounded-lg p-2 -m-2 transition-colors"
                >
                  {coverLetterData.content}
                </div>
              )}
            </div>
          </div>

          {/* Insights */}
          <div className="space-y-4 print:hidden">
            <div className="bg-white p-6 rounded-2xl border border-[#e5e7eb] shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-widest text-[#0a0a0a] mb-4 flex items-center gap-2">
                <Sparkles size={14} className="text-[#FF6321]" /> AI Insights
              </h3>

              <InsightBlock
                label="Matched Keywords"
                items={coverLetterData.insights.matchedSkills}
                tone="success"
                empty="No overlap detected — consider adding role-specific skills to your resume."
              />
              <InsightBlock
                label="Missing Keywords"
                items={coverLetterData.insights.missingKeywords}
                tone="warn"
                empty="You hit every key requirement 🎉"
              />

              <div className="mt-5">
                <h4 className="text-[11px] font-bold text-[#111827] mb-2 uppercase tracking-widest">
                  💡 Improvement Tips
                </h4>
                <ul className="space-y-2 text-sm text-[#4b5563]">
                  {coverLetterData.insights.improvementTips.map((tip, i) => (
                    <li key={i} className="flex gap-2 leading-snug">
                      <span className="text-[#FF6321] mt-0.5">→</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#111827] to-[#1f2937] p-6 rounded-2xl text-white relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#FF6321]/30 blur-3xl rounded-full" />
              <h3 className="font-bold text-lg mb-1.5 relative">Level up your job search</h3>
              <p className="text-sm text-gray-300 mb-4 relative">
                Unlock premium templates, unlimited rewrites, and priority AI models.
              </p>
              <button className="w-full py-2.5 bg-white text-[#111827] font-bold rounded-lg text-sm active:scale-95 transition-transform relative">
                Upgrade to Pro
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

/* ================= Helpers ================= */

const ProfileStat = ({ label, value }: { label: string; value: string }) => (
  <div className="bg-[#f9fafb] rounded-lg px-3 py-2">
    <div className="text-[10px] uppercase tracking-widest text-[#6b7280] font-semibold">{label}</div>
    <div className="text-sm font-semibold text-[#111827] truncate">{value}</div>
  </div>
);

const FieldInput = ({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) => (
  <div>
    <label className="block text-[11px] font-bold uppercase tracking-widest text-[#4b5563] mb-1">
      {label}
    </label>
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full p-3 bg-[#f9fafb] border border-[#e5e7eb] rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#FF6321] focus:bg-white transition-all"
    />
  </div>
);

const ActionBtn = ({
  onClick,
  icon: Icon,
  label,
  tone,
}: {
  onClick: () => void;
  icon: React.ComponentType<{ size?: number }>;
  label: string;
  tone?: "primary" | "success";
}) => {
  const cls =
    tone === "primary"
      ? "bg-[#FF6321] text-white border-transparent hover:bg-[#E85B1F]"
      : tone === "success"
        ? "bg-green-50 text-green-700 border-green-200"
        : "bg-white border-[#e5e7eb] text-[#111827] hover:bg-[#f9fafb]";
  return (
    <button
      onClick={onClick}
      className={`px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 border transition-all active:scale-95 ${cls}`}
    >
      <Icon size={14} /> {label}
    </button>
  );
};

const InsightBlock = ({
  label,
  items,
  tone,
  empty,
}: {
  label: string;
  items: string[];
  tone: "success" | "warn";
  empty: string;
}) => {
  const chipCls =
    tone === "success"
      ? "bg-green-50 text-green-700 border-green-100"
      : "bg-red-50 text-red-700 border-red-100";
  return (
    <div className="mb-4">
      <h4 className="text-[11px] font-bold text-[#111827] mb-2 uppercase tracking-widest">{label}</h4>
      {items.length ? (
        <div className="flex flex-wrap gap-1.5">
          {items.map((s, i) => (
            <span key={i} className={`text-[11px] font-medium px-2 py-1 rounded-md border ${chipCls}`}>
              {s}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-xs text-[#6b7280] italic">{empty}</p>
      )}
    </div>
  );
};

const MockLetterPreview = ({
  userData,
  jobData,
  tone,
  accent,
  template,
}: {
  userData: UserData;
  jobData: JobDescription;
  tone: string;
  accent: string;
  template: string;
}) => {
  const name = userData.fullName || "Your Name";
  const role = jobData.title || "the role";
  const company = jobData.company || "your company";

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={template}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.25 }}
        className="bg-white rounded-2xl border border-[#e5e7eb] shadow-[0_20px_40px_-20px_rgba(0,0,0,0.15)] overflow-hidden"
      >
        <div className={`p-6 ${template === "modern" ? "bg-gradient-to-br from-orange-50 to-white" : ""}`}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-[15px] font-bold text-[#0a0a0a]">{name}</div>
              <div className="text-[11px] text-[#6b7280]">
                {userData.currentRole || "Your role"}
              </div>
            </div>
            <div className="h-8 w-8 rounded-full flex items-center justify-center text-white text-[11px] font-bold" style={{ background: accent }}>
              {name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase() || "YN"}
            </div>
          </div>
          <div className="h-0.5 w-10 rounded-full mb-4" style={{ background: accent }} />
          <div className="space-y-2 text-[11.5px] leading-relaxed text-[#4b5563]">
            <p>Dear Hiring Team at <span className="font-semibold text-[#111827]">{company}</span>,</p>
            <p className="opacity-90">
              I'm writing to apply for the <span className="font-semibold text-[#111827]">{role}</span> position. With a background in{" "}
              <span className="font-semibold text-[#FF6321]">{userData.currentRole || "your domain"}</span>, I'm excited about the chance to bring…
            </p>
            <div className="space-y-1.5 pt-1">
              <div className="h-2 bg-[#f3f4f6] rounded w-full" />
              <div className="h-2 bg-[#f3f4f6] rounded w-11/12" />
              <div className="h-2 bg-[#f3f4f6] rounded w-4/5" />
              <div className="h-2 bg-[#f3f4f6] rounded w-3/4" />
            </div>
            <p className="pt-2 text-[10.5px] italic text-[#9ca3af]">
              Tone preview: <span className="not-italic font-semibold text-[#FF6321]">{tone}</span>
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
