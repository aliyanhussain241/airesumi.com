import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Check, X, ArrowRight, Sparkles } from "lucide-react";

const COMPETITOR = {
  name: "Rezi",
  slug: "rezi",
  site: "rezi.ai",
};

const PATH = "/compare/airesumi-vs-rezi";
const URL = `https://airesumi.com${PATH}`;
const TITLE = "Airesumi vs Rezi (2026): Honest Side-by-Side Comparison";
const DESCRIPTION =
  "Compare Airesumi and Rezi on pricing, free tier limits, ATS scoring, templates, and AI tools. An honest 2026 breakdown to help you pick the right AI resume builder.";

const ROWS: Array<{ feature: string; Airesumi: string; competitor: string }> = [
  {
    feature: "Free tier — resumes",
    Airesumi: "Unlimited resumes on the free plan.",
    competitor: "1 resume only — creating a new one overwrites the previous.",
  },
  {
    feature: "Free tier — PDF downloads",
    Airesumi: "PDF export with watermark. 3 AI generations, 3 ATS scans, 1 cover letter per month.",
    competitor: "3 PDF downloads total (lifetime cap). Unlimited DOCX and Google Drive exports.",
  },
  {
    feature: "Paid pricing",
    Airesumi: "$9/mo · $59/yr ($4.92/mo effective) · $99 lifetime one-time.",
    competitor: "$29/mo Pro · $149 lifetime one-time (breaks even ~5 months vs monthly).",
  },
  {
    feature: "ATS scoring approach",
    Airesumi: "Dedicated ATS checker + keyword scanner + JD-tailored bullet rewriter.",
    competitor: "Rezi Score — signature 23-point ATS scoring system with real-time feedback.",
  },
  {
    feature: "Templates",
    Airesumi: "12 premium templates on Pro; standard templates on free.",
    competitor: "20+ ATS-friendly templates (Modern, Standard, Compact, Bold, Alternative).",
  },
  {
    feature: "Cover letter builder",
    Airesumi: "AI cover letter generator (1/month free, unlimited on Pro).",
    competitor: "Unlimited cover letter generation, even on the free plan.",
  },
  {
    feature: "Resignation letter",
    Airesumi: "AI resignation letter builder included.",
    competitor: "Unlimited resignation letter generation on all plans.",
  },
  {
    feature: "Interview prep",
    Airesumi: "Interview prep tool included.",
    competitor: "AI interview practice tool included on Pro.",
  },
  {
    feature: "Standout feature",
    Airesumi: "All-in-one free AI toolkit: ATS checker, keyword scanner, cover letter, LinkedIn bio, salary analyzer, interview prep — plus a $99 lifetime plan.",
    competitor: "Rezi Score (23-point ATS system) — one of the most detailed real-time ATS scores available.",
  },
  {
    feature: "Public rating",
    Airesumi: "—",
    competitor: "~4.3–4.4/5 on Trustpilot (2026).",
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
            <strong>Airesumi</strong> — a free, AI-first resume toolkit with a
            $99 lifetime plan — and <strong>{COMPETITOR.name}</strong>, a
            well-known ATS-focused resume builder famous for its 23-point Rezi
            Score. We stick to publicly verifiable facts from each vendor's
            own pricing pages so you can decide based on what each product
            actually offers today.
          </p>
        </header>

        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-[#1a202c] dark:text-orange-50 mb-6">
            Feature-by-feature comparison
          </h2>
          <div className="overflow-x-auto border border-[#e2e8f0] dark:border-white/10 rounded-2xl">
            <table className="w-full min-w-[560px] text-left text-sm [<table className="w-full text-left text-sm">_td]:break-words [<table className="w-full text-left text-sm">_td]:align-top">
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
            and features may change — check the vendor's site for the latest
            terms before subscribing.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-[#1a202c] dark:text-orange-50 mb-4 flex items-center gap-2">
            <Check className="text-green-600" size={22} />
            When Airesumi might be the better fit
          </h2>
          <ul className="space-y-3 text-[#4a5568] dark:text-orange-100/70 leading-relaxed">
            <li><strong>You want unlimited resumes on the free plan.</strong> Rezi's free tier caps you at a single resume that gets overwritten.</li>
            <li><strong>You want a cheaper lifetime option.</strong> Airesumi lifetime is $99 one-time vs Rezi's $149.</li>
            <li><strong>You want a broader AI toolkit</strong> beyond the resume: LinkedIn bio, salary analyzer, keyword scanner, and JD-tailored bullet rewriting all in one place.</li>
            <li><strong>You want Pro at a lower monthly price.</strong> $9/mo vs Rezi's $29/mo — roughly a third of the cost.</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-[#1a202c] dark:text-orange-50 mb-4 flex items-center gap-2">
            <X className="text-[#4a5568]" size={22} />
            When {COMPETITOR.name} might be the better fit
          </h2>
          <ul className="space-y-3 text-[#4a5568] dark:text-orange-100/70 leading-relaxed">
            <li><strong>You want the Rezi Score specifically.</strong> The 23-point real-time ATS scoring system is Rezi's signature feature and one of the most detailed ATS scores available.</li>
            <li><strong>You need unlimited DOCX exports on the free plan.</strong> Rezi doesn't cap DOCX or Google Drive saves on free — only the 3 lifetime PDF downloads.</li>
            <li><strong>You want unlimited free cover letters.</strong> Rezi lets you generate unlimited cover and resignation letters even on the free plan.</li>
            <li><strong>You want a larger ATS-only template catalog.</strong> Rezi ships 20+ ATS-safe templates in several style families.</li>
            <li><strong>You value an established brand with public reviews.</strong> Rezi has a ~4.3–4.4/5 Trustpilot rating built over years of operation.</li>
          </ul>
          <p className="text-sm text-[#718096] dark:text-orange-100/50 mt-4 italic">
            Bottom line: if you want unlimited resumes, a broad AI toolkit,
            and a cheaper lifetime plan, Airesumi is the stronger pick. If
            the 23-point Rezi Score or unlimited free cover letters matter
            most to you, {COMPETITOR.name} is a reasonable choice.
          </p>
        </section>

        {/* Compare other tools */}
        <section className="mb-12 border-t border-[#e2e8f0] dark:border-white/10 pt-8">
          <h2 className="text-xl font-semibold text-[#1a202c] dark:text-orange-50 mb-4">Compare other tools</h2>
          <ul className="space-y-2 text-[#4a5568] dark:text-orange-100/70">
            <li>
              <Link to="/compare/airesumi-vs-zety" className="text-[#FF6321] hover:underline">
                Airesumi vs Zety →
              </Link>{" "}
              — how Airesumi stacks up against Zety's paid-PDF model.
            </li>
            <li>
              <Link to="/compare/airesumi-vs-kickresume" className="text-[#FF6321] hover:underline">
                Airesumi vs Kickresume →
              </Link>{" "}
              — how Airesumi compares to Kickresume's design-forward templates and website builder.
            </li>
          </ul>
        </section>

        <section className="bg-gradient-to-br from-[#FF6321] to-[#e5541a] rounded-2xl p-8 md:p-10 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Try Airesumi free — unlimited resumes, no credit card</h2>
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

export const Route = createFileRoute("/compare/airesumi-vs-rezi")({
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
            { "@type": "ListItem", position: 3, name: "Airesumi vs Rezi", item: URL },
          ],
        }),
      },
    ],
  }),
  component: Page,
});
