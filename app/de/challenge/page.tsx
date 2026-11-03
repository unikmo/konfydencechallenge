import Link from "next/link";
import type { Metadata } from "next";
import { PremiumPageDe } from "@/components/PremiumSiteChrome";

export const metadata: Metadata = {
  title: { absolute: "Betrugsmaschen erkennen: 5 Challenges | Konfydence" },
  description: "Die Konfydence Challenge auf Deutsch — alle fünf Editionen, je 48 realistische Betrugssituationen.",
  alternates: { canonical: "/de/challenge", languages: { en: "https://konfydence.com/challenge", de: "https://konfydence.com/de/challenge" } },
};

// Stage 4 complete (2026-09-12): all five editions have a German deck.
const VERFUEGBAR = [
  {
    key: "family",
    label: "Familien-Edition",
    text: "Enkeltrick, „Hallo Mama“-Betrug, falsche Polizei, Finanzamt-Phishing, Kleinanzeigen-Fallen und mehr — 48 Szenarien, auf typische Situationen in Deutschland zugeschnitten.",
  },
  {
    key: "school",
    label: "Schul-Edition",
    text: "Gefälschte Nachrichten im Klassenchat, Betrug beim Gaming, falsche Anmeldeseiten und manipulierte Videos: 48 Übungen für Schülerinnen und Schüler.",
  },
  {
    key: "university",
    label: "Hochschul-Edition",
    text: "Betrug bei WG-Zimmern, gefälschte BAföG-Nachrichten, falsche Behördenkontakte und zweifelhafte Nebenjobs: 48 Übungen für Studierende.",
  },
  {
    key: "travelsafe",
    label: "TravelSafe-Edition",
    text: "Gefälschte Buchungsbestätigungen, angebliche Pannendienste, falsche Zollnachrichten und Betrug am Geldautomaten: 48 Übungen für unterwegs.",
  },
  {
    key: "workplace",
    label: "Berufs-Edition",
    text: "Gefälschte Anweisungen der Geschäftsführung, manipulierte Rechnungen, falscher IT-Support und verdächtige Datenanfragen: 48 Übungen für den Berufsalltag.",
  },
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
            <p style={{ fontSize: 12, letterSpacing: ".06em", opacity: 0.6, marginBottom: 6 }}>AUF DEUTSCH VERFÜGBAR</p>
            <h2 style={{ fontSize: 22, fontWeight: 900, marginBottom: 8 }}>{e.label}</h2>
            <p style={{ opacity: 0.8, marginBottom: 18, lineHeight: 1.6 }}>{e.text}</p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link href={`/de/challenge/${e.key}/start?mode=diagnostic`} className="k-button">Kostenlos probieren</Link>
              <Link href={`/de/pricing?edition=${e.key}`} className="k-button-quiet">Volle Edition — €6,99/Jahr</Link>
            </div>
          </article>
        ))}

        <p style={{ fontSize: 12, color: "#57534c", marginTop: 8 }}>
          Team-Zugang für Schulen und Unternehmen? <Link href="/de/pricing?team=1" className="k-lang-switch" style={{ padding: "3px 8px", color: "#4c4944" }}>Team-Kauf →</Link>
          {" "}Lieber gemeinsam spielen? <Link href="/de/spielen" className="k-lang-switch" style={{ padding: "3px 8px" }}>Mit Freunden spielen →</Link>
        </p>
      </section>
    </PremiumPageDe>
  );
}

// Kept as a defensive fallback: if a future edition is added without a
// German deck yet, its start route redirects here with ?bald=<edition>
// instead of silently dropping the player into an English deck.
async function BaldHinweis({ searchParams }: { searchParams: Promise<{ bald?: string }> }) {
  const sp = await searchParams;
  if (!sp.bald) return null;
  return (
    <div className="k-shell" style={{ paddingTop: 24 }}>
      <div style={{ background: "#fdf0dc", color: "#5a4118", borderRadius: 12, padding: "14px 18px", fontSize: 14 }}>
        Diese Edition gibt es auf Deutsch noch nicht. Sobald sie fertig ist, erscheint sie hier.
      </div>
    </div>
  );
}
