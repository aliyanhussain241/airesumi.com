import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { Crown, Check, Zap, Shield, Sparkles, FileText, Target, Mail, Linkedin, PenLine, ArrowRight, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const PLANS = [
  {
    id: "pro_monthly",
    label: "Pro Monthly",
    price: "$9",
    period: "/month",
    originalPrice: null,
    badge: null,
    highlight: false,
  },
  {
    id: "pro_yearly",
    label: "Pro Yearly",
    price: "$59",
    period: "/year",
    originalPrice: "$108",
    badge: "Save 45%",
    highlight: true,
  },
  {
    id: "lifetime",
    label: "Lifetime",
    price: "$99",
    period: " one-time",
    originalPrice: "$199",
    badge: "Best Value",
    highlight: false,
  },
];

const PRO_FEATURES = [
  { icon: FileText, text: "Unlimited resume generations" },
  { icon: Target, text: "ATS Checker — unlimited scans" },
  { icon: Mail, text: "Cover Letter Generator — unlimited" },
  { icon: Linkedin, text: "LinkedIn Bio Generator" },
  { icon: PenLine, text: "Resume Bullet Writer" },
  { icon: Sparkles, text: "Resume Summary Generator" },
  { icon: Zap, text: "Keyword Scanner — unlimited" },
  { icon: Shield, text: "Priority AI generation" },
  { icon: Star, text: "Premium resume templates" },
  { icon: Crown, text: "No watermarks on PDF" },
];

const TESTIMONIALS = [
  { name: "Sarah K.", role: "Software Engineer", text: "Got 3 interview calls in the first week after using airesumi Pro!", avatar: "SK" },
  { name: "Ali R.", role: "Marketing Manager", text: "The ATS checker alone is worth it. My resume score went from 52% to 91%.", avatar: "AR" },
  { name: "Priya M.", role: "Data Analyst", text: "Best $9 I ever spent. Landed my dream job in 2 weeks.", avatar: "PM" },
];

function PremiumPage() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState("pro_yearly");
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
        body: JSON.stringify({ plan: selectedPlan }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      window.location.href = data.url;
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  if (checkingStatus) return null;

  return (
    <div className="min-h-screen bg-[#111827] text-white pt-[68px]">

      {/* Already Pro Banner */}
      {isPro && (
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-center py-3 px-4 text-[14px] font-semibold">
          ✨ You are already on Pro! <Link to="/resume" className="underline ml-2 text-white">Start building →</Link>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-6 py-16">

        {/* Hero */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full text-orange-400 font-bold text-[13px] mb-6 border border-white/10">
            <Crown size={15} className="fill-orange-400" /> airesumi Pro
          </div>
          <h1 className="text-[48px] sm:text-[56px] font-bold tracking-tight mb-4 leading-tight">
            Unlock Your Full<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
              Career Potential
            </span>
          </h1>
          <p className="text-[17px] text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Everything you need to land your dream job — unlimited AI tools, premium templates, and no limits.
          </p>
        </div>

        {/* Plan Selector */}
        <div className="flex justify-center gap-3 mb-10 flex-wrap">
          {PLANS.map(plan => (
            <button
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={`relative px-6 py-4 rounded-2xl border-2 transition-all cursor-pointer text-left min-w-[140px] ${
                selectedPlan === plan.id
                  ? "border-orange-500 bg-orange-500/10"
                  : "border-white/10 bg-white/5 hover:border-white/20"
              }`}
            >
              {plan.badge && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap">
                  {plan.badge}
                </span>
              )}
              <div className="text-[13px] text-gray-400 mb-1">{plan.label}</div>
              <div className="flex items-end gap-1">
                <span className="text-[28px] font-bold text-white">{plan.price}</span>
                <span className="text-[13px] text-gray-400 mb-1">{plan.period}</span>
              </div>
              {plan.originalPrice && (
                <div className="text-[12px] text-gray-500 line-through">{plan.originalPrice}</div>
              )}
            </button>
          ))}
        </div>

        {/* CTA Button */}
        <div className="flex flex-col items-center mb-16">
          {error && (
            <p className="text-red-400 text-[13px] mb-3">{error}</p>
          )}
          {isPro ? (
            <Link to="/resume"
              className="px-10 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold text-[17px] rounded-full hover:scale-105 transition-all shadow-[0_10px_40px_-10px_rgba(249,115,22,0.8)] no-underline flex items-center gap-2">
              Start Building <ArrowRight size={18} />
            </Link>
          ) : (
            <button onClick={handleCheckout} disabled={loading}
              className="px-10 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold text-[17px] rounded-full hover:scale-105 transition-all shadow-[0_10px_40px_-10px_rgba(249,115,22,0.8)] disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2 border-none cursor-pointer">
              {loading ? "Redirecting to Stripe..." : `Get Pro — ${PLANS.find(p => p.id === selectedPlan)?.price}`}
              {!loading && <ArrowRight size={18} />}
            </button>
          )}
          <p className="text-[13px] text-gray-500 mt-3 flex items-center gap-1.5">
            <Shield size={13} /> Secure payment via Stripe · Cancel anytime
          </p>
        </div>

        {/* Features Grid */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 mb-14">
          <h2 className="text-[20px] font-bold text-center mb-8">Everything included in Pro</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PRO_FEATURES.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon size={15} className="text-orange-400" />
                </div>
                <span className="text-[14px] text-gray-300">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-14">
          <h2 className="text-[20px] font-bold text-center mb-8">What Pro users say</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 bg-orange-500 rounded-full flex items-center justify-center text-[13px] font-bold flex-shrink-0">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-white">{t.name}</p>
                    <p className="text-[11px] text-gray-500">{t.role}</p>
                  </div>
                </div>
                <p className="text-[13px] text-gray-400 leading-relaxed">"{t.text}"</p>
                <div className="flex gap-0.5 mt-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} className="text-orange-400 fill-orange-400" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 mb-10">
          <h2 className="text-[20px] font-bold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-5">
            {[
              { q: "Can I cancel anytime?", a: "Yes — cancel anytime from your account. No questions asked. You keep access until the end of your billing period." },
              { q: "Is my payment secure?", a: "100%. We use Stripe — the same payment system used by Amazon and Google. We never store your card details." },
              { q: "What's the difference between Monthly and Yearly?", a: "Same features, yearly saves you 45%. Lifetime is a one-time payment for forever access." },
              { q: "Do I need a credit card for the free plan?", a: "No. The free plan is completely free, no credit card needed." },
            ].map(({ q, a }) => (
              <div key={q} className="border-b border-white/10 pb-5 last:border-0 last:pb-0">
                <p className="text-[15px] font-semibold text-white mb-2">{q}</p>
                <p className="text-[14px] text-gray-400 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <p className="text-gray-400 text-[15px] mb-4">Ready to land your dream job?</p>
          {!isPro && (
            <button onClick={handleCheckout} disabled={loading}
              className="px-10 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold text-[17px] rounded-full hover:scale-105 transition-all shadow-[0_10px_40px_-10px_rgba(249,115,22,0.8)] disabled:opacity-60 border-none cursor-pointer">
              Start Pro Today →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/premium")({
  head: () => ({
    meta: [
      { title: "airesumi Pro — Premium AI Resume Tools | airesumi.com" },
      { name: "description", content: "Unlimited resumes, ATS checker, cover letters and more with airesumi Pro from $9/month." },
    ],
    links: [{ rel: "canonical", href: "https://airesumi.com/premium" }],
  }),
  component: PremiumPage,
});
