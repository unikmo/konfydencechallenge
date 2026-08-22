import { createOrgSessionValue, hashAccessCode, verifyAccessCode, verifyOrgSessionValue } from "../lib/comasyAuth";

describe("CoMaSy tenant authentication", () => {
  beforeAll(() => {
    process.env.AUTH_SECRET = "test-only-comasy-auth-secret-32chars";
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

  it("signs the organisation id and rejects tampering", () => {
    const value = createOrgSessionValue("org-alpha");
    expect(verifyOrgSessionValue(value)).toBe("org-alpha");
    const tampered = value.replace("org-alpha", "org-beta");
    expect(verifyOrgSessionValue(tampered)).toBeNull();
  });
});
