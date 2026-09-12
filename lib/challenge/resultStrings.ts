// German strings for the post-session flow (results, certificate, per-question
// feedback, the free-diagnostic email gate). Mirrors lib/challenge/uiStrings.ts'
// approach for the session play screen: a session's language comes from its
// own Scenario rows (scenario.lang), not a separate column, so every one of
// these pages resolves `lang` the same way before picking a string table.
//
// Two kinds of text here:
//  1. Static UI chrome (headings, buttons, labels) — table-driven per lang,
//     same pattern as SESSION_STRINGS in uiStrings.ts.
//  2. Translations of the fixed vocabulary lib/scoring/scoringEngine.ts
//     generates in English (KRS level names, H.A.C.K. signal labels) — a
//     lookup keyed by the English value, so the shared, edition-agnostic
//     scoring engine itself never has to know about locale.
import type { HackTrigger } from "@/lib/challenge/labels";
import type { UiLang } from "@/lib/challenge/uiStrings";

// --- 2. Translations of scoringEngine-generated English vocabulary --------

const LEVEL_DE: Record<string, string> = {
  "Sharp Spotter": "Scharfer Blick",
  "Nearly Ready": "Fast bereit",
  "Pressure-Prone": "Druckanfällig",
  "Needs Practice": "Braucht Übung",
  "Scam-Strong": "Betrugssicher",
  "On Track": "Auf gutem Weg",
  "High Risk": "Hohes Risiko",
};

export function localizeLevel(level: string, lang: UiLang): string {
  if (lang !== "de") return level;
  return LEVEL_DE[level] ?? level;
}

const SIGNAL_LABEL_DE: Record<string, string> = {
  "Strong reflex": "Starker Reflex",
  "Watch this": "Beobachten",
  "Priority to train": "Priorität zum Üben",
};

export function localizeSignalLabel(label: string, lang: UiLang): string {
  if (lang !== "de") return label;
  return SIGNAL_LABEL_DE[label] ?? label;
}

// H.A.C.K. public/short labels — German counterpart to lib/challenge/labels.ts
// HACK_LABELS. K stays action-oriented ("Notbremse"), not literal "Kill-Switch".
export const HACK_LABELS_DE: Record<HackTrigger, { public: string; short: string }> = {
  H: { public: "Hetze-Druck", short: "Hetze" },
  A: { public: "Autoritäts-Druck", short: "Autorität" },
  C: { public: "Vertrautheit & Komfort", short: "Vertrautheit" },
  K: { public: "Notbremse", short: "Notbremse" },
};

export function hackLabel(hackKey: HackTrigger, field: "public" | "short", lang: UiLang, fallback: string): string {
  if (lang !== "de") return fallback;
  return HACK_LABELS_DE[hackKey][field];
}

// German counterpart to scoringEngine.ts's HACK_COACHING (insight/practice per
// dimension, shown on the results page's H.A.C.K. profile section).
export const HACK_COACHING_DE: Record<HackTrigger, { insight: string; practice: string }> = {
  H: {
    insight: "Zeitdruck, Countdowns und die Angst, etwas zu verpassen, können deine Entscheidungszeit verkürzen.",
    practice: "Halte inne, bevor du handelst. Eine echte Bitte übersteht eine unabhängige Prüfung.",
  },
  A: {
    insight: "Offiziell wirkende Absender, Titel und Institutionen können eine Bitte vorab bestätigt wirken lassen.",
    practice: "Prüfe über einen Weg, den du schon kennst — nie über die Bitte selbst.",
  },
  C: {
    insight: "Bekannte Marken, Namen, Beziehungen und Routinen können deine Wachsamkeit senken, bevor du geprüft hast.",
    practice: "Vertrautheit ist Kontext, kein Beweis. Bestätige Person, Konto oder Ziel unabhängig.",
  },
  K: {
    insight: "Der entscheidende Moment ist der Klick, die Überweisung, der Code oder die Antwort, die der anfragenden Person die Kontrolle gibt.",
    practice: "Nutze die Notbremse: Stoppe die verlangte Aktion, verlasse den Kanal, prüfe dann von einem sauberen Ausgangspunkt aus.",
  },
};

