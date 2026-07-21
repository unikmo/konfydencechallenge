import { prisma } from "@/lib/prisma";
import {
  createChallengeSessionWithCardOrder,
  type ChallengeEdition,
  type ChallengeMode,
} from "@/lib/challenge/sessionGenerator";

// Finds or creates a per-visitor User row keyed by the kf_uid cookie value (the
// same identifier already used for entitlements/checkout — see api/checkout/create
// and api/entitlements/me). This used to always upsert a single shared
// "guest@local.konfydence" row for every visitor, which meant everyone's play
// history was pooled together — breaking any per-visitor "don't repeat a
// scenario I've already seen" logic and any future per-user history/dashboard.
// No real email is collected in V1, so a synthetic-but-unique placeholder is used.
export async function createChallengeSessionForVisitor(params: {
  kfUid: string;
  edition: ChallengeEdition;
  mode?: ChallengeMode;
}) {
  const user = await prisma.user.upsert({
    where: { id: params.kfUid },
    update: {},
    create: { id: params.kfUid, email: `guest-${params.kfUid}@local.konfydence` },
    select: { id: true },
  });

  const { sessionId } = await createChallengeSessionWithCardOrder({
    userId: user.id,
    edition: params.edition,
    mode: params.mode,
  });

  return { sessionId };
}
