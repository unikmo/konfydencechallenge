export type ChallengeEdition = "school" | "university" | "family" | "travelsafe" | "workplace";

export const EDITION_LABELS: Record<ChallengeEdition, string> = {
  school: "School Edition",
  university: "University Edition",
  family: "Family Edition",
  travelsafe: "TravelSafe",
  workplace: "Workplace",
};

export type HackTrigger = "H" | "A" | "C" | "K";

export const HACK_LABELS: Record<HackTrigger, { internal: string; public: string }> = {
  H: { internal: "Hurry", public: "Hurry" },
  A: { internal: "Authority", public: "Authority" },
  C: { internal: "Connection", public: "Connection" },
  // Public dashboards must not use "Kill-Switch" (avoid hacking jargon); admin views may use the internal label.
  K: { internal: "Kill-Switch", public: "Critical Action Moment" },
};

