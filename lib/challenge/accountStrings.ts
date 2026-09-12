// German strings for the account/auth surface: sign-in, the account
// dashboard, security settings, the post-purchase claim page, and the
// login-code + results emails. Unlike the session/results pages, none of
// these pages have a scenario row to read `lang` off — a German visitor is
// tracked here via an explicit `?lang=de` query parameter threaded through
// every redirect and hidden form field that can reach this subsystem (see
// lib/challenge/startHandler.ts, ResultEmailGate, and the checkout
// success_url for a full-challenge purchase).
import type { UiLang } from "@/lib/challenge/uiStrings";

// --- Sign-in page + actions -------------------------------------------------

export const SIGNIN_STRINGS: Record<UiLang, {
  backHome: string;
  kicker: string;
  totpHeading: string;
  totpBody: string;
  totpLabel: string;
  totpSubmit: string;
  emailHeading: string;
  emailBody: string;
  emailLabel: string;
  consentText: string;
  emailSubmit: string;
  passkeyInstead: string;
  passkeyBusy: string;
  passkeyError: string;
  codeHeading: string;
  codeBody: (email: string) => string;
  codeLabel: string;
  codeSubmit: string;
  resend: string;
  legalPrefix: string;
  privacyPolicy: string;
  and: string;
  terms: string;
  privacyHref: string;
  termsHref: string;
}> = {
  en: {
    backHome: "← Konfydence",
    kicker: "Your account",
    totpHeading: "One more step.",
    totpBody: "Two-step verification is on for this account. Enter the current 6-digit code from your authenticator app — or a recovery code.",
    totpLabel: "Authenticator or recovery code",
    totpSubmit: "Verify",
    emailHeading: "Sign in with a code.",
    emailBody: "No password. Enter your email and we'll send a one-time code. The same account holds your Challenge results and any Lockscreens subscription.",
    emailLabel: "Email address",
    consentText: "Send me my sign-in code and occasional Konfydence updates. Unsubscribe anytime.",
    emailSubmit: "Email me a code",
    passkeyInstead: "Use a passkey instead",
    passkeyBusy: "Waiting for your device…",
    passkeyError: "no passkey found on this device.",
    codeHeading: "Enter your code.",
    codeBody: (email) => `We sent a 6-digit code to ${email}. It expires in 10 minutes. You can also tap the link in that email.`,
    codeLabel: "6-digit code",
    codeSubmit: "Sign in",
    resend: "Send a new code",
    legalPrefix: "By continuing you agree to our",
    privacyPolicy: "Privacy Policy",
    and: "and",
    terms: "Terms",
    privacyHref: "/privacy-policy",
    termsHref: "/terms-of-service",
  },
  de: {
    backHome: "← Konfydence",
    kicker: "Dein Konto",
    totpHeading: "Noch ein Schritt.",
    totpBody: "Für dieses Konto ist die Zwei-Schritt-Verifizierung aktiv. Gib den aktuellen 6-stelligen Code aus deiner Authenticator-App ein — oder einen Wiederherstellungscode.",
    totpLabel: "Authenticator- oder Wiederherstellungscode",
    totpSubmit: "Bestätigen",
    emailHeading: "Mit Code anmelden.",
    emailBody: "Kein Passwort nötig. Gib deine E-Mail-Adresse ein, wir schicken dir einen einmaligen Code. Im selben Konto liegen deine Challenge-Ergebnisse und ein eventuelles Lockscreens-Abo.",
    emailLabel: "E-Mail-Adresse",
    consentText: "Schick mir meinen Anmeldecode und gelegentliche Konfydence-Updates. Jederzeit abbestellbar.",
    emailSubmit: "Code per E-Mail schicken",
    passkeyInstead: "Stattdessen Passkey nutzen",
    passkeyBusy: "Warte auf dein Gerät…",
    passkeyError: "kein Passkey auf diesem Gerät gefunden.",
    codeHeading: "Gib deinen Code ein.",
    codeBody: (email) => `Wir haben einen 6-stelligen Code an ${email} geschickt. Er läuft in 10 Minuten ab. Du kannst auch auf den Link in der E-Mail tippen.`,
    codeLabel: "6-stelliger Code",
    codeSubmit: "Anmelden",
    resend: "Neuen Code schicken",
    legalPrefix: "Mit dem Fortfahren stimmst du unserer",
    privacyPolicy: "Datenschutzerklärung",
    and: "und unseren",
    terms: "AGB",
    privacyHref: "/de/datenschutz",
    termsHref: "/de/agb",
  },
};

