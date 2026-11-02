"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { PremiumPageDe } from "@/components/PremiumSiteChrome";
import { CheckoutRedirectButton } from "@/components/commerce/CheckoutRedirectButton";

const EDITIONEN = [
  { key: "family", label: "Familie" },
  { key: "school", label: "Schule" },
  { key: "university", label: "Universität" },
  { key: "travelsafe", label: "TravelSafe" },
  { key: "workplace", label: "Arbeitsplatz" },
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

function TeamKauf() {
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
        body: JSON.stringify({ sku: "CHAL-TEAM", orgName, seats, locale: "de" }),
      });
      const data = (await res.json()) as { checkoutUrl?: string; error?: string; needsAuth?: boolean };
      if (res.status === 401 && data.needsAuth) {
        router.push(`/account/sign-in?next=${encodeURIComponent("/de/pricing?team=1")}&reason=team-invite&lang=de`);
        return;
      }
      if (!res.ok || !data.checkoutUrl) {
        setError(res.status === 400 ? "Bitte gib einen Namen an und wähle 3 bis 500 Plätze." : "Der Bezahlvorgang konnte nicht gestartet werden.");
        setLoading(false);
        return;
      }
      window.location.assign(data.checkoutUrl);
    } catch {
      setError("Etwas ist schiefgelaufen. Bitte versuch es noch einmal.");
      setLoading(false);
    }
  };

  return (
    <div className="kc-team-buy">
      <label>
        Name des Teams oder der Schule
        <input
          type="text"
          value={orgName}
          onChange={(e) => setOrgName(e.target.value)}
          placeholder="Gymnasium Musterstadt"
          maxLength={120}
        />
      </label>
      <label>
        Plätze (mindestens 3)
        <input
          type="number"
          min={3}
          max={500}
          value={seats}
          onChange={(e) => setSeats(Math.max(3, Math.min(500, Number(e.target.value) || 0)))}
        />
      </label>
      <button type="button" className="k-button" onClick={go} disabled={loading || !orgName.trim() || seats < 3}>
        {loading ? "Bezahlvorgang wird geöffnet …" : `${seats} Plätze kaufen – ${((seats * 499) / 100).toLocaleString("de-DE", { minimumFractionDigits: 2 })} €/Jahr`}
      </button>
      {error ? <p role="alert" style={{ color: "#c0392b", fontSize: 12, marginTop: 6 }}>{error}</p> : null}
      <p style={{ fontSize: 11, opacity: 0.7, marginTop: 6 }}>
        Du meldest dich zuerst an – die kaufende Person wird Team-Admin.
      </p>
    </div>
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
            "Alle 5 Challenge-Editionen, alle auf Deutsch",
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
          <TeamKauf />
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
