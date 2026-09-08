import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe/client";

// Basic-Auth gated via proxy.ts (matcher /api/admin/:path*). Actions for the
// business dashboard at /admin/business — Konfydence-specific fulfilment
// controls. Stripe-native things (refunds, disputes) stay in the Stripe
// dashboard; a refund there fires charge.refunded → our webhook revokes.
export async function POST(request: NextRequest) {
  const form = await request.formData();
  const action = String(form.get("action") ?? "");
  const view = String(form.get("view") ?? "overview");
  const back = new URL(`/admin/business?view=${encodeURIComponent(view)}`, request.url);

  try {
    switch (action) {
      case "revoke_entitlement":
      case "restore_entitlement": {
        const id = String(form.get("id") ?? "");
        if (id) {
          await prisma.entitlement.update({
            where: { id },
            data: { status: action === "revoke_entitlement" ? "revoked" : "active" },
          });
        }
        break;
      }
      case "activate_tenant":
      case "revoke_tenant": {
        const orderId = String(form.get("orderId") ?? "");
        const order = orderId
          ? await prisma.lockscreenOrder.findUnique({ where: { id: orderId }, include: { tenant: true } })
          : null;
        if (order?.tenant) {
          const activate = action === "activate_tenant";
          await prisma.lockscreenTenant.update({
            where: { id: order.tenant.id },
            data: { tokenStatus: activate ? "active" : "expired" },
          });
          await prisma.lockscreenOrder.update({
            where: { id: order.id },
            data: { status: activate ? "confirmed" : "cancelled" },
          });
        }
        break;
      }
      case "void_invoice": {
        const invoiceId = String(form.get("invoiceId") ?? "");
        if (invoiceId) {
          await getStripe().invoices.voidInvoice(invoiceId);
          await prisma.lockscreenOrder.updateMany({
            where: { stripeInvoiceId: invoiceId },
            data: { stripeInvoiceStatus: "void" },
          });
        }
        break;
      }
      case "cancel_subscription": {
        const subId = String(form.get("subId") ?? "");
        if (subId) await getStripe().subscriptions.cancel(subId);
        break;
      }
      default:
        break;
    }
  } catch (err) {
    console.error("admin/business action failed:", action, err instanceof Error ? err.message : err);
    back.searchParams.set("err", "1");
  }

  return NextResponse.redirect(back, 303);
}
