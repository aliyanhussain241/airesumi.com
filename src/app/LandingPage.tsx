import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Sparkles, Target, CircleDollarSign, Crown, Search, Send, MessageSquare, Gauge, User, CheckCircle2, Star, Wand2, FileText, Briefcase, CheckCircle, ArrowRight, Compass, Mic, Mail, Link2, Users, GraduationCap, TrendingUp, Zap } from "lucide-react";
import { Step } from "./App";
import { BlogHighlights } from "./components/BlogHighlights";

interface LandingPageProps {
  setStep: (step: Step) => void;
}

const FAQ_SCHEMA = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Is Airesumi free to use?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, Airesumi is completely free to use. You can build and download ATS-optimized resumes without any sign-up. A Pro plan is available for unlimited resumes and premium templates."
      }
    },
    {
      "@type": "Question",
      "name": "What is an ATS resume and why does it matter?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "An ATS (Applicant Tracking System) resume is formatted to pass the automated screening software used by 99% of large employers. Without ATS optimization, your resume may never reach a human recruiter. Airesumi automatically formats and optimizes every resume for ATS compatibility."
      }
    },
    {
      "@type": "Question",
      "name": "How does the AI resume builder work?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Paste the job description and your career details. Our AI generates a tailored, ATS-optimized resume in under 10 minutes — no manual formatting needed. You can then download it as a PDF."
      }
    },
    {
      "@type": "Question",
      "name": "Do I need to sign up to use Airesumi?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No sign-up is required to build your first resume. Create a free account to save and manage multiple resumes across sessions."
      }
    },
    {
      "@type": "Question",
      "name": "Can Airesumi generate a cover letter too?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Airesumi has a free AI cover letter generator that creates a tailored cover letter matching your resume and the target job description — in under 2 minutes."
      }
    },
    {
      "@type": "Question",
      "name": "How is Airesumi different from other resume builders?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Airesumi uses AI to tailor your resume to each specific job description, not just a generic template. It also includes an ATS checker, cover letter generator, LinkedIn bio tool, salary analyzer, and interview prep — all in one free platform."
      }
    },
    {
      "@type": "Question",
      "name": "What resume formats does Airesumi support?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Airesumi offers 18+ professional resume templates that are all ATS-friendly. You can download your resume as a PDF ready to submit to any job application."
      }
    }
  ]
});

