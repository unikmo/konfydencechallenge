import {
  generateSessionToken,
  hashSessionToken,
  hashIp,
  sessionCookieOptions,
} from "../lib/auth/tokens";
import { normalizeEmail, isValidEmail } from "../lib/auth/email";

describe("unified accounts — token helpers", () => {
  it("generates unique high-entropy session tokens", () => {
    const a = generateSessionToken();
    const b = generateSessionToken();
    expect(a).not.toBe(b);
    expect(a.length).toBeGreaterThanOrEqual(30);
    expect(a).toMatch(/^[A-Za-z0-9_-]+$/); // base64url
  });

  it("hashes the session token deterministically and non-reversibly", () => {
    const token = generateSessionToken();
    const h1 = hashSessionToken(token);
    const h2 = hashSessionToken(token);
    expect(h1).toBe(h2);
    expect(h1).not.toBe(token);
    expect(h1).toMatch(/^[0-9a-f]{64}$/); // sha-256 hex
  });

  it("fingerprints an IP deterministically, or returns null", () => {
    const originalSecret = process.env.AUTH_SECRET;
    process.env.AUTH_SECRET = "test-only-secret-at-least-16-chars";
    try {
      expect(hashIp(null)).toBeNull();
      expect(hashIp(undefined)).toBeNull();
      expect(hashIp("")).toBeNull();
      const h = hashIp("203.0.113.7");
      expect(h).toBe(hashIp("203.0.113.7"));
      expect(h).not.toContain("203.0.113.7");
      expect(hashIp("203.0.113.8")).not.toBe(h);
    } finally {
      if (originalSecret === undefined) delete process.env.AUTH_SECRET;
      else process.env.AUTH_SECRET = originalSecret;
    }
  });

  it("builds a hardened session cookie option set", () => {
    const expires = new Date(Date.now() + 1000);
    const opts = sessionCookieOptions(expires);
    expect(opts.httpOnly).toBe(true);
    expect(opts.sameSite).toBe("lax");
    expect(opts.path).toBe("/");
    expect(opts.expires).toBe(expires);
  });
});

describe("unified accounts — email helpers", () => {
  it("normalises email to trimmed lowercase", () => {
    expect(normalizeEmail("  Sam.Doe@Example.COM ")).toBe("sam.doe@example.com");
  });

  it("validates plausible addresses and rejects the rest", () => {
    expect(isValidEmail("a@b.co")).toBe(true);
    expect(isValidEmail("no-at-sign")).toBe(false);
    expect(isValidEmail("two@@at.com")).toBe(false);
    expect(isValidEmail("spaces in@x.com")).toBe(false);
    expect(isValidEmail(`${"x".repeat(250)}@x.com`)).toBe(false);
  });
});
