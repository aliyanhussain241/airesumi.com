import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Target, Sparkles, RefreshCw, AlertCircle, CheckCircle2, XCircle, Lightbulb } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

function ScoreRing({ score }: { score: number }) {
  const color = score >= 70 ? "#22c55e" : score >= 50 ? "#f59e0b" : "#ef4444";
  const label = score >= 70 ? "Great Match" : score >= 50 ? "Decent Match" : "Needs Work";
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" fill="none" stroke="#f3f4f6" strokeWidth="10" />
          <circle cx="50" cy="50" r="40" fill="none" stroke={color} strokeWidth="10"
            strokeDasharray={`${2.51 * score} 251`} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[22px] font-bold text-[#111827]">{score}%</span>
        </div>
      </div>
      <span className="text-[13px] font-semibold mt-2" style={{ color }}>{label}</span>
    </div>
  );
}

function KeywordScanner() {
  const navigate = useNavigate();
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) navigate({ to: "/login" });
    });
  }, []);

  async function handleScan() {
    if (!resumeText.trim() || !jobDescription.trim()) {
      setError("Dono fields bharna zaroori hai");
      return;
    }
    setError(null);
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { navigate({ to: "/login" }); return; }

    try {
      const res = await fetch("/api/scan-keywords", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ resumeText, jobDescription }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f9fafb] pt-[68px]">
      <div className="max-w-4xl mx-auto px-6 py-10">

        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-orange-50 text-[#EA580C] text-[13px] font-semibold px-4 py-2 rounded-full mb-4">
            <Target size={15} /> Keyword Scanner
          </div>
          <h1 className="text-[32px] font-bold text-[#111827] tracking-tight mb-2">
            Match Your Resume to <span className="text-[#FF6321]">Any Job</span>
          </h1>
          <p className="text-[15px] text-[#6b7280]">
            See which keywords you're missing and boost your ATS score
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-white border border-[#e5e7eb] rounded-2xl p-5">
            <label className="text-[13px] font-semibold text-[#374151] mb-2 block">Your Resume Text</label>
            <textarea value={resumeText} onChange={e => setResumeText(e.target.value)} rows={10}
              placeholder="Paste your resume text here..."
              className="w-full bg-[#f9fafb] border border-[#e5e7eb] rounded-xl px-4 py-3 text-[13px] focus:outline-none focus:border-[#FF6321] resize-none" />
          </div>
          <div className="bg-white border border-[#e5e7eb] rounded-2xl p-5">
            <label className="text-[13px] font-semibold text-[#374151] mb-2 block">Job Description</label>
            <textarea value={jobDescription} onChange={e => setJobDescription(e.target.value)} rows={10}
              placeholder="Paste the job description here..."
              className="w-full bg-[#f9fafb] border border-[#e5e7eb] rounded-xl px-4 py-3 text-[13px] focus:outline-none focus:border-[#FF6321] resize-none" />
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-[13px] mb-4">
            <AlertCircle size={15} /> {error}
          </div>
        )}

        <button onClick={handleScan} disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-[#FF6321] text-white font-bold text-[15px] py-4 rounded-2xl hover:bg-[#ea580c] hover:shadow-lg hover:shadow-orange-500/25 hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed mb-6">
          {loading ? <><RefreshCw size={18} className="animate-spin" /> Scanning...</> : <><Sparkles size={18} /> Scan Keywords</>}
        </button>

        <AnimatePresence>
          {result && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              {/* Score */}
              <div className="bg-white border border-[#e5e7eb] rounded-2xl p-6 flex items-center justify-between">
                <div>
                  <h2 className="text-[20px] font-bold text-[#111827] mb-1">Keyword Match Score</h2>
                  <p className="text-[14px] text-[#6b7280]">Based on {(result.matched_keywords?.length || 0) + (result.missing_keywords?.length || 0)} keywords analyzed</p>
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
                    {result.matched_keywords?.map((k: string) => (
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
                    {result.missing_keywords?.map((k: string) => (
                      <span key={k} className="bg-red-50 text-red-600 text-[12px] font-medium px-3 py-1 rounded-full border border-red-100">{k}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tips */}
              {result.tips?.length > 0 && (
                <div className="bg-white border border-[#e5e7eb] rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Lightbulb size={16} className="text-[#EA580C]" />
                    <h3 className="text-[14px] font-bold text-[#111827]">Improvement Tips</h3>
                  </div>
                  <ul className="space-y-2">
                    {result.tips.map((tip: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-[13px] text-[#374151]">
                        <span className="text-[#EA580C] font-bold mt-0.5">→</span> {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <button onClick={() => { setResult(null); setResumeText(""); setJobDescription(""); }}
                className="w-full py-3 border border-[#e5e7eb] rounded-xl text-[14px] font-medium text-[#374151] hover:border-[#FF6321] hover:text-[#FF6321] transition-all flex items-center justify-center gap-2">
                <RefreshCw size={14} /> Scan Another
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/keyword-scanner")({
  head: () => ({
    meta: [
      { title: "Resume Keyword Scanner — ATS Match | airesumi.com" },
      { name: "description", content: "See which keywords your resume is missing and boost your ATS match score." },
    ],
  }),
  component: KeywordScanner,
});
