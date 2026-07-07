import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Sparkles, Zap, ArrowRight, Infinity as InfinityIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type CreditRow = {
  credits_remaining: number;
  total_credits_used: number;
  plan: "free" | "pro";
};

const FREE_ALLOWANCE = 3;

export function PlanCreditsCard() {
  const [userId, setUserId] = useState<string | null>(null);
  const [row, setRow] = useState<CreditRow | null>(null);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted) setUserId(session?.user?.id ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) =>
      setUserId(s?.user?.id ?? null)
    );
    return () => { mounted = false; subscription.unsubscribe(); };
  }, []);

  useEffect(() => {
    if (!userId) { setRow(null); return; }
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("user_credits")
        .select("credits_remaining, total_credits_used, plan")
        .eq("user_id", userId)
        .maybeSingle();
      if (!cancelled && data) setRow(data as CreditRow);
    })();

    const channel = supabase
      .channel(`dashboard_credits:${userId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "user_credits", filter: `user_id=eq.${userId}` },
        (payload) => {
          const next = payload.new as any;
          if (next) setRow({
            credits_remaining: next.credits_remaining,
            total_credits_used: next.total_credits_used,
            plan: next.plan,
          });
        }
      )
      .subscribe();

    return () => { cancelled = true; supabase.removeChannel(channel); };
  }, [userId]);

  if (!userId || !row) return null;

  const isPro = row.plan === "pro";
  const remaining = row.credits_remaining;
  const pct = isPro ? 100 : Math.max(0, Math.min(100, Math.round((remaining / FREE_ALLOWANCE) * 100)));
  const isOut = !isPro && remaining <= 0;
  const isLow = !isPro && remaining > 0 && remaining <= 1;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border mb-6 ${
        isPro
          ? "border-transparent bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#7c2d12] text-white"
          : "bg-white border-[#e5e7eb]"
      }`}
    >
      {isPro && (
        <div
          aria-hidden
          className="pointer-events-none absolute -top-16 -right-16 w-72 h-72 rounded-full blur-3xl opacity-40"
          style={{ background: "radial-gradient(circle, #f97316, transparent 70%)" }}
        />
      )}

      <div className="relative p-5 sm:p-6 flex flex-col md:flex-row md:items-center gap-5 md:gap-6">
        {/* Icon + label */}
        <div className="flex items-center gap-4 md:min-w-[220px]">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
            isPro
              ? "bg-white/15 backdrop-blur"
              : "bg-gradient-to-br from-orange-500 to-orange-600 text-white"
          }`}>
            {isPro ? <Sparkles size={22} /> : <Zap size={20} />}
          </div>
          <div>
            <p className={`text-[11px] font-bold uppercase tracking-wider ${isPro ? "text-orange-200" : "text-[#9ca3af]"}`}>
              Current plan
            </p>
            <p className={`text-[20px] font-bold leading-tight ${isPro ? "text-white" : "text-[#111827]"}`}>
              {isPro ? "Pro" : "Free"}
            </p>
          </div>
        </div>

        {/* Credits */}
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between gap-3 mb-2">
            <p className={`text-[13px] font-semibold ${isPro ? "text-orange-100" : "text-[#374151]"}`}>
              {isPro ? "AI generations" : "Free credits remaining"}
            </p>
            <p className={`text-[13px] font-mono ${isPro ? "text-orange-100" : "text-[#6b7280]"}`}>
              {isPro ? (
                <span className="inline-flex items-center gap-1"><InfinityIcon size={14} /> unlimited</span>
              ) : (
                <>
                  <span className={`text-[16px] font-bold ${isOut ? "text-red-600" : isLow ? "text-orange-600" : "text-[#111827]"}`}>
                    {remaining}
                  </span>
                  <span className="text-[#9ca3af]"> / {FREE_ALLOWANCE}</span>
                </>
              )}
            </p>
          </div>

          <div className={`h-2 rounded-full overflow-hidden ${isPro ? "bg-white/15" : "bg-[#f3f4f6]"}`}>
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                isPro
                  ? "bg-gradient-to-r from-orange-400 to-orange-500"
                  : isOut
                    ? "bg-red-500"
                    : isLow
                      ? "bg-orange-500"
                      : "bg-gradient-to-r from-orange-500 to-orange-600"
              }`}
              style={{ width: `${pct}%` }}
            />
          </div>

          <p className={`text-[12px] mt-2 ${isPro ? "text-orange-100/80" : "text-[#6b7280]"}`}>
            {isPro
              ? `You've generated ${row.total_credits_used} time${row.total_credits_used === 1 ? "" : "s"} with Pro.`
              : isOut
                ? "You've used all your free credits. Upgrade to keep generating."
                : isLow
                  ? "Almost out — upgrade to avoid interruptions."
                  : `Total used so far: ${row.total_credits_used}.`}
          </p>
        </div>

        {/* CTA */}
        <div className="flex-shrink-0 md:min-w-[180px] flex md:justify-end">
          {isPro ? (
            <Link
              to="/manage-subscription"
              className="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur text-white font-semibold text-[13px] no-underline transition-colors"
            >
              Manage plan <ArrowRight size={14} />
            </Link>
          ) : (
            <Link
              to="/premium"
              className={`inline-flex items-center gap-2 h-11 px-5 rounded-xl font-bold text-[13px] no-underline transition-all whitespace-nowrap ${
                isOut
                  ? "bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/25"
                  : "bg-gradient-to-r from-orange-500 to-orange-600 hover:opacity-95 text-white shadow-lg shadow-orange-500/25 hover:-translate-y-0.5"
              }`}
            >
              <Sparkles size={14} />
              {isOut ? "Upgrade now" : "Upgrade to Pro"}
              <ArrowRight size={14} />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
