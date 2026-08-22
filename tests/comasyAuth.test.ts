import { createOrgSessionValue, hashAccessCode, verifyAccessCode, verifyOrgSessionValue } from "../lib/comasyAuth";

describe("CoMaSy tenant authentication", () => {
  const originalAuthSecret = process.env.AUTH_SECRET;
  const originalDatabaseUrl = process.env.DATABASE_URL;

  afterEach(() => {
    if (originalAuthSecret === undefined) delete process.env.AUTH_SECRET;
    else process.env.AUTH_SECRET = originalAuthSecret;

    if (originalDatabaseUrl === undefined) delete process.env.DATABASE_URL;
    else process.env.DATABASE_URL = originalDatabaseUrl;
  });

  it("hashes access codes with a unique salt and verifies without storing plaintext", () => {
    const first = hashAccessCode("PilotAccess2026!");
    const second = hashAccessCode("PilotAccess2026!");
    expect(first.hash).not.toBe("PilotAccess2026!");
    expect(first.salt).not.toBe(second.salt);
    expect(first.hash).not.toBe(second.hash);
    expect(verifyAccessCode("PilotAccess2026!", first.salt, first.hash)).toBe(true);
    expect(verifyAccessCode("wrong-code", first.salt, first.hash)).toBe(false);
  });

  it("signs the organisation id with AUTH_SECRET and rejects tampering", () => {
    process.env.AUTH_SECRET = "test-only-comasy-auth-secret-32chars";
    const value = createOrgSessionValue("org-alpha");
    expect(verifyOrgSessionValue(value)).toBe("org-alpha");
    const tampered = value.replace("org-alpha", "org-beta");
    expect(verifyOrgSessionValue(tampered)).toBeNull();
  });

  it("derives a stable server-only signing key from DATABASE_URL when AUTH_SECRET is absent", () => {
    delete process.env.AUTH_SECRET;
    process.env.DATABASE_URL = "postgresql://runtime-user:high-entropy-password@example.invalid:5432/konfydence";

    const value = createOrgSessionValue("org-fallback");
    expect(verifyOrgSessionValue(value)).toBe("org-fallback");

    process.env.DATABASE_URL = "postgresql://runtime-user:different-password@example.invalid:5432/konfydence";
    expect(verifyOrgSessionValue(value)).toBeNull();
  });
});
