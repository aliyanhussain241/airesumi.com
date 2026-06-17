import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";

export const Route = createFileRoute("/api/subscription-status")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const authHeader = request.headers.get("Authorization");
          if (!authHeader?.startsWith("Bearer ")) {
            return new Response(JSON.stringify({ plan: "free", status: "inactive" }), { status: 200 });
          }
          const token = authHeader.replace("Bearer ", "");

          const supabase = createClient(
            (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL)!,
            (process.env.SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY)!
          );

          const { data: { user } } = await supabase.auth.getUser(token);
          if (!user) {
            return new Response(JSON.stringify({ plan: "free", status: "inactive" }), { status: 200 });
          }

          const { data: sub } = await supabase
            .from("subscriptions")
            .select("plan, status, current_period_end")
            .eq("user_id", user.id)
            .single();

          const isPro = sub?.status === "active" &&
            ["pro", "pro_yearly", "lifetime"].includes(sub?.plan || "") &&
            (sub?.plan === "lifetime" || !sub?.current_period_end || new Date(sub.current_period_end) > new Date());

          return new Response(JSON.stringify({
            plan: sub?.plan || "free",
            status: sub?.status || "inactive",
            isPro,
            current_period_end: sub?.current_period_end,
          }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } catch (err) {
          return new Response(JSON.stringify({ plan: "free", status: "inactive", isPro: false }), { status: 200 });
        }
      },
    },
  },
});
