// Minimal UI-chrome string tables for the in-game screens that are already
// bilingual (session play). A session's language is read off its own
// Scenario rows (session.cards[0].scenario.lang), not a separate column —
// see prisma/schema.prisma Scenario.lang and lib/challenge/sessionGenerator.
//
// Scope note (Stage 4, in progress): only the session play screen uses this
// so far. Results/certificate/feedback screens are still English-only chrome
// even for a German session — see data/scenarios-de/README.md.
export type UiLang = "en" | "de";

export const EDITION_LABELS_DE: Record<string, string> = {
  family: "Familie-Edition",
  school: "Schule-Edition",
  university: "Universität-Edition",
  travelsafe: "TravelSafe-Edition",
};

export function editionLabelFor(edition: string, lang: UiLang, fallback: string): string {
  if (lang === "de") return EDITION_LABELS_DE[edition] ?? fallback;
  return fallback;
}

export const SESSION_STRINGS: Record<UiLang, {
  modeReadiness: string;
  modeFull: string;
  exit: string;
  scenarioLabel: string;
  liveDecision: string;
  threeMoves: string;
  kicker: string;
  ruleLabel: string;
  ruleText: string;
  chooseResponse: string;
  select: string;
  submitHintLabel: string;
  submitHintText: string;
  submitButton: string;
  footerBrand: string;
  footerFramework: string;
  roundComplete: string;
  resultReadyHeading: string;
  viewResult: string;
  scenarioFallbackTitle: (n: number) => string;
}> = {
  en: {
    modeReadiness: "READINESS CHECK",
    modeFull: "FULL CHALLENGE",
    exit: "Exit",
    scenarioLabel: "Scenario",
    liveDecision: "Live decision",
    threeMoves: "Three moves · one strongest",
    kicker: "What happens next?",
    ruleLabel: "Rule",
    ruleText: "Choose the move you would trust with your own money, identity, account or safety.",
    chooseResponse: "Choose your response",
    select: "Select",
    submitHintLabel: "No trick wording",
    submitHintText: "The strongest move breaks the requester's control of what happens next.",
    submitButton: "Lock in my move",
    footerBrand: "Konfydence · Decision practice",
    footerFramework: "Pause → verify → act",
    roundComplete: "Round complete",
    resultReadyHeading: "Your result is ready.",
    viewResult: "View my result →",
    scenarioFallbackTitle: (n) => `Scenario ${n}`,
  },
  de: {
    modeReadiness: "KOSTENLOSER CHECK",
    modeFull: "VOLLE CHALLENGE",
    exit: "Verlassen",
    scenarioLabel: "Szenario",
    liveDecision: "Live-Entscheidung",
    threeMoves: "Drei Optionen · eine ist am stärksten",
    kicker: "Was passiert jetzt?",
    ruleLabel: "Regel",
    ruleText: "Wähle die Option, der du dein eigenes Geld, deine Identität, dein Konto oder deine Sicherheit anvertrauen würdest.",
    chooseResponse: "Wähle deine Antwort",
    select: "Auswählen",
    submitHintLabel: "Kein Wortlaut-Trick",
    submitHintText: "Die stärkste Option entzieht der anfragenden Person die Kontrolle darüber, was als Nächstes passiert.",
    submitButton: "Antwort bestätigen",
    footerBrand: "Konfydence · Entscheidungstraining",
    footerFramework: "Anhalten → Abklären → Ansprechen",
    roundComplete: "Runde abgeschlossen",
    resultReadyHeading: "Dein Ergebnis ist da.",
    viewResult: "Ergebnis ansehen →",
    scenarioFallbackTitle: (n) => `Szenario ${n}`,
  },
};
