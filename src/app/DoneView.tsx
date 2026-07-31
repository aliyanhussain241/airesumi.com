import React, { Suspense, useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Monitor,
  Smartphone,
  FileText,
  Download,
  ZoomIn,
  ZoomOut,
  Check,
  Sparkles,
} from "lucide-react";
import { Step } from "./App";
import type { DesignId } from "./components/ResumePreview";
const ResumePreview = React.lazy(() =>
  import("./components/ResumePreview").then((m) => ({ default: m.ResumePreview }))
);
import { ResumeQRCode } from "./components/ResumeQRCode";
import { ResumeData } from "./lib/types";

interface DoneViewProps {
  resumeData: ResumeData;
  setStep: (step: Step) => void;
  designId: DesignId;
  setDesignId: (designId: DesignId) => void;
  handlePrint: () => void;
}

const CORE_DESIGNS: DesignId[] = ["classic", "modern", "minimal", "split"];

const PRO_DESIGNS: DesignId[] = [
  "pro-executive",
  "pro-infographic",
  "pro-developer",
  "pro-agency",
  "pro-elegant",
  "pro-monochrome",
  "pro-timeline",
  "pro-gradient",
  "pro-startup",
  "pro-diamond",
  "pro-minimalist",
  "navy-executive",
  "creative-orange",
  "elegant-serif",
  "tech-dark",
  "gold-luxury",
  "blue-professional",
  "teal-modern",
  "slate-clean",
  "rose-minimal",
];

const label = (id: string) =>
  id.replace(/^pro-/, "").replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const ZOOM_STEPS = [0.6, 0.75, 0.9, 1, 1.15] as const;

