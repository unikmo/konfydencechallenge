// Stripe SDK singleton. All server-side Stripe calls go through getStripe().
//
// The account is a dedicated Konfydence account under the PlanetHike legal
// entity (separate from the Planethike venture's own Stripe account) so that
// receipts read "KONFYDENCE", payouts are ring-fenced, and Stripe Tax /
// invoicing carry Konfydence's own registration set.
//
// No apiVersion is pinned here on purpose: the installed `stripe` package
// already locks a version (see node_modules/stripe/cjs/apiVersion.js). Bump
// the dependency to move versions rather than hardcoding a string per call site.
import Stripe from "stripe";

let cached: Stripe | null = null;

export function stripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

export function getStripe(): Stripe {
  if (cached) return cached;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }
  cached = new Stripe(key, {
    appInfo: { name: "konfydence", url: "https://konfydence.com" },
    maxNetworkRetries: 2,
    typescript: true,
  });
  return cached;
}

/** True when a test-mode key is in use — surfaced in QA/health endpoints. */
export function stripeIsTestMode(): boolean {
  return (process.env.STRIPE_SECRET_KEY || "").startsWith("sk_test_");
}
