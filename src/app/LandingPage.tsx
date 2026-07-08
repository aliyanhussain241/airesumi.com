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
      "name": "Is airesumi free to use?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, airesumi is completely free to use. You can build and download ATS-optimized resumes without any sign-up. A Pro plan is available for unlimited resumes and premium templates."
      }
    },
    {
      "@type": "Question",
      "name": "What is an ATS resume and why does it matter?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "An ATS (Applicant Tracking System) resume is formatted to pass the automated screening software used by 99% of large employers. Without ATS optimization, your resume may never reach a human recruiter. airesumi automatically formats and optimizes every resume for ATS compatibility."
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
      "name": "Do I need to sign up to use airesumi?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No sign-up is required to build your first resume. Create a free account to save and manage multiple resumes across sessions."
      }
    },
    {
      "@type": "Question",
      "name": "Can airesumi generate a cover letter too?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. airesumi has a free AI cover letter generator that creates a tailored cover letter matching your resume and the target job description — in under 2 minutes."
      }
    },
    {
      "@type": "Question",
      "name": "How is airesumi different from other resume builders?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "airesumi uses AI to tailor your resume to each specific job description, not just a generic template. It also includes an ATS checker, cover letter generator, LinkedIn bio tool, salary analyzer, and interview prep — all in one free platform."
      }
    },
    {
      "@type": "Question",
      "name": "What resume formats does airesumi support?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "airesumi offers 18+ professional resume templates that are all ATS-friendly. You can download your resume as a PDF ready to submit to any job application."
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
               Free AI Resume Builder — <span className="text-[#FF6321]">ATS-Optimized</span> Resumes
             </h1>
             <p className="text-[20px] text-[#4a5568] mb-10 leading-[1.6]">
               Only 2% of resumes win. Yours will be one of them.
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
             
             <div className="space-y-4">
               <div className="flex items-center gap-2 text-[#4a5568]">
                 <div className="bg-[#22c55e] rounded-full p-0.5">
                   <CheckCircle2 size={16} className="text-white" />
                 </div>
                 <span className="text-[15px]"><strong className="text-[#22c55e] font-semibold"> </strong> ATS-optimized & recruiter-approved formatting</span>
               </div>
               <div className="flex items-center gap-2 text-[15px] text-[#4a5568]">
                 <div className="flex text-[#00b67a] gap-1 items-center">
                    <Star size={20} fill="#00b67a" className="text-[#00b67a]" />
                    <span className="font-bold text-[#1a202c]">100% free to start </span>
                 </div>
                 <span> No credit card required</span>
               </div>
             </div>
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
                className="absolute top-40 -left-14 bg-white rounded-2xl p-3 pr-4 flex items-center gap-3 z-30 hover:-translate-y-1 transition-transform duration-300 pointer-events-auto cursor-default border border-white"
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
                className="absolute top-[42%] right-[-10%] text-white px-4 py-3 rounded-xl font-bold flex items-center gap-2 z-30 hover:scale-105 transition-transform duration-300 cursor-default"
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
                className="absolute bottom-20 -right-10 bg-white p-5 rounded-2xl z-20 w-60 border border-white/80 hover:-translate-y-1 transition-transform duration-300"
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
                    <div key={s.label} className="bg-gray-50/80 rounded-lg px-2.5 py-1.5 border border-gray-100">
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
                className="absolute bottom-14 -left-10 bg-white/90 backdrop-blur-xl p-3.5 rounded-2xl z-30 flex items-center gap-3 border border-white/80 pr-5 w-80 hover:scale-[1.02] transition-transform duration-300 pointer-events-auto"
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
      <div className="max-w-7xl mx-auto px-6 pb-24 mt-20 text-center">
         <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-12">
            <div className="bg-orange-50 p-2.5 rounded-xl text-orange-400 shrink-0">
              <Wand2 size={32} />
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-[#2d3748] text-center sm:text-left">
              <span className="text-[#FF6321]">Built</span> for every job seeker, free
            </h2>
         </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {/* Feature 1 */}
            <div className="liquid-card rounded-2xl">
              <span className="liquid-card-shine" aria-hidden="true" />
              <div className="liquid-card-content p-8">
                <Sparkles size={32} className="text-[#1a202c] mb-6" />
                <h3 className="font-semibold text-[#1a202c] text-xl mb-3">A draft in 10 mins</h3>
                <p className="text-[#64748b] text-[15px] leading-relaxed">The AI builder is 10 x faster than doing on your own.</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="liquid-card rounded-2xl">
              <span className="liquid-card-shine" aria-hidden="true" />
              <div className="liquid-card-content p-8">
                <div className="bg-[#1a202c] rounded-full w-10 h-10 flex items-center justify-center text-white font-bold mb-6">A+</div>
                <h3 className="font-semibold text-[#1a202c] text-xl mb-3">Zero mistakes</h3>
                <p className="text-[#64748b] text-[15px] leading-relaxed">Don't stress over typos; you'll sound great!</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="liquid-card rounded-2xl">
              <span className="liquid-card-shine" aria-hidden="true" />
              <div className="liquid-card-content p-8">
                <Target size={32} className="text-[#1a202c] mb-6" />
                <h3 className="font-semibold text-[#1a202c] text-xl mb-3">ATS templates</h3>
                <p className="text-[#64748b] text-[15px] leading-relaxed">Your resume will be 100% compliant. Recruiters will see you.</p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="liquid-card rounded-2xl">
              <span className="liquid-card-shine" aria-hidden="true" />
              <div className="liquid-card-content p-8">
                <CircleDollarSign size={32} className="text-[#1a202c] mb-6" />
                <h3 className="font-semibold text-[#1a202c] text-xl mb-3">Get paid 7% more</h3>
                <p className="text-[#64748b] text-[15px] leading-relaxed">We can help you negotiate a higher starting salary...</p>
              </div>
            </div>
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
            <div className="grid lg:grid-cols-12 gap-6 h-auto lg:h-[520px]">
              {/* Sidebar Nav */}
              <div className="lg:col-span-4 bg-white dark:bg-[#16191f] rounded-3xl border border-gray-100 dark:border-white/10 text-left flex flex-col overflow-hidden" style={{ boxShadow: "0 20px 45px -25px rgba(15,23,42,0.15)" }}>
                {TABS.map((tab) => {
                  const active = activeToolsTab === tab.id;
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleTabClick(tab.id)}
                      className={`flex items-center gap-4 p-5 lg:p-6 cursor-pointer relative text-left transition-colors border-b border-gray-100 dark:border-white/10 last:border-b-0 ${active ? "bg-gradient-to-r from-[#FF6321]/10 via-[#FF6321]/5 to-transparent" : "hover:bg-gray-50 dark:hover:bg-white/5"}`}
                    >
                      {active && (
                        <motion.div layoutId="toolTabIndicator" className="absolute right-0 top-2 bottom-2 w-1 rounded-l-full bg-[#FF6321]" transition={{ type: "spring", stiffness: 400, damping: 34 }} />
                      )}
                      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-all ${active ? "bg-[#FF6321] text-white shadow-lg shadow-[#FF6321]/30" : "bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-300"}`}>
                        <Icon size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`text-[15px] font-bold ${active ? "text-[#FF6321]" : "text-[#1a202c] dark:text-[#f5f5f4]"}`}>
                          <span className="text-gray-400 dark:text-gray-500 font-medium mr-1.5">0{tab.id}.</span>{tab.label}
                        </div>
                        <div className="text-[12px] text-gray-500 dark:text-gray-400 mt-0.5 truncate">{tab.short}</div>

                      </div>
                      {active && (
                        <div className="w-7 h-7 flex items-center justify-center shrink-0">
                          <svg width="28" height="28" viewBox="0 0 24 24" className="-rotate-90">
                            <circle cx="12" cy="12" r="10" className="stroke-[#FF6321]/20" strokeWidth="2.5" fill="none" />
                            <motion.circle key={progressKey} cx="12" cy="12" r="10" className="stroke-[#FF6321]" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeDasharray="62.83" initial={{ strokeDashoffset: 62.83 }} animate={{ strokeDashoffset: 0 }} transition={{ duration: 5, ease: "linear" }} />
                          </svg>
                        </div>
                      )}
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
                className="lg:col-span-8 grid sm:grid-cols-2 gap-6 h-full"
              >
                {current.cards.map((c, i) => {
                  const Icon = c.icon;
                  return (
                    <motion.div
                      key={c.title}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.08 }}
                      className="group relative bg-gradient-to-br from-orange-50/70 via-white to-white dark:from-[#FF6321]/10 dark:via-[#1c2027] dark:to-[#16191f] rounded-3xl border border-orange-100/60 dark:border-white/10 p-7 lg:p-8 text-left overflow-hidden flex flex-col hover:border-[#FF6321]/40 hover:-translate-y-1 transition-all duration-300"
                      style={{ boxShadow: "0 20px 45px -25px rgba(255,99,33,0.2)" }}
                    >
                      {/* corner glow */}
                      <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-[#FF6321]/15 blur-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      <div className="flex items-start justify-between mb-5 relative z-10">
                        <div className="w-12 h-12 rounded-2xl bg-white dark:bg-white/10 border border-orange-100 dark:border-white/10 flex items-center justify-center text-[#FF6321] shadow-sm">
                          <Icon size={22} />
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-[#FF6321] leading-none">{c.stat}</div>
                          <div className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-1">{c.statLabel}</div>
                        </div>
                      </div>

                      <h3 className="text-[22px] font-bold text-[#1a202c] dark:text-[#f5f5f4] mb-2 relative z-10">{c.title}</h3>
                      <p className="text-[#4a5568] dark:text-gray-300 text-[15px] leading-relaxed mb-6 relative z-10 flex-1">{c.desc}</p>

                      {/* Preview strip */}
                      <div className="relative z-10 bg-white/80 dark:bg-white/5 backdrop-blur border border-gray-100 dark:border-white/10 rounded-2xl p-4 mb-5">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Live preview</span>
                        </div>
                        <div className="space-y-1.5">
                          <div className="h-2 rounded-full bg-gradient-to-r from-[#FF6321]/40 to-[#FF6321]/10" style={{ width: "88%" }} />
                          <div className="h-2 rounded-full bg-gray-100 dark:bg-white/10" style={{ width: "72%" }} />
                          <div className="h-2 rounded-full bg-gray-100 dark:bg-white/10" style={{ width: "60%" }} />
                        </div>
                      </div>


                      <div className="flex items-center gap-2 text-[#FF6321] font-bold text-sm relative z-10 group-hover:gap-3 transition-all">
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
              q: "Is airesumi free to use?",
              a: "Yes, airesumi is completely free to use. You can build and download ATS-optimized resumes without any sign-up. A Pro plan is available for unlimited resumes and premium templates.",
            },
            {
              q: "What is an ATS resume and why does it matter?",
              a: "An ATS (Applicant Tracking System) resume is formatted to pass the automated screening software used by 99% of large employers. Without ATS optimization, your resume may never reach a human recruiter. airesumi automatically formats and optimizes every resume for ATS compatibility.",
            },
            {
              q: "How does the AI resume builder work?",
              a: "Paste the job description and your career details. Our AI generates a tailored, ATS-optimized resume in under 10 minutes — no manual formatting needed. You can then download it as a PDF.",
            },
            {
              q: "Do I need to sign up to use airesumi?",
              a: "No sign-up is required to build your first resume. Create a free account to save and manage multiple resumes across sessions.",
            },
            {
              q: "Can airesumi generate a cover letter too?",
              a: "Yes. airesumi has a free AI cover letter generator that creates a tailored cover letter matching your resume and the target job description — in under 2 minutes.",
            },
            {
              q: "How is airesumi different from other resume builders?",
              a: "airesumi uses AI to tailor your resume to each specific job description, not just a generic template. It also includes an ATS checker, cover letter generator, LinkedIn bio tool, salary analyzer, and interview prep — all in one free platform.",
            },
            {
              q: "What resume formats does airesumi support?",
              a: "airesumi offers 18+ professional resume templates that are all ATS-friendly. You can download your resume as a PDF ready to submit to any job application.",
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
