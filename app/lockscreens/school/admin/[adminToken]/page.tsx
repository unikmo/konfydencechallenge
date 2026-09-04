import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PremiumPage } from "@/components/PremiumSiteChrome";
import { LockscreenAdminDashboard } from "@/components/lockscreens/LockscreenAdminDashboard";
import { loadAdminPageData } from "@/lib/lockscreens/adminPageData";

export const metadata: Metadata = {
  title: "Manage your lockscreens | Konfydence",
  robots: { index: false, follow: false },
};

export default async function SchoolLockscreenAdminPage({
  params,
}: {
  params: Promise<{ adminToken: string }>;
}) {
  const { adminToken } = await params;
  const data = await loadAdminPageData("school", adminToken);
  if (!data) notFound();
  const { tenant, assets, latestOrder } = data;

  return (
    <PremiumPage ctaHref="/challenge" ctaLabel="Start a free check">
      <section className="kg-shell kc-hero is-narrow" style={{ paddingBottom: 24 }}>
        <p className="k-kicker">Lockscreens admin</p>
        <h1>{tenant.orgName}</h1>
        <p>
          {tenant.licensedCount.toLocaleString()} licensed managed computers &middot; {tenant.tokenStatus === "active" ? "Active licence" : tenant.tokenStatus === "pending" ? "Pending confirmation" : "Expired"}
        </p>
      </section>

      <section className="kg-shell" style={{ paddingBottom: 64 }}>
        <LockscreenAdminDashboard
          tier="school"
          adminToken={adminToken}
          deliveryToken={tenant.token}
          tokenStatus={tenant.tokenStatus}
          licensedCount={tenant.licensedCount}
          termStart={tenant.termStart ? tenant.termStart.toISOString() : null}
          termEnd={tenant.termEnd ? tenant.termEnd.toISOString() : null}
          plan={{
            sequence: tenant.plan!.sequence,
            screenCount: tenant.plan!.screenCount,
            cadence: tenant.plan!.cadence,
            anchor: tenant.plan!.anchor.toISOString(),
          }}
          assets={assets}
          currentRatePerHead={latestOrder?.ratePerHead ?? null}
          latestPoUrl={latestOrder ? `/lockscreens/school/po/${latestOrder.id}` : null}
        />
      </section>
    </PremiumPage>
  );
}
