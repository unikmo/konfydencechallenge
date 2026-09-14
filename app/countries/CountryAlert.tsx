"use client";

import { useEffect, useState } from "react";
import styles from "./countries.module.css";

type OfficialSource = {
  authority: "Canada" | "New Zealand";
  url: string;
  live: boolean;
  statusCode?: number;
  scamGuidance?: string[];
  lastUpdated?: string;
  error?: string;
};

type CountryAlertResponse = {
  country: string;
  checkedAt: string;
  official: OfficialSource[];
  covered: boolean;
};

const STRINGS = {
  en: {
    kicker: "Country Scam Alerts",
    heading: "Fraud and scam alerts",
    loading: "Checking official fraud and scam information...",
    error: "Fraud alert pending. Use the official sources below for current information.",
    kicker2: "Fraud & scam alert",
    heading2: "What the official advisories flag",
    intro: "Only wording relevant to fraud, scams, theft, cards, or online crime is shown here. Open the full official advisory before travelling.",
    empty: "No fraud- or scam-specific wording was extracted from this advisory page.",
    readFull: "Read the full official advisory",
    checked: (d: string) => `Checked ${d}`,
    locale: "en-GB",
    quotesNote: "",
  },
  de: {
    kicker: "Länder-Betrugswarnungen",
    heading: "Betrugs- und Abzockewarnungen",
    loading: "Offizielle Betrugs- und Abzockeinformationen werden geprüft …",
    error: "Betrugswarnung ausstehend. Nutz die offiziellen Quellen unten für aktuelle Informationen.",
    kicker2: "Betrugs- und Abzockewarnung",
    heading2: "Worauf die offiziellen Reisehinweise hinweisen",
    intro: "Hier steht nur Text zu Betrug, Abzocke, Diebstahl, Karten oder Online-Kriminalität. Öffne den vollständigen offiziellen Reisehinweis vor der Reise. Die Originalzitate sind auf Englisch, da sie direkt aus den kanadischen und neuseeländischen Reisehinweisen stammen.",
    empty: "Aus diesem Reisehinweis wurde kein betrugs- oder abzockespezifischer Text extrahiert.",
    readFull: "Vollständigen offiziellen Reisehinweis lesen",
    checked: (d: string) => `Geprüft am ${d}`,
    locale: "de-DE",
    quotesNote: "",
  },
} as const;

export default function CountryAlert({ country, lang = "en" }: { country: string; lang?: "en" | "de" }) {
  const [data, setData] = useState<CountryAlertResponse | null>(null);
  const [error, setError] = useState(false);
  const t = STRINGS[lang];

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/countries/" + encodeURIComponent(country) + "/risk", {
      signal: controller.signal,
      cache: "no-store",
    })
      .then((response) => {
        if (!response.ok) throw new Error("Official country alert failed.");
        return response.json() as Promise<CountryAlertResponse>;
      })
      .then((value) => {
        setData(value);
        setError(false);
      })
      .catch((reason: unknown) => {
        if (reason instanceof DOMException && reason.name === "AbortError") return;
        setError(true);
      });

    return () => controller.abort();
  }, [country]);

  return (
    <section className={styles.officialRiskSection} aria-labelledby="country-alert-heading">
      <p className={styles.eyebrow}>{t.kicker}</p>
      <h2 id="country-alert-heading">{t.heading}</h2>

      {!data && !error ? <p className={styles.officialRiskLoading}>{t.loading}</p> : null}
      {error ? (
        <p className={styles.officialRiskError}>{t.error}</p>
      ) : null}

      {data ? (
        <>
          <section className={styles.scamGuidance} aria-labelledby={String.fromCharCode(115,99,97,109,45,103,117,105,100,97,110,99,101,45,104,101,97,100,105,110,103)}>
            <p className={styles.eyebrow}>{t.kicker2}</p>
            <h3 id={String.fromCharCode(115,99,97,109,45,103,117,105,100,97,110,99,101,45,104,101,97,100,105,110,103)}>{t.heading2}</h3>
            <p className={styles.scamIntro}>{t.intro}</p>
            <div className={styles.scamGuidanceGrid}>
              {data.official.map((source) => (
                <article className={styles.scamGuidanceCard} key={source.authority}>
                  <p className={styles.sourceAuthority}>{source.authority}</p>
                  {source.scamGuidance?.length ? (
                    <ul>
                      {source.scamGuidance.map((note, index) => <li key={source.authority + String(index)}>{note}</li>)}
                    </ul>
                  ) : (
                    <p className={styles.scamEmpty}>{t.empty}</p>
                  )}
                  <a href={source.url} target={String.fromCharCode(95, 98, 108, 97, 110, 107)} rel={String.fromCharCode(110, 111, 114, 101, 102, 101, 114, 114, 101, 114)}>{t.readFull}</a>
                </article>
              ))}
            </div>
          </section>
          <p className={styles.officialRiskChecked}>
            {t.checked(new Date(data.checkedAt).toLocaleString(t.locale, { dateStyle: "medium", timeStyle: "short" }))}
          </p>
        </>
      ) : null}
    </section>
  );
}