// --- 1. Static UI chrome ---------------------------------------------------

export const EDITION_DECK_NAME_DE: Record<string, string> = {
  school: "Schule",
  university: "Universität",
  family: "Familie",
  travelsafe: "TravelSafe",
  workplace: "Arbeitsplatz",
};

function interpretation(pct: number, lang: UiLang): string {
  if (lang !== "de") {
    if (pct >= 90) return "Your stop-and-verify reflex held up consistently under pressure.";
    if (pct >= 75) return "You caught most traps, but one or two pressure patterns still changed your decisions.";
    if (pct >= 55) return "You spot some warning signs, but pressure can still move you before independent verification.";
    return "The scenarios moved you too often toward the action the requester wanted. Your biggest gain will come from slowing the next step down.";
  }
  if (pct >= 90) return "Dein Stopp-und-Prüf-Reflex hat unter Druck durchgehend funktioniert.";
  if (pct >= 75) return "Du hast die meisten Fallen erkannt, aber ein oder zwei Druckmuster haben deine Entscheidung trotzdem verändert.";
  if (pct >= 55) return "Du erkennst manche Warnsignale, aber Druck kann dich noch vor einer unabhängigen Prüfung zum Handeln bringen.";
  return "Die Szenarien haben dich zu oft zu der Handlung bewegt, die die anfragende Person wollte. Der größte Gewinn liegt darin, den nächsten Schritt zu verlangsamen.";
}

