"use client";

import { useState } from "react";
import Link from "next/link";
import { PremiumPage } from "@/components/PremiumSiteChrome";
import { trackCheckoutStarted } from "@/lib/events";

const GIFT_OPTIONS = [
  { key: "all", label: "All five challenges", sku: "CHAL-UNLIMITED", price: "$24.99" },
  { key: "family", label: "Family", sku: "CHAL-SINGLE-FAMILY", price: "$6.99" },
  { key: "school", label: "School", sku: "CHAL-SINGLE-SCHOOL", price: "$6.99" },
  { key: "university", label: "University", sku: "CHAL-SINGLE-UNIVERSITY", price: "$6.99" },
  { key: "workplace", label: "Workplace", sku: "CHAL-SINGLE-WORKPLACE", price: "$6.99" },
  { key: "travelsafe", label: "TravelSafe", sku: "CHAL-SINGLE-TRAVELSAFE", price: "$6.99" },
] as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function GiftPage() {
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
      setError("Enter a valid email for the person receiving the gift.");
      return;
    }
    setLoading(true);
    trackCheckoutStarted(option.sku, `Gift — ${option.label}`);
    try {
      const response = await fetch("/api/checkout/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sku: option.sku,
          gift: { toEmail: toEmail.trim(), fromName: fromName.trim(), message: message.trim() },
        }),
      });
      const data = (await response.json()) as { checkoutUrl?: string; error?: string };
      if (!response.ok || !data.checkoutUrl) {
        setError(data.error || "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }
      window.location.assign(data.checkoutUrl);
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <PremiumPage ctaHref="/challenge" ctaLabel="Start a free check">
      <section className="kg-shell kc-hero is-narrow" style={{ paddingBottom: 32 }}>
        <p className="k-kicker">Gift a challenge</p>
        <h1>Give someone a sharper eye for scams.</h1>
        <p>
          Pick a challenge, add a note, and we send the recipient a code by email. They claim it
          whenever they are ready — no account needed to start.
        </p>
      </section>

      <section className="kg-shell" style={{ paddingBottom: 48 }}>
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 24, maxWidth: 560 }}>
          <div>
            <label className="k-kicker" style={{ display: "block", marginBottom: 10 }}>
              What to gift
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
            <span className="k-kicker">Recipient email</span>
            <input
              type="email"
              required
              value={toEmail}
              onChange={(e) => setToEmail(e.target.value)}
              placeholder="them@example.com"
              style={inputStyle}
            />
          </label>

          <label style={{ display: "grid", gap: 6 }}>
            <span className="k-kicker">Your name (optional)</span>
            <input
              type="text"
              maxLength={80}
              value={fromName}
              onChange={(e) => setFromName(e.target.value)}
              placeholder="So they know who it's from"
              style={inputStyle}
            />
          </label>

          <label style={{ display: "grid", gap: 6 }}>
            <span className="k-kicker">A short message (optional)</span>
            <textarea
              maxLength={500}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              placeholder="Thought of you — this takes ten minutes and it sticks."
              style={{ ...inputStyle, resize: "vertical" }}
            />
          </label>

          <div>
            <button type="submit" className="k-button" disabled={loading} style={{ minWidth: 220 }}>
              {loading ? "Opening checkout…" : `Gift ${option.label} — ${option.price}`}
            </button>
            {error ? (
              <p role="alert" style={{ color: "#b4552f", fontSize: 13, marginTop: 10 }}>
                {error}
              </p>
            ) : null}
          </div>

          <p className="k-copy" style={{ fontSize: 12 }}>
            Have a code to claim? <Link href="/gift/redeem">Redeem a gift</Link>.
          </p>
        </form>
      </section>
    </PremiumPage>
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
