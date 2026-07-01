import { createClient } from "@supabase/supabase-js";

export const LIMITS = {
  resume: 10,
  coverLetter: 5,
  ats: 5,
};

function getServiceClient() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    console.error("[usage] Missing env vars:", { url: !!url, key: !!key });
    return null;
  }

  return createClient(url, key, {
    auth: { persistSession: false },
  });
}

export async function checkUsage(
  _supabase: any,
  userId: string,
  feature: keyof typeof LIMITS
) {
  const supabase = getServiceClient();

  if (!supabase) {
    console.error("[usage] Could not create service client");
    return;
  }

  const today = new Date().toISOString().slice(0, 10);

  const { count, error: countError } = await supabase
    .from("ai_usage")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("feature", feature)
    .eq("usage_date", today);

  if (countError) {
    console.error("[usage] Count error:", countError.message);
    return;
  }

  console.log(`[usage] ${feature} count today: ${count}`);

  if ((count ?? 0) >= LIMITS[feature]) {
    throw new Error(`Daily ${feature} limit reached. Upgrade to Premium.`);
  }

  const { error: insertError } = await supabase
    .from("ai_usage")
    .insert({
      user_id: userId,
      feature,
      usage_date: today,
      request_count: 1,
    });

  if (insertError) {
    console.error("[usage] Insert error:", insertError.message, insertError.code);
  } else {
    console.log("[usage] Insert success for", feature, userId);
  }
}
