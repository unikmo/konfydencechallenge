"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PremiumPage } from "@/components/PremiumSiteChrome";
import { PortfolioStrip } from "@/components/PortfolioStrip";
import { CheckoutRedirectButton } from "@/components/commerce/CheckoutRedirectButton";

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

function PriceCard({
  kicker,
  price,
  sub,
  includes,
  featured,
  children,
}: {
  kicker: string;
  price: string;
  sub?: string;
  includes: string[];
  featured?: boolean;
  children: React.ReactNode;
}) {
  return (
    <article className={`kc-price ${featured ? "is-featured" : ""}`}>
      <p className="kc-price-kicker">{kicker}</p>
      <p className="kc-price-amount"><strong>{price}</strong>{sub ? <span>{sub}</span> : null}</p>
      <ul className="kc-price-list">
        {includes.map((item) => <li key={item}>{item}</li>)}
      </ul>
      <div className="kc-price-cta">{children}</div>
    </article>
  );
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
      .catch(() => {});
  }, []);

  const selectedLabel = selectedEdition
    ? EDITIONS.find((e) => e.key === selectedEdition)!.label
    : null;

  return (
    <PremiumPage ctaHref="/challenge" ctaLabel="Start a free check">
      <section className="kg-shell kc-hero is-narrow" style={{ paddingBottom: 40 }}>
        <p className="k-kicker">Pricing</p>
        <h1>Start free. Pay only when you want the full challenge.</h1>
        <p>
          The free readiness check gives you a real result — your Konfydence Readiness Score and the
          H.A.C.K. pressure pattern most likely to move you. Upgrade an edition, or take the set.
        </p>
      </section>

      <section className="kg-shell kc-price-grid">
        <PriceCard
          kicker="Free readiness check"
          price="Free"
          includes={[
            "A quick scored check, balanced across the pressure patterns",
            "Konfydence Readiness Score",
            "Your weakest pressure pattern",
            "Feedback and a rule after every decision",
          ]}
        >
          <Link className="k-button" href="/challenge">Start free</Link>
        </PriceCard>

        <PriceCard
          kicker="Full challenge"
          price="$6.99"
          sub="one edition"
          includes={[
            "40+ real-life scenarios, added to regularly",
            "Played in short rounds — new scenarios each time",
            "Full readiness dashboard + pressure profile",
            "Completion certificate",
          ]}
        >
          {selectedEdition ? (
            <CheckoutRedirectButton
              sku={`CHAL-SINGLE-${selectedEdition.toUpperCase()}`}
              label={`Unlock ${selectedLabel} — $6.99`}
            />
          ) : (
            <div className="kc-price-pick">
              <p>Choose an edition — each is $6.99:</p>
              <div className="kc-price-pills">
                {EDITIONS.map((e) => (
                  <button key={e.key} type="button" onClick={() => setSelectedEdition(e.key)}>
                    {e.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </PriceCard>

        <PriceCard
          kicker="Complete pack"
          price="$24.99"
          sub="all five editions"
          featured
          includes={[
            "All 5 challenge editions",
            "200+ real-life scenarios in total",
            "Unlimited rounds, new scenarios each time",
            "Dashboards and certificates for each",
            "Best value",
          ]}
        >
          {hasSingle ? (
            <CheckoutRedirectButton sku="CHAL-UPGRADE" label="Upgrade to the pack — $18" />
          ) : (
            <CheckoutRedirectButton sku="CHAL-UNLIMITED" label="Get all five — $24.99" />
          )}
        </PriceCard>

        <PriceCard
          kicker="Schools & workplaces"
          price="Per seat"
          includes={[
            "School and Workplace editions across a cohort",
            "Baseline and post measurement",
            "Onboarding and reporting",
            "Pairs with a CoMaSy pilot",
          ]}
        >
          <Link className="k-button-quiet" href="/contact?topic=schools-teams">Request a quote</Link>
        </PriceCard>
      </section>

      <section className="kg-shell" style={{ paddingBottom: 40 }}>
        <p className="k-copy" style={{ marginBottom: 12 }}>
          Buying for someone else? <Link href="/gift">Gift a challenge</Link> — we email them a claim
          code and your note.
        </p>
        <p className="k-copy" style={{ fontSize: 12 }}>
          Every purchase unlocks instantly after checkout — no account required. Konfydence is an
          educational scam-readiness game; it does not guarantee protection from fraud or financial loss.
        </p>
      </section>

      <PortfolioStrip kicker="More from Konfydence" heading="Also on the shelf." />
    </PremiumPage>
  );
}

export default function PricingPage() {
  return (
    <Suspense fallback={null}>
      <PricingContent />
    </Suspense>
  );
}
