import Link from "next/link";
import type { Metadata } from "next";
import { PremiumPageDe } from "@/components/PremiumSiteChrome";

export const metadata: Metadata = {
  title: { absolute: "Challenge | Konfydence" },
  description: "Die Konfydence Challenge auf Deutsch — Familie- und Schule-Edition, je 48 reale Betrugsszenarien.",
  alternates: { canonical: "/de/challenge", languages: { en: "https://konfydence.com/challenge", de: "https://konfydence.com/de/challenge" } },
};

const VERFUEGBAR = [
  {
    key: "family",
    label: "Familie-Edition",
    text: "Enkeltrick, „Hallo Mama“-Betrug, falsche Polizei, Finanzamt-Phishing, Kleinanzeigen-Fallen und mehr — 48 Szenarien, kulturell für Deutschland geschrieben, nicht übersetzt.",
  },
  {
    key: "school",
    label: "Schule-Edition",
    text: "Discord- und Gaming-Betrug, WhatsApp-Klassenchat-Fallen, IServ-Phishing, Deepfakes und mehr — 48 Szenarien für Schüler:innen, kulturell für Deutschland geschrieben.",
  },
];

const ANDERE_EDITIONEN = [
  { key: "university", label: "Universität" },
  { key: "travelsafe", label: "TravelSafe" },
  { key: "workplace", label: "Arbeitsplatz" },
];

export default function GermanChallengePage(props: { searchParams: Promise<{ bald?: string }> }) {
  return (
    <PremiumPageDe ctaHref="/de/challenge/family/start?mode=diagnostic" ctaLabel="Kostenlos starten">
      <BaldHinweis searchParams={props.searchParams} />

      <section className="k-shell" style={{ padding: "40px 0" }}>
        <p className="k-kicker">Konfydence Challenge</p>
        <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 12 }}>
          Übe die Entscheidung, bevor der Druck echt ist.
        </h1>
        <p style={{ maxWidth: 640, opacity: 0.8, marginBottom: 32 }}>
          Jede Edition hat 40+ reale Szenarien — ausgewogen über Hetze, Autorität, Vertrautheit und Notbremse. Probier
          es kostenlos, oder schalte die volle Edition frei und spiel das ganze Set in kurzen Runden.
        </p>

        {VERFUEGBAR.map((e) => (
          <article
            key={e.key}
            style={{
              border: "1px solid var(--k-line)",
              borderRadius: 16,
              padding: 24,
              marginBottom: 20,
              background: "var(--k-paper, #faf8f5)",
            }}
          >
            <p style={{ fontSize: 12, letterSpacing: ".06em", opacity: 0.6, marginBottom: 6 }}>VERFÜGBAR AUF DEUTSCH</p>
            <h2 style={{ fontSize: 22, fontWeight: 900, marginBottom: 8 }}>{e.label}</h2>
            <p style={{ opacity: 0.8, marginBottom: 18, lineHeight: 1.6 }}>{e.text}</p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link href={`/de/challenge/${e.key}/start?mode=diagnostic`} className="k-button">Kostenlos probieren</Link>
              <Link href={`/de/pricing?edition=${e.key}`} className="k-button-quiet">Volle Edition — €6,99/Jahr</Link>
            </div>
          </article>
        ))}

        <div style={{ opacity: 0.75 }}>
          <p style={{ fontWeight: 800, marginBottom: 10, fontSize: 13 }}>Bald auf Deutsch:</p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {ANDERE_EDITIONEN.map((e) => (
              <span
                key={e.key}
                style={{
                  padding: "8px 14px",
                  borderRadius: 999,
                  border: "1px solid var(--k-line)",
                  fontSize: 13,
                }}
              >
                {e.label}
              </span>
            ))}
          </div>
          <p style={{ fontSize: 12, marginTop: 12 }}>
            Bereits verfügbar auf Englisch: <Link href="/challenge" className="k-lang-switch" style={{ padding: "3px 8px" }}>Challenge (EN) →</Link>
          </p>
        </div>
      </section>
    </PremiumPageDe>
  );
}

async function BaldHinweis({ searchParams }: { searchParams: Promise<{ bald?: string }> }) {
  const sp = await searchParams;
  if (!sp.bald) return null;
  return (
    <div className="k-shell" style={{ paddingTop: 24 }}>
      <div style={{ background: "#fdf0dc", color: "#5a4118", borderRadius: 12, padding: "14px 18px", fontSize: 14 }}>
        Diese Edition gibt es auf Deutsch noch nicht — bisher nur Familie und Schule. Sobald sie fertig ist, erscheint
        sie hier.
      </div>
    </div>
  );
}
