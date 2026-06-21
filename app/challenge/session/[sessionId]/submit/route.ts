import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { clampTo0to4 } from "@/lib/scoring/scoringEngine";
import { advanceChallengeSection } from "@/lib/challenge/sessionGenerator";

const ANSWER_KEYS = new Set(["A", "B", "C", "D"]);
const SECTION_KEYS = new Set(["A", "B", "C", "D"]);

export async function POST(req: Request, { params }: { params: { sessionId: string } }) {
  const sessionId = params.sessionId;

  const formData = await req.formData();
  const selectedAnswerKey = String(formData.get("selectedAnswerKey") ?? "");
  const scenarioId = String(formData.get("scenarioId") ?? "");
  const section = String(formData.get("section") ?? "");

  if (!ANSWER_KEYS.has(selectedAnswerKey)) {
    return NextResponse.json({ error: "Invalid answer key" }, { status: 400 });
  }
  if (!SECTION_KEYS.has(section)) {
    return NextResponse.json({ error: "Invalid section" }, { status: 400 });
  }
  if (!scenarioId) {
    return NextResponse.json({ error: "Missing scenarioId" }, { status: 400 });
  }

  const scenario = await prisma.scenario.findUnique({
    where: { id: scenarioId },
    select: {
      id: true,
      scoresA: true,
      scoresB: true,
      scoresC: true,
      scoresD: true,
      safeActions: true,
      explanation: true,
      proTip: true,
    },
  });

  if (!scenario) {
    return NextResponse.json({ error: "Scenario not found" }, { status: 404 });
  }

  const scoreLookup: Record<"A" | "B" | "C" | "D", number> = {
    A: scenario.scoresA,
    B: scenario.scoresB,
    C: scenario.scoresC,
    D: scenario.scoresD,
  };

  const score0to4 = clampTo0to4(scoreLookup[selectedAnswerKey as "A" | "B" | "C" | "D"]);

  const safeActions = (scenario.safeActions ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  await prisma.challengeAnswerResponse.create({
    data: {
      sessionId,
      scenarioId,
      section,
      selectedAnswerKey,
      score: score0to4,
      explanation: scenario.explanation ?? null,
      proTip: scenario.proTip ?? null,
    },
  });

  await advanceChallengeSection({
    sessionId,
    section: section as "A" | "B" | "C" | "D",
    scenarioId: scenario.id,
    nextScore: score0to4,
  });

  return NextResponse.redirect(new URL(`/challenge/session/${sessionId}/feedback`, req.url));
}

