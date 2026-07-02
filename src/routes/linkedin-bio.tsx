import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Linkedin, Sparkles, Copy, Check, ChevronDown, User, Briefcase, Tag, Zap,
  ArrowRight, AlertCircle, RefreshCw, Wand2, Target, Building2, Smile,
  Download, Edit3, Save, Lightbulb, TrendingUp, Search, Camera,
  FileText, Brain, Shield,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ToolContentSection } from "../app/components/ToolContentSection";
import { LINKEDIN_CONTENT } from "../app/components/toolContent";
import { ResumeData, UserData } from "../app/lib/types";

interface LinkedInBio {
  headline: string;
  headline_variants?: string[];
  about: string;
  tagline: string;
  cta: string;
  skills_to_add: string[];
  keywords?: string[];
  profile_tips?: string[];
}

const TONES = [
  { id: "Professional",   label: "Professional",   desc: "Clean, corporate, recruiter-friendly", icon: Shield },
  { id: "Conversational", label: "Conversational", desc: "Warm, human, approachable",             icon: Smile  },
  { id: "Bold",           label: "Bold",           desc: "Confident, punchy, memorable",          icon: Zap    },
  { id: "Creative",       label: "Creative",       desc: "Unique voice, stands out in feed",      icon: Wand2  },
];

const INDUSTRIES = [
  "Software / Tech", "Product & Design", "Marketing & Growth", "Finance",
  "Sales & BD", "Data & AI", "Healthcare", "Education", "Consulting", "Other",
];

const LOADING_STEPS = [
  { icon: Search, label: "Reading your resume…" },
  { icon: Brain,  label: "Analyzing your positioning…" },
  { icon: Wand2,  label: "Crafting headline variants…" },
  { icon: FileText, label: "Writing your About story…" },
  { icon: TrendingUp, label: "Optimizing for recruiter search…" },
];

const HEADLINE_MAX = 220;
const ABOUT_MAX = 2600;

function clsx(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(" ");
}

function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      }}
      className="flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5 rounded-lg border border-border bg-background/60 hover:border-[#FF6321] hover:text-[#FF6321] transition-all"
    >
      {copied ? <Check size={13} className="text-green-500" /> : <Copy size={13} />}
      {copied ? "Copied!" : label}
    </button>
  );
}

function CharMeter({ value, max }: { value: number; max: number }) {
  const pct = Math.min(100, (value / max) * 100);
  const over = value > max;
  const near = value > max * 0.9;
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-24 rounded-full bg-muted overflow-hidden">
        <div
          className={clsx(
            "h-full transition-all",
            over ? "bg-red-500" : near ? "bg-amber-500" : "bg-emerald-500"
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className={clsx("text-[11px] tabular-nums", over ? "text-red-500 font-semibold" : "text-muted-foreground")}>
        {value}/{max}
      </span>
    </div>
  );
}

function EditableBlock({
  icon, label, value, onChange, max, rows = 3,
}: {
  icon: React.ReactNode; label: string; value: string;
  onChange: (v: string) => void; max: number; rows?: number;
}) {
  const [editing, setEditing] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-2xl p-5 shadow-sm"
    >
      <div className="flex items-center justify-between mb-3 gap-3 flex-wrap">
        <div className="flex items-center gap-2 text-[13px] font-semibold text-foreground">
          {icon} {label}
        </div>
        <div className="flex items-center gap-2">
          <CharMeter value={value.length} max={max} />
          <button
            onClick={() => setEditing((e) => !e)}
            className="flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5 rounded-lg border border-border bg-background/60 hover:border-[#FF6321] hover:text-[#FF6321] transition-all"
          >
            {editing ? <Save size={13} /> : <Edit3 size={13} />}
            {editing ? "Done" : "Edit"}
          </button>
          <CopyButton text={value} />
        </div>
      </div>
      {editing ? (
        <textarea
          value={value}
          rows={rows}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-background border border-border rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#FF6321] resize-y leading-relaxed"
        />
      ) : (
        <p className="text-[14px] text-foreground leading-relaxed whitespace-pre-wrap">{value}</p>
      )}
    </motion.div>
  );
}

