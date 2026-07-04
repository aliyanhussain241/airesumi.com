import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

export const Route = createFileRoute("/api/create-portal-session")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const authHeader = request.headers.get("Authorization");
          if (!authHeader?.startsWith("Bearer ")) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
          }
          const token = authHeader.replace("Bearer ", "");

          const supabase = createClient(
            (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL)!,
            (process.env.SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY)!
          );

          const { data: { user }, error: authError } = await supabase.auth.getUser(token);
          if (authError || !user) {
            return new Response(JSON.stringify({ error: "Invalid session" }), { status: 401 });
          }

          const { data: sub } = await supabase
            .from("subscriptions")
            .select("stripe_customer_id")
            .eq("user_id", user.id)
            .single();

          const customerId = (sub as any)?.stripe_customer_id;
          if (!customerId) {
            return new Response(
              JSON.stringify({ error: "No active subscription found." }),
              { status: 404, headers: { "Content-Type": "application/json" } }
            );
          }

          const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
            apiVersion: "2025-04-30.basil" as any,
            httpClient: Stripe.createFetchHttpClient(),
          });

          const origin = request.headers.get("origin") || "https://airesumi.com";

          const session = await stripe.billingPortal.sessions.create({
            customer: customerId,
            return_url: `${origin}/manage-subscription`,
          });

          return new Response(JSON.stringify({ url: session.url }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } catch (err: any) {
          console.error("Portal session error:", err);
          return new Response(
            JSON.stringify({ error: err?.message || "Failed to open billing portal" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
          );
        }
      },
    },
  },
});
