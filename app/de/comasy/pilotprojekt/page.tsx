import Link from "next/link";
import type { Metadata } from "next";
import { PremiumPageDe } from "@/components/PremiumSiteChrome";

export const metadata: Metadata = {
  title: { absolute: "CoMaSy-Pilotprojekt anfragen | Sicherheits-Entscheidungssimulation" },
  description:
    "Starte ein definiertes CoMaSy-Pilotprojekt mit ausgewählter Teilnehmergruppe, Ausgangsmessung, gezieltem Entscheidungstraining, Abschlussmessung und einer Entscheidung über eine Ausweitung für die Führungsebene.",
  alternates: {
    canonical: "/de/comasy/pilotprojekt",
    languages: { en: "https://konfydence.com/comasy/pilot", de: "https://konfydence.com/de/comasy/pilotprojekt" },
  },
};

const roles = ["CISO / Sicherheitsleitung", "Sicherheitsschulungen", "Compliance", "Risikomanagement", "Personalwesen", "Personalentwicklung", "IT", "Management", "Sonstiges"];
const sizes = ["<250", "250–999", "1.000–4.999", "5.000–9.999", "10.000+"];
const objectives = ["Sicherheitsschulungen verbessern", "Verhalten messen", "NIS2", "Management-Training", "Phishing / Social Engineering", "Nachweis gesetzlicher Anforderungen", "CoMaSy evaluieren", "Sonstiges"];

const proof = [
  ["Was wir feststellen", "Ausgangsmessung", "Wie die gewählte Teilnehmergruppe vor dem gezielten Training reagiert."],
  ["Was Mitarbeitende erleben", "Training", "Kurze, realistische Social-Engineering-Entscheidungen statt eines weiteren langen Kurses."],
  ["Was wir vergleichen", "Veränderung", "Vergleich der Entscheidungen in unterschiedlichen Situationen vor und nach dem Training."],
  ["Was die Führungsebene erhält", "Beleg", "Eine Auswertung der Veränderungen und eine Grundlage für die Entscheidung über das weitere Vorgehen."],
];