export const SIGNIN_REASONS: Record<UiLang, Record<string, string>> = {
  en: {
    "free-round-2": "Your second free round saves to an account so your Readiness Score history follows you.",
    "full-challenge": "The full challenge needs an account — your progress, results and purchase stay with you on any device.",
    "team-invite": "Sign in to claim your team seat — your progress stays private to you; your admin sees completion only.",
  },
  de: {
    "free-round-2": "Deine zweite kostenlose Runde wird in einem Konto gespeichert, damit dein Readiness-Score-Verlauf erhalten bleibt.",
    "full-challenge": "Die volle Challenge braucht ein Konto — dein Fortschritt, deine Ergebnisse und dein Kauf bleiben auf jedem Gerät erhalten.",
    "team-invite": "Melde dich an, um deinen Teamplatz zu übernehmen — dein Fortschritt bleibt privat, dein Admin sieht nur den Abschluss.",
  },
};

export const SIGNIN_ERRORS: Record<UiLang, Record<string, string>> = {
  en: {
    consent: "Tick the box to continue.",
    email: "That doesn't look like an email address.",
    send: "We couldn't send the email just now. Try again in a moment.",
    code: "That code didn't match. Check the latest email and try again.",
    expired: "That code has expired. Ask for a new one.",
    attempts: "Too many tries on that code. Ask for a new one.",
    throttled: "Too many attempts. Wait a few minutes and try again.",
    totp: "That code didn't match. Try the current one from your authenticator, or a recovery code.",
  },
  de: {
    consent: "Setz das Häkchen, um fortzufahren.",
    email: "Das sieht nicht nach einer E-Mail-Adresse aus.",
    send: "Wir konnten die E-Mail gerade nicht senden. Versuch es gleich noch einmal.",
    code: "Der Code hat nicht gestimmt. Prüf die letzte E-Mail und versuch es erneut.",
    expired: "Der Code ist abgelaufen. Fordere einen neuen an.",
    attempts: "Zu viele Versuche mit diesem Code. Fordere einen neuen an.",
    throttled: "Zu viele Versuche. Warte ein paar Minuten und versuch es erneut.",
    totp: "Der Code hat nicht gestimmt. Probier den aktuellen Code aus deiner Authenticator-App oder einen Wiederherstellungscode.",
  },
};

// --- Passkey buttons ---------------------------------------------------------

export const PASSKEY_ADD_STRINGS: Record<UiLang, { busy: string; label: string; error: string }> = {
  en: { busy: "Waiting for your device…", label: "Add a passkey", error: "That didn't work — your device may not support passkeys, or the prompt was cancelled." },
  de: { busy: "Warte auf dein Gerät…", label: "Passkey hinzufügen", error: "Das hat nicht geklappt — dein Gerät unterstützt eventuell keine Passkeys, oder die Anfrage wurde abgebrochen." },
};

// --- Account dashboard (/account) -------------------------------------------

