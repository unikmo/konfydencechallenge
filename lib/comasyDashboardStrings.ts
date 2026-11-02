// UI strings for the CoMaSy customer workspace (app/comasy/dashboard/*) in
// English and German. The workspace is one set of pages: the language comes
// from ?lang=, falling back to the kf_lang cookie that LangRemember sets, so a
// German school administrator stays in German through form posts and redirects.
export type DashLang = "en" | "de";

export const LANG_COOKIE = "kf_lang";

export function resolveDashLang(param: string | undefined | null, cookie: string | undefined | null): DashLang {
  if (param === "de" || param === "en") return param;
  return cookie === "de" ? "de" : "en";
}

export const VIEW_KEYS = ["overview", "people", "practice", "measure", "reports", "settings"] as const;
export type ViewKey = (typeof VIEW_KEYS)[number];

type Dict = {
  views: Record<ViewKey, string>;
  locale: string;
  pct: (n: number) => string;
  notEnough: string;
  pts: (n: number) => string;
  customerWorkspace: string;
  signOut: string;
  platformHome: string;
  overviewTitle: string;
  metrics: {
    participants: string; participantsNote: (n: number) => string;
    activeCampaigns: string; activeCampaignsNote: (n: number) => string;
    participation: string; participationNote: string;
    pause: string; pauseNote: string; pauseNoteShort: string;
    verify: string; verifyNote: string; verifyNoteShort: string;
    impulse: string; impulseNote: string;
    prePost: string; prePostNote: string; prePostShort: string;
    baselineLater: (a: string, b: string) => string;
  };
  hackTitle: string; hackEyebrow: string;
  hack: Record<"H" | "A" | "C" | "K", string>;
  attentionTitle: string; attentionEyebrow: string;
  attentionLine: (p: string, v: string, i: string) => string;
  attentionEmpty: string;
  recentTitle: string; practiceEyebrow: string;
  th: {
    campaign: string; cohort: string; designation: string; status: string; responses: string;
    participant: string; department: string; practice: string; manage: string; type: string; control: string;
    pause: string; verify: string; impulse: string;
  };
  allParticipants: string; all: string;
  people: {
    createCohortTitle: string; cohortsEyebrow: string; cohortName: string; department: string; country: string; role: string; createCohort: string;
    inviteTitle: string; peopleEyebrow: string; firstName: string; lastName: string; workEmail: string; cohortLabel: string; unassigned: string; roleSingle: string; addParticipant: string;
    classTitle: string; classEyebrow: string; classNote: string; classCohort: string; selectCohort: string; prefix: string; prefixDefault: string; count: string; createAliases: string;
    csvLinks: string; csvLinksDe: string;
    participantsTitle: string; records: (n: number) => string;
    alias: string; openLink: string; enable: string; disable: string; deleteData: string;
    cohortsTitle: string; segmentation: string; participantsN: (n: number) => string; noFilters: string;
  };
  practice: {
    createTitle: string; createEyebrow: string; campaignName: string; allParticipantsOpt: string; designation: string; statusLabel: string;
    schedule: string; roleFocus: string; hackFocus: string; balanced: string; criticalAction: string; library: string; createCampaign: string;
    rulesTitle: string; rulesEyebrow: string; rules: [string, string][]; rulesLast: string;
    campaignsTitle: string; liveOps: string; general: string; save: string;
  };
  designations: Record<string, string>;
  statuses: Record<string, string>;
  measure: {
    hackBreakdown: string; trigger: string; definitions: string; transparent: string;
    defs: [string, string][]; defsNote: string;
    cohortComparison: string; whereFocus: string; cohortCol: string;
  };
  reports: {
    items: Record<"executive" | "awareness" | "compliance", [string, string]>;
    report: string; pdf: string; csv: string; periodsTitle: string; evidence: string; periodsCopy: string; insights: string;
  };
  settings: {
    orgTitle: string; workspace: string; organisation: string; country: string; industry: string; nis2: string; nis2Yes: string; nis2No: string;
    wsTitle: string; privacy: string; displayName: string; retention: string; saveSettings: string; retentionNote: string;
    permsTitle: string; status: string; perms: [string, string][];
  };
  langSwitch: string;
};

const pctEn = (n: number) => `${Math.round(n * 10) / 10}%`;
const pctDe = (n: number) => `${(Math.round(n * 10) / 10).toLocaleString("de-DE")} %`;

