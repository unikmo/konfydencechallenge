import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";
import { EDITION_LABELS, type ChallengeEdition } from "@/lib/challenge/labels";
import type { ChallengeMode } from "@/lib/challenge/sessionGenerator";
import { createChallengeSessionForVisitor } from "@/lib/challenge/startSessionUtil";

const EDITIONS = new Set<string>(Object.keys(EDITION_LABELS));

const KF_UID_COOKIE_OPTIONS = {
  httpOnly: false, // Client JS needs to read it (matches api/checkout/create's cookie).
  sameSite: "lax" as const,
  maxAge: 60 * 60 * 24 * 365, // 1 year
  path: "/",
};

// This used to be a page.tsx (plain Server Component). It's now a route handler
// because assigning every visitor a stable kf_uid cookie — the same identifier
// already used for entitlements/checkout — requires setting a cookie, and Next.js
// only allows cookie mutation from Route Handlers or Server Actions, not from a
// page's render. Without a per-visitor id, every free/diagnostic play was being
// attributed to one shared placeholder user (see startSessionUtil.ts), which broke
// per-visitor "don't repeat a scenario" logic. The URL shape is unchanged, so no
// links elsewhere in the app needed updating.
export async function GET(request: NextRequest, { params }: { params: { edition: string } }) {
  const raw = (params.edition ?? "").toLowerCase();

  if (!EDITIONS.has(raw)) {
    return NextResponse.redirect(new URL("/challenge", request.url));
  }

  const edition = raw as ChallengeEdition;
  const modeParam = request.nextUrl.searchParams.get("mode");
  const mode: ChallengeMode = modeParam === "diagnostic" ? "diagnostic" : "full";

  const existingKfUid = request.cookies.get("kf_uid")?.value;
  const kfUid = existingKfUid ?? randomUUID();

  if (mode === "full") {
    const user = await prisma.user.findUnique({
      where: { id: kfUid },
      include: { entitlements: { where: { status: "active" } } },
    });

    const hasAccess = !!user?.entitlements?.some(
      (e) => e.tier === "unlimited" || (e.tier === "single" && e.edition === edition)
    );

    if (!hasAccess) {
      const res = NextResponse.redirect(new URL(`/pricing?edition=${edition}`, request.url));
      if (!existingKfUid) res.cookies.set("kf_uid", kfUid, KF_UID_COOKIE_OPTIONS);
      return res;
    }
  }

  const { sessionId } = await createChallengeSessionForVisitor({ kfUid, edition, mode });

  const res = NextResponse.redirect(new URL(`/challenge/session/${sessionId}`, request.url));
  if (!existingKfUid) res.cookies.set("kf_uid", kfUid, KF_UID_COOKIE_OPTIONS);
  return res;
}
