import { encryptSecret, decryptSecret } from "../lib/auth/secretCrypto";
import { issuePendingMfa, readPendingMfa } from "../lib/auth/pendingMfa";

describe("unified accounts — secret crypto", () => {
  const orig = process.env.AUTH_SECRET;
  beforeAll(() => { process.env.AUTH_SECRET = "test-only-secret-crypto-key-32chars"; });
  afterAll(() => { if (orig === undefined) delete process.env.AUTH_SECRET; else process.env.AUTH_SECRET = orig; });

  it("round-trips a secret and rejects tampering", () => {
    const blob = encryptSecret("JBSWY3DPEHPK3PXP");
    expect(blob).not.toContain("JBSWY3DPEHPK3PXP");
    expect(decryptSecret(blob)).toBe("JBSWY3DPEHPK3PXP");

    const parts = blob.split(".");
    parts[2] = parts[2].slice(0, -2) + "aa";
    expect(decryptSecret(parts.join("."))).toBeNull();
    expect(decryptSecret("not-a-blob")).toBeNull();
  });
});

describe("unified accounts — pending-MFA marker", () => {
  const orig = process.env.AUTH_SECRET;
  beforeAll(() => { process.env.AUTH_SECRET = "test-only-pending-mfa-key-32chars!"; });
  afterAll(() => { if (orig === undefined) delete process.env.AUTH_SECRET; else process.env.AUTH_SECRET = orig; });

  it("signs an account id and rejects forgery / expiry", () => {
    const value = issuePendingMfa("acc_123");
    expect(readPendingMfa(value)).toBe("acc_123");

    expect(readPendingMfa(value.replace("acc_123", "acc_999"))).toBeNull();
    expect(readPendingMfa("acc_123.1.deadbeef")).toBeNull();
    expect(readPendingMfa(undefined)).toBeNull();

    const [id, , sig] = value.split(".");
    expect(readPendingMfa(`${id}.1.${sig}`)).toBeNull(); // expired
  });
});
