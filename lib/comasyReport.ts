type Metrics = {
  participantCount: number;
  activeCampaigns: number;
  participationRate: number;
  pauseAdoption: number;
  verificationRate: number;
  impulseRate: number;
  prePostChange: number | null;
  hackProfile: Record<"H" | "A" | "C" | "K", number>;
  cohorts: Array<{ name: string; pauseAdoption: number; verificationRate: number; impulseRate: number; responses: number }>;
};

export type ReportLang = "en" | "de";

export const REPORT_TYPE_DE: Record<string, string> = { executive: "Management", awareness: "Sicherheitsbewusstsein", compliance: "Compliance / NIS2" };

function makeComasyCsvDe(orgName: string, metrics: Metrics, reportType: string) {
  const n = (v: number) => String(v).replace(".", ",");
  const rows: Array<Array<string | number>> = [
    ["CoMaSy-Bericht", reportType],
    ["Organisation", orgName],
    ["Teilnehmende", metrics.participantCount],
    ["Aktive Kampagnen", metrics.activeCampaigns],
    ["Beteiligung %", n(metrics.participationRate)],
    ["Pause Adoption %", n(metrics.pauseAdoption)],
    ["Verification Rate %", n(metrics.verificationRate)],
    ["Impulse Rate %", n(metrics.impulseRate)],
    ["Vorher/Nachher-Veränderung (Punkte)", metrics.prePostChange == null ? "k. A." : n(metrics.prePostChange)],
    ["Hetze-Resilienz %", n(metrics.hackProfile.H)],
    ["Autoritäts-Resilienz %", n(metrics.hackProfile.A)],
    ["Vertrautheits-Resilienz %", n(metrics.hackProfile.C)],
    ["Notbremse-Resilienz %", n(metrics.hackProfile.K)],
    [],
    ["Kohorte", "Antworten", "Pause Adoption %", "Verification Rate %", "Impulse Rate %"],
    ...metrics.cohorts.map((c) => [c.name, c.responses, n(c.pauseAdoption), n(c.verificationRate), n(c.impulseRate)]),
  ];
  const escape = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
  // Semicolon separator + BOM: what German Excel expects for a double-click open with umlauts intact.
  return "\uFEFF" + rows.map((row) => row.map(escape).join(";")).join("\r\n");
}

export function makeComasyCsv(orgName: string, metrics: Metrics, reportType: string, lang: ReportLang = "en") {
  if (lang === "de") return makeComasyCsvDe(orgName, metrics, reportType);
  const rows: Array<Array<string | number>> = [
    ["CoMaSy report", reportType],
    ["Organisation", orgName],
    ["Participants", metrics.participantCount],
    ["Active campaigns", metrics.activeCampaigns],
    ["Participation %", metrics.participationRate],
    ["Pause Adoption %", metrics.pauseAdoption],
    ["Verification Rate %", metrics.verificationRate],
    ["Impulse Rate %", metrics.impulseRate],
    ["Pre/post change (pts)", metrics.prePostChange ?? "n/a"],
    ["Hurry resilience %", metrics.hackProfile.H],
    ["Authority resilience %", metrics.hackProfile.A],
    ["Comfort resilience %", metrics.hackProfile.C],
    ["Critical Action resilience %", metrics.hackProfile.K],
    [],
    ["Cohort", "Responses", "Pause Adoption %", "Verification Rate %", "Impulse Rate %"],
    ...metrics.cohorts.map((c) => [c.name, c.responses, c.pauseAdoption, c.verificationRate, c.impulseRate]),
  ];
  const escape = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
  return rows.map((row) => row.map(escape).join(",")).join("\n");
}

function pdfEscape(value: string, winAnsi = false) {
  const escaped = value.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
  // German reports keep umlauts and ß: Latin-1 characters are written as octal escapes (WinAnsiEncoding).
  if (winAnsi) return escaped.replace(/[^\x20-\x7E]/g, (ch) => (ch.charCodeAt(0) >= 0xa0 && ch.charCodeAt(0) <= 0xff ? "\\" + ch.charCodeAt(0).toString(8).padStart(3, "0") : "-"));
  return escaped.replace(/[^\x20-\x7E]/g, "-");
}

