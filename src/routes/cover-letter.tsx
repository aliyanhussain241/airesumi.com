import { createFileRoute, useNavigate } from "@tanstack/react-router";
import React, { useEffect, useState } from "react";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";

import { Step } from "../app/App";
import { CoverLetterData, JobDescription, UserData } from "../app/lib/types";
import { generateCoverLetter } from "../app/lib/gemini";
import { CoverLetterGenerator } from "../app/CoverLetterGenerator";

function CoverLetterPage() {
  const navigate = useNavigate();
  const [userData] = useState<UserData>({
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
  const [coverLetterState, setCoverLetterState] = useState<"IDLE" | "GENERATING" | "DONE">("IDLE");
  const [coverLetterData, setCoverLetterData] = useState<CoverLetterData | null>(null);
  const [coverLetterTone, setCoverLetterTone] = useState<string>("Professional");
  const [, setStatusMessage] = useState("Initializing...");
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);


  const setStep = (target: Step) => {
    if (target === Step.DETAILS) navigate({ to: "/resume" });
    else if (target === Step.LANDING) navigate({ to: "/" });
  };

  const handleCVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("cv", file);
      const response = await fetch("/api/upload-cv", { method: "POST", body: formData });
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || "Failed to upload CV");
      }
      const parsed = await response.json();
      Object.assign(userData, {
        fullName: parsed.fullName || userData.fullName,
        email: parsed.email || userData.email,
        phone: parsed.phone || userData.phone,
        linkedin: parsed.linkedin || userData.linkedin,
        currentRole: parsed.currentRole || userData.currentRole,
        skills: Array.isArray(parsed.skills) && parsed.skills.length > 0 ? parsed.skills : userData.skills,
        experience: Array.isArray(parsed.experience) && parsed.experience.length > 0 ? parsed.experience : userData.experience,
        education: parsed.education || userData.education,
      });
    } catch (err: any) {
      setError(err.message || "Something went wrong parsing your CV.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleGenerateCoverLetter = async () => {
    setCoverLetterState("GENERATING");
    setError(null);
    try {
      const data = await generateCoverLetter(userData, jobData, coverLetterTone, setStatusMessage);
      setCoverLetterData(data);
      setCoverLetterState("DONE");
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
      setCoverLetterState("IDLE");
    }
  };

  const handlePrintCoverLetter = async () => {
    const input = document.getElementById("cover-letter-document");
    if (input) {
      try {
        const dataUrl = await toPng(input, { pixelRatio: 2, backgroundColor: "#ffffff" });
        const pdf = new jsPDF("p", "pt", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (input.offsetHeight * pdfWidth) / input.offsetWidth;
        pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${userData.fullName.replace(/\s+/g, "_") || "Cover"}_Cover_Letter.pdf`);
      } catch (err) {
        console.error("PDF generation failed:", err);
        window.print();
      }
    } else {
      window.print();
    }
  };

  return (
    <CoverLetterGenerator
      coverLetterState={coverLetterState}
      coverLetterData={coverLetterData}
      coverLetterTone={coverLetterTone}
      setCoverLetterTone={setCoverLetterTone}
      userData={userData}
      jobData={jobData}
      setJobData={setJobData}
      setStep={setStep}
      error={error}
      isUploading={isUploading}
      handleCVUpload={handleCVUpload}
      handleGenerateCoverLetter={handleGenerateCoverLetter}
      handlePrintCoverLetter={handlePrintCoverLetter}
    />
  );
}

export const Route = createFileRoute("/cover-letter")({
  head: () => ({
    meta: [
      { title: "Free AI Cover Letter Generator | airesumi.com" },
      { name: "description", content: "Generate a tailored cover letter that matches your resume and the target job in seconds." },
    ],
links: [{ rel: "canonical", href: "https://airesumi.com/cover-letter" }],
  }),
  component: CoverLetterPage,
});
