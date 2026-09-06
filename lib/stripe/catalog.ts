// Konfydence commerce catalogue — the single source of truth for what is sold
// and at what price. `scripts/stripe-sync-catalog.ts` reads this and idempotently
// upserts a Stripe Product + Price per entry (matched on `lookupKey`), so there
// is no manual product setup in the dashboard and no price IDs in env vars.
//
// Amounts are in the smallest currency unit (USD cents). These mirror the legacy
// figures in lib/shopify/testData.ts during the migration; that file is deleted
// in the final cleanup stage.
//
// Tax: every price is created with tax_behavior "exclusive" and a Stripe tax
// code so `automatic_tax` on Checkout / Invoices resolves the right treatment
// (EU B2B reverse charge, EU B2C OSS rate, US nexus, etc.) without per-sale logic.

export type ConsumerSku =
  | "CHAL-SINGLE-SCHOOL"
  | "CHAL-SINGLE-UNIVERSITY"
  | "CHAL-SINGLE-FAMILY"
  | "CHAL-SINGLE-TRAVELSAFE"
  | "CHAL-SINGLE-WORKPLACE"
  | "CHAL-UNLIMITED"
  | "CHAL-UPGRADE";

export type SubscriptionSku = "LOCKSCREENS-HOME" | "LOCKSCREENS-TEEN";

export type CatalogSku = ConsumerSku | SubscriptionSku;

// Stripe tax codes (https://stripe.com/docs/tax/tax-codes):
//   txcd_10103000 — Software as a service (SaaS) — non-customizable digital service
// The Challenge editions and the Lockscreens feeds are all non-tangible digital
// services delivered electronically, so they share this code. An accountant can
// refine per-line in the dashboard later without a code change.
const DIGITAL_SERVICE_TAX_CODE = "txcd_10103000";

export type ConsumerCatalogEntry = {
  sku: ConsumerSku;
  lookupKey: string;
  name: string;
  description: string;
  unitAmount: number; // USD cents
  currency: "usd";
  taxCode: string;
  /** true → offered on the gift flow (recipient email captured at checkout). */
  giftable: boolean;
};

export type SubscriptionCatalogEntry = {
  sku: SubscriptionSku;
  /** lookup key for the recurring price charged from year 2 onward. */
  lookupKey: string;
  /** lookup key for the discounted first-year price. */
  firstYearLookupKey: string;
  name: string;
  description: string;
  firstYearAmount: number; // USD cents, year 1
  renewalAmount: number; // USD cents, year 2+
  currency: "usd";
  taxCode: string;
  track: "home" | "teen";
};

