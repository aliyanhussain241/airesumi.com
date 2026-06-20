import React from "react";
import { motion } from "motion/react";
import { ArrowLeft, ArrowRight, Crown } from "lucide-react";
import { Step } from "./App";
import { DesignId } from "./components/ResumePreview";

interface DesignSelectionProps {
  designId: DesignId;
  setDesignId: (designId: DesignId) => void;
  setStep: (step: Step) => void;
}

// 1. Pehle 20 Free Themes (18 purane + 2 naye)
const freeDesigns: { id: string; name: string; desc: string; preview: React.ReactNode; isPremium?: boolean }[] = [
  {
    id: 'classic', name: 'Classic', desc: 'Timeless & professional',
    preview: <div className="w-full h-full bg-white p-3 flex flex-col gap-2"><div className="text-center mb-1 border-b border-[#1f2937] pb-2"><div className="w-16 h-2 bg-[#111827] mx-auto mb-1"></div><div className="w-10 h-1 bg-[#6b7280] mx-auto"></div></div><div className="w-10 h-1 bg-[#111827] mb-0.5"></div><div className="w-full h-1 bg-[#e5e7eb] rounded-sm"></div><div className="w-full h-1 bg-[#e5e7eb] rounded-sm"></div><div className="w-3/4 h-1 bg-[#e5e7eb] rounded-sm"></div></div>
  },
  {
    id: 'modern', name: 'Modern', desc: 'Bold accents & clean',
    preview: <div className="w-full h-full bg-white p-3 flex flex-col gap-2"><div className="border-l-[3px] border-[#FF6321] pl-2 mb-2"><div className="h-2.5 w-1/2 bg-[#111827] mb-1"></div><div className="h-1.5 w-1/3 bg-[#FF6321]"></div></div><div className="w-full h-1 bg-[#e5e7eb] rounded-sm"></div><div className="w-4/5 h-1 bg-[#e5e7eb] rounded-sm"></div></div>
  },
  {
    id: 'minimal', name: 'Minimal', desc: 'Whitespace focused',
    preview: <div className="w-full h-full bg-white p-4 flex flex-col gap-2"><div className="text-center mb-3"><div className="h-2 w-16 bg-[#1f2937] mx-auto mb-1.5"></div><div className="h-1 w-10 bg-[#9ca3af] mx-auto"></div></div><div className="w-full h-1 bg-[#e5e7eb]"></div><div className="w-4/5 h-1 bg-[#e5e7eb]"></div></div>
  },
  {
    id: 'split', name: 'Split', desc: 'Creative sidebar layout',
    preview: <div className="w-full h-full bg-white flex overflow-hidden"><div className="w-[35%] bg-[#1f2937] p-2 flex flex-col gap-1.5 items-center pt-3"><div className="w-8 h-8 rounded-full border-2 border-[#eab308] bg-[#4b5563] mb-1"></div><div className="w-4/5 h-0.5 bg-[#9ca3af]"></div></div><div className="w-[65%] p-3"><div className="h-2.5 w-16 bg-[#111827] mb-1"></div><div className="h-1 w-10 bg-[#eab308]"></div></div></div>
  },
  {
    id: 'creative-orange', name: 'Creative Orange', desc: 'Curved vibrant sidebar',
    preview: <div className="w-full h-full bg-white flex overflow-hidden"><div className="w-[35%] bg-[#EA580C] p-2 flex flex-col gap-1 items-center pt-3 rounded-br-2xl rounded-tr-2xl"><div className="w-8 h-8 rounded-full border-2 border-white bg-white/20 mb-1"></div><div className="w-4/5 h-0.5 bg-white/40"></div></div><div className="w-[65%] p-3"><div className="h-2 w-2/3 bg-[#111827] mb-1"></div><div className="h-1 w-1/3 bg-[#9ca3af]"></div></div></div>
  },
  {
    id: 'corporate-dark', name: 'Corporate Dark', desc: 'Professional gray & dark',
    preview: <div className="w-full h-full bg-white flex flex-col overflow-hidden"><div className="h-10 bg-[#E5E7EB] flex items-center px-2"><div className="w-1/2 h-1 bg-[#1f2937]"></div></div><div className="flex flex-1"><div className="w-[60%] p-2"><div className="w-full h-0.5 bg-[#e5e7eb]"></div></div><div className="w-[40%] bg-[#1F2937]"></div></div></div>
  },
  {
    id: 'modern-block', name: 'Modern Block', desc: 'Clean geometric structure',
    preview: <div className="w-full h-full bg-white flex flex-col overflow-hidden p-2 border-t-[3px] border-[#F97316]"><div className="h-2 w-4/5 bg-[#111827] mb-1"></div><div className="h-1 w-1/2 bg-[#F97316] mb-2"></div><div className="w-full h-2 bg-[#374151] mb-2"></div><div className="flex gap-2"><div className="w-1/3 h-1 bg-[#e5e7eb]"></div><div className="w-2/3 h-1 bg-[#e5e7eb]"></div></div></div>
  },
  {
    id: 'contrast-bold', name: 'Contrast Bold', desc: 'Striking dark & orange',
    preview: <div className="w-full h-full bg-white flex overflow-hidden"><div className="w-[45%] p-2"><div className="w-8 h-8 rounded-full border-[3px] border-[#F97316] mt-2 mb-2"></div><div className="w-full h-2 bg-[#F97316] rounded-r-full -ml-2 mb-1"></div></div><div className="w-[55%] bg-[#1F2937]"><div className="h-10 bg-[#F97316] rounded-l-2xl p-2"><div className="h-1.5 w-3/4 bg-white mb-1"></div></div></div></div>
  },
  {
    id: 'navy-executive', name: 'Navy Executive', desc: 'Corporate navy & blue',
    preview: <div className="w-full h-full flex overflow-hidden"><div className="w-[65%] p-2 pt-3"><div className="w-full h-0.5 bg-[#e5e7eb] mb-1"></div><div className="w-4/5 h-0.5 bg-[#e5e7eb]"></div></div><div className="w-[35%] bg-[#EEF2F7] p-2"><div className="w-8 h-8 rounded-full bg-[#1B2A4A] mx-auto mb-1 border-2 border-[#1B2A4A]"></div><div className="w-full h-0.5 bg-[#1B2A4A] mb-1"></div></div></div>
  },
  {
    id: 'green-fresh', name: 'Green Fresh', desc: 'Natural & energetic',
    preview: <div className="w-full h-full bg-white p-2 flex flex-col"><div className="flex items-center gap-2 mb-2 pb-2 border-b-2 border-[#059669]"><div className="w-8 h-8 rounded-xl bg-[#ECFDF5]"></div><div><div className="h-1.5 w-12 bg-[#064E3B] mb-1"></div><div className="h-1 w-8 bg-[#059669]"></div></div></div><div className="w-full h-0.5 bg-[#D1FAE5] mb-1"></div><div className="w-4/5 h-0.5 bg-[#D1FAE5]"></div></div>
  },
  {
    id: 'purple-creative', name: 'Purple Creative', desc: 'Bold & artistic',
    preview: <div className="w-full h-full flex overflow-hidden"><div className="w-[60%] p-2"><div className="w-full h-0.5 bg-[#EDE9FE] mb-1"></div><div className="w-4/5 h-0.5 bg-[#EDE9FE]"></div></div><div className="w-[40%] bg-[#F5F3FF] p-2"><div className="w-full h-1 bg-[#6D28D9] rounded-full mb-1"></div><div className="w-4/5 h-1 bg-[#6D28D9] rounded-full"></div></div></div>
  },
  {
    id: 'red-impact', name: 'Red Impact', desc: 'Bold & powerful',
    preview: <div className="w-full h-full bg-white flex flex-col overflow-hidden"><div className="h-1 bg-[#DC2626]"></div><div className="p-2 flex-1"><div className="h-2 w-3/4 bg-[#111827] mb-1"></div><div className="h-1 w-1/2 bg-[#DC2626] mb-2"></div><div className="flex gap-2"><div className="flex-1"><div className="w-full h-0.5 bg-[#e5e7eb] mb-1"></div></div><div className="w-[35%] bg-[#1F2937] rounded p-1"><div className="h-0.5 bg-[#DC2626]"></div></div></div></div></div>
  },
  {
    id: 'elegant-serif', name: 'Elegant Serif', desc: 'Classic & sophisticated',
    preview: <div className="w-full h-full bg-[#FFFBF5] p-3 flex flex-col"><div className="text-center mb-2 pb-2 border-b border-[#D4A853]"><div className="h-1.5 w-12 bg-[#2C1810] mx-auto mb-1"></div><div className="h-1 w-8 bg-[#D4A853] mx-auto"></div></div><div className="flex gap-2 flex-1"><div className="w-1/3"><div className="w-full h-0.5 bg-[#D4A853] mb-1"></div></div><div className="w-px bg-[#D4A853]"></div><div className="flex-1"><div className="w-full h-0.5 bg-[#e5e7eb] mb-1"></div></div></div></div>
  },
  {
    id: 'tech-dark', name: 'Tech Dark', desc: 'Developer & tech style',
    preview: <div className="w-full h-full bg-[#0F172A] p-2 flex flex-col overflow-hidden"><div className="text-[#22D3EE] text-[6px] mb-1 font-mono">// resume.json</div><div className="h-1.5 w-2/3 bg-white mb-1"></div><div className="h-1 w-1/2 bg-[#22D3EE] mb-2"></div><div className="flex gap-2 flex-1"><div className="flex-1 border-r border-[#1E293B]"><div className="h-0.5 bg-[#1E293B] mb-1"></div></div><div className="w-1/3"><div className="flex flex-wrap gap-0.5">{[1,2,3].map(i => <span key={i} className="w-3 h-1.5 border border-[#22D3EE] rounded-sm block"></span>)}</div></div></div></div>
  },
  {
    id: 'pastel-soft', name: 'Pastel Soft', desc: 'Gentle & warm colors',
    preview: <div className="w-full h-full bg-[#FFF9FB] p-2 flex flex-col"><div className="flex items-center gap-2 mb-2"><div className="w-8 h-8 rounded-2xl bg-[#FCE7F3]"></div><div><div className="h-1.5 w-10 bg-[#831843] mb-1"></div><div className="h-1 w-6 bg-[#EC4899]"></div></div></div><div className="bg-[#FCE7F3] rounded-xl p-1.5 mb-1"><div className="h-0.5 bg-[#EC4899] mb-0.5"></div><div className="h-0.5 bg-[#FBCFE8]"></div></div></div>
  },
  {
    id: 'gold-luxury', name: 'Gold Luxury', desc: 'Premium dark & gold',
    preview: <div className="w-full h-full bg-[#0C0C0C] flex flex-col overflow-hidden"><div className="bg-gradient-to-r from-[#B8860B] to-[#DAA520] p-2 text-center"><div className="h-1.5 w-10 bg-white mx-auto mb-1"></div><div className="h-1 w-6 bg-white/60 mx-auto"></div></div><div className="flex flex-1 p-2 gap-2"><div className="flex-1"><div className="h-0.5 bg-[#DAA520] mb-1"></div><div className="h-0.5 bg-[#333] mb-1"></div></div><div className="w-1/3 bg-[#1A1A1A] p-1"><div className="h-0.5 bg-[#DAA520] mb-1"></div></div></div></div>
  },
  {
    id: 'blue-professional', name: 'Blue Professional', desc: 'Clean corporate blue',
    preview: <div className="w-full h-full flex overflow-hidden"><div className="w-[35%] bg-[#1E40AF] p-2 flex flex-col items-center pt-3"><div className="w-6 h-6 rounded-full border-2 border-[#93C5FD] bg-[#2563EB] mb-1"></div><div className="w-full h-0.5 bg-[#2563EB] mb-1"></div><div className="w-4/5 h-0.5 bg-[#BFDBFE]"></div></div><div className="w-[65%] p-2"><div className="h-2 w-3/4 bg-[#1E40AF] mb-1"></div><div className="h-1 w-1/2 bg-[#3B82F6] mb-2"></div><div className="h-0.5 bg-[#DBEAFE] mb-1"></div></div></div>
  },
  {
    id: 'teal-modern', name: 'Teal Modern', desc: 'Fresh teal & minimal',
    preview: <div className="w-full h-full flex flex-col overflow-hidden"><div className="bg-[#0F766E] p-2 relative overflow-hidden"><div className="absolute top-0 right-0 w-8 h-8 bg-[#0D9488] rounded-full -translate-y-1/2 translate-x-1/4 opacity-50"></div><div className="h-1.5 w-2/3 bg-white mb-1"></div><div className="h-1 w-1/2 bg-[#5EEAD4]"></div></div><div className="flex flex-1 p-2 gap-2"><div className="flex-1"><div className="h-0.5 bg-[#CCFBF1] mb-1"></div></div><div className="w-1/3 bg-[#F0FDFA] p-1"><div className="h-0.5 bg-[#0F766E] mb-1"></div></div></div></div>
  },
  {
    id: 'slate-clean', name: 'Slate Clean', desc: 'Simple & straightforward',
    preview: <div className="w-full h-full bg-white p-3 flex flex-col gap-2"><div className="w-1/2 h-2 bg-[#334155] mb-2"></div><div className="w-full h-0.5 bg-[#cbd5e1] mb-1"></div><div className="w-3/4 h-0.5 bg-[#cbd5e1]"></div></div>
  },
  {
    id: 'rose-minimal', name: 'Rose Minimal', desc: 'Elegant rose accents',
    preview: <div className="w-full h-full bg-white p-3 flex flex-col"><div className="border-l-2 border-[#E11D48] pl-2 mb-2"><div className="w-1/2 h-1.5 bg-[#1f2937]"></div></div><div className="w-full h-0.5 bg-[#fecdd3]"></div></div>
  }
];

