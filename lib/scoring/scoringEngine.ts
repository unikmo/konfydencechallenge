export type AnswerKey = "A" | "B" | "C" | "D";
export type HackKey = "H" | "A" | "C" | "K";

export type ChallengeScore = {
  totalScoreMax: number;
  totalScoreTotal: number;
  totalPercent: number; // 0..100
  level: string;
};

// Konfydence Readiness Score (KRS) bands — full deck (up to 50 questions, max 200).
// Source: Konfydence UX & Product Specification v1.0, section 6.
const KRS_FULL_BANDS = [
  { min: 180, max: 200, label: "Scam-Strong" },
  { min: 140, max: 179, label: "On Track" },
  { min: 100, max: 139, label: "Needs Practice" },
  { min: 0, max: 99, label: "High Risk" },
] as const;

// KRS bands — free 10-question diagnostic (max 40). Improvement-oriented wording
// only — avoid "High Risk"/"Easy to Pressure" on the free tier.
// docs/DEV_BRIEF_DIAGNOSTIC_UPGRADE.md §2 (overrides PRODUCT_SPEC_V1.md §6's 5-question/max-20 bands).
const KRS_DIAGNOSTIC_BANDS = [
  { min: 36, max: 40, label: "Sharp Spotter" },
  { min: 28, max: 35, label: "Nearly Ready" },
  { min: 18, max: 27, label: "Pressure-Prone" },
  { min: 0, max: 17, label: "Needs Practice" },
] as const;

export function clampTo0to4(score: number): number {
  if (!Number.isFinite(score)) return 0;
  const i = Math.trunc(score);
  return Math.max(0, Math.min(4, i));
}

/**
 * KRS band lookup by raw score, not percent — the spec's band tables use fixed
 * point cutoffs (e.g. 180-200) that only line up with the diagnostic's 40-point
 * scale if you pass the correct max in. Pick the band table by max score.
 */
export function computeKRSLevel(params: { totalScoreTotal: number; totalScoreMax: number }): string {
  const bands = params.totalScoreMax <= 40 ? KRS_DIAGNOSTIC_BANDS : KRS_FULL_BANDS;
  const score = Math.max(0, Math.trunc(params.totalScoreTotal));
  for (const b of bands) {
    if (score >= b.min && score <= b.max) return b.label;
  }
  return bands[bands.length - 1].label;
}

export function computePercent(params: { total: number; max: number }): number {
  if (params.max <= 0) return 0;
  const pct = (params.total / params.max) * 100;
  if (!Number.isFinite(pct)) return 0;
  return Math.max(0, Math.min(100, pct));
}

// Certificates are completion-based per the v1.0 spec (no minimum-score gate) —
// see HANDOFF.md §2.5. This only totals the flat deck's score, it does not gate anything.
export function computeChallengeTotals(params: { scoreTotal: number; scoreMax: number }): ChallengeScore {
  const totalPercent = computePercent({ total: params.scoreTotal, max: params.scoreMax });
  const level = computeKRSLevel({ totalScoreTotal: params.scoreTotal, totalScoreMax: params.scoreMax });

  return {
    totalScoreMax: params.scoreMax,
    totalScoreTotal: params.scoreTotal,
    totalPercent,
    level,
  };
}

export type HackBreakdownEntry = {
  hackKey: HackKey;
  scoreEarned: number;
  scoreMax: number;
  pct: number;
  cardCount: number;
};

const HACK_ORDER: HackKey[] = ["H", "A", "C", "K"];

/**
 * HACK dashboard bars are % of that trigger's own available points, not "X/50"
 * uniformly — distribution is intentionally uneven per edition. HANDOFF.md §2.3.
 */
export function computeHackBreakdown(
  cards: Array<{ hackKey: string | null; score: number | null }>
): HackBreakdownEntry[] {
  return HACK_ORDER.map((key) => {
    const matching = cards.filter((c) => c.hackKey === key);
    const scoreEarned = matching.reduce((sum, c) => sum + (c.score ?? 0), 0);
    const scoreMax = matching.length * 4;
    const pct = computePercent({ total: scoreEarned, max: scoreMax });

    return { hackKey: key, scoreEarned, scoreMax, pct, cardCount: matching.length };
  });
}

export type CategoryBreakdownEntry = {
  category: string;
  scoreEarned: number;
  scoreMax: number;
  pct: number;
  cardCount: number;
};

// Dashboard "best category" reinforcement (spec §8). Free-text category field, deck-defined.
export function computeCategoryBreakdown(
  cards: Array<{ category: string | null; score: number | null }>
): CategoryBreakdownEntry[] {
  const categories = Array.from(new Set(cards.map((c) => c.category).filter((c): c is string => Boolean(c))));

  return categories
    .map((category) => {
      const matching = cards.filter((c) => c.category === category && c.score !== null);
      const scoreEarned = matching.reduce((sum, c) => sum + (c.score ?? 0), 0);
      const scoreMax = matching.length * 4;
      const pct = computePercent({ total: scoreEarned, max: scoreMax });

      return { category, scoreEarned, scoreMax, pct, cardCount: matching.length };
    })
    .sort((a, b) => b.pct - a.pct);
}