function LinkedInPreview({ name, title, headline, about }: {
  name: string; title: string; headline: string; about: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm dark:bg-[#1b1f23]"
    >
      {/* Cover */}
      <div className="h-24 bg-gradient-to-br from-[#0a66c2] via-[#0369a1] to-[#075985] relative">
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 30% 20%, white 1px, transparent 1px)", backgroundSize: "18px 18px" }} />
      </div>
      {/* Avatar */}
      <div className="px-5 pb-5">
        <div className="relative -mt-10 mb-3">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#FF6321] to-amber-500 border-4 border-white dark:border-[#1b1f23] flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            {(name || "Y")[0].toUpperCase()}
          </div>
        </div>
        <div className="text-[15px] font-bold text-[#111827] dark:text-white">{name || "Your Name"}</div>
        <p className="text-[13px] text-[#374151] dark:text-[#d1d5db] mt-1 leading-snug whitespace-pre-wrap">
          {headline || `${title || "Your title"} · Add a headline`}
        </p>
        <p className="text-[11px] text-[#6b7280] mt-2 flex items-center gap-1">
          <Linkedin size={11} className="text-[#0a66c2]" /> linkedin.com/in/preview
        </p>
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-[12px] font-semibold uppercase tracking-wide text-[#6b7280] mb-2">About</p>
          <p className="text-[12.5px] text-[#374151] dark:text-[#d1d5db] leading-relaxed whitespace-pre-wrap line-clamp-6">
            {about || "Your about section preview will appear here…"}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function LinkedInBioGenerator() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"input" | "generating" | "result">("input");
  const [loadingStepIdx, setLoadingStepIdx] = useState(0);

  const [tone, setTone] = useState("Professional");
  const [industry, setIndustry] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [useEmojis, setUseEmojis] = useState(false);

  const [manualMode, setManualMode] = useState(false);
  const [savedResumes, setSavedResumes] = useState<any[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<string>("");
  const [loadingResumes, setLoadingResumes] = useState(true);

  const [bio, setBio] = useState<LinkedInBio | null>(null);
  const [pickedHeadlineIdx, setPickedHeadlineIdx] = useState(0);
  const [editableAbout, setEditableAbout] = useState("");
  const [editableHeadline, setEditableHeadline] = useState("");
  const [editableTagline, setEditableTagline] = useState("");
  const [editableCta, setEditableCta] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [manual, setManual] = useState({
    fullName: "", currentRole: "", skills: "", experience: "", education: "",
  });

  const displayName = useMemo(() => {
    if (!manualMode && selectedResumeId) {
      const r = savedResumes.find((x) => x.id === selectedResumeId);
      return r?.resume_data?.header?.fullName || r?.user_data?.fullName || "";
    }
    return manual.fullName;
  }, [manualMode, selectedResumeId, savedResumes, manual.fullName]);

  const displayTitle = useMemo(() => {
    if (!manualMode && selectedResumeId) {
      const r = savedResumes.find((x) => x.id === selectedResumeId);
      return r?.resume_data?.header?.title || r?.job_title || "";
    }
    return manual.currentRole;
  }, [manualMode, selectedResumeId, savedResumes, manual.currentRole]);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { navigate({ to: "/login" }); return; }
      const { data } = await supabase
        .from("saved_resumes")
        .select("id, title, job_title, resume_data, user_data")
        .eq("user_id", session.user.id)
        .order("updated_at", { ascending: false });
      setSavedResumes(data ?? []);
      if (data && data.length > 0) setSelectedResumeId(data[0].id);
      else setManualMode(true);
      setLoadingResumes(false);
    });
  }, []);

  useEffect(() => {
    if (step !== "generating") return;
    setLoadingStepIdx(0);
    const iv = setInterval(() => {
      setLoadingStepIdx((i) => (i + 1) % LOADING_STEPS.length);
    }, 1600);
    return () => clearInterval(iv);
  }, [step]);

  async function handleGenerate() {
    setError(null);
    setStep("generating");

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { navigate({ to: "/login" }); return; }

    let resumeData: ResumeData | null = null;
    let userData: UserData | null = null;

    if (!manualMode && selectedResumeId) {
      const found = savedResumes.find((r) => r.id === selectedResumeId);
      if (found) {
        resumeData = found.resume_data;
        userData = found.user_data;
      }
    } else {
      resumeData = {
        header: { fullName: manual.fullName, title: manual.currentRole, contactInfo: "" },
        summary: "",
        experience: manual.experience.split("\n").filter(Boolean).map((line) => ({
          title: line, company: "", dateRange: "", bullets: [],
        })),
        education: manual.education ? [{ degree: manual.education, institution: "", dateRange: "" }] : [],
        skills: manual.skills ? [{ category: "Skills", items: manual.skills.split(",").map((s) => s.trim()) }] : [],
      };
    }

    try {
      const res = await fetch("/api/generate-linkedin-bio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ resumeData, userData, tone, industry, targetAudience, useEmojis }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");

      const variants: string[] = Array.isArray(data.headline_variants) && data.headline_variants.length
        ? data.headline_variants
        : [data.headline].filter(Boolean);

      setBio({ ...data, headline_variants: variants });
      setPickedHeadlineIdx(0);
      setEditableHeadline(variants[0] || "");
      setEditableAbout(data.about || "");
      setEditableTagline(data.tagline || "");
      setEditableCta(data.cta || "");
      setStep("result");
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
      setStep("input");
    }
  }

  function pickHeadline(idx: number) {
    if (!bio?.headline_variants) return;
    setPickedHeadlineIdx(idx);
    setEditableHeadline(bio.headline_variants[idx]);
  }

  function downloadTxt() {
    const content = `LINKEDIN PROFILE — ${displayName || "You"}

HEADLINE
${editableHeadline}

ABOUT
${editableAbout}

BANNER TAGLINE
${editableTagline}

CALL TO ACTION
${editableCta}

SKILLS TO ADD
${(bio?.skills_to_add || []).join(", ")}

RECRUITER KEYWORDS
${(bio?.keywords || []).join(", ")}
`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `linkedin-bio-${(displayName || "profile").toLowerCase().replace(/\s+/g, "-")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-background pt-app-header">
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a66c2]/10 via-transparent to-[#FF6321]/10" aria-hidden />
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-[#0a66c2]/20 blur-3xl" aria-hidden />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-[#FF6321]/20 blur-3xl" aria-hidden />
        <div className="relative max-w-5xl mx-auto px-6 py-14 text-center">
          <div className="inline-flex items-center gap-2 bg-[#0a66c2]/10 text-[#0a66c2] text-[12px] font-semibold px-4 py-2 rounded-full mb-4 border border-[#0a66c2]/20">
            <Linkedin size={14} /> AI LinkedIn Profile Studio
          </div>
          <h1 className="text-[34px] sm:text-[44px] font-bold text-foreground tracking-tight mb-3 text-balance">
            A LinkedIn profile that{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6321] to-amber-500">recruiters can't scroll past</span>
          </h1>
          <p className="text-[15px] text-muted-foreground max-w-2xl mx-auto">
            3 headline variants, a recruiter-optimized About section, banner tagline, keyword list, and pro tips — all generated from your resume.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <AnimatePresence mode="wait">

          {/* ================= INPUT ================= */}
          {step === "input" && (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="grid lg:grid-cols-[1fr_360px] gap-6"
            >
              <div className="space-y-4">
                {/* 1. Source */}
                <section className="bg-card border border-border rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-7 h-7 rounded-lg bg-[#FF6321]/10 text-[#FF6321] flex items-center justify-center text-[13px] font-bold">1</div>
                    <h2 className="text-[15px] font-semibold text-foreground">Resume source</h2>
                  </div>

                  {loadingResumes ? (
                    <div className="h-10 bg-muted rounded-xl animate-pulse" />
                  ) : savedResumes.length > 0 ? (
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <button
                          onClick={() => setManualMode(false)}
                          className={clsx(
                            "flex-1 py-2.5 px-4 rounded-xl text-[13px] font-medium border transition-all",
                            !manualMode
                              ? "bg-[#FF6321] text-white border-[#FF6321]"
                              : "border-border text-foreground hover:border-[#FF6321]"
                          )}
                        >
                          Use Saved Resume ({savedResumes.length})
                        </button>
                        <button
                          onClick={() => setManualMode(true)}
                          className={clsx(
                            "flex-1 py-2.5 px-4 rounded-xl text-[13px] font-medium border transition-all",
                            manualMode
                              ? "bg-[#FF6321] text-white border-[#FF6321]"
                              : "border-border text-foreground hover:border-[#FF6321]"
                          )}
                        >
                          Enter Manually
                        </button>
                      </div>

                      {!manualMode && (
                        <div className="relative">
                          <select
                            value={selectedResumeId}
                            onChange={(e) => setSelectedResumeId(e.target.value)}
                            className="w-full appearance-none bg-background border border-border rounded-xl px-4 py-3 text-[14px] text-foreground focus:outline-none focus:border-[#FF6321] pr-10"
                          >
                            {savedResumes.map((r) => (
                              <option key={r.id} value={r.id}>{r.title}</option>
                            ))}
                          </select>
                          <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                        </div>
                      )}
                    </div>
                  ) : null}

                  {manualMode && (
                    <div className="space-y-3 mt-3">
                      {[
                        { key: "fullName",    label: "Full Name",           placeholder: "Ali Hussain" },
                        { key: "currentRole", label: "Current Role / Title", placeholder: "Full Stack Developer" },
                        { key: "skills",      label: "Top Skills (comma separated)", placeholder: "React, Node.js, TypeScript, AWS" },
                        { key: "education",   label: "Education",           placeholder: "BS Computer Science, FAST NUCES" },
                      ].map(({ key, label, placeholder }) => (
                        <div key={key}>
                          <label className="text-[12px] font-medium text-foreground mb-1 block">{label}</label>
                          <input
                            type="text"
                            placeholder={placeholder}
                            value={manual[key as keyof typeof manual]}
                            onChange={(e) => setManual((p) => ({ ...p, [key]: e.target.value }))}
                            className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-[14px] focus:outline-none focus:border-[#FF6321]"
                          />
                        </div>
                      ))}
                      <div>
                        <label className="text-[12px] font-medium text-foreground mb-1 block">Experience (one role per line)</label>
                        <textarea
                          rows={3}
                          placeholder={"Senior Dev at Google, 2022-2024\nFrontend Engineer at Meta, 2020-2022"}
                          value={manual.experience}
                          onChange={(e) => setManual((p) => ({ ...p, experience: e.target.value }))}
                          className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-[14px] focus:outline-none focus:border-[#FF6321] resize-none"
                        />
                      </div>
                    </div>
                  )}
                </section>

                {/* 2. Tone */}
                <section className="bg-card border border-border rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-7 h-7 rounded-lg bg-[#FF6321]/10 text-[#FF6321] flex items-center justify-center text-[13px] font-bold">2</div>
                    <h2 className="text-[15px] font-semibold text-foreground">Voice & tone</h2>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {TONES.map((t) => {
                      const Icon = t.icon;
                      const active = tone === t.id;
                      return (
                        <button
                          key={t.id}
                          onClick={() => setTone(t.id)}
                          className={clsx(
                            "text-left px-4 py-3 rounded-xl border transition-all flex items-start gap-3",
                            active
                              ? "border-[#FF6321] bg-[#FF6321]/5 shadow-sm"
                              : "border-border hover:border-[#FF6321]/50"
                          )}
                        >
                          <div className={clsx(
                            "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                            active ? "bg-[#FF6321] text-white" : "bg-muted text-muted-foreground"
                          )}>
                            <Icon size={15} />
                          </div>
                          <div>
                            <div className="text-[13px] font-semibold text-foreground">{t.label}</div>
                            <div className="text-[11px] text-muted-foreground mt-0.5">{t.desc}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </section>

                {/* 3. Targeting */}
                <section className="bg-card border border-border rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-7 h-7 rounded-lg bg-[#FF6321]/10 text-[#FF6321] flex items-center justify-center text-[13px] font-bold">3</div>
                    <h2 className="text-[15px] font-semibold text-foreground">Targeting <span className="font-normal text-muted-foreground text-[12px]">(optional but recommended)</span></h2>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[12px] font-medium text-foreground mb-1 flex items-center gap-1.5">
                        <Building2 size={12} /> Industry
                      </label>
                      <div className="relative">
                        <select
                          value={industry}
                          onChange={(e) => setIndustry(e.target.value)}
                          className="w-full appearance-none bg-background border border-border rounded-xl px-4 py-2.5 text-[14px] focus:outline-none focus:border-[#FF6321] pr-10"
                        >
                          <option value="">Any / Not specified</option>
                          {INDUSTRIES.map((i) => <option key={i}>{i}</option>)}
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <label className="text-[12px] font-medium text-foreground mb-1 flex items-center gap-1.5">
                        <Target size={12} /> Target Audience
                      </label>
                      <input
                        type="text"
                        value={targetAudience}
                        onChange={(e) => setTargetAudience(e.target.value)}
                        placeholder="e.g. FAANG recruiters, YC founders, agency CMOs"
                        className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-[14px] focus:outline-none focus:border-[#FF6321]"
                      />
                    </div>
                  </div>

                  <label className="mt-4 flex items-center gap-3 px-4 py-3 rounded-xl border border-border bg-background cursor-pointer hover:border-[#FF6321] transition-all">
                    <input
                      type="checkbox"
                      checked={useEmojis}
                      onChange={(e) => setUseEmojis(e.target.checked)}
                      className="accent-[#FF6321] w-4 h-4"
                    />
                    <Smile size={16} className="text-[#FF6321]" />
                    <div>
                      <div className="text-[13px] font-medium text-foreground">Sprinkle emojis in About</div>
                      <div className="text-[11px] text-muted-foreground">Adds 3-5 tasteful emojis for visual rhythm</div>
                    </div>
                  </label>
                </section>

                {error && (
                  <div className="flex items-center gap-2 text-red-600 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-xl px-4 py-3 text-[13px]">
                    <AlertCircle size={15} /> {error}
                  </div>
                )}

                <button
                  onClick={handleGenerate}
                  disabled={manualMode && !manual.fullName}
                  className="w-full flex items-center justify-center gap-2 bg-[#FF6321] text-white font-bold text-[15px] py-4 rounded-2xl hover:bg-[#ea580c] hover:shadow-lg hover:shadow-orange-500/25 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                  <Sparkles size={18} /> Generate LinkedIn Profile <ArrowRight size={16} />
                </button>
              </div>

              {/* Live preview sidebar */}
              <aside className="hidden lg:block">
                <div className="sticky top-24 space-y-3">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                    <Camera size={12} /> Live preview
                  </p>
                  <LinkedInPreview
                    name={displayName}
                    title={displayTitle}
                    headline=""
                    about=""
                  />
                  <p className="text-[11px] text-muted-foreground text-center">
                    Your generated headline & About will render here.
                  </p>
                </div>
              </aside>
            </motion.div>
          )}

          {/* ================= GENERATING ================= */}
          {step === "generating" && (
            <motion.div
              key="generating"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-24 text-center"
            >
              <div className="relative w-20 h-20 mb-8">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#0a66c2] to-[#075985] animate-pulse" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Linkedin size={34} className="text-white" />
                </div>
                <div className="absolute -inset-3 rounded-3xl border-2 border-[#FF6321]/30 animate-ping" />
              </div>

              <AnimatePresence mode="wait">
                {LOADING_STEPS.map((s, i) => {
                  if (i !== loadingStepIdx) return null;
                  const Icon = s.icon;
                  return (
                    <motion.div
                      key={s.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-2.5 text-[15px] font-semibold text-foreground mb-2"
                    >
                      <Icon size={17} className="text-[#FF6321]" /> {s.label}
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              <div className="flex gap-1.5 mt-6">
                {LOADING_STEPS.map((_, i) => (
                  <div
                    key={i}
                    className={clsx(
                      "h-1.5 rounded-full transition-all duration-500",
                      i <= loadingStepIdx ? "w-8 bg-[#FF6321]" : "w-4 bg-muted"
                    )}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* ================= RESULT ================= */}
          {step === "result" && bio && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              className="grid lg:grid-cols-[1fr_360px] gap-6"
            >
              <div className="space-y-4">
                {/* Toolbar */}
                <div className="flex items-center justify-between flex-wrap gap-3 sticky top-[68px] z-10 bg-background/80 backdrop-blur-md py-3 -mx-6 px-6 border-b border-border">
                  <h2 className="text-[18px] font-bold text-foreground flex items-center gap-2">
                    <Sparkles size={18} className="text-[#FF6321]" /> Your LinkedIn Profile
                  </h2>
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => setStep("input")}
                      className="flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5 rounded-lg border border-border hover:border-[#FF6321] hover:text-[#FF6321] transition-all"
                    >
                      <RefreshCw size={12} /> Regenerate
                    </button>
                    <button
                      onClick={downloadTxt}
                      className="flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5 rounded-lg border border-border hover:border-[#FF6321] hover:text-[#FF6321] transition-all"
                    >
                      <Download size={12} /> Download .txt
                    </button>
                    <CopyButton
                      label="Copy all"
                      text={`HEADLINE:\n${editableHeadline}\n\nABOUT:\n${editableAbout}\n\nTAGLINE:\n${editableTagline}\n\nCTA:\n${editableCta}`}
                    />
                  </div>
                </div>

                {/* Headline variants */}
                {bio.headline_variants && bio.headline_variants.length > 1 && (
                  <div className="bg-card border border-border rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Tag size={15} className="text-[#0a66c2]" />
                      <span className="text-[13px] font-semibold text-foreground">Pick a headline</span>
                      <span className="text-[11px] text-muted-foreground">{bio.headline_variants.length} variants</span>
                    </div>
                    <div className="space-y-2">
                      {bio.headline_variants.map((h, i) => (
                        <button
                          key={i}
                          onClick={() => pickHeadline(i)}
                          className={clsx(
                            "w-full text-left px-4 py-3 rounded-xl border transition-all",
                            i === pickedHeadlineIdx
                              ? "border-[#FF6321] bg-[#FF6321]/5"
                              : "border-border hover:border-[#FF6321]/50"
                          )}
                        >
                          <div className="flex items-center justify-between gap-3 mb-1">
                            <span className={clsx(
                              "text-[10px] font-bold uppercase tracking-widest",
                              i === pickedHeadlineIdx ? "text-[#FF6321]" : "text-muted-foreground"
                            )}>
                              Variant {i + 1}
                              {i === pickedHeadlineIdx && " · Selected"}
                            </span>
                            <CharMeter value={h.length} max={HEADLINE_MAX} />
                          </div>
                          <p className="text-[13.5px] text-foreground leading-snug">{h}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <EditableBlock
                  icon={<Tag size={15} className="text-[#0a66c2]" />}
                  label="Headline"
                  value={editableHeadline}
                  onChange={setEditableHeadline}
                  max={HEADLINE_MAX}
                  rows={2}
                />

                <EditableBlock
                  icon={<User size={15} className="text-[#0a66c2]" />}
                  label="About Section"
                  value={editableAbout}
                  onChange={setEditableAbout}
                  max={ABOUT_MAX}
                  rows={10}
                />

                <EditableBlock
                  icon={<Zap size={15} className="text-[#FF6321]" />}
                  label="Banner Tagline"
                  value={editableTagline}
                  onChange={setEditableTagline}
                  max={120}
                  rows={2}
                />

                <EditableBlock
                  icon={<ArrowRight size={15} className="text-green-600" />}
                  label="Call to Action"
                  value={editableCta}
                  onChange={setEditableCta}
                  max={200}
                  rows={2}
                />

                {/* Skills */}
                <div className="bg-card border border-border rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-[13px] font-semibold text-foreground">
                      <Briefcase size={15} className="text-purple-600" /> Skills to add on LinkedIn
                    </div>
                    <CopyButton text={(bio.skills_to_add || []).join(", ")} />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(bio.skills_to_add || []).map((skill) => (
                      <span key={skill} className="bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300 text-[12px] font-medium px-3 py-1 rounded-full border border-purple-200 dark:border-purple-900">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Keywords */}
                {bio.keywords && bio.keywords.length > 0 && (
                  <div className="bg-card border border-border rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2 text-[13px] font-semibold text-foreground">
                        <Search size={15} className="text-[#0a66c2]" /> Recruiter search keywords
                      </div>
                      <CopyButton text={bio.keywords.join(", ")} />
                    </div>
                    <p className="text-[12px] text-muted-foreground mb-3">
                      Sprinkle these across your headline, About, and job titles so recruiter searches surface your profile.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {bio.keywords.map((k) => (
                        <span key={k} className="bg-[#0a66c2]/10 text-[#0a66c2] text-[12px] font-medium px-3 py-1 rounded-full border border-[#0a66c2]/20">
                          #{k}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tips */}
                {bio.profile_tips && bio.profile_tips.length > 0 && (
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border border-amber-200 dark:border-amber-900/50 rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-3 text-[13px] font-semibold text-foreground">
                      <Lightbulb size={15} className="text-amber-600" /> Profile pro-tips
                    </div>
                    <ul className="space-y-2">
                      {bio.profile_tips.map((t, i) => (
                        <li key={i} className="flex items-start gap-2 text-[13px] text-foreground leading-relaxed">
                          <span className="w-5 h-5 shrink-0 rounded-full bg-amber-500 text-white text-[11px] font-bold flex items-center justify-center mt-0.5">
                            {i + 1}
                          </span>
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* CTA to LinkedIn */}
                <div className="bg-[#0a66c2] rounded-2xl px-6 py-5 flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <p className="text-white font-semibold text-[15px]">Update your LinkedIn profile</p>
                    <p className="text-[#bfdbfe] text-[13px] mt-0.5">Copy each section into the LinkedIn Profile Editor.</p>
                  </div>
                  <a
                    href="https://www.linkedin.com/in/edit/intro/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-white text-[#0a66c2] font-bold text-[13px] px-4 py-2.5 rounded-xl hover:bg-blue-50 transition-colors no-underline"
                  >
                    <Linkedin size={15} /> Open LinkedIn
                  </a>
                </div>
              </div>

              {/* Live preview sidebar */}
              <aside className="hidden lg:block">
                <div className="sticky top-24 space-y-3">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                    <Camera size={12} /> Live preview
                  </p>
                  <LinkedInPreview
                    name={displayName}
                    title={displayTitle}
                    headline={editableHeadline}
                    about={editableAbout}
                  />
                  <p className="text-[11px] text-muted-foreground text-center">
                    Preview updates as you edit each block.
                  </p>
                </div>
              </aside>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Internal link */}
      <div className="max-w-3xl mx-auto px-6 pb-12">
        <div className="bg-gradient-to-br from-[#FFF7ED] to-orange-50 dark:from-orange-950/20 dark:to-amber-950/20 border border-orange-200 dark:border-orange-900/50 rounded-2xl p-6 text-center">
          <p className="text-[15px] font-semibold text-foreground mb-1">
            Want a resume that matches your new LinkedIn?
          </p>
          <p className="text-[13px] text-muted-foreground mb-4">
            Build an ATS-ready resume with AI in under 5 minutes — tailored to any job.
          </p>
          <a
            href="/resume"
            className="inline-flex items-center gap-1.5 text-[13px] font-bold text-white bg-[#FF6321] hover:bg-[#ea580c] px-5 py-2.5 rounded-xl transition-colors no-underline"
          >
            Build my resume <ArrowRight size={14} />
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/linkedin-bio")({
  head: () => ({
    meta: [
      { title: "LinkedIn Bio Generator — AI Headline, About & Keywords | airesumi.com" },
      { name: "description", content: "Generate a recruiter-optimized LinkedIn headline, About section, banner tagline and keyword list from your resume. Free AI LinkedIn profile writer." },
      { property: "og:title", content: "AI LinkedIn Bio Generator | airesumi.com" },
      { property: "og:description", content: "3 headline variants, About section, banner tagline, and recruiter keywords — generated from your resume." },
      { property: "og:url", content: "https://airesumi.com/linkedin-bio" },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://airesumi.com/api/public/og/linkedin-bio" },
      { name: "twitter:image", content: "https://airesumi.com/api/public/og/linkedin-bio" },
      { name: "twitter:title", content: "AI LinkedIn Bio Generator | airesumi.com" },
      { name: "twitter:description", content: "3 headline variants, About section, banner tagline, and recruiter keywords — generated from your resume." },
    ],
    links: [{ rel: "canonical", href: "https://airesumi.com/linkedin-bio" }],
  }),
  component: () => (<><LinkedInBioGenerator /><ToolContentSection {...LINKEDIN_CONTENT} /></>),
});
