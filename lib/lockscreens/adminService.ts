import { prisma } from "@/lib/prisma";
import { sendTransactionalEmail, escapeHtml } from "@/lib/email";
import { computeQuote, formatUsd, type Tier, type ScreenCount, type Cadence } from "@/lib/lockscreens/pricing";
import { generatePoNumber } from "@/lib/lockscreens/po";

export type PlanUpdateResult =
  | { ok: true; sequence: number[]; screenCount: number; cadence: string }
  | { ok: false; status: number; error: string };

/** Self-serve plan edit: sequence/screenCount/cadence. Never touches billing. */
export async function updateLockscreenPlan(
  tier: Tier,
  adminToken: string,
  input: { sequence: number[]; screenCount: ScreenCount; cadence: Cadence }
): Promise<PlanUpdateResult> {
  const tenant = await prisma.lockscreenTenant.findUnique({ where: { adminToken }, include: { plan: true } });
  if (!tenant || !tenant.plan || tenant.kind !== tier) {
    return { ok: false, status: 404, error: "Not found." };
  }

  const { sequence, screenCount, cadence } = input;
  if (sequence.length !== screenCount || sequence.some((n) => !Number.isFinite(n) || n < 1 || n > 60)) {
    return { ok: false, status: 400, error: `Sequence must contain exactly ${screenCount} distinct screens, numbered 1-60.` };
  }

  const liveNumbers = new Set(
    (await prisma.lockscreenAsset.findMany({ where: { status: "live", track: tier }, select: { number: true } })).map((a) => a.number)
  );
  if (sequence.some((n) => !liveNumbers.has(n))) {
    return { ok: false, status: 400, error: "Sequence references a screen that is no longer in the library." };
  }

  const updated = await prisma.lockscreenPlan.update({
    where: { tenantId: tenant.id },
    data: { sequence, screenCount, cadence },
  });

  return { ok: true, sequence: updated.sequence, screenCount: updated.screenCount, cadence: updated.cadence };
}

export type RequoteResult = { ok: true; poUrl: string } | { ok: false; status: number; error: string };

/** Plan change that moves the rate: issues a fresh numbered PO on the same tenant instead of re-billing silently. */
export async function requoteLockscreenPlan(
  tier: Tier,
  adminToken: string,
  input: { screenCount: ScreenCount; cadence: Cadence }
): Promise<RequoteResult> {
  const tenant = await prisma.lockscreenTenant.findUnique({ where: { adminToken }, include: { plan: true } });
  if (!tenant || !tenant.plan || tenant.kind !== tier) {
    return { ok: false, status: 404, error: "Not found." };
  }

  const { screenCount, cadence } = input;
  const quote = computeQuote(tier, tenant.licensedCount, screenCount, cadence);
  const poNumber = generatePoNumber(tier);

  const order = await prisma.lockscreenOrder.create({
    data: {
      poNumber,
      tenantId: tenant.id,
      orgName: tenant.orgName,
      contactName: tenant.contactName,
      contactEmail: tenant.contactEmail,
      employeeCount: tenant.licensedCount,
      screenCount,
      cadence,
      sequence: tenant.plan.sequence.length === screenCount ? tenant.plan.sequence : tenant.plan.sequence.slice(0, screenCount),
      baseRatePerHead: quote.baseRatePerUnit,
      surchargePerHead: quote.surchargePerUnit,
      ratePerHead: quote.ratePerUnit,
      annualTotal: quote.annualTotal,
      minimumApplied: quote.minimumApplied,
      status: "quote_issued",
      notes: quote.needsSalesReview
        ? "Plan change requested from self-serve admin. Needs sales pricing review before confirmation."
        : "Plan change requested from self-serve admin.",
    },
  });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://konfydence.com";
  const poUrl = `${appUrl}/lockscreens/${tier}/po/${order.id}`;

  await sendTransactionalEmail({
    to: tenant.contactEmail,
    subject: `Konfydence Lockscreens — Updated purchase order ${poNumber}`,
    tags: ["lockscreens", `${tier}-po`, "requote"],
    html: `
      <div style="font-family:Georgia,'Times New Roman',serif;color:#111417;max-width:520px;">
        <p style="font-size:18px;">Updated purchase order ${escapeHtml(poNumber)} for ${escapeHtml(tenant.orgName)}.</p>
        <p style="margin:20px 0;font-size:22px;">${formatUsd(quote.annualTotal)}<span style="font-size:13px;color:#66645f;"> / year</span></p>
        <p style="margin:24px 0;">
          <a href="${poUrl}" style="background:#111417;color:#fffdf9;padding:12px 22px;text-decoration:none;border-radius:4px;display:inline-block;">View purchase order</a>
        </p>
      </div>
    `,
  });

  return { ok: true, poUrl };
}
