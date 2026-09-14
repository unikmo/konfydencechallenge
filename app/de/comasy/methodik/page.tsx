import Link from "next/link";
import type { Metadata } from "next";
import { PremiumPageDe } from "@/components/PremiumSiteChrome";

export const metadata: Metadata = {
  title: { absolute: "CoMaSy-Methodik | Verhaltensbasierte Sicherheitskennzahlen" },
  description:
    "Wie CoMaSy Pause Adoption, Verification Rate, Impulse Rate und H.A.C.K.-Druckmuster-Signale definiert und interpretiert.",
  alternates: {
    canonical: "/de/comasy/methodik",
    languages: { en: "https://konfydence.com/comasy/methodology", de: "https://konfydence.com/de/comasy/methodik" },
  },
};

const metrics = [
  ["Pause Adoption", "Die teilnehmende Person unterbricht die unmittelbare Handlungskette, bevor sie sich auf einen folgenreichen Schritt festlegt.", "Ob die gewählte Antwort ausdrücklich Zeit oder Raum schafft, um die Bitte vor dem Handeln zu prüfen."],
  ["Verification Rate", "Die teilnehmende Person verifiziert über einen unabhängigen, bekannten Kanal — statt sich auf den Kanal zu verlassen, über den die Bitte kam.", "Ob die gewählte Antwort eine separate vertrauenswürdige Quelle, einen Prozess oder Kontaktweg nutzt."],
  ["Impulse Rate", "Die teilnehmende Person wählt eine unmittelbare, risikoreichere Handlung ohne ausreichende unabhängige Verifizierung.", "Ob die gewählte Antwort die verlangte Handlung, Zugangsdaten, Zahlung, Freigabe oder Offenlegung zu früh festlegt."],
  ["H.A.C.K.-Profil", "Das Muster der Antworten über die Druckmechaniken Hetze, Autorität, Vertrautheit und Notbremse hinweg.", "Welcher Druckmechanismus wiederholt schwächere Entscheidungen über das Szenario-Set hinweg erzeugt."],
];

const principles = [
  ["01", "Beobachtbar", "Kennzahlen sind an konkrete Entscheidungen der Teilnehmenden geknüpft, nicht an vermutete Persönlichkeitsmerkmale."],
  ["02", "Definiert", "Jede Kennzahl hat eine schriftliche Definition, die konsistent über Szenariovarianten hinweg angewendet werden kann."],
  ["03", "Vergleichend", "Baseline- und Post-Varianten-Ergebnisse werden innerhalb einer definierten Kohorte und eines Anwendungsfalls verglichen."],
  ["04", "Begrenzt", "Ergebnisse sind Trainingsbelege. Sie stellen keine individuelle Sicherheitskompetenz oder regulatorische Konformität fest."],
];

const flow = [
  ["Baseline", "Ein definiertes Szenario-Set vor dem gezielten Training durchführen."],
  ["Gezieltes Training", "Die relevanten Druckmuster und Geschäftsabläufe üben."],
  ["Post-Variante", "Ungesehene oder deutlich unterschiedliche Szenarien nutzen, damit reines Wiedererkennen nicht als Verbesserung durchgeht."],
  ["Auswertung", "Kohortensignale vergleichen, Grenzen besprechen und über Skalierung / Anpassung / Stopp entscheiden."],
];

export default function MethodologyPageDe() {
  return (
    <PremiumPageDe ctaHref="/de/comasy/pilotprojekt" ctaLabel="Pilotprojekt anfragen">
      <section className="kg-shell kc-hero">
        <p className="k-kicker">Methodik</p>
        <h1>Den Entscheidungsprozess messen, nicht nur den Kursabschluss.</h1>
        <p>
          CoMaSy verwandelt Szenario-Entscheidungen in definierte Trainingssignale. Ziel ist, praktisches Training
          beobachtbar zu machen — ohne vorzugeben, dass ein Simulationsergebnis eine Garantie für reales Sicherheitsverhalten ist.
        </p>
      </section>

      <section className="kg-shell">
        <div className="kc-pillars">
          {principles.map(([no, title, copy]) => (
            <article key={title}><b>{no}</b><h3>{title}</h3><p>{copy}</p></article>
          ))}
        </div>
      </section>

      <section className="kg-shell k-section">
        <div className="k-section-head">
          <div>
            <p className="k-kicker">Kernsignale</p>
            <h2 className="k-display-sm">Was das Dashboard zeigen soll.</h2>
          </div>
        </div>
        <div className="kc-cards">
          {metrics.map(([name, definition, observed]) => (
            <article key={name}>
              <h3>{name}</h3>
              <p>{definition}</p>
              <span className="kc-obs">Beobachtet aus</span>
              <p>{observed}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="k-section-dark">
        <div className="kg-shell kc-split">
          <div>
            <p className="k-kicker">Pilot-Messablauf</p>
            <h2 className="k-display-sm">Baseline → Training → ungesehene Variante → Auswertung.</h2>
          </div>
          <ol className="kc-flow">
            {flow.map(([step, copy]) => (
              <li key={step}><b>{step}</b><span>{copy}</span></li>
            ))}
          </ol>
        </div>
      </section>

      <section className="kg-shell k-section">
        <div className="k-section-head">
          <div>
            <p className="k-kicker">Interpretationsgrenzen</p>
            <h2 className="k-display-sm">Was CoMaSy unterstützen kann — und was es nicht behauptet.</h2>
          </div>
        </div>
        <div className="kc-split-2">
          <div>
            <h3 style={{ fontFamily: "var(--k-display)", fontWeight: 400, fontSize: 22, margin: "0 0 8px" }}>Was CoMaSy unterstützen kann</h3>
            <ul className="kc-list">
              <li>Wiederholtes Entscheidungstraining</li>
              <li>Definierte Verhaltens-Trainingssignale</li>
              <li>Kohortenvergleich über die Zeit</li>
              <li>Diagnostik zu Druckmustern</li>
              <li>Managementtaugliche Belege aus dem Piloten</li>
            </ul>
          </div>
          <div>
            <h3 style={{ fontFamily: "var(--k-display)", fontWeight: 400, fontSize: 22, margin: "0 0 8px" }}>Was CoMaSy nicht behauptet</h3>
            <ul className="kc-list">
              <li>Eine Garantie, dass eine Mitarbeiterin oder ein Mitarbeiter einem echten Angriff entgeht</li>
              <li>Eine klinische oder psychometrische Beurteilung</li>
              <li>Einen Ersatz für Incident Response, technische Kontrollen oder Richtlinien</li>
              <li>Einen Beweis regulatorischer Konformität allein</li>
              <li>Eine verifizierte Kundenverbesserungsquote, sofern kein echter Pilot sie erzeugt hat</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="kg-shell k-callout">
        <div>
          <p className="k-kicker">Nächster Schritt</p>
          <h2 className="k-display-sm">Teste die Methodik mit einem begrenzten Piloten.</h2>
          <p className="k-copy">Vereinbart Kohorte, Risikofokus, Szenario-Set und Entscheidungskriterien, bevor ihr skaliert.</p>
        </div>
        <div className="k-actions">
          <Link className="k-button" href="/de/comasy/pilotprojekt">Pilotprojekt anfragen</Link>
        </div>
      </section>
    </PremiumPageDe>
  );
}
