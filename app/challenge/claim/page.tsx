"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PremiumPage } from "@/components/PremiumSiteChrome";

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
    return () => { cancelled = true; if (timer) clearTimeout(timer); };
  }, [edition, router]);

  return (
    <PremiumPage ctaHref="/challenge" ctaLabel="Challenges">
      <section className="k-shell k-page-hero center" style={{minHeight:"70vh",display:"grid",alignContent:"center"}}>
        {error ? (
          <>
            <p className="k-kicker">Verification delayed</p>
            <h1 className="k-display-sm">Your purchase is safe. Access is taking longer to confirm.</h1>
            <p className="k-lede">{error}</p>
            <div className="k-actions" style={{justifyContent:"center"}}><button type="button" onClick={() => window.location.reload()} className="k-button">Refresh and retry</button></div>
          </>
        ) : verified ? (
          <>
            <p className="k-kicker">Access confirmed</p>
            <h1 className="k-display-sm">You’re in.</h1>
            <p className="k-lede">Opening your challenge…</p>
          </>
        ) : (
          <>
            <div className="spinner" aria-hidden="true" />
            <p className="k-kicker">Confirming access</p>
            <h1 className="k-display-sm">One final check.</h1>
            <p className="k-lede">We’re confirming the purchase and will open your challenge automatically.</p>
            <p className="k-copy" style={{margin:"18px auto 0",fontSize:11}}>Verification attempt {attempt} of {MAX_ATTEMPTS}</p>
          </>
        )}
      </section>
      <style>{`.spinner{width:44px;height:44px;margin:0 auto 26px;border:2px solid #ddd8cf;border-top-color:#9a7a42;border-radius:50%;animation:spin .85s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}@media(prefers-reduced-motion:reduce){.spinner{animation:none}}`}</style>
    </PremiumPage>
  );
}
