import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { PremiumPageDe } from "@/components/PremiumSiteChrome";

export const metadata: Metadata = {
  title: { absolute: "Betrugsmaschen erkennen und sicher reagieren | Konfydence" },
  description:
    "Mit der Konfydence Challenge lernst du, Betrugsmaschen im Alltag zu erkennen und bei verdächtigen Anrufen, Nachrichten und Zahlungsforderungen besonnen zu handeln.",
  alternates: { canonical: "/de", languages: { en: "https://konfydence.com", de: "https://konfydence.com/de" } },
  openGraph: {
    title: "Betrugsmaschen erkennen und sicher reagieren | Konfydence",
    description: "Betrugsmaschen erkennen. Sicher entscheiden.",
    url: "https://konfydence.com/de",
    type: "website",
  },
};

const PRINZIPIEN: [string, string, string][] = [
  ["01", "Hetze", "Du sollst sofort handeln, statt in Ruhe nachzudenken."],
  ["02", "Autorität", "Eine angebliche Behörde oder Führungskraft soll Zweifel unterdrücken."],
  ["03", "Vertrautheit", "Ein vertrauter Name oder Absender soll Sicherheit vortäuschen."],
  ["04", "Notbremse", "Wer dich vom Nachfragen abhalten will, liefert einen wichtigen Warnhinweis."],
];

export default function GermanHomePage() {
  return (
    <PremiumPageDe ctaHref="/de/challenge/family/start?mode=diagnostic" ctaLabel="Kostenlosen Check starten">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: "{\"@context\":\"https://schema.org\",\"@type\":\"WebSite\",\"name\":\"Konfydence\",\"url\":\"https://konfydence.com/de\",\"inLanguage\":\"de\",\"description\":\"Realistische Übungen, um Betrugsmaschen zu erkennen und sicher zu reagieren.\"}" }} />
      <section className="k-home-hero" aria-labelledby="de-home-hero-title">
        <div className="k-shell k-home-hero-copy">
          <h1 id="de-home-hero-title" className="k-home-hero-title">
            <span>Ein Anruf. Eine Nachricht.</span>
            <span className="k-home-hero-alert">Und plötzlich soll alles ganz schnell gehen.</span>
          </h1>
          <p style={{ maxWidth: 620, marginTop: 18, fontSize: 16, lineHeight: 1.6, opacity: 0.85 }}>
            Trainiere mit 48 realistischen Alltagssituationen, typische Betrugsmaschen zu erkennen – etwa den Enkeltrick, gefälschte Bank-SMS oder WhatsApp-Nachrichten von angeblich neuen Nummern. Mit einem kostenlosen Sicherheitscheck kannst du sofort loslegen.
          </p>
        </div>
        <div className="k-home-hero-media k-home-hero-media-photo">
          <Image
            src="/hero/konfydence-travelsafe-vacation.jpg"
            unoptimized
            alt="Reisende in einer Alltagssituation, in der besonnenes Entscheiden wichtig ist"
            width={920}
            height={575}
            priority
            quality={75}
            sizes="(max-width: 980px) 100vw, 90vw"
          />
        </div>
        <div className="k-shell k-home-hero-after">
          <p>Erkenne den Druck. Prüfe die Anfrage. Entscheide in Ruhe.</p>
          <div className="k-home-hero-actions">
            <Link className="k-button k-home-primary" href="/de/challenge/family/start?mode=diagnostic">Kostenlosen Check starten</Link>
            <Link className="k-button-quiet k-home-secondary" href="/de/comasy">Für Unternehmen: CoMaSy</Link>
          </div>
          <p className="k-home-hero-pilot">
            Für Schulen und Teams: <Link href="/de/comasy/pilotprojekt">Pilotprojekt anfragen <span aria-hidden="true">→</span></Link>
          </p>
        </div>
      </section>

      <section className="k-shell" style={{ padding: "40px 0" }}>
        <p className="k-kicker">Die H.A.C.K.-Methode</p>
        <h2 style={{ fontSize: 28, fontWeight: 900, marginBottom: 8 }}>Vier typische Tricks, die du kennen solltest.</h2>
        <p style={{ maxWidth: 640, opacity: 0.8, marginBottom: 28 }}>
          Viele Betrugsversuche setzen auf Zeitdruck, angebliche Autorität oder vertraute Absender. Hier lernst du, diese Muster rechtzeitig zu erkennen.
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
          Die Antwort darauf: <strong>Anhalten · Abklären · Ansprechen</strong> — nicht vorschnell handeln, klären, was genau
          verlangt wird, und bei Bedarf eine vertraute Person hinzuziehen.
        </p>
      </section>

      <section className="k-shell" style={{ padding: "0 0 48px" }}>
        <div style={{ background: "var(--k-ink,#111)", color: "#fff", borderRadius: 18, padding: "36px 28px" }}>
          <p style={{ fontSize: 12, letterSpacing: ".08em", opacity: 0.7, marginBottom: 8 }}>FAMILIEN-EDITION</p>
          <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 10 }}>
            Erst kostenlos ausprobieren. Danach gezielt weiterüben.
          </h2>
          <p style={{ maxWidth: 560, opacity: 0.85, marginBottom: 20, fontSize: 15, lineHeight: 1.6 }}>
            Mit dem kostenlosen Check kannst du sofort anfangen. Die vollständige Challenge enthält 48 Alltagssituationen in kurzen Runden. Dafür erstellst du
            ein Konto, damit du deinen Fortschritt auf verschiedenen Geräten wiederfindest.
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
      <section className="k-shell" style={{ padding: "0 0 56px" }}>
        <div style={{ border: "1px solid var(--k-line)", borderRadius: 18, padding: "36px 28px", textAlign: "center" }}>
          <p className="k-kicker">Jetzt Pilotanfragen möglich</p>
          <h2 className="k-display-sm" style={{ marginBottom: 12 }}>Sicheres Entscheiden lässt sich auch in Gruppen trainieren.</h2>
          <p style={{ maxWidth: 560, margin: "0 auto 22px", fontSize: 15, lineHeight: 1.6, opacity: 0.8 }}>
            Beginnt mit einer kleinen Gruppe und konkreten Sicherheitsrisiken. Anschließend prüft ihr, was sich
            verändert hat, und entscheidet dann: ausweiten, anpassen oder beenden.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
            <Link href="/de/pilot/schulen" className="k-button">Schul-Pilotprojekt anfragen</Link>
            <Link href="/de/comasy/pilotprojekt" className="k-button-quiet">Pilotprojekt für Teams</Link>
          </div>
        </div>
      </section>
    </PremiumPageDe>
  );
}
