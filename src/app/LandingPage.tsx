import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Sparkles, Target, CircleDollarSign, Crown, Search, Send, MessageSquare, Gauge, User, CheckCircle2, Star, Wand2, FileText, Briefcase, CheckCircle, ArrowRight, Compass, Mic, Mail, Link2, Users, GraduationCap, TrendingUp, Zap } from "lucide-react";
import { Step } from "./App";

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
           
           <div className="relative h-[500px] lg:h-[600px] flex items-center justify-center mt-8 lg:mt-0 transform scale-[0.6] sm:scale-[0.8] lg:scale-100 origin-top -mb-[150px] sm:-mb-[80px] lg:mb-0">
             {/* Background Glow */}
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 0.7 }}
               transition={{ duration: 1.5, delay: 0.2 }}
               className="absolute w-[450px] h-[450px] bg-orange-50 rounded-full blur-3xl z-0"
             />
             
             {/* Main Resume Paper */}
             <motion.div 
               initial={{ opacity: 0, y: 40 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8, ease: "easeOut" }}
               className="absolute bg-white rounded-xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] p-8 w-[400px] h-[520px] z-10 border border-gray-100/50 flex flex-col pt-12 text-left"
             >
               <div className="border-b border-gray-100 pb-5 mb-5 select-none">
                 <h3 className="text-[#FF6321] text-3xl font-serif font-semibold tracking-tight">Alice Hart</h3>
                 <p className="text-gray-500 text-sm mt-1">Math Teacher</p>
               </div>
               <div className="space-y-2 mb-6">
                 <div className="h-2.5 bg-gray-200 rounded w-full"></div>
                 <div className="h-2.5 bg-gray-200 rounded w-11/12"></div>
                 <div className="h-2.5 bg-gray-200 rounded w-10/12"></div>
                 <div className="h-2.5 bg-gray-200 rounded w-full"></div>
               </div>
               <div className="space-y-4 flex-1">
                 <div>
                   <p className="text-sm font-semibold text-gray-400 mb-2">Employment History</p>
                   <div className="space-y-2">
                     <div className="h-2.5 bg-gray-200 rounded w-full"></div>
                     <div className="h-2.5 bg-gray-200 rounded w-full"></div>
                     <div className="h-2.5 bg-gray-200 rounded w-3/4"></div>
                   </div>
                 </div>
                 <div>
                   <div className="space-y-2">
                     <div className="h-2.5 bg-gray-200 rounded w-full"></div>
                     <div className="h-2.5 bg-gray-200 rounded w-5/6"></div>
                   </div>
                 </div>
               </div>
             </motion.div>
           
             {/* Floating Avatar */}
             <motion.div 
               initial={{ opacity: 0, scale: 0.8, x: 20 }}
               animate={{ opacity: 1, scale: 1, x: 0 }}
               transition={{ duration: 0.6, delay: 0.3, ease: "backOut" }}
               className="absolute top-12 right-4 w-40 h-40 rounded-full border-[6px] border-white shadow-xl bg-orange-400 z-20 overflow-hidden hover:scale-105 transition-transform duration-300"
             >
                {/* FIX #9: loading="lazy" added. ACTION REQUIRED: Download this image,
                    convert to WebP, and serve from /images/avatar-testimonial.webp
                    to eliminate the cross-origin request on load. */}
                <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80" alt="Avatar" className="w-full h-full object-cover" loading="lazy" width="300" height="300" />
             </motion.div>
           
             {/* Floating Resume Score */}
             <motion.div 
               initial={{ opacity: 0, x: -30 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
               className="absolute top-44 -left-12 bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-2.5 flex items-center gap-3 z-30 hover:-translate-y-1 transition-transform duration-300 pointer-events-auto cursor-default"
             >
                <div className="bg-[#22c55e] text-white font-bold text-lg px-2.5 py-1 rounded-lg">81%</div>
                <div className="text-sm font-bold text-[#2d3748] leading-tight pr-2">Resume<br/>Score</div>
             </motion.div>
           
             {/* Floating ATS Perfect */}
             <motion.div 
               initial={{ opacity: 0, scale: 0.8, x: 30 }}
               animate={{ opacity: 1, scale: 1, x: 0 }}
               transition={{ duration: 0.6, delay: 0.6, ease: "backOut" }}
               className="absolute top-[40%] right-[-10%] bg-[#FF6321] text-white px-4 py-3 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] font-bold flex items-center gap-2 z-30 hover:scale-105 transition-transform duration-300 cursor-default"
             >
                 <Wand2 size={18} /> ATS Perfect
             </motion.div>
           
             {/* Floating Skills Card */}
             <motion.div 
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.6, delay: 0.7, ease: "easeOut" }}
               className="absolute bottom-20 -right-8 bg-white p-5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] z-20 w-56 border border-gray-50 hover:-translate-y-1 transition-transform duration-300"
             >
                <h4 className="font-bold text-[#2d3748] text-opacity-90 mb-3 flex justify-between items-center">Skills <span className="text-gray-400 font-normal">✎</span></h4>
                <div className="space-y-2.5">
                  <div className="bg-[#f8fafc] text-[#475569] text-[13px] py-1.5 px-3 rounded-md font-medium border border-gray-100">Management Skills</div>
                  <div className="bg-[#f8fafc] text-[#475569] text-[13px] py-1.5 px-3 rounded-md font-medium border border-gray-100">Analytical Thinking</div>
                  <div className="bg-[#f8fafc] text-[#475569] text-[13px] py-1.5 px-3 rounded-md font-medium border border-gray-100">Leadership</div>
                </div>
                <button className="text-[#FF6321] font-bold text-sm mt-3 pt-3 flex items-center gap-1 w-full justify-center border-t border-orange-50 hover:bg-orange-50 transition-colors rounded-none">
                  + Add skill
                </button>
             </motion.div>
           
             {/* Floating Ask AI */}
             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
               className="absolute bottom-16 -left-8 bg-white p-4 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] z-30 flex items-center gap-3 border border-gray-50 pr-12 w-80 hover:scale-105 transition-transform duration-300 pointer-events-auto"
             >
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-orange-400 via-orange-500 to-orange-600 border-2 border-white shadow-sm flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
                <span className="text-gray-500 text-sm font-medium">Ask AI coach anything...</span>
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
      <div className="max-w-7xl mx-auto px-6 pb-32 text-center">
         <h2 className="text-4xl lg:text-5xl font-medium text-[#2d3748] mb-16">
           Every tool you need is here...
         </h2>
         
         <div className="grid lg:grid-cols-3 gap-6 h-auto lg:h-[480px]">
            {/* Sidebar Nav */}
             <div className="bg-tool-sidebar text-tool-sidebar-foreground rounded-2xl border border-border shadow-sm text-left flex flex-col overflow-hidden">
                <div onClick={() => handleTabClick(1)} className={`flex items-center p-6 lg:p-7 gap-4 cursor-pointer relative ${activeToolsTab === 1 ? 'bg-tool-tab-active' : 'hover:bg-secondary/70'}`}>
                   {activeToolsTab === 1 && <div className="absolute right-0 top-0 bottom-0 w-1 bg-brand-accent"></div>}
                   <div className={activeToolsTab === 1 ? 'text-brand-accent' : 'text-tool-sidebar-foreground'}>
                    <FileText size={24} />
                  </div>
                   <div className={`flex-1 text-[17px] font-medium ${activeToolsTab === 1 ? 'text-brand-accent' : 'text-tool-sidebar-foreground'}`}>1. Get Noticed</div>
                  {activeToolsTab === 1 && (
                    <div className="w-6 h-6 flex items-center justify-center">
                      <svg width="24" height="24" viewBox="0 0 24 24" className="-rotate-90">
                         <circle cx="12" cy="12" r="10" className="stroke-brand-accent/25" strokeWidth="3" fill="none" />
                         <motion.circle key={progressKey} cx="12" cy="12" r="10" className="stroke-brand-accent" strokeWidth="3" fill="none" strokeLinecap="round" strokeDasharray="62.83" initial={{ strokeDashoffset: 62.83 }} animate={{ strokeDashoffset: 0 }} transition={{ duration: 5, ease: "linear" }} />
                      </svg>
                    </div>
                  )}
               </div>
                <div onClick={() => handleTabClick(2)} className={`flex items-center p-6 lg:p-7 gap-4 cursor-pointer relative ${activeToolsTab === 2 ? 'bg-tool-tab-active' : 'hover:bg-secondary/70'}`}>
                   {activeToolsTab === 2 && <div className="absolute right-0 top-0 bottom-0 w-1 bg-brand-accent"></div>}
                   <div className={activeToolsTab === 2 ? 'text-brand-accent' : 'text-tool-sidebar-foreground'}>
                    <Briefcase size={24} />
                  </div>
                   <div className={`flex-1 text-[17px] font-medium ${activeToolsTab === 2 ? 'text-brand-accent' : 'text-tool-sidebar-foreground'}`}>2. Get Hired</div>
                  {activeToolsTab === 2 && (
                    <div className="w-6 h-6 flex items-center justify-center">
                      <svg width="24" height="24" viewBox="0 0 24 24" className="-rotate-90">
                         <circle cx="12" cy="12" r="10" className="stroke-brand-accent/25" strokeWidth="3" fill="none" />
                         <motion.circle key={progressKey} cx="12" cy="12" r="10" className="stroke-brand-accent" strokeWidth="3" fill="none" strokeLinecap="round" strokeDasharray="62.83" initial={{ strokeDashoffset: 62.83 }} animate={{ strokeDashoffset: 0 }} transition={{ duration: 5, ease: "linear" }} />
                      </svg>
                    </div>
                  )}
               </div>
                <div onClick={() => handleTabClick(3)} className={`flex items-center p-6 lg:p-7 gap-4 cursor-pointer relative ${activeToolsTab === 3 ? 'bg-tool-tab-active' : 'hover:bg-secondary/70'}`}>
                   {activeToolsTab === 3 && <div className="absolute right-0 top-0 bottom-0 w-1 bg-brand-accent"></div>}
                   <div className={activeToolsTab === 3 ? 'text-brand-accent' : 'text-tool-sidebar-foreground'}>
                    <CircleDollarSign size={24} />
                  </div>
                   <div className={`flex-1 text-[17px] font-medium ${activeToolsTab === 3 ? 'text-brand-accent' : 'text-tool-sidebar-foreground'}`}>3. Get Paid More</div>
                  {activeToolsTab === 3 && (
                    <div className="w-6 h-6 flex items-center justify-center">
                      <svg width="24" height="24" viewBox="0 0 24 24" className="-rotate-90">
                         <circle cx="12" cy="12" r="10" className="stroke-brand-accent/25" strokeWidth="3" fill="none" />
                         <motion.circle key={progressKey} cx="12" cy="12" r="10" className="stroke-brand-accent" strokeWidth="3" fill="none" strokeLinecap="round" strokeDasharray="62.83" initial={{ strokeDashoffset: 62.83 }} animate={{ strokeDashoffset: 0 }} transition={{ duration: 5, ease: "linear" }} />
                      </svg>
                    </div>
                  )}
               </div>
                <div onClick={() => handleTabClick(4)} className={`flex items-center p-6 lg:p-7 gap-4 cursor-pointer relative ${activeToolsTab === 4 ? 'bg-tool-tab-active' : 'hover:bg-secondary/70'}`}>
                   {activeToolsTab === 4 && <div className="absolute right-0 top-0 bottom-0 w-1 bg-brand-accent"></div>}
                   <div className={activeToolsTab === 4 ? 'text-brand-accent' : 'text-tool-sidebar-foreground'}>
                    <Crown size={24} />
                  </div>
                   <div className={`flex-1 text-[17px] font-medium ${activeToolsTab === 4 ? 'text-brand-accent' : 'text-tool-sidebar-foreground'}`}>4. Get promoted</div>
                  {activeToolsTab === 4 && (
                    <div className="w-6 h-6 flex items-center justify-center">
                      <svg width="24" height="24" viewBox="0 0 24 24" className="-rotate-90">
                         <circle cx="12" cy="12" r="10" className="stroke-brand-accent/25" strokeWidth="3" fill="none" />
                         <motion.circle key={progressKey} cx="12" cy="12" r="10" className="stroke-brand-accent" strokeWidth="3" fill="none" strokeLinecap="round" strokeDasharray="62.83" initial={{ strokeDashoffset: 62.83 }} animate={{ strokeDashoffset: 0 }} transition={{ duration: 5, ease: "linear" }} />
                      </svg>
                    </div>
                  )}
               </div>
            </div>

            {/* Content Cards */}
            {activeToolsTab === 1 && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="col-span-1 lg:col-span-2 grid lg:grid-cols-2 gap-6 h-full">
                <div className="bg-tool-surface text-tool-surface-foreground border border-border rounded-2xl p-6 pb-56 sm:p-8 sm:pb-56 lg:p-10 lg:pb-56 text-left relative overflow-hidden flex flex-col items-center">
                    <div className="flex items-center gap-3 w-full mb-4">
                      <div className="bg-tool-icon-surface p-2 rounded-xl text-brand-accent shadow-sm"><FileText size={28} className="fill-brand-accent/20" /></div>
                      <h3 className="text-[26px] font-semibold text-tool-surface-foreground">Resume Builder</h3>
                    </div>
                    <p className="text-muted-foreground text-[16px] leading-relaxed mb-8 z-10 w-full">Build the resume that gets you hired. We designed the builder with top employers. Finish a draft 20 mins with "Recruiter-AI".</p>
                    
                    <div className="w-[280px] h-[340px] bg-white rounded-t-2xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.15)] border border-gray-100 p-8 absolute bottom-0 translate-y-20 hover:translate-y-8 transition-transform duration-500 z-0 flex flex-col">
                       <div className="border-b border-gray-100 pb-4 mb-4">
                          <h4 className="font-bold font-serif text-[20px] text-[#1a202c]">Chloé Anne Bouchard</h4>
                       </div>
                       <div className="space-y-3 mb-6">
                          <div className="h-1.5 w-full bg-gray-200 rounded"></div>
                          <div className="h-1.5 w-full bg-gray-200 rounded"></div>
                          <div className="h-1.5 w-3/4 bg-gray-200 rounded"></div>
                       </div>
                    </div>
                    
                    <div className="absolute bottom-40 -mr-48 bg-white rounded-xl shadow-lg p-2.5 flex items-center gap-2 border border-gray-50 z-20">
                      <div className="bg-[#22c55e] text-white text-sm font-bold px-2 py-1 rounded-md">81%</div>
                      <div className="text-[12px] font-bold text-gray-700 leading-tight pr-1">Resume<br/>Score</div>
                    </div>
                </div>
                
                <div className="bg-tool-surface text-tool-surface-foreground border border-border rounded-2xl p-6 pb-56 sm:p-8 sm:pb-56 lg:p-10 lg:pb-56 text-left relative overflow-hidden flex flex-col items-center">
                    <div className="flex items-center gap-3 w-full mb-4">
                      <div className="bg-tool-icon-surface p-2 rounded-xl text-brand-accent shadow-sm"><Target size={28} className="fill-brand-accent/20" /></div>
                      <h3 className="text-[26px] font-semibold text-tool-surface-foreground">Recruiter Match</h3>
                    </div>
                    <p className="text-muted-foreground text-[16px] leading-relaxed mb-8 z-10 w-full">Recruiters come to us with roles they can't fill. We close-match your resume and then send it to 50 recruiters a week.</p>
                    <div className="absolute bottom-0 translate-y-12 hover:translate-y-6 transition-transform duration-500 flex justify-center w-full z-0 h-48">
                    </div>
                </div>
              </motion.div>
            )}

            {activeToolsTab === 2 && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="col-span-1 lg:col-span-2 grid lg:grid-cols-2 gap-6 h-full">
                <div className="bg-tool-surface text-tool-surface-foreground border border-border rounded-2xl p-6 pb-56 sm:p-8 sm:pb-56 lg:p-10 lg:pb-56 text-left relative overflow-hidden flex flex-col items-center">
                    <div className="flex items-center gap-3 w-full mb-4">
                      <div className="bg-tool-icon-surface p-2 rounded-xl text-brand-accent shadow-sm"><Search size={28} className="fill-brand-accent/20" /></div>
                      <h3 className="text-[26px] font-semibold text-tool-surface-foreground">Job Board</h3>
                    </div>
                    <p className="text-muted-foreground text-[16px] leading-relaxed mb-8 z-10 w-full">See every online job board in one place. We search the entire internet every day. If a role goes live, you won't miss it.</p>
                </div>
                <div className="bg-tool-surface text-tool-surface-foreground border border-border rounded-2xl p-6 pb-56 sm:p-8 sm:pb-56 lg:p-10 lg:pb-56 text-left relative overflow-hidden flex flex-col items-center">
                    <div className="flex items-center gap-3 w-full mb-4">
                      <div className="bg-tool-icon-surface p-2 rounded-xl text-brand-accent shadow-sm"><Send size={28} className="fill-brand-accent/20" /></div>
                      <h3 className="text-[26px] font-semibold text-tool-surface-foreground">Auto Apply</h3>
                    </div>
                    <p className="text-muted-foreground text-[16px] leading-relaxed mb-8 z-10 w-full">Our team of experts apply for you. All they need is your resume and your target salary. Interviews come by email.</p>
                </div>
              </motion.div>
            )}

            {activeToolsTab === 3 && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="col-span-1 lg:col-span-2 grid lg:grid-cols-2 gap-6 h-full">
                <div className="bg-tool-surface text-tool-surface-foreground border border-border rounded-2xl p-6 pb-56 sm:p-8 sm:pb-56 lg:p-10 lg:pb-56 text-left relative overflow-hidden flex flex-col items-center">
                    <div className="flex items-center gap-3 w-full mb-4">
                      <div className="bg-tool-icon-surface p-2 rounded-xl text-brand-accent shadow-sm"><MessageSquare size={28} className="fill-brand-accent/20" /></div>
                      <h3 className="text-[26px] font-semibold text-tool-surface-foreground">Interview Prep</h3>
                    </div>
                    <p className="text-muted-foreground text-[16px] leading-relaxed mb-8 z-10 w-full">Practice the questions that get you hired. Choose from the world's best employers and see instant feedback.</p>
                </div>

                <div className="bg-tool-surface text-tool-surface-foreground border border-border rounded-2xl p-6 pb-56 sm:p-8 sm:pb-56 lg:p-10 lg:pb-56 text-left relative overflow-hidden flex flex-col items-center">
                    <div className="flex items-center gap-3 w-full mb-4">
                      <div className="bg-tool-icon-surface p-2 rounded-xl text-brand-accent shadow-sm"><Gauge size={28} className="fill-brand-accent/20" /></div>
                      <h3 className="text-[26px] font-semibold text-tool-surface-foreground">Salary Analyzer</h3>
                    </div>
                    <p className="text-muted-foreground text-[16px] leading-relaxed mb-8 z-10 w-full">Get paid 7% more. Our salary analyzer shows you if your job offer is at the market rate. Always negotiate!</p>
                </div>
              </motion.div>
            )}

            {activeToolsTab === 4 && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="col-span-1 lg:col-span-2 grid lg:grid-cols-2 gap-6 h-full">
                <div className="bg-tool-surface text-tool-surface-foreground border border-border rounded-2xl p-6 pb-56 sm:p-8 sm:pb-56 lg:p-10 lg:pb-56 text-left relative overflow-hidden flex flex-col items-center">
                    <div className="flex items-center gap-3 w-full mb-4">
                      <div className="bg-tool-icon-surface p-2 rounded-xl text-brand-accent shadow-sm"><User size={28} className="fill-brand-accent/20" /></div>
                      <h3 className="text-[26px] font-semibold text-tool-surface-foreground">Career Coaching</h3>
                    </div>
                    <p className="text-muted-foreground text-[16px] leading-relaxed mb-8 z-10 w-full">Work 1-1 with an expert to expand your network, give better interviews and negotiate a higher salary.</p>
                </div>

                <div className="bg-tool-surface text-tool-surface-foreground border border-border rounded-2xl p-6 pb-56 sm:p-8 sm:pb-56 lg:p-10 lg:pb-56 text-left relative overflow-hidden flex flex-col items-center">
                    <div className="flex items-center gap-3 w-full mb-4">
                      <div className="bg-tool-icon-surface p-2 rounded-xl text-brand-accent shadow-sm"><Sparkles size={28} className="fill-brand-accent/20" /></div>
                      <h3 className="text-[26px] font-semibold text-tool-surface-foreground">Future Learn</h3>
                    </div>
                    <p className="text-muted-foreground text-[16px] leading-relaxed mb-8 z-10 w-full">Future proof yourself. Get the courses you need to grow. Accredited, certified and respected by employers.</p>
                </div>
              </motion.div>
            )}
         </div>
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

      {/* FAQ JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: FAQ_SCHEMA }}
      />

    </motion.div>
  );
}
