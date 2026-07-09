import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Check, X, ArrowRight, Sparkles } from "lucide-react";

const COMPETITOR = {
  name: "Kickresume",
  slug: "kickresume",
  site: "kickresume.com",
};

const PATH = "/compare/airesumi-vs-kickresume";
const URL = `https://airesumi.com${PATH}`;
const TITLE = "Airesumi vs Kickresume (2026): Honest Side-by-Side Comparison";
const DESCRIPTION =
  "Compare Airesumi and Kickresume on pricing, free PDF export, AI writing, ATS features, and templates. An honest 2026 breakdown to help you pick the right AI resume builder.";

const ROWS: Array<{ feature: string; Airesumi: string; competitor: string }> = [
  {
    feature: "Free tier — resumes",
    Airesumi: "Unlimited resumes on the free plan.",
    competitor: "Unlimited resumes, but only 4 basic templates on free.",
  },
  {
    feature: "Free formatted PDF",
    Airesumi: "Yes — PDF export on free (with watermark).",
    competitor: "No — free tier is limited to a watermark-free PNG preview and a text-only DOCX. Formatted PDF requires Premium.",
  },
  {
    feature: "Paid pricing",
    Airesumi: "$9/mo · $59/yr ($4.92/mo effective) · $99 lifetime one-time.",
    competitor: "Starts from ~$8/month on annual billing; monthly plans are significantly higher (~$19–24/month).",
  },
  {
    feature: "Templates",
    Airesumi: "12 premium templates on Pro; standard templates on free.",
    competitor: "40+ templates on Premium; only 4 basic resume templates on free.",
  },
  {
    feature: "AI writing",
    Airesumi: "AI bullet writer and summary generator that accept a job description and tailor content to it.",
    competitor: "AI Resume Writer & Cover Letter Writer (GPT-4.1), but per multiple reviews it does not accept a job description as input, so it can't tailor to a specific posting.",
  },
  {
    feature: "ATS checker",
    Airesumi: "Dedicated ATS checker + keyword scanner (free-tier access).",
    competitor: "ATS Resume Checker — Premium only.",
  },
  {
    feature: "Content library",
    Airesumi: "AI-generated bullets and summaries tailored per job description.",
    competitor: "20,000+ pre-written phrases and 1,500+ resume examples (free).",
  },
  {
    feature: "Extras",
    Airesumi: "LinkedIn bio, salary analyzer, interview prep, cover letter, resignation letter — all in one toolkit.",
    competitor: "Personal website builder (7 templates), Career Map, mobile app — Premium only.",
  },
  {
    feature: "Standout feature",
    Airesumi: "Free formatted PDF export + JD-tailored AI + $99 lifetime plan.",
    competitor: "Design-forward templates, huge phrase library, and bundled personal website builder.",
  },
  {
    feature: "Public rating",
    Airesumi: "—",
    competitor: "~4.6/5 on Trustpilot (2026). ~8M users, founded 2014, EU-based (GDPR compliant).",
  },
];

