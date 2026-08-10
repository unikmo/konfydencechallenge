import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const EDITIONS = ["travelsafe", "family", "school", "university", "workplace"];

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

  // Keep historical rows so old session results remain valid, but retire every
  // scored card from the five live editions before reactivating the current bank.
  await prisma.scenario.updateMany({
    where: { edition: { in: EDITIONS }, scored: true },
    data: { active: false },
  });

  let imported = 0;
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const raw = fs.readFileSync(fullPath, "utf8").replace(/^\uFEFF/, "");
    const s = JSON.parse(raw);
    const scored = s.scored ?? true;

    if (scored) {
      const playable = [s.answers?.A, s.answers?.B, s.answers?.C].filter((value) => typeof value === "string" && value.trim());
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
      // Legacy columns stay populated for schema compatibility; the game never renders D.
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

  const activeByEdition = await Promise.all(
    EDITIONS.map(async (edition) => ({
      edition,
      count: await prisma.scenario.count({ where: { edition, active: true, scored: true } }),
    }))
  );

  console.log("Scenario files imported:", imported);
  console.log("Active scored bank:", activeByEdition.map((item) => `${item.edition}=${item.count}`).join(", "));
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