export const DASH: Record<DashLang, Dict> = {
  en: {
    views: { overview: "Overview", people: "People", practice: "Practice", measure: "Measure", reports: "Reports", settings: "Settings" },
    locale: "en",
    pct: pctEn,
    notEnough: "Not enough data",
    pts: (n) => `${n > 0 ? "+" : ""}${n} pts`,
    customerWorkspace: "Customer workspace",
    signOut: "Sign out",
    platformHome: "Platform home",
    overviewTitle: "Behaviour at a glance",
    metrics: {
      participants: "Participants", participantsNote: (n) => `${n} with activity`,
      activeCampaigns: "Active campaigns", activeCampaignsNote: (n) => `${n} total`,
      participation: "Participation", participationNote: "participants with recorded decisions",
      pause: "Pause Adoption", pauseNote: "interrupt / challenge before proceeding", pauseNoteShort: "safe interruption / challenge",
      verify: "Verification Rate", verifyNote: "independent verification behaviour", verifyNoteShort: "independent verification",
      impulse: "Impulse Rate", impulseNote: "immediate higher-risk action",
      prePost: "Pre/post change", prePostNote: "Pause Adoption movement", prePostShort: "Pre/post",
      baselineLater: (a, b) => `Baseline ${a} → later ${b}`,
    },
    hackTitle: "H.A.C.K. profile", hackEyebrow: "PRESSURE RESILIENCE",
    hack: { H: "Hurry", A: "Authority", C: "Comfort", K: "Critical Action" },
    attentionTitle: "Cohorts requiring attention", attentionEyebrow: "FOCUS NEXT",
    attentionLine: (p, v, i) => `Pause ${p} · Verify ${v} · Impulse ${i}`,
    attentionEmpty: "No cohort has enough concerning data to flag.",
    recentTitle: "Recent campaigns", practiceEyebrow: "PRACTICE",
    th: { campaign: "Campaign", cohort: "Cohort", designation: "Designation", status: "Status", responses: "Responses", participant: "Participant", department: "Department", practice: "Practice", manage: "Manage", type: "Type", control: "Control", pause: "Pause", verify: "Verify", impulse: "Impulse" },
    allParticipants: "All participants", all: "All",
    people: {
      createCohortTitle: "Create cohort", cohortsEyebrow: "COHORTS", cohortName: "Cohort name", department: "Department", country: "Country", role: "Role / audience", createCohort: "Create cohort",
      inviteTitle: "Invite participant", peopleEyebrow: "PEOPLE", firstName: "First name", lastName: "Last name", workEmail: "Work email", cohortLabel: "Cohort", unassigned: "Unassigned", roleSingle: "Role", addParticipant: "Add participant",
      classTitle: "Add a class (no names)", classEyebrow: "STUDENTS UNDER 18",
      classNote: "Creates numbered aliases such as Student 01. No names or email addresses are entered or stored. You keep the key that links each alias to a student, and share each alias's personal link with that student. Download the link sheet to print or send.",
      classCohort: "Class cohort", selectCohort: "Select a cohort…", prefix: "Alias prefix", prefixDefault: "Student", count: "Number of students (1–60)", createAliases: "Create aliases",
      csvLinks: "Download practice links (CSV) ↗", csvLinksDe: "German links (CSV) ↗",
      participantsTitle: "Participants", records: (n) => `${n} RECORDS`,
      alias: "Alias, no personal details", openLink: "Open link ↗", enable: "Enable", disable: "Disable", deleteData: "Delete data",
      cohortsTitle: "Cohorts", segmentation: "SEGMENTATION", participantsN: (n) => `${n} participants`, noFilters: "No filters",
    },
    practice: {
      createTitle: "Create / assign campaign", createEyebrow: "PRACTICE", campaignName: "Campaign name", allParticipantsOpt: "All participants", designation: "Designation", statusLabel: "Status",
      schedule: "Schedule", roleFocus: "Role focus", hackFocus: "H.A.C.K. focus", balanced: "Balanced", criticalAction: "Critical Action", library: "Scenario library — select 3–8", createCampaign: "Create campaign",
      rulesTitle: "Campaign design rules", rulesEyebrow: "BASELINE → PRACTICE → FOLLOW-UP",
      rules: [["Baseline", "records the starting behaviour before targeted practice."], ["Practice", "gives repeated short decision rehearsal."], ["Follow-up", "is stored separately and powers pre/post comparison."]],
      rulesLast: "Every customer metric is calculated from recorded scenario decisions—not completion alone.",
      campaignsTitle: "Campaigns", liveOps: "LIVE OPERATIONS", general: "General", save: "Save",
    },
    designations: { BASELINE: "BASELINE", PRACTICE: "PRACTICE", FOLLOWUP: "FOLLOWUP" },
    statuses: {},
    measure: {
      hackBreakdown: "H.A.C.K. breakdown", trigger: "TRIGGER RESPONSE", definitions: "Metric definitions", transparent: "TRANSPARENT BY DESIGN",
      defs: [
        ["Pause Adoption", "— applicable responses classified as interrupting, safely challenging or slowing the risky action chain."],
        ["Verification Rate", "— responses classified as independently verifying the request or source."],
        ["Impulse Rate", "— immediate higher-risk responses."],
      ],
      defsNote: "These are defined CoMaSy operational metrics, not claims of validated psychological constructs.",
      cohortComparison: "Cohort comparison", whereFocus: "WHERE TO FOCUS", cohortCol: "Cohort",
    },
    reports: {
      items: {
        executive: ["Executive report", "Participation, behaviour movement, H.A.C.K. profile and priority focus."],
        awareness: ["Security Awareness report", "Campaign activity, behavioural indicators and cohort comparison."],
        compliance: ["Compliance / NIS2 evidence report", "Defined programme activity and effectiveness evidence with an explicit non-compliance disclaimer."],
      },
      report: "REPORT", pdf: "PDF export", csv: "CSV export", periodsTitle: "Reporting periods", evidence: "EVIDENCE",
      periodsCopy: "Exports currently reflect all recorded organisation activity. Date-window reporting is retained as the next filter layer once enough customer history exists to make period selection meaningful.",
      insights: "Behaviour over time →",
    },
    settings: {
      orgTitle: "Organisation", workspace: "WORKSPACE", organisation: "Organisation", country: "Country", industry: "Industry", nis2: "NIS2 relevance", nis2Yes: "Flagged for review", nis2No: "Not flagged",
      wsTitle: "Workspace settings", privacy: "PRIVACY & BRANDING", displayName: "Workspace display name", retention: "Retention period (days)", saveSettings: "Save settings",
      retentionNote: "Retention is stored as an organisation policy value; automated deletion is not claimed until a scheduled retention worker is deployed.",
      permsTitle: "Permissions and integrations", status: "STATUS",
      perms: [
        ["Organisation isolation", "Active — signed tenant session + server-side org filters"],
        ["Customer administrators", "Workspace access code active"],
        ["SSO", "Not advertised — not implemented"],
        ["External integrations", "Not advertised — no customer integration enabled yet"],
      ],
    },
    langSwitch: "Deutsch",
  },
  de: {
    views: { overview: "Überblick", people: "Personen", practice: "Training", measure: "Auswertung", reports: "Berichte", settings: "Einstellungen" },
    locale: "de-DE",
    pct: pctDe,
    notEnough: "Noch zu wenige Daten",
    pts: (n) => `${n > 0 ? "+" : ""}${n.toLocaleString("de-DE")} Punkte`,
    customerWorkspace: "Kundenbereich",
    signOut: "Abmelden",
    platformHome: "Zur Plattform",
    overviewTitle: "Verhalten auf einen Blick",
    metrics: {
      participants: "Teilnehmende", participantsNote: (n) => `${n} mit Aktivität`,
      activeCampaigns: "Aktive Kampagnen", activeCampaignsNote: (n) => `${n} insgesamt`,
      participation: "Beteiligung", participationNote: "Teilnehmende mit erfassten Entscheidungen",
      pause: "Pause Adoption", pauseNote: "Innehalten bzw. Nachfragen, bevor es weitergeht", pauseNoteShort: "sicheres Innehalten bzw. Nachfragen",
      verify: "Verification Rate", verifyNote: "unabhängiges Überprüfen", verifyNoteShort: "unabhängiges Überprüfen",
      impulse: "Impulse Rate", impulseNote: "sofortiges Handeln trotz höheren Risikos",
      prePost: "Vorher/Nachher", prePostNote: "Veränderung bei Pause Adoption", prePostShort: "Vorher/Nachher",
      baselineLater: (a, b) => `Ausgangsmessung ${a} → später ${b}`,
    },
    hackTitle: "H.A.C.K.-Profil", hackEyebrow: "WIDERSTANDSFÄHIGKEIT GEGEN DRUCK",
    hack: { H: "Hetze", A: "Autorität", C: "Vertrautheit", K: "Notbremse" },
    attentionTitle: "Kohorten mit Handlungsbedarf", attentionEyebrow: "ALS NÄCHSTES",
    attentionLine: (p, v, i) => `Pause ${p} · Prüfen ${v} · Impuls ${i}`,
    attentionEmpty: "Keine Kohorte hat genug auffällige Daten, um sie hervorzuheben.",
    recentTitle: "Letzte Kampagnen", practiceEyebrow: "TRAINING",
    th: { campaign: "Kampagne", cohort: "Kohorte", designation: "Art", status: "Status", responses: "Antworten", participant: "Teilnehmende Person", department: "Abteilung", practice: "Training", manage: "Verwalten", type: "Art", control: "Steuerung", pause: "Pause", verify: "Prüfen", impulse: "Impuls" },
    allParticipants: "Alle Teilnehmenden", all: "Alle",
    people: {
      createCohortTitle: "Kohorte anlegen", cohortsEyebrow: "KOHORTEN", cohortName: "Name der Kohorte (z. B. Klasse 8b)", department: "Abteilung", country: "Land", role: "Rolle / Zielgruppe", createCohort: "Kohorte anlegen",
      inviteTitle: "Person einladen", peopleEyebrow: "PERSONEN", firstName: "Vorname", lastName: "Nachname", workEmail: "Dienstliche E-Mail-Adresse", cohortLabel: "Kohorte", unassigned: "Keine Zuordnung", roleSingle: "Rolle", addParticipant: "Person hinzufügen",
      classTitle: "Klasse anlegen (ohne Namen)", classEyebrow: "SCHÜLERINNEN UND SCHÜLER UNTER 18",
      classNote: "Erstellt nummerierte Aliasse wie „Lernende 01“. Es werden weder Namen noch E-Mail-Adressen eingegeben oder gespeichert. Die Zuordnung der Aliasse zu den Lernenden behaltet ihr selbst, und jede Schülerin und jeder Schüler bekommt den persönlichen Link des eigenen Alias. Ladet die Linkliste herunter, um sie auszudrucken oder zu verschicken.",
      classCohort: "Kohorte der Klasse", selectCohort: "Kohorte auswählen …", prefix: "Präfix für die Aliasse", prefixDefault: "Lernende", count: "Anzahl der Lernenden (1–60)", createAliases: "Aliasse erstellen",
      csvLinks: "Trainingslinks herunterladen (CSV, englisch) ↗", csvLinksDe: "Trainingslinks auf Deutsch (CSV) ↗",
      participantsTitle: "Teilnehmende", records: (n) => `${n} EINTRÄGE`,
      alias: "Alias, keine persönlichen Daten", openLink: "Link öffnen ↗", enable: "Aktivieren", disable: "Deaktivieren", deleteData: "Daten löschen",
      cohortsTitle: "Kohorten", segmentation: "AUFTEILUNG", participantsN: (n) => (n === 1 ? "1 Person" : `${n} Personen`), noFilters: "Keine Filter",
    },
    practice: {
      createTitle: "Kampagne anlegen / zuweisen", createEyebrow: "TRAINING", campaignName: "Name der Kampagne", allParticipantsOpt: "Alle Teilnehmenden", designation: "Art", statusLabel: "Status",
      schedule: "Zeitplan", roleFocus: "Rollenfokus", hackFocus: "H.A.C.K.-Schwerpunkt", balanced: "Ausgewogen", criticalAction: "Notbremse", library: "Szenario-Bibliothek – 3 bis 8 auswählen", createCampaign: "Kampagne anlegen",
      rulesTitle: "Regeln für den Kampagnenaufbau", rulesEyebrow: "AUSGANGSMESSUNG → TRAINING → ABSCHLUSSMESSUNG",
      rules: [["Die Ausgangsmessung", "erfasst das Verhalten vor dem gezielten Training."], ["Das Training", "bietet wiederholte, kurze Entscheidungsübungen."], ["Die Abschlussmessung", "wird getrennt gespeichert und liefert den Vorher/Nachher-Vergleich."]],
      rulesLast: "Jede Kennzahl wird aus erfassten Szenario-Entscheidungen berechnet – nicht allein aus dem Abschluss.",
      campaignsTitle: "Kampagnen", liveOps: "LAUFENDER BETRIEB", general: "Allgemein", save: "Speichern",
    },
    designations: { BASELINE: "Ausgangsmessung", PRACTICE: "Training", FOLLOWUP: "Abschlussmessung" },
    statuses: {
      DRAFT: "Entwurf", SCHEDULED: "Geplant", ACTIVE: "Aktiv", PAUSED: "Pausiert", COMPLETED: "Abgeschlossen",
      INVITED: "Eingeladen", DISABLED: "Deaktiviert", STARTED: "Begonnen",
    },
    measure: {
      hackBreakdown: "H.A.C.K.-Aufschlüsselung", trigger: "REAKTION AUF AUSLÖSER", definitions: "Definition der Kennzahlen", transparent: "TRANSPARENT AUFGEBAUT",
      defs: [
        ["Pause Adoption", "– anwendbare Antworten, die die riskante Handlungskette unterbrechen, sicher hinterfragen oder verlangsamen."],
        ["Verification Rate", "– Antworten, die die Anfrage oder den Absender unabhängig überprüfen."],
        ["Impulse Rate", "– sofortiges Handeln trotz höheren Risikos."],
      ],
      defsNote: "Das sind definierte operative CoMaSy-Kennzahlen, keine validierten psychologischen Konstrukte.",
      cohortComparison: "Kohortenvergleich", whereFocus: "WORAUF ES ANKOMMT", cohortCol: "Kohorte",
    },
    reports: {
      items: {
        executive: ["Management-Bericht", "Beteiligung, Verhaltensentwicklung, H.A.C.K.-Profil und Schwerpunkte."],
        awareness: ["Bericht Sicherheitsbewusstsein", "Kampagnenaktivität, Verhaltensindikatoren und Kohortenvergleich."],
        compliance: ["Nachweisbericht Compliance / NIS2", "Dokumentierte Programmaktivität und Wirksamkeitsnachweise, mit ausdrücklichem Hinweis, dass dies keine Konformitätsbestätigung ist."],
      },
      report: "BERICHT", pdf: "PDF-Export", csv: "CSV-Export", periodsTitle: "Berichtszeiträume", evidence: "NACHWEISE",
      periodsCopy: "Die Exporte umfassen derzeit alle erfassten Aktivitäten der Organisation. Die Auswahl eines Zeitraums folgt als nächster Filter, sobald genug Verlauf vorliegt, damit sie aussagekräftig ist.",
      insights: "Verhalten im Zeitverlauf →",
    },
    settings: {
      orgTitle: "Organisation", workspace: "ARBEITSBEREICH", organisation: "Organisation", country: "Land", industry: "Branche", nis2: "NIS2-Relevanz", nis2Yes: "Zur Prüfung vorgemerkt", nis2No: "Nicht vorgemerkt",
      wsTitle: "Einstellungen des Arbeitsbereichs", privacy: "DATENSCHUTZ UND DARSTELLUNG", displayName: "Anzeigename des Arbeitsbereichs", retention: "Aufbewahrungsdauer (Tage)", saveSettings: "Einstellungen speichern",
      retentionNote: "Die Aufbewahrungsdauer ist als Richtlinie der Organisation hinterlegt. Eine automatische Löschung sagen wir erst zu, wenn der geplante Löschdienst im Einsatz ist.",
      permsTitle: "Berechtigungen und Integrationen", status: "STATUS",
      perms: [
        ["Trennung der Organisationen", "Aktiv – signierte Mandanten-Sitzung und serverseitige Filter pro Organisation"],
        ["Administratorinnen und Administratoren", "Zugangscode für den Arbeitsbereich aktiv"],
        ["SSO", "Wird nicht beworben – nicht umgesetzt"],
        ["Externe Integrationen", "Werden nicht beworben – bisher keine Kunden-Integration aktiviert"],
      ],
    },
    langSwitch: "English",
  },
};
