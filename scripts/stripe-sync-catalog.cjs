/**
 * Plain-Node version of the catalogue sync (no ts-node needed).
 *
 *   PowerShell:  $env:STRIPE_SECRET_KEY="sk_live_..."; node scripts/stripe-sync-catalog.cjs
 *   cmd:         set "STRIPE_SECRET_KEY=sk_live_..." && node scripts/stripe-sync-catalog.cjs
 *
 * Mirror of scripts/stripe-sync-catalog.ts / lib/stripe/catalog.ts. Idempotent:
 * products matched on metadata.konfydence_sku, prices on lookup_key. Re-runnable.
 *
 * Multi-currency (2026-09-11): every USD unitAmount is also the EUR amount at
 * the same numeral; every other pegged currency is derived from that EUR
 * figure at the live ECB rate (fetched fresh every run) and attached as
 * Stripe currency_options — see PEGGED_CURRENCIES below, kept in sync by
 * hand with lib/stripe/catalog.ts (this file has no TS import).
 */
const Stripe = require("stripe");

const key = process.env.STRIPE_SECRET_KEY;
if (!key) {
  console.error("STRIPE_SECRET_KEY is not set. Example (PowerShell):");
  console.error('  $env:STRIPE_SECRET_KEY="sk_live_..."; node scripts/stripe-sync-catalog.cjs');
  process.exit(1);
}
const stripe = new Stripe(key, { appInfo: { name: "konfydence-catalog-sync" }, maxNetworkRetries: 5, timeout: 40000 });
const mode = key.startsWith("sk_test_") ? "TEST" : "LIVE";

// Fetched once: all existing products, so we match on metadata without the
// search index (which has propagation lag and occasional connection quirks).
let productIndex = null;
async function loadProductIndex() {
  if (productIndex) return productIndex;
  productIndex = new Map();
  for await (const p of stripe.products.list({ limit: 100 })) {
    const sku = p.metadata && p.metadata.konfydence_sku;
    if (sku) productIndex.set(sku, p);
  }
  return productIndex;
}

const TAX = "txcd_10103000"; // SaaS / electronically supplied services

const PEGGED_CURRENCIES = [
  "gbp", "cad", "aud", "chf", "jpy", "sek", "nok", "dkk", "pln", "czk",
  "huf", "nzd", "sgd", "hkd", "mxn", "brl", "inr", "zar",
];
const ZERO_DECIMAL_CURRENCIES = new Set(["jpy"]);

async function fetchFxRatesFromEur(currencies) {
  const symbols = currencies.map((c) => c.toUpperCase()).join(",");
  const res = await fetch(`https://api.frankfurter.app/latest?from=EUR&to=${symbols}`);
  if (!res.ok) throw new Error(`FX rate fetch failed: HTTP ${res.status}`);
  const data = await res.json();
  const table = {};
  for (const [code, rate] of Object.entries(data.rates || {})) {
    if (typeof rate === "number" && rate > 0) table[code.toLowerCase()] = rate;
  }
  const missing = currencies.filter((c) => !(c in table));
  if (missing.length) console.warn(`  FX: no rate returned for ${missing.join(", ")} — left unpriced this sync`);
  return table;
}

function amountForCurrency(eurUnitAmountCents, currency, rate) {
  const converted = (eurUnitAmountCents / 100) * rate;
  return ZERO_DECIMAL_CURRENCIES.has(currency) ? Math.round(converted) : Math.round(converted * 100);
}

function buildCurrencyOptions(unitAmountUsdEqualsEur, fx) {
  const options = { eur: { unit_amount: unitAmountUsdEqualsEur } };
  for (const currency of PEGGED_CURRENCIES) {
    const rate = fx[currency];
    if (!rate) continue;
    options[currency] = { unit_amount: amountForCurrency(unitAmountUsdEqualsEur, currency, rate) };
  }
  return options;
}

// Every Challenge edition is an annual subscription now (recurring yearly).
const YEARLY = { interval: "year" };
const CONSUMER = [
  { sku: "CHAL-SINGLE-SCHOOL",     lookupKey: "chal_single_school",     name: "Konfydence Challenge — School Edition",     description: "Full School-edition scenario deck: 40+ scam scenarios with scored feedback. Renews annually.",     unitAmount: 699, recurring: YEARLY },
  { sku: "CHAL-SINGLE-UNIVERSITY", lookupKey: "chal_single_university", name: "Konfydence Challenge — University Edition", description: "Full University-edition scenario deck: 40+ scam scenarios with scored feedback. Renews annually.", unitAmount: 699, recurring: YEARLY },
  { sku: "CHAL-SINGLE-FAMILY",     lookupKey: "chal_single_family",     name: "Konfydence Challenge — Family Edition",     description: "Full Family-edition scenario deck: 40+ scam scenarios with scored feedback. Renews annually.",     unitAmount: 699, recurring: YEARLY },
  { sku: "CHAL-SINGLE-TRAVELSAFE", lookupKey: "chal_single_travelsafe", name: "Konfydence Challenge — TravelSafe Edition", description: "Full TravelSafe scenario deck: 40+ travel and holiday scam scenarios with scored feedback. Renews annually.", unitAmount: 699, recurring: YEARLY },
  { sku: "CHAL-SINGLE-WORKPLACE",  lookupKey: "chal_single_workplace",  name: "Konfydence Challenge — Workplace Edition",  description: "Full Workplace scenario deck: 40+ workplace scam and social-engineering scenarios with scored feedback. Renews annually.", unitAmount: 699, recurring: YEARLY },
  { sku: "CHAL-UNLIMITED",         lookupKey: "chal_unlimited",         name: "Konfydence Challenge — Unlimited Access",  description: "All five Konfydence Challenge editions plus unlimited replays. Renews annually.", unitAmount: 2499, recurring: YEARLY },
  { sku: "CHAL-TEAM",              lookupKey: "chal_team_seat",         name: "Konfydence Challenge — Team seat",         description: "One Konfydence Challenge seat — all five editions, unlimited rounds, per member. Billed per seat, per year.", unitAmount: 499, recurring: YEARLY },
];