export const ACCOUNT_STRINGS: Record<UiLang, {
  backHome: string;
  kicker: string;
  signedOutHeading: string;
  signedOutBody: string;
  signInCta: string;
  security: string;
  takeChallenge: string;
  signOut: string;
  yourAccount: string;
  verified: string;
  unverified: string;
  lockscreensHeading: string;
  lockscreensLink: string;
  lockscreensNoteWithSubs: string;
  lockscreensNoteEmpty: (email: string) => string;
  deviceOnlyHeading: string;
  deviceOnlyBody: string;
  deviceOnlySignIn: string;
  teamAdminNote: string;
  teamAdminManage: string;
  teamMemberNote: string;
  teamMemberView: string;
  yourChallenges: string;
  ownedUnlimited: string;
  ownedSingle: string;
  renews: (date: string) => string;
  viaTeam: string;
  continueLabel: string;
  playLabel: string;
  roundProgress: (round: number, current: number, total: number) => string;
  yourResults: string;
}> = {
  en: {
    backHome: "← Konfydence",
    kicker: "Your account",
    signedOutHeading: "One account for everything Konfydence.",
    signedOutBody: "Your Challenge results on any device, and your Lockscreens subscription in the same place. Sign in with a one-time email code — no password.",
    signInCta: "Sign in",
    security: "Security",
    takeChallenge: "Take a challenge",
    signOut: "Sign out",
    yourAccount: "Your account",
    verified: "verified",
    unverified: "unverified",
    lockscreensHeading: "Lockscreens subscriptions",
    lockscreensLink: "Konfydence Lockscreens →",
    lockscreensNoteWithSubs: "Bought a subscription with a different email? Sign in with that address to link it too.",
    lockscreensNoteEmpty: (email) => `Lockscreens subscriptions bought with ${email} appear here automatically.`,
    deviceOnlyHeading: "These results only live on this device.",
    deviceOnlyBody: "Sign in with your email and we'll keep them on any device — and connect any Lockscreens subscription bought with the same address.",
    deviceOnlySignIn: "Sign in to keep them",
    teamAdminNote: "You're the team admin.",
    teamAdminManage: "Manage team →",
    teamMemberNote: "Your team seat — all five editions.",
    teamMemberView: "View →",
    yourChallenges: "Your challenges",
    ownedUnlimited: "All five editions — unlimited rounds.",
    ownedSingle: "Full access, unlimited rounds.",
    renews: (date) => ` Renews ${date}.`,
    viaTeam: " Access is provided by your team.",
    continueLabel: "Continue →",
    playLabel: "Play →",
    roundProgress: (round, current, total) => `Round ${round} · scenario ${current} of ${total}`,
    yourResults: "Your Challenge results",
  },
  de: {
    backHome: "← Konfydence",
    kicker: "Dein Konto",
    signedOutHeading: "Ein Konto für alles bei Konfydence.",
    signedOutBody: "Deine Challenge-Ergebnisse auf jedem Gerät und dein Lockscreens-Abo an einem Ort. Melde dich mit einem einmaligen E-Mail-Code an — kein Passwort nötig.",
    signInCta: "Anmelden",
    security: "Sicherheit",
    takeChallenge: "Challenge starten",
    signOut: "Abmelden",
    yourAccount: "Dein Konto",
    verified: "bestätigt",
    unverified: "unbestätigt",
    lockscreensHeading: "Lockscreens-Abos",
    lockscreensLink: "Konfydence Lockscreens →",
    lockscreensNoteWithSubs: "Ein Abo mit einer anderen E-Mail gekauft? Melde dich mit dieser Adresse an, um es ebenfalls zu verknüpfen.",
    lockscreensNoteEmpty: (email) => `Lockscreens-Abos, die mit ${email} gekauft wurden, erscheinen hier automatisch.`,
    deviceOnlyHeading: "Diese Ergebnisse liegen nur auf diesem Gerät.",
    deviceOnlyBody: "Melde dich mit deiner E-Mail-Adresse an, und wir bewahren sie auf jedem Gerät auf — und verknüpfen ein eventuelles Lockscreens-Abo mit derselben Adresse.",
    deviceOnlySignIn: "Anmelden, um sie zu behalten",
    teamAdminNote: "Du bist der Team-Admin.",
    teamAdminManage: "Team verwalten →",
    teamMemberNote: "Dein Teamplatz — alle fünf Editionen.",
    teamMemberView: "Ansehen →",
    yourChallenges: "Deine Challenges",
    ownedUnlimited: "Alle fünf Editionen — unbegrenzte Runden.",
    ownedSingle: "Voller Zugriff, unbegrenzte Runden.",
    renews: (date) => ` Verlängert sich am ${date}.`,
    viaTeam: " Der Zugriff wird von deinem Team bereitgestellt.",
    continueLabel: "Weiter →",
    playLabel: "Spielen →",
    roundProgress: (round, current, total) => `Runde ${round} · Szenario ${current} von ${total}`,
    yourResults: "Deine Challenge-Ergebnisse",
  },
};

