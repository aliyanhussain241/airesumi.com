import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useNavigate, useLocation } from '@tanstack/react-router';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';
import {
  LayoutDashboard, FileText, PenSquare, Eye, Trash2,
  LogOut, Plus, Save, X, Search, ChevronRight, ChevronLeft,
  Image, Tag, Globe, Clock, CheckCircle, AlertCircle,
  BarChart2, BookOpen, Upload, Bold, Italic, List,
  Link, Heading1, Heading2, Quote, Code, AlignLeft,
  TrendingUp, Calendar, Grid3x3, Rows3, ArrowRight, Sparkles, Mail, Flame
} from 'lucide-react';

type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image_url: string | null;
  published: boolean;
  published_at: string | null;
  created_at: string;
  category?: string | null;
  tags?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  read_time?: number | null;
};

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const estimateReadTime = (content: string) =>
  Math.max(1, Math.ceil(content.split(/\s+/).length / 200));

const CATEGORIES = ['Career Tips', 'Resume Writing', 'Interview Prep', 'Job Search', 'AI Tools', 'Salary', 'Remote Work', 'Other'];

// ─── RICH TEXT TOOLBAR ───────────────────────────────────────
const RichToolbar = ({ textareaRef, value, onChange }: {
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  value: string;
  onChange: (v: string) => void;
}) => {
  const wrap = (before: string, after = before) => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = value.slice(start, end) || 'text';
    const newVal = value.slice(0, start) + before + selected + after + value.slice(end);
    onChange(newVal);
    setTimeout(() => { el.focus(); el.setSelectionRange(start + before.length, start + before.length + selected.length); }, 0);
  };
  const insert = (text: string) => {
    const el = textareaRef.current;
    if (!el) return;
    const pos = el.selectionStart;
    const newVal = value.slice(0, pos) + text + value.slice(pos);
    onChange(newVal);
    setTimeout(() => { el.focus(); el.setSelectionRange(pos + text.length, pos + text.length); }, 0);
  };

  const tools = [
    { icon: <Bold size={14}/>, title: 'Bold', action: () => wrap('**') },
    { icon: <Italic size={14}/>, title: 'Italic', action: () => wrap('_') },
    { icon: <Heading1 size={14}/>, title: 'H1', action: () => insert('\n# ') },
    { icon: <Heading2 size={14}/>, title: 'H2', action: () => insert('\n## ') },
    { icon: <Quote size={14}/>, title: 'Quote', action: () => insert('\n> ') },
    { icon: <List size={14}/>, title: 'List', action: () => insert('\n- ') },
    { icon: <Code size={14}/>, title: 'Code', action: () => wrap('`') },
    { icon: <Link size={14}/>, title: 'Link', action: () => wrap('[', '](url)') },
    { icon: <Image size={14}/>, title: 'Image', action: () => insert('\n![alt](image-url)\n') },
    { icon: <AlignLeft size={14}/>, title: 'Divider', action: () => insert('\n---\n') },
  ];

  return (
    <div className="flex flex-wrap gap-1 p-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded-t-lg border-b-0">
      {tools.map((t, i) => (
        <button key={i} type="button" title={t.title} onClick={t.action}
          className="p-2 rounded hover:bg-white hover:shadow-sm text-[#374151] transition-all" >
          {t.icon}
        </button>
      ))}
    </div>
  );
};

