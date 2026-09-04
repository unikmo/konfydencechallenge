// Workplace tier pricing — see docs/LOCKSCREENS_ARCHITECTURE.md §2.
// $4 per employee per year, $300 minimum annual licence.
// Extended library (54/60 screens instead of the standard 27) adds
// $1/employee/year — priced per head, not per FTE.
//
// Weekly cadence is still an explicit "open decision" (§10, MDM-refresh
// caveats) — not priced yet. Orders that request it are still issued a PO
// at the standard rate, flagged for a sales follow-up.
export const WORKPLACE_BASE_RATE_PER_HEAD = 4.0;
export const WORKPLACE_EXTENDED_LIBRARY_SURCHARGE_PER_HEAD = 1.0;
export const WORKPLACE_MINIMUM_ANNUAL = 300;

export type ScreenCount = 27 | 54 | 60;
export type Cadence = "fortnightly" | "weekly";

export const SCREEN_COUNT_OPTIONS: { value: ScreenCount; label: string; standard: boolean }[] = [
  { value: 27, label: "27 screens (standard)", standard: true },
  { value: 54, label: "54 screens (extended — +$1/employee/year)", standard: false },
  { value: 60, label: "60 screens (full library — +$1/employee/year)", standard: false },
];

export const CADENCE_OPTIONS: { value: Cadence; label: string; standard: boolean }[] = [
  { value: "fortnightly", label: "Fortnightly (standard)", standard: true },
  { value: "weekly", label: "Weekly (priced separately — MDM refresh caveats apply)", standard: false },
];

export function surchargePerHeadFor(screenCount: ScreenCount): number {
  return screenCount === 27 ? 0 : WORKPLACE_EXTENDED_LIBRARY_SURCHARGE_PER_HEAD;
}

export type WorkplaceQuote = {
  baseRatePerHead: number;
  surchargePerHead: number;
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
  const surchargePerHead = surchargePerHeadFor(screenCount);
  const ratePerHead = WORKPLACE_BASE_RATE_PER_HEAD + surchargePerHead;
  const rawTotal = employeeCount * ratePerHead;
  const annualTotal = Math.max(rawTotal, WORKPLACE_MINIMUM_ANNUAL);
  return {
    baseRatePerHead: WORKPLACE_BASE_RATE_PER_HEAD,
    surchargePerHead,
    ratePerHead,
    employeeCount,
    rawTotal,
    annualTotal,
    minimumApplied: annualTotal > rawTotal,
    needsSalesReview: cadence !== "fortnightly",
  };
}

export function formatUsd(amount: number): string {
  return amount.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });
}
