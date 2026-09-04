// Ingests the lock-screen content libraries into the DB, one track at a time.
//
// Source of truth per track:
//   data/lockscreens/{track}-{expectedCount}.json                 (prompt text)
//   public/lockscreens/{track}/{format}/{NN}.png                  (reference renders)
//
// Workplace and School are MDM/desktop tracks with a full 60-prompt library.
// Home and Teen are Personal-engine, phone-first tracks with a curated
// 27-screen library (picked from a larger source pack, fixed order, no
// reshuffling -- per user decision 2026-09-04). Asset `number` keeps the
// original source-pack prompt number (e.g. Home uses 11,12,13...60, not a
// renumbered 1..27) so content stays traceable back to its manifest/CSV.
//
// Only the reference render format per track is ingested today. The other
// delivery formats (notebook 16:10, notebook 3:2, tablet landscape/portrait
// for Workplace/School) exist in the source Drive folders but are not yet
// pulled into the repo/CDN -- that needs a real asset host (Vercel Blob /
// S3 / Cloudflare, per the "open decisions" in docs/LOCKSCREENS_ARCHITECTURE.md
// §10) before the rotating-URL resolver can serve every device class.
// Re-run this ingest once those are wired to backfill the other formats.
//
// Note: Home/Teen assets land in LockscreenAsset here (content layer only).
// The Personal Delivery Engine that would actually sell/deliver them --
// tenant/plan creation from a Shopify order, the phone Shortcut/app,
// the resolver's phone device classes -- is a separate, not-yet-built
// project (see docs/LOCKSCREENS_ARCHITECTURE.md §7-8).
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

type TrackDef = { format: string; expectedCount: number };

const TRACKS: Record<string, TrackDef> = {
  workplace: { format: "desktop", expectedCount: 60 },
  school: { format: "desktop", expectedCount: 60 },
  home: { format: "smartphone", expectedCount: 27 },
  teen: { format: "smartphone", expectedCount: 27 },
};

async function ingestTrack(track: string) {
  const { format, expectedCount } = TRACKS[track];
  const manifestPath = path.join(process.cwd(), "data", "lockscreens", `${track}-${expectedCount}.json`);
  const manifest: ManifestEntry[] = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

  if (manifest.length !== expectedCount) {
    throw new Error(`Expected ${expectedCount} ${track} lockscreen prompts, found ${manifest.length}`);
  }

  const assetDir = path.join(process.cwd(), "public", "lockscreens", track, format);
  let imported = 0;

  for (const entry of manifest) {
    const filename = `${String(entry.number).padStart(2, "0")}.png`;
    const imagePath = `/lockscreens/${track}/${format}/${filename}`;
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

  if (liveCount !== expectedCount) {
    throw new Error(`Expected ${expectedCount} live ${track} lockscreen assets, found ${liveCount}`);
  }
}

async function main() {
  const requested = process.argv[2];
  const trackNames = Object.keys(TRACKS);
  const tracks = requested ? [requested] : trackNames;
  if (requested && !trackNames.includes(requested)) {
    throw new Error(`Unknown track "${requested}". Expected one of: ${trackNames.join(", ")}`);
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
