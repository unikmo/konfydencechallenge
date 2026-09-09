// Build data/scenario-text.json — a map of externalId -> the clean text fields,
// straight from the UTF-8 source files. Used by the one-shot repair route
// (app/api/admin/repair-scenarios) to fix rows whose text was mangled at some
// earlier import. Re-run and commit if the source scenarios change.
//
//   node scripts/gen-scenario-text.cjs
const fs = require("fs");
const path = require("path");

const dir = path.join(__dirname, "..", "data", "scenarios");
const out = path.join(__dirname, "..", "data", "scenario-text.json");

const map = {};
for (const file of fs.readdirSync(dir)) {
  if (!file.endsWith(".json") || file.includes("schema") || file.includes("example")) continue;
  const s = JSON.parse(fs.readFileSync(path.join(dir, file), "utf8").replace(/^﻿/, ""));
  if (!s.id) continue;
  map[s.id] = {
    title: s.title ?? null,
    prompt: s.prompt ?? s.scenario ?? "",
    answersA: s.answers?.A ?? "",
    answersB: s.answers?.B ?? "",
    answersC: s.answers?.C ?? "",
    answersD: s.answers?.D ?? "",
    safeActions: Array.isArray(s.safeActions) ? s.safeActions.join(",") : null,
    explanation: s.explanation ?? null,
    proTip: s.proTip ?? null,
  };
}

fs.writeFileSync(out, JSON.stringify(map, null, 0));
console.log(`Wrote ${out} — ${Object.keys(map).length} scenarios`);
