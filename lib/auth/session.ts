import { cookies } from "next/headers";
import type { Account } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  SESSION_COOKIE_NAME,
  SESSION_TTL_MS,
  SESSION_RENEW_WITHIN_MS,
  SESSION_LAST_SEEN_THROTTLE_MS,
  generateSessionToken,
  hashSessionToken,
  sessionCookieOptions,
} from "./tokens";

// Unified accounts — session core (docs/UNIFIED_ACCOUNTS_PLAN.md, stage 1).
//
// DB-backed, revocable sessions. The cookie holds a random token; the DB row
// is keyed by SHA-256(token), so the raw token is never stored. No signing
// key is needed — validity is a DB lookup, not a signature check.
//
// Nothing wires these helpers up yet; that is stage 2 (sign-in) and stage 3
// (middleware for cookie-side sliding expiry).

export {
  SESSION_COOKIE_NAME,
  generateSessionToken,
  hashSessionToken,
  hashIp,
  sessionCookieOptions,
} from "./tokens";

export type CreatedSession = { token: string; sessionId: string; expiresAt: Date };

export async function createSession(
  accountId: string,
  meta?: { userAgent?: string | null; ipHash?: string | null },
): Promise<CreatedSession> {
  const token = generateSessionToken();
  const sessionId = hashSessionToken(token);
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
  await prisma.authSession.create({
    data: {
      id: sessionId,
      accountId,
      expiresAt,
      userAgent: meta?.userAgent?.slice(0, 400) ?? null,
      ipHash: meta?.ipHash ?? null,
    },
  });
  return { token, sessionId, expiresAt };
}

export type SessionValidation =
  | { account: Account; sessionId: string; expiresAt: Date }
  | { account: null; sessionId: null; expiresAt: null };

export async function validateSessionToken(token: string): Promise<SessionValidation> {
  const sessionId = hashSessionToken(token);
  const row = await prisma.authSession.findUnique({
    where: { id: sessionId },
    include: { account: true },
  });
  if (!row) return { account: null, sessionId: null, expiresAt: null };

  const now = Date.now();
  if (row.expiresAt.getTime() <= now) {
    await prisma.authSession.delete({ where: { id: sessionId } }).catch(() => {});
    return { account: null, sessionId: null, expiresAt: null };
  }

  let expiresAt = row.expiresAt;
  if (row.expiresAt.getTime() - now < SESSION_RENEW_WITHIN_MS) {
    expiresAt = new Date(now + SESSION_TTL_MS);
    await prisma.authSession
      .update({ where: { id: sessionId }, data: { expiresAt, lastSeenAt: new Date() } })
      .catch(() => {});
  } else if (now - row.lastSeenAt.getTime() > SESSION_LAST_SEEN_THROTTLE_MS) {
    await prisma.authSession
      .update({ where: { id: sessionId }, data: { lastSeenAt: new Date() } })
      .catch(() => {});
  }

  return { account: row.account, sessionId, expiresAt };
}

export async function invalidateSession(sessionId: string): Promise<void> {
  await prisma.authSession.deleteMany({ where: { id: sessionId } });
}

export async function invalidateAllSessions(accountId: string): Promise<void> {
  await prisma.authSession.deleteMany({ where: { accountId } });
}

/** Delete every session for the account except the one making the request. */
export async function invalidateOtherSessions(accountId: string, keepSessionId: string): Promise<void> {
  await prisma.authSession.deleteMany({ where: { accountId, id: { not: keepSessionId } } });
}

/** Drop sessions that have already expired. Safe to call from a cron. */
export async function pruneExpiredSessions(): Promise<number> {
  const { count } = await prisma.authSession.deleteMany({ where: { expiresAt: { lte: new Date() } } });
  return count;
}

// --- cookie helpers (route handlers / server actions only) ------------------

export async function setSessionCookie(token: string, expiresAt: Date): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE_NAME, token, sessionCookieOptions(expiresAt));
}

export async function clearSessionCookie(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE_NAME);
}

export async function getSessionTokenFromCookie(): Promise<string | null> {
  const store = await cookies();
  return store.get(SESSION_COOKIE_NAME)?.value ?? null;
}

// --- read helpers (safe anywhere on the server) ----------------------------

/** The current signed-in account, or null. */
export async function getAccount(): Promise<Account | null> {
  const token = await getSessionTokenFromCookie();
  if (!token) return null;
  const { account } = await validateSessionToken(token);
  return account;
}

/** The current session (account + id + expiry), or null. */
export async function getSession(): Promise<{ account: Account; sessionId: string; expiresAt: Date } | null> {
  const token = await getSessionTokenFromCookie();
  if (!token) return null;
  const result = await validateSessionToken(token);
  if (!result.account) return null;
  return { account: result.account, sessionId: result.sessionId, expiresAt: result.expiresAt };
}
