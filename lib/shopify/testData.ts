/**
 * Shopify Test Data & Configuration
 *
 * This file contains:
 * 1. Mock variant IDs for local testing
 * 2. Production variant IDs (to be filled in)
 * 3. Product metadata for verification
 *
 * For local testing, use TEST_VARIANT_IDS
 * For production, update PRODUCTION_VARIANT_IDS and use environment variable
 */

/**
 * Shopify API version used for all Storefront API calls (checkout/create,
 * connection test). Shopify releases a new quarterly version every Jan/Apr/Jul/Oct;
 * bump this when upgrading rather than hardcoding the version string per call site.
 */
export const SHOPIFY_API_VERSION = "2026-07";

/**
 * LOCAL TESTING: Mock Shopify variant IDs
 *
 * These are placeholder IDs for local development.
 * They follow the correct format but are test values.
 *
 * To get real IDs:
 * 1. Go to Shopify Admin → Products
 * 2. Click each product
 * 3. Click the variant (e.g., "School")
 * 4. Copy ID from URL: https://admin.shopify.com/store/konfydence/products/PRODUCT_ID/variants/VARIANT_ID
 * 5. Format as: gid://shopify/ProductVariant/VARIANT_ID
 */
export const TEST_VARIANT_IDS = {
  "CHAL-SINGLE-SCHOOL": "gid://shopify/ProductVariant/47382124855572",
  "CHAL-SINGLE-UNIVERSITY": "gid://shopify/ProductVariant/47382124887340",
  "CHAL-SINGLE-FAMILY": "gid://shopify/ProductVariant/47382124919108",
  "CHAL-SINGLE-TRAVELSAFE": "gid://shopify/ProductVariant/47382124950876",
  "CHAL-SINGLE-WORKPLACE": "gid://shopify/ProductVariant/47382124982644",
  "CHAL-UNLIMITED": "gid://shopify/ProductVariant/47382125014412",
  "CHAL-UPGRADE": "gid://shopify/ProductVariant/47382125046180",
  "KG-WALLET": "gid://shopify/ProductVariant/47382125077948",
  "KG-MAGNET": "gid://shopify/ProductVariant/47382125109716",
} as const;

/**
 * PRODUCTION: Real variant IDs from your Shopify store
 *
 * Update these with actual IDs from https://admin.shopify.com/store/konfydence
 * Format: gid://shopify/ProductVariant/YOUR_ACTUAL_ID
 *
 * Instructions:
 * 1. Go to Shopify Admin
 * 2. Navigate to Products
 * 3. For each product below, click it
 * 4. Click the variant name
 * 5. Copy the ID from the URL
 * 6. Replace the placeholder here
 */
export const PRODUCTION_VARIANT_IDS = {
  "CHAL-SINGLE-SCHOOL": process.env.SHOPIFY_VARIANT_SINGLE_SCHOOL || TEST_VARIANT_IDS["CHAL-SINGLE-SCHOOL"],
  "CHAL-SINGLE-UNIVERSITY": process.env.SHOPIFY_VARIANT_SINGLE_UNIVERSITY || TEST_VARIANT_IDS["CHAL-SINGLE-UNIVERSITY"],
  "CHAL-SINGLE-FAMILY": process.env.SHOPIFY_VARIANT_SINGLE_FAMILY || TEST_VARIANT_IDS["CHAL-SINGLE-FAMILY"],
  "CHAL-SINGLE-TRAVELSAFE": process.env.SHOPIFY_VARIANT_SINGLE_TRAVELSAFE || TEST_VARIANT_IDS["CHAL-SINGLE-TRAVELSAFE"],
  "CHAL-SINGLE-WORKPLACE": process.env.SHOPIFY_VARIANT_SINGLE_WORKPLACE || TEST_VARIANT_IDS["CHAL-SINGLE-WORKPLACE"],
  "CHAL-UNLIMITED": process.env.SHOPIFY_VARIANT_UNLIMITED || TEST_VARIANT_IDS["CHAL-UNLIMITED"],
  "CHAL-UPGRADE": process.env.SHOPIFY_VARIANT_UPGRADE || TEST_VARIANT_IDS["CHAL-UPGRADE"],
  "KG-WALLET": process.env.SHOPIFY_VARIANT_WALLET || TEST_VARIANT_IDS["KG-WALLET"],
  "KG-MAGNET": process.env.SHOPIFY_VARIANT_MAGNET || TEST_VARIANT_IDS["KG-MAGNET"],
} as const;

/**
 * Product Information for QA/Verification
 *
 * Use this to verify your Shopify store has all products correctly configured
 */
