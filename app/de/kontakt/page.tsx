"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PremiumPageDe } from "@/components/PremiumSiteChrome";

export default function KontaktPage() {
  return (
    <Suspense fallback={<PremiumPageDe ctaHref="/de/challenge/family/start?mode=diagnostic" ctaLabel="Kostenlos starten"><section className="kg-shell kc-hero"><h1>Kontakt zu Konfydence</h1><p>Fragen zu den Challenges oder einem Pilotprojekt? Hier erreichst du uns.</p></section></PremiumPageDe>}>
      <KontaktForm />
    </Suspense>
  );
}

const HEADINGS: Record<string, { title: string; intro: string }> = {
  "schools-teams": {
    title: "Konfydence für eure Schule oder euer Unternehmen",
    intro: "Beschreibt kurz eure Zielgruppe und die wichtigsten Risiken. Wir besprechen mit euch, welche Übungen und Pilotprojekte für eure Schule, Hochschule oder euer Unternehmen geeignet sind.",
  },
  organization: {
    title: "Konfydence für eure Schule oder euer Unternehmen",
    intro: "Beschreibt kurz eure Zielgruppe und die wichtigsten Risiken. Wir besprechen mit euch, welche Übungen und Pilotprojekte für eure Schule, Hochschule oder euer Unternehmen geeignet sind.",
  },
  "travel-check-in": {
    title: "Interesse an TravelSafe",
    intro: "Schreib uns, für welche Reise du dich vorbereiten möchtest und was du dir von TravelSafe erwartest.",
  },
  "lockscreens-home": {
    title: "Konfydence Lockscreens – Zuhause",
    intro: "Dieser Zugang ist noch in Vorbereitung. Wenn du möchtest, informieren wir dich über den Start.",
  },
  "lockscreens-teen": {
    title: "Konfydence Lockscreens für Jugendliche",
    intro: "Dieser Zugang ist noch in Vorbereitung. Wenn du möchtest, informieren wir dich über den Start.",
  },
  "lockscreens-schools": {
    title: "Konfydence Lockscreens für Schulen",
    intro: "Schreibt uns, wie viele verwaltete Rechner ihr abdecken möchtet und wie ihr eure Geräte verwaltet, dann schicken wir euch ein Angebot.",
  },
  "lockscreens-workplace": {
    title: "Konfydence Lockscreens für euren Arbeitsplatz",
    intro: "Nennt uns die Zahl eurer Mitarbeitenden und die Verwaltung eurer Geräte, dann schicken wir euch ein Angebot pro Mitarbeitenden ($4 pro Mitarbeitenden und Jahr, mindestens $300).",
  },
  general: {
    title: "Schreib uns",
    intro: "Du hast Fragen zur Challenge, zu einem Kauf oder zu Angeboten für Organisationen? Schreib uns.",
  },
};

function KontaktForm() {
  const searchParams = useSearchParams();
  const topic = searchParams.get("topic") || "general";
  const heading = HEADINGS[topic] ?? HEADINGS.general;
  const isOrg = topic === "schools-teams" || topic === "organization" || topic.startsWith("lockscreens-school") || topic.startsWith("lockscreens-workplace");

  const [formData, setFormData] = useState({ name: "", email: "", organization: "", seatCount: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [consent, setConsent] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, topic, consent }),
      });
      if (!response.ok) {
        setError("Deine Nachricht konnten wir leider nicht senden. Bitte versuch es noch einmal.");
        return;
      }
      setSubmitted(true);
      setFormData({ name: "", email: "", organization: "", seatCount: "", message: "" });
      setConsent(false);
    } catch {
      setError("Deine Nachricht konnten wir leider nicht senden. Bitte versuch es noch einmal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PremiumPageDe ctaHref="/de/challenge" ctaLabel="Kostenlosen Check starten">
      <section className="kg-narrow k-section" style={{ borderTop: 0, maxWidth: 620 }}>
        <p className="k-kicker">Kontakt</p>
        <h1 className="k-display-sm">{heading.title}</h1>
        <p className="k-copy" style={{ margin: "16px 0 30px" }}>{heading.intro}</p>

        {submitted ? (
          <div className="kc-note">
            <b>Nachricht erhalten</b>
            <p>Vielen Dank. Wir sehen uns deine Nachricht an und antworten so bald wie möglich.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="kc-form" style={{ boxShadow: "none" }}>
            {error ? <div className="kc-form-error" role="alert">{error}</div> : null}
            <label>Name<input name="name" value={formData.name} onChange={handleChange} required autoComplete="name" /></label>
            <label>E-Mail-Adresse<input type="email" name="email" value={formData.email} onChange={handleChange} required autoComplete="email" /></label>
            <label>
              {topic === "travel-check-in" ? "Reisesituation " : "Organisation "}
              <small>optional</small>
              <input name="organization" value={formData.organization} onChange={handleChange} autoComplete="organization" />
            </label>
            {isOrg ? (
              <label>Ungefähre Zahl der Schüler bzw. Mitarbeitenden<input type="number" min="1" name="seatCount" value={formData.seatCount} onChange={handleChange} placeholder="z. B. 500" /></label>
            ) : null}
            <label>Nachricht<textarea name="message" value={formData.message} onChange={handleChange} required rows={6} /></label>
            <label className="kc-form-consent">
              <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} required />
              <span>Ich bin einverstanden, dass ihr euch zu dieser Anfrage bei mir meldet, und habe die <Link href="/de/datenschutz">Datenschutzerklärung</Link> gelesen.</span>
            </label>
            <button className="k-button" type="submit" disabled={loading}>{loading ? "Wird gesendet …" : "Nachricht senden"}</button>
          </form>
        )}
      </section>
    </PremiumPageDe>
  );
}
