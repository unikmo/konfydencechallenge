import type { ChallengeEdition } from "@/lib/challenge/sessionGenerator";

export type SectionKey = "A" | "B" | "C" | "D";
export type AnswerKey = "A" | "B" | "C" | "D";

export type ScoreResult = {
  score4: number; // 0..4 normalized
};

export type ChallengeScore = {
  totalScoreMax: number;
  totalScoreTotal: number;
  totalPercent: number; // 0..100
  level: string;
  pass: boolean;
};

const READINESS_LEVELS = [
  { min: 0, max: 54, label: "High Risk Under Pressure" },
  { min: 55, max: 74, label: "Pressure Vulnerable" },
  { min: 75, max: 89, label: "Street Smart" },
  { min: 90, max: 100, label: "Scam Sharp" },
] as const;


export function clampTo0to4(score: number): number {
  if (!Number.isFinite(score)) return 0;
  const i = Math.trunc(score);
  return Math.max(0, Math.min(4, i));
}

export function computeLevel(totalPercent: number): string {
  const pct = Math.max(0, Math.min(100, totalPercent));
  for (const l of READINESS_LEVELS) {
    if (pct >= l.min && pct <= l.max) return l.label;
  }
  return "High Risk Under Pressure";
}


export function getPassThreshold(edition: ChallengeEdition): number {
  if (edition === "workplace") return 75;
  return 70;
}

export function scoreAnswer(params: {
  section: SectionKey;
  selectedKey: AnswerKey;
  scenarioScores: Record<AnswerKey, number>;
}): { score: number; safeActions: string[]; explanation?: string | null; proTip?: string | null } {
  const raw = params.scenarioScores[params.selectedKey];
  const score = clampTo0to4(raw);
  return { score, safeActions: [], explanation: null, proTip: null };
}

export function computeSectionPercent(params: { total: number; max: number }): number {
  if (params.max <= 0) return 0;
  const pct = (params.total / params.max) * 100;
  if (!Number.isFinite(pct)) return 0;
  return Math.max(0, Math.min(100, pct));
}

export function computeChallengeTotals(params: {
  edition: ChallengeEdition;
  sections: Array<{ sectionScoreTotal: number; sectionScoreMax: number }>;
}): ChallengeScore {
  const totalScoreTotal = params.sections.reduce((sum, s) => sum + s.sectionScoreTotal, 0);
  const totalScoreMax = params.sections.reduce((sum, s) => sum + s.sectionScoreMax, 0);
  const totalPercent = computeSectionPercent({ total: totalScoreTotal, max: totalScoreMax });
  const level = computeLevel(totalPercent);
  const pass = totalPercent >= getPassThreshold(params.edition);

  return {
    totalScoreMax,
    totalScoreTotal,
    totalPercent,
    level,
    pass,
  };
}


