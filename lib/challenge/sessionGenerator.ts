import { prisma } from "@/lib/prisma";

export type ChallengeEdition = "school" | "university" | "family" | "travelsafe" | "workplace";
export type ChallengeMode = "diagnostic" | "full";

// Free diagnostic: 10 questions, max 40 points. Full deck: up to 50 scored questions, max 200 points.
// docs/DEV_BRIEF_DIAGNOSTIC_UPGRADE.md §1-2 (overrides PRODUCT_SPEC_V1.md §6's 5-question/max-20 diagnostic).
const MODE_CARD_COUNT: Record<ChallengeMode, number> = {
  diagnostic: 10,
  full: 50,
};

function shuffleInPlace<T>(arr: T[], rng: () => number = Math.random): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export type GeneratedSessionPlan = {
  edition: ChallengeEdition;
  mode: ChallengeMode;
  scenarioIds: string[];
};

// Flat pool of scored cards for an edition — no A/B/C/D section grouping (HANDOFF.md §2.8).
// Wild cards (cardType "wild", scored: false) are excluded from V1 solo gameplay (HANDOFF.md §2.4).
export async function generateChallengeSessionPlan(
  edition: ChallengeEdition,
  mode: ChallengeMode
): Promise<GeneratedSessionPlan> {
  const candidates = await prisma.scenario.findMany({
    where: { edition, active: true, scored: true },
    select: { id: true },
  });

  const shuffled = shuffleInPlace(candidates.map((c) => c.id));
  const scenarioIds = shuffled.slice(0, MODE_CARD_COUNT[mode]);

  return { edition, mode, scenarioIds };
}

export async function createChallengeSessionWithCardOrder(params: {
  userId: string;
  edition: ChallengeEdition;
  mode?: ChallengeMode;
}): Promise<{ sessionId: string }> {
  const mode = params.mode ?? "full";

  const plan = await generateChallengeSessionPlan(params.edition, mode);

  const priorRuns = await prisma.challengeSession.count({
    where: { userId: params.userId, edition: params.edition, mode },
  });

  const session = await prisma.challengeSession.create({
    data: {
      userId: params.userId,
      edition: params.edition,
      mode,
      runNumber: priorRuns + 1,
      status: "IN_PROGRESS",
      currentIndex: 0,
      scoreTotal: 0,
      scoreMax: plan.scenarioIds.length * 4,
    },
    select: { id: true },
  });

  await prisma.challengeSessionCard.createMany({
    data: plan.scenarioIds.map((scenarioId, orderIndex) => ({
      sessionId: session.id,
      scenarioId,
      orderIndex,
    })),
  });

  return { sessionId: session.id };
}

export async function getCurrentChallengeCard(params: { sessionId: string }): Promise<{
  cardId: string;
  scenarioId: string;
  currentIndex: number;
  totalCards: number;
} | null> {
  const session = await prisma.challengeSession.findUnique({
    where: { id: params.sessionId },
    select: {
      currentIndex: true,
      cards: {
        select: { id: true, scenarioId: true, orderIndex: true },
        orderBy: { orderIndex: "asc" },
      },
    },
  });

  if (!session) {
    throw new Error(`Missing session for sessionId=${params.sessionId}`);
  }

  const { cards } = session;
  if (session.currentIndex >= cards.length) return null;

  const card = cards[session.currentIndex];

  return {
    cardId: card.id,
    scenarioId: card.scenarioId,
    currentIndex: session.currentIndex,
    totalCards: cards.length,
  };
}

export async function advanceChallengeSession(params: {
  sessionId: string;
  cardId: string;
  selectedAnswerKey: string;
  score: number;
}): Promise<{ sessionCompleted: boolean }> {
  const session = await prisma.challengeSession.findUnique({
    where: { id: params.sessionId },
    select: { currentIndex: true, scoreTotal: true, cards: { select: { id: true } } },
  });

  if (!session) {
    throw new Error(`Missing session to advance for sessionId=${params.sessionId}`);
  }

  await prisma.challengeSessionCard.update({
    where: { id: params.cardId },
    data: {
      answered: true,
      selectedAnswerKey: params.selectedAnswerKey,
      score: params.score,
    },
  });

  const newIndex = session.currentIndex + 1;
  const completed = newIndex >= session.cards.length;

  await prisma.challengeSession.update({
    where: { id: params.sessionId },
    data: {
      currentIndex: newIndex,
      scoreTotal: session.scoreTotal + params.score,
      ...(completed ? { status: "COMPLETED", completedAt: new Date() } : {}),
    },
  });

  return { sessionCompleted: completed };
}
