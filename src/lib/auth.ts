import { getSupabaseServer } from "./supabase-server";

export async function requireAuth(request: Request) {
  const authHeader = request.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Unauthorized. Please log in.");
  }

  const token = authHeader.replace("Bearer ", "");

  const supabase = getSupabaseServer();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error || !user) {
    throw new Error("Invalid or expired session.");
  }

  return {
    user,
    supabase,
  };
}
