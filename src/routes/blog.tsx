import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import { Calendar, Clock, ArrowRight, BookOpen, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image_url: string | null;
  published_at: string | null;
  created_at: string;
  category?: string | null;
  read_time?: number | null;
}

function formatDate(d: string | null) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function readTime(content: string) {
  return Math.max(1, Math.ceil(content.split(/\s+/).length / 200));
}

function catColor(cat: string | null | undefined) {
  const m: Record<string, string> = {
    "Career Tips": "bg-blue-50 text-blue-600",
    "Resume Writing": "bg-orange-50 text-orange-600",
    "Interview Prep": "bg-purple-50 text-purple-600",
    "Job Search": "bg-green-50 text-green-600",
    "AI Tools": "bg-indigo-50 text-indigo-600",
    "Salary": "bg-yellow-50 text-yellow-700",
    "Remote Work": "bg-teal-50 text-teal-600",
  };
  return m[cat || ""] || "bg-gray-50 text-gray-600";
}

function FeaturedCard({ post }: { post: Post }) {
  const rt = post.read_time || readTime(post.content);
  return (
    <Link to="/blog/$slug" params={{ slug: post.slug }} className="no-underline group block">
      <motion.article initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white/70 backdrop-blur-sm border border-white/60 rounded-3xl overflow-hidden hover:shadow-xl hover:shadow-orange-500/8 transition-all duration-300 hover:-translate-y-1">
        {post.cover_image_url && (
          <div className="h-56 overflow-hidden">
            <img src={post.cover_image_url} alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          </div>
        )}
        <div className="p-7">
          <div className="flex items-center gap-3 mb-3">
            {post.category && (
              <span className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${catColor(post.category)}`}>
                {post.category}
              </span>
            )}
            <span className="text-[12px] text-gray-400 flex items-center gap-1">
              <Clock size={12} /> {rt} min read
            </span>
          </div>
          <h2 className="text-[22px] font-bold text-[#111827] leading-tight mb-2 group-hover:text-[#EA580C] transition-colors">
            {post.title}
          </h2>
          {post.excerpt && (
            <p className="text-[14px] text-gray-500 leading-relaxed mb-4 line-clamp-2">{post.excerpt}</p>
          )}
          <div className="flex items-center justify-between">
            <span className="text-[12px] text-gray-400 flex items-center gap-1.5">
              <Calendar size={12} /> {formatDate(post.published_at || post.created_at)}
            </span>
            <span className="flex items-center gap-1 text-[13px] font-semibold text-[#EA580C] group-hover:gap-2 transition-all">
              Read more <ArrowRight size={14} />
            </span>
          </div>
        </div>
      </motion.article>
    </Link>
  );
}

function PostCard({ post }: { post: Post }) {
  const rt = post.read_time || readTime(post.content);
  return (
    <Link to="/blog/$slug" params={{ slug: post.slug }} className="no-underline group block">
      <motion.article initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white/70 backdrop-blur-sm border border-white/60 rounded-2xl p-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 flex gap-4">
        {post.cover_image_url && (
          <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
            <img src={post.cover_image_url} alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          {post.category && (
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${catColor(post.category)} inline-block mb-1.5`}>
              {post.category}
            </span>
          )}
          <h3 className="text-[14px] font-bold text-[#111827] leading-snug mb-1.5 group-hover:text-[#EA580C] transition-colors line-clamp-2">
            {post.title}
          </h3>
          <div className="flex items-center gap-3 text-[11px] text-gray-400">
            <span className="flex items-center gap-1"><Calendar size={10} /> {formatDate(post.published_at || post.created_at)}</span>
            <span className="flex items-center gap-1"><Clock size={10} /> {rt} min</span>
          </div>
        </div>
      </motion.article>
    </Link>
  );
}

