import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Contact } from "../app/StaticPages";
import { useStepNavigate } from "../app/lib/navigation";

function Page() {
  const onNavigate = useStepNavigate();
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full bg-[#F8FAFC]">
      <Contact onNavigate={onNavigate} />
    </motion.div>
  );
}

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us | airesumi.com" },
      { name: "description", content: "Get in touch with the airesumi team." },
    ],
  }),
  component: Page,
});
