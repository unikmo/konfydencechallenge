const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");

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

    let s;
    try {
      s = JSON.parse(raw);
    } catch (error) {
      console.error("Invalid JSON file:", file);
      throw error;
    }

    console.log(`Importing ${file}: ${s.id} / ${s.edition} / ${s.section}`);

    await prisma.scenario.upsert({
      where: { externalId: s.id },
      update: {
        title: s.title,
        edition: s.edition,
        section: s.section,
        prompt: s.prompt || s.scenario || "",
        answersA: s.answers.A,
        answersB: s.answers.B,
        answersC: s.answers.C,
        answersD: s.answers.D,
        scoresA: s.scores.A,
        scoresB: s.scores.B,
        scoresC: s.scores.C,
        scoresD: s.scores.D,
        safeActions: Array.isArray(s.safeActions) ? s.safeActions.join(",") : null,
        explanation: s.explanation || null,
        proTip: s.proTip || null,
        tags: Array.isArray(s.tags) ? s.tags.join(",") : null,
        active: s.active !== false
      },
      create: {
        externalId: s.id,
        title: s.title,
        edition: s.edition,
        section: s.section,
        prompt: s.prompt || s.scenario || "",
        answersA: s.answers.A,
        answersB: s.answers.B,
        answersC: s.answers.C,
        answersD: s.answers.D,
        scoresA: s.scores.A,
        scoresB: s.scores.B,
        scoresC: s.scores.C,
        scoresD: s.scores.D,
        safeActions: Array.isArray(s.safeActions) ? s.safeActions.join(",") : null,
        explanation: s.explanation || null,
        proTip: s.proTip || null,
        tags: Array.isArray(s.tags) ? s.tags.join(",") : null,
        active: s.active !== false
      }
    });
  }

  const count = await prisma.scenario.count();
  console.log("Scenario count after import:", count);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