export const RESULTS_STRINGS: Record<UiLang, {
  myResults: string;
  chooseAnother: string;
  overlineFree: string;
  overlineFull: string;
  h1: string;
  smallFree: string;
  smallFull: string;
  hackOverline: string;
  hackHeading: string;
  hackSubtext: string;
  testedAcross: (n: number) => string;
  priorityToTrain: string;
  priorityBody: (pct: number) => string;
  strongestReflex: string;
  strongestSituation: string;
  conversionOverline: string;
  conversionHeading: string;
  conversionBody: (deckName: string) => string;
  conversionBankNote: string;
  startHere: string;
  unlockFull: string;
  unlockAll: string;
  playSecondFree: string;
  registerSecondFree: string;
  limitReached: string;
  keepFreshHeading: string;
  keepFreshBody: string;
  runAnother: string;
  viewCertificate: string;
  certificateLocked: string;
  shareTitle: string;
  shareText: (deckName: string) => string;
  interpretation: (pct: number) => string;
}> = {
  en: {
    myResults: "My results",
    chooseAnother: "Choose another test",
    overlineFree: "FREE READINESS CHECK",
    overlineFull: "FULL CHALLENGE",
    h1: "Your Scam Survival Profile",
    smallFree: "Directional signal based on two decisions in each H.A.C.K. dimension — not a guarantee of protection.",
    smallFull: "A balanced pressure-profile result across six decisions in each H.A.C.K. dimension.",
    hackOverline: "YOUR H.A.C.K. PROFILE",
    hackHeading: "Where pressure changes your decisions.",
    hackSubtext: "Each dimension is scored separately so a strong overall result cannot hide one repeatable weakness.",
    testedAcross: (n) => `Tested across ${n} decision${n === 1 ? "" : "s"}.`,
    priorityToTrain: "PRIORITY TO TRAIN",
    priorityBody: (pct) => `Your lowest H.A.C.K. signal was ${Math.round(pct)}%. Practise this rule until it becomes the automatic next move, not something you remember after acting.`,
    strongestReflex: "Strongest reflex",
    strongestSituation: "Strongest situation",
    conversionOverline: "YOUR FREE CHECK FOUND THE PATTERN",
    conversionHeading: "Do not just know the weakness. Train the reflex.",
    conversionBody: (deckName) => `The full ${deckName} Challenge works through 40+ real-life scenarios — balanced across Hurry, Authority, Comfort and Kill-Switch — in short rounds, with a deeper profile and completion certificate.`,
    conversionBankNote: "Each round prioritises scenarios you have not seen, so practice measures decision quality rather than memory of the previous round.",
    startHere: "Start here:",
    unlockFull: "Unlock Full Challenge — $6.99",
    unlockAll: "Get All 5 Challenges — $24.99",
    playSecondFree: "Play my second free check",
    registerSecondFree: "Register to unlock my second free check",
    limitReached: "Your two free readiness checks are complete.",
    keepFreshHeading: "Keep the reflex fresh.",
    keepFreshBody: "A replay uses unseen scenarios first, while keeping H.A.C.K. balanced. That makes improvement more meaningful than memorising the previous answers.",
    runAnother: "Run another balanced challenge",
    viewCertificate: "View certificate",
    certificateLocked: "Certificate locked until completion",
    shareTitle: "Konfydence Challenge",
    shareText: (deckName) => `I just tested my Konfydence ${deckName} pressure profile. Take the free check and compare your H.A.C.K. pattern.`,
    interpretation: (pct) => interpretation(pct, "en"),
  },
  de: {
    myResults: "Meine Ergebnisse",
    chooseAnother: "Anderen Test wählen",
    overlineFree: "KOSTENLOSER CHECK",
    overlineFull: "VOLLE CHALLENGE",
    h1: "Dein Betrugs-Sicherheitsprofil",
    smallFree: "Richtungssignal aus zwei Entscheidungen je H.A.C.K.-Dimension — keine Garantie für Schutz.",
    smallFull: "Ein ausgewogenes Druckprofil aus sechs Entscheidungen je H.A.C.K.-Dimension.",
    hackOverline: "DEIN H.A.C.K.-PROFIL",
    hackHeading: "Wo Druck deine Entscheidungen verändert.",
    hackSubtext: "Jede Dimension wird einzeln bewertet, damit ein starkes Gesamtergebnis keine wiederkehrende Schwäche verdeckt.",
    testedAcross: (n) => `Getestet anhand von ${n} Entscheidung${n === 1 ? "" : "en"}.`,
    priorityToTrain: "PRIORITÄT ZUM ÜBEN",
    priorityBody: (pct) => `Dein niedrigstes H.A.C.K.-Signal lag bei ${Math.round(pct)}%. Übe diese Regel, bis sie zum automatischen nächsten Schritt wird — nicht zu etwas, an das du dich erst hinterher erinnerst.`,
    strongestReflex: "Stärkster Reflex",
    strongestSituation: "Stärkste Situation",
    conversionOverline: "DEIN KOSTENLOSER CHECK HAT DAS MUSTER GEFUNDEN",
    conversionHeading: "Kenn die Schwäche nicht nur — trainier den Reflex.",
    conversionBody: (deckName) => `Die volle ${deckName}-Challenge arbeitet 48 reale Szenarien durch — ausgewogen über Hetze, Autorität, Vertrautheit und Notbremse — in kurzen Runden, mit einem tieferen Profil und Abschlusszertifikat.`,
    conversionBankNote: "Jede Runde bevorzugt Szenarien, die du noch nicht gesehen hast — so misst das Training Entscheidungsqualität statt Erinnerung an die letzte Runde.",
    startHere: "Fang hier an:",
    unlockFull: "Volle Challenge freischalten — €6,99",
    unlockAll: "Alle 5 Challenges freischalten — €24,99",
    playSecondFree: "Meinen zweiten kostenlosen Check spielen",
    registerSecondFree: "Registrieren, um den zweiten kostenlosen Check freizuschalten",
    limitReached: "Deine zwei kostenlosen Checks sind aufgebraucht.",
    keepFreshHeading: "Halt den Reflex frisch.",
    keepFreshBody: "Eine Wiederholung nutzt zuerst ungesehene Szenarien, bleibt aber H.A.C.K.-ausgewogen. Das macht Fortschritt aussagekräftiger, als die vorigen Antworten auswendig zu lernen.",
    runAnother: "Noch eine ausgewogene Challenge starten",
    viewCertificate: "Zertifikat ansehen",
    certificateLocked: "Zertifikat erst nach Abschluss verfügbar",
    shareTitle: "Konfydence Challenge",
    shareText: (deckName) => `Ich habe gerade mein Konfydence-Druckprofil (${deckName}) getestet. Mach den kostenlosen Check und vergleich dein H.A.C.K.-Muster.`,
    interpretation: (pct) => interpretation(pct, "de"),
  },
};

