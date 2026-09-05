"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { issueLoginCode, verifyLoginCode } from "@/lib/auth/loginCode";
import { getClientIp } from "@/lib/auth/request";
import { normalizeEmail } from "@/lib/auth/account";
import { finishSignInAction } from "@/lib/auth/finishSignIn";
import { accountHasTotp, verifyTotpForAccount } from "@/lib/auth/totp";
import { issuePendingMfa, readPendingMfa, pendingMfaCookieOptions, PENDING_MFA_COOKIE } from "@/lib/auth/pendingMfa";

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

  if (!result.ok && result.reason === "invalid_email") redirect(signInUrl({ error: "email", next }));
  if (!result.ok && result.reason === "send_failed") redirect(signInUrl({ error: "send", email, next }));
  redirect(signInUrl({ step: "code", email, next, sent: true }));
}

export async function submitCode(formData: FormData): Promise<void> {
  const email = normalizeEmail(String(formData.get("email") ?? ""));
  const code = String(formData.get("code") ?? "").replace(/\s+/g, "");
  const next = safeNext(String(formData.get("next") ?? ""));
  const ip = getClientIp(await headers());

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

  if (await accountHasTotp(result.account.id)) {
    const store = await cookies();
    store.set(PENDING_MFA_COOKIE, issuePendingMfa(result.account.id), pendingMfaCookieOptions());
    redirect(signInUrl({ step: "totp", next }));
  }

  await finishSignInAction(result.account);
  redirect(next);
}

export async function submitTotp(formData: FormData): Promise<void> {
  const code = String(formData.get("code") ?? "").trim();
  const next = safeNext(String(formData.get("next") ?? ""));
  const store = await cookies();
  const accountId = readPendingMfa(store.get(PENDING_MFA_COOKIE)?.value);
  if (!accountId) redirect(signInUrl({ error: "expired", next }));

  if (!(await verifyTotpForAccount(accountId, code))) {
    redirect(signInUrl({ step: "totp", next, error: "totp" }));
  }

  const { prisma } = await import("@/lib/prisma");
  const account = await prisma.account.findUnique({ where: { id: accountId } });
  if (!account) redirect(signInUrl({ error: "expired", next }));

  store.delete(PENDING_MFA_COOKIE);
  await finishSignInAction(account);
  redirect(next);
}
