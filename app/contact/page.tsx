"use client";

import React, { Suspense, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { tokens } from "@/lib/theme/tokens";

export default function ContactPage() {
  return <Suspense fallback={null}><ContactForm /></Suspense>;
}

function ContactForm() {
  const searchParams = useSearchParams();
  const topic = searchParams.get("topic") || "general";
  const isSchoolsTeams = topic === "schools-teams" || topic === "organization";
  const isTravelCheckIn = topic === "travel-check-in";
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
        const payload = (await response.json()) as { error?: string };
        setError(payload.error || "We could not send your message. Please try again.");
        return;
      }
      setSubmitted(true);
      setFormData({ name: "", email: "", organization: "", seatCount: "", message: "" });
      setConsent(false);
    } catch {
      setError("We could not send your message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ minHeight: "100vh", background: tokens.bgCanvas, color: tokens.textOnDark, padding: "60px 20px", fontFamily: "Inter,ui-sans-serif,system-ui,sans-serif" }}>
      <div style={{ maxWidth: 620, margin: "0 auto" }}>
        <header style={{ marginBottom: 38, textAlign: "center" }}>
          <Image src="/brand/LOGO-05.png" alt="Konfydence" width={180} height={48} priority style={{ width: "auto", height: 40, marginBottom: 24 }} />
          <h1 style={{ fontSize: "clamp(30px,5vw,44px)", fontWeight: 900, margin: "0 0 12px", letterSpacing: "-.03em" }}>
            {isTravelCheckIn ? "Travel Check-In interest" : isSchoolsTeams ? "Bring Konfydence to your organization" : "Get in touch"}
          </h1>
          <p style={{ fontSize: 16, color: tokens.textMuted, margin: 0, lineHeight: 1.6 }}>
            {isSchoolsTeams
              ? "Tell us who you want to train and what you need. We’ll discuss the right School, University or Workplace rollout."
              : isTravelCheckIn
                ? "Tell us about your travel context and what would make the service useful."
                : "Questions about Konfydence, purchases or organizational access are welcome."}
          </p>
        </header>

        {submitted ? (
          <section style={{ padding: 24, background: "rgba(34,197,94,.1)", border: "1px solid rgba(34,197,94,.3)", borderRadius: 14 }}>
            <h2 style={{ fontSize: 19, color: "#22c55e", margin: "0 0 8px" }}>✓ Message received</h2>
            <p style={{ fontSize: 14, color: tokens.textMuted, margin: 0, lineHeight: 1.6 }}>Thank you. We’ll review your message and reply as soon as possible.</p>
          </section>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "grid", gap: 20 }}>
            {error ? <div role="alert" style={{ padding: 12, background: "rgba(239,68,68,.1)", border: "1px solid rgba(239,68,68,.3)", borderRadius: 8, color: "#ef4444", fontSize: 13 }}>{error}</div> : null}
            <Field label="Name"><input name="name" value={formData.name} onChange={handleChange} required autoComplete="name" style={inputStyle} /></Field>
            <Field label="Email"><input type="email" name="email" value={formData.email} onChange={handleChange} required autoComplete="email" style={inputStyle} /></Field>
            <Field label={isTravelCheckIn ? "Travel context (optional)" : "Organization (optional)"}><input name="organization" value={formData.organization} onChange={handleChange} autoComplete="organization" style={inputStyle} /></Field>
            {isSchoolsTeams ? <Field label="Approximate students / employees"><input type="number" min="1" name="seatCount" value={formData.seatCount} onChange={handleChange} placeholder="e.g. 500" style={inputStyle} /></Field> : null}
            <Field label="Message"><textarea name="message" value={formData.message} onChange={handleChange} required rows={6} style={{ ...inputStyle, resize: "vertical" }} /></Field>
            <label style={{ display: "flex", alignItems: "flex-start", gap: 9, color: tokens.textMuted, fontSize: 13, lineHeight: 1.5 }}>
              <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} required style={{ marginTop: 3, accentColor: tokens.accentAmber }} />
              <span>I agree to be contacted about this enquiry and have read the <Link href="/privacy-policy" style={{ color: tokens.accentAmber }}>Privacy Policy</Link>.</span>
            </label>
            <button type="submit" disabled={loading} style={{ minHeight: 48, border: 0, borderRadius: 999, background: tokens.accentAmber, color: tokens.textOnLight, fontWeight: 900, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? .7 : 1 }}>{loading ? "Sending…" : "Send message"}</button>
          </form>
        )}

        <Link href="/" style={{ display: "inline-block", marginTop: 30, color: tokens.accentAmber, fontSize: 13, fontWeight: 850, textDecoration: "none" }}>← Back to home</Link>
      </div>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label style={{ display: "grid", gap: 7, fontSize: 13, fontWeight: 850 }}>{label}{children}</label>;
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 9,
  border: "1px solid rgba(255,255,255,.14)",
  background: "rgba(255,255,255,.045)",
  color: tokens.textOnDark,
  font: "inherit",
  outline: "none",
};
