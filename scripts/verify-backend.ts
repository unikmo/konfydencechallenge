import { getBackendHealth } from "../lib/backendHealth";
import { prisma } from "../lib/prisma";

async function main() {
  const health = await getBackendHealth();
  console.log(JSON.stringify(health, null, 2));

  if (!health.ready) {
    throw new Error(
      `Konfydence backend is not ready: expected 200 active scored scenarios, 40 per edition and 10 per H/A/C/K.`
    );
  }

  console.log("Konfydence backend verification: PASS");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
