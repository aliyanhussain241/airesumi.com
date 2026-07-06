import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { BlogHighlights } from "@/app/components/BlogHighlights";
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
      <div className="max-w-3xl mx-auto px-6 pb-12">
        <div className="liquid-card rounded-2xl p-6">
          <span className="liquid-card-shine" />
          <div className="liquid-card-content">
            <p className="text-xs font-bold text-[#FF6321] uppercase tracking-widest mb-4">From Our Blog</p>
            <div className="flex flex-col gap-3">
              {[
                { title: "How to Build a Resume with AI in 2026", href: "/blog/build-resume-with-ai" },
                { title: "How to Tailor Your Resume for Every Job", href: "/blog/how-to-tailor-resume-for-every-job" },
                { title: "AI Resume Builder for Career Change", href: "/blog/ai-resume-builder-for-career-change" },
              ].map((post) => (
                <a key={post.href} href={post.href} className="flex items-center gap-2 text-sm text-[#374151] hover:text-[#FF6321] transition-colors group">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF6321] shrink-0 group-hover:scale-125 transition-transform" />
                  {post.title}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export const Route = createFileRoute("/salary-analyzer")({
  head: () => ({
    meta: [
      { title: "Free AI Salary Analyzer — Compare Comp by Role & Region | airesumi.com" },
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
