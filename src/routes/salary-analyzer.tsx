import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { SalaryAnalyzer } from "../app/SalaryAnalyzer";
import { useStepNavigate } from "../app/lib/navigation";
import { ToolContentSection } from "../app/components/ToolContentSection";
import { SALARY_CONTENT } from "../app/components/toolContent";

function Page() {
  const onNavigate = useStepNavigate();
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full bg-[#F8FAFC]">
      <SalaryAnalyzer onNavigate={onNavigate} />
      <ToolContentSection {...SALARY_CONTENT} />
    </motion.div>
  );
}

export const Route = createFileRoute("/salary-analyzer")({
  head: () => ({
    meta: [
      { title: "Free AI Salary Analyzer — Compare Comp by Role & Region | airesumi.com" },
      { property: "og:image", content: "https://airesumi.com/api/public/og/salary-analyzer" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:type", content: "image/svg+xml" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://airesumi.com/api/public/og/salary-analyzer" },
      { name: "description", content: "Benchmark salaries across roles, regions, and experience levels. Get total-comp ranges plus AI-powered negotiation talking points. Free, no sign-up." },
      { name: "keywords", content: "salary analyzer, salary comparison, compensation benchmark, total comp calculator, salary negotiation" },
      { property: "og:title", content: "Free AI Salary Analyzer | airesumi.com" },
      { property: "og:description", content: "Benchmark salaries and total comp for any role and region. Free AI-powered negotiation prep." },
      { property: "og:url", content: "https://airesumi.com/salary-analyzer" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Free AI Salary Analyzer | airesumi.com" },
      { name: "twitter:description", content: "Benchmark salaries and total comp for any role and region. Free AI-powered negotiation prep." },
    ],
    links: [{ rel: "canonical", href: "https://airesumi.com/salary-analyzer" }],
  }),
  component: Page,
});
