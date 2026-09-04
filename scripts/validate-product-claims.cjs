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
  { label: "obsolete 50-scenario claim", test: (text) => /\b50\s+(?:real[- ]life\s+)?scenarios?\b/i.test(text) },
  { label: "obsolete H.A.C.K. Connection label", test: (text) => /(<b>Connection<\/b>|\[\s*["']C["']\s*,\s*["']Connection["']|internal:\s*["']Connection["']|public:\s*["']Connection["']|short:\s*["']Connection["'])/i.test(text) },
  { label: "old four-answer gameplay claim", test: (text) => /four\s+(?:answer|choice|move)s?/i.test(text) },
  { label: "incorrect full-run count", test: (text) => /full\s+(?:challenge|run)[\s\S]{0,120}\b(?:40|50)\s+(?:questions?|decisions?|scenarios?)\b/i.test(text) },
  // Round size is game design and must stay out of product copy. The public
  // number is "40+ scenarios" per edition — never the per-round count.
  { label: "per-round count leaked into copy", copyOnly: true, test: (text) => /\b(?:12|16|24)[- ](?:scored\s+)?(?:scenario|decision|question|card)s?\b/i.test(text) || /\b(?:12|16|24)\s+(?:balanced|scored)\s+(?:scenario|decision)s?\b/i.test(text) },
  { label: "obsolete scenario-bank phrasing", copyOnly: true, test: (text) => /\b40[- ]scenario\s+bank\b/i.test(text) },
];

for (const file of files) {
  const text = fs.readFileSync(file, "utf8");
  // `copyOnly` rules scan user-facing surfaces (.tsx / .md), not logic or comments.
  const isCopySurface = /\.(tsx|md)$/.test(file);
  for (const rule of rules) {
    if (rule.copyOnly && !isCopySurface) continue;
    if (rule.test(text)) findings.push(`${path.relative(process.cwd(), file)}: ${rule.label}`);
  }
}

const challenge = fs.readFileSync(path.join(process.cwd(), "app", "challenge", "page.tsx"), "utf8");
for (const required of ["40+", "Hurry", "Authority", "Comfort", "Kill-Switch"]) {
  if (!challenge.includes(required)) findings.push(`app/challenge/page.tsx: missing canonical claim '${required}'`);
}

const homepage = fs.readFileSync(path.join(process.cwd(), "app", "page.tsx"), "utf8");
if (!/\[\s*["']03["']\s*,\s*["']Comfort["']/.test(homepage)) findings.push("app/page.tsx: homepage H.A.C.K. band must expose Comfort");
if (homepage.includes("<b>Connection</b>")) findings.push("app/page.tsx: homepage still exposes Connection");

const method = fs.readFileSync(path.join(process.cwd(), "app", "hack-method", "page.tsx"), "utf8");
for (const required of ["Hurry", "Authority", "Comfort", "Kill-Switch"]) {
  if (!method.includes(required)) findings.push(`app/hack-method/page.tsx: missing canonical framework term '${required}'`);
}

if (findings.length) {
  console.error(`Product claim gate failed with ${findings.length} finding(s):`);
  findings.forEach((finding) => console.error(`- ${finding}`));
  process.exit(1);
}
console.log("PASS — public product claims lead with '40+ scenarios', keep round size internal, and match the canonical H.A.C.K. framework.");
