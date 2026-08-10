const fs = require("fs");
const path = require("path");
const editions = ["travelsafe", "family", "school", "university", "workplace"];
const dir = path.join(process.cwd(), "data", "scenarios");
const rows = [];

for (const edition of editions) {
  const cards = fs.readdirSync(dir)
    .filter((name) => name.endsWith(".json") && !name.includes("schema") && !name.includes("example"))
    .map((name) => JSON.parse(fs.readFileSync(path.join(dir, name), "utf8").replace(/^\uFEFF/, "")))
    .filter((card) => card.edition === edition && card.scored);
  const hack = Object.fromEntries(["H", "A", "C", "K"].map((key) => [key, cards.filter((card) => card.hackKey === key).length]));
  const diagnostic = cards.filter((card) => (card.tags || []).includes("diagnostic")).length;
  rows.push({ edition, bank: cards.length, H: hack.H, A: hack.A, C: hack.C, K: hack.K, diagnostic, fullRun: 24, options: 3 });
}
console.table(rows);
console.log("\nRun design: 8-card diagnostic (2 per H/A/C/K); 24-card full run (6 per H/A/C/K); unseen cards first.");
