-- Unified accounts — stage 6: TOTP recovery codes. Idempotent.
ALTER TABLE "TotpCredential"
  ADD COLUMN IF NOT EXISTS "recoveryCodeHashes" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