// --- Results history / edition summary --------------------------------------

export const RESULTS_HISTORY_STRINGS: Record<UiLang, {
  emptyBody: string;
  startFree: string;
  completedRuns: (n: number) => string;
  runHistory: string;
  continueLabel: string;
  ofScenario: (done: number, total: number, round: number) => string;
  modeLabel: Record<string, string>;
  best: string;
  latest: string;
  runsCompleted: (n: number) => string;
  notAttempted: string;
  dateLocale: string;
}> = {
  en: {
    emptyBody: "No Konfydence Challenge runs here yet. Take a free challenge to start building your Readiness Score history.",
    startFree: "Start a free challenge",
    completedRuns: (n) => `${n} completed ${n === 1 ? "run" : "runs"}.`,
    runHistory: "Run history",
    continueLabel: "Continue →",
    ofScenario: (done, total, round) => `${done} of ${total} · round ${round}`,
    modeLabel: { diagnostic: "Free diagnostic", full: "Full challenge" },
    best: "best",
    latest: "Latest",
    runsCompleted: (n) => `${n} ${n === 1 ? "run" : "runs"} completed`,
    notAttempted: "Not attempted yet",
    dateLocale: "en-GB",
  },
  de: {
    emptyBody: "Hier gibt es noch keine Konfydence-Challenge-Runden. Mach eine kostenlose Challenge, um deinen Readiness-Score-Verlauf aufzubauen.",
    startFree: "Kostenlose Challenge starten",
    completedRuns: (n) => `${n} abgeschlossene ${n === 1 ? "Runde" : "Runden"}.`,
    runHistory: "Rundenverlauf",
    continueLabel: "Weiter →",
    ofScenario: (done, total, round) => `${done} von ${total} · Runde ${round}`,
    modeLabel: { diagnostic: "Kostenloser Check", full: "Volle Challenge" },
    best: "bestes",
    latest: "Zuletzt",
    runsCompleted: (n) => `${n} ${n === 1 ? "Runde" : "Runden"} abgeschlossen`,
    notAttempted: "Noch nicht gespielt",
    dateLocale: "de-DE",
  },
};

// --- Security page (/account/security) --------------------------------------

export const SECURITY_STRINGS: Record<UiLang, {
  backAccount: string;
  kicker: string;
  passkeysHeading: string;
  passkeysBody: string;
  passkeyRowTitle: string;
  added: (date: string) => string;
  lastUsed: (date: string) => string;
  remove: string;
  noPasskeys: string;
  totpHeading: string;
  totpBody: string;
  totpBodyOptional: string;
  totpBadCode: string;
  totpOnNote: (n: number) => string;
  totpOffLabel: string;
  totpOffButton: string;
  totpOnButton: string;
  dateLocale: string;
}> = {
  en: {
    backAccount: "← Your account",
    kicker: "Security",
    passkeysHeading: "Passkeys",
    passkeysBody: "A passkey signs you in with your device's screen lock or fingerprint — nothing to type, nothing to phish. Add one and it becomes the fast way back in.",
    passkeyRowTitle: "Passkey",
    added: (date) => `Added ${date}`,
    lastUsed: (date) => ` · last used ${date}`,
    remove: "Remove",
    noPasskeys: "No passkeys yet.",
    totpHeading: "Two-step verification",
    totpBody: "A code from an authenticator app, asked for after your email code.",
    totpBodyOptional: " Optional if you use a passkey.",
    totpBadCode: "That code didn't match — two-step verification is still on.",
    totpOnNote: (n) => `On · ${n} recovery ${n === 1 ? "code" : "codes"} left.`,
    totpOffLabel: "Enter a current code to turn it off",
    totpOffButton: "Turn off two-step verification",
    totpOnButton: "Turn on",
    dateLocale: "en-GB",
  },
  de: {
    backAccount: "← Dein Konto",
    kicker: "Sicherheit",
    passkeysHeading: "Passkeys",
    passkeysBody: "Ein Passkey meldet dich mit dem Sperrbildschirm oder Fingerabdruck deines Geräts an — nichts zu tippen, nichts zu phishen. Füg einen hinzu, und er wird dein schneller Weg zurück ins Konto.",
    passkeyRowTitle: "Passkey",
    added: (date) => `Hinzugefügt am ${date}`,
    lastUsed: (date) => ` · zuletzt genutzt am ${date}`,
    remove: "Entfernen",
    noPasskeys: "Noch keine Passkeys.",
    totpHeading: "Zwei-Schritt-Verifizierung",
    totpBody: "Ein Code aus einer Authenticator-App, nach deinem E-Mail-Code abgefragt.",
    totpBodyOptional: " Optional, wenn du einen Passkey nutzt.",
    totpBadCode: "Der Code hat nicht gestimmt — die Zwei-Schritt-Verifizierung ist weiterhin aktiv.",
    totpOnNote: (n) => `Aktiv · noch ${n} Wiederherstellungs${n === 1 ? "code" : "codes"}.`,
    totpOffLabel: "Gib einen aktuellen Code ein, um sie auszuschalten",
    totpOffButton: "Zwei-Schritt-Verifizierung ausschalten",
    totpOnButton: "Einschalten",
    dateLocale: "de-DE",
  },
};

