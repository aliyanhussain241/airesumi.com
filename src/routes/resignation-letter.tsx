import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BlogHighlights } from "@/app/components/BlogHighlights";
import {
  FileText, Sparkles, Copy, Check, RefreshCw, AlertCircle, Download,
  Calendar, Mail, Briefcase, User, Heart, Zap, Clock, ChevronRight,
  Info, Wand2, ShieldCheck, Building2, ArrowRight
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import jsPDF from "jspdf";
import { ToolContentSection } from "../app/components/ToolContentSection";
import { RESIGNATION_CONTENT } from "../app/components/toolContent";
import { toolSchemaScripts } from "@/lib/tool-schemas";

const TONES = [
  { id: "Professional", desc: "Formal, corporate", icon: Briefcase },
  { id: "Warm", desc: "Friendly, grateful", icon: Heart },
  { id: "Brief", desc: "Short and direct", icon: Zap },
  { id: "Heartfelt", desc: "Personal, emotional", icon: Mail },
];

const NOTICE_PERIODS = [
  { label: "2 weeks", days: 14 },
  { label: "1 month", days: 30 },
  { label: "2 months", days: 60 },
  { label: "3 months", days: 90 },
];

const REASON_PRESETS = [
  "New career opportunity",
  "Career growth",
  "Relocation",
  "Personal reasons",
  "Further education",
  "Career change",
  "Family commitments",
  "Health reasons",
];

const LOADER_STEPS = [
  { label: "Analyzing your details", icon: FileText },
  { label: "Crafting professional tone", icon: Wand2 },
  { label: "Adding gratitude & transition offer", icon: Heart },
  { label: "Polishing final draft", icon: Sparkles },
];

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={async () => { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      aria-label="Copy letter"
      className="flex items-center gap-1.5 text-[13px] font-medium px-3 py-2 rounded-lg border border-border hover:border-[#FF6321] hover:text-[#FF6321] transition-all bg-background">
      {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

function AnimatedLoader() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setStep(s => (s + 1) % LOADER_STEPS.length), 900);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="flex flex-col gap-2.5 py-2">
      {LOADER_STEPS.map((s, i) => {
        const active = i === step;
        const done = i < step;
        const Icon = s.icon;
        return (
          <div key={s.label} className={`flex items-center gap-3 text-[13px] transition-all ${active ? "text-[#FF6321]" : done ? "text-green-600" : "text-muted-foreground opacity-60"}`}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center border ${active ? "border-[#FF6321] bg-orange-50 dark:bg-orange-950/40" : done ? "border-green-500 bg-green-50 dark:bg-green-950/40" : "border-border"}`}>
              {done ? <Check size={14} /> : <Icon size={13} className={active ? "animate-pulse" : ""} />}
            </div>
            <span className="font-medium">{s.label}{active && "..."}</span>
          </div>
        );
      })}
    </div>
  );
}

function ResignationLetterPage() {
  const navigate = useNavigate();
  const [yourName, setYourName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [managerName, setManagerName] = useState("");
  const [lastDay, setLastDay] = useState("");
  const [reason, setReason] = useState("");
  const [highlights, setHighlights] = useState("");
  const [tone, setTone] = useState("Professional");
  const [letter, setLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) navigate({ to: "/login" });
    });
  }, []);

  const completion = useMemo(() => {
    const fields = [yourName, jobTitle, companyName, managerName, lastDay, reason];
    return Math.round((fields.filter(Boolean).length / fields.length) * 100);
  }, [yourName, jobTitle, companyName, managerName, lastDay, reason]);

  function setNotice(days: number) {
    const d = new Date();
    d.setDate(d.getDate() + days);
    setLastDay(d.toISOString().slice(0, 10));
  }

  async function handleGenerate() {
    if (!yourName.trim() || !companyName.trim()) {
      setError("Please enter your name and company name");
      return;
    }
    setError(null);
    setLoading(true);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { navigate({ to: "/login" }); return; }

    try {
      const res = await fetch("/api/generate-resignation", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ yourName, jobTitle, companyName, managerName, lastDay, reason, tone, highlights }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setLetter(data.letter);
      setTimeout(() => {
        document.getElementById("letter-preview")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleDownloadPDF() {
    const pdf = new jsPDF("p", "pt", "a4");
    const margin = 60;
    const pageWidth = pdf.internal.pageSize.getWidth();
    const maxWidth = pageWidth - margin * 2;

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(11);
    const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    pdf.text(today, pageWidth - margin, margin, { align: "right" });

    if (yourName) {
      pdf.setFontSize(12);
      pdf.text(yourName, margin, margin + 30);
      if (jobTitle) pdf.text(jobTitle, margin, margin + 46);
    }

    pdf.setFontSize(12);
    const lines = pdf.splitTextToSize(letter, maxWidth);
    pdf.text(lines, margin, margin + 90);

    pdf.save(`${(yourName || "resignation").replace(/\s+/g, "_")}_Resignation_Letter.pdf`);
  }

  const previewDate = lastDay
    ? new Date(lastDay).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : "your last day";

  return (
    <div className="min-h-screen bg-background pt-[68px]">
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50/60 via-transparent to-transparent dark:from-orange-950/20 pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#FF6321]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-6 py-10 md:py-14">
          <div className="inline-flex items-center gap-2 bg-orange-100/70 dark:bg-orange-950/40 text-[#EA580C] text-[12px] font-semibold px-3 py-1.5 rounded-full mb-4">
            <FileText size={13} /> AI Resignation Letter Generator
          </div>
          <h1 className="text-[34px] md:text-[44px] font-bold text-foreground tracking-tight leading-[1.1] mb-3">
            Leave on <span className="text-[#FF6321]">good terms.</span><br className="hidden md:block" />
            <span className="text-muted-foreground text-[26px] md:text-[32px] font-semibold">Write your resignation in 30 seconds.</span>
          </h1>
          <p className="text-[15px] text-muted-foreground max-w-xl mb-5">
            Professional, warm, or brief — pick a tone, add your details, and download a polished PDF ready to send to HR.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-[12px] text-muted-foreground">
            <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-green-500" /> Private — never stored</span>
            <span className="flex items-center gap-1.5"><Sparkles size={14} className="text-[#FF6321]" /> AI-crafted</span>
            <span className="flex items-center gap-1.5"><Download size={14} /> Instant PDF</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 grid lg:grid-cols-[1fr_1.05fr] gap-6">

        {/* LEFT — Form */}
        <div className="space-y-4">
          {/* Progress card */}
          <div className="bg-card border border-border rounded-2xl p-4 flex items-center gap-4">
            <div className="relative w-12 h-12 shrink-0">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                <circle cx="18" cy="18" r="15.5" fill="none" className="stroke-muted" strokeWidth="3" />
                <circle cx="18" cy="18" r="15.5" fill="none" stroke="#FF6321" strokeWidth="3" strokeLinecap="round"
                  strokeDasharray={`${(completion / 100) * 97.4} 97.4`} className="transition-all duration-500" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-foreground">{completion}%</div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-foreground">Letter completion</p>
              <p className="text-[12px] text-muted-foreground">Fill in the details for a better letter</p>
            </div>
          </div>

          {/* You */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-orange-100 dark:bg-orange-950/40 flex items-center justify-center"><User size={14} className="text-[#FF6321]" /></div>
              <h2 className="text-[14px] font-semibold text-foreground">About you</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-medium text-muted-foreground mb-1.5 block uppercase tracking-wide">Your name *</label>
                <input value={yourName} onChange={e => setYourName(e.target.value)} placeholder="Ali Hussain"
                  className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-[14px] focus:outline-none focus:border-[#FF6321] focus:ring-2 focus:ring-[#FF6321]/15 transition-all" />
              </div>
              <div>
                <label className="text-[11px] font-medium text-muted-foreground mb-1.5 block uppercase tracking-wide">Job title</label>
                <input value={jobTitle} onChange={e => setJobTitle(e.target.value)} placeholder="Senior Developer"
                  className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-[14px] focus:outline-none focus:border-[#FF6321] focus:ring-2 focus:ring-[#FF6321]/15 transition-all" />
              </div>
            </div>
          </div>

          {/* Company */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-orange-100 dark:bg-orange-950/40 flex items-center justify-center"><Building2 size={14} className="text-[#FF6321]" /></div>
              <h2 className="text-[14px] font-semibold text-foreground">Company & manager</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-medium text-muted-foreground mb-1.5 block uppercase tracking-wide">Company name *</label>
                <input value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="Acme Inc."
                  className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-[14px] focus:outline-none focus:border-[#FF6321] focus:ring-2 focus:ring-[#FF6321]/15 transition-all" />
              </div>
              <div>
                <label className="text-[11px] font-medium text-muted-foreground mb-1.5 block uppercase tracking-wide">Manager's name</label>
                <input value={managerName} onChange={e => setManagerName(e.target.value)} placeholder="Sarah Khan"
                  className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-[14px] focus:outline-none focus:border-[#FF6321] focus:ring-2 focus:ring-[#FF6321]/15 transition-all" />
              </div>
            </div>
          </div>

          {/* Notice period */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-orange-100 dark:bg-orange-950/40 flex items-center justify-center"><Clock size={14} className="text-[#FF6321]" /></div>
              <h2 className="text-[14px] font-semibold text-foreground">Notice period</h2>
            </div>
            <div className="grid grid-cols-4 gap-2 mb-3">
              {NOTICE_PERIODS.map(n => (
                <button key={n.label} onClick={() => setNotice(n.days)}
                  className="text-[12px] font-medium px-2 py-2 rounded-lg border border-border hover:border-[#FF6321] hover:bg-orange-50 dark:hover:bg-orange-950/30 hover:text-[#FF6321] transition-all">
                  {n.label}
                </button>
              ))}
            </div>
            <div>
              <label className="text-[11px] font-medium text-muted-foreground mb-1.5 block uppercase tracking-wide">Last working day</label>
              <div className="relative">
                <Calendar size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <input type="date" value={lastDay} onChange={e => setLastDay(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl pl-9 pr-3.5 py-2.5 text-[14px] focus:outline-none focus:border-[#FF6321] focus:ring-2 focus:ring-[#FF6321]/15 transition-all" />
              </div>
            </div>
          </div>

          {/* Reason */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-orange-100 dark:bg-orange-950/40 flex items-center justify-center"><Info size={14} className="text-[#FF6321]" /></div>
              <h2 className="text-[14px] font-semibold text-foreground">Reason & highlights <span className="font-normal text-muted-foreground">(optional)</span></h2>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {REASON_PRESETS.map(r => (
                <button key={r} onClick={() => setReason(r)}
                  className={`text-[11.5px] px-2.5 py-1 rounded-full border transition-all ${reason === r ? "bg-[#FF6321] text-white border-[#FF6321]" : "border-border hover:border-[#FF6321] hover:text-[#FF6321]"}`}>
                  {r}
                </button>
              ))}
            </div>
            <input value={reason} onChange={e => setReason(e.target.value)} placeholder="Custom reason (or pick above)"
              className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-[14px] mb-3 focus:outline-none focus:border-[#FF6321] focus:ring-2 focus:ring-[#FF6321]/15 transition-all" />
            <textarea value={highlights} onChange={e => setHighlights(e.target.value)} rows={2}
              placeholder="Positive highlights: e.g. amazing team, learned a lot, proud of X project"
              className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-[14px] focus:outline-none focus:border-[#FF6321] focus:ring-2 focus:ring-[#FF6321]/15 transition-all resize-none" />
          </div>

          {/* Tone */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-orange-100 dark:bg-orange-950/40 flex items-center justify-center"><Wand2 size={14} className="text-[#FF6321]" /></div>
              <h2 className="text-[14px] font-semibold text-foreground">Tone</h2>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {TONES.map(t => {
                const Icon = t.icon;
                const active = tone === t.id;
                return (
                  <button key={t.id} onClick={() => setTone(t.id)}
                    className={`text-left px-3 py-3 rounded-xl border transition-all ${active ? "border-[#FF6321] bg-orange-50 dark:bg-orange-950/30 shadow-sm" : "border-border hover:border-[#FF6321]/50"}`}>
                    <div className="flex items-center gap-2 mb-0.5">
                      <Icon size={13} className={active ? "text-[#FF6321]" : "text-muted-foreground"} />
                      <span className="text-[13px] font-semibold text-foreground">{t.id}</span>
                    </div>
                    <div className="text-[11px] text-muted-foreground">{t.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-xl px-4 py-3 text-[13px]">
              <AlertCircle size={15} /> {error}
            </div>
          )}

          <button onClick={handleGenerate} disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-[#FF6321] text-white font-bold text-[15px] py-4 rounded-2xl hover:bg-[#ea580c] hover:shadow-xl hover:shadow-orange-500/25 hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0">
            {loading
              ? <><RefreshCw size={18} className="animate-spin" /> Writing your letter...</>
              : <><Sparkles size={18} /> Generate Resignation Letter <ArrowRight size={16} /></>}
          </button>
        </div>

        {/* RIGHT — Live preview (sticky) */}
        <div className="lg:sticky lg:top-[84px] lg:self-start" id="letter-preview">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <h3 className="text-[13px] font-semibold text-foreground">Live preview</h3>
            </div>
            {letter && (
              <div className="flex gap-2">
                <button onClick={handleDownloadPDF} aria-label="Download PDF"
                  className="flex items-center gap-1.5 text-[12px] font-medium px-3 py-2 rounded-lg bg-foreground text-background hover:opacity-90 transition-all">
                  <Download size={13} /> PDF
                </button>
                <CopyBtn text={letter} />
                <button onClick={handleGenerate} aria-label="Regenerate"
                  className="flex items-center gap-1.5 text-[12px] font-medium px-3 py-2 rounded-lg border border-border hover:border-[#FF6321] hover:text-[#FF6321] transition-all">
                  <RefreshCw size={13} />
                </button>
              </div>
            )}
          </div>

          <div className="relative bg-white text-[#1f2937] border border-border rounded-2xl shadow-lg overflow-hidden">
            {/* paper texture header */}
            <div className="h-2 bg-gradient-to-r from-[#FF6321] via-orange-400 to-amber-300" />

            <div className="p-6 md:p-8 min-h-[560px] max-h-[70vh] overflow-y-auto">
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <AnimatedLoader />
                    <div className="mt-6 space-y-2">
                      {[90, 75, 85, 60, 80, 70].map((w, i) => (
                        <div key={i} className="h-3 rounded bg-gray-100 animate-pulse" style={{ width: `${w}%` }} />
                      ))}
                    </div>
                  </motion.div>
                ) : letter ? (
                  <motion.div key="letter" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        {yourName && <p className="text-[14px] font-semibold">{yourName}</p>}
                        {jobTitle && <p className="text-[12px] text-gray-500">{jobTitle}</p>}
                      </div>
                      <p className="text-[12px] text-gray-500">
                        {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                      </p>
                    </div>
                    <div className="whitespace-pre-wrap text-[14px] leading-[1.8] font-['Georgia',serif]">{letter}</div>
                  </motion.div>
                ) : (
                  <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col">
                    <div className="flex justify-between items-start mb-6 opacity-40">
                      <div>
                        <p className="text-[14px] font-semibold">{yourName || "Your Name"}</p>
                        <p className="text-[12px] text-gray-500">{jobTitle || "Your Title"}</p>
                      </div>
                      <p className="text-[12px] text-gray-500">
                        {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                      </p>
                    </div>
                    <div className="text-[13.5px] leading-[1.85] font-['Georgia',serif] text-gray-400 space-y-3">
                      <p>Dear {managerName || "[Manager's name]"},</p>
                      <p>I am writing to formally announce my resignation from {companyName || "[Company]"}, effective {previewDate}.</p>
                      <p>{highlights ? `${highlights}. ` : "Thank you for the opportunities for growth and development. "}It has been a pleasure working with the team.</p>
                      <p>I am committed to ensuring a smooth transition and will do everything I can to hand over my responsibilities.</p>
                      <p className="pt-2">Sincerely,<br />{yourName || "[Your name]"}</p>
                    </div>
                    <div className="mt-auto pt-6 flex items-center gap-2 text-[12px] text-gray-400">
                      <Sparkles size={13} /> AI will polish this once you click generate
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Tips */}
          <div className="mt-4 bg-card border border-border rounded-2xl p-4">
            <p className="text-[12px] font-semibold text-foreground mb-2 flex items-center gap-1.5">
              <Info size={13} className="text-[#FF6321]" /> Pro tips
            </p>
            <ul className="space-y-1.5 text-[12px] text-muted-foreground">
              <li className="flex gap-2"><ChevronRight size={12} className="mt-0.5 shrink-0 text-[#FF6321]" /> Deliver in person first, then email the letter</li>
              <li className="flex gap-2"><ChevronRight size={12} className="mt-0.5 shrink-0 text-[#FF6321]" /> Keep the tone positive — no complaints</li>
              <li className="flex gap-2"><ChevronRight size={12} className="mt-0.5 shrink-0 text-[#FF6321]" /> Offer to help with a smooth handover</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/resignation-letter")({
  head: () => ({
    meta: [
      { title: "Resignation Letter Generator — Professional & Free | airesumi.com" },
      { name: "description", content: "Generate a professional resignation letter in seconds. Choose your tone, add your details, and download as PDF. Leave your job on good terms." },
      { property: "og:title", content: "Free Resignation Letter Generator | airesumi.com" },
      { property: "og:description", content: "Generate a professional resignation letter in seconds. Free, AI-powered, downloadable as PDF." },
      { property: "og:url", content: "https://airesumi.com/resignation-letter" },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://airesumi.com/og-image.webp" },
      { name: "twitter:title", content: "Free Resignation Letter Generator | airesumi.com" },
      { name: "twitter:description", content: "Generate a professional resignation letter in seconds. Free, AI-powered, downloadable as PDF." },
    ],
    links: [{ rel: "canonical", href: "https://airesumi.com/resignation-letter" }],
    scripts: toolSchemaScripts(RESIGNATION_CONTENT),
  }),
  component: () => (
    <>
      <ResignationLetterPage />
      <ToolContentSection {...RESIGNATION_CONTENT} />
      <BlogHighlights posts={[
                { title: "How to Build a Resume with AI in 2026", href: "/blog/build-resume-with-ai" },
                { title: "How to Write a Cover Letter with AI", href: "/blog/how-to-write-cover-letter-with-ai" },
                { title: "AI Resume Builder for Career Change", href: "/blog/ai-resume-builder-for-career-change" },
              ]} />
    </>
  ),
});
