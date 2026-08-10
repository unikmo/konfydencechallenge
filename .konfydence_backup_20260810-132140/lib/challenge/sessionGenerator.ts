import { prisma } from "@/lib/prisma";

export type ChallengeEdition = "school" | "university" | "family" | "travelsafe" | "workplace";
export type ChallengeMode = "diagnostic" | "full";
type HackKey = "H" | "A" | "C" | "K";

// Each edition has a 40-scenario bank: 10 H / 10 A / 10 C / 10 K.
// The free readiness check draws 8 (2 per pressure pattern).
// A full run draws 24 (6 per pressure pattern), prioritising unseen cards.
const MODE_CARD_COUNT: Record<ChallengeMode, number> = {
  diagnostic: 8,
  full: 24,
};

const PER_KEY_COUNT: Record<ChallengeMode, number> = {
  diagnostic: 2,
  full: 6,
};

const HACK_KEYS: HackKey[] = ["H", "A", "C", "K"];

function shuffleInPlace<T>(arr: T[], rng: () => number = Math.random): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function hasTag(tags: string | null, tag: string): boolean {
  return (tags ?? "")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .includes(tag.toLowerCase());
}

type Candidate = {
  id: string;
  hackKey: string | null;
  tags: string | null;
};

function weaveBuckets(buckets: Record<HackKey, string[]>): string[] {
  const result: string[] = [];
  const maxDepth = Math.max(...HACK_KEYS.map((key) => buckets[key].length));

  for (let depth = 0; depth < maxDepth; depth++) {
    const keyOrder = shuffleInPlace([...HACK_KEYS]);
    for (const key of keyOrder) {
      const id = buckets[key][depth];
      if (id) result.push(id);
    }
  }
  return result;
}

export type GeneratedSessionPlan = {
  edition: ChallengeEdition;
  mode: ChallengeMode;
  scenarioIds: string[];
};

/**
 * Builds a balanced session instead of drawing randomly from a flat pool.
 *
 * - First diagnostic: prefers the eight curated `diagnostic` cards (2 per H/A/C/K).
 * - Later runs: unseen cards first, still balanced by pressure pattern.
 * - When a pressure-pattern pool is exhausted: oldest-seen cards are recycled first.
 *
 * With the standard 40-card bank, two 8-card diagnostics followed by a 24-card
 * full run can expose a player to all 40 cards without repetition.
 */
export async function generateChallengeSessionPlan(
  edition: ChallengeEdition,
  mode: ChallengeMode,
  userId: string
): Promise<GeneratedSessionPlan> {
  const needed = MODE_CARD_COUNT[mode];
  const perKey = PER_KEY_COUNT[mode];

  const candidates: Candidate[] = await prisma.scenario.findMany({
    where: {
      edition,
      active: true,
      scored: true,
      hackKey: { in: HACK_KEYS },
    },
    select: { id: true, hackKey: true, tags: true },
  });

  const priorCards = await prisma.challengeSessionCard.findMany({
    where: { session: { userId, edition } },
    select: { scenarioId: true },
    orderBy: { session: { createdAt: "desc" } },
  });

  const priorDiagnosticRuns = await prisma.challengeSession.count({
    where: { userId, edition, mode: "diagnostic" },
  });

  // Most-recent-first, de-duplicated. Reading from the end gives oldest-seen first.
  const seenMostRecentFirst: string[] = [];
  const seenSet = new Set<string>();
  for (const card of priorCards) {
    if (!seenSet.has(card.scenarioId)) {
      seenSet.add(card.scenarioId);
      seenMostRecentFirst.push(card.scenarioId);
    }
  }

  const candidateMap = new Map(candidates.map((item) => [item.id, item]));
  const buckets: Record<HackKey, string[]> = { H: [], A: [], C: [], K: [] };

  for (const key of HACK_KEYS) {
    const keyCandidates = candidates.filter((item) => item.hackKey === key);
    const unseen = shuffleInPlace(keyCandidates.filter((item) => !seenSet.has(item.id)));

    // The first readiness check starts with deliberately selected flagship cards.
    // Subsequent runs are still balanced but favour cards the player has not seen.
    const primary = mode === "diagnostic" && priorDiagnosticRuns === 0
      ? [
          ...shuffleInPlace(unseen.filter((item) => hasTag(item.tags, "diagnostic"))),
          ...shuffleInPlace(unseen.filter((item) => !hasTag(item.tags, "diagnostic"))),
        ]
      : unseen;

    const selected = primary.slice(0, perKey).map((item) => item.id);

    if (selected.length < perKey) {
      for (let i = seenMostRecentFirst.length - 1; i >= 0 && selected.length < perKey; i--) {
        const id = seenMostRecentFirst[i];
        const candidate = candidateMap.get(id);
        if (candidate?.hackKey === key && !selected.includes(id)) selected.push(id);
      }
    }

    buckets[key] = selected;
  }

  const scenarioIds = weaveBuckets(buckets).slice(0, needed);

  if (scenarioIds.length !== needed) {
    throw new Error(
      `Scenario bank for ${edition} cannot build a balanced ${mode} run: expected ${needed}, got ${scenarioIds.length}. ` +
      `Each edition needs at least ${perKey} active scored cards for every H/A/C/K pressure pattern.`
    );
  }

  return { edition, mode, scenarioIds };
}

export async function createChallengeSessionWithCardOrder(params: {
  userId: string;
  edition: ChallengeEdition;
  mode?: ChallengeMode;
}): Promise<{ sessionId: string }> {
  const mode = params.mode ?? "full";
  const plan = await generateChallengeSessionPlan(params.edition, mode, params.userId);

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

  if (!session) throw new Error(`Missing session for sessionId=${params.sessionId}`);
  if (session.currentIndex >= session.cards.length) return null;

  const card = session.cards[session.currentIndex];
  return {
    cardId: card.id,
    scenarioId: card.scenarioId,
    currentIndex: session.currentIndex,
    totalCards: session.cards.length,
  };
}

export async function advanceChallengeSession(params: {
  sessionId: string;
  cardId: string;
  selectedAnswerKey: string;
  score: number;
}): Promise<{ sessionCompleted: boolean }> {
  return prisma.$transaction(async (tx) => {
    const session = await tx.challengeSession.findUnique({
      where: { id: params.sessionId },
      select: {
        currentIndex: true,
        scoreTotal: true,
        status: true,
        cards: {
          select: { id: true },
          orderBy: { orderIndex: "asc" },
        },
      },
    });

    if (!session) throw new Error(`Missing session to advance for sessionId=${params.sessionId}`);
    if (session.status !== "IN_PROGRESS") throw new Error("Challenge session is already complete");

    const currentCard = session.cards[session.currentIndex];
    if (!currentCard || currentCard.id !== params.cardId) {
      throw new Error("Submitted card is not the current challenge card");
    }

    const claimed = await tx.challengeSessionCard.updateMany({
      where: { id: params.cardId, sessionId: params.sessionId, answered: false },
      data: {
        answered: true,
        selectedAnswerKey: params.selectedAnswerKey,
        score: params.score,
      },
    });

    if (claimed.count !== 1) throw new Error("Challenge answer was already submitted");

    const newIndex = session.currentIndex + 1;
    const completed = newIndex >= session.cards.length;

    await tx.challengeSession.update({
      where: { id: params.sessionId },
      data: {
        currentIndex: newIndex,
        scoreTotal: session.scoreTotal + params.score,
        ...(completed ? { status: "COMPLETED", completedAt: new Date() } : {}),
      },
    });

    return { sessionCompleted: completed };
  });
}
