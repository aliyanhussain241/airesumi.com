import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { motion, AnimatePresence } from 'motion/react';
import {
  CheckCircle2, XCircle, AlertTriangle, ArrowRight, Search, ChevronDown,
  FileText, UploadCloud, RefreshCw, Download, Share2, Plus,
  CheckCircle, Check, X, Sparkles, Zap, Target, Loader2, Shield,
  ClipboardPaste, Eye
} from 'lucide-react';



export const ATSChecker = ({ onNavigate }: { onNavigate: (step: any) => void }) => {
  const [activeCheckTab, setActiveCheckTab] = useState(1);
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [analyzeState, setAnalyzeState] = useState<'idle' | 'analyzing' | 'results'>('idle');
  const [loadingText, setLoadingText] = useState("Reading your resume...");
  const [activeResultTab, setActiveResultTab] = useState(0);
  const [atsResult, setAtsResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Free ATS Resume Checker – Instant ATS Score & Keyword Analysis | AIResumi";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", "Check your resume's ATS score instantly for free. Our ATS resume checker analyzes keyword match, formatting issues, and ATS compatibility — no sign-up required. See your score in seconds.");
  }, []);

  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setLoadingText("Reading your resume file...");
    setAnalyzeState('analyzing');
    setError(null);

    try {
      const formData = new FormData();
      formData.append('cv', file);

      const { data: { session: cvSession } } = await supabase.auth.getSession();
      const response = await fetch('/api/parse-cv-text', {
        method: 'POST',
        headers: {
          ...(cvSession?.access_token ? { 'Authorization': `Bearer ${cvSession.access_token}` } : {}),
        },
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to parse file');
      }

      const data = await response.json();
      setResumeText(data.text || '');
      setAnalyzeState('idle');
    } catch (error: any) {
      console.error("Error uploading file:", error);
      setError(error.message || "Failed to parse file. Please paste your resume text instead.");
      setAnalyzeState('idle');
    } finally {
      setIsUploading(false);
      // Reset the input so the same file could be selected again if needed
      if (e.target) {
        e.target.value = '';
      }
    }
  };

  const startAnalysis = async () => {
    if (!resumeText) return;
    setAnalyzeState('analyzing');
    setLoadingText("Analyzing ATS compatibility...");
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch('/api/analyze-ats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token ? { 'Authorization': `Bearer ${session.access_token}` } : {}),
        },
        body: JSON.stringify({ resumeText, jobDescription })
      });

      if (!response.ok) {
         const errData = await response.json().catch(() => ({}));
         throw new Error(errData.error || 'Failed to analyze ATS');
      }

      setLoadingText("Generating your report...");
      const data = await response.json();
      setAtsResult(data);
      setAnalyzeState('results');
      setLoadingText("Reading your resume...");
    } catch (error: any) {
      console.error('Error analyzing ATS:', error);
      setError(error.message || 'Failed to analyze ATS. Please try again.');
      setAnalyzeState('idle');
    }
  };

  const LOADING_STEPS = [
    { label: "Parsing resume text", icon: FileText },
    { label: "Scanning ATS-friendly structure", icon: Shield },
    { label: "Matching keywords vs. job description", icon: Target },
    { label: "Scoring format & readability", icon: Sparkles },
    { label: "Compiling improvement plan", icon: Zap },
  ];
  const [loadStep, setLoadStep] = useState(0);
  useEffect(() => {
    if (analyzeState !== 'analyzing') { setLoadStep(0); return; }
    const t = setInterval(() => setLoadStep((v) => (v + 1 < LOADING_STEPS.length ? v + 1 : v)), 1500);
    return () => clearInterval(t);
  }, [analyzeState]);

  const wordCount = useMemo(() => resumeText.trim().split(/\s+/).filter(Boolean).length, [resumeText]);
  const jdWords = useMemo(() => jobDescription.trim().split(/\s+/).filter(Boolean).length, [jobDescription]);
  const readyQuality = Math.min(100, Math.round((wordCount / 400) * 100));

  const handlePasteResume = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setResumeText(text);
    } catch { /* ignore */ }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8FAFC] via-white to-[#F8FAFC] font-sans selection:bg-[#FF6321] selection:text-white pb-20 pt-[68px]">

      {/* Hero Section */}
      <div className="max-w-5xl mx-auto px-6 mb-14 text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 leading-none rounded-full bg-orange-50 text-[#c2410c] text-xs font-semibold uppercase tracking-widest mb-6 border border-orange-100"
        >
          <Sparkles size={12} /> AI-Powered ATS Analysis
        </motion.div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-5 tracking-tight leading-[1.15] pb-1">
          Beat the bots. <span className="text-[#FF6321]">Land the interview.</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 leading-relaxed font-medium mb-8 max-w-3xl mx-auto">
          Free ATS resume checker. Get an instant score, keyword gap, formatting audit, and personalized fix-plan in under 10 seconds.
        </p>
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm font-semibold text-gray-700">
          {[
            { n: '500K+', l: 'Resumes scanned' },
            { n: '2.4x', l: 'More interviews' },
            { n: '<10s', l: 'Average result' },
            { n: '98%', l: 'ATS coverage' },
          ].map(s => (
            <div key={s.l} className="flex items-baseline gap-1.5">
              <span className="text-[#FF6321] font-extrabold text-lg">{s.n}</span>
              <span className="text-gray-500 text-xs uppercase tracking-wider">{s.l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Tool Area */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 mb-24">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
            <XCircle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
            <div className="flex-1">
              <h3 className="text-sm font-bold text-red-900">An error occurred</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
            <button onClick={() => setError(null)} aria-label="Dismiss error" className="text-red-400 hover:text-red-600">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {analyzeState === 'idle' && (
          <div className="bg-white rounded-3xl shadow-[0_20px_60px_-20px_rgba(0,0,0,0.15)] border border-[#FED7AA]/60 overflow-hidden">
            <div className="flex border-b border-gray-100 bg-gradient-to-r from-orange-50/40 to-transparent">
              <button
                onClick={() => setActiveCheckTab(0)}
                className={`flex-1 py-4 font-bold text-sm transition-all ${activeCheckTab === 0 ? 'text-[#FF6321] border-b-2 border-[#FF6321] bg-white' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Basic ATS Check
              </button>
              <button
                onClick={() => setActiveCheckTab(1)}
                className={`flex-1 py-4 font-bold text-sm flex items-center justify-center gap-2 transition-all ${activeCheckTab === 1 ? 'text-[#FF6321] border-b-2 border-[#FF6321] bg-white' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Full ATS Check + Job Match
                <span className="bg-[#FF6321] text-white text-[10px] px-2 py-0.5 rounded-full">Recommended</span>
              </button>
            </div>

            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-between mb-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-gray-600 flex items-center gap-1.5">
                  <FileText size={12} /> Your Resume
                </label>
                <button
                  onClick={handlePasteResume}
                  className="text-[11px] font-semibold text-[#FF6321] hover:underline flex items-center gap-1"
                >
                  <ClipboardPaste size={12} /> Paste from clipboard
                </button>
              </div>
              <div className="mb-4 relative">
                <textarea
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste your resume text here — include experience, skills, education, and contact info."
                  className="w-full h-56 border border-[#FED7AA] rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6321] focus:border-transparent resize-none bg-[#FFFCFA]"
                />
                <div className="absolute bottom-3 right-3 flex items-center gap-2 text-[11px] font-medium text-gray-500 bg-white/80 backdrop-blur px-2 py-1 rounded">
                  <span>{wordCount} words</span>
                  <span className="w-16 h-1 bg-gray-100 rounded-full overflow-hidden">
                    <span className="block h-full bg-gradient-to-r from-orange-400 to-[#FF6321] transition-all" style={{ width: `${readyQuality}%` }} />
                  </span>
                </div>
              </div>

              <label className="relative flex flex-col sm:flex-row items-center justify-center gap-3 border-2 border-dashed border-[#FF6321]/40 rounded-xl py-4 px-4 bg-[#FFF7ED] hover:bg-[#FFE9D5] transition-all cursor-pointer mb-6">
                <input
                  type="file"
                  accept=".pdf,.txt,.doc,.docx"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-wait"
                  aria-label="Upload resume file"
                />
                <div className="w-10 h-10 rounded-full bg-white text-[#FF6321] flex items-center justify-center shadow-sm shrink-0">
                  {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <UploadCloud className="w-5 h-5" />}
                </div>
                <div className="text-center sm:text-left">
                  <div className="text-sm font-bold text-[#EA580C]">
                    {isUploading ? 'Extracting text…' : 'Or upload your resume file'}
                  </div>
                  <div className="text-xs text-gray-500">PDF, DOC, DOCX, TXT · up to 5 MB · private</div>
                </div>
              </label>

              {activeCheckTab === 1 && (
                <div className="relative mb-6">
                  <div className="flex items-center justify-center my-5">
                    <div className="border-t border-gray-200 flex-1"></div>
                    <div className="w-8 h-8 rounded-full bg-[#FF6321] text-white flex items-center justify-center mx-4 shadow-sm"><Plus className="w-4 h-4" /></div>
                    <div className="border-t border-gray-200 flex-1"></div>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-gray-600 flex items-center gap-1.5">
                      <Target size={12} /> Job Description
                    </label>
                    <span className="text-[11px] text-gray-500">{jdWords} words</span>
                  </div>
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the full job posting for the sharpest keyword match."
                    className="w-full h-40 border border-[#FED7AA] rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6321] focus:border-transparent resize-none bg-[#FFFCFA]"
                  />
                </div>
              )}

              <button
                onClick={startAnalysis}
                disabled={!resumeText}
                className="w-full py-4 bg-[#FF6321] text-white font-bold rounded-2xl hover:bg-[#EA580C] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_10px_30px_-10px_rgba(255,99,33,0.6)] active:scale-[0.99]"
              >
                <Zap size={18} />
                {activeCheckTab === 1 ? 'Run Full ATS Analysis' : 'Check My ATS Score'}
                <ArrowRight className="w-4 h-4" />
              </button>
              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] text-gray-500 mt-3">
                <span className="flex items-center gap-1"><Check size={12} className="text-green-500" /> No sign-up</span>
                <span className="flex items-center gap-1"><Check size={12} className="text-green-500" /> Private — never stored</span>
                <span className="flex items-center gap-1"><Check size={12} className="text-green-500" /> Results in seconds</span>
              </div>
            </div>
          </div>
        )}

        {analyzeState === 'analyzing' && (
          <div className="bg-white rounded-3xl shadow-[0_20px_60px_-20px_rgba(0,0,0,0.15)] border border-[#FED7AA]/60 p-8 sm:p-12 flex flex-col items-center justify-center min-h-[440px]">
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="relative mb-8"
            >
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#FF6321] to-orange-400 flex items-center justify-center shadow-[0_20px_40px_-10px_rgba(255,99,33,0.5)]">
                <Search className="w-8 h-8 text-white" />
              </div>
              <motion.div
                className="absolute inset-0 rounded-3xl border-2 border-[#FF6321]"
                animate={{ scale: [1, 1.4], opacity: [0.6, 0] }}
                transition={{ duration: 1.6, repeat: Infinity }}
              />
            </motion.div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{loadingText}</h3>
            <p className="text-sm text-gray-500 mb-8">Running against ATS parsing rules and job-match logic</p>
            <div className="w-full max-w-md space-y-2.5">
              {LOADING_STEPS.map((s, i) => {
                const Icon = s.icon;
                const done = i < loadStep;
                const active = i === loadStep;
                return (
                  <div key={s.label} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all ${
                      done ? 'bg-green-100 text-green-600' :
                      active ? 'bg-orange-100 text-[#FF6321]' :
                      'bg-gray-100 text-gray-400'
                    }`}>
                      {done ? <Check size={16} /> : active ? <Loader2 size={16} className="animate-spin" /> : <Icon size={16} />}
                    </div>
                    <span className={`text-sm font-medium ${done ? 'text-gray-900' : active ? 'text-[#FF6321]' : 'text-gray-400'}`}>
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {analyzeState === 'results' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

            {/* Score Banner */}
            {atsResult && (() => {
              const score = atsResult.score || 0;
              const tier =
                score >= 85 ? { label: 'Excellent — Ready to Apply', color: '#16A34A', bg: 'bg-green-50', text: 'text-green-800' } :
                score >= 70 ? { label: 'Good — Minor Tweaks Needed', color: '#0284C7', bg: 'bg-blue-50', text: 'text-blue-800' } :
                score >= 50 ? { label: 'Fair — Needs Improvement', color: '#CA8A04', bg: 'bg-yellow-50', text: 'text-yellow-800' } :
                              { label: 'Poor — Do Not Submit', color: '#DC2626', bg: 'bg-red-50', text: 'text-red-800' };
              const metrics = [
                { k: 'Keyword Match', v: atsResult.metrics?.keywordMatch || 0, icon: Target },
                { k: 'Format Score', v: atsResult.metrics?.formatScore || 0, icon: Shield },
                { k: 'Content Score', v: atsResult.metrics?.contentScore || 0, icon: FileText },
                { k: 'Readability', v: atsResult.metrics?.readability || 0, icon: Eye },
              ];
              return (
                <div className="bg-white rounded-3xl shadow-[0_20px_60px_-20px_rgba(0,0,0,0.15)] border border-[#FED7AA]/60 p-6 sm:p-8 relative overflow-hidden">
                  <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full opacity-10 blur-3xl" style={{ background: tier.color }} />
                  <div className="flex flex-col md:flex-row items-center gap-8 relative">
                    <div className="flex-shrink-0 relative">
                      <svg className="w-36 h-36 transform -rotate-90">
                        <circle cx="72" cy="72" r="62" fill="none" stroke="#f3f4f6" strokeWidth="12" />
                        <motion.circle
                          cx="72" cy="72" r="62" fill="none" stroke={tier.color} strokeWidth="12" strokeLinecap="round"
                          strokeDasharray="389"
                          initial={{ strokeDashoffset: 389 }}
                          animate={{ strokeDashoffset: 389 - (389 * score) / 100 }}
                          transition={{ duration: 1.2, ease: 'easeOut' }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <motion.span
                          initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.3 }}
                          className="text-5xl font-extrabold leading-none"
                          style={{ color: tier.color }}
                        >
                          {score}
                        </motion.span>
                        <span className="text-xs font-bold text-gray-400 mt-1">out of 100</span>
                      </div>
                    </div>
                    <div className="flex-1 text-center md:text-left w-full">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 text-sm font-bold rounded-full mb-3 ${tier.bg} ${tier.text}`}>
                        {score >= 70 ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />} {tier.label}
                      </div>
                      <p className="text-gray-600 mb-5 text-[15px]">
                        Your resume has a <span className="font-semibold" style={{ color: tier.color }}>
                          {score >= 85 ? 'strong' : score >= 70 ? 'good' : score >= 50 ? 'moderate' : 'low'}
                        </span> chance of passing ATS screening. {score < 85 && 'Address the items below to boost your score.'}
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                        {metrics.map((m) => {
                          const Icon = m.icon;
                          const c = m.v >= 80 ? '#16A34A' : m.v >= 60 ? '#CA8A04' : '#DC2626';
                          return (
                            <div key={m.k} className="bg-gray-50 border border-gray-100 rounded-xl p-3">
                              <div className="flex items-center justify-between mb-1.5">
                                <Icon size={12} className="text-gray-400" />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{m.k}</span>
                              </div>
                              <div className="text-2xl font-extrabold" style={{ color: c }}>{m.v}<span className="text-sm text-gray-400">%</span></div>
                              <div className="h-1 bg-gray-200 rounded-full mt-1.5 overflow-hidden">
                                <motion.div className="h-full rounded-full" style={{ background: c }} initial={{ width: 0 }} animate={{ width: `${m.v}%` }} transition={{ duration: 0.9, ease: 'easeOut' }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                        <button onClick={() => onNavigate(1)} className="px-5 py-2.5 bg-[#FF6321] hover:bg-[#EA580C] text-white font-bold rounded-xl transition-all hover:scale-[1.02] flex items-center gap-2 shadow-[0_10px_20px_-8px_rgba(255,99,33,0.6)]">
                          <Sparkles size={14} /> Fix My Resume With AI <ArrowRight className="w-4 h-4" />
                        </button>
                        <button className="px-4 py-2.5 bg-white border border-[#FF6321] text-[#FF6321] font-bold rounded-xl hover:bg-[#FFF7ED] transition-colors flex items-center gap-2"><Download className="w-4 h-4" /> Report</button>
                        <button onClick={() => setAnalyzeState('idle')} aria-label="Reset analysis" className="px-3 py-2.5 bg-white border border-gray-300 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-colors"><RefreshCw className="w-4 h-4" /></button>
                        <button aria-label="Share report" className="px-3 py-2.5 bg-white border border-gray-300 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-colors"><Share2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}


            {/* Results Tabs */}
            <div className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(22,163,74,0.10)] border border-[#FED7AA] overflow-hidden">
               <div className="flex border-b border-gray-100 overflow-x-auto no-scrollbar">
                 {['Issues Found', 'Keyword Analysis', 'Formatting Report', 'Improvement Plan'].map((tab, i) => (
                   <button 
                     key={i}
                     onClick={() => setActiveResultTab(i)}
                     className={`px-6 py-4 font-bold text-sm whitespace-nowrap ${activeResultTab === i ? 'text-[#FF6321] border-b-2 border-[#FF6321] bg-[#FFF7ED]/50' : 'text-gray-500 hover:text-gray-800'}`}
                   >
                     {tab}
                   </button>
                 ))}
               </div>
               
               <div className="p-8">
                 {atsResult && activeResultTab === 0 && (
                   <div className="space-y-8">
                     <div>
                       <h3 className="text-lg font-bold flex items-center gap-2 text-red-700 mb-4"><XCircle className="w-5 h-5"/> Critical Issues (Must Fix)</h3>
                       <div className="space-y-3">
                         {atsResult.issues?.critical?.length > 0 ? atsResult.issues.critical.map((c: any, i: number) => (
                         <div key={i} className="bg-red-50 border border-red-100 p-4 rounded-xl">
                           <div className="font-bold text-red-900 mb-1">✗ {c.title}</div>
                           <div className="text-sm text-red-700 mb-2">{c.description}</div>
                           {c.fix && <div className="text-sm font-medium text-gray-800"><span className="font-bold">Fix:</span> {c.fix}</div>}
                         </div>
                         )) : <p className="text-sm text-gray-500">No critical issues found.</p>}
                       </div>
                     </div>
                     <div>
                       <h3 className="text-lg font-bold flex items-center gap-2 text-yellow-700 mb-4"><AlertTriangle className="w-5 h-5"/> Warnings (Should Fix)</h3>
                       <div className="space-y-3">
                         {atsResult.issues?.warnings?.length > 0 ? atsResult.issues.warnings.map((w: any, i: number) => (
                         <div key={i} className="bg-yellow-50 border border-yellow-100 p-4 rounded-xl">
                           <div className="font-bold text-yellow-900 mb-1">⚠ {w.title}</div>
                           <div className="text-sm text-yellow-800 mb-2">{w.description}</div>
                           {w.fix && <div className="text-sm font-medium text-gray-800"><span className="font-bold">Fix:</span> {w.fix}</div>}
                         </div>
                         )) : <p className="text-sm text-gray-500">No warnings found.</p>}
                       </div>
                     </div>
                     <div>
                       <h3 className="text-lg font-bold flex items-center gap-2 text-[#FF6321] mb-4"><CheckCircle2 className="w-5 h-5"/> Passed Checks</h3>
                       <div className="grid md:grid-cols-2 gap-3">
                         {atsResult.issues?.passed?.length > 0 ? atsResult.issues.passed.map((t: string, i: number) => (
                           <div key={i} className="bg-[#FFF7ED] border border-[#FED7AA] p-3 rounded-xl flex items-start gap-2">
                             <Check className="w-4 h-4 text-[#FF6321] shrink-0 mt-0.5" />
                             <span className="text-sm text-green-900 font-medium">{t}</span>
                           </div>
                         )) : <p className="text-sm text-gray-500">No checks passed.</p>}
                       </div>
                     </div>
                   </div>
                 )}

                 {atsResult && activeResultTab === 1 && (
                   <div>
                     <h3 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Keyword Gap Analysis — Job Description Match</h3>
                     <div className="grid md:grid-cols-2 gap-8 mb-12">
                       <div>
                         <h4 className="font-bold text-[#FF6321] mb-4 flex items-center gap-2"><CheckCircle2 className="w-4 h-4"/> Found in Your Resume</h4>
                         <ul className="space-y-3">
                           {atsResult.keywords?.found?.length > 0 ? atsResult.keywords.found.map((k: string, i: number)=>(
                             <li key={i} className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 px-3 py-2 rounded-lg"><Check className="text-[#FF6321] w-4 h-4"/> {k}</li>
                           )) : <li className="text-sm text-gray-500">No keywords found.</li>}
                         </ul>
                       </div>
                       <div>
                         <h4 className="font-bold text-red-600 mb-4 flex items-center gap-2"><XCircle className="w-4 h-4"/> Missing Keywords</h4>
                         <ul className="space-y-3">
                           {atsResult.keywords?.missing?.length > 0 ? atsResult.keywords.missing.map((m: any, i: number)=>(
                             <li key={i} className="flex items-center justify-between gap-2 text-sm text-gray-700 bg-red-50/50 px-3 py-2 rounded-lg border border-red-100/50">
                               <div className="flex items-center gap-2"><XCircle className="text-red-500 w-4 h-4"/> {m.keyword}</div>
                               <span className={`text-[10px] font-bold uppercase ${m.importance==='high'?'text-red-600':m.importance==='medium'?'text-yellow-600':'text-gray-500'}`}>{m.importance} IMPORTANCE</span>
                             </li>
                           )) : <li className="text-sm text-gray-500">No missing keywords!</li>}
                         </ul>
                       </div>
                     </div>
                     <div>
                       <h4 className="font-bold text-gray-900 mb-4">Suggested Keywords to Add:</h4>
                       <div className="flex flex-wrap gap-2">
                         {atsResult.keywords?.suggested?.map((t: string, i: number)=>(
                           <span key={i} className="px-3 py-1 bg-[#FFF7ED] text-[#EA580C] border border-[#FED7AA] rounded-full text-sm font-semibold">{t}</span>
                         ))}
                       </div>
                     </div>
                   </div>
                 )}

                 {atsResult && activeResultTab === 2 && (
                   <div>
                     <h3 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Formatting & Structure Report</h3>
                     <div className="overflow-x-auto">
                       <table className="w-full text-left border-collapse">
                         <thead>
                           <tr className="border-b-2 border-gray-100">
                             <th className="py-3 px-4 font-bold text-gray-600 text-sm w-1/3">Check</th>
                             <th className="py-3 px-4 font-bold text-gray-600 text-sm w-1/6">Status</th>
                             <th className="py-3 px-4 font-bold text-gray-600 text-sm">Details</th>
                           </tr>
                         </thead>
                         <tbody className="text-sm">
                           {atsResult.formatting?.map((r: any, i: number)=>(
                             <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50">
                               <td className="py-3 px-4 font-medium text-gray-800">{r.check}</td>
                               <td className="py-3 px-4">
                                 {r.status==='pass'?<span className="inline-flex items-center gap-1 text-[#FF6321] font-bold"><Check className="w-3 h-3"/> Pass</span>:
                                  r.status==='warn'?<span className="inline-flex items-center gap-1 text-yellow-600 font-bold"><AlertTriangle className="w-3 h-3"/> Warn</span>:
                                  <span className="inline-flex items-center gap-1 text-red-600 font-bold"><XCircle className="w-3 h-3"/> Fail</span>}
                               </td>
                               <td className="py-3 px-4 text-gray-600">{r.details}</td>
                             </tr>
                           ))}
                         </tbody>
                       </table>
                     </div>
                   </div>
                 )}

                 {atsResult && activeResultTab === 3 && (
                   <div className="space-y-6">
                     <h3 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Your Personalized ATS Improvement Plan</h3>
                     
                     {atsResult.improvementPlan?.map((plan: any, i: number) => (
                     <div key={i} className={`border ${plan.priority === 1 ? 'border-red-200' : plan.priority === 2 ? 'border-red-100' : 'border-yellow-200'} rounded-xl p-5 bg-white shadow-sm relative overflow-hidden`}>
                       <div className={`absolute left-0 top-0 bottom-0 w-1 ${plan.priority === 1 ? 'bg-red-500' : plan.priority === 2 ? 'bg-red-400' : 'bg-yellow-400'}`}></div>
                       <h4 className="font-bold text-gray-900 mb-1 flex items-center gap-2">Priority {plan.priority} — {plan.title} <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded font-bold">Impact: {plan.impact}</span></h4>
                       <p className="text-sm text-gray-600 mb-3">{plan.description}</p>
                       {plan.example && <p className="text-sm bg-gray-50 p-2 rounded border border-gray-100 mb-4 font-mono text-gray-500"><span className="text-gray-900 font-bold block mb-1 font-sans">Example:</span> <span className="text-[#FF6321]">{plan.example}</span></p>}
                       <button onClick={() => onNavigate(1)} className="text-sm font-bold text-blue-600 hover:text-blue-800">→ {plan.action}</button>
                     </div>
                     ))}

                     <div className="bg-[#FFF7ED] border border-[#FED7AA] rounded-xl p-6 text-center mt-8">
                       <h4 className="font-bold text-gray-900 mb-2">Fix all of these issues automatically in 2 minutes</h4>
                       <button onClick={() => onNavigate(1)} className="mt-2 px-6 py-3 bg-[#FF6321] text-white font-bold rounded-xl hover:bg-[#EA580C] transition-colors inline-flex items-center gap-2">Rebuild My Resume With AI <ArrowRight className="w-4 h-4"/></button>
                     </div>
                   </div>
                 )}
               </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Info Sections */}
      <div className="max-w-4xl mx-auto px-6 pb-24">
        
        <h2 className="text-3xl font-bold text-gray-900 mb-6">What Your ATS Score Means and How to Improve It</h2>
        <div className="grid md:grid-cols-2 gap-6 mb-20">
          <div className="bg-white border border-gray-200 p-6 rounded-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-12 h-12 bg-red-100 rounded-bl-[40px] flex items-start justify-end p-2 px-3"><span className="text-red-700 font-bold text-sm text-right">0-49</span></div>
             <h3 className="font-bold text-red-700 mb-3 text-lg">Poor ATS Score</h3>
             <p className="text-sm text-gray-600 leading-relaxed">A score below 50 means your resume will very likely be automatically rejected by ATS software before any human reads it. Common causes include keyword mismatch with the job description, ATS-incompatible formatting such as tables and columns, missing standard section headings, no quantified achievements, and contact information issues. Resumes in this range need significant restructuring before being submitted.</p>
          </div>
          <div className="bg-white border border-gray-200 p-6 rounded-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-14 h-14 bg-yellow-100 rounded-bl-[40px] flex items-start justify-end p-2 px-3"><span className="text-yellow-700 font-bold text-sm text-right">50-69</span></div>
             <h3 className="font-bold text-yellow-700 mb-3 text-lg">Fair ATS Score</h3>
             <p className="text-sm text-gray-600 leading-relaxed">A score between 50 and 69 means your resume may pass some ATS systems but will rank low in candidate searches. Recruiters using ATS typically sort candidates by score — lower-scoring resumes appear at the bottom of the list even when the candidate is qualified. Resumes in this range need keyword optimization and formatting improvements to become competitive.</p>
          </div>
          <div className="bg-white border border-gray-200 p-6 rounded-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-14 h-14 bg-blue-100 rounded-bl-[40px] flex items-start justify-end p-2 px-3"><span className="text-blue-700 font-bold text-sm text-right">70-84</span></div>
             <h3 className="font-bold text-blue-700 mb-3 text-lg">Good ATS Score</h3>
             <p className="text-sm text-gray-600 leading-relaxed">A score between 70 and 84 means your resume is ATS-compatible and will pass automated screening for most job postings. However, you may still be outranked by candidates with higher keyword match scores. Improving from Good to Excellent typically requires adding missing job-specific keywords and strengthening achievement bullets with quantified results.</p>
          </div>
          <div className="bg-white border border-gray-200 p-6 rounded-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-20 h-20 bg-[#FFF7ED] rounded-bl-[60px] flex items-start justify-end p-3 px-4"><span className="text-[#EA580C] font-bold text-base text-right">85-100</span></div>
             <h3 className="font-bold text-[#FF6321] mb-3 text-lg">Excellent ATS Score</h3>
             <p className="text-sm text-gray-600 leading-relaxed">A score of 85 or above means your resume is fully ATS-optimized and will rank highly in candidate searches. Recruiters using ATS filtering will see your resume near the top of results. Resumes in this range have strong keyword match, clean formatting, complete sections, and quantified achievements. This is the target range for every job application.</p>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mb-6">How Applicant Tracking Systems Work — Why Your ATS Score Matters</h2>
        <p className="text-gray-600 mb-10 leading-relaxed text-lg">An Applicant Tracking System (ATS) is software used by employers to receive, sort, and filter job applications automatically. When you submit your resume to a company that uses ATS — which includes 98% of Fortune 500 companies and over 70% of all employers — your resume is scanned and scored before a human recruiter ever sees it. Resumes that fail ATS screening are permanently filtered out of the candidate pool, regardless of the applicant's qualifications. Understanding how ATS works is the single most important thing you can do to improve your job search success rate.</p>
        
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 mb-20 relative">
          <div className="hidden md:block absolute top-6 left-0 right-0 h-0.5 bg-gray-200 z-0"></div>
          {[
            {s:'Step 1', t:'Resume Received', d:'You submit your resume through an online application portal. The ATS receives your file and attempts to parse it — converting your resume content into structured data fields including name, contact info, work history, skills, and education.'},
            {s:'Step 2', t:'Resume Parsed', d:'The ATS extracts text from your resume and organizes it into database fields. This is where formatting issues cause problems. Tables, columns, text boxes, images, and unusual fonts confuse ATS parsers and cause important information to be misread or lost entirely.'},
            {s:'Step 3', t:'Keywords Scanned', d:'The ATS scans your parsed resume for keywords that match the job description. It looks for job titles, required skills, industry terminology, certifications, and qualifications. Resumes with high keyword match scores rank higher.'},
            {s:'Step 4', t:'Resume Ranked', d:'Resumes are ranked by ATS score and presented to recruiters in order from highest match to lowest. Recruiters typically review only the top 10-20% of applicants. If your resume ranks below this threshold it will never be seen by a human.'}
          ].map((s,i)=>(
            <div key={i} className="relative z-10 bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <div className="bg-[#FF6321] text-white text-xs font-bold px-2 py-1 rounded inline-block mb-3">{s.s}</div>
              <h4 className="font-bold text-gray-900 mb-2 text-sm">{s.t}</h4>
              <p className="text-xs text-gray-600 leading-relaxed">{s.d}</p>
            </div>
          ))}
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mb-2">ATS Platforms Our Checker Tests Against</h2>
        <p className="text-gray-500 mb-10">Our free ATS resume checker is calibrated against the formatting rules and keyword scanning logic of the most widely used Applicant Tracking Systems in 2025.</p>
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {[
            {t:'Workday', d:'Used by over 10,000 companies worldwide including Netflix, Amazon, and Bank of America. Workday ATS is strict about formatting — it cannot read tables, columns, or text boxes. It requires clear section headings and standard chronological formatting.'},
            {t:'Greenhouse', d:'Popular with tech startups and mid-size companies. Greenhouse scores resumes heavily on keyword match to job descriptions. It rewards resumes that mirror the exact language used in the job posting.'},
            {t:'Taleo (Oracle)', d:'One of the oldest and most widely used ATS systems. Used by many Fortune 500 corporations. Taleo is particularly strict about date formatting, job title recognition, and section heading standardization.'},
            {t:'Lever', d:'Used by fast-growing tech companies. Lever focuses on candidate experience scores and keyword relevance. It handles modern resume formats reasonably well but still penalizes complex layouts.'},
            {t:'iCIMS', d:'Used by large enterprises and staffing agencies. iCIMS scores resumes based on skills match, experience years, and education level. It is strict about skills section formatting and certification keywords.'},
            {t:'BambooHR', d:'Popular with small and mid-size businesses. BambooHR ATS is more flexible than enterprise systems but still filters on keyword match and basic formatting compliance.'}
          ].map((a,i)=>(
            <div key={i} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:border-[#FED7AA] transition-colors">
              <h4 className="font-extrabold text-gray-900 mb-2 text-lg">{a.t}</h4>
              <p className="text-sm text-gray-600 leading-relaxed">{a.d}</p>
            </div>
          ))}
        </div>
        
        <h2 className="text-3xl font-bold text-gray-900 mb-2">10 Most Common ATS Resume Mistakes That Get You Rejected</h2>
        <p className="text-gray-500 mb-10">These are the most frequent ATS errors we detect when job seekers run our free ATS checker. Each one significantly reduces your ATS score and your chances of getting an interview.</p>
        <div className="space-y-4 mb-20">
          {[
            {t:'1. Using Tables and Columns', d:'Multi-column layouts and tables look visually appealing in Word or PDF but are parsed incorrectly by most ATS systems. The text gets scrambled, sections get merged, and your carefully written content becomes unreadable. Always use a single-column layout.'},
            {t:'2. Missing Keywords From the Job Description', d:'The most common and most damaging ATS mistake. If your resume does not contain the specific keywords from the job posting — especially required skills and qualifications — the ATS will score you near zero for keyword match regardless of your actual experience.'},
            {t:'3. Using Headers and Footers for Contact Info', d:'Many resume templates place your name and contact details in the Word document header. Most ATS systems cannot read document headers and footers — your contact information disappears from the parsed resume entirely.'},
            {t:'4. Embedding Text in Images or Graphics', d:'Infographic-style resumes with skill charts, progress bars, or text inside graphic elements are completely invisible to ATS parsers. The system sees blank space where your skills and achievements should be.'},
            {t:'5. Non-Standard Section Headings', d:"ATS systems recognize standard headings like 'Work Experience', 'Education', and 'Skills'. Creative headings like 'Where I Have Been', 'My Journey', or 'Things I Know' confuse the parser and prevent correct categorization of your content."},
            {t:'6. Unusual Fonts and Special Characters', d:'Decorative fonts, bullet characters from symbol libraries, and special formatting characters can corrupt ATS text parsing. Stick to standard fonts (Arial, Calibri, Times New Roman, Helvetica) and standard bullet points.'},
            {t:'7. No Quantified Achievements', d:"While not strictly a formatting issue, resumes without numbers rank significantly lower in ATS candidate searches. ATS systems are increasingly trained to recognize achievement-oriented language. 'Increased sales by 34%' ranks higher than 'responsible for sales'."},
            {t:'8. Inconsistent Date Formatting', d:"Mixing date formats such as 'January 2022', '01/2022', and '2022' within the same resume confuses ATS date parsers and can cause your employment history to be incorrectly sequenced or misread."},
            {t:'9. Saving Resume as an Image PDF', d:'When you print-to-PDF from certain design tools, the resulting PDF contains images of text rather than actual text. ATS systems cannot read image-based PDFs and will score these resumes at or near zero. Always export as a text-based PDF from Word or Google Docs.'},
            {t:'10. Generic Skills Section', d:"Listing only soft skills like 'communication' and 'teamwork' without technical skills, tools, and industry-specific keywords results in poor keyword match scores. Your skills section should include the specific tools, platforms, methodologies, and certifications relevant to your target role."}
          ].map((m,i)=>(
            <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <h4 className="font-bold text-gray-900 mb-2">{m.t}</h4>
              <p className="text-sm text-gray-600 leading-relaxed">{m.d}</p>
            </div>
          ))}
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mb-8">ATS Screening vs Human Review — Understanding the Two-Stage Process</h2>
        <div className="grid md:grid-cols-2 gap-8 mb-10">
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8">
            <div className="text-xs font-bold tracking-widest text-[#EA580C] uppercase mb-4">Stage 1</div>
            <h3 className="font-extrabold text-2xl text-gray-900 mb-4">ATS Stage (automated)</h3>
            <p className="text-gray-600 leading-relaxed">The ATS stage happens in milliseconds. The system parses your resume, extracts keywords, scores keyword match against the job description, evaluates formatting compliance, and ranks you among all applicants. No human is involved. Your resume either passes this filter or disappears from the candidate pool permanently. The ATS does not care about your personality, potential, or context — only whether your resume matches its scoring criteria.</p>
          </div>
          <div className="bg-white border border-gray-200 shadow-xl rounded-2xl p-8 transform md:-translate-y-4">
            <div className="text-xs font-bold tracking-widest text-blue-600 uppercase mb-4">Stage 2</div>
            <h3 className="font-extrabold text-2xl text-gray-900 mb-4">Human Review Stage</h3>
            <p className="text-gray-600 leading-relaxed">Resumes that pass ATS screening reach a human recruiter — but only for 6 to 7 seconds initially. The recruiter scans for your most recent job title and company, employment gaps, career progression, and whether your experience matches what they need. Resumes that pass both stages share two qualities: ATS-optimized formatting and keyword match, plus clear, achievement-focused content that communicates value instantly to a human reader.</p>
          </div>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-20 bg-[#FFF7ED] py-8 rounded-2xl border border-[#FED7AA]">
          <div className="text-center px-4"><div className="text-3xl font-extrabold text-[#FF6321] mb-1">98%</div><div className="text-xs font-bold text-gray-600 uppercase">of Fortune 500 use ATS</div></div>
          <div className="text-center px-4"><div className="text-3xl font-extrabold text-[#FF6321] mb-1">75%</div><div className="text-xs font-bold text-gray-600 uppercase">of resumes rejected by ATS</div></div>
          <div className="text-center px-4"><div className="text-3xl font-extrabold text-[#FF6321] mb-1">10s</div><div className="text-xs font-bold text-gray-600 uppercase">for human first scan</div></div>
          <div className="text-center px-4"><div className="text-3xl font-extrabold text-[#FF6321] mb-1">20%</div><div className="text-xs font-bold text-gray-600 uppercase">top scores get reviewed</div></div>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mb-2">Frequently Asked Questions About ATS Resume Checking</h2>
        <p className="text-gray-500 mb-10">Everything you need to know about ATS systems, ATS scores, and how to optimize your resume to pass automated screening in 2025.</p>
        <div className="space-y-4 mb-20">
          {[
            {q:'What is an ATS resume checker and how does it work?', a:'An ATS resume checker is a tool that analyzes your resume against the same criteria used by Applicant Tracking Systems to screen job applications. It scans your resume for keyword match with a job description, checks for ATS-incompatible formatting such as tables and columns, evaluates whether your sections are correctly labeled, and scores your resume on a scale from 0 to 100. Our free ATS resume checker provides an instant score plus a detailed report showing exactly what is wrong and how to fix it — no sign-up required.'},
            {q:'Is your ATS checker really free? Do I need to sign up?', a:'Yes — our ATS resume checker is completely free to use with no sign-up, no credit card, and no email address required. Simply paste your resume text into the checker, optionally add a job description for a full keyword analysis, and click Check My ATS Score. You get your full ATS report, keyword gap analysis, and formatting checklist instantly. There is no limit on how many times you can use it.'},
            {q:'What is a good ATS score?', a:'A good ATS score is 70 or above. Scores of 85 to 100 are considered excellent and indicate your resume is fully ATS-optimized. Scores of 70 to 84 are good — your resume will pass most ATS filters but may rank lower than candidates with higher keyword match scores. Scores below 70 indicate significant issues that need to be fixed before submitting. Most job seekers who run our checker find their initial score is between 45 and 65, which explains why they are not getting callbacks despite applying to many jobs.'},
            {q:'What causes a low ATS score?', a:'The most common causes of a low ATS score are: missing keywords from the job description (the biggest factor), ATS-incompatible formatting such as tables, columns, or text boxes, non-standard section headings that the ATS cannot recognize, contact information placed in document headers or footers, no quantified achievements in work experience bullets, skills listed in image-based charts instead of plain text, and saving the resume as an image PDF instead of a text-based PDF. Our ATS checker identifies all of these issues specifically and tells you exactly how to fix each one.'},
            {q:'How do I optimize my resume to pass ATS?', a:'To optimize your resume to pass ATS screening: First, use a single-column layout with no tables, columns, or text boxes. Second, add keywords from the job description naturally throughout your resume — especially in your skills section and work experience bullets. Third, use standard section headings: Work Experience, Education, Skills, Professional Summary. Fourth, quantify your achievements with numbers and percentages. Fifth, place your contact information in the main document body, not the header. Sixth, export your resume as a text-based PDF from Word or Google Docs. Our AI resume builder automatically applies all of these optimizations.'},
            {q:'Which ATS systems does your checker test against?', a:'Our ATS resume checker is calibrated against the formatting rules and keyword scanning behavior of the six most widely used Applicant Tracking Systems in 2025: Workday, Greenhouse, Taleo (Oracle), Lever, iCIMS, and BambooHR. These six platforms cover the majority of enterprise and mid-market employers. Our checker applies a composite scoring model that reflects the combined requirements of these systems, so a high score on our checker indicates strong ATS compatibility across all major platforms.'},
            {q:'How often should I check my ATS score?', a:'You should check your ATS score every time you apply for a new job — ideally running a Full ATS Check with the specific job description pasted in. A resume that scores 90% for one job posting may score 65% for a different role because the keyword requirements are different. Tailoring your resume to each job description and re-checking your ATS score before every application is one of the most effective ways to increase your interview rate. Our checker is free and unlimited so you can run it as often as needed.'},
            {q:'Can I pass ATS with a creative or designed resume?', a:'Creative resume designs with multiple columns, infographic elements, icons, and decorative fonts almost always fail ATS screening. Even if the design looks impressive to a human, the ATS parser cannot read the content correctly. If you are applying to companies that use ATS — which is most employers — you should always use a clean, ATS-optimized resume format. If you are applying directly to creative agencies or sending your resume to a human contact rather than an online portal, a designed resume can work. Our recommendation: maintain two versions — an ATS-safe version for online applications and a designed version for direct outreach.'}
          ].map((faq, i) => (
             <FAQ key={i} q={faq.q} a={faq.a} />
          ))}
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Check Your Score — Then Fix It Automatically With AI</h2>
        <div className="grid md:grid-cols-2 gap-6 mb-24">
          <div className="bg-white border text-center border-gray-200 p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6"><Search className="w-8 h-8 text-gray-600"/></div>
            <h3 className="font-extrabold text-2xl text-gray-900 mb-3">ATS Checker</h3>
            <p className="text-gray-600 text-sm mb-6 leading-relaxed">Our free ATS checker shows you exactly what is wrong with your current resume. Use it to diagnose your resume's weaknesses before every job application. It takes 10 seconds and requires no sign-up.</p>
            <ul className="text-sm text-gray-700 space-y-3 mb-8 text-left max-w-[200px] mx-auto">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-600"/> Instant ATS score 0-100</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-600"/> Keyword gap analysis</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-600"/> Formatting issue report</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-600"/> Priority fix list</li>
            </ul>
            <button onClick={() => window.scrollTo({top: 200, behavior: 'smooth'})} className="w-full py-4 bg-white border border-[#FF6321] text-[#FF6321] font-bold rounded-xl hover:bg-[#FFF7ED] transition-colors">Check My Resume Free →</button>
          </div>
          <div className="bg-[#FF6321] text-white text-center p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-black/10 rounded-full blur-3xl -ml-20 -mb-20"></div>
            <div className="relative z-10 w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm"><FileText className="w-8 h-8 text-white"/></div>
            <h3 className="font-extrabold text-2xl mb-3">AI Resume Builder</h3>
            <p className="text-[#FED7AA] text-sm mb-6 leading-relaxed">Once you know what is wrong, our AI resume builder fixes everything automatically. Paste any job description and get a fully ATS-optimized resume in 2 minutes — with all the right keywords.</p>
            <ul className="text-sm text-white space-y-3 mb-8 text-left max-w-[240px] mx-auto">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-white"/> ATS score 85+ guaranteed</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-white"/> Keywords auto-matched to job</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-white"/> Clean ATS-safe formatting</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-white"/> Achievement bullets auto-written</li>
            </ul>
            <button onClick={() => onNavigate(1)} className="w-full py-4 bg-white text-[#FF6321] font-bold rounded-xl hover:bg-gray-50 transition-colors shadow-sm">Build ATS Resume With AI →</button>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">How Our ATS Checker Helps You Get Hired</h2>
        <div className="grid md:grid-cols-3 gap-6 mb-24">
          {[
            {q:"Our ATS checker scans your resume against real applicant tracking system criteria and shows you exactly which keywords from the job description are missing — so you know precisely what to fix before you apply.", a:"Keyword Gap Analysis", r:"See what recruiters search for"},
            {q:"Many resumes fail ATS scans simply due to formatting — two-column layouts, tables, and graphics that automated systems cannot parse. Our checker flags formatting issues that could be silently rejecting your application.", a:"Format Compatibility Check", r:"Built for Workday, Greenhouse & more"},
            {q:"Get an instant ATS score from 0-100 with a clear breakdown of what's working and what needs improvement — then use our AI builder to fix every flagged issue in minutes.", a:"Instant Score & Fixes", r:"From score to solution in one click"}
          ].map((t,i)=>(
            <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
              <p className="text-gray-600 italic mb-6 flex-1 text-sm leading-relaxed">"{t.q}"</p>
              <div>
                <p className="font-bold text-gray-900">{t.a}</p>
                <p className="text-xs text-gray-500">{t.r}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-br from-[#FF6321] to-[#EA580C] text-white rounded-3xl p-10 md:p-14 text-center shadow-xl">
          <h2 className="text-3xl font-bold mb-4 leading-tight">Your Resume Deserves to Be Seen — Start With a Free ATS Check</h2>
          <p className="text-[#FED7AA] text-lg mb-8 max-w-2xl mx-auto leading-relaxed">Thousands of qualified candidates lose jobs every day because their resume never reaches a human recruiter. Run your free ATS check now and find out exactly what is stopping yours — then fix it with AI in 2 minutes.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
            <button onClick={() => window.scrollTo({top: 200, behavior: 'smooth'})} className="px-8 py-4 bg-white text-[#FF6321] font-bold rounded-xl hover:bg-gray-50 transition-colors shadow-lg flex items-center justify-center gap-2">Check My ATS Score Free <ArrowRight className="w-4 h-4"/></button>
            <button onClick={() => onNavigate(1)} className="px-8 py-4 bg-transparent border-2 border-white/30 text-white font-bold rounded-xl hover:bg-white/10 transition-colors">Build ATS-Optimized Resume</button>
          </div>
          <p className="text-[#FED7AA] text-sm font-medium">No sign-up required. Instant results. Used by 500,000+ job seekers in 120+ countries.</p>
        </div>
      </div>
    </div>
  );
};

function FAQ({ q, a }: { q: string, a: string, key?: any }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-[#FF6321]/30 transition-colors">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-6 text-left focus:outline-none">
        <span className="font-bold text-lg text-gray-900">{q}</span>
        <div className={`transform transition-transform duration-300 ${open ? 'rotate-180 text-[#FF6321]' : 'text-gray-400'}`}>
          <ChevronDown className="w-5 h-5" />
        </div>
      </button>
      <AnimatePresence>
        {open && (
           <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
             <div className="px-6 pb-6 text-gray-600 leading-relaxed border-t border-gray-100 pt-4 cursor-text text-sm">
               {a}
             </div>
           </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
