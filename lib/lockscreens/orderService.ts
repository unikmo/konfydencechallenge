import { prisma } from "@/lib/prisma";
import { sendTransactionalEmail, escapeHtml } from "@/lib/email";
import { computeQuote, formatMoney, TIER_CONFIG, UNIT_LABELS_DE, type Tier, type ScreenCount, type Cadence, type LsLang } from "@/lib/lockscreens/pricing";
import { generatePoNumber, generateTenantToken, generateAdminToken } from "@/lib/lockscreens/po";
import { createInvoiceForOrder, type InvoiceResult } from "@/lib/lockscreens/stripeInvoice";

export type CreateOrderInput = {
  tier: Tier;
  orgName: string;
  contactName: string | null;
  contactEmail: string;
  billingAddress: string | null;
  unitCount: number;
  screenCount: ScreenCount;
  cadence: Cadence;
  sequence: number[];
  notes: string | null;
  /** Language of the order flow; German orders are priced in EUR and sent German emails + /de pages. */
  lang?: LsLang;
};

export type CreateOrderResult = { id: string; poNumber: string; poUrl: string; adminUrl: string };

/** Mints a tenant + plan + numbered PO for a new Lockscreens order and emails it. Shared by both tiers. */
export async function createLockscreenOrder(input: CreateOrderInput): Promise<CreateOrderResult> {
  const { tier, orgName, contactName, contactEmail, billingAddress, unitCount, screenCount, cadence, sequence, notes } = input;
  const lang: LsLang = input.lang === "de" ? "de" : "en";
  const config = TIER_CONFIG[tier];
  const quote = computeQuote(tier, unitCount, screenCount, cadence);

  const poNumber = generatePoNumber(tier);
  const token = generateTenantToken();
  const adminToken = generateAdminToken();
  const now = new Date();
  const termEnd = new Date(now);
  termEnd.setFullYear(termEnd.getFullYear() + 1);

  const tenant = await prisma.lockscreenTenant.create({
    data: {
      kind: tier,
      lang,
      orgName,
      token,
      tokenStatus: "pending", // flips to "active" once the PO is confirmed
      adminToken,
      licensedCount: unitCount,
      contactName,
      contactEmail,
      termStart: now,
      termEnd,
      plan: { create: { sequence, screenCount, cadence, anchor: now } },
    },
  });

  const order = await prisma.lockscreenOrder.create({
    data: {
      poNumber,
      tenantId: tenant.id,
      orgName,
      contactName,
      contactEmail,
      billingAddress,
      employeeCount: unitCount,
      screenCount,
      cadence,
      sequence,
      baseRatePerHead: quote.baseRatePerUnit,
      surchargePerHead: quote.surchargePerUnit,
      ratePerHead: quote.ratePerUnit,
      annualTotal: quote.annualTotal,
      currency: lang === "de" ? "EUR" : "USD",
      minimumApplied: quote.minimumApplied,
      status: "quote_issued",
      notes: quote.needsSalesReview
        ? [notes, "Needs sales pricing review before confirmation (non-standard cadence and/or screen package)."]
            .filter(Boolean)
            .join(" | ")
        : notes,
    },
  });

  // Raise the Stripe invoice. A failure here must not fail order creation —
  // the PO still stands and sales can invoice by hand. Standard orders get a
  // finalised, emailed invoice; sales-review orders get a draft.
  let invoice: InvoiceResult = null;
  try {
    invoice = await createInvoiceForOrder(order, tier, !quote.needsSalesReview, lang);
  } catch (err) {
    console.error(`Stripe invoice creation failed for ${poNumber}:`, err instanceof Error ? err.message : err);
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://konfydence.com";
  const prefix = lang === "de" ? "/de" : "";
  const poUrl = `${appUrl}${prefix}/lockscreens/${tier}/po/${order.id}`;
  const adminUrl = `${appUrl}${prefix}/lockscreens/${tier}/admin/${adminToken}`;
  const tierLabel = tier === "workplace" ? "Workplace" : "Schools";
  const money = formatMoney(quote.annualTotal, lang);
  const payButton = invoice?.url
    ? `<a href="${invoice.url}" style="background:#111417;color:#fffdf9;padding:12px 22px;text-decoration:none;border-radius:4px;display:inline-block;margin-right:10px;">${lang === "de" ? "Rechnung bezahlen" : "Pay invoice"} — ${money}</a>`
    : "";

  const invoiceLine = invoice?.url
    ? `<p>Your invoice is ready. Pay it by card or bank transfer and your lockscreen sequence goes live automatically — no follow-up needed.</p>`
    : quote.needsSalesReview
      ? `<p style="font-size:13px;color:#a66d00;">This order includes a non-standard screen package or cadence — a Konfydence rep will confirm final pricing, then send your invoice. The licence activates once it's paid.</p>`
      : `<p>A Konfydence team member will send your invoice shortly. The licence activates once it's paid.</p>`;

  const emailHtmlEn = `
    <div style="font-family:Georgia,'Times New Roman',serif;color:#111417;max-width:520px;">
      <p style="font-size:18px;">Purchase order ${escapeHtml(poNumber)} is ready.</p>
      <p>Konfydence Lockscreens — ${tierLabel}, ${unitCount.toLocaleString()} ${config.unitLabelPlural}, ${screenCount} screens, ${cadence}.</p>
      <p style="margin:20px 0;font-size:22px;">${money}<span style="font-size:13px;color:#66645f;"> / year</span></p>
      ${invoiceLine}
      <p style="margin:24px 0;">
        ${payButton}
        <a href="${poUrl}" style="background:transparent;color:#111417;border:1px solid #111417;padding:11px 20px;text-decoration:none;border-radius:4px;display:inline-block;margin-right:10px;">View purchase order</a>
        <a href="${adminUrl}" style="background:transparent;color:#111417;border:1px solid #111417;padding:11px 20px;text-decoration:none;border-radius:4px;display:inline-block;">Manage your screens</a>
      </p>
      <p style="font-size:12px;color:#66645f;">Bookmark the "Manage your screens" link — it's your private admin, no password needed. Keep it out of forwarded threads.</p>
    </div>
  `;

  const unitDe = UNIT_LABELS_DE[tier].plural;
  const tierLabelDe = tier === "workplace" ? "Unternehmen" : "Schulen";
  const invoiceLineDe = invoice?.url
    ? `<p>Eure Rechnung liegt bereit. Zahlt sie per Karte oder Überweisung – danach geht eure Sperrbildschirm-Folge automatisch live. Ihr müsst nichts weiter tun.</p>`
    : quote.needsSalesReview
      ? `<p style="font-size:13px;color:#a66d00;">Diese Bestellung enthält ein Screen-Paket oder einen Wechselrhythmus außerhalb des Standards. Wir bestätigen den endgültigen Preis und schicken euch danach die Rechnung. Die Lizenz startet mit der Zahlung.</p>`
      : `<p>Wir schicken euch in Kürze die Rechnung. Die Lizenz startet mit der Zahlung.</p>`;
  const cadenceDe = cadence === "weekly" ? "wöchentlich" : "alle zwei Wochen";
  const emailHtmlDe = `
    <div style="font-family:Georgia,'Times New Roman',serif;color:#111417;max-width:520px;">
      <p style="font-size:18px;">Eure Bestellung ${escapeHtml(poNumber)} liegt bereit.</p>
      <p>Konfydence Lockscreens für ${tierLabelDe}: ${unitCount.toLocaleString("de-DE")} ${unitDe}, ${screenCount} Screens, Wechsel ${cadenceDe}.</p>
      <p style="margin:20px 0;font-size:22px;">${money}<span style="font-size:13px;color:#66645f;"> / Jahr</span></p>
      ${invoiceLineDe}
      <p style="margin:24px 0;">
        ${payButton}
        <a href="${poUrl}" style="background:transparent;color:#111417;border:1px solid #111417;padding:11px 20px;text-decoration:none;border-radius:4px;display:inline-block;margin-right:10px;">Bestellung ansehen</a>
        <a href="${adminUrl}" style="background:transparent;color:#111417;border:1px solid #111417;padding:11px 20px;text-decoration:none;border-radius:4px;display:inline-block;">Screens verwalten</a>
      </p>
      <p style="font-size:12px;color:#66645f;">Speichert den Link „Screens verwalten“ als Lesezeichen – er ist euer privater Zugang, ganz ohne Passwort. Leitet ihn nicht in E-Mail-Verläufen weiter.</p>
    </div>
  `;
  const emailHtml = lang === "de" ? emailHtmlDe : emailHtmlEn;

  await sendTransactionalEmail({
    to: contactEmail,
    subject: lang === "de" ? `Konfydence Lockscreens – Bestellung ${poNumber}` : `Konfydence Lockscreens — Purchase order ${poNumber}`,
    tags: ["lockscreens", `${tier}-po`],
    html: emailHtml,
  });

  const salesNotify = process.env.LOCKSCREENS_SALES_EMAIL;
  if (salesNotify) {
    await sendTransactionalEmail({
      to: salesNotify,
      subject: `New ${tierLabel} lockscreens order — ${poNumber} (${orgName})`,
      tags: ["lockscreens", `${tier}-po`, "internal"],
      html: emailHtml,
    });
  }

  return { id: order.id, poNumber, poUrl, adminUrl };
}
