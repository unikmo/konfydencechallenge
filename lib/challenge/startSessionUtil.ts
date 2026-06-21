import { prisma } from "@/lib/prisma";
import {
  createChallengeSessionWithCardOrder,
  type ChallengeEdition,
} from "@/lib/challenge/sessionGenerator";

export async function createPlaceholderUserAndSession(params: {
  edition: ChallengeEdition;
}) {
  // Minimal placeholder user so the game can run without auth in V1.
const placeholderEmail = "guest@local.konfydence";

  const user = await prisma.user.upsert({
    where: { email: placeholderEmail },
    update: {},
    create: { email: placeholderEmail },
    select: { id: true },
  });

  const { sessionId } = await createChallengeSessionWithCardOrder({
    userId: user.id,
    edition: params.edition,
  });

  return { sessionId };
}

