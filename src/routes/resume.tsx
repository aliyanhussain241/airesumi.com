import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AnimatePresence } from "motion/react";
import React, { useEffect, useState } from "react";
// FIX #1: jsPDF and html-to-image removed from top-level imports.
// They are now dynamically imported only when the user clicks Download PDF.
// This removes ~370KB from the initial bundle.

import { Step } from "../app/App";
import { JobDescription, ResumeData, UserData } from "../app/lib/types";
import { DesignId } from "../app/components/ResumePreview";
import { DetailsForm } from "../app/DetailsForm";
import { DesignSelection } from "../app/DesignSelection";
import { ToolContentSection } from "../app/components/ToolContentSection";
import { RESUME_CONTENT } from "../app/components/toolContent";
import { JobForm } from "../app/JobForm";
import { GeneratingView } from "../app/GeneratingView";
import { DoneView } from "../app/DoneView";
import { supabase } from "@/integrations/supabase/client";

type Phase = Step.DETAILS | Step.DESIGN | Step.JOB | Step.GENERATING | Step.DONE;

function buildResumeFromUserData(userData: UserData, jobData: JobDescription): ResumeData {
  return {
    header: {
      fullName: userData.fullName,
      contactInfo: [userData.email, userData.phone, userData.linkedin].filter(Boolean).join(" | "),
      title: jobData.title || userData.currentRole || "Professional",
      profilePicture: userData.profilePicture,
      qrCodeUrl: userData.qrCodeUrl,
      showQrCode: userData.showQrCode,
      qrPosition: userData.qrPosition,
      qrSize: userData.qrSize,
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

// ✅ Supabase mein resume save karo
async function saveResumeToSupabase(
  userId: string,
  resumeData: ResumeData,
  userData: UserData,
  jobData: JobDescription,
  designId: DesignId,
  existingId?: string
): Promise<string | null> {
  const title =
    [userData.fullName, jobData.title, jobData.company].filter(Boolean).join(" — ") ||
    "My Resume";

  const payload = {
    user_id: userId,
    title,
    job_title: jobData.title || null,
    company: jobData.company || null,
    design_id: designId,
    resume_data: resumeData as any,
    user_data: userData as any,
    updated_at: new Date().toISOString(),
  };

  if (existingId) {
    const { error } = await supabase
      .from("saved_resumes")
      .update(payload)
      .eq("id", existingId);
    if (error) console.error("Resume update failed:", error);
    return existingId;
  } else {
    const { data, error } = await supabase
      .from("saved_resumes")
      .insert(payload)
      .select("id")
      .single();
    if (error) {
      console.error("Resume save failed:", error);
      return null;
    }
    return data?.id ?? null;
  }
}

function ResumeBuilder() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>(Step.DETAILS);
  const [designId, setDesignId] = useState<DesignId>("classic");
  const [savedResumeId, setSavedResumeId] = useState<string | undefined>(undefined);
  const [userData, setUserData] = useState<UserData>({
    fullName: "",
    email: "",
    phone: "",
    linkedin: "",
    currentRole: "",
    skills: [""],
    experience: [""],
    education: "",
    // ✅ New fields
    location: "",
    portfolio: "",
    certifications: [""],
    qrCodeUrl: "",
    showQrCode: true,
    qrPosition: "top-right",
    qrSize: 72,
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

  useEffect(() => {
    // ✅ Dashboard se "Edit" kiya? sessionStorage se load karo
    const editData = sessionStorage.getItem("edit_resume");
    if (editData) {
      try {
        const saved = JSON.parse(editData);
        if (saved.resume_data) setResumeData(saved.resume_data);
        if (saved.user_data) setUserData(saved.user_data);
        if (saved.design_id) setDesignId(saved.design_id as DesignId);
        if (saved.job_title || saved.company) {
          setJobData((prev) => ({
            ...prev,
            title: saved.job_title ?? "",
            company: saved.company ?? "",
          }));
        }
        if (saved.id) setSavedResumeId(saved.id);
        if (saved.resume_data) setPhase(Step.DONE);
        sessionStorage.removeItem("edit_resume");
        return;
      } catch (e) {
        console.error("Failed to load edit data", e);
      }
    }

    // ✅ Examples se "Edit This Template" kiya? template_prefill load karo
    const templateData = sessionStorage.getItem("template_prefill");
    if (templateData) {
      try {
        const tmpl = JSON.parse(templateData);
        if (tmpl.user_data) setUserData(tmpl.user_data);
        if (tmpl.job_data) {
          setJobData({
            title: tmpl.job_data.title || "",
            company: tmpl.job_data.company || "",
            description: tmpl.job_data.description || "",
          });
        }
        // DETAILS step pe le jao taake user apni info fill kare
        setPhase(Step.DETAILS);
        sessionStorage.removeItem("template_prefill");
      } catch (e) {
        console.error("Failed to load template data", e);
      }
    }
  }, []);

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
          // Auto-fill all fields from parsed CV text
          setUserData((prev) => ({ ...prev, experience: [data.text] }));
        }
      } else {
        const errData = await response.json().catch(() => ({}));
        setError(errData.error || "Failed to parse CV. Please paste your resume text manually.");
      }
    } catch (err: any) {
      setError("CV upload failed. Please paste your resume text manually.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleGenerate = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setError("Please log in to generate your resume.");
      navigate({ to: "/login" });
      return;
    }

    setPhase(Step.GENERATING);
    setError(null);
    setStatusMessage("Building your resume...");

    await new Promise((resolve) => setTimeout(resolve, 1200));

    try {
      const data = buildResumeFromUserData(userData, jobData);
      setResumeData(data);

      // ✅ Auto-save to Supabase
      setStatusMessage("Saving to your dashboard...");
      const savedId = await saveResumeToSupabase(
        session.user.id,
        data,
        userData,
        jobData,
        designId,
        savedResumeId
      );
      if (savedId) setSavedResumeId(savedId);

      setPhase(Step.DONE);
    } catch (err: any) {
      setError("Something went wrong. Please try again.");
      setPhase(Step.JOB);
    }
  };

  // ✅ Design change pe bhi Supabase update karo
  const handleDesignChange = async (newDesignId: DesignId) => {
    setDesignId(newDesignId);
    if (!savedResumeId || !resumeData) return;
    await supabase
      .from("saved_resumes")
      .update({ design_id: newDesignId, updated_at: new Date().toISOString() })
      .eq("id", savedResumeId);
  };

  // FIX #1: jsPDF and html-to-image are dynamically imported here — only when
  // the user actually clicks Download. ~370KB is not downloaded until this moment.
  const handlePrint = async () => {
    let input = document.getElementById("resume-document");
    if (!input) input = document.getElementById("resume-document-mobile");
    if (input) {
      try {
        const { toPng } = await import("html-to-image");
        const jsPDF = (await import("jspdf")).default;
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
          setDesignId={handleDesignChange}
          handlePrint={handlePrint}
        />
      )}
    </AnimatePresence>
  );
}

export const Route = createFileRoute("/resume")({
  head: () => ({
    meta: [
      { title: "AI Resume Builder — Free ATS-Optimized Resumes | airesumi" },
      { name: "description", content: "Build a free ATS-optimized resume in minutes. AI writes your bullets, summary, and keywords. No sign-up required." },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: "Free AI Resume Builder | airesumi" },
      { property: "og:description", content: "Build a free ATS-optimized resume in minutes. AI writes your bullets, summary, and keywords. No sign-up required." },
      { property: "og:url", content: "https://airesumi.com/resume" },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://airesumi.com/api/public/og/resume" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Free AI Resume Builder | airesumi" },
      { name: "twitter:description", content: "Build a free ATS-optimized resume in minutes. No sign-up required." },
      { name: "twitter:image", content: "https://airesumi.com/api/public/og/resume" },
    ],
    links: [{ rel: "canonical", href: "https://airesumi.com/resume" }],
  }),
  component: () => (<><ResumeBuilder /><ToolContentSection {...RESUME_CONTENT} /></>),
});
