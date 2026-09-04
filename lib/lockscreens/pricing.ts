// Workplace tier pricing — see docs/LOCKSCREENS_ARCHITECTURE.md §2.
// $4 per employee per year, $300 minimum annual licence.
//
// Screen-package (54/60) and weekly-cadence upgrade deltas are an explicit
// "open decision" in the architecture doc (§10) — not priced yet. Orders
// that request them are still issued a PO at the base rate, flagged for a
// sales follow-up before the licence is confirmed.
export const WORKPLACE_RATE_PER_HEAD = 4.0;
export const WORKPLACE_MINIMUM_ANNUAL = 300;

export type ScreenCount = 27 | 54 | 60;
export type Cadence = "fortnightly" | "weekly";

export const SCREEN_COUNT_OPTIONS: { value: ScreenCount; label: string; standard: boolean }[] = [
  { value: 27, label: "27 screens (standard)", standard: true },
  { value: 54, label: "54 screens (extended — priced separately)", standard: false },
  { value: 60, label: "60 screens (full library — priced separately)", standard: false },
];

export const CADENCE_OPTIONS: { value: Cadence; label: string; standard: boolean }[] = [
  { value: "fortnightly", label: "Fortnightly (standard)", standard: true },
  { value: "weekly", label: "Weekly (priced separately — MDM refresh caveats apply)", standard: false },
];

export type WorkplaceQuote = {
  ratePerHead: number;
  employeeCount: number;
  rawTotal: number;
  annualTotal: number;
  minimumApplied: boolean;
  needsSalesReview: boolean;
};

export function computeWorkplaceQuote(
  employeeCount: number,
  screenCount: ScreenCount = 27,
  cadence: Cadence = "fortnightly"
): WorkplaceQuote {
  const rawTotal = employeeCount * WORKPLACE_RATE_PER_HEAD;
  const annualTotal = Math.max(rawTotal, WORKPLACE_MINIMUM_ANNUAL);
  return {
    ratePerHead: WORKPLACE_RATE_PER_HEAD,
    employeeCount,
    rawTotal,
    annualTotal,
    minimumApplied: annualTotal > rawTotal,
    needsSalesReview: screenCount !== 27 || cadence !== "fortnightly",
  };
}

export function formatUsd(amount: number): string {
  return amount.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });
}
