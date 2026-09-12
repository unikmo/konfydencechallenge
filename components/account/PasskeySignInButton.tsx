"use client";

import { useState } from "react";
import { startAuthentication } from "@simplewebauthn/browser";
import type { UiLang } from "@/lib/challenge/uiStrings";
import { SIGNIN_STRINGS } from "@/lib/challenge/accountStrings";

export function PasskeySignInButton({ next, lang = "en" }: { next?: string; lang?: UiLang }) {
  const [state, setState] = useState<"idle" | "busy" | "error">("idle");
  const t = SIGNIN_STRINGS[lang];

  async function go() {
    setState("busy");
    try {
      const optionsJSON = await fetch("/api/account/passkeys/auth/options", { method: "POST" }).then((r) => r.json());
      const asr = await startAuthentication({ optionsJSON });
      const result = await fetch("/api/account/passkeys/auth/verify", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ response: asr, next }),
      }).then((r) => r.json());
      if (!result?.ok) throw new Error("verify failed");
      window.location.href = result.redirect || "/account";
    } catch {
      setState("error");
    }
  }

  return (
    <div style={{ marginTop: 14 }}>
      <button onClick={go} disabled={state === "busy"} className="kf-link-button" type="button">
        {state === "busy" ? t.passkeyBusy : t.passkeyInstead}
      </button>
      {state === "error" ? (
        <span style={{ color: "#9f2f25", fontSize: 12 }}> — {t.passkeyError}</span>
      ) : null}
    </div>
  );
}
