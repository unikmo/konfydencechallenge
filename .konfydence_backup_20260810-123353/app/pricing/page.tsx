"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { tokens } from "@/lib/theme/tokens";
import { PricingCard } from "@/components/commerce/PricingCard";
import { CheckoutRedirectButton } from "@/components/commerce/CheckoutRedirectButton";
import { InstitutionalCTA } from "@/components/commerce/InstitutionalCTA";

// Pricing copy per docs/DEV_BRIEF_DIAGNOSTIC_UPGRADE.md §10 (price points unchanged
// from PRODUCT_SPEC_V1.md §13; free-tier copy updated for the 10-question diagnostic).
// Never say "one play only" — say "Includes 5 complete runs of this challenge."

const EDITIONS = [
  { key: "school", label: "School" },
  { key: "university", label: "University" },
  { key: "family", label: "Family" },
  { key: "travelsafe", label: "TravelSafe" },
  { key: "workplace", label: "Workplace" },
] as const;

type EditionKey = (typeof EDITIONS)[number]["key"];

function isEditionKey(value: string | null): value is EditionKey {
  return !!value && EDITIONS.some((e) => e.key === value);
}

function PricingContent() {
  const searchParams = useSearchParams();
  const editionParam = (searchParams.get("edition") || "").toLowerCase();

  const [selectedEdition, setSelectedEdition] = useState<EditionKey | null>(
    isEditionKey(editionParam) ? editionParam : null
  );
  const [hasSingle, setHasSingle] = useState(false);

  useEffect(() => {
    fetch("/api/entitlements/me")
      .then((res) => res.json())
      .then((data) => {
        const entitlements = data.entitlements || [];
        setHasSingle(entitlements.some((e: { tier: string }) => e.tier === "single"));
      })
      .catch(() => {
        // entitlements check is best-effort; default (Unlimited CTA) is safe fallback
      });
  }, []);

  const selectedLabel = selectedEdition
    ? EDITIONS.find((e) => e.key === selectedEdition)!.label
    : null;

  return (
    <main style={styles.page}>
      <div style={styles.shell}>
        <header style={styles.header}>
          <strong style={styles.brand}>Konfydence Challenge</strong>
          <Link href="/challenge" style={styles.navLink}>
            Back to challenges
          </Link>
        </header>

        <h1 style={styles.title}>Start free. Upgrade only when you want the full challenge.</h1>

        <div style={styles.grid}>
          <PricingCard
            name="Free Readiness Check"
            price="Free"
            includes={[
              "10 real-life scam scenarios",
              "Mini Konfydence Readiness Score™",
              "Weakest pressure pattern",
              "Personalized feedback",
            ]}
            cta={
              <Link href="/challenge" style={styles.button}>
                Start Free Challenge
              </Link>
            }
          />

          <PricingCard
            name="Full Challenge"
            price="$4.99"
            includes={[
              "One full 50-scenario challenge",
              "5 complete runs",
              "Full KRS dashboard",
              "Certificate",
              "Weakness recommendation",
            ]}
            cta={
              selectedEdition ? (
                <CheckoutRedirectButton
                  sku={`CHAL-SINGLE-${selectedEdition.toUpperCase()}`}
                  label={`Unlock ${selectedLabel} — $4.99`}
                />
              ) : (
                <div>
                  <p style={styles.pickEditionNote}>Choose an edition. Each Full Challenge is $4.99:</p>
                  <div style={styles.pillRow}>
                    {EDITIONS.map((e) => (
                      <button
                        key={e.key}
                        type="button"
                        onClick={() => setSelectedEdition(e.key)}
                        style={styles.pill}
                      >
                        {e.label} - $4.99
                      </button>
                    ))}
                  </div>
                </div>
              )
            }
          />

          <PricingCard
            name="Complete Scam-Readiness Pack"
            price="$19.99"
            includes={["All 5 challenge decks", "250 real-life scenarios", "Full dashboards", "Certificates", "Best value"]}
            cta={
              hasSingle ? (
                <CheckoutRedirectButton sku="CHAL-UPGRADE" label="Upgrade to Unlimited — $15" />
              ) : (
                <CheckoutRedirectButton sku="CHAL-UNLIMITED" label="Get All 5 Challenges — $19.99" />
              )
            }
          />

          <PricingCard
            name="Schools & Workplace Groups"
            price="Contact us"
            includes={["School and Workplace editions", "Classroom and team access", "Onboarding", "Compliance training", "Workshops"]}
            cta={<InstitutionalCTA />}
          />
        </div>

        <p style={styles.note}>
          Every purchase unlocks instantly after checkout — no account creation required.
        </p>

        <p style={styles.disclaimer}>
          Konfydence is an educational scam-readiness game. It does not guarantee protection from fraud or financial
          loss.
        </p>
      </div>
    </main>
  );
}

export default function PricingPage() {
  return (
    <Suspense fallback={null}>
      <PricingContent />
    </Suspense>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: tokens.bgCanvas,
    color: tokens.textOnDark,
    padding: "40px 20px",
  },
  shell: { maxWidth: "1200px", margin: "0 auto" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 },
  brand: { fontWeight: 900 },
  navLink: { color: "#cbd5e1", fontWeight: 700, fontSize: 14, textDecoration: "none" },
  title: {
    maxWidth: "720px",
    fontSize: "clamp(28px, 4vw, 40px)",
    lineHeight: 1.15,
    letterSpacing: "-0.02em",
    marginBottom: 32,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: 20,
  },
  button: {
    display: "inline-flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 999,
    background: tokens.accentAmber,
    color: tokens.bgCanvas,
    padding: "12px 18px",
    fontWeight: 900,
    textDecoration: "none",
    width: "100%",
  },
  pickEditionNote: { margin: "0 0 10px", fontSize: 12, fontWeight: 800, color: tokens.textMuted },
  pillRow: { display: "flex", flexWrap: "wrap", gap: 8 },
  pill: {
    padding: "8px 12px",
    borderRadius: 999,
    border: `1px solid rgba(255,255,255,0.16)`,
    background: "transparent",
    color: tokens.textOnDark,
    fontWeight: 800,
    fontSize: 12,
    cursor: "pointer",
  },
  note: { marginTop: 28, color: "#94a3b8", fontSize: 13, maxWidth: 620, lineHeight: 1.5 },
  disclaimer: {
    marginTop: 16,
    color: "#64748b",
    fontSize: 12,
    maxWidth: 620,
    lineHeight: 1.5,
    borderTop: "1px solid rgba(255,255,255,0.1)",
    paddingTop: 16,
  },
};