export const DoneView: React.FC<DoneViewProps> = ({
  resumeData,
  setStep,
  designId,
  setDesignId,
  handlePrint,
}) => {
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");
  const [zoomIndex, setZoomIndex] = useState(3);
  const [windowWidth, setWindowWidth] = useState(1200);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const qrPosClass: Record<string, string> = {
    "top-right": "top-6 right-6",
    "top-left": "top-6 left-6",
    "bottom-right": "bottom-6 right-6",
    "bottom-left": "bottom-6 left-6",
  };
  const qrPos = qrPosClass[resumeData.header.qrPosition ?? "top-right"] ?? qrPosClass["top-right"];
  const qrSize = resumeData.header.qrSize ?? 72;

  const fitScale = Math.min(1, Math.max(0.35, (windowWidth - 32) / 850));
  const scale = Math.min(fitScale, ZOOM_STEPS[zoomIndex]);

  const isPro = PRO_DESIGNS.includes(designId);

  return (
    <motion.div
      key="done"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-[900px] mx-auto py-8 sm:py-12 px-4 sm:px-6 print:p-0 print:py-0 print:max-w-none"
    >
      {/* Sticky Action Bar */}
      <div className="sticky top-[76px] z-40 bg-background/95 backdrop-blur-md border border-border shadow-lg shadow-black/5 rounded-2xl px-3 sm:px-4 py-3 mb-6 print:hidden mx-auto w-full">
        <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3">
          {/* Left: back */}
          <button
            onClick={() => setStep(Step.JOB)}
            className="flex shrink-0 items-center gap-1.5 rounded-full border border-border px-3 py-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-foreground hover:border-[#FF6321] hover:text-[#FF6321] transition-colors"
          >
            <ArrowLeft size={14} /> <span className="hidden sm:inline">Edit</span>
          </button>

          {/* Middle: template + view controls */}
          <div className="order-3 w-full lg:order-none lg:w-auto flex flex-wrap items-center justify-center gap-2">
            <div className="hidden xl:flex items-center gap-1 bg-muted p-1 rounded-full">
              {CORE_DESIGNS.map((d) => (
                <button
                  key={d}
                  onClick={() => setDesignId(d)}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all ${
                    designId === d
                      ? "bg-background shadow-sm text-[#FF6321]"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>

            <div className="flex min-w-0 items-center gap-1.5 rounded-full border border-border bg-muted px-3 py-2">
              <Sparkles size={12} className="shrink-0 text-[#FF6321]" />
              <select
                value={designId}
                onChange={(e) => setDesignId(e.target.value as DesignId)}
                aria-label="Choose resume template"
                className="min-w-0 max-w-[150px] truncate bg-transparent text-[10px] sm:text-[11px] font-bold uppercase tracking-wider outline-none text-foreground [&>optgroup]:bg-background [&>option]:bg-background [&>optgroup]:text-foreground [&>option]:text-foreground"
              >
                <optgroup label="Free">
                  {CORE_DESIGNS.map((d) => (
                    <option key={d} value={d}>
                      {label(d)}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Premium">
                  {PRO_DESIGNS.map((d) => (
                    <option key={d} value={d}>
                      {label(d)}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            <div className="hidden sm:flex items-center gap-1 bg-muted p-1 rounded-full">
              <button
                onClick={() => setZoomIndex((i) => Math.max(0, i - 1))}
                disabled={zoomIndex === 0}
                title="Zoom out"
                className="p-1.5 rounded-full text-muted-foreground hover:text-foreground disabled:opacity-40"
              >
                <ZoomOut size={14} />
              </button>
              <span className="w-9 text-center text-[10px] font-bold tabular-nums text-foreground">
                {Math.round(ZOOM_STEPS[zoomIndex] * 100)}%
              </span>
              <button
                onClick={() => setZoomIndex((i) => Math.min(ZOOM_STEPS.length - 1, i + 1))}
                disabled={zoomIndex === ZOOM_STEPS.length - 1}
                title="Zoom in"
                className="p-1.5 rounded-full text-muted-foreground hover:text-foreground disabled:opacity-40"
              >
                <ZoomIn size={14} />
              </button>
            </div>

            <div className="hidden lg:flex items-center gap-1 bg-muted p-1 rounded-full">
              <button
                onClick={() => setPreviewMode("desktop")}
                className={`p-1.5 rounded-full transition-all ${previewMode === "desktop" ? "bg-background shadow-sm text-[#FF6321]" : "text-muted-foreground hover:text-foreground"}`}
                title="Desktop View"
              >
                <Monitor size={14} />
              </button>
              <button
                onClick={() => setPreviewMode("mobile")}
                className={`p-1.5 rounded-full transition-all ${previewMode === "mobile" ? "bg-background shadow-sm text-[#FF6321]" : "text-muted-foreground hover:text-foreground"}`}
                title="Mobile View"
              >
                <Smartphone size={14} />
              </button>
            </div>
          </div>

          {/* Right: actions */}
          <div className="flex shrink-0 items-center gap-2">
            <button
              onClick={() => setStep(Step.COVER_LETTER)}
              className="flex items-center gap-1.5 bg-gradient-to-r from-orange-500 to-[#FF6321] text-white px-3 sm:px-4 py-2 rounded-full font-bold uppercase tracking-widest text-[9px] sm:text-[11px] hover:shadow-lg hover:shadow-orange-500/30 hover:-translate-y-0.5 transition-all"
            >
              <FileText size={12} /> <span className="hidden sm:inline">Cover</span> Letter
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 bg-foreground text-background px-3 sm:px-5 py-2 rounded-full font-bold uppercase tracking-widest text-[9px] sm:text-[11px] hover:bg-[#FF6321] hover:text-white hover:shadow-lg hover:shadow-orange-500/30 hover:-translate-y-0.5 transition-all"
            >
              <Download size={12} /> PDF
            </button>
          </div>
        </div>
      </div>


      {/* Status strip */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-6 print:hidden">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
          <Check size={11} /> ATS-Ready
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/50 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          {label(designId)} {isPro ? "· Premium" : "· Free"}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/50 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          A4 · 1 Page
        </span>
      </div>

      <div className="w-full pb-12 flex justify-center overflow-hidden">
        {previewMode === "desktop" ? (
          <div
            className="print:w-auto print:h-auto mx-auto"
            style={{
              width: scale < 1 ? `${850 * scale}px` : "auto",
              height: scale < 1 ? `${1100 * scale}px` : "auto",
            }}
          >
            <div
              className="origin-top-left print:transform-none"
              style={{ transform: scale < 1 ? `scale(${scale})` : "none", width: "850px" }}
            >
              <div
                id="resume-document"
                className="resume-paper relative bg-white w-[850px] min-h-[1100px] shadow-2xl shadow-black/20 ring-1 ring-black/10 print:shadow-none print:ring-0 print:w-[850px] print:min-h-auto flex flex-col overflow-hidden"
              >
                <Suspense fallback={<div className="animate-pulse bg-gray-100 rounded-lg h-96" />}>
                  <ResumePreview data={resumeData} designId={designId} />
                </Suspense>
                {resumeData.header.qrCodeUrl && resumeData.header.showQrCode !== false && (
                  <div className={`absolute ${qrPos} z-10`}>
                    <ResumeQRCode url={resumeData.header.qrCodeUrl} size={qrSize} />
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="mx-auto w-[375px] h-[812px] transform scale-[0.85] sm:scale-100 origin-top bg-gray-100 border-[14px] border-[#0a0a0a] rounded-[3rem] shadow-2xl shadow-black/20 relative flex flex-col overflow-hidden print:hidden mt-4">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#0a0a0a] rounded-b-2xl z-50"></div>
            <div className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth pt-10 pb-12 w-full bg-[#f3f4f6]">
              <div
                className="w-[850px] mx-auto origin-top-left flex flex-col"
                style={{ transform: "scale(0.407)" }}
              >
                <div
                  id="resume-document-mobile"
                  className="resume-paper relative bg-white shadow-xl flex-1 w-full min-h-[1100px] flex flex-col"
                >
                  <Suspense fallback={<div className="animate-pulse bg-gray-100 rounded-lg h-96" />}>
                    <ResumePreview data={resumeData} designId={designId} />
                  </Suspense>
                  {resumeData.header.qrCodeUrl && resumeData.header.showQrCode !== false && (
                    <div className={`absolute ${qrPos} z-10`}>
                      <ResumeQRCode url={resumeData.header.qrCodeUrl} size={qrSize} />
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
};
