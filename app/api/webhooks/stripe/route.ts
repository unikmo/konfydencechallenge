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
import { linkChallengePurchase } from "@/lib/commerce/purchaseAccount";
import {
  activateOrderFromPaidInvoice,
  syncInvoiceStatus,
} from "@/lib/lockscreens/stripeInvoice";
import {
  handleSubscriptionCheckout,
  handleSubscriptionRenewal,
  handleSubscriptionCancelled,
} from "@/lib/lockscreens/stripeSubscription";
import {
  handleChallengeSubscriptionCheckout,
  handleChallengeSubscriptionRenewal,
  handleChallengeSubscriptionCancelled,
} from "@/lib/commerce/challengeSubscription";
import {
  handleTeamSubscriptionCheckout,
  handleTeamSubscriptionRenewal,
  handleTeamSubscriptionUpdated,
  handleTeamSubscriptionCancelled,
} from "@/lib/commerce/teamSubscription";

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
        if (event.data.object.mode === "subscription") {
          const md = event.data.object.metadata || {};
          if (md.track) {
            await handleSubscriptionCheckout(event.data.object); // Lockscreens Home/Teen
          } else if (md.sku === "CHAL-TEAM") {
            await handleTeamSubscriptionCheckout(event.data.object); // Challenge Teams — org seats
          } else {
            await handleChallengeSubscriptionCheckout(event.data.object); // annual Challenge edition
          }
        } else {
          await handleCheckoutCompleted(event.data.object); // one-time: gifts, legacy
        }
        break;
      case "charge.refunded":
        await handleChargeRefunded(event.data.object);
        break;
      case "invoice.paid":
        // B2B invoice → activate the licence; subscription renewal → next term.
        await activateOrderFromPaidInvoice(event.data.object.id);
        await handleSubscriptionRenewal(event.data.object);
        await handleChallengeSubscriptionRenewal(event.data.object);
        await handleTeamSubscriptionRenewal(event.data.object);
        break;
      case "customer.subscription.updated":
        await handleTeamSubscriptionUpdated(event.data.object);
        break;
      case "customer.subscription.deleted":
        await handleSubscriptionCancelled(event.data.object);
        await handleChallengeSubscriptionCancelled(event.data.object);
        await handleTeamSubscriptionCancelled(event.data.object);
        break;
      case "invoice.finalized":
        await syncInvoiceStatus(event.data.object.id, "open", event.data.object.hosted_invoice_url);
        break;
      case "invoice.voided":
        await syncInvoiceStatus(event.data.object.id, "void");
        break;
      case "invoice.marked_uncollectible":
        await syncInvoiceStatus(event.data.object.id, "uncollectible");
        break;
      default:
        // Subscription events land here until stage 6 wires them.
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
    // Direct challenge purchases are annual subscriptions now (handled in
    // challengeSubscription.ts). A one-time CHAL payment reaching here is a
    // legacy / promo case — grant a one-year term.
    const kfUid = md.konfydenceUserId || session.client_reference_id || null;
    const oneYear = new Date(Date.now() + 366 * 24 * 60 * 60 * 1000);
    await grantChallengeEntitlement({
      sourceOrderId,
      source: "stripe",
      kfUid,
      email: customerEmail,
      tier,
      edition,
      expiresAt: oneYear,
    });
    // Make it portable: create a recoverable account from the checkout email
    // and consolidate this player onto it. Best-effort — never fail the grant.
    try {
      await linkChallengePurchase({ email: customerEmail, kfUid });
    } catch (err) {
      console.error("linkChallengePurchase failed", sourceOrderId, err);
    }
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
