import { prisma } from "@/lib/prisma";
import type { Tier } from "@/lib/lockscreens/pricing";

export async function loadAdminPageData(tier: Tier, adminToken: string) {
  const tenant = await prisma.lockscreenTenant.findUnique({
    where: { adminToken },
    include: { plan: true, orders: { orderBy: { createdAt: "desc" }, take: 1 } },
  });
  if (!tenant || !tenant.plan || tenant.kind !== tier) return null;

  const assets = await prisma.lockscreenAsset.findMany({
    where: { status: "live", track: tier },
    orderBy: { number: "asc" },
    select: { number: true, category: true, hook: true, body: true, action: true, imagePath: true },
  });

  const latestOrder = tenant.orders[0] ?? null;
  return { tenant, assets, latestOrder };
}
