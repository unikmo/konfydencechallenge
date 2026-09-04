// Ingests the lock-screen content libraries into the DB, one track at a time.
//
// Source of truth per track:
//   data/lockscreens/{track}-60.json                      (prompt text)
//   public/lockscreens/{track}/desktop/{01..60}.png        (reference renders)
//
// Only the desktop format is ingested today for either track. The other four
// delivery formats (notebook 16:10, notebook 3:2, tablet landscape/portrait)
// exist in the source Drive folders but are not yet pulled into the repo/CDN
// -- that needs a real asset host (Vercel Blob / S3 / Cloudflare, per the
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

const TRACKS = ["workplace", "school"] as const;

async function ingestTrack(track: (typeof TRACKS)[number]) {
  const manifestPath = path.join(process.cwd(), "data", "lockscreens", `${track}-60.json`);
  const manifest: ManifestEntry[] = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

  if (manifest.length !== 60) {
    throw new Error(`Expected 60 ${track} lockscreen prompts, found ${manifest.length}`);
  }

  const assetDir = path.join(process.cwd(), "public", "lockscreens", track, "desktop");
  let imported = 0;

  for (const entry of manifest) {
    const filename = `${String(entry.number).padStart(2, "0")}.png`;
    const imagePath = `/lockscreens/${track}/desktop/${filename}`;
    if (!fs.existsSync(path.join(assetDir, filename))) {
      throw new Error(`Missing ingested image for ${track} prompt ${entry.number}: ${imagePath}`);
    }

    await prisma.lockscreenAsset.upsert({
      where: { track_number: { track, number: entry.number } },
      update: {
        category: entry.category,
        hook: entry.hook,
        body: entry.body,
        action: entry.action,
        imagePath,
        status: "live",
      },
      create: {
        track,
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

  const liveCount = await prisma.lockscreenAsset.count({ where: { status: "live", track } });
  console.log(`[${track}] Lockscreen assets ingested: ${imported}`);
  console.log(`[${track}] Live assets in DB: ${liveCount}`);

  if (liveCount !== 60) {
    throw new Error(`Expected 60 live ${track} lockscreen assets, found ${liveCount}`);
  }
}

async function main() {
  const requested = process.argv[2] as (typeof TRACKS)[number] | undefined;
  const tracks = requested ? [requested] : TRACKS;
  if (requested && !TRACKS.includes(requested)) {
    throw new Error(`Unknown track "${requested}". Expected one of: ${TRACKS.join(", ")}`);
  }

  for (const track of tracks) {
    await ingestTrack(track);
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
