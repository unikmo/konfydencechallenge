import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { EDITION_LABELS, type ChallengeEdition } from "@/lib/challenge/labels";
import type { ChallengeMode } from "@/lib/challenge/sessionGenerator";
import { createChallengeSessionForVisitor } from "@/lib/challenge/startSessionUtil";
import { resolveChallengePlayer, hasEditionAccess } from "@/lib/challenge/resolvePlayer";
import { KF_UID_COOKIE, KF_UID_COOKIE_OPTIONS } from "@/lib/challenge/kfUidCookie";

const EDITIONS = new Set<string>(Object.keys(EDITION_LABELS));
const FREE_DIAGNOSTIC_ROUNDS = 2;

function go(request: NextRequest, destination: string, kfUidToSet: string | null) {
  const response = NextResponse.redirect(new URL(destination, request.url));
  if (kfUidToSet) response.cookies.set(KF_UID_COOKIE, kfUidToSet, KF_UID_COOKIE_OPTIONS);
  return response;
}

export async function GET(request: NextRequest, props: { params: Promise<{ edition: string }> }) {
  const params = await props.params;
  const raw = (params.edition ?? "").toLowerCase();
  if (!EDITIONS.has(raw)) {
    return NextResponse.redirect(new URL("/challenge", request.url));
  }
  const edition = raw as ChallengeEdition;
  const mode: ChallengeMode = request.nextUrl.searchParams.get("mode") === "diagnostic" ? "diagnostic" : "full";
  const here = `/challenge/${edition}/start?mode=${mode}`;

  const player = await resolveChallengePlayer(request);

  if (mode === "diagnostic") {
    // Return to an unfinished round rather than starting a second deck.
    const inProgress = await prisma.challengeSession.findFirst({
      where: { userId: player.playerId, edition, mode, status: "IN_PROGRESS" },
      orderBy: { updatedAt: "desc" },
      select: { id: true },
    });
    if (inProgress) return go(request, `/challenge/session/${inProgress.id}`, player.kfUidToSet);

    const diagnosticCount = await prisma.challengeSession.count({
      where: { userId: player.playerId, mode: "diagnostic" },
    });

    if (diagnosticCount >= FREE_DIAGNOSTIC_ROUNDS) {
      return go(request, `/pricing?edition=${edition}&reason=free-limit`, player.kfUidToSet);
    }

    // Round 1 is anonymous and frictionless. Round 2 needs a confirmed account
    // so the history is anchored to a person, not a cookie.
    if (diagnosticCount >= 1 && !(player.accountId && player.verified)) {
      return go(request, `/account/sign-in?next=${encodeURIComponent(here)}&reason=free-round-2`, player.kfUidToSet);
    }
  }

  if (mode === "full") {
    // The full challenge is always account-anchored: pause, continue, results
    // and your purchase have to follow you across devices.
    if (!(player.accountId && player.verified)) {
      return go(request, `/account/sign-in?next=${encodeURIComponent(here)}&reason=full-challenge`, player.kfUidToSet);
    }

    if (!(await hasEditionAccess(player.playerId, edition))) {
      return go(request, `/pricing?edition=${edition}`, player.kfUidToSet);
    }

    const inProgress = await prisma.challengeSession.findFirst({
      where: { userId: player.playerId, edition, mode, status: "IN_PROGRESS" },
      orderBy: { updatedAt: "desc" },
      select: { id: true },
    });
    if (inProgress) return go(request, `/challenge/session/${inProgress.id}`, player.kfUidToSet);
  }

  const { sessionId } = await createChallengeSessionForVisitor({ kfUid: player.playerId, edition, mode });
  return go(request, `/challenge/session/${sessionId}`, player.kfUidToSet);
}
