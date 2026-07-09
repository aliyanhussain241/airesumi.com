import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { BlogHighlights } from "@/app/components/BlogHighlights";
import React, { useEffect, useState } from "react";
// FIX #1: Removed top-level toPng and jsPDF imports.
// They are now dynamically imported only when the user clicks Download PDF.

import { Step } from "../app/App";
import { CoverLetterData, JobDescription, UserData } from "../app/lib/types";
import { generateCoverLetter } from "../app/lib/gemini";
import { CoverLetterGenerator } from "../app/CoverLetterGenerator";

const COVER_LETTER_FAQ_SCHEMA = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How does the AI cover letter generator work?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Paste the job description and upload your resume. Airesumi's AI reads both and generates a tailored cover letter in seconds — matching your experience to the exact role you are applying for."
      }
    },
    {
      "@type": "Question",
      "name": "Is the cover letter generator free?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, Airesumi's AI cover letter generator is completely free to use. No sign-up required to generate your first cover letter."
      }
    },
    {
      "@type": "Question",
      "name": "How long should a cover letter be?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "A cover letter should be 3 to 4 paragraphs and fit on one page. It should open with why you want the role, highlight 2 to 3 relevant achievements, and close with a clear call to action."
      }
    },
    {
      "@type": "Question",
      "name": "Can I customize the tone of my cover letter?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Airesumi lets you choose the tone of your cover letter — Professional, Confident, Friendly, or Creative — so it matches the company culture and the role you are applying for."
      }
    },
    {
      "@type": "Question",
      "name": "Does a cover letter really matter in 2025?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. While not every employer reads cover letters, a strong cover letter can be the difference when two candidates are equally qualified. It shows motivation and communication skills that a resume cannot."
      }
    }
  ]
});

