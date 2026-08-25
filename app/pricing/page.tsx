"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckoutRedirectButton } from "@/components/commerce/CheckoutRedirectButton";
import { InstitutionalCTA } from "@/components/commerce/InstitutionalCTA";
import { PremiumPage } from "@/components/PremiumSiteChrome";

const EDITIONS = [
  { key: "school", label: "School" },
  { key: "university", label: "University" },
  { key: "family", label: "Family" },
  { key: "travelsafe", label: "TravelSafe" },
  { key: "workplace", label: "Workplace" },
] as const;

type EditionKey = (typeof EDITIONS)[number]["key"];
function isEditionKey(value: string | null): value is EditionKey { return !!value && EDITIONS.some((e) => e.key === value); }

function PricingContent() {
  const searchParams = useSearchParams();
  const editionParam = (searchParams.get("edition") || "").toLowerCase();
  const [selectedEdition, setSelectedEdition] = useState<EditionKey | null>(isEditionKey(editionParam) ? editionParam : null);
  const [hasSingle, setHasSingle] = useState(false);

  useEffect(() => {
    fetch("/api/entitlements/me")
      .then((res) => res.json())
      .then((data) => setHasSingle((data.entitlements || []).some((e: { tier: string }) => e.tier === "single")))
      .catch(() => undefined);
  }, []);

  const selectedLabel = selectedEdition ? EDITIONS.find((e) => e.key === selectedEdition)!.label : null;

  return (
    <PremiumPage ctaHref="/challenge" ctaLabel="Choose challenge">
      <section className="k-shell k-page-hero">
        <p className="k-kicker">Challenge access</p>
        <h1 className="k-display">Start free. Go deeper when it is useful.</h1>
        <p className="k-lede">The short readiness check gives you a genuine signal before you buy anything. Full access adds the complete scenario set, repeated runs, deeper results and certificates.</p>
      </section>

      <section className="k-shell k-section-tight">
        <div className="k-pricing-grid">
          <article className="k-price">
            <span className="k-kicker">Readiness check</span><h2>Free</h2><strong>€0</strong>
            <ul><li>8 realistic scenarios</li><li>Balanced across H.A.C.K. pressure patterns</li><li>Immediate readiness score</li><li>Weakest pressure pattern</li><li>No account for round one</li></ul>
            <div className="k-actions"><Link href="/challenge" className="k-button" style={{width:"100%"}}>Start free challenge</Link></div>
          </article>

          <article className="k-price">
            <span className="k-kicker">One edition</span><h2>Full Challenge</h2><strong>$4.99</strong>
            <ul><li>One full 50-scenario edition</li><li>5 complete runs</li><li>Full KRS dashboard</li><li>Certificate</li><li>Weakness recommendation</li></ul>
            <div className="k-actions" style={{display:"block"}}>
              {selectedEdition ? (
                <CheckoutRedirectButton sku={`CHAL-SINGLE-${selectedEdition.toUpperCase()}`} label={`Unlock ${selectedLabel} — $4.99`} />
              ) : (
                <div>
                  <p className="k-copy" style={{fontSize:12,marginTop:0}}>Choose the edition you want to unlock:</p>
                  <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                    {EDITIONS.map((e) => <button key={e.key} type="button" className="k-button-quiet" onClick={() => setSelectedEdition(e.key)}>{e.label}</button>)}
                  </div>
                </div>
              )}
            </div>
          </article>

          <article className="k-price">
            <span className="k-kicker">Complete set</span><h2>Scam-Readiness Pack</h2><strong>$19.99</strong>
            <ul><li>All 5 challenge editions</li><li>250 real-life scenarios</li><li>Full dashboards</li><li>Certificates</li><li>Best-value individual access</li></ul>
            <div className="k-actions">{hasSingle ? <CheckoutRedirectButton sku="CHAL-UPGRADE" label="Upgrade to Unlimited — $15" /> : <CheckoutRedirectButton sku="CHAL-UNLIMITED" label="Get all 5 challenges — $19.99" />}</div>
          </article>

          <article className="k-price">
            <span className="k-kicker">Schools & organisations</span><h2>Group access</h2><strong>Talk to us</strong>
            <ul><li>School and Workplace editions</li><li>Classroom and team access</li><li>Onboarding</li><li>Compliance-training use cases</li><li>Workshops and pilots</li></ul>
            <div className="k-actions"><InstitutionalCTA /></div>
          </article>
        </div>
        <p className="k-copy" style={{fontSize:12,marginTop:28}}>Purchases unlock after checkout. Konfydence is educational scam-readiness training and does not guarantee protection from fraud or financial loss.</p>
      </section>
    </PremiumPage>
  );
}

export default function PricingPage() {
  return <Suspense fallback={null}><PricingContent /></Suspense>;
}
