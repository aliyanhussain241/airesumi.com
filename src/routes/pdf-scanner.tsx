import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Camera, FileText, Trash2, Download,
  Plus, MoveUp, MoveDown, RotateCw,
  ScanLine, Sliders, CheckCircle2, ChevronLeft
} from "lucide-react";
import jsPDF from "jspdf";
import { ToolContentSection } from "../app/components/ToolContentSection";
import { PDF_SCANNER_CONTENT } from "../app/components/toolContent";

interface ScannedPage {
  id: string;
  original: string;
  processed: string;
  filter: FilterType;
  rotation: number;
}

type FilterType = "original" | "document" | "grayscale" | "blackwhite" | "enhance";
type ViewMode = "list" | "edit";

const FILTERS: { id: FilterType; label: string; icon: string; desc: string }[] = [
  { id: "original",   label: "Original",  icon: "🌈", desc: "No changes" },
  { id: "document",   label: "Document",  icon: "📄", desc: "Clean scan" },
  { id: "grayscale",  label: "Grayscale", icon: "🩶", desc: "Black & grey" },
  { id: "blackwhite", label: "B&W",       icon: "⬛", desc: "Pure text" },
  { id: "enhance",    label: "Enhanced",  icon: "✨", desc: "Vivid colors" },
];

async function applyFilter(dataUrl: string, filter: FilterType, rotation: number): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const isRotated = rotation === 90 || rotation === 270;
      const W = isRotated ? img.height : img.width;
      const H = isRotated ? img.width  : img.height;
      const maxDim = 1600;
      const scale = Math.min(maxDim / W, maxDim / H, 1);
      const canvas = document.createElement("canvas");
      canvas.width  = Math.round(W * scale);
      canvas.height = Math.round(H * scale);
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      const sw = img.width  * scale;
      const sh = img.height * scale;
      ctx.drawImage(img, -sw / 2, -sh / 2, sw, sh);
      ctx.restore();
      if (filter === "original") { resolve(canvas.toDataURL("image/jpeg", 0.88)); return; }
      const d = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const px = d.data;
      for (let i = 0; i < px.length; i += 4) {
        const r = px[i], g = px[i+1], b = px[i+2];
        if (filter === "grayscale") {
          const v = 0.299*r + 0.587*g + 0.114*b;
          px[i] = px[i+1] = px[i+2] = v;
        } else if (filter === "blackwhite") {
          const v = (0.299*r + 0.587*g + 0.114*b) > 128 ? 255 : 0;
          px[i] = px[i+1] = px[i+2] = v;
        } else if (filter === "document") {
          const gray = 0.299*r + 0.587*g + 0.114*b;
          const v = Math.min(255, Math.max(0, (gray - 128) * 1.45 + 150));
          px[i] = px[i+1] = px[i+2] = v;
        } else if (filter === "enhance") {
          const c = 1.3, br = 15;
          px[i]   = Math.min(255, Math.max(0, (r-128)*c + 128 + br));
          px[i+1] = Math.min(255, Math.max(0, (g-128)*c + 128 + br));
          px[i+2] = Math.min(255, Math.max(0, (b-128)*c + 128 + br));
        }
      }
      ctx.putImageData(d, 0, 0);
      resolve(canvas.toDataURL("image/jpeg", 0.88));
    };
    img.src = dataUrl;
  });
}

function readFile(file: File): Promise<string> {
  return new Promise(resolve => {
    const r = new FileReader();
    r.onload = e => resolve(e.target?.result as string);
    r.readAsDataURL(file);
  });
}

