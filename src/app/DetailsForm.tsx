import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  UploadCloud, Loader2, User, Mail, Phone, Linkedin, Briefcase,
  ImageIcon, GraduationCap, Trash2, Code2, ArrowLeft, ArrowRight,
  Wand2, MapPin, Award, Globe, Check, Sparkles, Lightbulb, Shield,
  AlertCircle, Plus, X, FileText, Zap
} from "lucide-react";
import { Step } from "./App";
import { UserData } from "./lib/types";
import { MultiStepFormShell } from "./components/MultiStepFormShell";

interface DetailsFormProps {
  userData: UserData;
  setUserData: React.Dispatch<React.SetStateAction<UserData>>;
  setStep: (step: Step) => void;
  isUploading: boolean;
  handleCVUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
}

const SECTIONS = [
  { id: "personal",   title: "Personal Info",   short: "About",     icon: User,          desc: "Your identity, contacts & links." },
  { id: "experience", title: "Experience",      short: "Work",      icon: Briefcase,     desc: "Roles, achievements & impact." },
  { id: "education",  title: "Education",       short: "Studies",   icon: GraduationCap, desc: "Degrees & certifications." },
  { id: "skills",     title: "Skills & Review", short: "Skills",    icon: Code2,         desc: "Skills, keywords & final check." },
];

const SKILL_SUGGESTIONS = [
  "JavaScript", "TypeScript", "React", "Node.js", "Python", "SQL",
  "Figma", "Photoshop", "Illustrator", "Team Leadership", "Project Management",
  "SEO", "Content Writing", "Public Speaking", "Data Analysis",
];

const TIPS: Record<number, { title: string; body: string }[]> = {
  0: [
    { title: "Use a professional email", body: "firstname.lastname@gmail.com converts 2× better than nicknames." },
    { title: "LinkedIn boosts trust", body: "Recruiters skim LinkedIn 78% of the time before calling you." },
    { title: "Photo optional", body: "Skip in US/UK/CA. Include for EU, MENA, and design roles." },
  ],
  1: [
    { title: "Start with impact", body: "Lead each bullet with a strong verb: 'Led', 'Launched', 'Reduced'." },
    { title: "Show numbers", body: "'Grew revenue 34%' beats 'grew revenue significantly'." },
    { title: "AI will format it", body: "Write raw notes — our AI turns them into recruiter-ready bullets." },
  ],
  2: [
    { title: "Certifications matter", body: "AWS, PMP, Google, Meta — recruiters scan for them first." },
    { title: "Recent first", body: "List your most recent qualification at the top." },
  ],
  3: [
    { title: "Match the JD", body: "Mirror keywords from the job description you're applying to." },
    { title: "Mix hard + soft", body: "6-10 hard skills + 3-5 soft skills is the sweet spot." },
  ],
};

const fieldClass =
  "w-full bg-[#f9fafb] dark:bg-white/[0.04] border border-gray-100 dark:border-white/10 rounded-xl pl-12 pr-4 py-3.5 focus:ring-2 focus:ring-[#FF6321]/25 focus:border-[#FF6321] focus:bg-white dark:focus:bg-white/[0.06] outline-none transition-all placeholder:text-gray-400 font-medium text-foreground";

const errorFieldClass =
  "w-full bg-red-50 dark:bg-red-500/5 border border-red-300 dark:border-red-500/30 rounded-xl pl-12 pr-4 py-3.5 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all placeholder:text-gray-400 font-medium text-foreground";

const sectionVariants = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, x: -30, transition: { duration: 0.2 } },
};

