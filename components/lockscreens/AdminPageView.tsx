import { notFound, redirect } from "next/navigation";
import { PremiumPage, PremiumPageDe } from "@/components/PremiumSiteChrome";
import { LockscreenAdminDashboard } from "@/components/lockscreens/LockscreenAdminDashboard";
import { loadAdminPageData } from "@/lib/lockscreens/adminPageData";
import { UNIT_LABELS_DE, TIER_CONFIG, type LsLang, type Tier } from "@/lib/lockscreens/pricing";

const T = {
  en: {
    kicker: "Lockscreens admin",
    licensed: (n: number, tier: Tier) => `${n.toLocaleString()} licensed ${TIER_CONFIG[tier].unitLabelPlural}`,
    status: { active: "Active licence", pending: "Pending confirmation", expired: "Expired" } as Record<string, string>,
    cta: "Start a free check",
    ctaHref: "/challenge",
  },
  de: {
    kicker: "Lockscreens-Verwaltung",
    licensed: (n: number, tier: Tier) => `Lizenziert: ${n.toLocaleString("de-DE")} ${UNIT_LABELS_DE[tier].plural}`,
    status: { active: "Lizenz aktiv", pending: "Bestätigung ausstehend", expired: "Abgelaufen" } as Record<string, string>,
    cta: "Kostenlos starten",
    ctaHref: "/de/challenge",
  },
} as const;

export async function AdminPageView({ tier, adminToken, lang }: { tier: Tier; adminToken: string; lang: LsLang }) {
  const data = await loadAdminPageData(tier, adminToken);
  if (!data) notFound();
  const { tenant, assets, latestOrder } = data;
  // Buyers who ordered in German keep landing on the German admin, wherever the link is opened.
  if (lang === "en" && tenant.lang === "de") redirect(`/de/lockscreens/${tier}/admin/${adminToken}`);

  const t = T[lang];
  const Chrome = lang === "de" ? PremiumPageDe : PremiumPage;
  const base = lang === "de" ? "/de" : "";

  return (
    <Chrome ctaHref={t.ctaHref} ctaLabel={t.cta}>
      <section className="kg-shell kc-hero is-narrow" style={{ paddingBottom: 24 }}>
        <p className="k-kicker">{t.kicker}</p>
        <h1>{tenant.orgName}</h1>
        <p>
          {t.licensed(tenant.licensedCount, tier)} &middot; {t.status[tenant.tokenStatus] ?? t.status.expired}
        </p>
      </section>

      <section className="kg-shell" style={{ paddingBottom: 64 }}>
        <LockscreenAdminDashboard
          tier={tier}
          lang={lang}
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
          latestPoUrl={latestOrder ? `${base}/lockscreens/${tier}/po/${latestOrder.id}` : null}
        />
      </section>
    </Chrome>
  );
}
