// Stripe SDK singleton. All server-side Stripe calls go through getStripe().
//
// Konfydence is a project of PlanetHike (same legal entity), so it bills through
// PlanetHike's Stripe account. Konfydence products are namespaced by
// metadata.konfydence_sku and named "Konfydence …"; card statements carry a
// "KONFYDENCE" descriptor suffix (see app/api/checkout/create).
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
