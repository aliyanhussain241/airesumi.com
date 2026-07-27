import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useState } from "react";
import {
  ArrowRight, CheckCircle2, Sparkles, FileText, Copy, Check, Lightbulb,
} from "lucide-react";

import {
  getCoverLetterExampleWithRelated,
  type CoverLetterWithRelated,
} from "@/lib/cover-letter-examples.functions";

function CoverLetterExamplePage() {
  const data = Route.useLoaderData() as CoverLetterWithRelated;
  const { slug } = Route.useParams();
  const [copied, setCopied] = useState(false);

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 flex items-center justify-center p-6 text-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Cover letter example not found</h1>
            <p className="text-[#6B7280] mb-6">
              We couldn't find a cover letter example for "{slug}".
            </p>
            <Link
              to="/cover-letter-examples"
              className="inline-flex items-center gap-2 text-[#FF6321] font-semibold no-underline hover:underline"
            >
              Browse all cover letter examples <ArrowRight size={16} />
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const { example, related } = data;

  const copyLetter = async () => {
    try {
      await navigator.clipboard.writeText(example.example_letter);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Hero */}
      <section className="pt-app-header bg-gradient-to-br from-[#FFF7ED] via-white to-[#F8FAFC] border-b border-[#E5E7EB]">
        <div className="max-w-4xl mx-auto px-6 py-8 md:py-12">
          <nav className="text-sm text-[#6B7280] mb-5" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-[#FF6321] no-underline">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/cover-letter-examples" className="hover:text-[#FF6321] no-underline">
              Cover Letter Examples
            </Link>
            <span className="mx-2">/</span>
            <span className="text-[#111827]">{example.job_title}</span>
          </nav>

          {example.industry && (
            <span className="inline-block text-xs uppercase tracking-wide font-semibold text-[#FF6321] bg-white border border-[#FF6321]/20 px-3 py-1 rounded-full mb-3">
              {example.industry}
            </span>
          )}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black text-[#111827] leading-tight tracking-tight"
          >
            {example.job_title} Cover Letter Example
          </motion.h1>
          {example.intro_content && (
            <p className="mt-5 text-lg text-[#374151] leading-relaxed max-w-3xl">
              {example.intro_content}
            </p>
          )}
        </div>
      </section>

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl mx-auto px-6 py-10"
      >
        {/* Example letter card */}
        <section className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] mb-8 overflow-hidden">
          <div className="flex items-center justify-between gap-3 px-6 py-4 border-b border-[#E5E7EB] bg-[#FFF7ED]/50">
            <div className="flex items-center gap-2">
              <FileText size={18} className="text-[#FF6321]" />
              <h2 className="text-lg font-bold text-[#111827]">Example Cover Letter</h2>
            </div>
            <button
              onClick={copyLetter}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                copied
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-[#FF6321] text-white hover:bg-orange-600"
              }`}
              aria-label="Copy cover letter"
            >
              {copied ? <Check size={15} /> : <Copy size={15} />}
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <div className="px-6 py-6">
            <pre className="whitespace-pre-wrap font-sans text-[15px] leading-relaxed text-[#1F2937]">
              {example.example_letter}
            </pre>
          </div>
        </section>

        {/* Key tips */}
        {example.key_tips.length > 0 && (
          <section className="bg-white rounded-2xl p-7 shadow-sm border border-[#E5E7EB] mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb size={20} className="text-[#FF6321]" />
              <h2 className="text-2xl font-bold text-[#111827]">Key Tips</h2>
            </div>
            <ul className="space-y-3">
              {example.key_tips.map((tip, i) => (
                <li key={i} className="flex gap-3">
                  <CheckCircle2 size={18} className="text-green-600 flex-shrink-0 mt-1" />
                  <span className="text-[#374151] leading-relaxed">{tip}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* CTA */}
        <section className="bg-gradient-to-br from-[#111827] to-[#1F2937] rounded-2xl p-8 text-center text-white mb-10">
          <h2 className="text-2xl font-bold mb-2">
            Ready to build the rest of your application?
          </h2>
          <p className="text-[#9CA3AF] mb-5">
            Generate a tailored cover letter and resume in minutes — free to start.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Link
              to="/cover-letter"
              className="inline-flex items-center gap-2 bg-[#FF6321] hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-xl no-underline transition-colors w-full sm:w-auto justify-center"
            >
              <Sparkles size={16} /> Build my cover letter
            </Link>
            <Link
              to="/resume"
              className="inline-block bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-xl no-underline transition-colors w-full sm:w-auto"
            >
              Build my resume
            </Link>
          </div>
        </section>

        {/* More examples */}
        {related.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-[#111827] mb-5">More Cover Letter Examples</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  to="/cover-letter-examples/$slug"
                  params={{ slug: r.slug }}
                  className="block bg-white p-5 rounded-xl border border-[#E5E7EB] hover:border-[#FF6321] hover:shadow-md transition-all no-underline"
                >
                  {r.industry && (
                    <span className="text-[10px] uppercase tracking-wide font-semibold text-[#FF6321]">
                      {r.industry}
                    </span>
                  )}
                  <h3 className="mt-1 font-bold text-[#111827]">
                    {r.job_title} Cover Letter
                  </h3>
                  {r.seo_description && (
                    <p className="mt-1 text-xs text-[#6B7280] line-clamp-2">{r.seo_description}</p>
                  )}
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#FF6321]">
                    View example <ArrowRight size={12} />
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </motion.main>
    </div>
  );
}

export const Route = createFileRoute("/cover-letter-examples/$slug")({
  loader: ({ params }) => getCoverLetterExampleWithRelated({ data: { slug: params.slug } }),
  head: ({ loaderData, params }) => {
    const data = loaderData as CoverLetterWithRelated;
    if (!data) {
      return {
        meta: [
          { title: "Cover Letter Example Not Found | Airesumi" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { example } = data;
    const title =
      example.seo_title ?? `${example.job_title} Cover Letter Example | Airesumi`;
    const description =
      example.seo_description ??
      `Free ${example.job_title} cover letter example. Copy, customize, and download in minutes.`;
    const url = `https://airesumi.com/cover-letter-examples/${params.slug}`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
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
              {
                "@type": "ListItem",
                position: 3,
                name: `${example.job_title} Cover Letter Example`,
                item: url,
              },
            ],
          }),
        },
      ],
    };
  },
  errorComponent: ({ error }) => (
    <div className="p-10 text-center">
      <h1 className="text-2xl font-bold mb-2">Unable to load this example</h1>
      <p className="text-sm text-[#6B7280]">{error.message}</p>
    </div>
  ),
  notFoundComponent: () => (
    <div className="p-10 text-center">
      <h1 className="text-2xl font-bold mb-2">Example not found</h1>
      <Link to="/cover-letter-examples" className="text-[#FF6321] font-semibold">
        Browse all cover letter examples
      </Link>
    </div>
  ),
  component: CoverLetterExamplePage,
});
