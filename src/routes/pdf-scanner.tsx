import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Camera, Upload, FileText, Trash2, Download,
  Plus, MoveUp, MoveDown, Sparkles, CheckCircle2,
  ScanLine, RotateCw, Image as ImageIcon
} from "lucide-react";
import jsPDF from "jspdf";

interface ScannedPage {
  id: string;
  dataUrl: string;
  name: string;
}

function PDFScanner() {
  const [pages, setPages] = useState<ScannedPage[]>([]);
  const [generating, setGenerating] = useState(false);
  const [done, setDone] = useState(false);
  const [pdfName, setPdfName] = useState("Scanned_Document");
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ✅ Image compress karo — PDF size kam karne ke liye
  async function compressImage(dataUrl: string, quality = 0.82): Promise<string> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        // Max width 1200px for good quality + small size
        const maxW = 1200;
        const scale = img.width > maxW ? maxW / img.width : 1;
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext("2d")!;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = dataUrl;
    });
  }

  // ✅ Files process karo
  async function processFiles(files: FileList) {
    const newPages: ScannedPage[] = [];
    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) continue;
      const dataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
      });
      const compressed = await compressImage(dataUrl);
      newPages.push({
        id: `${Date.now()}_${Math.random()}`,
        dataUrl: compressed,
        name: file.name,
      });
    }
    setPages(prev => [...prev, ...newPages]);
    setDone(false);
  }

  function handleCameraCapture(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files?.length) {
      processFiles(e.target.files);
      e.target.value = "";
    }
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files?.length) {
      processFiles(e.target.files);
      e.target.value = "";
    }
  }

  function removePage(id: string) {
    setPages(prev => prev.filter(p => p.id !== id));
    setDone(false);
  }

  function movePage(id: string, dir: "up" | "down") {
    setPages(prev => {
      const idx = prev.findIndex(p => p.id === id);
      if (idx < 0) return prev;
      const newPages = [...prev];
      const swapIdx = dir === "up" ? idx - 1 : idx + 1;
      if (swapIdx < 0 || swapIdx >= newPages.length) return prev;
      [newPages[idx], newPages[swapIdx]] = [newPages[swapIdx], newPages[idx]];
      return newPages;
    });
  }

  // ✅ PDF generate karo
  async function generatePDF() {
    if (pages.length === 0) return;
    setGenerating(true);

    try {
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();

      for (let i = 0; i < pages.length; i++) {
        if (i > 0) pdf.addPage();

        const img = new Image();
        await new Promise<void>((resolve) => {
          img.onload = () => resolve();
          img.src = pages[i].dataUrl;
        });

        // Fit image to A4 keeping aspect ratio
        const imgW = img.naturalWidth;
        const imgH = img.naturalHeight;
        const ratio = Math.min(pageW / imgW, pageH / imgH);
        const w = imgW * ratio;
        const h = imgH * ratio;
        const x = (pageW - w) / 2;
        const y = (pageH - h) / 2;

        pdf.addImage(pages[i].dataUrl, "JPEG", x, y, w, h);
      }

      pdf.save(`${pdfName.trim() || "Scanned_Document"}.pdf`);
      setDone(true);
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setGenerating(false);
    }
  }

  function reset() {
    setPages([]);
    setDone(false);
    setPdfName("Scanned_Document");
  }

  return (
    <div className="min-h-screen bg-[#f9fafb] pt-[68px]">
      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-orange-50 text-[#EA580C] text-[13px] font-semibold px-4 py-2 rounded-full mb-4">
            <ScanLine size={15} /> PDF Scanner
          </div>
          <h1 className="text-[30px] font-bold text-[#111827] tracking-tight mb-2">
            Scan Documents to <span className="text-[#FF6321]">PDF</span>
          </h1>
          <p className="text-[14px] text-[#6b7280]">
            Take a photo or upload from gallery — instant PDF ready
          </p>
        </div>

        {/* Scan Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {/* Camera Button — mobile pe camera khulta hai */}
          <button
            onClick={() => cameraInputRef.current?.click()}
            className="flex flex-col items-center gap-3 bg-[#FF6321] text-white py-6 px-4 rounded-2xl hover:bg-[#ea580c] transition-all active:scale-95 cursor-pointer border-none shadow-lg shadow-orange-500/25"
          >
            <Camera size={28} />
            <div>
              <p className="text-[14px] font-bold">Camera Scan</p>
              <p className="text-[11px] opacity-80 mt-0.5">Take a photo</p>
            </div>
          </button>

          {/* Gallery/File upload */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center gap-3 bg-white text-[#374151] py-6 px-4 rounded-2xl hover:border-[#FF6321] hover:text-[#FF6321] transition-all active:scale-95 cursor-pointer border-2 border-[#e5e7eb]"
          >
            <ImageIcon size={28} />
            <div>
              <p className="text-[14px] font-bold">Gallery Upload</p>
              <p className="text-[11px] text-[#9ca3af] mt-0.5">Select photos</p>
            </div>
          </button>
        </div>

        {/* Hidden inputs */}
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          multiple
          onChange={handleCameraCapture}
          className="hidden"
        />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileUpload}
          className="hidden"
        />

        {/* Pages list */}
        <AnimatePresence>
          {pages.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-[15px] font-bold text-[#111827]">
                  Pages ({pages.length})
                </h2>
                <button
                  onClick={() => cameraInputRef.current?.click()}
                  className="flex items-center gap-1.5 text-[12px] font-medium text-[#FF6321] border border-[#FF6321]/30 px-3 py-1.5 rounded-lg hover:bg-orange-50 transition-colors cursor-pointer bg-transparent"
                >
                  <Plus size={13} /> Add Page
                </button>
              </div>

              <div className="space-y-3">
                {pages.map((page, idx) => (
                  <motion.div
                    key={page.id}
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="bg-white border border-[#e5e7eb] rounded-xl overflow-hidden flex gap-3 p-3 items-center"
                  >
                    {/* Thumbnail */}
                    <div className="w-14 h-16 rounded-lg overflow-hidden bg-[#f3f4f6] flex-shrink-0">
                      <img src={page.dataUrl} alt={`Page ${idx + 1}`}
                        className="w-full h-full object-cover" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-[#111827]">Page {idx + 1}</p>
                      <p className="text-[11px] text-[#9ca3af] truncate">{page.name}</p>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => movePage(page.id, "up")}
                        disabled={idx === 0}
                        className="p-1.5 rounded-lg hover:bg-[#f3f4f6] disabled:opacity-30 transition-colors cursor-pointer bg-transparent border-none"
                      >
                        <MoveUp size={15} className="text-[#6b7280]" />
                      </button>
                      <button
                        onClick={() => movePage(page.id, "down")}
                        disabled={idx === pages.length - 1}
                        className="p-1.5 rounded-lg hover:bg-[#f3f4f6] disabled:opacity-30 transition-colors cursor-pointer bg-transparent border-none"
                      >
                        <MoveDown size={15} className="text-[#6b7280]" />
                      </button>
                      <button
                        onClick={() => removePage(page.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer bg-transparent border-none"
                      >
                        <Trash2 size={15} className="text-red-400" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* PDF Name + Generate */}
        {pages.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            {/* File name input */}
            <div className="bg-white border border-[#e5e7eb] rounded-xl px-4 py-3 flex items-center gap-3">
              <FileText size={16} className="text-[#9ca3af] flex-shrink-0" />
              <input
                type="text"
                value={pdfName}
                onChange={e => setPdfName(e.target.value)}
                placeholder="Enter PDF name..."
                className="flex-1 text-[14px] text-[#111827] focus:outline-none bg-transparent"
              />
              <span className="text-[12px] text-[#9ca3af]">.pdf</span>
            </div>

            {/* Generate Button */}
            {!done ? (
              <button
                onClick={generatePDF}
                disabled={generating}
                className="w-full flex items-center justify-center gap-2 bg-[#FF6321] text-white font-bold text-[15px] py-4 rounded-2xl hover:bg-[#ea580c] hover:shadow-lg hover:shadow-orange-500/25 hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed border-none cursor-pointer"
              >
                {generating ? (
                  <><RotateCw size={18} className="animate-spin" /> Generating PDF...</>
                ) : (
                  <><Download size={18} /> {pages.length} page{pages.length > 1 ? "s" : ""} PDF — Download</>
                )}
              </button>
            ) : (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="bg-green-50 border border-green-200 rounded-2xl p-5 text-center">
                <CheckCircle2 size={32} className="text-green-500 mx-auto mb-2" />
                <p className="text-[15px] font-bold text-green-700 mb-1">PDF Downloaded Successfully! ✅</p>
                <p className="text-[13px] text-green-600 mb-4">{pdfName}.pdf — {pages.length} page{pages.length > 1 ? "s" : ""}</p>
                <div className="flex gap-2 justify-center">
                  <button onClick={generatePDF}
                    className="flex items-center gap-1.5 text-[13px] font-medium px-4 py-2 rounded-xl border border-green-300 text-green-700 hover:bg-green-100 transition-colors cursor-pointer bg-transparent">
                    <Download size={14} /> Download Again
                  </button>
                  <button onClick={reset}
                    className="flex items-center gap-1.5 text-[13px] font-medium px-4 py-2 rounded-xl bg-[#FF6321] text-white hover:bg-[#ea580c] transition-colors cursor-pointer border-none">
                    <ScanLine size={14} /> New Scan
                  </button>
                </div>
              </motion.div>
            )}

            {/* Reset */}
            {!done && (
              <button onClick={reset}
                className="w-full py-2.5 text-[13px] font-medium text-[#9ca3af] hover:text-red-400 transition-colors cursor-pointer bg-transparent border-none">
                Clear All Pages
              </button>
            )}
          </motion.div>
        )}

        {/* Empty state */}
        {pages.length === 0 && (
          <div className="text-center py-10 text-[#9ca3af]">
            <ScanLine size={40} className="mx-auto mb-3 opacity-30" />
            <p className="text-[14px]">Add pages from camera or gallery</p>
            <p className="text-[12px] mt-1">Multiple pages will be combined into one PDF</p>
          </div>
        )}

        {/* Tips */}
        <div className="mt-8 bg-orange-50 border border-orange-100 rounded-2xl p-4">
          <p className="text-[12px] font-semibold text-[#EA580C] mb-2">📸 Tips for best results:</p>
          <ul className="space-y-1">
            {[
              "Place document on a flat surface",
              "Scan in good lighting",
              "Hold camera directly above the document",
              "You can reorder pages after scanning",
            ].map(tip => (
              <li key={tip} className="text-[12px] text-[#92400e] flex items-start gap-1.5">
                <span className="mt-0.5">→</span> {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/pdf-scanner")({
  head: () => ({
    meta: [
      { title: "PDF Scanner — Scan Documents to PDF | airesumi.com" },
      { name: "description", content: "Scan documents with your mobile camera and create instant PDFs." },
    ],
    links: [{ rel: "canonical", href: "https://airesumi.com/pdf-scanner" }],
  }),
  component: PDFScanner,
});
