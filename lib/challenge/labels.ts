export type SectionKey = "A" | "B" | "C" | "D";

export const SECTION_LABELS: Record<SectionKey, string> = {
  A: "Spot the Signal",
  B: "Verify Safely",
  C: "Protect Money & Identity",
  D: "Respond Under Pressure",
};

export type ChallengeEdition = "travelsafe" | "student" | "workplace" | "home";

export const EDITION_LABELS: Record<ChallengeEdition, string> = {
  travelsafe: "TravelSafe",
  student: "University & Students",
  workplace: "Workplace",
  home: "Home & Family",
};