// --- Two-step verification setup (/account/security/totp) -------------------

export const TOTP_SETUP_STRINGS: Record<UiLang, {
  backSecurity: string;
  kicker: string;
  doneTitle: string;
  doneSaveCodes: string;
  doneActiveOnly: string;
  backToSecurity: string;
  alreadyOnTitle: string;
  alreadyOnBody: string;
  scanTitle: string;
  scanBody: string;
  cantScan: string;
  badCode: string;
  confirmLabel: string;
  confirm: string;
  brokenTitle: string;
  startAgain: string;
  startTitle: string;
  startBody: string;
  setItUp: string;
}> = {
  en: {
    backSecurity: "← Security",
    kicker: "Two-step verification",
    doneTitle: "Two-step verification is on.",
    doneSaveCodes: "Save these recovery codes somewhere safe. Each works once if you lose your authenticator. This is the only time they're shown.",
    doneActiveOnly: "Two-step verification is active on your account.",
    backToSecurity: "Back to security",
    alreadyOnTitle: "Two-step verification is already on.",
    alreadyOnBody: "You can turn it off from the security page.",
    scanTitle: "Scan this with your authenticator.",
    scanBody: "Use Google Authenticator, 1Password, Authy or similar. Can't scan? Enter this key:",
    cantScan: "Can't scan? Enter this key:",
    badCode: "That code didn't match. Try the current one.",
    confirmLabel: "Enter the 6-digit code to confirm",
    confirm: "Confirm",
    brokenTitle: "Something went wrong.",
    startAgain: "Start again",
    startTitle: "Add two-step verification.",
    startBody: "A time-based code from an authenticator app, asked for after your email code. It doesn't replace a passkey — if you have one, you already have strong sign-in.",
    setItUp: "Set it up",
  },
  de: {
    backSecurity: "← Sicherheit",
    kicker: "Zwei-Schritt-Verifizierung",
    doneTitle: "Zwei-Schritt-Verifizierung ist aktiv.",
    doneSaveCodes: "Bewahre diese Wiederherstellungscodes sicher auf. Jeder funktioniert einmal, falls du deinen Authenticator verlierst. Sie werden nur dieses eine Mal angezeigt.",
    doneActiveOnly: "Die Zwei-Schritt-Verifizierung ist für dein Konto aktiv.",
    backToSecurity: "Zurück zur Sicherheit",
    alreadyOnTitle: "Die Zwei-Schritt-Verifizierung ist bereits aktiv.",
    alreadyOnBody: "Du kannst sie auf der Sicherheitsseite ausschalten.",
    scanTitle: "Scanne das mit deinem Authenticator.",
    scanBody: "Nutze Google Authenticator, 1Password, Authy oder Ähnliches. Kannst du nicht scannen? Gib diesen Schlüssel ein:",
    cantScan: "Kannst du nicht scannen? Gib diesen Schlüssel ein:",
    badCode: "Der Code hat nicht gestimmt. Probier den aktuellen.",
    confirmLabel: "Gib den 6-stelligen Code zur Bestätigung ein",
    confirm: "Bestätigen",
    brokenTitle: "Da ist etwas schiefgelaufen.",
    startAgain: "Neu starten",
    startTitle: "Zwei-Schritt-Verifizierung hinzufügen.",
    startBody: "Ein zeitbasierter Code aus einer Authenticator-App, nach deinem E-Mail-Code abgefragt. Er ersetzt keinen Passkey — falls du bereits einen hast, ist deine Anmeldung schon stark abgesichert.",
    setItUp: "Einrichten",
  },
};

