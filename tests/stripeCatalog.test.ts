import {
  CONSUMER_CATALOG,
  SUBSCRIPTION_CATALOG,
  TEAM_SEAT,
  SAME_NUMERAL_CURRENCIES,
  PEGGED_CURRENCIES,
  isConsumerSku,
  isSubscriptionSku,
  isTeamSku,
  catalogName,
} from "../lib/stripe/catalog";

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
    // The published annual consumer prices ($6.99/yr single edition, $24.99/yr pack).
    expect(CONSUMER_CATALOG["CHAL-SINGLE-SCHOOL"].unitAmount).toBe(699);
    expect(CONSUMER_CATALOG["CHAL-UNLIMITED"].unitAmount).toBe(2499);
  });

  it("charges the first Lockscreens year higher than the renewal", () => {
    for (const entry of Object.values(SUBSCRIPTION_CATALOG)) {
      expect(entry.firstYearAmount).toBeGreaterThan(entry.renewalAmount);
      expect(entry.firstYearAmount).toBe(1999);
      expect(entry.renewalAmount).toBe(1499);
    }
  });

  it("every consumer edition is giftable", () => {
    const notGiftable = Object.values(CONSUMER_CATALOG).filter((e) => !e.giftable).map((e) => e.sku);
    expect(notGiftable).toEqual([]);
  });

  it("prices the team seat at $4.99/seat/year with a sane seat range", () => {
    expect(TEAM_SEAT.unitAmount).toBe(499);
    expect(TEAM_SEAT.lookupKey).toBe("chal_team_seat");
    expect(TEAM_SEAT.minSeats).toBeGreaterThanOrEqual(2);
    expect(TEAM_SEAT.maxSeats).toBeGreaterThan(TEAM_SEAT.minSeats);
    expect(isTeamSku("CHAL-TEAM")).toBe(true);
    expect(isTeamSku("CHAL-UNLIMITED")).toBe(false);
    // The team seat is not a consumer/gift SKU.
    expect(isConsumerSku("CHAL-TEAM")).toBe(false);
  });

  it("keeps the team lookup key distinct from every other price", () => {
    const keys = [
      ...Object.values(CONSUMER_CATALOG).map((e) => e.lookupKey),
      ...Object.values(SUBSCRIPTION_CATALOG).flatMap((e) => [e.lookupKey, e.firstYearLookupKey]),
      TEAM_SEAT.lookupKey,
    ];
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("prices USD and EUR at the same numeral, with a distinct pegged-currency list", () => {
    expect(SAME_NUMERAL_CURRENCIES).toEqual(["usd", "eur"]);
    expect(new Set(PEGGED_CURRENCIES).size).toBe(PEGGED_CURRENCIES.length);
    // Pegged currencies must never overlap the same-numeral pair — those are
    // computed from a live FX rate, not the same digits as USD/EUR.
    for (const c of PEGGED_CURRENCIES) {
      expect(SAME_NUMERAL_CURRENCIES as readonly string[]).not.toContain(c);
    }
    expect(PEGGED_CURRENCIES).toContain("gbp");
  });

  it("classifies SKUs correctly", () => {
    expect(isConsumerSku("CHAL-UNLIMITED")).toBe(true);
    expect(isConsumerSku("LOCKSCREENS-HOME")).toBe(false);
    expect(isSubscriptionSku("LOCKSCREENS-TEEN")).toBe(true);
    expect(isSubscriptionSku("KG-WALLET")).toBe(false);
    expect(catalogName("CHAL-UNLIMITED")).toMatch(/Unlimited/);
    expect(catalogName("mystery")).toBe("mystery");
  });
});
