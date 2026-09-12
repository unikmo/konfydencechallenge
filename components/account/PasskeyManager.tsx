"use client";

import { useState } from "react";
import { startRegistration } from "@simplewebauthn/browser";
import type { UiLang } from "@/lib/challenge/uiStrings";
import { PASSKEY_ADD_STRINGS } from "@/lib/challenge/accountStrings";

export function AddPasskeyButton({ lang = "en" }: { lang?: UiLang }) {
  const [state, setState] = useState<"idle" | "busy" | "error">("idle");
  const t = PASSKEY_ADD_STRINGS[lang];

  async function add() {
    setState("busy");
    try {
      const optionsJSON = await fetch("/api/account/passkeys/register/options", { method: "POST" }).then((r) => r.json());
      if (optionsJSON?.error) throw new Error(optionsJSON.error);
      const attResp = await startRegistration({ optionsJSON });
      const result = await fetch("/api/account/passkeys/register/verify", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(attResp),
      }).then((r) => r.json());
      if (!result?.ok) throw new Error("verify failed");
      window.location.reload();
    } catch {
      setState("error");
    }
  }

  return (
    <div>
      <button onClick={add} disabled={state === "busy"} className="k-button" type="button">
        {state === "busy" ? t.busy : t.label}
      </button>
      {state === "error" ? (
        <p style={{ color: "#9f2f25", fontSize: 13, marginTop: 8 }}>
          {t.error}
        </p>
      ) : null}
    </div>
  );
}
