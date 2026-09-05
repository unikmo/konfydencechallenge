import { createHash, createHmac, randomBytes } from "crypto";

// Unified accounts — pure token/crypto helpers, no DB (docs/UNIFIED_ACCOUNTS_PLAN.md).
// Kept separate from session.ts so it can be unit-tested without a Prisma client.

export const SESSION_COOKIE_NAME = "kf_session";
export const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30; // 30 days
export const SESSION_RENEW_WITHIN_MS = 1000 * 60 * 60 * 24 * 15; // slide when < 15 days remain
export const SESSION_LAST_SEEN_THROTTLE_MS = 1000 * 60 * 60; // touch lastSeenAt at most hourly

/** The value stored in the cookie: a random, high-entropy token. */
export function generateSessionToken(): string {
  return randomBytes(24).toString("base64url");
}

/** The value stored in the DB: a non-reversible hash of the cookie token. */
export function hashSessionToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/** A short, non-reversible IP fingerprint for the "your sessions" list. */
export function hashIp(ip: string | null | undefined): string | null {
  if (!ip) return null;
  const secret = process.env.AUTH_SECRET || process.env.DATABASE_URL || "kf-fallback";
  return createHmac("sha256", secret).update(`ip\0${ip}`).digest("base64url").slice(0, 24);
}

export function sessionCookieOptions(expiresAt: Date) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    expires: expiresAt,
  };
}
