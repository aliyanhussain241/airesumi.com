import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

export const Route = createFileRoute("/api/stripe-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2025-04-30.basil" });
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

        const body = await request.text();
        const sig = request.headers.get("stripe-signature");

        let event: Stripe.Event;
        try {
          event = stripe.webhooks.constructEvent(body, sig!, webhookSecret);
        } catch (err: any) {
          console.error("Webhook signature error:", err.message);
          return new Response(JSON.stringify({ error: "Invalid signature" }), { status: 400 });
        }

        const supabase = createClient(
          (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL)!,
          process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        async function upsertSubscription(data: {
          user_id: string;
          stripe_customer_id: string;
          stripe_subscription_id?: string;
          plan: string;
          status: string;
          current_period_end?: Date;
        }) {
          await supabase.from("subscriptions").upsert({
            user_id: data.user_id,
            stripe_customer_id: data.stripe_customer_id,
            stripe_subscription_id: data.stripe_subscription_id,
            plan: data.plan,
            status: data.status,
            current_period_end: data.current_period_end?.toISOString(),
            updated_at: new Date().toISOString(),
          }, { onConflict: "user_id" });
        }

        try {
          switch (event.type) {

            // ✅ Subscription created or renewed
            case "checkout.session.completed": {
              const session = event.data.object as Stripe.Checkout.Session;
              const userId = session.metadata?.user_id;
              const plan = session.metadata?.plan || "pro";
              if (!userId) break;

              if (session.mode === "payment") {
                // Lifetime plan
                await upsertSubscription({
                  user_id: userId,
                  stripe_customer_id: session.customer as string,
                  plan: "lifetime",
                  status: "active",
                });
              } else {
                // Subscription — get details
                const sub = await stripe.subscriptions.retrieve(session.subscription as string);
                await upsertSubscription({
                  user_id: userId,
                  stripe_customer_id: session.customer as string,
                  stripe_subscription_id: sub.id,
                  plan: plan.includes("yearly") ? "pro_yearly" : "pro",
                  status: "active",
                  current_period_end: new Date((sub as any).current_period_end * 1000),
                });
              }
              break;
            }

            // ✅ Subscription renewed
            case "invoice.payment_succeeded": {
              const invoice = event.data.object as Stripe.Invoice;
              if (!invoice.subscription) break;
              const sub = await stripe.subscriptions.retrieve(invoice.subscription as string);
              const userId = sub.metadata?.user_id;
              if (!userId) break;
              await upsertSubscription({
                user_id: userId,
                stripe_customer_id: sub.customer as string,
                stripe_subscription_id: sub.id,
                plan: "pro",
                status: "active",
                current_period_end: new Date((sub as any).current_period_end * 1000),
              });
              break;
            }

            // ✅ Payment failed
            case "invoice.payment_failed": {
              const invoice = event.data.object as Stripe.Invoice;
              if (!invoice.subscription) break;
              const sub = await stripe.subscriptions.retrieve(invoice.subscription as string);
              const userId = sub.metadata?.user_id;
              if (!userId) break;
              await upsertSubscription({
                user_id: userId,
                stripe_customer_id: sub.customer as string,
                stripe_subscription_id: sub.id,
                plan: "pro",
                status: "past_due",
                current_period_end: new Date((sub as any).current_period_end * 1000),
              });
              break;
            }

            // ✅ Subscription canceled
            case "customer.subscription.deleted": {
              const sub = event.data.object as Stripe.Subscription;
              const userId = sub.metadata?.user_id;
              if (!userId) break;
              await supabase.from("subscriptions")
                .update({ status: "canceled", plan: "free", updated_at: new Date().toISOString() })
                .eq("user_id", userId);
              break;
            }

            // ✅ Subscription updated (upgrade/downgrade)
            case "customer.subscription.updated": {
              const sub = event.data.object as Stripe.Subscription;
              const userId = sub.metadata?.user_id;
              if (!userId) break;
              await upsertSubscription({
                user_id: userId,
                stripe_customer_id: sub.customer as string,
                stripe_subscription_id: sub.id,
                plan: "pro",
                status: sub.status === "active" ? "active" : sub.status,
                current_period_end: new Date((sub as any).current_period_end * 1000),
              });
              break;
            }
          }
        } catch (err: any) {
          console.error("Webhook handler error:", err);
        }

        return new Response(JSON.stringify({ received: true }), { status: 200 });
      },
    },
  },
});
// rebuild trigger Wed Jun 17 09:53:34 UTC 2026