// 2. 30 Naye Premium Themes Generate kiye hain (Smart Code ke zariye)
const premiumColors = ['#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EF4444', '#EC4899', '#06B6D4', '#F97316', '#14B8A6', '#6366F1'];
const premiumDesigns = Array.from({ length: 30 }).map((_, index) => {
  const color = premiumColors[index % premiumColors.length];
  return {
    id: `premium-theme-${index + 1}`,
    name: `Pro Design ${index + 1}`,
    desc: 'Exclusive Premium Template',
    isPremium: true,
    preview: (
      <div className="w-full h-full bg-white flex flex-col overflow-hidden border-t-4" style={{ borderColor: color }}>
        <div className="p-2 flex-1">
          <div className="h-2 w-3/4 bg-gray-800 mb-1 rounded-sm"></div>
          <div className="h-1 w-1/2 mb-2 rounded-sm" style={{ backgroundColor: color }}></div>
          <div className="w-full h-1 bg-gray-200 mb-1 rounded-sm"></div>
          <div className="w-4/5 h-1 bg-gray-200 rounded-sm"></div>
        </div>
      </div>
    )
  };
});

// 3. Dono (Free + Premium) ko mila kar 50 themes ka mukammal Array banaya
const allDesigns = [...freeDesigns, ...premiumDesigns];

