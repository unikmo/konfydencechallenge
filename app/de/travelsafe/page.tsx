import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { PremiumPageDe } from "@/components/PremiumSiteChrome";
import { PortfolioStrip } from "@/components/PortfolioStrip";

export const metadata: Metadata = {
  title: { absolute: "TravelSafe: Betrugsmaschen auf Reisen erkennen | Konfydence" },
  description:
    "Lerne mit kurzen Übungen, wie du auf verdächtige Zahlungsaufforderungen, falsche Buchungsnachrichten und andere Betrugsversuche auf Reisen reagierst.",
  alternates: {
    canonical: "/de/travelsafe",
    languages: { en: "https://konfydence.com/travelsafe", de: "https://konfydence.com/de/travelsafe" },
  },
  openGraph: {
    title: "TravelSafe: Sicher reisen und Betrugsversuche erkennen",
    description: "Kurze Übungen. Realistische Situationen. Verständliche Rückmeldungen.",
    url: "https://konfydence.com/de/travelsafe",
    siteName: "Konfydence",
    type: "website",
  },
};

const familyUses = [
  {
    label: "Vor der ersten Reise allein",
    copy: "Damit du auch allein ruhig bleibst, wenn du eine Buchung bestätigen oder eine Zahlungsaufforderung prüfen musst.",
  },
  {
    label: "Für ältere Angehörige",
    copy: "Gefälschte Buchungsnachrichten und dringende Zahlungsforderungen können jedem begegnen. Wer typische Maschen kennt, erkennt Warnzeichen leichter.",
  },
  {
    label: "Als gemeinsame Gewohnheit",
    copy: "Übt gemeinsam mit dem kostenlosen Sicherheitscheck und besprecht, wie ihr im Ernstfall nachprüfen könnt.",
  },
];

export default function TravelSafePageDe() {
  return (
    <PremiumPageDe ctaHref="/de/challenge/travelsafe/start?mode=diagnostic" ctaLabel="Kostenlosen Check starten">
      <section className="k-travel-hero">
        <div className="k-travel-copy">
          <p className="k-breadcrumb">Für Privatpersonen · TravelSafe</p>
          <p className="k-kicker">TravelSafe von Konfydence</p>
          <h1 className="k-display">Lerne, Betrugsversuche auf Reisen rechtzeitig zu erkennen.</h1>
          <p className="k-lede">
            Kurze, realistische Szenarien helfen dir, dir anzugewöhnen, innezuhalten, nachzuprüfen und gut zu entscheiden, wenn ungewohnte Abläufe und Zeitdruck zusammenkommen.
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
          <h2 className="k-display-sm">Gut vorbereitet in den Urlaub starten.</h2>
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
              <h2 className="k-display-sm">Situation auswählen. Entscheiden. Daraus lernen.</h2>
            </div>
            <p className="k-copy">
              Du musst keine Checkliste auswendig lernen. Du entscheidest, siehst, was die Situation getestet hat, und lernst die sicherere Regel dahinter.
            </p>
          </div>
          <div className="k-flow">
            <article><span>01</span><h3>Wählen</h3><p>Wähle eine Übungssituation, die dich im Alltag betreffen könnte.</p></article>
            <article><span>02</span><h3>Erleben</h3><p>Triff eine Entscheidung in einer realistischen Situation.</p></article>
            <article><span>03</span><h3>Lernen</h3><p>Erfahre, welche Warnzeichen wichtig waren und wie du sicherer handeln kannst.</p></article>
            <article><span>04</span><h3>Besser werden</h3><p>Übe weitere Situationen, bis dir das Innehalten und Nachprüfen leichter fällt.</p></article>
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
          <h2 className="k-display-sm">Drei Minuten üben. Beim nächsten Betrugsversuch besser vorbereitet sein.</h2>
        </div>
        <div className="k-actions">
          <Link className="k-button-gold" href="/de/challenge/travelsafe/start?mode=diagnostic">Kostenlosen Check starten</Link>
        </div>
      </section>
    </PremiumPageDe>
  );
}
