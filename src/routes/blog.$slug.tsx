import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { motion, useScroll, useSpring } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  BookOpen, Clock, Calendar, ArrowRight, ArrowLeft, Share2, Twitter, Linkedin,
  Facebook, Link as LinkIcon, Check, Bookmark, ChevronUp, List,
} from "lucide-react";

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

const slugifyHeading = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const renderMarkdown = (md: string) => {
  const html = md
    .replace(/^### (.+)$/gm, (_m, t) => `<h3 id="${slugifyHeading(t)}" class="text-xl font-bold mt-8 mb-3 text-[#111827] scroll-mt-24">${t}</h3>`)
    .replace(/^## (.+)$/gm, (_m, t) => `<h2 id="${slugifyHeading(t)}" class="text-2xl font-bold mt-10 mb-4 text-[#111827] scroll-mt-24">${t}</h2>`)
    .replace(/^# (.+)$/gm, (_m, t) => `<h1 id="${slugifyHeading(t)}" class="text-3xl font-bold mt-8 mb-4 text-[#111827] scroll-mt-24">${t}</h1>`)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/_(.+?)_/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, '<code class="bg-[#F3F4F6] px-1.5 py-0.5 rounded text-sm font-mono text-[#DC2626]">$1</code>')
    .replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-[#FF6321] pl-4 italic text-[#6B7280] my-4">$1</blockquote>')
    .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc text-[#374151]">$1</li>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-[#FF6321] underline" target="_blank" rel="noopener noreferrer">$1</a>')
    .replace(/!\[(.+?)\]\((.+?)\)/g, '<img src="$2" alt="$1" class="rounded-xl w-full my-6"/>')
    .replace(/^---$/gm, '<hr class="my-8 border-[#E5E7EB]"/>')
    .replace(/\n\n/g, '</p><p class="text-[#374151] leading-relaxed mb-4">')
    .replace(/\n/g, "<br/>");
  return `<p class="text-[#374151] leading-relaxed mb-4">${html}</p>`;
};

const extractHeadings = (md: string) => {
  const lines = md.split("\n");
  const out: { level: number; text: string; id: string }[] = [];
  for (const l of lines) {
    const m2 = l.match(/^## (.+)$/);
    const m3 = l.match(/^### (.+)$/);
    if (m2) out.push({ level: 2, text: m2[1], id: slugifyHeading(m2[1]) });
    else if (m3) out.push({ level: 3, text: m3[1], id: slugifyHeading(m3[1]) });
  }
  return out;
};

function BlogPost() {
  const { slug } = Route.useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [related, setRelated] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [activeHeading, setActiveHeading] = useState<string>("");
  const [showTop, setShowTop] = useState(false);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

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
      .then(async ({ data, error }) => {
        if (error || !data) {
          setNotFound(true);
          setLoading(false);
          return;
        }
        const p = data as Post;
        setPost(p);
        setLoading(false);
        // Related — same category, exclude self
        if (p.category) {
          const { data: rel } = await (supabase
            .from("blog_posts") as any)
            .select("*")
            .eq("published", true)
            .eq("category", p.category)
            .neq("id", p.id)
            .order("published_at", { ascending: false })
            .limit(3);
          setRelated((rel as Post[]) || []);
        } else {
          const { data: rel } = await supabase
            .from("blog_posts")
            .select("*")
            .eq("published", true)
            .neq("id", p.id)
            .order("published_at", { ascending: false })
            .limit(3);
          setRelated((rel as Post[]) || []);
        }
      });
  }, [slug]);

  // Bookmark state
  useEffect(() => {
    if (!post) return;
    try {
      const marks = JSON.parse(localStorage.getItem("blog_bookmarks") || "[]");
      setBookmarked(marks.includes(post.slug));
    } catch { /* noop */ }
  }, [post]);

  const toggleBookmark = () => {
    if (!post) return;
    try {
      const marks: string[] = JSON.parse(localStorage.getItem("blog_bookmarks") || "[]");
      const next = marks.includes(post.slug) ? marks.filter(s => s !== post.slug) : [...marks, post.slug];
      localStorage.setItem("blog_bookmarks", JSON.stringify(next));
      setBookmarked(next.includes(post.slug));
    } catch { /* noop */ }
  };

  const headings = useMemo(() => (post ? extractHeadings(post.content) : []), [post]);

  // Active heading tracking
  useEffect(() => {
    if (!headings.length) return;
    const onScroll = () => {
      let current = headings[0]?.id || "";
      for (const h of headings) {
        const el = document.getElementById(h.id);
        if (el && el.getBoundingClientRect().top < 120) current = h.id;
      }
      setActiveHeading(current);
      setShowTop(window.scrollY > 600);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [headings]);

  const shareUrl = typeof window !== "undefined" ? window.location.href : `https://airesumi.com/blog/${slug}`;
  const shareText = post?.title || "Great read from airesumi";

  const share = (target: "twitter" | "linkedin" | "facebook") => {
    const u = encodeURIComponent(shareUrl);
    const t = encodeURIComponent(shareText);
    const urls = {
      twitter: `https://twitter.com/intent/tweet?url=${u}&text=${t}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${u}`,
    } as const;
    window.open(urls[target], "_blank", "noopener,noreferrer,width=600,height=500");
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* noop */ }
  };

  if (loading) {
    return (
      <div className="min-h-screen liquid-bg flex items-center justify-center pt-[68px]">
        <div className="animate-spin w-10 h-10 border-4 border-[#FF6321] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="min-h-screen liquid-bg flex items-center justify-center px-6 pt-[68px]">
        <div className="text-center">
          <BookOpen size={56} className="text-[#FF6321]/30 mx-auto mb-4" />
          <h1 className="text-2xl font-black text-[#111827] mb-2">Post Not Found</h1>
          <p className="text-[#6B7280] mb-6">This article doesn't exist or has been unpublished.</p>
          <button
            onClick={() => navigate({ to: "/blog" })}
            className="px-6 py-3 bg-[#FF6321] text-white rounded-xl font-semibold text-sm hover:bg-orange-600 transition-all"
          >
            ← Back to Blog
          </button>
        </div>
      </div>
    );
  }

  const wordCount = post.content.split(/\s+/).filter(Boolean).length;
  const readTime = post.read_time || Math.max(1, Math.ceil(wordCount / 200));
  const publishDate = post.published_at || post.created_at;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.seo_title || post.title,
    "description": post.seo_description || post.excerpt || "",
    "datePublished": publishDate,
    "dateModified": publishDate,
    "author": { "@type": "Organization", "name": "Airesumi", "url": "https://airesumi.com" },
    "publisher": {
      "@type": "Organization", "name": "Airesumi", "url": "https://airesumi.com",
      "logo": { "@type": "ImageObject", "url": "https://airesumi.com/favicon.webp" },
    },
    "url": `https://airesumi.com/blog/${post.slug}`,
    ...(post.cover_image_url ? { "image": post.cover_image_url } : {}),
    "wordCount": wordCount,
  };

  const faqMatches = [...post.content.matchAll(/\*\*Q[:\d.]\s*(.+?)\*\*[\s\S]*?\n(.+?)(?=\n\*\*Q|\n##|$)/g)];
  const faqSchema = faqMatches.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqMatches.map(m => ({
      "@type": "Question", "name": m[1].trim(),
      "acceptedAnswer": { "@type": "Answer", "text": m[2].trim() },
    })),
  } : null;

  return (
    <div className="min-h-screen liquid-bg pt-[68px]">
      {/* Reading progress bar */}
      <motion.div
        className="fixed top-[68px] left-0 right-0 h-1 bg-gradient-to-r from-[#FF6321] to-orange-400 origin-left z-40"
        style={{ scaleX: progress }}
      />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      {faqSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}

      <div className="max-w-7xl mx-auto px-6 py-10 relative z-10 grid lg:grid-cols-[1fr_260px] gap-10">
        {/* ─── ARTICLE ─── */}
        <div className="max-w-3xl w-full mx-auto lg:mx-0">
          <button
            onClick={() => navigate({ to: "/blog" })}
            className="liquid-pill inline-flex items-center gap-2 text-sm text-[#374151] hover:text-[#FF6321] mb-6 px-4 py-2 rounded-full"
          >
            <span className="liquid-card-shine" />
            <span className="liquid-card-content inline-flex items-center gap-2"><ArrowLeft size={14}/> Back to Blog</span>
          </button>

          {post.cover_image_url && (
            <motion.img
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              src={post.cover_image_url}
              alt={post.title}
              className="w-full h-72 md:h-96 object-cover rounded-3xl mb-8 shadow-xl"
            />
          )}

          <div className="liquid-card rounded-3xl p-8 md:p-10">
            <span className="liquid-card-shine" />
            <div className="liquid-card-content">
              {/* Meta */}
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                {post.category && (
                  <span className="text-xs bg-[#FFF7ED] text-[#FF6321] px-3 py-1 rounded-full font-semibold uppercase tracking-wide">
                    {post.category}
                  </span>
                )}
                <span className="text-sm text-[#9CA3AF] inline-flex items-center gap-1.5"><Clock size={13}/> {readTime} min read</span>
                {publishDate && (
                  <span className="text-sm text-[#9CA3AF] inline-flex items-center gap-1.5">
                    <Calendar size={13}/> {new Date(publishDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#111827] mb-4 leading-tight tracking-tight">
                {post.title}
              </h1>

              {post.excerpt && <p className="text-lg md:text-xl text-[#6B7280] mb-6 leading-relaxed">{post.excerpt}</p>}

              {/* Author + Actions strip */}
              <div className="flex items-center justify-between gap-4 py-4 border-y border-[#F3F4F6] mb-8 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF6321] to-orange-600 flex items-center justify-center text-white font-black text-sm">A</div>
                  <div>
                    <div className="text-sm font-bold text-[#111827]">Airesumi Team</div>
                    <div className="text-xs text-[#9CA3AF]">Career experts &amp; AI engineers</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={toggleBookmark}
                    aria-label={bookmarked ? "Remove bookmark" : "Bookmark article"}
                    className={`p-2 rounded-full border transition-all ${bookmarked ? "bg-[#FF6321] border-[#FF6321] text-white" : "bg-white border-[#E5E7EB] text-[#6B7280] hover:text-[#FF6321] hover:border-[#FF6321]"}`}>
                    <Bookmark size={16} className={bookmarked ? "fill-white" : ""}/>
                  </button>
                  <button onClick={() => share("twitter")} aria-label="Share on X"
                    className="p-2 rounded-full border border-[#E5E7EB] text-[#6B7280] bg-white hover:text-[#FF6321] hover:border-[#FF6321] transition-all">
                    <Twitter size={16}/>
                  </button>
                  <button onClick={() => share("linkedin")} aria-label="Share on LinkedIn"
                    className="p-2 rounded-full border border-[#E5E7EB] text-[#6B7280] bg-white hover:text-[#FF6321] hover:border-[#FF6321] transition-all">
                    <Linkedin size={16}/>
                  </button>
                  <button onClick={() => share("facebook")} aria-label="Share on Facebook"
                    className="p-2 rounded-full border border-[#E5E7EB] text-[#6B7280] bg-white hover:text-[#FF6321] hover:border-[#FF6321] transition-all">
                    <Facebook size={16}/>
                  </button>
                  <button onClick={copyLink} aria-label="Copy link"
                    className="p-2 rounded-full border border-[#E5E7EB] text-[#6B7280] bg-white hover:text-[#FF6321] hover:border-[#FF6321] transition-all">
                    {copied ? <Check size={16} className="text-green-600"/> : <LinkIcon size={16}/>}
                  </button>
                </div>
              </div>

              {/* Mobile TOC (collapsed) */}
              {headings.length > 2 && (
                <details className="lg:hidden mb-6 bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl p-4">
                  <summary className="font-bold text-sm text-[#111827] cursor-pointer flex items-center gap-2">
                    <List size={14}/> Table of contents
                  </summary>
                  <ul className="mt-3 space-y-2">
                    {headings.map(h => (
                      <li key={h.id} className={h.level === 3 ? "pl-4" : ""}>
                        <a href={`#${h.id}`} className="text-sm text-[#374151] hover:text-[#FF6321]">{h.text}</a>
                      </li>
                    ))}
                  </ul>
                </details>
              )}

              {/* Content */}
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
              />

              {/* Tags */}
              {post.tags && (
                <div className="mt-10 pt-6 border-t border-[#F3F4F6] flex flex-wrap gap-2">
                  {post.tags.split(",").map((tag, i) => (
                    <Link key={i} to="/blog" search={{ q: tag.trim() } as never}
                      className="text-xs bg-[#F3F4F6] hover:bg-[#FF6321] hover:text-white text-[#6B7280] px-3 py-1.5 rounded-full transition-all">
                      #{tag.trim()}
                    </Link>
                  ))}
                </div>
              )}

              {/* Share footer */}
              <div className="mt-10 pt-6 border-t border-[#F3F4F6]">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <p className="text-sm text-[#6B7280] inline-flex items-center gap-2 font-medium">
                    <Share2 size={14}/> Found this helpful? Share it.
                  </p>
                  <div className="flex items-center gap-2">
                    <button onClick={() => share("twitter")} className="px-3 py-1.5 text-xs bg-black text-white rounded-full inline-flex items-center gap-1.5 hover:opacity-80"><Twitter size={12}/> Tweet</button>
                    <button onClick={() => share("linkedin")} className="px-3 py-1.5 text-xs bg-[#0A66C2] text-white rounded-full inline-flex items-center gap-1.5 hover:opacity-90"><Linkedin size={12}/> Post</button>
                    <button onClick={copyLink} className="px-3 py-1.5 text-xs bg-[#F3F4F6] text-[#374151] rounded-full inline-flex items-center gap-1.5 hover:bg-[#E5E7EB]">
                      {copied ? <><Check size={12} className="text-green-600"/> Copied</> : <><LinkIcon size={12}/> Copy</>}
                    </button>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="mt-10 pt-8 border-t border-[#F3F4F6]">
                <div className="bg-gradient-to-r from-[#FFF7ED] to-orange-50 rounded-2xl p-6 text-center">
                  <p className="text-lg font-bold text-[#111827] mb-2">Ready to build your resume with AI?</p>
                  <p className="text-sm text-[#6B7280] mb-4">ATS-optimized, tailored to your job — free to start.</p>
                  <Link to="/resume"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF6321] text-white rounded-xl font-semibold text-sm hover:bg-orange-600 transition-all no-underline"
                  >
                    Build My Resume Free <ArrowRight size={14}/>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* ─── RELATED POSTS ─── */}
          {related.length > 0 && (
            <section className="mt-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-[#111827]">Keep reading</h2>
                <Link to="/blog" className="text-sm font-semibold text-[#FF6321] hover:underline no-underline inline-flex items-center gap-1">
                  All articles <ArrowRight size={13}/>
                </Link>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {related.map(r => (
                  <Link key={r.id} to="/blog/$slug" params={{ slug: r.slug }}
                    className="liquid-card rounded-2xl overflow-hidden group no-underline">
                    <span className="liquid-card-shine"/>
                    <div className="liquid-card-content">
                      <div className="h-40 overflow-hidden">
                        {r.cover_image_url
                          ? <img src={r.cover_image_url} alt={r.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
                          : <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center"><BookOpen size={32} className="text-[#FF6321]/40"/></div>}
                      </div>
                      <div className="p-5">
                        {r.category && (
                          <span className="text-[10px] bg-[#FFF7ED] text-[#FF6321] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide">{r.category}</span>
                        )}
                        <h3 className="mt-2 font-bold text-base text-[#111827] line-clamp-2 group-hover:text-[#FF6321] transition-colors leading-snug">{r.title}</h3>
                        {r.read_time && <p className="mt-2 text-xs text-[#9CA3AF] inline-flex items-center gap-1"><Clock size={10}/> {r.read_time} min read</p>}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* ─── STICKY TOC SIDEBAR (desktop) ─── */}
        {headings.length > 1 && (
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-6">
              <div className="liquid-card rounded-2xl">
                <span className="liquid-card-shine"/>
                <div className="liquid-card-content p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <List size={14} className="text-[#FF6321]"/>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-[#111827]">On this page</h3>
                  </div>
                  <ul className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
                    {headings.map(h => (
                      <li key={h.id} className={h.level === 3 ? "pl-3" : ""}>
                        <a
                          href={`#${h.id}`}
                          className={`block text-sm leading-snug py-1 border-l-2 pl-3 transition-colors ${
                            activeHeading === h.id
                              ? "border-[#FF6321] text-[#FF6321] font-semibold"
                              : "border-transparent text-[#6B7280] hover:text-[#111827]"
                          }`}
                        >
                          {h.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Compact CTA */}
              <div className="liquid-card rounded-2xl">
                <span className="liquid-card-shine"/>
                <div className="liquid-card-content p-5 text-center bg-gradient-to-br from-[#FFF7ED]/60 to-orange-100/40 rounded-2xl">
                  <p className="text-sm font-bold text-[#111827] mb-1">Try airesumi free</p>
                  <p className="text-xs text-[#6B7280] mb-3">AI resume in 60 seconds.</p>
                  <Link to="/resume" className="block w-full bg-[#111827] hover:bg-[#FF6321] text-white text-xs font-semibold py-2 rounded-xl transition-all no-underline">
                    Start now →
                  </Link>
                </div>
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* Back-to-top */}
      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
          className="fixed bottom-6 right-6 z-40 w-11 h-11 rounded-full bg-[#FF6321] text-white shadow-xl hover:bg-orange-600 transition-all flex items-center justify-center"
        >
          <ChevronUp size={18}/>
        </button>
      )}
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
        { title: `${title} | Airesumi Career Blog` },
        {
          name: "description",
          content: `Read our guide on ${title.toLowerCase()}. Expert career advice, resume tips, and job search strategies from Airesumi.`,
        },
        { name: "robots", content: "index, follow" },
        { property: "og:title", content: `${title} | Airesumi Career Blog` },
        {
          property: "og:description",
          content: `Read our guide on ${title.toLowerCase()}. Expert career advice from Airesumi.`,
        },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `https://airesumi.com/blog/${slug}` },
        { property: "og:image", content: "https://airesumi.com/og-image.webp" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: `${title} | Airesumi Career Blog` },
      ],
      links: [{ rel: "canonical", href: `https://airesumi.com/blog/${slug}` }],
    };
  },
  component: function Page() {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <BlogPost />
      </motion.div>
    );
  },
});
