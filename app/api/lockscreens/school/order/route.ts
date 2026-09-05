import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getClientIp } from "@/lib/rateLimit";
import { screenCountOptionsFor, CADENCE_OPTIONS, type ScreenCount, type Cadence } from "@/lib/lockscreens/pricing";
import { defaultSequence } from "@/lib/lockscreens/po";
import { createLockscreenOrder } from "@/lib/lockscreens/orderService";

export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SCREEN_COUNTS = screenCountOptionsFor("school").map((o) => o.value);
const CADENCES = CADENCE_OPTIONS.map((o) => o.value);

export async function POST(request: NextRequest) {
  try {
    const { allowed } = rateLimit(`lockscreen-order:${getClientIp(request)}`, 5, 60_000);
    if (!allowed) {
      return NextResponse.json({ error: "Too many requests, please try again shortly." }, { status: 429 });
    }

    const body = await request.json();
    const orgName = String(body.orgName || "").trim().slice(0, 200);
    const contactName = String(body.contactName || "").trim().slice(0, 120);
    const contactEmail = String(body.contactEmail || "").trim().toLowerCase();
    const billingAddress = String(body.billingAddress || "").trim().slice(0, 600) || null;
    const computerCount = Math.trunc(Number(body.computerCount));
    const screenCount = Number(body.screenCount) as ScreenCount;
    const cadence = String(body.cadence || "fortnightly") as Cadence;
    const notes = String(body.notes || "").trim().slice(0, 1000) || null;
    const customSequenceRaw = Array.isArray(body.sequence) ? body.sequence : null;

    if (!orgName) return NextResponse.json({ error: "School name is required." }, { status: 400 });
    if (!EMAIL_RE.test(contactEmail) || contactEmail.length > 254) {
      return NextResponse.json({ error: "A valid contact email is required." }, { status: 400 });
    }
    if (!Number.isFinite(computerCount) || computerCount < 1 || computerCount > 200_000) {
      return NextResponse.json({ error: "Managed computer count must be between 1 and 200,000." }, { status: 400 });
    }
    if (!SCREEN_COUNTS.includes(screenCount)) {
      return NextResponse.json({ error: "screenCount must be 27, 54, or 60." }, { status: 400 });
    }
    if (!CADENCES.includes(cadence)) {
      return NextResponse.json({ error: "cadence must be fortnightly or weekly." }, { status: 400 });
    }

    let sequence: number[];
    if (customSequenceRaw) {
      const cleaned: number[] = Array.from(new Set(customSequenceRaw.map((n: unknown) => Math.trunc(Number(n)))));
      if (cleaned.length !== screenCount || cleaned.some((n) => !Number.isFinite(n) || n < 1 || n > 60)) {
        return NextResponse.json(
          { error: `Custom selection must contain exactly ${screenCount} distinct screens, numbered 1-60.` },
          { status: 400 }
        );
      }
      sequence = cleaned;
    } else {
      sequence = defaultSequence(screenCount);
    }

    const result = await createLockscreenOrder({
      tier: "school",
      orgName,
      contactName: contactName || null,
      contactEmail,
      billingAddress,
      unitCount: computerCount,
      screenCount,
      cadence,
      sequence,
      notes,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Lockscreen order error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