function isEmailValid(v: string) {
  return v.trim() === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

export const DetailsForm: React.FC<DetailsFormProps> = ({
  userData, setUserData, setStep, isUploading, handleCVUpload,
}) => {
  const [section, setSection] = useState(0);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [skillDraft, setSkillDraft] = useState("");

  // Overall completion %
  const completion = useMemo(() => {
    const fields = [
      userData.fullName, userData.email, userData.phone, userData.location,
      userData.currentRole, userData.linkedin,
      userData.experience.filter(e => e.trim()).length > 0 ? "y" : "",
      userData.education,
      userData.skills.filter(s => s.trim()).length > 0 ? "y" : "",
    ];
    const filled = fields.filter(f => f && String(f).trim()).length;
    return Math.round((filled / fields.length) * 100);
  }, [userData]);

  const sectionStatus = (i: number) => {
    if (i === 0) return userData.fullName.trim() && isEmailValid(userData.email) && userData.email.trim();
    if (i === 1) return userData.experience.filter(e => e.trim()).length > 0;
    if (i === 2) return !!userData.education.trim();
    if (i === 3) return userData.skills.filter(s => s.trim()).length > 0;
    return false;
  };

  const isSectionValid = () => sectionStatus(section);

  const goNext = () => { if (section < SECTIONS.length - 1) setSection(s => s + 1); };
  const goBack = () => { if (section === 0) setStep(Step.LANDING); else setSection(s => s - 1); };

  // Chip-based skills logic (flatten & rebuild)
  const skillChips = useMemo(() => {
    return userData.skills.flatMap(s => s.split(",").map(x => x.trim()).filter(Boolean));
  }, [userData.skills]);

  const setSkillChips = (chips: string[]) => {
    setUserData({ ...userData, skills: chips.length > 0 ? [chips.join(", ")] : [""] });
  };

  const addSkill = (s: string) => {
    const clean = s.trim();
    if (!clean) return;
    if (skillChips.some(c => c.toLowerCase() === clean.toLowerCase())) return;
    setSkillChips([...skillChips, clean]);
    setSkillDraft("");
  };

  const removeSkill = (s: string) => setSkillChips(skillChips.filter(c => c !== s));

  const emailError = touched.email && userData.email.trim() && !isEmailValid(userData.email);
  const nameError = touched.fullName && !userData.fullName.trim();

  return (
    <MultiStepFormShell
      key="details"
      headerGap="spacious"
      maxWidth="max-w-6xl"
      initial={{ opacity: 0, y: 20 }}
      exit={{ opacity: 0, y: -20 }}
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-8 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-[#FF6321]/10 text-[#FF6321] px-3 py-1 rounded-full text-[11.5px] font-bold uppercase tracking-widest mb-3">
            <Sparkles size={12} className="fill-[#FF6321]" /> Step 1 of 3 · Your Details
          </div>
          <h2 className="text-3xl lg:text-5xl font-bold tracking-tight text-foreground text-balance">
            Let's build a resume that <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6321] to-amber-500">gets you hired.</span>
          </h2>
          <p className="text-muted-foreground text-[15px] mt-2 max-w-xl">
            Upload your existing CV to autofill, or start fresh. Everything you enter is private and never shared.
          </p>
        </div>

        {/* Progress ring */}
        <div className="flex items-center gap-4 self-start lg:self-end">
          <div className="relative w-16 h-16 shrink-0">
            <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
              <circle cx="32" cy="32" r="28" strokeWidth="6" className="stroke-gray-200 dark:stroke-white/10" fill="none" />
              <motion.circle
                cx="32" cy="32" r="28" strokeWidth="6" strokeLinecap="round" fill="none"
                stroke="url(#g)"
                strokeDasharray={2 * Math.PI * 28}
                initial={false}
                animate={{ strokeDashoffset: 2 * Math.PI * 28 * (1 - completion / 100) }}
                transition={{ duration: 0.5 }}
              />
              <defs>
                <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
                  <stop offset="0%" stopColor="#FF6321" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-[13px] font-bold text-foreground">{completion}%</div>
          </div>
          <div>
            <div className="text-[12px] uppercase tracking-widest text-muted-foreground font-semibold">Completion</div>
            <div className="text-[15px] font-semibold text-foreground">{completion < 50 ? "Just getting started" : completion < 90 ? "Almost there" : "Ready to generate"}</div>
          </div>
        </div>
      </div>

      {/* Stepper */}
      <div className="mb-8">
        <div className="grid grid-cols-4 gap-2">
          {SECTIONS.map((s, i) => {
            const Icon = s.icon;
            const done = sectionStatus(i) && i !== section;
            const active = i === section;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => { if (i <= section || sectionStatus(i - 1)) setSection(i); }}
                className={`group text-left rounded-2xl px-3 py-3 sm:px-4 sm:py-3.5 border transition-all ${
                  active
                    ? "bg-white dark:bg-white/[0.06] border-[#FF6321] shadow-[0_10px_30px_-15px_rgba(255,99,33,0.5)]"
                    : done
                    ? "bg-orange-50/60 dark:bg-orange-500/[0.06] border-orange-200/60 dark:border-orange-500/20 hover:bg-orange-50 dark:hover:bg-orange-500/[0.1]"
                    : "bg-white/60 dark:bg-white/[0.03] border-gray-100 dark:border-white/10 hover:border-gray-200"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    active ? "bg-[#FF6321] text-white" :
                    done ? "bg-orange-100 dark:bg-orange-500/20 text-[#FF6321]" :
                    "bg-gray-100 dark:bg-white/10 text-gray-400"
                  }`}>
                    {done ? <Check size={15} strokeWidth={3} /> : <Icon size={15} />}
                  </div>
                  <div className="min-w-0">
                    <div className={`text-[11px] uppercase tracking-wider font-bold ${active ? "text-[#FF6321]" : done ? "text-[#FF6321]/80" : "text-gray-400"}`}>
                      Step {i + 1}
                    </div>
                    <div className={`text-[13px] font-semibold truncate ${active ? "text-foreground" : done ? "text-foreground/90" : "text-muted-foreground"}`}>
                      <span className="hidden sm:inline">{s.title}</span>
                      <span className="sm:hidden">{s.short}</span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        <div className="w-full bg-gray-100 dark:bg-white/10 h-1 rounded-full overflow-hidden mt-4">
          <motion.div
            className="h-full bg-gradient-to-r from-[#FF6321] to-amber-500"
            initial={{ width: 0 }}
            animate={{ width: `${((section + 1) / SECTIONS.length) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        {/* Form card */}
        <div className="bg-white dark:bg-white/[0.03] border border-[#f3f4f6] dark:border-white/10 rounded-3xl p-5 sm:p-8 lg:p-10 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.1)] relative overflow-hidden min-h-[520px]">
          <AnimatePresence mode="wait">
            {/* SECTION 0: PERSONAL */}
            {section === 0 && (
              <motion.div key="s0" variants={sectionVariants} initial="hidden" animate="visible" exit="exit" className="space-y-8">
                {/* CV upload */}
                <label className="relative block border-2 border-dashed border-[#FF6321]/40 hover:border-[#FF6321] bg-gradient-to-br from-orange-50 to-amber-50/60 dark:from-orange-500/[0.08] dark:to-amber-500/[0.04] rounded-2xl p-6 text-center hover:from-orange-100 dark:hover:from-orange-500/[0.12] transition-all cursor-pointer group">
                  <input
                    type="file"
                    accept=".pdf,.txt,.doc,.docx"
                    onChange={handleCVUpload}
                    disabled={isUploading}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-wait"
                  />
                  {isUploading ? (
                    <div className="flex flex-col items-center justify-center space-y-3 py-2">
                      <Loader2 size={32} className="text-[#FF6321] animate-spin" />
                      <p className="text-[#FF6321] font-semibold text-sm">Extracting your CV with AI...</p>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-4 flex-wrap">
                      <div className="bg-white dark:bg-white/10 p-3 rounded-2xl text-[#FF6321] shadow-sm group-hover:scale-110 transition-transform">
                        <UploadCloud size={22} />
                      </div>
                      <div className="text-left">
                        <h4 className="font-bold text-foreground flex items-center gap-2">
                          Upload existing CV to autofill
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#FF6321] bg-white dark:bg-white/10 border border-[#FF6321]/20 px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                            <Zap size={9} className="fill-[#FF6321]" /> AI
                          </span>
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1">PDF, TXT, DOC, DOCX · up to 5 MB · fully private</p>
                      </div>
                    </div>
                  )}
                </label>

                {/* Divider */}
                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-gray-100 dark:bg-white/10" />
                  <span className="text-[11px] uppercase tracking-widest text-muted-foreground font-semibold">Or fill manually</span>
                  <div className="h-px flex-1 bg-gray-100 dark:bg-white/10" />
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-orange-50 dark:bg-orange-500/10 p-2.5 rounded-xl text-[#FF6321]"><User size={20} /></div>
                    <h3 className="text-xl font-bold tracking-tight text-foreground">Personal Information</h3>
                  </div>

                  <div className="grid md:grid-cols-2 gap-x-6 gap-y-5">
                    {/* Full Name */}
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Full Name *</label>
                      <div className="relative">
                        <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          className={nameError ? errorFieldClass : fieldClass}
                          placeholder="Jessica Doe"
                          value={userData.fullName}
                          onBlur={() => setTouched(t => ({ ...t, fullName: true }))}
                          onChange={(e) => setUserData({ ...userData, fullName: e.target.value })}
                        />
                      </div>
                      {nameError && <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1"><AlertCircle size={12} /> Full name is required</p>}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Email *</label>
                      <div className="relative">
                        <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="email"
                          className={emailError ? errorFieldClass : fieldClass}
                          placeholder="jessica@email.com"
                          value={userData.email}
                          onBlur={() => setTouched(t => ({ ...t, email: true }))}
                          onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                        />
                      </div>
                      {emailError && <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1"><AlertCircle size={12} /> Enter a valid email address</p>}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Phone</label>
                      <div className="relative">
                        <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="tel" className={fieldClass} placeholder="+1 555 0123"
                          value={userData.phone}
                          onChange={(e) => setUserData({ ...userData, phone: e.target.value })} />
                      </div>
                    </div>

                    {/* Location */}
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Location</label>
                      <div className="relative">
                        <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="text" className={fieldClass} placeholder="Hyderabad, Pakistan"
                          value={userData.location ?? ""}
                          onChange={(e) => setUserData({ ...userData, location: e.target.value })} />
                      </div>
                    </div>

                    {/* LinkedIn */}
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-2">LinkedIn <span className="normal-case font-normal text-gray-400">(optional)</span></label>
                      <div className="relative">
                        <Linkedin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="text" className={fieldClass} placeholder="linkedin.com/in/username"
                          value={userData.linkedin}
                          onChange={(e) => setUserData({ ...userData, linkedin: e.target.value })} />
                      </div>
                    </div>

                    {/* Portfolio */}
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Portfolio / Site <span className="normal-case font-normal text-gray-400">(optional)</span></label>
                      <div className="relative">
                        <Globe size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="text" className={fieldClass} placeholder="yoursite.com"
                          value={userData.portfolio ?? ""}
                          onChange={(e) => setUserData({ ...userData, portfolio: e.target.value })} />
                      </div>
                    </div>

                    {/* Job Title */}
                    <div className="md:col-span-2">
                      <label className="block text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Current / Target Job Title</label>
                      <div className="relative">
                        <Briefcase size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="text" className={`${fieldClass} text-lg`} placeholder="e.g. Senior Product Designer"
                          value={userData.currentRole}
                          onChange={(e) => setUserData({ ...userData, currentRole: e.target.value })} />
                      </div>
                    </div>

                    {/* Profile picture */}
                    <div className="md:col-span-2">
                      <label className="block text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Profile Picture <span className="normal-case font-normal text-gray-400">(optional)</span></label>
                      <div className="flex items-center gap-4">
                        <label className="cursor-pointer flex-1 bg-[#f9fafb] dark:bg-white/[0.04] border border-dashed border-gray-200 dark:border-white/15 hover:border-[#FF6321] hover:bg-orange-50/50 dark:hover:bg-orange-500/[0.08] rounded-xl px-4 py-4 flex items-center justify-center gap-3 transition-all">
                          <ImageIcon size={20} className="text-gray-400" />
                          <span className="text-sm font-medium text-muted-foreground">{userData.profilePicture ? "Change photo" : "Click to upload photo"}</span>
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => setUserData({ ...userData, profilePicture: reader.result as string });
                              reader.readAsDataURL(file);
                            }
                          }} />
                        </label>
                        {userData.profilePicture && (
                          <div className="shrink-0 relative group">
                            <img src={userData.profilePicture} alt="Profile" className="w-16 h-16 object-cover rounded-2xl border-4 border-white dark:border-white/10 shadow-lg" />
                            <button type="button" onClick={() => setUserData({ ...userData, profilePicture: undefined })}
                              aria-label="Remove profile picture"
                              className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><X size={12} /></button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* SECTION 1: EXPERIENCE */}
            {section === 1 && (
              <motion.div key="s1" variants={sectionVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="bg-orange-50 dark:bg-orange-500/10 p-2.5 rounded-xl text-[#FF6321]"><Briefcase size={20} /></div>
                  <h3 className="text-xl font-bold tracking-tight text-foreground">Professional Background</h3>
                </div>

                <div>
                  <div className="flex justify-between items-baseline mb-3">
                    <label className="block text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Work Experience</label>
                    <span className="text-[11px] font-semibold text-[#FF6321] bg-orange-50 dark:bg-orange-500/10 px-2 py-1 rounded-md flex items-center gap-1.5">
                      <Wand2 size={11} /> AI will polish this
                    </span>
                  </div>
                  <div className="space-y-4">
                    {userData.experience.map((exp, index) => (
                      <div key={index} className="relative group">
                        <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl bg-gradient-to-b from-[#FF6321] to-amber-500" />
                        <textarea
                          rows={4}
                          className="w-full bg-[#f9fafb] dark:bg-white/[0.04] border border-gray-100 dark:border-white/10 rounded-xl pl-5 pr-14 py-4 focus:ring-2 focus:ring-[#FF6321]/25 focus:border-[#FF6321] focus:bg-white dark:focus:bg-white/[0.06] outline-none transition-all resize-y text-[15px] leading-relaxed placeholder:text-gray-400 text-foreground"
                          placeholder={`Role ${index + 1} — e.g. Senior Designer @ Acme, 2022–Present.\nWhat you did, achievements, numbers, tools used.`}
                          value={exp}
                          onChange={(e) => {
                            const newExp = [...userData.experience];
                            newExp[index] = e.target.value;
                            setUserData({ ...userData, experience: newExp });
                          }}
                        />
                        <div className="absolute top-3 right-3 flex items-center gap-2">
                          <span className="text-[10px] font-semibold text-gray-400 bg-white dark:bg-white/10 border border-gray-100 dark:border-white/10 px-1.5 py-0.5 rounded">
                            {exp.trim().split(/\s+/).filter(Boolean).length} words
                          </span>
                          {userData.experience.length > 1 && (
                            <button type="button"
                              onClick={() => setUserData({ ...userData, experience: userData.experience.filter((_, i) => i !== index) })}
                              className="bg-white dark:bg-white/10 shadow-sm border border-gray-100 dark:border-white/10 text-gray-400 hover:text-red-500 w-7 h-7 rounded-lg flex items-center justify-center transition-all">
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <button type="button"
                    onClick={() => setUserData({ ...userData, experience: [...userData.experience, ""] })}
                    className="mt-4 flex items-center justify-center gap-2 text-sm font-bold text-[#FF6321] bg-orange-50 dark:bg-orange-500/10 border border-dashed border-[#FF6321]/30 hover:border-[#FF6321] hover:bg-orange-100 dark:hover:bg-orange-500/[0.15] px-6 py-3 rounded-xl transition-colors w-full sm:w-auto">
                    <Plus size={16} /> Add Another Role
                  </button>
                </div>
              </motion.div>
            )}

            {/* SECTION 2: EDUCATION */}
            {section === 2 && (
              <motion.div key="s2" variants={sectionVariants} initial="hidden" animate="visible" exit="exit" className="space-y-7">
                <div className="flex items-center gap-3">
                  <div className="bg-orange-50 dark:bg-orange-500/10 p-2.5 rounded-xl text-[#FF6321]"><GraduationCap size={20} /></div>
                  <h3 className="text-xl font-bold tracking-tight text-foreground">Education & Certifications</h3>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Education</label>
                  <textarea rows={3}
                    className="w-full bg-[#f9fafb] dark:bg-white/[0.04] border border-gray-100 dark:border-white/10 rounded-xl px-5 py-4 focus:ring-2 focus:ring-[#FF6321]/25 focus:border-[#FF6321] focus:bg-white dark:focus:bg-white/[0.06] outline-none transition-all resize-none text-[15px] leading-relaxed placeholder:text-gray-400 text-foreground"
                    placeholder="e.g. B.Sc. Computer Science — University of Karachi, 2019–2023"
                    value={userData.education}
                    onChange={(e) => setUserData({ ...userData, education: e.target.value })} />
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Award size={14} className="text-[#FF6321]" />
                    <label className="block text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Certifications <span className="normal-case font-normal text-gray-400">(optional)</span></label>
                  </div>
                  <div className="space-y-3">
                    {(userData.certifications ?? [""]).map((cert: string, index: number) => (
                      <div key={index} className="relative">
                        <Award size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="text"
                          className="w-full bg-[#f9fafb] dark:bg-white/[0.04] border border-gray-100 dark:border-white/10 rounded-xl pl-12 pr-12 py-3 focus:ring-2 focus:ring-[#FF6321]/25 focus:border-[#FF6321] focus:bg-white dark:focus:bg-white/[0.06] outline-none transition-all placeholder:text-gray-400 font-medium text-foreground"
                          placeholder="e.g. AWS Certified Solutions Architect, 2024"
                          value={cert}
                          onChange={(e) => {
                            const certs = [...(userData.certifications ?? [""])];
                            certs[index] = e.target.value;
                            setUserData({ ...userData, certifications: certs });
                          }} />
                        {(userData.certifications ?? [""]).length > 1 && (
                          <button type="button"
                            onClick={() => setUserData({ ...userData, certifications: (userData.certifications ?? [""]).filter((_: string, i: number) => i !== index) })}
                            className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-400 hover:text-red-500 transition-colors w-7 h-7 flex items-center justify-center">
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <button type="button"
                    onClick={() => setUserData({ ...userData, certifications: [...(userData.certifications ?? [""]), ""] })}
                    className="mt-4 flex items-center gap-2 text-sm font-bold text-[#FF6321] bg-orange-50 dark:bg-orange-500/10 border border-dashed border-[#FF6321]/30 hover:border-[#FF6321] px-5 py-2.5 rounded-xl transition-colors">
                    <Plus size={15} /> Add Certification
                  </button>
                </div>
              </motion.div>
            )}

            {/* SECTION 3: SKILLS + REVIEW */}
            {section === 3 && (
              <motion.div key="s3" variants={sectionVariants} initial="hidden" animate="visible" exit="exit" className="space-y-8">
                <div className="flex items-center gap-3">
                  <div className="bg-orange-50 dark:bg-orange-500/10 p-2.5 rounded-xl text-[#FF6321]"><Code2 size={20} /></div>
                  <h3 className="text-xl font-bold tracking-tight text-foreground">Skills & Review</h3>
                </div>

                {/* Chip input */}
                <div>
                  <div className="flex justify-between items-baseline mb-2">
                    <label className="block text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Your Skills</label>
                    <span className="text-[11px] font-semibold text-muted-foreground">{skillChips.length} added</span>
                  </div>
                  <div className="min-h-[120px] bg-[#f9fafb] dark:bg-white/[0.04] border border-gray-100 dark:border-white/10 rounded-xl p-3 focus-within:ring-2 focus-within:ring-[#FF6321]/25 focus-within:border-[#FF6321] transition-all">
                    <div className="flex flex-wrap gap-2">
                      {skillChips.map(chip => (
                        <span key={chip} className="inline-flex items-center gap-1.5 bg-white dark:bg-white/10 border border-[#FF6321]/25 text-foreground text-[13px] font-medium px-3 py-1.5 rounded-full">
                          {chip}
                          <button type="button" onClick={() => removeSkill(chip)} aria-label={`Remove ${chip}`} className="text-gray-400 hover:text-red-500 -mr-1"><X size={13} /></button>
                        </span>
                      ))}
                      <input
                        type="text"
                        value={skillDraft}
                        onChange={(e) => setSkillDraft(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addSkill(skillDraft); }
                          if (e.key === "Backspace" && !skillDraft && skillChips.length) { removeSkill(skillChips[skillChips.length - 1]); }
                        }}
                        placeholder={skillChips.length === 0 ? "Type a skill and press Enter (e.g. React)" : "Add another..."}
                        className="flex-1 min-w-[160px] bg-transparent outline-none text-[14px] py-1.5 placeholder:text-gray-400 text-foreground"
                      />
                    </div>
                  </div>

                  {/* Suggestions */}
                  <div className="mt-3">
                    <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">Suggested</div>
                    <div className="flex flex-wrap gap-1.5">
                      {SKILL_SUGGESTIONS.filter(s => !skillChips.some(c => c.toLowerCase() === s.toLowerCase())).slice(0, 10).map(s => (
                        <button key={s} type="button" onClick={() => addSkill(s)}
                          className="text-[12px] font-medium bg-gray-50 dark:bg-white/[0.05] hover:bg-orange-50 dark:hover:bg-orange-500/10 border border-gray-100 dark:border-white/10 hover:border-[#FF6321]/40 text-muted-foreground hover:text-[#FF6321] px-2.5 py-1 rounded-full transition-all">
                          + {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Review summary */}
                <div className="bg-gradient-to-br from-orange-50 to-amber-50/40 dark:from-orange-500/[0.08] dark:to-amber-500/[0.04] border border-orange-100 dark:border-orange-500/20 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <FileText size={16} className="text-[#FF6321]" />
                    <h4 className="text-[13px] font-bold uppercase tracking-widest text-foreground">Quick Review</h4>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-x-6 gap-y-3 text-[13px]">
                    {[
                      { l: "Name", v: userData.fullName },
                      { l: "Email", v: userData.email },
                      { l: "Job title", v: userData.currentRole },
                      { l: "Location", v: userData.location },
                      { l: "Roles added", v: `${userData.experience.filter(e => e.trim()).length} role(s)` },
                      { l: "Skills added", v: `${skillChips.length} skill(s)` },
                    ].map(row => (
                      <div key={row.l} className="flex justify-between gap-3 border-b border-white/60 dark:border-white/5 pb-2 last:border-0">
                        <span className="text-muted-foreground">{row.l}</span>
                        <span className="text-foreground font-semibold text-right truncate max-w-[60%]">{row.v || "—"}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div className="pt-8 mt-8 border-t border-[#f3f4f6] dark:border-white/10 flex justify-between items-center gap-3">
            <button type="button" onClick={goBack}
              className="flex items-center gap-2 px-5 py-3.5 bg-[#f9fafb] dark:bg-white/[0.04] border border-gray-100 dark:border-white/10 text-muted-foreground font-semibold rounded-xl hover:bg-gray-100 dark:hover:bg-white/[0.08] transition-colors">
              <ArrowLeft size={17} /> <span className="hidden sm:inline">Back</span>
            </button>

            <div className="hidden sm:flex items-center gap-1.5 text-[12px] text-muted-foreground">
              <Shield size={12} /> Your data stays private
            </div>

            {section < SECTIONS.length - 1 ? (
              <button type="button" disabled={!isSectionValid()} onClick={goNext}
                className="group flex items-center gap-3 bg-gradient-to-r from-[#FF6321] to-amber-500 text-white px-6 py-3.5 rounded-xl font-bold text-[15px] shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none">
                Continue
                <div className="bg-white/20 p-1 rounded-lg group-hover:bg-white/30 transition-colors">
                  <ArrowRight size={16} />
                </div>
              </button>
            ) : (
              <button type="button"
                disabled={!userData.fullName || !isEmailValid(userData.email) || userData.experience.filter(e => e.trim()).length === 0}
                onClick={() => setStep(Step.DESIGN)}
                className="group flex items-center gap-3 bg-gradient-to-r from-[#FF6321] to-amber-500 text-white px-6 py-3.5 rounded-xl font-bold text-[15px] shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none">
                Confirm & Choose Design
                <div className="bg-white/20 p-1 rounded-lg group-hover:bg-white/30 transition-colors">
                  <ArrowRight size={16} />
                </div>
              </button>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col gap-4 lg:sticky lg:top-24 self-start">
          <div className="bg-gradient-to-br from-[#0b1020] to-[#1a1f3a] text-white rounded-2xl p-5 border border-white/10 relative overflow-hidden">
            <div aria-hidden className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-[radial-gradient(closest-side,rgba(249,115,22,0.4),transparent)]" />
            <div className="relative">
              <div className="flex items-center gap-2 text-orange-300 text-[11px] font-bold uppercase tracking-widest mb-2">
                <Lightbulb size={13} className="fill-orange-400" /> Pro Tips
              </div>
              <div className="text-[13px] font-semibold text-white/90 mb-4">{SECTIONS[section].desc}</div>
              <div className="space-y-3">
                {TIPS[section]?.map(t => (
                  <div key={t.title} className="bg-white/[0.06] backdrop-blur rounded-xl p-3 border border-white/10">
                    <div className="text-[13px] font-bold text-white mb-1">{t.title}</div>
                    <div className="text-[12px] text-white/60 leading-relaxed">{t.body}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-white/10 rounded-2xl p-5">
            <div className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-1.5">
              <Check size={12} /> Section Checklist
            </div>
            <ul className="space-y-2.5">
              {SECTIONS.map((s, i) => {
                const done = sectionStatus(i);
                return (
                  <li key={s.id} className="flex items-center gap-2.5 text-[13px]">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${done ? "bg-green-500 text-white" : "bg-gray-100 dark:bg-white/10 text-gray-400"}`}>
                      {done ? <Check size={11} strokeWidth={3} /> : <span className="text-[10px] font-bold">{i + 1}</span>}
                    </div>
                    <span className={done ? "text-foreground font-medium" : "text-muted-foreground"}>{s.title}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>
      </div>
    </MultiStepFormShell>
  );
};
