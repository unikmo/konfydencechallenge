import { prisma } from "./prisma";

export const BACKEND_EDITIONS = ["travelsafe", "family", "school", "university", "workplace"] as const;
export const BACKEND_HACK_KEYS = ["H", "A", "C", "K"] as const;

export type BackendHealth = {
  ready: boolean;
  database: "ok";
  totalActiveScored: number;
  editions: Record<string, { total: number; H: number; A: number; C: number; K: number }>;
  expectations: {
    total: number;
    perEdition: number;
    perHackKey: number;
  };
};

export async function getBackendHealth(): Promise<BackendHealth> {
  const rows = await prisma.scenario.findMany({
    where: {
      active: true,
      scored: true,
      edition: { in: [...BACKEND_EDITIONS] },
      hackKey: { in: [...BACKEND_HACK_KEYS] },
    },
    select: { edition: true, hackKey: true },
  });

  const editions: BackendHealth["editions"] = Object.fromEntries(
    BACKEND_EDITIONS.map((edition) => [edition, { total: 0, H: 0, A: 0, C: 0, K: 0 }])
  );

  for (const row of rows) {
    const edition = editions[row.edition];
    if (!edition) continue;
    if (!BACKEND_HACK_KEYS.includes(row.hackKey as (typeof BACKEND_HACK_KEYS)[number])) continue;

    const key = row.hackKey as (typeof BACKEND_HACK_KEYS)[number];
    edition.total += 1;
    edition[key] += 1;
  }

  const totalActiveScored = rows.length;
  const ready =
    totalActiveScored === 200 &&
    BACKEND_EDITIONS.every((edition) => {
      const counts = editions[edition];
      return counts.total === 40 && BACKEND_HACK_KEYS.every((key) => counts[key] === 10);
    });

  return {
    ready,
    database: "ok",
    totalActiveScored,
    editions,
    expectations: {
      total: 200,
      perEdition: 40,
      perHackKey: 10,
    },
  };
}