export default async function PilotPageDe({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const q = await searchParams;
  return (
    <PremiumPageDe ctaHref="/de/comasy" ctaLabel="CoMaSy ansehen">
      <section className="kg-shell kc-pilot">
        <div className="kc-pilot-intro">
          <p className="k-kicker">CoMaSy-Pilotprojekt</p>
          <h1 className="k-display" style={{ fontSize: "clamp(31px,4vw,52px)" }}>
            Prüft den Nutzen des Entscheidungstrainings in eurem Unternehmen.
          </h1>
          <p className="k-lede">
            Ihr legt zunächst Teilnehmergruppe, Risikothemen und Erfolgskriterien fest. Die Übungen ergänzen eure bestehenden Schulungen. Ein Wechsel der Lernplattform ist dafür nicht nötig.
          </p>
          <div className="kg-promise">
            <span>Begrenzter Umfang</span><span>Kein LMS-Ersatz</span><span>Definierte Messung</span><span>Klare Entscheidung nach dem Pilotprojekt</span>
          </div>
          <ol className="kc-flow">
            <li><b>01 · Teilnehmergruppe</b><span>Teilnehmergruppe und Risikofokus vereinbaren.</span></li>
            <li><b>02 · Ausgangsmessung</b><span>Feststellen, wie die Teilnehmergruppe heute entscheidet.</span></li>
            <li><b>03 · Training</b><span>Gezieltes Entscheidungstraining.</span></li>
            <li><b>04 · Abschlussmessung</b><span>Deutlich unterschiedliche Szenarien und Auswertung.</span></li>
            <li><b>05 · Entscheidung</b><span>Ausweiten, anpassen oder stoppen.</span></li>
          </ol>
        </div>

        <form className="kc-form" action="/api/comasy/pilot" method="post">
          <p className="k-kicker">Pilotprojekt anfragen</p>
          <h2 className="k-display-sm" style={{ fontSize: "28px", margin: "0 0 10px" }}>Beschreibt kurz euer Ziel.</h2>
          <p className="kc-form-intro">
            Mit dieser Anfrage startet ihr ein unverbindliches Gespräch, keinen Kauf. Wir nutzen die Angaben, um den Anwendungsfall zu verstehen und einen passenden Umfang des Pilotprojekts vorzuschlagen.
          </p>
          {q.error && (
            <div className="kc-form-error">
              {q.error === "rate" ? "Zu viele Anfragen. Bitte versuch es in Kürze erneut." : "Bitte füll die Pflichtfelder mit einer gültigen dienstlichen E-Mail-Adresse aus."}
            </div>
          )}
          <div className="kc-form-row">
            <label>Vorname<input name="firstName" autoComplete="given-name" required /></label>
            <label>Nachname<input name="lastName" autoComplete="family-name" required /></label>
          </div>
          <label>Dienstliche E-Mail-Adresse<input name="workEmail" type="email" autoComplete="email" required /></label>
          <label>Organisation<input name="organization" autoComplete="organization" required /></label>
          <div className="kc-form-row">
            <label>Rolle<select name="role" required><option value="">Auswählen…</option>{roles.map((x) => <option key={x}>{x}</option>)}</select></label>
            <label>Organisationsgröße<select name="organizationSize" required><option value="">Auswählen…</option>{sizes.map((x) => <option key={x}>{x}</option>)}</select></label>
          </div>
          <label>Hauptziel<select name="primaryObjective" required><option value="">Auswählen…</option>{objectives.map((x) => <option key={x}>{x}</option>)}</select></label>
          <label>Bisherige Plattform für Sicherheitsschulungen <small>optional</small><input name="currentPlatform" /></label>
          <label>Was sollten wir noch wissen? <small>optional</small><textarea name="notes" rows={4} placeholder="Relevante Arbeitsabläufe, Teilnehmergruppe, Beschaffungs- oder Datenschutzanforderungen…" /></label>
          <label className="kc-form-consent">
            <input type="checkbox" name="consent" value="yes" required />
            <span>Ich stimme zu, dass Konfydence diese Angaben nutzen darf, um auf diese CoMaSy-Pilotanfrage zu antworten.</span>
          </label>
          <input type="hidden" name="lang" value="de" />
          <input type="hidden" name="utm_source" value={q.utm_source || ""} />
          <input type="hidden" name="utm_medium" value={q.utm_medium || ""} />
          <input type="hidden" name="utm_campaign" value={q.utm_campaign || ""} />
          <input type="hidden" name="landingPage" value="/de/comasy/pilotprojekt" />
          <button className="k-button" type="submit">Pilotprojekt anfragen</button>
          <p className="kc-form-privacy">
            Informationen findet ihr unter <Link href="/de/comasy/sicherheit">Sicherheit &amp; Datenschutz</Link> und in der <Link href="/de/datenschutz">Datenschutzerklärung</Link>.
            Pilotanfragedaten und Unternehmens-Programmdaten werden getrennt von der Aktivität im Verbraucher-Challenge gehalten.
          </p>
        </form>
      </section>

      <section className="k-section-dark">
        <div className="kg-shell kc-split">
          <div>
            <p className="k-kicker">Wofür der erste Pilot da ist</p>
            <h2 className="k-display-sm">Prüft den Nutzen, bevor ihr größer plant.</h2>
            <p className="k-copy">
              Das erste Ziel ist nicht, eine breite Human-Risk-Plattform auszurollen. Es ist festzustellen, ob realistisches Entscheidungstraining für eure Organisation nützliche Verhaltensbelege liefert.
            </p>
          </div>
          <div className="kc-split-2">
            <div>
              <h3 style={{ fontFamily: "var(--k-display)", fontWeight: 400, fontSize: 20, margin: "0 0 8px", color: "#fff" }}>Enthalten</h3>
              <ul className="kc-list">
                <li>Definierte Teilnehmergruppe und Risikofokus</li>
                <li>Übungssituationen für die Ausgangsmessung</li>
                <li>Gezieltes Entscheidungstraining</li>
                <li>Andere Übungssituationen für die Abschlussmessung</li>
                <li>Auswertung für die Führungsebene</li>
              </ul>
            </div>
            <div>
              <h3 style={{ fontFamily: "var(--k-display)", fontWeight: 400, fontSize: 20, margin: "0 0 8px", color: "#fff" }}>Zum Start nicht erforderlich</h3>
              <ul className="kc-list">
                <li>LMS-Ersatz</li>
                <li>Umfassende Anbindung an bestehende Systeme</li>
                <li>Einführung für große Gruppen</li>
                <li>Offene Simulationen mit künstlicher Intelligenz</li>
                <li>Langfristige Plattformbindung</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="kg-shell k-section">
        <div className="kc-pillars">
          {proof.map(([eyebrow, title, copy]) => (
            <article key={title}><b>{eyebrow}</b><h3>{title}</h3><p>{copy}</p></article>
          ))}
        </div>
      </section>

      <section className="kg-shell k-callout">
        <div>
          <p className="k-kicker">Bevor Teilnehmerdaten genutzt werden</p>
          <h2 className="k-display-sm">Datennutzung und Auswertung vorab klären.</h2>
          <p className="k-copy">
            Vor dem Start vereinbaren wir, welche Teilnehmerdaten benötigt werden, wer die Auswertungen sehen darf, wie lange Daten gespeichert werden und ob die Arbeitnehmervertretung eingebunden werden muss.
          </p>
        </div>
        <div className="k-actions">
          <Link className="k-button-quiet" href="/de/comasy/sicherheit">Sicherheit &amp; Datenschutz</Link>
          <Link className="k-button-quiet" href="/de/comasy/methodik">Methodik</Link>
        </div>
      </section>
    </PremiumPageDe>
  );
}
