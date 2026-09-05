import { createHash, randomBytes, randomInt, timingSafeEqual } from "crypto";
import type { Account } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { sendTransactionalEmail } from "@/lib/email";
import { normalizeEmail, isValidEmail } from "./email";
import { findOrCreateAccount, markEmailVerified } from "./account";
import { consumeRateLimit, rateLimitKey } from "./rateLimit";
import { renderLoginCodeEmail } from "./loginEmail";

// Passwordless sign-in: a 6-digit code (10-minute TTL, single use, 5-attempt
// cap) plus a magic link carrying a high-entropy token. Either path consumes
// the same LoginCode row.

const CODE_TTL_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://konfydence.com";

function pepper(): string {
  return process.env.AUTH_SECRET || process.env.DATABASE_URL || "kf-fallback-pepper";
}
function hashCode(email: string, code: string): string {
  return createHash("sha256").update(`${pepper()}\0code\0${email}\0${code}`).digest("hex");
}
function hashLinkToken(token: string): string {
  return createHash("sha256").update(`${pepper()}\0link\0${token}`).digest("hex");
}
function generateCode(): string {
  return String(randomInt(0, 1_000_000)).padStart(6, "0");
}

export type IssueResult =
  | { ok: true }
  | { ok: false; reason: "invalid_email" | "rate_limited" | "send_failed"; retryAfterMs?: number };

export async function issueLoginCode(rawEmail: string, ip: string | null): Promise<IssueResult> {
  const email = normalizeEmail(rawEmail);
  if (!isValidEmail(email)) return { ok: false, reason: "invalid_email" };

  const emailKey = rateLimitKey(`email\0${email}`);
  const burst = await consumeRateLimit({ scope: "login_code_email", key: emailKey, limit: 4, windowMs: 15 * 60 * 1000 });
  if (!burst.ok) return { ok: false, reason: "rate_limited", retryAfterMs: burst.retryAfterMs };
  const daily = await consumeRateLimit({ scope: "login_code_email_day", key: emailKey, limit: 12, windowMs: 24 * 60 * 60 * 1000 });
  if (!daily.ok) return { ok: false, reason: "rate_limited", retryAfterMs: daily.retryAfterMs };
  if (ip) {
    const perIp = await consumeRateLimit({
      scope: "login_code_ip",
      key: rateLimitKey(`ip\0${ip}`),
      limit: 20,
      windowMs: 60 * 60 * 1000,
    });
    if (!perIp.ok) return { ok: false, reason: "rate_limited", retryAfterMs: perIp.retryAfterMs };
  }

  const code = generateCode();
  const linkToken = randomBytes(24).toString("base64url");
  await prisma.loginCode.create({
    data: {
      email,
      codeHash: hashCode(email, code),
      linkTokenHash: hashLinkToken(linkToken),
      ipHash: ip ? rateLimitKey(`ip\0${ip}`) : null,
      expiresAt: new Date(Date.now() + CODE_TTL_MS),
    },
  });

  const { subject, html } = renderLoginCodeEmail({
    code,
    magicLinkUrl: `${APP_URL}/account/sign-in/link?token=${encodeURIComponent(linkToken)}`,
  });
  const sent = await sendTransactionalEmail({ to: email, subject, html, tags: ["account", "login-code"] });
  if (!sent) return { ok: false, reason: "send_failed" };
  return { ok: true };
}

export type VerifyResult =
  | { ok: true; account: Account }
  | { ok: false; reason: "invalid" | "expired" | "too_many_attempts" | "rate_limited" };

async function completeLogin(email: string): Promise<Account> {
  const account = await findOrCreateAccount(email);
  return markEmailVerified(account.id);
}

export async function verifyLoginCode(rawEmail: string, code: string, ip: string | null): Promise<VerifyResult> {
  const email = normalizeEmail(rawEmail);
  const attemptKey = ip ? rateLimitKey(`verify\0${email}\0${ip}`) : rateLimitKey(`verify\0${email}`);
  const guard = await consumeRateLimit({ scope: "login_verify", key: attemptKey, limit: 15, windowMs: 15 * 60 * 1000 });
  if (!guard.ok) return { ok: false, reason: "rate_limited" };

  const row = await prisma.loginCode.findFirst({
    where: { email, consumedAt: null },
    orderBy: { createdAt: "desc" },
  });
  if (!row) return { ok: false, reason: "invalid" };
  if (row.expiresAt.getTime() <= Date.now()) return { ok: false, reason: "expired" };
  if (row.attempts >= MAX_ATTEMPTS) return { ok: false, reason: "too_many_attempts" };

  const expected = Buffer.from(row.codeHash, "hex");
  const actual = Buffer.from(hashCode(email, code.trim()), "hex");
  const match = expected.length === actual.length && timingSafeEqual(expected, actual);
  if (!match) {
    await prisma.loginCode.update({ where: { id: row.id }, data: { attempts: { increment: 1 } } });
    return { ok: false, reason: "invalid" };
  }

  await prisma.loginCode.update({ where: { id: row.id }, data: { consumedAt: new Date() } });
  return { ok: true, account: await completeLogin(email) };
}

export async function verifyLoginLink(token: string): Promise<VerifyResult> {
  if (!token) return { ok: false, reason: "invalid" };
  const row = await prisma.loginCode.findUnique({ where: { linkTokenHash: hashLinkToken(token) } });
  if (!row || row.consumedAt) return { ok: false, reason: "invalid" };
  if (row.expiresAt.getTime() <= Date.now()) return { ok: false, reason: "expired" };
  await prisma.loginCode.update({ where: { id: row.id }, data: { consumedAt: new Date() } });
  return { ok: true, account: await completeLogin(row.email) };
}
