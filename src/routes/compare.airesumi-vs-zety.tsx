import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Check, X, ArrowRight, Sparkles } from "lucide-react";

const COMPETITOR = {
  name: "Zety",
  slug: "zety",
  site: "zety.com",
};

const PATH = "/compare/airesumi-vs-zety";
const URL = `https://airesumi.com${PATH}`;
const TITLE = "airesumi vs Zety (2026): Honest Side-by-Side Comparison";
const DESCRIPTION =
  "Compare airesumi and Zety on pricing, ATS features, templates, and download limits. An honest 2026 breakdown to help you pick the right AI resume builder.";

// Facts sourced from each product's own public pricing/help pages.
// Update if the vendors change their public terms.
const ROWS: Array<{ feature: string; airesumi: string; competitor: string }> = [
  {
    feature: "Free tier",
    airesumi: "Free to build & download PDF resumes. 3 free AI credits for premium tools.",
    competitor: "Free to build a resume, but downloading as PDF requires a paid plan (Zety's public pricing page).",
  },
  {
    feature: "Paid pricing (entry)",
    airesumi: "Pro plans available; one-time and subscription options on the /premium page.",
    competitor: "Publicly advertises a 14-day trial that auto-renews into a monthly subscription (~$23.70/4 weeks per Zety's site).",
  },
  {
    feature: "ATS optimization",
    airesumi: "Dedicated ATS checker, keyword scanner, and job-description-tailored bullet writer.",
    competitor: "Content suggestions and pre-written examples; no standalone ATS score tool on the free tier.",
  },
  {
    feature: "Templates",
    airesumi: "Multiple ATS-safe templates with configurable QR placement and sizing.",
    competitor: "Large template library marketed on the homepage; premium templates behind paid plan.",
  },
  {
    feature: "Download restrictions",
    airesumi: "PDF download available on the free tier without a subscription.",
    competitor: "PDF download gated behind trial/subscription per Zety's public pricing.",
  },
  {
    feature: "AI writing",
    airesumi: "AI bullet writer, summary generator, cover letter, and LinkedIn bio — job-description aware.",
    competitor: "Pre-written phrase suggestions and content library; AI assist depends on plan tier.",
  },
  {
    feature: "Standout feature",
    airesumi: "All-in-one free AI toolkit: ATS checker, keyword scanner, cover letter, LinkedIn bio, salary analyzer, interview prep.",
    competitor: "Mature content library and example database built over years of operation.",
  },
];

