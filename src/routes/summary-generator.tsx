import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { List, Sparkles, Copy, Check, RefreshCw, AlertCircle, ChevronDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ToolContentSection } from "../app/components/ToolContentSection";
import { SUMMARY_CONTENT } from "../app/components/toolContent";
import { BlogHighlights } from "@/app/components/BlogHighlights";

const TONES = ["Professional", "Confident", "Conversational", "Creative"];

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={async () => { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="flex items-center gap-1 text-[12px] px-2.5 py-1.5 rounded-lg border border-[#e5e7eb] hover:border-[#FF6321] hover:text-[#FF6321] transition-all flex-shrink-0">
      {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

function SummaryGenerator() {
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  const [skills, setSkills] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [tone, setTone] = useState("Professional");
  const [summaries, setSummaries] = useState<{ label: string; text: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) navigate({ to: "/login" });
    });
  }, []);

  async function handleGenerate() {
    if (!role.trim()) { setError("Please enter your current role"); return; }
    setError(null);
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { navigate({ to: "/login" }); return; }

    try {
      const res = await fetch("/api/generate-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ role, experience, skills, jobTitle, tone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSummaries(data.summaries);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f9fafb] pt-[68px]">
      <div className="max-w-3xl mx-auto px-6 py-10">

        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-orange-50 text-[#EA580C] text-[13px] font-semibold px-4 py-2 rounded-full mb-4">
            <List size={15} /> Resume Summary Generator
          </div>
          <h1 className="text-[32px] font-bold text-[#111827] tracking-tight mb-2">
            Generate a <span className="text-[#FF6321]">Compelling Summary</span>
          </h1>
          <p className="text-[15px] text-[#6b7280]">
            3 tailored resume summaries — pick the one that fits best
          </p>
        </div>

        <div className="bg-white border border-[#e5e7eb] rounded-2xl p-6 mb-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-[12px] font-medium text-[#374151] mb-1.5 block">Current Role *</label>
              <input value={role} onChange={e => setRole(e.target.value)}
                placeholder="e.g. Full Stack Developer"
                className="w-full bg-[#f9fafb] border border-[#e5e7eb] rounded-xl px-4 py-2.5 text-[14px] focus:outline-none focus:border-[#FF6321]" />
            </div>
            <div>
              <label className="text-[12px] font-medium text-[#374151] mb-1.5 block">Target Job Title</label>
              <input value={jobTitle} onChange={e => setJobTitle(e.target.value)}
                placeholder="e.g. Senior Engineer"
                className="w-full bg-[#f9fafb] border border-[#e5e7eb] rounded-xl px-4 py-2.5 text-[14px] focus:outline-none focus:border-[#FF6321]" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-[12px] font-medium text-[#374151] mb-1.5 block">Years of Experience</label>
              <input value={experience} onChange={e => setExperience(e.target.value)}
                placeholder="e.g. 5 years"
                className="w-full bg-[#f9fafb] border border-[#e5e7eb] rounded-xl px-4 py-2.5 text-[14px] focus:outline-none focus:border-[#FF6321]" />
            </div>
            <div>
              <label className="text-[12px] font-medium text-[#374151] mb-1.5 block">Tone</label>
              <div className="relative">
                <select value={tone} onChange={e => setTone(e.target.value)}
                  className="w-full appearance-none bg-[#f9fafb] border border-[#e5e7eb] rounded-xl px-4 py-2.5 text-[14px] focus:outline-none focus:border-[#FF6321] pr-8">
                  {TONES.map(t => <option key={t}>{t}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af] pointer-events-none" />
              </div>
            </div>
          </div>

          <div>
            <label className="text-[12px] font-medium text-[#374151] mb-1.5 block">Top Skills</label>
            <input value={skills} onChange={e => setSkills(e.target.value)}
              placeholder="e.g. React, Node.js, Python, AWS"
              className="w-full bg-[#f9fafb] border border-[#e5e7eb] rounded-xl px-4 py-2.5 text-[14px] focus:outline-none focus:border-[#FF6321]" />
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-[13px] mb-4">
            <AlertCircle size={15} /> {error}
          </div>
        )}

        <button onClick={handleGenerate} disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-[#FF6321] text-white font-bold text-[15px] py-4 rounded-2xl hover:bg-[#ea580c] hover:shadow-lg hover:shadow-orange-500/25 hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed mb-6">
          {loading ? <><RefreshCw size={18} className="animate-spin" /> Generating...</> : <><Sparkles size={18} /> Generate Summaries</>}
        </button>

        <AnimatePresence>
          {summaries.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <h2 className="text-[16px] font-bold text-[#111827]">Your Summaries ✨ — Pick the best one</h2>
              {summaries.map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                  className="bg-white border border-[#e5e7eb] rounded-2xl p-5 hover:border-[#FF6321]/40 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[12px] font-bold text-[#EA580C] bg-orange-50 px-3 py-1 rounded-full">{s.label}</span>
                    <CopyBtn text={s.text} />
                  </div>
                  <p className="text-[14px] text-[#1f2937] leading-relaxed">{s.text}</p>
                </motion.div>
              ))}
              <button onClick={handleGenerate}
                className="w-full py-3 border border-[#e5e7eb] rounded-xl text-[14px] font-medium text-[#374151] hover:border-[#FF6321] hover:text-[#FF6321] transition-all flex items-center justify-center gap-2">
                <RefreshCw size={14} /> Regenerate
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/summary-generator")({
  head: () => ({
    meta: [
      { title: "Resume Summary Generator — AI Powered | airesumi.com" },
      { name: "description", content: "Generate 3 tailored professional resume summaries with AI." },
    ],
  }),
  component: () => (
    <>
      <SummaryGenerator />
      <ToolContentSection {...SUMMARY_CONTENT} />
      <BlogHighlights posts={[
                { title: "How to Build a Resume with AI in 2026", href: "/blog/build-resume-with-ai" },
                { title: "AI Resume vs. Human-Written: What Recruiters Notice", href: "/blog/ai-resume-vs-human-written-resume" },
                { title: "How to Tailor Your Resume for Every Job", href: "/blog/how-to-tailor-resume-for-every-job" },
              ]} />
    </>
  ),
});
