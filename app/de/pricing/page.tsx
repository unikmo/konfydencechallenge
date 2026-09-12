"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PremiumPageDe } from "@/components/PremiumSiteChrome";
import { CheckoutRedirectButton } from "@/components/commerce/CheckoutRedirectButton";

const EDITIONEN = [
  { key: "family", label: "Familie" },
  { key: "school", label: "Schule" },
  { key: "university", label: "Universität" },
  { key: "travelsafe", label: "TravelSafe" },
] as const;

type EditionKey = (typeof EDITIONEN)[number]["key"];

function isEditionKey(value: string | null): value is EditionKey {
  return !!value && EDITIONEN.some((e) => e.key === value);
}

function PreisKarte({
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

function GermanPricingContent() {
  const searchParams = useSearchParams();
  const editionParam = (searchParams.get("edition") || "").toLowerCase();

  const [selectedEdition, setSelectedEdition] = useState<EditionKey | null>(
    isEditionKey(editionParam) ? editionParam : null
  );
  const selectedLabel = selectedEdition
    ? EDITIONEN.find((e) => e.key === selectedEdition)!.label
    : null;

  return (
    <PremiumPageDe ctaHref="/de/challenge/family/start?mode=diagnostic" ctaLabel="Kostenlos starten">
      <section className="kg-shell kc-hero is-narrow" style={{ paddingBottom: 40 }}>
        <p className="k-kicker">Preise</p>
        <h1>Kostenlos starten. Nur zahlen, wenn du die volle Challenge willst.</h1>
        <p>
          Der kostenlose Check gibt dir ein echtes Ergebnis — deinen Konfydence Readiness Score und das
          H.A.C.K.-Druckmuster, das dir am ehesten zum Verhängnis werden könnte. Schalte eine Edition frei,
          oder gleich das komplette Paket. Beides sind Jahrespläne.
        </p>
      </section>

      <section className="kg-shell kc-price-grid">
        <PreisKarte
          kicker="Kostenloser Check"
          price="Kostenlos"
          includes={[
            "Ein kurzer, bewerteter Check, ausgewogen über die Druckmuster",
            "Dein Konfydence Readiness Score",
            "Dein schwächstes Druckmuster",
            "Feedback und eine Regel nach jeder Entscheidung",
          ]}
        >
          <Link className="k-button" href="/de/challenge/family/start?mode=diagnostic">Kostenlos starten</Link>
        </PreisKarte>

        <PreisKarte
          kicker="Volle Challenge"
          price="€6,99"
          sub="/ Jahr"
          includes={[
            "48 reale Szenarien pro Edition, kulturell für Deutschland geschrieben",
            "Gespielt in kurzen Runden — jedes Mal neue Szenarien",
            "Volles Readiness-Dashboard + Druckprofil",
            "Abschlusszertifikat",
          ]}
          featured
        >
          {selectedEdition ? (
            <CheckoutRedirectButton
              sku={`CHAL-SINGLE-${selectedEdition.toUpperCase()}`}
              label={`${selectedLabel}-Edition freischalten — €6,99/Jahr`}
              locale="de"
            />
          ) : (
            <div className="kc-price-pick">
              <p>Welche Edition — je €6,99/Jahr?</p>
              <div className="kc-price-pills">
                {EDITIONEN.map((e) => (
                  <button key={e.key} type="button" onClick={() => setSelectedEdition(e.key)}>
                    {e.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </PreisKarte>

        <PreisKarte
          kicker="Komplettpaket"
          price="€24,99"
          sub="/ Jahr · alle fünf Editionen"
          includes={[
            "Alle 5 Challenge-Editionen (eine davon derzeit auf Englisch)",
            "200+ reale Szenarien insgesamt",
            "Unbegrenzte Runden, immer neue Szenarien",
            "Dashboards und Zertifikate für jede Edition",
          ]}
        >
          <CheckoutRedirectButton sku="CHAL-UNLIMITED" label="Alle fünf freischalten — €24,99/Jahr" locale="de" />
        </PreisKarte>

        <PreisKarte
          kicker="Schulen & Unternehmen"
          price="€4,99"
          sub="/ Platz · Jahr"
          includes={[
            "Alle Editionen pro Mitglied, unbegrenzte Runden",
            "Einladung per E-Mail oder einem Link",
            "Admin-Dashboard — Fortschritt pro Person",
            "Preis für größere Gruppen verhandelbar",
          ]}
        >
          <Link className="k-button-quiet" href="/pricing?team=1">Team-Kauf (auf Englisch) →</Link>
        </PreisKarte>
      </section>

      <section className="kg-shell" style={{ paddingBottom: 40 }}>
        <p className="k-copy" style={{ marginBottom: 12, fontSize: 12 }}>
          Die angezeigten Preise gelten in Euro — €6,99 bei uns entspricht genau $6,99. Beim Bezahlvorgang zeigt
          Stripe automatisch deine Landeswährung. Jeder Plan ist ein Jahresabo und wird sofort nach dem Bezahlvorgang
          freigeschaltet; dein Konfydence-Konto speichert Fortschritt und Zugang geräteübergreifend. Konfydence ist ein
          pädagogisches Betrugs-Awareness-Spiel; es garantiert keinen Schutz vor Betrug oder finanziellem Schaden.
        </p>
      </section>
    </PremiumPageDe>
  );
}

export default function GermanPricingPage() {
  return (
    <Suspense fallback={null}>
      <GermanPricingContent />
    </Suspense>
  );
}
