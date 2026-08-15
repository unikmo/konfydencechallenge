const fs = require("fs");
const path = require("path");

const EDITIONS = ["travelsafe", "family", "school", "university", "workplace"];
const HACK = ["H", "A", "C", "K"];
const dir = path.join(process.cwd(), "data", "scenarios");
const files = fs.readdirSync(dir).filter((name) => name.endsWith(".json") && !name.includes("schema") && !name.includes("example"));
const scored = [];
const findings = [];
const seenIds = new Map();
const normalize = (value) => String(value || "").toLowerCase().replace(/[“”‘’]/g, "'").replace(/[^a-z0-9]+/g, " ").trim();

for (const file of files) {
  const scenario = JSON.parse(fs.readFileSync(path.join(dir, file), "utf8").replace(/^\uFEFF/, ""));
  if (!scenario.scored || !EDITIONS.includes(scenario.edition)) continue;
  scored.push({ file, scenario });

  const issues = [];
  const id = String(scenario.id || "").trim();
  const title = String(scenario.title || "").trim();
  const category = String(scenario.category || "").trim();
  const prompt = String(scenario.prompt || scenario.scenario || "").trim();
  const answerKeys = Object.entries(scenario.answers || {}).filter(([, value]) => String(value || "").trim()).map(([key]) => key);
  const scoreKeys = Object.keys(scenario.scores || {});
  const scores = answerKeys.map((key) => Number(scenario.scores?.[key]));
  const answers = answerKeys.map((key) => String(scenario.answers[key]).trim());
  const safeActions = Array.isArray(scenario.safeActions) ? scenario.safeActions.map(String) : [];

  if (!id) issues.push("missing scenario id");
  if (seenIds.has(id)) issues.push(`duplicate scenario id also used by ${seenIds.get(id)}`); else if (id) seenIds.set(id, file);
  if (title.length < 8 || title.length > 100) issues.push(`title must be 8-100 chars (got ${title.length})`);
  if (!category) issues.push("missing category");
  if (scenario.active !== true) issues.push("live source scenario must be active=true");
  if (answerKeys.join("") !== "ABC") issues.push(`playable answers must be exactly A/B/C (got ${answerKeys.join("/") || "none"})`);
  if (scoreKeys.some((key) => !["A", "B", "C"].includes(key))) issues.push("score map contains a fourth/non-playable option");
  if (scores.some((value) => !Number.isFinite(value) || value < 0 || value > 4)) issues.push("invalid 0-4 scoring");

  if (scores.length === 3) {
    const max = Math.max(...scores);
    const strongestIndexes = scores.map((value, index) => value === max ? index : -1).filter((index) => index >= 0);
    if (strongestIndexes.length !== 1) issues.push("must have one unique strongest answer");
    if (new Set(scores).size < 3) issues.push("three choices should have three distinct decision-quality scores");
    if (max !== 4) issues.push("strongest answer must score 4");
    if (strongestIndexes.length === 1) {
      const strongestKey = answerKeys[strongestIndexes[0]];
      if (!safeActions.includes(strongestKey)) issues.push(`safeActions must include strongest answer ${strongestKey}`);
    }
  }

  if (safeActions.some((key) => !["A", "B", "C"].includes(key))) issues.push("safeActions contains a non-playable answer");
  if (new Set(answers.map(normalize)).size !== answers.length) issues.push("duplicate or effectively duplicate answer text");
  if (prompt.length < 80) issues.push(`scenario context too thin (${prompt.length} chars)`);
  if (prompt.length > 520) issues.push(`scenario too long (${prompt.length} chars)`);
  if (answers.some((answer) => answer.length < 24)) issues.push("answer option too thin");
  if (answers.some((answer) => answer.length > 210)) issues.push("answer option too long");
  if (!HACK.includes(scenario.hackKey)) issues.push("missing/invalid H/A/C/K pressure-pattern key");
  if (scenario.hackKey === "C" && scenario.hackTrigger !== "Comfort") issues.push(`C pressure-pattern source must say Comfort (got ${scenario.hackTrigger || "missing"})`);
  if (!scenario.explanation || String(scenario.explanation).trim().length < 50) issues.push("weak/missing explanation");
  if (!scenario.proTip || String(scenario.proTip).trim().length < 20) issues.push("weak/missing decision rule");
  if (!Array.isArray(scenario.tags) || scenario.tags.length < 3) issues.push("scenario needs at least three discovery/coverage tags");
  if (issues.length) findings.push({ file, id, issues });
}

