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
      { title: "About Airesumi — AI Resume Builder Mission | airesumi.com" },
      { name: "description", content: "Airesumi helps job seekers build ATS-optimized resumes with AI. Learn about our mission to make professional resume writing accessible to everyone." },
      { property: "og:title", content: "About Airesumi — Our Mission" },
      { property: "og:description", content: "Airesumi helps job seekers build better resumes with AI. Learn about our mission." },
      { property: "og:url", content: "https://airesumi.com/about" },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://airesumi.com/og-image.webp" },
      { name: "twitter:title", content: "About Airesumi — Our Mission" },
      { name: "twitter:description", content: "Airesumi helps job seekers build better resumes with AI." },
      { name: "twitter:url", content: "https://airesumi.com/about" },
    ],
        scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({"@context":"https://schema.org","@type":"Organization","name":"Airesumi","url":"https://airesumi.com","description":"AI-powered resume builder for ATS-optimized resumes","foundingDate":"2023"}),
      },
    ],
links: [{ rel: "canonical", href: "https://airesumi.com/about" }],
  }),
  component: Page,
});
