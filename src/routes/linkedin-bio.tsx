import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Linkedin, Sparkles, Copy, Check, ChevronDown,
  User, Briefcase, Tag, Zap, ArrowRight, AlertCircle, RefreshCw
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ResumeData, UserData } from "../app/lib/types";

interface LinkedInBio {
  headline: string;
  about: string;
  tagline: string;
  cta: string;
  skills_to_add: string[];
}

const TONES = [
  { id: "Professional", label: "Professional", desc: "Clean, corporate, ATS-friendly" },
  { id: "Conversational", label: "Conversational", desc: "Warm, approachable, human" },
  { id: "Bold", label: "Bold", desc: "Confident, punchy, memorable" },
  { id: "Creative", label: "Creative", desc: "Unique voice, stands out" },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5 rounded-lg border border-[#e5e7eb] hover:border-[#FF6321] hover:text-[#FF6321] transition-all"
    >
      {copied ? <Check size={13} className="text-green-500" /> : <Copy size={13} />}
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

function ResultSection({ icon, label, content, children }: {
  icon: React.ReactNode; label: string; content?: string; children?: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-[#e5e7eb] rounded-2xl p-5"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-[13px] font-semibold text-[#374151]">
          {icon} {label}
        </div>
        {content && <CopyButton text={content} />}
      </div>
      {content && (
        <p className="text-[14px] text-[#1f2937] leading-relaxed whitespace-pre-wrap">{content}</p>
      )}
      {children}
    </motion.div>
  );
}

function LinkedInBioGenerator() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"input" | "generating" | "result">("input");
  const [tone, setTone] = useState("Professional");
  const [manualMode, setManualMode] = useState(false);
  const [savedResumes, setSavedResumes] = useState<any[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<string>("");
  const [bio, setBio] = useState<LinkedInBio | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingResumes, setLoadingResumes] = useState(true);

  // Manual input fields
  const [manual, setManual] = useState({
    fullName: "", currentRole: "", skills: "", experience: "", education: "",
  });

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { navigate({ to: "/login" }); return; }
      const { data } = await supabase
        .from("saved_resumes")
        .select("id, title, job_title, resume_data, user_data")
        .eq("user_id", session.user.id)
        .order("updated_at", { ascending: false });
      setSavedResumes(data ?? []);
      if (data && data.length > 0) setSelectedResumeId(data[0].id);
      else setManualMode(true);
      setLoadingResumes(false);
    });
  }, []);

  async function handleGenerate() {
    setError(null);
    setStep("generating");

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { navigate({ to: "/login" }); return; }

    let resumeData: ResumeData | null = null;
    let userData: UserData | null = null;

    if (!manualMode && selectedResumeId) {
      const found = savedResumes.find((r) => r.id === selectedResumeId);
      if (found) {
        resumeData = found.resume_data;
        userData = found.user_data;
      }
    } else {
      // Build minimal resumeData from manual input
      resumeData = {
        header: { fullName: manual.fullName, title: manual.currentRole, contactInfo: "" },
        summary: "",
        experience: manual.experience.split("\n").filter(Boolean).map((line) => ({
          title: line, company: "", dateRange: "", bullets: [],
        })),
        education: manual.education ? [{ degree: manual.education, institution: "", dateRange: "" }] : [],
        skills: manual.skills ? [{ category: "Skills", items: manual.skills.split(",").map((s) => s.trim()) }] : [],
      };
    }

    try {
      const res = await fetch("/api/generate-linkedin-bio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ resumeData, userData, tone }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setBio(data);
      setStep("result");
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
      setStep("input");
    }
  }

  return (
    <div className="min-h-screen bg-[#f9fafb] pt-[68px]">
      <div className="max-w-3xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-[#0a66c2]/10 text-[#0a66c2] text-[13px] font-semibold px-4 py-2 rounded-full mb-4">
            <Linkedin size={15} /> LinkedIn Bio Generator
          </div>
          <h1 className="text-[32px] font-bold text-[#111827] tracking-tight mb-2">
            Turn Your Resume Into a{" "}
            <span className="text-[#FF6321]">LinkedIn Profile</span>
          </h1>
          <p className="text-[15px] text-[#6b7280]">
            AI-powered headline, About section, and skills — ready to copy-paste
          </p>
        </div>

        <AnimatePresence mode="wait">

          {/* INPUT STEP */}
          {step === "input" && (
            <motion.div key="input" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>

              {/* Source selector */}
              <div className="bg-white border border-[#e5e7eb] rounded-2xl p-6 mb-4">
                <h2 className="text-[15px] font-semibold text-[#111827] mb-4">1. Resume source chuno</h2>

                {loadingResumes ? (
                  <div className="h-10 bg-gray-100 rounded-xl animate-pulse" />
                ) : savedResumes.length > 0 ? (
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <button
                        onClick={() => setManualMode(false)}
                        className={`flex-1 py-2.5 px-4 rounded-xl text-[13px] font-medium border transition-all ${!manualMode ? "bg-[#FF6321] text-white border-[#FF6321]" : "border-[#e5e7eb] text-[#374151] hover:border-[#FF6321]"}`}
                      >
                        Saved Resume se
                      </button>
                      <button
                        onClick={() => setManualMode(true)}
                        className={`flex-1 py-2.5 px-4 rounded-xl text-[13px] font-medium border transition-all ${manualMode ? "bg-[#FF6321] text-white border-[#FF6321]" : "border-[#e5e7eb] text-[#374151] hover:border-[#FF6321]"}`}
                      >
                        Manually bharo
                      </button>
                    </div>

                    {!manualMode && (
                      <div className="relative">
                        <select
                          value={selectedResumeId}
                          onChange={(e) => setSelectedResumeId(e.target.value)}
                          className="w-full appearance-none bg-[#f9fafb] border border-[#e5e7eb] rounded-xl px-4 py-3 text-[14px] text-[#111827] focus:outline-none focus:border-[#FF6321] pr-10"
                        >
                          {savedResumes.map((r) => (
                            <option key={r.id} value={r.id}>{r.title}</option>
                          ))}
                        </select>
                        <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af] pointer-events-none" />
                      </div>
                    )}
                  </div>
                ) : null}

                {/* Manual fields */}
                {manualMode && (
                  <div className="space-y-3 mt-3">
                    {[
                      { key: "fullName", label: "Full Name", placeholder: "Ali Hussain" },
                      { key: "currentRole", label: "Current Role / Title", placeholder: "Full Stack Developer" },
                      { key: "skills", label: "Top Skills (comma separated)", placeholder: "React, Node.js, TypeScript, AWS" },
                      { key: "education", label: "Education", placeholder: "BS Computer Science, FAST NUCES" },
                    ].map(({ key, label, placeholder }) => (
                      <div key={key}>
                        <label className="text-[12px] font-medium text-[#374151] mb-1 block">{label}</label>
                        <input
                          type="text"
                          placeholder={placeholder}
                          value={manual[key as keyof typeof manual]}
                          onChange={(e) => setManual((p) => ({ ...p, [key]: e.target.value }))}
                          className="w-full bg-[#f9fafb] border border-[#e5e7eb] rounded-xl px-4 py-2.5 text-[14px] focus:outline-none focus:border-[#FF6321]"
                        />
                      </div>
                    ))}
                    <div>
                      <label className="text-[12px] font-medium text-[#374151] mb-1 block">Experience (ek line per role)</label>
                      <textarea
                        rows={3}
                        placeholder={"Senior Dev at Google, 2022-2024\nFrontend Engineer at Meta, 2020-2022"}
                        value={manual.experience}
                        onChange={(e) => setManual((p) => ({ ...p, experience: e.target.value }))}
                        className="w-full bg-[#f9fafb] border border-[#e5e7eb] rounded-xl px-4 py-2.5 text-[14px] focus:outline-none focus:border-[#FF6321] resize-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Tone selector */}
              <div className="bg-white border border-[#e5e7eb] rounded-2xl p-6 mb-4">
                <h2 className="text-[15px] font-semibold text-[#111827] mb-4">2. Tone chuno</h2>
                <div className="grid grid-cols-2 gap-3">
                  {TONES.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTone(t.id)}
                      className={`text-left px-4 py-3 rounded-xl border transition-all ${tone === t.id ? "border-[#FF6321] bg-orange-50" : "border-[#e5e7eb] hover:border-[#FF6321]/50"}`}
                    >
                      <div className="text-[13px] font-semibold text-[#111827]">{t.label}</div>
                      <div className="text-[11px] text-[#9ca3af] mt-0.5">{t.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-[13px] mb-4">
                  <AlertCircle size={15} /> {error}
                </div>
              )}

              <button
                onClick={handleGenerate}
                disabled={manualMode && !manual.fullName}
                className="w-full flex items-center justify-center gap-2 bg-[#FF6321] text-white font-bold text-[15px] py-4 rounded-2xl hover:bg-[#ea580c] hover:shadow-lg hover:shadow-orange-500/25 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                <Sparkles size={18} /> Generate LinkedIn Bio <ArrowRight size={16} />
              </button>
            </motion.div>
          )}

          {/* GENERATING */}
          {step === "generating" && (
            <motion.div key="generating" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-24 text-center"
            >
              <div className="w-16 h-16 bg-[#0a66c2]/10 rounded-2xl flex items-center justify-center mb-6 animate-pulse">
                <Linkedin size={30} className="text-[#0a66c2]" />
              </div>
              <h3 className="text-[20px] font-bold text-[#111827] mb-2">Writing your LinkedIn bio...</h3>
              <p className="text-[14px] text-[#6b7280]">AI aapka profile craft kar raha hai</p>
              <div className="flex gap-1.5 mt-6">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="w-2 h-2 bg-[#FF6321] rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </motion.div>
          )}

          {/* RESULT */}
          {step === "result" && bio && (
            <motion.div key="result" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">

              {/* All copy button */}
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-[18px] font-bold text-[#111827]">Aapka LinkedIn Profile ✨</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setStep("input")}
                    className="flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5 rounded-lg border border-[#e5e7eb] hover:border-[#FF6321] hover:text-[#FF6321] transition-all"
                  >
                    <RefreshCw size={12} /> Regenerate
                  </button>
                  <CopyButton text={`HEADLINE:\n${bio.headline}\n\nABOUT:\n${bio.about}\n\nTAGLINE:\n${bio.tagline}\n\nCTA:\n${bio.cta}`} />
                </div>
              </div>

              <ResultSection icon={<Tag size={15} className="text-[#0a66c2]" />} label="Headline" content={bio.headline} />

              <ResultSection icon={<User size={15} className="text-[#0a66c2]" />} label="About Section" content={bio.about} />

              <ResultSection icon={<Zap size={15} className="text-[#FF6321]" />} label="Tagline / Banner" content={bio.tagline} />

              <ResultSection icon={<ArrowRight size={15} className="text-green-600" />} label="Call to Action" content={bio.cta} />

              <ResultSection icon={<Briefcase size={15} className="text-purple-600" />} label="Skills to Add on LinkedIn">
                <div className="flex flex-wrap gap-2 mt-1">
                  {bio.skills_to_add.map((skill) => (
                    <span key={skill} className="bg-purple-50 text-purple-700 text-[12px] font-medium px-3 py-1 rounded-full border border-purple-100">
                      {skill}
                    </span>
                  ))}
                </div>
              </ResultSection>

              {/* LinkedIn link */}
              <div className="bg-[#0a66c2] rounded-2xl px-6 py-5 flex items-center justify-between">
                <div>
                  <p className="text-white font-semibold text-[15px]">LinkedIn pe update karo</p>
                  <p className="text-[#bfdbfe] text-[13px] mt-0.5">Copy karo aur LinkedIn Profile Edit mein paste karo</p>
                </div>
                <a
                  href="https://www.linkedin.com/in/edit/intro/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-white text-[#0a66c2] font-bold text-[13px] px-4 py-2.5 rounded-xl hover:bg-blue-50 transition-colors no-underline"
                >
                  <Linkedin size={15} /> Open LinkedIn
                </a>
              </div>

              <button
                onClick={() => { setBio(null); setStep("input"); }}
                className="w-full py-3 border border-[#e5e7eb] rounded-xl text-[14px] font-medium text-[#374151] hover:border-[#FF6321] hover:text-[#FF6321] transition-all"
              >
                Naya bio generate karo
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/linkedin-bio")({
  head: () => ({
    meta: [
      { title: "LinkedIn Bio Generator — AI-Powered Profile Writer | airesumi.com" },
      { name: "description", content: "Turn your resume into a compelling LinkedIn headline, About section, and skills list. AI-powered, free LinkedIn profile generator." },
      { property: "og:title", content: "AI LinkedIn Bio Generator | airesumi.com" },
      { property: "og:description", content: "Generate a compelling LinkedIn headline and About section from your resume with AI." },
      { property: "og:url", content: "https://airesumi.com/linkedin-bio" },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://airesumi.com/og-image.webp" },
      { name: "twitter:title", content: "AI LinkedIn Bio Generator | airesumi.com" },
      { name: "twitter:description", content: "Generate a compelling LinkedIn headline and About section from your resume with AI." },
    ],
    links: [{ rel: "canonical", href: "https://airesumi.com/linkedin-bio" }],
  }),
  component: LinkedInBioGenerator,
});
