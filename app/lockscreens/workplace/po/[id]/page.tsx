import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { PurchaseOrderDocument } from "@/components/lockscreens/PurchaseOrderDocument";

export const metadata: Metadata = {
  title: "Purchase order | Konfydence Lockscreens",
  robots: { index: false, follow: false },
};

export default async function WorkplaceLockscreenPurchaseOrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await prisma.lockscreenOrder.findUnique({ where: { id }, include: { tenant: true } });
  if (!order) notFound();
  return <PurchaseOrderDocument tier="workplace" order={order} />;
}
