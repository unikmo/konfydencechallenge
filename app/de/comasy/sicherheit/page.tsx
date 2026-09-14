import Link from "next/link";
import type { Metadata } from "next";
import { PremiumPageDe } from "@/components/PremiumSiteChrome";

export const metadata: Metadata = {
  title: { absolute: "CoMaSy Sicherheit & Datenschutz | Konfydence" },
  description:
    "Aktuelle CoMaSy-Informationen zu Sicherheit, Datenschutz und Pilot-Datenverarbeitung für die Unternehmensprüfung und Beschaffungsgespräche.",
  alternates: {
    canonical: "/de/comasy/sicherheit",
    languages: { en: "https://konfydence.com/comasy/security", de: "https://konfydence.com/de/comasy/sicherheit" },
  },
};

const controls = [
  ["Anwendungssicherheit", "Die aktuelle Webanwendung konfiguriert Sicherheits-Header, darunter CSP, HSTS, X-Content-Type-Options, Referrer-Policy und Frame-Beschränkungen."],
  ["Schutz des Pilot-Formulars", "Pilotanfragen werden serverseitig validiert und ratenbegrenzt, bevor Lead-Datensätze angelegt werden."],
  ["Consent-bewusste Analyse", "Die GA4-Instrumentierung ist optional und soll erst nach ausdrücklicher Analyse-Einwilligung Verhaltens-Events senden."],
  ["Datenminimierung", "Der Pilotumfang sollte vorab festlegen, welche Teilnehmer- und Kohortendaten tatsächlich benötigt werden. Ein Reporting auf Einzelpersonenebene wird nicht standardmäßig vorausgesetzt."],
];

const dataItems = [
  ["Pilotanfragedaten", "Name, dienstliche E-Mail-Adresse, Organisation, Rolle, Organisationsgröße, Ziel, aktuelle Plattform, Notizen, Einwilligung und Zuordnungsfelder können über den Pilotanfrage-Ablauf erfasst werden."],
  ["Teilnehmerdaten", "Für einen Piloten können Szenario-Antworten und daraus abgeleitete Trainingssignale erforderlich sein. Die genauen Teilnehmer-Identifikatoren und die Reporting-Granularität werden vor der Übung vereinbart."],
  ["Zugriff & Aufbewahrung", "Kundenspezifische Zugriffs-, Aufbewahrungs- und Löschanforderungen sollten im Pilotumfang oder in der kommerziellen Vereinbarung dokumentiert werden, bevor echte Teilnehmerdaten verarbeitet werden."],
];

const checklist = [
  "Wer ist der Verantwortliche für die Kundendaten, und wer verarbeitet Daten in dessen Auftrag?",
  "Welche Teilnehmer-Identifikatoren sind notwendig?",
  "Kann der Pilot auf Kohortenebene ausgewertet werden?",
  "Wer kann auf Rohantworten und abgeleitete Signale zugreifen?",
  "Welche Aufbewahrungs-/Löschfrist gilt?",
  "Sind Freigaben von Betriebsrat oder Arbeitnehmervertretung erforderlich?",
  "Welche Subunternehmer und Hosting-Regionen gelten für die vereinbarte Umgebung?",
  "Was passiert, wenn der Kunde nach dem Piloten aufhört?",
];

const legalLinks = [
  ["/de/datenschutz", "Datenschutzerklärung", "Datenschutzinformationen zu Website und Dienst."],
  ["/de/agb", "AGB", "Aktuelle öffentliche Nutzungsbedingungen."],
  ["/de/impressum", "Impressum", "Rechtliche Betreiber- und Kontaktangaben."],
  ["/cookie-policy", "Cookie-Richtlinie", "Cookie- und Analyseinformationen (derzeit nur auf Englisch)."],
];