export const LandingPage: React.FC<LandingPageProps> = ({ setStep }) => {
  const [activeToolsTab, setActiveToolsTab] = useState(1);
  const [progressKey, setProgressKey] = useState(0);

  useEffect(() => {
    // FIX #11: Interval pauses when tab is hidden (saves battery, prevents background jank).
    // It also only runs when the section is visible — using document.visibilityState.
    let timer: ReturnType<typeof setInterval> | null = null;

    const start = () => {
      if (timer) return;
      timer = setInterval(() => {
        setActiveToolsTab((prev) => (prev % 4) + 1);
        setProgressKey((prev) => prev + 1);
      }, 5000);
    };

    const stop = () => {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    };

    const handleVisibility = () => {
      document.hidden ? stop() : start();
    };

    start();
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      stop();
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  const handleTabClick = (index: number) => {
    setActiveToolsTab(index);
    setProgressKey(prev => prev + 1);
  };

  return (
    <motion.div
      key="landing"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen bg-[#f9fafb] relative print:hidden overflow-x-hidden pt-[68px]"
    >
      <div className="max-w-7xl mx-auto px-6 pt-8 lg:pt-12 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
           <div className="max-w-xl relative z-10">
             <h1 className="text-4xl md:text-5xl lg:text-[72px] font-medium text-[#2d3748] leading-[1.1] mb-6">
               AI Resume Builder — Free ATS-Optimized Resumes That Get You <span className="text-[#FF6321]">Hired</span>
             </h1>
             <p className="text-[20px] text-[#4a5568] mb-10 leading-[1.6]">
               Most resumes fail not because of bad experience — but because no one ever reads them. Build yours with AI in 10 minutes and land on the recruiter's desk, not the reject pile.
             </p>
             <div className="flex flex-col sm:flex-row items-center gap-4 mb-10">
               <a
                 href="/resume"
                 className="hdr-btn-primary text-white text-[17px] font-bold px-10 py-4 rounded-xl no-underline whitespace-nowrap">
                 <span className="relative z-10">Create my resume</span>
               </a>
               <a
                 href="/resume"
               className="hdr-tag flex items-center gap-1.5 text-[17px] font-medium text-[#EA580C] px-10 py-4 rounded-xl no-underline transition-all hover:bg-orange-50">
                 Upload my resume
               </a>
             </div>
             
              <motion.div
                initial="hidden"
                animate="show"
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } } }}
                className="flex flex-wrap items-center gap-2.5"
              >
                {[
                  { icon: <CheckCircle2 size={14} className="text-white" />, iconBg: "bg-[#22c55e]", label: "ATS-optimized", sub: "recruiter-approved" },
                  { icon: <Star size={14} fill="white" className="text-white" />, iconBg: "bg-[#00b67a]", label: "100% free", sub: "no card required" },
                  { icon: <span className="text-white text-[11px] font-bold">10m</span>, iconBg: "bg-[#FF6321]", label: "Ready in minutes", sub: "not hours" },
                  { icon: <span className="text-white text-[11px] font-bold">4.8★</span>, iconBg: "bg-[#1a202c]", label: "Loved by 12k+", sub: "job seekers" },
                ].map((t, i) => (
                  <motion.div
                    key={i}
                    variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
                    whileHover={{ y: -2, scale: 1.03 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="group relative flex items-center gap-2 pl-1.5 pr-3.5 py-1.5 rounded-full bg-white/70 backdrop-blur-md border border-[#e2e8f0] shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_16px_rgba(255,99,33,0.12)] hover:border-[#FF6321]/30 transition-all"
                  >
                    <div className={`${t.iconBg} rounded-full w-6 h-6 flex items-center justify-center shrink-0 shadow-sm`}>
                      {t.icon}
                    </div>
                    <div className="flex items-baseline gap-1.5 leading-none">
                      <span className="text-[13px] font-semibold text-[#1a202c]">{t.label}</span>
                      <span className="text-[12px] text-[#64748b]">{t.sub}</span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
           </div>
           
            <div className="relative h-[500px] lg:h-[620px] flex items-center justify-center mt-8 lg:mt-0 transform scale-[0.6] sm:scale-[0.8] lg:scale-100 origin-top -mb-[150px] sm:-mb-[80px] lg:mb-0">
              {/* Ambient Gradient Glows */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.6, delay: 0.1 }}
                className="absolute w-[520px] h-[520px] rounded-full blur-3xl z-0 pointer-events-none"
                style={{ background: "radial-gradient(circle at 30% 30%, rgba(255,99,33,0.35), rgba(255,140,90,0.15) 40%, transparent 70%)" }}
              />
              <motion.div
                animate={{ scale: [1, 1.08, 1], opacity: [0.35, 0.55, 0.35] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-10 right-10 w-72 h-72 rounded-full blur-3xl z-0 pointer-events-none"
                style={{ background: "radial-gradient(circle, rgba(255,99,33,0.28), transparent 70%)" }}
              />

              {/* Subtle grid backdrop */}
              <div
                className="absolute inset-0 z-0 opacity-[0.35] pointer-events-none"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(15,23,42,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.06) 1px, transparent 1px)",
                  backgroundSize: "28px 28px",
                  maskImage: "radial-gradient(circle at 50% 50%, black 40%, transparent 75%)",
                  WebkitMaskImage: "radial-gradient(circle at 50% 50%, black 40%, transparent 75%)",
                }}
              />

              {/* Main Resume Paper */}
              <motion.div
                initial={{ opacity: 0, y: 40, rotateX: 10 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 0.9, ease: "easeOut" }}
                className="absolute bg-white rounded-2xl p-8 w-[400px] h-[540px] z-10 flex flex-col pt-10 text-left overflow-hidden"
                style={{
                  boxShadow:
                    "0 30px 60px -25px rgba(15,23,42,0.25), 0 10px 30px -12px rgba(255,99,33,0.15), inset 0 0 0 1px rgba(255,255,255,0.9)",
                }}
              >
                {/* Top gradient bar */}
                <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#FF6321] via-[#ff8c5a] to-[#FF6321]" />

                {/* Live status pill */}
                <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-700">Live</span>
                </div>

                <div className="border-b border-gray-100 pb-5 mb-5 select-none">
                  <h3 className="text-[#FF6321] text-3xl font-serif font-semibold tracking-tight">Alice Hart</h3>
                  <p className="text-gray-500 text-sm mt-1">Math Teacher · San Francisco, CA</p>
                </div>

                {/* AI-typing summary */}
                <div className="space-y-2 mb-6">
                  <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 1.2, delay: 0.6 }} className="h-2.5 bg-gradient-to-r from-gray-200 to-gray-100 rounded" />
                  <motion.div initial={{ width: 0 }} animate={{ width: "91.6667%" }} transition={{ duration: 1.2, delay: 0.9 }} className="h-2.5 bg-gradient-to-r from-gray-200 to-gray-100 rounded" />
                  <motion.div initial={{ width: 0 }} animate={{ width: "83.3333%" }} transition={{ duration: 1.2, delay: 1.2 }} className="h-2.5 bg-gradient-to-r from-gray-200 to-gray-100 rounded" />
                </div>

                <div className="space-y-4 flex-1">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-1 h-4 bg-[#FF6321] rounded-full" />
                      <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Employment History</p>
                    </div>
                    <div className="space-y-2">
                      <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.4 }} className="h-2.5 bg-gray-200 rounded w-full" />
                      <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.55 }} className="h-2.5 bg-gray-200 rounded w-11/12" />
                      <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.7 }} className="h-2.5 bg-gray-200 rounded w-3/4" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-1 h-4 bg-[#FF6321] rounded-full" />
                      <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Education</p>
                    </div>
                    <div className="space-y-2">
                      <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.85 }} className="h-2.5 bg-gray-200 rounded w-full" />
                      <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 2 }} className="h-2.5 bg-gray-200 rounded w-5/6" />
                    </div>
                  </div>
                </div>

                {/* Bottom keyword chips */}
                <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap gap-1.5">
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#FF6321]/10 text-[#FF6321] uppercase tracking-wider">Curriculum</span>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 uppercase tracking-wider">STEM</span>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 uppercase tracking-wider">Mentoring</span>
                </div>
              </motion.div>

              {/* Floating Avatar */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3, ease: "backOut" }}
                className="absolute top-8 right-2 w-40 h-40 rounded-full border-[6px] border-white z-20 overflow-hidden hover:scale-105 transition-transform duration-300"
                style={{ boxShadow: "0 20px 45px -15px rgba(255,99,33,0.45), 0 8px 20px -8px rgba(15,23,42,0.2)" }}
              >
                <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80" alt="Avatar" className="w-full h-full object-cover" loading="lazy" width="300" height="300" />
                {/* Verified badge */}
                <div className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-[#FF6321] border-2 border-white flex items-center justify-center shadow-md">
                  <CheckCircle2 size={14} className="text-white" />
                </div>
              </motion.div>

              {/* Floating Resume Score with animated ring */}
              <motion.div
                initial={{ opacity: 0, x: -30, y: 10 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
                className="absolute top-32 -left-24 bg-white rounded-2xl p-3 pr-4 flex items-center gap-3 z-30 hover:-translate-y-1 transition-transform duration-300 pointer-events-auto cursor-default border border-white"
                style={{ boxShadow: "0 20px 45px -18px rgba(15,23,42,0.25)" }}
              >
                <div className="relative w-12 h-12">
                  <svg viewBox="0 0 44 44" className="w-12 h-12 -rotate-90">
                    <circle cx="22" cy="22" r="18" fill="none" stroke="#e5e7eb" strokeWidth="4" />
                    <motion.circle
                      cx="22" cy="22" r="18" fill="none" stroke="#22c55e" strokeWidth="4" strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 18}
                      initial={{ strokeDashoffset: 2 * Math.PI * 18 }}
                      animate={{ strokeDashoffset: 2 * Math.PI * 18 * (1 - 0.81) }}
                      transition={{ duration: 1.4, delay: 0.8, ease: "easeOut" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-emerald-600">81%</div>
                </div>
                <div>
                  <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Resume Score</div>
                  <div className="text-sm font-bold text-[#2d3748]">Recruiter Ready</div>
                </div>
              </motion.div>

              {/* Floating ATS Perfect */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, x: 30 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6, ease: "backOut" }}
                className="absolute top-[28%] -right-16 text-white px-4 py-3 rounded-xl font-bold flex items-center gap-2 z-30 hover:scale-105 transition-transform duration-300 cursor-default"
                style={{
                  background: "linear-gradient(135deg, #FF6321 0%, #ff8c5a 100%)",
                  boxShadow: "0 15px 40px -10px rgba(255,99,33,0.6), inset 0 1px 0 rgba(255,255,255,0.3)",
                }}
              >
                <Wand2 size={18} /> ATS Perfect
                <span className="ml-1 text-[10px] bg-white/25 px-1.5 py-0.5 rounded font-bold">v2</span>
              </motion.div>

              {/* Floating Skills Card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7, ease: "easeOut" }}
                className="absolute bottom-24 -right-28 bg-white p-5 rounded-2xl z-20 w-60 border border-white/80 hover:-translate-y-1 transition-transform duration-300"
                style={{ boxShadow: "0 25px 50px -20px rgba(15,23,42,0.3)" }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-[#FF6321]/10 flex items-center justify-center">
                      <Sparkles size={12} className="text-[#FF6321]" />
                    </div>
                    <h4 className="font-bold text-[#2d3748] text-sm">AI Skills</h4>
                  </div>
                  <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded uppercase tracking-wider">+3</span>
                </div>
                <div className="space-y-2">
                  {[
                    { label: "Management Skills", pct: 92 },
                    { label: "Analytical Thinking", pct: 87 },
                    { label: "Leadership", pct: 78 },
                  ].map((s, i) => (
                    <div key={s.label} className="bg-gray-50 rounded-lg px-2.5 py-1.5 border border-gray-100">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[12px] font-semibold text-gray-700">{s.label}</span>
                        <span className="text-[10px] font-bold text-gray-400">{s.pct}%</span>
                      </div>
                      <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${s.pct}%` }}
                          transition={{ duration: 1, delay: 0.9 + i * 0.15, ease: "easeOut" }}
                          className="h-full rounded-full bg-gradient-to-r from-[#FF6321] to-[#ff8c5a]"
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <button className="text-[#FF6321] font-bold text-xs mt-3 pt-2 flex items-center gap-1 w-full justify-center border-t border-orange-50 hover:bg-orange-50 transition-colors rounded-none">
                  + Add skill
                </button>
              </motion.div>

              {/* Floating Ask AI */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
                className="absolute -bottom-2 -left-20 bg-white p-3.5 rounded-2xl z-30 flex items-center gap-3 border border-white/80 pr-5 w-80 hover:scale-[1.02] transition-transform duration-300 pointer-events-auto"
                style={{ boxShadow: "0 25px 50px -20px rgba(15,23,42,0.3)" }}
              >
                <div className="relative w-9 h-9 shrink-0">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-orange-400 via-orange-500 to-orange-600 border-2 border-white shadow-md flex items-center justify-center">
                    <Sparkles size={14} className="text-white" />
                  </div>
                  <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF6321] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FF6321] border border-white" />
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-bold text-[#FF6321] uppercase tracking-wider mb-0.5">AI Coach</div>
                  <div className="text-gray-600 text-[13px] font-medium truncate">Ask anything about your resume…</div>
                </div>
                <div className="flex gap-0.5 items-center">
                  <span className="w-1 h-1 rounded-full bg-gray-400 animate-pulse" />
                  <span className="w-1 h-1 rounded-full bg-gray-400 animate-pulse" style={{ animationDelay: "150ms" }} />
                  <span className="w-1 h-1 rounded-full bg-gray-400 animate-pulse" style={{ animationDelay: "300ms" }} />
                </div>
              </motion.div>
            </div>
        </div>
      </div>
      
      {/* Stats & Features Section */}
      <div className="max-w-7xl mx-auto px-6 pb-24 mt-20">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#FF6321]/25 bg-[#FF6321]/8 text-[#FF6321] text-[12px] font-semibold uppercase tracking-[0.14em] mb-5">
            <TrendingUp size={13} /> Trusted this week
          </div>
          <div className="flex flex-col items-center justify-center gap-4 mb-10 max-w-4xl mx-auto">
            <div className="bg-orange-50 p-2.5 rounded-xl text-orange-400 shrink-0">
              <Wand2 size={32} />
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-[#2d3748] dark:text-[#f5f5f4] text-center leading-tight tracking-tight">
              <span className="text-[#FF6321]">52,000+</span> resumes built this week — here's why job seekers choose airesumi
            </h2>
          </div>


          {/* Live stats strip */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-12 max-w-5xl mx-auto">
            {[
              { value: "52,000+", label: "Resumes built this week", icon: FileText },
              { value: "98%", label: "ATS pass rate", icon: CheckCircle2 },
              { value: "3.2x", label: "More interview callbacks", icon: TrendingUp },
              { value: "120+", label: "Countries served", icon: Compass },
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.06 }}
                  className="relative bg-white dark:bg-[#16191f] rounded-2xl border border-gray-100 dark:border-white/10 p-4 sm:p-5 text-left overflow-hidden group"
                  style={{ boxShadow: "0 10px 30px -18px rgba(15,23,42,0.18)" }}
                >
                  <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full bg-[#FF6321]/8 group-hover:bg-[#FF6321]/14 transition-colors" />
                  <Icon size={18} className="text-[#FF6321] mb-2 relative" />
                  <div className="text-2xl sm:text-3xl font-bold text-[#1a202c] dark:text-[#f5f5f4] tracking-tight relative">{s.value}</div>
                  <div className="text-[12px] text-gray-500 dark:text-gray-400 mt-0.5 relative">{s.label}</div>
                </motion.div>
              );
            })}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {[
              { icon: Sparkles, badge: "01", title: "Your first draft in under 10 minutes", desc: "Most people spend 3–4 hours on a resume and still aren't happy with it. With airesumi, fill in your details once — the AI handles the rest." },
              { icon: Wand2, badge: "02", title: "No more second-guessing every sentence", desc: "Not everyone is a professional writer — and that's fine. The AI fixes awkward phrasing and makes your experience sound the way it deserves to." },
              { icon: Target, badge: "03", title: "Built to pass ATS — not just look good", desc: "A resume that looks great but fails the ATS scan never reaches anyone. Every template is structured to clear the filters 99% of large companies use." },
              { icon: CircleDollarSign, badge: "04", title: "Know what you're worth before you negotiate", desc: "Most people accept the first offer. Our salary analyzer shows you the real market rate for your role — so you walk in knowing your number." },
            ].map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  whileHover={{ y: -4 }}
                  className="liquid-card rounded-2xl"
                >
                  <span className="liquid-card-shine" aria-hidden="true" />
                  <div className="liquid-card-content p-8 relative">
                    <div className="absolute top-6 right-6 text-[11px] font-bold text-gray-300 dark:text-white/20 tracking-widest">{f.badge}</div>
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FF6321]/15 to-[#FF6321]/5 flex items-center justify-center mb-6 group-hover:from-[#FF6321]/25 transition-colors">
                      <Icon size={22} className="text-[#FF6321]" />
                    </div>
                    <h3 className="font-semibold text-[#1a202c] dark:text-[#f5f5f4] text-xl mb-3 leading-snug">{f.title}</h3>
                    <p className="text-[#64748b] dark:text-gray-400 text-[15px] leading-relaxed">{f.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Trust footer strip */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-[13px] text-gray-500 dark:text-gray-400"
          >
            <div className="flex items-center gap-1.5"><CheckCircle2 size={15} className="text-[#FF6321]" /> No credit card required</div>
            <div className="flex items-center gap-1.5"><CheckCircle2 size={15} className="text-[#FF6321]" /> Download as PDF instantly</div>
            <div className="flex items-center gap-1.5"><CheckCircle2 size={15} className="text-[#FF6321]" /> ATS-tested templates</div>
            <div className="flex items-center gap-1.5">
              <div className="flex -space-x-0.5">
                {[...Array(5)].map((_, i) => <Star key={i} size={13} className="fill-[#FF6321] text-[#FF6321]" />)}
              </div>
              4.8/5 from 1,200+ users
            </div>
          </motion.div>
        </div>
      </div>


      {/* Tools Section */}
      <div className="max-w-7xl mx-auto px-6 pb-32">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#FF6321]/25 bg-[#FF6321]/8 text-[#FF6321] text-[12px] font-semibold uppercase tracking-[0.14em] mb-5">
            <Sparkles size={13} /> The Career Toolkit
          </div>
          <h2 className="text-4xl lg:text-5xl font-semibold text-[#2d3748] mb-4 tracking-tight">
            Every tool you need is here.
          </h2>
          <p className="text-muted-foreground text-[16px] max-w-xl mx-auto">
            One workflow, four milestones — from a blank page to a signed offer.
          </p>
        </div>

        {(() => {
          const TABS = [
            {
              id: 1, icon: FileText, label: "Get Noticed", short: "Stand out from 1,000+ applicants",
              cards: [
                { icon: FileText, title: "Resume Builder", desc: "Build the resume that gets you hired. Finish a draft in 20 minutes with Recruiter‑AI.", stat: "20 min", statLabel: "avg. draft" },
                { icon: Target, title: "Recruiter Match", desc: "We close-match your resume and send it to 50 recruiters every week.", stat: "50/wk", statLabel: "recruiter sends" },
              ],
            },
            {
              id: 2, icon: Briefcase, label: "Get Hired", short: "Land interviews faster",
              cards: [
                { icon: Search, title: "Job Board", desc: "Every online job board in one place. We scan the entire internet every day.", stat: "1.2M+", statLabel: "live jobs" },
                { icon: Send, title: "Auto Apply", desc: "Our experts apply for you. Interviews land straight in your inbox.", stat: "10x", statLabel: "faster applies" },
              ],
            },
            {
              id: 3, icon: CircleDollarSign, label: "Get Paid More", short: "Negotiate with confidence",
              cards: [
                { icon: MessageSquare, title: "Interview Prep", desc: "Practice the questions that get you hired with instant AI feedback.", stat: "500+", statLabel: "questions" },
                { icon: Gauge, title: "Salary Analyzer", desc: "See if your offer beats the market. Always negotiate — earn 7% more.", stat: "+7%", statLabel: "avg. lift" },
              ],
            },
            {
              id: 4, icon: Crown, label: "Get Promoted", short: "Grow into your next title",
              cards: [
                { icon: User, title: "Career Coaching", desc: "1‑on‑1 with an expert — expand network, interview better, negotiate higher.", stat: "1:1", statLabel: "expert access" },
                { icon: Sparkles, title: "Future Learn", desc: "Certified courses respected by employers. Future‑proof yourself.", stat: "200+", statLabel: "courses" },
              ],
            },
          ] as const;

          const current = TABS.find(t => t.id === activeToolsTab)!;

          return (
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
              {/* Sidebar Nav */}
              <div className="w-full lg:w-80 flex flex-col gap-3 shrink-0">
                {TABS.map((tab) => {
                  const active = activeToolsTab === tab.id;
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleTabClick(tab.id)}
                      className={`group flex items-start gap-4 p-4 rounded-2xl text-left transition-all ${
                        active
                          ? "bg-white dark:bg-slate-900 shadow-sm border border-orange-100 dark:border-slate-800"
                          : "border border-transparent hover:bg-white/60 dark:hover:bg-slate-900/50 cursor-pointer"
                      }`}
                    >
                      <div className="relative flex-shrink-0 w-12 h-12 flex items-center justify-center">
                        {active ? (
                          <>
                            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 48 48">
                              <circle cx="24" cy="24" r="22" fill="none" className="stroke-[#FFE9E0] dark:stroke-slate-800" strokeWidth="3" />
                              <motion.circle
                                key={progressKey}
                                cx="24"
                                cy="24"
                                r="22"
                                fill="none"
                                stroke="#FF6321"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeDasharray="138.23"
                                initial={{ strokeDashoffset: 138.23 }}
                                animate={{ strokeDashoffset: 0 }}
                                transition={{ duration: 5, ease: "linear" }}
                              />
                            </svg>
                            <div className="relative z-10 p-2.5 bg-[#FF6321] rounded-full text-white shadow-md shadow-[#FF6321]/30">
                              <Icon size={18} />
                            </div>
                          </>
                        ) : (
                          <div className="w-12 h-12 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-full text-slate-400 group-hover:text-[#FF6321] transition-colors">
                            <Icon size={18} />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 pt-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold tracking-widest ${active ? "text-[#FF6321]" : "text-slate-400"}`}>
                            0{tab.id}.
                          </span>
                          <h3 className={`font-bold truncate ${active ? "text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-300"}`}>
                            {tab.label}
                          </h3>
                        </div>
                        <p className={`text-sm mt-1 ${active ? "text-slate-500 dark:text-slate-400" : "text-slate-400 dark:text-slate-500"}`}>
                          {tab.short}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Content Cards */}
              <motion.div
                key={activeToolsTab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="flex-1 grid md:grid-cols-2 gap-6 lg:gap-8 items-start"
              >
                {current.cards.map((c, i) => {
                  const Icon = c.icon;
                  return (
                    <motion.div
                      key={c.title}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.08 }}
                      className={`group relative bg-white dark:bg-slate-900 rounded-[2.5rem] p-7 lg:p-8 border border-orange-50 dark:border-slate-800 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-orange-500/10 flex flex-col ${i === 1 ? "md:mt-12" : ""}`}
                      style={{ boxShadow: "0 20px 50px rgba(15,23,42,0.06)" }}
                    >
                      <div className="flex items-start justify-between mb-6">
                        <div className="inline-flex p-3 rounded-2xl bg-orange-50 dark:bg-orange-500/10 text-[#FF6321]">
                          <Icon size={26} />
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-[#FF6321] leading-none">{c.stat}</div>
                          <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">{c.statLabel}</div>
                        </div>
                      </div>

                      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">{c.title}</h2>
                      <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-6 flex-1">{c.desc}</p>

                      {/* Live preview */}
                      <div className="relative bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-5 mb-6 border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Live preview</span>
                          </div>
                          <div className="flex gap-1">
                            <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                            <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="h-1.5 w-full bg-orange-200 dark:bg-orange-500/30 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-[#FF6321] rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: "66%" }}
                              transition={{ duration: 1.1, delay: 0.2 + i * 0.1, ease: "easeOut" }}
                            />
                          </div>
                          <div className="h-1.5 w-4/5 bg-slate-200 dark:bg-slate-700 rounded-full" />
                          <div className="h-1.5 w-3/5 bg-slate-200 dark:bg-slate-700 rounded-full" />
                        </div>
                      </div>

                      <div className="inline-flex items-center gap-2 font-bold text-[#FF6321] text-sm group-hover:gap-3 transition-all">
                        Explore tool <ArrowRight size={16} />
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          );
        })()}
      </div>

      {/* Way beyond a resume builder section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-32 relative">
        {/* Ambient background glow */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-0 overflow-hidden">
          <div className="absolute top-24 left-1/2 -translate-x-1/2 w-[720px] h-[720px] rounded-full bg-[radial-gradient(closest-side,rgba(255,99,33,0.14),transparent)] blur-2xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14 relative z-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#FF6321]/25 bg-[#FF6321]/8 text-[#FF6321] text-[12px] font-semibold uppercase tracking-[0.14em] mb-5">
            <Zap size={13} className="fill-[#FF6321]" /> All-in-one career OS
          </div>
          <h2 className="text-3xl lg:text-5xl font-semibold text-foreground mb-4 tracking-tight text-balance">
            Way beyond a{" "}
            <span className="relative inline-block">
              <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-[#FF6321] to-[#ff9a3c]">resume builder</span>
              <svg aria-hidden viewBox="0 0 200 12" className="absolute -bottom-1 left-0 w-full h-2.5 text-[#FF6321]/40"><path d="M2 8 Q 60 2 100 6 T 198 5" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round"/></svg>
            </span>
          </h2>
          <p className="text-muted-foreground text-[16px] lg:text-[17px] max-w-xl mx-auto text-pretty">
            Seven tools working together — from first draft to signed offer.
          </p>
        </motion.div>

        {(() => {
          const features = [
            { icon: Compass,  title: "Step-by-step guidance", desc: "No need to think much. We guide you through every step of the process — showing what to add and where.", cta: "Create my resume", href: "/resume", tag: "AI-powered", span: 2 },
            { icon: Wand2,    title: "AI writes for you",     desc: "Speak into the mic and the AI fixes mistakes. Stuck? Click to add phrases that sound professional.", tag: "AI-powered" },
            { icon: Mail,     title: "Instant cover letters", desc: "Paste a job link. We craft a matching cover letter using your resume in 2 minutes — built to impress recruiters.", cta: "Write my letter", href: "/cover-letter", tag: "AI-powered" },
            { icon: Link2,    title: "Paste any job link",    desc: "We know the formula recruiters look for. Drop a job description and we pre-build your resume to match it.", cta: "Tailor my resume", href: "/resume", span: 2 },
            { icon: Users,    title: "Recruiter Match",       desc: "Recruiters come to us with roles they can't fill. We match your resume with up to 50 recruiters a week.", cta: "Start distributing", href: "/premium", span: 2 },
            { icon: GraduationCap, title: "Need some advice?", desc: "98% of our coaching clients receive a job offer within 12 weeks. Real humans, real results.", cta: "Book a coach", href: "/contact" },
          ] as const;
          return (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6 relative z-10">
              {features.map((f, i) => {
                const Icon = f.icon;
                const span = "span" in f && f.span === 2 ? "lg:col-span-2" : "";
                return (
                  <motion.div
                    key={f.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.5, delay: i * 0.05 }}
                    className={`group relative ${span}`}
                  >
                    {/* Gradient border shell */}
                    <div className="absolute -inset-px rounded-[32px] bg-gradient-to-br from-[#FF6321]/40 via-[#ff9a3c]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-[2px]" />
                    <div className="relative h-full rounded-[32px] bg-gradient-to-br from-[#fff5ef] to-[#ffe9dc] dark:from-white/[0.04] dark:to-white/[0.02] border border-[#FF6321]/10 dark:border-white/10 p-6 sm:p-8 lg:p-10 overflow-hidden transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-[0_20px_60px_-25px_rgba(255,99,33,0.45)] min-h-[300px] lg:min-h-[340px] flex flex-col">
                      {/* Corner shine */}
                      <div aria-hidden className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-[radial-gradient(closest-side,rgba(255,154,60,0.35),transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                      <div className="flex items-start justify-between mb-6 relative z-10">
                        <div className="w-12 h-12 rounded-2xl bg-white/80 dark:bg-white/10 border border-[#FF6321]/15 dark:border-white/10 flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                          <Icon size={22} className="text-[#FF6321]" strokeWidth={2.2} />
                        </div>
                        {"tag" in f && f.tag && (
                          <div className="flex items-center gap-1.5 bg-white/70 dark:bg-white/10 backdrop-blur text-[#FF6321] px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border border-[#FF6321]/15">
                            <Sparkles size={11} className="fill-[#FF6321]" /> {f.tag}
                          </div>
                        )}
                      </div>

                      <h3 className="text-2xl lg:text-[26px] font-semibold text-foreground mb-3 relative z-10 tracking-tight">{f.title}</h3>
                      <p className="text-muted-foreground text-[15px] lg:text-[15.5px] leading-relaxed relative z-10 mb-6 max-w-md">{f.desc}</p>

                      {"cta" in f && f.cta && (
                        <a href={"href" in f ? f.href : "#"} className="mt-auto inline-flex items-center gap-1.5 text-[#FF6321] font-semibold text-[14.5px] w-max relative z-10 no-underline group/link">
                          {f.cta}
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#FF6321]/10 group-hover/link:bg-[#FF6321] group-hover/link:text-white transition-all duration-300">
                            <ArrowRight size={12} className="group-hover/link:translate-x-0.5 transition-transform" />
                          </span>
                        </a>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          );
        })()}
      </div>


      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto px-6 pb-24">
        <h2 className="text-3xl lg:text-4xl font-medium text-[#2d3748] mb-10 text-center">
          Frequently Asked Questions
        </h2>
        <div className="space-y-3">
          {[
            {
              q: "Is Airesumi free to use?",
              a: "Yes, Airesumi is completely free to use. You can build and download ATS-optimized resumes without any sign-up. A Pro plan is available for unlimited resumes and premium templates.",
            },
            {
              q: "What is an ATS resume and why does it matter?",
              a: "An ATS (Applicant Tracking System) resume is formatted to pass the automated screening software used by 99% of large employers. Without ATS optimization, your resume may never reach a human recruiter. Airesumi automatically formats and optimizes every resume for ATS compatibility.",
            },
            {
              q: "How does the AI resume builder work?",
              a: "Paste the job description and your career details. Our AI generates a tailored, ATS-optimized resume in under 10 minutes — no manual formatting needed. You can then download it as a PDF.",
            },
            {
              q: "Do I need to sign up to use Airesumi?",
              a: "No sign-up is required to build your first resume. Create a free account to save and manage multiple resumes across sessions.",
            },
            {
              q: "Can Airesumi generate a cover letter too?",
              a: "Yes. Airesumi has a free AI cover letter generator that creates a tailored cover letter matching your resume and the target job description — in under 2 minutes.",
            },
            {
              q: "How is Airesumi different from other resume builders?",
              a: "Airesumi uses AI to tailor your resume to each specific job description, not just a generic template. It also includes an ATS checker, cover letter generator, LinkedIn bio tool, salary analyzer, and interview prep — all in one free platform.",
            },
            {
              q: "What resume formats does Airesumi support?",
              a: "Airesumi offers 18+ professional resume templates that are all ATS-friendly. You can download your resume as a PDF ready to submit to any job application.",
            },
            {
              q: "Can I create a resume with AI for free — no credit card?",
              a: "Yes, airesumi is completely free to use. You paste your job description and career details, and the AI generates a tailored, formatted resume in under 10 minutes. No credit card, no hidden paywall for the core builder.",
            },
            {
              q: "How good are AI-generated resumes compared to writing one yourself?",
              a: "A well-prompted AI resume is typically stronger than what most people write on their own — not because AI is smarter, but because it doesn't second-guess itself or undersell your experience. The key is giving it accurate information. airesumi asks the right questions so the output is specific to you, not generic.",
            },
            {
              q: "Can airesumi tailor my resume to a specific job description?",
              a: "That's one of the main things it does. Paste the job description and your background, and the AI aligns your resume to match the keywords, skills, and priorities the employer listed. This is what gets resumes past ATS filters.",
            },
          ].map((item, i) => (
            <details
              key={i}
              className="border border-[#e2e8f0] rounded-xl p-5 cursor-pointer group bg-white"
            >
              <summary className="font-semibold text-[#1a202c] text-[17px] list-none flex justify-between items-center gap-4">
                <span>{item.q}</span>
                <span className="text-[#FF6321] text-2xl shrink-0 group-open:rotate-45 transition-transform duration-200">+</span>
              </summary>
              <p className="mt-3 text-[#4a5568] leading-relaxed text-[15px]">{item.a}</p>
            </details>
          ))}
        </div>
      </div>

      {/* From Our Blog Section */}
      <BlogHighlights
        eyebrow="Career Resources"
        heading="Step-by-step guides to land more interviews"
        subheading="Editor-picked reads — copy-paste prompts, real before/after examples, and ATS breakdowns."
        posts={[
          { title: "How to Build a Resume with AI in 2026", href: "/blog/build-resume-with-ai", description: "The 6-step process with copy-paste prompts and before/after examples.", category: "Resume Building", readTime: "7 min read" },
          { title: "ATS Score: What Number Do You Actually Need?", href: "/blog/ats-resume-checker-what-score-do-you-need", description: "Full breakdown by industry, company size, and how to fix a low score fast.", category: "ATS", readTime: "6 min read" },
          { title: "How to Tailor Your Resume for Every Job", href: "/blog/how-to-tailor-resume-for-every-job", description: "AI-powered tailoring in under 2 minutes per application.", category: "Job Search", readTime: "5 min read" },
        ]}
      />

      {/* FAQ JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: FAQ_SCHEMA }}
      />

    </motion.div>
  );
}
