import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Calendar, Clock, ArrowRight, ArrowLeft, BookOpen, Tag } from "lucide-react";
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
  tags?: string | null;
  read_time?: number | null;
}

function formatDate(d: string | null) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric", timeZone: "UTC",
  });
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

function renderContent(content: string) {
  return content.split("\n\n").map((block, i) => {
    if (block.startsWith("# "))
      return <h1 key={i} className="text-[28px] font-bold text-[#111827] mt-8 mb-4">{block.slice(2)}</h1>;
    if (block.startsWith("## "))
      return <h2 key={i} className="text-[22px] font-bold text-[#111827] mt-7 mb-3">{block.slice(3)}</h2>;
    if (block.startsWith("### "))
      return <h3 key={i} className="text-[18px] font-bold text-[#111827] mt-5 mb-2">{block.slice(4)}</h3>;
    if (block.startsWith("- ") || block.startsWith("* ")) {
      const items = block.split("\n").filter(l => l.startsWith("- ") || l.startsWith("* "));
      return (
        <ul key={i} className="list-disc list-inside space-y-2 my-4 text-[16px] text-[#374151] leading-relaxed">
          {items.map((item, j) => <li key={j}>{item.slice(2)}</li>)}
        </ul>
      );
    }
    if (block.startsWith("> "))
      return (
        <blockquote key={i} className="border-l-4 border-[#EA580C] pl-5 py-2 my-4 bg-orange-50/50 rounded-r-xl">
          <p className="text-[16px] text-[#374151] italic">{block.slice(2)}</p>
        </blockquote>
      );
    if (!block.trim()) return null;
    const html = block
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/`(.+?)`/g, '<code class="bg-orange-50 text-orange-700 px-1.5 py-0.5 rounded text-[14px]">$1</code>');
    return (
      <p key={i} className="text-[16px] text-[#374151] leading-[1.85] mb-4"
        dangerouslySetInnerHTML={{ __html: html }} />
    );
  }).filter(Boolean);
}

