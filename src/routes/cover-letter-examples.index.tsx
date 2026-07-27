import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import {
  ArrowRight, Briefcase, CheckCircle2, Filter, Search, Sparkles, X, FileText, Zap, LayoutGrid,
} from "lucide-react";

import {
  getPublishedCoverLetterExamples,
  type CoverLetterSummary,
} from "@/lib/cover-letter-examples.functions";

const INDUSTRY_META: Record<string, { color: string; bg: string }> = {
  All: { color: "#FF6321", bg: "#FFF1EA" },
  "All Industries": { color: "#7C3AED", bg: "#F3EEFF" },
  Technology: { color: "#2563EB", bg: "#DBEAFE" },
};
const defaultMeta = { color: "#6B7280", bg: "#F3F4F6" };

const FAQ = [
  {
    q: "Are these cover letter examples really free?",
    a: "Yes. Every example is free to copy, customize, and download. No watermark, no paywall.",
  },
  {
    q: "How do I customize an example?",
    a: "Copy the letter, swap in your name, target company, and one measurable win, and edit the middle paragraph to match the job description.",
  },
  {
    q: "How long should a cover letter be?",
    a: "Aim for 180–300 words. Recruiters skim — three tight paragraphs almost always outperform a full page.",
  },
  {
    q: "Do I need a cover letter for every application?",
    a: "If the posting asks for one, always. Otherwise, include one whenever you're switching fields, applying to a smaller team, or you have context a resume alone can't carry.",
  },
];