// --- Certificate page -------------------------------------------------------

export const CERTIFICATE_STRINGS: Record<UiLang, {
  lockedHeading: string;
  lockedBody: string;
  backToResults: string;
  title: string;
  deckSuffix: (deckName: string) => string;
  nameLabel: string;
  deckLabel: string;
  scoreLabel: string;
  bandLabel: string;
  dateLabel: string;
  idLabel: string;
  participantName: string;
  disclaimer: (name: string, deckName: string) => string;
  downloadDefault: string;
  shareButton: string;
  shareText: (deckName: string, total: number, max: number, level: string) => string;
  addToLinkedIn: string;
  copiedAlert: string;
  dateLocale: string;
}> = {
  en: {
    lockedHeading: "Certificate locked",
    lockedBody: "Complete the full challenge to unlock your certificate.",
    backToResults: "Back to results",
    title: "Konfydence Readiness Certified",
    deckSuffix: (deckName) => `${deckName} Challenge`,
    nameLabel: "Name:",
    deckLabel: "Deck:",
    scoreLabel: "Score:",
    bandLabel: "KRS band:",
    dateLabel: "Date:",
    idLabel: "Certificate ID:",
    participantName: "Challenge Participant",
    disclaimer: (name, deckName) => `“This certifies that ${name} completed the ${deckName} Challenge and demonstrated practical scam-readiness skills under real-life pressure scenarios.”`,
    downloadDefault: "Download Certificate",
    shareButton: "Share Certificate",
    shareText: (deckName, total, max, level) => `I just completed the Konfydence ${deckName} Challenge — ${total}/${max}, ${level}.`,
    addToLinkedIn: "Add to LinkedIn",
    copiedAlert: "Certificate link copied to clipboard.",
    dateLocale: "en-GB",
  },
  de: {
    lockedHeading: "Zertifikat gesperrt",
    lockedBody: "Schließe die volle Challenge ab, um dein Zertifikat freizuschalten.",
    backToResults: "Zurück zu den Ergebnissen",
    title: "Konfydence Readiness zertifiziert",
    deckSuffix: (deckName) => `${deckName}-Challenge`,
    nameLabel: "Name:",
    deckLabel: "Deck:",
    scoreLabel: "Punktzahl:",
    bandLabel: "KRS-Stufe:",
    dateLabel: "Datum:",
    idLabel: "Zertifikat-ID:",
    participantName: "Challenge-Teilnehmer:in",
    disclaimer: (name, deckName) => `„Dies bestätigt, dass ${name} die ${deckName}-Challenge abgeschlossen und praktische Betrugs-Bereitschaft in realistischen Drucksituationen unter Beweis gestellt hat.“`,
    downloadDefault: "Zertifikat herunterladen",
    shareButton: "Zertifikat teilen",
    shareText: (deckName, total, max, level) => `Ich habe gerade die Konfydence-${deckName}-Challenge abgeschlossen — ${total}/${max}, ${level}.`,
    addToLinkedIn: "Zu LinkedIn hinzufügen",
    copiedAlert: "Zertifikatslink in die Zwischenablage kopiert.",
    dateLocale: "de-DE",
  },
};

// spec §9: exact edition-specific download button copy (English original).
const DOWNLOAD_BUTTON_LABEL_EN: Record<string, string> = {
  school: "Download Completion Certificate",
  university: "Download Completion Certificate",
  workplace: "Download Compliance Certificate",
  family: "Download Certificate",
  travelsafe: "Download Certificate",
};
const DOWNLOAD_BUTTON_LABEL_DE: Record<string, string> = {
  school: "Abschlusszertifikat herunterladen",
  university: "Abschlusszertifikat herunterladen",
  workplace: "Compliance-Zertifikat herunterladen",
  family: "Zertifikat herunterladen",
  travelsafe: "Zertifikat herunterladen",
};

export function downloadButtonLabel(edition: string, lang: UiLang): string {
  const table = lang === "de" ? DOWNLOAD_BUTTON_LABEL_DE : DOWNLOAD_BUTTON_LABEL_EN;
  return table[edition] ?? (lang === "de" ? CERTIFICATE_STRINGS.de.downloadDefault : CERTIFICATE_STRINGS.en.downloadDefault);
}

