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
 * presentment currency is derived from that EUR figure at the live ECB rate
 * and attached as Stripe `currency_options` on a price at the moment it's
 * created. Stripe Checkout then auto-presents the buyer's local currency
 * based on their location; no checkout-route change needed. See
 * PEGGED_CURRENCIES in lib/stripe/catalog.ts for the covered currency list,
 * and its comment for what this does NOT cover (the gift flow's ad hoc
 * price_data).
 *
 * Gotcha that cost four broken deploys to fully track down (2026-09-14):
 * Stripe's own docs say a currency_options entry's `tax_behavior` "cannot
 * be changed" once specified, and — confirmed live on this account, the
 * hard way — that extends to rejecting an update that resends the *same*
 * value, and even one that only touches `unit_amount` and leaves
 * `tax_behavior` alone, for a currency a price already has configured.
 * There is no known-safe way to update anything on an already-configured
 * currency_options entry. So this script now only ever sets
 * currency_options at the moment a currency is first added to a price:
 * every currency at creation, or (for an unchanged, already-existing price)
 * only a currency genuinely new to it — e.g. PEGGED_CURRENCIES grows, or an
 * FX rate that was previously missing finally resolves. A pegged
 * currency's amount on an existing price does NOT track live FX drift; it
 * only gets a fresh figure the next time the catalogue's own USD price
 * changes and a new Price object is created. See upsertPrice.
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

/**
 * Bare {unit_amount} for every pegged currency this run's FX table covers,
 * keyed off the USD/EUR numeral. Deliberately does NOT set `tax_behavior`
 * here — see the long comment on upsertPrice for why: it's an immutable
 * field per currency once Stripe has stored *any* value for it (including
 * an implicit/unset one), so it can only safely be sent the first time a
 * currency is added to a price, never on a later refresh.
 */
function buildCurrencyOptions(unitAmountUsdEqualsEur: number, fx: FxTable): Record<string, number> {
  const amounts: Record<string, number> = { eur: unitAmountUsdEqualsEur };
  for (const currency of PEGGED_CURRENCIES) {
    const rate = fx[currency];
    if (!rate) continue;
    amounts[currency] = amountForCurrency(unitAmountUsdEqualsEur, currency, rate);
  }
  return amounts;
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

  const targetAmounts = buildCurrencyOptions(spec.unitAmount, fx);

  if (sameShape) {
    // An existing, unchanged price: do NOT touch currency_options for any
    // currency it already has (see the long comment below — even resending
    // an unchanged unit_amount to an already-configured currency has been
    // observed live to trip Stripe's immutable-field rejection on this
    // account, contrary to what the docs promise). Read-only lookup to find
    // any currency genuinely new to this price (e.g. PEGGED_CURRENCIES grew,
    // or an fx rate that was previously missing finally resolved), and add
    // ONLY those via update — every already-configured currency is left
    // completely untouched, unit_amount included. FX drift on an amount this
    // price already has does not retroactively update; it only takes effect
    // next time the catalogue's own USD price changes and a fresh Price
    // object is created.
    const priceId = current!.id;
    console.log(`    price ${spec.lookupKey} → unchanged ${priceId}`);
    const priceWithOptions = await stripe.prices.retrieve(priceId, { expand: ["currency_options"] });
    const alreadyConfigured = new Set(Object.keys(priceWithOptions.currency_options ?? {}));
    const newOnly: CurrencyOptionsMap = {};
    for (const [currency, unitAmount] of Object.entries(targetAmounts)) {
      if (currency === spec.currency || alreadyConfigured.has(currency)) continue;
      newOnly[currency] = { unit_amount: unitAmount, tax_behavior: "exclusive" };
    }
    if (Object.keys(newOnly).length === 0) {
      console.log(`    price ${spec.lookupKey} → currency_options already cover every pegged currency, nothing to add`);
    } else {
      await stripe.prices.update(priceId, { currency_options: newOnly });
      console.log(`    price ${spec.lookupKey} → currency_options: added ${Object.keys(newOnly).join(", ")}`);
    }
    return priceId;
  } else {
    // A brand-new price has no currency_options yet, so every pegged
    // currency this run prices is being added for the first time — set
    // tax_behavior explicitly at creation. This is the ONLY point where a
    // currency's tax_behavior is ever assigned; see the note on the update
    // branch below for why it can never be resent afterward.
    const initialOptions: CurrencyOptionsMap = {};
    for (const [currency, unitAmount] of Object.entries(targetAmounts)) {
      initialOptions[currency] = { unit_amount: unitAmount, tax_behavior: "exclusive" };
    }
    const created = await stripe.prices.create({
      product: productId,
      currency: spec.currency,
      unit_amount: spec.unitAmount,
      nickname: spec.nickname,
      lookup_key: spec.lookupKey,
      transfer_lookup_key: Boolean(current),
      tax_behavior: "exclusive",
      currency_options: initialOptions,
      ...(spec.recurring ? { recurring: spec.recurring } : {}),
    });
    console.log(`    price ${spec.lookupKey} → ${current ? "replaced" : "created"} ${created.id}`);
    console.log(`    price ${spec.lookupKey} → currency_options set at creation (eur + ${Object.keys(initialOptions).length - 1} pegged)`);
    if (current && current.id !== created.id) {
      await stripe.prices.update(current.id, { active: false });
      console.log(`    price ${current.id} → archived (was one-time / stale)`);
    }
    return created.id;
  }
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
