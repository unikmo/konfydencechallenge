// Home / Teen Lockscreens are sold as Stripe subscriptions:
//   - checkout mixes a one-time year-1 line ($19.99) with the recurring
//     renewal price ($14.99/yr), which trials for 365 days
//   - first payment (year 1) fulfils at checkout.session.completed
//   - each later renewal fulfils at invoice.paid (billing_reason
//     "subscription_cycle")
//   - cancellation revokes the tenant at customer.subscription.deleted
//
// Fulfilment itself is unchanged — it goes through
// personalOrderService.createPersonalLockscreenTenant, keyed on an opaque
// idempotency string:
//   initial:   stripe_sub_<subscriptionId>
//   renewal:   stripe_inv_<invoiceId>
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe/client";
import {
  createPersonalLockscreenTenant,
  revokePersonalLockscreenTenant,
  type PersonalTrack,
} from "@/lib/lockscreens/personalOrderService";

function asTrack(value: unknown): PersonalTrack | null {
  return value === "home" || value === "teen" ? value : null;
}

/** The subscription id on an invoice — resilient to Stripe API-version shape changes. */
function subscriptionIdFromInvoice(invoice: Stripe.Invoice): string | null {
  const loose = invoice as unknown as {
    subscription?: string | { id?: string } | null;
    parent?: { subscription_details?: { subscription?: string | { id?: string } } | null } | null;
  };
  const candidates = [loose.subscription, loose.parent?.subscription_details?.subscription];
  for (const c of candidates) {
    if (typeof c === "string") return c;
    if (c && typeof c === "object" && typeof c.id === "string") return c.id;
  }
  return null;
}

function invoiceEmail(invoice: Stripe.Invoice): string | null {
  if (invoice.customer_email) return invoice.customer_email;
  const cust = invoice.customer;
  if (cust && typeof cust !== "string" && !("deleted" in cust && cust.deleted)) {
    return (cust as Stripe.Customer).email ?? null;
  }
  return null;
}

/** checkout.session.completed, mode "subscription" → first-year fulfilment. */
export async function handleSubscriptionCheckout(session: Stripe.Checkout.Session): Promise<void> {
  const subId = typeof session.subscription === "string" ? session.subscription : session.subscription?.id;
  if (!subId) {
    console.error("subscription checkout with no subscription id", session.id);
    return;
  }

  let track = asTrack(session.metadata?.track);
  if (!track) {
    const sub = await getStripe().subscriptions.retrieve(subId);
    track = asTrack(sub.metadata?.track);
  }
  const email = session.customer_details?.email ?? null;
  if (!track || !email) {
    console.error("subscription checkout missing track/email", session.id, { track, email });
    return;
  }

  await createPersonalLockscreenTenant({
    track,
    shopifyOrderId: `stripe_sub_${subId}`,
    contactEmail: email,
    contactName: session.customer_details?.name ?? null,
    isRenewal: false,
  });
}

/** invoice.paid with billing_reason "subscription_cycle" → renewal fulfilment. */
export async function handleSubscriptionRenewal(invoice: Stripe.Invoice): Promise<void> {
  if (invoice.billing_reason !== "subscription_cycle") return; // year 1 handled at checkout

  const subId = subscriptionIdFromInvoice(invoice);
  if (!subId) {
    console.error("renewal invoice with no subscription id", invoice.id);
    return;
  }
  const sub = await getStripe().subscriptions.retrieve(subId);
  const track = asTrack(sub.metadata?.track);
  const email = invoiceEmail(invoice);
  if (!track || !email) {
    console.error("renewal invoice missing track/email", invoice.id, { track, email });
    return;
  }

  await createPersonalLockscreenTenant({
    track,
    shopifyOrderId: `stripe_inv_${invoice.id}`,
    contactEmail: email,
    contactName: null,
    isRenewal: true,
  });
}

/** customer.subscription.deleted → expire the tenant. Idempotent. */
export async function handleSubscriptionCancelled(subscription: Stripe.Subscription): Promise<void> {
  await revokePersonalLockscreenTenant(`stripe_sub_${subscription.id}`);
}