function Page() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full bg-[#F8FAFC] dark:bg-[#0a0a0a]">
      <article className="max-w-4xl mx-auto px-6 py-16">
        <header className="mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-[#FF6321] bg-orange-50 dark:bg-orange-500/10 px-3 py-1 rounded-full mb-4">
            <Sparkles size={14} /> Honest comparison · Updated 2026
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#1a202c] dark:text-orange-50 leading-tight mb-4">
            Airesumi vs {COMPETITOR.name}: which AI resume builder should you use?
          </h1>
          <p className="text-lg text-[#4a5568] dark:text-orange-100/70 leading-relaxed">
            This comparison is for job seekers deciding between{" "}
            <strong>Airesumi</strong> — a free, AI-first resume toolkit with
            job-description-tailored writing — and{" "}
            <strong>{COMPETITOR.name}</strong>, an established design-forward
            resume builder with ~8 million users and a large phrase library.
            We stick to publicly verifiable facts from each vendor's own
            pricing pages so you can decide based on what each product
            actually offers today.
          </p>
        </header>

        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-[#1a202c] dark:text-orange-50 mb-6">
            Feature-by-feature comparison
          </h2>
          <div className="overflow-x-auto border border-[#e2e8f0] dark:border-white/10 rounded-2xl">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#f8fafc] dark:bg-white/5">
                <tr>
                  <th className="p-4 font-semibold text-[#1a202c] dark:text-orange-50 w-1/4">Feature</th>
                  <th className="p-4 font-semibold text-[#FF6321]">Airesumi</th>
                  <th className="p-4 font-semibold text-[#1a202c] dark:text-orange-50">{COMPETITOR.name}</th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map((r, i) => (
                  <tr key={r.feature} className={i % 2 === 0 ? "bg-white dark:bg-transparent" : "bg-[#fafbfc] dark:bg-white/[0.02]"}>
                    <td className="p-4 font-medium text-[#2d3748] dark:text-orange-50 align-top">{r.feature}</td>
                    <td className="p-4 text-[#4a5568] dark:text-orange-100/70 align-top">{r.Airesumi}</td>
                    <td className="p-4 text-[#4a5568] dark:text-orange-100/70 align-top">{r.competitor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-[#718096] dark:text-orange-100/50 mt-3">
            Facts about {COMPETITOR.name} are drawn from its public pricing
            page at {COMPETITOR.site} and independent 2026 reviews. Pricing
            (especially monthly vs annual) varies by region and promotion —
            check the vendor's site for the latest terms before subscribing.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-[#1a202c] dark:text-orange-50 mb-4 flex items-center gap-2">
            <Check className="text-green-600" size={22} />
            When Airesumi might be the better fit
          </h2>
          <ul className="space-y-3 text-[#4a5568] dark:text-orange-100/70 leading-relaxed">
            <li><strong>You want a real formatted PDF on the free plan.</strong> Kickresume's free tier only gives a PNG preview and a text-only DOCX — a formatted PDF requires Premium.</li>
            <li><strong>You want AI that tailors to a specific job description.</strong> Airesumi's bullet writer and summary generator take a JD and rewrite your content to match; Kickresume's AI writer does not accept a JD as input.</li>
            <li><strong>You want ATS scoring for free.</strong> Kickresume's ATS Resume Checker is Premium-only.</li>
            <li><strong>You want a cheaper lifetime option.</strong> Airesumi is $99 lifetime one-time; Kickresume charges recurring Premium ~$8/mo (annual) up to ~$19–24/mo (monthly).</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-[#1a202c] dark:text-orange-50 mb-4 flex items-center gap-2">
            <X className="text-[#4a5568]" size={22} />
            When {COMPETITOR.name} might be the better fit
          </h2>
          <ul className="space-y-3 text-[#4a5568] dark:text-orange-100/70 leading-relaxed">
            <li><strong>You want strong visual/design variety.</strong> Kickresume ships 40+ design-forward templates with deep color and font customization on Premium.</li>
            <li><strong>You want a bundled personal website builder.</strong> Premium includes 7 website templates so your resume and portfolio site live in the same account.</li>
            <li><strong>You lean on pre-written phrase libraries.</strong> 20,000+ curated phrases and 1,500+ example resumes are available even on the free plan.</li>
            <li><strong>You value an established EU-based brand.</strong> Kickresume was founded in 2014, is headquartered in Slovakia (GDPR compliant), has ~8M users, and holds a ~4.6/5 Trustpilot rating.</li>
            <li><strong>You want a native mobile app.</strong> Kickresume ships an iOS/Android app for Premium users; Airesumi is a web app.</li>
          </ul>
          <p className="text-sm text-[#718096] dark:text-orange-100/50 mt-4 italic">
            Bottom line: if you want free formatted PDFs, JD-tailored AI
            writing, and a cheaper lifetime plan, Airesumi is the stronger
            pick. If design variety, a bundled website builder, and a large
            phrase library matter most, {COMPETITOR.name} is a reasonable
            choice.
          </p>
        </section>

        {/* Compare other tools */}
        <section className="mb-12 border-t border-[#e2e8f0] dark:border-white/10 pt-8">
          <h2 className="text-xl font-semibold text-[#1a202c] dark:text-orange-50 mb-4">Compare other tools</h2>
          <ul className="space-y-2 text-[#4a5568] dark:text-orange-100/70">
            <li>
              <Link to="/compare/airesumi-vs-zety" className="text-[#FF6321] hover:underline">Airesumi vs Zety →</Link>{" "}
              — how Airesumi compares to Zety's paid-PDF model.
            </li>
            <li>
              <Link to="/compare/airesumi-vs-rezi" className="text-[#FF6321] hover:underline">Airesumi vs Rezi →</Link>{" "}
              — how Airesumi compares to Rezi's 23-point ATS score and lifetime plan.
            </li>
          </ul>
        </section>

        <section className="bg-gradient-to-br from-[#FF6321] to-[#e5541a] rounded-2xl p-8 md:p-10 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Try Airesumi free — real PDF export, no credit card</h2>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto">
            Build an ATS-optimized resume, generate a matching cover letter,
            and scan it against any job description. Download the PDF for free.
          </p>
          <Link to="/resume" className="inline-flex items-center gap-2 bg-white text-[#FF6321] font-semibold px-6 py-3 rounded-xl hover:bg-orange-50 transition-colors">
            Build my resume free <ArrowRight size={18} />
          </Link>
        </section>
      </article>
    </motion.div>
  );
}

export const Route = createFileRoute("/compare/airesumi-vs-kickresume")({
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
          author: { "@type": "Organization", name: "Airesumi" },
          publisher: {
            "@type": "Organization",
            name: "Airesumi",
            logo: { "@type": "ImageObject", url: "https://airesumi.com/assets/ai-resumi-DYjBNKey.webp" },
          },
          mainEntityOfPage: URL,
          about: [
            { "@type": "SoftwareApplication", name: "Airesumi", url: "https://airesumi.com/" },
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
            { "@type": "ListItem", position: 3, name: "Airesumi vs Kickresume", item: URL },
          ],
        }),
      },
    ],
  }),
  component: Page,
});
