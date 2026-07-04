import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { TermsOfService } from "../app/StaticPages";
import { useStepNavigate } from "../app/lib/navigation";

function Page() {
  const onNavigate = useStepNavigate();
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full bg-[#F8FAFC]">
      <TermsOfService onNavigate={onNavigate} />
    </motion.div>
  );
}

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service | airesumi.com" },
      { name: "description", content: "airesumi terms of service and usage policy." },
      { property: "og:title", content: "Terms of Service | airesumi.com" },
      { property: "og:description", content: "airesumi terms of service and usage policy." },
      { property: "og:url", content: "https://airesumi.com/terms" },
    ],
    links: [{ rel: "canonical", href: "https://airesumi.com/terms" }],
  }),
  component: Page,
});
