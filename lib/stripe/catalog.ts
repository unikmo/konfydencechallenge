// Konfydence commerce catalogue — the single source of truth for what is sold
// and at what price. `scripts/stripe-sync-catalog.ts` reads this and idempotently
// upserts a Stripe Product + Price per entry (matched on `lookupKey`), so there
// is no manual product setup in the dashboard and no price IDs in env vars.
//
// Amounts are in the smallest currency unit (USD cents).
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
  | "CHAL-UNLIMITED";

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
  unitAmount: number; // USD cents — charged yearly
  currency: "usd";
  taxCode: string;
  /** true → offered on the gift flow (recipient email captured at checkout). */
  giftable: boolean;
};

// Every Challenge edition is now an annual subscription: the lookupKey resolves
// to a recurring yearly Price. A gift is billed as a one-time payment (inline
// price_data) that grants the recipient one year — not a subscription in their
// name.
export const CHALLENGE_INTERVAL = "year" as const;

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
    description: "All five Konfydence Challenge editions plus unlimited replays. Renews annually.",
    unitAmount: 2499,
    currency: "usd",
    taxCode: DIGITAL_SERVICE_TAX_CODE,
    giftable: true,
  },
};

// Challenge Teams — org buys N seats, $4.99/seat/year, adjustable quantity.
export const TEAM_SEAT = {
  sku: "CHAL-TEAM" as const,
  lookupKey: "chal_team_seat",
  name: "Konfydence Challenge — Team seat",
  description: "One Konfydence Challenge seat — all five editions, unlimited rounds, per member. Billed per seat, per year.",
  unitAmount: 499, // USD cents / seat / year
  currency: "usd" as const,
  taxCode: DIGITAL_SERVICE_TAX_CODE,
  minSeats: 3,
  maxSeats: 500,
};
export type TeamSku = typeof TEAM_SEAT.sku;

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
