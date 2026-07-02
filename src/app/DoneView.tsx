import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Monitor, Smartphone, FileText, Download } from "lucide-react";
import { Step } from "./App";
import { ResumePreview, DesignId } from "./components/ResumePreview";
import { ResumeQRCode } from "./components/ResumeQRCode";
import { ResumeData } from "./lib/types";

interface DoneViewProps {
  resumeData: ResumeData;
  setStep: (step: Step) => void;
  designId: DesignId;
  setDesignId: (designId: DesignId) => void;
  handlePrint: () => void;
}

export const DoneView: React.FC<DoneViewProps> = ({
  resumeData,
  setStep,
  designId,
  setDesignId,
  handlePrint,
}) => {
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <motion.div
      key="done"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-[850px] mx-auto py-12 px-6 print:p-0 print:py-0 print:max-w-none"
    >
      {/* Sticky Action Bar */}
      <div className="sticky top-[76px] z-40 flex flex-wrap justify-between items-center gap-2 sm:gap-0 bg-white/95 backdrop-blur-md border shadow-lg shadow-black/5 rounded-2xl sm:rounded-full px-3 sm:px-4 py-3 mb-8 print:hidden mx-auto w-full max-w-[850px]">
         <button
            onClick={() => setStep(Step.JOB)}
            className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-sm font-bold uppercase tracking-widest hover:text-[#FF6321] transition-colors mr-auto sm:mr-0"
          >
            <ArrowLeft size={14} className="sm:w-4 sm:h-4" /> <span className="hidden sm:inline">Edit</span>
          </button>
          
          <div className="hidden sm:flex items-center gap-1 bg-[#f3f4f6]/80 p-1 rounded-full mx-auto">
            {(['classic', 'modern', 'minimal', 'split'] as const).map(d => (
              <button
                key={d}
                onClick={() => setDesignId(d as DesignId)}
                className={`px-3 sm:px-4 py-1.5 object-cover rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-widest transition-all ${designId === d ? 'bg-white shadow-sm text-[#FF6321]' : 'text-[#6b7280] hover:text-[#111827]'}`}
              >
                {d}
              </button>
            ))}
          </div>

          <div className="flex items-center sm:hidden gap-1 bg-[#f3f4f6]/80 px-2 py-1.5 rounded-full mx-2">
             <select 
               value={designId} 
               onChange={e => setDesignId(e.target.value as DesignId)}
               className="bg-transparent text-[10px] font-bold uppercase outline-none text-[#374151]"
             >
               <option value="classic">Classic</option>
               <option value="modern">Modern</option>
               <option value="minimal">Minimal</option>
               <option value="split">Split</option>
             </select>
          </div>

          <div className="hidden lg:flex items-center gap-1 bg-[#f3f4f6]/80 p-1 rounded-full mr-2 space-x-1">
             <button
               onClick={() => setPreviewMode('desktop')}
               className={`p-1.5 rounded-full transition-all ${previewMode === 'desktop' ? 'bg-white shadow-sm text-[#FF6321]' : 'text-[#6b7280] hover:text-[#111827]'}`}
               title="Desktop View"
             >
               <Monitor size={14} />
             </button>
             <button
               onClick={() => setPreviewMode('mobile')}
               className={`p-1.5 rounded-full transition-all ${previewMode === 'mobile' ? 'bg-white shadow-sm text-[#FF6321]' : 'text-[#6b7280] hover:text-[#111827]'}`}
               title="Mobile View"
             >
               <Smartphone size={14} />
             </button>
          </div>

          <div className="flex gap-1.5 sm:gap-2">
            <button
              onClick={() => setStep(Step.COVER_LETTER)}
              className="flex items-center gap-1 sm:gap-2 bg-gradient-to-r from-orange-500 to-[#FF6321] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-bold uppercase tracking-widest text-[9px] sm:text-xs hover:shadow-lg hover:shadow-orange-500/30 hover:-translate-y-0.5 transition-all"
            >
              <FileText size={12} className="sm:w-3.5 sm:h-3.5" /> <span className="hidden sm:inline">Cover</span> Letter
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1 sm:gap-2 bg-[#0a0a0a] text-white px-3 sm:px-5 py-1.5 sm:py-2 rounded-full font-bold uppercase tracking-widest text-[9px] sm:text-xs hover:bg-[#FF6321] hover:shadow-lg hover:shadow-orange-500/30 hover:-translate-y-0.5 transition-all"
            >
              <Download size={12} className="sm:w-3.5 sm:h-3.5" /> PDF
            </button>
          </div>
      </div>

      <div className="w-full pb-12 flex justify-center overflow-hidden">
        {previewMode === 'desktop' ? (() => {
          const scale = Math.min(1, Math.max(0.35, (windowWidth - 32) / 850));
          return (
            <div
              className="print:w-auto print:h-auto mx-auto"
              style={{
                width: scale < 1 ? `${850 * scale}px` : 'auto',
                height: scale < 1 ? `${1100 * scale}px` : 'auto',
              }}
            >
              <div
                className="origin-top-left print:transform-none"
                style={{ transform: scale < 1 ? `scale(${scale})` : 'none', width: '850px' }}
              >
                <div id="resume-document" className="relative bg-white w-[850px] min-h-[1100px] shadow-2xl shadow-black/5 ring-1 ring-black/5 print:shadow-none print:ring-0 print:w-[850px] print:min-h-auto flex flex-col overflow-hidden">
                  <ResumePreview data={resumeData} designId={designId} />
                  {resumeData.header.qrCodeUrl && resumeData.header.showQrCode !== false && (
                    <div className="absolute top-6 right-6 z-10 print:top-6 print:right-6">
                      <ResumeQRCode url={resumeData.header.qrCodeUrl} size={72} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })() : (
          <div className="mx-auto w-[375px] h-[812px] transform scale-[0.85] sm:scale-100 origin-top bg-gray-100 border-[14px] border-[#0a0a0a] rounded-[3rem] shadow-2xl shadow-black/20 relative flex flex-col overflow-hidden print:hidden mt-4">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#0a0a0a] rounded-b-2xl z-50"></div>
            <div className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth pt-10 pb-12 w-full bg-[#f3f4f6]">
              <div className="w-[850px] mx-auto origin-top-left flex flex-col" style={{ transform: 'scale(0.407)' }}>
              <div id="resume-document-mobile" className="relative bg-white shadow-xl flex-1 w-full min-h-[1100px] flex flex-col">
                   <ResumePreview data={resumeData} designId={designId} />
                   {resumeData.header.qrCodeUrl && resumeData.header.showQrCode !== false && (
                     <div className="absolute top-6 right-6 z-10">
                       <ResumeQRCode url={resumeData.header.qrCodeUrl} size={72} />
                     </div>
                   )}
                 </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