function CoverLetterContentSection() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-20">

      {/* What is */}
      <div className="mb-16">
        <h2 className="text-3xl font-medium text-[#2d3748] mb-6">
          What is an AI Cover Letter Generator?
        </h2>
        <p className="text-[#4a5568] text-[16px] leading-relaxed mb-4">
          An AI cover letter generator creates a personalized cover letter by reading your resume and the job description together. Instead of a generic template, you get a letter that speaks directly to the role — using the right keywords, tone, and structure.
        </p>
        <p className="text-[#4a5568] text-[16px] leading-relaxed">
          Airesumi's free cover letter generator takes under 2 minutes. Paste the job description, upload your CV, choose your tone, and download a ready-to-send PDF.
        </p>
      </div>

      {/* How to write */}
      <div className="mb-16">
        <h2 className="text-3xl font-medium text-[#2d3748] mb-6">
          How to Write a Cover Letter That Gets Noticed
        </h2>
        <div className="space-y-4">
          {[
            {
              step: "1",
              title: "Open with why you want this specific role",
              desc: "Recruiters can tell when a cover letter is generic. Mention the company name and one specific reason you are excited about this role — it shows you actually read the job posting.",
            },
            {
              step: "2",
              title: "Highlight 2-3 relevant achievements",
              desc: "Do not just repeat your resume. Pick your strongest achievements that directly match the job requirements. Use numbers where possible — percentages, revenue, team size.",
            },
            {
              step: "3",
              title: "Close with a clear call to action",
              desc: "End by expressing enthusiasm for an interview and thanking the recruiter for their time. Keep it confident, not desperate.",
            },
            {
              step: "4",
              title: "Match the tone to the company culture",
              desc: "A cover letter for a startup should sound different from one for a bank. Airesumi lets you pick Professional, Confident, Friendly, or Creative tone automatically.",
            },
          ].map((item) => (
            <div key={item.step} className="flex gap-5 bg-[#f8fafc] rounded-xl p-6">
              <div className="w-10 h-10 rounded-full bg-[#FF6321] text-white font-bold flex items-center justify-center shrink-0 text-lg">
                {item.step}
              </div>
              <div>
                <h3 className="font-semibold text-[#1a202c] text-[17px] mb-1">{item.title}</h3>
                <p className="text-[#4a5568] text-[15px] leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div>
        <h2 className="text-3xl font-medium text-[#2d3748] mb-8">
          Frequently Asked Questions
        </h2>
        <div className="space-y-3">
          {[
            {
              q: "How does the AI cover letter generator work?",
              a: "Paste the job description and upload your resume. Airesumi's AI reads both and generates a tailored cover letter in seconds — matching your experience to the exact role you are applying for.",
            },
            {
              q: "Is the cover letter generator free?",
              a: "Yes, completely free. No sign-up required to generate your first cover letter.",
            },
            {
              q: "How long should a cover letter be?",
              a: "3 to 4 paragraphs, fitting on one page. Open with why you want the role, highlight 2 to 3 relevant achievements, and close with a clear call to action.",
            },
            {
              q: "Can I customize the tone of my cover letter?",
              a: "Yes. Airesumi lets you choose Professional, Confident, Friendly, or Creative tone so it matches the company culture and the role you are applying for.",
            },
            {
              q: "Does a cover letter really matter in 2025?",
              a: "Yes. While not every employer reads cover letters, a strong one can be the difference when two candidates are equally qualified. It shows motivation and communication skills a resume cannot.",
            },
          ].map((item, i) => (
            <details
              key={i}
              className="border border-[#e2e8f0] rounded-xl p-5 cursor-pointer group bg-white"
            >
              <summary className="font-semibold text-[#1a202c] text-[17px] list-none flex justify-between items-center gap-4">
                <span>{item.q}</span>
                <span className="text-[#FF6321] text-2xl shrink-0 group-open:rotate-45 transition-transform duration-200">+</span>
              </summary>
              <p className="mt-3 text-[#4a5568] leading-relaxed text-[15px]">{item.a}</p>
            </details>
          ))}
        </div>
      </div>

    </div>
  );
}

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
        throw new Error((err as any).error || "Failed to upload CV");
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

  // FIX #1: Dynamic import — jsPDF and html-to-image only load when user clicks Download.
  const handlePrintCoverLetter = async () => {
    const input = document.getElementById("cover-letter-document");
    if (input) {
      try {
        const { toPng } = await import("html-to-image");
        const jsPDF = (await import("jspdf")).default;
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
    <>
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
      <CoverLetterContentSection />

      <BlogHighlights posts={[
                { title: "How to Write a Cover Letter with AI in 2026", href: "/blog/how-to-write-cover-letter-with-ai" },
                { title: "How to Build a Resume with AI in 2026", href: "/blog/build-resume-with-ai" },
                { title: "AI Resume vs. Human-Written: What Recruiters Notice", href: "/blog/ai-resume-vs-human-written-resume" },
              ]} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: COVER_LETTER_FAQ_SCHEMA }}
      />
    </>
  );
}

export const Route = createFileRoute("/cover-letter")({
  head: () => ({
    meta: [
      { title: "Free AI Cover Letter Generator — Tailored in Seconds | airesumi.com" },
      { name: "description", content: "Generate a professional, tailored cover letter in seconds using AI. Matches your resume to any job description. Free, no sign-up required." },
      { name: "robots", content: "index, follow" },
      { name: "keywords", content: "AI cover letter generator, free cover letter, cover letter maker, cover letter builder, AI cover letter" },
      { property: "og:title", content: "Free AI Cover Letter Generator | airesumi.com" },
      { property: "og:description", content: "Generate a tailored cover letter in seconds. Free AI tool by Airesumi." },
      { property: "og:url", content: "https://airesumi.com/cover-letter" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Free AI Cover Letter Generator | airesumi.com" },
    ],
    links: [{ rel: "canonical", href: "https://airesumi.com/cover-letter" }],
  }),
  component: CoverLetterPage,
});