// --- Per-question feedback page --------------------------------------------

export const PRESSURE_LESSON_DE: Record<HackTrigger, { question: string; reflex: string }> = {
  H: {
    question: "Hat Zeitdruck versucht, dir die Bedenkzeit zu nehmen?",
    reflex: "Halt die Uhr an. Prüfe, bevor die Frist deine Entscheidung für dich trifft.",
  },
  A: {
    question: "Hat ein offizieller Name, eine Rolle oder eine Institution die Bitte vorab bestätigt wirken lassen?",
    reflex: "Autorität ist eine Behauptung, bis du sie über einen Kanal geprüft hast, dem du bereits vertraust.",
  },
  C: {
    question: "Hat Vertrautheit die Bitte sicherer wirken lassen, als die Beweislage hergab?",
    reflex: "Vertrautheit ist Kontext, kein Beweis. Bestätige Person, Konto oder Ziel unabhängig.",
  },
  K: {
    question: "Hast du vor dem unwiderruflichen Klick, der Überweisung, dem Code oder der Antwort gestoppt?",
    reflex: "Stopp genau im entscheidenden Moment. Verlasse die Anfrage, prüfe dann von einem sauberen Ausgangspunkt aus.",
  },
};

type FeedbackTier = { label: string; title: string; body: string; tone: "strong" | "safe" | "caution" | "risk"; mark: string };

export const FEEDBACK_TIERS_DE: Record<0 | 1 | 2 | 3 | 4, FeedbackTier> = {
  4: { label: "STARKE ENTSCHEIDUNG", title: "Du hast die Drucksituation durchbrochen.", body: "Du hast der anfragenden Person die Kontrolle über den nächsten Schritt entzogen und die Prüfung wieder in die eigene Hand genommen.", tone: "strong", mark: "✓" },
  3: { label: "SICHERE ENTSCHEIDUNG", title: "Geschützt — aber nicht der sauberste Weg.", body: "Du hast das Risiko verringert. Eine Option hätte die Situation noch unabhängiger von der ursprünglichen Bitte geprüft.", tone: "safe", mark: "↗" },
  2: { label: "TEILWEISE GESCHÜTZT", title: "Vorsichtig, aber die Tür blieb offen.", body: "Du hast Reibung eingebaut, aber ein wichtiger Teil hing noch von einer Behauptung, einem Kanal oder einer Person ab, die du nicht unabhängig geprüft hattest.", tone: "caution", mark: "!" },
  1: { label: "RISIKO BLEIBT", title: "Es fühlte sich vorsichtig an. Es war kein Beweis.", body: "Die Entscheidung klang vernünftig, ließ der anfragenden Person aber weiterhin die Kontrolle über das, was als Nächstes passiert.", tone: "risk", mark: "!" },
  0: { label: "DRUCK HAT GEWONNEN", title: "Genau das brauchte der Betrug.", body: "Die Anfrage kontrollierte weiterhin den Link, die Zahlung, die Zugangsdaten oder die nächste Aktion. Genau dort wächst das Risiko.", tone: "risk", mark: "×" },
};

export const FEEDBACK_STRINGS: Record<UiLang, {
  exit: string;
  hackSignal: string;
  yourMove: string;
  whyItMatters: string;
  keepThisRule: string;
  strongestMove: string;
  strongestMoveHint: string;
  resultReady: string;
  decisionsRemaining: (n: number) => string;
  seeProfile: string;
  nextTest: string;
  defaultExplanation: string;
}> = {
  en: {
    exit: "Exit",
    hackSignal: "H.A.C.K. signal",
    yourMove: "Your move",
    whyItMatters: "Why it matters",
    keepThisRule: "Keep this rule",
    strongestMove: "Strongest move",
    strongestMoveHint: "Use this as the decision pattern next time.",
    resultReady: "Your pressure-pattern result is ready.",
    decisionsRemaining: (n) => `${n} decision${n === 1 ? "" : "s"} remaining.`,
    seeProfile: "See my H.A.C.K. profile",
    nextTest: "Next pressure test",
    defaultExplanation: "Verify the request through a channel you opened independently.",
  },
  de: {
    exit: "Verlassen",
    hackSignal: "H.A.C.K.-Signal",
    yourMove: "Deine Entscheidung",
    whyItMatters: "Warum das wichtig ist",
    keepThisRule: "Merk dir diese Regel",
    strongestMove: "Stärkste Entscheidung",
    strongestMoveHint: "Nutze das nächste Mal dieses Entscheidungsmuster.",
    resultReady: "Dein Druckmuster-Ergebnis ist da.",
    decisionsRemaining: (n) => `Noch ${n} Entscheidung${n === 1 ? "" : "en"}.`,
    seeProfile: "Mein H.A.C.K.-Profil ansehen",
    nextTest: "Nächster Drucktest",
    defaultExplanation: "Prüfe die Anfrage über einen Kanal, den du selbst unabhängig eröffnet hast.",
  },
};