function Page() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full bg-[#F8FAFC] dark:bg-[#0a0a0a]"
    >
      <article className="max-w-4xl mx-auto px-6 py-16">
        {/* Header */}
        <header className="mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-[#FF6321] bg-orange-50 dark:bg-orange-500/10 px-3 py-1 rounded-full mb-4">
            <Sparkles size={14} /> Honest comparison · Updated 2026
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#1a202c] dark:text-orange-50 leading-tight mb-4">
            airesumi vs {COMPETITOR.name}: which AI resume builder should you use?
          </h1>
          <p className="text-lg text-[#4a5568] dark:text-orange-100/70 leading-relaxed">
            This comparison is for job seekers deciding between{" "}
            <strong>airesumi</strong> — a free, AI-first resume toolkit — and{" "}
            <strong>{COMPETITOR.name}</strong>, one of the most established
            paid resume builders on the web. We stick to publicly verifiable
            facts from each vendor's own pricing and help pages, so you can
            decide based on what each product actually offers today.
          </p>
        </header>

        {/* Comparison table */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-[#1a202c] dark:text-orange-50 mb-6">
            Feature-by-feature comparison
          </h2>
          <div className="overflow-x-auto border border-[#e2e8f0] dark:border-white/10 rounded-2xl">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#f8fafc] dark:bg-white/5">
                <tr>
                  <th className="p-4 font-semibold text-[#1a202c] dark:text-orange-50 w-1/4">Feature</th>
                  <th className="p-4 font-semibold text-[#FF6321]">airesumi</th>
                  <th className="p-4 font-semibold text-[#1a202c] dark:text-orange-50">{COMPETITOR.name}</th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map((r, i) => (
                  <tr
                    key={r.feature}
                    className={
                      i % 2 === 0
                        ? "bg-white dark:bg-transparent"
                        : "bg-[#fafbfc] dark:bg-white/[0.02]"
                    }
                  >
                    <td className="p-4 font-medium text-[#2d3748] dark:text-orange-50 align-top">
                      {r.feature}
                    </td>
                    <td className="p-4 text-[#4a5568] dark:text-orange-100/70 align-top">
                      {r.airesumi}
                    </td>
                    <td className="p-4 text-[#4a5568] dark:text-orange-100/70 align-top">
                      {r.competitor}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-[#718096] dark:text-orange-100/50 mt-3">
            Facts about {COMPETITOR.name} are drawn from its public pricing and
            help pages at {COMPETITOR.site}. Pricing and features may change —
            check the vendor's site for the latest terms before subscribing.
          </p>
        </section>

        {/* When to choose airesumi */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-[#1a202c] dark:text-orange-50 mb-4 flex items-center gap-2">
            <Check className="text-green-600" size={22} />
            When to choose airesumi
          </h2>
          <ul className="space-y-3 text-[#4a5568] dark:text-orange-100/70 leading-relaxed">
            <li>
              <strong>You want to download a real PDF for free.</strong>{" "}
              airesumi does not gate PDF export behind a trial or subscription.
            </li>
            <li>
              <strong>You want AI tools beyond the resume itself:</strong> ATS
              checker, keyword scanner, cover letter generator, LinkedIn bio,
              salary analyzer, and interview prep — all in one place.
            </li>
            <li>
              <strong>You tailor per application.</strong> airesumi's bullet
              writer and summary generator take a job description and rewrite
              your content to match it.
            </li>
            <li>
              <strong>You dislike auto-renewing trials.</strong> There is no
              14-day trial that quietly rebills — plans and credits are
              transparent on the /premium page.
            </li>
          </ul>
        </section>

        {/* When Zety might be better */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-[#1a202c] dark:text-orange-50 mb-4 flex items-center gap-2">
            <X className="text-[#4a5568]" size={22} />
            When {COMPETITOR.name} might be a better fit
          </h2>
          <ul className="space-y-3 text-[#4a5568] dark:text-orange-100/70 leading-relaxed">
            <li>
              <strong>You want the largest possible template gallery.</strong>{" "}
              {COMPETITOR.name} has been around for years and ships a broad
              catalog of resume and cover-letter designs.
            </li>
            <li>
              <strong>You prefer pre-written phrase libraries over AI
              rewriting.</strong> {COMPETITOR.name} leans heavily on curated
              example bullets you can click to insert.
            </li>
            <li>
              <strong>You value brand familiarity.</strong> {COMPETITOR.name}{" "}
              is one of the most recognized names in the resume-builder space
              and has extensive career-advice content.
            </li>
          </ul>
          <p className="text-sm text-[#718096] dark:text-orange-100/50 mt-4 italic">
            Bottom line: if you need PDF downloads without a subscription and
            a full AI job-search toolkit, airesumi is the stronger pick. If
            you want the deepest template library and don't mind a paid
            subscription, {COMPETITOR.name} is a reasonable choice.
          </p>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-br from-[#FF6321] to-[#e5541a] rounded-2xl p-8 md:p-10 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Try airesumi free — no credit card, no trial trap
          </h2>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto">
            Build an ATS-optimized resume, generate a matching cover letter,
            and scan it against any job description. Download the PDF for free.
          </p>
          <Link
            to="/resume"
            className="inline-flex items-center gap-2 bg-white text-[#FF6321] font-semibold px-6 py-3 rounded-xl hover:bg-orange-50 transition-colors"
          >
            Build my resume free <ArrowRight size={18} />
          </Link>
        </section>
      </article>
    </motion.div>
  );
}

export const Route = createFileRoute("/compare/airesumi-vs-zety")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: URL },
      { property: "og:type", content: "article" },
      { property: "og:image", content: "https://airesumi.com/og-image.webp" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
      { name: "twitter:url", content: URL },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: TITLE,
          description: DESCRIPTION,
          author: { "@type": "Organization", name: "airesumi" },
          publisher: {
            "@type": "Organization",
            name: "airesumi",
            logo: {
              "@type": "ImageObject",
              url: "https://airesumi.com/assets/ai-resumi-DYjBNKey.webp",
            },
          },
          mainEntityOfPage: URL,
          about: [
            { "@type": "SoftwareApplication", name: "airesumi", url: "https://airesumi.com/" },
            { "@type": "SoftwareApplication", name: COMPETITOR.name, url: `https://${COMPETITOR.site}/` },
          ],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://airesumi.com/" },
            { "@type": "ListItem", position: 2, name: "Compare", item: "https://airesumi.com/compare" },
            { "@type": "ListItem", position: 3, name: "airesumi vs Zety", item: URL },
          ],
        }),
      },
    ],
  }),
  component: Page,
});
