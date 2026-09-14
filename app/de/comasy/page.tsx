import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { PremiumPageDe } from "@/components/PremiumSiteChrome";

export const metadata: Metadata = {
  title: { absolute: "CoMaSy | Sicherheits-Entscheidungssimulation von Konfydence" },
  description:
    "CoMaSy ergänzt Security-Awareness-Programme um realistische Entscheidungssimulationen, die Innehalten, Verifizierung und Eskalationsverhalten unter Druck messen.",
  alternates: {
    canonical: "/de/comasy",
    languages: { en: "https://konfydence.com/comasy", de: "https://konfydence.com/de/comasy" },
  },
  openGraph: {
    title: "CoMaSy | Sicherheits-Entscheidungssimulation",
    description: "Übe die Momente, in denen vertraute Identitäten, Hetze und unvollständige Beweise das Urteilsvermögen unter Druck setzen — und miss, wie Menschen reagieren.",
    url: "https://konfydence.com/de/comasy",
    siteName: "Konfydence",
    type: "website",
  },
};

const faqs = [
  [
    "Ersetzt CoMaSy unser LMS oder unsere Phishing-Plattform?",
    "Nein. CoMaSy ist als ergänzende Entscheidungssimulations-Ebene konzipiert. Ein Pilot kann neben eurem bestehenden Awareness-Programm laufen, ohne eine Plattformablösung zu erfordern.",
  ],
  [
    "Was misst CoMaSy?",
    "CoMaSy misst Trainingssignale aus Szenario-Entscheidungen — darunter Innehalten, unabhängige Verifizierung, risikoreichere Impulshandlungen und Reaktionen auf H.A.C.K.-Druckmuster. Das sind Lernsignale, keine Garantie für reales Sicherheitsverhalten.",
  ],
  [
    "Ist CoMaSy ein Phishing-Simulator?",
    "Phishing kann ein Szenariotyp sein, aber der Kernanwendungsfall ist breiter: Chef-Betrug, Lieferantenwechsel, Zahlungsanfragen, Account-Kompromittierung und andere Geschäftsentscheidungen, bei denen eine Bitte legitim wirken kann.",
  ],
  [
    "Macht CoMaSy eine Organisation NIS2-konform?",
    "Nein. CoMaSy kann wiederholte Cybersicherheits-Awareness-Aktivität und definierte Wirksamkeitsbelege unterstützen, stellt aber allein keine regulatorische Konformität her.",
  ],
];

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      "@id": "https://konfydence.com/de/comasy#service",
      name: "CoMaSy",
      serviceType: "Sicherheits-Entscheidungssimulation",
      provider: { "@type": "Organization", name: "Konfydence", url: "https://konfydence.com" },
      url: "https://konfydence.com/de/comasy",
      description:
        "Eine Entscheidungssimulations-Ebene, die Organisationen hilft, realistische Social-Engineering-Entscheidungen zu üben und beobachtbares Verifizierungsverhalten zu messen.",
      areaServed: ["Europe", "North America"],
    },
    {
      "@type": "FAQPage",
      mainEntity: faqs.map(([question, answer]) => ({
        "@type": "Question",
        name: question,
        acceptedAnswer: { "@type": "Answer", text: answer },
      })),
    },
  ],
};

