import { getSupabaseServer } from "./supabase-server";

export async function requireAuth(request: Request) {
  const authHeader = request.headers.get("Authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    throw new Error("Unauthorized");
  }

  const token = authHeader.substring(7);

  const supabase = getSupabaseServer();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error || !user) {
    throw new Error("Invalid session");
  }

  return {
    token,
    user,
    supabase,
  };
}
