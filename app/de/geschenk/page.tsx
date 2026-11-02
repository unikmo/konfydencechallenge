"use client";

import { useState } from "react";
import Link from "next/link";
import { PremiumPageDe } from "@/components/PremiumSiteChrome";
import { trackCheckoutStarted } from "@/lib/events";

const GIFT_OPTIONS = [
  { key: "all", label: "Alle fünf Challenges", sku: "CHAL-UNLIMITED", price: "€24,99" },
  { key: "family", label: "Familie", sku: "CHAL-SINGLE-FAMILY", price: "€6,99" },
  { key: "school", label: "Schule", sku: "CHAL-SINGLE-SCHOOL", price: "€6,99" },
  { key: "university", label: "Universität", sku: "CHAL-SINGLE-UNIVERSITY", price: "€6,99" },
  { key: "workplace", label: "Arbeitsplatz", sku: "CHAL-SINGLE-WORKPLACE", price: "€6,99" },
  { key: "travelsafe", label: "TravelSafe", sku: "CHAL-SINGLE-TRAVELSAFE", price: "€6,99" },
] as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function GeschenkPage() {
  const [choice, setChoice] = useState<(typeof GIFT_OPTIONS)[number]["key"]>("all");
  const [toEmail, setToEmail] = useState("");
  const [fromName, setFromName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const option = GIFT_OPTIONS.find((o) => o.key === choice)!;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    if (!EMAIL_RE.test(toEmail.trim())) {
      setError("Bitte gib eine gültige E-Mail-Adresse für die beschenkte Person ein.");
      return;
    }
    setLoading(true);
    trackCheckoutStarted(option.sku, `Geschenk – ${option.label}`);
    try {
      const response = await fetch("/api/checkout/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sku: option.sku,
          locale: "de",
          gift: { toEmail: toEmail.trim(), fromName: fromName.trim(), message: message.trim() },
        }),
      });
      const data = (await response.json()) as { checkoutUrl?: string; error?: string };
      if (!response.ok || !data.checkoutUrl) {
        setError("Das hat leider nicht geklappt. Bitte versuch es noch einmal.");
        setLoading(false);
        return;
      }
      window.location.assign(data.checkoutUrl);
    } catch {
      setError("Das hat leider nicht geklappt. Bitte versuch es noch einmal.");
      setLoading(false);
    }
  };

  return (
    <PremiumPageDe ctaHref="/de/challenge" ctaLabel="Kostenlosen Check starten">
      <section className="kg-shell kc-hero is-narrow" style={{ paddingBottom: 32 }}>
        <p className="k-kicker">Challenge verschenken</p>
        <h1>Schenk jemandem einen schärferen Blick für Betrug.</h1>
        <p>
          Such eine Challenge aus, schreib ein paar Zeilen dazu, und wir schicken der beschenkten Person einen Code per
          E-Mail. Sie löst ihn ein, wann sie möchte – zum Start braucht sie kein Konto.
        </p>
      </section>

      <section className="kg-shell" style={{ paddingBottom: 48 }}>
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 24, maxWidth: 560 }}>
          <div>
            <label className="k-kicker" style={{ display: "block", marginBottom: 10 }}>
              Was möchtest du verschenken?
            </label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {GIFT_OPTIONS.map((o) => (
                <button
                  key={o.key}
                  type="button"
                  onClick={() => setChoice(o.key)}
                  className={choice === o.key ? "k-button" : "k-button-quiet"}
                  style={{ fontSize: 13 }}
                >
                  {o.label} · {o.price}
                </button>
              ))}
            </div>
          </div>

          <label style={{ display: "grid", gap: 6 }}>
            <span className="k-kicker">E-Mail-Adresse der beschenkten Person</span>
            <input
              type="email"
              required
              value={toEmail}
              onChange={(e) => setToEmail(e.target.value)}
              placeholder="sie@beispiel.de"
              style={inputStyle}
            />
          </label>

          <label style={{ display: "grid", gap: 6 }}>
            <span className="k-kicker">Dein Name (optional)</span>
            <input
              type="text"
              maxLength={80}
              value={fromName}
              onChange={(e) => setFromName(e.target.value)}
              placeholder="Damit klar ist, von wem das Geschenk kommt"
              style={inputStyle}
            />
          </label>

          <label style={{ display: "grid", gap: 6 }}>
            <span className="k-kicker">Eine kurze Nachricht (optional)</span>
            <textarea
              maxLength={500}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              placeholder="Ich musste an dich denken – das dauert zehn Minuten und bleibt hängen."
              style={{ ...inputStyle, resize: "vertical" }}
            />
          </label>

          <div>
            <button type="submit" className="k-button" disabled={loading} style={{ minWidth: 220 }}>
              {loading ? "Kasse wird geöffnet …" : `${option.label} verschenken – ${option.price}`}
            </button>
            {error ? (
              <p role="alert" style={{ color: "#b4552f", fontSize: 13, marginTop: 10 }}>
                {error}
              </p>
            ) : null}
          </div>

          <p className="k-copy" style={{ fontSize: 12 }}>
            Du hast einen Code bekommen? <Link href="/de/geschenk/einloesen">Geschenk einlösen</Link>.
          </p>
        </form>
      </section>
    </PremiumPageDe>
  );
}

const inputStyle: React.CSSProperties = {
  padding: "11px 14px",
  borderRadius: 10,
  border: "1px solid rgba(17,20,23,.22)",
  background: "#fffdf9",
  fontSize: 15,
  color: "#111417",
  fontFamily: "inherit",
};