export const SHOPIFY_PRODUCTS = {
  CHAL_SINGLE: {
    name: "Konfydence Challenge — Single Edition",
    description: "Choose one scenario deck (5-question diagnostic free, 50-question full $4.99)",
    variants: {
      SCHOOL: {
        label: "School Edition",
        sku: "CHAL-SINGLE-SCHOOL",
        price: 4.99,
        digital: true,
        ships: false,
      },
      UNIVERSITY: {
        label: "University Edition",
        sku: "CHAL-SINGLE-UNIVERSITY",
        price: 4.99,
        digital: true,
        ships: false,
      },
      FAMILY: {
        label: "Family Edition",
        sku: "CHAL-SINGLE-FAMILY",
        price: 4.99,
        digital: true,
        ships: false,
      },
      TRAVELSAFE: {
        label: "TravelSafe",
        sku: "CHAL-SINGLE-TRAVELSAFE",
        price: 4.99,
        digital: true,
        ships: false,
      },
      WORKPLACE: {
        label: "Workplace",
        sku: "CHAL-SINGLE-WORKPLACE",
        price: 4.99,
        digital: true,
        ships: false,
      },
    },
  },

  CHAL_UNLIMITED: {
    name: "Konfydence Challenge — Unlimited Access",
    description: "All 5 scenario decks + unlimited replays",
    price: 19.99,
    sku: "CHAL-UNLIMITED",
    digital: true,
    ships: false,
  },

  CHAL_UPGRADE: {
    name: "Konfydence Challenge — Upgrade to Unlimited",
    description: "Upgrade from any single edition to unlimited access (credit: existing purchase)",
    price: 15.0,
    sku: "CHAL-UPGRADE",
    digital: true,
    ships: false,
    note: "Only shown to users with existing SINGLE entitlement. $15 upgrade credit.",
  },

  KG_WALLET: {
    name: "KonfyGuard Wallet Card",
    description: "Pocket-sized HACK pressure reminder card",
    price: 14.99,
    sku: "KG-WALLET",
    digital: false,
    ships: true,
    physical: true,
  },

  KG_MAGNET: {
    name: "KonfyGuard Home Fridge Magnet",
    description: "Household reminder for the whole family",
    price: 9.99,
    sku: "KG-MAGNET",
    digital: false,
    ships: true,
    physical: true,
  },
} as const;

/**
 * Get variant IDs based on environment
 * Returns TEST IDs for development, PRODUCTION for live
 */
export function getVariantIds() {
  const env = process.env.NODE_ENV;

  // Use production IDs if explicitly set via env variables
  if (process.env.SHOPIFY_VARIANT_SINGLE_SCHOOL && env === "production") {
    return PRODUCTION_VARIANT_IDS;
  }

  // Use test IDs for development
  if (env === "development" || env === "test") {
    return TEST_VARIANT_IDS;
  }

  // Default to production fallback
  return PRODUCTION_VARIANT_IDS;
}

/**
 * Verify Shopify Configuration
 *
 * Run this to verify your Shopify store is set up correctly
 */
export async function verifyShopifySetup(): Promise<{
  valid: boolean;
  errors: string[];
  warnings: string[];
}> {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check environment variables
  if (!process.env.SHOPIFY_STORE_DOMAIN) {
    errors.push("SHOPIFY_STORE_DOMAIN not set");
  }
  if (!process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
    errors.push("SHOPIFY_STOREFRONT_ACCESS_TOKEN not set");
  }
  if (!process.env.SHOPIFY_WEBHOOK_SECRET) {
    errors.push("SHOPIFY_WEBHOOK_SECRET not set");
  }

  // Check variant IDs
  const variantIds = getVariantIds();
  Object.entries(variantIds).forEach(([sku, gid]) => {
    if (gid.includes("YOUR_ACTUAL_ID") || gid.includes("PLACEHOLDER")) {
      warnings.push(`Variant ID for ${sku} is still a placeholder`);
    }
    if (!gid.startsWith("gid://shopify/ProductVariant/")) {
      errors.push(`Invalid GID format for ${sku}: ${gid}`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Test Shopify Connection
 *
 * Attempts to connect to Shopify with current credentials
 */
export async function testShopifyConnection(): Promise<{
  connected: boolean;
  error?: string;
}> {
  try {
    const domain = process.env.SHOPIFY_STORE_DOMAIN;
    const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

    if (!domain || !token) {
      return {
        connected: false,
        error: "Missing SHOPIFY_STORE_DOMAIN or SHOPIFY_STOREFRONT_ACCESS_TOKEN",
      };
    }

    // Test the connection with a simple query
    const response = await fetch(`https://${domain}/api/${SHOPIFY_API_VERSION}/graphql.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": token,
      },
      body: JSON.stringify({
        query: `{ shop { name } }`,
      }),
    });

    if (!response.ok) {
      return {
        connected: false,
        error: `HTTP ${response.status}: ${response.statusText}`,
      };
    }

    const data = await response.json();

    if (data.errors) {
      return {
        connected: false,
        error: data.errors[0]?.message || "Unknown Shopify error",
      };
    }

    return {
      connected: true,
    };
  } catch (error) {
    return {
      connected: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
