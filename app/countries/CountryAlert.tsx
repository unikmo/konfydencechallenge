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

export default function CountryAlert({ country }: { country: string }) {
  const [data, setData] = useState<CountryAlertResponse | null>(null);
  const [error, setError] = useState(false);

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
    <section className={styles.officialRiskSection} aria-labelledby="country-alert-heading" aria-busy={!data && !error}>
      <p className={styles.eyebrow}>Country Scam Alerts</p>
      <h2 id="country-alert-heading">Fraud and scam alerts</h2>

      {!data && !error ? <div className={styles.officialRiskLoading} aria-label="Loading latest official guidance" /> : null}
      {error ? (
        <p className={styles.officialRiskError}>Live extraction is temporarily unavailable. Use the official source links below for current information.</p>
      ) : null}

      {data ? (
        <>
          <section className={styles.scamGuidance} aria-labelledby="scam-guidance-heading">
            <p className={styles.eyebrow}>Official guidance</p>
            <h3 id="scam-guidance-heading">What the advisories flag</h3>
            <p className={styles.scamIntro}>Only wording relevant to fraud, scams, theft, cards or online crime is shown here. Open the full official advisory before travelling.</p>
            <div className={styles.scamGuidanceGrid}>
              {data.official.map((source) => (
                <article className={styles.scamGuidanceCard} key={source.authority}>
                  <p className={styles.sourceAuthority}>{source.authority}</p>
                  {source.scamGuidance?.length ? (
                    <ul>{source.scamGuidance.map((note, index) => <li key={source.authority + String(index)}>{note}</li>)}</ul>
                  ) : (
                    <p className={styles.scamEmpty}>No fraud- or scam-specific wording was extracted from this advisory page.</p>
                  )}
                  <a href={source.url} target="_blank" rel="noreferrer">Read the full official advisory</a>
                </article>
              ))}
            </div>
          </section>
          <p className={styles.officialRiskChecked}>Checked {new Date(data.checkedAt).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}</p>
        </>
      ) : null}
    </section>
  );
}
