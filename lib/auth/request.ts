// Best-effort client IP from proxy headers (Vercel sets x-forwarded-for).
// Used only for rate-limit fingerprinting, never stored in the clear.
export function getClientIp(headers: Headers): string | null {
  const fwd = headers.get("x-forwarded-for");
  if (fwd) {
    const first = fwd.split(",")[0]?.trim();
    if (first) return first;
  }
  return headers.get("x-real-ip")?.trim() || null;
}
