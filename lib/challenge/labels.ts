export type ChallengeEdition = "school" | "university" | "family" | "travelsafe" | "workplace";

export const EDITION_LABELS: Record<ChallengeEdition, string> = {
  school: "School Edition",
  university: "University Edition",
  family: "Family Edition",
  travelsafe: "TravelSafe",
  workplace: "Workplace",
};

export type HackTrigger = "H" | "A" | "C" | "K";

/**
 * H.A.C.K. is Konfydence's decision-pressure framework:
 * Hurry / Authority / Comfort / Kill-Switch.
 *
 * Public-facing language keeps K action-oriented rather than using security jargon,
 * while admin/internal views retain the canonical framework name.
 */
export const HACK_LABELS: Record<HackTrigger, { internal: string; public: string; short: string }> = {
  H: { internal: "Hurry", public: "Hurry pressure", short: "Hurry" },
  A: { internal: "Authority", public: "Authority pressure", short: "Authority" },
  C: { internal: "Comfort", public: "Comfort & familiarity", short: "Comfort" },
  K: { internal: "Kill-Switch", public: "Stop & verify", short: "Kill-Switch" },
};
