import React from "react";
import { motion } from "motion/react";
import {
  UploadCloud, Loader2, User, Mail, Phone, Linkedin, Briefcase,
  ImageIcon, GraduationCap, Trash2, Code2, ArrowLeft, ArrowRight,
  Wand2, MapPin, Award, Globe
} from "lucide-react";
import { Step } from "./App";
import { UserData } from "./lib/types";

interface DetailsFormProps {
  userData: UserData;
  setUserData: React.Dispatch<React.SetStateAction<UserData>>;
  setStep: (step: Step) => void;
  isUploading: boolean;
  handleCVUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
}

export const DetailsForm: React.FC<DetailsFormProps> = ({
  userData,
  setUserData,
  setStep,
  isUploading,
  handleCVUpload,
}) => {
  return (
    <motion.div
      key="details"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-4xl mx-auto py-12 px-6 print:hidden min-h-screen"
    >
      <div className="flex items-center justify-between mb-12">
        <div>
          <span className="text-xs uppercase tracking-widest font-bold text-[#FF6321] mb-2 block">Step 01 / 03</span>
          <h2 className="text-4xl font-bold tracking-tight">Your Details</h2>
        </div>
      </div>

      <div className="bg-white border border-[#f3f4f6] rounded-3xl p-6 sm:p-10 lg:p-14 [box-shadow:0_10px_40px_-15px_rgba(0,0,0,0.05)] space-y-12 relative overflow-hidden">

        {/* CV Upload */}
        <div className="border border-dashed border-[#FF6321] bg-orange-50 rounded-2xl p-8 text-center relative hover:bg-orange-100 transition-colors cursor-pointer">
          <input
            type="file"
            accept=".pdf,.txt,.doc,.docx"
            onChange={handleCVUpload}
            disabled={isUploading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-wait"
          />
          {isUploading ? (
            <div className="flex flex-col items-center justify-center space-y-3">
              <Loader2 size={32} className="text-[#FF6321] animate-spin" />
              <p className="text-[#FF6321] font-medium text-sm">Extracting CV data via AI...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-3">
              <div className="bg-white p-3 rounded-full text-[#FF6321] shadow-sm">
                <UploadCloud size={24} />
              </div>
              <div>
                <h4 className="font-bold text-[#111827]">Upload Existing CV to Autofill</h4>
                <p className="text-xs text-[#4b5563] mt-1">PDF, TXT, DOC, DOCX up to 5MB</p>
              </div>
            </div>
          )}
        </div>

        {/* ── PERSONAL INFORMATION ── */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 border-b border-[#f3f4f6] pb-4">
            <div className="bg-orange-50 p-2.5 rounded-xl text-orange-500"><User size={22} /></div>
            <h3 className="text-xl font-bold tracking-tight text-[#111827]">Personal Information</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">

            {/* Full Name */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-2">Full Name</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><User size={18} /></div>
                <input
                  type="text"
                  className="w-full bg-[#f9fafb] border border-gray-100 rounded-xl pl-12 pr-4 py-3.5 focus:ring-2 focus:ring-[#FF6321]/20 focus:border-[#FF6321] focus:bg-white outline-none transition-all placeholder:text-gray-400 font-medium"
                  placeholder="Jessica Doe"
                  value={userData.fullName}
                  onChange={(e) => setUserData({ ...userData, fullName: e.target.value })}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-2">Email</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><Mail size={18} /></div>
                <input
                  type="email"
                  className="w-full bg-[#f9fafb] border border-gray-100 rounded-xl pl-12 pr-4 py-3.5 focus:ring-2 focus:ring-[#FF6321]/20 focus:border-[#FF6321] focus:bg-white outline-none transition-all placeholder:text-gray-400 font-medium"
                  placeholder="jessica@email.com"
                  value={userData.email}
                  onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-2">Phone</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><Phone size={18} /></div>
                <input
                  type="tel"
                  className="w-full bg-[#f9fafb] border border-gray-100 rounded-xl pl-12 pr-4 py-3.5 focus:ring-2 focus:ring-[#FF6321]/20 focus:border-[#FF6321] focus:bg-white outline-none transition-all placeholder:text-gray-400 font-medium"
                  placeholder="555-0123"
                  value={userData.phone}
                  onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                />
              </div>
            </div>

            {/* ✅ NEW: City / Location */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-2">City / Location</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><MapPin size={18} /></div>
                <input
                  type="text"
                  className="w-full bg-[#f9fafb] border border-gray-100 rounded-xl pl-12 pr-4 py-3.5 focus:ring-2 focus:ring-[#FF6321]/20 focus:border-[#FF6321] focus:bg-white outline-none transition-all placeholder:text-gray-400 font-medium"
                  placeholder="e.g. Hyderabad, Pakistan"
                  value={(userData as any).location ?? ""}
                  onChange={(e) => setUserData({ ...userData, location: e.target.value } as any)}
                />
              </div>
            </div>

            {/* LinkedIn */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-2">LinkedIn <span className="normal-case font-normal text-gray-400">(Optional)</span></label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><Linkedin size={18} /></div>
                <input
                  type="text"
                  className="w-full bg-[#f9fafb] border border-gray-100 rounded-xl pl-12 pr-4 py-3.5 focus:ring-2 focus:ring-[#FF6321]/20 focus:border-[#FF6321] focus:bg-white outline-none transition-all placeholder:text-gray-400 font-medium"
                  placeholder="linkedin.com/in/username"
                  value={userData.linkedin}
                  onChange={(e) => setUserData({ ...userData, linkedin: e.target.value })}
                />
              </div>
            </div>

            {/* ✅ NEW: Portfolio / Website */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-2">Portfolio / Website <span className="normal-case font-normal text-gray-400">(Optional)</span></label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><Globe size={18} /></div>
                <input
                  type="text"
                  className="w-full bg-[#f9fafb] border border-gray-100 rounded-xl pl-12 pr-4 py-3.5 focus:ring-2 focus:ring-[#FF6321]/20 focus:border-[#FF6321] focus:bg-white outline-none transition-all placeholder:text-gray-400 font-medium"
                  placeholder="behance.net/username or yoursite.com"
                  value={(userData as any).portfolio ?? ""}
                  onChange={(e) => setUserData({ ...userData, portfolio: e.target.value } as any)}
                />
              </div>
            </div>

            {/* Current Role */}
            <div className="md:col-span-2">
              <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-2">Current / Target Job Title</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><Briefcase size={18} /></div>
                <input
                  type="text"
                  className="w-full bg-[#f9fafb] border border-gray-100 rounded-xl pl-12 pr-4 py-3.5 focus:ring-2 focus:ring-[#FF6321]/20 focus:border-[#FF6321] focus:bg-white outline-none transition-all placeholder:text-gray-400 font-medium text-lg"
                  placeholder="e.g. Graphic Designer & Social Media Marketer"
                  value={userData.currentRole}
                  onChange={(e) => setUserData({ ...userData, currentRole: e.target.value })}
                />
              </div>
            </div>

            {/* Profile Picture */}
            <div className="md:col-span-2">
              <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-2">Profile Picture <span className="normal-case font-normal text-gray-400">(Optional)</span></label>
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <label className="cursor-pointer w-full bg-[#f9fafb] border border-dashed border-gray-200 hover:border-orange-300 hover:bg-orange-50/50 rounded-xl px-4 py-4 flex flex-col items-center justify-center gap-2 transition-all">
                    <ImageIcon size={24} className="text-gray-400" />
                    <span className="text-sm font-medium text-gray-600">Click to upload photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setUserData({ ...userData, profilePicture: reader.result as string });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
                {userData.profilePicture && (
                  <div className="shrink-0 relative group">
                    <img src={userData.profilePicture} alt="Profile" className="w-20 h-20 object-cover rounded-2xl border-4 border-white shadow-lg" />
                    <button
                      onClick={() => setUserData({ ...userData, profilePicture: undefined })}
                      className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >&times;</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── PROFESSIONAL BACKGROUND ── */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 border-b border-[#f3f4f6] pb-4">
            <div className="bg-orange-50 p-2.5 rounded-xl text-orange-500"><Briefcase size={22} /></div>
            <h3 className="text-xl font-bold tracking-tight text-[#111827]">Professional Background</h3>
          </div>
          <div>
            <div className="flex justify-between items-baseline mb-2">
              <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500">Work Experience</label>
              <span className="text-xs font-semibold text-orange-500 bg-orange-50 px-2 py-1 rounded-md flex items-center gap-1.5"><Wand2 size={12} /> AI will format this</span>
            </div>
            <div className="space-y-4">
              {userData.experience.map((exp, index) => (
                <div key={index} className="relative group">
                  <textarea
                    rows={4}
                    className="w-full bg-[#f9fafb] border border-gray-100 rounded-xl px-5 py-4 focus:ring-2 focus:ring-[#FF6321]/20 focus:border-[#FF6321] focus:bg-white outline-none transition-all resize-y text-[15px] leading-relaxed placeholder:text-gray-400"
                    placeholder={`Role ${index + 1}: e.g. Company Name, 2022–Present.\nWhat you did, achievements, responsibilities...`}
                    value={exp}
                    onChange={(e) => {
                      const newExp = [...userData.experience];
                      newExp[index] = e.target.value;
                      setUserData({ ...userData, experience: newExp });
                    }}
                  />
                  {userData.experience.length > 1 && (
                    <button
                      onClick={() => setUserData({ ...userData, experience: userData.experience.filter((_, i) => i !== index) })}
                      className="absolute top-4 right-4 bg-white shadow-sm border border-gray-100 text-gray-400 hover:text-red-500 w-8 h-8 rounded-lg flex items-center justify-center opacity-100 md:opacity-0 group-hover:opacity-100 transition-all"
                      type="button"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={() => setUserData({ ...userData, experience: [...userData.experience, ""] })}
              className="mt-4 flex items-center justify-center gap-2 text-sm font-bold text-gray-600 bg-gray-50 border border-gray-100 hover:border-gray-200 hover:bg-gray-100 px-6 py-3 rounded-xl transition-colors w-full sm:w-auto"
            >
              <span className="text-lg leading-none">+</span> Add Another Role
            </button>
          </div>
        </div>

        {/* ── EDUCATION, CERTIFICATIONS & SKILLS ── */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 border-b border-[#f3f4f6] pb-4">
            <div className="bg-orange-50 p-2.5 rounded-xl text-orange-500"><GraduationCap size={22} /></div>
            <h3 className="text-xl font-bold tracking-tight text-[#111827]">Education, Certifications & Skills</h3>
          </div>
          <div className="space-y-8">

            {/* Education */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-2">Education</label>
              <textarea
                rows={3}
                className="w-full bg-[#f9fafb] border border-gray-100 rounded-xl px-5 py-4 focus:ring-2 focus:ring-[#FF6321]/20 focus:border-[#FF6321] focus:bg-white outline-none transition-all resize-none text-[15px] leading-relaxed placeholder:text-gray-400"
                placeholder="e.g. Intermediate, Govt Degree College Hyderabad, 2024–2026"
                value={userData.education}
                onChange={(e) => setUserData({ ...userData, education: e.target.value })}
              />
            </div>

            {/* ✅ NEW: Certifications */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Award size={15} className="text-orange-400" />
                <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500">Certifications <span className="normal-case font-normal text-gray-400">(Optional)</span></label>
              </div>
              <div className="space-y-4">
                {((userData as any).certifications ?? [""]).map((cert: string, index: number) => (
                  <div key={index} className="relative group">
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><Award size={18} /></div>
                      <input
                        type="text"
                        className="w-full bg-[#f9fafb] border border-gray-100 rounded-xl pl-12 pr-12 py-3.5 focus:ring-2 focus:ring-[#FF6321]/20 focus:border-[#FF6321] focus:bg-white outline-none transition-all placeholder:text-gray-400 font-medium"
                        placeholder={`e.g. Graphic Design & Video Editing — Zeb Tech, 2023`}
                        value={cert}
                        onChange={(e) => {
                          const certs = [...((userData as any).certifications ?? [""])];
                          certs[index] = e.target.value;
                          setUserData({ ...userData, certifications: certs } as any);
                        }}
                      />
                      {((userData as any).certifications ?? [""]).length > 1 && (
                        <button
                          onClick={() => {
                            const certs = ((userData as any).certifications ?? [""]).filter((_: any, i: number) => i !== index);
                            setUserData({ ...userData, certifications: certs } as any);
                          }}
                          className="absolute top-1/2 -translate-y-1/2 right-4 text-gray-400 hover:text-red-500 transition-colors"
                          type="button"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => {
                  const certs = [...((userData as any).certifications ?? [""])];
                  setUserData({ ...userData, certifications: [...certs, ""] } as any);
                }}
                className="mt-4 flex items-center justify-center gap-2 text-sm font-bold text-gray-600 bg-gray-50 border border-gray-100 hover:border-gray-200 hover:bg-gray-100 px-6 py-3 rounded-xl transition-colors w-full sm:w-auto"
              >
                <span className="text-lg leading-none">+</span> Add Certification
              </button>
            </div>

            {/* Skills */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-2">Skills</label>
              <div className="space-y-4">
                {userData.skills.map((skill, index) => (
                  <div key={index} className="relative group">
                    <textarea
                      rows={2}
                      className="w-full bg-[#f9fafb] border border-gray-100 rounded-xl px-5 py-4 focus:ring-2 focus:ring-[#FF6321]/20 focus:border-[#FF6321] focus:bg-white outline-none transition-all resize-none text-[15px] leading-relaxed placeholder:text-gray-400"
                      placeholder={`Skill Group ${index + 1}: e.g. Graphic Design, Photoshop, Illustrator, Canva`}
                      value={skill}
                      onChange={(e) => {
                        const newSkills = [...userData.skills];
                        newSkills[index] = e.target.value;
                        setUserData({ ...userData, skills: newSkills });
                      }}
                    />
                    {userData.skills.length > 1 && (
                      <button
                        onClick={() => setUserData({ ...userData, skills: userData.skills.filter((_, i) => i !== index) })}
                        className="absolute top-4 right-4 bg-white shadow-sm border border-gray-100 text-gray-400 hover:text-red-500 w-8 h-8 rounded-lg flex items-center justify-center opacity-100 md:opacity-0 group-hover:opacity-100 transition-all"
                        type="button"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                onClick={() => setUserData({ ...userData, skills: [...userData.skills, ""] })}
                className="mt-4 flex items-center justify-center gap-2 text-sm font-bold text-gray-600 bg-gray-50 border border-gray-100 hover:border-gray-200 hover:bg-gray-100 px-6 py-3 rounded-xl transition-colors w-full sm:w-auto"
              >
                <Code2 size={16} /> Add Skill Group
              </button>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="pt-8 border-t border-[#f3f4f6] flex justify-between items-center">
          <button
            onClick={() => setStep(Step.LANDING)}
            className="flex items-center gap-2 px-6 py-4 bg-[#f9fafb] border border-gray-100 text-[#4b5563] font-bold rounded-xl hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft size={18} /> <span className="hidden sm:inline">Back</span>
          </button>
          <button
            disabled={!userData.fullName || userData.experience.filter(e => e.trim()).length === 0}
            onClick={() => setStep(Step.DESIGN)}
            className="group flex items-center gap-4 bg-gradient-to-r from-[#FF6321] to-orange-600 text-white px-8 py-4 rounded-xl font-bold text-base shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
          >
            Confirm Details
            <div className="bg-white/20 p-1.5 rounded-lg group-hover:bg-white/30 transition-colors">
              <ArrowRight size={18} />
            </div>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
