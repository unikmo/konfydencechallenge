// Best-effort, in-memory, single-instance rate limiter.
//
// Honest limitation: on Vercel's serverless platform this Map lives only for
// the lifetime of one warm function instance — it resets on cold start and
// isn't shared across concurrent instances, so it will NOT stop a determined
// or distributed attacker. What it does stop, at zero added infrastructure
// cost, is the common case: a script or bot hammering one endpoint from one
// process/IP. If abuse becomes a real problem, the correct fix is Vercel's
// Firewall/WAF (Pro+ plan) or a shared store like Upstash Redis
// (@upstash/ratelimit) — this is a stopgap, not a replacement for those.
type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

// Cheap periodic cleanup so the Map doesn't grow unbounded across the life of
// a long-lived warm instance. Runs at most once every CLEANUP_INTERVAL calls.
let callsSinceCleanup = 0;
const CLEANUP_INTERVAL = 200;

function cleanup(now: number) {
  callsSinceCleanup += 1;
  if (callsSinceCleanup < CLEANUP_INTERVAL) return;
  callsSinceCleanup = 0;
  for (const [key, bucket] of buckets) {
    if (now > bucket.resetAt) buckets.delete(key);
  }
}

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  cleanup(now);

  const bucket = buckets.get(key);

  if (!bucket || now > bucket.resetAt) {
    const resetAt = now + windowMs;
    buckets.set(key, { count: 1, resetAt });
    return { allowed: true, remaining: limit - 1, resetAt };
  }

  if (bucket.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: bucket.resetAt };
  }

  bucket.count += 1;
  return { allowed: true, remaining: limit - bucket.count, resetAt: bucket.resetAt };
}

// Vercel sets x-forwarded-for on incoming requests; falls back to "unknown"
// (which just means all such requests share one bucket) if it's ever absent.
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return "unknown";
}
