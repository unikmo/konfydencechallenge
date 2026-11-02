import Link from "next/link";
import type { Metadata } from "next";
import { PremiumPageDe } from "@/components/PremiumSiteChrome";

export const metadata: Metadata = {
  title: { absolute: "Pilotprojekte für Schulen und Unternehmen | Konfydence" },
  description:
    "Probiert das Entscheidungstraining im kleinen Rahmen aus, bevor ihr es breit einführt: klar abgegrenzte Gruppe, Ausgangsmessung, gezieltes Training, Abschlussmessung und eine Entscheidung auf Basis der Ergebnisse.",
  alternates: {
    canonical: "/de/pilot",
    languages: { en: "https://konfydence.com/pilot", de: "https://konfydence.com/de/pilot" },
  },
};

const steps = [
  ["01 · Gruppe", "Teilnehmergruppe und Risikoschwerpunkt festlegen."],
  ["02 · Ausgangsmessung", "Feststellen, wie die Gruppe bislang entscheidet."],
  ["03 · Training", "Kurze, gezielte Übungen."],
  ["04 · Abschlussmessung", "Neue, deutlich andere Situationen – danach die Auswertung."],
  ["05 · Entscheidung", "Ausweiten, anpassen oder beenden."],
];

const gets = [
  ["Umfang", "Klar abgegrenzt", "Eine benannte Gruppe, ein Risikofokus, Start- und Enddatum – schriftlich festgehalten, bevor es losgeht."],
  ["Ergebnisse", "Nachvollziehbare Entscheidungen", "Innehalten, eigenständiges Überprüfen und vorschnelles Handeln in riskanten Situationen – verglichen zwischen Ausgangs- und Abschlussmessung."],
  ["Auswertung", "Ergebnisse richtig einordnen", "Was sich verändert hat, was nicht, und ob sich ein Ausbau lohnt. Die Ergebnisse beziehen sich auf das Training; sie sind kein Nachweis für die Einhaltung gesetzlicher Vorgaben."],
  ["Datenschutz", "Datenschutz vor dem Start", "Kennungen, Zugriff, Berichtsebene und Speicherdauer werden geklärt, bevor Daten von Teilnehmenden verwendet werden."],
];

export default function PilotHubPageDe() {
  return (
    <PremiumPageDe ctaHref="#wege" ctaLabel="Pilotprojekt anfragen">
      <section className="kg-shell kc-hero">
        <p className="k-kicker">Pilotprojekte im kleinen Rahmen</p>
        <h1>Entscheidungstraining erst testen. Dann über den Einsatz entscheiden.</h1>
        <p>
          In einem überschaubaren Pilotprojekt übt eine ausgewählte Gruppe typische Betrugssituationen. Eine Messung vor und nach dem Training zeigt, ob sich die Entscheidungen verbessern. Schulen und Unternehmen können jetzt ein Pilotprojekt anfragen.
        </p>
        <div className="kg-promise" style={{ marginTop: 22 }}>
          <span>Klar abgegrenzter Umfang</span><span>Ergänzt bestehende Lernsysteme</span><span>Datenschutz vorab geklärt</span><span>Ausweiten, anpassen oder beenden</span>
        </div>
      </section>

      <section id="wege" className="kg-shell k-section">
        <div className="k-section-head">
          <div>
            <p className="k-kicker">Zwei Wege</p>
            <h2 className="k-display-sm">Welches Pilotprojekt passt zu euch?</h2>
          </div>
        </div>
        <div className="kc-split-2">
          <article className="kc-note">
            <b>Schulen · 12 bis 18 Jahre</b>
            <h3 style={{ fontFamily: "var(--k-display)", fontWeight: 400, fontSize: 26, margin: "10px 0 8px" }}>Entscheidungstraining für den Unterricht</h3>
            <p>
              Falsche Gewinnspiele, Betrugsversuche beim Gaming, Druck im Klassenchat und übernommene Benutzerkonten. Die Schule behält die
              Hoheit über die Schülerdaten, und das Datenmodell wird geklärt, bevor die erste Schülerin oder der erste
              Schüler teilnimmt.
            </p>
            <div className="k-actions" style={{ marginTop: 20 }}>
              <Link className="k-button" href="/de/pilot/schulen">Schul-Pilotprojekt anfragen</Link>
            </div>
          </article>
          <article className="kc-note">
            <b>Unternehmen &amp; Teams</b>
            <h3 style={{ fontFamily: "var(--k-display)", fontWeight: 400, fontSize: 26, margin: "10px 0 8px" }}>CoMaSy: Simulation für Sicherheitsentscheidungen</h3>
            <p>
              Realistische Social-Engineering-Situationen für eine klar definierte Gruppe: Ausgangsmessung, gezieltes
              Training, Abschlussmessung. Ergänzt eure bestehenden Sicherheitsschulungen.
            </p>
            <div className="k-actions" style={{ marginTop: 20 }}>
              <Link className="k-button" href="/de/comasy/pilotprojekt">Pilotprojekt anfragen</Link>
              <Link className="k-button-quiet" href="/de/comasy/methodik">Zur Methodik</Link>
            </div>
          </article>
        </div>
      </section>

      <section className="k-section-dark">
        <div className="kg-shell kc-split">
          <div>
            <p className="k-kicker">So läuft ein Pilotprojekt ab</p>
            <h2 className="k-display-sm">Fünf Schritte, für Schulen und Teams gleich.</h2>
          </div>
          <ol className="kc-flow" style={{ marginTop: 0 }}>
            {steps.map(([title, copy]) => (
              <li key={title}><b>{title}</b><span>{copy}</span></li>
            ))}
          </ol>
        </div>
      </section>

      <section className="kg-shell k-section">
        <div className="kc-pillars">
          {gets.map(([eyebrow, title, copy]) => (
            <article key={title}><b>{eyebrow}</b><h3>{title}</h3><p>{copy}</p></article>
          ))}
        </div>
      </section>

      <section className="kg-shell k-callout">
        <div>
          <p className="k-kicker">Datenschutz vor der ersten Übung</p>
          <h2 className="k-display-sm">Klären wir zuerst, welche Daten wirklich gebraucht werden.</h2>
          <p className="k-copy">
            Mit einer Anfrage vereinbart ihr zunächst ein unverbindliches Gespräch. Eine Buchung ist damit nicht verbunden. Dafür müsst ihr keine Daten von
            Teilnehmenden angeben.
          </p>
        </div>
        <div className="k-actions">
          <Link className="k-button-quiet" href="/de/comasy/sicherheit">Sicherheit &amp; Datenschutz</Link>
          <Link className="k-button-quiet" href="/de/datenschutz">Datenschutzerklärung</Link>
        </div>
      </section>
    </PremiumPageDe>
  );
}
