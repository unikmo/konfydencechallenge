import { PremiumPage, PremiumPageDe } from "@/components/PremiumSiteChrome";

const STRINGS = {
  en: {
    ctaLabel: "Back to CoMaSy",
    kicker1: "Pilot request received",
    h1: "Your pilot request is in.",
    recorded: (org: string) => `We have recorded the request for ${org}. `,
    body: "The next step is to turn the request into a defined enterprise evaluation — not a generic software demo.",
    bookCall: "Book a 20-minute scoping call",
    kicker2: "What happens next",
    h2: "From request to scoped evaluation.",
    steps: [
      ["01", "Review the use case", "We check the buyer objective, current programme and intended cohort."],
      ["02", "Agree the cohort and risk focus", "Department, role, geography and the pressure situations worth rehearsing."],
      ["03", "Establish pilot measures", "Participation, Pause Adoption, Verification, Impulse and trigger-specific movement."],
      ["04", "Configure the programme", "Baseline, targeted practice, follow-up and the final results review."],
    ],
    noteTitle: "Request recorded",
    noteBody: "The account team will use the details you submitted to arrange scoping. A calendar link appears here only when scheduling is configured.",
    ctaHref: "/comasy",
  },
  de: {
    ctaLabel: "Zurück zu CoMaSy",
    kicker1: "Pilotanfrage eingegangen",
    h1: "Deine Pilotanfrage ist da.",
    recorded: (org: string) => `Wir haben die Anfrage für ${org} erfasst. `,
    body: "Der nächste Schritt ist, aus der Anfrage eine definierte Unternehmensevaluierung zu machen — keine generische Software-Demo.",
    bookCall: "20-minütiges Scoping-Gespräch buchen",
    kicker2: "Wie es weitergeht",
    h2: "Von der Anfrage zur abgegrenzten Evaluierung.",
    steps: [
      ["01", "Anwendungsfall prüfen", "Wir prüfen das Ziel der anfragenden Person, das aktuelle Programm und die vorgesehene Kohorte."],
      ["02", "Kohorte und Risikofokus vereinbaren", "Abteilung, Rolle, Region und die Drucksituationen, die es zu üben lohnt."],
      ["03", "Pilot-Kennzahlen festlegen", "Teilnahme, Pause Adoption, Verifizierung, Impuls und triggerspezifische Veränderung."],
      ["04", "Programm konfigurieren", "Baseline, gezieltes Training, Follow-up und die abschließende Ergebnisauswertung."],
    ],
    noteTitle: "Anfrage erfasst",
    noteBody: "Das Account-Team nutzt die eingereichten Angaben, um das Scoping zu organisieren. Ein Kalenderlink erscheint hier nur, wenn eine Terminplanung eingerichtet ist.",
    ctaHref: "/de/comasy",
  },
} as const;

export default async function PilotThankYou({ searchParams }: { searchParams: Promise<{ org?: string; lang?: string }> }) {
  const { org, lang: langParam } = await searchParams;
  const lang = langParam === "de" ? "de" : "en";
  const t = STRINGS[lang];
  const Page = lang === "de" ? PremiumPageDe : PremiumPage;
  const calendar = process.env.NEXT_PUBLIC_COMASY_CALENDAR_URL;
  return (
    <Page ctaHref={t.ctaHref} ctaLabel={t.ctaLabel}>
      <section className="kg-shell kc-hero">
        <p className="k-kicker">{t.kicker1}</p>
        <h1>{t.h1}</h1>
        <p>
          {org ? t.recorded(org) : ""}
          {t.body}
        </p>
        {calendar ? (
          <div className="k-actions">
            <a className="k-button" href={calendar} rel="noopener noreferrer">{t.bookCall}</a>
          </div>
        ) : null}
      </section>

      <section className="kg-shell k-section">
        <div className="k-section-head">
          <div>
            <p className="k-kicker">{t.kicker2}</p>
            <h2 className="k-display-sm">{t.h2}</h2>
          </div>
        </div>
        <div className="kc-pillars">
          {t.steps.map(([no, title, copy]) => (
            <article key={no}><b>{no}</b><h3>{title}</h3><p>{copy}</p></article>
          ))}
        </div>
        {!calendar ? (
          <div className="kc-note" style={{ marginTop: 28 }}>
            <b>{t.noteTitle}</b>
            <p>{t.noteBody}</p>
          </div>
        ) : null}
      </section>
    </Page>
  );
}
