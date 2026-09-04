import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Gated by proxy.ts (matcher includes /api/admin/:path*) -- Basic Auth only,
// same as the rest of the internal Konfydence OS.
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const form = await request.formData();
  const action = String(form.get("action") ?? "set");

  const order = await prisma.lockscreenOrder.findUnique({ where: { id } });
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (action === "clear") {
    await prisma.lockscreenOrder.update({
      where: { id },
      data: { overrideAnnualTotal: null, overrideReason: null, overriddenBy: null, overriddenAt: null },
    });
    return NextResponse.redirect(new URL(`/admin/lockscreens/orders/${id}`, request.url), 303);
  }

  const overrideAnnualTotal = Number(form.get("overrideAnnualTotal"));
  const overrideReason = String(form.get("overrideReason") ?? "").trim().slice(0, 500) || null;
  const overriddenBy = String(form.get("overriddenBy") ?? "").trim().slice(0, 120) || null;

  if (!Number.isFinite(overrideAnnualTotal) || overrideAnnualTotal < 0) {
    return NextResponse.json({ error: "overrideAnnualTotal must be a non-negative number" }, { status: 400 });
  }

  await prisma.lockscreenOrder.update({
    where: { id },
    data: {
      overrideAnnualTotal,
      overrideReason,
      overriddenBy,
      overriddenAt: new Date(),
    },
  });

  return NextResponse.redirect(new URL(`/admin/lockscreens/orders/${id}`, request.url), 303);
}
