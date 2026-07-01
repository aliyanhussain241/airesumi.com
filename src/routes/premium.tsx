import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { Crown, Check, Zap, Shield, Sparkles, FileText, Target, Mail, Linkedin, PenLine, ArrowRight, Star, AlertCircle, X, Infinity as InfinityIcon, TrendingUp, Award, Users, Clock, Headphones } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type BillingCycle = "monthly" | "yearly" | "lifetime";

const PLAN_MAP: Record<BillingCycle, { id: string; label: string; price: string; period: string; originalPrice: string | null; badge: string | null; save: string | null; perMonth: string | null }> = {
  monthly:  { id: "pro_monthly", label: "Monthly",  price: "$9",  period: "/month",   originalPrice: null,   badge: null,          save: null,        perMonth: null },
  yearly:   { id: "pro_yearly",  label: "Yearly",   price: "$59", period: "/year",    originalPrice: "$108", badge: "Save 45%",    save: "Save $49",  perMonth: "$4.92/mo" },
  lifetime: { id: "lifetime",    label: "Lifetime", price: "$99", period: " one-time",originalPrice: "$199", badge: "Best Value",  save: "Save $100", perMonth: "Pay once" },
};

const PRO_FEATURES = [
  { icon: FileText, text: "Unlimited resume generations", desc: "Build as many as you want, forever." },
  { icon: Target, text: "Unlimited ATS scans", desc: "Optimize every application to a 90+ score." },
  { icon: Mail, text: "Unlimited cover letters", desc: "AI-tailored to each job description." },
  { icon: Linkedin, text: "LinkedIn Bio Generator", desc: "Recruiter-ready headline & about section." },
  { icon: PenLine, text: "Resume Bullet Writer", desc: "Turn duties into achievements instantly." },
  { icon: Sparkles, text: "Summary Generator", desc: "Hook recruiters in the first 4 seconds." },
  { icon: Zap, text: "Keyword Scanner", desc: "Match every JD keyword automatically." },
  { icon: Shield, text: "Priority AI generation", desc: "3× faster processing, zero queue." },
  { icon: Star, text: "Premium templates", desc: "12 exclusive recruiter-approved designs." },
  { icon: Crown, text: "No PDF watermarks", desc: "Clean, professional export every time." },
];

const COMPARE_ROWS = [
  { label: "Resume generations",   free: "3 / month",  pro: "Unlimited" },
  { label: "ATS Checker",          free: "3 scans",    pro: "Unlimited" },
  { label: "Cover Letter tool",    free: "1 / month",  pro: "Unlimited" },
  { label: "Premium templates",    free: false,        pro: true },
  { label: "LinkedIn Bio",         free: false,        pro: true },
  { label: "Bullet & Summary AI",  free: false,        pro: true },
  { label: "PDF watermark",        free: "Yes",        pro: "Removed" },
  { label: "Priority AI queue",    free: false,        pro: true },
  { label: "Priority support",     free: false,        pro: true },
];

const TESTIMONIALS = [
  { name: "Sarah K.", role: "Software Engineer · Meta",   text: "Got 3 interview calls in the first week after using airesumi Pro. The ATS optimization is on another level.", avatar: "SK", rating: 5 },
  { name: "Ali R.",   role: "Marketing Manager · Shopify", text: "The ATS checker alone is worth it. My resume score went from 52% to 91% overnight.", avatar: "AR", rating: 5 },
  { name: "Priya M.", role: "Data Analyst · Stripe",       text: "Best $9 I ever spent. Landed my dream job in 2 weeks flat. The bullet writer is magic.", avatar: "PM", rating: 5 },
];

const STATS = [
  { icon: Users,      value: "180K+", label: "Job seekers hired" },
  { icon: TrendingUp, value: "3.2×",  label: "More interview calls" },
  { icon: Award,      value: "91%",   label: "Avg. ATS score" },
  { icon: Clock,      value: "8 min", label: "Avg. build time" },
];

