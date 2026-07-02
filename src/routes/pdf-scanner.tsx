import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Camera, FileText, Trash2, Download, Plus, MoveUp, MoveDown, RotateCw,
  ScanLine, Sliders, CheckCircle2, ChevronLeft, Sun, Contrast, Sparkles,
  FileType2, Layers, Zap, Shield, ImagePlus, GripVertical, Copy, X,
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
  brightness: number; // -50..50
  contrast: number;   // -50..50
}

type FilterType = "original" | "document" | "grayscale" | "blackwhite" | "enhance" | "magic";
type ViewMode = "list" | "edit";
type PageSize = "a4" | "letter" | "legal" | "fit";
type Quality = "high" | "medium" | "low";

const FILTERS: { id: FilterType; label: string; icon: string; desc: string }[] = [
  { id: "original",   label: "Original",  icon: "🌈", desc: "No changes" },
  { id: "magic",      label: "Auto",      icon: "✨", desc: "Smart enhance" },
  { id: "document",   label: "Document",  icon: "📄", desc: "Clean scan" },
  { id: "enhance",    label: "Vivid",     icon: "🎨", desc: "Rich colors" },
  { id: "grayscale",  label: "Grayscale", icon: "🩶", desc: "Black & grey" },
  { id: "blackwhite", label: "B&W",       icon: "⬛", desc: "Pure text" },
];

const QUALITY_MAP: Record<Quality, { max: number; jpeg: number; label: string; size: string }> = {
  high:   { max: 2200, jpeg: 0.92, label: "High",   size: "~1–3 MB/page" },
  medium: { max: 1600, jpeg: 0.85, label: "Medium", size: "~400–900 KB/page" },
  low:    { max: 1100, jpeg: 0.72, label: "Small",  size: "~150–400 KB/page" },
};

const PAGE_SIZES: { id: PageSize; label: string; dim: string }[] = [
  { id: "a4",     label: "A4",     dim: "210×297" },
  { id: "letter", label: "Letter", dim: "216×279" },
  { id: "legal",  label: "Legal",  dim: "216×356" },
  { id: "fit",    label: "Fit",    dim: "Image size" },
];

async function applyFilter(
  dataUrl: string, filter: FilterType, rotation: number,
  brightness = 0, contrast = 0, maxDim = 1600, jpegQ = 0.88,
): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const isRotated = rotation === 90 || rotation === 270;
      const W = isRotated ? img.height : img.width;
      const H = isRotated ? img.width  : img.height;
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
      const sw = img.width * scale, sh = img.height * scale;
      ctx.drawImage(img, -sw / 2, -sh / 2, sw, sh);
      ctx.restore();

      const needsPixel = filter !== "original" || brightness !== 0 || contrast !== 0;
      if (!needsPixel) { resolve(canvas.toDataURL("image/jpeg", jpegQ)); return; }

      const d = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const px = d.data;
      const cf = (contrast / 50) * 0.6 + 1;   // 0.4..1.6
      const bf = brightness * 1.4;             // -70..70

      for (let i = 0; i < px.length; i += 4) {
        let r = px[i], g = px[i+1], b = px[i+2];
        if (filter === "grayscale") {
          const v = 0.299*r + 0.587*g + 0.114*b;
          r = g = b = v;
        } else if (filter === "blackwhite") {
          const v = (0.299*r + 0.587*g + 0.114*b) > 128 ? 255 : 0;
          r = g = b = v;
        } else if (filter === "document") {
          const gray = 0.299*r + 0.587*g + 0.114*b;
          const v = Math.min(255, Math.max(0, (gray - 128) * 1.45 + 150));
          r = g = b = v;
        } else if (filter === "enhance") {
          const c = 1.3, br2 = 15;
          r = (r-128)*c + 128 + br2;
          g = (g-128)*c + 128 + br2;
          b = (b-128)*c + 128 + br2;
        } else if (filter === "magic") {
          // Smart enhance: mild contrast + white-balance push + shadow lift
          const c = 1.18, br2 = 10;
          r = (r-128)*c + 128 + br2;
          g = (g-128)*c + 128 + br2;
          b = (b-128)*c + 128 + br2 + 3;
        }
        // brightness / contrast tweaks
        r = (r - 128) * cf + 128 + bf;
        g = (g - 128) * cf + 128 + bf;
        b = (b - 128) * cf + 128 + bf;
        px[i]   = Math.min(255, Math.max(0, r));
        px[i+1] = Math.min(255, Math.max(0, g));
        px[i+2] = Math.min(255, Math.max(0, b));
      }
      ctx.putImageData(d, 0, 0);
      resolve(canvas.toDataURL("image/jpeg", jpegQ));
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

