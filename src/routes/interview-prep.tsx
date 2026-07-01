import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { InterviewGenerator } from "../app/InterviewGenerator";
import { useStepNavigate } from "../app/lib/navigation";
import { ToolContentSection } from "../app/components/ToolContentSection";
import { INTERVIEW_CONTENT } from "../app/components/toolContent";

function Page() {
  const onNavigate = useStepNavigate();
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full bg-[#F8FAFC]">
      <InterviewGenerator onNavigate={onNavigate} />
      <ToolContentSection {...INTERVIEW_CONTENT} />
    </motion.div>
  );
}

export const Route = createFileRoute("/interview-prep")({
  head: () => ({
    meta: [
      { title: "Free AI Interview Question Generator — Practice by Role | airesumi.com" },
      { name: "description", content: "Generate realistic interview questions tailored to your role, seniority, and industry. Behavioral, technical, and situational — free, no sign-up." },
      { name: "keywords", content: "AI interview questions, interview prep, behavioral interview, technical interview practice, mock interview generator" },
      { property: "og:title", content: "Free AI Interview Question Generator | airesumi.com" },
      { property: "og:description", content: "Practice realistic interview questions tailored to your exact role and seniority. Free AI-powered prep." },
      { property: "og:url", content: "https://airesumi.com/interview-prep" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Free AI Interview Question Generator | airesumi.com" },
      { name: "twitter:description", content: "Practice realistic interview questions tailored to your role. Free AI-powered prep." },
    ],
    links: [{ rel: "canonical", href: "https://airesumi.com/interview-prep" }],
  }),
  component: Page,
});
