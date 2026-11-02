"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..", "data", "scenarios-de");
const overrides = JSON.parse(fs.readFileSync(path.join(root, "editorial-overrides.json"), "utf8"));
const editions = ["family", "school", "university", "travelsafe", "workplace"];
const triggers = ["H", "A", "C", "K"];
const fields = ["title", "scenario", "answers", "explanation", "proTip"];
const errors = [];
const seen = new Set();
let count = 0;

function fail(id, message) {
  errors.push(id + ": " + message);
}
function nonblank(value) {
  return typeof value === "string" && value.trim().length > 0;
}

for (const edition of editions) {
  const dir = path.join(root, edition);
  const paths = fs.readdirSync(dir).filter((name) => name.endsWith(".json"));
  const cards = paths.map((name) => JSON.parse(fs.readFileSync(path.join(dir, name), "utf8")));
  const scored = cards.filter((card) => card.scored === true);
  const wild = cards.filter((card) => card.cardType === "wild" && card.scored === false);
  if (cards.length !== 50 || scored.length !== 48 || wild.length !== 2) {
    fail(edition, "expected exactly 48 scored and 2 wild cards, got " + scored.length + " + " + wild.length);
  }
  for (const trigger of triggers) {
    if (scored.filter((card) => card.hackKey === trigger).length !== 12) {
      fail(edition, "expected 12 scored cards for trigger " + trigger);
    }
  }
  for (const card of cards) {
    count++;
    const id = card.id || path.basename(dir);
    if (seen.has(id)) fail(id, "duplicate ID");
    seen.add(id);
    if (card.lang !== "de" || card.edition !== edition) fail(id, "incorrect language/edition");
    for (const field of ["title", "scenario", "explanation", "proTip"]) {
      if (!nonblank(card[field])) fail(id, "missing " + field);
    }
    const keys = Object.keys(card.answers || {});
    if (keys.length < 3) fail(id, "too few answers");
    for (const key of keys) {
      if (!nonblank(card.answers[key])) fail(id, "blank answer " + key);
      if (!Number.isFinite(card.scores?.[key])) fail(id, "missing numerical score for " + key);
    }
    if (!Array.isArray(card.safeActions) || !card.safeActions.length) fail(id, "no safe answer");
    for (const safe of card.safeActions || []) {
      if (!keys.includes(safe)) fail(id, "invalid safe answer " + safe);
    }
    // The reviewed card JSON and its regeneration override must agree.
    const override = overrides[id];
    if (card.cardType === "wild" && !override) fail(id, "missing bonus-card editorial override");
    if (override) {
      for (const field of fields) {
        if (JSON.stringify(card[field]) !== JSON.stringify(override[field])) {
          fail(id, "regeneration override differs for " + field);
        }
      }
    }
  }
}
if (errors.length) {
  console.error("German scenario QA failed (" + errors.length + "):");
  for (const issue of errors.slice(0, 70)) console.error(" - " + issue);
  process.exit(1);
}
console.log("German scenario QA passed: " + count + " cards, 5 editions, scoring metadata preserved, override text synchronized.");
