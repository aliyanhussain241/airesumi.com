import React from "react";

export interface HowToStep {
  title: string;
  desc: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface ToolContentSectionProps {
  whatTitle: string;
  whatParagraphs: string[];
  howToTitle: string;
  howToSteps: HowToStep[];
  faqTitle?: string;
  faqs: FaqItem[];
}

/**
 * Reusable SEO-optimized content block for tool pages.
 * Renders "What is…", "How to…" and FAQ sections and injects
 * FAQPage JSON-LD structured data for rich results.
 */
export function ToolContentSection({
  whatTitle,
  whatParagraphs,
  howToTitle,
  howToSteps,
  faqTitle = "Frequently Asked Questions",
  faqs,
}: ToolContentSectionProps) {
  const faqSchema = React.useMemo(
    () =>
      JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }),
    [faqs],
  );

  return (
    <>
      <div className="max-w-3xl mx-auto px-6 py-20">
        {/* What is */}
        <div className="mb-16">
          <h2 className="text-3xl font-medium text-[#2d3748] mb-6">{whatTitle}</h2>
          {whatParagraphs.map((p, i) => (
            <p
              key={i}
              className={`text-[#4a5568] text-[16px] leading-relaxed ${i < whatParagraphs.length - 1 ? "mb-4" : ""}`}
            >
              {p}
            </p>
          ))}
        </div>

        {/* How to */}
        <div className="mb-16">
          <h2 className="text-3xl font-medium text-[#2d3748] mb-6">{howToTitle}</h2>
          <div className="space-y-4">
            {howToSteps.map((item, i) => (
              <div key={i} className="flex gap-5 bg-[#f8fafc] rounded-xl p-6">
                <div className="w-10 h-10 rounded-full bg-[#FF6321] text-white font-bold flex items-center justify-center shrink-0 text-lg">
                  {i + 1}
                </div>
                <div>
                  <h3 className="font-semibold text-[#1a202c] text-[17px] mb-1">
                    {item.title}
                  </h3>
                  <p className="text-[#4a5568] text-[15px] leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div>
          <h2 className="text-3xl font-medium text-[#2d3748] mb-8">{faqTitle}</h2>
          <div className="space-y-3">
            {faqs.map((item, i) => (
              <details
                key={i}
                className="border border-[#e2e8f0] rounded-xl p-5 cursor-pointer group bg-white"
              >
                <summary className="font-semibold text-[#1a202c] text-[17px] list-none flex justify-between items-center gap-4">
                  <span>{item.q}</span>
                  <span className="text-[#FF6321] text-2xl shrink-0 group-open:rotate-45 transition-transform duration-200">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-[#4a5568] leading-relaxed text-[15px]">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: faqSchema }}
      />
    </>
  );
}
