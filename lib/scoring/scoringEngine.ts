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
 * changing the meaning of the score. The free check maxes out at 32 points;
 * a full round is larger. Diagnostic detection keys off the 32-point ceiling,
 * so round size can change without touching this.
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

export type HackSignalLevel = "strong" | "watch" | "vulnerable";

export type HackProfileEntry = HackBreakdownEntry & {
  level: HackSignalLevel;
  levelLabel: string;
  insight: string;
  practice: string;
};

export type HackProfile = {
  dimensions: HackProfileEntry[];
  primaryVulnerability: HackProfileEntry | null;
  strongestReflex: HackProfileEntry | null;
};

const HACK_COACHING: Record<HackKey, { insight: string; practice: string }> = {
  H: {
    insight: "Urgency, countdowns and fear of missing out can compress your decision time.",
    practice: "Pause before acting. A legitimate request can survive independent verification.",
  },
  A: {
    insight: "Official-looking senders, job titles and institutions can make a request feel pre-verified.",
    practice: "Verify through a contact route you already know — never through the request itself.",
  },
  C: {
    insight: "Familiar brands, names, relationships and routines can lower your guard before the evidence is checked.",
    practice: "Treat familiarity as context, not proof. Confirm the person, account or destination independently.",
  },
  K: {
    insight: "The decisive moment is the click, transfer, code, credential or reply that gives the requester control.",
    practice: "Use the kill-switch: stop the requested action, leave the channel, then verify from a clean starting point.",
  },
};

function signalLevel(pct: number): { level: HackSignalLevel; label: string } {
  if (pct >= 85) return { level: "strong", label: "Strong reflex" };
  if (pct >= 65) return { level: "watch", label: "Watch this" };
  return { level: "vulnerable", label: "Priority to train" };
}

/**
 * Converts the balanced H/A/C/K score into a coaching profile. The number of
 * tested decisions is deliberately retained because an 8-card diagnostic is a
 * directional signal (2 decisions per dimension), not a clinical assessment.
 */
export function computeHackProfile(
  cards: Array<{ hackKey: string | null; score: number | null }>
): HackProfile {
  const dimensions = computeHackBreakdown(cards)
    .filter((entry) => entry.cardCount > 0)
    .map((entry): HackProfileEntry => {
      const signal = signalLevel(entry.pct);
      return {
        ...entry,
        level: signal.level,
        levelLabel: signal.label,
        ...HACK_COACHING[entry.hackKey],
      };
    });

  const ranked = [...dimensions].sort((a, b) => a.pct - b.pct || b.cardCount - a.cardCount);
  const primaryVulnerability = ranked[0] ?? null;
  const strongestReflex = ranked.length ? [...ranked].sort((a, b) => b.pct - a.pct || b.cardCount - a.cardCount)[0] : null;

  return { dimensions, primaryVulnerability, strongestReflex };
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
