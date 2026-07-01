import type { SupabaseClient } from "@supabase/supabase-js";

export const LIMITS = {
  resume: 10,
  coverLetter: 5,
  ats: 5,
};

export async function checkUsage(
  supabase: SupabaseClient,
  userId: string,
  feature: keyof typeof LIMITS
) {
  const today = new Date().toISOString().slice(0, 10);

  const { count, error } = await supabase
    .from("ai_usage")
    .select("*", {
      count: "exact",
      head: true,
    })
    .eq("user_id", userId)
    .eq("feature", feature)
    .eq("usage_date", today);

  if (error) {
    throw new Error(error.message);
  }

  if ((count ?? 0) >= LIMITS[feature]) {
    throw new Error(
      `Daily ${feature} limit reached. Upgrade to Premium.`
    );
  }

  const { error: insertError } = await supabase
    .from("ai_usage")
    .insert({
      user_id: userId,
      feature,
      usage_date: today,
    });

  if (insertError) {
    throw new Error(insertError.message);
  }
}