// --- Post-purchase claim page (/challenge/claim) ----------------------------

export const CLAIM_STRINGS: Record<UiLang, {
  confirmingHeading: string;
  confirmingBody: string;
  attemptLabel: (n: number, max: number) => string;
  confirmedHeading: string;
  securedTo: (email: string) => string;
  openingChallenge: string;
  delayedHeading: string;
  delayedBody: string;
  retry: string;
}> = {
  en: {
    confirmingHeading: "Confirming your access",
    confirmingBody: "We're confirming your payment and setting up your account. Keep this page open; this normally takes a few seconds.",
    attemptLabel: (n, max) => `Verification attempt ${n} of ${max}`,
    confirmedHeading: "Access confirmed.",
    securedTo: (email) => `Secured to ${email} and signed in on this device. Sign in with that email on any device to restore your access.`,
    openingChallenge: "Opening your challenge…",
    delayedHeading: "Purchase verification delayed",
    delayedBody: "Purchase verification is taking longer than expected. Refresh this page, or contact support@konfydence.com if access still does not appear.",
    retry: "Refresh and retry",
  },
  de: {
    confirmingHeading: "Dein Zugang wird bestätigt",
    confirmingBody: "Wir bestätigen deine Zahlung und richten dein Konto ein. Lass diese Seite offen — das dauert normalerweise nur ein paar Sekunden.",
    attemptLabel: (n, max) => `Prüfversuch ${n} von ${max}`,
    confirmedHeading: "Zugang bestätigt.",
    securedTo: (email) => `Gesichert auf ${email} und auf diesem Gerät angemeldet. Melde dich mit dieser E-Mail-Adresse auf jedem Gerät an, um deinen Zugang wiederherzustellen.`,
    openingChallenge: "Deine Challenge wird geöffnet…",
    delayedHeading: "Kaufbestätigung verzögert",
    delayedBody: "Die Kaufbestätigung dauert länger als erwartet. Lade diese Seite neu, oder wende dich an support@konfydence.com, falls der Zugang weiterhin fehlt.",
    retry: "Neu laden und erneut versuchen",
  },
};

// --- Unsubscribe confirmation page (/account/unsubscribe) -------------------

export const UNSUBSCRIBE_STRINGS: Record<UiLang, {
  kicker: string;
  doneHeading: string;
  doneBody: (email: string) => string;
  invalidHeading: string;
  invalidBody: string;
  backHome: string;
}> = {
  en: {
    kicker: "Email preferences",
    doneHeading: "You're unsubscribed.",
    doneBody: (email) => `We won't send ${email} non-essential email. You'll still get things you directly ask for, like a sign-in code.`,
    invalidHeading: "That link didn't check out.",
    invalidBody: "The unsubscribe link may be old or altered. Contact us and we'll sort it.",
    backHome: "Back to Konfydence",
  },
  de: {
    kicker: "E-Mail-Einstellungen",
    doneHeading: "Du bist abgemeldet.",
    doneBody: (email) => `Wir schicken ${email} keine nicht notwendigen E-Mails mehr. Dinge, die du direkt anforderst — wie einen Anmeldecode — bekommst du weiterhin.`,
    invalidHeading: "Dieser Link konnte nicht bestätigt werden.",
    invalidBody: "Der Abmeldelink ist möglicherweise veraltet oder wurde verändert. Kontaktiere uns, wir kümmern uns darum.",
    backHome: "Zurück zu Konfydence",
  },
};

// --- Login-code email --------------------------------------------------------

