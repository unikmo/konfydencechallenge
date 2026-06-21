import { prisma } from "@/lib/prisma";

export type ChallengeEdition = "travelsafe" | "student" | "workplace";
export type SectionKey = "A" | "B" | "C" | "D";

const SECTION_ORDER: SectionKey[] = ["A", "B", "C", "D"];

function shuffleInPlace<T>(arr: T[], rng: () => number = Math.random): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function clampScore(score: number): number {
  // Defensive: V1 says clamp negatives to 0.
  if (!Number.isFinite(score)) return 0;
  return Math.max(0, Math.min(4, Math.trunc(score)));
}

export type GeneratedSessionPlan = {
  edition: ChallengeEdition;
  sections: {
    section: SectionKey;
    scenarioIds: string[];
  }[];
};

export async function generateChallengeSessionPlan(edition: ChallengeEdition): Promise<GeneratedSessionPlan> {
  const sections: GeneratedSessionPlan["sections"] = [];

  for (const section of SECTION_ORDER) {
    const candidates = await prisma.scenario.findMany({
      where: {
        edition,
        section,
        active: true,
      },
      select: { id: true },
    });

    if (candidates.length === 0) {
      // Clear error; caller can catch and show a user-friendly message.
      throw new Error(`No active scenarios found for edition="${edition}" section="${section}"`);
    }

    const ids = shuffleInPlace(candidates.map((c) => c.id));

    // Ensure all scenario scores are valid 0..4 (defensive; importer clamps already).
    // We do a lightweight check by querying one sample set if needed.
    // For V1 correctness, we keep this simple and only enforce at scoring time.
    sections.push({ section, scenarioIds: ids });
  }

  return { edition, sections };
}

export async function createChallengeSessionWithCardOrder(params: {
  userId: string;
  edition: ChallengeEdition;
}): Promise<{ sessionId: string }> {
  // Create session.
  const session = await prisma.challengeSession.create({
    data: {
      userId: params.userId,
      edition: params.edition,
      status: "IN_PROGRESS",
    },
    select: { id: true },
  });

  // Generate plan.
  const plan = await generateChallengeSessionPlan(params.edition);

  // Persist per-section order.
  for (const sec of plan.sections) {
    const sectionRow = await prisma.challengeSessionSection.create({
      data: {
        sessionId: session.id,
        section: sec.section,
        currentIndex: 0,
        sectionScoreTotal: 0,
        sectionScoreMax: 0,
        completedScenarioIds: "",
      },
      select: { id: true },
    });

    const cardsToCreate = sec.scenarioIds.map((scenarioId, orderIndex) => ({
      sectionId: sectionRow.id,
      scenarioId,
      orderIndex,
    }));

    await prisma.challengeSessionSectionCard.createMany({
      data: cardsToCreate,
    });

    // Compute max score for section.
    const sectionCards = await prisma.challengeSessionSectionCard.findMany({
      where: { sectionId: sectionRow.id },
      select: { scenarioId: true },
      orderBy: { orderIndex: "asc" },
    });

    // max per scenario is 4 (normalized). However to support future variations, compute based on
    // scenario scores for this section (max possible).
    // In V1 each answer key gives 0..4 so max is 4 per scenario.
    const sectionScoreMax = sectionCards.length * 4;

    await prisma.challengeSessionSection.update({
      where: { id: sectionRow.id },
      data: {
        sectionScoreMax: sectionScoreMax,
      },
    });
  }

  return { sessionId: session.id };
}

export async function getChallengeSectionCard(params: {
  sessionId: string;
  section: SectionKey;
}): Promise<{
  sectionRowId: string;
  scenarioId: string;
  scenarioOrderIndex: number;
  currentIndex: number;
  totalCards: number;
}> {
  const sectionRow = await prisma.challengeSessionSection.findUnique({
    where: {
      sessionId_section: {
        sessionId: params.sessionId,
        section: params.section,
      },
    },
    select: {
      id: true,
      currentIndex: true,
      cards: {
        select: { id: true, scenarioId: true, orderIndex: true },
        orderBy: { orderIndex: "asc" },
      },
    },
  });

  if (!sectionRow) {
    throw new Error(`Missing session section row for sessionId=${params.sessionId} section=${params.section}`);
  }

  const cards = sectionRow.cards;
  if (cards.length === 0) {
    throw new Error(`No persisted cards for sessionId=${params.sessionId} section=${params.section}`);
  }

  const idx = sectionRow.currentIndex;
  if (idx < 0 || idx >= cards.length) {
    throw new Error(
      `CurrentIndex out of range for sessionId=${params.sessionId} section=${params.section} currentIndex=${idx} total=${cards.length}`
    );
  }

  const card = cards[idx];

  return {
    sectionRowId: sectionRow.id,
    scenarioId: card.scenarioId,
    scenarioOrderIndex: card.orderIndex,
    currentIndex: idx,
    totalCards: cards.length,
  };
}

export async function advanceChallengeSection(params: {
  sessionId: string;
  section: SectionKey;
  scenarioId: string;
  nextScore: number;
}): Promise<{ sectionCompleted: boolean }> {
  // Move currentIndex forward, update totals and completed ids.
  const sectionRow = await prisma.challengeSessionSection.findUnique({
    where: {
      sessionId_section: { sessionId: params.sessionId, section: params.section },
    },
    select: {
      id: true,
      currentIndex: true,
      cards: {
        select: { id: true },
      },
      completedScenarioIds: true,
      sectionScoreTotal: true,
    },
  });

  if (!sectionRow) {
    throw new Error(`Missing section row to advance for sessionId=${params.sessionId} section=${params.section}`);
  }

  const totalCards = sectionRow.cards.length;
  const newIndex = sectionRow.currentIndex + 1;
  const completed = newIndex >= totalCards;

  const completedIds = sectionRow.completedScenarioIds
    ? sectionRow.completedScenarioIds.split(",").filter(Boolean)
    : [];

  // Ensure we only append once.
  if (!completedIds.includes(params.scenarioId)) completedIds.push(params.scenarioId);

  await prisma.challengeSessionSection.update({
    where: { id: sectionRow.id },
    data: {
      currentIndex: completed ? sectionRow.currentIndex : newIndex,
      sectionScoreTotal: sectionRow.sectionScoreTotal + clampScore(params.nextScore),
      completedScenarioIds: completedIds.join(","),
    },
  });

  return { sectionCompleted: completed };
}

export async function getNextSection(params: { sessionId: string }): Promise<SectionKey | null> {
  const sections = await prisma.challengeSessionSection.findMany({
    where: { sessionId: params.sessionId },
    select: { section: true, currentIndex: true, cards: { select: { id: true } } },
  });

  const byOrder = SECTION_ORDER.map((s) => sections.find((x) => x.section === s));

  for (const sec of byOrder) {
    if (!sec) continue;
    const total = sec.cards.length;
    if (sec.currentIndex < total) return sec.section as SectionKey;
  }

  return null;
}

