import type Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe/client";
import { subscriptionIdFromInvoice, subscriptionPeriodEnd } from "@/lib/stripe/subscription";
import { findAccountByEmail, findOrCreateAccount, markEmailVerified } from "@/lib/auth/account";
import { linkChallengePurchase } from "@/lib/commerce/purchaseAccount";
import {
  createOrgFromSubscription,
  reconcileSeatCount,
  extendSeatEntitlements,
} from "@/lib/commerce/org";

// Challenge Teams — Stripe lifecycle for the org seat subscription
// (metadata.sku === "CHAL-TEAM"). Kept separate from single-edition
// subscriptions (challengeSubscription.ts) and Lockscreens (stripeSubscription.ts).

export function isTeamCheckout(md: Stripe.Metadata | null | undefined): boolean {
  return (md?.sku ?? "") === "CHAL-TEAM";
}

function seatQuantity(sub: Stripe.Subscription): number {
  return sub.items?.data?.[0]?.quantity ?? 1;
}

/** checkout.session.completed, mode "subscription", sku CHAL-TEAM. */
export async function handleTeamSubscriptionCheckout(session: Stripe.Checkout.Session): Promise<void> {
  if (!isTeamCheckout(session.metadata)) return;

  const subId =
    typeof session.subscription === "string" ? session.subscription : session.subscription?.id ?? null;
  if (!subId) {
    console.error("team checkout with no subscription id", session.id);
    return;
  }
  if (await prisma.org.findUnique({ where: { stripeSubscriptionId: subId } })) return; // idempotent

  const sub = await getStripe().subscriptions.retrieve(subId);
  const md = session.metadata || {};
  const ownerEmail = session.customer_details?.email || session.customer_email || null;

  // The buyer was signed in to reach team checkout — trust metadata first, fall
  // back to the checkout email.
  let ownerAccount =
    (md.ownerAccountId
      ? await prisma.account.findUnique({ where: { id: md.ownerAccountId } })
      : null) ?? (ownerEmail ? await findAccountByEmail(ownerEmail) : null);
  if (!ownerAccount && ownerEmail) {
    ownerAccount = await findOrCreateAccount(ownerEmail);
  }
  if (!ownerAccount) {
    console.error("team checkout: cannot resolve an owner account", session.id);
    return;
  }
  if (!ownerAccount.emailVerifiedAt) ownerAccount = await markEmailVerified(ownerAccount.id);

  const customerId =
    typeof session.customer === "string" ? session.customer : session.customer?.id ?? null;

  const org = await createOrgFromSubscription({
    name: md.orgName || `${ownerAccount.email.split("@")[0]}'s team`,
    ownerAccount,
    ownerKfUid: md.konfydenceUserId || (typeof session.client_reference_id === "string" ? session.client_reference_id : null),
    seatCount: seatQuantity(sub),
    stripeCustomerId: customerId,
    stripeSubscriptionId: subId,
    termEnd: subscriptionPeriodEnd(sub),
  });

  try {
    await linkChallengePurchase({ email: ownerAccount.email, kfUid: md.konfydenceUserId || null });
  } catch (err) {
    console.error("linkChallengePurchase (team) failed", org.id, err);
  }
}

/** invoice.paid, billing_reason "subscription_cycle" → extend the term. */
export async function handleTeamSubscriptionRenewal(invoice: Stripe.Invoice): Promise<void> {
  if (invoice.billing_reason !== "subscription_cycle") return;
  const subId = subscriptionIdFromInvoice(invoice);
  if (!subId) return;
  const org = await prisma.org.findUnique({ where: { stripeSubscriptionId: subId } });
  if (!org) return;

  const sub = await getStripe().subscriptions.retrieve(subId);
  const termEnd = subscriptionPeriodEnd(sub);
  await prisma.org.update({ where: { id: org.id }, data: { termEnd, status: "active" } });
  await reconcileSeatCount(org.id, seatQuantity(sub));
  await extendSeatEntitlements(org.id, termEnd);
}

/** customer.subscription.updated → seat count / status changed mid-term. */
export async function handleTeamSubscriptionUpdated(sub: Stripe.Subscription): Promise<void> {
  const org = await prisma.org.findUnique({ where: { stripeSubscriptionId: sub.id } });
  if (!org) return;
  const termEnd = subscriptionPeriodEnd(sub);
  const status = sub.status === "active" || sub.status === "trialing" ? "active" : sub.status === "past_due" ? "past_due" : org.status;
  await prisma.org.update({ where: { id: org.id }, data: { termEnd, status } });
  await reconcileSeatCount(org.id, seatQuantity(sub));
  await extendSeatEntitlements(org.id, termEnd);
}

/** customer.subscription.deleted → org lapses at period end. */
export async function handleTeamSubscriptionCancelled(sub: Stripe.Subscription): Promise<void> {
  const org = await prisma.org.findUnique({ where: { stripeSubscriptionId: sub.id } });
  if (!org) return;
  const end = subscriptionPeriodEnd(sub);
  await prisma.org.update({ where: { id: org.id }, data: { status: "cancelled", termEnd: end } });
  await prisma.entitlement.updateMany({
    where: { orgId: org.id, status: "active" },
    data: { expiresAt: end },
  });
}
