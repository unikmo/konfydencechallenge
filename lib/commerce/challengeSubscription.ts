import type Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe/client";
import { grantChallengeEntitlement, type ChallengeTier } from "@/lib/commerce/fulfilment";
import { linkChallengePurchase } from "@/lib/commerce/purchaseAccount";
import { subscriptionIdFromInvoice, subscriptionPeriodEnd } from "@/lib/stripe/subscription";

// Challenge editions are annual subscriptions. The entitlement carries an
// expiresAt tracking the subscription's current period; renewals push it
// forward, a cancellation lets it lapse at period end.
//
// Lockscreens Home/Teen subscriptions (metadata.track set) are handled
// separately in lib/lockscreens/stripeSubscription.ts — this only touches
// CHAL-* edition SKUs.

function isChallengeEditionSub(md: Stripe.Metadata | null | undefined): boolean {
  const sku = md?.sku ?? "";
  return sku.startsWith("CHAL-") && sku !== "CHAL-TEAM" && !md?.track;
}

/** checkout.session.completed, mode "subscription", a CHAL edition SKU. */
export async function handleChallengeSubscriptionCheckout(session: Stripe.Checkout.Session): Promise<void> {
  if (!isChallengeEditionSub(session.metadata)) return;

  const subId =
    typeof session.subscription === "string" ? session.subscription : session.subscription?.id ?? null;
  if (!subId) {
    console.error("challenge sub checkout with no subscription id", session.id);
    return;
  }
  const sub = await getStripe().subscriptions.retrieve(subId);
  const md = session.metadata || {};
  const tier: ChallengeTier = md.tier === "unlimited" ? "unlimited" : "single";
  const edition = md.edition || null;
  const kfUid =
    md.konfydenceUserId ||
    (typeof session.client_reference_id === "string" ? session.client_reference_id : null);
  const email = session.customer_details?.email || null;

  await grantChallengeEntitlement({
    sourceOrderId: `stripe_sub_${subId}`,
    source: "stripe",
    kfUid,
    email,
    tier,
    edition,
    expiresAt: subscriptionPeriodEnd(sub),
    stripeSubscriptionId: subId,
  });

  try {
    await linkChallengePurchase({ email, kfUid });
  } catch (err) {
    console.error("linkChallengePurchase (challenge sub) failed", subId, err);
  }
}

/** invoice.paid with billing_reason "subscription_cycle" → extend the term. */
export async function handleChallengeSubscriptionRenewal(invoice: Stripe.Invoice): Promise<void> {
  if (invoice.billing_reason !== "subscription_cycle") return;
  const subId = subscriptionIdFromInvoice(invoice);
  if (!subId) return;

  const affected = await prisma.entitlement.findMany({
    where: { stripeSubscriptionId: subId },
    select: { id: true },
  });
  if (affected.length === 0) return; // not a challenge subscription

  const sub = await getStripe().subscriptions.retrieve(subId);
  await prisma.entitlement.updateMany({
    where: { stripeSubscriptionId: subId },
    data: { status: "active", expiresAt: subscriptionPeriodEnd(sub) },
  });
}

/** customer.subscription.deleted → let the challenge entitlement lapse at period end. */
export async function handleChallengeSubscriptionCancelled(sub: Stripe.Subscription): Promise<void> {
  const end = subscriptionPeriodEnd(sub);
  await prisma.entitlement.updateMany({
    where: { stripeSubscriptionId: sub.id },
    data: { expiresAt: end },
  });
}
