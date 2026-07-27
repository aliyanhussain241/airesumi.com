import { createClient } from "@supabase/supabase-js";

function getClient() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  const key = serviceKey || publishableKey;
  if (!url || !key) {
    console.error("[credits] Missing supabase env vars");
    return null;
  }
  return createClient(url, key, { auth: { persistSession: false } });
}

/**
 * Atomically consume 1 credit via the SECURITY DEFINER RPC.
 * Returns true if consumed (or pro plan), false if the user is out of credits.
 */
export async function consumeCredit(userId: string): Promise<boolean> {
  const client = getClient();
  if (!client) {
    console.error("[credits] no client available, failing open");
    return true;
  }
  const { data, error } = await client.rpc("consume_credit", { _user_id: userId });
  if (error) {
    console.error("[credits] consume_credit rpc error:", error.message);
    return true; // fail-open
  }
  console.log(`[credits] consume_credit(${userId}) -> ${data}`);
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
