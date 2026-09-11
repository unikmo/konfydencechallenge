import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const EDITIONS = ["travelsafe", "family", "school", "university", "workplace"] as const;
const HACK_KEYS = ["H", "A", "C", "K"] as const;

function score(value: unknown): number {
  const number = Number(value ?? 0);
  if (!Number.isFinite(number)) return 0;
  return Math.max(0, Math.min(4, Math.trunc(number)));
}

function loadFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".json"))
    .filter((file) => !file.includes("schema"))
    .filter((file) => !file.includes("example"))
    .map((file) => path.join(dir, file));
}

/** Upserts one language's scenario files. Returns per-edition H/A/C/K counts
 *  among the active scored bank for that language only. */
async function importScenarioSet(
  lang: string,
  files: string[]
): Promise<Record<string, { total: number; H: number; A: number; C: number; K: number }>> {
  const editionsSeen = new Set<string>();

  let imported = 0;
  for (const fullPath of files) {
    const raw = fs.readFileSync(fullPath, "utf8").replace(/^\uFEFF/, "");
    const s = JSON.parse(raw);
    const scored = s.scored ?? true;
    const file = path.basename(fullPath);

    if (!EDITIONS.includes(s.edition)) {
      throw new Error(`${file}: unsupported edition ${String(s.edition)}`);
    }
    if ((s.lang ?? "en") !== lang) {
      throw new Error(`${file}: expected lang "${lang}", file declares "${s.lang}"`);
    }
    editionsSeen.add(s.edition);

    if (scored) {
      if (!HACK_KEYS.includes(s.hackKey)) {
        throw new Error(`${file}: scored scenarios require hackKey H, A, C or K`);
      }

      const playable = [s.answers?.A, s.answers?.B, s.answers?.C].filter(
        (value) => typeof value === "string" && value.trim()
      );
      if (playable.length !== 3) {
        throw new Error(`${file}: every scored scenario must contain exactly three playable answers A/B/C`);
      }
      if (s.answers?.D && String(s.answers.D).trim()) {
        throw new Error(`${file}: scored scenarios may not contain a fourth playable answer D`);
      }
    }

    const data = {
      title: s.title ?? null,
      edition: s.edition,
      lang,
      category: s.category ?? null,
      cardType: s.cardType ?? "scenario",
      scored,
      section: s.section ?? null,
      hackKey: s.hackKey ?? null,
      prompt: s.prompt ?? s.scenario ?? "",
      answersA: s.answers?.A ?? "",
      answersB: s.answers?.B ?? "",
      answersC: s.answers?.C ?? "",
      answersD: s.answers?.D ?? "",
      scoresA: score(s.scores?.A),
      scoresB: score(s.scores?.B),
      scoresC: score(s.scores?.C),
      scoresD: score(s.scores?.D),
      safeActions: Array.isArray(s.safeActions) ? s.safeActions.join(",") : null,
      explanation: s.explanation ?? null,
      proTip: s.proTip ?? null,
      tags: Array.isArray(s.tags) ? s.tags.join(",") : null,
      active: s.active ?? true,
    };

    await prisma.scenario.upsert({
      where: { externalId: s.id },
      update: data,
      create: { externalId: s.id, ...data },
    });
    imported += 1;
  }

  const bankRows = await prisma.scenario.findMany({
    where: {
      edition: { in: [...editionsSeen] },
      lang,
      active: true,
      scored: true,
      hackKey: { in: [...HACK_KEYS] },
    },
    select: { edition: true, hackKey: true },
  });

  const counts: Record<string, { total: number; H: number; A: number; C: number; K: number }> = {};
  for (const edition of editionsSeen) counts[edition] = { total: 0, H: 0, A: 0, C: 0, K: 0 };
  for (const row of bankRows) {
    const key = row.hackKey as (typeof HACK_KEYS)[number];
    if (!counts[row.edition] || !HACK_KEYS.includes(key)) continue;
    counts[row.edition].total += 1;
    counts[row.edition][key] += 1;
  }

  console.log(`[${lang}] Scenario files imported:`, imported);
  console.log(`[${lang}] Active scored bank:`, counts);
  return counts;
}

async function main() {
  const enFiles = loadFiles(path.join(process.cwd(), "data", "scenarios"));
  console.log("Scenario files found (en):", enFiles.length);
  if (enFiles.length < 240) {
    throw new Error(`Expected at least the 240 scored scenario JSON files, found ${enFiles.length}`);
  }

  // Preserve historical rows so old results remain valid, but retire the previous
  // scored bank before reactivating the current canonical scored bank. Non-scored
  // wild/host-mode cards are allowed alongside the 240 scored cards.
  await prisma.scenario.updateMany({
    where: { edition: { in: [...EDITIONS] }, lang: "en", scored: true },
    data: { active: false },
  });
  const enCounts = await importScenarioSet("en", enFiles);

  const validEnBank =
    Object.values(enCounts).reduce((sum, c) => sum + c.total, 0) === 240 &&
    EDITIONS.every((edition) => enCounts[edition]?.total === 48 && HACK_KEYS.every((key) => enCounts[edition][key] === 12));
  if (!validEnBank) {
    throw new Error(
      "English scenario bank validation failed: expected 240 active scored cards, 48 per edition and 12 per H/A/C/K."
    );
  }
  console.log("English scenario bank validation: PASS");

  // German \u2014 grows one edition at a time (Familie shipped first); only
  // validate the 12/12/12/12-per-edition shape for whichever editions exist.
  const deDir = path.join(process.cwd(), "data", "scenarios-de");
  const deFiles = fs.existsSync(deDir)
    ? fs
        .readdirSync(deDir, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .flatMap((entry) => loadFiles(path.join(deDir, entry.name)))
    : [];
  if (deFiles.length > 0) {
    await prisma.scenario.updateMany({
      where: { edition: { in: [...EDITIONS] }, lang: "de", scored: true },
      data: { active: false },
    });
    const deCounts = await importScenarioSet("de", deFiles);
    const validDeBank = Object.values(deCounts).every(
      (c) => c.total === 48 && HACK_KEYS.every((key) => c[key] === 12)
    );
    if (!validDeBank) {
      throw new Error(
        `German scenario bank validation failed for ${Object.keys(deCounts).join(", ")}: ` +
          "expected 48 active scored cards per edition, 12 per H/A/C/K."
      );
    }
    console.log("German scenario bank validation: PASS", Object.keys(deCounts));
  } else {
    console.log("[de] no German scenario files found \u2014 skipping (expected until Stage 4 content ships)");
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
