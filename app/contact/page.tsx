"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PremiumPage } from "@/components/PremiumSiteChrome";

export default function ContactPage() {
  return (
    <Suspense fallback={null}>
      <ContactForm />
    </Suspense>
  );
}

const HEADINGS: Record<string, { title: string; intro: string }> = {
  "schools-teams": {
    title: "Bring Konfydence to your organisation",
    intro: "Tell us who you want to train and what you need. We'll discuss the right School, University or Workplace rollout.",
  },
  organization: {
    title: "Bring Konfydence to your organisation",
    intro: "Tell us who you want to train and what you need. We'll discuss the right School, University or Workplace rollout.",
  },
  "travel-check-in": {
    title: "Travel Check-In interest",
    intro: "Tell us about your travel context and what would make the service useful.",
  },
  "lockscreens-home": {
    title: "Konfydence Lockscreens — Home",
    intro: "Checkout and device onboarding are being set up. Leave your details and we'll get you started.",
  },
  "lockscreens-teen": {
    title: "Konfydence Lockscreens — Teen Home",
    intro: "Checkout and device onboarding are being set up. Leave your details and we'll get you started.",
  },
  "lockscreens-schools": {
    title: "Konfydence Lockscreens for schools",
    intro: "Tell us roughly how many managed computers you'd cover and which MDM you use, and we'll send a quote.",
  },
  "lockscreens-workplace": {
    title: "Konfydence Lockscreens for your workplace",
    intro: "Tell us your headcount and MDM, and we'll send a per-seat quote ($4 / employee / year, $300 minimum).",
  },
  general: {
    title: "Get in touch",
    intro: "Questions about Konfydence, purchases or organisational access are welcome.",
  },
};

function ContactForm() {
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
    <PremiumPage ctaHref="/challenge" ctaLabel="Try a free check">
      <section className="kg-narrow k-section" style={{ borderTop: 0, maxWidth: 620 }}>
        <p className="k-kicker">Contact</p>
        <h1 className="k-display-sm">{heading.title}</h1>
        <p className="k-copy" style={{ margin: "16px 0 30px" }}>{heading.intro}</p>

        {submitted ? (
          <div className="kc-note">
            <b>Message received</b>
            <p>Thank you. We&apos;ll review your message and reply as soon as possible.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="kc-form" style={{ boxShadow: "none" }}>
            {error ? <div className="kc-form-error" role="alert">{error}</div> : null}
            <label>Name<input name="name" value={formData.name} onChange={handleChange} required autoComplete="name" /></label>
            <label>Email<input type="email" name="email" value={formData.email} onChange={handleChange} required autoComplete="email" /></label>
            <label>
              {topic === "travel-check-in" ? "Travel context " : "Organisation "}
              <small>optional</small>
              <input name="organization" value={formData.organization} onChange={handleChange} autoComplete="organization" />
            </label>
            {isOrg ? (
              <label>Approximate students / employees<input type="number" min="1" name="seatCount" value={formData.seatCount} onChange={handleChange} placeholder="e.g. 500" /></label>
            ) : null}
            <label>Message<textarea name="message" value={formData.message} onChange={handleChange} required rows={6} /></label>
            <label className="kc-form-consent">
              <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} required />
              <span>I agree to be contacted about this enquiry and have read the <Link href="/privacy-policy">Privacy Policy</Link>.</span>
            </label>
            <button className="k-button" type="submit" disabled={loading}>{loading ? "Sending…" : "Send message"}</button>
          </form>
        )}
      </section>
    </PremiumPage>
  );
}
