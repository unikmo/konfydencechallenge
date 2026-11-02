import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { PremiumPageDe } from "@/components/PremiumSiteChrome";

export const metadata: Metadata = {
  title: { absolute: "CoMaSy | Training für sichere Entscheidungen von Konfydence" },
  description:
    "CoMaSy ergänzt bestehende IT-Sicherheitsschulungen durch realistische Übungen. Ihr seht, wie Mitarbeitende unter Druck entscheiden und ob sie verdächtige Aufforderungen unabhängig prüfen.",
  alternates: {
    canonical: "/de/comasy",
    languages: { en: "https://konfydence.com/comasy", de: "https://konfydence.com/de/comasy" },
  },
  openGraph: {
    title: "CoMaSy | Training für sichere Entscheidungen",
    description: "Trainiert den Umgang mit Zeitdruck, vorgetäuschter Autorität und unklaren Informationen. Vergleicht anschließend, wie Mitarbeitende in solchen Situationen entscheiden.",
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
    "CoMaSy wertet aus, wie Teilnehmende in Übungssituationen entscheiden: ob sie innehalten, Angaben unabhängig prüfen oder vorschnell handeln. Das zeigt Fortschritte im Training, ist aber keine Garantie für das Verhalten bei echten Angriffen.",
  ],
  [
    "Ist CoMaSy ein Phishing-Simulator?",
    "Nein. Neben gefälschten Nachrichten behandelt CoMaSy unter anderem manipulierte Rechnungen, vermeintliche Anweisungen der Geschäftsführung und den Missbrauch von Benutzerkonten.",
  ],
  [
    "Macht CoMaSy eine Organisation NIS2-konform?",
    "Nein. CoMaSy ergänzt regelmäßige Sicherheitsschulungen. Das Training allein ist jedoch kein Nachweis dafür, dass alle gesetzlichen Anforderungen erfüllt sind.",
  ],
];

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      "@id": "https://konfydence.com/de/comasy#service",
      name: "CoMaSy",
      serviceType: "Training für sichere Entscheidungen",
      provider: { "@type": "Organization", name: "Konfydence", url: "https://konfydence.com" },
      url: "https://konfydence.com/de/comasy",
      description:
        "Realistische Übungen zu Betrugsversuchen im Berufsalltag. Ihr seht, ob Mitarbeitende verdächtige Aufforderungen erkennen, unabhängig nachprüfen und richtig reagieren.",
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
          <h1 className="k-display">Sicher handeln, wenn es darauf ankommt.</h1>
          <p className="k-lede">
            CoMaSy versetzt Mitarbeitende in realistische Vorfälle, in denen Hetze, Autorität, kompromittierte Identitäten und unvollständige Beweise Druck erzeugen — und misst, wie sie innehalten, prüfen und handeln.
          </p>
          <div className="k-actions">
            <Link className="k-button-gold" href="/de/comasy/pilotprojekt">Pilotprojekt anfragen</Link>
            <Link className="k-button-quiet" href="/de/comasy/methodik">So funktioniert es</Link>
          </div>
          <div className="k-inline-proof">
            <span><b>Kein LMS-Ersatz</b></span>
            <span><b>Klar begrenztes Pilotprojekt</b></span>
            <span><b>Beobachtbare Trainingsergebnisse</b></span>
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
        <article><span>01</span><h3>Realistische Simulationen</h3><p>Betrugsversuche im Arbeitsalltag – von geänderten Bankdaten bis zu gefälschten Nachrichten der Geschäftsführung.</p></article>
        <article><span>02</span><h3>Nachvollziehbare Entscheidungen</h3><p>Erkennt, wann Mitarbeitende innehalten, Angaben unabhängig prüfen oder eine verdächtige Anfrage weiterleiten.</p></article>
        <article><span>03</span><h3>Team & Unternehmen</h3><p>Beginnt mit einer kleinen Gruppe. Entscheidet anhand der Ergebnisse, ob und wie ihr das Training ausweiten möchtet.</p></article>
        <article><span>04</span><h3>Messbare Veränderung</h3><p>Vergleicht die Entscheidungen vor und nach dem Training – nicht nur die Zahl abgeschlossener Kurse.</p></article>
      </section>

      <section className="k-shell k-section">
        <div className="k-section-head">
          <div>
            <p className="k-kicker">In CoMaSy</p>
            <h2 className="k-display-sm">Verstehen, wie Mitarbeitende entscheiden.</h2>
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
            <p className="k-kicker">Mehr als reine Wissensvermittlung</p>
            <h2 className="k-display-sm">Ein Fallbeispiel. Vier Schritte bis zur sicheren Entscheidung.</h2>
          </div>
          <p className="k-copy">
            Wissen zählt, aber die entscheidende Frage ist, was passiert, wenn eine legitim wirkende Bitte unter Druck eintrifft.
          </p>
        </div>
        <div className="k-simulation">
          <article><b>01</b><h3>Simulieren</h3><p>Eine realistische Situation mit Zeitdruck, unklaren Angaben und schwierigen Entscheidungen.</p></article>
          <article><b>02</b><h3>Entscheiden</h3><p>Mitarbeitende wählen eine Handlung, statt nur die richtige Antwort zu lesen.</p></article>
          <article><b>03</b><h3>Auswerten</h3><p>Die Auswertung zeigt die Warnzeichen, das Druckmuster und einen sicheren Weg zur Überprüfung.</p></article>
          <article><b>04</b><h3>Verbessern</h3><p>Gezielte Übung wiederholen und definierte Nachvollziehbare Entscheidungen über die Zeit vergleichen.</p></article>
        </div>
      </section>

      <section className="k-shell k-section">
        <div className="k-pilot">
          <div>
            <p className="k-kicker">Mit einem Pilot starten</p>
            <h2 className="k-display-sm">Prüft erst, ob das Training einen messbaren Nutzen bringt.</h2>
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
            <p className="k-kicker">Häufige Fragen für Unternehmen</p>
            <h2 className="k-display-sm">Was CoMaSy leistet – und wo die Grenzen liegen.</h2>
          </div>
          <p className="k-copy">Klare Grenzen sind Teil des Produkts: CoMaSy ergänzt bestehende Awareness-Programme und gibt keine eigenständigen Compliance-Garantien.</p>
        </div>
        <div className="k-two-paths">
          <article className="k-path" style={{minHeight: "420px"}}>
            <div className="k-path-copy" style={{top: "30px", bottom: "auto"}}>
              <small>Methodik</small>
              <h3>Ergebnisse nachvollziehbar auswerten.</h3>
              <p>Erfahrt, welche Ergebnisse gemessen werden, wie Beispielwerte gekennzeichnet sind und was sich daraus tatsächlich ableiten lässt.</p>
              <Link href="/de/comasy/methodik">Methodik lesen →</Link>
            </div>
          </article>
          <article className="k-path" style={{minHeight: "420px"}}>
            <div className="k-path-copy" style={{top: "30px", bottom: "auto"}}>
              <small>Sicherheit & Datenschutz</small>
              <h3>Sicherheit und Datenschutz vorab klären.</h3>
              <p>Prüfe aktuelle Datenverarbeitung, Schutzmaßnahmen und Sicherheitsinformationen für Unternehmen vor einem Piloten.</p>
              <Link href="/de/comasy/sicherheit">Sicherheit und Datenschutz ansehen →</Link>
            </div>
          </article>
        </div>
      </section>

      <section className="k-shell k-callout">
        <div>
          <p className="k-kicker">CoMaSy-Pilotprojekt</p>
          <h2 className="k-display-sm">Klein starten. Ergebnisse prüfen. Bei Erfolg ausweiten.</h2>
        </div>
        <div className="k-actions">
          <Link className="k-button-gold" href="/de/comasy/pilotprojekt">Pilotprojekt anfragen</Link>
        </div>
      </section>
    </PremiumPageDe>
  );
}
