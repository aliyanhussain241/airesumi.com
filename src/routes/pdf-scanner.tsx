import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useMemo, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Camera, FileText, Trash2, Download, Plus, MoveUp, MoveDown, RotateCw,
  ScanLine, Sliders, CheckCircle2, ChevronLeft, Sun, Contrast, Sparkles,
  FileType2, Layers, Zap, Shield, ImagePlus, GripVertical, Copy, X,
  Crop, ScanSearch, Lock, PenTool, Share2, Type, FileImage, Copy as CopyIcon,
} from "lucide-react";
import jsPDF from "jspdf";
import JSZip from "jszip";
import { ToolContentSection } from "../app/components/ToolContentSection";
import { PDF_SCANNER_CONTENT } from "../app/components/toolContent";

interface Corner { x: number; y: number } // normalized 0..1
interface ScannedPage {
  id: string;
  original: string;      // raw upload
  cropped: string;       // after perspective warp (== original if no crop)
  processed: string;     // after filter/adjust
  filter: FilterType;
  rotation: number;
  brightness: number;
  contrast: number;
  corners: [Corner, Corner, Corner, Corner]; // TL, TR, BR, BL
  ocrText?: string;
}

type FilterType = "original" | "document" | "grayscale" | "blackwhite" | "enhance" | "magic";
type ViewMode = "list" | "edit" | "crop" | "sign";
type PageSize = "a4" | "letter" | "legal" | "fit";
type Quality = "high" | "medium" | "low";
type EditTab = "adjust" | "filter" | "ocr";

const FILTERS: { id: FilterType; label: string; icon: string }[] = [
  { id: "original",   label: "Original",  icon: "🌈" },
  { id: "magic",      label: "Auto",      icon: "✨" },
  { id: "document",   label: "Document",  icon: "📄" },
  { id: "enhance",    label: "Vivid",     icon: "🎨" },
  { id: "grayscale",  label: "Gray",      icon: "🩶" },
  { id: "blackwhite", label: "B&W",       icon: "⬛" },
];

const QUALITY_MAP: Record<Quality, { max: number; jpeg: number; label: string; size: string }> = {
  high:   { max: 2200, jpeg: 0.92, label: "High",   size: "~1–3 MB/pg" },
  medium: { max: 1600, jpeg: 0.85, label: "Medium", size: "~400–900 KB/pg" },
  low:    { max: 1100, jpeg: 0.72, label: "Small",  size: "~150–400 KB/pg" },
};

const PAGE_SIZES: { id: PageSize; label: string; dim: string }[] = [
  { id: "a4",     label: "A4",     dim: "210×297" },
  { id: "letter", label: "Letter", dim: "216×279" },
  { id: "legal",  label: "Legal",  dim: "216×356" },
  { id: "fit",    label: "Fit",    dim: "Image" },
];

const DEFAULT_CORNERS: [Corner, Corner, Corner, Corner] = [
  { x: 0.04, y: 0.04 }, { x: 0.96, y: 0.04 }, { x: 0.96, y: 0.96 }, { x: 0.04, y: 0.96 },
];

// ── Perspective warp: solve 8-param homography, sample bilinearly ─────────
function solveHomography(src: number[][], dst: number[][]) {
  // src, dst: 4 pairs of [x,y]; solves H such that H·src = dst (in homogeneous coords)
  const A: number[][] = [], b: number[] = [];
  for (let i = 0; i < 4; i++) {
    const [x, y] = src[i], [X, Y] = dst[i];
    A.push([x, y, 1, 0, 0, 0, -X*x, -X*y]); b.push(X);
    A.push([0, 0, 0, x, y, 1, -Y*x, -Y*y]); b.push(Y);
  }
  // Gaussian elimination
  const M = A.map((r, i) => [...r, b[i]]);
  const n = 8;
  for (let i = 0; i < n; i++) {
    let maxR = i;
    for (let k = i + 1; k < n; k++) if (Math.abs(M[k][i]) > Math.abs(M[maxR][i])) maxR = k;
    [M[i], M[maxR]] = [M[maxR], M[i]];
    if (Math.abs(M[i][i]) < 1e-10) return null;
    for (let k = i + 1; k < n; k++) {
      const f = M[k][i] / M[i][i];
      for (let j = i; j <= n; j++) M[k][j] -= f * M[i][j];
    }
  }
  const h = new Array(9).fill(0);
  h[8] = 1;
  for (let i = n - 1; i >= 0; i--) {
    let s = M[i][n];
    for (let j = i + 1; j < n; j++) s -= M[i][j] * h[j];
    h[i] = s / M[i][i];
  }
  return h;
}

