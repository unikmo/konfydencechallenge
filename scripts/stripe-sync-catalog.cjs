/**
 * Plain-Node version of the catalogue sync (no ts-node needed).
 *
 *   PowerShell:  $env:STRIPE_SECRET_KEY="sk_live_..."; node scripts/stripe-sync-catalog.cjs
 *   cmd:         set "STRIPE_SECRET_KEY=sk_live_..." && node scripts/stripe-sync-catalog.cjs
 *
 * Mirror of scripts/stripe-sync-catalog.ts / lib/stripe/catalog.ts. Idempotent:
 * products matched on metadata.konfydence_sku, prices on lookup_key. Re-runnable.
 */
const Stripe = require("stripe");

const key = process.env.STRIPE_SECRET_KEY;
if (!key) {
  console.error("STRIPE_SECRET_KEY is not set. Example (PowerShell):");
  console.error('  $env:STRIPE_SECRET_KEY="sk_live_..."; node scripts/stripe-sync-catalog.cjs');
  process.exit(1);
}
const stripe = new Stripe(key, { appInfo: { name: "konfydence-catalog-sync" } });
const mode = key.startsWith("sk_test_") ? "TEST" : "LIVE";

const TAX = "txcd_10103000"; // SaaS / electronically supplied services

const CONSUMER = [
  { sku: "CHAL-SINGLE-SCHOOL",     lookupKey: "chal_single_school",     name: "Konfydence Challenge — School Edition",     description: "Full School-edition scenario deck: 40+ scam scenarios with scored feedback.",     unitAmount: 699 },
  { sku: "CHAL-SINGLE-UNIVERSITY", lookupKey: "chal_single_university", name: "Konfydence Challenge — University Edition", description: "Full University-edition scenario deck: 40+ scam scenarios with scored feedback.", unitAmount: 699 },
  { sku: "CHAL-SINGLE-FAMILY",     lookupKey: "chal_single_family",     name: "Konfydence Challenge — Family Edition",     description: "Full Family-edition scenario deck: 40+ scam scenarios with scored feedback.",     unitAmount: 699 },
  { sku: "CHAL-SINGLE-TRAVELSAFE", lookupKey: "chal_single_travelsafe", name: "Konfydence Challenge — TravelSafe Edition", description: "Full TravelSafe scenario deck: 40+ travel and holiday scam scenarios with scored feedback.", unitAmount: 699 },
  { sku: "CHAL-SINGLE-WORKPLACE",  lookupKey: "chal_single_workplace",  name: "Konfydence Challenge — Workplace Edition",  description: "Full Workplace scenario deck: 40+ workplace scam and social-engineering scenarios with scored feedback.", unitAmount: 699 },
  { sku: "CHAL-UNLIMITED",         lookupKey: "chal_unlimited",         name: "Konfydence Challenge — Unlimited Access",  description: "All five Konfydence Challenge editions plus unlimited replays.", unitAmount: 2499 },
  { sku: "CHAL-UPGRADE",           lookupKey: "chal_upgrade",           name: "Konfydence Challenge — Upgrade to Unlimited", description: "Upgrade from any single edition to Unlimited Access ($18 credit applied for the edition already owned).", unitAmount: 1800 },
];

const SUBSCRIPTION = [
  { sku: "LOCKSCREENS-HOME", lookupKey: "lockscreens_home_renewal", firstYearLookupKey: "lockscreens_home_year1", name: "Konfydence Lockscreens — Home",      description: "27 fortnightly lock-screen scam-awareness prompts for one phone. Renews annually.", firstYearAmount: 1999, renewalAmount: 1499 },
  { sku: "LOCKSCREENS-TEEN", lookupKey: "lockscreens_teen_renewal", firstYearLookupKey: "lockscreens_teen_year1", name: "Konfydence Lockscreens — Teen Home", description: "27 fortnightly lock-screen scam-awareness prompts for one phone, teen-specific scenarios. Renews annually.", firstYearAmount: 1999, renewalAmount: 1499 },
];

async function upsertProduct(sku, name, description) {
  const found = await stripe.products.search({ query: `metadata['konfydence_sku']:'${sku}'`, limit: 1 });
  const fields = { name, description, tax_code: TAX, metadata: { konfydence_sku: sku } };
  if (found.data[0]) {
    const p = await stripe.products.update(found.data[0].id, fields);
    console.log(`  product ${sku} -> updated ${p.id}`);
    return p.id;
  }
  const p = await stripe.products.create(fields);
  console.log(`  product ${sku} -> created ${p.id}`);
  return p.id;
}

async function upsertPrice(productId, spec) {
  const existing = await stripe.prices.list({ lookup_keys: [spec.lookupKey], limit: 1 });
  const current = existing.data[0];
  const same =
    current && current.active && current.unit_amount === spec.unitAmount && current.currency === "usd" &&
    Boolean(current.recurring) === Boolean(spec.recurring) &&
    (!spec.recurring || (current.recurring.interval === spec.recurring.interval && (current.recurring.interval_count || 1) === (spec.recurring.interval_count || 1)));
  if (same) { console.log(`    price ${spec.lookupKey} -> unchanged ${current.id}`); return current.id; }
  const created = await stripe.prices.create({
    product: productId, currency: "usd", unit_amount: spec.unitAmount, nickname: spec.nickname,
    lookup_key: spec.lookupKey, transfer_lookup_key: Boolean(current), tax_behavior: "exclusive",
    ...(spec.recurring ? { recurring: spec.recurring } : {}),
  });
  console.log(`    price ${spec.lookupKey} -> ${current ? "replaced" : "created"} ${created.id}`);
  return created.id;
}

async function main() {
  console.log(`Syncing Konfydence catalogue into Stripe [${mode} mode]\n`);
  for (const e of CONSUMER) {
    console.log(e.sku);
    const pid = await upsertProduct(e.sku, e.name, e.description);
    await upsertPrice(pid, { lookupKey: e.lookupKey, unitAmount: e.unitAmount, nickname: e.name });
  }
  for (const e of SUBSCRIPTION) {
    console.log(e.sku);
    const pid = await upsertProduct(e.sku, e.name, e.description);
    await upsertPrice(pid, { lookupKey: e.firstYearLookupKey, unitAmount: e.firstYearAmount, nickname: `${e.name} — first year` });
    await upsertPrice(pid, { lookupKey: e.lookupKey, unitAmount: e.renewalAmount, nickname: `${e.name} — annual renewal`, recurring: { interval: "year" } });
  }
  console.log(`\nDone. ${mode} catalogue is in sync.`);
}

main().catch((err) => { console.error("\nSync failed:", err && err.message ? err.message : err); process.exit(1); });
