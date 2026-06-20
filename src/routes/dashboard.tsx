import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Plus, FileText, Trash2, Edit3, Download, Clock,
  Briefcase, LayoutGrid, List, Search, AlertCircle
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ResumeData, UserData } from "../app/lib/types";
import { ResumePreview, DesignId } from "../app/components/ResumePreview";
// FIX #1: Removed top-level toPng and jsPDF imports.
// FIX #3: Removed duplicate "import ../app/app.css" — styles.css in root already covers this.

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

function DesignBadge({ designId }: { designId: DesignId }) {
  const colors: Record<string, string> = {
    classic: "bg-gray-100 text-gray-600",
    modern: "bg-blue-50 text-blue-600",
    minimal: "bg-stone-100 text-stone-600",
    split: "bg-purple-50 text-purple-600",
    "navy-executive": "bg-blue-100 text-blue-800",
    "green-fresh": "bg-green-50 text-green-700",
    "tech-dark": "bg-gray-800 text-gray-100",
    "gold-luxury": "bg-yellow-50 text-yellow-700",
  };
  const cls = colors[designId] ?? "bg-orange-50 text-orange-600";
  return (
    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${cls}`}>
      {designId.replace(/-/g, " ")}
    </span>
  );
}

function ResumeCard({
  resume,
  onDelete,
  onEdit,
  onDownload,
  downloading,
}: {
  resume: SavedResume;
  onDelete: (id: string) => void;
  onEdit: (resume: SavedResume) => void;
  onDownload: (resume: SavedResume) => void;
  downloading: boolean;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className="bg-white border border-[#e5e7eb] rounded-2xl overflow-hidden hover:border-[#FF6321]/40 hover:shadow-lg hover:shadow-orange-500/5 transition-all group"
    >
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
        <h3 className="font-bold text-[15px] text-[#111827] truncate mb-1">{resume.title}</h3>
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

        {/* Actions */}
        {confirmDelete ? (
          <div className="flex gap-2">
            <button
              onClick={() => onDelete(resume.id)}
              className="flex-1 py-2 bg-red-500 text-white text-[12px] font-bold rounded-lg hover:bg-red-600 transition-colors"
            >
              Confirm Delete
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="flex-1 py-2 border border-[#e5e7eb] text-[12px] font-bold rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
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
            >
              <Download size={12} />
            </button>
            <button
              onClick={() => setConfirmDelete(true)}
              className="flex items-center justify-center gap-1 py-2 px-3 border border-[#e5e7eb] text-[12px] rounded-lg hover:border-red-300 hover:text-red-500 transition-colors"
            >
              <Trash2 size={12} />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function Dashboard() {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<SavedResume[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate({ to: "/login" });
        return;
      }
      setUser(session.user);
      fetchResumes(session.user.id);
    });
  }, []);

  async function fetchResumes(userId: string) {
    setLoading(true);
    const { data, error } = await supabase
      .from("saved_resumes")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });

    if (error) {
      setError("Could not load resumes. Please try again.");
    } else {
      setResumes((data as unknown as SavedResume[]) ?? []);
    }
    setLoading(false);
  }

  async function handleDelete(id: string) {
    const { error } = await supabase.from("saved_resumes").delete().eq("id", id);
    if (!error) setResumes((prev) => prev.filter((r) => r.id !== id));
  }

  function handleEdit(resume: SavedResume) {
    sessionStorage.setItem("edit_resume", JSON.stringify(resume));
    navigate({ to: "/resume" });
  }

  // FIX #1: Dynamic import — jsPDF and html-to-image only load when user clicks Download.
  async function handleDownload(resume: SavedResume) {
    setDownloadingId(resume.id);
    const container = document.createElement("div");
    container.style.cssText =
      "position:fixed;left:-9999px;top:0;width:850px;background:white;z-index:-1";
    document.body.appendChild(container);

    const { createRoot } = await import("react-dom/client");
    const { createElement } = await import("react");
    const root = createRoot(container);
    root.render(createElement(ResumePreview, { data: resume.resume_data, designId: resume.design_id }));

    await new Promise((r) => setTimeout(r, 600));

    try {
      const { toPng } = await import("html-to-image");
      const jsPDF = (await import("jspdf")).default;
      const dataUrl = await toPng(container, { pixelRatio: 2, backgroundColor: "#ffffff" });
      const pdf = new jsPDF("p", "pt", "a4");
      const w = pdf.internal.pageSize.getWidth();
      const h = (container.offsetHeight * w) / container.offsetWidth;
      pdf.addImage(dataUrl, "PNG", 0, 0, w, h);
      pdf.save(`${resume.title.replace(/\s+/g, "_")}.pdf`);
    } catch (e) {
      console.error("Download failed", e);
    } finally {
      root.unmount();
      document.body.removeChild(container);
      setDownloadingId(null);
    }
  }

  const filtered = resumes.filter(
    (r) =>
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.job_title?.toLowerCase().includes(search.toLowerCase()) ||
      r.company?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f9fafb] pt-[68px]">
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-[28px] font-bold text-[#111827] tracking-tight">My Resumes</h1>
            <p className="text-[14px] text-[#6b7280] mt-1">
              {resumes.length} resume{resumes.length !== 1 ? "s" : ""} saved
            </p>
          </div>
          <button
            onClick={() => navigate({ to: "/resume" })}
            className="flex items-center gap-2 bg-[#FF6321] text-white px-5 py-2.5 rounded-xl font-bold text-[14px] hover:bg-[#ea580c] hover:shadow-lg hover:shadow-orange-500/25 hover:-translate-y-0.5 transition-all"
          >
            <Plus size={16} /> New Resume
          </button>
        </div>

        {/* Search + View Toggle */}
        <div className="flex gap-3 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]" />
            <input
              type="text"
              placeholder="Search resumes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#e5e7eb] rounded-xl text-[14px] focus:outline-none focus:border-[#FF6321] transition-colors"
            />
          </div>
          <div className="flex items-center gap-1 bg-white border border-[#e5e7eb] rounded-xl p-1">
            <button
              onClick={() => setView("grid")}
              className={`p-2 rounded-lg transition-colors ${view === "grid" ? "bg-[#FF6321] text-white" : "text-[#9ca3af] hover:text-[#374151]"}`}
            >
              <LayoutGrid size={15} />
            </button>
            <button
              onClick={() => setView("list")}
              className={`p-2 rounded-lg transition-colors ${view === "list" ? "bg-[#FF6321] text-white" : "text-[#9ca3af] hover:text-[#374151]"}`}
            >
              <List size={15} />
            </button>
          </div>
        </div>

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
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mb-4">
              <FileText size={28} className="text-[#FF6321]" />
            </div>
            <h3 className="text-[18px] font-bold text-[#111827] mb-2">
              {search ? "No resumes found" : "No resumes yet"}
            </h3>
            <p className="text-[14px] text-[#6b7280] mb-6 max-w-xs">
              {search
                ? "Try a different search term"
                : "Create your first ATS-optimized resume in minutes"}
            </p>
            {!search && (
              <button
                onClick={() => navigate({ to: "/resume" })}
                className="flex items-center gap-2 bg-[#FF6321] text-white px-6 py-3 rounded-xl font-bold text-[14px] hover:bg-[#ea580c] transition-colors"
              >
                <Plus size={16} /> Create your first resume
              </button>
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
                    downloading={downloadingId === resume.id}
                  />
                ) : (
                  <motion.div
                    key={resume.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="bg-white border border-[#e5e7eb] rounded-xl px-5 py-4 flex items-center gap-4 hover:border-[#FF6321]/40 hover:shadow-md hover:shadow-orange-500/5 transition-all"
                  >
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
                      >
                        <Edit3 size={12} /> Edit
                      </button>
                      <button
                        onClick={() => handleDownload(resume)}
                        className="p-1.5 border border-[#e5e7eb] rounded-lg hover:border-[#FF6321] hover:text-[#FF6321] transition-colors"
                      >
                        <Download size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(resume.id)}
                        className="p-1.5 border border-[#e5e7eb] rounded-lg hover:border-red-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </motion.div>
                )
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "My Resumes — Dashboard | airesumi.com" },
      { name: "description", content: "View, edit, and download all your saved resumes." },
    ],
    links: [{ rel: "canonical", href: "https://airesumi.com/dashboard" }],
  }),
  component: Dashboard,
});
