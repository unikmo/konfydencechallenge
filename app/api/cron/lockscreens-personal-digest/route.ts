import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendTransactionalEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

// The actual "delivery" mechanism for the Personal engine (Home/Teen Home):
// there's no MDM to push a lock-screen image to a personal device, so a
// customer instead gets a fortnightly email pointing at their phone viewer
// page (/lockscreens/screen/{token}) whenever their rotation flips to a new
// screen. Run once/day via Vercel Cron (see vercel.json) -- this endpoint
// itself is idempotent-ish per run: it only emails tenants whose flip fell
// within roughly the last 24h, so a daily cron catches every flip exactly
// once as long as it doesn't skip a day.
const CADENCE_MS: Record<string, number> = {
  weekly: 7 * 24 * 60 * 60 * 1000,
  fortnightly: 14 * 24 * 60 * 60 * 1000,
  monthly: 30 * 24 * 60 * 60 * 1000,
};
const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const PERSONAL_TRACKS = ["home", "teen"];
const TRACK_LABEL: Record<string, string> = { home: "Home", teen: "Teen Home" };

export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const tenants = await prisma.lockscreenTenant.findMany({
    where: { kind: { in: PERSONAL_TRACKS }, tokenStatus: "active" },
    include: { plan: true },
  });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://konfydence.com";
  let emailed = 0;
  let skipped = 0;

  for (const tenant of tenants) {
    if (!tenant.plan) {
      skipped += 1;
      continue;
    }
    const cadenceMs = CADENCE_MS[tenant.plan.cadence] ?? CADENCE_MS.fortnightly;
    const elapsed = Date.now() - tenant.plan.anchor.getTime();
    const index = Math.floor(elapsed / cadenceMs);
    const sinceLastFlip = elapsed % cadenceMs;

    // index 0 is the signup screen, already covered by the onboarding email.
    if (index <= 0 || sinceLastFlip >= ONE_DAY_MS) {
      skipped += 1;
      continue;
    }

    const screenUrl = `${appUrl}/lockscreens/screen/${tenant.token}`;
    const trackLabel = TRACK_LABEL[tenant.kind] || tenant.kind;
    const sent = await sendTransactionalEmail({
      to: tenant.contactEmail,
      subject: `Your new Konfydence ${trackLabel} screen is ready`,
      tags: ["lockscreens", `${tenant.kind}-digest`],
      html: `
        <div style="font-family:Georgia,'Times New Roman',serif;color:#111417;max-width:520px;">
          <p style="font-size:18px;">A new screen just went live.</p>
          <p>Scam patterns shift, so does your reminder. Grab the new one and update your lock screen:</p>
          <p style="margin:24px 0;">
            <a href="${screenUrl}" style="background:#111417;color:#fffdf9;padding:12px 22px;text-decoration:none;border-radius:4px;display:inline-block;">View your new screen</a>
          </p>
        </div>
      `,
    });
    if (sent) emailed += 1;
  }

  return NextResponse.json({ status: "ok", tenantsChecked: tenants.length, emailed, skipped });
}
