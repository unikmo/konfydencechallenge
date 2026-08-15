const fs = require("fs");
const path = require("path");

const ROOTS = ["app", "components", "lib"];
const EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx", ".md"]);
const findings = [];

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return EXTENSIONS.has(path.extname(entry.name)) ? [full] : [];
  });
}

const files = ROOTS.flatMap((root) => walk(path.join(process.cwd(), root)));
const rules = [
  {
    label: "obsolete 50-scenario claim",
    test: (text) => /\b50\s+(?:real[- ]life\s+)?scenarios?\b/i.test(text),
  },
  {
    label: "obsolete H.A.C.K. Connection label",
    test: (text) => /\bH\.A\.C\.K\.[\s\S]{0,400}\bConnection\b/i.test(text) || /internal:\s*["']Connection["']/i.test(text),
  },
  {
    label: "old four-answer gameplay claim",
    test: (text) => /four\s+(?:answer|choice|move)s?/i.test(text),
  },
];

for (const file of files) {
  const text = fs.readFileSync(file, "utf8");
  for (const rule of rules) {
    if (rule.test(text)) findings.push(`${path.relative(process.cwd(), file)}: ${rule.label}`);
  }
}

// Canonical commercial/runtime claims must remain explicit in the product surface.
const challenge = fs.readFileSync(path.join(process.cwd(), "app", "challenge", "page.tsx"), "utf8");
for (const required of ["8 scenarios", "40-scenario bank", "Hurry", "Authority", "Comfort", "Kill-Switch"]) {
  if (!challenge.includes(required)) findings.push(`app/challenge/page.tsx: missing canonical claim '${required}'`);
}

if (findings.length) {
  console.error(`Product claim gate failed with ${findings.length} finding(s):`);
  findings.forEach((finding) => console.error(`- ${finding}`));
  process.exit(1);
}

console.log("PASS — public product claims match the live 8/24/40 H.A.C.K. model.");
