import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { clampTo0to4 } from "@/lib/scoring/scoringEngine";
import { advanceChallengeSession } from "@/lib/challenge/sessionGenerator";

const ANSWER_KEYS = new Set(["A", "B", "C", "D"]);

export async function POST(req: Request, { params }: { params: { sessionId: string } }) {
  const sessionId = params.sessionId;

  const formData = await req.formData();
  const selectedAnswerKey = String(formData.get("selectedAnswerKey") ?? "");
  const cardId = String(formData.get("cardId") ?? "");
  const scenarioId = String(formData.get("scenarioId") ?? "");

  if (!ANSWER_KEYS.has(selectedAnswerKey)) {
    return NextResponse.json({ error: "Invalid answer key" }, { status: 400 });
  }
  if (!cardId) {
    return NextResponse.json({ error: "Missing cardId" }, { status: 400 });
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

  await advanceChallengeSession({
    sessionId,
    cardId,
    selectedAnswerKey,
    score: score0to4,
  });

  return NextResponse.redirect(new URL(`/challenge/session/${sessionId}/feedback`, req.url));
}
