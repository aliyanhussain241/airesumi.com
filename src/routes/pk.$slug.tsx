import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  ArrowUp,
  CheckCircle2,
  Clock,
  Copy,
  HelpCircle,
  Link as LinkIcon,
  List,
  MapPin,
  Printer,
  Share2,
  Sparkles,
} from "lucide-react";
import { getPkGuideWithRelated, type PkGuideWithRelated } from "@/lib/pk-guides.functions";

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function PkGuidePage() {
  const data = Route.useLoaderData() as PkGuideWithRelated;
  const { slug } = Route.useParams();

  const [progress, setProgress] = useState(0);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showTop, setShowTop] = useState(false);

  const sectionIds = useMemo(
    () => (data?.guide.sections ?? []).map((s, i) => `${slugify(s.heading)}-${i}`),
    [data]
  );

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const total = h.scrollHeight - h.clientHeight;
      setProgress(total > 0 ? Math.min(100, (h.scrollTop / total) * 100) : 0);
      setShowTop(h.scrollTop > 600);

      let current: string | null = null;
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top < 140) current = id;
      }
      setActiveId(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [sectionIds]);

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="pt-app-header flex-1 flex items-center justify-center p-6 text-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Guide not found</h1>
            <p className="text-[#6B7280] dark:text-slate-400 mb-6">
              We couldn't find a Pakistan guide for "{slug}".
            </p>
            <Link
              to="/pk"
              className="inline-flex items-center gap-2 text-[#FF6321] font-semibold no-underline hover:underline"
            >
              Browse all Pakistan guides <ArrowRight size={16} />
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const { guide, related } = data;

  // Reading time
  const wordCount =
    (guide.hero_intro?.split(/\s+/).length ?? 0) +
    guide.sections.reduce(
      (acc, s) =>
        acc +
        (s.content?.split(/\s+/).length ?? 0) +
        (s.bullets?.reduce((b, x) => b + x.split(/\s+/).length, 0) ?? 0),
      0
    ) +
    guide.faqs.reduce((acc, f) => acc + f.q.split(/\s+/).length + f.a.split(/\s+/).length, 0);
  const readingMin = Math.max(3, Math.round(wordCount / 220));
  const lastUpdated = new Date(guide.updated_at).toLocaleDateString("en-PK", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const shareUrl = `https://airesumi.com/pk/${slug}`;
  const shareTitle = guide.title;

  async function handleShare() {
    if (typeof navigator !== "undefined" && (navigator as any).share) {
      try {
        await (navigator as any).share({ title: shareTitle, url: shareUrl });
        return;
      } catch {}
    }
    handleCopy();
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {}
  }

  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 96;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950">
      {/* Reading progress */}
      <div className="fixed top-0 left-0 right-0 h-1 z-40 bg-transparent pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-[#FF6321] to-orange-500 transition-[width] duration-150"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Hero */}
      <section className="pt-app-header bg-gradient-to-br from-[#FFF7ED] via-white to-[#F8FAFC] dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 border-b border-[#E5E7EB] dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-6 py-8 md:py-14">
          <nav className="text-sm text-[#6B7280] dark:text-slate-400 mb-4" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-[#FF6321] no-underline">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/pk" className="hover:text-[#FF6321] no-underline">Pakistan</Link>
            <span className="mx-2">/</span>
            <span className="text-[#111827] dark:text-slate-100">{guide.title}</span>
          </nav>

          <div className="flex flex-wrap gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wide font-semibold text-[#FF6321] bg-white dark:bg-slate-900 border border-[#FF6321]/20 px-3 py-1 rounded-full">
              <MapPin size={12} /> Pakistan
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#4B5563] dark:text-slate-400 bg-white dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800 px-3 py-1 rounded-full">
              <Clock size={12} /> {readingMin} min read
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#4B5563] dark:text-slate-400 bg-white dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800 px-3 py-1 rounded-full">
              Updated {lastUpdated}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-[#111827] dark:text-slate-100 leading-tight tracking-tight max-w-4xl">
            {guide.title}
          </h1>
          {guide.subtitle && (
            <p className="text-lg text-[#4B5563] dark:text-slate-400 mt-4 max-w-3xl leading-relaxed">
              {guide.subtitle}
            </p>
          )}

          {/* Share row */}
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-2 text-sm font-medium px-3.5 py-2 rounded-lg border border-[#E5E7EB] dark:border-slate-800 bg-white dark:bg-slate-900 text-[#111827] dark:text-slate-100 hover:border-[#FF6321]/40 transition-colors"
            >
              <Share2 size={14} /> Share
            </button>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-2 text-sm font-medium px-3.5 py-2 rounded-lg border border-[#E5E7EB] dark:border-slate-800 bg-white dark:bg-slate-900 text-[#111827] dark:text-slate-100 hover:border-[#FF6321]/40 transition-colors"
            >
              {copied ? <CheckCircle2 size={14} className="text-green-600" /> : <LinkIcon size={14} />}
              {copied ? "Copied" : "Copy link"}
            </button>
            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium px-3.5 py-2 rounded-lg border border-[#E5E7EB] dark:border-slate-800 bg-white dark:bg-slate-900 text-[#111827] dark:text-slate-100 hover:border-[#FF6321]/40 transition-colors no-underline"
            >
              X / Twitter
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium px-3.5 py-2 rounded-lg border border-[#E5E7EB] dark:border-slate-800 bg-white dark:bg-slate-900 text-[#111827] dark:text-slate-100 hover:border-[#FF6321]/40 transition-colors no-underline"
            >
              LinkedIn
            </a>
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareTitle + " " + shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium px-3.5 py-2 rounded-lg border border-[#E5E7EB] dark:border-slate-800 bg-white dark:bg-slate-900 text-[#111827] dark:text-slate-100 hover:border-[#FF6321]/40 transition-colors no-underline"
            >
              WhatsApp
            </a>
            <button
              onClick={() => typeof window !== "undefined" && window.print()}
              className="inline-flex items-center gap-2 text-sm font-medium px-3.5 py-2 rounded-lg border border-[#E5E7EB] dark:border-slate-800 bg-white dark:bg-slate-900 text-[#111827] dark:text-slate-100 hover:border-[#FF6321]/40 transition-colors"
            >
              <Printer size={14} /> Print
            </button>
          </div>
        </div>
      </section>

      {/* Content grid */}
      <div className="max-w-6xl mx-auto px-6 py-10 grid lg:grid-cols-[minmax(0,1fr)_260px] gap-10">
        <main className="min-w-0">
          {guide.hero_intro && (
            <section className="mb-8">
              <div className="border-l-4 border-[#FF6321] pl-5 py-2">
                <p className="text-lg text-[#374151] dark:text-slate-300 leading-relaxed">
                  {guide.hero_intro}
                </p>
              </div>
            </section>
          )}

          {/* Mobile TOC */}
          {guide.sections.length > 1 && (
            <details className="lg:hidden mb-6 bg-white dark:bg-slate-900 rounded-xl border border-[#E5E7EB] dark:border-slate-800 p-4">
              <summary className="cursor-pointer font-semibold text-[#111827] dark:text-slate-100 flex items-center gap-2 list-none">
                <List size={16} className="text-[#FF6321]" /> On this page
              </summary>
              <ol className="mt-3 space-y-2 text-sm">
                {guide.sections.map((s, i) => {
                  const id = `${slugify(s.heading)}-${i}`;
                  return (
                    <li key={id}>
                      <button
                        onClick={() => scrollToId(id)}
                        className="text-left text-[#4B5563] dark:text-slate-400 hover:text-[#FF6321] transition-colors"
                      >
                        {i + 1}. {s.heading}
                      </button>
                    </li>
                  );
                })}
              </ol>
            </details>
          )}

          {guide.sections.map((s, i) => {
            const id = `${slugify(s.heading)}-${i}`;
            return (
              <section
                key={i}
                id={id}
                className="bg-white dark:bg-slate-900 rounded-2xl p-7 shadow-sm border border-[#E5E7EB] dark:border-slate-800 mb-6 scroll-mt-24"
              >
                <div className="flex items-start gap-3 mb-3">
                  <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#FF6321]/10 text-[#FF6321] font-bold text-sm flex items-center justify-center">
                    {i + 1}
                  </span>
                  <h2 className="text-2xl font-bold text-[#111827] dark:text-slate-100 leading-snug">
                    {s.heading}
                  </h2>
                </div>
                {s.content && (
                  <p className="text-[#374151] dark:text-slate-300 leading-relaxed mb-4">
                    {s.content}
                  </p>
                )}
                {s.bullets && s.bullets.length > 0 && (
                  <ul className="space-y-3">
                    {s.bullets.map((b, j) => (
                      <li key={j} className="flex gap-3">
                        <CheckCircle2 size={18} className="text-green-600 flex-shrink-0 mt-1" />
                        <span className="text-[#374151] dark:text-slate-300 leading-relaxed">{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            );
          })}

          {/* CTA */}
          {guide.cta_href && guide.cta_label && (
            <section className="relative overflow-hidden bg-gradient-to-br from-[#FF6321] to-orange-600 rounded-2xl p-8 mb-8 text-white shadow-lg">
              <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
              <div className="relative flex flex-col md:flex-row md:items-center gap-4 md:justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{guide.cta_label}</h2>
                  <p className="text-sm text-white/85 mt-1">
                    Free, ATS-safe, and tuned for the Pakistani market.
                  </p>
                </div>
                <Link
                  to={guide.cta_href}
                  className="inline-flex items-center justify-center gap-2 bg-white text-[#FF6321] font-semibold px-5 py-3 rounded-xl no-underline transition-transform hover:scale-[1.02] whitespace-nowrap shadow"
                >
                  <Sparkles size={16} /> Get started
                </Link>
              </div>
            </section>
          )}

          {/* FAQs */}
          {guide.faqs.length > 0 && (
            <section className="bg-white dark:bg-slate-900 rounded-2xl p-7 shadow-sm border border-[#E5E7EB] dark:border-slate-800 mb-8">
              <div className="flex items-center gap-2 mb-4">
                <HelpCircle size={20} className="text-[#FF6321]" />
                <h2 className="text-2xl font-bold text-[#111827] dark:text-slate-100">
                  Frequently Asked Questions
                </h2>
              </div>
              <div className="divide-y divide-[#E5E7EB] dark:divide-slate-800">
                {guide.faqs.map((f, i) => (
                  <details key={i} className="py-4 group">
                    <summary className="cursor-pointer font-semibold text-[#111827] dark:text-slate-100 list-none flex justify-between items-start gap-4">
                      <span>{f.q}</span>
                      <span className="text-[#FF6321] text-xl leading-none group-open:rotate-45 transition-transform">
                        +
                      </span>
                    </summary>
                    <p className="text-[#4B5563] dark:text-slate-400 leading-relaxed mt-3">{f.a}</p>
                  </details>
                ))}
              </div>
            </section>
          )}

          {/* Related */}
          {related.length > 0 && (
            <section className="mb-4">
              <h2 className="text-xl font-bold text-[#111827] dark:text-slate-100 mb-4">
                More Pakistan guides
              </h2>
              <ul className="grid md:grid-cols-3 gap-4">
                {related.map((r) => (
                  <li key={r.slug}>
                    <Link
                      to="/pk/$slug"
                      params={{ slug: r.slug }}
                      className="group block h-full bg-white dark:bg-slate-900 rounded-xl p-5 border border-[#E5E7EB] dark:border-slate-800 hover:border-[#FF6321]/40 hover:shadow-md transition-all no-underline"
                    >
                      <h3 className="font-semibold text-[#111827] dark:text-slate-100 leading-snug mb-1 group-hover:text-[#FF6321] transition-colors">
                        {r.title}
                      </h3>
                      {r.subtitle && (
                        <p className="text-sm text-[#6B7280] dark:text-slate-400 leading-relaxed line-clamp-2">
                          {r.subtitle}
                        </p>
                      )}
                      <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#FF6321]">
                        Read guide <ArrowRight size={12} />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </main>

        {/* Desktop TOC */}
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            {guide.sections.length > 1 && (
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-[#E5E7EB] dark:border-slate-800 p-5 mb-4">
                <div className="flex items-center gap-2 mb-3 text-[#111827] dark:text-slate-100 font-semibold text-sm">
                  <List size={14} className="text-[#FF6321]" /> On this page
                </div>
                <ol className="space-y-2 text-sm">
                  {guide.sections.map((s, i) => {
                    const id = `${slugify(s.heading)}-${i}`;
                    const active = activeId === id;
                    return (
                      <li key={id}>
                        <button
                          onClick={() => scrollToId(id)}
                          className={`text-left w-full leading-snug transition-colors border-l-2 pl-3 py-1 ${
                            active
                              ? "text-[#FF6321] border-[#FF6321] font-medium"
                              : "text-[#4B5563] dark:text-slate-400 border-transparent hover:text-[#FF6321]"
                          }`}
                        >
                          {s.heading}
                        </button>
                      </li>
                    );
                  })}
                </ol>
              </div>
            )}

            <div className="bg-gradient-to-br from-[#FFF7ED] to-white dark:from-slate-900 dark:to-slate-950 rounded-xl border border-[#FF6321]/20 p-5">
              <div className="text-xs uppercase tracking-wide font-semibold text-[#FF6321] mb-2">
                Build yours
              </div>
              <p className="text-sm text-[#374151] dark:text-slate-300 leading-relaxed mb-3">
                Turn this guide into an ATS-ready CV in minutes.
              </p>
              <Link
                to="/resume"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#FF6321] no-underline hover:underline"
              >
                Open the builder <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </aside>
      </div>

      {/* Back to top */}
      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
          className="fixed bottom-6 right-6 z-40 w-11 h-11 rounded-full bg-[#FF6321] text-white shadow-lg hover:bg-orange-600 transition-colors flex items-center justify-center"
        >
          <ArrowUp size={18} />
        </button>
      )}
    </div>
  );
}

export const Route = createFileRoute("/pk/$slug")({
  loader: async ({ params }) => getPkGuideWithRelated({ data: { slug: params.slug } }),
  head: ({ params, loaderData }) => {
    const slug = params.slug;
    const url = `https://airesumi.com/pk/${slug}`;
    const guide = loaderData?.guide ?? null;
    if (!guide) {
      return {
        meta: [
          { title: "Guide not found | Airesumi" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const title = guide.seo_title || `${guide.title} | Airesumi`;
    const description = guide.seo_description || guide.subtitle || guide.title;
    const scripts: any[] = [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: guide.title,
          description,
          url,
          inLanguage: "en-PK",
          author: { "@type": "Organization", name: "Airesumi" },
          publisher: { "@type": "Organization", name: "Airesumi" },
          datePublished: guide.created_at,
          dateModified: guide.updated_at,
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://airesumi.com/" },
            { "@type": "ListItem", position: 2, name: "Pakistan", item: "https://airesumi.com/pk" },
            { "@type": "ListItem", position: 3, name: guide.title, item: url },
          ],
        }),
      },
    ];
    if (guide.faqs.length > 0) {
      scripts.push({
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: guide.faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      });
    }
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { name: "robots", content: "index, follow" },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { property: "og:locale", content: "en_PK" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts,
    };
  },
  errorComponent: ({ error }) => (
    <div className="min-h-screen flex items-center justify-center p-6 text-center">
      <div>
        <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
        <p className="text-sm text-[#6B7280] dark:text-slate-400">{error.message}</p>
      </div>
    </div>
  ),
  notFoundComponent: () => <div className="p-10 text-center">Guide not found.</div>,
  component: PkGuidePage,
});

// Ignore unused import guard for future icon use
void Copy;
