import { PremiumPage, PremiumPageDe } from "@/components/PremiumSiteChrome";
import { LockscreenOrderForm } from "@/components/lockscreens/LockscreenOrderForm";
import type { LsLang, Tier } from "@/lib/lockscreens/pricing";

const T = {
  en: {
    cta: "Start a free check",
    ctaHref: "/challenge",
    kicker: { school: "Lockscreens for Schools", workplace: "Lockscreens for Workplace" },
    h1: "Get an instant quote and purchase order.",
    body: {
      school:
        "$2 per managed computer per year, $150 minimum annual licence. Computers and managed tablets only — no phones. Fill this in and we generate a numbered purchase order immediately — a Konfydence rep confirms payment terms before the licence activates.",
      workplace:
        "$4 per employee per year, $300 minimum annual licence. Fill this in and we generate a numbered purchase order immediately — a Konfydence rep confirms payment terms before the licence activates.",
    },
  },
  de: {
    cta: "Kostenlos starten",
    ctaHref: "/de/challenge",
    kicker: { school: "Lockscreens für Schulen", workplace: "Lockscreens für Unternehmen" },
    h1: "Sofort-Angebot und Bestellung erhalten.",
    body: {
      school:
        "2 € pro verwaltetem Computer und Jahr, Mindestjahreslizenz 150 €. Nur Computer und verwaltete Tablets – keine Handys. Füllt das Formular aus, und wir erstellen sofort eine nummerierte Bestellung. Vor der Freischaltung klärt jemand aus dem Konfydence-Team die Zahlungsbedingungen mit euch.",
      workplace:
        "4 € pro Mitarbeitendem und Jahr, Mindestjahreslizenz 300 €. Füllt das Formular aus, und wir erstellen sofort eine nummerierte Bestellung. Vor der Freischaltung klärt jemand aus dem Konfydence-Team die Zahlungsbedingungen mit euch.",
    },
  },
} as const;

export function OrderPageView({ tier, lang }: { tier: Tier; lang: LsLang }) {
  const t = T[lang];
  const Chrome = lang === "de" ? PremiumPageDe : PremiumPage;
  return (
    <Chrome ctaHref={t.ctaHref} ctaLabel={t.cta}>
      <section className="kg-shell kc-hero is-narrow" style={{ paddingBottom: 32 }}>
        <p className="k-kicker">{t.kicker[tier]}</p>
        <h1>{t.h1}</h1>
        <p>{t.body[tier]}</p>
      </section>

      <section className="kg-shell" style={{ paddingBottom: 64 }}>
        <LockscreenOrderForm tier={tier} lang={lang} />
      </section>
    </Chrome>
  );
}