export const DesignSelection: React.FC<DesignSelectionProps> = ({ designId, setDesignId, setStep }) => {
  return (
    <motion.div
      key="design"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-6xl mx-auto py-12 px-6 print:hidden min-h-screen"
    >
      <div className="flex items-center justify-between mb-12">
        <div>
          <span className="text-xs uppercase tracking-widest font-bold text-[#FF6321] mb-2 block">Step 02 / 03</span>
          <h2 className="text-4xl font-bold tracking-tight">Choose Design</h2>
          <p className="text-gray-500 text-sm mt-1">{allDesigns.length} templates available (20 Free, 30 Premium)</p>
        </div>
      </div>

      <div className="bg-white border rounded-3xl p-6 sm:p-8 lg:p-12 [box-shadow:0_1px_2px_0_rgba(0,0,0,0.05)] space-y-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {allDesigns.map((design) => (
            <div
              key={design.id}
              onClick={() => setDesignId(design.id as DesignId)}
              className={`relative cursor-pointer rounded-2xl border-2 transition-all p-3 flex flex-col gap-3 ${
                designId === design.id
                  ? 'border-[#FF6321] bg-[#FF6321]/5 shadow-md'
                  : 'border-[#e5e7eb] hover:border-[#d1d5db] hover:shadow-sm'
              }`}
            >
              {/* Premium Badge Logic */}
              {design.isPremium && (
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white p-1.5 rounded-full shadow-lg z-10">
                  <Crown size={14} className="fill-current" />
                </div>
              )}

              <div className="bg-[#f5f5f4] rounded-xl h-36 overflow-hidden border border-[#f3f4f6]">
                {design.preview}
              </div>
              <div className="text-center mt-auto">
                <h3 className="font-bold text-[#111827] text-xs mb-0.5">{design.name}</h3>
                <p className="text-[10px] text-[#6b7280]">{design.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-[#f3f4f6] flex justify-between">
          <button
            onClick={() => setStep(Step.DETAILS)}
            className="flex items-center justify-center w-14 h-14 bg-[#f5f5f4] text-[#0a0a0a] rounded-full hover:bg-[#e5e7eb] transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <button
            onClick={() => setStep(Step.JOB)}
            className="group flex items-center gap-4 bg-[#0a0a0a] text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-[#FF6321] transition-all"
          >
            Next Step
            <div className="bg-white/20 p-2 rounded-full group-hover:bg-white/30 transition-colors">
              <ArrowRight size={18} />
            </div>
          </button>
        </div>
      </div>
    </motion.div>
  );
};