export const LOGIN_EMAIL_STRINGS: Record<UiLang, {
  subject: (code: string) => string;
  preheader: (code: string) => string;
  enterCode: string;
  expiresNote: string;
  tapToSignIn: string;
  ignoreNote: string;
  tagline: string;
}> = {
  en: {
    subject: (code) => `Your Konfydence sign-in code: ${code}`,
    preheader: (code) => `Your code is ${code}. It expires in 10 minutes.`,
    enterCode: "Enter this code to sign in:",
    expiresNote: "It expires in 10 minutes and can be used once.",
    tapToSignIn: "Or tap here to sign in",
    ignoreNote: "If you didn't ask to sign in, you can ignore this email — no account changes were made.",
    tagline: "Confidence under pressure.",
  },
  de: {
    subject: (code) => `Dein Konfydence-Anmeldecode: ${code}`,
    preheader: (code) => `Dein Code lautet ${code}. Er läuft in 10 Minuten ab.`,
    enterCode: "Gib diesen Code ein, um dich anzumelden:",
    expiresNote: "Er läuft in 10 Minuten ab und kann nur einmal verwendet werden.",
    tapToSignIn: "Oder hier antippen, um dich anzumelden",
    ignoreNote: "Falls du dich nicht anmelden wolltest, kannst du diese E-Mail ignorieren — es wurden keine Änderungen an deinem Konto vorgenommen.",
    tagline: "Sicherheit unter Druck.",
  },
};

// --- Challenge results email --------------------------------------------------

