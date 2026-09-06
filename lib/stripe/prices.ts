// Resolves catalogue lookup keys to live Stripe Price IDs.
//
// Prices are created by scripts/stripe-sync-catalog.ts with stable `lookup_key`s,
// so nothing here needs env vars or dashboard IDs. The lookup is a single
// `prices.list` call, cached for the lifetime of the serverless instance.
import { getStripe } from "@/lib/stripe/client";

const cache = new Map<string, string>();

/** Resolve one lookup key → Price ID. Throws if the price has not been synced. */
export async function resolvePriceId(lookupKey: string): Promise<string> {
  const cached = cache.get(lookupKey);
  if (cached) return cached;

  const stripe = getStripe();
  const res = await stripe.prices.list({ lookup_keys: [lookupKey], active: true, limit: 1 });
  const price = res.data[0];
  if (!price) {
    throw new Error(
      `Stripe price with lookup_key "${lookupKey}" not found. Run "npm run stripe:sync" against this account.`,
    );
  }
  cache.set(lookupKey, price.id);
  return price.id;
}

/** Resolve several lookup keys at once. */
export async function resolvePriceIds(lookupKeys: string[]): Promise<Record<string, string>> {
  const out: Record<string, string> = {};
  const missing = lookupKeys.filter((k) => {
    const hit = cache.get(k);
    if (hit) out[k] = hit;
    return !hit;
  });
  if (missing.length === 0) return out;

  const stripe = getStripe();
  // Stripe's lookup_keys filter accepts up to 10 keys per call.
  for (let i = 0; i < missing.length; i += 10) {
    const batch = missing.slice(i, i + 10);
    const res = await stripe.prices.list({ lookup_keys: batch, active: true, limit: 10 });
    for (const price of res.data) {
      if (price.lookup_key) {
        cache.set(price.lookup_key, price.id);
        out[price.lookup_key] = price.id;
      }
    }
  }
  const stillMissing = lookupKeys.filter((k) => !out[k]);
  if (stillMissing.length) {
    throw new Error(
      `Stripe prices missing for lookup_keys: ${stillMissing.join(", ")}. Run "npm run stripe:sync".`,
    );
  }
  return out;
}

/** Test-only: clear the in-process cache. */
export function __clearPriceCache() {
  cache.clear();
}
