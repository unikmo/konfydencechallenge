import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import scenarioText from "@/data/scenario-text.json";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// One-shot repair: some Scenario rows have text that was mangled at an earlier
// import (UTF-8 bytes read as Windows-1252 — e.g. a left curly quote U+201C,
// bytes E2 80 9C, showing as the three chars â € ). This
// rewrites every text field from the clean source bundled at
// data/scenario-text.json. Idempotent — a clean row is left untouched.
// Basic-Auth gated via proxy.ts (/api/admin/*).

type TextFields = {
  title: string | null;
  prompt: string;
  answersA: string;
  answersB: string;
  answersC: string;
  answersD: string;
  safeActions: string | null;
  explanation: string | null;
  proTip: string | null;
};

const TEXT: Record<string, TextFields> = scenarioText as Record<string, TextFields>;
const FIELDS = [
  "title", "prompt", "answersA", "answersB", "answersC", "answersD",
  "safeActions", "explanation", "proTip",
] as const;

// Markers of a UTF-8-as-Windows-1252 misread, the replacement char, and lone
// surrogates. Ã + continuation byte = 2-byte seq; â€ = 3-byte
// punctuation (dashes / curly quotes).
const MOJIBAKE = /[Ã][-¿]|[â][€‚„–—]|�|[\uD800-\uDFFF]/u;

function hasMojibake(v: string | null | undefined): boolean {
  return typeof v === "string" && MOJIBAKE.test(v);
}

const asRec = (row: unknown) => row as Record<string, string | null>;

export async function POST() {
  const rows = await prisma.scenario.findMany({
    select: {
      id: true, externalId: true,
      title: true, prompt: true,
      answersA: true, answersB: true, answersC: true, answersD: true,
      safeActions: true, explanation: true, proTip: true,
    },
  });

  let checked = 0;
  let updated = 0;
  let mojibakeRows = 0;
  const samples: { externalId: string; field: string; before: string; after: string }[] = [];

  for (const row of rows) {
    const clean = TEXT[row.externalId];
    if (!clean) continue;
    checked += 1;

    const patch: Record<string, string | null> = {};
    let rowHadMojibake = false;
    for (const f of FIELDS) {
      const current = asRec(row)[f] ?? null;
      const want = clean[f] ?? null;
      if (current === want) continue;
      patch[f] = want;
      if (hasMojibake(current)) {
        rowHadMojibake = true;
        if (samples.length < 12) {
          samples.push({
            externalId: row.externalId,
            field: f,
            before: (current ?? "").slice(0, 120),
            after: (want ?? "").slice(0, 120),
          });
        }
      }
    }

    if (Object.keys(patch).length > 0) {
      await prisma.scenario.update({ where: { id: row.id }, data: patch });
      updated += 1;
      if (rowHadMojibake) mojibakeRows += 1;
    }
  }

  return NextResponse.json({
    scenariosInDb: rows.length,
    matchedToSource: checked,
    rowsUpdated: updated,
    rowsThatHadMojibake: mojibakeRows,
    samples,
  });
}

// GET: report only — which rows currently carry mojibake. No writes.
export async function GET() {
  const rows = await prisma.scenario.findMany({
    select: {
      externalId: true, title: true, prompt: true,
      answersA: true, answersB: true, answersC: true, answersD: true,
      safeActions: true, explanation: true, proTip: true,
    },
  });
  const bad: { externalId: string; field: string; sample: string }[] = [];
  for (const row of rows) {
    for (const f of FIELDS) {
      const v = asRec(row)[f];
      if (hasMojibake(v)) bad.push({ externalId: row.externalId, field: f, sample: (v ?? "").slice(0, 100) });
    }
  }
  return NextResponse.json({ scenariosInDb: rows.length, mojibakeFields: bad.length, bad: bad.slice(0, 50) });
}
