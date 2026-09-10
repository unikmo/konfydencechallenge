import type Stripe from "stripe";

// Small shape-resilient helpers for Stripe subscription objects — the field
// layout of Invoice.subscription and Subscription.current_period_end has moved
// across recent API versions, so read them defensively.

/** The subscription id referenced by an invoice, whichever shape it arrives in. */
export function subscriptionIdFromInvoice(invoice: Stripe.Invoice): string | null {
  const loose = invoice as unknown as {
    subscription?: string | { id?: string } | null;
    parent?: { subscription_details?: { subscription?: string | { id?: string } } | null } | null;
  };
  for (const c of [loose.subscription, loose.parent?.subscription_details?.subscription]) {
    if (typeof c === "string") return c;
    if (c && typeof c === "object" && typeof c.id === "string") return c.id;
  }
  return null;
}

/** When the current paid period ends. Falls back to ~1 year out. */
export function subscriptionPeriodEnd(sub: Stripe.Subscription): Date {
  const loose = sub as unknown as {
    current_period_end?: number;
    items?: { data?: { current_period_end?: number }[] };
  };
  const secs = loose.current_period_end ?? loose.items?.data?.[0]?.current_period_end ?? null;
  return secs ? new Date(secs * 1000) : new Date(Date.now() + 366 * 24 * 60 * 60 * 1000);
}
