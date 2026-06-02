import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AnimatePresence } from "motion/react";
import React, { useEffect, useState } from "react";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";

import { Step } from "../app/App";
import { JobDescription, ResumeData, UserData } from "../app/lib/types";
import { DesignId } from "../app/components/ResumePreview";
import { DetailsForm } from "../app/DetailsForm";
import { DesignSelection } from "../app/DesignSelection";
import { JobForm } from "../app/JobForm";
import { GeneratingView } from "../app/GeneratingView";
import { DoneView } from "../app/DoneView";
import { supabase } from "@/integrations/supabase/client";

type Phase = Step.DETAILS | Step.DESIGN | Step.JOB | Step.GENERATING | Step.DONE;

// ✅ AI ke baghair seedha resume banao user data se
function buildResumeFromUserData(userData: UserData, jobData: JobDescription): ResumeData {
  return {
    header: {
      fullName: userData.fullName,
      contactInfo: [userData.email, userData.phone, userData.linkedin].filter(Boolean).join(" | "),
      title: jobData.title || userData.currentRole || "Professional",
      profilePicture: userData.profilePicture,
    },
    summary: `${userData.currentRole || "Professional"} with experience in ${
      userData.skills.filter(Boolean).join(", ") || "various domains"
    }. ${jobData.company ? `Applying for ${jobData.title} at ${jobData.company}.` : ""}`.trim(),
    experience: userData.experience.filter(Boolean).map((exp, i) => {
      const lines = exp.split("\n").filter(Boolean);
      const firstLine = lines[0] || `Role ${i + 1}`;
      const bullets = lines.slice(1);
      return {
        title: firstLine.split(",")[0]?.trim() || firstLine,
        company: firstLine.split(",")[1]?.trim() || "",
        dateRange: firstLine.split(",")[2]?.trim() || "",
        bullets: bullets.length > 0 ? bullets : [firstLine],
      };
    }),
    education: userData.education
      ? [
          {
            degree: userData.education.split(",")[0]?.trim() || userData.education,
            institution: userData.education.split(",")[1]?.trim() || "",
            dateRange: userData.education.split(",")[2]?.trim() || "",
          },
        ]
      : [],
    skills: userData.skills.filter(Boolean).map((skillGroup, i) => ({
      category: `Skills ${i + 1}`,
      items: skillGroup.split(",").map((s) => s.trim()).filter(Boolean),
    })),
  };
}

function ResumeBuilder() {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [phase, setPhase] = useState<Phase>(Step.DETAILS);
  const [designId, setDesignId] = useState<DesignId>("classic");
  const [userData, setUserData] = useState<UserData>({
    fullName: "",
    email: "",
    phone: "",
    linkedin: "",
    currentRole: "",
    skills: [""],
    experience: [""],
    education: "",
  });
  const [jobData, setJobData] = useState<JobDescription>({
    title: "",
    company: "",
    description: "",
  });
  const [statusMessage, setStatusMessage] = useState("Building your resume...");
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => setMounted(true), []);

  const setStep = (target: Step) => {
    switch (target) {
      case Step.DETAILS:
      case Step.DESIGN:
      case Step.JOB:
      case Step.GENERATING:
      case Step.DONE:
        setPhase(target);
        return;
      case Step.LANDING:
        navigate({ to: "/" });
        return;
      case Step.COVER_LETTER:
        navigate({ to: "/cover-letter" });
        return;
      case Step.BLOG:
        navigate({ to: "/blog" });
        return;
      case Step.PREMIUM:
        navigate({ to: "/premium" });
        return;
      case Step.SALARY_ANALYZER:
        navigate({ to: "/salary-analyzer" });
        return;
      case Step.INTERVIEW_PREP:
        navigate({ to: "/interview-prep" });
        return;
      case Step.RESUME_EXAMPLES:
        navigate({ to: "/examples" });
        return;
      case Step.ABOUT:
        navigate({ to: "/about" });
        return;
      case Step.CONTACT:
        navigate({ to: "/contact" });
        return;
      case Step.PRIVACY:
        navigate({ to: "/privacy" });
        return;
      case Step.TERMS:
        navigate({ to: "/terms" });
        return;
      case Step.ATS_CHECKER:
        navigate({ to: "/ats-checker" });
        return;
    }
  };

  // ✅ CV Upload — bina auth ke
  const handleCVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    setError(null);
    try {
      if (file.type === "text/plain") {
        const text = await file.text();
        setUserData((prev) => ({ ...prev, experience: [text] }));
        setIsUploading(false);
        return;
      }
      const formData = new FormData();
      formData.append("cv", file);
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      const response = await fetch("/api/parse-cv-text", {
        method: "POST",
        body: formData,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (response.ok) {
        const data = await response.json();
        if (data.text) {
          setUserData((prev) => ({ ...prev, experience: [data.text] }));
        }
      }
    } catch (err) {
      console.log("CV upload skipped");
    } finally {
      setIsUploading(false);
    }
  };

  // ✅ Login check + AI nahi — seedha user data se resume banao
  const handleGenerate = async () => {
    // ✅ Login check
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setError("Please log in to generate your resume.");
      navigate({ to: "/login" });
      return;
    }

    setPhase(Step.GENERATING);
    setError(null);
    setStatusMessage("Building your resume...");

    // Thoda delay taake loading screen dikhe
    await new Promise((resolve) => setTimeout(resolve, 1200));

    try {
      const data = buildResumeFromUserData(userData, jobData);
      setResumeData(data);
      setPhase(Step.DONE);
    } catch (err: any) {
      setError("Something went wrong. Please try again.");
      setPhase(Step.JOB);
    }
  };

  const handlePrint = async () => {
    let input = document.getElementById("resume-document");
    if (!input) input = document.getElementById("resume-document-mobile");
    if (input) {
      try {
        const dataUrl = await toPng(input, { pixelRatio: 2, backgroundColor: "#ffffff" });
        const pdf = new jsPDF("p", "pt", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (input.offsetHeight * pdfWidth) / input.offsetWidth;
        pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${userData.fullName.replace(/\s+/g, "_")}_Resume.pdf`);
      } catch (err) {
        console.error("PDF generation failed:", err);
        window.print();
      }
    } else {
      window.print();
    }
  };

  if (!mounted) return null;

  return (
    <AnimatePresence mode="wait">
      {phase === Step.DETAILS && (
        <DetailsForm
          userData={userData}
          setUserData={setUserData}
          setStep={setStep}
          isUploading={isUploading}
          handleCVUpload={handleCVUpload}
        />
      )}
      {phase === Step.DESIGN && (
        <DesignSelection designId={designId} setDesignId={setDesignId} setStep={setStep} />
      )}
      {phase === Step.JOB && (
        <JobForm
          jobData={jobData}
          setJobData={setJobData}
          setStep={setStep}
          error={error}
          handleGenerate={handleGenerate}
        />
      )}
      {phase === Step.GENERATING && <GeneratingView statusMessage={statusMessage} />}
      {phase === Step.DONE && resumeData && (
        <DoneView
          resumeData={resumeData}
          setStep={setStep}
          designId={designId}
          setDesignId={setDesignId}
          handlePrint={handlePrint}
        />
      )}
    </AnimatePresence>
  );
}

export const Route = createFileRoute("/resume")({
  head: () => ({
    meta: [
      { title: "Create Your Resume — AI Resume Builder | airesumi.com" },
      { name: "description", content: "Build an ATS-optimized resume tailored to your dream role in minutes." },
    ],
    links: [{ rel: "canonical", href: "https://airesumi.com/resume" }],
  }),
  component: ResumeBuilder,
});
