"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PremiumPageDe } from "@/components/PremiumSiteChrome";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EDITION_LABEL: Record<string, string> = {
  family: "Familie",
  school: "Schule",
  university: "Universität",
  workplace: "Arbeitsplatz",
  travelsafe: "TravelSafe",
};

function EinloesenContent() {
  const searchParams = useSearchParams();
  const [code, setCode] = useState((searchParams.get("code") || "").toUpperCase());
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<{ tier: string; edition: string | null } | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    if (!code.trim()) {
      setError("Bitte gib den Code aus deiner E-Mail ein.");
      return;
    }
    if (email && !EMAIL_RE.test(email.trim())) {
      setError("Diese E-Mail-Adresse sieht nicht richtig aus.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/gift/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim(), email: email.trim() }),
      });
      const data = (await response.json()) as { tier?: string; edition?: string | null };
      if (!response.ok) {
        setError("Diesen Code konnten wir nicht einlösen. Bitte prüfe ihn und versuch es noch einmal.");
        setLoading(false);
        return;
      }
      setDone({ tier: data.tier || "single", edition: data.edition ?? null });
    } catch {
      setError("Das hat leider nicht geklappt. Bitte versuch es noch einmal.");
      setLoading(false);
    }
  };

  if (done) {
    const what =
      done.tier === "unlimited"
        ? "alle fünf Konfydence-Challenges"
        : `die Konfydence-Challenge ${EDITION_LABEL[done.edition ?? ""] ?? ""}`.trim();
    return (
      <section className="kg-shell kc-hero is-narrow" style={{ paddingBottom: 48 }}>
        <p className="k-kicker">Geschenk eingelöst</p>
        <h1>Du bist dabei.</h1>
        <p>Du hast jetzt Zugriff auf {what}. Der Zugang gilt für diesen Browser – leg los, wann du möchtest.</p>
        <p style={{ marginTop: 24 }}>
          <Link className="k-button" href="/de/challenge">Challenge starten</Link>
        </p>
      </section>
    );
  }

  return (
    <section className="kg-shell kc-hero is-narrow" style={{ paddingBottom: 48 }}>
      <p className="k-kicker">Geschenk einlösen</p>
      <h1>Hol dir deine Challenge.</h1>
      <p>Gib den Code aus deiner E-Mail ein. Mit deiner E-Mail-Adresse kannst du später dort weitermachen, wo du aufgehört hast.</p>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 20, maxWidth: 460, marginTop: 24 }}>
        <label style={{ display: "grid", gap: 6 }}>
          <span className="k-kicker">Geschenk-Code</span>
          <input
            type="text"
            required
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="KFY-XXXX-XXXX"
            style={inputStyle}
          />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <span className="k-kicker">Deine E-Mail-Adresse (optional)</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="du@beispiel.de"
            style={inputStyle}
          />
        </label>

        <div>
          <button type="submit" className="k-button" disabled={loading} style={{ minWidth: 180 }}>
            {loading ? "Wird eingelöst …" : "Geschenk einlösen"}
          </button>
          {error ? (
            <p role="alert" style={{ color: "#b4552f", fontSize: 13, marginTop: 10 }}>
              {error}
            </p>
          ) : null}
        </div>
      </form>
    </section>
  );
}

export default function GeschenkEinloesenPage() {
  return (
    <PremiumPageDe ctaHref="/de/challenge" ctaLabel="Kostenlosen Check starten">
      <Suspense fallback={null}>
        <EinloesenContent />
      </Suspense>
    </PremiumPageDe>
  );
}

const inputStyle: React.CSSProperties = {
  padding: "11px 14px",
  borderRadius: 10,
  border: "1px solid rgba(17,20,23,.22)",
  background: "#fffdf9",
  fontSize: 15,
  color: "#111417",
  fontFamily: "inherit",
};
