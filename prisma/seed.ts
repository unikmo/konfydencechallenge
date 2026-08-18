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

async function main() {
  const dir = path.join(process.cwd(), "data", "scenarios");
  const files = fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".json"))
    .filter((file) => !file.includes("schema"))
    .filter((file) => !file.includes("example"));

  console.log("Scenario files found:", files.length);

  if (files.length < 200) {
    throw new Error(`Expected at least the 200 scored scenario JSON files, found ${files.length}`);
  }

  // Preserve historical rows so old results remain valid, but retire the previous
  // scored bank before reactivating the current canonical scored bank. Non-scored
  // wild/host-mode cards are allowed alongside the 200 scored cards.
  await prisma.scenario.updateMany({
    where: { edition: { in: [...EDITIONS] }, scored: true },
    data: { active: false },
  });

  let imported = 0;
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const raw = fs.readFileSync(fullPath, "utf8").replace(/^\uFEFF/, "");
    const s = JSON.parse(raw);
    const scored = s.scored ?? true;

    if (!EDITIONS.includes(s.edition)) {
      throw new Error(`${file}: unsupported edition ${String(s.edition)}`);
    }

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
      edition: { in: [...EDITIONS] },
      active: true,
      scored: true,
      hackKey: { in: [...HACK_KEYS] },
    },
    select: { edition: true, hackKey: true },
  });

  const counts = Object.fromEntries(
    EDITIONS.map((edition) => [edition, { total: 0, H: 0, A: 0, C: 0, K: 0 }])
  ) as Record<(typeof EDITIONS)[number], { total: number; H: number; A: number; C: number; K: number }>;

  for (const row of bankRows) {
    const edition = row.edition as (typeof EDITIONS)[number];
    const key = row.hackKey as (typeof HACK_KEYS)[number];
    if (!counts[edition] || !HACK_KEYS.includes(key)) continue;
    counts[edition].total += 1;
    counts[edition][key] += 1;
  }

  const validBank =
    bankRows.length === 200 &&
    EDITIONS.every((edition) =>
      counts[edition].total === 40 && HACK_KEYS.every((key) => counts[edition][key] === 10)
    );

  console.log("Scenario files imported:", imported);
  console.log("Active scored bank:", counts);

  if (!validBank) {
    throw new Error(
      "Scenario bank validation failed: expected 200 active scored cards, 40 per edition and 10 per H/A/C/K."
    );
  }

  console.log("Scenario bank validation: PASS");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
