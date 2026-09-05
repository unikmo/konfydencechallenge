import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Gated by proxy.ts (matcher includes /api/admin/:path*) -- Basic Auth only,
// same as the rest of the internal Konfydence OS. This is the manual flip
// from "PO issued" to "licence live" -- there's no payment processor wired
// for these annual B2B contracts, so a human confirms payment (wire,
// invoice, phone call) and clicks this.
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const form = await request.formData();
  const action = String(form.get("action") ?? "activate");

  const order = await prisma.lockscreenOrder.findUnique({ where: { id }, include: { tenant: true } });
  if (!order || !order.tenant) {
    return NextResponse.json({ error: "Order or tenant not found" }, { status: 404 });
  }

  if (action === "revoke") {
    await prisma.lockscreenTenant.update({ where: { id: order.tenant.id }, data: { tokenStatus: "expired" } });
    await prisma.lockscreenOrder.update({ where: { id }, data: { status: "cancelled" } });
  } else {
    await prisma.lockscreenTenant.update({ where: { id: order.tenant.id }, data: { tokenStatus: "active" } });
    await prisma.lockscreenOrder.update({ where: { id }, data: { status: "confirmed" } });
  }

  return NextResponse.redirect(new URL(`/admin/lockscreens/orders/${id}`, request.url), 303);
}