export const CONSUMER_CATALOG: Record<ConsumerSku, ConsumerCatalogEntry> = {
  "CHAL-SINGLE-SCHOOL": {
    sku: "CHAL-SINGLE-SCHOOL",
    lookupKey: "chal_single_school",
    name: "Konfydence Challenge — School Edition",
    description: "Full School-edition scenario deck: 40+ scam scenarios with scored feedback.",
    unitAmount: 699,
    currency: "usd",
    taxCode: DIGITAL_SERVICE_TAX_CODE,
    giftable: true,
  },
  "CHAL-SINGLE-UNIVERSITY": {
    sku: "CHAL-SINGLE-UNIVERSITY",
    lookupKey: "chal_single_university",
    name: "Konfydence Challenge — University Edition",
    description: "Full University-edition scenario deck: 40+ scam scenarios with scored feedback.",
    unitAmount: 699,
    currency: "usd",
    taxCode: DIGITAL_SERVICE_TAX_CODE,
    giftable: true,
  },
  "CHAL-SINGLE-FAMILY": {
    sku: "CHAL-SINGLE-FAMILY",
    lookupKey: "chal_single_family",
    name: "Konfydence Challenge — Family Edition",
    description: "Full Family-edition scenario deck: 40+ scam scenarios with scored feedback.",
    unitAmount: 699,
    currency: "usd",
    taxCode: DIGITAL_SERVICE_TAX_CODE,
    giftable: true,
  },
  "CHAL-SINGLE-TRAVELSAFE": {
    sku: "CHAL-SINGLE-TRAVELSAFE",
    lookupKey: "chal_single_travelsafe",
    name: "Konfydence Challenge — TravelSafe Edition",
    description: "Full TravelSafe scenario deck: 40+ travel and holiday scam scenarios with scored feedback.",
    unitAmount: 699,
    currency: "usd",
    taxCode: DIGITAL_SERVICE_TAX_CODE,
    giftable: true,
  },
  "CHAL-SINGLE-WORKPLACE": {
    sku: "CHAL-SINGLE-WORKPLACE",
    lookupKey: "chal_single_workplace",
    name: "Konfydence Challenge — Workplace Edition",
    description: "Full Workplace scenario deck: 40+ workplace scam and social-engineering scenarios with scored feedback.",
    unitAmount: 699,
    currency: "usd",
    taxCode: DIGITAL_SERVICE_TAX_CODE,
    giftable: true,
  },
  "CHAL-UNLIMITED": {
    sku: "CHAL-UNLIMITED",
    lookupKey: "chal_unlimited",
    name: "Konfydence Challenge — Unlimited Access",
    description: "All five Konfydence Challenge editions plus unlimited replays.",
    unitAmount: 2499,
    currency: "usd",
    taxCode: DIGITAL_SERVICE_TAX_CODE,
    giftable: true,
  },
  "CHAL-UPGRADE": {
    sku: "CHAL-UPGRADE",
    lookupKey: "chal_upgrade",
    name: "Konfydence Challenge — Upgrade to Unlimited",
    description: "Upgrade from any single edition to Unlimited Access ($18 credit applied for the edition already owned).",
    unitAmount: 1800,
    currency: "usd",
    taxCode: DIGITAL_SERVICE_TAX_CODE,
    giftable: false,
  },
};

export const SUBSCRIPTION_CATALOG: Record<SubscriptionSku, SubscriptionCatalogEntry> = {
  "LOCKSCREENS-HOME": {
    sku: "LOCKSCREENS-HOME",
    lookupKey: "lockscreens_home_renewal",
    firstYearLookupKey: "lockscreens_home_year1",
    name: "Konfydence Lockscreens — Home",
    description: "27 fortnightly lock-screen scam-awareness prompts for one phone. Renews annually.",
    firstYearAmount: 1999,
    renewalAmount: 1499,
    currency: "usd",
    taxCode: DIGITAL_SERVICE_TAX_CODE,
    track: "home",
  },
  "LOCKSCREENS-TEEN": {
    sku: "LOCKSCREENS-TEEN",
    lookupKey: "lockscreens_teen_renewal",
    firstYearLookupKey: "lockscreens_teen_year1",
    name: "Konfydence Lockscreens — Teen Home",
    description: "27 fortnightly lock-screen scam-awareness prompts for one phone, teen-specific scenarios. Renews annually.",
    firstYearAmount: 1999,
    renewalAmount: 1499,
    currency: "usd",
    taxCode: DIGITAL_SERVICE_TAX_CODE,
    track: "teen",
  },
};

// Workplace / School Lockscreens are billed by Stripe Invoice (variable amount
// per employee/computer headcount — see lib/lockscreens/pricing.ts), not from a
// fixed catalogue price, so they have no entry here. They share the tax code.
export const LOCKSCREEN_B2B_TAX_CODE = DIGITAL_SERVICE_TAX_CODE;

export function isConsumerSku(sku: string): sku is ConsumerSku {
  return sku in CONSUMER_CATALOG;
}

export function isSubscriptionSku(sku: string): sku is SubscriptionSku {
  return sku in SUBSCRIPTION_CATALOG;
}

export function catalogName(sku: string): string {
  if (isConsumerSku(sku)) return CONSUMER_CATALOG[sku].name;
  if (isSubscriptionSku(sku)) return SUBSCRIPTION_CATALOG[sku].name;
  return sku;
}
