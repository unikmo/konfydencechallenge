import type { Metadata } from "next";
import Link from "next/link";
import { PremiumPageDe } from "@/components/PremiumSiteChrome";
import { PortfolioStrip } from "@/components/PortfolioStrip";

const PDF_PATH = "/resources/emergency-scam-protocol?lang=de";

export const metadata: Metadata = {
  title: { absolute: "Kostenloses Merkblatt zum Schutz vor Betrug | Konfydence" },
  description:
    "Lade das kostenlose Konfydence-Merkblatt für den Betrugsfall herunter: ein druckbares Merkblatt mit Anhalten · Abklären · Ansprechen für den Haushalt. Ohne E-Mail-Adresse.",
  alternates: {
    canonical: "/de/gratis-sicherheitspaket",
    languages: { en: "https://konfydence.com/free-scam-safety-pack", de: "https://konfydence.com/de/gratis-sicherheitspaket" },
  },
  openGraph: {
    title: "Kostenloses Merkblatt: Betrugsversuche richtig erkennen",
    description: "Ein druckbares Merkblatt mit Anhalten · Abklären · Ansprechen für den Haushalt. Kostenlos, ohne Anmeldung.",
    url: "https://konfydence.com/de/gratis-sicherheitspaket",
    siteName: "Konfydence",
    type: "website",
  },
};

const steps = [
  ["Anhalten", "Noch nicht antworten, klicken, zahlen oder Daten preisgeben."],
  ["Abklären", "Was wird von dir verlangt – Geld, ein Zugangscode, eine Anmeldung oder eine Freigabe? Prüfe die Forderung unabhängig."],
  ["Ansprechen", "Besprich die Forderung mit einer Person, der du vertraust oder ruf deine Bank unter der Nummer von deiner Karte an."],
] as const;

export default function GratisSicherheitspaketPage() {
  return (
    <PremiumPageDe ctaHref={PDF_PATH} ctaLabel="Kostenloses PDF laden">
      <section className="k-shell k-free-dl">
        <div className="k-free-dl-copy">
          <p className="k-breadcrumb">Kostenlos · Betrugsschutz für den Alltag</p>
          <p className="k-kicker">Für den Ernstfall</p>
          <h1 className="k-display">Betrugsversuche erkennen – mit einem kostenlosen Merkblatt.</h1>
          <p className="k-lede">
            Das Merkblatt für den Betrugsfall ist ein kostenloses, druckbares Merkblatt mit <strong>Anhalten · Abklären · Ansprechen</strong> für
            den Moment, in dem eine Nachricht, ein Anruf oder eine Zahlungsaufforderung dringend wirkt. Ohne E-Mail-Adresse, ohne Anmeldung – das PDF lädt mit einem Klick.
          </p>
          <div className="k-free-dl-actions">
            <a className="k-button" href={PDF_PATH} download>PDF herunterladen</a>
            <a className="k-button-quiet" href={PDF_PATH} target="_blank" rel="noopener">In neuem Tab öffnen</a>
          </div>
          <ol className="k-free-dl-steps">
            {steps.map(([name, copy]) => (
              <li key={name}>
                <b>{name}</b>
                <span>{copy}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="k-free-dl-preview">
          <a href={PDF_PATH} download aria-label="Merkblatt für den Betrugsfall als PDF herunterladen">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/resources/konfydence-notfall-protokoll.svg" alt="Das Konfydence-Merkblatt für den Betrugsfall: ein einseitiges Merkblatt mit Anhalten, Abklären, Ansprechen." />
          </a>
        </div>
      </section>

      <section className="k-section-dark" aria-labelledby="immer-da">
        <div className="k-shell k-free-dl-lockscreen">
          <div className="k-free-dl-lockscreen-shot" aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/lockscreens/home/phone/21.png" alt="" />
          </div>
          <div>
            <p className="k-kicker">Sicherheitstipps im Alltag</p>
            <h2 id="immer-da" className="k-display-sm">Das Merkblatt kannst du ausdrucken und gut sichtbar aufhängen. Ergänzend erinnern Sperrbildschirm-Hinweise an typische Betrugsmaschen.</h2>
            <p className="k-copy">
              Das Protokoll ist das Blatt für den Ernstfall. <strong>Konfydence Lockscreens</strong> zeigt dieselbe ruhige
              Aufforderung dort, wo du sie wirklich siehst – auf dem Sperrbildschirm von Handy oder Rechner – und tauscht
              sie alle zwei Wochen gegen eine neue aus, weil sich die Maschen ändern. Die Pläne für Zuhause und Teens sind
              sofort buchbar; Schulen und Unternehmen bekommen einen lizenzierten Rollout für verwaltete Geräte.
            </p>
            <div className="k-actions">
              <Link className="k-button" href="/de/lockscreens">Konfydence Lockscreens ansehen</Link>
              <Link className="k-button-quiet" href="/de/lockscreens#pricing">Preise</Link>
            </div>
          </div>
        </div>
      </section>

      <PortfolioStrip lang="de" kicker="Außerdem von Konfydence" heading="Übe die Entscheidung, nicht nur die Erinnerung." exclude={["lockscreens"]} />
    </PremiumPageDe>
  );
}
