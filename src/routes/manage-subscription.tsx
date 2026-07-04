import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  Crown, CheckCircle2, ExternalLink, CreditCard, Calendar,
  AlertCircle, ArrowRight, Loader2, Receipt, XCircle, Sparkles,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface SubStatus {
  plan: string;
  status: string;
  isPro: boolean;
  current_period_end?: string | null;
}

const PLAN_LABELS: Record<string, string> = {
  free: "Free",
  pro: "Pro Monthly",
  pro_monthly: "Pro Monthly",
  pro_yearly: "Pro Yearly",
  lifetime: "Lifetime",
};

function formatDate(iso?: string | null) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  });
}

function ManageSubscriptionPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);
  const [sub, setSub] = useState<SubStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate({ to: "/login" }); return; }
      try {
        const res = await fetch("/api/subscription-status", {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        const data = await res.json();
        setSub(data);
      } catch {
        setError("Couldn't load subscription details.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function openPortal() {
    setPortalLoading(true);
    setError(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate({ to: "/login" }); return; }
      const res = await fetch("/api/create-portal-session", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error || "Could not open billing portal");
      }
      window.location.href = data.url;
    } catch (e: any) {
      setError(e?.message || "Something went wrong");
      setPortalLoading(false);
    }
  }

  const isPro = sub?.isPro;
  const isLifetime = sub?.plan === "lifetime";
  const isCanceled = sub?.status === "canceled";
  const periodEnd = formatDate(sub?.current_period_end);
  const planLabel = PLAN_LABELS[sub?.plan || "free"] || "Free";

  return (
    <div className="min-h-screen bg-[#f9fafb] pt-[68px]">
      <div className="max-w-3xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-8">
          <div className="text-[13px] text-[#6b7280] mb-2">
            <Link to="/dashboard" className="hover:text-[#FF6321] no-underline">Dashboard</Link>
            <span className="mx-2">/</span>
            <span>Manage Subscription</span>
          </div>
          <h1 className="text-[28px] font-bold text-[#111827] tracking-tight">Manage Subscription</h1>
          <p className="text-[14px] text-[#6b7280] mt-1">
            Update payment method, view invoices, or cancel your plan.
          </p>
        </div>

        {loading && (
          <div className="bg-white border border-[#e5e7eb] rounded-2xl p-8 flex items-center justify-center">
            <Loader2 size={22} className="animate-spin text-[#FF6321]" />
          </div>
        )}

        {!loading && (
          <>
            {/* Current plan card */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className={`relative overflow-hidden bg-white border rounded-2xl p-6 mb-6 ${
                isPro ? "border-orange-200" : "border-[#e5e7eb]"
              }`}
            >
              {isPro && (
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent pointer-events-none" />
              )}
              <div className="relative flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#6b7280]">
                      Current Plan
                    </span>
                    {isPro && (
                      <span className="inline-flex items-center gap-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                        <Crown size={10} fill="white" /> Pro
                      </span>
                    )}
                  </div>
                  <h2 className="text-[26px] font-bold text-[#111827]">{planLabel}</h2>
                  <div className="flex items-center gap-2 mt-2 text-[13px] text-[#6b7280]">
                    {isCanceled ? (
                      <>
                        <XCircle size={13} className="text-red-500" />
                        <span>Canceled{periodEnd ? ` · access until ${periodEnd}` : ""}</span>
                      </>
                    ) : isLifetime ? (
                      <>
                        <CheckCircle2 size={13} className="text-green-500" />
                        <span>Lifetime access — no renewals</span>
                      </>
                    ) : isPro && periodEnd ? (
                      <>
                        <Calendar size={13} />
                        <span>Renews on {periodEnd}</span>
                      </>
                    ) : !isPro ? (
                      <>
                        <AlertCircle size={13} />
                        <span>Upgrade to unlock unlimited access</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={13} className="text-green-500" />
                        <span>Active</span>
                      </>
                    )}
                  </div>
                </div>

                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                  isPro ? "bg-gradient-to-br from-orange-500 to-orange-600 text-white" : "bg-gray-100 text-[#9ca3af]"
                }`}>
                  <Crown size={24} fill={isPro ? "white" : "none"} />
                </div>
              </div>
            </motion.div>

            {error && (
              <div className="flex items-center gap-3 bg-red-50 border border-red-100 text-red-700 rounded-xl px-4 py-3 text-[14px] mb-6">
                <AlertCircle size={16} /> {error}
              </div>
            )}

            {/* Actions */}
            {isPro && !isLifetime && (
              <div className="bg-white border border-[#e5e7eb] rounded-2xl p-6 mb-6">
                <h3 className="text-[16px] font-bold text-[#111827] mb-1">Billing & Payment</h3>
                <p className="text-[13px] text-[#6b7280] mb-4">
                  Manage everything on Stripe's secure billing portal.
                </p>

                <div className="space-y-2 mb-5">
                  <PortalAction icon={CreditCard} label="Update payment method" />
                  <PortalAction icon={Receipt} label="Download invoices & receipts" />
                  <PortalAction icon={Calendar} label="Change or cancel your plan" />
                </div>

                <button
                  onClick={openPortal}
                  disabled={portalLoading}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#111827] text-white px-6 py-3 rounded-xl font-bold text-[14px] hover:bg-[#1f2937] transition-colors disabled:opacity-60"
                >
                  {portalLoading ? (
                    <><Loader2 size={16} className="animate-spin" /> Opening…</>
                  ) : (
                    <>Manage on Stripe <ExternalLink size={14} /></>
                  )}
                </button>
                <p className="text-[11px] text-[#9ca3af] mt-3">
                  You'll be redirected to Stripe's secure portal.
                </p>
              </div>
            )}

            {isLifetime && (
              <div className="bg-gradient-to-br from-orange-50 to-white border border-orange-100 rounded-2xl p-6 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={16} className="text-[#FF6321]" />
                  <h3 className="text-[16px] font-bold text-[#111827]">You're on Lifetime</h3>
                </div>
                <p className="text-[13px] text-[#6b7280] mb-4">
                  No recurring billing to manage. You have permanent access to every Pro feature.
                </p>
                <button
                  onClick={openPortal}
                  disabled={portalLoading}
                  className="text-[13px] font-medium text-[#FF6321] hover:underline inline-flex items-center gap-1"
                >
                  View past invoices <ExternalLink size={12} />
                </button>
              </div>
            )}

            {!isPro && (
              <div className="bg-gradient-to-br from-[#111827] to-[#1f2937] text-white rounded-2xl p-8 mb-6">
                <div className="inline-flex items-center gap-1 bg-orange-500/20 text-orange-300 text-[11px] font-bold uppercase tracking-wider px-2 py-1 rounded-full mb-3">
                  <Crown size={11} /> Upgrade
                </div>
                <h3 className="text-[22px] font-bold mb-2">Unlock unlimited access</h3>
                <p className="text-[14px] text-gray-300 mb-5 max-w-md">
                  Unlimited resumes, ATS scans, cover letters, and more — starting at $9/month.
                </p>
                <Link
                  to="/premium"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-xl font-bold text-[14px] hover:scale-105 transition-transform no-underline"
                >
                  See Pro plans <ArrowRight size={14} />
                </Link>
              </div>
            )}

            {/* Support */}
            <div className="bg-white border border-[#e5e7eb] rounded-2xl p-6 text-center">
              <p className="text-[13px] text-[#6b7280]">
                Need help with billing?{" "}
                <Link to="/contact" className="text-[#FF6321] font-medium hover:underline no-underline">
                  Contact support
                </Link>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function PortalAction({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <div className="flex items-center gap-3 text-[13px] text-[#374151]">
      <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-[#FF6321]">
        <Icon size={14} />
      </div>
      {label}
    </div>
  );
}

export const Route = createFileRoute("/manage-subscription")({
  head: () => ({
    meta: [
      { name: "robots", content: "noindex, nofollow" },
      { title: "Manage Subscription | airesumi.com" },
      { name: "description", content: "Update your payment method, view invoices, or cancel your airesumi Pro subscription." },
    ],
  }),
  component: ManageSubscriptionPage,
});
