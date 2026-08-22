import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "comasy_org";
const SESSION_SECONDS = 60 * 60 * 12;

function authSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 16) throw new Error("AUTH_SECRET is required for CoMaSy access");
  return secret;
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