for (const edition of EDITIONS) {
  const cards = scored.filter((item) => item.scenario.edition === edition);
  if (cards.length !== 40) findings.push({ id: edition, file: "deck", issues: [`expected 40 active source cards, found ${cards.length}`] });

  const prompts = new Map();
  const titles = new Map();
  for (const item of cards) {
    const p = normalize(item.scenario.prompt || item.scenario.scenario);
    const t = normalize(item.scenario.title);
    if (p && prompts.has(p)) findings.push({ id: item.scenario.id, file: item.file, issues: [`duplicate scenario context with ${prompts.get(p)}`] }); else if (p) prompts.set(p, item.scenario.id);
    if (t && titles.has(t)) findings.push({ id: item.scenario.id, file: item.file, issues: [`duplicate scenario title with ${titles.get(t)}`] }); else if (t) titles.set(t, item.scenario.id);
  }

  const hackCounts = Object.fromEntries(HACK.map((key) => [key, cards.filter((item) => item.scenario.hackKey === key).length]));
  for (const key of HACK) if (hackCounts[key] !== 10) findings.push({ id: edition, file: "deck", issues: [`${key} pressure pattern expected 10, found ${hackCounts[key]}`] });

  const diagnostic = cards.filter((item) => (item.scenario.tags || []).map(String).includes("diagnostic"));
  if (diagnostic.length !== 8) findings.push({ id: edition, file: "deck", issues: [`expected 8 curated diagnostic cards, found ${diagnostic.length}`] });
  for (const key of HACK) {
    const count = diagnostic.filter((item) => item.scenario.hackKey === key).length;
    if (count !== 2) findings.push({ id: edition, file: "deck", issues: [`diagnostic ${key} expected 2, found ${count}`] });
  }

  const bestPositions = { A: 0, B: 0, C: 0 };
  for (const item of cards) {
    const entries = Object.entries(item.scenario.scores || {}).filter(([key]) => ["A", "B", "C"].includes(key)).sort((a, b) => Number(b[1]) - Number(a[1]));
    if (entries[0]) bestPositions[entries[0][0]] += 1;
  }
  const distribution = Object.values(bestPositions);
  if (Math.max(...distribution) - Math.min(...distribution) > 1) findings.push({ id: edition, file: "deck", issues: [`strongest-answer positions imbalanced: ${JSON.stringify(bestPositions)}`] });

  const categories = new Set(cards.map((item) => String(item.scenario.category || "").trim()).filter(Boolean));
  if (categories.size < 6) findings.push({ id: edition, file: "deck", issues: [`scenario coverage too narrow: only ${categories.size} categories`] });
}

console.log(`\nKonfydence scenario audit: ${scored.length} scored source cards checked.`);
if (!findings.length) {
  console.log("PASS — five 40-card banks; canonical Comfort source; 3 distinct choices; balanced H/A/C/K; unique strongest move; diagnostic coverage; duplicate protection.\n");
  process.exit(0);
}
console.log(`FAIL — ${findings.length} finding(s).\n`);
for (const item of findings.slice(0, 120)) console.log(`- ${item.id} [${item.file}]: ${item.issues.join("; ")}`);
if (findings.length > 120) console.log(`...and ${findings.length - 120} more.`);
process.exit(1);
