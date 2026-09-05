import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getClientIp } from "@/lib/rateLimit";
import { screenCountOptionsFor, CADENCE_OPTIONS, type ScreenCount, type Cadence } from "@/lib/lockscreens/pricing";
import { requoteLockscreenPlan } from "@/lib/lockscreens/adminService";

export const dynamic = "force-dynamic";

const SCREEN_COUNTS = screenCountOptionsFor("workplace").map((o) => o.value);
const CADENCES = CADENCE_OPTIONS.map((o) => o.value);

export async function POST(request: NextRequest, { params }: { params: Promise<{ adminToken: string }> }) {
  try {
    const { allowed } = rateLimit(`lockscreen-requote:${getClientIp(request)}`, 10, 60_000);
    if (!allowed) {
      return NextResponse.json({ error: "Too many requests, please try again shortly." }, { status: 429 });
    }

    const { adminToken } = await params;
    const body = await request.json();
    const screenCount = Number(body.screenCount) as ScreenCount;
    const cadence = String(body.cadence || "fortnightly") as Cadence;

    if (!SCREEN_COUNTS.includes(screenCount)) {
      return NextResponse.json({ error: "screenCount must be 27, 54, or 60." }, { status: 400 });
    }
    if (!CADENCES.includes(cadence)) {
      return NextResponse.json({ error: "cadence must be fortnightly or weekly." }, { status: 400 });
    }

    const result = await requoteLockscreenPlan("workplace", adminToken, { screenCount, cadence });
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }
    return NextResponse.json({ poUrl: result.poUrl });
  } catch (error) {
    console.error("Lockscreen requote error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
