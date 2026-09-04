import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit, getClientIp } from "@/lib/rateLimit";
import { sendTransactionalEmail, escapeHtml } from "@/lib/email";
import { computeWorkplaceQuote, SCREEN_COUNT_OPTIONS, CADENCE_OPTIONS, formatUsd, type ScreenCount, type Cadence } from "@/lib/lockscreens/pricing";
import { generatePoNumber, generateTenantToken, generateAdminToken, defaultSequence } from "@/lib/lockscreens/po";

export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SCREEN_COUNTS = SCREEN_COUNT_OPTIONS.map((o) => o.value);
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
    const employeeCount = Math.trunc(Number(body.employeeCount));
    const screenCount = Number(body.screenCount) as ScreenCount;
    const cadence = String(body.cadence || "fortnightly") as Cadence;
    const notes = String(body.notes || "").trim().slice(0, 1000) || null;
    const customSequenceRaw = Array.isArray(body.sequence) ? body.sequence : null;

    if (!orgName) return NextResponse.json({ error: "Organisation name is required." }, { status: 400 });
    if (!EMAIL_RE.test(contactEmail) || contactEmail.length > 254) {
      return NextResponse.json({ error: "A valid contact email is required." }, { status: 400 });
    }
    if (!Number.isFinite(employeeCount) || employeeCount < 1 || employeeCount > 200_000) {
      return NextResponse.json({ error: "Employee count must be between 1 and 200,000." }, { status: 400 });
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

    const quote = computeWorkplaceQuote(employeeCount, screenCount, cadence);
    const poNumber = generatePoNumber();
    const token = generateTenantToken();
    const adminToken = generateAdminToken();
    const now = new Date();
    const termEnd = new Date(now);
    termEnd.setFullYear(termEnd.getFullYear() + 1);

    const tenant = await prisma.lockscreenTenant.create({
      data: {
        kind: "workplace",
        orgName,
        token,
        tokenStatus: "pending", // flips to "active" once the PO is confirmed
        adminToken,
        licensedCount: employeeCount,
        contactName: contactName || null,
        contactEmail,
        termStart: now,
        termEnd,
        plan: {
          create: {
            sequence,
            screenCount,
            cadence,
            anchor: now,
          },
        },
      },
    });

    const order = await prisma.lockscreenOrder.create({
      data: {
        poNumber,
        tenantId: tenant.id,
        orgName,
        contactName: contactName || null,
        contactEmail,
        billingAddress,
        employeeCount,
        screenCount,
        cadence,
        sequence,
        baseRatePerHead: quote.baseRatePerHead,
        surchargePerHead: quote.surchargePerHead,
        ratePerHead: quote.ratePerHead,
        annualTotal: quote.annualTotal,
        minimumApplied: quote.minimumApplied,
        status: "quote_issued",
        notes: quote.needsSalesReview
          ? [notes, "Non-standard cadence — needs sales pricing review before confirmation."]
              .filter(Boolean)
              .join(" | ")
          : notes,
      },
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://konfydence.com";
    const poUrl = `${appUrl}/lockscreens/workplace/po/${order.id}`;
    const adminUrl = `${appUrl}/lockscreens/workplace/admin/${adminToken}`;

    const emailHtml = `
      <div style="font-family:Georgia,'Times New Roman',serif;color:#111417;max-width:520px;">
        <p style="font-size:18px;">Purchase order ${escapeHtml(poNumber)} is ready.</p>
        <p>Konfydence Lockscreens — Workplace, ${employeeCount.toLocaleString()} employees, ${screenCount} screens, ${cadence}.</p>
        <p style="margin:20px 0;font-size:22px;">${formatUsd(quote.annualTotal)}<span style="font-size:13px;color:#66645f;"> / year</span></p>
        <p style="margin:24px 0;">
          <a href="${poUrl}" style="background:#111417;color:#fffdf9;padding:12px 22px;text-decoration:none;border-radius:4px;display:inline-block;margin-right:10px;">View purchase order</a>
          <a href="${adminUrl}" style="background:transparent;color:#111417;border:1px solid #111417;padding:11px 20px;text-decoration:none;border-radius:4px;display:inline-block;">Manage your screens</a>
        </p>
        <p style="font-size:12px;color:#66645f;">Bookmark the "Manage your screens" link — it's your private admin, no password needed. Keep it out of forwarded threads.</p>
        ${quote.needsSalesReview ? `<p style="font-size:13px;color:#a66d00;">This order includes a non-standard cadence — a Konfydence rep will follow up to confirm final pricing before the licence activates.</p>` : ""}
      </div>
    `;

    await sendTransactionalEmail({
      to: contactEmail,
      subject: `Konfydence Lockscreens — Purchase order ${poNumber}`,
      tags: ["lockscreens", "workplace-po"],
      html: emailHtml,
    });

    const salesNotify = process.env.LOCKSCREENS_SALES_EMAIL;
    if (salesNotify) {
      await sendTransactionalEmail({
        to: salesNotify,
        subject: `New Workplace lockscreens order — ${poNumber} (${orgName})`,
        tags: ["lockscreens", "workplace-po", "internal"],
        html: emailHtml,
      });
    }

    return NextResponse.json({ id: order.id, poNumber, poUrl, adminUrl });
  } catch (error) {
    console.error("Lockscreen order error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
