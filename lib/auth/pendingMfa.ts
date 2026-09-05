import { createHmac, timingSafeEqual } from "crypto";

// A signed, short-lived marker that an account passed the first factor
// (email code or magic link) and now owes a TOTP code. Signed so a client
// cannot forge a "pending" state for an account it has not authenticated.

export const PENDING_MFA_COOKIE = "kf_2fa";
const TTL_MS = 5 * 60 * 1000;

function secret(): string {
  return process.env.AUTH_SECRET || process.env.DATABASE_URL || "kf-pending-mfa";
}
function sign(payload: string): string {
  return createHmac("sha256", secret()).update(`pending-mfa\0${payload}`).digest("base64url");
}

export function issuePendingMfa(accountId: string): string {
  const payload = `${accountId}.${Date.now() + TTL_MS}`;
  return `${payload}.${sign(payload)}`;
}

export function readPendingMfa(value: string | undefined | null): string | null {
  if (!value) return null;
  const [accountId, expiresRaw, sig] = value.split(".");
  if (!accountId || !expiresRaw || !sig) return null;
  const payload = `${accountId}.${expiresRaw}`;
  const expected = sign(payload);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  if (Number(expiresRaw) < Date.now()) return null;
  return accountId;
}

export function pendingMfaCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: Math.floor(TTL_MS / 1000),
  };
}
