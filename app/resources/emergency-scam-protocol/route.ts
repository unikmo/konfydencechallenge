import { NextResponse } from "next/server";

function pdfText(text: string) {
  return text.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

type Lang = "en" | "de";

const COPY = {
  en: {
    subtitle: "Emergency Scam Protocol",
    banner: "IF IT FEELS URGENT, EMOTIONAL, OR THREATENING",
    stop: "STOP IMMEDIATELY",
    stopSub: "Do not reply. Do not click. Do not send money.",
    step: "STEP",
    s1: "PAUSE",
    s1a: "- Wait 5 - 10 minutes",
    s1b: "- No exceptions",
    s2: "VERIFY",
    s2a: "- Never use links or numbers from the message",
    s2b: "- Find official contact yourself",
    s3: "CALL SOMEONE YOU TRUST",
    s3Size: 17,
    s3a: "- Talk before acting",
    s3b: "- Or contact your bank directly",
    never: "NEVER DO THIS UNDER PRESSURE",
    n: [["SEND MONEY", 57], ["BUY GIFT CARDS", 157], ["TRANSFER CRYPTO", 285], ["SHARE PASSWORDS", 415]] as Array<[string, number]>,
    n2: ["RESPOND TO 'ACCOUNT LOCKED' THREATS", 75] as [string, number],
    core: "CORE RULE",
    coreText: "PAUSE  ->  VERIFY  ->  CALL",
    coreX: 220,
    coreSize: 20,
    foot: "Konfydence household emergency resource",
    fileName: "Konfydence-Emergency-Scam-Protocol.pdf",
  },
  de: {
    subtitle: "Notfall-Protokoll bei Betrug",
    banner: "WENN ES DRINGEND, EMOTIONAL ODER BEDROHLICH WIRKT",
    stop: "SOFORT ANHALTEN",
    stopSub: "Nicht antworten. Nicht klicken. Kein Geld senden.",
    step: "SCHRITT",
    s1: "ANHALTEN",
    s1a: "- 5 bis 10 Minuten warten",
    s1b: "- Keine Ausnahmen",
    s2: "ABKLÄREN",
    s2a: "- Nie Links oder Nummern aus der Nachricht nutzen",
    s2b: "- Den offiziellen Kontakt selbst heraussuchen",
    s3: "VERTRAUTE PERSON ANRUFEN",
    s3Size: 16,
    s3a: "- Erst sprechen, dann handeln",
    s3b: "- Oder direkt die eigene Bank anrufen",
    never: "NIEMALS UNTER DRUCK",
    n: [["GELD SENDEN", 57], ["GUTSCHEINE KAUFEN", 150], ["KRYPTO ÜBERWEISEN", 285], ["PASSWÖRTER TEILEN", 415]] as Array<[string, number]>,
    n2: ["AUF 'KONTO GESPERRT'-DROHUNGEN ANTWORTEN", 60] as [string, number],
    core: "KERNREGEL",
    coreText: "ANHALTEN  ->  ABKLÄREN  ->  ANSPRECHEN",
    coreX: 165,
    coreSize: 17,
    foot: "Konfydence Notfall-Ressource für den Haushalt",
    fileName: "Konfydence-Notfall-Protokoll.pdf",
  },
} as const;

function buildPdf(lang: Lang): Buffer {
  const c = COPY[lang];
  const commands: string[] = [];
  const fill = (r: number, g: number, b: number) => commands.push(`${r} ${g} ${b} rg`);
  const rect = (x: number, y: number, w: number, h: number, r: number, g: number, b: number) => {
    fill(r, g, b);
    commands.push(`${x} ${y} ${w} ${h} re f`);
  };
  const text = (x: number, y: number, size: number, value: string, bold = false, color: [number, number, number] = [0.07, 0.08, 0.09]) => {
    fill(...color);
    commands.push(`BT /${bold ? "F2" : "F1"} ${size} Tf ${x} ${y} Td (${pdfText(value)}) Tj ET`);
  };

  rect(0, 690, 612, 102, 0.08, 0.25, 0.42);
  text(34, 748, 28, "KONFYDENCE", true, [1, 1, 1]);
  text(34, 716, 17, c.subtitle, false, [1, 1, 1]);

  text(42, 650, 15, c.banner, true, [0.08, 0.25, 0.42]);
  text(42, 624, 22, c.stop, true, [0.04, 0.63, 0.70]);
  text(42, 601, 11, c.stopSub);
  commands.push("0.75 G 0.7 w 42 584 m 570 584 l S");

  text(42, 548, 18, `${c.step} 1`, true, [0.08, 0.25, 0.42]);
  text(178, 548, 18, c.s1, true, [0.08, 0.25, 0.42]);
  text(178, 529, 10, c.s1a);
  text(178, 514, 10, c.s1b);
  commands.push("0.85 G 0.6 w 42 497 m 570 497 l S");

  text(42, 462, 18, `${c.step} 2`, true, [0.08, 0.25, 0.42]);
  text(178, 462, 18, c.s2, true, [0.08, 0.25, 0.42]);
  text(178, 443, 10, c.s2a);
  text(178, 428, 10, c.s2b);
  commands.push("0.85 G 0.6 w 42 411 m 570 411 l S");

  text(42, 376, 18, `${c.step} 3`, true, [0.08, 0.25, 0.42]);
  text(178, 376, c.s3Size, c.s3, true, [0.08, 0.25, 0.42]);
  text(178, 357, 10, c.s3a);
  text(178, 342, 10, c.s3b);

  rect(42, 214, 528, 92, 0.97, 0.97, 0.96);
  commands.push("0.08 0.25 0.42 RG 1 w 42 214 528 92 re S");
  text(188, 285, 11, c.never, true, [0.07, 0.08, 0.09]);
  for (const [label, x] of c.n) text(x, 260, 9, label, true);
  text(c.n2[1], 236, 9, c.n2[0], true);

  rect(42, 82, 528, 102, 0.08, 0.25, 0.42);
  text(62, 142, 18, c.core, true, [1, 1, 1]);
  text(c.coreX, 142, c.coreSize, c.coreText, false, [1, 1, 1]);
  text(42, 48, 9, c.foot, false, [0.35, 0.35, 0.35]);

  const stream = commands.join("\n") + "\n";
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>",
    `<< /Length ${Buffer.byteLength(stream, "latin1")} >>\nstream\n${stream}endstream`,
  ];

  let pdf = "%PDF-1.4\n%Konfydence\n";
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets[index + 1] = Buffer.byteLength(pdf, "latin1");
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xrefOffset = Buffer.byteLength(pdf, "latin1");
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (let i = 1; i <= objects.length; i += 1) {
    pdf += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  return Buffer.from(pdf, "latin1");
}

export async function GET(request: Request) {
  const lang: Lang = new URL(request.url).searchParams.get("lang") === "de" ? "de" : "en";
  const pdf = buildPdf(lang);
  return new NextResponse(new Uint8Array(pdf), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${COPY[lang].fileName}"`,
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
