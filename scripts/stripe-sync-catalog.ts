/**
 * Idempotently mirrors lib/stripe/catalog.ts into the connected Stripe account.
 *
 *   npm run stripe:sync
 *
 * Safe to re-run: products are matched on metadata.konfydence_sku, prices on
 * lookup_key. Stripe prices are immutable, so when an amount changes this creates
 * a fresh price and moves the lookup_key onto it (transfer_lookup_key), leaving
 * the old price inactive. Nothing is ever deleted.
 *
 * Requires STRIPE_SECRET_KEY in the environment (test key for staging, live key
 * for production). Prints a summary and exits non-zero on any failure.
 */
import Stripe from "stripe";
import {
  CONSUMER_CATALOG,
  SUBSCRIPTION_CATALOG,
  TEAM_SEAT,
  type ConsumerCatalogEntry,
  type SubscriptionCatalogEntry,
} from "../lib/stripe/catalog";

const key = process.env.STRIPE_SECRET_KEY;
if (!key) {
  console.error("STRIPE_SECRET_KEY is not set — cannot sync catalogue.");
  process.exit(1);
}
const stripe = new Stripe(key, { appInfo: { name: "konfydence-catalog-sync" }, typescript: true });
const mode = key.startsWith("sk_test_") ? "TEST" : "LIVE";

type PriceSpec = {
  lookupKey: string;
  unitAmount: number;
  currency: string;
  recurring?: { interval: "year" | "month"; interval_count?: number };
  nickname: string;
};

async function upsertProduct(sku: string, name: string, description: string, taxCode: string): Promise<string> {
  const found = await stripe.products.search({
    query: `metadata['konfydence_sku']:'${sku}'`,
    limit: 1,
  });
  const fields = {
    name,
    description,
    tax_code: taxCode,
    metadata: { konfydence_sku: sku },
  };
  if (found.data[0]) {
    const p = await stripe.products.update(found.data[0].id, fields);
    console.log(`  product ${sku} → updated ${p.id}`);
    return p.id;
  }
  const p = await stripe.products.create(fields);
  console.log(`  product ${sku} → created ${p.id}`);
  return p.id;
}

async function upsertPrice(productId: string, spec: PriceSpec): Promise<string> {
  const existing = await stripe.prices.list({ lookup_keys: [spec.lookupKey], limit: 1 });
  const current = existing.data[0];

  const sameShape =
    current &&
    current.active &&
    current.unit_amount === spec.unitAmount &&
    current.currency === spec.currency &&
    Boolean(current.recurring) === Boolean(spec.recurring) &&
    (!spec.recurring ||
      (current.recurring?.interval === spec.recurring.interval &&
        (current.recurring?.interval_count ?? 1) === (spec.recurring.interval_count ?? 1)));

  if (sameShape) {
    console.log(`    price ${spec.lookupKey} → unchanged ${current!.id}`);
    return current!.id;
  }

  const created = await stripe.prices.create({
    product: productId,
    currency: spec.currency,
    unit_amount: spec.unitAmount,
    nickname: spec.nickname,
    lookup_key: spec.lookupKey,
    transfer_lookup_key: Boolean(current),
    tax_behavior: "exclusive",
    ...(spec.recurring ? { recurring: spec.recurring } : {}),
  });
  console.log(`    price ${spec.lookupKey} → ${current ? "replaced" : "created"} ${created.id}`);
  if (current && current.id !== created.id) {
    await stripe.prices.update(current.id, { active: false });
    console.log(`    price ${current.id} → archived (was one-time / stale)`);
  }
  return created.id;
}

async function syncConsumer(entry: ConsumerCatalogEntry) {
  console.log(`${entry.sku}`);
  const productId = await upsertProduct(entry.sku, entry.name, entry.description, entry.taxCode);
  // Challenge editions are annual subscriptions now — a recurring yearly price.
  await upsertPrice(productId, {
    lookupKey: entry.lookupKey,
    unitAmount: entry.unitAmount,
    currency: entry.currency,
    nickname: entry.name,
    recurring: { interval: "year" },
  });
}

async function syncSubscription(entry: SubscriptionCatalogEntry) {
  console.log(`${entry.sku}`);
  const productId = await upsertProduct(entry.sku, entry.name, entry.description, entry.taxCode);
  // Year 1: one-time charge taken alongside a 365-day trial on the renewal price.
  await upsertPrice(productId, {
    lookupKey: entry.firstYearLookupKey,
    unitAmount: entry.firstYearAmount,
    currency: entry.currency,
    nickname: `${entry.name} — first year`,
  });
  // Year 2+: the recurring annual price the subscription bills after the trial.
  await upsertPrice(productId, {
    lookupKey: entry.lookupKey,
    unitAmount: entry.renewalAmount,
    currency: entry.currency,
    recurring: { interval: "year" },
    nickname: `${entry.name} — annual renewal`,
  });
}

async function syncTeamSeat() {
  console.log(`${TEAM_SEAT.sku}`);
  const productId = await upsertProduct(TEAM_SEAT.sku, TEAM_SEAT.name, TEAM_SEAT.description, TEAM_SEAT.taxCode);
  await upsertPrice(productId, {
    lookupKey: TEAM_SEAT.lookupKey,
    unitAmount: TEAM_SEAT.unitAmount,
    currency: TEAM_SEAT.currency,
    nickname: TEAM_SEAT.name,
    recurring: { interval: "year" },
  });
}

async function main() {
  console.log(`Syncing Konfydence catalogue into Stripe [${mode} mode]\n`);
  for (const entry of Object.values(CONSUMER_CATALOG)) await syncConsumer(entry);
  await syncTeamSeat();
  for (const entry of Object.values(SUBSCRIPTION_CATALOG)) await syncSubscription(entry);
  console.log(`\nDone. ${mode} catalogue is in sync.`);
}

main().catch((err) => {
  console.error("\nCatalogue sync failed:", err instanceof Error ? err.message : err);
  process.exit(1);
});
