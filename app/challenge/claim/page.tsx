"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { UiLang } from "@/lib/challenge/uiStrings";
import { CLAIM_STRINGS } from "@/lib/challenge/accountStrings";

const ui = {
  bg: "#f7f4ee",
  ink: "#111417",
  muted: "#66645f",
  gold: "#af8752",
} as const;

type Entitlement = { tier: string; edition: string | null };
const MAX_ATTEMPTS = 12;
const POLL_DELAY_MS = 1500;

function destinationFor(entitlements: Entitlement[], edition: string | null, lang: UiLang): string | null {
  const purchased = entitlements.find(
    (item) => item.tier === "unlimited" || (item.tier === "single" && edition && item.edition === edition)
  );
  if (!purchased) return null;
  const base = lang === "de" ? "/de/challenge" : "/challenge";
  return purchased.tier === "unlimited" ? base : `${base}/${purchased.edition}/start?mode=full`;
}

export default function ClaimPage() {
  return <Suspense fallback={null}><ClaimContent /></Suspense>;
}

function ClaimContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const edition = searchParams.get("edition");
  const checkoutSessionId = searchParams.get("cs");
  const lang: UiLang = searchParams.get("lang") === "de" ? "de" : "en";
  const t = CLAIM_STRINGS[lang];
  const delayedBody = t.delayedBody;

  const [attempt, setAttempt] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    function go(dest: string, email: string | null) {
      setVerified(true);
      setAccount(email);
      timer = setTimeout(() => {
        if (!cancelled) router.replace(dest);
      }, email ? 1600 : 700);
    }

    async function poll(currentAttempt: number) {
      if (cancelled) return;
      setAttempt(currentAttempt);

      try {
        if (checkoutSessionId) {
          // Signs this device in and returns the account's entitlements.
          const res = await fetch("/api/challenge/claim-purchase", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sessionId: checkoutSessionId }),
            cache: "no-store",
          });
          if (res.ok) {
            const data = (await res.json()) as {
              linked?: boolean;
              email?: string;
              entitlements?: Entitlement[];
            };
            const dest = destinationFor(data.entitlements ?? [], edition, lang);
            if (dest) {
              go(dest, data.linked && data.email ? data.email : null);
              return;
            }
          }
        } else {
          const res = await fetch("/api/entitlements/me", { cache: "no-store" });
          if (res.ok) {
            const data = (await res.json()) as { entitlements?: Entitlement[] };
            const dest = destinationFor(data.entitlements ?? [], edition, lang);
            if (dest) {
              go(dest, null);
              return;
            }
          }
        }
      } catch (lookupError) {
        console.error("Purchase verification failed:", lookupError);
      }

      if (currentAttempt >= MAX_ATTEMPTS) {
        setError(delayedBody);
        return;
      }
      timer = setTimeout(() => void poll(currentAttempt + 1), POLL_DELAY_MS);
    }

    void poll(1);
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [edition, checkoutSessionId, router, lang, delayedBody]);

  return (
    <main style={{ minHeight: "100vh", background: ui.bg, color: ui.ink, display: "grid", placeItems: "center", padding: 20, fontFamily: "Inter,ui-sans-serif,system-ui,sans-serif" }}>
      <section style={{ width: "100%", maxWidth: 520, textAlign: "center" }}>
        {error ? (
          <>
            <div style={{ padding: 18, borderRadius: 14, border: "1px solid rgba(239,68,68,.35)", background: "rgba(239,68,68,.1)" }}>
              <h1 style={{ margin: "0 0 8px", fontSize: 22 }}>{t.delayedHeading}</h1>
              <p style={{ margin: 0, color: ui.muted, fontSize: 13, lineHeight: 1.6 }}>{error}</p>
            </div>
            <button type="button" onClick={() => window.location.reload()} style={{ marginTop: 16, padding: "12px 18px", border: 0, borderRadius: 999, background: ui.gold, color: "#fff", fontWeight: 900, cursor: "pointer" }}>{t.retry}</button>
          </>
        ) : verified ? (
          <>
            <div style={{ fontSize: 48, color: ui.gold }}>✓</div>
            <h1 style={{ margin: "12px 0 8px", fontSize: 28 }}>{t.confirmedHeading}</h1>
            {account ? (
              <p style={{ color: ui.muted, fontSize: 14, lineHeight: 1.6 }}>{t.securedTo(account)}</p>
            ) : (
              <p style={{ color: ui.muted }}>{t.openingChallenge}</p>
            )}
          </>
        ) : (
          <>
            <div className="spinner" />
            <h1 style={{ margin: "0 0 12px", fontSize: 28 }}>{t.confirmingHeading}</h1>
            <p style={{ margin: 0, color: ui.muted, fontSize: 14, lineHeight: 1.6 }}>{t.confirmingBody}</p>
            <p style={{ marginTop: 14, color: ui.muted, fontSize: 11 }}>{t.attemptLabel(attempt, MAX_ATTEMPTS)}</p>
          </>
        )}
      </section>
      <style>{`.spinner{width:44px;height:44px;margin:0 auto 24px;border:2px solid rgba(17,20,23,.14);border-top-color:${ui.gold};border-radius:50%;animation:spin .85s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}h1{font-family:var(--k-display,"Iowan Old Style",serif);font-weight:400;letter-spacing:-.03em}`}</style>
    </main>
  );
}
