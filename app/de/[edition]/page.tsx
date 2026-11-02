import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PremiumPageDe } from "@/components/PremiumSiteChrome";
import { PortfolioStrip } from "@/components/PortfolioStrip";

const EDITIONS = {
  travelsafe: {
    name: "TravelSafe",
    audience: "Reisende und Urlauber",
    title: "Würdest du eine Reise-Masche erkennen, bevor sie dich Geld kostet?",
    description: "Stell dich realistischen Fällen rund um Buchung, Ferienwohnung, Taxi, Zahlung und öffentliches WLAN, erfahre deinen Bereitschaftswert und lerne den sichereren nächsten Schritt.",
    scenarios: ["Die Ferienwohnung soll plötzlich noch einmal bezahlt werden, und zwar innerhalb von Minuten.", "Der Taxifahrer nennt am Ziel einen Zuschlag, von dem vorher keine Rede war.", "Ein angeblicher Support-Account der Airline bietet eine Entschädigung an, wenn du schnell reagierst."],
  },
  family: {
    name: "Familie",
    audience: "Eltern, Kinder und ältere Angehörige",
    title: "Übt gemeinsam die Momente, in denen Druck bei eurer Familie ankommt.",
    description: "Trainiert, wie ihr auf Enkeltrick, „Hallo Mama“-Nachrichten, Paketbenachrichtigungen, geteilte Geräte und gekaperte Konten reagiert.",
    scenarios: ["Eine Nachricht klingt wie ein Verwandter, der sofort Geld braucht.", "Eine Paketbenachrichtigung verlangt eine kleine Gebühr für die erneute Zustellung.", "Auf dem gemeinsam genutzten Tablet taucht eine unerwartete Aufforderung zum Zurücksetzen des Passworts auf."],
  },
  school: {
    name: "Schule",
    audience: "Schülerinnen und Schüler von 12 bis 18 Jahren",
    title: "Erkenne den Druck hinter dem nächsten Online-Angebot.",
    description: "Übe, Fake-Gewinnspiele, Gaming-Betrug, Druck im Klassenchat, Phishing-Links und Versuche, dein Social-Media-Konto zu übernehmen, zu durchschauen.",
    scenarios: ["Für eine Gaming-Belohnung sollst du dich schnell irgendwo einloggen.", "Im Klassenchat drängt dich jemand, einen Link zu öffnen.", "Ein Gewinnspiel will deine Kontodaten, bevor der Preis „freigeschaltet“ wird."],
  },
  university: {
    name: "Universität",
    audience: "Studierende und International Offices",
    title: "Halt kurz inne, bevor aus einer Studi-Chance ein teurer Fehler wird.",
    description: "Bereite dich auf Betrug bei WG-Zimmern, Fake-Jobs, Gebührenforderungen, Marktplätzen und Identitätsdiebstahl vor.",
    scenarios: ["Die Vermieterin verlangt die Kaution, noch bevor du das Zimmer gesehen hast.", "Ein Jobangebot will sofort Kopien deiner Ausweisdokumente.", "Eine Nachricht schickt dich für die Rückmeldegebühr auf eine unbekannte Zahlungsseite."],
  },
  workplace: {
    name: "Arbeitsplatz",
    audience: "Teams, Personalabteilungen und Führungskräfte",
    title: "Teste, wie du im Job auf Druck reagierst.",
    description: "Übe sichere Reaktionen auf Phishing, Rechnungsbetrug, geänderte Gehaltsdaten, Chef-Masche und Anrufe mit KI-Stimmen.",
    scenarios: ["Die Geschäftsführung bittet um eine vertrauliche Überweisung.", "Ein Lieferant ändert seine Bankverbindung per E-Mail.", "Eine Sprachnachricht erzeugt Zeitdruck rund um die Gehaltsabrechnung."],
  },
} as const;

type EditionKey = keyof typeof EDITIONS;

export function generateStaticParams() {
  return Object.keys(EDITIONS).map((edition) => ({ edition }));
}

export async function generateMetadata(props: { params: Promise<{ edition: string }> }): Promise<Metadata> {
  const params = await props.params;
  const edition = EDITIONS[params.edition as EditionKey];
  if (!edition) return {};
  return {
    title: { absolute: `${edition.name}-Edition | Konfydence` },
    description: edition.description,
    alternates: {
      canonical: `/de/${params.edition}`,
      languages: { en: `https://konfydence.com/${params.edition}`, de: `https://konfydence.com/de/${params.edition}` },
    },
  };
}

export default async function GermanEditionPage(props: { params: Promise<{ edition: string }> }) {
  const params = await props.params;
  const edition = EDITIONS[params.edition as EditionKey];
  if (!edition) notFound();
  const startHref = `/de/challenge/${params.edition}/start?mode=diagnostic`;
  return (
    <PremiumPageDe ctaHref={startHref} ctaLabel="Kostenlosen Check starten">
      <div className="kg-shell kg-ed">
        <section className="kg-ed-hero">
          <p className="k-kicker">Challenge-Edition</p>
          <p className="kg-ed-audience">{edition.audience}</p>
          <h1>{edition.title}</h1>
          <p>{edition.description}</p>
          <Link className="k-button" href={startHref}>Kostenlosen Bereitschaftscheck starten</Link>
        </section>

        <section className="k-section" style={{ borderTop: "1px solid var(--k-line)", paddingTop: 64, paddingBottom: 64 }}>
          <p className="k-kicker">In der Challenge</p>
          <h2 className="k-display-sm">Realistische Drucksituationen für die {edition.name}-Edition.</h2>
          <div className="kg-scenario-grid">
            {edition.scenarios.map((scenario) => (
              <article key={scenario}>
                <span>Situation</span>
                <h3>{scenario}</h3>
                <p>Entscheide, was du tun würdest, und sieh dir dann den sichereren Schritt an.</p>
              </article>
            ))}
          </div>
        </section>

        <section className="k-callout" style={{ padding: "72px 0" }}>
          <div>
            <p className="k-kicker">Kostenlos starten</p>
            <h2 className="k-display-sm">Jede Edition beginnt mit einem kostenlosen Bereitschaftscheck.</h2>
            <p className="k-copy">
              Mach zuerst den kurzen Check. Wenn du so weit bist, geht es mit der vollen Challenge weiter, dem kompletten Training mit Szenarien.
            </p>
          </div>
          <div className="k-actions">
            <Link className="k-button" href={startHref}>Kostenlosen Check starten</Link>
          </div>
        </section>
      </div>

      <PortfolioStrip lang="de" exclude={[params.edition as EditionKey]} />
    </PremiumPageDe>
  );
}
