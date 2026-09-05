import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { normalizeEmail, isValidEmail } from "@/lib/auth/email";
import { findOrCreateAccount } from "@/lib/auth/account";
import { createSession, sessionCookieOptions, hashIp, SESSION_COOKIE_NAME } from "@/lib/auth/session";
import { getClientIp } from "@/lib/auth/request";
import { sendChallengeResultEmail } from "@/lib/challenge/sendResultEmail";
import { isGuestEmail } from "@/lib/challenge/startSessionUtil";

export const dynamic = "force-dynamic";

// The results gate: a player who has finished a free check enters their email
// to receive/see the result. Email at this point signs them in on this device
// (they have proven intent) but does not mark the address verified — that
// happens when they use a sign-in link. Full merge of any duplicate player
// row is stage 3; this handles the clean first-email case.

export async function POST(request: NextRequest, props: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await props.params;
  const form = await request.formData();
  const email = normalizeEmail(String(form.get("email") ?? ""));
  const consent = String(form.get("consent") ?? "");
  const resultsUrl = new URL(`/challenge/session/${sessionId}/results`, request.url);

  const kfUid = request.cookies.get("kf_uid")?.value;
  if (!kfUid) {
    resultsUrl.searchParams.set("claim", "nosession");
    return NextResponse.redirect(resultsUrl);
  }
  if (!isValidEmail(email) || consent !== "yes") {
    resultsUrl.searchParams.set("claim", "invalid");
    return NextResponse.redirect(resultsUrl);
  }

  const session = await prisma.challengeSession.findUnique({
    where: { id: sessionId },
    select: { id: true, userId: true, user: { select: { id: true, email: true } } },
  });
  if (!session || session.userId !== kfUid) {
    resultsUrl.searchParams.set("claim", "nosession");
    return NextResponse.redirect(resultsUrl);
  }

  // Email already used by a different player row -> stage-3 merge territory.
  const otherUser = await prisma.user.findUnique({ where: { email }, select: { id: true } });
  if (otherUser && otherUser.id !== session.userId) {
    resultsUrl.searchParams.set("claim", "used");
    return NextResponse.redirect(resultsUrl);
  }

  // Attach this player to an account (create if needed). Only link the account
  // to this player if it has no player yet, to avoid stealing another's.
  const account = await findOrCreateAccount(email);
  const accountHasPlayer = await prisma.user.findFirst({
    where: { accountId: account.id },
    select: { id: true },
  });

  if (!isGuestEmail(session.user.email) && session.user.email !== email) {
    resultsUrl.searchParams.set("claim", "changed");
    return NextResponse.redirect(resultsUrl);
  }

  await prisma.user.update({
    where: { id: session.userId },
    data: {
      email,
      ...(accountHasPlayer && accountHasPlayer.id !== session.userId ? {} : { accountId: account.id }),
    },
  });

  const ip = getClientIp(request.headers);
  const { token, expiresAt } = await createSession(account.id, {
    userAgent: request.headers.get("user-agent"),
    ipHash: hashIp(ip),
  });

  await sendChallengeResultEmail(sessionId).catch(() => {});

  const response = NextResponse.redirect(resultsUrl);
  response.cookies.set(SESSION_COOKIE_NAME, token, sessionCookieOptions(expiresAt));
  return response;
}
