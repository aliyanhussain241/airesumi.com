import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, ArrowRight, Crown, Search, Sparkles, Check, Eye, X } from "lucide-react";
import { Step } from "./App";
import { DesignId } from "./components/ResumePreview";
import { MultiStepFormShell } from "./components/MultiStepFormShell";

interface DesignSelectionProps {
  designId: DesignId;
  setDesignId: (designId: DesignId) => void;
  setStep: (step: Step) => void;
}

type DesignItem = {
  id: string;
  name: string;
  desc: string;
  category: 'Simple' | 'Modern' | 'Creative' | 'Executive' | 'Tech' | 'Elegant';
  preview: React.ReactNode;
  isPremium?: boolean;
};

// 1. Free Themes
const freeDesigns: DesignItem[] = [
  { id: 'classic', name: 'Classic', desc: 'Timeless & professional', category: 'Simple',
    preview: <div className="w-full h-full bg-white p-3 flex flex-col gap-2"><div className="text-center mb-1 border-b border-[#1f2937] pb-2"><div className="w-16 h-2 bg-[#111827] mx-auto mb-1"></div><div className="w-10 h-1 bg-[#6b7280] mx-auto"></div></div><div className="w-10 h-1 bg-[#111827] mb-0.5"></div><div className="w-full h-1 bg-[#e5e7eb] rounded-sm"></div><div className="w-full h-1 bg-[#e5e7eb] rounded-sm"></div><div className="w-3/4 h-1 bg-[#e5e7eb] rounded-sm"></div></div> },
  { id: 'modern', name: 'Modern', desc: 'Bold accents & clean', category: 'Modern',
    preview: <div className="w-full h-full bg-white p-3 flex flex-col gap-2"><div className="border-l-[3px] border-[#FF6321] pl-2 mb-2"><div className="h-2.5 w-1/2 bg-[#111827] mb-1"></div><div className="h-1.5 w-1/3 bg-[#FF6321]"></div></div><div className="w-full h-1 bg-[#e5e7eb] rounded-sm"></div><div className="w-4/5 h-1 bg-[#e5e7eb] rounded-sm"></div></div> },
  { id: 'minimal', name: 'Minimal', desc: 'Whitespace focused', category: 'Simple',
    preview: <div className="w-full h-full bg-white p-4 flex flex-col gap-2"><div className="text-center mb-3"><div className="h-2 w-16 bg-[#1f2937] mx-auto mb-1.5"></div><div className="h-1 w-10 bg-[#9ca3af] mx-auto"></div></div><div className="w-full h-1 bg-[#e5e7eb]"></div><div className="w-4/5 h-1 bg-[#e5e7eb]"></div></div> },
  { id: 'split', name: 'Split', desc: 'Creative sidebar layout', category: 'Creative',
    preview: <div className="w-full h-full bg-white flex overflow-hidden"><div className="w-[35%] bg-[#1f2937] p-2 flex flex-col gap-1.5 items-center pt-3"><div className="w-8 h-8 rounded-full border-2 border-[#eab308] bg-[#4b5563] mb-1"></div><div className="w-4/5 h-0.5 bg-[#9ca3af]"></div></div><div className="w-[65%] p-3"><div className="h-2.5 w-16 bg-[#111827] mb-1"></div><div className="h-1 w-10 bg-[#eab308]"></div></div></div> },
  { id: 'creative-orange', name: 'Creative Orange', desc: 'Curved vibrant sidebar', category: 'Creative',
    preview: <div className="w-full h-full bg-white flex overflow-hidden"><div className="w-[35%] bg-[#EA580C] p-2 flex flex-col gap-1 items-center pt-3 rounded-br-2xl rounded-tr-2xl"><div className="w-8 h-8 rounded-full border-2 border-white bg-white/20 mb-1"></div><div className="w-4/5 h-0.5 bg-white/40"></div></div><div className="w-[65%] p-3"><div className="h-2 w-2/3 bg-[#111827] mb-1"></div><div className="h-1 w-1/3 bg-[#9ca3af]"></div></div></div> },
  { id: 'corporate-dark', name: 'Corporate Dark', desc: 'Professional gray & dark', category: 'Executive',
    preview: <div className="w-full h-full bg-white flex flex-col overflow-hidden"><div className="h-10 bg-[#E5E7EB] flex items-center px-2"><div className="w-1/2 h-1 bg-[#1f2937]"></div></div><div className="flex flex-1"><div className="w-[60%] p-2"><div className="w-full h-0.5 bg-[#e5e7eb]"></div></div><div className="w-[40%] bg-[#1F2937]"></div></div></div> },
  { id: 'modern-block', name: 'Modern Block', desc: 'Clean geometric structure', category: 'Modern',
    preview: <div className="w-full h-full bg-white flex flex-col overflow-hidden p-2 border-t-[3px] border-[#F97316]"><div className="h-2 w-4/5 bg-[#111827] mb-1"></div><div className="h-1 w-1/2 bg-[#F97316] mb-2"></div><div className="w-full h-2 bg-[#374151] mb-2"></div><div className="flex gap-2"><div className="w-1/3 h-1 bg-[#e5e7eb]"></div><div className="w-2/3 h-1 bg-[#e5e7eb]"></div></div></div> },
  { id: 'contrast-bold', name: 'Contrast Bold', desc: 'Striking dark & orange', category: 'Creative',
    preview: <div className="w-full h-full bg-white flex overflow-hidden"><div className="w-[45%] p-2"><div className="w-8 h-8 rounded-full border-[3px] border-[#F97316] mt-2 mb-2"></div><div className="w-full h-2 bg-[#F97316] rounded-r-full -ml-2 mb-1"></div></div><div className="w-[55%] bg-[#1F2937]"><div className="h-10 bg-[#F97316] rounded-l-2xl p-2"><div className="h-1.5 w-3/4 bg-white mb-1"></div></div></div></div> },
  { id: 'navy-executive', name: 'Navy Executive', desc: 'Corporate navy & blue', category: 'Executive',
    preview: <div className="w-full h-full flex overflow-hidden"><div className="w-[65%] p-2 pt-3"><div className="w-full h-0.5 bg-[#e5e7eb] mb-1"></div><div className="w-4/5 h-0.5 bg-[#e5e7eb]"></div></div><div className="w-[35%] bg-[#EEF2F7] p-2"><div className="w-8 h-8 rounded-full bg-[#1B2A4A] mx-auto mb-1 border-2 border-[#1B2A4A]"></div><div className="w-full h-0.5 bg-[#1B2A4A] mb-1"></div></div></div> },
  { id: 'green-fresh', name: 'Green Fresh', desc: 'Natural & energetic', category: 'Modern',
    preview: <div className="w-full h-full bg-white p-2 flex flex-col"><div className="flex items-center gap-2 mb-2 pb-2 border-b-2 border-[#059669]"><div className="w-8 h-8 rounded-xl bg-[#ECFDF5]"></div><div><div className="h-1.5 w-12 bg-[#064E3B] mb-1"></div><div className="h-1 w-8 bg-[#059669]"></div></div></div><div className="w-full h-0.5 bg-[#D1FAE5] mb-1"></div><div className="w-4/5 h-0.5 bg-[#D1FAE5]"></div></div> },
  { id: 'purple-creative', name: 'Purple Creative', desc: 'Bold & artistic', category: 'Creative',
    preview: <div className="w-full h-full flex overflow-hidden"><div className="w-[60%] p-2"><div className="w-full h-0.5 bg-[#EDE9FE] mb-1"></div><div className="w-4/5 h-0.5 bg-[#EDE9FE]"></div></div><div className="w-[40%] bg-[#F5F3FF] p-2"><div className="w-full h-1 bg-[#6D28D9] rounded-full mb-1"></div><div className="w-4/5 h-1 bg-[#6D28D9] rounded-full"></div></div></div> },
  { id: 'red-impact', name: 'Red Impact', desc: 'Bold & powerful', category: 'Creative',
    preview: <div className="w-full h-full bg-white flex flex-col overflow-hidden"><div className="h-1 bg-[#DC2626]"></div><div className="p-2 flex-1"><div className="h-2 w-3/4 bg-[#111827] mb-1"></div><div className="h-1 w-1/2 bg-[#DC2626] mb-2"></div><div className="flex gap-2"><div className="flex-1"><div className="w-full h-0.5 bg-[#e5e7eb] mb-1"></div></div><div className="w-[35%] bg-[#1F2937] rounded p-1"><div className="h-0.5 bg-[#DC2626]"></div></div></div></div></div> },
  { id: 'elegant-serif', name: 'Elegant Serif', desc: 'Classic & sophisticated', category: 'Elegant',
    preview: <div className="w-full h-full bg-[#FFFBF5] p-3 flex flex-col"><div className="text-center mb-2 pb-2 border-b border-[#D4A853]"><div className="h-1.5 w-12 bg-[#2C1810] mx-auto mb-1"></div><div className="h-1 w-8 bg-[#D4A853] mx-auto"></div></div><div className="flex gap-2 flex-1"><div className="w-1/3"><div className="w-full h-0.5 bg-[#D4A853] mb-1"></div></div><div className="w-px bg-[#D4A853]"></div><div className="flex-1"><div className="w-full h-0.5 bg-[#e5e7eb] mb-1"></div></div></div></div> },
  { id: 'tech-dark', name: 'Tech Dark', desc: 'Developer & tech style', category: 'Tech',
    preview: <div className="w-full h-full bg-[#0F172A] p-2 flex flex-col overflow-hidden"><div className="text-[#22D3EE] text-[6px] mb-1 font-mono">// resume.json</div><div className="h-1.5 w-2/3 bg-white mb-1"></div><div className="h-1 w-1/2 bg-[#22D3EE] mb-2"></div><div className="flex gap-2 flex-1"><div className="flex-1 border-r border-[#1E293B]"><div className="h-0.5 bg-[#1E293B] mb-1"></div></div><div className="w-1/3"><div className="flex flex-wrap gap-0.5">{[1,2,3].map(i => <span key={i} className="w-3 h-1.5 border border-[#22D3EE] rounded-sm block"></span>)}</div></div></div></div> },
  { id: 'pastel-soft', name: 'Pastel Soft', desc: 'Gentle & warm colors', category: 'Creative',
    preview: <div className="w-full h-full bg-[#FFF9FB] p-2 flex flex-col"><div className="flex items-center gap-2 mb-2"><div className="w-8 h-8 rounded-2xl bg-[#FCE7F3]"></div><div><div className="h-1.5 w-10 bg-[#831843] mb-1"></div><div className="h-1 w-6 bg-[#EC4899]"></div></div></div><div className="bg-[#FCE7F3] rounded-xl p-1.5 mb-1"><div className="h-0.5 bg-[#EC4899] mb-0.5"></div><div className="h-0.5 bg-[#FBCFE8]"></div></div></div> },
  { id: 'gold-luxury', name: 'Gold Luxury', desc: 'Premium dark & gold', category: 'Elegant',
    preview: <div className="w-full h-full bg-[#0C0C0C] flex flex-col overflow-hidden"><div className="bg-gradient-to-r from-[#B8860B] to-[#DAA520] p-2 text-center"><div className="h-1.5 w-10 bg-white mx-auto mb-1"></div><div className="h-1 w-6 bg-white/60 mx-auto"></div></div><div className="flex flex-1 p-2 gap-2"><div className="flex-1"><div className="h-0.5 bg-[#DAA520] mb-1"></div><div className="h-0.5 bg-[#333] mb-1"></div></div><div className="w-1/3 bg-[#1A1A1A] p-1"><div className="h-0.5 bg-[#DAA520] mb-1"></div></div></div></div> },
  { id: 'blue-professional', name: 'Blue Professional', desc: 'Clean corporate blue', category: 'Executive',
    preview: <div className="w-full h-full flex overflow-hidden"><div className="w-[35%] bg-[#1E40AF] p-2 flex flex-col items-center pt-3"><div className="w-6 h-6 rounded-full border-2 border-[#93C5FD] bg-[#2563EB] mb-1"></div><div className="w-full h-0.5 bg-[#2563EB] mb-1"></div><div className="w-4/5 h-0.5 bg-[#BFDBFE]"></div></div><div className="w-[65%] p-2"><div className="h-2 w-3/4 bg-[#1E40AF] mb-1"></div><div className="h-1 w-1/2 bg-[#3B82F6] mb-2"></div><div className="h-0.5 bg-[#DBEAFE] mb-1"></div></div></div> },
  { id: 'teal-modern', name: 'Teal Modern', desc: 'Fresh teal & minimal', category: 'Modern',
    preview: <div className="w-full h-full flex flex-col overflow-hidden"><div className="bg-[#0F766E] p-2 relative overflow-hidden"><div className="absolute top-0 right-0 w-8 h-8 bg-[#0D9488] rounded-full -translate-y-1/2 translate-x-1/4 opacity-50"></div><div className="h-1.5 w-2/3 bg-white mb-1"></div><div className="h-1 w-1/2 bg-[#5EEAD4]"></div></div><div className="flex flex-1 p-2 gap-2"><div className="flex-1"><div className="h-0.5 bg-[#CCFBF1] mb-1"></div></div><div className="w-1/3 bg-[#F0FDFA] p-1"><div className="h-0.5 bg-[#0F766E] mb-1"></div></div></div></div> },
  { id: 'slate-clean', name: 'Slate Clean', desc: 'Simple & straightforward', category: 'Simple',
    preview: <div className="w-full h-full bg-white p-3 flex flex-col gap-2"><div className="w-1/2 h-2 bg-[#334155] mb-2"></div><div className="w-full h-0.5 bg-[#cbd5e1] mb-1"></div><div className="w-3/4 h-0.5 bg-[#cbd5e1]"></div></div> },
  { id: 'rose-minimal', name: 'Rose Minimal', desc: 'Elegant rose accents', category: 'Elegant',
    preview: <div className="w-full h-full bg-white p-3 flex flex-col"><div className="border-l-2 border-[#E11D48] pl-2 mb-2"><div className="w-1/2 h-1.5 bg-[#1f2937]"></div></div><div className="w-full h-0.5 bg-[#fecdd3]"></div></div> },
];

// 2. Premium Themes (original 5 + 6 new = 11)
const premiumDesigns: DesignItem[] = [
  { id: 'pro-executive', name: 'Pro Executive', desc: 'Avatar + skill bars sidebar', category: 'Executive', isPremium: true,
    preview: (<div className="w-full h-full flex overflow-hidden"><div className="w-[40%] bg-slate-900 p-2 flex flex-col items-center"><div className="w-8 h-8 rounded-full border-2 border-amber-400 mb-2"></div><div className="flex flex-col gap-1.5 w-full"><div className="h-1 w-full bg-slate-800 rounded-full"><div className="h-full w-[80%] bg-amber-400 rounded-full"></div></div><div className="h-1 w-full bg-slate-800 rounded-full"><div className="h-full w-[60%] bg-amber-400 rounded-full"></div></div></div></div><div className="w-[60%] bg-white p-2 flex flex-col gap-1"><div className="w-5/6 h-2 bg-slate-900"></div><div className="w-1/2 h-1 bg-amber-400 mb-1"></div><div className="flex-1 h-1 bg-slate-200"></div></div></div>) },
  { id: 'pro-infographic', name: 'Pro Infographic', desc: 'Header + data viz sidebar', category: 'Modern', isPremium: true,
    preview: (<div className="w-full h-full flex flex-col bg-slate-50 overflow-hidden"><div className="h-10 w-full bg-indigo-600 flex items-center px-2 gap-2"><div className="w-6 h-6 rounded-full bg-white"></div><div className="w-1/2 h-1.5 bg-white rounded"></div></div><div className="flex flex-1 p-2 gap-2"><div className="w-[65%] flex flex-col gap-1.5"><div className="w-full h-1.5 bg-slate-300 rounded-sm"></div><div className="w-5/6 h-1 bg-slate-200"></div></div><div className="w-[35%] flex flex-col gap-1"><div className="w-full h-2 bg-indigo-200 rounded"></div><div className="w-4/5 h-2 bg-indigo-200 rounded"></div></div></div></div>) },
  { id: 'pro-developer', name: 'Pro Developer', desc: 'Dark IDE aesthetic', category: 'Tech', isPremium: true,
    preview: (<div className="w-full h-full bg-[#0d1117] flex flex-col overflow-hidden p-2"><div className="flex items-center gap-1 mb-2 border-b border-[#30363d] pb-1"><div className="w-1.5 h-1.5 rounded-full bg-red-500"></div><div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div><div className="w-1.5 h-1.5 rounded-full bg-green-500"></div></div><div className="flex gap-2 flex-1"><div className="w-1/3 flex flex-col gap-1"><div className="w-full h-1.5 bg-[#58a6ff] rounded-full"></div><div className="w-4/5 h-1.5 bg-[#7ee787] rounded-full"></div></div><div className="w-2/3 flex flex-col gap-1"><div className="w-full h-1 bg-[#c9d1d9]"></div><div className="w-5/6 h-1 bg-[#c9d1d9]"></div></div></div></div>) },
  { id: 'pro-agency', name: 'Pro Agency', desc: 'Vibrant gradient split', category: 'Creative', isPremium: true,
    preview: (<div className="w-full h-full flex overflow-hidden"><div className="w-[45%] bg-gradient-to-br from-pink-500 to-orange-400 p-2 flex flex-col justify-between"><div className="w-8 h-8 rounded-xl bg-white/30"></div><div><div className="w-full h-1.5 bg-white mb-1"></div><div className="w-2/3 h-1 bg-white/70"></div></div></div><div className="w-[55%] bg-white p-2 flex flex-col gap-2"><div className="w-full h-2 bg-slate-800"></div><div className="w-3/4 h-1 bg-slate-300"></div><div className="grid grid-cols-2 gap-1"><div className="h-4 bg-slate-100"></div><div className="h-4 bg-slate-100"></div></div></div></div>) },
  { id: 'pro-elegant', name: 'Pro Elegant', desc: 'High-end serif & gold', category: 'Elegant', isPremium: true,
    preview: (<div className="w-full h-full bg-[#fdfbf7] p-2 flex flex-col border-2 border-[#d4af37]/30"><div className="flex flex-col items-center border-b border-[#d4af37] pb-2 mb-2"><div className="w-6 h-6 rounded-full bg-[#2c3e50] mb-1"></div><div className="w-1/2 h-1.5 bg-[#2c3e50] mb-0.5"></div><div className="w-1/4 h-0.5 bg-[#d4af37]"></div></div><div className="flex justify-between gap-2 px-1"><div className="w-1/2 flex flex-col gap-1 items-center"><div className="w-full h-0.5 bg-[#2c3e50]"></div></div><div className="w-px bg-[#d4af37]/50"></div><div className="w-1/2 flex flex-col gap-1 items-center"><div className="w-full h-0.5 bg-[#2c3e50]"></div></div></div></div>) },
  // NEW premium templates
  { id: 'pro-monochrome', name: 'Pro Monochrome', desc: 'Editorial serif with drop cap', category: 'Elegant', isPremium: true,
    preview: (<div className="w-full h-full bg-white p-2.5 flex flex-col border-t-[3px] border-neutral-900 font-serif"><div className="text-[5px] uppercase tracking-widest text-neutral-400 mb-1">Curriculum Vitae</div><div className="h-2.5 w-3/4 bg-neutral-900 mb-0.5"></div><div className="h-1 w-1/2 bg-neutral-500 mb-2 italic"></div><div className="h-px w-full bg-neutral-900 mb-2"></div><div className="grid grid-cols-[20px_1fr] gap-1"><div className="h-0.5 w-4 bg-neutral-400 mt-0.5"></div><div className="flex flex-col gap-0.5"><div className="h-1 w-full bg-neutral-800"></div><div className="h-0.5 w-4/5 bg-neutral-300"></div></div></div></div>) },
  { id: 'pro-timeline', name: 'Pro Timeline', desc: 'Vertical career timeline', category: 'Modern', isPremium: true,
    preview: (<div className="w-full h-full bg-white flex flex-col overflow-hidden"><div className="bg-gradient-to-br from-slate-900 to-slate-800 p-2 relative"><div className="absolute right-0 top-0 w-6 h-6 bg-[#FF6321]/40 rounded-full blur-md"></div><div className="flex items-center gap-1 relative"><div className="w-5 h-5 rounded bg-white/20"></div><div><div className="h-1.5 w-10 bg-white mb-0.5"></div><div className="h-0.5 w-6 bg-[#FF6321]"></div></div></div></div><div className="flex-1 p-2 flex gap-1.5"><div className="w-1/3 flex flex-col gap-0.5"><div className="h-1 w-full bg-neutral-800"></div><div className="h-0.5 bg-neutral-200"></div></div><div className="w-2/3 border-l-2 border-neutral-200 pl-2 space-y-1 relative"><div className="absolute -left-1 top-0 w-2 h-2 rounded-full bg-[#FF6321]"></div><div className="h-1.5 bg-neutral-800"></div><div className="h-0.5 w-4/5 bg-neutral-300"></div></div></div></div>) },
  { id: 'pro-gradient', name: 'Pro Gradient', desc: 'Glass cards on soft mesh', category: 'Modern', isPremium: true,
    preview: (<div className="w-full h-full bg-gradient-to-br from-orange-50 via-white to-amber-50 p-2 flex flex-col gap-1.5 relative overflow-hidden"><div className="absolute -right-3 -top-3 w-10 h-10 bg-[#FF6321]/20 rounded-full blur-lg"></div><div className="relative bg-white/60 backdrop-blur rounded-lg p-1.5 border border-white/80 flex items-center gap-1"><div className="w-5 h-5 rounded bg-gradient-to-br from-[#FF6321] to-amber-500"></div><div><div className="h-1 w-8 bg-neutral-800 mb-0.5"></div><div className="h-0.5 w-5 bg-[#FF6321]"></div></div></div><div className="relative bg-white/50 backdrop-blur rounded-lg p-1.5 flex-1 border border-white/70 space-y-0.5"><div className="h-0.5 w-full bg-neutral-300"></div><div className="h-0.5 w-4/5 bg-neutral-200"></div></div></div>) },
  { id: 'pro-startup', name: 'Pro Startup', desc: 'Bold blocks with numbered exp', category: 'Creative', isPremium: true,
    preview: (<div className="w-full h-full bg-[#FAF7F2] flex flex-col overflow-hidden"><div className="grid grid-cols-2 gap-0.5 bg-neutral-900 p-0.5"><div className="bg-[#FF6321] p-1.5 flex flex-col justify-between"><div className="w-3 h-3 rounded bg-white/40"></div><div className="h-1 w-3/4 bg-white"></div></div><div className="bg-neutral-900 p-1.5"><div className="h-0.5 w-full bg-neutral-700 mb-0.5"></div><div className="h-0.5 w-4/5 bg-neutral-700"></div></div></div><div className="p-2 flex-1"><div className="text-[8px] font-black text-[#FF6321]">01</div><div className="h-0.5 w-full bg-neutral-800"></div></div></div>) },
  { id: 'pro-diamond', name: 'Pro Diamond', desc: 'Luxury noir & platinum', category: 'Executive', isPremium: true,
    preview: (<div className="w-full h-full bg-[#0A0E1A] p-2 flex flex-col overflow-hidden relative"><div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#D4AF37]/10 to-transparent"></div><div className="text-center relative"><div className="w-5 h-5 rounded-full mx-auto mb-1 border border-[#D4AF37]"></div><div className="text-[4px] text-[#D4AF37] tracking-widest mb-0.5">◆ CV ◆</div><div className="h-1 w-2/3 bg-white mx-auto mb-0.5"></div><div className="h-0.5 w-1/3 bg-[#D4AF37] mx-auto"></div></div><div className="mt-2 border border-[#D4AF37]/30 rounded p-1 space-y-0.5"><div className="h-0.5 bg-white/60"></div><div className="h-0.5 w-4/5 bg-white/40"></div></div></div>) },
  { id: 'pro-minimalist', name: 'Pro Minimalist', desc: 'Ultra-clean grid layout', category: 'Simple', isPremium: true,
    preview: (<div className="w-full h-full bg-white p-3 flex flex-col overflow-hidden"><div className="h-2 w-2/3 bg-neutral-900 font-light mb-0.5"></div><div className="h-1 w-1/3 bg-neutral-400 mb-2"></div><div className="grid grid-cols-[15px_1fr] gap-1.5 mt-1"><div className="text-[4px] text-neutral-400 uppercase">Sum</div><div className="h-0.5 w-full bg-neutral-300"></div></div><div className="grid grid-cols-[15px_1fr] gap-1.5 mt-1"><div className="text-[4px] text-neutral-400 uppercase">Exp</div><div className="space-y-0.5"><div className="h-0.5 w-full bg-neutral-800"></div><div className="h-0.5 w-4/5 bg-neutral-300"></div></div></div></div>) },
];

const allDesigns: DesignItem[] = [...freeDesigns, ...premiumDesigns];
const CATEGORIES = ['All', 'Simple', 'Modern', 'Creative', 'Executive', 'Tech', 'Elegant'] as const;
type Filter = 'All' | 'Free' | 'Premium' | 'Popular';

export const DesignSelection: React.FC<DesignSelectionProps> = ({ designId, setDesignId, setStep }) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('All');
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>('All');
  const [previewId, setPreviewId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return allDesigns.filter(d => {
      if (filter === 'Free' && d.isPremium) return false;
      if (filter === 'Premium' && !d.isPremium) return false;
      if (filter === 'Popular' && !['modern', 'pro-executive', 'pro-timeline', 'pro-gradient', 'creative-orange', 'pro-minimalist'].includes(d.id)) return false;
      if (category !== 'All' && d.category !== category) return false;
      if (search && !(`${d.name} ${d.desc}`.toLowerCase().includes(search.toLowerCase()))) return false;
      return true;
    });
  }, [filter, category, search]);

  const previewDesign = previewId ? allDesigns.find(d => d.id === previewId) : null;

  return (
    <motion.div
      key="design"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 print:hidden min-h-screen pt-[88px]"
    >
      {/* Header */}
      <div className="mb-8 flex flex-wrap items-end justify-between gap-6">
        <div>
          <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#FF6321] mb-3 block">Step 02 / 03 · Design</span>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">Pick your template</h2>
          <p className="mt-3 text-muted-foreground max-w-2xl">
            {allDesigns.length} handcrafted templates — <span className="text-foreground font-semibold">{freeDesigns.length} free</span> and <span className="text-[#FF6321] font-semibold">{premiumDesigns.length} premium</span>. All ATS-friendly.
          </p>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF6321] to-amber-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/30">
            <Sparkles size={18} />
          </div>
          <div className="text-sm">
            <div className="font-semibold text-foreground">{filtered.length} shown</div>
            <div className="text-muted-foreground text-xs">Try a premium template</div>
          </div>
        </div>
      </div>

      {/* Filter bar */}
      <div className="mb-6 flex flex-wrap items-center gap-3 bg-card border border-border rounded-2xl p-3 shadow-sm sticky top-[76px] z-20 backdrop-blur-xl">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search templates..."
            className="w-full bg-muted/40 border border-border rounded-xl pl-9 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#FF6321]/30 focus:border-[#FF6321] text-foreground placeholder:text-muted-foreground"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {(['All', 'Free', 'Premium', 'Popular'] as Filter[]).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-xs px-3 py-1.5 rounded-full font-semibold transition-all ${
                filter === f
                  ? 'bg-[#FF6321] text-white shadow-md shadow-orange-500/30'
                  : 'bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {f === 'Premium' && <Crown size={11} className="inline mr-1 -mt-0.5" />}
              {f}
            </button>
          ))}
        </div>
        <div className="w-full h-px bg-border sm:hidden" />
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
                category === c
                  ? 'bg-foreground text-background'
                  : 'border border-border text-muted-foreground hover:text-foreground hover:border-[#FF6321]'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="bg-card border border-border rounded-3xl p-4 sm:p-6 lg:p-8 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.08)]">
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Search size={40} className="mx-auto mb-3 opacity-40" />
            <p className="font-semibold">No templates match your filters</p>
            <button onClick={() => { setSearch(''); setFilter('All'); setCategory('All'); }} className="mt-3 text-[#FF6321] text-sm font-bold hover:underline">Clear filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            <AnimatePresence mode="popLayout">
              {filtered.map((design, i) => {
                const selected = designId === design.id;
                return (
                  <motion.div
                    key={design.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2, delay: Math.min(i * 0.015, 0.3) }}
                    onClick={() => setDesignId(design.id as DesignId)}
                    className={`group relative cursor-pointer rounded-2xl border-2 transition-all p-3 flex flex-col gap-3 ${
                      selected
                        ? 'border-[#FF6321] bg-[#FF6321]/5 shadow-lg shadow-orange-500/10'
                        : 'border-border bg-background hover:border-[#FF6321]/40 hover:shadow-md'
                    }`}
                  >
                    {/* Selected checkmark */}
                    <AnimatePresence>
                      {selected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          className="absolute -top-2 -left-2 bg-[#FF6321] text-white p-1 rounded-full shadow-lg z-10"
                        >
                          <Check size={14} strokeWidth={3} />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Premium badge */}
                    {design.isPremium && (
                      <div className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-white px-2 py-1 rounded-full shadow-lg z-10 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider">
                        <Crown size={10} className="fill-current" />
                        Pro
                      </div>
                    )}

                    {/* Preview */}
                    <div className="bg-muted/40 rounded-xl h-36 overflow-hidden border border-border relative group/prev">
                      {design.preview}
                      <button
                        onClick={(e) => { e.stopPropagation(); setPreviewId(design.id); }}
                        className="absolute inset-0 bg-black/50 opacity-0 group-hover/prev:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm"
                      >
                        <span className="bg-white text-black text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                          <Eye size={12} /> Preview
                        </span>
                      </button>
                    </div>

                    <div className="text-center mt-auto">
                      <h3 className="font-bold text-foreground text-xs mb-0.5">{design.name}</h3>
                      <p className="text-[10px] text-muted-foreground line-clamp-1">{design.desc}</p>
                      <span className="inline-block mt-1.5 text-[9px] uppercase tracking-wider text-muted-foreground/70 font-semibold">
                        {design.category}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* Actions */}
        <div className="mt-8 pt-8 border-t border-border flex justify-between items-center gap-4 flex-wrap">
          <button
            onClick={() => setStep(Step.DETAILS)}
            className="flex items-center gap-2 px-6 py-4 bg-muted/60 border border-border text-foreground font-bold rounded-xl hover:bg-muted transition-colors"
          >
            <ArrowLeft size={18} /> Back
          </button>
          <div className="text-sm text-muted-foreground hidden sm:block">
            Selected: <span className="text-foreground font-bold">{allDesigns.find(d => d.id === designId)?.name || 'None'}</span>
          </div>
          <button
            onClick={() => setStep(Step.JOB)}
            className="group flex items-center gap-3 bg-gradient-to-r from-[#FF6321] to-amber-500 text-white px-8 py-4 rounded-xl font-bold text-base shadow-xl shadow-orange-500/30 hover:shadow-orange-500/50 hover:-translate-y-0.5 transition-all"
          >
            Continue
            <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* Preview modal */}
      <AnimatePresence>
        {previewDesign && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPreviewId(null)}
            className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card border border-border rounded-3xl max-w-md w-full p-6 relative"
            >
              <button
                onClick={() => setPreviewId(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-muted hover:bg-muted/70 flex items-center justify-center text-foreground"
              >
                <X size={16} />
              </button>
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-2xl font-bold text-foreground">{previewDesign.name}</h3>
                {previewDesign.isPremium && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-amber-400 to-yellow-500 text-white px-2 py-0.5 rounded-full">
                    <Crown size={10} /> Pro
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-4">{previewDesign.desc}</p>
              <div className="bg-muted/40 rounded-2xl h-80 overflow-hidden border border-border mb-4">
                {previewDesign.preview}
              </div>
              <button
                onClick={() => { setDesignId(previewDesign.id as DesignId); setPreviewId(null); }}
                className="w-full bg-gradient-to-r from-[#FF6321] to-amber-500 text-white py-3 rounded-xl font-bold shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition-all"
              >
                Use this template
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
