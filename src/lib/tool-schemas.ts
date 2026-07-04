import type { ToolContent } from "../app/components/toolContent";

export function buildHowToSchema(content: ToolContent) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: content.howToTitle,
    step: content.howToSteps.map((s) => ({
      "@type": "HowToStep",
      name: s.title,
      text: s.desc,
    })),
  };
}

export function buildFaqSchema(content: ToolContent) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function toolSchemaScripts(content: ToolContent) {
  return [
    { type: "application/ld+json", children: JSON.stringify(buildHowToSchema(content)) },
    { type: "application/ld+json", children: JSON.stringify(buildFaqSchema(content)) },
  ];
}
