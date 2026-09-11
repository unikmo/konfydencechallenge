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
 * Multi-currency (2026-09-11, Tichi): every price's base USD amount is also
 * its EUR amount at the same numeral ($6.99 = €6.99). Every other
 * presentment currency is derived from that EUR figure at the live ECB rate,
 * fetched fresh on every sync, and attached as Stripe `currency_options` —
 * unlike unit_amount, currency_options CAN be updated on an existing price,
 * so this runs every sync without archiving/recreating anything. Stripe
 * Checkout then auto-presents the buyer's local currency based on their
 * location; no checkout-route change needed. See PEGGED_CURRENCIES in
 * lib/stripe/catalog.ts for the covered currency list, and its comment for
 * what this does NOT cover (the gift flow's ad hoc price_data).
 *
 * Requires STRIPE_SECRET_KEY in the environment (test key for staging, live key
 * for production). Prints a summary and exits non-zero on any failure.
 */
import Stripe from "stripe";
import {
  CONSUMER_CATALOG,
  SUBSCRIPTION_CATALOG,
  TEAM_SEAT,
  PEGGED_CURRENCIES,
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

// Stripe amounts are in the currency's smallest unit; these have none.
const ZERO_DECIMAL_CURRENCIES = new Set(["jpy"]);

type FxTable = Record<string, number>; // lowercase currency code -> units per 1 EUR

/** Live ECB reference rates (no API key). Frankfurter mirrors the same data
 *  the EU itself publishes, so "linked to €" is literally true, not just a
 *  one-time snapshot — this refetches on every deploy's catalogue sync. */
async function fetchFxRatesFromEur(currencies: readonly string[]): Promise<FxTable> {
  const symbols = currencies.map((c) => c.toUpperCase()).join(",");
  const res = await fetch(`https://api.frankfurter.app/latest?from=EUR&to=${symbols}`);
  if (!res.ok) throw new Error(`FX rate fetch failed: HTTP ${res.status}`);
  const data = (await res.json()) as { rates?: Record<string, number> };
  const table: FxTable = {};
  for (const [code, rate] of Object.entries(data.rates ?? {})) {
    if (typeof rate === "number" && rate > 0) table[code.toLowerCase()] = rate;
  }
  const missing = currencies.filter((c) => !(c in table));
  if (missing.length) console.warn(`  FX: no rate returned for ${missing.join(", ")} — left unpriced this sync`);
  return table;
}

function amountForCurrency(eurUnitAmountCents: number, currency: string, rate: number): number {
  const eurMajorUnits = eurUnitAmountCents / 100;
  const converted = eurMajorUnits * rate;
  return ZERO_DECIMAL_CURRENCIES.has(currency) ? Math.round(converted) : Math.round(converted * 100);
}

type CurrencyOptionsMap = Record<string, Stripe.PriceCreateParams.CurrencyOptions>;

/** currency_options for every pegged currency, keyed off the USD/EUR numeral. */
function buildCurrencyOptions(unitAmountUsdEqualsEur: number, fx: FxTable): CurrencyOptionsMap {
  const options: CurrencyOptionsMap = {
    eur: { unit_amount: unitAmountUsdEqualsEur },
  };
  for (const currency of PEGGED_CURRENCIES) {
    const rate = fx[currency];
    if (!rate) continue;
    options[currency] = { unit_amount: amountForCurrency(unitAmountUsdEqualsEur, currency, rate) };
  }
  return options;
}

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

async function upsertPrice(productId: string, spec: PriceSpec, fx: FxTable): Promise<string> {
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

  const currencyOptions = buildCurrencyOptions(spec.unitAmount, fx);
  let priceId: string;

  if (sameShape) {
    console.log(`    price ${spec.lookupKey} → unchanged ${current!.id}`);
    priceId = current!.id;
  } else {
    const created = await stripe.prices.create({
      product: productId,
      currency: spec.currency,
      unit_amount: spec.unitAmount,
      nickname: spec.nickname,
      lookup_key: spec.lookupKey,
      transfer_lookup_key: Boolean(current),
      tax_behavior: "exclusive",
      currency_options: currencyOptions,
      ...(spec.recurring ? { recurring: spec.recurring } : {}),
    });
    console.log(`    price ${spec.lookupKey} → ${current ? "replaced" : "created"} ${created.id}`);
    if (current && current.id !== created.id) {
      await stripe.prices.update(current.id, { active: false });
      console.log(`    price ${current.id} → archived (was one-time / stale)`);
    }
    priceId = created.id;
  }

  // currency_options aren't part of "sameShape" (unlike unit_amount, Stripe
  // lets you update them in place) — resync every run so FX drift and newly
  // added pegged currencies land on existing prices too, not just new ones.
  await stripe.prices.update(priceId, { currency_options: currencyOptions });
  console.log(`    price ${spec.lookupKey} → currency_options synced (eur + ${Object.keys(currencyOptions).length - 1} pegged)`);

  return priceId;
}

async function syncConsumer(entry: ConsumerCatalogEntry, fx: FxTable) {
  console.log(`${entry.sku}`);
  const productId = await upsertProduct(entry.sku, entry.name, entry.description, entry.taxCode);
  // Challenge editions are annual subscriptions now — a recurring yearly price.
  await upsertPrice(
    productId,
    {
      lookupKey: entry.lookupKey,
      unitAmount: entry.unitAmount,
      currency: entry.currency,
      nickname: entry.name,
      recurring: { interval: "year" },
    },
    fx
  );
}

async function syncSubscription(entry: SubscriptionCatalogEntry, fx: FxTable) {
  console.log(`${entry.sku}`);
  const productId = await upsertProduct(entry.sku, entry.name, entry.description, entry.taxCode);
  // Year 1: one-time charge taken alongside a 365-day trial on the renewal price.
  await upsertPrice(
    productId,
    {
      lookupKey: entry.firstYearLookupKey,
      unitAmount: entry.firstYearAmount,
      currency: entry.currency,
      nickname: `${entry.name} — first year`,
    },
    fx
  );
  // Year 2+: the recurring annual price the subscription bills after the trial.
  await upsertPrice(
    productId,
    {
      lookupKey: entry.lookupKey,
      unitAmount: entry.renewalAmount,
      currency: entry.currency,
      recurring: { interval: "year" },
      nickname: `${entry.name} — annual renewal`,
    },
    fx
  );
}

async function syncTeamSeat(fx: FxTable) {
  console.log(`${TEAM_SEAT.sku}`);
  const productId = await upsertProduct(TEAM_SEAT.sku, TEAM_SEAT.name, TEAM_SEAT.description, TEAM_SEAT.taxCode);
  await upsertPrice(
    productId,
    {
      lookupKey: TEAM_SEAT.lookupKey,
      unitAmount: TEAM_SEAT.unitAmount,
      currency: TEAM_SEAT.currency,
      nickname: TEAM_SEAT.name,
      recurring: { interval: "year" },
    },
    fx
  );
}

async function main() {
  console.log(`Syncing Konfydence catalogue into Stripe [${mode} mode]\n`);

  console.log(`Fetching live EUR reference rates for ${PEGGED_CURRENCIES.length} pegged currencies...`);
  const fx = await fetchFxRatesFromEur(PEGGED_CURRENCIES).catch((err) => {
    console.warn(`  FX fetch failed (${err instanceof Error ? err.message : err}) — pegged currencies skipped this sync, eur/usd unaffected.`);
    return {} as FxTable;
  });
  console.log("");

  for (const entry of Object.values(CONSUMER_CATALOG)) await syncConsumer(entry, fx);
  await syncTeamSeat(fx);
  for (const entry of Object.values(SUBSCRIPTION_CATALOG)) await syncSubscription(entry, fx);
  console.log(`\nDone. ${mode} catalogue is in sync.`);
}

main().catch((err) => {
  console.error("\nCatalogue sync failed:", err instanceof Error ? err.message : err);
  process.exit(1);
});
