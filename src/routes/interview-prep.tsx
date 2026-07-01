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
      { title: "Free AI Interview Question Generator 2026 — Practice by Role, Seniority & Industry | airesumi" },
      { name: "description", content: "Practice realistic interview questions tailored to your exact role, seniority, and industry. Behavioral, technical, situational, case-study & salary-negotiation prompts with STAR answer frameworks. 100% free, no sign-up." },
      { name: "keywords", content: "AI interview questions, interview preparation, behavioral interview questions, technical interview practice, STAR method interview, mock interview generator, job interview prep 2026, situational interview questions, case study interview, salary negotiation questions" },
      { property: "og:title", content: "Free AI Interview Question Generator — Tailored to Your Exact Role | airesumi" },
      { property: "og:description", content: "Realistic behavioral, technical & situational interview questions with STAR answer frameworks — calibrated to your title, seniority, and industry. Free forever." },
      { property: "og:url", content: "https://airesumi.com/interview-prep" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Free AI Interview Question Generator 2026 | airesumi" },
      { name: "twitter:description", content: "Realistic role-specific interview questions with expert STAR answer frameworks. Free, unlimited, no sign-up." },
    ],
    links: [{ rel: "canonical", href: "https://airesumi.com/interview-prep" }],
  }),
  component: Page,
});
