// Ingests the Workplace lock-screen content library into the DB.
//
// Source of truth: data/lockscreens/workplace-60.json (prompt text) +
// public/lockscreens/workplace/desktop/{01..60}.png (reference renders,
// desktop 16:9 format only for now).
//
// Only the desktop format is ingested today. The other four delivery
// formats (notebook 16:10, notebook 3:2, tablet landscape/portrait) exist
// in the source Drive folder but are not yet pulled into the repo/CDN —
// that needs a real asset host (Vercel Blob / S3 / Cloudflare, per the
// "open decisions" in docs/LOCKSCREENS_ARCHITECTURE.md §10) before the
// rotating-URL resolver can serve every device class. Re-run this ingest
// once those are wired to backfill the other formats.
import fs from "fs";
import path from "path";
import { prisma } from "../lib/prisma";

type ManifestEntry = {
  number: number;
  category: string;
  hook: string;
  body: string;
  action: string;
};

async function main() {
  const manifestPath = path.join(process.cwd(), "data", "lockscreens", "workplace-60.json");
  const manifest: ManifestEntry[] = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

  if (manifest.length !== 60) {
    throw new Error(`Expected 60 Workplace lockscreen prompts, found ${manifest.length}`);
  }

  const assetDir = path.join(process.cwd(), "public", "lockscreens", "workplace", "desktop");
  let imported = 0;

  for (const entry of manifest) {
    const filename = `${String(entry.number).padStart(2, "0")}.png`;
    const imagePath = `/lockscreens/workplace/desktop/${filename}`;
    if (!fs.existsSync(path.join(assetDir, filename))) {
      throw new Error(`Missing ingested image for prompt ${entry.number}: ${imagePath}`);
    }

    await prisma.lockscreenAsset.upsert({
      where: { number: entry.number },
      update: {
        category: entry.category,
        hook: entry.hook,
        body: entry.body,
        action: entry.action,
        imagePath,
        status: "live",
      },
      create: {
        number: entry.number,
        category: entry.category,
        hook: entry.hook,
        body: entry.body,
        action: entry.action,
        imagePath,
        status: "live",
      },
    });
    imported += 1;
  }

  const liveCount = await prisma.lockscreenAsset.count({ where: { status: "live" } });
  console.log(`Lockscreen assets ingested: ${imported}`);
  console.log(`Live Workplace lockscreen assets in DB: ${liveCount}`);

  if (liveCount !== 60) {
    throw new Error(`Expected 60 live Workplace lockscreen assets, found ${liveCount}`);
  }
  console.log("Lockscreen asset ingest: PASS");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
