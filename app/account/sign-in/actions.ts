"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { issueLoginCode, verifyLoginCode } from "@/lib/auth/loginCode";
import { getClientIp } from "@/lib/auth/request";
import { normalizeEmail } from "@/lib/auth/email";
import { createSession, setSessionCookie, hashIp } from "@/lib/auth/session";
import { claimPlayerForAccount } from "@/lib/auth/claim";
import { KF_UID_COOKIE, KF_UID_COOKIE_OPTIONS } from "@/lib/challenge/kfUidCookie";

function safeNext(value: string): string {
  return value.startsWith("/") && !value.startsWith("//") ? value : "/account";
}

function signInUrl(params: Record<string, string | boolean | undefined>): string {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === false) continue;
    sp.set(k, v === true ? "1" : v);
  }
  const qs = sp.toString();
  return `/account/sign-in${qs ? `?${qs}` : ""}`;
}

export async function requestCode(formData: FormData): Promise<void> {
  const email = normalizeEmail(String(formData.get("email") ?? ""));
  const consent = String(formData.get("consent") ?? "");
  const next = safeNext(String(formData.get("next") ?? ""));

  if (consent !== "yes") redirect(signInUrl({ error: "consent", email, next }));

  const ip = getClientIp(await headers());
  const result = await issueLoginCode(email, ip);

  if (!result.ok && result.reason === "invalid_email") {
    redirect(signInUrl({ error: "email", next }));
  }
  if (!result.ok && result.reason === "send_failed") {
    redirect(signInUrl({ error: "send", email, next }));
  }
  // rate_limited is treated as success to avoid revealing whether an address
  // is registered or how often it has asked.
  redirect(signInUrl({ step: "code", email, next, sent: true }));
}

export async function submitCode(formData: FormData): Promise<void> {
  const email = normalizeEmail(String(formData.get("email") ?? ""));
  const code = String(formData.get("code") ?? "").replace(/\s+/g, "");
  const next = safeNext(String(formData.get("next") ?? ""));
  const hdrs = await headers();
  const ip = getClientIp(hdrs);

  const result = await verifyLoginCode(email, code, ip);
  if (!result.ok) {
    const error =
      result.reason === "rate_limited"
        ? "throttled"
        : result.reason === "expired"
          ? "expired"
          : result.reason === "too_many_attempts"
            ? "attempts"
            : "code";
    redirect(signInUrl({ step: "code", email, next, error }));
  }

  const { token, expiresAt } = await createSession(result.account.id, {
    userAgent: hdrs.get("user-agent"),
    ipHash: hashIp(ip),
  });
  await setSessionCookie(token, expiresAt);

  const store = await cookies();
  const canonicalPlayerId = await claimPlayerForAccount(result.account, store.get(KF_UID_COOKIE)?.value ?? null);
  store.set(KF_UID_COOKIE, canonicalPlayerId, KF_UID_COOKIE_OPTIONS);

  redirect(next);
}
