import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Plus, FileText, Trash2, Edit3, Download, Clock,
  Briefcase, LayoutGrid, List, Search, AlertCircle,
  Copy, Star, TrendingUp, Sparkles, Filter, ArrowUpDown,
  MoreVertical, Check, X, Pencil, Share2, Archive,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ResumeData, UserData } from "../app/lib/types";
import { ResumePreview, DesignId } from "../app/components/ResumePreview";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import "../app/app.css";

interface SavedResume {
  id: string;
  title: string;
  job_title: string | null;
  company: string | null;
  design_id: DesignId;
  resume_data: ResumeData;
  user_data: UserData | null;
  created_at: string;
  updated_at: string;
}

type SortKey = "recent" | "oldest" | "name" | "company";

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

const DESIGN_COLORS: Record<string, string> = {
  classic: "bg-gray-100 text-gray-600",
  modern: "bg-blue-50 text-blue-600",
  minimal: "bg-stone-100 text-stone-600",
  split: "bg-purple-50 text-purple-600",
  "navy-executive": "bg-blue-100 text-blue-800",
  "green-fresh": "bg-green-50 text-green-700",
  "tech-dark": "bg-gray-800 text-gray-100",
  "gold-luxury": "bg-yellow-50 text-yellow-700",
};

function DesignBadge({ designId }: { designId: DesignId }) {
  const cls = DESIGN_COLORS[designId] ?? "bg-orange-50 text-orange-600";
  return (
    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${cls}`}>
      {designId.replace(/-/g, " ")}
    </span>
  );
}

function StatCard({
  icon: Icon, label, value, hint, tone = "orange",
}: {
  icon: any; label: string; value: string | number; hint?: string;
  tone?: "orange" | "blue" | "green" | "purple";
}) {
  const tones: Record<string, string> = {
    orange: "from-orange-500/10 to-orange-500/0 text-[#FF6321]",
    blue: "from-blue-500/10 to-blue-500/0 text-blue-600",
    green: "from-green-500/10 to-green-500/0 text-green-600",
    purple: "from-purple-500/10 to-purple-500/0 text-purple-600",
  };
  return (
    <div className="relative overflow-hidden bg-white border border-[#e5e7eb] rounded-2xl p-4">
      <div className={`absolute inset-0 bg-gradient-to-br ${tones[tone]} opacity-60 pointer-events-none`} />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#6b7280]">{label}</p>
          <p className="text-[24px] font-bold text-[#111827] mt-1 leading-none">{value}</p>
          {hint && <p className="text-[11px] text-[#9ca3af] mt-1.5">{hint}</p>}
        </div>
        <div className={`w-9 h-9 rounded-xl bg-white/70 backdrop-blur flex items-center justify-center ${tones[tone].split(" ").pop()}`}>
          <Icon size={16} />
        </div>
      </div>
    </div>
  );
}

function ResumeCard({
  resume, onDelete, onEdit, onDownload, onDuplicate, onRename,
  onToggleFav, isFav, downloading, selected, onSelect,
}: {
  resume: SavedResume;
  onDelete: (id: string) => void;
  onEdit: (resume: SavedResume) => void;
  onDownload: (resume: SavedResume) => void;
  onDuplicate: (resume: SavedResume) => void;
  onRename: (id: string, title: string) => void;
  onToggleFav: (id: string) => void;
  isFav: boolean;
  downloading: boolean;
  selected: boolean;
  onSelect: (id: string) => void;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [draft, setDraft] = useState(resume.title);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const h = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [menuOpen]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className={`relative bg-white border rounded-2xl overflow-hidden hover:shadow-lg hover:shadow-orange-500/5 transition-all group ${
        selected ? "border-[#FF6321] ring-2 ring-[#FF6321]/20" : "border-[#e5e7eb] hover:border-[#FF6321]/40"
      }`}
    >
      {/* Select checkbox */}
      <button
        onClick={() => onSelect(resume.id)}
        className={`absolute top-2 left-2 z-20 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
          selected
            ? "bg-[#FF6321] border-[#FF6321] text-white opacity-100"
            : "bg-white/90 border-[#d1d5db] opacity-0 group-hover:opacity-100 hover:border-[#FF6321]"
        }`}
        aria-label="Select resume"
      >
        {selected && <Check size={14} />}
      </button>

      {/* Favorite */}
      <button
        onClick={() => onToggleFav(resume.id)}
        className={`absolute top-2 left-10 z-20 w-6 h-6 rounded-md flex items-center justify-center transition-all ${
          isFav ? "text-yellow-500 opacity-100" : "text-[#9ca3af] opacity-0 group-hover:opacity-100 hover:text-yellow-500"
        }`}
        aria-label="Favorite"
      >
        <Star size={15} fill={isFav ? "currentColor" : "none"} />
      </button>

      {/* Mini Resume Preview */}
      <div className="relative h-[180px] bg-[#f9fafb] overflow-hidden border-b border-[#e5e7eb]">
        <div
          className="absolute inset-0 origin-top-left pointer-events-none"
          style={{ transform: "scale(0.22)", width: "850px", height: "1100px" }}
        >
          <ResumePreview data={resume.resume_data} designId={resume.design_id} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#f9fafb]/60" />
        <div className="absolute top-2 right-2">
          <DesignBadge designId={resume.design_id} />
        </div>
      </div>

      {/* Card Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          {renaming ? (
            <div className="flex-1 flex gap-1">
              <input
                autoFocus
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") { onRename(resume.id, draft.trim() || resume.title); setRenaming(false); }
                  if (e.key === "Escape") { setDraft(resume.title); setRenaming(false); }
                }}
                className="flex-1 min-w-0 text-[14px] font-bold px-2 py-1 border border-[#FF6321] rounded-md focus:outline-none"
              />
              <button
                onClick={() => { onRename(resume.id, draft.trim() || resume.title); setRenaming(false); }}
                className="p-1 text-green-600 hover:bg-green-50 rounded"
              ><Check size={14} /></button>
              <button
                onClick={() => { setDraft(resume.title); setRenaming(false); }}
                className="p-1 text-red-500 hover:bg-red-50 rounded"
              ><X size={14} /></button>
            </div>
          ) : (
            <h3
              className="font-bold text-[15px] text-[#111827] truncate mb-1 flex-1 cursor-text"
              onDoubleClick={() => setRenaming(true)}
              title="Double-click to rename"
            >
              {resume.title}
            </h3>
          )}

          {!renaming && (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="p-1 text-[#9ca3af] hover:text-[#374151] hover:bg-gray-50 rounded transition-colors"
                aria-label="More actions"
              >
                <MoreVertical size={14} />
              </button>
              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="absolute right-0 top-full mt-1 w-40 bg-white border border-[#e5e7eb] rounded-lg shadow-xl z-30 py-1"
                  >
                    <MenuItem icon={Pencil} onClick={() => { setRenaming(true); setMenuOpen(false); }}>Rename</MenuItem>
                    <MenuItem icon={Copy} onClick={() => { onDuplicate(resume); setMenuOpen(false); }}>Duplicate</MenuItem>
                    <MenuItem icon={Share2} onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/resume?id=${resume.id}`);
                      setMenuOpen(false);
                    }}>Copy link</MenuItem>
                    <div className="border-t border-[#e5e7eb] my-1" />
                    <MenuItem icon={Trash2} danger onClick={() => { setConfirmDelete(true); setMenuOpen(false); }}>Delete</MenuItem>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {(resume.job_title || resume.company) && (
          <div className="flex items-center gap-1.5 text-[13px] text-[#6b7280] mb-3">
            <Briefcase size={12} />
            <span className="truncate">
              {[resume.job_title, resume.company].filter(Boolean).join(" @ ")}
            </span>
          </div>
        )}
        <div className="flex items-center gap-1 text-[11px] text-[#9ca3af] mb-4">
          <Clock size={11} />
          <span>Updated {timeAgo(resume.updated_at)}</span>
        </div>

        {confirmDelete ? (
          <div className="flex gap-2">
            <button
              onClick={() => onDelete(resume.id)}
              className="flex-1 py-2 bg-red-500 text-white text-[12px] font-bold rounded-lg hover:bg-red-600 transition-colors"
            >Confirm Delete</button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="flex-1 py-2 border border-[#e5e7eb] text-[12px] font-bold rounded-lg hover:bg-gray-50 transition-colors"
            >Cancel</button>
          </div>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(resume)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-[#FF6321] text-white text-[12px] font-bold rounded-lg hover:bg-[#ea580c] transition-colors"
            >
              <Edit3 size={12} /> Edit
            </button>
            <button
              onClick={() => onDownload(resume)}
              disabled={downloading}
              className="flex items-center justify-center gap-1 py-2 px-3 border border-[#e5e7eb] text-[12px] font-bold rounded-lg hover:border-[#FF6321] hover:text-[#FF6321] transition-colors disabled:opacity-50"
              aria-label="Download PDF"
            >
              {downloading ? (
                <div className="w-3 h-3 border-2 border-[#FF6321] border-t-transparent rounded-full animate-spin" />
              ) : <Download size={12} />}
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function MenuItem({
  icon: Icon, children, onClick, danger,
}: { icon: any; children: React.ReactNode; onClick: () => void; danger?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2 px-3 py-1.5 text-[12px] font-medium text-left transition-colors ${
        danger ? "text-red-600 hover:bg-red-50" : "text-[#374151] hover:bg-gray-50"
      }`}
    >
      <Icon size={12} /> {children}
    </button>
  );
}

const FAV_KEY = "airesumi_fav_resumes";
function loadFavs(): Set<string> {
  try { return new Set(JSON.parse(localStorage.getItem(FAV_KEY) || "[]")); }
  catch { return new Set(); }
}
function saveFavs(s: Set<string>) {
  localStorage.setItem(FAV_KEY, JSON.stringify([...s]));
}

function Dashboard() {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<SavedResume[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [sort, setSort] = useState<SortKey>("recent");
  const [designFilter, setDesignFilter] = useState<string>("all");
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [favs, setFavs] = useState<Set<string>>(new Set());
  const [showFavsOnly, setShowFavsOnly] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setFavs(loadFavs()); }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { navigate({ to: "/login" }); return; }
      fetchResumes(session.user.id);
    });
  }, []);

  // Keyboard shortcut: "/" to focus search
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2400);
  }

  async function fetchResumes(userId: string) {
    setLoading(true);
    const { data, error } = await supabase
      .from("saved_resumes").select("*")
      .eq("user_id", userId).order("updated_at", { ascending: false });
    if (error) setError("Could not load resumes. Please try again.");
    else setResumes(((data as unknown) as SavedResume[]) ?? []);
    setLoading(false);
  }

  async function handleDelete(id: string) {
    const { error } = await supabase.from("saved_resumes").delete().eq("id", id);
    if (!error) {
      setResumes((prev) => prev.filter((r) => r.id !== id));
      setSelected((s) => { const n = new Set(s); n.delete(id); return n; });
      showToast("Resume deleted");
    }
  }

  async function handleBulkDelete() {
    if (selected.size === 0) return;
    const ids = [...selected];
    const { error } = await supabase.from("saved_resumes").delete().in("id", ids);
    if (!error) {
      setResumes((prev) => prev.filter((r) => !selected.has(r.id)));
      setSelected(new Set());
      showToast(`${ids.length} resume${ids.length > 1 ? "s" : ""} deleted`);
    }
  }

  function handleEdit(resume: SavedResume) {
    sessionStorage.setItem("edit_resume", JSON.stringify(resume));
    navigate({ to: "/resume" });
  }

  async function handleRename(id: string, title: string) {
    setResumes((prev) => prev.map((r) => r.id === id ? { ...r, title } : r));
    await supabase.from("saved_resumes")
      .update({ title, updated_at: new Date().toISOString() }).eq("id", id);
    showToast("Renamed");
  }

  async function handleDuplicate(resume: SavedResume) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    const copy = {
      user_id: session.user.id,
      title: `${resume.title} (copy)`,
      job_title: resume.job_title,
      company: resume.company,
      design_id: resume.design_id,
      resume_data: resume.resume_data as any,
      user_data: resume.user_data as any,
      updated_at: new Date().toISOString(),
    };
    const { data, error } = await supabase.from("saved_resumes").insert(copy).select("*").single();
    if (!error && data) {
      setResumes((prev) => [data as unknown as SavedResume, ...prev]);
      showToast("Duplicated");
    }
  }

  function handleToggleFav(id: string) {
    setFavs((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id); else n.add(id);
      saveFavs(n);
      return n;
    });
  }

  function handleSelect(id: string) {
    setSelected((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id); else n.add(id);
      return n;
    });
  }

  async function handleDownload(resume: SavedResume) {
    setDownloadingId(resume.id);
    const container = document.createElement("div");
    container.style.cssText = "position:fixed;left:-9999px;top:0;width:850px;background:white;z-index:-1";
    document.body.appendChild(container);
    const { createRoot } = await import("react-dom/client");
    const { createElement } = await import("react");
    const root = createRoot(container);
    root.render(createElement(ResumePreview, { data: resume.resume_data, designId: resume.design_id }));
    await new Promise((r) => setTimeout(r, 600));
    try {
      const dataUrl = await toPng(container, { pixelRatio: 2, backgroundColor: "#ffffff" });
      const pdf = new jsPDF("p", "pt", "a4");
      const w = pdf.internal.pageSize.getWidth();
      const h = (container.offsetHeight * w) / container.offsetWidth;
      pdf.addImage(dataUrl, "PNG", 0, 0, w, h);
      pdf.save(`${resume.title.replace(/\s+/g, "_")}.pdf`);
      showToast("Downloaded");
    } catch (e) {
      console.error("Download failed", e);
    } finally {
      root.unmount();
      document.body.removeChild(container);
      setDownloadingId(null);
    }
  }

  // Derived data
  const designCounts = useMemo(() => {
    const m: Record<string, number> = {};
    resumes.forEach((r) => { m[r.design_id] = (m[r.design_id] || 0) + 1; });
    return m;
  }, [resumes]);

  const topDesign = useMemo(() => {
    let best: [string, number] = ["—", 0];
    Object.entries(designCounts).forEach(([k, v]) => { if (v > best[1]) best = [k, v]; });
    return best[0];
  }, [designCounts]);

  const thisMonthCount = useMemo(() => {
    const now = new Date();
    return resumes.filter((r) => {
      const d = new Date(r.updated_at);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;
  }, [resumes]);

  const filtered = useMemo(() => {
    let list = resumes.filter((r) =>
      (r.title.toLowerCase().includes(search.toLowerCase()) ||
        r.job_title?.toLowerCase().includes(search.toLowerCase()) ||
        r.company?.toLowerCase().includes(search.toLowerCase()))
    );
    if (designFilter !== "all") list = list.filter((r) => r.design_id === designFilter);
    if (showFavsOnly) list = list.filter((r) => favs.has(r.id));
    switch (sort) {
      case "oldest": list = [...list].sort((a, b) => +new Date(a.updated_at) - +new Date(b.updated_at)); break;
      case "name": list = [...list].sort((a, b) => a.title.localeCompare(b.title)); break;
      case "company":
        list = [...list].sort((a, b) => (a.company || "").localeCompare(b.company || "")); break;
      default: list = [...list].sort((a, b) => +new Date(b.updated_at) - +new Date(a.updated_at));
    }
    return list;
  }, [resumes, search, designFilter, showFavsOnly, favs, sort]);

  const allSelected = filtered.length > 0 && filtered.every((r) => selected.has(r.id));

  return (
    <div className="min-h-screen bg-[#f9fafb] pt-[68px]">
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-[28px] font-bold text-[#111827] tracking-tight">My Resumes</h1>
            <p className="text-[14px] text-[#6b7280] mt-1">
              {resumes.length} resume{resumes.length !== 1 ? "s" : ""} saved · {favs.size} favorited
            </p>
          </div>
          <button
            onClick={() => navigate({ to: "/resume" })}
            className="flex items-center gap-2 bg-[#FF6321] text-white px-5 py-2.5 rounded-xl font-bold text-[14px] hover:bg-[#ea580c] hover:shadow-lg hover:shadow-orange-500/25 hover:-translate-y-0.5 transition-all"
          >
            <Plus size={16} /> New Resume
          </button>
        </div>

        {/* Stats */}
        {!loading && resumes.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            <StatCard icon={FileText} label="Total resumes" value={resumes.length} tone="orange" />
            <StatCard icon={TrendingUp} label="Updated this month" value={thisMonthCount} tone="green" />
            <StatCard icon={Sparkles} label="Top design" value={topDesign.replace(/-/g, " ")} tone="purple" />
            <StatCard icon={Star} label="Favorites" value={favs.size} tone="blue" />
          </div>
        )}

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search resumes... ( / )"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#e5e7eb] rounded-xl text-[14px] focus:outline-none focus:border-[#FF6321] transition-colors"
            />
          </div>

          {/* Sort */}
          <div className="relative">
            <ArrowUpDown size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af] pointer-events-none" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="appearance-none pl-8 pr-8 py-2.5 bg-white border border-[#e5e7eb] rounded-xl text-[13px] font-medium focus:outline-none focus:border-[#FF6321] cursor-pointer"
            >
              <option value="recent">Recent</option>
              <option value="oldest">Oldest</option>
              <option value="name">Name A–Z</option>
              <option value="company">Company</option>
            </select>
          </div>

          {/* Design filter */}
          {Object.keys(designCounts).length > 1 && (
            <div className="relative">
              <Filter size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af] pointer-events-none" />
              <select
                value={designFilter}
                onChange={(e) => setDesignFilter(e.target.value)}
                className="appearance-none pl-8 pr-8 py-2.5 bg-white border border-[#e5e7eb] rounded-xl text-[13px] font-medium focus:outline-none focus:border-[#FF6321] cursor-pointer capitalize"
              >
                <option value="all">All designs</option>
                {Object.entries(designCounts).map(([d, n]) => (
                  <option key={d} value={d}>{d.replace(/-/g, " ")} ({n})</option>
                ))}
              </select>
            </div>
          )}

          {/* Fav toggle */}
          <button
            onClick={() => setShowFavsOnly((v) => !v)}
            className={`flex items-center gap-1.5 px-3 py-2.5 border rounded-xl text-[13px] font-medium transition-colors ${
              showFavsOnly
                ? "bg-yellow-50 border-yellow-300 text-yellow-700"
                : "bg-white border-[#e5e7eb] text-[#6b7280] hover:border-yellow-300"
            }`}
          >
            <Star size={13} fill={showFavsOnly ? "currentColor" : "none"} /> Favorites
          </button>

          <div className="flex items-center gap-1 bg-white border border-[#e5e7eb] rounded-xl p-1 ml-auto">
            <button
              onClick={() => setView("grid")}
              className={`p-2 rounded-lg transition-colors ${view === "grid" ? "bg-[#FF6321] text-white" : "text-[#9ca3af] hover:text-[#374151]"}`}
              aria-label="Grid view"
            ><LayoutGrid size={15} /></button>
            <button
              onClick={() => setView("list")}
              className={`p-2 rounded-lg transition-colors ${view === "list" ? "bg-[#FF6321] text-white" : "text-[#9ca3af] hover:text-[#374151]"}`}
              aria-label="List view"
            ><List size={15} /></button>
          </div>
        </div>

        {/* Bulk action bar */}
        <AnimatePresence>
          {selected.size > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex items-center gap-3 bg-[#111827] text-white rounded-xl px-4 py-3 mb-4 shadow-lg"
            >
              <button
                onClick={() => {
                  if (allSelected) setSelected(new Set());
                  else setSelected(new Set(filtered.map((r) => r.id)));
                }}
                className="flex items-center gap-2 text-[13px] font-medium hover:text-[#FF6321] transition-colors"
              >
                <div className="w-5 h-5 border-2 border-white rounded flex items-center justify-center">
                  {allSelected && <Check size={12} />}
                </div>
                {selected.size} selected
              </button>
              <div className="flex-1" />
              <button
                onClick={handleBulkDelete}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500 hover:bg-red-600 rounded-lg text-[12px] font-bold transition-colors"
              ><Trash2 size={12} /> Delete</button>
              <button
                onClick={() => setSelected(new Set())}
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Clear selection"
              ><X size={14} /></button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* States */}
        {loading && (
          <div className={`grid gap-4 ${view === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"}`}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white border border-[#e5e7eb] rounded-2xl overflow-hidden animate-pulse">
                <div className="h-[180px] bg-gray-100" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-100 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                  <div className="h-8 bg-gray-100 rounded mt-4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-100 text-red-700 rounded-xl px-4 py-3 text-[14px]">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mb-4">
              {search || designFilter !== "all" || showFavsOnly
                ? <Search size={28} className="text-[#FF6321]" />
                : <FileText size={28} className="text-[#FF6321]" />}
            </div>
            <h3 className="text-[18px] font-bold text-[#111827] mb-2">
              {resumes.length === 0 ? "No resumes yet" : "No matches"}
            </h3>
            <p className="text-[14px] text-[#6b7280] mb-6 max-w-xs">
              {resumes.length === 0
                ? "Create your first ATS-optimized resume in minutes"
                : "Try clearing filters or a different search term"}
            </p>
            {resumes.length === 0 ? (
              <button
                onClick={() => navigate({ to: "/resume" })}
                className="flex items-center gap-2 bg-[#FF6321] text-white px-6 py-3 rounded-xl font-bold text-[14px] hover:bg-[#ea580c] transition-colors"
              ><Plus size={16} /> Create your first resume</button>
            ) : (
              <button
                onClick={() => { setSearch(""); setDesignFilter("all"); setShowFavsOnly(false); }}
                className="text-[13px] font-medium text-[#FF6321] hover:underline"
              >Clear filters</button>
            )}
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <AnimatePresence mode="popLayout">
            <motion.div
              className={
                view === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                  : "flex flex-col gap-3"
              }
            >
              {filtered.map((resume) =>
                view === "grid" ? (
                  <ResumeCard
                    key={resume.id}
                    resume={resume}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                    onDownload={handleDownload}
                    onDuplicate={handleDuplicate}
                    onRename={handleRename}
                    onToggleFav={handleToggleFav}
                    isFav={favs.has(resume.id)}
                    downloading={downloadingId === resume.id}
                    selected={selected.has(resume.id)}
                    onSelect={handleSelect}
                  />
                ) : (
                  <motion.div
                    key={resume.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`bg-white border rounded-xl px-5 py-4 flex items-center gap-4 hover:shadow-md hover:shadow-orange-500/5 transition-all ${
                      selected.has(resume.id) ? "border-[#FF6321] ring-2 ring-[#FF6321]/20" : "border-[#e5e7eb] hover:border-[#FF6321]/40"
                    }`}
                  >
                    <button
                      onClick={() => handleSelect(resume.id)}
                      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${
                        selected.has(resume.id)
                          ? "bg-[#FF6321] border-[#FF6321] text-white"
                          : "border-[#d1d5db] hover:border-[#FF6321]"
                      }`}
                    >{selected.has(resume.id) && <Check size={12} />}</button>
                    <button
                      onClick={() => handleToggleFav(resume.id)}
                      className={favs.has(resume.id) ? "text-yellow-500" : "text-[#d1d5db] hover:text-yellow-500"}
                    ><Star size={15} fill={favs.has(resume.id) ? "currentColor" : "none"} /></button>
                    <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText size={18} className="text-[#FF6321]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-[14px] text-[#111827] truncate">{resume.title}</h3>
                      <p className="text-[12px] text-[#9ca3af]">
                        {[resume.job_title, resume.company].filter(Boolean).join(" @ ") || "No job info"} · Updated {timeAgo(resume.updated_at)}
                      </p>
                    </div>
                    <DesignBadge designId={resume.design_id} />
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleEdit(resume)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FF6321] text-white text-[12px] font-bold rounded-lg hover:bg-[#ea580c] transition-colors"
                      ><Edit3 size={12} /> Edit</button>
                      <button
                        onClick={() => handleDuplicate(resume)}
                        className="p-1.5 border border-[#e5e7eb] rounded-lg hover:border-[#FF6321] hover:text-[#FF6321] transition-colors"
                        aria-label="Duplicate"
                      ><Copy size={14} /></button>
                      <button
                        onClick={() => handleDownload(resume)}
                        disabled={downloadingId === resume.id}
                        className="p-1.5 border border-[#e5e7eb] rounded-lg hover:border-[#FF6321] hover:text-[#FF6321] transition-colors disabled:opacity-50"
                        aria-label="Download"
                      >
                        {downloadingId === resume.id ? (
                          <div className="w-3.5 h-3.5 border-2 border-[#FF6321] border-t-transparent rounded-full animate-spin" />
                        ) : <Download size={14} />}
                      </button>
                      <button
                        onClick={() => handleDelete(resume.id)}
                        className="p-1.5 border border-[#e5e7eb] rounded-lg hover:border-red-300 hover:text-red-500 transition-colors"
                        aria-label="Delete"
                      ><Trash2 size={14} /></button>
                    </div>
                  </motion.div>
                )
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#111827] text-white px-4 py-2.5 rounded-xl shadow-2xl text-[13px] font-medium flex items-center gap-2 z-50"
          >
            <Check size={14} className="text-green-400" /> {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { name: "robots", content: "noindex, nofollow" },
      { title: "My Resumes Dashboard | airesumi.com" },
      { name: "description", content: "View, edit, and download all your saved AI-generated resumes in one place." },
      { property: "og:title", content: "My Resumes Dashboard | airesumi.com" },
      { property: "og:description", content: "Manage all your saved resumes in one place." },
      { property: "og:url", content: "https://airesumi.com/dashboard" },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://airesumi.com/og-image.webp" },
      { name: "twitter:title", content: "My Resumes Dashboard | airesumi.com" },
      { name: "twitter:description", content: "Manage all your saved resumes in one place." },
    ],
    links: [{ rel: "canonical", href: "https://airesumi.com/dashboard" }],
  }),
  component: Dashboard,
});
