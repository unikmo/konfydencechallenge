import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { PremiumPage } from "@/components/PremiumSiteChrome";
import { WorkplaceAdminDashboard } from "@/components/lockscreens/WorkplaceAdminDashboard";

export const metadata: Metadata = {
  title: "Manage your lockscreens | Konfydence",
  robots: { index: false, follow: false },
};

export default async function WorkplaceLockscreenAdminPage({
  params,
}: {
  params: Promise<{ adminToken: string }>;
}) {
  const { adminToken } = await params;

  const tenant = await prisma.lockscreenTenant.findUnique({
    where: { adminToken },
    include: { plan: true, orders: { orderBy: { createdAt: "desc" }, take: 1 } },
  });
  if (!tenant || !tenant.plan) notFound();

  const assets = await prisma.lockscreenAsset.findMany({
    where: { status: "live" },
    orderBy: { number: "asc" },
    select: { number: true, category: true, hook: true, body: true, action: true, imagePath: true },
  });

  const latestOrder = tenant.orders[0] ?? null;

  return (
    <PremiumPage ctaHref="/challenge" ctaLabel="Start a free check">
      <section className="kg-shell kc-hero is-narrow" style={{ paddingBottom: 24 }}>
        <p className="k-kicker">Lockscreens admin</p>
        <h1>{tenant.orgName}</h1>
        <p>
          {tenant.licensedCount.toLocaleString()} licensed employees &middot; {tenant.tokenStatus === "active" ? "Active licence" : tenant.tokenStatus === "pending" ? "Pending confirmation" : "Expired"}
        </p>
      </section>

      <section className="kg-shell" style={{ paddingBottom: 64 }}>
        <WorkplaceAdminDashboard
          adminToken={adminToken}
          deliveryToken={tenant.token}
          tokenStatus={tenant.tokenStatus}
          licensedCount={tenant.licensedCount}
          termStart={tenant.termStart ? tenant.termStart.toISOString() : null}
          termEnd={tenant.termEnd ? tenant.termEnd.toISOString() : null}
          plan={{
            sequence: tenant.plan.sequence,
            screenCount: tenant.plan.screenCount,
            cadence: tenant.plan.cadence,
            anchor: tenant.plan.anchor.toISOString(),
          }}
          assets={assets}
          currentRatePerHead={latestOrder?.ratePerHead ?? null}
          latestPoUrl={latestOrder ? `/lockscreens/workplace/po/${latestOrder.id}` : null}
        />
      </section>
    </PremiumPage>
  );
}
