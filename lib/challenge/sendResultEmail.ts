import { randomBytes, createHash } from "crypto";
import { prisma } from "@/lib/prisma";
import { sendTransactionalEmail } from "@/lib/email";
import { computeHackProfile } from "@/lib/scoring/scoringEngine";
import { renderChallengeResultsEmail } from "@/lib/challenge/resultsEmail";
import { isGuestEmail } from "@/lib/challenge/startSessionUtil";
import type { ChallengeEdition } from "@/lib/challenge/labels";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://konfydence.com";
const EDITIONS = new Set<ChallengeEdition>(["school", "university", "family", "travelsafe", "workplace"]);

function unsubscribeUrl(email: string): string {
  const sig = createHash("sha256")
    .update(`${process.env.AUTH_SECRET || process.env.DATABASE_URL || "kf"}\0unsub\0${email}`)
    .digest("base64url")
    .slice(0, 24);
  return `${APP_URL}/account/unsubscribe?e=${encodeURIComponent(email)}&s=${sig}`;
}

/**
 * Send the results email for a completed challenge session. Idempotent — a
 * session is only emailed once (guarded by resultEmailedAt). No-op for a
 * still-anonymous session (no real email to send to).
 */
export async function sendChallengeResultEmail(sessionId: string): Promise<void> {
  const session = await prisma.challengeSession.findUnique({
    where: { id: sessionId },
    select: {
      id: true,
      edition: true,
      mode: true,
      status: true,
      scoreTotal: true,
      scoreMax: true,
      resultEmailedAt: true,
      user: { select: { email: true } },
    },
  });
  if (!session || session.status !== "COMPLETED") return;
  if (session.resultEmailedAt) return;
  if (isGuestEmail(session.user.email)) return;
  if (!EDITIONS.has(session.edition as ChallengeEdition)) return;

  const cards = await prisma.challengeSessionCard.findMany({
    where: { sessionId },
    select: { score: true, scenario: { select: { hackKey: true } } },
  });
  const hackProfile = computeHackProfile(cards.map((c) => ({ hackKey: c.scenario.hackKey, score: c.score })));

  const { subject, html } = renderChallengeResultsEmail({
    toEmail: session.user.email,
    edition: session.edition as ChallengeEdition,
    mode: session.mode === "diagnostic" ? "diagnostic" : "full",
    scoreTotal: session.scoreTotal,
    scoreMax: session.scoreMax,
    hackProfile,
    resultsPath: `/challenge/session/${session.id}/results`,
    accountUrl: `${APP_URL}/account/sign-in?email=${encodeURIComponent(session.user.email)}`,
    unsubscribeUrl: unsubscribeUrl(session.user.email),
  });

  const sent = await sendTransactionalEmail({
    to: session.user.email,
    subject,
    html,
    tags: ["challenge", "results", session.mode === "diagnostic" ? "diagnostic" : "full"],
  });

  if (sent) {
    await prisma.challengeSession.update({
      where: { id: sessionId },
      data: { resultEmailedAt: new Date() },
    });
  }
}

/** A short opaque token, handy for callers that need a nonce. */
export function newOpaqueToken(): string {
  return randomBytes(18).toString("base64url");
}
