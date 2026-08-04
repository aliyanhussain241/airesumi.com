import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { PrivacyPolicy } from "../app/StaticPages";
import { useStepNavigate } from "../app/lib/navigation";

function Page() {
  const onNavigate = useStepNavigate();
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full bg-[#F8FAFC]">
      <PrivacyPolicy onNavigate={onNavigate} />
    </motion.div>
  );
}

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | airesumi.com" },
      { name: "description", content: "How Airesumi handles your data and privacy." },
    ],
    links: [{ rel: "canonical", href: "https://airesumi.com/privacy" }],
  }),
  component: Page,
});
