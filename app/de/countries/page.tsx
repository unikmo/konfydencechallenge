import Link from "next/link";
import type { Metadata } from "next";
import { COUNTRY_GUIDES_DE } from "@/lib/country-guides-de";
import { PremiumPageDe } from "@/components/PremiumSiteChrome";
import GermanCountryDirectory from "./GermanCountryDirectory";
import styles from "../../countries/countries.module.css";

export const metadata: Metadata = {
  title: { absolute: "Betrugsmaschen nach Reiseziel | Konfydence" },
  description: "Hinweise zu typischen Betrugsmaschen in ausgewählten Reiseländern – mit Links zu offiziellen Reiseinformationen.",
  alternates: {
    canonical: "/de/countries",
    languages: { en: "https://konfydence.com/countries", de: "https://konfydence.com/de/countries" },
  },
};

export default function CountriesPageDe() {
  const slugs = Object.keys(COUNTRY_GUIDES_DE);

  return (
    <PremiumPageDe ctaHref="/de/challenge/travelsafe/start?mode=diagnostic" ctaLabel="TravelSafe kostenlos testen">
      <div className={styles.shell}>
        <section className={styles.hero}>
          <p className={styles.eyebrow}>Betrugsmaschen nach Reiseziel</p>
          <h1>Welche Betrugsmaschen gibt es an deinem Reiseziel?</h1>
        </section>

        <section className={styles.sourceNotice} aria-label="Offizielle Länderinformationsquellen">
          <p className={styles.eyebrow}>Offizielle Quellen</p>
          <p>Länderinformationen stammen aus offiziellen kanadischen und neuseeländischen Reisehinweisen. Wir zeigen die dort veröffentlichten Betrugs- und Abzocke-Hinweise (auf Englisch, im Original) und verlinken dich zu den Originalseiten. Informiere dich vor der Reise zusätzlich bei offiziellen staatlichen Stellen.</p>
        </section>

        <section className={styles.sourceNotice} aria-label="Sprachhinweis">
          <p className={styles.eyebrow}>Ausgewählte Reiseziele</p>
          <p>
            Diese deutsche Ausgabe deckt die {slugs.length} meistgesuchten Reiseziele ab. Die vollständige Liste
            aller Länder mit offiziellen Reisehinweisen gibt es auf{" "}
            <Link href="/countries" style={{ color: "inherit", textDecoration: "underline" }}>Englisch</Link>.
          </p>
        </section>

        <GermanCountryDirectory slugs={slugs} />

        <section className={styles.practice}>
          <div><p className={styles.eyebrow}>Vor der Reise üben</p><h2>Wie reagierst du auf eine verdächtige Situation?</h2><p>Probiere den kostenlosen TravelSafe-Sicherheitscheck aus. Wenn du möchtest, kannst du anschließend mit weiteren Situationen üben.</p></div>
          <Link href="/de/challenge/travelsafe/start?mode=diagnostic" className={styles.primaryLink}>Kostenlosen Check starten</Link>
        </section>
      </div>
    </PremiumPageDe>
  );
}
