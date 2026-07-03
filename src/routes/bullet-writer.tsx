import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { PenLine, Sparkles, Copy, Check, RefreshCw, AlertCircle, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ToolContentSection } from "../app/components/ToolContentSection";
import { BULLET_CONTENT } from "../app/components/toolContent";


function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={async () => { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="flex items-center gap-1 text-[12px] px-2.5 py-1.5 rounded-lg border border-[#e5e7eb] hover:border-[#FF6321] hover:text-[#FF6321] transition-all">
      {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

function BulletWriter() {
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [existingBullet, setExistingBullet] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [bullets, setBullets] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) navigate({ to: "/login" });
    });
  }, []);

  async function handleGenerate() {
    if (!role.trim()) { setError("Please enter a role"); return; }
    setError(null);
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { navigate({ to: "/login" }); return; }

    try {
      const res = await fetch("/api/generate-bullets", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ role, company, existingBullet, jobDescription }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setBullets(data.bullets);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f9fafb] pt-[68px]">
      <div className="max-w-3xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-orange-50 text-[#EA580C] text-[13px] font-semibold px-4 py-2 rounded-full mb-4">
            <PenLine size={15} /> Resume Bullet Writer
          </div>
          <h1 className="text-[32px] font-bold text-[#111827] tracking-tight mb-2">
            Write <span className="text-[#FF6321]">Stronger Bullets</span> Instantly
          </h1>
          <p className="text-[15px] text-[#6b7280]">
            AI generates powerful, metric-driven bullet points for your resume
          </p>
        </div>

        {/* Input Card */}
        <div className="bg-white border border-[#e5e7eb] rounded-2xl p-6 mb-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-[12px] font-medium text-[#374151] mb-1.5 block">Your Role *</label>
              <input value={role} onChange={e => setRole(e.target.value)}
                placeholder="e.g. Software Engineer"
                className="w-full bg-[#f9fafb] border border-[#e5e7eb] rounded-xl px-4 py-2.5 text-[14px] focus:outline-none focus:border-[#FF6321]" />
            </div>
            <div>
              <label className="text-[12px] font-medium text-[#374151] mb-1.5 block">Company</label>
              <input value={company} onChange={e => setCompany(e.target.value)}
                placeholder="e.g. Google"
                className="w-full bg-[#f9fafb] border border-[#e5e7eb] rounded-xl px-4 py-2.5 text-[14px] focus:outline-none focus:border-[#FF6321]" />
            </div>
          </div>

          <div className="mb-4">
            <label className="text-[12px] font-medium text-[#374151] mb-1.5 block">Existing bullet to improve (optional)</label>
            <input value={existingBullet} onChange={e => setExistingBullet(e.target.value)}
              placeholder="e.g. Worked on frontend development"
              className="w-full bg-[#f9fafb] border border-[#e5e7eb] rounded-xl px-4 py-2.5 text-[14px] focus:outline-none focus:border-[#FF6321]" />
          </div>

          <div>
            <label className="text-[12px] font-medium text-[#374151] mb-1.5 block">Job description keywords (optional)</label>
            <textarea value={jobDescription} onChange={e => setJobDescription(e.target.value)} rows={3}
              placeholder="Paste job description or keywords to tailor bullets..."
              className="w-full bg-[#f9fafb] border border-[#e5e7eb] rounded-xl px-4 py-2.5 text-[14px] focus:outline-none focus:border-[#FF6321] resize-none" />
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-[13px] mb-4">
            <AlertCircle size={15} /> {error}
          </div>
        )}

        <button onClick={handleGenerate} disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-[#FF6321] text-white font-bold text-[15px] py-4 rounded-2xl hover:bg-[#ea580c] hover:shadow-lg hover:shadow-orange-500/25 hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed mb-6">
          {loading ? <><RefreshCw size={18} className="animate-spin" /> Generating...</> : <><Sparkles size={18} /> Generate Bullet Points</>}
        </button>

        {/* Results */}
        <AnimatePresence>
          {bullets.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-[16px] font-bold text-[#111827]">Generated Bullets ✨</h2>
                <CopyBtn text={bullets.map((b, i) => `• ${b}`).join("\n")} />
              </div>
              <div className="space-y-3">
                {bullets.map((bullet, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                    className="bg-white border border-[#e5e7eb] rounded-xl px-5 py-4 flex items-start gap-3 group hover:border-[#FF6321]/40 transition-colors">
                    <span className="text-[#FF6321] font-bold text-[16px] mt-0.5">•</span>
                    <p className="text-[14px] text-[#1f2937] leading-relaxed flex-1">{bullet}</p>
                    <CopyBtn text={bullet} />
                  </motion.div>
                ))}
              </div>
              <button onClick={handleGenerate}
                className="w-full mt-4 py-3 border border-[#e5e7eb] rounded-xl text-[14px] font-medium text-[#374151] hover:border-[#FF6321] hover:text-[#FF6321] transition-all flex items-center justify-center gap-2">
                <RefreshCw size={14} /> Generate 5 More
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/bullet-writer")({
  head: () => ({
    meta: [
      { title: "Resume Bullet Writer — AI Powered | airesumi.com" },
      { name: "description", content: "Generate powerful, metric-driven resume bullet points with AI." },
    ],
  }),
  component: () => (
    <>
      <BulletWriter />
      <ToolContentSection {...BULLET_CONTENT} />
      <div className="max-w-3xl mx-auto px-6 pb-12">
        <div className="liquid-card rounded-2xl p-6">
          <span className="liquid-card-shine" />
          <div className="liquid-card-content">
            <p className="text-xs font-bold text-[#FF6321] uppercase tracking-widest mb-4">From Our Blog</p>
            <div className="flex flex-col gap-3">
              {[
                { title: "How to Build a Resume with AI in 2026", href: "/blog/build-resume-with-ai" },
                { title: "How to Tailor Your Resume for Every Job", href: "/blog/how-to-tailor-resume-for-every-job" },
                { title: "ATS Resume Score: What Number Do You Need?", href: "/blog/ats-resume-checker-what-score-do-you-need" },
              ].map((post) => (
                <a key={post.href} href={post.href} className="flex items-center gap-2 text-sm text-[#374151] hover:text-[#FF6321] transition-colors group">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF6321] shrink-0 group-hover:scale-125 transition-transform" />
                  {post.title}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  ),
});
