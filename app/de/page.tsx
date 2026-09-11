import Link from "next/link";
import type { Metadata } from "next";
import { PremiumPageDe } from "@/components/PremiumSiteChrome";

export const metadata: Metadata = {
  title: { absolute: "Konfydence — Vertrauen unter Druck" },
  description:
    "Konfydence Challenge hilft Familien, ruhige und sichere Entscheidungen zu üben, bevor eine dringende Nachricht, ein Anruf oder eine Bitte wirklich unter Druck setzt.",
  alternates: { canonical: "/de", languages: { en: "https://konfydence.com", de: "https://konfydence.com/de" } },
  openGraph: {
    title: "Konfydence — Vertrauen unter Druck",
    description: "Übe die Entscheidung, bevor der Druck echt ist.",
    url: "https://konfydence.com/de",
    type: "website",
  },
};

const PRINZIPIEN: [string, string, string][] = [
  ["01", "Hetze", "Zeitdruck soll Geschwindigkeit wichtiger erscheinen lassen als Prüfung."],
  ["02", "Autorität", "Titel und Hierarchie können eine riskante Bitte unantastbar wirken lassen."],
  ["03", "Vertrautheit", "Bekannte Personen, Routinen und Kanäle senken die gesunde Skepsis."],
  ["04", "Notbremse", "Druck versucht oft, dich davon abzuhalten, selbst nachzuprüfen oder jemanden zu fragen."],
];

export default function GermanHomePage() {
  return (
    <PremiumPageDe ctaHref="/de/challenge/family/start?mode=diagnostic" ctaLabel="Kostenlosen Check starten">
      <section className="k-home-hero" aria-labelledby="de-home-hero-title">
        <div className="k-shell k-home-hero-copy">
          <h1 id="de-home-hero-title" className="k-home-hero-title">
            <span>Ein Anruf, eine Nachricht,</span>
            <span className="k-home-hero-alert">eine Sekunde zu wenig nachgedacht.</span>
          </h1>
          <p style={{ maxWidth: 620, marginTop: 18, fontSize: 16, lineHeight: 1.6, opacity: 0.85 }}>
            Konfydence Challenge — Familie-Edition übt mit dir echte Drucksituationen: der Enkeltrick am Telefon, die
            SMS von der „Bank“, die WhatsApp-Nachricht von einer „neuen Nummer“. 48 reale Szenarien, kostenloser Check
            zum Einstieg.
          </p>
        </div>
      </section>

      <section className="k-shell" style={{ padding: "40px 0" }}>
        <p className="k-kicker">Die H.A.C.K.-Methode</p>
        <h2 style={{ fontSize: 28, fontWeight: 900, marginBottom: 8 }}>Vier Druckmuster, ein Rahmen.</h2>
        <p style={{ maxWidth: 640, opacity: 0.8, marginBottom: 28 }}>
          Fast jeder Betrug nutzt eine Mischung aus vier Drucktypen. Konfydence trainiert dich, sie live zu erkennen.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
          {PRINZIPIEN.map(([num, label, text]) => (
            <div key={num} style={{ borderTop: "1px solid var(--k-line)", paddingTop: 14 }}>
              <div style={{ fontSize: 12, opacity: 0.5, marginBottom: 6 }}>{num}</div>
              <div style={{ fontWeight: 800, marginBottom: 6 }}>{label}</div>
              <p style={{ fontSize: 14, lineHeight: 1.55, opacity: 0.8 }}>{text}</p>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 12, opacity: 0.6, marginTop: 24 }}>
          Die Antwort darauf: <strong>Anhalten · Abklären · Ansprechen</strong> — nichts sofort tun, klären was genau
          verlangt wird, und es laut mit jemandem besprechen, dem du vertraust.
        </p>
      </section>

      <section className="k-shell" style={{ padding: "0 0 48px" }}>
        <div style={{ background: "var(--k-ink,#111)", color: "#fff", borderRadius: 18, padding: "36px 28px" }}>
          <p style={{ fontSize: 12, letterSpacing: ".08em", opacity: 0.7, marginBottom: 8 }}>FAMILIE-EDITION</p>
          <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 10 }}>
            Kostenloser Check — dann die volle Challenge.
          </h2>
          <p style={{ maxWidth: 560, opacity: 0.85, marginBottom: 20, fontSize: 15, lineHeight: 1.6 }}>
            Der erste Check ist kostenlos und anonym. Für die volle Challenge (48 Szenarien in kurzen Runden) legst du
            ein Konto an — deine Ergebnisse folgen dir dann auf jedes Gerät.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link href="/de/challenge/family/start?mode=diagnostic" className="k-button">
              Kostenlosen Check starten
            </Link>
            <Link href="/de/pricing" className="k-button-quiet" style={{ color: "#fff", borderColor: "rgba(255,255,255,0.3)" }}>
              Preise ansehen
            </Link>
          </div>
        </div>
      </section>
    </PremiumPageDe>
  );
}