// --- Free-diagnostic email gate (guest player finishing round 1) -----------

export const EMAIL_GATE_STRINGS: Record<UiLang, {
  backToChallenges: string;
  readyHeading: (label: string) => string;
  h1: string;
  body: string;
  emailLabel: string;
  consentText: string;
  submit: string;
  alreadyHaveAccount: string;
  signIn: string;
  signInSuffix: string;
  legalPrefix: string;
  privacyPolicy: string;
  and: string;
  terms: string;
  privacyHref: string;
  termsHref: string;
  claimMessages: Record<string, string>;
}> = {
  en: {
    backToChallenges: "← Challenges",
    readyHeading: (label) => `Your ${label} result is ready`,
    h1: "Where should we send it?",
    body: "Your Readiness Score and full H.A.C.K. profile land in your inbox — and your Konfydence account keeps them for you on any device. No password.",
    emailLabel: "Email address",
    consentText: "Email me my result and occasional Konfydence updates. Unsubscribe anytime.",
    submit: "Send my result",
    alreadyHaveAccount: "Already have an account?",
    signIn: "Sign in",
    signInSuffix: "to see it.",
    legalPrefix: "By continuing you agree to our",
    privacyPolicy: "Privacy Policy",
    and: "and",
    terms: "Terms",
    privacyHref: "/privacy-policy",
    termsHref: "/terms-of-service",
    claimMessages: {
      invalid: "Enter a valid email and tick the box to continue.",
      used: "That email is already linked to another Konfydence account. Use a different address, or sign in first.",
      changed: "This result is already tied to a different email.",
      nosession: "We couldn't match this result to your device. Try opening the results link from the same browser you played in.",
    },
  },
  de: {
    backToChallenges: "← Challenges",
    readyHeading: (label) => `Dein ${label}-Ergebnis ist da`,
    h1: "Wohin sollen wir es schicken?",
    body: "Dein Readiness Score und dein volles H.A.C.K.-Profil landen in deinem Postfach — und dein Konfydence-Konto speichert sie geräteübergreifend. Kein Passwort nötig.",
    emailLabel: "E-Mail-Adresse",
    consentText: "Schick mir mein Ergebnis und gelegentliche Konfydence-Updates. Jederzeit abbestellbar.",
    submit: "Mein Ergebnis schicken",
    alreadyHaveAccount: "Schon ein Konto?",
    signIn: "Anmelden",
    signInSuffix: "um es zu sehen.",
    legalPrefix: "Mit dem Fortfahren stimmst du unserer",
    privacyPolicy: "Datenschutzerklärung",
    and: "und unseren",
    terms: "AGB",
    privacyHref: "/de/datenschutz",
    termsHref: "/de/agb",
    claimMessages: {
      invalid: "Gib eine gültige E-Mail-Adresse ein und setz das Häkchen, um fortzufahren.",
      used: "Diese E-Mail ist bereits mit einem anderen Konfydence-Konto verknüpft. Nutz eine andere Adresse oder melde dich zuerst an.",
      changed: "Dieses Ergebnis ist bereits mit einer anderen E-Mail-Adresse verknüpft.",
      nosession: "Wir konnten dieses Ergebnis nicht deinem Gerät zuordnen. Öffne den Ergebnislink im selben Browser, in dem du gespielt hast.",
    },
  },
};
