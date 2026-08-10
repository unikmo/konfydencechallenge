export type AnswerKey = "A" | "B" | "C" | "D";
export type HackKey = "H" | "A" | "C" | "K";

export type ChallengeScore = {
  totalScoreMax: number;
  totalScoreTotal: number;
  totalPercent: number;
  level: string;
};

export function clampTo0to4(score: number): number {
  if (!Number.isFinite(score)) return 0;
  return Math.max(0, Math.min(4, Math.trunc(score)));
}

/**
 * KRS labels are percentage-based so session length can evolve without silently
 * changing the meaning of the score. The free check is 8 cards / 32 points;
 * the full run is 24 cards / 96 points.
 */
export function computeKRSLevel(params: { totalScoreTotal: number; totalScoreMax: number }): string {
  const pct = computePercent({ total: params.totalScoreTotal, max: params.totalScoreMax });
  const isDiagnostic = params.totalScoreMax <= 32;

  if (isDiagnostic) {
    if (pct >= 90) return "Sharp Spotter";
    if (pct >= 70) return "Nearly Ready";
    if (pct >= 45) return "Pressure-Prone";
    return "Needs Practice";
  }

  if (pct >= 90) return "Scam-Strong";
  if (pct >= 70) return "On Track";
  if (pct >= 50) return "Needs Practice";
  return "High Risk";
}

export function computePercent(params: { total: number; max: number }): number {
  if (params.max <= 0) return 0;
  const pct = (params.total / params.max) * 100;
  if (!Number.isFinite(pct)) return 0;
  return Math.max(0, Math.min(100, pct));
}

export function computeChallengeTotals(params: { scoreTotal: number; scoreMax: number }): ChallengeScore {
  const totalPercent = computePercent({ total: params.scoreTotal, max: params.scoreMax });
  return {
    totalScoreMax: params.scoreMax,
    totalScoreTotal: params.scoreTotal,
    totalPercent,
    level: computeKRSLevel({ totalScoreTotal: params.scoreTotal, totalScoreMax: params.scoreMax }),
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

export function computeHackBreakdown(
  cards: Array<{ hackKey: string | null; score: number | null }>
): HackBreakdownEntry[] {
  return HACK_ORDER.map((key) => {
    const matching = cards.filter((card) => card.hackKey === key);
    const scoreEarned = matching.reduce((sum, card) => sum + (card.score ?? 0), 0);
    const scoreMax = matching.length * 4;
    return {
      hackKey: key,
      scoreEarned,
      scoreMax,
      pct: computePercent({ total: scoreEarned, max: scoreMax }),
      cardCount: matching.length,
    };
  });
}

export type CategoryBreakdownEntry = {
  category: string;
  scoreEarned: number;
  scoreMax: number;
  pct: number;
  cardCount: number;
};

export function computeCategoryBreakdown(
  cards: Array<{ category: string | null; score: number | null }>
): CategoryBreakdownEntry[] {
  const categories = Array.from(new Set(cards.map((card) => card.category).filter((value): value is string => Boolean(value))));

  return categories
    .map((category) => {
      const matching = cards.filter((card) => card.category === category && card.score !== null);
      const scoreEarned = matching.reduce((sum, card) => sum + (card.score ?? 0), 0);
      const scoreMax = matching.length * 4;
      return {
        category,
        scoreEarned,
        scoreMax,
        pct: computePercent({ total: scoreEarned, max: scoreMax }),
        cardCount: matching.length,
      };
    })
    .sort((a, b) => b.pct - a.pct);
}
