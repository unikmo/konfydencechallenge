// Workplace / School Lockscreens are billed by Stripe Invoice, not a fixed
// catalogue price (the amount is per-employee/computer headcount — see
// lib/lockscreens/pricing.ts). createInvoiceForOrder() is called from
// createLockscreenOrder() right after the PO row is minted.
//
// Standard orders: invoice is finalised and emailed immediately; paying it
// activates the tenant via the invoice.paid webhook. Orders flagged
// needsSalesReview (non-standard cadence/package) get a *draft* invoice only —
// sales confirms pricing, then finalises it from the Stripe dashboard.
//
// Tax: for a US seller (PlanetHike) invoicing an EU business, the correct
// outcome is no VAT line + a reverse-charge statement, which is exactly what a
// no-tax invoice with the footer below produces. Once the Stripe Tax wizard is
// done, set STRIPE_TAX_ENABLED=true and automatic_tax refines US-nexus / EU-B2C
// cases; the reverse-charge footer stays correct for the B2B case.
import type Stripe from "stripe";
import { getStripe, stripeConfigured } from "@/lib/stripe/client";
import { LOCKSCREEN_B2B_TAX_CODE } from "@/lib/stripe/catalog";
import { TIER_CONFIG, type Tier } from "@/lib/lockscreens/pricing";
import { prisma } from "@/lib/prisma";

const REVERSE_CHARGE_FOOTER =
  "Konfydence is a product of PlanetHike. VAT: where the customer is a business " +
  "established in the EU, VAT is not charged — the reverse charge applies and the " +
  "recipient accounts for VAT (Steuerschuldnerschaft des Leistungsempfängers). " +
  "Konfydence is an educational scam-readiness product and does not guarantee protection from fraud.";

type OrderForInvoice = {
  id: string;
  poNumber: string;
  orgName: string;
  contactName: string | null;
  contactEmail: string;
  billingAddress: string | null;
  employeeCount: number;
  screenCount: number;
  cadence: string;
  annualTotal: number;
  overrideAnnualTotal: number | null;
  currency: string;
};

export type InvoiceResult = { id: string; url: string | null; status: string | null } | null;

async function findOrCreateCustomer(stripe: Stripe, order: OrderForInvoice): Promise<string> {
  const email = order.contactEmail.trim().toLowerCase();
  const existing = await stripe.customers.list({ email, limit: 1 });
  if (existing.data[0]) return existing.data[0].id;

  const customer = await stripe.customers.create({
    email,
    name: order.orgName,
    description: order.contactName ? `${order.contactName} — ${order.orgName}` : order.orgName,
    metadata: {
      konfydence_project: "lockscreens",
      billing_address_freeform: (order.billingAddress || "").slice(0, 490),
    },
  });
  return customer.id;
}

/**
 * @param autoSend  false for needsSalesReview orders — leaves the invoice as a
 *                   draft for sales to finalise after a pricing review.
 */
export async function createInvoiceForOrder(
  order: OrderForInvoice,
  tier: Tier,
  autoSend: boolean,
): Promise<InvoiceResult> {
  if (!stripeConfigured()) {
    console.warn(`Stripe not configured — no invoice raised for ${order.poNumber}`);
    return null;
  }

  const stripe = getStripe();
  const config = TIER_CONFIG[tier];
  const tierLabel = tier === "school" ? "Schools" : "Workplace";
  const amountCents = Math.round((order.overrideAnnualTotal ?? order.annualTotal) * 100);
  const currency = (order.currency || "USD").toLowerCase();
  const daysUntilDue = tier === "school" ? 45 : 30;
  const taxEnabled = process.env.STRIPE_TAX_ENABLED === "true";

  const customerId = await findOrCreateCustomer(stripe, order);

  const createInvoice = (withAutomaticTax: boolean) =>
    stripe.invoices.create({
      customer: customerId,
      collection_method: "send_invoice",
      days_until_due: daysUntilDue,
      auto_advance: false,
      currency,
      description: `Konfydence Lockscreens — ${tierLabel} annual licence · ${order.employeeCount.toLocaleString()} ${config.unitLabelPlural} · ${order.screenCount} screens · ${order.cadence}`,
      footer: REVERSE_CHARGE_FOOTER,
      custom_fields: [{ name: "PO number", value: order.poNumber }],
      metadata: { lockscreen_order_id: order.id, po_number: order.poNumber, tier },
      ...(withAutomaticTax ? { automatic_tax: { enabled: true } } : {}),
    });

  let invoice: Stripe.Invoice;
  try {
    invoice = await createInvoice(taxEnabled);
  } catch (err) {
    if (taxEnabled) {
      console.warn(`automatic_tax rejected for ${order.poNumber} (${err instanceof Error ? err.message : err}); retrying without it`);
      invoice = await createInvoice(false);
    } else {
      throw err;
    }
  }

  await stripe.invoiceItems.create({
    customer: customerId,
    invoice: invoice.id,
    amount: amountCents,
    currency,
    description: `Konfydence Lockscreens — ${tierLabel} licence, ${order.employeeCount.toLocaleString()} ${config.unitLabelPlural} @ ${currency.toUpperCase()} ${(amountCents / 100 / Math.max(order.employeeCount, 1)).toFixed(2)}/yr`,
    ...(taxEnabled ? { tax_code: LOCKSCREEN_B2B_TAX_CODE } : {}),
  });

  let finalStatus: string | null = invoice.status ?? "draft";
  let hostedUrl: string | null = null;

  if (autoSend) {
    const finalised = await stripe.invoices.finalizeInvoice(invoice.id, { auto_advance: true });
    await stripe.invoices.sendInvoice(invoice.id);
    finalStatus = finalised.status ?? "open";
    hostedUrl = finalised.hosted_invoice_url ?? null;
  } else {
    // Draft: still expose the dashboard link so sales can open it.
    hostedUrl = null;
  }

  await prisma.lockscreenOrder.update({
    where: { id: order.id },
    data: { stripeInvoiceId: invoice.id, stripeInvoiceUrl: hostedUrl, stripeInvoiceStatus: finalStatus },
  });

  return { id: invoice.id, url: hostedUrl, status: finalStatus };
}

/** invoice.paid → confirm the order and activate the tenant. Idempotent. */
export async function activateOrderFromPaidInvoice(invoiceId: string): Promise<"activated" | "skipped"> {
  const order = await prisma.lockscreenOrder.findUnique({
    where: { stripeInvoiceId: invoiceId },
    include: { tenant: true },
  });
  if (!order) {
    console.log("invoice.paid: no lockscreen order for invoice", invoiceId);
    return "skipped";
  }
  await prisma.lockscreenOrder.update({
    where: { id: order.id },
    data: { status: "confirmed", stripeInvoiceStatus: "paid" },
  });
  if (order.tenant && order.tenant.tokenStatus !== "active") {
    await prisma.lockscreenTenant.update({ where: { id: order.tenant.id }, data: { tokenStatus: "active" } });
  }
  return "activated";
}

/** invoice.finalized / .voided / .marked_uncollectible → keep the row in sync. */
export async function syncInvoiceStatus(invoiceId: string, status: string, hostedUrl?: string | null): Promise<void> {
  const order = await prisma.lockscreenOrder.findUnique({ where: { stripeInvoiceId: invoiceId } });
  if (!order) return;
  await prisma.lockscreenOrder.update({
    where: { id: order.id },
    data: {
      stripeInvoiceStatus: status,
      ...(hostedUrl ? { stripeInvoiceUrl: hostedUrl } : {}),
      ...(status === "void" ? { status: "cancelled" } : {}),
    },
  });
}
