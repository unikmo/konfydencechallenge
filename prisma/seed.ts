import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const dir = path.join(process.cwd(), "data", "scenarios");

  const files = fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".json"))
    .filter((file) => !file.includes("schema"))
    .filter((file) => !file.includes("example"));

  console.log("Scenario files found:", files.length);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const raw = fs.readFileSync(fullPath, "utf8").replace(/^\uFEFF/, "");
    const s = JSON.parse(raw);

    const data = {
      title: s.title,
      edition: s.edition,
      category: s.category ?? null,
      cardType: s.cardType ?? "scenario",
      scored: s.scored ?? true,
      section: s.section ?? null,
      hackKey: s.hackKey ?? null,
      prompt: s.prompt ?? s.scenario ?? "",
      answersA: s.answers.A,
      answersB: s.answers.B,
      answersC: s.answers.C,
      answersD: s.answers.D,
      scoresA: s.scores.A,
      scoresB: s.scores.B,
      scoresC: s.scores.C,
      scoresD: s.scores.D,
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
  }

  const count = await prisma.scenario.count();
  const scoredCount = await prisma.scenario.count({ where: { scored: true } });
  console.log("Scenario count after import:", count, "(scored:", scoredCount, ")");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
