// Renders public/resources/konfydence-emergency-scam-protocol.svg into a
// single-page A4 PDF committed at the same basename. The SVG is the canonical
// artwork for the free Emergency Scam Protocol; this makes it a one-click
// download with no Google Drive dependency.
//
// Run: node scripts/build-protocol-pdf.cjs
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");
const sharp = require("sharp");

const SRC = path.join(__dirname, "..", "public", "resources", "konfydence-emergency-scam-protocol.svg");
const OUT = path.join(__dirname, "..", "public", "resources", "konfydence-emergency-scam-protocol.pdf");

// A4 in PostScript points (72pt/in): 210mm x 297mm.
const PAGE_W = 595.28;
const PAGE_H = 841.89;
// Raster at ~300 DPI for crisp print.
const RASTER_W = 2480;
const RASTER_H = 3508;

async function main() {
  const svg = fs.readFileSync(SRC);
  // Lossless: raw RGB pixels -> zlib deflate -> PDF FlateDecode. A near-flat
  // document like this compresses far smaller than JPEG and stays crisp.
  const { data: rgb } = await sharp(svg, { density: 300 })
    .resize(RASTER_W, RASTER_H, { fit: "fill" })
    .flatten({ background: "#f7f4ee" })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const imageData = zlib.deflateSync(rgb, { level: 9 });

  const objs = [];
  const catalogNum = 1;
  const pagesNum = 2;
  const pageNum = 3;
  const contentNum = 4;
  const imageNum = 5;

  objs[catalogNum - 1] = `<< /Type /Catalog /Pages ${pagesNum} 0 R >>`;
  objs[pagesNum - 1] = `<< /Type /Pages /Kids [${pageNum} 0 R] /Count 1 >>`;
  objs[pageNum - 1] =
    `<< /Type /Page /Parent ${pagesNum} 0 R /MediaBox [0 0 ${PAGE_W} ${PAGE_H}] ` +
    `/Resources << /XObject << /Im0 ${imageNum} 0 R >> >> /Contents ${contentNum} 0 R >>`;

  const content = `q\n${PAGE_W} 0 0 ${PAGE_H} 0 0 cm\n/Im0 Do\nQ\n`;
  objs[contentNum - 1] = { stream: Buffer.from(content, "latin1"), dict: "<< /Length __LEN__ >>" };
  objs[imageNum - 1] = {
    stream: imageData,
    dict:
      `<< /Type /XObject /Subtype /Image /Width ${RASTER_W} /Height ${RASTER_H} ` +
      `/ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /FlateDecode /Length __LEN__ >>`,
  };

  const chunks = [];
  let offset = 0;
  const push = (buf) => {
    const b = Buffer.isBuffer(buf) ? buf : Buffer.from(buf, "latin1");
    chunks.push(b);
    offset += b.length;
  };

  push("%PDF-1.4\n%\xE2\xE3\xCF\xD3\n");
  const xref = [0];
  objs.forEach((obj, i) => {
    xref[i + 1] = offset;
    if (typeof obj === "string") {
      push(`${i + 1} 0 obj\n${obj}\nendobj\n`);
    } else {
      const dict = obj.dict.replace("__LEN__", String(obj.stream.length));
      push(`${i + 1} 0 obj\n${dict}\nstream\n`);
      push(obj.stream);
      push("\nendstream\nendobj\n");
    }
  });

  const xrefStart = offset;
  const n = objs.length + 1;
  let table = `xref\n0 ${n}\n0000000000 65535 f \n`;
  for (let i = 1; i < n; i += 1) {
    table += `${String(xref[i]).padStart(10, "0")} 00000 n \n`;
  }
  push(table);
  push(`trailer\n<< /Size ${n} /Root ${catalogNum} 0 R >>\nstartxref\n${xrefStart}\n%%EOF`);

  fs.writeFileSync(OUT, Buffer.concat(chunks));
  console.log(`Wrote ${OUT} (${(fs.statSync(OUT).size / 1024).toFixed(0)} KB)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
