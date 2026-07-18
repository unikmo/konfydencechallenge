"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { tokens } from "@/lib/theme/tokens";
import { CheckoutRedirectButton } from "@/components/commerce/CheckoutRedirectButton";
import { CrossSellStrip } from "@/components/commerce/CrossSellStrip";
import { InstitutionalCTA } from "@/components/commerce/InstitutionalCTA";

const otherEditions = [
  {
    edition: "school",
    label: "School Edition",
    audience: "Ages 12–18 · Schools, teachers, parents",
    description: "Gaming pressure, fake links, group chats, account takeovers, and risky sharing.",
    price: "$4.99",
  },
  {
    edition: "university",
    label: "University Edition",
    audience: "Students 18+ · Universities, student unions",
    description: "Housing scams, fake jobs, tuition pressure, identity risks, and travel traps.",
    price: "$4.99",
  },
  {
    edition: "family",
    label: "Family Edition",
    audience: "Parents, children, elders · Households",
    description: "Money requests, elder scams, child accounts, shared devices, and emotional pressure.",
    price: "$4.99",
  },
  {
    edition: "workplace",
    label: "Workplace",
    audience: "Employees, teams, HR/L&D · Companies",
    description: "Phishing, fake invoices, payroll changes, executive pressure, and AI voice scams.",
    price: "$4.99",
  },
];

