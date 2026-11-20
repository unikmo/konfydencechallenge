import Link from "next/link";
import type { Metadata } from "next";
import { PremiumPageDe } from "@/components/PremiumSiteChrome";

export const metadata: Metadata = {
  title: "Konfydence FAQ | Challenges, Ergebnisse, Preise und Datenschutz",
  description: "Antworten zum kostenlosen Check, H.A.C.K., P.A.T., Ergebnissen, Jahresabos und Datenschutz.",
  alternates: { canonical: "/de/faq", languages: { en: "https://konfydence.com/faq", de: "https://konfydence.com/de/faq" } },
};

const questions: Array<[string, string]> = [
  ["Was passiert in einer Challenge?", "Du siehst eine realistische Situation, entscheidest dich für eine von drei möglichen Reaktionen und erfährst sofort, was daran sicher oder riskant war. Der kostenlose Check gibt einen ersten Einblick in deine Druckmuster. Mit der kostenpflichtigen Edition kannst du weiterüben."],
  ["Was ist kostenlos?", "Der erste Check kostet nichts. Zum Losspielen brauchst du kein Konto. Nach jeder Entscheidung bekommst du Feedback. Am Ende erhältst du eine Auswertung und dein H.A.C.K.-Profil. Die kostenpflichtigen Challenges sind optional."],
  ["Brauche ich eine E-Mail-Adresse für mein Ergebnis?", "Gäste ab 16 Jahren erhalten ihr fertiges Ergebnis per E-Mail und können es anschließend auf dem Bildschirm ansehen. Unter 16-Jährige sehen das Ergebnis ohne E-Mail-Abfrage. Für einen zweiten kostenlosen Check brauchst du ein bestätigtes Konto. Insgesamt sind derzeit zwei kostenlose Checks vorgesehen."],
  ["Was sagt mein Readiness Score aus?", "Er bewertet deine Entscheidungen in den gespielten Situationen. Das zusätzliche H.A.C.K.-Profil zeigt, bei welchen Druckmustern du besonders üben kannst. Der Wert ist ein Trainingssignal und keine Garantie, im Alltag vor Betrug geschützt zu sein."],
  ["Wofür steht H.A.C.K.?", "Hurry bedeutet Zeitdruck, Authority scheinbare Autorität, Comfort Vertrautheit und Kill-Switch den entscheidenden Moment, in dem du ohne unabhängige Prüfung klicken, bezahlen, zustimmen oder Daten teilen sollst."],
  ["Was bedeutet P.A.T.?", "Pause: Halte kurz inne. Assess: Prüfe, was wirklich von dir verlangt wird. Talk: Frage eine vertraute Person oder prüfe über einen selbst gewählten, unabhängigen Kontaktweg nach."],
  ["Welche Edition passt zu mir?", "Familie behandelt etwa falsche Notrufe, Zahlungen und Konten. Schule konzentriert sich auf Gaming, soziale Medien und Gruppendruck (12–18 Jahre). Hochschule umfasst Wohnungssuche, Jobs und Studiengebühren. Beruf behandelt unter anderem Rechnungen und Chef-Imitationen. TravelSafe dreht sich um Buchungen, Zahlungen und Entscheidungen auf Reisen."],
  ["Wie umfangreich sind die Editionen?", "Jede Edition bietet mehr als 40 realistische Übungssituationen. Derzeit enthalten die Ausgangssammlungen jeweils 48 bewertete Szenarien. Gespielt wird in kürzeren, ausgewogenen Runden."],
  ["Was kostet Konfydence?", "Der erste Check ist kostenlos. Eine vollständige Edition kostet €6,99 im Jahr, alle fünf zusammen €24,99 im Jahr. Für Schulen und Unternehmen gibt es ein Angebot für €4,99 pro Platz und Jahr. Verbindlicher Preis und Zahlungswährung werden im Checkout angezeigt."],
  ["Ist die Challenge ein einmaliger Kauf?", "Nein. Die kostenpflichtigen Angebote sind Jahresabos. Bitte prüfe vor dem Kauf die Bedingungen für Verlängerung und Kündigung im Checkout und in den AGB."],
  ["Kann ich die Challenge verschenken?", "Ja. Über die Geschenkfunktion kannst du einen digitalen Zugangscode mit einer Nachricht verschenken. Konfydence verschickt dabei keinen physischen Gegenstand."],
  ["Schützt mich Konfydence vor Betrug?", "Eine Garantie gibt es nicht. Konfydence vermittelt praktische Entscheidungsgewohnheiten, bietet aber weder Versicherungsleistungen noch Rechts-, Finanz- oder technische Notfallberatung. Bei einem echten Vorfall wende dich über einen unabhängig geprüften Kontaktweg an deine Bank oder die zuständigen Stellen."],
  ["Was passiert mit meinen Daten?", "Für Auswertung und Fortschritt werden Sitzungsdaten verarbeitet. Bei Gästen ab 16 Jahren gehört zur Ergebniszustellung eine E-Mail-Adresse. Einzelheiten zu Datenverarbeitung, Aufbewahrung und Rechten stehen in der Datenschutzerklärung."],
];

export default function GermanFAQPage() {
  return <PremiumPageDe ctaHref="/de/challenge" ctaLabel="Kostenlos ausprobieren">
    <section className="kg-shell k-section" style={{ borderTop: 0, maxWidth: 850, paddingTop: 72 }}>
      <p className="k-kicker">Die wichtigen Details</p>
      <h1 className="k-display">Gute Fragen. Klare Antworten.</h1>
      <p className="k-lede">Hier erfährst du, wie die Challenge, deine Auswertung und die optionalen Abos wirklich funktionieren.</p>
      <div style={{ display: "grid", gap: 8, marginTop: 36 }}>
        {questions.map(([question, answer]) => <details key={question} style={{ borderBottom: "1px solid var(--k-line)", padding: "18px 4px" }}>
          <summary style={{ cursor: "pointer", fontSize: 19, fontWeight: 700 }}>{question}</summary>
          <p className="k-copy" style={{ marginTop: 12, maxWidth: 760 }}>{answer}</p>
        </details>)}
      </div>
      <p className="k-copy" style={{ marginTop: 34 }}>Alle Bedingungen findest du in den <Link href="/de/agb">AGB</Link> und der <Link href="/de/datenschutz">Datenschutzerklärung</Link>. Weitere Fragen? <Link href="/de/kontakt">Schreib uns</Link>.</p>
      <div className="k-actions" style={{ marginTop: 24 }}><Link className="k-button" href="/de/challenge">Würdest du es erkennen? Kostenlos testen →</Link></div>
    </section>
  </PremiumPageDe>;
}
