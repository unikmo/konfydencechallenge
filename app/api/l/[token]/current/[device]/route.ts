import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Stateless rotating-URL resolver — see docs/LOCKSCREENS_ARCHITECTURE.md §4.
// GET /api/l/{token}/current/{device} -> redirects to the asset image that
// should be showing right now for this tenant, with no scheduler/cron: the
// current screen is a pure function of elapsed time since the plan anchor.
//
// Device coverage is per track, matching what's actually been ingested:
// Workplace/School are MDM/desktop tracks, ingested across all 5 device
// formats (desktop, notebook 16:10, notebook 3:2, tablet landscape, tablet
// portrait) since MDM can push any of them to an org-owned device.
// Home/Teen are the Personal engine and are phone-only by design (user
// decision 2026-09-04) -- there's no MDM to push a lock-screen image to a
// personal device, and no reason to ship desktop/notebook/tablet renders
// nobody will use, so "phone" is the only device class those tracks ever
// support.
const CADENCE_MS: Record<string, number> = {
  weekly: 7 * 24 * 60 * 60 * 1000,
  fortnightly: 14 * 24 * 60 * 60 * 1000,
  monthly: 30 * 24 * 60 * 60 * 1000,
};

const MDM_DEVICE_FORMATS = ["desktop", "notebook-16x10", "notebook-3x2", "tablet-landscape", "tablet-portrait"];

const SUPPORTED_DEVICES_BY_TRACK: Record<string, Set<string>> = {
  workplace: new Set(MDM_DEVICE_FORMATS),
  school: new Set(MDM_DEVICE_FORMATS),
  home: new Set(["phone"]),
  teen: new Set(["phone"]),
};

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

  const supportedDevices = SUPPORTED_DEVICES_BY_TRACK[tenant.kind];
  if (!supportedDevices || !supportedDevices.has(device)) {
    const supportedList = supportedDevices ? [...supportedDevices].join(", ") : "none";
    return NextResponse.json(
      { error: `Device class '${device}' is not supported for the '${tenant.kind}' track. Supported: ${supportedList}.` },
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
    where: { track_number_format: { track: tenant.kind, number: assetNumber, format: device } },
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
