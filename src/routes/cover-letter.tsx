import { createFileRoute, useNavigate } from "@tanstack/react-router";
import React, { useEffect, useRef, useState } from "react";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";

import { Step } from "../app/App";
import { CoverLetterData, JobDescription, UserData } from "../app/lib/types";
import { generateCoverLetter } from "../app/lib/gemini";
import { CoverLetterGenerator } from "../app/CoverLetterGenerator";
import { supabase } from "@/integrations/supabase/client";

function CoverLetterPage() {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  // useRef so upload handler always sees latest value without re-renders
  const userDataRef = useRef<UserData>({
    fullName: "",
    email: "",
    phone: "",
    linkedin: "",
    currentRole: "",
    skills: [""],
    experience: [""],
    education: "",
  });
  const [userData, setUserData] = useState<UserData>(userDataRef.current);

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

  useEffect(() => setMounted(true), []);

  // ✅ Helper — always get fresh token
  async function getAuthToken(): Promise<string | null> {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token ?? null;
  }

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
      // ✅ Get auth token before upload
      const token = await getAuthToken();
      if (!token) {
        setError("Please log in to upload your CV.");
        navigate({ to: "/login" });
        return;
      }

      const formData = new FormData();
      formData.append("cv", file);

      const response = await fetch("/api/upload-cv", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || "Failed to upload CV");
      }

      const parsed = await response.json();

      // ✅ Properly update state (not Object.assign on stale ref)
      const updated: UserData = {
        fullName: parsed.fullName || userDataRef.current.fullName,
        email: parsed.email || userDataRef.current.email,
        phone: parsed.phone || userDataRef.current.phone,
        linkedin: parsed.linkedin || userDataRef.current.linkedin,
        currentRole: parsed.currentRole || userDataRef.current.currentRole,
        skills: Array.isArray(parsed.skills) && parsed.skills.length > 0
          ? parsed.skills
          : userDataRef.current.skills,
        experience: Array.isArray(parsed.experience) && parsed.experience.length > 0
          ? parsed.experience
          : userDataRef.current.experience,
        education: parsed.education || userDataRef.current.education,
      };

      userDataRef.current = updated;
      setUserData(updated);
    } catch (err: any) {
      setError(err.message || "Something went wrong parsing your CV.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleGenerateCoverLetter = async () => {
    setError(null);

    // ✅ Check auth before generating
    const token = await getAuthToken();
    if (!token) {
      setError("Please log in to generate a cover letter.");
      navigate({ to: "/login" });
      return;
    }

    setCoverLetterState("GENERATING");
    try {
      const data = await generateCoverLetter(
        userDataRef.current,
        jobData,
        coverLetterTone,
        setStatusMessage
      );
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
        pdf.save(
          `${(userDataRef.current.fullName || "Cover").replace(/\s+/g, "_")}_Cover_Letter.pdf`
        );
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
      {
        name: "description",
        content:
          "Generate a tailored cover letter that matches your resume and the target job in seconds.",
      },
    ],
    links: [{ rel: "canonical", href: "https://airesumi.com/cover-letter" }],
  }),
  component: CoverLetterPage,
});
