import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient as createServiceClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2023-10-16" as any });

// Service-role client to bypass RLS for webhook updates
const supabase = createServiceClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const PLAN_MAP: Record<string, string> = {
  [process.env.STRIPE_STARTER_PRICE_ID ?? ""]: "starter",
  [process.env.STRIPE_PRO_PRICE_ID     ?? ""]: "pro",
  [process.env.STRIPE_AGENCY_PRICE_ID  ?? ""]: "agency",
};

const AI_CREDIT_MAP: Record<string, number> = {
  starter: 100,
  pro:     500,
  agency:  9999,
};

export async function POST(req: NextRequest) {
  const body      = await req.text();
  const signature = req.headers.get("stripe-signature") ?? "";

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId  = session.metadata?.user_id;
      const plan    = session.metadata?.plan;
      if (!userId || !plan) break;
      await supabase.from("profiles").update({
        plan,
        stripe_subscription_id: session.subscription as string,
        ai_credits_limit: AI_CREDIT_MAP[plan] ?? 100,
      }).eq("id", userId);
      break;
    }

    case "customer.subscription.updated": {
      const sub     = event.data.object as Stripe.Subscription;
      const priceId = sub.items.data[0]?.price.id ?? "";
      const plan    = PLAN_MAP[priceId] ?? "free";
      const customer= await stripe.customers.retrieve(sub.customer as string) as Stripe.Customer;
      const userId  = customer.metadata?.supabase_user_id;
      if (!userId) break;
      await supabase.from("profiles").update({
        plan,
        ai_credits_limit: AI_CREDIT_MAP[plan] ?? 0,
      }).eq("id", userId);
      break;
    }

    case "customer.subscription.deleted": {
      const sub     = event.data.object as Stripe.Subscription;
      const customer= await stripe.customers.retrieve(sub.customer as string) as Stripe.Customer;
      const userId  = customer.metadata?.supabase_user_id;
      if (!userId) break;
      await supabase.from("profiles").update({
        plan: "free",
        stripe_subscription_id: null,
        ai_credits_limit: 50,
      }).eq("id", userId);
      break;
    }
  }

  return NextResponse.json({ received: true });
}
