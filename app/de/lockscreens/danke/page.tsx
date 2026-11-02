import Link from "next/link";
import type { Metadata } from "next";
import { PremiumPageDe } from "@/components/PremiumSiteChrome";

export const metadata: Metadata = {
  title: { absolute: "Danke | Konfydence Lockscreens" },
  description: "Dein Konfydence-Lockscreens-Abo ist aktiv – schütze jetzt dein erstes Gerät.",
  robots: { index: false, follow: false },
  alternates: {
    canonical: "/de/lockscreens/danke",
    languages: { en: "https://konfydence.com/lockscreens/thank-you", de: "https://konfydence.com/de/lockscreens/danke" },
  },
};

export default function LockscreensDankePage() {
  return (
    <PremiumPageDe ctaHref="/de/challenge" ctaLabel="Kostenlos ausprobieren">
      <section className="kg-narrow k-section" style={{ borderTop: 0, textAlign: "center", maxWidth: 640 }}>
        <p className="k-kicker">Abo aktiv</p>
        <h1 className="k-display-sm">Schütze dein erstes Gerät.</h1>
        <p className="k-copy" style={{ margin: "18px auto 0" }}>
          Wähle das Gerät, das du am häufigsten nutzt, und richte den ersten Screen in unter einer Minute ein. Danach
          kommen die weiteren Geräte dran. Alle zwei Wochen schicken wir dir per E-Mail den nächsten Screen, denn die
          Betrugsmaschen ändern sich.
        </p>
        <div className="k-actions" style={{ justifyContent: "center", marginTop: 28 }}>
          <Link className="k-button" href="/de/challenge/travelsafe/start?mode=diagnostic">Kostenlosen Check starten</Link>
          <Link className="k-button-quiet" href="/de/hack-method">Die Methode ansehen</Link>
        </div>
        <p className="k-copy" style={{ margin: "26px auto 0", fontSize: 12 }}>
          Nach ein paar Minuten ist nichts angekommen? <Link href="/de/kontakt">Schreib uns</Link>, dann klären wir das.
        </p>
      </section>
    </PremiumPageDe>
  );
}
