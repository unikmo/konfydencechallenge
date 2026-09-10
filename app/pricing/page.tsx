"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
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

function TeamBuy() {
  const router = useRouter();
  const [orgName, setOrgName] = useState("");
  const [seats, setSeats] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const go = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sku: "CHAL-TEAM", orgName, seats }),
      });
      const data = (await res.json()) as { checkoutUrl?: string; error?: string; needsAuth?: boolean };
      if (res.status === 401 && data.needsAuth) {
        router.push(`/account/sign-in?next=${encodeURIComponent("/pricing?team=1")}&reason=team-invite`);
        return;
      }
      if (!res.ok || !data.checkoutUrl) {
        setError(data.error || "Could not start checkout.");
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
    <div className="kc-team-buy">
      <label>
        Team or school name
        <input
          type="text"
          value={orgName}
          onChange={(e) => setOrgName(e.target.value)}
          placeholder="Lincoln High School"
          maxLength={120}
        />
      </label>
      <label>
        Seats (min 3)
        <input
          type="number"
          min={3}
          max={500}
          value={seats}
          onChange={(e) => setSeats(Math.max(3, Math.min(500, Number(e.target.value) || 0)))}
        />
      </label>
      <button type="button" className="k-button" onClick={go} disabled={loading || !orgName.trim() || seats < 3}>
        {loading ? "Opening checkout…" : `Buy ${seats} seats — $${((seats * 499) / 100).toFixed(2)}/yr`}
      </button>
      {error ? <p role="alert" style={{ color: "#c0392b", fontSize: 12, marginTop: 6 }}>{error}</p> : null}
      <p style={{ fontSize: 11, opacity: 0.7, marginTop: 6 }}>
        You&rsquo;ll sign in first — the buyer becomes the team admin.
      </p>
    </div>
  );
}

function PricingContent() {
  const searchParams = useSearchParams();
  const editionParam = (searchParams.get("edition") || "").toLowerCase();

  const [selectedEdition, setSelectedEdition] = useState<EditionKey | null>(
    isEditionKey(editionParam) ? editionParam : null
  );

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
          H.A.C.K. pressure pattern most likely to move you. Unlock an edition, or take the set. Each is an annual plan.
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
          sub="/ year · one edition"
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
              label={`Unlock ${selectedLabel} — $6.99/yr`}
            />
          ) : (
            <div className="kc-price-pick">
              <p>Choose an edition — each is $6.99/year:</p>
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
          sub="/ year · all five editions"
          featured
          includes={[
            "All 5 challenge editions",
            "200+ real-life scenarios in total",
            "Unlimited rounds, new scenarios each time",
            "Dashboards and certificates for each",
            "Best value",
          ]}
        >
          <CheckoutRedirectButton sku="CHAL-UNLIMITED" label="Get all five — $24.99/yr" />
        </PriceCard>

        <PriceCard
          kicker="Schools & workplaces"
          price="$4.99"
          sub="/ seat · year"
          includes={[
            "All five editions per member, unlimited rounds",
            "Invite by email or one join link",
            "Admin dashboard — per-name completion and scores",
            "Add seats any time · price negotiable for larger groups",
          ]}
        >
          <TeamBuy />
        </PriceCard>
      </section>

      <section className="kg-shell" style={{ paddingBottom: 40 }}>
        <p className="k-copy" style={{ marginBottom: 12 }}>
          Buying for someone else? <Link href="/gift">Gift a challenge</Link> — we email them a claim
          code and your note.
        </p>
        <p className="k-copy" style={{ fontSize: 12 }}>
          Every plan is annual and unlocks instantly after checkout; your Konfydence account keeps progress and access across devices. Konfydence is an
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
