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

export function makeComasyCsv(orgName: string, metrics: Metrics, reportType: string) {
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

function pdfEscape(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)").replace(/[^\x20-\x7E]/g, "-");
}

export function makeComasyPdf(orgName: string, metrics: Metrics, reportType: string) {
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

  let y = 790;
  const commands: string[] = ["BT", "/F1 18 Tf", `50 ${y} Td`, `(${pdfEscape(lines[0])}) Tj`, "/F1 10 Tf"];
  y -= 28;
  for (const line of lines.slice(1)) {
    commands.push(`0 -16 Td (${pdfEscape(line)}) Tj`);
  }
  commands.push("ET");
  const stream = commands.join("\n");
  const objects = [
    "1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj",
    "2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj",
    "3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 842] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >> endobj",
    `4 0 obj << /Length ${Buffer.byteLength(stream, "ascii")} >> stream\n${stream}\nendstream endobj`,
    "5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj",
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
