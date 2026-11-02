import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { PremiumPageDe } from "@/components/PremiumSiteChrome";
import { PortfolioStrip } from "@/components/PortfolioStrip";

export const metadata: Metadata = {
  title: { absolute: "TravelSafe | Betrugsprävention zum Üben von Konfydence" },
  description:
    "Übe sichere Entscheidungen für unterwegs in kurzen, realistischen Szenarien rund um Zahlungen, Identität, Nachrichten, Buchungen und unbekannte Systeme.",
  alternates: {
    canonical: "/de/travelsafe",
    languages: { en: "https://konfydence.com/travelsafe", de: "https://konfydence.com/de/travelsafe" },
  },
  openGraph: {
    title: "TravelSafe | Übe sichere Entscheidungen, bevor du verreist",
    description: "Kurze Simulationen. Echte Entscheidungen. Sofortiges Feedback.",
    url: "https://konfydence.com/de/travelsafe",
    siteName: "Konfydence",
    type: "website",
  },
};

const familyUses = [
  {
    label: "Vor der ersten Reise allein",
    copy: "Eine ruhige Gewohnheit für den Moment, in dem Buchung, Zahlung oder Nachricht entschieden werden müssen und niemand danebensteht.",
  },
  {
    label: "Für ältere Angehörige",
    copy: "Falsche Verwandte und dringende Zahlungsaufforderungen reisen mit. Kurzes Üben macht das Innehalten selbstverständlich.",
  },
  {
    label: "Als gemeinsame Gewohnheit",
    copy: "Alle machen denselben kostenlosen Check, und die ganze Familie greift zu Anhalten, Abklären, Ansprechen.",
  },
];

export default function TravelSafePageDe() {
  return (
    <PremiumPageDe ctaHref="/de/challenge/travelsafe/start?mode=diagnostic" ctaLabel="Kostenlosen Check starten">
      <section className="k-travel-hero">
        <div className="k-travel-copy">
          <p className="k-breadcrumb">Für Privatpersonen · TravelSafe</p>
          <p className="k-kicker">TravelSafe von Konfydence</p>
          <h1 className="k-display">Übe sichere Entscheidungen, bevor die Reise sie ernst macht.</h1>
          <p className="k-lede">
            Kurze, realistische Szenarien helfen dir, dir anzugewöhnen, innezuhalten, nachzuprüfen und gut zu entscheiden, wenn fremde Systeme und Zeitdruck zusammentreffen.
          </p>
          <div className="k-actions">
            <Link className="k-button" href="/de/challenge/travelsafe/start?mode=diagnostic">Kostenlosen TravelSafe-Check starten</Link>
            <Link className="k-button-quiet" href="/de/hack-method">So funktioniert die Methode</Link>
          </div>
        </div>
        <div className="k-travel-media">
          <Image src="/edition-images/travelsafe.png" alt="TravelSafe: Illustration mit Koffer, Reisepass und Smartphone" fill priority sizes="(max-width: 980px) 100vw, 55vw" style={{ objectPosition: "center" }} />
        </div>
      </section>

      <section id="familien" className="k-shell k-section k-home-care">
        <div className="k-home-care-copy">
          <p className="k-kicker">Für Familien</p>
          <h2 className="k-display-sm">Eine nützliche Art von Fürsorge reist mit.</h2>
          <p className="k-copy">
            TravelSafe ist Entscheidungstraining, kein Gadget. Es gibt den Menschen, die dir wichtig sind, eine Gewohnheit mit, die genau dann greift, wenn eine Buchung, Zahlung oder Nachricht sie unter Druck setzen will.
          </p>
        </div>
        <div className="k-home-care-grid">
          {familyUses.map((use) => (
            <article key={use.label}>
              <small>Familie</small>
              <strong>{use.label}</strong>
              <p>{use.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="so-funktioniert-es" className="k-section-dark">
        <div className="k-shell">
          <div className="k-section-head">
            <div>
              <p className="k-kicker">So funktioniert TravelSafe</p>
              <h2 className="k-display-sm">Wählen. Erleben. Lernen. Besser werden.</h2>
            </div>
            <p className="k-copy">
              Du musst keine Checkliste auswendig lernen. Du entscheidest, siehst, was die Situation getestet hat, und lernst die sicherere Regel dahinter.
            </p>
          </div>
          <div className="k-flow">
            <article><span>01</span><h3>Wählen</h3><p>Such dir ein kurzes Szenario, das zu deiner Welt passt.</p></article>
            <article><span>02</span><h3>Erleben</h3><p>Triff eine Entscheidung in einer realistischen Situation.</p></article>
            <article><span>03</span><h3>Lernen</h3><p>Sieh, was passiert ist, warum, und welches Druckmuster am Werk war.</p></article>
            <article><span>04</span><h3>Besser werden</h3><p>Wiederhole es, bis Anhalten, Abklären, Ansprechen dein automatischer nächster Schritt ist.</p></article>
          </div>
        </div>
      </section>

      <section className="k-quote">
        <blockquote>Selbstvertrauen heißt nicht, zu wissen, dass jede Nachricht sicher ist. Es heißt, zu wissen, was man prüft, wenn es darauf ankommt.</blockquote>
        <cite>Entscheidungsprinzip von Konfydence</cite>
      </section>

      <PortfolioStrip lang="de" exclude={["travelsafe"]} />

      <section className="k-shell k-callout">
        <div>
          <p className="k-kicker">Bereit?</p>
          <h2 className="k-display-sm">Drei Minuten jetzt. Ein besserer Instinkt später.</h2>
        </div>
        <div className="k-actions">
          <Link className="k-button-gold" href="/de/challenge/travelsafe/start?mode=diagnostic">Kostenlosen Check starten</Link>
        </div>
      </section>
    </PremiumPageDe>
  );
}