function PremiumPage() {
  const navigate = useNavigate();
  const [cycle, setCycle] = useState<BillingCycle>("yearly");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPro, setIsPro] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);

  useEffect(() => {
    async function checkStatus() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { setCheckingStatus(false); return; }
      try {
        const res = await fetch("/api/subscription-status", {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        const data = await res.json();
        setIsPro(data.isPro || false);
      } catch { }
      setCheckingStatus(false);
    }
    checkStatus();
  }, []);

  async function handleCheckout() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { navigate({ to: "/login" }); return; }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ plan: PLAN_MAP[cycle].id }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.error?.includes("apiKey") || data.error?.includes("authenticator") || data.error?.includes("Stripe") || data.error?.includes("config")) {
          throw new Error("Payment is temporarily unavailable. Please try again later or contact support.");
        }
        throw new Error(data.error || "Something went wrong. Please try again.");
      }
      window.location.href = data.url;
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  if (checkingStatus) return null;

  const selectedPlan = PLAN_MAP[cycle];

  return (
    <div className="min-h-screen bg-[#0b1020] text-white pt-[68px] relative overflow-hidden">
      {/* Ambient background */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full bg-[radial-gradient(closest-side,rgba(249,115,22,0.22),transparent)] blur-3xl" />
        <div className="absolute top-[600px] -left-40 w-[500px] h-[500px] rounded-full bg-[radial-gradient(closest-side,rgba(168,85,247,0.14),transparent)] blur-3xl" />
        <div className="absolute top-[400px] -right-40 w-[500px] h-[500px] rounded-full bg-[radial-gradient(closest-side,rgba(59,130,246,0.14),transparent)] blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]" />
      </div>

      {isPro && (
        <div className="relative z-10 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-center py-3 px-4 text-[14px] font-semibold">
          ✨ You're already on Pro! <Link to="/resume" className="underline ml-2 text-white">Start building →</Link>
        </div>
      )}

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-16 lg:py-24">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-white/[0.06] backdrop-blur px-4 py-1.5 rounded-full text-orange-300 font-bold text-[12px] mb-6 border border-orange-500/25 uppercase tracking-[0.14em]">
            <Crown size={13} className="fill-orange-400" /> airesumi Pro
          </div>
          <h1 className="text-[44px] sm:text-[62px] lg:text-[72px] font-bold tracking-[-0.03em] mb-5 leading-[1.02] text-balance">
            Unlock your full
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-300 via-orange-500 to-amber-400">
              career potential
            </span>
          </h1>
          <p className="text-[17px] lg:text-[19px] text-gray-400 max-w-2xl mx-auto leading-relaxed text-pretty">
            Every AI tool, every premium template, zero limits — everything you need to land your next role, in one plan.
          </p>

          {/* Trust chips */}
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {[
              { icon: Shield, t: "Secure Stripe checkout" },
              { icon: InfinityIcon, t: "Cancel anytime" },
              { icon: Award, t: "14-day money back" },
            ].map(({ icon: I, t }) => (
              <div key={t} className="flex items-center gap-2 bg-white/5 border border-white/10 backdrop-blur px-3.5 py-1.5 rounded-full text-[12.5px] text-gray-300">
                <I size={13} className="text-orange-400" /> {t}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Stats strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-14">
          {STATS.map(({ icon: Icon, value, label }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur px-5 py-4 text-center"
            >
              <Icon size={18} className="text-orange-400 mx-auto mb-1.5" />
              <div className="text-[22px] font-bold text-white">{value}</div>
              <div className="text-[11.5px] text-gray-500 uppercase tracking-wider mt-0.5">{label}</div>
            </motion.div>
          ))}
        </div>

        {/* Pricing card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative max-w-4xl mx-auto mb-20"
        >
          {/* Glow border */}
          <div aria-hidden className="absolute -inset-px rounded-[32px] bg-gradient-to-br from-orange-500/60 via-amber-400/30 to-purple-500/40 blur-[2px] opacity-70" />
          <div className="relative rounded-[32px] bg-gradient-to-b from-white/[0.06] to-white/[0.02] backdrop-blur-xl border border-white/10 p-6 sm:p-10">

            {/* Billing toggle */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex bg-white/[0.04] border border-white/10 rounded-full p-1 relative">
                {(Object.keys(PLAN_MAP) as BillingCycle[]).map(k => (
                  <button
                    key={k}
                    onClick={() => setCycle(k)}
                    className={`relative z-10 px-5 sm:px-6 py-2.5 text-[13px] font-semibold rounded-full transition-colors capitalize ${cycle === k ? "text-white" : "text-gray-400 hover:text-gray-200"}`}
                  >
                    {cycle === k && (
                      <motion.span
                        layoutId="cycle-pill"
                        className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 shadow-[0_6px_20px_-6px_rgba(249,115,22,0.7)]"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className="relative flex items-center gap-1.5">
                      {PLAN_MAP[k].label}
                      {k === "yearly" && <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${cycle === k ? "bg-white/20 text-white" : "bg-orange-500/20 text-orange-300"}`}>−45%</span>}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price display */}
            <div className="text-center mb-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={cycle}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-baseline justify-center gap-2 mb-2">
                    {selectedPlan.originalPrice && (
                      <span className="text-[22px] text-gray-500 line-through">{selectedPlan.originalPrice}</span>
                    )}
                    <span className="text-[64px] sm:text-[80px] font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400 leading-none">
                      {selectedPlan.price}
                    </span>
                    <span className="text-[16px] text-gray-400">{selectedPlan.period}</span>
                  </div>
                  {selectedPlan.perMonth && (
                    <div className="flex items-center justify-center gap-2 text-[13px]">
                      <span className="text-gray-400">{selectedPlan.perMonth}</span>
                      {selectedPlan.save && (
                        <span className="text-orange-300 font-semibold bg-orange-500/10 border border-orange-500/25 px-2 py-0.5 rounded-full text-[11.5px]">
                          {selectedPlan.save}
                        </span>
                      )}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* CTA */}
            <div className="flex flex-col items-center">
              {error && (
                <div className="flex items-start gap-2 text-red-300 bg-red-500/10 border border-red-500/25 rounded-xl px-4 py-3 text-[13px] mb-5 max-w-md">
                  <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}
              {isPro ? (
                <Link
                  to="/resume"
                  className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-[16.5px] rounded-full hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_16px_50px_-16px_rgba(249,115,22,0.8)] no-underline flex items-center justify-center gap-2"
                >
                  Start Building <ArrowRight size={18} />
                </Link>
              ) : (
                <button
                  onClick={handleCheckout}
                  disabled={loading}
                  className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-[16.5px] rounded-full hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_16px_50px_-16px_rgba(249,115,22,0.8)] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 border-none cursor-pointer min-w-[280px]"
                >
                  {loading ? "Redirecting to Stripe..." : <>Get Pro — {selectedPlan.price}<ArrowRight size={18} /></>}
                </button>
              )}
              <p className="text-[12.5px] text-gray-500 mt-4 flex items-center gap-1.5">
                <Shield size={12} /> Secure via Stripe · Cancel anytime · 14-day guarantee
              </p>
            </div>

            {/* Included highlights */}
            <div className="mt-10 pt-8 border-t border-white/10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                {PRO_FEATURES.map(({ icon: Icon, text, desc }) => (
                  <div key={text} className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500/25 to-amber-500/10 border border-orange-500/20 flex items-center justify-center flex-shrink-0">
                      <Icon size={15} className="text-orange-300" />
                    </div>
                    <div>
                      <div className="text-[14px] font-semibold text-white leading-tight">{text}</div>
                      <div className="text-[12.5px] text-gray-500 mt-0.5">{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Compare table */}
        <div className="mb-20">
          <div className="text-center mb-8">
            <h2 className="text-[28px] sm:text-[36px] font-bold tracking-tight">Free vs Pro</h2>
            <p className="text-gray-400 text-[15px] mt-2">See exactly what you unlock.</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl overflow-hidden">
            <div className="grid grid-cols-[1.4fr_1fr_1fr] text-[13px]">
              <div className="p-4 sm:p-5 text-gray-500 uppercase tracking-wider text-[11.5px] font-semibold border-b border-white/10">Feature</div>
              <div className="p-4 sm:p-5 text-gray-400 uppercase tracking-wider text-[11.5px] font-semibold text-center border-b border-white/10 border-l border-white/10">Free</div>
              <div className="p-4 sm:p-5 text-orange-300 uppercase tracking-wider text-[11.5px] font-semibold text-center border-b border-white/10 border-l border-white/10 bg-orange-500/[0.06]">
                <div className="flex items-center justify-center gap-1.5"><Crown size={12} className="fill-orange-400" /> Pro</div>
              </div>
              {COMPARE_ROWS.map((row, i) => (
                <div key={row.label} className="contents">
                  <div className={`p-4 sm:p-5 text-[14px] text-gray-200 font-medium ${i < COMPARE_ROWS.length - 1 ? "border-b border-white/5" : ""}`}>{row.label}</div>
                  <div className={`p-4 sm:p-5 text-center border-l border-white/10 ${i < COMPARE_ROWS.length - 1 ? "border-b border-white/5" : ""}`}>
                    {typeof row.free === "boolean"
                      ? (row.free ? <Check size={16} className="text-green-400 mx-auto" /> : <X size={16} className="text-gray-600 mx-auto" />)
                      : <span className="text-gray-400 text-[13.5px]">{row.free}</span>}
                  </div>
                  <div className={`p-4 sm:p-5 text-center border-l border-white/10 bg-orange-500/[0.04] ${i < COMPARE_ROWS.length - 1 ? "border-b border-white/5" : ""}`}>
                    {typeof row.pro === "boolean"
                      ? (row.pro ? <Check size={16} className="text-orange-400 mx-auto" /> : <X size={16} className="text-gray-600 mx-auto" />)
                      : <span className="text-white text-[13.5px] font-semibold">{row.pro}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-1 mb-3">
              {[...Array(5)].map((_, i) => <Star key={i} size={16} className="text-orange-400 fill-orange-400" />)}
              <span className="text-[13px] text-gray-400 ml-2">4.9 · 12,400+ reviews</span>
            </div>
            <h2 className="text-[28px] sm:text-[36px] font-bold tracking-tight">Loved by job seekers worldwide</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur p-6 hover:border-orange-500/30 hover:-translate-y-1 transition-all"
              >
                <div className="flex gap-0.5 mb-4">
                  {[...Array(t.rating)].map((_, i) => <Star key={i} size={13} className="text-orange-400 fill-orange-400" />)}
                </div>
                <p className="text-[14.5px] text-gray-200 leading-relaxed mb-5">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-[13px] font-bold flex-shrink-0 text-white">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-white">{t.name}</p>
                    <p className="text-[11.5px] text-gray-500">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto mb-16">
          <div className="text-center mb-8">
            <h2 className="text-[28px] sm:text-[36px] font-bold tracking-tight">Questions? Answered.</h2>
          </div>
          <div className="space-y-3">
            {[
              { q: "Can I cancel anytime?", a: "Yes — cancel anytime from your account in a single click. No questions asked. You keep Pro access until the end of your billing period." },
              { q: "Is my payment secure?", a: "100%. Payments are processed by Stripe — the same payment system used by Amazon, Google, and Shopify. We never see or store your card details." },
              { q: "What's the difference between Monthly, Yearly, and Lifetime?", a: "Same features across all plans. Yearly saves you 45% compared to monthly billing. Lifetime is a one-time payment for permanent access, no renewals ever." },
              { q: "Do you offer a refund?", a: "Yes — every plan comes with a 14-day money-back guarantee. If Pro isn't for you, email us and we'll refund you, no questions asked." },
              { q: "Do I need Pro to use airesumi?", a: "No. The free plan works forever with limits. Pro removes every limit and unlocks premium templates and advanced AI tools." },
            ].map(({ q, a }, i) => (
              <details key={q} className="group rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.05] transition-colors p-5 sm:p-6" open={i === 0}>
                <summary className="flex items-center justify-between gap-4 cursor-pointer list-none">
                  <span className="text-[15px] sm:text-[16px] font-semibold text-white">{q}</span>
                  <span className="w-7 h-7 rounded-full bg-orange-500/15 border border-orange-500/25 text-orange-300 text-xl flex items-center justify-center flex-shrink-0 group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="text-[14px] text-gray-400 leading-relaxed mt-3 pr-10">{a}</p>
              </details>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative rounded-[32px] overflow-hidden border border-white/10 bg-gradient-to-br from-orange-500/20 via-amber-500/10 to-purple-500/15 p-8 sm:p-14 text-center"
        >
          <div aria-hidden className="absolute -top-32 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-[radial-gradient(closest-side,rgba(249,115,22,0.35),transparent)] blur-3xl" />
          <div className="relative">
            <Headphones size={30} className="text-orange-300 mx-auto mb-4" />
            <h3 className="text-[28px] sm:text-[38px] font-bold tracking-tight mb-3 text-balance">
              Ready to land your dream job?
            </h3>
            <p className="text-gray-300 text-[15px] sm:text-[16px] mb-8 max-w-lg mx-auto">
              Join 180,000+ professionals who upgraded their careers with airesumi Pro.
            </p>
            {!isPro && (
              <button
                onClick={handleCheckout}
                disabled={loading}
                className="px-10 py-4 bg-white text-[#0b1020] font-bold text-[16px] rounded-full hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_16px_50px_-16px_rgba(255,255,255,0.4)] disabled:opacity-60 border-none cursor-pointer inline-flex items-center gap-2"
              >
                Start Pro Today <ArrowRight size={17} />
              </button>
            )}
            <p className="text-[12px] text-gray-400 mt-4">14-day money back · Cancel anytime</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/premium")({
  head: () => ({
    meta: [
      { title: "airesumi Pro — Premium AI Resume Tools | airesumi.com" },
      { name: "description", content: "Unlock unlimited resumes, ATS scans, cover letters, and premium templates with airesumi Pro. Plans from $4.92/month. 14-day money-back guarantee." },
      { property: "og:title", content: "airesumi Pro — Unlock your full career potential" },
      { property: "og:description", content: "Every AI tool, every premium template, zero limits. From $4.92/month." },
      { property: "og:url", content: "https://airesumi.com/premium" },
    ],
    links: [{ rel: "canonical", href: "https://airesumi.com/premium" }],
  }),
  component: PremiumPage,
});