export default function SecurityPageDe() {
  return (
    <PremiumPageDe ctaHref="/de/comasy/pilotprojekt" ctaLabel="Pilotprojekt anfragen">
      <section className="kg-shell kc-hero">
        <p className="k-kicker">Sicherheit &amp; Datenschutz</p>
        <h1>Die Unternehmensprüfung sollte vor dem Piloten beginnen, nicht danach.</h1>
        <p>
          Diese Seite dokumentiert, was in der aktuellen CoMaSy-Implementierung sichtbar ist, und die Datenschutzfragen,
          die für einen Piloten geklärt werden müssen. Sie ist keine Zertifizierung, kein AVV und kein Ersatz für die
          rechtliche und sicherheitstechnische Prüfung eurer Organisation.
        </p>
      </section>

      <section className="kg-shell k-section">
        <div className="k-section-head">
          <div>
            <p className="k-kicker">Aktuelle Umsetzung</p>
            <h2 className="k-display-sm">Technische Schutzmaßnahmen, die bereits in der Anwendung stecken.</h2>
          </div>
        </div>
        <div className="kc-cards">
          {controls.map(([title, copy]) => (
            <article key={title}><h3>{title}</h3><p>{copy}</p></article>
          ))}
        </div>
      </section>

      <section className="k-section-dark">
        <div className="kg-shell kc-split">
          <div>
            <p className="k-kicker">Pilotdaten</p>
            <h2 className="k-display-sm">Den minimalen Datensatz vor dem Start festlegen.</h2>
            <p className="k-copy">
              CoMaSy ist um beobachtbare Szenario-Entscheidungen herum aufgebaut. Der Pilot sollte genau festlegen,
              welche Felder erforderlich sind, wer auf Ergebnisse zugreifen darf und ob das Reporting individuell,
              auf Kohortenebene oder beides erfolgt.
            </p>
          </div>
          <ul className="kc-list">
            {dataItems.map(([title, copy]) => (
              <li key={title}><strong style={{ color: "#fff", display: "block", marginBottom: 4 }}>{title}</strong>{copy}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="kg-shell k-section">
        <div className="kc-split-2">
          <div>
            <p className="k-kicker">Architektur &amp; Dienstleister</p>
            <h2 className="k-display-sm" style={{ fontSize: "clamp(24px,2.6vw,32px)" }}>Was die aktuelle Codebasis nutzt.</h2>
            <p className="k-copy" style={{ marginTop: 14 }}>
              Die aktuelle Konfydence-Anwendung basiert auf Next.js/React mit einer Prisma- und PostgreSQL/Supabase-Architektur
              und wird über Vercel bereitgestellt. Der Pilot-Workflow nutzt bei entsprechender Konfiguration eine Resend-E-Mail-Integration.
              Verbraucher-Checkout, Rechnungsstellung und Abonnements laufen über Stripe.
            </p>
          </div>
          <div className="kc-note">
            <b>Hinweis für die Beschaffung</b>
            <p>
              Bereitstellungsspezifische Subunternehmer, Regionen, Aufbewahrungsfristen, Auftragsverarbeitungsbedingungen
              und kundenspezifische Sicherheitsanforderungen müssen für die tatsächliche Pilotumgebung bestätigt werden.
              Diese Seite behauptet bewusst keine ungeprüfte Zertifizierung oder vertragliche Kontrolle.
            </p>
          </div>
        </div>
      </section>

      <section className="k-section-dark">
        <div className="kg-shell kc-split">
          <div>
            <p className="k-kicker">Prüfliste vor dem Piloten</p>
            <h2 className="k-display-sm">Fragen, die vor der Nutzung von Teilnehmerdaten geklärt sein sollten.</h2>
          </div>
          <ul className="kc-list">
            {checklist.map((q) => <li key={q}>{q}</li>)}
          </ul>
        </div>
      </section>

      <section className="kg-shell k-section">
        <div className="k-section-head">
          <div>
            <p className="k-kicker">Rechtliches &amp; Richtlinien</p>
            <h2 className="k-display-sm">Referenzdokumente.</h2>
          </div>
        </div>
        <div className="kc-linkcards">
          {legalLinks.map(([href, title, copy]) => (
            <Link key={href} href={href}><b>{title}</b><span>{copy}</span></Link>
          ))}
        </div>
      </section>

      <section className="kg-shell k-callout">
        <div>
          <p className="k-kicker">Pilotprojekt anfragen</p>
          <h2 className="k-display-sm">Bring eure Sicherheits- und Datenschutzfragen in den Pilotumfang ein.</h2>
          <p className="k-copy">Eine qualifizierte Pilotanfrage sollte Datenmodell und Prüfanforderungen vor der Skalierung ausdrücklich klären.</p>
        </div>
        <div className="k-actions">
          <Link className="k-button" href="/de/comasy/pilotprojekt">Pilotprojekt anfragen</Link>
        </div>
      </section>
    </PremiumPageDe>
  );
}
