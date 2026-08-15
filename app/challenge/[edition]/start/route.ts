import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { EDITION_LABELS, type ChallengeEdition } from "@/lib/challenge/labels";
import type { ChallengeMode } from "@/lib/challenge/sessionGenerator";
import {
  createChallengeSessionForVisitor,
  ensureVisitorUser,
  isGuestEmail,
} from "@/lib/challenge/startSessionUtil";

const EDITIONS = new Set<string>(Object.keys(EDITION_LABELS));
const FREE_DIAGNOSTIC_ROUNDS = 2;

const KF_UID_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 60 * 60 * 24 * 365,
  path: "/",
};

function redirectWithVisitorCookie(
  request: NextRequest,
  destination: string,
  kfUid: string,
  existingKfUid: string | undefined
) {
  const response = NextResponse.redirect(new URL(destination, request.url));
  if (!existingKfUid) response.cookies.set("kf_uid", kfUid, KF_UID_COOKIE_OPTIONS);
  return response;
}

export async function GET(request: NextRequest, props: { params: Promise<{ edition: string }> }) {
  const params = await props.params;
  const raw = (params.edition ?? "").toLowerCase();

  if (!EDITIONS.has(raw)) {
    return NextResponse.redirect(new URL("/challenge", request.url));
  }

  const edition = raw as ChallengeEdition;
  const modeParam = request.nextUrl.searchParams.get("mode");
  const mode: ChallengeMode = modeParam === "diagnostic" ? "diagnostic" : "full";
  const existingKfUid = request.cookies.get("kf_uid")?.value;
  const kfUid = existingKfUid ?? randomUUID();
  const user = await ensureVisitorUser(kfUid);

  if (mode === "diagnostic") {
    // Never create a duplicate round when the player has paused or refreshed.
    const inProgress = await prisma.challengeSession.findFirst({
      where: { userId: user.id, edition, mode, status: "IN_PROGRESS" },
      orderBy: { updatedAt: "desc" },
      select: { id: true },
    });

    if (inProgress) {
      return redirectWithVisitorCookie(
        request,
        `/challenge/session/${inProgress.id}`,
        kfUid,
        existingKfUid
      );
    }

    const diagnosticCount = await prisma.challengeSession.count({
      where: { userId: user.id, mode: "diagnostic" },
    });

    if (diagnosticCount >= FREE_DIAGNOSTIC_ROUNDS) {
      return redirectWithVisitorCookie(
        request,
        `/pricing?edition=${edition}&reason=free-limit`,
        kfUid,
        existingKfUid
      );
    }

    // The second 8-scenario readiness check is an email-capture benefit, not an
    // anonymous replay. The first round remains frictionless.
    if (diagnosticCount >= 1 && isGuestEmail(user.email)) {
      const next = `/challenge/${edition}/start?mode=diagnostic`;
      return redirectWithVisitorCookie(
        request,
        `/challenge/register?next=${encodeURIComponent(next)}`,
        kfUid,
        existingKfUid
      );
    }
  }

  if (mode === "full") {
    const hasAccess = !!(await prisma.entitlement.findFirst({
      where: {
        userId: user.id,
        status: "active",
        OR: [
          { tier: "unlimited" },
          { tier: "single", edition },
        ],
      },
      select: { id: true },
    }));

    if (!hasAccess) {
      return redirectWithVisitorCookie(
        request,
        `/pricing?edition=${edition}`,
        kfUid,
        existingKfUid
      );
    }

    const inProgress = await prisma.challengeSession.findFirst({
      where: { userId: user.id, edition, mode, status: "IN_PROGRESS" },
      orderBy: { updatedAt: "desc" },
      select: { id: true },
    });

    if (inProgress) {
      return redirectWithVisitorCookie(
        request,
        `/challenge/session/${inProgress.id}`,
        kfUid,
        existingKfUid
      );
    }
  }

  const { sessionId } = await createChallengeSessionForVisitor({
    kfUid,
    edition,
    mode,
  });

  return redirectWithVisitorCookie(
    request,
    `/challenge/session/${sessionId}`,
    kfUid,
    existingKfUid
  );
}
