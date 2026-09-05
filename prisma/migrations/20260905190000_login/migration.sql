-- Unified accounts — stage 2: login-code issuance/verification support.
-- Idempotent (bootstrap re-runs every migration on every deploy).

-- LoginCode: magic-link token + IP fingerprint alongside the 6-digit code.
ALTER TABLE "LoginCode" ADD COLUMN IF NOT EXISTS "linkTokenHash" TEXT;
ALTER TABLE "LoginCode" ADD COLUMN IF NOT EXISTS "ipHash" TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS "LoginCode_linkTokenHash_key" ON "LoginCode"("linkTokenHash");

-- Generic fixed-window rate-limit counter.
CREATE TABLE IF NOT EXISTS "RateLimit" (
  "scope"           TEXT NOT NULL,
  "key"             TEXT NOT NULL,
  "count"           INTEGER NOT NULL DEFAULT 0,
  "windowStartedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "RateLimit_pkey" PRIMARY KEY ("scope", "key")
);
CREATE INDEX IF NOT EXISTS "RateLimit_windowStartedAt_idx" ON "RateLimit"("windowStartedAt");

-- The results email is sent once per completed session.
ALTER TABLE "ChallengeSession" ADD COLUMN IF NOT EXISTS "resultEmailedAt" TIMESTAMP(3);

-- Suppress non-essential email.
ALTER TABLE "Account" ADD COLUMN IF NOT EXISTS "emailOptOut" BOOLEAN NOT NULL DEFAULT false;
