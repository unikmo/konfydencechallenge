import { createHash, createHmac, randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "comasy_org";
const SESSION_SECONDS = 60 * 60 * 12;

function authSecret() {
  const explicitSecret = process.env.AUTH_SECRET;
  if (explicitSecret && explicitSecret.length >= 16) return explicitSecret;

  // Vercel's connected API does not expose environment-variable writes. When
  // AUTH_SECRET is absent, derive a dedicated CoMaSy signing key from the
  // existing server-only database credential using domain separation. The raw
  // DATABASE_URL is never used as an HMAC key or exposed to the browser.
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl || databaseUrl.length < 16) {
    throw new Error("CoMaSy session signing requires AUTH_SECRET or DATABASE_URL");
  }

  return createHash("sha256")
    .update("konfydence:comasy:session:v1\0", "utf8")
    .update(databaseUrl, "utf8")
    .digest("base64url");
}

export function hasUsableCustomerSessionSecret() {
  const explicitSecret = process.env.AUTH_SECRET;
  if (explicitSecret && explicitSecret.length >= 16) return true;
  const databaseUrl = process.env.DATABASE_URL;
  return Boolean(databaseUrl && databaseUrl.length >= 16);
}

function sign(payload: string) {
  return createHmac("sha256", authSecret()).update(payload).digest("base64url");
}

export function hashAccessCode(code: string, salt = randomBytes(16).toString("hex")) {
  const hash = scryptSync(code, salt, 32).toString("hex");
  return { hash, salt };
}

export function verifyAccessCode(code: string, salt: string, expectedHash: string) {
  const actual = Buffer.from(scryptSync(code, salt, 32).toString("hex"), "hex");
  const expected = Buffer.from(expectedHash, "hex");
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export function createOrgSessionValue(organizationId: string) {
  const expires = Math.floor(Date.now() / 1000) + SESSION_SECONDS;
  const payload = `${organizationId}.${expires}`;
  return `${payload}.${sign(payload)}`;
}

export function verifyOrgSessionValue(value: string | undefined | null) {
  if (!value) return null;
  const [organizationId, expiresRaw, signature] = value.split(".");
  if (!organizationId || !expiresRaw || !signature) return null;
  const payload = `${organizationId}.${expiresRaw}`;
  const expected = sign(payload);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  const expires = Number(expiresRaw);
  if (!Number.isFinite(expires) || expires < Math.floor(Date.now() / 1000)) return null;
  return organizationId;
}

export async function getCustomerOrganizationId() {
  const store = await cookies();
  return verifyOrgSessionValue(store.get(COOKIE_NAME)?.value);
}

export function customerSessionCookie(organizationId: string) {
  return {
    name: COOKIE_NAME,
    value: createOrgSessionValue(organizationId),
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/comasy",
      maxAge: SESSION_SECONDS,
    },
  };
}

export const CUSTOMER_COOKIE_NAME = COOKIE_NAME;
