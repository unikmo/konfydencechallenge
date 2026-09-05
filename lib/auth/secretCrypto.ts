import { createCipheriv, createDecipheriv, createHash, randomBytes } from "crypto";

// AES-256-GCM for secrets at rest (the TOTP shared secret). Key is derived
// from AUTH_SECRET (or DATABASE_URL, domain-separated) the same way the rest
// of the auth code derives keys — no new env var required.

function key(): Buffer {
  const base = process.env.AUTH_SECRET || process.env.DATABASE_URL || "kf-fallback-secret-crypto";
  return createHash("sha256").update(`konfydence:secret-crypto:v1\0${base}`).digest();
}

export function encryptSecret(plaintext: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(), iv);
  const enc = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString("base64url")}.${tag.toString("base64url")}.${enc.toString("base64url")}`;
}

export function decryptSecret(blob: string): string | null {
  try {
    const [ivB, tagB, encB] = blob.split(".");
    if (!ivB || !tagB || !encB) return null;
    const decipher = createDecipheriv("aes-256-gcm", key(), Buffer.from(ivB, "base64url"));
    decipher.setAuthTag(Buffer.from(tagB, "base64url"));
    return Buffer.concat([decipher.update(Buffer.from(encB, "base64url")), decipher.final()]).toString("utf8");
  } catch {
    return null;
  }
}
