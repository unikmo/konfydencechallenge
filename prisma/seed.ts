import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";

type Edition = "travelsafe" | "student" | "workplace";

const prisma = new PrismaClient();

type ScenarioJson = {
  id?: string;
  externalId?: string;
  title?: string;
  edition?: string;
  section?: string;
  difficulty?: string;
  scenario?: string;
  prompt?: string;
  answers?: Record<string, string>;
  scores?: Record<string, number>;
  safeActions?: string[];
  explanation?: string;
  proTip?: string;
  tags?: string[];
  active?: boolean;
};

const SECTION_SET = new Set(["A", "B", "C", "D"]);

function clampScore0to4(n: unknown): number {
  const num = typeof n === "number" ? n : Number(n);
  if (!Number.isFinite(num)) return 0;
  return Math.max(0, Math.min(4, Math.trunc(num)));
}

function normalizeEdition(raw: string | undefined): Edition {
  const s = (raw ?? "").toLowerCase();
  if (s.includes("travel")) return "travelsafe";
  if (s.includes("student")) return "student";
  if (s.includes("work")) return "workplace";
  // fallback: if file provides unknown, default to travelsafe so import can proceed
  return "travelsafe";
}

function normalizeSection(raw: string | undefined): "A" | "B" | "C" | "D" {
  const s = (raw ?? "").toUpperCase();
  if (!SECTION_SET.has(s)) return "A";
  return s as "A" | "B" | "C" | "D";
}

function listToCsv(v: unknown): string | null {
  if (v == null) return null;
  if (Array.isArray(v)) return v.map(String).join(",");
  return String(v);
}

async function main() {
  const scenariosDir = path.join(process.cwd(), "data", "scenarios");
  const files = fs
    .readdirSync(scenariosDir)
    .filter((f) => f.toLowerCase().endsWith(".json"));

  if (files.length === 0) {
    console.warn(`[seed] No scenario JSON files found in ${scenariosDir}`);
    return;
  }

  for (const file of files) {
    const abs = path.join(scenariosDir, file);
    const raw = fs.readFileSync(abs, "utf8");
    const data = JSON.parse(raw) as ScenarioJson | ScenarioJson[];

    const list = Array.isArray(data) ? data : [data];

    for (const item of list) {
      const externalId = item.externalId ?? item.id ?? `${file}`;
      const edition = normalizeEdition(item.edition);
      const section = normalizeSection(item.section);

      const answers = item.answers ?? {};
      const prompt = item.prompt ?? item.scenario ?? "";
      const scores = item.scores ?? {};

      const answersA = answers.A ?? "";
      const answersB = answers.B ?? "";
      const answersC = answers.C ?? "";
      const answersD = answers.D ?? "";

      const scoresA = clampScore0to4(scores.A);
      const scoresB = clampScore0to4(scores.B);
      const scoresC = clampScore0to4(scores.C);
      const scoresD = clampScore0to4(scores.D);

      const safeActionsCsv = listToCsv(item.safeActions);
      const tagsCsv = listToCsv(item.tags);

      await prisma.scenario.upsert({
        where: { externalId },
        update: {
          externalId,
          edition,
          section,
          title: item.title ?? null,
          prompt,
          answersA,
          answersB,
          answersC,
          answersD,
          scoresA,
          scoresB,
          scoresC,
          scoresD,
          safeActions: safeActionsCsv,
          explanation: item.explanation ?? null,
          proTip: item.proTip ?? null,
          tags: tagsCsv,
          active: typeof item.active === "boolean" ? item.active : true,
        },
        create: {
          externalId,
          edition,
          section,
          title: item.title ?? null,
          prompt,
          answersA,
          answersB,
          answersC,
          answersD,
          scoresA,
          scoresB,
          scoresC,
          scoresD,
          safeActions: safeActionsCsv,
          explanation: item.explanation ?? null,
          proTip: item.proTip ?? null,
          tags: tagsCsv,
          active: typeof item.active === "boolean" ? item.active : true,
        },
      });
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

