import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ResumeExamples } from "../app/ResumeExamples";
import { useStepNavigate } from "../app/lib/navigation";

function Page() {
  const onNavigate = useStepNavigate();
  const navigate = useNavigate();

  function handleLoadTemplate(resumeData: any) {
    // Title se role extract karo — "Software Engineer Resume Example" → "Software Engineer"
    const titleClean = (resumeData.title || "")
      .replace(/Resume Example.*$/i, "")
      .replace(/Resume Sample.*$/i, "")
      .trim();

    // Template ka data sessionStorage mein store karo
    const templatePayload = {
      // user_data fields
      user_data: {
        fullName: "",
        email: "",
        phone: "",
        linkedin: "",
        currentRole: titleClean,
        skills: resumeData.keywords || [],
        experience: [""],
        education: "",
      },
      // resume builder pe DETAILS step pe khulega
      job_data: {
        title: titleClean,
        company: "",
        description: resumeData.keywords?.join(", ") || "",
      },
      from_template: true,
      template_title: resumeData.title,
    };

    sessionStorage.setItem("template_prefill", JSON.stringify(templatePayload));
    navigate({ to: "/resume" });
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full bg-[#F8FAFC]">
      <ResumeExamples onNavigate={onNavigate} onLoadTemplate={handleLoadTemplate} />
    </motion.div>
  );
}

export const Route = createFileRoute("/examples")({
  head: () => ({
    meta: [
      { title: "Resume Examples by Job Role — Free Templates | airesumi.com" },
      { name: "description", content: "Browse high-impact resume examples across industries and use them as a starting point." },
    ],
    links: [{ rel: "canonical", href: "https://airesumi.com/examples" }],
  }),
  component: Page,
});