export const RESULTS_EMAIL_STRINGS: Record<UiLang, {
  subjectDiagnostic: (edition: string, pct: number, level: string) => string;
  subjectFull: (edition: string, pct: number, level: string) => string;
  preheaderWeak: (pct: number, level: string, weak: string) => string;
  preheaderNoWeak: (pct: number, level: string) => string;
  freeCheckLabel: string;
  fullChallengeLabel: string;
  readinessScore: string;
  mostExposed: (weak: string) => string;
  practise: string;
  hackProfileHeading: string;
  hackProfileSubtext: string;
  nextStepOverline: string;
  nextStepHeading: (edition: string) => string;
  nextStepBody: (weakSuffix: string) => string;
  weakSuffix: (weak: string) => string;
  unlockFull: (edition: string) => string;
  moreThanOne: string;
  allFiveLink: string;
  keepSharpOverline: string;
  keepSharpHeading: string;
  keepSharpBody: (edition: string) => string;
  replay: string;
  seeLockscreens: string;
  yourAccount: string;
  seeResultsAnyDevice: string;
  noPasswordNote: string;
  sentTo: (email: string) => string;
  unsubscribe: string;
  privacy: string;
  tagline: string;
}> = {
  en: {
    subjectDiagnostic: (edition, pct, level) => `Your ${edition} Readiness Score: ${pct}% — ${level}`,
    subjectFull: (edition, pct, level) => `Your ${edition} Challenge result: ${pct}% — ${level}`,
    preheaderWeak: (pct, level, weak) => `${pct}% — ${level}. You're most exposed to ${weak} pressure. Here's what that means.`,
    preheaderNoWeak: (pct, level) => `${pct}% — ${level}. Your full H.A.C.K. profile is inside.`,
    freeCheckLabel: "Free readiness check",
    fullChallengeLabel: "Full challenge",
    readinessScore: "Your Readiness Score",
    mostExposed: (weak) => `Most exposed to — ${weak}`,
    practise: "Practise:",
    hackProfileHeading: "Your H.A.C.K. profile",
    hackProfileSubtext: "How you held up against each of the four pressure tactics.",
    nextStepOverline: "The next step",
    nextStepHeading: (edition) => `You've seen the free check. The full ${edition} Challenge is the practice.`,
    nextStepBody: (weakSuffix) => `40+ real situations, balanced across all four pressure tactics${weakSuffix}. You work through them in short rounds, and your Readiness Score updates as you go. About 20 minutes to start.`,
    weakSuffix: (weak) => ` — including more of the ${weak} scenarios you found hardest`,
    unlockFull: (edition) => `Take the full ${edition} Challenge — $6.99`,
    moreThanOne: "More than one situation to prepare for?",
    allFiveLink: "All five editions are $24.99",
    keepSharpOverline: "Keep it sharp",
    keepSharpHeading: "A score fades. The habit is what lasts.",
    keepSharpBody: (edition) => `Replay the ${edition} rounds any time — the engine serves the scenarios you've seen least first. And if you want the reminder somewhere you can't scroll past it, Konfydence Lockscreens puts one Pause · Assess · Talk prompt on your phone, refreshed every two weeks.`,
    replay: "Replay a round",
    seeLockscreens: "See Konfydence Lockscreens →",
    yourAccount: "This email is your Konfydence account.",
    seeResultsAnyDevice: "See your results on any device →",
    noPasswordNote: "No password — this link signs you in.",
    sentTo: (email) => `Sent to ${email} because you asked for your Konfydence Challenge result.`,
    unsubscribe: "Unsubscribe",
    privacy: "Privacy",
    tagline: "Konfydence · Confidence under pressure.",
  },
  de: {
    subjectDiagnostic: (edition, pct, level) => `Dein ${edition}-Readiness-Score: ${pct}% — ${level}`,
    subjectFull: (edition, pct, level) => `Dein ${edition}-Challenge-Ergebnis: ${pct}% — ${level}`,
    preheaderWeak: (pct, level, weak) => `${pct}% — ${level}. Du bist am stärksten anfällig für ${weak}-Druck. Hier erfährst du, was das bedeutet.`,
    preheaderNoWeak: (pct, level) => `${pct}% — ${level}. Dein vollständiges H.A.C.K.-Profil ist beigefügt.`,
    freeCheckLabel: "Kostenloser Check",
    fullChallengeLabel: "Volle Challenge",
    readinessScore: "Dein Readiness Score",
    mostExposed: (weak) => `Am stärksten anfällig für — ${weak}`,
    practise: "Übe:",
    hackProfileHeading: "Dein H.A.C.K.-Profil",
    hackProfileSubtext: "Wie du dich gegen jede der vier Drucktaktiken behauptet hast.",
    nextStepOverline: "Der nächste Schritt",
    nextStepHeading: (edition) => `Du hast den kostenlosen Check gemacht. Die volle ${edition}-Challenge ist das Training.`,
    nextStepBody: (weakSuffix) => `48 reale Situationen, ausgewogen über alle vier Drucktaktiken${weakSuffix}. Du arbeitest sie in kurzen Runden durch, und dein Readiness Score aktualisiert sich dabei. Der Einstieg dauert etwa 20 Minuten.`,
    weakSuffix: (weak) => ` — inklusive mehr ${weak}-Szenarien, die dir am schwersten fielen`,
    unlockFull: (edition) => `Volle ${edition}-Challenge starten — €6,99`,
    moreThanOne: "Mehr als eine Situation, auf die du dich vorbereiten willst?",
    allFiveLink: "Alle fünf Editionen für €24,99",
    keepSharpOverline: "Bleib wachsam",
    keepSharpHeading: "Ein Score verblasst. Die Gewohnheit bleibt.",
    keepSharpBody: (edition) => `Wiederhol die ${edition}-Runden jederzeit — die Engine zeigt zuerst die Szenarien, die du am wenigsten gesehen hast. Und wenn du die Erinnerung dort willst, wo du nicht dran vorbeischrollen kannst: Konfydence Lockscreens bringt alle zwei Wochen einen neuen Anhalten · Abklären · Ansprechen-Hinweis auf dein Handy.`,
    replay: "Runde wiederholen",
    seeLockscreens: "Konfydence Lockscreens ansehen →",
    yourAccount: "Diese E-Mail ist dein Konfydence-Konto.",
    seeResultsAnyDevice: "Deine Ergebnisse auf jedem Gerät ansehen →",
    noPasswordNote: "Kein Passwort nötig — dieser Link meldet dich an.",
    sentTo: (email) => `Gesendet an ${email}, weil du dein Konfydence-Challenge-Ergebnis angefordert hast.`,
    unsubscribe: "Abbestellen",
    privacy: "Datenschutz",
    tagline: "Konfydence · Sicherheit unter Druck.",
  },
};
