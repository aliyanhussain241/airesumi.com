import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { About } from "../app/StaticPages";
import { useStepNavigate } from "../app/lib/navigation";

function Page() {
  const onNavigate = useStepNavigate();
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full bg-[#F8FAFC]">
      <About onNavigate={onNavigate} />
    </motion.div>
  );
}

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About airesumi — AI Resume Builder Mission & Team | airesumi.com" },
      { name: "description", content: "Learn how airesumi is helping 500,000+ job seekers in 120+ countries build ATS-optimized resumes with AI. Meet our team and discover our mission." },
      { property: "og:title", content: "About airesumi — Our Mission & Team" },
      { property: "og:description", content: "airesumi helps 500,000+ job seekers build better resumes with AI. Learn about our mission and team." },
      { property: "og:url", content: "https://airesumi.com/about" },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://airesumi.com/og-image.webp" },
      { name: "twitter:title", content: "About airesumi — Our Mission & Team" },
      { name: "twitter:description", content: "airesumi helps 500,000+ job seekers build better resumes with AI. Learn about our mission and team." },
    ],
        scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({"@context":"https://schema.org","@type":"Organization","name":"airesumi","url":"https://airesumi.com","description":"AI-powered resume builder helping 500,000+ job seekers worldwide","foundingDate":"2023","numberOfEmployees":{"@type":"QuantitativeValue","minValue":10,"maxValue":50}}),
      },
    ],
links: [{ rel: "canonical", href: "https://airesumi.com/about" }],
  }),
  component: Page,
});
