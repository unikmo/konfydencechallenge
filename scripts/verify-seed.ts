import { PrismaClient } from "@prisma/client";

async function main() {
  const prisma = new PrismaClient();
  try {
    const scenarioCount = await prisma.scenario.count();
    const byEdition = await prisma.scenario.groupBy({
      by: ["edition"],
      _count: { _all: true },
    });

    const bySection = await prisma.scenario.groupBy({
      by: ["section"],
      _count: { _all: true },
    });

    console.log(JSON.stringify({ scenarioCount, byEdition, bySection }, null, 2));
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