function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    supabase
      .from("blog_posts")
      .select("id, title, slug, excerpt, content, cover_image_url, published_at, created_at, category, read_time")
      .eq("published", true)
      .order("published_at", { ascending: false })
      .then(({ data }) => {
        setPosts((data || []) as Post[]);
        setLoading(false);
      });
  }, []);

  const categories = ["All", ...Array.from(new Set(posts.map(p => p.category).filter(Boolean) as string[]))];

  const filtered = posts.filter(p => {
    const matchSearch = !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.excerpt?.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === "All" || p.category === activeCategory;
    return matchSearch && matchCat;
  });

  const featured = !search && activeCategory === "All" ? filtered[0] : null;
  const rest = !search && activeCategory === "All" ? filtered.slice(1) : filtered;

  return (
    <div style={{ minHeight: "calc(100vh - 68px)" }} className="pt-[68px]">
      <div className="max-w-5xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-orange-50 text-[#EA580C] text-[13px] font-semibold px-4 py-2 rounded-full mb-4 border border-orange-100">
            <BookOpen size={15} /> Career Blog
          </div>
          <h1 className="text-[36px] font-bold text-[#111827] tracking-tight mb-3">
            Resume Tips & <span className="text-[#FF6321]">Career Advice</span>
          </h1>
          <p className="text-[16px] text-gray-500 max-w-xl mx-auto">
            Expert guides on resume writing, interview prep, job search, and AI career tools.
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-6 max-w-md mx-auto">
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search articles..." value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white/70 backdrop-blur-sm border border-white/60 rounded-2xl text-[14px] focus:outline-none focus:border-[#FF6321] transition-colors" />
        </div>

        {/* Categories */}
        {categories.length > 1 && (
          <div className="flex gap-2 flex-wrap justify-center mb-8">
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`text-[12px] font-semibold px-4 py-2 rounded-full transition-all cursor-pointer border ${
                  activeCategory === cat
                    ? "bg-[#EA580C] text-white border-[#EA580C]"
                    : "bg-white/60 text-gray-500 border-white/60 hover:border-[#EA580C] hover:text-[#EA580C]"
                }`}>
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1,2,3,4].map(i => (
              <div key={i} className="bg-white/50 rounded-2xl p-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
                <div className="h-5 bg-gray-200 rounded w-full mb-2" />
                <div className="h-4 bg-gray-200 rounded w-2/3" />
              </div>
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <BookOpen size={40} className="mx-auto mb-3 opacity-30" />
            <p className="text-[15px]">No articles found</p>
          </div>
        )}

        {/* Featured */}
        {!loading && featured && (
          <div className="mb-8"><FeaturedCard post={featured} /></div>
        )}

        {/* Grid */}
        {!loading && rest.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rest.map(post => <PostCard key={post.id} post={post} />)}
          </div>
        )}

        {/* CTA */}
        {!loading && (
          <div className="mt-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl p-8 text-center text-white">
            <h3 className="text-[22px] font-bold mb-2">Ready to build your resume?</h3>
            <p className="text-orange-100 text-[15px] mb-5">Put these tips into action with our free AI resume builder.</p>
            <Link to="/resume"
              className="inline-flex items-center gap-2 bg-white text-[#EA580C] font-bold px-6 py-3 rounded-2xl hover:bg-orange-50 transition-colors no-underline">
              Build My Resume Free <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Resume Tips & Career Advice Blog | airesumi.com" },
      { name: "description", content: "Expert resume writing tips, interview advice, and AI career strategies. Free guides for job seekers." },
      { property: "og:title", content: "Resume Tips & Career Advice Blog | airesumi.com" },
      { property: "og:description", content: "Expert resume writing tips, interview advice, and AI career strategies." },
      { property: "og:url", content: "https://airesumi.com/blog" },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://airesumi.com/og-image.webp" },
      { name: "twitter:title", content: "Resume Tips & Career Advice Blog | airesumi.com" },
      { name: "twitter:description", content: "Expert resume writing tips, interview advice, and AI career strategies." },
    ],
    links: [{ rel: "canonical", href: "https://airesumi.com/blog" }],
  }),
  component: BlogPage,
});
