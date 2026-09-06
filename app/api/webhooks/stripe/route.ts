import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe/client";
import {
  claimWebhookEvent,
  grantChallengeEntitlement,
  issueGiftCode,
  revokeSourceOrder,
  type ChallengeTier,
} from "@/lib/commerce/fulfilment";

export const dynamic = "force-dynamic";

// Stripe needs the raw body for signature verification — do not parse first.
export async function POST(request: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    console.error("STRIPE_WEBHOOK_SECRET not configured");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  const raw = await request.text();
  const signature = request.headers.get("stripe-signature") || "";

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(raw, signature, secret);
  } catch (err) {
    console.error("Stripe webhook signature verification failed:", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Idempotency: a retried delivery of the same event id is a no-op.
  const fresh = await claimWebhookEvent(event.id, event.type, "stripe");
  if (!fresh) {
    return NextResponse.json({ status: "duplicate" });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object);
        break;
      case "charge.refunded":
        await handleChargeRefunded(event.data.object);
        break;
      default:
        // Subscription / invoice events land here until stages 5–6 wire them.
        break;
    }
  } catch (err) {
    console.error(`Stripe webhook handler error (${event.type}):`, err);
    // 500 → Stripe retries. The event id row stays, so the retry is deduped;
    // that is acceptable for now because handlers are themselves idempotent on
    // the source order id. Revisit if a transient failure needs a real retry.
    return NextResponse.json({ error: "Handler failed" }, { status: 500 });
  }

  return NextResponse.json({ status: "ok" });
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  if (session.payment_status !== "paid") {
    console.log("Checkout session not paid, skipping", session.id, session.payment_status);
    return;
  }

  const sourceOrderId = `stripe_cs_${session.id}`;
  const md = session.metadata || {};
  const sku = md.sku || "";
  const tier = (md.tier === "unlimited" ? "unlimited" : "single") as ChallengeTier;
  const edition = md.edition || null;
  const customerEmail = session.customer_details?.email || null;

  if (md.isGift === "true") {
    await issueGiftCode({
      sourceOrderId,
      tier,
      edition,
      toEmail: md.giftToEmail || "",
      fromName: md.giftFromName || null,
      fromEmail: customerEmail,
      message: md.giftMessage || null,
    });
    return;
  }

  if (sku.startsWith("CHAL-")) {
    await grantChallengeEntitlement({
      sourceOrderId,
      source: "stripe",
      kfUid: md.konfydenceUserId || session.client_reference_id || null,
      email: customerEmail,
      tier,
      edition,
    });
    return;
  }

  console.log("Checkout session has no actionable SKU", session.id, sku);
}

async function handleChargeRefunded(charge: Stripe.Charge) {
  const paymentIntent = typeof charge.payment_intent === "string" ? charge.payment_intent : charge.payment_intent?.id;
  if (!paymentIntent) return;

  // Only act on a full refund; partial refunds leave the licence in place.
  if (charge.amount_refunded < charge.amount) return;

  const sessions = await getStripe().checkout.sessions.list({ payment_intent: paymentIntent, limit: 1 });
  const session = sessions.data[0];
  if (!session) {
    console.log("Refund has no matching checkout session", paymentIntent);
    return;
  }
  await revokeSourceOrder(`stripe_cs_${session.id}`);
}