// ─── MARKDOWN RENDERER ───────────────────────────────────────
const renderMarkdown = (md: string) => {
  const html = md
    .replace(/^### (.+)$/gm, '<h3 class="text-xl font-bold mt-6 mb-2 text-[#111827]">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-2xl font-bold mt-8 mb-3 text-[#111827]">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-3xl font-bold mt-8 mb-4 text-[#111827]">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/_(.+?)_/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code class="bg-[#F3F4F6] px-1.5 py-0.5 rounded text-sm font-mono text-[#DC2626]">$1</code>')
    .replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-[#FF6321] pl-4 italic text-[#6B7280] my-4">$1</blockquote>')
    .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc text-[#374151]">$1</li>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-[#FF6321] underline" target="_blank">$1</a>')
    .replace(/!\[(.+?)\]\((.+?)\)/g, '<img src="$2" alt="$1" class="rounded-xl w-full my-4"/>')
    .replace(/^---$/gm, '<hr class="my-6 border-[#E5E7EB]"/>')
    .replace(/\n\n/g, '</p><p class="text-[#374151] leading-relaxed mb-4">')
    .replace(/\n/g, '<br/>');
  return `<p class="text-[#374151] leading-relaxed mb-4">${html}</p>`;
};

// ─── ADMIN PANEL ─────────────────────────────────────────────
const AdminPanel = ({ user, onLogout }: { user: User; onLogout: () => void }) => {
  const [view, setView] = useState<'dashboard' | 'posts' | 'editor'>('dashboard');
  const [posts, setPosts] = useState<Post[]>([]);
  const [editing, setEditing] = useState<Partial<Post> | null>(null);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [preview, setPreview] = useState(false);
  const [saved, setSaved] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [stats, setStats] = useState({ total: 0, published: 0, drafts: 0, views: 0 });

  const loadPosts = async () => {
    const { data } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
    const p = (data as Post[]) || [];
    setPosts(p);
    setStats({ total: p.length, published: p.filter(x => x.published).length, drafts: p.filter(x => !x.published).length, views: 0 });
  };

  useEffect(() => { loadPosts(); }, []);

  const newPost = () => {
    setEditing({ title: '', slug: '', excerpt: '', content: '', cover_image_url: '', published: false, category: '', tags: '', seo_title: '', seo_description: '' });
    setView('editor');
    setPreview(false);
  };

  const editPost = (p: Post) => { setEditing(p); setView('editor'); setPreview(false); };

  const handleSave = async (publish?: boolean) => {
    if (!editing?.title || !editing?.content) return alert('Title and Content required');
    setSaving(true);
    const slug = editing.slug || slugify(editing.title!);
    const isPublishing = publish !== undefined ? publish : editing.published;
    const payload = {
      title: editing.title,
      slug,
      excerpt: editing.excerpt || null,
      content: editing.content,
      cover_image_url: editing.cover_image_url || null,
      published: isPublishing,
      published_at: isPublishing && !editing.published_at ? new Date().toISOString() : editing.published_at || null,
      category: editing.category || null,
      tags: editing.tags || null,
      seo_title: editing.seo_title || null,
      seo_description: editing.seo_description || null,
      read_time: estimateReadTime(editing.content!),
    };
    if (editing.id) {
      await supabase.from('blog_posts').update(payload as any).eq('id', editing.id);
    } else {
      await supabase.from('blog_posts').insert(payload as any);
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    setEditing(prev => ({ ...prev, ...payload, published: isPublishing }));
    loadPosts();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this post?')) return;
    await supabase.from('blog_posts').delete().eq('id', id);
    loadPosts();
    if (editing?.id === id) { setEditing(null); setView('posts'); }
  };

  const filtered = posts.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || (filter === 'published' && p.published) || (filter === 'draft' && !p.published);
    return matchSearch && matchFilter;
  });

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      {/* ── SIDEBAR ── */}
      <div className="w-64 bg-[#1F2937] text-white flex flex-col shrink-0">
        <div className="p-6 border-b border-[#374151]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF6321] to-orange-600 flex items-center justify-center font-black text-lg">A</div>
            <div><div className="font-bold text-sm">Blog Admin</div><div className="text-xs text-[#9CA3AF] truncate max-w-[130px]">{user.email}</div></div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {[
            { id: 'dashboard', icon: <LayoutDashboard size={18}/>, label: 'Dashboard' },
            { id: 'posts', icon: <FileText size={18}/>, label: 'All Posts' },
          ].map(item => (
            <button key={item.id} onClick={() => setView(item.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${view === item.id ? 'bg-[#FF6321] text-white' : 'text-[#D1D5DB] hover:bg-[#374151]'}`}>
              {item.icon}{item.label}
            </button>
          ))}
          <div className="pt-4">
            <button onClick={newPost}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium bg-[#374151] hover:bg-[#4B5563] text-white transition-all">
              <Plus size={18}/> New Post
            </button>
          </div>
        </nav>
        <div className="p-4 border-t border-[#374151]">
          <button onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-[#9CA3AF] hover:text-white hover:bg-[#374151] transition-all">
            <LogOut size={18}/> Sign Out
          </button>
        </div>
      </div>

      {/* ── MAIN ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-[#E5E7EB] px-8 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-sm text-[#6B7280]">
            <span className="font-semibold text-[#111827]">
              {view === 'dashboard' && 'Dashboard'}
              {view === 'posts' && 'All Posts'}
              {view === 'editor' && (editing?.id ? 'Edit Post' : 'New Post')}
            </span>
          </div>
          {view === 'editor' && editing && (
            <div className="flex items-center gap-3">
              {saved && <span className="text-sm text-green-600 flex items-center gap-1"><CheckCircle size={14}/> Saved!</span>}
              <button onClick={() => setPreview(!preview)}
                className="flex items-center gap-2 px-4 py-2 border border-[#E5E7EB] rounded-lg text-sm hover:bg-[#F9FAFB] transition-all">
                <Eye size={14}/> {preview ? 'Edit' : 'Preview'}
              </button>
              <button onClick={() => handleSave(false)} disabled={saving}
                className="flex items-center gap-2 px-4 py-2 border border-[#E5E7EB] rounded-lg text-sm hover:bg-[#F9FAFB] transition-all">
                <Save size={14}/> {saving ? 'Saving...' : 'Save Draft'}
              </button>
              <button onClick={() => handleSave(true)} disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-[#FF6321] text-white rounded-lg text-sm font-semibold hover:bg-orange-600 transition-all">
                <Globe size={14}/> {editing.published ? 'Update' : 'Publish'}
              </button>
            </div>
          )}
          {(view === 'dashboard' || view === 'posts') && (
            <button onClick={newPost}
              className="flex items-center gap-2 px-4 py-2 bg-[#FF6321] text-white rounded-lg text-sm font-semibold hover:bg-orange-600 transition-all">
              <Plus size={14}/> New Post
            </button>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">

          {/* ── DASHBOARD ── */}
          {view === 'dashboard' && (
            <div className="p-8">
              <h1 className="text-2xl font-bold text-[#111827] mb-8">Welcome back 👋</h1>
              <div className="grid grid-cols-3 gap-6 mb-8">
                {[
                  { label: 'Total Posts', value: stats.total, icon: <BookOpen size={20}/>, color: 'bg-blue-50 text-blue-600' },
                  { label: 'Published', value: stats.published, icon: <CheckCircle size={20}/>, color: 'bg-green-50 text-green-600' },
                  { label: 'Drafts', value: stats.drafts, icon: <Clock size={20}/>, color: 'bg-orange-50 text-orange-600' },
                ].map((s, i) => (
                  <div key={i} className="bg-white rounded-2xl p-6 border border-[#E5E7EB]">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${s.color}`}>{s.icon}</div>
                    <div className="text-3xl font-black text-[#111827] mb-1">{s.value}</div>
                    <div className="text-sm text-[#6B7280]">{s.label}</div>
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden">
                <div className="px-6 py-4 border-b border-[#E5E7EB] flex items-center justify-between">
                  <h2 className="font-bold text-[#111827]">Recent Posts</h2>
                  <button onClick={() => setView('posts')} className="text-sm text-[#FF6321] font-medium">View all</button>
                </div>
                <div className="divide-y divide-[#F3F4F6]">
                  {posts.slice(0, 5).map(p => (
                    <div key={p.id} className="px-6 py-4 flex items-center justify-between hover:bg-[#F9FAFB] cursor-pointer" onClick={() => editPost(p)}>
                      <div>
                        <div className="font-medium text-[#111827] text-sm">{p.title}</div>
                        <div className="text-xs text-[#9CA3AF] mt-0.5">{new Date(p.created_at).toLocaleDateString()}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${p.published ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                          {p.published ? 'Published' : 'Draft'}
                        </span>
                        <ChevronRight size={16} className="text-[#D1D5DB]"/>
                      </div>
                    </div>
                  ))}
                  {posts.length === 0 && <div className="px-6 py-10 text-center text-[#9CA3AF] text-sm">No posts yet. Create your first post!</div>}
                </div>
              </div>
            </div>
          )}

          {/* ── ALL POSTS ── */}
          {view === 'posts' && (
            <div className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]"/>
                  <input value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Search posts..."
                    className="w-full pl-10 pr-4 py-2.5 border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6321]/20 focus:border-[#FF6321]"/>
                </div>
                <div className="flex gap-2">
                  {(['all', 'published', 'draft'] as const).map(f => (
                    <button key={f} onClick={() => setFilter(f)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize ${filter === f ? 'bg-[#FF6321] text-white' : 'bg-white border border-[#E5E7EB] text-[#6B7280] hover:bg-[#F9FAFB]'}`}>
                      {f}
                    </button>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden">
                <table className="w-full">
                  <thead className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                    <tr>{['Title', 'Category', 'Status', 'Date', 'Actions'].map(h => (
                      <th key={h} className="px-6 py-3 text-left text-xs font-bold text-[#6B7280] uppercase tracking-wider">{h}</th>
                    ))}</tr>
                  </thead>
                  <tbody className="divide-y divide-[#F3F4F6]">
                    {filtered.map(p => (
                      <tr key={p.id} className="hover:bg-[#F9FAFB]">
                        <td className="px-6 py-4">
                          <div className="font-medium text-[#111827] text-sm">{p.title}</div>
                          <div className="text-xs text-[#9CA3AF]">/{p.slug}</div>
                        </td>
                        <td className="px-6 py-4"><span className="text-xs text-[#6B7280] bg-[#F3F4F6] px-2 py-1 rounded-full">{p.category || '—'}</span></td>
                        <td className="px-6 py-4">
                          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${p.published ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                            {p.published ? '● Published' : '○ Draft'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs text-[#9CA3AF]">{new Date(p.created_at).toLocaleDateString()}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button onClick={() => editPost(p)} className="p-1.5 text-[#6B7280] hover:text-[#FF6321] hover:bg-orange-50 rounded-lg transition-all"><PenSquare size={15}/></button>
                            <button onClick={() => handleDelete(p.id)} className="p-1.5 text-[#6B7280] hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={15}/></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filtered.length === 0 && <tr><td colSpan={5} className="px-6 py-12 text-center text-[#9CA3AF] text-sm">No posts found</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── EDITOR ── */}
          {view === 'editor' && editing && (
            <div className="flex h-full">
              {/* Main editor */}
              <div className="flex-1 overflow-y-auto p-8">
                {preview ? (
                  <div className="max-w-3xl mx-auto">
                    {editing.cover_image_url && <img src={editing.cover_image_url} alt="Cover" className="w-full h-64 object-cover rounded-2xl mb-8"/>}
                    <div className="flex items-center gap-3 mb-4">
                      {editing.category && <span className="text-xs bg-[#FFF7ED] text-[#FF6321] px-3 py-1 rounded-full font-medium">{editing.category}</span>}
                      {editing.read_time && <span className="text-xs text-[#9CA3AF]">{estimateReadTime(editing.content || '')} min read</span>}
                    </div>
                    <h1 className="text-4xl font-black text-[#111827] mb-4">{editing.title || 'Untitled'}</h1>
                    {editing.excerpt && <p className="text-xl text-[#6B7280] mb-8 leading-relaxed">{editing.excerpt}</p>}
                    <div dangerouslySetInnerHTML={{ __html: renderMarkdown(editing.content || '') }}/>
                  </div>
                ) : (
                  <div className="max-w-3xl mx-auto space-y-5">
                    <input
                      placeholder="Post Title..."
                      value={editing.title || ''}
                      onChange={e => setEditing({ ...editing, title: e.target.value, slug: slugify(e.target.value) })}
                      className="w-full text-3xl font-black text-[#111827] border-0 border-b-2 border-[#F3F4F6] focus:border-[#FF6321] outline-none pb-3 bg-transparent placeholder:text-[#D1D5DB]"
                    />
                    <textarea
                      placeholder="Short excerpt / description..."
                      value={editing.excerpt || ''}
                      onChange={e => setEditing({ ...editing, excerpt: e.target.value })}
                      rows={2}
                      className="w-full text-[#6B7280] border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6321]/20 focus:border-[#FF6321] resize-none"
                    />
                    <div>
                      <RichToolbar textareaRef={textareaRef} value={editing.content || ''} onChange={v => setEditing({ ...editing, content: v })}/>
                      <textarea
                        ref={textareaRef}
                        placeholder="Write your blog post here... (supports Markdown)"
                        value={editing.content || ''}
                        onChange={e => setEditing({ ...editing, content: e.target.value })}
                        rows={24}
                        className="w-full border border-[#E5E7EB] rounded-b-xl px-5 py-4 text-sm text-[#374151] font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#FF6321]/20 focus:border-[#FF6321] resize-y"
                      />
                    </div>
                    <div className="text-xs text-[#9CA3AF] text-right">~{estimateReadTime(editing.content || '')} min read · {(editing.content || '').split(/\s+/).filter(Boolean).length} words</div>
                  </div>
                )}
              </div>

              {/* Right panel */}
              <div className="w-72 shrink-0 border-l border-[#E5E7EB] bg-white overflow-y-auto p-6 space-y-6">

                {/* Publish status */}
                <div className="bg-[#F9FAFB] rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    {editing.published ? <CheckCircle size={16} className="text-green-500"/> : <Clock size={16} className="text-orange-500"/>}
                    <span className="text-sm font-semibold text-[#111827]">{editing.published ? 'Published' : 'Draft'}</span>
                  </div>
                  <div className="space-y-2">
                    <button onClick={() => handleSave(false)} className="w-full py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#374151] hover:bg-[#F3F4F6] transition-all">Save as Draft</button>
                    <button onClick={() => handleSave(true)} className="w-full py-2 bg-[#FF6321] text-white rounded-lg text-sm font-semibold hover:bg-orange-600 transition-all">
                      {editing.published ? 'Update Post' : 'Publish Now'}
                    </button>
                  </div>
                </div>

                {/* URL Slug */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-[#9CA3AF] mb-2 block">URL Slug</label>
                  <div className="flex items-center gap-1 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-3 py-2">
                    <span className="text-xs text-[#9CA3AF]">/blog/</span>
                    <input value={editing.slug || ''} onChange={e => setEditing({ ...editing, slug: e.target.value })}
                      className="flex-1 text-xs text-[#374151] bg-transparent outline-none"/>
                  </div>
                </div>

                {/* Cover Image */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-[#9CA3AF] mb-2 block flex items-center gap-1"><Image size={12}/> Cover Image URL</label>
                  <input placeholder="https://..." value={editing.cover_image_url || ''}
                    onChange={e => setEditing({ ...editing, cover_image_url: e.target.value })}
                    className="w-full text-xs border border-[#E5E7EB] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF6321]/20 focus:border-[#FF6321]"/>
                  {editing.cover_image_url && <img src={editing.cover_image_url} alt="cover" className="mt-2 w-full h-24 object-cover rounded-lg"/>}
                </div>

                {/* Category */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-[#9CA3AF] mb-2 block flex items-center gap-1"><Tag size={12}/> Category</label>
                  <select value={editing.category || ''} onChange={e => setEditing({ ...editing, category: e.target.value })}
                    className="w-full text-sm border border-[#E5E7EB] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF6321]/20 focus:border-[#FF6321] bg-white">
                    <option value="">Select category...</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                {/* Tags */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-[#9CA3AF] mb-2 block">Tags (comma separated)</label>
                  <input placeholder="resume, tips, career" value={editing.tags || ''}
                    onChange={e => setEditing({ ...editing, tags: e.target.value })}
                    className="w-full text-sm border border-[#E5E7EB] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF6321]/20 focus:border-[#FF6321]"/>
                </div>

                {/* SEO */}
                <div className="border-t border-[#E5E7EB] pt-4">
                  <label className="text-xs font-bold uppercase tracking-widest text-[#9CA3AF] mb-3 block flex items-center gap-1"><Globe size={12}/> SEO Settings</label>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-[#6B7280] mb-1 block">SEO Title</label>
                      <input placeholder="SEO optimized title..." value={editing.seo_title || ''}
                        onChange={e => setEditing({ ...editing, seo_title: e.target.value })}
                        className="w-full text-xs border border-[#E5E7EB] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF6321]/20 focus:border-[#FF6321]"/>
                      <div className="text-[10px] text-[#9CA3AF] mt-1">{(editing.seo_title || '').length}/60</div>
                    </div>
                    <div>
                      <label className="text-xs text-[#6B7280] mb-1 block">Meta Description</label>
                      <textarea placeholder="Brief description for search engines..." value={editing.seo_description || ''}
                        onChange={e => setEditing({ ...editing, seo_description: e.target.value })}
                        rows={3}
                        className="w-full text-xs border border-[#E5E7EB] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF6321]/20 focus:border-[#FF6321] resize-none"/>
                      <div className="text-[10px] text-[#9CA3AF] mt-1">{(editing.seo_description || '').length}/160</div>
                    </div>
                  </div>
                </div>

                {/* Danger zone */}
                {editing.id && (
                  <div className="border-t border-[#E5E7EB] pt-4">
                    <button onClick={() => handleDelete(editing.id!)}
                      className="w-full flex items-center justify-center gap-2 py-2 border border-red-200 text-red-500 rounded-lg text-sm hover:bg-red-50 transition-all">
                      <Trash2 size={14}/> Delete Post
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── PUBLIC BLOG (Advanced) ──────────────────────────────────
const POSTS_PER_PAGE = 9;

const PublicBlog = ({ onAdminClick: _onAdminClick }: { onAdminClick: () => void }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [posts, setPosts] = useState<Post[]>([]);
  const [active, setActive] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'reading'>('newest');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [page, setPage] = useState(1);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<null | 'ok' | 'err'>(null);

  useEffect(() => {
    supabase.from('blog_posts').select('*').eq('published', true).order('published_at', { ascending: false })
      .then(({ data }) => { setPosts((data as Post[]) || []); setLoading(false); });
  }, []);

  useEffect(() => {
    const slug = location.pathname.startsWith('/blog/') ? location.pathname.replace('/blog/', '') : null;
    if (slug && posts.length > 0) { const p = posts.find(x => x.slug === slug); if (p) setActive(p); }
    if (location.pathname === '/blog') setActive(null);
  }, [location.pathname, posts]);

  useEffect(() => { setPage(1); }, [search, activeCategory, sortBy]);

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(posts.map(p => p.category).filter(Boolean) as string[]))],
    [posts]
  );

  const tagCloud = useMemo(() => {
    const counts: Record<string, number> = {};
    posts.forEach(p => (p.tags || '').split(',').map(t => t.trim()).filter(Boolean).forEach(t => { counts[t] = (counts[t] || 0) + 1; }));
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 12);
  }, [posts]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    let list = posts.filter(p => {
      const matchCat = activeCategory === 'All' || p.category === activeCategory;
      const matchSearch = !q || p.title.toLowerCase().includes(q) || (p.excerpt || '').toLowerCase().includes(q) || (p.tags || '').toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
    if (sortBy === 'oldest') list = [...list].sort((a, b) => new Date(a.published_at || a.created_at).getTime() - new Date(b.published_at || b.created_at).getTime());
    if (sortBy === 'reading') list = [...list].sort((a, b) => (a.read_time || 0) - (b.read_time || 0));
    return list;
  }, [posts, search, activeCategory, sortBy]);

  const featured = posts[0];
  const trending = useMemo(() => posts.slice(1, 5), [posts]);

  // Pagination — exclude featured from page 1 grid for variety
  const gridSource = filtered.filter(p => !(page === 1 && activeCategory === 'All' && !search && featured && p.id === featured.id));
  const totalPages = Math.max(1, Math.ceil(gridSource.length / POSTS_PER_PAGE));
  const pageItems = gridSource.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE);

  const fmtDate = (d?: string | null) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';

  if (active) return (
    <div className="min-h-screen liquid-bg">
      <div className="max-w-3xl mx-auto px-6 py-12 relative z-10">
        <button onClick={() => { setActive(null); navigate({ to: '/blog' }); }}
          className="liquid-pill inline-flex items-center gap-2 text-sm text-[#374151] hover:text-[#FF6321] mb-8 px-4 py-2 rounded-full">
          <span className="liquid-card-shine"/>
          <span className="liquid-card-content inline-flex items-center gap-2">← Back to Blog</span>
        </button>
        {active.cover_image_url && <img src={active.cover_image_url} alt={active.title} className="w-full h-72 object-cover rounded-3xl mb-8 shadow-xl"/>}
        <div className="liquid-card rounded-3xl p-8 md:p-10">
          <span className="liquid-card-shine"/>
          <div className="liquid-card-content">
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              {active.category && <span className="text-xs bg-[#FFF7ED] text-[#FF6321] px-3 py-1 rounded-full font-medium">{active.category}</span>}
              {active.read_time && <span className="text-sm text-[#9CA3AF]">{active.read_time} min read</span>}
              {active.published_at && <span className="text-sm text-[#9CA3AF]">{fmtDate(active.published_at)}</span>}
            </div>
            <h1 className="text-4xl font-black text-[#111827] mb-4 leading-tight">{active.title}</h1>
            {active.excerpt && <p className="text-xl text-[#6B7280] mb-8 leading-relaxed">{active.excerpt}</p>}
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: renderMarkdown(active.content) }}/>
            {active.tags && (
              <div className="mt-10 pt-6 border-t border-[#F3F4F6] flex flex-wrap gap-2">
                {active.tags.split(',').map((tag, i) => (
                  <span key={i} className="text-xs bg-[#F3F4F6] text-[#6B7280] px-3 py-1 rounded-full">#{tag.trim()}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen liquid-bg">
      {/* ─── HERO ─── */}
      <section className="py-16 px-6 relative z-10">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF7ED] text-[#FF6321] text-xs font-semibold uppercase tracking-wider mb-5">
            <Sparkles size={12}/> Career Insights
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-[#111827] mb-4 tracking-tight">
            The <span className="text-[#FF6321]">Rezumi</span> Blog
          </h1>
          <p className="text-lg sm:text-xl text-[#6B7280] mb-8 max-w-2xl mx-auto">
            Expert resume strategies, interview prep, and AI-powered career advice — fresh every week.
          </p>
          <div className="relative max-w-xl mx-auto liquid-card rounded-full">
            <span className="liquid-card-shine"/>
            <div className="liquid-card-content relative">
              <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-[#9CA3AF] z-10"/>
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search articles, tags, topics…"
                className="w-full pl-12 pr-4 py-4 bg-transparent border-0 rounded-full text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none"/>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FEATURED ─── */}
      {featured && !search && activeCategory === 'All' && page === 1 && (
        <section className="max-w-6xl mx-auto px-6 mb-12 relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <Flame size={16} className="text-[#FF6321]"/>
            <span className="text-xs font-bold uppercase tracking-widest text-[#FF6321]">Featured</span>
          </div>
          <article
            onClick={() => { setActive(featured); navigate({ to: '/blog/' + featured.slug }); }}
            className="liquid-card cursor-pointer rounded-3xl overflow-hidden group">
            <span className="liquid-card-shine"/>
            <div className="liquid-card-content grid md:grid-cols-2 gap-0">
              <div className="h-64 md:h-auto overflow-hidden">
                {featured.cover_image_url
                  ? <img src={featured.cover_image_url} alt={featured.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                  : <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-300 flex items-center justify-center"><BookOpen size={64} className="text-[#FF6321]/40"/></div>}
              </div>
              <div className="p-8 md:p-10 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  {featured.category && <span className="text-[10px] bg-[#FFF7ED] text-[#FF6321] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">{featured.category}</span>}
                  {featured.read_time && <span className="text-xs text-[#9CA3AF] inline-flex items-center gap-1"><Clock size={11}/> {featured.read_time} min read</span>}
                  {featured.published_at && <span className="text-xs text-[#9CA3AF] inline-flex items-center gap-1"><Calendar size={11}/> {fmtDate(featured.published_at)}</span>}
                </div>
                <h2 className="font-black text-2xl md:text-3xl text-[#111827] mb-3 leading-tight group-hover:text-[#FF6321] transition-colors">{featured.title}</h2>
                {featured.excerpt && <p className="text-[#6B7280] mb-5 line-clamp-3">{featured.excerpt}</p>}
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#FF6321]">
                  Read article <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform"/>
                </span>
              </div>
            </div>
          </article>
        </section>
      )}

      {/* ─── MAIN LAYOUT ─── */}
      <div className="max-w-6xl mx-auto px-6 py-8 relative z-10 grid lg:grid-cols-[1fr_300px] gap-10">
        {/* ── LEFT: Listing ── */}
        <div>
          {/* Categories */}
          <div className="flex gap-2 flex-wrap mb-6 overflow-x-auto">
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`liquid-pill px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${activeCategory === cat ? 'liquid-pill-active text-white' : 'text-[#374151]'}`}>
                <span className="liquid-card-shine"/>
                <span className="liquid-card-content">{cat}</span>
              </button>
            ))}
          </div>

          {/* Toolbar */}
          <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
            <div className="text-sm text-[#6B7280]">
              {loading ? 'Loading…' : <><span className="font-semibold text-[#111827]">{filtered.length}</span> article{filtered.length === 1 ? '' : 's'}{activeCategory !== 'All' && <> in <span className="font-semibold text-[#FF6321]">{activeCategory}</span></>}</>}
            </div>
            <div className="flex items-center gap-2">
              <select value={sortBy} onChange={e => setSortBy(e.target.value as any)}
                className="text-xs bg-white dark:bg-white/10 border border-[#E5E7EB] dark:border-white/15 rounded-full px-3 py-2 text-[#374151] focus:outline-none focus:ring-2 focus:ring-[#FF6321]/30">
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="reading">Quickest read</option>
              </select>
              <div className="flex bg-white dark:bg-white/10 border border-[#E5E7EB] dark:border-white/15 rounded-full p-1">
                <button onClick={() => setView('grid')} aria-label="Grid view"
                  className={`p-1.5 rounded-full transition-all ${view === 'grid' ? 'bg-[#FF6321] text-white' : 'text-[#9CA3AF] hover:text-[#374151]'}`}>
                  <Grid3x3 size={14}/>
                </button>
                <button onClick={() => setView('list')} aria-label="List view"
                  className={`p-1.5 rounded-full transition-all ${view === 'list' ? 'bg-[#FF6321] text-white' : 'text-[#9CA3AF] hover:text-[#374151]'}`}>
                  <Rows3 size={14}/>
                </button>
              </div>
            </div>
          </div>

          {/* Results */}
          {loading ? (
            <div className="grid sm:grid-cols-2 gap-6">
              {[1,2,3,4].map(i => <div key={i} className="liquid-card rounded-3xl h-80 animate-pulse"><span className="liquid-card-shine"/></div>)}
            </div>
          ) : pageItems.length === 0 ? (
            <div className="text-center py-20 liquid-card rounded-3xl">
              <span className="liquid-card-shine"/>
              <div className="liquid-card-content py-10">
                <BookOpen size={48} className="text-[#FF6321]/30 mx-auto mb-4"/>
                <p className="text-lg font-semibold text-[#111827] mb-1">No articles found</p>
                <p className="text-sm text-[#9CA3AF]">Try a different search or category.</p>
              </div>
            </div>
          ) : view === 'grid' ? (
            <div className="grid sm:grid-cols-2 gap-6">
              {pageItems.map(p => (
                <article key={p.id}
                  onClick={() => { setActive(p); navigate({ to: '/blog/' + p.slug }); }}
                  className="liquid-card cursor-pointer rounded-3xl overflow-hidden group">
                  <span className="liquid-card-shine"/>
                  <div className="liquid-card-content">
                    <div className="h-48 overflow-hidden">
                      {p.cover_image_url
                        ? <img src={p.cover_image_url} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
                        : <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center"><BookOpen size={40} className="text-[#FF6321]/40"/></div>}
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        {p.category && <span className="text-[10px] bg-[#FFF7ED] text-[#FF6321] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide">{p.category}</span>}
                        {p.read_time && <span className="text-xs text-[#9CA3AF] inline-flex items-center gap-1"><Clock size={10}/> {p.read_time} min</span>}
                      </div>
                      <h3 className="font-bold text-lg text-[#111827] mb-2 line-clamp-2 leading-snug group-hover:text-[#FF6321] transition-colors">{p.title}</h3>
                      {p.excerpt && <p className="text-sm text-[#6B7280] line-clamp-2 mb-4">{p.excerpt}</p>}
                      <div className="flex items-center justify-between">
                        {p.published_at && <p className="text-xs text-[#9CA3AF]">{fmtDate(p.published_at)}</p>}
                        <ArrowRight size={14} className="text-[#FF6321] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all"/>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {pageItems.map(p => (
                <article key={p.id}
                  onClick={() => { setActive(p); navigate({ to: '/blog/' + p.slug }); }}
                  className="liquid-card cursor-pointer rounded-2xl overflow-hidden group">
                  <span className="liquid-card-shine"/>
                  <div className="liquid-card-content flex gap-5 p-4">
                    <div className="w-40 h-32 shrink-0 rounded-xl overflow-hidden">
                      {p.cover_image_url
                        ? <img src={p.cover_image_url} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
                        : <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center"><BookOpen size={28} className="text-[#FF6321]/40"/></div>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        {p.category && <span className="text-[10px] bg-[#FFF7ED] text-[#FF6321] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide">{p.category}</span>}
                        {p.read_time && <span className="text-xs text-[#9CA3AF] inline-flex items-center gap-1"><Clock size={10}/> {p.read_time} min</span>}
                        {p.published_at && <span className="text-xs text-[#9CA3AF]">· {fmtDate(p.published_at)}</span>}
                      </div>
                      <h3 className="font-bold text-base text-[#111827] mb-1 line-clamp-2 group-hover:text-[#FF6321] transition-colors">{p.title}</h3>
                      {p.excerpt && <p className="text-sm text-[#6B7280] line-clamp-2">{p.excerpt}</p>}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="liquid-pill p-2 rounded-full text-[#374151] disabled:opacity-40 disabled:cursor-not-allowed">
                <span className="liquid-card-shine"/>
                <span className="liquid-card-content"><ChevronLeft size={16}/></span>
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                <button key={n} onClick={() => setPage(n)}
                  className={`liquid-pill min-w-[36px] h-9 rounded-full text-sm font-semibold ${page === n ? 'liquid-pill-active text-white' : 'text-[#374151]'}`}>
                  <span className="liquid-card-shine"/>
                  <span className="liquid-card-content">{n}</span>
                </button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="liquid-pill p-2 rounded-full text-[#374151] disabled:opacity-40 disabled:cursor-not-allowed">
                <span className="liquid-card-shine"/>
                <span className="liquid-card-content"><ChevronRight size={16}/></span>
              </button>
            </div>
          )}
        </div>

        {/* ── RIGHT: Sidebar ── */}
        <aside className="space-y-6 lg:sticky lg:top-24 self-start">
          {/* Trending */}
          <div className="liquid-card rounded-3xl">
            <span className="liquid-card-shine"/>
            <div className="liquid-card-content p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={16} className="text-[#FF6321]"/>
                <h3 className="font-bold text-sm uppercase tracking-wider text-[#111827]">Trending Now</h3>
              </div>
              <div className="space-y-4">
                {trending.length === 0 && <p className="text-xs text-[#9CA3AF]">No posts yet.</p>}
                {trending.map((p, i) => (
                  <button key={p.id} onClick={() => { setActive(p); navigate({ to: '/blog/' + p.slug }); }}
                    className="w-full text-left flex gap-3 group">
                    <div className="text-2xl font-black text-[#FF6321]/30 group-hover:text-[#FF6321] transition-colors leading-none w-6">
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#111827] line-clamp-2 group-hover:text-[#FF6321] transition-colors leading-snug">{p.title}</p>
                      {p.read_time && <p className="text-[11px] text-[#9CA3AF] mt-1 inline-flex items-center gap-1"><Clock size={10}/> {p.read_time} min</p>}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="liquid-card rounded-3xl overflow-hidden">
            <span className="liquid-card-shine"/>
            <div className="liquid-card-content p-6 bg-gradient-to-br from-[#FFF7ED]/60 to-orange-100/60">
              <div className="w-10 h-10 rounded-xl bg-[#FF6321] text-white flex items-center justify-center mb-3">
                <Mail size={18}/>
              </div>
              <h3 className="font-black text-lg text-[#111827] mb-1">Weekly career tips</h3>
              <p className="text-sm text-[#6B7280] mb-4">Free resume + interview advice in your inbox. No spam.</p>
              <form onSubmit={(e) => { e.preventDefault(); if (/^\S+@\S+\.\S+$/.test(newsletterEmail)) { setNewsletterStatus('ok'); setNewsletterEmail(''); } else { setNewsletterStatus('err'); } }}
                className="space-y-2">
                <input type="email" value={newsletterEmail} onChange={e => setNewsletterEmail(e.target.value)}
                  placeholder="you@email.com" required
                  className="w-full text-sm bg-white border border-[#E5E7EB] rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#FF6321]/30 focus:border-[#FF6321]"/>
                <button type="submit" className="w-full bg-[#FF6321] hover:bg-orange-600 text-white text-sm font-semibold py-2.5 rounded-xl transition-all inline-flex items-center justify-center gap-2">
                  Subscribe <ArrowRight size={14}/>
                </button>
                {newsletterStatus === 'ok' && <p className="text-xs text-green-600 inline-flex items-center gap-1"><CheckCircle size={12}/> Subscribed! Check your inbox.</p>}
                {newsletterStatus === 'err' && <p className="text-xs text-red-500">Please enter a valid email.</p>}
              </form>
            </div>
          </div>

          {/* Tags */}
          {tagCloud.length > 0 && (
            <div className="liquid-card rounded-3xl">
              <span className="liquid-card-shine"/>
              <div className="liquid-card-content p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Tag size={16} className="text-[#FF6321]"/>
                  <h3 className="font-bold text-sm uppercase tracking-wider text-[#111827]">Popular Tags</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tagCloud.map(([tag, count]) => (
                    <button key={tag} onClick={() => setSearch(tag)}
                      className="text-xs bg-[#F3F4F6] hover:bg-[#FF6321] hover:text-white text-[#6B7280] px-3 py-1.5 rounded-full transition-all">
                      #{tag} <span className="opacity-60">{count}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="liquid-card rounded-3xl overflow-hidden">
            <span className="liquid-card-shine"/>
            <div className="liquid-card-content p-6 text-center">
              <Sparkles size={28} className="text-[#FF6321] mx-auto mb-2"/>
              <h3 className="font-black text-lg text-[#111827] mb-1">Build your resume</h3>
              <p className="text-xs text-[#6B7280] mb-4">AI-powered, ATS-optimized in 60 seconds.</p>
              <button onClick={() => navigate({ to: '/' })}
                className="w-full bg-[#111827] hover:bg-[#FF6321] text-white text-sm font-semibold py-2.5 rounded-xl transition-all">
                Start free →
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

// ─── ROOT COMPONENT ───────────────────────────────────────────
export const Blog = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authMsg, setAuthMsg] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => setUser(session?.user ?? null));
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) { setIsAdmin(false); return; }
    setCheckingAdmin(true);
    supabase.from('user_roles').select('role').eq('user_id', user.id).eq('role', 'admin')
      .then(({ data }) => { setIsAdmin(!!data?.length); setCheckingAdmin(false); });
  }, [user]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthMsg(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setAuthMsg(error.message);
    setAuthLoading(false);
  };

  // Admin mode - show full admin panel
  if (showAdmin) {
    if (!user) return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl p-10 w-full max-w-md border border-[#E5E7EB] shadow-xl">
          <button onClick={() => setShowAdmin(false)} className="text-sm text-[#6B7280] mb-6 flex items-center gap-1 hover:text-[#FF6321]">← Back to Blog</button>
          <div className="w-12 h-12 bg-gradient-to-br from-[#FF6321] to-orange-600 rounded-2xl flex items-center justify-center mb-6"><LayoutDashboard size={24} className="text-white"/></div>
          <h2 className="text-2xl font-black text-[#111827] mb-2">Admin Login</h2>
          <p className="text-sm text-[#6B7280] mb-8">Sign in to manage your blog</p>
          <form onSubmit={handleAuth} className="space-y-4">
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required
              className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6321]/20 focus:border-[#FF6321]"/>
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required
              className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6321]/20 focus:border-[#FF6321]"/>
            {authMsg && <p className="text-sm text-red-500 bg-red-50 rounded-lg px-4 py-2">{authMsg}</p>}
            <button type="submit" disabled={authLoading}
              className="w-full bg-[#FF6321] text-white py-3 rounded-xl font-semibold text-sm hover:bg-orange-600 transition-all disabled:opacity-50">
              {authLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    );

    if (checkingAdmin) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-[#FF6321] border-t-transparent rounded-full"></div></div>;

    if (!isAdmin) return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl p-10 max-w-md w-full text-center border border-[#E5E7EB]">
          <AlertCircle size={48} className="text-orange-400 mx-auto mb-4"/>
          <h2 className="text-xl font-bold text-[#111827] mb-2">Not an Admin</h2>
          <p className="text-sm text-[#6B7280] mb-6">Your account doesn't have admin access. Add your user ID to the <code className="bg-[#F3F4F6] px-1 rounded">user_roles</code> table.</p>
          <p className="text-xs text-[#9CA3AF] font-mono bg-[#F3F4F6] rounded-lg p-3 mb-4 break-all">{user.id}</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => setShowAdmin(false)} className="px-4 py-2 border border-[#E5E7EB] rounded-xl text-sm">← Blog</button>
            <button onClick={() => supabase.auth.signOut()} className="px-4 py-2 text-sm text-red-500 border border-red-200 rounded-xl">Sign Out</button>
          </div>
        </div>
      </div>
    );

    return <AdminPanel user={user} onLogout={() => { supabase.auth.signOut(); setShowAdmin(false); }}/>;
  }

  return (
    <div className="relative">
      <PublicBlog onAdminClick={() => setShowAdmin(true)}/>
      {/* Subtle admin link */}
      <button onClick={() => setShowAdmin(true)}
        className="fixed bottom-6 right-6 w-10 h-10 bg-white border border-[#E5E7EB] rounded-full flex items-center justify-center text-[#9CA3AF] hover:text-[#FF6321] hover:border-[#FF6321] transition-all shadow-md z-50"
        title="Admin Panel">
        <LayoutDashboard size={16}/>
      </button>
    </div>
  );
};
