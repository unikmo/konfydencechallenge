// Lockscreens pricing — see docs/LOCKSCREENS_ARCHITECTURE.md §2.
//
// Workplace: $4/employee/year, $300 minimum annual. Extended library
// (54/60 screens instead of the standard 27) adds $1/employee/year —
// priced per head, not per FTE (explicit user decision, 2026-09-04).
//
// School: $2/managed computer/year, ~$150 minimum annual (the figure the
// architecture doc suggests). Extended-library pricing for Schools has not
// been decided — those orders are issued at the standard rate and flagged
// for a sales follow-up, same as weekly cadence for both tiers.
export type Tier = "workplace" | "school";
export type ScreenCount = 27 | 54 | 60;
export type Cadence = "fortnightly" | "weekly";

type TierConfig = {
  unitLabel: string;
  unitLabelPlural: string;
  baseRatePerUnit: number;
  minimumAnnual: number;
  /** null = not priced yet; extended library falls back to a sales-reviewed quote. */
  extendedLibrarySurchargePerUnit: number | null;
};

export const TIER_CONFIG: Record<Tier, TierConfig> = {
  workplace: {
    unitLabel: "employee",
    unitLabelPlural: "employees",
    baseRatePerUnit: 4.0,
    minimumAnnual: 300,
    extendedLibrarySurchargePerUnit: 1.0,
  },
  school: {
    unitLabel: "managed computer",
    unitLabelPlural: "managed computers",
    baseRatePerUnit: 2.0,
    minimumAnnual: 150,
    extendedLibrarySurchargePerUnit: null,
  },
};

export function screenCountOptionsFor(tier: Tier): { value: ScreenCount; label: string; standard: boolean }[] {
  const surcharge = TIER_CONFIG[tier].extendedLibrarySurchargePerUnit;
  const extendedLabel = (count: number) =>
    surcharge != null
      ? `${count} screens (extended — +${formatUsd(surcharge)}/${TIER_CONFIG[tier].unitLabel}/year)`
      : `${count} screens (extended — priced separately)`;
  return [
    { value: 27, label: "27 screens (standard)", standard: true },
    { value: 54, label: extendedLabel(54), standard: false },
    { value: 60, label: `60 screens (full library — ${surcharge != null ? `+${formatUsd(surcharge)}/${TIER_CONFIG[tier].unitLabel}/year` : "priced separately"})`, standard: false },
  ];
}

export const CADENCE_OPTIONS: { value: Cadence; label: string; standard: boolean }[] = [
  { value: "fortnightly", label: "Fortnightly (standard)", standard: true },
  { value: "weekly", label: "Weekly (priced separately — MDM refresh caveats apply)", standard: false },
];

export function surchargePerUnitFor(tier: Tier, screenCount: ScreenCount): number {
  if (screenCount === 27) return 0;
  return TIER_CONFIG[tier].extendedLibrarySurchargePerUnit ?? 0;
}

export type LockscreenQuote = {
  tier: Tier;
  baseRatePerUnit: number;
  surchargePerUnit: number;
  ratePerUnit: number;
  unitCount: number;
  rawTotal: number;
  annualTotal: number;
  minimumApplied: boolean;
  needsSalesReview: boolean;
};

export function computeQuote(
  tier: Tier,
  unitCount: number,
  screenCount: ScreenCount = 27,
  cadence: Cadence = "fortnightly"
): LockscreenQuote {
  const config = TIER_CONFIG[tier];
  const surchargeKnown = screenCount === 27 || config.extendedLibrarySurchargePerUnit != null;
  const surchargePerUnit = surchargePerUnitFor(tier, screenCount);
  const ratePerUnit = config.baseRatePerUnit + surchargePerUnit;
  const rawTotal = unitCount * ratePerUnit;
  const annualTotal = Math.max(rawTotal, config.minimumAnnual);
  return {
    tier,
    baseRatePerUnit: config.baseRatePerUnit,
    surchargePerUnit,
    ratePerUnit,
    unitCount,
    rawTotal,
    annualTotal,
    minimumApplied: annualTotal > rawTotal,
    needsSalesReview: cadence !== "fortnightly" || !surchargeKnown,
  };
}

/** @deprecated use computeQuote("workplace", ...) */
export function computeWorkplaceQuote(unitCount: number, screenCount: ScreenCount = 27, cadence: Cadence = "fortnightly") {
  return computeQuote("workplace", unitCount, screenCount, cadence);
}

/** @deprecated use computeQuote("school", ...) */
export function computeSchoolQuote(unitCount: number, screenCount: ScreenCount = 27, cadence: Cadence = "fortnightly") {
  return computeQuote("school", unitCount, screenCount, cadence);
}

export function formatUsd(amount: number): string {
  return amount.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });
}