export default function ComasyPageDe() {
  return (
    <PremiumPageDe ctaHref="/de/comasy/pilotprojekt" ctaLabel="Pilotprojekt anfragen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <section className="k-comasy-hero">
        <div className="k-comasy-copy">
          <p className="k-breadcrumb">Für Organisationen · CoMaSy</p>
          <p className="k-kicker">Die Human-Firewall-Simulationsplattform</p>
          <h1 className="k-display">Auch Sicherheitsentscheidungen verdienen Übung.</h1>
          <p className="k-lede">
            CoMaSy versetzt Mitarbeitende in realistische Vorfälle, in denen Hetze, Autorität, kompromittierte Identitäten und unvollständige Beweise Druck erzeugen — und misst, wie sie innehalten, prüfen und handeln.
          </p>
          <div className="k-actions">
            <Link className="k-button-gold" href="/de/comasy/pilotprojekt">Pilotprojekt anfragen</Link>
            <Link className="k-button-quiet" href="/de/comasy/methodik">So funktioniert es</Link>
          </div>
          <div className="k-inline-proof">
            <span><b>Kein LMS-Ersatz</b></span>
            <span><b>Definierter Pilotumfang</b></span>
            <span><b>Beobachtbare Trainingssignale</b></span>
          </div>
        </div>
        <div className="k-comasy-media">
          <Image
            src="/edition-images/workplace.png"
            alt="Team am Arbeitsplatz bespricht eine Sicherheitsentscheidung"
            fill
            priority
            sizes="(max-width: 980px) 100vw, 52vw"
          />
        </div>
      </section>

      <section className="k-comasy-pillars k-shell">
        <article><span>01</span><h3>Realistische Simulationen</h3><p>Kontextreiche Szenarien rund um Entscheidungen, die Menschen wirklich treffen müssen.</p></article>
        <article><span>02</span><h3>Verhaltenssignale</h3><p>Beobachte Innehalten, Verifizierung, Eskalation und risikoreichere Impulsentscheidungen.</p></article>
        <article><span>03</span><h3>Team & Unternehmen</h3><p>Starte mit einer begrenzten Kohorte und erweitere nur, wenn sich das Signal als nützlich erweist.</p></article>
        <article><span>04</span><h3>Messbare Veränderung</h3><p>Vergleiche Baseline- und Post-Praxis-Entscheidungen, statt dich allein auf Abschlussquoten zu verlassen.</p></article>
      </section>

      <section className="k-shell k-section">
        <div className="k-section-head">
          <div>
            <p className="k-kicker">In CoMaSy</p>
            <h2 className="k-display-sm">Entscheidungen sehen. Treiber verstehen. Ergebnisse verbessern.</h2>
          </div>
          <p className="k-copy">
            Die Oberfläche ist um Beweise herum gestaltet, nicht um Verdacht. Eine vertraute Person kann echt sein, während eine bestimmte Nachricht, ein Kanal oder eine Handlung kompromittiert ist. CoMaSy trainiert Verifizierung, ohne pauschales Misstrauen zu lehren.
          </p>
        </div>

        <div className="k-dashboard">
          <article className="k-dashboard-side">
            <small>Beispielhafter Vorfall</small>
            <h3>Zahlungsanfrage der Geschäftsführung</h3>
            <div className="k-event"><span>09:12 · Anfrage eingegangen</span><em>Hetze</em></div>
            <div className="k-event"><span>09:15 · Freigabeweg ändert sich</span><em>Autorität</em></div>
            <div className="k-event"><span>09:17 · Bekanntes Konto genutzt</span><em>Vertrautheit</em></div>
            <div className="k-event"><span>09:19 · Unabhängiger Anruf abgeraten</span><em>Notbremse</em></div>
          </article>
          <article className="k-dashboard-main">
            <small>Beispielhaftes Reporting-Modell · keine echten Kundendaten</small>
            <div className="k-metrics">
              <div className="k-metric"><strong>72%</strong><span>Beispiel: Innehalten-Quote</span></div>
              <div className="k-metric"><strong>67%</strong><span>Beispiel: unabhängige Verifizierung</span></div>
              <div className="k-metric"><strong>18%</strong><span>Beispiel: risikoreicher Impuls</span></div>
              <div className="k-metric"><strong>4</strong><span>Druckmuster-Dimensionen</span></div>
            </div>
            <div className="k-linechart" aria-label="Beispielhafte Verhaltenstrendlinie" />
          </article>
        </div>
      </section>

      <section className="k-shell k-section">
        <div className="k-section-head">
          <div>
            <p className="k-kicker">Von Awareness zu Verhaltensänderung</p>
            <h2 className="k-display-sm">Ein Vorfall. Vier entscheidende Momente.</h2>
          </div>
          <p className="k-copy">
            Wissen zählt, aber die entscheidende Frage ist, was passiert, wenn eine legitim wirkende Bitte unter Druck eintrifft.
          </p>
        </div>
        <div className="k-simulation">
          <article><b>01</b><h3>Simulieren</h3><p>Ein realistischer Vorfall mit Druck, Mehrdeutigkeit und konkurrierenden Prioritäten.</p></article>
          <article><b>02</b><h3>Entscheiden</h3><p>Mitarbeitende wählen eine Handlung, statt nur die richtige Antwort zu lesen.</p></article>
          <article><b>03</b><h3>Auswerten</h3><p>Beweise, Druckmuster und der stärkere Verifizierungsweg werden offengelegt.</p></article>
          <article><b>04</b><h3>Verbessern</h3><p>Gezielte Übung wiederholen und definierte Verhaltenssignale über die Zeit vergleichen.</p></article>
        </div>
      </section>

      <section className="k-shell k-section">
        <div className="k-pilot">
          <div>
            <p className="k-kicker">Mit einem Pilot starten</p>
            <h2 className="k-display-sm">Beweise, ob das Signal nützlich ist, bevor ihr skaliert.</h2>
            <p className="k-copy">
              Der erste CoMaSy-Schritt ist bewusst begrenzt. Kohorte und Risikofokus festlegen, eine Baseline erstellen, gezieltes Entscheidungstraining durchführen, eine Post-Variante vergleichen und entscheiden: skalieren, anpassen oder stoppen.
            </p>
            <div className="k-actions">
              <Link className="k-button-gold" href="/de/comasy/pilotprojekt">Pilotprojekt anfragen</Link>
              <Link className="k-button-quiet" href="/de/comasy/sicherheit">Sicherheit & Datenschutz</Link>
            </div>
          </div>
          <div className="k-pilot-list">
            <span>01 · Kohorte und Risikofokus vereinbaren</span>
            <span>02 · Baseline erstellen</span>
            <span>03 · Gezieltes Entscheidungstraining durchführen</span>
            <span>04 · Post-Variante auswerten</span>
            <span>05 · Skalieren / anpassen / stoppen</span>
          </div>
        </div>
      </section>

      <section className="k-shell k-section">
        <div className="k-section-head">
          <div>
            <p className="k-kicker">Fragen von Einkäufern</p>
            <h2 className="k-display-sm">Was CoMaSy ist — und was nicht.</h2>
          </div>
          <p className="k-copy">Klare Grenzen sind Teil des Produkts: CoMaSy ergänzt bestehende Awareness-Programme und gibt keine eigenständigen Compliance-Garantien.</p>
        </div>
        <div className="k-two-paths">
          <article className="k-path" style={{minHeight: "420px"}}>
            <div className="k-path-copy" style={{top: "30px", bottom: "auto"}}>
              <small>Methodik</small>
              <h3>Definierte Trainingssignale verantwortungsvoll messen.</h3>
              <p>Sieh, was gemessen wird, wie Beispielwerte behandelt werden und wo die Interpretation aufhören sollte.</p>
              <Link href="/de/comasy/methodik">Methodik lesen →</Link>
            </div>
          </article>
          <article className="k-path" style={{minHeight: "420px"}}>
            <div className="k-path-copy" style={{top: "30px", bottom: "auto"}}>
              <small>Sicherheit & Datenschutz</small>
              <h3>Dem Einkauf früher klarere Antworten geben.</h3>
              <p>Prüfe aktuelle Datenverarbeitung, Schutzmaßnahmen und Enterprise-Sicherheitshinweise vor einem Piloten.</p>
              <Link href="/de/comasy/sicherheit">Sicherheit prüfen →</Link>
            </div>
          </article>
        </div>
      </section>

      <section className="k-shell k-callout">
        <div>
          <p className="k-kicker">CoMaSy-Pilotprojekt</p>
          <h2 className="k-display-sm">Klein anfangen. Ehrlich messen. Nur skalieren, wenn es sich verdient.</h2>
        </div>
        <div className="k-actions">
          <Link className="k-button-gold" href="/de/comasy/pilotprojekt">Pilotprojekt anfragen</Link>
        </div>
      </section>
    </PremiumPageDe>
  );
}
