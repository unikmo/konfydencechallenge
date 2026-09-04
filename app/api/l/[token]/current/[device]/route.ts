import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Stateless rotating-URL resolver — see docs/LOCKSCREENS_ARCHITECTURE.md §4.
// GET /api/l/{token}/current/{device} -> redirects to the asset image that
// should be showing right now for this tenant, with no scheduler/cron: the
// current screen is a pure function of elapsed time since the plan anchor.
//
// Only the "desktop" device class has an ingested image today (see
// scripts/ingest-lockscreen-assets.ts). Other device classes (notebook,
// tablet-landscape, tablet-portrait) return 501 until those formats are
// pulled into a real asset host.
const CADENCE_MS: Record<string, number> = {
  weekly: 7 * 24 * 60 * 60 * 1000,
  fortnightly: 14 * 24 * 60 * 60 * 1000,
  monthly: 30 * 24 * 60 * 60 * 1000,
};

const SUPPORTED_DEVICES = new Set(["desktop"]);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string; device: string }> }
) {
  const { token, device } = await params;

  const tenant = await prisma.lockscreenTenant.findUnique({
    where: { token },
    include: { plan: true },
  });

  if (!tenant || tenant.tokenStatus !== "active" || !tenant.plan) {
    return NextResponse.json({ error: "This lockscreen link is not active." }, { status: 404 });
  }

  if (!SUPPORTED_DEVICES.has(device)) {
    return NextResponse.json(
      { error: `Device class '${device}' is not wired to a real asset yet. Only 'desktop' is live.` },
      { status: 501 }
    );
  }

  const plan = tenant.plan;
  const cadenceMs = CADENCE_MS[plan.cadence] ?? CADENCE_MS.fortnightly;
  const elapsed = Date.now() - plan.anchor.getTime();
  const index = Math.floor(elapsed / cadenceMs);
  const position = plan.loop
    ? ((index % plan.sequence.length) + plan.sequence.length) % plan.sequence.length
    : Math.min(Math.max(index, 0), plan.sequence.length - 1);
  const assetNumber = plan.sequence[position];

  const asset = await prisma.lockscreenAsset.findUnique({
    where: { track_number: { track: tenant.kind, number: assetNumber } },
  });
  if (!asset) {
    return NextResponse.json({ error: "Current screen could not be resolved." }, { status: 500 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://konfydence.com";
  const redirectUrl = new URL(asset.imagePath, appUrl);

  // Short cache: fortnightly cadence can afford hours of staleness without
  // anyone noticing a flip landing late.
  const response = NextResponse.redirect(redirectUrl, 302);
  response.headers.set("Cache-Control", "public, max-age=3600");
  return response;
}
