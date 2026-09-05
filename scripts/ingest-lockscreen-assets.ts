// Ingests the lock-screen content libraries into the DB, one track at a time.
//
// Source of truth per track:
//   data/lockscreens/{track}-{expectedCount}.json                 (prompt text, same across all formats)
//   public/lockscreens/{track}/{format}/{NN}.png                  (one render per format)
//
// Workplace and School are MDM/desktop tracks with a full 60-prompt library,
// now shipped across all 5 device formats (desktop, notebook 16:10, notebook
// 3:2, tablet landscape, tablet portrait) -- Workplace/School own the
// non-phone formats since MDM can push any of them to an org-owned device.
//
// Home and Teen are Personal-engine, phone-first tracks with a curated
// 27-screen library (picked from a larger source pack, fixed order, no
// reshuffling -- per user decision 2026-09-04) and are phone-only by design
// (user decision 2026-09-04) -- no desktop/notebook/tablet renders, since
// the Personal engine only ever targets a phone. Asset `number` keeps the
// original source-pack prompt number (e.g. Home uses 11,12,13...60, not a
// renumbered 1..27) so content stays traceable back to its manifest/CSV.
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

type TrackDef = { formats: string[]; expectedCount: number };

const TRACKS: Record<string, TrackDef> = {
  workplace: { formats: ["desktop", "notebook-16x10", "notebook-3x2", "tablet-landscape", "tablet-portrait"], expectedCount: 60 },
  school: { formats: ["desktop", "notebook-16x10", "notebook-3x2", "tablet-landscape", "tablet-portrait"], expectedCount: 60 },
  home: { formats: ["phone"], expectedCount: 27 },
  teen: { formats: ["phone"], expectedCount: 27 },
};

async function ingestTrack(track: string) {
  const { formats, expectedCount } = TRACKS[track];
  const manifestPath = path.join(process.cwd(), "data", "lockscreens", `${track}-${expectedCount}.json`);
  const manifest: ManifestEntry[] = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

  if (manifest.length !== expectedCount) {
    throw new Error(`Expected ${expectedCount} ${track} lockscreen prompts, found ${manifest.length}`);
  }

  let imported = 0;

  for (const format of formats) {
    const assetDir = path.join(process.cwd(), "public", "lockscreens", track, format);

    for (const entry of manifest) {
      const filename = `${String(entry.number).padStart(2, "0")}.png`;
      const imagePath = `/lockscreens/${track}/${format}/${filename}`;
      if (!fs.existsSync(path.join(assetDir, filename))) {
        throw new Error(`Missing ingested image for ${track}/${format} prompt ${entry.number}: ${imagePath}`);
      }

      await prisma.lockscreenAsset.upsert({
        where: { track_number_format: { track, number: entry.number, format } },
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
          format,
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
  }

  const liveCount = await prisma.lockscreenAsset.count({ where: { status: "live", track } });
  const expectedLive = expectedCount * formats.length;
  console.log(`[${track}] Lockscreen assets ingested: ${imported}`);
  console.log(`[${track}] Live assets in DB: ${liveCount} (${formats.length} format(s) x ${expectedCount})`);

  if (liveCount !== expectedLive) {
    throw new Error(`Expected ${expectedLive} live ${track} lockscreen assets, found ${liveCount}`);
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