function estimateSize(dataUrl: string) {
  // rough: base64 length * 0.75
  const b64 = dataUrl.split(",")[1] || "";
  return b64.length * 0.75;
}

function PDFScanner() {
  const [pages, setPages] = useState<ScannedPage[]>([]);
  const [view, setView] = useState<ViewMode>("list");
  const [editingPage, setEditingPage] = useState<ScannedPage | null>(null);
  const [generating, setGenerating] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [pdfName, setPdfName] = useState("Scanned_Document");
  const [quality, setQuality] = useState<Quality>("medium");
  const [pageSize, setPageSize] = useState<PageSize>("a4");
  const [dragOver, setDragOver] = useState(false);
  const [dragId, setDragId] = useState<string | null>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const fileRef   = useRef<HTMLInputElement>(null);

  const totalBytes = useMemo(
    () => pages.reduce((s, p) => s + estimateSize(p.processed), 0),
    [pages]
  );
  const totalMB = (totalBytes / (1024 * 1024)).toFixed(2);

  const addFiles = useCallback(async (files: FileList | File[]) => {
    const arr = Array.from(files).filter(f => f.type.startsWith("image/"));
    if (!arr.length) return;
    setProcessing(true);
    const q = QUALITY_MAP[quality];
    const newPages: ScannedPage[] = [];
    for (const file of arr) {
      const original  = await readFile(file);
      const processed = await applyFilter(original, "magic", 0, 0, 0, q.max, q.jpeg);
      newPages.push({
        id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        original, processed, filter: "magic", rotation: 0, brightness: 0, contrast: 0,
      });
    }
    setPages(prev => [...prev, ...newPages]);
    setDone(false);
    setProcessing(false);
  }, [quality]);

  async function reprocessEdit(patch: Partial<ScannedPage>) {
    if (!editingPage) return;
    const merged = { ...editingPage, ...patch };
    setEditingPage(merged);
    setProcessing(true);
    const q = QUALITY_MAP[quality];
    const processed = await applyFilter(
      merged.original, merged.filter, merged.rotation,
      merged.brightness, merged.contrast, q.max, q.jpeg,
    );
    setEditingPage({ ...merged, processed });
    setProcessing(false);
  }

  function saveEdit() {
    if (!editingPage) return;
    setPages(prev => prev.map(p => p.id === editingPage.id ? editingPage : p));
    setEditingPage(null); setView("list");
  }

  function removePage(id: string) { setPages(p => p.filter(x => x.id !== id)); setDone(false); }
  function duplicatePage(id: string) {
    setPages(p => {
      const idx = p.findIndex(x => x.id === id);
      if (idx < 0) return p;
      const copy = { ...p[idx], id: `${Date.now()}_${Math.random().toString(36).slice(2,8)}` };
      const arr = [...p];
      arr.splice(idx + 1, 0, copy);
      return arr;
    });
  }
  function movePage(id: string, dir: "up"|"down") {
    setPages(prev => {
      const idx = prev.findIndex(p => p.id === id);
      const swap = dir === "up" ? idx-1 : idx+1;
      if (swap < 0 || swap >= prev.length) return prev;
      const arr = [...prev];
      [arr[idx], arr[swap]] = [arr[swap], arr[idx]];
      return arr;
    });
  }
  function reorder(fromId: string, toId: string) {
    if (fromId === toId) return;
    setPages(prev => {
      const from = prev.findIndex(p => p.id === fromId);
      const to   = prev.findIndex(p => p.id === toId);
      if (from < 0 || to < 0) return prev;
      const arr = [...prev];
      const [m] = arr.splice(from, 1);
      arr.splice(to, 0, m);
      return arr;
    });
  }

  async function generatePDF() {
    if (!pages.length) return;
    setGenerating(true);
    try {
      const format = pageSize === "fit" ? undefined
        : pageSize === "letter" ? "letter"
        : pageSize === "legal"  ? "legal" : "a4";
      let pdf: jsPDF;
      if (format) pdf = new jsPDF({ orientation: "portrait", unit: "mm", format });
      else pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

      for (let i = 0; i < pages.length; i++) {
        const img = new Image();
        await new Promise<void>(res => { img.onload = () => res(); img.src = pages[i].processed; });
        if (pageSize === "fit") {
          const w = img.naturalWidth * 0.264583;  // px→mm at 96dpi
          const h = img.naturalHeight * 0.264583;
          if (i === 0) pdf = new jsPDF({ orientation: w > h ? "landscape" : "portrait", unit: "mm", format: [w, h] });
          else pdf.addPage([w, h], w > h ? "landscape" : "portrait");
          pdf.addImage(pages[i].processed, "JPEG", 0, 0, w, h, undefined, "FAST");
        } else {
          if (i > 0) pdf.addPage();
          const PW = pdf.internal.pageSize.getWidth();
          const PH = pdf.internal.pageSize.getHeight();
          const ratio = Math.min(PW / img.naturalWidth, PH / img.naturalHeight);
          const w = img.naturalWidth * ratio, h = img.naturalHeight * ratio;
          pdf.addImage(pages[i].processed, "JPEG", (PW-w)/2, (PH-h)/2, w, h, undefined, "FAST");
        }
      }
      pdf.save(`${pdfName.trim() || "Scanned_Document"}.pdf`);
      setDone(true);
    } catch (e) { console.error(e); }
    finally { setGenerating(false); }
  }

  // ── EDIT VIEW ────────────────────────────────────────────────────────────
  if (view === "edit" && editingPage) return (
    <div className="min-h-screen bg-[#0b0d13] pt-[68px] flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 bg-[#141824]/95 backdrop-blur border-b border-white/5 sticky top-[68px] z-20">
        <button onClick={() => { setEditingPage(null); setView("list"); }}
          aria-label="Back to pages"
          className="flex items-center gap-1.5 text-[14px] text-gray-300 cursor-pointer bg-transparent border-none">
          <ChevronLeft size={18} /> Back
        </button>
        <span className="text-[13px] font-semibold text-white flex items-center gap-2">
          <Sliders size={14} className="text-[#FF6321]" /> Edit
        </span>
        <button onClick={saveEdit}
          className="text-[13px] font-bold text-white bg-[#FF6321] px-4 py-1.5 rounded-lg cursor-pointer border-none hover:bg-[#ea580c]">
          Done
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 relative min-h-[40vh]">
        {processing && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-10 gap-2">
            <RotateCw size={28} className="animate-spin text-[#FF6321]" />
            <span className="text-[12px] text-gray-300">Applying…</span>
          </div>
        )}
        <motion.img key={editingPage.processed}
          initial={{ opacity: 0.5, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
          src={editingPage.processed} alt="Page preview"
          className="max-w-full max-h-[50vh] rounded-xl shadow-2xl object-contain ring-1 ring-white/10" />
      </div>

      <div className="bg-[#141824] border-t border-white/5 p-4 pb-8 space-y-5">
        {/* Rotate + reset */}
        <div className="flex justify-center gap-2">
          <button onClick={() => reprocessEdit({ rotation: (editingPage.rotation + 90) % 360 })}
            className="flex items-center gap-2 text-[12px] font-medium text-gray-200 border border-white/10 px-4 py-2 rounded-xl hover:border-[#FF6321] hover:text-[#FF6321] cursor-pointer bg-white/5">
            <RotateCw size={14} /> Rotate 90°
          </button>
          <button onClick={() => reprocessEdit({ brightness: 0, contrast: 0, rotation: 0 })}
            className="flex items-center gap-2 text-[12px] font-medium text-gray-400 border border-white/10 px-4 py-2 rounded-xl hover:text-white cursor-pointer bg-white/5">
            <X size={14} /> Reset
          </button>
        </div>

        {/* Sliders */}
        <div className="grid grid-cols-1 gap-3">
          <label className="block">
            <span className="flex items-center justify-between text-[11px] font-semibold text-gray-400 mb-1.5">
              <span className="flex items-center gap-1.5"><Sun size={12} /> Brightness</span>
              <span className="text-[#FF6321] tabular-nums">{editingPage.brightness > 0 ? "+" : ""}{editingPage.brightness}</span>
            </span>
            <input type="range" min={-50} max={50} value={editingPage.brightness}
              onChange={e => reprocessEdit({ brightness: Number(e.target.value) })}
              className="w-full accent-[#FF6321]" />
          </label>
          <label className="block">
            <span className="flex items-center justify-between text-[11px] font-semibold text-gray-400 mb-1.5">
              <span className="flex items-center gap-1.5"><Contrast size={12} /> Contrast</span>
              <span className="text-[#FF6321] tabular-nums">{editingPage.contrast > 0 ? "+" : ""}{editingPage.contrast}</span>
            </span>
            <input type="range" min={-50} max={50} value={editingPage.contrast}
              onChange={e => reprocessEdit({ contrast: Number(e.target.value) })}
              className="w-full accent-[#FF6321]" />
          </label>
        </div>

        {/* Filters */}
        <div>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Filter</p>
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 snap-x">
            {FILTERS.map(f => (
              <button key={f.id} onClick={() => reprocessEdit({ filter: f.id })}
                className={`flex-shrink-0 snap-start flex flex-col items-center gap-1 px-3.5 py-2.5 rounded-xl border transition-all cursor-pointer min-w-[76px] ${
                  editingPage.filter === f.id
                    ? "border-[#FF6321] bg-[#FF6321]/15"
                    : "border-white/10 bg-white/5 hover:border-white/25"
                }`}>
                <span className="text-[20px]">{f.icon}</span>
                <span className={`text-[10.5px] font-bold ${editingPage.filter === f.id ? "text-[#FF6321]" : "text-gray-300"}`}>{f.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // ── MAIN VIEW ────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fff7f2] via-white to-[#f9fafb] dark:from-[#0b0d13] dark:via-[#0b0d13] dark:to-[#0b0d13] pt-[68px]">
      <div className="max-w-3xl mx-auto px-4 py-8 sm:py-10">

        {/* HERO */}
        <div className="text-center mb-8">
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-white dark:bg-white/5 border border-orange-200 dark:border-white/10 text-[#EA580C] text-[12px] font-semibold px-3.5 py-1.5 rounded-full mb-4 shadow-sm">
            <ScanLine size={13} /> Free · No app · Private on-device
          </motion.div>
          <h1 className="text-[28px] sm:text-[36px] font-bold tracking-tight text-[#111827] dark:text-white mb-3 leading-[1.15]">
            Scan Documents to <span className="bg-gradient-to-r from-[#FF6321] to-[#f97316] bg-clip-text text-transparent">Crisp PDF</span>
          </h1>
          <p className="text-[14px] sm:text-[15px] text-[#6b7280] dark:text-gray-400 max-w-md mx-auto">
            Capture with your camera, auto-enhance, reorder pages, and download — all in your browser.
          </p>
          <div className="mt-4 flex justify-center gap-4 sm:gap-6 text-[11px] text-[#6b7280] dark:text-gray-500">
            <span className="flex items-center gap-1"><Shield size={12} className="text-[#FF6321]" /> Files never uploaded</span>
            <span className="flex items-center gap-1"><Zap size={12} className="text-[#FF6321]" /> Instant PDF</span>
          </div>
        </div>

        {/* CTA BUTTONS + DROPZONE */}
        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => {
            e.preventDefault(); setDragOver(false);
            if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
          }}
          className={`rounded-2xl border-2 border-dashed transition-all mb-5 ${
            dragOver
              ? "border-[#FF6321] bg-orange-50 dark:bg-[#FF6321]/10"
              : "border-transparent"
          }`}
        >
          <div className="grid grid-cols-2 gap-3 p-1">
            <button onClick={() => cameraRef.current?.click()}
              className="flex flex-col items-center gap-2.5 bg-gradient-to-br from-[#FF6321] to-[#f97316] text-white py-6 px-4 rounded-2xl hover:shadow-xl hover:shadow-orange-500/30 hover:-translate-y-0.5 transition-all active:scale-95 cursor-pointer border-none">
              <Camera size={26} />
              <div className="text-center">
                <p className="text-[14px] font-bold">Scan</p>
                <p className="text-[11px] opacity-90 mt-0.5">Use camera</p>
              </div>
            </button>
            <button onClick={() => fileRef.current?.click()}
              className="flex flex-col items-center gap-2.5 bg-white dark:bg-white/5 text-[#374151] dark:text-gray-200 py-6 px-4 rounded-2xl hover:border-[#FF6321] hover:text-[#FF6321] transition-all active:scale-95 cursor-pointer border-2 border-[#e5e7eb] dark:border-white/10">
              <ImagePlus size={26} />
              <div className="text-center">
                <p className="text-[14px] font-bold">Upload</p>
                <p className="text-[11px] text-[#9ca3af] dark:text-gray-500 mt-0.5">or drag & drop</p>
              </div>
            </button>
          </div>
          {dragOver && (
            <p className="text-center pb-3 text-[12px] font-semibold text-[#EA580C]">
              Drop images to add pages
            </p>
          )}
        </div>

        <input ref={cameraRef} type="file" accept="image/*" capture="environment" multiple
          onChange={e => { if(e.target.files) addFiles(e.target.files); e.target.value=""; }} className="hidden" />
        <input ref={fileRef} type="file" accept="image/*" multiple
          onChange={e => { if(e.target.files) addFiles(e.target.files); e.target.value=""; }} className="hidden" />

        {/* PAGES */}
        <AnimatePresence>
          {pages.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-[15px] font-bold text-[#111827] dark:text-white flex items-center gap-2">
                  <Layers size={15} className="text-[#FF6321]" /> Pages
                  <span className="text-[12px] font-medium text-[#9ca3af] dark:text-gray-500">
                    {pages.length} · {totalMB} MB
                  </span>
                </h2>
                <button onClick={() => cameraRef.current?.click()}
                  aria-label="Add page"
                  className="flex items-center gap-1.5 text-[12px] font-medium text-[#FF6321] border border-[#FF6321]/30 px-3 py-1.5 rounded-lg hover:bg-orange-50 dark:hover:bg-[#FF6321]/10 cursor-pointer bg-transparent">
                  <Plus size={13} /> Add Page
                </button>
              </div>

              {/* Grid thumbnails */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {pages.map((page, idx) => (
                  <motion.div key={page.id} layout
                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                    draggable
                    onDragStart={() => setDragId(page.id)}
                    onDragOver={e => e.preventDefault()}
                    onDrop={() => { if (dragId) reorder(dragId, page.id); setDragId(null); }}
                    onDragEnd={() => setDragId(null)}
                    className={`group relative bg-white dark:bg-white/5 border rounded-xl overflow-hidden cursor-grab active:cursor-grabbing ${
                      dragId === page.id ? "border-[#FF6321] ring-2 ring-[#FF6321]/40" : "border-[#e5e7eb] dark:border-white/10"
                    }`}
                  >
                    <div className="aspect-[3/4] bg-[#f3f4f6] dark:bg-black/30 relative overflow-hidden">
                      <img src={page.processed} alt={`Page ${idx+1}`} className="w-full h-full object-cover" />
                      <span className="absolute top-1.5 left-1.5 bg-black/70 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                        {idx + 1}
                      </span>
                      <span className="absolute top-1.5 right-1.5 text-[13px] bg-white/85 dark:bg-black/60 rounded px-1 leading-none py-1">
                        {FILTERS.find(f => f.id === page.filter)?.icon}
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-2">
                        <button onClick={() => { setEditingPage(page); setView("edit"); }}
                          className="flex items-center gap-1 text-[11px] font-bold text-white bg-[#FF6321] px-2.5 py-1 rounded-lg cursor-pointer border-none">
                          <Sliders size={11} /> Edit
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between px-2 py-1.5 border-t border-[#e5e7eb] dark:border-white/10">
                      <div className="flex items-center gap-0.5">
                        <button onClick={() => movePage(page.id, "up")} disabled={idx === 0}
                          aria-label="Move up" title="Move up"
                          className="p-1 rounded hover:bg-[#f3f4f6] dark:hover:bg-white/10 disabled:opacity-30 cursor-pointer bg-transparent border-none">
                          <MoveUp size={13} className="text-[#6b7280] dark:text-gray-400" />
                        </button>
                        <button onClick={() => movePage(page.id, "down")} disabled={idx === pages.length - 1}
                          aria-label="Move down" title="Move down"
                          className="p-1 rounded hover:bg-[#f3f4f6] dark:hover:bg-white/10 disabled:opacity-30 cursor-pointer bg-transparent border-none">
                          <MoveDown size={13} className="text-[#6b7280] dark:text-gray-400" />
                        </button>
                        <button onClick={() => duplicatePage(page.id)}
                          aria-label="Duplicate page" title="Duplicate"
                          className="p-1 rounded hover:bg-[#f3f4f6] dark:hover:bg-white/10 cursor-pointer bg-transparent border-none">
                          <Copy size={13} className="text-[#6b7280] dark:text-gray-400" />
                        </button>
                      </div>
                      <div className="flex items-center gap-1">
                        <GripVertical size={12} className="text-[#d1d5db] dark:text-gray-600" />
                        <button onClick={() => removePage(page.id)}
                          aria-label="Delete page" title="Delete"
                          className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-500/10 cursor-pointer bg-transparent border-none">
                          <Trash2 size={13} className="text-red-400" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* EXPORT OPTIONS */}
        {pages.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            {/* Page size */}
            <div className="bg-white dark:bg-white/5 border border-[#e5e7eb] dark:border-white/10 rounded-xl p-3">
              <p className="text-[10px] font-bold text-[#9ca3af] dark:text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <FileType2 size={11} /> Page Size
              </p>
              <div className="grid grid-cols-4 gap-2">
                {PAGE_SIZES.map(s => (
                  <button key={s.id} onClick={() => setPageSize(s.id)}
                    className={`px-2 py-2 rounded-lg text-center transition-all cursor-pointer border ${
                      pageSize === s.id
                        ? "border-[#FF6321] bg-[#FF6321]/10 text-[#EA580C]"
                        : "border-[#e5e7eb] dark:border-white/10 bg-transparent text-[#6b7280] dark:text-gray-400 hover:border-[#FF6321]/40"
                    }`}>
                    <p className="text-[12px] font-bold">{s.label}</p>
                    <p className="text-[9.5px] mt-0.5 opacity-70">{s.dim}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Quality */}
            <div className="bg-white dark:bg-white/5 border border-[#e5e7eb] dark:border-white/10 rounded-xl p-3">
              <p className="text-[10px] font-bold text-[#9ca3af] dark:text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <Sparkles size={11} /> Quality
              </p>
              <div className="grid grid-cols-3 gap-2">
                {(Object.keys(QUALITY_MAP) as Quality[]).map(q => (
                  <button key={q} onClick={() => setQuality(q)}
                    className={`px-2 py-2 rounded-lg text-center transition-all cursor-pointer border ${
                      quality === q
                        ? "border-[#FF6321] bg-[#FF6321]/10 text-[#EA580C]"
                        : "border-[#e5e7eb] dark:border-white/10 bg-transparent text-[#6b7280] dark:text-gray-400 hover:border-[#FF6321]/40"
                    }`}>
                    <p className="text-[12px] font-bold">{QUALITY_MAP[q].label}</p>
                    <p className="text-[9.5px] mt-0.5 opacity-70">{QUALITY_MAP[q].size}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Filename */}
            <div className="bg-white dark:bg-white/5 border border-[#e5e7eb] dark:border-white/10 rounded-xl px-4 py-3 flex items-center gap-3">
              <FileText size={16} className="text-[#9ca3af] flex-shrink-0" />
              <input type="text" value={pdfName} onChange={e => setPdfName(e.target.value)}
                placeholder="PDF file name..."
                className="flex-1 text-[14px] text-[#111827] dark:text-white focus:outline-none bg-transparent min-w-0" />
              <span className="text-[12px] text-[#9ca3af] flex-shrink-0">.pdf</span>
            </div>

            {!done ? (
              <button onClick={generatePDF} disabled={generating}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#FF6321] to-[#f97316] text-white font-bold text-[15px] py-4 rounded-2xl hover:shadow-xl hover:shadow-orange-500/30 hover:-translate-y-0.5 transition-all disabled:opacity-60 border-none cursor-pointer">
                {generating
                  ? <><RotateCw size={18} className="animate-spin" /> Generating PDF…</>
                  : <><Download size={18} /> Download PDF ({pages.length} page{pages.length > 1 ? "s" : ""})</>}
              </button>
            ) : (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-500/10 dark:to-emerald-500/10 border border-green-200 dark:border-green-500/20 rounded-2xl p-5 text-center">
                <CheckCircle2 size={32} className="text-green-500 mx-auto mb-2" />
                <p className="text-[15px] font-bold text-green-700 dark:text-green-400 mb-1">PDF Downloaded</p>
                <p className="text-[13px] text-green-600 dark:text-green-500 mb-4">{pdfName}.pdf · {pages.length} page{pages.length > 1 ? "s" : ""} · {totalMB} MB</p>
                <div className="flex gap-2 justify-center flex-wrap">
                  <button onClick={generatePDF}
                    className="flex items-center gap-1.5 text-[13px] font-medium px-4 py-2 rounded-xl border border-green-300 dark:border-green-500/30 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-500/10 cursor-pointer bg-transparent">
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
                className="w-full py-2.5 text-[12px] font-medium text-[#9ca3af] hover:text-red-400 transition-colors cursor-pointer bg-transparent border-none">
                Clear All Pages
              </button>
            )}
          </motion.div>
        )}

        {/* EMPTY STATE */}
        {pages.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-center py-8">
            <div className="inline-flex p-4 rounded-2xl bg-orange-50 dark:bg-[#FF6321]/10 mb-3">
              <ScanLine size={32} className="text-[#FF6321]" />
            </div>
            <p className="text-[14px] font-semibold text-[#374151] dark:text-gray-300">No pages yet</p>
            <p className="text-[12px] text-[#9ca3af] dark:text-gray-500 mt-1">Tap Scan or Upload to add your first page</p>
          </motion.div>
        )}

        {/* TIPS */}
        <div className="mt-8 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-[#FF6321]/10 dark:to-amber-500/5 border border-orange-100 dark:border-white/10 rounded-2xl p-4">
          <p className="text-[12px] font-bold text-[#EA580C] mb-2 flex items-center gap-1.5">
            <Sparkles size={13} /> Tips for a crisp scan
          </p>
          <ul className="space-y-1.5">
            {[
              "Place the document on a flat, dark surface for high contrast",
              "Ensure even, shadow-free lighting — avoid direct glare",
              "Hold your phone directly above (not tilted) for straight edges",
              "Use 'Document' for printed pages, 'B&W' for text-only, 'Vivid' for photos",
            ].map(tip => (
              <li key={tip} className="text-[12px] text-[#92400e] dark:text-amber-200/80 flex items-start gap-1.5">
                <span className="flex-shrink-0 mt-0.5 text-[#FF6321]">→</span> {tip}
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
      { name: "description", content: "Scan documents with your phone camera and convert to PDF instantly. Auto-enhance, reorder, adjust brightness/contrast, choose page size and quality — no app required." },
      { property: "og:title", content: "Free Mobile Document Scanner — Scan to PDF | airesumi.com" },
      { property: "og:description", content: "Scan, enhance and export PDF in your browser. Free, private, no app needed." },
      { property: "og:url", content: "https://airesumi.com/pdf-scanner" },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://airesumi.com/og-image.webp" },
      { name: "twitter:title", content: "Free Mobile Document Scanner — Scan to PDF | airesumi.com" },
      { name: "twitter:description", content: "Scan, enhance and export PDF in your browser. Free, private, no app needed." },
    ],
    links: [{ rel: "canonical", href: "https://airesumi.com/pdf-scanner" }],
  }),
  component: () => (<><PDFScanner /><ToolContentSection {...PDF_SCANNER_CONTENT} /></>),
});
