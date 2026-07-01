import type { SupabaseClient } from "@supabase/supabase-js";

export async function trackUsage(
  supabase: SupabaseClient,
  userId: string,
  feature: string
) {
  const today = new Date().toISOString().split("T")[0];

  const { error } = await supabase
    .from("ai_usage")
    .insert({
      user_id: userId,
      feature,
      usage_date: today,
    });

  if (error) {
    console.error("AI Usage Error:", error.message);
  }
}