export default function HomePage() {
  const router = useRouter();
  const [emailCapture, setEmailCapture] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);

  const handleLockscreenEmail = (e: React.FormEvent) => {
    e.preventDefault();
    // For v1, just show confirmation - email capture logic would be determined later
    setEmailSubmitted(true);
    // Download would happen here or in a separate endpoint
    setTimeout(() => {
      // Reset after a moment
      setEmailCapture("");
      setEmailSubmitted(false);
    }, 2000);
  };

  const handleTravelSafeStart = () => {
    router.push("/challenge/travelsafe/start?mode=diagnostic");
  };

  return (
    <main style={s.page}>
      <section style={s.hero}>
        <div style={s.heroShell}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/LOGO-05.png" alt="Konfydence" style={s.logo} />

          <p style={s.heroEyebrow}>Scam-readiness training for travelers</p>

          <h1 style={s.heroHeadline}>
            Stay scam-safe on your next trip
          </h1>

          <p style={s.heroSub}>
            TravelSafe is a free 3-minute pressure-scenario game that builds your instincts before you leave.
            Get your Konfydence Readiness Score™ and discover which scam tactics could catch you unprepared.
          </p>

          <div style={s.heroCtaContainer}>
            <button style={s.primaryCta} onClick={handleTravelSafeStart}>
              Take Free TravelSafe Check
            </button>
          </div>

          <p style={s.heroTrust}>No lectures. No jargon. Just real choices under travel pressure.</p>
        </div>
      </section>

      <section style={s.howItWorks}>
        <div style={s.container}>
          <h2 style={s.sectionTitle}>How it works</h2>

          <div style={s.howGrid}>
            {[
              { num: 1, title: "Choose TravelSafe", desc: "Or pick another challenge edition that fits your life." },
              { num: 2, title: "Face real scenarios", desc: "Make decisions under the pressure scammers actually use." },
              { num: 3, title: "Get your score", desc: "See your Readiness Score and your weakest pressure pattern." },
              { num: 4, title: "Unlock the full deck", desc: "Upgrade to the 50-question challenge for a full KRS dashboard." },
            ].map((step) => (
              <div key={step.num} style={s.howCard}>
                <div style={s.stepNumber}>{step.num}</div>
                <h3 style={s.howTitle}>{step.title}</h3>
                <p style={s.howDesc}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={s.lockscreenBlock}>
        <div style={s.container}>
          <div style={s.lockscreenInner}>
            <div>
              <h2 style={s.lockscreenTitle}>Keep pressure patterns visible</h2>
              <p style={s.lockscreenText}>
                Download free phone and computer lockscreens that remind you of the HACK framework wherever you unlock your device. No payment. No account. Just download.
              </p>
            </div>

            <form style={s.lockscreenForm} onSubmit={handleLockscreenEmail}>
              <input
                type="email"
                placeholder="your@email.com"
                value={emailCapture}
                onChange={(e) => setEmailCapture(e.target.value)}
                required
                style={s.emailInput}
              />
              <button
                type="submit"
                style={s.lockscreenCta}
                disabled={emailSubmitted}
              >
                {emailSubmitted ? "Downloading..." : "Get free lockscreens"}
              </button>
            </form>
          </div>
        </div>
      </section>

      <section style={s.differentiator}>
        <div style={s.container}>
          <h2 style={s.sectionTitle}>Why Konfydence?</h2>

          <div style={s.diffGrid}>
            <div style={s.diffCard}>
              <div style={s.diffIcon}>📊</div>
              <h3 style={s.diffCardTitle}>Shareable Readiness Score</h3>
              <p style={s.diffCardDesc}>
                Your Konfydence Readiness Score™ is persistent and exportable — unlike a free one-off test.
              </p>
            </div>

            <div style={s.diffCard}>
              <div style={s.diffIcon}>🎯</div>
              <h3 style={s.diffCardTitle}>The HACK Framework</h3>
              <p style={s.diffCardDesc}>
                We name the pressure tactics (Hurry, Authority, Connection, Kill-switch) so you recognize them in real life.
              </p>
            </div>

            <div style={s.diffCard}>
              <div style={s.diffIcon}>✈️</div>
              <h3 style={s.diffCardTitle}>Travel-Specific Scenarios</h3>
              <p style={s.diffCardDesc}>
                Real pressure moments travelers actually face — bookings, WiFi, refunds, taxis, SIM cards, rentals.
              </p>
            </div>

            <div style={s.diffCard}>
              <div style={s.diffIcon}>💳</div>
              <h3 style={s.diffCardTitle}>Pocket Reminders</h3>
              <p style={s.diffCardDesc}>
                Wallet cards and fridge magnets you keep as daily artifacts — your HACK pressure cues on paper.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section style={s.merchStrip}>
        <div style={s.container}>
          <h3 style={s.merchTitle}>Build your armor</h3>
          <p style={s.merchSubtitle}>
            Wallet cards and fridge magnets you keep as reminders
          </p>

          <div style={s.merchGrid}>
            <div style={s.merchItem}>
              <h4 style={s.merchName}>KonfyGuard Wallet Card</h4>
              <p style={s.merchPrice}>$14.99</p>
              <p style={s.merchDesc}>HACK pressure reminders in your wallet.</p>
              <CheckoutRedirectButton
                sku="KG-WALLET"
                label="Add to cart"
              />
            </div>

            <div style={s.merchItem}>
              <h4 style={s.merchName}>KonfyGuard Fridge Magnet</h4>
              <p style={s.merchPrice}>$9.99</p>
              <p style={s.merchDesc}>Household reminder for the whole family.</p>
              <CheckoutRedirectButton
                sku="KG-MAGNET"
                label="Add to cart"
              />
            </div>
          </div>
        </div>
      </section>

      <section style={s.otherEditions}>
        <div style={s.container}>
          <h2 style={s.sectionTitle}>Also available</h2>
          <p style={s.sectionSubtitle}>
            Coming soon: School, University, Family, and Workplace editions with scenario sets built for their contexts.
          </p>

          <div style={s.editionsGrid}>
            {otherEditions.map((edition) => (
              <article key={edition.edition} style={s.editionCard}>
                <div>
                  <p style={s.editionPrice}>{edition.price}</p>
                  <h3 style={s.editionTitle}>{edition.label}</h3>
                  <p style={s.editionAudience}>{edition.audience}</p>
                  <p style={s.editionDesc}>{edition.description}</p>
                </div>

                <div>
                  <Link
                    href={`/challenge/${edition.edition}/start?mode=diagnostic`}
                    style={s.editionCta}
                  >
                    Try {edition.label}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section style={s.institutionalSection}>
        <div style={s.container}>
          <InstitutionalCTA />
        </div>
      </section>

      <footer style={s.footer}>
        <div style={s.container}>
          <p style={s.footerText}>
            Konfydence is an educational scam-readiness game. It does not guarantee protection from fraud or financial loss.
          </p>
        </div>
      </footer>
    </main>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: tokens.bgCanvas,
    color: tokens.textOnDark,
    fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
  },

  // Hero section
  hero: {
    paddingTop: 60,
    paddingBottom: 80,
    textAlign: "center",
  },
  heroShell: {
    maxWidth: 900,
    margin: "0 auto",
    paddingLeft: 20,
    paddingRight: 20,
  },
  logo: {
    height: 40,
    width: "auto",
    marginBottom: 32,
  },
  heroEyebrow: {
    margin: "0 0 16px",
    color: tokens.accentAmber,
    fontSize: 13,
    fontWeight: 900,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },
  heroHeadline: {
    margin: "0 auto 20px",
    fontSize: "clamp(36px, 6vw, 64px)",
    fontWeight: 900,
    letterSpacing: 0,
    lineHeight: 1.1,
    maxWidth: 800,
  },
  heroSub: {
    margin: "0 auto 32px",
    fontSize: 18,
    lineHeight: 1.6,
    color: "#cbd5e1",
    maxWidth: 700,
  },
  heroCtaContainer: {
    marginBottom: 24,
  },
  primaryCta: {
    padding: "12px 24px",
    borderRadius: 999,
    fontSize: 15,
    fontWeight: 900,
    border: "none",
    background: tokens.accentAmber,
    color: tokens.textOnLight,
    cursor: "pointer",
    transition: "opacity 0.15s",
  },
  heroTrust: {
    margin: 0,
    fontSize: 13,
    color: tokens.textMuted,
    lineHeight: 1.6,
  },

  // Section common
  container: {
    maxWidth: 1040,
    margin: "0 auto",
    paddingLeft: 20,
    paddingRight: 20,
  },
  sectionTitle: {
    fontSize: "clamp(28px, 4vw, 42px)",
    fontWeight: 900,
    margin: "0 0 24px",
    textAlign: "center",
  },
  sectionSubtitle: {
    fontSize: 16,
    color: tokens.textMuted,
    textAlign: "center",
    margin: "0 auto 40px",
    maxWidth: 600,
    lineHeight: 1.6,
  },

  // How it works
  howItWorks: {
    paddingTop: 60,
    paddingBottom: 60,
    borderTop: `1px solid rgba(255, 255, 255, 0.08)`,
    borderBottom: `1px solid rgba(255, 255, 255, 0.08)`,
  },
  howGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: 24,
  },
  howCard: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    textAlign: "left",
  },
  stepNumber: {
    fontSize: 32,
    fontWeight: 900,
    color: tokens.accentAmber,
  },
  howTitle: {
    fontSize: 16,
    fontWeight: 800,
    margin: 0,
  },
  howDesc: {
    fontSize: 14,
    color: tokens.textMuted,
    margin: 0,
    lineHeight: 1.5,
  },

  // Lockscreen block
  lockscreenBlock: {
    paddingTop: 60,
    paddingBottom: 60,
  },
  lockscreenInner: {
    background: "rgba(255, 179, 29, 0.08)",
    border: `1px solid ${tokens.accentAmber}`,
    borderRadius: 16,
    padding: 40,
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 40,
    alignItems: "center",
  },
  lockscreenTitle: {
    fontSize: "clamp(24px, 3vw, 32px)",
    fontWeight: 900,
    margin: "0 0 16px",
  },
  lockscreenText: {
    fontSize: 16,
    lineHeight: 1.6,
    color: "#cbd5e1",
    margin: 0,
  },
  lockscreenForm: {
    display: "flex",
    gap: 12,
    flexDirection: "column",
  },
  emailInput: {
    padding: "12px 16px",
    borderRadius: 8,
    border: `1px solid ${tokens.accentAmber}`,
    background: "transparent",
    color: tokens.textOnDark,
    fontSize: 14,
    fontFamily: "inherit",
  },
  lockscreenCta: {
    padding: "12px 16px",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 900,
    border: "none",
    background: tokens.accentAmber,
    color: tokens.textOnLight,
    cursor: "pointer",
    transition: "opacity 0.15s",
  },

  // Differentiation
  differentiator: {
    paddingTop: 60,
    paddingBottom: 60,
  },
  diffGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 24,
  },
  diffCard: {
    padding: 24,
    background: "rgba(255, 255, 255, 0.04)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: 12,
    textAlign: "center",
  },
  diffIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  diffCardTitle: {
    fontSize: 16,
    fontWeight: 800,
    margin: "0 0 8px",
  },
  diffCardDesc: {
    fontSize: 14,
    color: tokens.textMuted,
    margin: 0,
    lineHeight: 1.5,
  },

  // Merch strip
  merchStrip: {
    paddingTop: 60,
    paddingBottom: 60,
    borderTop: `1px solid rgba(255, 255, 255, 0.08)`,
    borderBottom: `1px solid rgba(255, 255, 255, 0.08)`,
  },
  merchTitle: {
    fontSize: 24,
    fontWeight: 900,
    margin: "0 0 8px",
    textAlign: "center",
  },
  merchSubtitle: {
    fontSize: 14,
    color: tokens.textMuted,
    textAlign: "center",
    margin: "0 0 32px",
  },
  merchGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: 20,
  },
  merchItem: {
    padding: 20,
    background: tokens.bgCardDark,
    border: `1px solid rgba(255, 255, 255, 0.12)`,
    borderRadius: 12,
    textAlign: "center",
  },
  merchName: {
    fontSize: 16,
    fontWeight: 800,
    margin: "0 0 8px",
  },
  merchPrice: {
    fontSize: 18,
    fontWeight: 900,
    color: tokens.accentAmber,
    margin: "0 0 8px",
  },
  merchDesc: {
    fontSize: 13,
    color: tokens.textMuted,
    margin: "0 0 16px",
    lineHeight: 1.4,
  },

  // Other editions
  otherEditions: {
    paddingTop: 60,
    paddingBottom: 60,
  },
  editionsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 20,
  },
  editionCard: {
    display: "flex",
    flexDirection: "column",
    padding: 20,
    background: "rgba(255, 255, 255, 0.04)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: 12,
    minHeight: 280,
  },
  editionPrice: {
    fontSize: 18,
    fontWeight: 900,
    color: tokens.accentAmber,
    margin: "0 0 8px",
  },
  editionTitle: {
    fontSize: 18,
    fontWeight: 900,
    margin: "0 0 4px",
  },
  editionAudience: {
    fontSize: 12,
    color: tokens.textMuted,
    margin: "0 0 12px",
    fontWeight: 600,
  },
  editionDesc: {
    fontSize: 14,
    color: tokens.textMuted,
    margin: "0 0 auto",
    lineHeight: 1.5,
  },
  editionCta: {
    marginTop: 16,
    padding: "10px 14px",
    borderRadius: 6,
    fontSize: 13,
    fontWeight: 800,
    background: tokens.btnBlack,
    color: tokens.textOnDark,
    textDecoration: "none",
    textAlign: "center",
    display: "block",
    transition: "opacity 0.15s",
  },

  // Institutional
  institutionalSection: {
    paddingTop: 40,
    paddingBottom: 60,
  },

  // Footer
  footer: {
    paddingTop: 40,
    paddingBottom: 40,
    borderTop: `1px solid rgba(255, 255, 255, 0.08)`,
  },
  footerText: {
    fontSize: 12,
    color: tokens.textMuted,
    textAlign: "center",
    margin: 0,
    lineHeight: 1.6,
    maxWidth: 600,
    marginLeft: "auto",
    marginRight: "auto",
  },
};
