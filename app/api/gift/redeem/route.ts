import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";
import { ensureVisitorUser } from "@/lib/challenge/startSessionUtil";
import { rateLimit, getClientIp } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 60 * 60 * 24 * 365,
  path: "/",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    const { allowed } = rateLimit(`gift-redeem:${getClientIp(request)}`, 10, 60_000);
    if (!allowed) {
      return NextResponse.json({ error: "Too many attempts, please try again shortly." }, { status: 429 });
    }

    const body = await request.json().catch(() => ({}));
    const code = String(body.code || "").trim().toUpperCase();
    const email = String(body.email || "").trim().toLowerCase();

    if (!code) {
      return NextResponse.json({ error: "A gift code is required." }, { status: 400 });
    }
    if (email && !EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "That email address does not look right." }, { status: 400 });
    }

    const gift = await prisma.giftCode.findUnique({ where: { code } });
    if (!gift) {
      return NextResponse.json({ error: "We could not find that gift code." }, { status: 404 });
    }
    if (gift.status === "revoked") {
      return NextResponse.json({ error: "This gift is no longer active." }, { status: 410 });
    }
    if (gift.status === "redeemed") {
      return NextResponse.json({ error: "This gift has already been claimed." }, { status: 409 });
    }

    const cookieStore = await cookies();
    const existingKfUid = cookieStore.get("kf_uid")?.value;
    const kfUid = existingKfUid ?? randomUUID();
    const user = await ensureVisitorUser(kfUid);

    if (email) {
      const clash = await prisma.user.findUnique({ where: { email }, select: { id: true } });
      if (!clash || clash.id === user.id) {
        await prisma.user.update({ where: { id: user.id }, data: { email } });
      }
    }

    const redeemOrderId = `gift:${gift.code}`;

    await prisma.$transaction([
      prisma.entitlement.upsert({
        where: { shopifyOrderId: redeemOrderId },
        update: { status: "active", tier: gift.tier, edition: gift.edition },
        create: {
          userId: user.id,
          tier: gift.tier,
          edition: gift.edition,
          source: "gift",
          shopifyOrderId: redeemOrderId,
          status: "active",
        },
      }),
      prisma.giftCode.update({
        where: { id: gift.id },
        data: { status: "redeemed", redeemedByUserId: user.id, redeemedAt: new Date() },
      }),
    ]);

    const response = NextResponse.json({ tier: gift.tier, edition: gift.edition });
    if (!existingKfUid) response.cookies.set("kf_uid", kfUid, COOKIE_OPTIONS);
    return response;
  } catch (error) {
    console.error("Gift redeem error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
