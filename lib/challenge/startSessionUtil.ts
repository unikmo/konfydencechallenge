import { prisma } from "@/lib/prisma";
import {
  createChallengeSessionWithCardOrder,
  type ChallengeEdition,
  type ChallengeMode,
} from "@/lib/challenge/sessionGenerator";

// The stable kf_uid cookie identifies a visitor until they register an email.
export const GUEST_EMAIL_SUFFIX = "@local.konfydence";

export function isGuestEmail(email: string | null | undefined) {
  return !email || email.endsWith(GUEST_EMAIL_SUFFIX);
}

export function guestEmailFor(kfUid: string) {
  return `guest-${kfUid}${GUEST_EMAIL_SUFFIX}`;
}

export async function ensureVisitorUser(kfUid: string) {
  return prisma.user.upsert({
    where: { id: kfUid },
    update: {},
    create: { id: kfUid, email: guestEmailFor(kfUid) },
    select: { id: true, email: true },
  });
}

export async function createChallengeSessionForVisitor(params: {
  kfUid: string;
  edition: ChallengeEdition;
  mode?: ChallengeMode;
}) {
  const user = await ensureVisitorUser(params.kfUid);
  const mode = params.mode ?? "full";

  // Duolingo-style continuation: refreshes and later visits return to the
  // unfinished round instead of silently creating a second deck.
  const existingSession = await prisma.challengeSession.findFirst({
    where: {
      userId: user.id,
      edition: params.edition,
      mode,
      status: "IN_PROGRESS",
    },
    orderBy: { updatedAt: "desc" },
    select: { id: true },
  });

  if (existingSession) return { sessionId: existingSession.id, resumed: true };

  const { sessionId } = await createChallengeSessionWithCardOrder({
    userId: user.id,
    edition: params.edition,
    mode,
  });

  return { sessionId, resumed: false };
}
