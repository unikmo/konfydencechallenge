import { NextResponse } from "next/server";

function pdfText(text: string) {
  return text.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function buildPdf(): Buffer {
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
  text(34, 716, 17, "Emergency Scam Protocol", false, [1, 1, 1]);

  text(42, 650, 15, "IF IT FEELS URGENT, EMOTIONAL, OR THREATENING", true, [0.08, 0.25, 0.42]);
  text(42, 624, 22, "STOP IMMEDIATELY", true, [0.04, 0.63, 0.70]);
  text(42, 601, 11, "Do not reply. Do not click. Do not send money.");
  commands.push("0.75 G 0.7 w 42 584 m 570 584 l S");

  text(42, 548, 18, "STEP 1", true, [0.08, 0.25, 0.42]);
  text(178, 548, 18, "PAUSE", true, [0.08, 0.25, 0.42]);
  text(178, 529, 10, "- Wait 5 - 10 minutes");
  text(178, 514, 10, "- No exceptions");
  commands.push("0.85 G 0.6 w 42 497 m 570 497 l S");

  text(42, 462, 18, "STEP 2", true, [0.08, 0.25, 0.42]);
  text(178, 462, 18, "VERIFY", true, [0.08, 0.25, 0.42]);
  text(178, 443, 10, "- Never use links or numbers from the message");
  text(178, 428, 10, "- Find official contact yourself");
  commands.push("0.85 G 0.6 w 42 411 m 570 411 l S");

  text(42, 376, 18, "STEP 3", true, [0.08, 0.25, 0.42]);
  text(178, 376, 17, "CALL SOMEONE YOU TRUST", true, [0.08, 0.25, 0.42]);
  text(178, 357, 10, "- Talk before acting");
  text(178, 342, 10, "- Or contact your bank directly");

  rect(42, 214, 528, 92, 0.97, 0.97, 0.96);
  commands.push("0.08 0.25 0.42 RG 1 w 42 214 528 92 re S");
  text(188, 285, 11, "NEVER DO THIS UNDER PRESSURE", true, [0.07, 0.08, 0.09]);
  text(57, 260, 9, "SEND MONEY", true);
  text(157, 260, 9, "BUY GIFT CARDS", true);
  text(285, 260, 9, "TRANSFER CRYPTO", true);
  text(415, 260, 9, "SHARE PASSWORDS", true);
  text(75, 236, 9, "RESPOND TO 'ACCOUNT LOCKED' THREATS", true);

  rect(42, 82, 528, 102, 0.08, 0.25, 0.42);
  text(62, 142, 18, "CORE RULE", true, [1, 1, 1]);
  text(220, 142, 20, "PAUSE  ->  VERIFY  ->  CALL", false, [1, 1, 1]);
  text(42, 48, 9, "Konfydence household emergency resource", false, [0.35, 0.35, 0.35]);

  const stream = commands.join("\n") + "\n";
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>",
    `<< /Length ${Buffer.byteLength(stream, "utf8")} >>\nstream\n${stream}endstream`,
  ];

  let pdf = "%PDF-1.4\n%Konfydence\n";
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets[index + 1] = Buffer.byteLength(pdf, "utf8");
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xrefOffset = Buffer.byteLength(pdf, "utf8");
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (let i = 1; i <= objects.length; i += 1) {
    pdf += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  return Buffer.from(pdf, "utf8");
}

export async function GET() {
  const pdf = buildPdf();
  return new NextResponse(pdf, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="Konfydence-Emergency-Scam-Protocol.pdf"',
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
