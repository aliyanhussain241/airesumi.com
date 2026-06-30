import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { BookOpen } from "lucide-react";

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

const renderMarkdown = (md: string) => {
  const html = md
    .replace(/^### (.+)$/gm, '<h3 class="text-xl font-bold mt-6 mb-2 text-[#111827]">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-2xl font-bold mt-8 mb-3 text-[#111827]">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-3xl font-bold mt-8 mb-4 text-[#111827]">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/_(.+?)_/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, '<code class="bg-[#F3F4F6] px-1.5 py-0.5 rounded text-sm font-mono text-[#DC2626]">$1</code>')
    .replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-[#FF6321] pl-4 italic text-[#6B7280] my-4">$1</blockquote>')
    .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc text-[#374151]">$1</li>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-[#FF6321] underline" target="_blank" rel="noopener noreferrer">$1</a>')
    .replace(/!\[(.+?)\]\((.+?)\)/g, '<img src="$2" alt="$1" class="rounded-xl w-full my-4"/>')
    .replace(/^---$/gm, '<hr class="my-6 border-[#E5E7EB]"/>')
    .replace(/\n\n/g, '</p><p class="text-[#374151] leading-relaxed mb-4">')
    .replace(/\n/g, "<br/>");
  return `<p class="text-[#374151] leading-relaxed mb-4">${html}</p>`;
};

function BlogPost() {
  const { slug } = Route.useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          setNotFound(true);
        } else {
          setPost(data as Post);
        }
        setLoading(false);
      });
  }, [slug]);

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

  // Build JSON-LD schema
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.seo_title || post.title,
    "description": post.seo_description || post.excerpt || "",
    "datePublished": post.published_at || post.created_at,
    "dateModified": post.published_at || post.created_at,
    "author": {
      "@type": "Organization",
      "name": "Airesumi",
      "url": "https://airesumi.com"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Airesumi",
      "url": "https://airesumi.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://airesumi.com/favicon.webp"
      }
    },
    "url": `https://airesumi.com/blog/${post.slug}`,
    ...(post.cover_image_url ? { "image": post.cover_image_url } : {}),
  };

  // FAQPage schema — auto-extracted from ## Q: / ## A: or standard FAQ section if present
  const faqMatches = [...post.content.matchAll(/\*\*Q[:\d.]\s*(.+?)\*\*[\s\S]*?\n(.+?)(?=\n\*\*Q|\n##|$)/g)];
  const faqSchema = faqMatches.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqMatches.map(m => ({
      "@type": "Question",
      "name": m[1].trim(),
      "acceptedAnswer": {
        "@type": "Answer",
        "text": m[2].trim()
      }
    }))
  } : null;

  return (
    <div className="min-h-screen liquid-bg pt-[68px]">
      {/* Inject schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <div className="max-w-3xl mx-auto px-6 py-12 relative z-10">
        {/* Back button */}
        <button
          onClick={() => navigate({ to: "/blog" })}
          className="liquid-pill inline-flex items-center gap-2 text-sm text-[#374151] hover:text-[#FF6321] mb-8 px-4 py-2 rounded-full"
        >
          <span className="liquid-card-shine" />
          <span className="liquid-card-content inline-flex items-center gap-2">← Back to Blog</span>
        </button>

        {/* Cover image */}
        {post.cover_image_url && (
          <img
            src={post.cover_image_url}
            alt={post.title}
            className="w-full h-72 object-cover rounded-3xl mb-8 shadow-xl"
          />
        )}

        {/* Article card */}
        <div className="liquid-card rounded-3xl p-8 md:p-10">
          <span className="liquid-card-shine" />
          <div className="liquid-card-content">
            {/* Meta */}
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              {post.category && (
                <span className="text-xs bg-[#FFF7ED] text-[#FF6321] px-3 py-1 rounded-full font-medium">
                  {post.category}
                </span>
              )}
              {post.read_time && (
                <span className="text-sm text-[#9CA3AF]">{post.read_time} min read</span>
              )}
              {post.published_at && (
                <span className="text-sm text-[#9CA3AF]">
                  {new Date(post.published_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-4xl font-black text-[#111827] mb-4 leading-tight">{post.title}</h1>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-xl text-[#6B7280] mb-8 leading-relaxed">{post.excerpt}</p>
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
                  <span
                    key={i}
                    className="text-xs bg-[#F3F4F6] text-[#6B7280] px-3 py-1 rounded-full"
                  >
                    #{tag.trim()}
                  </span>
                ))}
              </div>
            )}

            {/* CTA */}
            <div className="mt-10 pt-8 border-t border-[#F3F4F6]">
              <div className="bg-gradient-to-r from-[#FFF7ED] to-orange-50 rounded-2xl p-6 text-center">
                <p className="text-lg font-bold text-[#111827] mb-2">
                  Ready to build your resume with AI?
                </p>
                <p className="text-sm text-[#6B7280] mb-4">
                  ATS-optimized, tailored to your job — free to start.
                </p>
                <a
                  href="/"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF6321] text-white rounded-xl font-semibold text-sm hover:bg-orange-600 transition-all"
                >
                  Build My Resume Free →
                </a>
              </div>
            </div>
          </div>
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
