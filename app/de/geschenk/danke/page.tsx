import Link from "next/link";
import type { Metadata } from "next";
import { PremiumPageDe } from "@/components/PremiumSiteChrome";

export const metadata: Metadata = {
  title: "Dein Geschenk ist unterwegs",
  robots: { index: false, follow: true },
};

export default function GeschenkDankePage() {
  return (
    <PremiumPageDe ctaHref="/de/challenge" ctaLabel="Kostenlosen Check starten">
      <section className="kg-shell kc-hero is-narrow" style={{ paddingBottom: 48 }}>
        <p className="k-kicker">Geschenkkauf abgeschlossen</p>
        <h1>Dein Geschenk ist auf dem Weg.</h1>
        <p>
          Wir haben der beschenkten Person einen Code und deine Nachricht per E-Mail geschickt. Sie kann ihn einlösen,
          wann sie möchte. Falls die Mail nach ein paar Minuten nicht da ist, bitte sie, im Spam-Ordner nachzusehen.
        </p>
        <p style={{ marginTop: 24 }}>
          <Link className="k-button" href="/de">Zurück zu Konfydence</Link>
        </p>
      </section>
    </PremiumPageDe>
  );
}
