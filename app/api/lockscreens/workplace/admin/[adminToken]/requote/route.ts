import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit, getClientIp } from "@/lib/rateLimit";
import { sendTransactionalEmail, escapeHtml } from "@/lib/email";
import { computeWorkplaceQuote, SCREEN_COUNT_OPTIONS, CADENCE_OPTIONS, formatUsd, type ScreenCount, type Cadence } from "@/lib/lockscreens/pricing";
import { generatePoNumber } from "@/lib/lockscreens/po";

export const dynamic = "force-dynamic";

const SCREEN_COUNTS = SCREEN_COUNT_OPTIONS.map((o) => o.value);
const CADENCES = CADENCE_OPTIONS.map((o) => o.value);

// A plan-driven re-quote: the admin changed screenCount/cadence to something
// that changes the rate, so we issue a fresh PO against the same tenant
// rather than silently re-billing. Confirming it is still a human step.
export async function POST(request: NextRequest, { params }: { params: Promise<{ adminToken: string }> }) {
  try {
    const { allowed } = rateLimit(`lockscreen-requote:${getClientIp(request)}`, 10, 60_000);
    if (!allowed) {
      return NextResponse.json({ error: "Too many requests, please try again shortly." }, { status: 429 });
    }

    const { adminToken } = await params;
    const tenant = await prisma.lockscreenTenant.findUnique({
      where: { adminToken },
      include: { plan: true },
    });
    if (!tenant || !tenant.plan) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }

    const body = await request.json();
    const screenCount = Number(body.screenCount) as ScreenCount;
    const cadence = String(body.cadence || tenant.plan.cadence) as Cadence;

    if (!SCREEN_COUNTS.includes(screenCount)) {
      return NextResponse.json({ error: "screenCount must be 27, 54, or 60." }, { status: 400 });
    }
    if (!CADENCES.includes(cadence)) {
      return NextResponse.json({ error: "cadence must be fortnightly or weekly." }, { status: 400 });
    }

    const quote = computeWorkplaceQuote(tenant.licensedCount, screenCount, cadence);
    const poNumber = generatePoNumber();

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
        baseRatePerHead: quote.baseRatePerHead,
        surchargePerHead: quote.surchargePerHead,
        ratePerHead: quote.ratePerHead,
        annualTotal: quote.annualTotal,
        minimumApplied: quote.minimumApplied,
        status: "quote_issued",
        notes: quote.needsSalesReview
          ? "Plan change requested from self-serve admin. Non-standard cadence — needs sales pricing review before confirmation."
          : "Plan change requested from self-serve admin.",
      },
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://konfydence.com";
    const poUrl = `${appUrl}/lockscreens/workplace/po/${order.id}`;

    await sendTransactionalEmail({
      to: tenant.contactEmail,
      subject: `Konfydence Lockscreens — Updated purchase order ${poNumber}`,
      tags: ["lockscreens", "workplace-po", "requote"],
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

    return NextResponse.json({ poUrl });
  } catch (error) {
    console.error("Lockscreen requote error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