async function warpImage(srcUrl: string, corners: [Corner, Corner, Corner, Corner], maxDim = 1800): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const iw = img.width, ih = img.height;
      const pts = corners.map(c => [c.x * iw, c.y * ih]);
      // width = avg(top, bottom), height = avg(left, right)
      const dist = (a: number[], b: number[]) => Math.hypot(a[0]-b[0], a[1]-b[1]);
      const W = Math.round((dist(pts[0], pts[1]) + dist(pts[3], pts[2])) / 2);
      const H = Math.round((dist(pts[0], pts[3]) + dist(pts[1], pts[2])) / 2);
      const scale = Math.min(maxDim / Math.max(W, H), 1);
      const outW = Math.max(1, Math.round(W * scale));
      const outH = Math.max(1, Math.round(H * scale));

      // homography: dst(out rect) → src(quad)
      const H_ = solveHomography(
        [[0,0],[outW,0],[outW,outH],[0,outH]],
        pts,
      );
      const src = document.createElement("canvas");
      src.width = iw; src.height = ih;
      const sctx = src.getContext("2d")!;
      sctx.drawImage(img, 0, 0);
      const srcData = sctx.getImageData(0, 0, iw, ih).data;

      const out = document.createElement("canvas");
      out.width = outW; out.height = outH;
      const octx = out.getContext("2d")!;
      const outData = octx.createImageData(outW, outH);
      const od = outData.data;

      if (!H_) { resolve(srcUrl); return; }
      const [a,bH,c,d,e,f,g,h] = H_;
      for (let y = 0; y < outH; y++) {
        for (let x = 0; x < outW; x++) {
          const w = g*x + h*y + 1;
          const sx = (a*x + bH*y + c) / w;
          const sy = (d*x + e*y + f) / w;
          const i = (y * outW + x) * 4;
          if (sx < 0 || sy < 0 || sx >= iw - 1 || sy >= ih - 1) {
            od[i] = od[i+1] = od[i+2] = 255; od[i+3] = 255; continue;
          }
          // bilinear
          const x0 = sx | 0, y0 = sy | 0;
          const dx = sx - x0, dy = sy - y0;
          const idx00 = (y0*iw + x0)*4;
          const idx10 = idx00 + 4;
          const idx01 = idx00 + iw*4;
          const idx11 = idx01 + 4;
          for (let k = 0; k < 3; k++) {
            const v00 = srcData[idx00+k], v10 = srcData[idx10+k];
            const v01 = srcData[idx01+k], v11 = srcData[idx11+k];
            od[i+k] = (v00*(1-dx)*(1-dy) + v10*dx*(1-dy) + v01*(1-dx)*dy + v11*dx*dy) | 0;
          }
          od[i+3] = 255;
        }
      }
      octx.putImageData(outData, 0, 0);
      resolve(out.toDataURL("image/jpeg", 0.92));
    };
    img.src = srcUrl;
  });
}

