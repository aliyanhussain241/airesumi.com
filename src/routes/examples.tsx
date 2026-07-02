import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ResumeExamples } from "../app/ResumeExamples";
import { useStepNavigate } from "../app/lib/navigation";

function Page() {
  const onNavigate = useStepNavigate();
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full bg-[#F8FAFC]">
      <ResumeExamples onNavigate={onNavigate} />
    </motion.div>
  );
}

export const Route = createFileRoute("/examples")({
  head: () => ({
    meta: [
      { title: "500+ Free ATS Resume Examples by Job Title & Industry | airesumi.com" },
      { name: "description", content: "Browse 500+ free ATS-optimized resume examples by job title, industry, and experience level. Download and customize for 2025 job applications." },
      { property: "og:title", content: "500+ Free Resume Examples by Job Title | airesumi.com" },
      { property: "og:description", content: "Download 500+ free ATS-optimized resume examples by job title and industry. Updated for 2025." },
      { property: "og:url", content: "https://airesumi.com/examples" },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://airesumi.com/api/public/og/examples" },
      { name: "twitter:image", content: "https://airesumi.com/api/public/og/examples" },
      { name: "twitter:title", content: "500+ Free Resume Examples by Job Title | airesumi.com" },
      { name: "twitter:description", content: "Download 500+ ATS-optimized resume examples by job title and industry." },
    ],
    links: [{ rel: "canonical", href: "https://airesumi.com/examples" }],
  }),
  component: Page,
});
