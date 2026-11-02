import Link from "next/link";
import type { Metadata } from "next";
import { PremiumPageDe } from "@/components/PremiumSiteChrome";

export const metadata: Metadata = {
  title: { absolute: "Pilotprojekt für Schulen anfragen | Konfydence" },
  description:
    "Ein Pilotprojekt mit einer Klasse oder Jahrgangsstufe von 12 bis 18 Jahren. Die Schule entscheidet über den Umgang mit den Daten der Schülerinnen und Schüler, und das Datenmodell wird geklärt, bevor die Schülerinnen und Schüler teilnehmen.",
  alternates: {
    canonical: "/de/pilot/schulen",
    languages: { en: "https://konfydence.com/pilot/schools", de: "https://konfydence.com/de/pilot/schulen" },
  },
};

const roles = ["Schulleitung / stellv. Schulleitung", "Lehrkraft", "Schulsozialarbeit / Schutzkonzept", "IT / Digitalbeauftragte", "Datenschutzbeauftragte", "Schulträger / Schulbehörde", "Sonstiges"];
const sizes = ["Weniger als 250 Schülerinnen und Schüler", "250 bis 999 Schülerinnen und Schüler", "Mehr als 1.000 Schülerinnen und Schüler"];
const ageGroups = ["12–13 Jahre", "14–15 Jahre", "16–18 Jahre", "Gemischt"];
const objectives = ["Unterricht zur Online-Sicherheit ergänzen", "Schutzkonzept der Schule", "Entscheidungsverhalten messen", "Konfydence kennenlernen", "Sonstiges"];

const gate = [
  ["Die Schule entscheidet", "Die Schule (bzw. der Schulträger) ist die verantwortliche Stelle. Konfydence verarbeitet die Daten in ihrem Auftrag, auf Grundlage eines schriftlichen Auftragsverarbeitungsvertrags (AVV)."],
  ["Rechtsgrundlage und Elterninformation", "Welche Rechtsgrundlage gilt und wie die Eltern informiert werden, legt die Schule fest. Ab welchem Alter Kinder selbst in digitale Dienste einwilligen dürfen, regelt jedes EU-Land für sich (zwischen 13 und 16 Jahren). Diese Regelung klären wir vorab mit euch."],
  ["Pseudonyme statt Namen", "Die Lehrkraft legt für die Klasse nummerierte Pseudonyme an (etwa „Lernende 01“). Namen und E-Mail-Adressen werden weder eingegeben noch bei uns gespeichert. Wer sich hinter welchem Pseudonym verbirgt, weiß nur die Schule. Pseudonyme lassen sich jederzeit sperren, die zugehörigen Daten löschen."],
  ["Auswertung für die Klasse", "Ergebnisse gibt es standardmäßig für die Klasse oder die Jahrgangsstufe. Einzelergebnisse gibt es nur, wenn die Schule das wünscht – und dann nur für benannte Personen im Kollegium."],
  ["Keine Werbung für Schülerinnen und Schüler", "Schülerdaten dienen ausschließlich der Durchführung des Pilotprojekts, nie der Werbung oder dem Marketing gegenüber Schülerinnen und Schülern. Das halten wir im Vertrag fest. Das Kollegium dürfen wir weiterhin zu unserem Angebot ansprechen."],
  ["Automatische Löschung", "Die Speicherdauer wird im Vertrag festgelegt. Ist sie abgelaufen, löschen wir die Antworten und die Pseudonyme automatisch."],
  ["Datenschutz-Folgenabschätzung, falls nötig", "Verlangt euer Land oder euer Schulträger eine Datenschutz-Folgenabschätzung, liefern wir die dafür nötigen Angaben zum Dienst."],
];

const flow = [
  ["01 · Gruppe", "Klasse oder Jahrgangsstufe und Risikofokus festlegen."],
  ["02 · Ausgangsmessung", "Zeigen, wie die Schülerinnen und Schüler heute entscheiden."],
  ["03 · Training", "Kurze, gezielte Übungen."],
  ["04 · Abschlussmessung", "Neue, deutlich andere Situationen."],
  ["05 · Entscheidung", "Ausweiten, anpassen oder beenden."],
];

