"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

const DOWNLOADS = [
  {
    label: "Emergency Scam Protocol",
    detail: "Printable one-page household protocol",
    href: "/resources/emergency-scam-protocol",
    kind: "PDF",
  },
  {
    label: "Phone screen locker",
    detail: "Pause · Verify · Call reminder for your lock screen",
    href: "/resources/konfydence-phone-lock-screen.svg",
    kind: "SCREEN",
  },
  {
    label: "Computer screen locker",
    detail: "Desktop reminder for high-pressure moments",
    href: "/resources/konfydence-desktop-lock-screen.svg",
    kind: "SCREEN",
  },
];

export function ScamSafetyPack({ source = "site" }: { source?: string }) {
  const [email, setEmail] = useState("");
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setMessage("");

    const form = new FormData(event.currentTarget);
    const honeypot = String(form.get("website") || "");

    try {
      const response = await fetch("/api/resources/scam-safety-pack", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          marketingConsent,
          source,
          website: honeypot,
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload.error || "Unable to prepare your download right now.");
      }

      setStatus("success");
      setMessage(
        payload.emailSent
          ? "Your download is ready. We also sent the links to your inbox."
          : "Your download is ready below."
      );

      const analyticsWindow = window as unknown as {
        gtag?: (...args: unknown[]) => void;
      };
      analyticsWindow.gtag?.("event", "generate_lead", {
        lead_type: "scam_safety_pack",
        lead_source: source,
        marketing_opt_in: marketingConsent,
      });
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    }
  }

  return (
    <section id="free-scam-safety-pack" className="k-shell k-free-pack" aria-labelledby={`free-pack-title-${source}`}>
      <div className="k-free-pack-copy">
        <p className="k-kicker">Free household resource</p>
        <h2 id={`free-pack-title-${source}`} className="k-display-sm">Know what to do before the pressure starts.</h2>
        <p className="k-copy">
          Get the Konfydence Scam Safety Pack: the printable Emergency Scam Protocol plus phone and computer screen reminders built around one simple response — Pause. Verify. Call.
        </p>

        {status === "success" ? (
          <div className="k-pack-success" role="status" aria-live="polite">
            <strong>{message}</strong>
            <div className="k-pack-downloads">
              {DOWNLOADS.map((item) => (
                <a key={item.href} href={item.href} download>
                  <span>{item.kind}</span>
                  <b>{item.label}</b>
                  <small>{item.detail}</small>
                </a>
              ))}
            </div>
          </div>
        ) : (
          <form className="k-pack-form" onSubmit={handleSubmit}>
            <label htmlFor={`pack-email-${source}`}>Email address</label>
            <div className="k-pack-form-row">
              <input
                id={`pack-email-${source}`}
                type="email"
                name="email"
                autoComplete="email"
                inputMode="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
              <button className="k-button" type="submit" disabled={status === "submitting"}>
                {status === "submitting" ? "Preparing…" : "Send me the free pack"}
              </button>
            </div>
            <label className="k-pack-optin">
              <input
                type="checkbox"
                checked={marketingConsent}
                onChange={(event) => setMarketingConsent(event.target.checked)}
              />
              <span>Also send me occasional scam-safety tips. Optional.</span>
            </label>
            <input className="k-pack-honeypot" type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
            <p className="k-pack-privacy">
              We use your email to deliver the requested pack. Marketing is optional. See our <Link href="/privacy-policy">Privacy Policy</Link>.
            </p>
            {status === "error" ? <p className="k-pack-error" role="alert">{message}</p> : null}
          </form>
        )}
      </div>

      <div className="k-pack-visual" aria-label="The three resources included in the free Scam Safety Pack">
        <div className="k-pack-protocol-card">
          <small>01 · Printable protocol</small>
          <strong>PAUSE<br />VERIFY<br />CALL</strong>
          <span>Emergency Scam Protocol</span>
        </div>
        <div className="k-pack-screen-card k-pack-screen-phone">
          <small>02 · Phone</small>
        </div>
        <div className="k-pack-screen-card k-pack-screen-desktop">
          <small>03 · Computer</small>
        </div>
      </div>
    </section>
  );
}
