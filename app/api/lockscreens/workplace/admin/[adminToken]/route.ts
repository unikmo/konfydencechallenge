import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit, getClientIp } from "@/lib/rateLimit";
import { SCREEN_COUNT_OPTIONS, CADENCE_OPTIONS, type ScreenCount, type Cadence } from "@/lib/lockscreens/pricing";

export const dynamic = "force-dynamic";

const SCREEN_COUNTS = SCREEN_COUNT_OPTIONS.map((o) => o.value);
const CADENCES = CADENCE_OPTIONS.map((o) => o.value);

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ adminToken: string }> }) {
  try {
    const { allowed } = rateLimit(`lockscreen-admin:${getClientIp(request)}`, 20, 60_000);
    if (!allowed) {
      return NextResponse.json({ error: "Too many requests, please try again shortly." }, { status: 429 });
    }

    const { adminToken } = await params;
    const tenant = await prisma.lockscreenTenant.findUnique({ where: { adminToken }, include: { plan: true } });
    if (!tenant || !tenant.plan) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }

    const body = await request.json();
    const screenCount = Number(body.screenCount) as ScreenCount;
    const cadence = String(body.cadence || "") as Cadence;
    const sequenceRaw = Array.isArray(body.sequence) ? body.sequence : null;

    if (!SCREEN_COUNTS.includes(screenCount)) {
      return NextResponse.json({ error: "screenCount must be 27, 54, or 60." }, { status: 400 });
    }
    if (!CADENCES.includes(cadence)) {
      return NextResponse.json({ error: "cadence must be fortnightly or weekly." }, { status: 400 });
    }
    if (!sequenceRaw) {
      return NextResponse.json({ error: "sequence is required." }, { status: 400 });
    }

    const sequence: number[] = Array.from(new Set(sequenceRaw.map((n: unknown) => Math.trunc(Number(n)))));
    if (sequence.length !== screenCount || sequence.some((n) => !Number.isFinite(n) || n < 1 || n > 60)) {
      return NextResponse.json(
        { error: `Sequence must contain exactly ${screenCount} distinct screens, numbered 1-60.` },
        { status: 400 }
      );
    }

    const liveNumbers = new Set(
      (await prisma.lockscreenAsset.findMany({ where: { status: "live" }, select: { number: true } })).map((a) => a.number)
    );
    if (sequence.some((n) => !liveNumbers.has(n))) {
      return NextResponse.json({ error: "Sequence references a screen that is no longer in the library." }, { status: 400 });
    }

    const updated = await prisma.lockscreenPlan.update({
      where: { tenantId: tenant.id },
      data: { sequence, screenCount, cadence },
    });

    return NextResponse.json({
      sequence: updated.sequence,
      screenCount: updated.screenCount,
      cadence: updated.cadence,
    });
  } catch (error) {
    console.error("Lockscreen admin update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
