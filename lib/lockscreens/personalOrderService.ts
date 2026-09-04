// Personal Delivery Engine order fulfillment -- Home / Teen Home.
//
// Unlike Workplace/School (quote -> auto-PO -> human confirms payment ->
// licence activates), Home/Teen is a flat-fee Shopify purchase: Shopify has
// already collected payment (one-time first year, then an annual
// subscription renewal via a selling plan) by the time this runs, so the
// licence activates immediately -- no PO, no manual activate step.
//
// Delivery is phone-only (see docs/LOCKSCREENS_ARCHITECTURE.md and the
// user's 2026-09-04 decision): there's no MDM to push a lock-screen image to
// a personal device, so the "delivery" mechanism is a fortnightly email
// (see scripts wired via app/api/cron/lockscreens-personal-digest) linking
// to a phone-friendly viewer page the customer saves as their wallpaper by
// hand. Screen count is fixed at 27, fixed order, no reshuffling.
import homeManifest from "@/data/lockscreens/home-27.json";
import teenManifest from "@/data/lockscreens/teen-27.json";
import { prisma } from "@/lib/prisma";
import { sendTransactionalEmail, escapeHtml } from "@/lib/email";
import { generateTenantToken, generateAdminToken } from "@/lib/lockscreens/po";

export type PersonalTrack = "home" | "teen";

const MANIFESTS: Record<PersonalTrack, { number: number }[]> = {
  home: homeManifest,
  teen: teenManifest,
};

const TRACK_LABEL: Record<PersonalTrack, string> = {
  home: "Home",
  teen: "Teen Home",
};

// First-year vs renewal pricing, per lib/shopify/testData.ts SHOPIFY_PRODUCTS.
const FIRST_YEAR_PRICE = 19.99;
const RENEWAL_PRICE = 14.99;

export type CreatePersonalTenantInput = {
  track: PersonalTrack;
  shopifyOrderId: string;
  contactEmail: string;
  contactName: string | null;
  /** true on a subscription renewal order, false/undefined on the first purchase. */
  isRenewal?: boolean;
};

export type CreatePersonalTenantResult = { tenantId: string; token: string; screenUrl: string } | null;

/** Idempotent: a retried webhook for the same shopifyOrderId is a no-op. */
export async function createPersonalLockscreenTenant(input: CreatePersonalTenantInput): Promise<CreatePersonalTenantResult> {
  const { track, shopifyOrderId, contactEmail, contactName, isRenewal } = input;

  const existingOrder = await prisma.lockscreenOrder.findUnique({ where: { shopifyOrderId } });
  if (existingOrder) {
    console.log(`Personal lockscreens order already fulfilled for Shopify order ${shopifyOrderId}`);
    return null;
  }

  const manifest = MANIFESTS[track];
  const sequence = manifest.map((entry) => entry.number);

  const now = new Date();
  const termEnd = new Date(now);
  termEnd.setFullYear(termEnd.getFullYear() + 1);

  // Renewal orders reuse the existing tenant/plan (same token, same
  // rotation anchor) rather than minting a new one -- the customer's
  // delivery link must not change on renewal.
  let tenant = await prisma.lockscreenTenant.findFirst({
    where: { kind: track, contactEmail },
    orderBy: { createdAt: "desc" },
  });

  if (tenant && isRenewal) {
    tenant = await prisma.lockscreenTenant.update({
      where: { id: tenant.id },
      data: { tokenStatus: "active", termEnd },
    });
  } else {
    tenant = await prisma.lockscreenTenant.create({
      data: {
        kind: track,
        orgName: contactName || "Personal",
        token: generateTenantToken(),
        tokenStatus: "active",
        adminToken: generateAdminToken(),
        licensedCount: 1,
        contactName,
        contactEmail,
        termStart: now,
        termEnd,
        plan: { create: { sequence, screenCount: sequence.length, cadence: "fortnightly", anchor: now } },
      },
    });
  }

  const poNumber = `PER-${track.toUpperCase()}-${shopifyOrderId}`;
  await prisma.lockscreenOrder.create({
    data: {
      poNumber,
      shopifyOrderId,
      tenantId: tenant.id,
      orgName: tenant.orgName,
      contactName,
      contactEmail,
      employeeCount: 1,
      screenCount: sequence.length,
      cadence: "fortnightly",
      sequence,
      baseRatePerHead: isRenewal ? RENEWAL_PRICE : FIRST_YEAR_PRICE,
      ratePerHead: isRenewal ? RENEWAL_PRICE : FIRST_YEAR_PRICE,
      annualTotal: isRenewal ? RENEWAL_PRICE : FIRST_YEAR_PRICE,
      status: "confirmed",
    },
  });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://konfydence.com";
  const screenUrl = `${appUrl}/lockscreens/screen/${tenant.token}`;
  const trackLabel = TRACK_LABEL[track];

  if (!isRenewal) {
    await sendTransactionalEmail({
      to: contactEmail,
      subject: `Konfydence ${trackLabel} Lockscreens — you're set up`,
      tags: ["lockscreens", `${track}-personal`],
      html: `
        <div style="font-family:Georgia,'Times New Roman',serif;color:#111417;max-width:520px;">
          <p style="font-size:18px;">Your ${escapeHtml(trackLabel)} lock-screen reminders are active.</p>
          <p>Every two weeks we'll email you the next screen. For now, save your first one as your phone's lock screen:</p>
          <p style="margin:24px 0;">
            <a href="${screenUrl}" style="background:#111417;color:#fffdf9;padding:12px 22px;text-decoration:none;border-radius:4px;display:inline-block;">Get your first screen</a>
          </p>
          <p style="font-size:13px;color:#66645f;">
            <strong>iPhone:</strong> open the link, press and hold the image, tap "Save Image," then Settings &rarr; Wallpaper &rarr; Add New Wallpaper.<br/>
            <strong>Android:</strong> open the link, tap and hold the image, tap "Download," then Settings &rarr; Wallpaper &rarr; pick the saved image.
          </p>
          <p style="font-size:12px;color:#66645f;">Bookmark this link — it always shows your current screen: ${screenUrl}</p>
        </div>
      `,
    });
  }

  return { tenantId: tenant.id, token: tenant.token, screenUrl };
}

/** Expires a personal tenant's licence on cancellation/refund. Idempotent. */
export async function revokePersonalLockscreenTenant(shopifyOrderId: string) {
  const order = await prisma.lockscreenOrder.findUnique({ where: { shopifyOrderId }, include: { tenant: true } });
  if (!order || !order.tenant) return;
  await prisma.lockscreenTenant.update({ where: { id: order.tenant.id }, data: { tokenStatus: "expired" } });
  await prisma.lockscreenOrder.update({ where: { id: order.id }, data: { status: "cancelled" } });
}
