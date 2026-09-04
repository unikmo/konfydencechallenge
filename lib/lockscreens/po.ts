import { randomBytes } from "crypto";

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I

const TIER_PREFIX: Record<string, string> = { workplace: "WRK", school: "SCH" };

/** e.g. "KFY-PO-WRK-20260904-8FQ2K7" */
export function generatePoNumber(tier?: string, date: Date = new Date()): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  const bytes = randomBytes(6);
  const suffix = Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join("");
  const prefix = tier && TIER_PREFIX[tier] ? `${TIER_PREFIX[tier]}-` : "";
  return `KFY-PO-${prefix}${y}${m}${d}-${suffix}`;
}

/** Opaque per-tenant token for the /l/{token}/current/{device} delivery resolver. */
export function generateTenantToken(): string {
  return randomBytes(24).toString("base64url");
}

/** Opaque, separate link for the self-serve admin (/lockscreens/workplace/admin/{token}). */
export function generateAdminToken(): string {
  return randomBytes(24).toString("base64url");
}

/** Default sequence: the first N asset numbers in order, 1-based. */
export function defaultSequence(screenCount: number): number[] {
  return Array.from({ length: screenCount }, (_, i) => i + 1);
}
