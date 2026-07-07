import { createClient } from "@supabase/supabase-js";

function getAdmin() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error("[credits] Missing service env vars");
    return null;
  }
  return createClient(url, key, { auth: { persistSession: false } });
}

/**
 * Atomically consume 1 credit. Returns true if consumed (or pro plan),
 * false if the user is out of free credits.
 * Fails-open if the service client cannot be created (so a misconfig
 * doesn't take AI features offline for everyone).
 */
export async function consumeCredit(userId: string): Promise<boolean> {
  const admin = getAdmin();
  if (!admin) return true;
  const { data, error } = await admin.rpc("consume_credit", { _user_id: userId });
  if (error) {
    console.error("[credits] consume_credit rpc error:", error.message);
    return true; // fail-open
  }
  return data === true;
}

export const OUT_OF_CREDITS_RESPONSE = () =>
  new Response(
    JSON.stringify({
      error: "out_of_credits",
      message: "You've used all your free credits. Upgrade to continue.",
    }),
    { status: 402, headers: { "Content-Type": "application/json" } }
  );
