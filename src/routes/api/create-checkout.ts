import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

export const Route = createFileRoute("/api/create-checkout")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          // Auth check
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

          const { plan } = await request.json() as { plan: "pro_monthly" | "pro_yearly" | "lifetime" };

          const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
            apiVersion: "2025-04-30.basil" as any,
            httpClient: Stripe.createFetchHttpClient(),
          });

          // Price IDs — Stripe Dashboard se copy karo
          const PRICES: Record<string, string> = {
            pro_monthly: process.env.STRIPE_PRICE_MONTHLY!,
            pro_yearly: process.env.STRIPE_PRICE_YEARLY!,
            lifetime: process.env.STRIPE_PRICE_LIFETIME!,
          };

          const priceId = PRICES[plan];
          if (!priceId) {
            return new Response(JSON.stringify({ error: "Invalid plan" }), { status: 400 });
          }

          const origin = request.headers.get("origin") || "https://airesumi.com";

          // Stripe customer create or reuse
          const supabaseAdmin = createClient(
            (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL)!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
          );

          const { data: existingSub } = await supabaseAdmin
            .from("subscriptions")
            .select("stripe_customer_id")
            .eq("user_id", user.id)
            .single();

          let customerId = existingSub?.stripe_customer_id;

          if (!customerId) {
            const customer = await stripe.customers.create({
              email: user.email!,
              metadata: { user_id: user.id },
            });
            customerId = customer.id;
          }

          // Create checkout session
          const sessionConfig: Stripe.Checkout.SessionCreateParams = {
            customer: customerId,
            client_reference_id: user.id,
            success_url: `${origin}/premium/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/premium`,
            metadata: { user_id: user.id, plan },
            allow_promotion_codes: true,
          };

          if (plan === "lifetime") {
            sessionConfig.mode = "payment";
            sessionConfig.line_items = [{ price: priceId, quantity: 1 }];
          } else {
            sessionConfig.mode = "subscription";
            sessionConfig.line_items = [{ price: priceId, quantity: 1 }];
            sessionConfig.subscription_data = { metadata: { user_id: user.id, plan } };
          }

          const session = await stripe.checkout.sessions.create(sessionConfig);

          return new Response(JSON.stringify({ url: session.url }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } catch (err: any) {
          console.error("Checkout error:", err);
          return new Response(JSON.stringify({ error: err.message || "Server error" }), { status: 500 });
        }
      },
    },
  },
});