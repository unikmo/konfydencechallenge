import Link from "next/link";
import type { Metadata } from "next";
import { COUNTRY_GUIDES_DE } from "@/lib/country-guides-de";
import { PremiumPageDe } from "@/components/PremiumSiteChrome";
import GermanCountryDirectory from "./GermanCountryDirectory";
import styles from "../../countries/countries.module.css";

export const metadata: Metadata = {
  title: { absolute: "Länder-Betrugswarnungen | Konfydence" },
  description: "Offizielle Reiseinformationen und die Betrugsmaschen, auf die Reisende in jedem Land tatsächlich treffen.",
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
          <p className={styles.eyebrow}>Länder-Betrugswarnungen</p>
          <h1>Offizielle Reiseinformationen.<br />Betrug und Abzocke erkennen.</h1>
        </section>

        <section className={styles.sourceNotice} aria-label="Offizielle Länderinformationsquellen">
          <p className={styles.eyebrow}>Offizielle Quellen</p>
          <p>Länderinformationen stammen aus offiziellen kanadischen und neuseeländischen Reisehinweisen. Wir zeigen die dort veröffentlichten Betrugs- und Abzocke-Hinweise (auf Englisch, im Original) und verlinken dich zu den Originalseiten. Nutz staatliche Quellen für aktuelle Reiseentscheidungen.</p>
        </section>

        <section className={styles.sourceNotice} aria-label="Sprachhinweis">
          <p className={styles.eyebrow}>Fokussierte Auswahl</p>
          <p>
            Diese deutsche Ausgabe deckt die {slugs.length} meistgesuchten Reiseziele ab. Die vollständige Liste
            aller Länder mit offiziellen Reisehinweisen gibt es auf{" "}
            <Link href="/countries" style={{ color: "inherit", textDecoration: "underline" }}>Englisch</Link>.
          </p>
        </section>

        <GermanCountryDirectory slugs={slugs} />

        <section className={styles.practice}>
          <div><p className={styles.eyebrow}>Vor der Reise üben</p><h2>Wie würdest du unter Druck reagieren?</h2><p>Starte mit dem kostenlosen TravelSafe-Check und schalte die volle Challenge frei, wenn du bereit bist.</p></div>
          <Link href="/de/challenge/travelsafe/start?mode=diagnostic" className={styles.primaryLink}>Kostenlosen Check starten</Link>
        </section>
      </div>
    </PremiumPageDe>
  );
}
