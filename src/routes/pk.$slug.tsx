import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, HelpCircle, MapPin, Sparkles } from "lucide-react";
import { getPkGuideWithRelated, type PkGuideWithRelated } from "@/lib/pk-guides.functions";

function PkGuidePage() {
  const data = Route.useLoaderData() as PkGuideWithRelated;
  const { slug } = Route.useParams();

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="pt-app-header flex-1 flex items-center justify-center p-6 text-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Guide not found</h1>
            <p className="text-[#6B7280] mb-6">We couldn't find a Pakistan guide for "{slug}".</p>
            <Link to="/pk" className="inline-flex items-center gap-2 text-[#FF6321] font-semibold no-underline hover:underline">
              Browse all Pakistan guides <ArrowRight size={16} />
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const { guide, related } = data;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Hero */}
      <section className="pt-app-header bg-gradient-to-br from-[#FFF7ED] via-white to-[#F8FAFC] border-b border-[#E5E7EB]">
        <div className="max-w-4xl mx-auto px-6 py-8 md:py-12">
          <nav className="text-sm text-[#6B7280] mb-4" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-[#FF6321] no-underline">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/pk" className="hover:text-[#FF6321] no-underline">Pakistan</Link>
            <span className="mx-2">/</span>
            <span className="text-[#111827]">{guide.title}</span>
          </nav>
          <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wide font-semibold text-[#FF6321] bg-white border border-[#FF6321]/20 px-3 py-1 rounded-full mb-3">
            <MapPin size={12} /> Pakistan
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-[#111827] leading-tight tracking-tight">
            {guide.title}
          </h1>
          {guide.subtitle && (
            <p className="text-lg text-[#4B5563] mt-4 max-w-3xl leading-relaxed">{guide.subtitle}</p>
          )}
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-6 py-10">
        {guide.hero_intro && (
          <section className="mb-8">
            <p className="text-lg text-[#374151] leading-relaxed">{guide.hero_intro}</p>
          </section>
        )}

        {guide.sections.map((s, i) => (
          <section key={i} className="bg-white rounded-2xl p-7 shadow-sm border border-[#E5E7EB] mb-6">
            <h2 className="text-2xl font-bold text-[#111827] mb-3 leading-snug">{s.heading}</h2>
            {s.content && <p className="text-[#374151] leading-relaxed mb-4">{s.content}</p>}
            {s.bullets && s.bullets.length > 0 && (
              <ul className="space-y-3">
                {s.bullets.map((b, j) => (
                  <li key={j} className="flex gap-3">
                    <CheckCircle2 size={18} className="text-green-600 flex-shrink-0 mt-1" />
                    <span className="text-[#374151] leading-relaxed">{b}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}

        {/* CTA */}
        {guide.cta_href && guide.cta_label && (
          <section className="bg-gradient-to-br from-[#FFF7ED] to-white rounded-2xl p-7 border border-[#FF6321]/20 mb-8 flex flex-col md:flex-row md:items-center gap-4 md:justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#111827]">{guide.cta_label}</h2>
              <p className="text-sm text-[#4B5563] mt-1">Free, ATS-safe, and tuned for the Pakistani market.</p>
            </div>
            <Link
              to={guide.cta_href}
              className="inline-flex items-center justify-center gap-2 bg-[#FF6321] hover:bg-orange-600 text-white font-semibold px-5 py-3 rounded-xl no-underline transition-colors shadow-sm whitespace-nowrap"
            >
              <Sparkles size={16} /> Get started
            </Link>
          </section>
        )}

        {/* FAQs */}
        {guide.faqs.length > 0 && (
          <section className="bg-white rounded-2xl p-7 shadow-sm border border-[#E5E7EB] mb-8">
            <div className="flex items-center gap-2 mb-4">
              <HelpCircle size={20} className="text-[#FF6321]" />
              <h2 className="text-2xl font-bold text-[#111827]">Frequently Asked Questions</h2>
            </div>
            <div className="divide-y divide-[#E5E7EB]">
              {guide.faqs.map((f, i) => (
                <details key={i} className="py-4 group">
                  <summary className="cursor-pointer font-semibold text-[#111827] list-none flex justify-between items-start gap-4">
                    <span>{f.q}</span>
                    <span className="text-[#FF6321] text-xl leading-none group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <p className="text-[#4B5563] leading-relaxed mt-3">{f.a}</p>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* Related */}
        {related.length > 0 && (
          <section className="mb-4">
            <h2 className="text-xl font-bold text-[#111827] mb-4">More Pakistan guides</h2>
            <ul className="grid md:grid-cols-3 gap-4">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link
                    to="/pk/$slug"
                    params={{ slug: r.slug }}
                    className="block h-full bg-white rounded-xl p-5 border border-[#E5E7EB] hover:border-[#FF6321]/30 hover:shadow-sm transition-all no-underline"
                  >
                    <h3 className="font-semibold text-[#111827] leading-snug mb-1">{r.title}</h3>
                    {r.subtitle && <p className="text-sm text-[#6B7280] leading-relaxed line-clamp-2">{r.subtitle}</p>}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
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
        <p className="text-sm text-[#6B7280]">{error.message}</p>
      </div>
    </div>
  ),
  notFoundComponent: () => <div className="p-10 text-center">Guide not found.</div>,
  component: PkGuidePage,
});
