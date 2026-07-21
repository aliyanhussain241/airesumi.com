import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useState } from "react";
import { z } from "zod";
import { Sparkles, Upload, Users, Send, Crown, CheckCircle2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const emailSchema = z.string().trim().email({ message: "Please enter a valid email address" }).max(255);

function RecruiterMatchPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "duplicate" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      setStatus("error");
      setErrorMsg(parsed.error.issues[0]?.message ?? "Invalid email");
      return;
    }

    setStatus("loading");
    const { error } = await supabase
      .from("recruiter_match_waitlist")
      .insert({ email: parsed.data.toLowerCase() });

    if (error) {
      // Unique violation → duplicate
      if (error.code === "23505" || /duplicate|unique/i.test(error.message)) {
        setStatus("duplicate");
      } else {
        setStatus("error");
        setErrorMsg("Something went wrong. Please try again.");
      }
      return;
    }
    setStatus("success");
  };

  const steps = [
    { icon: Upload, title: "Upload your resume", desc: "We match it to your target role and industry." },
    { icon: Users, title: "We find the right recruiters", desc: "Pulled from our network of active recruiters hiring in your field." },
    { icon: Send, title: "Your resume goes out weekly", desc: "Every week, your resume is sent to a fresh batch of matched recruiters." },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full bg-[#F8FAFC] min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-gradient-radial from-orange-100/60 via-orange-50/30 to-transparent blur-3xl" />
        </div>

        <div className="max-w-3xl mx-auto px-6 pt-24 pb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 border border-orange-200 text-[#EA580C] text-[13px] font-semibold mb-8"
          >
            <Sparkles size={14} />
            Coming Soon — Premium Feature
          </motion.div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#0f172a] leading-[1.1] mb-6">
            We Send Your Resume to{" "}
            <span className="text-[#FF6321]">50 Recruiters</span>{" "}
            Every Week
          </h1>

          <p className="text-lg text-[#475569] leading-relaxed max-w-2xl mx-auto mb-10">
            Stop applying into the void. Recruiter Match gets your resume in front of real recruiters actively hiring for your role — automatically, every week.
          </p>

          {/* Waitlist Form */}
          <div className="liquid-card rounded-3xl p-6 md:p-8 max-w-xl mx-auto text-left">
            <span className="liquid-card-shine" />
            <div className="liquid-card-content">
              {status === "success" || status === "duplicate" ? (
                <div className="flex items-start gap-3 py-2">
                  <div className="shrink-0 w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                    <CheckCircle2 className="text-emerald-600" size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-[#0f172a] text-[16px]">
                      {status === "duplicate"
                        ? "You're already on the waitlist"
                        : "You're on the list."}
                    </p>
                    <p className="text-[14px] text-[#64748b] mt-1">
                      {status === "duplicate"
                        ? "We'll email you the moment Recruiter Match launches."
                        : "We'll email you when Recruiter Match launches."}
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@work.com"
                    disabled={status === "loading"}
                    className="flex-1 min-w-0 px-5 py-3.5 rounded-2xl bg-white border border-[#e2e8f0] text-[15px] text-[#0f172a] placeholder:text-[#94a3b8] focus:outline-none focus:border-[#FF6321] focus:ring-4 focus:ring-orange-100 transition"
                    aria-label="Email address"
                    maxLength={255}
                  />
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#FF6321] hover:bg-[#EA580C] text-white font-semibold text-[15px] shadow-lg shadow-orange-500/20 transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    {status === "loading" ? (
                      <>
                        <Loader2 size={16} className="animate-spin" /> Joining…
                      </>
                    ) : (
                      "Join the Waitlist"
                    )}
                  </button>
                </form>
              )}
              {status === "error" && (
                <p className="mt-3 text-[13px] text-red-600">{errorMsg}</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-[#0f172a] mb-4">
          How it works
        </h2>
        <p className="text-center text-[#64748b] mb-14 max-w-2xl mx-auto">
          Three simple steps to get your resume in the right hands.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="liquid-card rounded-3xl p-7"
              >
                <span className="liquid-card-shine" />
                <div className="liquid-card-content">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="inline-flex p-3 rounded-2xl bg-orange-50 text-[#FF6321]">
                      <Icon size={22} />
                    </div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                      Step {i + 1}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-[#0f172a] mb-2">{s.title}</h3>
                  <p className="text-[15px] text-[#64748b] leading-relaxed">{s.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Premium section */}
      <section className="max-w-3xl mx-auto px-6 pb-24">
        <div className="liquid-card rounded-3xl p-8 md:p-10">
          <span className="liquid-card-shine" />
          <div className="liquid-card-content text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-orange-100 to-amber-100 text-[#EA580C] text-[12px] font-bold mb-4">
              <Crown size={13} /> PREMIUM
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#0f172a] mb-3">
              Part of Airesumi Premium
            </h2>
            <p className="text-[15px] text-[#64748b] leading-relaxed max-w-xl mx-auto">
              Recruiter Match will be available exclusively to Premium members. Join the waitlist to get early access and a launch discount.
            </p>
          </div>
        </div>
      </section>
    </motion.div>
  );
}

export const Route = createFileRoute("/recruiter-match")({
  head: () => ({
    meta: [
      { title: "Recruiter Match — Get Your Resume in Front of 50 Recruiters Weekly | Airesumi" },
      { name: "description", content: "Join the waitlist for Recruiter Match. We send your resume to 50 actively hiring recruiters every week, automatically." },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: "Recruiter Match — 50 Recruiters Every Week | Airesumi" },
      { property: "og:description", content: "Join the waitlist for Recruiter Match. We send your resume to 50 actively hiring recruiters every week, automatically." },
      { property: "og:url", content: "https://airesumi.com/recruiter-match" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Recruiter Match — 50 Recruiters Every Week | Airesumi" },
    ],
    links: [{ rel: "canonical", href: "https://airesumi.com/recruiter-match" }],
  }),
  component: RecruiterMatchPage,
});