function CoverLetterExamplesIndex() {
  const examples = Route.useLoaderData() as CoverLetterSummary[];
  const [industry, setIndustry] = useState<string>("All");
  const [query, setQuery] = useState("");

  const industriesWithCounts = useMemo(() => {
    const counts = new Map<string, number>();
    examples.forEach((r) => {
      if (r.industry) counts.set(r.industry, (counts.get(r.industry) ?? 0) + 1);
    });
    const list = Array.from(counts.entries()).sort((a, b) => a[0].localeCompare(b[0]));
    return [{ name: "All", count: examples.length }, ...list.map(([name, count]) => ({ name, count }))];
  }, [examples]);

  const filtered = useMemo(() => {
    return examples.filter((r) => {
      if (industry !== "All" && r.industry !== industry) return false;
      if (query && !r.job_title.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [examples, industry, query]);

  const hasActiveFilters = industry !== "All" || query.length > 0;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-6xl mx-auto px-4 py-6 sm:px-6 sm:py-12"
      >
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="mb-6 hidden text-sm text-[#6B7280] sm:block">
          <ol className="flex items-center gap-2">
            <li><Link to="/" className="hover:text-[#FF6321]">Home</Link></li>
            <li aria-hidden>/</li>
            <li className="text-[#111827] font-medium">Cover Letter Examples</li>
          </ol>
        </nav>

        <header className="text-center mb-5 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF1EA] text-[#FF6321] text-xs font-semibold mb-3 sm:mb-4">
            <FileText size={12} /> Cover letter examples
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#111827] tracking-tight">
            Free Cover Letter Examples
          </h1>
          <p className="mt-3 text-base text-[#4B5563] max-w-2xl mx-auto leading-relaxed sm:mt-5 sm:text-lg">
            Copy-and-paste templates for every situation — general, short, entry-level, career change, and role-specific examples.
          </p>

          <ul className="mt-6 hidden flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-[#374151] sm:flex">
            <li className="inline-flex items-center gap-1.5"><CheckCircle2 size={14} className="text-[#FF6321]" /> Written per situation</li>
            <li className="inline-flex items-center gap-1.5"><CheckCircle2 size={14} className="text-[#FF6321]" /> One-click copy</li>
            <li className="inline-flex items-center gap-1.5"><CheckCircle2 size={14} className="text-[#FF6321]" /> Free, no signup wall</li>
          </ul>
        </header>

        {/* Filters — sticky */}
        <div className="sm:sticky sm:top-16 z-20 bg-[#F8FAFC]/95 dark:bg-slate-950/95 backdrop-blur -mx-4 px-4 py-2 mb-4 sm:-mx-6 sm:px-6 sm:py-3 sm:mb-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-3 shadow-sm border border-[#E5E7EB] dark:border-white/10 grid grid-cols-1 gap-2 sm:rounded-2xl sm:p-4">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
              <input
                type="text"
                placeholder="Search cover letters by title..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-9 pr-9 py-2.5 border border-[#E5E7EB] dark:border-white/10 bg-white dark:bg-slate-950 text-[#111827] dark:text-white placeholder:text-[#9CA3AF] dark:placeholder:text-slate-500 rounded-lg text-sm focus:outline-none focus:border-[#FF6321]"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-[#9CA3AF] hover:text-[#FF6321]"
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          <div className="mt-2 flex items-center gap-2 overflow-x-auto pb-2 sm:mt-3 sm:flex-wrap sm:overflow-visible sm:pb-0">
            <div className="shrink-0 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#6B7280] dark:text-slate-400 pr-1">
              <Filter size={12} /> Filter
            </div>
            {industriesWithCounts.map((ind) => {
              const meta = INDUSTRY_META[ind.name] ?? defaultMeta;
              const Icon = ind.name === "All" ? LayoutGrid : Briefcase;
              const active = industry === ind.name;
              return (
                <motion.button
                  key={ind.name}
                  onClick={() => setIndustry(ind.name)}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  aria-pressed={active}
                  className={`group relative px-3 py-1.5 rounded-full text-xs font-semibold transition-all inline-flex items-center gap-2 ${
                    active
                      ? "shrink-0 text-white shadow-[0_6px_18px_-6px_rgba(255,99,33,0.55)]"
                      : "shrink-0 bg-white dark:bg-slate-900 border border-[#E5E7EB] dark:border-white/10 text-[#374151] dark:text-slate-200 hover:border-transparent hover:shadow-sm"
                  }`}
                  style={active ? { background: `linear-gradient(135deg, ${meta.color}, ${meta.color}dd)` } : undefined}
                >
                  <span
                    className="w-5 h-5 rounded-full inline-flex items-center justify-center transition-colors"
                    style={active ? { background: "rgba(255,255,255,0.22)" } : { background: meta.bg, color: meta.color }}
                  >
                    <Icon size={11} style={active ? { color: "#fff" } : undefined} />
                  </span>
                  {ind.name}
                  <span
                    className={`text-[10px] font-bold px-1.5 min-w-[18px] text-center rounded-full ${
                      active
                        ? "bg-white/25 text-white"
                        : "bg-[#F3F4F6] dark:bg-white/10 text-[#6B7280] dark:text-slate-300 group-hover:bg-[#FFF1EA] group-hover:text-[#FF6321]"
                    }`}
                  >
                    {ind.count}
                  </span>
                </motion.button>
              );
            })}
            {hasActiveFilters && (
              <button
                onClick={() => { setIndustry("All"); setQuery(""); }}
                className="ml-1 shrink-0 text-xs font-semibold text-[#FF6321] hover:underline inline-flex items-center gap-1"
              >
                <X size={12} /> Clear
              </button>
            )}
          </div>

          <div className="mt-0 text-xs text-[#6B7280] dark:text-slate-400 sm:mt-2">
            Showing <span className="font-semibold text-[#111827] dark:text-white">{filtered.length}</span> of {examples.length} examples
            {industry !== "All" && (
              <span className="ml-1">
                in <span className="font-semibold text-[#111827] dark:text-white">{industry}</span>
              </span>
            )}
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-[#E5E7EB]">
            <FileText size={36} className="mx-auto text-[#D1D5DB] mb-3" />
            <div className="font-semibold text-[#111827]">No cover letters match your filters</div>
            <p className="text-sm text-[#6B7280] mt-1">Try clearing filters or searching a different keyword.</p>
            <button
              onClick={() => { setIndustry("All"); setQuery(""); }}
              className="mt-4 px-4 py-2 rounded-lg bg-[#FF6321] text-white text-sm font-semibold hover:bg-[#e5561a]"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((r, idx) => (
              <motion.div
                key={r.slug}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: Math.min(idx * 0.02, 0.2) }}
              >
                <Link
                  to="/cover-letter-examples/$slug"
                  params={{ slug: r.slug }}
                  className="group block h-full bg-white p-6 rounded-2xl border border-[#E5E7EB] hover:border-[#FF6321] hover:shadow-md transition-all no-underline"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-[#FFF1EA] flex items-center justify-center">
                      <FileText size={14} className="text-[#FF6321]" />
                    </div>
                    {r.industry && (
                      <span className="text-[10px] uppercase tracking-wide font-semibold text-[#FF6321]">
                        {r.industry}
                      </span>
                    )}
                  </div>
                  <h2 className="font-bold text-lg text-[#111827] group-hover:text-[#FF6321] transition-colors">
                    {r.job_title} Cover Letter
                  </h2>
                  {r.seo_description && (
                    <p className="mt-2 text-sm text-[#6B7280] line-clamp-3">{r.seo_description}</p>
                  )}
                  <div className="mt-4 pt-4 border-t border-[#F3F4F6] flex items-center justify-between">
                    <span className="text-sm font-semibold text-[#FF6321] inline-flex items-center gap-1">
                      View example <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                    </span>
                    <span className="text-[10px] text-[#9CA3AF] inline-flex items-center gap-1">
                      <Zap size={10} /> Copy-ready
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* CTA */}
        <section className="mt-14 rounded-2xl bg-gradient-to-br from-[#FF6321] to-[#FF8A4C] p-8 md:p-10 text-white text-center">
          <h2 className="text-2xl md:text-3xl font-black">Want AI to write yours from scratch?</h2>
          <p className="mt-2 text-white/90 max-w-xl mx-auto">
            Paste a job description and our AI cover letter generator writes a tailored letter in under a minute.
          </p>
          <Link
            to="/cover-letter"
            className="inline-flex items-center gap-2 mt-5 px-5 py-3 rounded-xl bg-white text-[#FF6321] font-bold text-sm hover:bg-white/95 no-underline"
          >
            <Sparkles size={16} /> Generate my cover letter <ArrowRight size={16} />
          </Link>
        </section>

        {/* FAQ */}
        <section className="mt-14">
          <h2 className="text-2xl font-black text-[#111827] mb-6 text-center">Frequently asked questions</h2>
          <div className="max-w-3xl mx-auto space-y-3">
            {FAQ.map((f, i) => (
              <details key={i} className="group bg-white rounded-xl border border-[#E5E7EB] p-5 open:border-[#FF6321] transition-colors">
                <summary className="cursor-pointer font-semibold text-[#111827] flex items-center justify-between list-none">
                  <span>{f.q}</span>
                  <span className="text-[#FF6321] text-xl leading-none transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm text-[#4B5563] leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      </motion.main>
    </div>
  );
}

export const Route = createFileRoute("/cover-letter-examples/")({
  loader: () => getPublishedCoverLetterExamples(),
  head: ({ loaderData }) => {
    const examples = (loaderData ?? []) as CoverLetterSummary[];
    return {
      meta: [
        { title: "Free Cover Letter Examples & Templates | Airesumi" },
        {
          name: "description",
          content:
            "Browse free cover letter examples for every job type and situation. Copy, customize, and download in minutes.",
        },
        { property: "og:title", content: "Free Cover Letter Examples & Templates | Airesumi" },
        {
          property: "og:description",
          content:
            "Browse free cover letter examples for every job type and situation. Copy, customize, and download in minutes.",
        },
        { property: "og:type", content: "website" },
        { property: "og:url", content: "https://airesumi.com/cover-letter-examples" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: "Free Cover Letter Examples & Templates | Airesumi" },
        {
          name: "twitter:description",
          content:
            "Browse free cover letter examples for every job type and situation. Copy, customize, and download in minutes.",
        },
      ],
      links: [{ rel: "canonical", href: "https://airesumi.com/cover-letter-examples" }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Cover Letter Examples",
            url: "https://airesumi.com/cover-letter-examples",
            hasPart: examples.slice(0, 50).map((r) => ({
              "@type": "CreativeWork",
              name: `${r.job_title} Cover Letter Example`,
              url: `https://airesumi.com/cover-letter-examples/${r.slug}`,
            })),
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://airesumi.com/" },
              {
                "@type": "ListItem",
                position: 2,
                name: "Cover Letter Examples",
                item: "https://airesumi.com/cover-letter-examples",
              },
            ],
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQ.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        },
      ],
    };
  },
  errorComponent: ({ error }) => (
    <div className="p-10 text-center">
      <h1 className="text-2xl font-bold mb-2">Unable to load cover letter examples</h1>
      <p className="text-sm text-[#6B7280]">{error.message}</p>
    </div>
  ),
  component: CoverLetterExamplesIndex,
});
