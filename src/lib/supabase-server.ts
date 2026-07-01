import { createClient } from "@supabase/supabase-js";

export function getSupabaseServer() {
  const url =
    process.env.SUPABASE_URL ||
    process.env.VITE_SUPABASE_URL;

  const key =
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    throw new Error("Supabase environment variables are missing.");
  }

  return createClient(url, key);
}
