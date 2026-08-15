"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { tokens } from "@/lib/theme/tokens";

type Entitlement = { tier: "single" | "unlimited"; edition: string | null };
const MAX_ATTEMPTS = 10;
const POLL_DELAY_MS = 1500;

export default function ClaimPage() {
  return <Suspense fallback={null}><ClaimContent /></Suspense>;
}

function ClaimContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const edition = searchParams.get("edition");
  const [attempt, setAttempt] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    async function poll(currentAttempt: number) {
      if (cancelled) return;
      setAttempt(currentAttempt);

      try {
        const response = await fetch("/api/entitlements/me", { cache: "no-store" });
        if (!response.ok) throw new Error("Entitlement lookup failed");
        const data = (await response.json()) as { entitlements?: Entitlement[] };
        const purchased = (data.entitlements ?? []).find(
          (item) => item.tier === "unlimited" || (item.tier === "single" && edition && item.edition === edition)
        );

        if (purchased) {
          setVerified(true);
          timer = setTimeout(() => {
            if (cancelled) return;
            router.replace(purchased.tier === "unlimited" ? "/challenge" : `/challenge/${purchased.edition}/start?mode=full`);
          }, 700);
          return;
        }
      } catch (lookupError) {
        console.error("Entitlement verification failed:", lookupError);
      }

      if (currentAttempt >= MAX_ATTEMPTS) {
        setError("Purchase verification is taking longer than expected. Refresh this page or contact support if access still does not appear.");
        return;
      }
      timer = setTimeout(() => void poll(currentAttempt + 1), POLL_DELAY_MS);
    }

    void poll(1);
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [edition, router]);

  return (
    <main style={{ minHeight: "100vh", background: tokens.bgCanvas, color: tokens.textOnDark, display: "grid", placeItems: "center", padding: 20, fontFamily: "Inter,ui-sans-serif,system-ui,sans-serif" }}>
      <section style={{ width: "100%", maxWidth: 520, textAlign: "center" }}>
        {error ? (
          <>
            <div style={{ padding: 18, borderRadius: 14, border: "1px solid rgba(239,68,68,.35)", background: "rgba(239,68,68,.1)" }}>
              <h1 style={{ margin: "0 0 8px", fontSize: 22 }}>Purchase verification delayed</h1>
              <p style={{ margin: 0, color: tokens.textMuted, fontSize: 13, lineHeight: 1.6 }}>{error}</p>
            </div>
            <button type="button" onClick={() => window.location.reload()} style={{ marginTop: 16, padding: "12px 18px", border: 0, borderRadius: 999, background: tokens.accentAmber, color: tokens.textOnLight, fontWeight: 900, cursor: "pointer" }}>Refresh and retry</button>
          </>
        ) : verified ? (
          <>
            <div style={{ fontSize: 48, color: tokens.accentAmber }}>✓</div>
            <h1 style={{ margin: "12px 0", fontSize: 28 }}>Access confirmed.</h1>
            <p style={{ color: tokens.textMuted }}>Opening your challenge…</p>
          </>
        ) : (
          <>
            <div className="spinner" />
            <h1 style={{ margin: "0 0 12px", fontSize: 28 }}>Confirming your access</h1>
            <p style={{ margin: 0, color: tokens.textMuted, fontSize: 14, lineHeight: 1.6 }}>Shopify is confirming the purchase. Keep this page open; access normally appears within a few seconds.</p>
            <p style={{ marginTop: 14, color: tokens.textMuted, fontSize: 11 }}>Verification attempt {attempt} of {MAX_ATTEMPTS}</p>
          </>
        )}
      </section>
      <style>{`.spinner{width:48px;height:48px;margin:0 auto 24px;border:3px solid rgba(255,255,255,.12);border-top-color:${tokens.accentAmber};border-radius:50%;animation:spin .85s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </main>
  );
}
