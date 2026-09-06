import {
  CONSUMER_CATALOG,
  SUBSCRIPTION_CATALOG,
  isConsumerSku,
  isSubscriptionSku,
  catalogName,
} from "../lib/stripe/catalog";
import { SHOPIFY_PRODUCTS } from "../lib/shopify/testData";

describe("stripe catalogue", () => {
  it("has a unique lookup key per price", () => {
    const keys = [
      ...Object.values(CONSUMER_CATALOG).map((e) => e.lookupKey),
      ...Object.values(SUBSCRIPTION_CATALOG).flatMap((e) => [e.lookupKey, e.firstYearLookupKey]),
    ];
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("prices every consumer SKU in whole cents, matching the legacy figures", () => {
    for (const entry of Object.values(CONSUMER_CATALOG)) {
      expect(Number.isInteger(entry.unitAmount)).toBe(true);
      expect(entry.unitAmount).toBeGreaterThan(0);
    }
    // Spot-check against the Shopify source of truth being retired.
    expect(CONSUMER_CATALOG["CHAL-SINGLE-SCHOOL"].unitAmount).toBe(Math.round(SHOPIFY_PRODUCTS.CHAL_SINGLE.variants.SCHOOL.price * 100));
    expect(CONSUMER_CATALOG["CHAL-UNLIMITED"].unitAmount).toBe(Math.round(SHOPIFY_PRODUCTS.CHAL_UNLIMITED.price * 100));
    expect(CONSUMER_CATALOG["CHAL-UPGRADE"].unitAmount).toBe(Math.round(SHOPIFY_PRODUCTS.CHAL_UPGRADE.price * 100));
  });

  it("charges the first Lockscreens year higher than the renewal", () => {
    for (const entry of Object.values(SUBSCRIPTION_CATALOG)) {
      expect(entry.firstYearAmount).toBeGreaterThan(entry.renewalAmount);
      expect(entry.firstYearAmount).toBe(1999);
      expect(entry.renewalAmount).toBe(1499);
    }
  });

  it("only marks the upgrade SKU as non-giftable", () => {
    const notGiftable = Object.values(CONSUMER_CATALOG).filter((e) => !e.giftable).map((e) => e.sku);
    expect(notGiftable).toEqual(["CHAL-UPGRADE"]);
  });

  it("classifies SKUs correctly", () => {
    expect(isConsumerSku("CHAL-UNLIMITED")).toBe(true);
    expect(isConsumerSku("LOCKSCREENS-HOME")).toBe(false);
    expect(isSubscriptionSku("LOCKSCREENS-TEEN")).toBe(true);
    expect(isSubscriptionSku("KG-WALLET")).toBe(false);
    expect(catalogName("CHAL-UPGRADE")).toMatch(/Upgrade/);
    expect(catalogName("mystery")).toBe("mystery");
  });
});
