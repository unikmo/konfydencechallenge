import { createHash } from "crypto";
import { prisma } from "@/lib/prisma";

// Generic fixed-window rate limiter backed by the RateLimit table.
// Serverless-safe (no shared memory); a fixed window is enough for the
// login-code and verify-attempt guards.

export function rateLimitKey(raw: string): string {
  return createHash("sha256").update(raw).digest("base64url").slice(0, 32);
}

export type RateLimitResult = { ok: boolean; remaining: number; retryAfterMs: number };

export async function consumeRateLimit(opts: {
  scope: string;
  key: string;
  limit: number;
  windowMs: number;
}): Promise<RateLimitResult> {
  const now = Date.now();
  const where = { scope_key: { scope: opts.scope, key: opts.key } };
  const row = await prisma.rateLimit.findUnique({ where });

  if (!row || now - row.windowStartedAt.getTime() >= opts.windowMs) {
    await prisma.rateLimit.upsert({
      where,
      create: { scope: opts.scope, key: opts.key, count: 1, windowStartedAt: new Date(now) },
      update: { count: 1, windowStartedAt: new Date(now) },
    });
    return { ok: true, remaining: Math.max(0, opts.limit - 1), retryAfterMs: 0 };
  }

  if (row.count >= opts.limit) {
    return { ok: false, remaining: 0, retryAfterMs: opts.windowMs - (now - row.windowStartedAt.getTime()) };
  }

  await prisma.rateLimit.update({ where, data: { count: { increment: 1 } } });
  return { ok: true, remaining: Math.max(0, opts.limit - row.count - 1), retryAfterMs: 0 };
}

/** Best-effort cleanup of stale counters; safe to call from a cron. */
export async function pruneRateLimits(olderThanMs = 25 * 60 * 60 * 1000): Promise<number> {
  const { count } = await prisma.rateLimit.deleteMany({
    where: { windowStartedAt: { lt: new Date(Date.now() - olderThanMs) } },
  });
  return count;
}
