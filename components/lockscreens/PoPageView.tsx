import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PurchaseOrderDocument } from "@/components/lockscreens/PurchaseOrderDocument";
import type { LsLang, Tier } from "@/lib/lockscreens/pricing";

export async function PoPageView({ tier, id, lang }: { tier: Tier; id: string; lang: LsLang }) {
  const order = await prisma.lockscreenOrder.findUnique({ where: { id }, include: { tenant: true } });
  if (!order) notFound();
  if (lang === "en" && order.tenant?.lang === "de") redirect(`/de/lockscreens/${tier}/po/${id}`);
  return <PurchaseOrderDocument tier={tier} order={order} lang={lang} />;
}
