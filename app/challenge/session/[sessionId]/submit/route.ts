import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { clampTo0to4 } from "@/lib/scoring/scoringEngine";
import { advanceChallengeSession } from "@/lib/challenge/sessionGenerator";

type AnswerKey = "A" | "B" | "C";
const ANSWER_KEYS = new Set<AnswerKey>(["A", "B", "C"]);

export async function POST(req: Request, props: { params: Promise<{ sessionId: string }> }) {
  const params = await props.params;
  const sessionId = params.sessionId;
  const formData = await req.formData();
  const selectedAnswerKey = String(formData.get("selectedAnswerKey") ?? "") as AnswerKey;
  const cardId = String(formData.get("cardId") ?? "");
  const scenarioId = String(formData.get("scenarioId") ?? "");

  if (!ANSWER_KEYS.has(selectedAnswerKey)) {
    return NextResponse.json({ error: "Invalid answer key" }, { status: 400 });
  }
  if (!cardId || !scenarioId) {
    return NextResponse.json({ error: "Missing challenge data" }, { status: 400 });
  }

  const card = await prisma.challengeSessionCard.findUnique({
    where: { id: cardId },
    select: {
      sessionId: true,
      scenarioId: true,
      answered: true,
      scenario: {
        select: {
          answersA: true,
          answersB: true,
          answersC: true,
          scoresA: true,
          scoresB: true,
          scoresC: true,
        },
      },
    },
  });

  if (!card || card.sessionId !== sessionId || card.scenarioId !== scenarioId) {
    return NextResponse.json({ error: "Challenge card mismatch" }, { status: 400 });
  }
  if (card.answered) {
    return NextResponse.redirect(new URL(`/challenge/session/${sessionId}/feedback`, req.url));
  }

  const answers: Record<AnswerKey, string> = {
    A: card.scenario.answersA,
    B: card.scenario.answersB,
    C: card.scenario.answersC,
  };
  const scores: Record<AnswerKey, number> = {
    A: card.scenario.scoresA,
    B: card.scenario.scoresB,
    C: card.scenario.scoresC,
  };

  if (!answers[selectedAnswerKey]?.trim()) {
    return NextResponse.json({ error: "Answer is not playable" }, { status: 400 });
  }

  await advanceChallengeSession({
    sessionId,
    cardId,
    selectedAnswerKey,
    score: clampTo0to4(scores[selectedAnswerKey]),
  });

  return NextResponse.redirect(new URL(`/challenge/session/${sessionId}/feedback`, req.url));
}
