import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FileText, Sparkles, Copy, Check, RefreshCw, AlertCircle, Download, ChevronDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import jsPDF from "jspdf";
import { ToolContentSection } from "../app/components/ToolContentSection";
import { RESIGNATION_CONTENT } from "../app/components/toolContent";

const TONES = [
  { id: "Professional", desc: "Formal, corporate" },
  { id: "Warm", desc: "Friendly, grateful" },
  { id: "Brief", desc: "Short and direct" },
  { id: "Heartfelt", desc: "Personal, emotional" },
];

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={async () => { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="flex items-center gap-1.5 text-[13px] font-medium px-3 py-2 rounded-lg border border-[#e5e7eb] hover:border-[#FF6321] hover:text-[#FF6321] transition-all">
      {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
      {copied ? "Copied!" : "Copy"}
    </button>
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
    pdf.setFontSize(12);

    // Date top right
    const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    pdf.setFontSize(11);
    pdf.text(today, pageWidth - margin, margin, { align: "right" });

    // Name
    if (yourName) {
      pdf.setFontSize(12);
      pdf.text(yourName, margin, margin + 30);
      if (jobTitle) pdf.text(jobTitle, margin, margin + 46);
    }

    // Letter body
    pdf.setFontSize(12);
    const lines = pdf.splitTextToSize(letter, maxWidth);
    pdf.text(lines, margin, margin + 90);

    pdf.save(`${yourName.replace(/\s+/g, "_")}_Resignation_Letter.pdf`);
  }

  return (
    <div className="min-h-screen bg-[#f9fafb] pt-[68px]">
      <div className="max-w-3xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-orange-50 text-[#EA580C] text-[13px] font-semibold px-4 py-2 rounded-full mb-4">
            <FileText size={15} /> Resignation Letter Generator
          </div>
          <h1 className="text-[32px] font-bold text-[#111827] tracking-tight mb-2">
            Leave on <span className="text-[#FF6321]">Good Terms</span>
          </h1>
          <p className="text-[15px] text-[#6b7280]">
            Generate a professional resignation letter in seconds
          </p>
        </div>

        {/* Form */}
        <div className="bg-white border border-[#e5e7eb] rounded-2xl p-6 mb-4">
          <h2 className="text-[14px] font-semibold text-[#374151] mb-4">Your Details</h2>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-[12px] font-medium text-[#374151] mb-1.5 block">Your Name *</label>
              <input value={yourName} onChange={e => setYourName(e.target.value)}
                placeholder="Ali Hussain"
                className="w-full bg-[#f9fafb] border border-[#e5e7eb] rounded-xl px-4 py-2.5 text-[14px] focus:outline-none focus:border-[#FF6321] transition-colors" />
            </div>
            <div>
              <label className="text-[12px] font-medium text-[#374151] mb-1.5 block">Your Job Title</label>
              <input value={jobTitle} onChange={e => setJobTitle(e.target.value)}
                placeholder="Senior Developer"
                className="w-full bg-[#f9fafb] border border-[#e5e7eb] rounded-xl px-4 py-2.5 text-[14px] focus:outline-none focus:border-[#FF6321] transition-colors" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-[12px] font-medium text-[#374151] mb-1.5 block">Company Name *</label>
              <input value={companyName} onChange={e => setCompanyName(e.target.value)}
                placeholder="Google"
                className="w-full bg-[#f9fafb] border border-[#e5e7eb] rounded-xl px-4 py-2.5 text-[14px] focus:outline-none focus:border-[#FF6321] transition-colors" />
            </div>
            <div>
              <label className="text-[12px] font-medium text-[#374151] mb-1.5 block">Manager's Name</label>
              <input value={managerName} onChange={e => setManagerName(e.target.value)}
                placeholder="Mr. Ahmed"
                className="w-full bg-[#f9fafb] border border-[#e5e7eb] rounded-xl px-4 py-2.5 text-[14px] focus:outline-none focus:border-[#FF6321] transition-colors" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-[12px] font-medium text-[#374151] mb-1.5 block">Last Working Day</label>
              <input type="date" value={lastDay} onChange={e => setLastDay(e.target.value)}
                className="w-full bg-[#f9fafb] border border-[#e5e7eb] rounded-xl px-4 py-2.5 text-[14px] focus:outline-none focus:border-[#FF6321] transition-colors" />
            </div>
            <div>
              <label className="text-[12px] font-medium text-[#374151] mb-1.5 block">Reason (optional)</label>
              <input value={reason} onChange={e => setReason(e.target.value)}
                placeholder="Better opportunity"
                className="w-full bg-[#f9fafb] border border-[#e5e7eb] rounded-xl px-4 py-2.5 text-[14px] focus:outline-none focus:border-[#FF6321] transition-colors" />
            </div>
          </div>

          <div className="mb-4">
            <label className="text-[12px] font-medium text-[#374151] mb-1.5 block">Positive highlights (optional)</label>
            <input value={highlights} onChange={e => setHighlights(e.target.value)}
              placeholder="e.g. Amazing team, great learning experience, proud of X project"
              className="w-full bg-[#f9fafb] border border-[#e5e7eb] rounded-xl px-4 py-2.5 text-[14px] focus:outline-none focus:border-[#FF6321] transition-colors" />
          </div>

          {/* Tone */}
          <div>
            <label className="text-[12px] font-medium text-[#374151] mb-2 block">Tone</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {TONES.map(t => (
                <button key={t.id} onClick={() => setTone(t.id)}
                  className={`text-left px-3 py-2.5 rounded-xl border transition-all cursor-pointer ${tone === t.id ? "border-[#FF6321] bg-orange-50" : "border-[#e5e7eb] hover:border-[#FF6321]/50 bg-transparent"}`}>
                  <div className="text-[13px] font-semibold text-[#111827]">{t.id}</div>
                  <div className="text-[11px] text-[#9ca3af]">{t.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-[13px] mb-4">
            <AlertCircle size={15} /> {error}
          </div>
        )}

        <button onClick={handleGenerate} disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-[#FF6321] text-white font-bold text-[15px] py-4 rounded-2xl hover:bg-[#ea580c] hover:shadow-lg hover:shadow-orange-500/25 hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed mb-6">
          {loading
            ? <><RefreshCw size={18} className="animate-spin" /> Writing your letter...</>
            : <><Sparkles size={18} /> Generate Resignation Letter</>}
        </button>

        {/* Result */}
        <AnimatePresence>
          {letter && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>

              {/* Actions */}
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-[16px] font-bold text-[#111827]">Your Resignation Letter ✨</h2>
                <div className="flex gap-2">
                  <button onClick={handleDownloadPDF}
                    className="flex items-center gap-1.5 text-[13px] font-medium px-3 py-2 rounded-lg bg-[#111827] text-white hover:bg-[#1f2937] transition-all">
                    <Download size={14} /> PDF
                  </button>
                  <CopyBtn text={letter} />
                  <button onClick={handleGenerate}
                    className="flex items-center gap-1.5 text-[13px] font-medium px-3 py-2 rounded-lg border border-[#e5e7eb] hover:border-[#FF6321] hover:text-[#FF6321] transition-all">
                    <RefreshCw size={14} /> Regenerate
                  </button>
                </div>
              </div>

              {/* Letter preview */}
              <div className="bg-white border border-[#e5e7eb] rounded-2xl p-8 shadow-sm" id="resignation-letter-doc">
                {/* Letter header */}
                <div className="flex justify-between items-start mb-8">
                  <div>
                    {yourName && <p className="text-[14px] font-semibold text-[#111827]">{yourName}</p>}
                    {jobTitle && <p className="text-[13px] text-[#6b7280]">{jobTitle}</p>}
                  </div>
                  <p className="text-[13px] text-[#6b7280]">
                    {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                  </p>
                </div>

                {/* Letter body */}
                <div className="whitespace-pre-wrap text-[14px] text-[#1f2937] leading-[1.8] font-['Georgia',serif]">
                  {letter}
                </div>
              </div>

              <button onClick={() => { setLetter(""); setYourName(""); setCompanyName(""); setManagerName(""); setJobTitle(""); setLastDay(""); setReason(""); setHighlights(""); }}
                className="w-full mt-4 py-3 border border-[#e5e7eb] rounded-xl text-[14px] font-medium text-[#374151] hover:border-[#FF6321] hover:text-[#FF6321] transition-all flex items-center justify-center gap-2">
                Write Another Letter
              </button>
            </motion.div>
          )}
        </AnimatePresence>
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
  }),
  component: ResignationLetterPage,
});