const SUBSCRIPTION = [
  { sku: "LOCKSCREENS-HOME", lookupKey: "lockscreens_home_renewal", firstYearLookupKey: "lockscreens_home_year1", name: "Konfydence Lockscreens — Home",      description: "27 fortnightly lock-screen scam-awareness prompts for one phone. Renews annually.", firstYearAmount: 1999, renewalAmount: 1499 },
  { sku: "LOCKSCREENS-TEEN", lookupKey: "lockscreens_teen_renewal", firstYearLookupKey: "lockscreens_teen_year1", name: "Konfydence Lockscreens — Teen Home", description: "27 fortnightly lock-screen scam-awareness prompts for one phone, teen-specific scenarios. Renews annually.", firstYearAmount: 1999, renewalAmount: 1499 },
];

async function upsertProduct(sku, name, description) {
  const index = await loadProductIndex();
  const fields = { name, description, tax_code: TAX, metadata: { konfydence_sku: sku } };
  const existing = index.get(sku);
  if (existing) {
    const p = await stripe.products.update(existing.id, fields);
    console.log(`  product ${sku} -> updated ${p.id}`);
    return p.id;
  }
  const p = await stripe.products.create(fields);
  index.set(sku, p);
  console.log(`  product ${sku} -> created ${p.id}`);
  return p.id;
}

async function upsertPrice(productId, spec, fx) {
  const existing = await stripe.prices.list({ lookup_keys: [spec.lookupKey], limit: 1 });
  const current = existing.data[0];
  const same =
    current && current.active && current.unit_amount === spec.unitAmount && current.currency === "usd" &&
    Boolean(current.recurring) === Boolean(spec.recurring) &&
    (!spec.recurring || (current.recurring.interval === spec.recurring.interval && (current.recurring.interval_count || 1) === (spec.recurring.interval_count || 1)));

  const currencyOptions = buildCurrencyOptions(spec.unitAmount, fx);
  let priceId;

  if (same) {
    console.log(`    price ${spec.lookupKey} -> unchanged ${current.id}`);
    priceId = current.id;
  } else {
    const created = await stripe.prices.create({
      product: productId, currency: "usd", unit_amount: spec.unitAmount, nickname: spec.nickname,
      lookup_key: spec.lookupKey, transfer_lookup_key: Boolean(current), tax_behavior: "exclusive",
      currency_options: currencyOptions,
      ...(spec.recurring ? { recurring: spec.recurring } : {}),
    });
    console.log(`    price ${spec.lookupKey} -> ${current ? "replaced" : "created"} ${created.id}`);
    if (current && current.id !== created.id) {
      await stripe.prices.update(current.id, { active: false });
      console.log(`    price ${current.id} -> archived (was one-time / stale)`);
    }
    priceId = created.id;
  }

  await stripe.prices.update(priceId, { currency_options: currencyOptions });
  console.log(`    price ${spec.lookupKey} -> currency_options synced (eur + ${Object.keys(currencyOptions).length - 1} pegged)`);

  return priceId;
}

async function main() {
  console.log(`Syncing Konfydence catalogue into Stripe [${mode} mode]\n`);

  console.log(`Fetching live EUR reference rates for ${PEGGED_CURRENCIES.length} pegged currencies...`);
  let fx = {};
  try {
    fx = await fetchFxRatesFromEur(PEGGED_CURRENCIES);
  } catch (err) {
    console.warn(`  FX fetch failed (${err && err.message ? err.message : err}) — pegged currencies skipped this sync, eur/usd unaffected.`);
  }
  console.log("");

  for (const e of CONSUMER) {
    console.log(e.sku);
    const pid = await upsertProduct(e.sku, e.name, e.description);
    await upsertPrice(pid, { lookupKey: e.lookupKey, unitAmount: e.unitAmount, nickname: e.name, recurring: e.recurring }, fx);
  }
  for (const e of SUBSCRIPTION) {
    console.log(e.sku);
    const pid = await upsertProduct(e.sku, e.name, e.description);
    await upsertPrice(pid, { lookupKey: e.firstYearLookupKey, unitAmount: e.firstYearAmount, nickname: `${e.name} — first year` }, fx);
    await upsertPrice(pid, { lookupKey: e.lookupKey, unitAmount: e.renewalAmount, nickname: `${e.name} — annual renewal`, recurring: { interval: "year" } }, fx);
  }
  console.log(`\nDone. ${mode} catalogue is in sync.`);
}

main().catch((err) => { console.error("\nSync failed:", err && err.message ? err.message : err); process.exit(1); });
