import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Sparkles, Zap, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type CreditRow = { credits_remaining: number; total_credits_used: number; plan: "free" | "pro" };
const FREE_ALLOWANCE = 3;

export function CreditsBadge() {
  const [userId, setUserId] = useState<string | null>(null);
  const [row, setRow] = useState<CreditRow | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Track auth
  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted) setUserId(session?.user?.id ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
      setUserId(s?.user?.id ?? null);
    });
    return () => { mounted = false; subscription.unsubscribe(); };
  }, []);

  // Fetch + realtime subscribe
  useEffect(() => {
    if (!userId) { setRow(null); return; }

    let cancelled = false;
    const load = async () => {
      const { data } = await supabase
        .from("user_credits")
        .select("credits_remaining, plan")
        .eq("user_id", userId)
        .maybeSingle();
      if (!cancelled && data) setRow(data as CreditRow);
    };
    load();

    const channel = supabase
      .channel(`user_credits:${userId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "user_credits", filter: `user_id=eq.${userId}` },
        (payload) => {
          const next = (payload.new || payload.old) as any;
          if (next) setRow({ credits_remaining: next.credits_remaining, plan: next.plan });
        }
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [userId]);

  if (!userId || !row) return null;

  const isPro = row.plan === "pro";
  const isOut = !isPro && row.credits_remaining <= 0;

  return (
    <>
      <button
        type="button"
        onClick={() => { if (isOut) setShowModal(true); }}
        className={`hidden sm:inline-flex items-center gap-1.5 h-8 px-3 rounded-full text-[12px] font-semibold border transition-all ${
          isPro
            ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white border-orange-500 shadow-sm"
            : isOut
              ? "bg-red-50 text-red-700 border-red-200 hover:bg-red-100 cursor-pointer"
              : "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100"
        }`}
        title={isPro ? "Pro plan · unlimited" : `${row.credits_remaining} credits left`}
      >
        {isPro ? (
          <><Sparkles size={13} /> Pro · unlimited</>
        ) : (
          <><Zap size={13} /> {row.credits_remaining} credit{row.credits_remaining === 1 ? "" : "s"} left</>
        )}
      </button>

      {showModal && <OutOfCreditsModal onClose={() => setShowModal(false)} />}
    </>
  );
}

export function OutOfCreditsModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center"
          aria-label="Close"
        >
          <X size={16} />
        </button>
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mb-4">
          <Sparkles size={22} className="text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">You're out of free credits</h3>
        <p className="text-sm text-gray-600 mt-2 leading-relaxed">
          You've used all your free AI generations. Upgrade to Pro for unlimited resumes,
          cover letters, bullets, LinkedIn bios and more.
        </p>
        <Link
          to="/premium"
          onClick={onClose}
          className="mt-5 inline-flex items-center justify-center w-full h-11 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold text-sm hover:opacity-95 transition"
        >
          Upgrade to Pro
        </Link>
        <button
          onClick={onClose}
          className="mt-2 w-full h-10 rounded-xl text-sm text-gray-500 hover:text-gray-800"
        >
          Not now
        </button>
      </div>
    </div>
  );
}

/**
 * Hook: detects out-of-credits (HTTP 402) from any fetch response body,
 * and returns a helper to check + open the modal from tool pages.
 */
export function useOutOfCreditsFromResponse() {
  const [open, setOpen] = useState(false);
  const check = async (res: Response) => {
    if (res.status !== 402) return false;
    setOpen(true);
    return true;
  };
  const modal = open ? <OutOfCreditsModal onClose={() => setOpen(false)} /> : null;
  return { check, modal, open, setOpen };
}
