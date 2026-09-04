"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PremiumPage } from "@/components/PremiumSiteChrome";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function RedeemContent() {
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
      setError("Enter the gift code from your email.");
      return;
    }
    if (email && !EMAIL_RE.test(email.trim())) {
      setError("That email address does not look right.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/gift/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim(), email: email.trim() }),
      });
      const data = (await response.json()) as { tier?: string; edition?: string | null; error?: string };
      if (!response.ok) {
        setError(data.error || "We couldn't redeem that code.");
        setLoading(false);
        return;
      }
      setDone({ tier: data.tier || "single", edition: data.edition ?? null });
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  if (done) {
    const what =
      done.tier === "unlimited"
        ? "all five Konfydence Challenges"
        : `the ${done.edition ?? "your"} Konfydence Challenge`;
    return (
      <section className="kg-shell kc-hero is-narrow" style={{ paddingBottom: 48 }}>
        <p className="k-kicker">Gift claimed</p>
        <h1>You&rsquo;re in.</h1>
        <p>You now have access to {what}. It&rsquo;s tied to this browser — start whenever you like.</p>
        <p style={{ marginTop: 24 }}>
          <Link className="k-button" href="/challenge">Start the challenge</Link>
        </p>
      </section>
    );
  }

  return (
    <section className="kg-shell kc-hero is-narrow" style={{ paddingBottom: 48 }}>
      <p className="k-kicker">Redeem a gift</p>
      <h1>Claim your challenge.</h1>
      <p>Enter the code from your email. Adding your email lets you pick up where you left off later.</p>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 20, maxWidth: 460, marginTop: 24 }}>
        <label style={{ display: "grid", gap: 6 }}>
          <span className="k-kicker">Gift code</span>
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
          <span className="k-kicker">Your email (optional)</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            style={inputStyle}
          />
        </label>

        <div>
          <button type="submit" className="k-button" disabled={loading} style={{ minWidth: 180 }}>
            {loading ? "Claiming…" : "Claim gift"}
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

export default function GiftRedeemPage() {
  return (
    <PremiumPage ctaHref="/challenge" ctaLabel="Start a free check">
      <Suspense fallback={null}>
        <RedeemContent />
      </Suspense>
    </PremiumPage>
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