export default async function SchulPilotPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const q = await searchParams;
  return (
    <PremiumPageDe ctaHref="#anfrage" ctaLabel="Pilot anfragen">
      <section className="kg-shell kc-pilot">
        <div className="kc-pilot-intro">
          <p className="k-kicker">Pilotprojekt für Schulen · 12 bis 18 Jahre</p>
          <h1 className="k-display" style={{ fontSize: "clamp(31px,4vw,52px)" }}>
            Probiert das Entscheidungstraining mit einer Klasse aus, bevor ihr es ausrollt.
          </h1>
          <p className="k-lede">
            Ihr startet mit einer Klasse oder Jahrgangsstufe und einem festen Risikofokus: Gaming-Belohnungen,
            Fake-Gewinnspiele, Druck im Klassenchat und gekaperte Accounts. Das Datenmodell klären wir mit eurer Schule,
            bevor die Schülerinnen und Schüler teilnehmen.
          </p>
          <div className="kg-promise">
            <span>Die Schule hat die Hoheit über die Daten</span><span>Datenmodell vorab geklärt</span><span>Auswertung für die Klasse</span><span>Ausweiten, anpassen oder beenden</span>
          </div>
          <ol className="kc-flow">
            {flow.map(([title, copy]) => (
              <li key={title}><b>{title}</b><span>{copy}</span></li>
            ))}
          </ol>
        </div>

        <form id="anfrage" className="kc-form" action="/api/comasy/pilot" method="post">
          <p className="k-kicker">Pilotprojekt für Schulen anfragen</p>
          <h2 className="k-display-sm" style={{ fontSize: "28px", margin: "0 0 10px" }}>Sagt uns, was ihr herausfinden wollt.</h2>
          <p className="kc-form-intro">
            Das ist eine unverbindliche Anfrage, kein Kauf. Bitte füllt sie als Schulpersonal aus.
            <strong> Tragt keine Namen oder persönlichen Angaben von Schülerinnen und Schülern ein.</strong>
          </p>
          {q.error && (
            <div className="kc-form-error">
              {q.error === "rate" ? "Zu viele Anfragen. Bitte versucht es in einigen Minuten noch einmal." : "Bitte füllt alle Pflichtfelder aus und gebt eine gültige Schul-E-Mail-Adresse an."}
            </div>
          )}
          <div className="kc-form-row">
            <label>Vorname<input name="firstName" autoComplete="given-name" required /></label>
            <label>Nachname<input name="lastName" autoComplete="family-name" required /></label>
          </div>
          <label>Schul-E-Mail-Adresse<input name="workEmail" type="email" autoComplete="email" required /></label>
          <label>Name der Schule oder des Trägers<input name="organization" autoComplete="organization" required /></label>
          <div className="kc-form-row">
            <label>Eure Funktion<select name="role" required><option value="">Bitte wählen…</option>{roles.map((x) => <option key={x}>{x}</option>)}</select></label>
            <label>Größe der Schule<select name="organizationSize" required><option value="">Bitte wählen…</option>{sizes.map((x) => <option key={x}>{x}</option>)}</select></label>
          </div>
          <div className="kc-form-row">
            <label>Land<input name="country" autoComplete="country-name" required /></label>
            <label>Alter der Schülerinnen und Schüler<select name="ageGroup" required><option value="">Bitte wählen…</option>{ageGroups.map((x) => <option key={x}>{x}</option>)}</select></label>
          </div>
          <label>Wichtigstes Ziel<select name="primaryObjective" required><option value="">Bitte wählen…</option>{objectives.map((x) => <option key={x}>{x}</option>)}</select></label>
          <label>Noch etwas, das wir wissen sollten? <small>optional</small><textarea name="notes" rows={4} placeholder="Jahrgangsstufe, Zeitraum, Anforderungen aus Schutzkonzept oder Datenschutz…" /></label>
          <label className="kc-form-consent">
            <input type="checkbox" name="consent" value="yes" required />
            <span>Ich bin einverstanden, dass Konfydence meine Angaben nutzt, um auf diese Pilotanfrage zu antworten. Ich habe keine personenbezogenen Daten von Schülerinnen oder Schülern angegeben.</span>
          </label>
          <input type="hidden" name="lang" value="de" />
          <input type="hidden" name="audience" value="school" />
          <input type="hidden" name="utm_source" value={q.utm_source || ""} />
          <input type="hidden" name="utm_medium" value={q.utm_medium || ""} />
          <input type="hidden" name="utm_campaign" value={q.utm_campaign || ""} />
          <input type="hidden" name="landingPage" value="/de/pilot/schulen" />
          <button className="k-button" type="submit">Pilotprojekt für Schulen anfragen</button>
          <p className="kc-form-privacy">
            Lest dazu <Link href="/de/comasy/sicherheit#schulen">Schulen &amp; Schülerdaten</Link> und die <Link href="/de/datenschutz#kinder">Datenschutzerklärung</Link>.
          </p>
        </form>
      </section>

      <section id="schuelerdaten" className="k-section-dark">
        <div className="kg-shell kc-split">
          <div>
            <p className="k-kicker">Schülerdaten</p>
            <h2 className="k-display-sm">Sieben Punkte, die wir klären, bevor Schülerinnen und Schüler teilnehmen.</h2>
            <p className="k-copy">
              Daten von Kindern verdienen mehr Sorgfalt als Daten von Erwachsenen. Diese Punkte sind die Grundlage für den
              Pilotvertrag. Sie sind keine Zertifizierung und ersetzen nicht eure eigene rechtliche Prüfung.
            </p>
          </div>
          <ul className="kc-list">
            {gate.map(([title, copy]) => (
              <li key={title}><strong style={{ color: "#fff", display: "block", marginBottom: 4 }}>{title}</strong>{copy}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="kg-shell k-callout">
        <div>
          <p className="k-kicker">Keine Schule?</p>
          <h2 className="k-display-sm">Für Unternehmen und Teams gibt es ein eigenes Pilotprojekt.</h2>
        </div>
        <div className="k-actions">
          <Link className="k-button-quiet" href="/de/comasy/pilotprojekt">CoMaSy-Pilotprojekt</Link>
          <Link className="k-button-quiet" href="/de/pilot">Alle Pilotprojekte</Link>
        </div>
      </section>
    </PremiumPageDe>
  );
}
