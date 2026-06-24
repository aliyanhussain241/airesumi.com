import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { supabase } from "@/integrations/supabase/client";
import {
  PlusCircle, Edit3, Trash2, Eye, EyeOff,
  Save, X, ArrowLeft, BookOpen, AlertCircle, CheckCircle,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image_url: string | null;
  published_at: string | null;
  created_at: string;
  category: string | null;
  read_time: number | null;
  published: boolean;
}

const CATEGORIES = [
  "Career Tips", "Resume Writing", "Interview Prep",
  "Job Search", "AI Tools", "Salary", "Remote Work",
];

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

// ─── Toast ───────────────────────────────────────────────────────────────────

function Toast({ msg, type, onClose }: { msg: string; type: "success" | "error"; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-xl text-[14px] font-semibold text-white
        ${type === "success" ? "bg-green-500" : "bg-red-500"}`}>
      {type === "success" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
      {msg}
    </motion.div>
  );
}

// ─── Editor ──────────────────────────────────────────────────────────────────

const EMPTY: Omit<Post, "id" | "created_at"> = {
  title: "", slug: "", excerpt: "", content: "",
  cover_image_url: "", category: null, read_time: null,
  published: false, published_at: null,
};

function Editor({
  initial, onSave, onCancel,
}: {
  initial: Partial<Post> | null;
  onSave: (data: Omit<Post, "id" | "created_at">) => Promise<void>;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<Omit<Post, "id" | "created_at">>({
    ...EMPTY,
    ...(initial
      ? {
          title: initial.title ?? "",
          slug: initial.slug ?? "",
          excerpt: initial.excerpt ?? "",
          content: initial.content ?? "",
          cover_image_url: initial.cover_image_url ?? "",
          category: initial.category ?? null,
          read_time: initial.read_time ?? null,
          published: initial.published ?? false,
          published_at: initial.published_at ?? null,
        }
      : {}),
  });
  const [saving, setSaving] = useState(false);

  function set(key: keyof typeof form, value: unknown) {
    setForm(f => ({ ...f, [key]: value }));
  }

  function handleTitleChange(v: string) {
    set("title", v);
    if (!initial) set("slug", slugify(v));
  }

  async function handleSave() {
    if (!form.title.trim() || !form.slug.trim() || !form.content.trim()) return;
    setSaving(true);
    const data = {
      ...form,
      published_at: form.published && !form.published_at ? new Date().toISOString() : form.published_at,
    };
    await onSave(data);
    setSaving(false);
  }

  const inputCls = "w-full bg-white/70 backdrop-blur-sm border border-white/60 rounded-xl px-4 py-2.5 text-[14px] text-[#111827] focus:outline-none focus:border-[#FF6321] transition-colors placeholder:text-gray-400";
  const labelCls = "block text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-1.5";

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      className="bg-white/60 backdrop-blur-sm border border-white/60 rounded-3xl p-8 space-y-5">

      {/* Title */}
      <div>
        <label className={labelCls}>Title *</label>
        <input className={inputCls} placeholder="Post title…" value={form.title}
          onChange={e => handleTitleChange(e.target.value)} />
      </div>

      {/* Slug */}
      <div>
        <label className={labelCls}>Slug *</label>
        <input className={inputCls} placeholder="url-friendly-slug" value={form.slug}
          onChange={e => set("slug", slugify(e.target.value))} />
      </div>

      {/* Category + Read time */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Category</label>
          <select className={inputCls} value={form.category ?? ""}
            onChange={e => set("category", e.target.value || null)}>
            <option value="">— none —</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className={labelCls}>Read time (min)</label>
          <input type="number" min={1} className={inputCls} placeholder="auto"
            value={form.read_time ?? ""}
            onChange={e => set("read_time", e.target.value ? Number(e.target.value) : null)} />
        </div>
      </div>

      {/* Cover image */}
      <div>
        <label className={labelCls}>Cover image URL</label>
        <input className={inputCls} placeholder="https://…" value={form.cover_image_url ?? ""}
          onChange={e => set("cover_image_url", e.target.value || null)} />
        {form.cover_image_url && (
          <img src={form.cover_image_url} alt="" className="mt-2 h-28 w-full object-cover rounded-xl" />
        )}
      </div>

      {/* Excerpt */}
      <div>
        <label className={labelCls}>Excerpt</label>
        <textarea rows={2} className={`${inputCls} resize-none`} placeholder="Short summary shown on blog listing…"
          value={form.excerpt ?? ""} onChange={e => set("excerpt", e.target.value)} />
      </div>

      {/* Content */}
      <div>
        <label className={labelCls}>Content * (Markdown / HTML)</label>
        <textarea rows={14} className={`${inputCls} resize-y font-mono text-[13px]`}
          placeholder="Write your article here…"
          value={form.content} onChange={e => set("content", e.target.value)} />
      </div>

      {/* Published toggle */}
      <div className="flex items-center gap-3">
        <button type="button"
          onClick={() => set("published", !form.published)}
          className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${form.published ? "bg-green-500" : "bg-gray-200"}`}>
          <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.published ? "translate-x-5" : ""}`} />
        </button>
        <span className="text-[13px] font-semibold text-gray-600">
          {form.published ? "Published" : "Draft"}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-2 border-t border-white/40">
        <button onClick={onCancel}
          className="flex items-center gap-2 text-[13px] font-semibold text-gray-500 px-4 py-2 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
          <X size={15} /> Cancel
        </button>
        <button onClick={handleSave} disabled={saving || !form.title || !form.slug || !form.content}
          className="flex items-center gap-2 bg-[#EA580C] text-white text-[13px] font-bold px-6 py-2.5 rounded-xl hover:bg-orange-600 transition-colors disabled:opacity-50 cursor-pointer">
          <Save size={15} /> {saving ? "Saving…" : "Save post"}
        </button>
      </div>
    </motion.div>
  );
}

// ─── Post Row ─────────────────────────────────────────────────────────────────

function PostRow({ post, onEdit, onToggle, onDelete }: {
  post: Post;
  onEdit: () => void;
  onToggle: () => void;
  onDelete: () => void;
}) {
  const catColors: Record<string, string> = {
    "Career Tips": "bg-blue-50 text-blue-600",
    "Resume Writing": "bg-orange-50 text-orange-600",
    "Interview Prep": "bg-purple-50 text-purple-600",
    "Job Search": "bg-green-50 text-green-600",
    "AI Tools": "bg-indigo-50 text-indigo-600",
    "Salary": "bg-yellow-50 text-yellow-700",
    "Remote Work": "bg-teal-50 text-teal-600",
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="bg-white/70 backdrop-blur-sm border border-white/60 rounded-2xl px-5 py-4 flex items-center gap-4">
      {post.cover_image_url && (
        <img src={post.cover_image_url} alt="" className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <h3 className="text-[14px] font-bold text-[#111827] truncate">{post.title}</h3>
          {post.category && (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${catColors[post.category] || "bg-gray-50 text-gray-600"}`}>
              {post.category}
            </span>
          )}
        </div>
        <p className="text-[12px] text-gray-400">/{post.slug}</p>
      </div>
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${post.published ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-400"}`}>
          {post.published ? "Live" : "Draft"}
        </span>
        <button onClick={onToggle} title={post.published ? "Unpublish" : "Publish"}
          className="p-2 rounded-xl hover:bg-orange-50 text-gray-400 hover:text-[#EA580C] transition-colors cursor-pointer">
          {post.published ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
        <button onClick={onEdit}
          className="p-2 rounded-xl hover:bg-orange-50 text-gray-400 hover:text-[#EA580C] transition-colors cursor-pointer">
          <Edit3 size={15} />
        </button>
        <button onClick={onDelete}
          className="p-2 rounded-xl hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors cursor-pointer">
          <Trash2 size={15} />
        </button>
      </div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

function AdminBlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"list" | "new" | "edit">("list");
  const [editing, setEditing] = useState<Post | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  function showToast(msg: string, type: "success" | "error" = "success") {
    setToast({ msg, type });
  }

  async function fetchPosts() {
    const { data } = await supabase
      .from("blog_posts")
      .select("id, title, slug, excerpt, content, cover_image_url, published_at, created_at, category, read_time, published")
      .order("created_at", { ascending: false });
    setPosts((data || []) as Post[]);
    setLoading(false);
  }

  useEffect(() => { fetchPosts(); }, []);

  async function handleCreate(data: Omit<Post, "id" | "created_at">) {
    const { error } = await supabase.from("blog_posts").insert([data]);
    if (error) { showToast(error.message, "error"); return; }
    showToast("Post created!");
    setView("list");
    fetchPosts();
  }

  async function handleUpdate(data: Omit<Post, "id" | "created_at">) {
    if (!editing) return;
    const { error } = await supabase.from("blog_posts").update(data).eq("id", editing.id);
    if (error) { showToast(error.message, "error"); return; }
    showToast("Post updated!");
    setView("list");
    setEditing(null);
    fetchPosts();
  }

  async function handleToggle(post: Post) {
    const { error } = await supabase.from("blog_posts").update({
      published: !post.published,
      published_at: !post.published ? new Date().toISOString() : post.published_at,
    }).eq("id", post.id);
    if (error) { showToast(error.message, "error"); return; }
    showToast(post.published ? "Post unpublished" : "Post published!");
    fetchPosts();
  }

  async function handleDelete(post: Post) {
    if (!confirm(`Delete "${post.title}"?`)) return;
    const { error } = await supabase.from("blog_posts").delete().eq("id", post.id);
    if (error) { showToast(error.message, "error"); return; }
    showToast("Post deleted");
    fetchPosts();
  }

  const published = posts.filter(p => p.published).length;
  const drafts = posts.filter(p => !p.published).length;

  return (
    <div style={{ minHeight: "calc(100vh - 68px)" }} className="pt-[68px]">
      <div className="max-w-4xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            {(view === "new" || view === "edit") && (
              <button onClick={() => { setView("list"); setEditing(null); }}
                className="p-2 rounded-xl hover:bg-orange-50 text-gray-400 hover:text-[#EA580C] transition-colors cursor-pointer">
                <ArrowLeft size={18} />
              </button>
            )}
            <div>
              <div className="inline-flex items-center gap-2 bg-orange-50 text-[#EA580C] text-[12px] font-bold px-3 py-1.5 rounded-full mb-1 border border-orange-100">
                <BookOpen size={13} /> Admin
              </div>
              <h1 className="text-[28px] font-bold text-[#111827] leading-tight">
                {view === "list" ? "Blog Posts" : view === "new" ? "New Post" : "Edit Post"}
              </h1>
            </div>
          </div>
          {view === "list" && (
            <button onClick={() => setView("new")}
              className="flex items-center gap-2 bg-[#EA580C] text-white text-[13px] font-bold px-5 py-2.5 rounded-2xl hover:bg-orange-600 transition-colors cursor-pointer shadow-lg shadow-orange-500/20">
              <PlusCircle size={16} /> New Post
            </button>
          )}
        </div>

        {/* Stats */}
        {view === "list" && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: "Total", value: posts.length, color: "text-[#111827]" },
              { label: "Published", value: published, color: "text-green-600" },
              { label: "Drafts", value: drafts, color: "text-gray-400" },
            ].map(s => (
              <div key={s.label} className="bg-white/70 backdrop-blur-sm border border-white/60 rounded-2xl p-5 text-center">
                <div className={`text-[32px] font-bold ${s.color}`}>{s.value}</div>
                <div className="text-[12px] text-gray-400 font-semibold mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Editor */}
        <AnimatePresence mode="wait">
          {(view === "new" || view === "edit") && (
            <Editor
              key={view + editing?.id}
              initial={editing}
              onSave={view === "new" ? handleCreate : handleUpdate}
              onCancel={() => { setView("list"); setEditing(null); }}
            />
          )}
        </AnimatePresence>

        {/* List */}
        {view === "list" && (
          <>
            {loading && (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-white/50 rounded-2xl p-5 animate-pulse h-20" />
                ))}
              </div>
            )}
            {!loading && posts.length === 0 && (
              <div className="text-center py-20 text-gray-400">
                <BookOpen size={40} className="mx-auto mb-3 opacity-30" />
                <p className="text-[15px] mb-4">No posts yet</p>
                <button onClick={() => setView("new")}
                  className="text-[13px] font-bold text-[#EA580C] hover:underline cursor-pointer">
                  Create your first post →
                </button>
              </div>
            )}
            {!loading && posts.length > 0 && (
              <div className="space-y-3">
                {posts.map(post => (
                  <PostRow key={post.id} post={post}
                    onEdit={() => { setEditing(post); setView("edit"); }}
                    onToggle={() => handleToggle(post)}
                    onDelete={() => handleDelete(post)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      </AnimatePresence>
    </div>
  );
}

export const Route = createFileRoute("/admin/blog")({
  component: AdminBlogPage,
});