async function applyFilter(
  dataUrl: string, filter: FilterType, rotation: number,
  brightness = 0, contrast = 0, maxDim = 1600, jpegQ = 0.88,
  watermark?: string,
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
      if (needsPixel) {
        const d = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const px = d.data;
        const cf = (contrast / 50) * 0.6 + 1;
        const bf = brightness * 1.4;

        for (let i = 0; i < px.length; i += 4) {
          let r = px[i], g = px[i+1], b = px[i+2];
          if (filter === "grayscale") {
            const v = 0.299*r + 0.587*g + 0.114*b; r = g = b = v;
          } else if (filter === "blackwhite") {
            const v = (0.299*r + 0.587*g + 0.114*b) > 128 ? 255 : 0; r = g = b = v;
          } else if (filter === "document") {
            const gray = 0.299*r + 0.587*g + 0.114*b;
            const v = Math.min(255, Math.max(0, (gray - 128) * 1.45 + 150));
            r = g = b = v;
          } else if (filter === "enhance") {
            const c = 1.3, br2 = 15;
            r = (r-128)*c + 128 + br2; g = (g-128)*c + 128 + br2; b = (b-128)*c + 128 + br2;
          } else if (filter === "magic") {
            const c = 1.18, br2 = 10;
            r = (r-128)*c + 128 + br2; g = (g-128)*c + 128 + br2; b = (b-128)*c + 128 + br2 + 3;
          }
          r = (r - 128) * cf + 128 + bf;
          g = (g - 128) * cf + 128 + bf;
          b = (b - 128) * cf + 128 + bf;
          px[i]   = Math.min(255, Math.max(0, r));
          px[i+1] = Math.min(255, Math.max(0, g));
          px[i+2] = Math.min(255, Math.max(0, b));
        }
        ctx.putImageData(d, 0, 0);
      }

      if (watermark && watermark.trim()) {
        ctx.save();
        ctx.globalAlpha = 0.18;
        ctx.fillStyle = "#000";
        ctx.font = `bold ${Math.round(canvas.width / 14)}px system-ui, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(-Math.PI / 6);
        ctx.fillText(watermark, 0, 0);
        ctx.restore();
      }

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
  const b64 = dataUrl.split(",")[1] || "";
  return b64.length * 0.75;
}

// Simple heuristic auto-detect: shrink corners toward high-contrast content edges.
async function autoDetectCorners(dataUrl: string): Promise<[Corner, Corner, Corner, Corner]> {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => {
      const w = 200, h = Math.round((img.height / img.width) * 200);
      const c = document.createElement("canvas");
      c.width = w; c.height = h;
      const ctx = c.getContext("2d")!;
      ctx.drawImage(img, 0, 0, w, h);
      const d = ctx.getImageData(0, 0, w, h).data;
      const bright = (x: number, y: number) => {
        const i = (y * w + x) * 4;
        return (d[i] + d[i+1] + d[i+2]) / 3;
      };
      // find first row/col with mean brightness diff > threshold from edge
      const rowMean = (y: number) => { let s = 0; for (let x=0;x<w;x++) s+=bright(x,y); return s/w; };
      const colMean = (x: number) => { let s = 0; for (let y=0;y<h;y++) s+=bright(x,y); return s/h; };
      const base = rowMean(0);
      let top = 0, bot = h-1, left = 0, right = w-1;
      for (let y=0; y<h/2; y++) if (Math.abs(rowMean(y) - base) > 20) { top = y; break; }
      for (let y=h-1; y>h/2; y--) if (Math.abs(rowMean(y) - base) > 20) { bot = y; break; }
      for (let x=0; x<w/2; x++) if (Math.abs(colMean(x) - base) > 20) { left = x; break; }
      for (let x=w-1; x>w/2; x--) if (Math.abs(colMean(x) - base) > 20) { right = x; break; }
      const tx = Math.max(0.01, left / w), ty = Math.max(0.01, top / h);
      const rx = Math.min(0.99, right / w), by = Math.min(0.99, bot / h);
      resolve([{x:tx,y:ty},{x:rx,y:ty},{x:rx,y:by},{x:tx,y:by}]);
    };
    img.src = dataUrl;
  });
}

function PDFScanner() {
  const [pages, setPages] = useState<ScannedPage[]>([]);
  const [view, setView] = useState<ViewMode>("list");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTab, setEditTab] = useState<EditTab>("adjust");
  const [generating, setGenerating] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [processingLabel, setProcessingLabel] = useState("Processing…");
  const [done, setDone] = useState(false);
  const [pdfName, setPdfName] = useState("Scanned_Document");
  const [quality, setQuality] = useState<Quality>("medium");
  const [pageSize, setPageSize] = useState<PageSize>("a4");
  const [password, setPassword] = useState("");
  const [pwEnabled, setPwEnabled] = useState(false);
  const [watermark, setWatermark] = useState("");
  const [wmEnabled, setWmEnabled] = useState(false);
  const [ocrRunning, setOcrRunning] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [dragId, setDragId] = useState<string | null>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const fileRef   = useRef<HTMLInputElement>(null);

  const editingPage = pages.find(p => p.id === editingId) || null;

  const totalBytes = useMemo(
    () => pages.reduce((s, p) => s + estimateSize(p.processed), 0),
    [pages]
  );
  const totalMB = (totalBytes / (1024 * 1024)).toFixed(2);

  const addFiles = useCallback(async (files: FileList | File[]) => {
    const arr = Array.from(files).filter(f => f.type.startsWith("image/"));
    if (!arr.length) return;
    setProcessing(true); setProcessingLabel("Detecting edges…");
    const q = QUALITY_MAP[quality];
    const newPages: ScannedPage[] = [];
    for (const file of arr) {
      const original  = await readFile(file);
      const corners = await autoDetectCorners(original);
      const cropped = await warpImage(original, corners, q.max);
      const processed = await applyFilter(cropped, "magic", 0, 0, 0, q.max, q.jpeg, wmEnabled ? watermark : undefined);
      newPages.push({
        id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        original, cropped, processed, filter: "magic",
        rotation: 0, brightness: 0, contrast: 0, corners,
      });
    }
    setPages(prev => [...prev, ...newPages]);
    setDone(false);
    setProcessing(false);
  }, [quality, watermark, wmEnabled]);

  async function updatePage(id: string, patch: Partial<ScannedPage>, reprocess = true) {
    const target = pages.find(p => p.id === id);
    if (!target) return;
    const merged = { ...target, ...patch };
    if (reprocess) {
      setProcessing(true); setProcessingLabel("Applying…");
      const q = QUALITY_MAP[quality];
      merged.processed = await applyFilter(
        merged.cropped, merged.filter, merged.rotation,
        merged.brightness, merged.contrast, q.max, q.jpeg,
        wmEnabled ? watermark : undefined,
      );
      setProcessing(false);
    }
    setPages(prev => prev.map(p => p.id === id ? merged : p));
  }

  async function applyNewCrop(id: string, corners: [Corner, Corner, Corner, Corner]) {
    const target = pages.find(p => p.id === id);
    if (!target) return;
    setProcessing(true); setProcessingLabel("Cropping…");
    const q = QUALITY_MAP[quality];
    const cropped = await warpImage(target.original, corners, q.max);
    const processed = await applyFilter(
      cropped, target.filter, target.rotation, target.brightness, target.contrast,
      q.max, q.jpeg, wmEnabled ? watermark : undefined,
    );
    setPages(prev => prev.map(p => p.id === id ? { ...p, corners, cropped, processed } : p));
    setProcessing(false);
    setView("edit");
  }

  async function runOCR(id: string) {
    const target = pages.find(p => p.id === id);
    if (!target) return;
    setOcrRunning(true);
    try {
      const Tesseract = (await import("tesseract.js")).default;
      const res = await Tesseract.recognize(target.processed, "eng");
      setPages(prev => prev.map(p => p.id === id ? { ...p, ocrText: res.data.text } : p));
    } catch (e) { console.error(e); }
    finally { setOcrRunning(false); }
  }

  function removePage(id: string) { setPages(p => p.filter(x => x.id !== id)); setDone(false); }
  function duplicatePage(id: string) {
    setPages(p => {
      const idx = p.findIndex(x => x.id === id);
      if (idx < 0) return p;
      const copy = { ...p[idx], id: `${Date.now()}_${Math.random().toString(36).slice(2,8)}` };
      const arr = [...p]; arr.splice(idx + 1, 0, copy); return arr;
    });
  }
  function movePage(id: string, dir: "up"|"down") {
    setPages(prev => {
      const idx = prev.findIndex(p => p.id === id);
      const swap = dir === "up" ? idx-1 : idx+1;
      if (swap < 0 || swap >= prev.length) return prev;
      const arr = [...prev]; [arr[idx], arr[swap]] = [arr[swap], arr[idx]]; return arr;
    });
  }
  function reorder(fromId: string, toId: string) {
    if (fromId === toId) return;
    setPages(prev => {
      const from = prev.findIndex(p => p.id === fromId);
      const to   = prev.findIndex(p => p.id === toId);
      if (from < 0 || to < 0) return prev;
      const arr = [...prev]; const [m] = arr.splice(from, 1); arr.splice(to, 0, m); return arr;
    });
  }

  async function buildPDF(): Promise<{ pdf: jsPDF; blob: Blob } | null> {
    if (!pages.length) return null;
    const format = pageSize === "letter" ? "letter" : pageSize === "legal" ? "legal" : "a4";
    let pdf: jsPDF | null = null;

    for (let i = 0; i < pages.length; i++) {
      const img = new Image();
      await new Promise<void>(res => { img.onload = () => res(); img.src = pages[i].processed; });
      if (pageSize === "fit") {
        const w = img.naturalWidth * 0.264583, h = img.naturalHeight * 0.264583;
        if (i === 0) pdf = new jsPDF({ orientation: w > h ? "landscape" : "portrait", unit: "mm", format: [w, h] });
        else pdf!.addPage([w, h], w > h ? "landscape" : "portrait");
        pdf!.addImage(pages[i].processed, "JPEG", 0, 0, w, h, undefined, "FAST");
      } else {
        if (i === 0) pdf = new jsPDF({ orientation: "portrait", unit: "mm", format });
        else pdf!.addPage();
        const PW = pdf!.internal.pageSize.getWidth();
        const PH = pdf!.internal.pageSize.getHeight();
        const ratio = Math.min(PW / img.naturalWidth, PH / img.naturalHeight);
        const w = img.naturalWidth * ratio, h = img.naturalHeight * ratio;
        pdf!.addImage(pages[i].processed, "JPEG", (PW-w)/2, (PH-h)/2, w, h, undefined, "FAST");
      }
    }
    if (pwEnabled && password.trim()) {
      // jsPDF supports .setEncryption via constructor; use output with encryption
      const out = pdf!.output("arraybuffer");
      // fallback: re-create with encryption
      const pdf2 = new jsPDF({ orientation: "portrait", unit: "mm", format,
        encryption: { userPassword: password, ownerPassword: password,
          userPermissions: ["print", "copy"] } as any });
      // Rebuild pages into encrypted PDF (simpler than mutating)
      for (let i = 0; i < pages.length; i++) {
        const img = new Image();
        await new Promise<void>(res => { img.onload = () => res(); img.src = pages[i].processed; });
        if (pageSize === "fit") {
          const w = img.naturalWidth * 0.264583, h = img.naturalHeight * 0.264583;
          if (i > 0) pdf2.addPage([w, h], w > h ? "landscape" : "portrait");
          else pdf2.deletePage(1), pdf2.addPage([w, h], w > h ? "landscape" : "portrait");
          pdf2.addImage(pages[i].processed, "JPEG", 0, 0, w, h, undefined, "FAST");
        } else {
          if (i > 0) pdf2.addPage();
          const PW = pdf2.internal.pageSize.getWidth();
          const PH = pdf2.internal.pageSize.getHeight();
          const ratio = Math.min(PW / img.naturalWidth, PH / img.naturalHeight);
          const w = img.naturalWidth * ratio, h = img.naturalHeight * ratio;
          pdf2.addImage(pages[i].processed, "JPEG", (PW-w)/2, (PH-h)/2, w, h, undefined, "FAST");
        }
      }
      const blob = pdf2.output("blob");
      return { pdf: pdf2, blob };
      void out;
    }
    const blob = pdf!.output("blob");
    return { pdf: pdf!, blob };
  }

  async function generatePDF() {
    if (!pages.length) return;
    setGenerating(true);
    try {
      const result = await buildPDF();
      if (!result) return;
      const url = URL.createObjectURL(result.blob);
      const a = document.createElement("a");
      a.href = url; a.download = `${pdfName.trim() || "Scanned_Document"}.pdf`;
      a.click(); URL.revokeObjectURL(url);
      setDone(true);
    } catch (e) { console.error(e); }
    finally { setGenerating(false); }
  }

  async function sharePDF() {
    if (!pages.length) return;
    setGenerating(true);
    try {
      const result = await buildPDF();
      if (!result) return;
      const file = new File([result.blob], `${pdfName.trim() || "Scanned_Document"}.pdf`, { type: "application/pdf" });
      const nav = navigator as any;
      if (nav.canShare && nav.canShare({ files: [file] })) {
        await nav.share({ files: [file], title: pdfName });
      } else {
        const url = URL.createObjectURL(result.blob);
        window.open(url, "_blank");
      }
    } catch (e) { console.error(e); }
    finally { setGenerating(false); }
  }

  async function exportJPGZip() {
    if (!pages.length) return;
    setGenerating(true);
    try {
      const zip = new JSZip();
      pages.forEach((p, i) => {
        const b64 = p.processed.split(",")[1];
        zip.file(`page_${String(i+1).padStart(3, "0")}.jpg`, b64, { base64: true });
      });
      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `${pdfName.trim() || "Scanned"}_images.zip`;
      a.click(); URL.revokeObjectURL(url);
    } catch (e) { console.error(e); }
    finally { setGenerating(false); }
  }

  // ────────────────────── CROP VIEW ──────────────────────
  if (view === "crop" && editingPage) {
    return <CropView page={editingPage}
      onCancel={() => setView("edit")}
      onApply={(corners) => applyNewCrop(editingPage.id, corners)}
      processing={processing}
    />;
  }

  // ────────────────────── EDIT VIEW ──────────────────────
  if (view === "edit" && editingPage) return (
    <div className="min-h-screen bg-[#0b0d13] pt-[68px] flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 bg-[#141824]/95 backdrop-blur border-b border-white/5 sticky top-[68px] z-20">
        <button onClick={() => { setEditingId(null); setView("list"); }}
          aria-label="Back to pages"
          className="flex items-center gap-1.5 text-[14px] text-gray-300 cursor-pointer bg-transparent border-none">
          <ChevronLeft size={18} /> Back
        </button>
        <span className="text-[13px] font-semibold text-white flex items-center gap-2">
          <Sliders size={14} className="text-[#FF6321]" /> Edit Page
        </span>
        <button onClick={() => { setEditingId(null); setView("list"); }}
          className="text-[13px] font-bold text-white bg-[#FF6321] px-4 py-1.5 rounded-lg cursor-pointer border-none hover:bg-[#ea580c]">
          Done
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 relative min-h-[38vh]">
        {processing && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-10 gap-2">
            <RotateCw size={28} className="animate-spin text-[#FF6321]" />
            <span className="text-[12px] text-gray-300">{processingLabel}</span>
          </div>
        )}
        <motion.img key={editingPage.processed}
          initial={{ opacity: 0.5, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
          src={editingPage.processed} alt="Page preview"
          className="max-w-full max-h-[45vh] rounded-xl shadow-2xl object-contain ring-1 ring-white/10" />
      </div>

      {/* Toolbar */}
      <div className="bg-[#141824] border-t border-white/5">
        <div className="grid grid-cols-4 border-b border-white/5">
          {([
            ["crop",   Crop,      "Crop",   () => setView("crop")],
            ["adjust", Sliders,   "Adjust", () => setEditTab("adjust")],
            ["filter", Sparkles,  "Filter", () => setEditTab("filter")],
            ["ocr",    ScanSearch,"OCR",    () => setEditTab("ocr")],
          ] as const).map(([id, Icon, label, onClick]) => {
            const active = (id === "crop" ? false : editTab === id);
            return (
              <button key={id} onClick={onClick as any}
                className={`flex flex-col items-center gap-1 py-3 text-[11px] font-semibold cursor-pointer bg-transparent border-none transition-colors ${
                  active ? "text-[#FF6321]" : "text-gray-400 hover:text-white"
                }`}>
                <Icon size={16} /> {label}
              </button>
            );
          })}
        </div>

        <div className="p-4 pb-8 space-y-4">
          {editTab === "adjust" && (
            <>
              <div className="flex justify-center gap-2">
                <button onClick={() => updatePage(editingPage.id, { rotation: (editingPage.rotation + 90) % 360 })}
                  className="flex items-center gap-2 text-[12px] font-medium text-gray-200 border border-white/10 px-4 py-2 rounded-xl hover:border-[#FF6321] hover:text-[#FF6321] cursor-pointer bg-white/5">
                  <RotateCw size={14} /> Rotate 90°
                </button>
                <button onClick={() => updatePage(editingPage.id, { brightness: 0, contrast: 0, rotation: 0 })}
                  className="flex items-center gap-2 text-[12px] font-medium text-gray-400 border border-white/10 px-4 py-2 rounded-xl hover:text-white cursor-pointer bg-white/5">
                  <X size={14} /> Reset
                </button>
              </div>
              <label className="block">
                <span className="flex items-center justify-between text-[11px] font-semibold text-gray-400 mb-1.5">
                  <span className="flex items-center gap-1.5"><Sun size={12} /> Brightness</span>
                  <span className="text-[#FF6321] tabular-nums">{editingPage.brightness > 0 ? "+" : ""}{editingPage.brightness}</span>
                </span>
                <input type="range" min={-50} max={50} value={editingPage.brightness}
                  onChange={e => updatePage(editingPage.id, { brightness: Number(e.target.value) })}
                  className="w-full accent-[#FF6321]" />
              </label>
              <label className="block">
                <span className="flex items-center justify-between text-[11px] font-semibold text-gray-400 mb-1.5">
                  <span className="flex items-center gap-1.5"><Contrast size={12} /> Contrast</span>
                  <span className="text-[#FF6321] tabular-nums">{editingPage.contrast > 0 ? "+" : ""}{editingPage.contrast}</span>
                </span>
                <input type="range" min={-50} max={50} value={editingPage.contrast}
                  onChange={e => updatePage(editingPage.id, { contrast: Number(e.target.value) })}
                  className="w-full accent-[#FF6321]" />
              </label>
            </>
          )}

          {editTab === "filter" && (
            <div className="grid grid-cols-3 gap-2">
              {FILTERS.map(f => (
                <button key={f.id} onClick={() => updatePage(editingPage.id, { filter: f.id })}
                  className={`flex flex-col items-center gap-1 py-3 rounded-xl border cursor-pointer transition-all ${
                    editingPage.filter === f.id
                      ? "border-[#FF6321] bg-[#FF6321]/15"
                      : "border-white/10 bg-white/5 hover:border-white/25"
                  }`}>
                  <span className="text-[22px]">{f.icon}</span>
                  <span className={`text-[11px] font-bold ${editingPage.filter === f.id ? "text-[#FF6321]" : "text-gray-300"}`}>{f.label}</span>
                </button>
              ))}
            </div>
          )}

          {editTab === "ocr" && (
            <div className="space-y-3">
              {!editingPage.ocrText && !ocrRunning && (
                <button onClick={() => runOCR(editingPage.id)}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#FF6321] text-white font-bold text-[13px] cursor-pointer border-none hover:bg-[#ea580c]">
                  <ScanSearch size={16} /> Extract Text (OCR)
                </button>
              )}
              {ocrRunning && (
                <div className="flex items-center justify-center gap-2 py-4 text-[13px] text-gray-300">
                  <RotateCw size={16} className="animate-spin text-[#FF6321]" /> Reading text… (may take 10–30s)
                </div>
              )}
              {editingPage.ocrText && (
                <>
                  <textarea readOnly value={editingPage.ocrText}
                    className="w-full h-40 bg-black/30 border border-white/10 rounded-xl p-3 text-[12px] text-gray-200 font-mono resize-none" />
                  <div className="flex gap-2">
                    <button onClick={() => navigator.clipboard.writeText(editingPage.ocrText!)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-white/10 bg-white/5 text-[12px] text-gray-200 cursor-pointer">
                      <CopyIcon size={13} /> Copy
                    </button>
                    <button onClick={() => runOCR(editingPage.id)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-white/10 bg-white/5 text-[12px] text-gray-200 cursor-pointer">
                      <RotateCw size={13} /> Redo
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // ────────────────────── MAIN VIEW ──────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fff7f2] via-white to-[#f9fafb] dark:from-[#0b0d13] dark:via-[#0b0d13] dark:to-[#0b0d13] pt-[68px]">
      <div className="max-w-3xl mx-auto px-4 py-8 sm:py-10">

        {/* HERO */}
        <div className="text-center mb-8">
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-white dark:bg-white/5 border border-orange-200 dark:border-white/10 text-[#EA580C] text-[12px] font-semibold px-3.5 py-1.5 rounded-full mb-4 shadow-sm">
            <ScanLine size={13} /> Auto-crop · OCR · Password · Watermark
          </motion.div>
          <h1 className="text-[28px] sm:text-[36px] font-bold tracking-tight text-[#111827] dark:text-white mb-3 leading-[1.15]">
            The <span className="bg-gradient-to-r from-[#FF6321] to-[#f97316] bg-clip-text text-transparent">CamScanner</span> Alternative — in Your Browser
          </h1>
          <p className="text-[14px] sm:text-[15px] text-[#6b7280] dark:text-gray-400 max-w-md mx-auto">
            Auto edge detection, 4-corner crop, magic enhance, OCR text extraction, password-protect &amp; watermark — 100% private.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-3 sm:gap-5 text-[11px] text-[#6b7280] dark:text-gray-500">
            <span className="flex items-center gap-1"><Shield size={12} className="text-[#FF6321]" /> On-device</span>
            <span className="flex items-center gap-1"><Zap size={12} className="text-[#FF6321]" /> No sign-up</span>
            <span className="flex items-center gap-1"><ScanSearch size={12} className="text-[#FF6321]" /> Free OCR</span>
          </div>
        </div>

        {/* DROPZONE */}
        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files); }}
          className={`rounded-2xl border-2 border-dashed transition-all mb-5 ${
            dragOver ? "border-[#FF6321] bg-orange-50 dark:bg-[#FF6321]/10" : "border-transparent"
          }`}
        >
          <div className="grid grid-cols-2 gap-3 p-1">
            <button onClick={() => cameraRef.current?.click()}
              className="flex flex-col items-center gap-2.5 bg-gradient-to-br from-[#FF6321] to-[#f97316] text-white py-6 px-4 rounded-2xl hover:shadow-xl hover:shadow-orange-500/30 hover:-translate-y-0.5 transition-all active:scale-95 cursor-pointer border-none">
              <Camera size={26} />
              <div className="text-center">
                <p className="text-[14px] font-bold">Scan</p>
                <p className="text-[11px] opacity-90 mt-0.5">Camera + auto-crop</p>
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
          {dragOver && <p className="text-center pb-3 text-[12px] font-semibold text-[#EA580C]">Drop images to add pages</p>}
        </div>

        {processing && !editingId && (
          <div className="flex items-center justify-center gap-2 py-3 mb-4 text-[12px] text-[#EA580C] bg-orange-50 dark:bg-[#FF6321]/10 rounded-xl">
            <RotateCw size={14} className="animate-spin" /> {processingLabel}
          </div>
        )}

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
                      {page.ocrText && (
                        <span className="absolute bottom-1.5 left-1.5 flex items-center gap-1 bg-green-500/90 text-white text-[9.5px] font-bold px-1.5 py-0.5 rounded">
                          <ScanSearch size={9} /> OCR
                        </span>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-2 gap-1">
                        <button onClick={() => { setEditingId(page.id); setView("crop"); }}
                          className="flex items-center gap-1 text-[10.5px] font-bold text-white bg-black/60 backdrop-blur px-2 py-1 rounded-lg cursor-pointer border-none">
                          <Crop size={10} /> Crop
                        </button>
                        <button onClick={() => { setEditingId(page.id); setEditTab("adjust"); setView("edit"); }}
                          className="flex items-center gap-1 text-[10.5px] font-bold text-white bg-[#FF6321] px-2 py-1 rounded-lg cursor-pointer border-none">
                          <Sliders size={10} /> Edit
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between px-2 py-1.5 border-t border-[#e5e7eb] dark:border-white/10">
                      <div className="flex items-center gap-0.5">
                        <button onClick={() => movePage(page.id, "up")} disabled={idx === 0}
                          aria-label="Move up" className="p-1 rounded hover:bg-[#f3f4f6] dark:hover:bg-white/10 disabled:opacity-30 cursor-pointer bg-transparent border-none">
                          <MoveUp size={13} className="text-[#6b7280] dark:text-gray-400" />
                        </button>
                        <button onClick={() => movePage(page.id, "down")} disabled={idx === pages.length - 1}
                          aria-label="Move down" className="p-1 rounded hover:bg-[#f3f4f6] dark:hover:bg-white/10 disabled:opacity-30 cursor-pointer bg-transparent border-none">
                          <MoveDown size={13} className="text-[#6b7280] dark:text-gray-400" />
                        </button>
                        <button onClick={() => duplicatePage(page.id)}
                          aria-label="Duplicate" className="p-1 rounded hover:bg-[#f3f4f6] dark:hover:bg-white/10 cursor-pointer bg-transparent border-none">
                          <Copy size={13} className="text-[#6b7280] dark:text-gray-400" />
                        </button>
                      </div>
                      <div className="flex items-center gap-1">
                        <GripVertical size={12} className="text-[#d1d5db] dark:text-gray-600" />
                        <button onClick={() => removePage(page.id)}
                          aria-label="Delete" className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-500/10 cursor-pointer bg-transparent border-none">
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

            {/* Password */}
            <div className="bg-white dark:bg-white/5 border border-[#e5e7eb] dark:border-white/10 rounded-xl p-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={pwEnabled} onChange={e => setPwEnabled(e.target.checked)}
                  className="accent-[#FF6321] w-4 h-4" />
                <Lock size={13} className="text-[#FF6321]" />
                <span className="text-[12px] font-bold text-[#111827] dark:text-white">Password Protect PDF</span>
              </label>
              {pwEnabled && (
                <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="Enter password…"
                  className="mt-2 w-full px-3 py-2 bg-transparent border border-[#e5e7eb] dark:border-white/10 rounded-lg text-[13px] text-[#111827] dark:text-white focus:outline-none focus:border-[#FF6321]" />
              )}
            </div>

            {/* Watermark */}
            <div className="bg-white dark:bg-white/5 border border-[#e5e7eb] dark:border-white/10 rounded-xl p-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={wmEnabled} onChange={e => setWmEnabled(e.target.checked)}
                  className="accent-[#FF6321] w-4 h-4" />
                <Type size={13} className="text-[#FF6321]" />
                <span className="text-[12px] font-bold text-[#111827] dark:text-white">Watermark</span>
                <span className="text-[10px] text-[#9ca3af]">(applied on next scan)</span>
              </label>
              {wmEnabled && (
                <input type="text" value={watermark} onChange={e => setWatermark(e.target.value)}
                  placeholder="e.g. CONFIDENTIAL"
                  className="mt-2 w-full px-3 py-2 bg-transparent border border-[#e5e7eb] dark:border-white/10 rounded-lg text-[13px] text-[#111827] dark:text-white focus:outline-none focus:border-[#FF6321]" />
              )}
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
              <>
                <button onClick={generatePDF} disabled={generating}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#FF6321] to-[#f97316] text-white font-bold text-[15px] py-4 rounded-2xl hover:shadow-xl hover:shadow-orange-500/30 hover:-translate-y-0.5 transition-all disabled:opacity-60 border-none cursor-pointer">
                  {generating
                    ? <><RotateCw size={18} className="animate-spin" /> Building PDF…</>
                    : <><Download size={18} /> Download PDF ({pages.length} page{pages.length > 1 ? "s" : ""})</>}
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={sharePDF} disabled={generating}
                    className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-[#e5e7eb] dark:border-white/10 text-[12px] font-semibold text-[#374151] dark:text-gray-300 cursor-pointer bg-transparent hover:border-[#FF6321] hover:text-[#FF6321] disabled:opacity-50">
                    <Share2 size={13} /> Share PDF
                  </button>
                  <button onClick={exportJPGZip} disabled={generating}
                    className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-[#e5e7eb] dark:border-white/10 text-[12px] font-semibold text-[#374151] dark:text-gray-300 cursor-pointer bg-transparent hover:border-[#FF6321] hover:text-[#FF6321] disabled:opacity-50">
                    <FileImage size={13} /> JPG (ZIP)
                  </button>
                </div>
              </>
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
                  <button onClick={sharePDF}
                    className="flex items-center gap-1.5 text-[13px] font-medium px-4 py-2 rounded-xl border border-green-300 dark:border-green-500/30 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-500/10 cursor-pointer bg-transparent">
                    <Share2 size={14} /> Share
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

        {/* EMPTY */}
        {pages.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-center py-8">
            <div className="inline-flex p-4 rounded-2xl bg-orange-50 dark:bg-[#FF6321]/10 mb-3">
              <ScanLine size={32} className="text-[#FF6321]" />
            </div>
            <p className="text-[14px] font-semibold text-[#374151] dark:text-gray-300">No pages yet</p>
            <p className="text-[12px] text-[#9ca3af] dark:text-gray-500 mt-1">Tap Scan or Upload — edges are detected automatically</p>
          </motion.div>
        )}

        {/* FEATURE HIGHLIGHTS */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { i: Crop,        t: "Auto Crop",   d: "Smart edges" },
            { i: ScanSearch,  t: "OCR Text",    d: "Copy any text" },
            { i: Lock,        t: "Password",    d: "Encrypt PDF" },
            { i: PenTool,     t: "Watermark",   d: "Brand pages" },
          ].map(({ i: Icon, t, d }) => (
            <div key={t} className="bg-white dark:bg-white/5 border border-[#e5e7eb] dark:border-white/10 rounded-xl p-3 text-center">
              <div className="inline-flex p-2 rounded-lg bg-orange-50 dark:bg-[#FF6321]/10 mb-1.5">
                <Icon size={16} className="text-[#FF6321]" />
              </div>
              <p className="text-[12px] font-bold text-[#111827] dark:text-white">{t}</p>
              <p className="text-[10.5px] text-[#9ca3af] dark:text-gray-500">{d}</p>
            </div>
          ))}
        </div>

        {/* TIPS */}
        <div className="mt-6 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-[#FF6321]/10 dark:to-amber-500/5 border border-orange-100 dark:border-white/10 rounded-2xl p-4">
          <p className="text-[12px] font-bold text-[#EA580C] mb-2 flex items-center gap-1.5">
            <Sparkles size={13} /> Tips for a crisp scan
          </p>
          <ul className="space-y-1.5">
            {[
              "Place the document on a flat, dark surface for high contrast",
              "Use the Crop tool to fine-tune the 4 corners after scanning",
              "Choose 'Document' filter for printed text, 'B&W' for signatures",
              "Enable watermark before scanning to stamp new pages automatically",
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

// ────────────────────── CROP VIEW COMPONENT ──────────────────────
function CropView({ page, onCancel, onApply, processing }: {
  page: ScannedPage;
  onCancel: () => void;
  onApply: (corners: [Corner, Corner, Corner, Corner]) => void;
  processing: boolean;
}) {
  const [corners, setCorners] = useState<[Corner, Corner, Corner, Corner]>(page.corners);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [box, setBox] = useState({ w: 0, h: 0, offX: 0, offY: 0 });

  useEffect(() => {
    function measure() {
      if (!imgRef.current) return;
      const r = imgRef.current.getBoundingClientRect();
      const wr = wrapRef.current!.getBoundingClientRect();
      setBox({ w: r.width, h: r.height, offX: r.left - wr.left, offY: r.top - wr.top });
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  function handleMove(clientX: number, clientY: number) {
    if (dragIdx === null || !wrapRef.current) return;
    const wr = wrapRef.current.getBoundingClientRect();
    const x = clientX - wr.left - box.offX;
    const y = clientY - wr.top - box.offY;
    const nx = Math.max(0, Math.min(1, x / box.w));
    const ny = Math.max(0, Math.min(1, y / box.h));
    setCorners(prev => {
      const arr = [...prev] as [Corner, Corner, Corner, Corner];
      arr[dragIdx] = { x: nx, y: ny };
      return arr;
    });
  }

  useEffect(() => {
    if (dragIdx === null) return;
    const mm = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
    const tm = (e: TouchEvent) => { const t = e.touches[0]; if (t) handleMove(t.clientX, t.clientY); e.preventDefault(); };
    const up = () => setDragIdx(null);
    window.addEventListener("mousemove", mm);
    window.addEventListener("mouseup", up);
    window.addEventListener("touchmove", tm, { passive: false });
    window.addEventListener("touchend", up);
    return () => {
      window.removeEventListener("mousemove", mm);
      window.removeEventListener("mouseup", up);
      window.removeEventListener("touchmove", tm);
      window.removeEventListener("touchend", up);
    };
  }, [dragIdx, box]);

  async function auto() {
    const c = await autoDetectCorners(page.original);
    setCorners(c);
  }

  const pts = corners.map(c => `${c.x * box.w + box.offX},${c.y * box.h + box.offY}`).join(" ");

  return (
    <div className="min-h-screen bg-[#0b0d13] pt-[68px] flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 bg-[#141824]/95 backdrop-blur border-b border-white/5 sticky top-[68px] z-20">
        <button onClick={onCancel} aria-label="Cancel"
          className="flex items-center gap-1.5 text-[14px] text-gray-300 cursor-pointer bg-transparent border-none">
          <ChevronLeft size={18} /> Cancel
        </button>
        <span className="text-[13px] font-semibold text-white flex items-center gap-2">
          <Crop size={14} className="text-[#FF6321]" /> Adjust Corners
        </span>
        <button onClick={() => onApply(corners)} disabled={processing}
          className="text-[13px] font-bold text-white bg-[#FF6321] px-4 py-1.5 rounded-lg cursor-pointer border-none hover:bg-[#ea580c] disabled:opacity-60">
          Apply
        </button>
      </div>

      <div className="flex-1 p-4 flex flex-col items-center">
        <div ref={wrapRef} className="relative inline-block select-none touch-none">
          <img ref={imgRef} src={page.original} alt="Original"
            onLoad={() => {
              if (!imgRef.current) return;
              const r = imgRef.current.getBoundingClientRect();
              const wr = wrapRef.current!.getBoundingClientRect();
              setBox({ w: r.width, h: r.height, offX: r.left - wr.left, offY: r.top - wr.top });
            }}
            className="max-w-full max-h-[62vh] rounded-lg shadow-2xl object-contain block ring-1 ring-white/10 pointer-events-none" />

          {box.w > 0 && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: "visible" }}>
              <polygon points={pts} fill="rgba(255,99,33,0.18)" stroke="#FF6321" strokeWidth={2} />
              {corners.map((_, i) => {
                const c = corners[i];
                const cx = c.x * box.w + box.offX;
                const cy = c.y * box.h + box.offY;
                return (
                  <g key={i} className="pointer-events-auto"
                    onMouseDown={() => setDragIdx(i)}
                    onTouchStart={() => setDragIdx(i)}
                    style={{ cursor: "grab" }}>
                    <circle cx={cx} cy={cy} r={18} fill="rgba(255,99,33,0.25)" />
                    <circle cx={cx} cy={cy} r={9} fill="#FF6321" stroke="#fff" strokeWidth={2.5} />
                  </g>
                );
              })}
            </svg>
          )}
        </div>

        <div className="mt-4 flex gap-2 flex-wrap justify-center">
          <button onClick={auto}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[12px] font-semibold text-gray-200 hover:border-[#FF6321] hover:text-[#FF6321] cursor-pointer">
            <ScanSearch size={13} /> Auto Detect
          </button>
          <button onClick={() => setCorners(DEFAULT_CORNERS)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[12px] font-semibold text-gray-200 hover:border-[#FF6321] hover:text-[#FF6321] cursor-pointer">
            <X size={13} /> Reset Corners
          </button>
          <button onClick={() => setCorners([{x:0,y:0},{x:1,y:0},{x:1,y:1},{x:0,y:1}])}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[12px] font-semibold text-gray-200 hover:border-[#FF6321] hover:text-[#FF6321] cursor-pointer">
            Full Page
          </button>
        </div>
        <p className="mt-3 text-[11px] text-gray-500 text-center max-w-xs">
          Drag the orange dots to trace the document's edges. We'll straighten and warp it into a perfect rectangle.
        </p>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/pdf-scanner")({
  head: () => ({
    meta: [
      { title: "CamScanner Alternative — Free Online Document Scanner | airesumi.com" },
      { name: "description", content: "Free browser-based CamScanner alternative. Auto edge detection, 4-corner perspective crop, magic enhance, OCR text extraction, password-protect and watermark PDFs — 100% private." },
      { property: "og:title", content: "Free CamScanner Alternative — Scan, OCR & Password-Protect PDFs" },
      { property: "og:description", content: "Auto-crop, OCR, watermark, password-protect. Scan documents to PDF right in your browser." },
      { property: "og:url", content: "https://airesumi.com/pdf-scanner" },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://airesumi.com/api/public/og/pdf-scanner" },
      { name: "twitter:image", content: "https://airesumi.com/api/public/og/pdf-scanner" },
      { name: "twitter:title", content: "Free CamScanner Alternative — Scan to PDF with OCR" },
      { name: "twitter:description", content: "Auto-crop, OCR, password protection — all in your browser." },
    ],
    links: [{ rel: "canonical", href: "https://airesumi.com/pdf-scanner" }],
  }),
  component: () => (<><PDFScanner /><ToolContentSection {...PDF_SCANNER_CONTENT} /></>),
});