function pdfLinesDe(orgName: string, metrics: Metrics, reportType: string): string[] {
  const n = (v: number) => String(v).replace(".", ",");
  const title =
    reportType === "compliance" ? "CoMaSy Nachweisbericht Compliance / NIS2" : reportType === "awareness" ? "CoMaSy Bericht Sicherheitsbewusstsein" : "CoMaSy Management-Bericht zum Verhalten";
  return [
    title,
    `Organisation: ${orgName}`,
    `Erstellt am: ${new Date().toLocaleDateString("de-DE")}`,
    "",
    `Teilnehmende: ${metrics.participantCount}`,
    `Aktive Kampagnen: ${metrics.activeCampaigns}`,
    `Beteiligung: ${n(metrics.participationRate)} %`,
    `Pause Adoption: ${n(metrics.pauseAdoption)} %`,
    `Verification Rate: ${n(metrics.verificationRate)} %`,
    `Impulse Rate: ${n(metrics.impulseRate)} %`,
    `Vorher/Nachher-Veränderung: ${metrics.prePostChange == null ? "k. A." : `${n(metrics.prePostChange)} Punkte`}`,
    "",
    `Hetze: ${n(metrics.hackProfile.H)} %`,
    `Autorität: ${n(metrics.hackProfile.A)} %`,
    `Vertrautheit: ${n(metrics.hackProfile.C)} %`,
    `Notbremse: ${n(metrics.hackProfile.K)} %`,
    "",
    "Hinweis zu den Kennzahlen: CoMaSy-Kennzahlen sind operative Indikatoren, die aus Szenario-Entscheidungen abgeleitet werden.",
    "Sie werden nicht als validierte psychologische Konstrukte dargestellt.",
    ...(reportType === "compliance" ? ["CoMaSy kann Nachweise zu Sensibilisierung und Wirksamkeit unterstützen; die Nutzung allein begründet keine NIS2-Konformität."] : []),
  ];
}

export function makeComasyPdf(orgName: string, metrics: Metrics, reportType: string, lang: ReportLang = "en") {
  const title = reportType === "compliance" ? "CoMaSy Compliance / NIS2 Evidence Report" : reportType === "awareness" ? "CoMaSy Security Awareness Report" : "CoMaSy Executive Behaviour Report";
  const lines = [
    title,
    `Organisation: ${orgName}`,
    `Generated: ${new Date().toISOString().slice(0, 10)}`,
    "",
    `Participants: ${metrics.participantCount}`,
    `Active campaigns: ${metrics.activeCampaigns}`,
    `Participation: ${metrics.participationRate}%`,
    `Pause Adoption: ${metrics.pauseAdoption}%`,
    `Verification Rate: ${metrics.verificationRate}%`,
    `Impulse Rate: ${metrics.impulseRate}%`,
    `Pre/post change: ${metrics.prePostChange == null ? "n/a" : `${metrics.prePostChange} pts`}`,
    "",
    `Hurry: ${metrics.hackProfile.H}%`,
    `Authority: ${metrics.hackProfile.A}%`,
    `Comfort: ${metrics.hackProfile.C}%`,
    `Critical Action: ${metrics.hackProfile.K}%`,
    "",
    "Metric note: CoMaSy metrics are operational indicators derived from scenario decisions.",
    "They are not presented as validated psychological constructs.",
    ...(reportType === "compliance" ? ["CoMaSy can support awareness/effectiveness evidence; use does not by itself establish NIS2 compliance."] : []),
  ];
  const de = lang === "de";
  const textLines = de ? pdfLinesDe(orgName, metrics, reportType) : lines;

  let y = 790;
  const commands: string[] = ["BT", "/F1 18 Tf", `50 ${y} Td`, `(${pdfEscape(textLines[0], de)}) Tj`, "/F1 10 Tf"];
  y -= 28;
  for (const line of textLines.slice(1)) {
    commands.push(`0 -16 Td (${pdfEscape(line, de)}) Tj`);
  }
  commands.push("ET");
  const stream = commands.join("\n");
  const objects = [
    "1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj",
    "2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj",
    "3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 842] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >> endobj",
    `4 0 obj << /Length ${Buffer.byteLength(stream, "ascii")} >> stream\n${stream}\nendstream endobj`,
    `5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica${de ? " /Encoding /WinAnsiEncoding" : ""} >> endobj`,
  ];
  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  for (const obj of objects) {
    offsets.push(Buffer.byteLength(pdf, "ascii"));
    pdf += `${obj}\n`;
  }
  const xref = Buffer.byteLength(pdf, "ascii");
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (let i = 1; i <= objects.length; i++) pdf += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  pdf += `trailer << /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return Buffer.from(pdf, "ascii");
}
