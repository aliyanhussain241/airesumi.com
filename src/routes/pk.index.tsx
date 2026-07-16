import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, MapPin, Sparkles } from "lucide-react";
import { listPkGuides, type PkGuideSummary } from "@/lib/pk-guides.functions";

const CANONICAL = "https://airesumi.com/pk";

const CATEGORY_LABELS: Record<string, string> = {
  resume: "Resume Format",
  portals: "Job Portals",
  gulf: "Gulf & Middle East",
  fresher: "Fresh Graduates",
  interview: "Interview Prep",
};

function PkHubPage() {
  const guides = Route.useLoaderData() as PkGuideSummary[];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <section className="pt-app-header bg-gradient-to-br from-[#FFF7ED] via-white to-[#F8FAFC] border-b border-[#E5E7EB]">
        <div className="max-w-5xl mx-auto px-6 py-10 md:py-14">
          <nav className="text-sm text-[#6B7280] mb-4" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-[#FF6321] no-underline">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-[#111827]">Pakistan</span>
          </nav>
          <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wide font-semibold text-[#FF6321] bg-white border border-[#FF6321]/20 px-3 py-1 rounded-full mb-3">
            <MapPin size={12} /> Pakistan Career Hub
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-[#111827] leading-tight tracking-tight">
            Career & Resume Guides for Pakistan
          </h1>
          <p className="text-lg text-[#4B5563] mt-4 max-w-3xl">
            Locally accurate resume, job portal, and interview advice for the Pakistani job market — plus tips
            for Pakistanis applying to jobs in the UAE, Saudi Arabia, Qatar and beyond.
          </p>
        </div>
      </section>

      <main className="max-w-5xl mx-auto px-6 py-10">
        {guides.length === 0 ? (
          <p className="text-[#6B7280]">No guides published yet.</p>
        ) : (
          <ul className="grid md:grid-cols-2 gap-5">
            {guides.map((g) => (
              <li key={g.slug}>
                <Link
                  to="/pk/$slug"
                  params={{ slug: g.slug }}
                  className="block h-full bg-white rounded-2xl p-6 shadow-sm border border-[#E5E7EB] hover:border-[#FF6321]/30 hover:shadow-md transition-all no-underline"
                >
                  <span className="inline-block text-xs uppercase tracking-wide font-semibold text-[#FF6321] mb-2">
                    {CATEGORY_LABELS[g.category] || g.category}
                  </span>
                  <h2 className="text-xl font-bold text-[#111827] mb-2 leading-snug">{g.title}</h2>
                  {g.subtitle && <p className="text-sm text-[#4B5563] mb-4 leading-relaxed">{g.subtitle}</p>}
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#FF6321]">
                    Read guide <ArrowRight size={14} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-12 bg-white rounded-2xl p-7 border border-[#E5E7EB] flex flex-col md:flex-row md:items-center gap-4 md:justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#111827]">Ready to build your CV?</h2>
            <p className="text-sm text-[#4B5563] mt-1">Free ATS-safe templates tuned for the Pakistani job market.</p>
          </div>
          <Link
            to="/resume"
            className="inline-flex items-center justify-center gap-2 bg-[#FF6321] hover:bg-orange-600 text-white font-semibold px-5 py-3 rounded-xl no-underline transition-colors shadow-sm"
          >
            <Sparkles size={16} /> Start free
          </Link>
        </div>
      </main>
    </div>
  );
}

export const Route = createFileRoute("/pk/")({
  loader: () => listPkGuides(),
  head: () => {
    const title = "Career & Resume Guides for Pakistan | Airesumi";
    const description =
      "Locally accurate resume, job portal (Rozee.pk), interview and Gulf job guides for the Pakistani job market.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { name: "robots", content: "index, follow" },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: CANONICAL },
        { property: "og:locale", content: "en_PK" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
      ],
      links: [{ rel: "canonical", href: CANONICAL }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://airesumi.com/" },
              { "@type": "ListItem", position: 2, name: "Pakistan", item: CANONICAL },
            ],
          }),
        },
      ],
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
  notFoundComponent: () => <div className="p-10 text-center">Page not found.</div>,
  component: PkHubPage,
});