function BlogPostPage() {
  const { slug } = Route.useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [related, setRelated] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    setPost(null);

    supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          setNotFound(true);
          setLoading(false);
          return;
        }
        setPost(data as Post);

        supabase
          .from("blog_posts")
          .select("id, title, slug, cover_image_url, published_at, created_at, category")
          .eq("published", true)
          .neq("slug", slug)
          .limit(3)
          .order("published_at", { ascending: false })
          .then(({ data: rel }) => {
            setRelated(((rel || []) as unknown) as Post[]);
            setLoading(false);
          });
      });
  }, [slug]);

  // Loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen pt-[68px]">
        <div className="max-w-3xl mx-auto px-6 py-12 animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-8" />
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4" />
          <div className="h-4 bg-gray-200 rounded w-full mb-2" />
          <div className="h-4 bg-gray-200 rounded w-5/6 mb-8" />
          <div className="h-64 bg-gray-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  // Not found
  if (notFound || !post) {
    return (
      <div className="min-h-screen pt-[68px] flex items-center justify-center">
        <div className="text-center px-6">
          <h1 className="text-[32px] font-bold text-[#111827] mb-3">Article Not Found</h1>
          <p className="text-gray-500 mb-6">This article doesn't exist or has been removed.</p>
          <Link to="/blog"
            className="text-[#EA580C] font-semibold no-underline hover:underline flex items-center gap-2 justify-center">
            <ArrowLeft size={16} /> Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  const rt = post.read_time || readTime(post.content);
  const tags = post.tags ? post.tags.split(",").map(t => t.trim()).filter(Boolean) : [];

  return (
    <div className="min-h-screen pt-[68px]">
      <div className="max-w-3xl mx-auto px-6 py-12">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[13px] text-gray-400 mb-8 flex-wrap">
          <Link to="/" className="hover:text-[#EA580C] transition-colors no-underline">Home</Link>
          <span>/</span>
          <Link to="/blog" className="hover:text-[#EA580C] transition-colors no-underline">Blog</Link>
          <span>/</span>
          <span className="text-[#111827] truncate max-w-[200px]">{post.title}</span>
        </div>

        <motion.article initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>

          {/* Category */}
          {post.category && (
            <span className={`inline-flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border border-orange-100 mb-5 ${catColor(post.category)}`}>
              <BookOpen size={12} /> {post.category}
            </span>
          )}

          {/* Title */}
          <h1 className="text-[32px] font-bold text-[#111827] leading-tight tracking-tight mb-4">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="flex items-center gap-4 text-[13px] text-gray-400 mb-6 pb-6 border-b border-gray-100">
            <span className="flex items-center gap-1.5">
              <Calendar size={13} /> {formatDate(post.published_at || post.created_at)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={13} /> {rt} min read
            </span>
          </div>

          {/* Cover image */}
          {post.cover_image_url && (
            <div className="rounded-2xl overflow-hidden mb-8 shadow-lg shadow-black/8">
              <img src={post.cover_image_url} alt={post.title}
                className="w-full object-cover max-h-80" />
            </div>
          )}

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-[18px] text-gray-500 leading-relaxed mb-6 font-medium italic border-l-4 border-[#EA580C] pl-5 py-1">
              {post.excerpt}
            </p>
          )}

          {/* Content */}
          <div className="blog-content">
            {renderContent(post.content)}
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap mt-8 pt-6 border-t border-gray-100">
              <Tag size={14} className="text-gray-400" />
              {tags.map(tag => (
                <span key={tag}
                  className="text-[12px] bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </motion.article>

        {/* CTA */}
        <div className="mt-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl p-7 text-white text-center">
          <h3 className="text-[20px] font-bold mb-2">Apply these tips with AI</h3>
          <p className="text-orange-100 text-[14px] mb-5">
            Build a job-winning, ATS-optimized resume in 10 minutes — free.
          </p>
          <Link to="/resume"
            className="inline-flex items-center gap-2 bg-white text-[#EA580C] font-bold px-6 py-3 rounded-2xl hover:bg-orange-50 transition-colors no-underline text-[14px]">
            Build My Resume Free <ArrowRight size={15} />
          </Link>
        </div>

        {/* Related posts */}
        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="text-[20px] font-bold text-[#111827] mb-5">More Articles</h2>
            <div className="grid gap-4">
              {related.map(r => (
                <Link key={r.id} to="/blog/$slug" params={{ slug: r.slug }}
                  className="no-underline group bg-white/70 backdrop-blur-sm border border-white/60 rounded-2xl p-4 flex gap-4 hover:shadow-md transition-all hover:-translate-y-0.5">
                  {r.cover_image_url && (
                    <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                      <img src={r.cover_image_url} alt={r.title}
                        className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div>
                    <p className="text-[14px] font-bold text-[#111827] group-hover:text-[#EA580C] transition-colors line-clamp-2">
                      {r.title}
                    </p>
                    <p className="text-[12px] text-gray-400 mt-1">
                      {formatDate(r.published_at || r.created_at)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Back */}
        <div className="mt-10">
          <Link to="/blog"
            className="flex items-center gap-2 text-[14px] font-medium text-gray-500 hover:text-[#EA580C] transition-colors no-underline">
            <ArrowLeft size={15} /> Back to Blog
          </Link>
        </div>

      </div>
    </div>
  );
}

export const Route = createFileRoute("/blog/$slug")({
  head: ({ params }) => {
    const slug = params.slug;
    const title = slug
      .split("-")
      .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
    return {
      meta: [
        { title: `${title} | airesumi Career Blog` },
        { name: "description", content: `Read our guide on ${title.toLowerCase()}. Expert career advice and resume tips from airesumi.` },
        { property: "og:title", content: `${title} | airesumi Career Blog` },
        { property: "og:description", content: `Expert career advice on ${title.toLowerCase()} from airesumi.` },
        { property: "og:url", content: `https://airesumi.com/blog/${slug}` },
        { property: "og:type", content: "article" },
        { property: "og:image", content: "https://airesumi.com/og-image.webp" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: `${title} | airesumi Career Blog` },
      ],
      links: [{ rel: "canonical", href: `https://airesumi.com/blog/${slug}` }],
    };
  },
  component: BlogPostPage,
});