function PDFScanner() {
  const [pages, setPages] = useState<ScannedPage[]>([]);
  const [view, setView] = useState<ViewMode>("list");
  const [editingPage, setEditingPage] = useState<ScannedPage | null>(null);
  const [generating, setGenerating] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [pdfName, setPdfName] = useState("Scanned_Document");
  const cameraRef = useRef<HTMLInputElement>(null);
  const fileRef   = useRef<HTMLInputElement>(null);

  async function addFiles(files: FileList) {
    const newPages: ScannedPage[] = [];
    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) continue;
      const original  = await readFile(file);
      const processed = await applyFilter(original, "document", 0);
      newPages.push({ id: `${Date.now()}_${Math.random()}`, original, processed, filter: "document", rotation: 0 });
    }
    setPages(prev => [...prev, ...newPages]);
    setDone(false);
  }

  async function changeFilter(filter: FilterType) {
    if (!editingPage) return;
    setProcessing(true);
    const processed = await applyFilter(editingPage.original, filter, editingPage.rotation);
    setEditingPage({ ...editingPage, filter, processed });
    setProcessing(false);
  }

  async function rotatePage() {
    if (!editingPage) return;
    setProcessing(true);
    const rot = (editingPage.rotation + 90) % 360;
    const processed = await applyFilter(editingPage.original, editingPage.filter, rot);
    setEditingPage({ ...editingPage, rotation: rot, processed });
    setProcessing(false);
  }

  function saveEdit() {
    if (!editingPage) return;
    setPages(prev => prev.map(p => p.id === editingPage.id ? editingPage : p));
    setEditingPage(null);
    setView("list");
  }

  function removePage(id: string) { setPages(prev => prev.filter(p => p.id !== id)); setDone(false); }

  function movePage(id: string, dir: "up"|"down") {
    setPages(prev => {
      const idx = prev.findIndex(p => p.id === id);
      const arr = [...prev];
      const swap = dir === "up" ? idx-1 : idx+1;
      if (swap < 0 || swap >= arr.length) return prev;
      [arr[idx], arr[swap]] = [arr[swap], arr[idx]];
      return arr;
    });
  }

  async function generatePDF() {
    if (!pages.length) return;
    setGenerating(true);
    try {
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const PW = pdf.internal.pageSize.getWidth();
      const PH = pdf.internal.pageSize.getHeight();
      for (let i = 0; i < pages.length; i++) {
        if (i > 0) pdf.addPage();
        const img = new Image();
        await new Promise<void>(res => { img.onload = () => res(); img.src = pages[i].processed; });
        const ratio = Math.min(PW / img.naturalWidth, PH / img.naturalHeight);
        const w = img.naturalWidth * ratio, h = img.naturalHeight * ratio;
        pdf.addImage(pages[i].processed, "JPEG", (PW-w)/2, (PH-h)/2, w, h);
      }
      pdf.save(`${pdfName.trim() || "Scanned_Document"}.pdf`);
      setDone(true);
    } catch(e) { console.error(e); }
    finally { setGenerating(false); }
  }

  // ── EDIT VIEW ──────────────────────────────────────────────────────────────
  if (view === "edit" && editingPage) return (
    <div className="min-h-screen bg-[#0f1117] pt-[68px] flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 bg-[#1e2433] border-b border-[#2d3748]">
        <button onClick={() => { setEditingPage(null); setView("list"); }}
          className="flex items-center gap-2 text-[14px] text-gray-300 cursor-pointer bg-transparent border-none">
          <ChevronLeft size={18} /> Back
        </button>
        <span className="text-[14px] font-semibold text-white">Edit Page</span>
        <button onClick={saveEdit} className="text-[14px] font-bold text-[#FF6321] cursor-pointer bg-transparent border-none">
          Save ✓
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 relative min-h-[50vh]">
        {processing && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10 rounded-xl">
            <RotateCw size={30} className="animate-spin text-[#FF6321]" />
          </div>
        )}
        <img src={editingPage.processed} alt="Preview"
          className="max-w-full max-h-[55vh] rounded-xl shadow-2xl object-contain" />
      </div>

      <div className="bg-[#1e2433] border-t border-[#2d3748] p-4 pb-8">
        <div className="flex justify-center mb-5">
          <button onClick={rotatePage}
            className="flex items-center gap-2 text-[13px] font-medium text-gray-300 border border-[#2d3748] px-5 py-2.5 rounded-xl hover:border-[#FF6321] hover:text-[#FF6321] transition-all cursor-pointer bg-transparent">
            <RotateCw size={15} /> Rotate 90°
          </button>
        </div>
        <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-3 text-center">Filter</p>
        <div className="flex gap-2 justify-center flex-wrap">
          {FILTERS.map(f => (
            <button key={f.id} onClick={() => changeFilter(f.id)}
              className={`flex flex-col items-center gap-1.5 px-4 py-3 rounded-xl border transition-all cursor-pointer ${
                editingPage.filter === f.id ? "border-[#FF6321] bg-[#FF6321]/15" : "border-[#2d3748] bg-[#252d3d] hover:border-[#FF6321]/50"
              }`}>
              <span className="text-[22px]">{f.icon}</span>
              <span className={`text-[11px] font-semibold ${editingPage.filter === f.id ? "text-[#FF6321]" : "text-gray-400"}`}>{f.label}</span>
              <span className="text-[10px] text-gray-600">{f.desc}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // ── MAIN VIEW ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#f9fafb] pt-[68px]">
      <div className="max-w-2xl mx-auto px-4 py-8">

        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-orange-50 text-[#EA580C] text-[13px] font-semibold px-4 py-2 rounded-full mb-4">
            <ScanLine size={15} /> Document Scanner
          </div>
          <h1 className="text-[30px] font-bold text-[#111827] tracking-tight mb-2">
            Scan Documents to <span className="text-[#FF6321]">PDF</span>
          </h1>
          <p className="text-[14px] text-[#6b7280]">Capture → Apply Filter → Download PDF</p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <button onClick={() => cameraRef.current?.click()}
            className="flex flex-col items-center gap-3 bg-[#FF6321] text-white py-6 px-4 rounded-2xl hover:bg-[#ea580c] transition-all active:scale-95 cursor-pointer border-none shadow-lg shadow-orange-500/20">
            <Camera size={28} />
            <div className="text-center">
              <p className="text-[14px] font-bold">Scan Document</p>
              <p className="text-[11px] opacity-80 mt-0.5">Use camera</p>
            </div>
          </button>
          <button onClick={() => fileRef.current?.click()}
            className="flex flex-col items-center gap-3 bg-white text-[#374151] py-6 px-4 rounded-2xl hover:border-[#FF6321] hover:text-[#FF6321] transition-all active:scale-95 cursor-pointer border-2 border-[#e5e7eb]">
            <FileText size={28} />
            <div className="text-center">
              <p className="text-[14px] font-bold">Upload Images</p>
              <p className="text-[11px] text-[#9ca3af] mt-0.5">From gallery</p>
            </div>
          </button>
        </div>

        <input ref={cameraRef} type="file" accept="image/*" capture="environment" multiple
          onChange={e => { if(e.target.files) addFiles(e.target.files); e.target.value=""; }} className="hidden" />
        <input ref={fileRef} type="file" accept="image/*" multiple
          onChange={e => { if(e.target.files) addFiles(e.target.files); e.target.value=""; }} className="hidden" />

        <AnimatePresence>
          {pages.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-[15px] font-bold text-[#111827]">Pages ({pages.length})</h2>
                <button onClick={() => cameraRef.current?.click()}
                  className="flex items-center gap-1.5 text-[12px] font-medium text-[#FF6321] border border-[#FF6321]/30 px-3 py-1.5 rounded-lg hover:bg-orange-50 transition-colors cursor-pointer bg-transparent">
                  <Plus size={13} /> Add Page
                </button>
              </div>
              <div className="space-y-3">
                {pages.map((page, idx) => (
                  <motion.div key={page.id} layout initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                    className="bg-white border border-[#e5e7eb] rounded-xl p-3 flex items-center gap-3">
                    <div className="w-14 h-[72px] rounded-lg overflow-hidden bg-[#f3f4f6] flex-shrink-0">
                      <img src={page.processed} alt={`Page ${idx+1}`} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-[#111827]">Page {idx+1}</p>
                      <p className="text-[11px] text-[#9ca3af] mt-0.5">
                        {FILTERS.find(f => f.id === page.filter)?.icon} {FILTERS.find(f => f.id === page.filter)?.label}
                        {page.rotation > 0 && ` · ${page.rotation}°`}
                      </p>
                      <button onClick={() => { setEditingPage(page); setView("edit"); }}
                        className="flex items-center gap-1 text-[11px] font-semibold text-[#EA580C] mt-1.5 cursor-pointer bg-transparent border-none p-0 hover:underline">
                        <Sliders size={11} /> Edit & Filter
                      </button>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button onClick={() => movePage(page.id, "up")} disabled={idx === 0}
                        className="p-1.5 rounded-lg hover:bg-[#f3f4f6] disabled:opacity-30 cursor-pointer bg-transparent border-none">
                        <MoveUp size={15} className="text-[#6b7280]" />
                      </button>
                      <button onClick={() => movePage(page.id, "down")} disabled={idx === pages.length - 1}
                        className="p-1.5 rounded-lg hover:bg-[#f3f4f6] disabled:opacity-30 cursor-pointer bg-transparent border-none">
                        <MoveDown size={15} className="text-[#6b7280]" />
                      </button>
                      <button onClick={() => removePage(page.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 cursor-pointer bg-transparent border-none">
                        <Trash2 size={15} className="text-red-400" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {pages.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            <div className="bg-white border border-[#e5e7eb] rounded-xl px-4 py-3 flex items-center gap-3">
              <FileText size={16} className="text-[#9ca3af] flex-shrink-0" />
              <input type="text" value={pdfName} onChange={e => setPdfName(e.target.value)}
                placeholder="PDF file name..."
                className="flex-1 text-[14px] text-[#111827] focus:outline-none bg-transparent" />
              <span className="text-[12px] text-[#9ca3af]">.pdf</span>
            </div>

            {!done ? (
              <button onClick={generatePDF} disabled={generating}
                className="w-full flex items-center justify-center gap-2 bg-[#FF6321] text-white font-bold text-[15px] py-4 rounded-2xl hover:bg-[#ea580c] hover:shadow-lg hover:shadow-orange-500/25 hover:-translate-y-0.5 transition-all disabled:opacity-60 border-none cursor-pointer">
                {generating
                  ? <><RotateCw size={18} className="animate-spin" /> Generating PDF...</>
                  : <><Download size={18} /> Download PDF ({pages.length} page{pages.length > 1 ? "s" : ""})</>}
              </button>
            ) : (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="bg-green-50 border border-green-200 rounded-2xl p-5 text-center">
                <CheckCircle2 size={32} className="text-green-500 mx-auto mb-2" />
                <p className="text-[15px] font-bold text-green-700 mb-1">PDF Downloaded! ✅</p>
                <p className="text-[13px] text-green-600 mb-4">{pdfName}.pdf · {pages.length} page{pages.length > 1 ? "s" : ""}</p>
                <div className="flex gap-2 justify-center">
                  <button onClick={generatePDF}
                    className="flex items-center gap-1.5 text-[13px] font-medium px-4 py-2 rounded-xl border border-green-300 text-green-700 hover:bg-green-100 cursor-pointer bg-transparent">
                    <Download size={14} /> Download Again
                  </button>
                  <button onClick={() => { setPages([]); setDone(false); setPdfName("Scanned_Document"); }}
                    className="flex items-center gap-1.5 text-[13px] font-medium px-4 py-2 rounded-xl bg-[#FF6321] text-white hover:bg-[#ea580c] cursor-pointer border-none">
                    <ScanLine size={14} /> New Scan
                  </button>
                </div>
              </motion.div>
            )}
            {!done && (
              <button onClick={() => { setPages([]); setDone(false); }}
                className="w-full py-2.5 text-[13px] font-medium text-[#9ca3af] hover:text-red-400 transition-colors cursor-pointer bg-transparent border-none">
                Clear All Pages
              </button>
            )}
          </motion.div>
        )}

        {pages.length === 0 && (
          <div className="text-center py-10 text-[#9ca3af]">
            <ScanLine size={40} className="mx-auto mb-3 opacity-30" />
            <p className="text-[14px]">Scan or upload document images</p>
            <p className="text-[12px] mt-1">Apply Document · Grayscale · B&W · Enhanced filters</p>
          </div>
        )}

        <div className="mt-8 bg-orange-50 border border-orange-100 rounded-2xl p-4">
          <p className="text-[12px] font-semibold text-[#EA580C] mb-2">📸 Tips for best results:</p>
          <ul className="space-y-1">
            {["Place document on a flat, dark surface","Ensure good even lighting — avoid shadows","Hold camera directly above the document","Use 'Document' filter for clean scans, 'B&W' for text-only docs"].map(tip => (
              <li key={tip} className="text-[12px] text-[#92400e] flex items-start gap-1.5">
                <span className="flex-shrink-0 mt-0.5">→</span> {tip}
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
      { title: "Document Scanner — Scan to PDF on Mobile | airesumi.com" },
      { name: "description", content: "Scan documents with your phone camera and convert to PDF instantly. Apply document filters, reorder pages, and download — no app required." },
      { property: "og:title", content: "Free Mobile Document Scanner — Scan to PDF | airesumi.com" },
      { property: "og:description", content: "Scan documents with your phone camera and create PDF instantly. Free, no app needed." },
      { property: "og:url", content: "https://airesumi.com/pdf-scanner" },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://airesumi.com/og-image.webp" },
      { name: "twitter:title", content: "Free Mobile Document Scanner — Scan to PDF | airesumi.com" },
      { name: "twitter:description", content: "Scan documents with your phone camera and create PDF instantly. Free, no app needed." },
    ],
    links: [{ rel: "canonical", href: "https://airesumi.com/pdf-scanner" }],
  }),
  component: () => (<><PDFScanner /><ToolContentSection {...PDF_SCANNER_CONTENT} /></>),
});
