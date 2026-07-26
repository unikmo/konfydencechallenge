"use client";

import { useEffect, useState } from "react";
import styles from "./countries.module.css";

type OfficialRisk = {
  authority: "Canada" | "New Zealand";
  url: string;
  live: boolean;
  statusCode?: number;
  riskLevel?: string;
  levelNumber?: 1 | 2 | 3 | 4;
  scamGuidance?: string[];
  lastUpdated?: string;
  error?: string;
};

type OfficialRiskResponse = {
  country: string;
  checkedAt: string;
  official: OfficialRisk[];
  covered: boolean;
};

export default function OfficialRiskAssessment({ country }: { country: string }) {
  const [data, setData] = useState<OfficialRiskResponse | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/countries/" + encodeURIComponent(country) + "/risk", {
      signal: controller.signal,
      cache: "no-store",
    })
      .then((response) => {
        if (!response.ok) throw new Error("Official risk check failed.");
        return response.json() as Promise<OfficialRiskResponse>;
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
    <section className={styles.officialRiskSection} aria-labelledby="official-risk-heading">
      <p className={styles.eyebrow}>Official risk assessment</p>
      <h2 id="official-risk-heading">Current government advice</h2>

      {!data && !error ? <p className={styles.officialRiskLoading}>Checking the official Canada and New Zealand advisories...</p> : null}
      {error ? (
        <p className={styles.officialRiskError}>Risk / Travel assessment pending. Use the government sources below for current advice.</p>
      ) : null}

      {data ? (
        <>
          <div className={styles.officialRiskGrid}>
            {data.official.map((source) => (
              <article className={styles.officialRiskCard} key={source.authority}>
                <p className={styles.sourceAuthority}>{source.authority} official source</p>
                {source.levelNumber ? <span className={styles.officialRiskNumber}>Level {source.levelNumber} / 4</span> : null}
                <strong className={styles.officialRiskLevel}>
                  {!source.live || source.error || !source.riskLevel ? (<>Risk / Travel assessment pending</>) : source.riskLevel}
                </strong>
                {source.lastUpdated ? <p className={styles.officialRiskMeta}>Updated {source.lastUpdated}</p> : null}
                {source.error ? <p className={styles.officialRiskMeta}>{source.error}</p> : null}
                <a href={source.url} target="_blank" rel="noreferrer">Open official guidance</a>
              </article>
            ))}
          </div>
          <section className={styles.scamGuidance} aria-labelledby={String.fromCharCode(115,99,97,109,45,103,117,105,100,97,110,99,101,45,104,101,97,100,105,110,103)}>
            <p className={styles.eyebrow}>Fraud &amp; scam focus</p>
            <h3 id={String.fromCharCode(115,99,97,109,45,103,117,105,100,97,110,99,101,45,104,101,97,100,105,110,103)}>What the official advisories flag</h3>
            <p className={styles.scamIntro}>Only source wording relevant to fraud, scams, theft, cards, or online crime is shown here. Read the full government advice before travelling.</p>
            <div className={styles.scamGuidanceGrid}>
              {data.official.map((source) => (
                <article className={styles.scamGuidanceCard} key={source.authority}>
                  <p className={styles.sourceAuthority}>{source.authority}</p>
                  {source.scamGuidance?.length ? (
                    <ul>
                      {source.scamGuidance.map((note, index) => <li key={source.authority + String(index)}>{note}</li>)}
                    </ul>
                  ) : (
                    <p className={styles.scamEmpty}>No fraud- or scam-specific wording was extracted from this advisory page.</p>
                  )}
                  <a href={source.url} target={String.fromCharCode(95, 98, 108, 97, 110, 107)} rel={String.fromCharCode(110, 111, 114, 101, 102, 101, 114, 114, 101, 114)}>Read the full official advisory</a>
                </article>
              ))}
            </div>
          </section>
          <p className={styles.officialRiskChecked}>
            Checked {new Date(data.checkedAt).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}
          </p>
        </>
      ) : null}
    </section>
  );
}
