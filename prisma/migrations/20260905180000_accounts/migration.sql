-- Unified accounts — stage 1 (docs/UNIFIED_ACCOUNTS_PLAN.md).
-- Idempotent: bootstrap-comasy-production.cjs re-runs every migration on every
-- deploy, so every statement guards against already existing.

-- CreateTable
CREATE TABLE IF NOT EXISTS "Account" (
  "id"              TEXT NOT NULL,
  "email"           TEXT NOT NULL,
  "emailVerifiedAt" TIMESTAMP(3),
  "createdAt"       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "Account_email_key" ON "Account"("email");

-- CreateTable
CREATE TABLE IF NOT EXISTS "AuthSession" (
  "id"         TEXT NOT NULL,
  "accountId"  TEXT NOT NULL,
  "expiresAt"  TIMESTAMP(3) NOT NULL,
  "createdAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "userAgent"  TEXT,
  "ipHash"     TEXT,
  CONSTRAINT "AuthSession_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "AuthSession_accountId_idx" ON "AuthSession"("accountId");
CREATE INDEX IF NOT EXISTS "AuthSession_expiresAt_idx" ON "AuthSession"("expiresAt");

-- CreateTable
CREATE TABLE IF NOT EXISTS "LoginCode" (
  "id"         TEXT NOT NULL,
  "email"      TEXT NOT NULL,
  "codeHash"   TEXT NOT NULL,
  "expiresAt"  TIMESTAMP(3) NOT NULL,
  "attempts"   INTEGER NOT NULL DEFAULT 0,
  "consumedAt" TIMESTAMP(3),
  "createdAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "LoginCode_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "LoginCode_email_idx" ON "LoginCode"("email");
CREATE INDEX IF NOT EXISTS "LoginCode_expiresAt_idx" ON "LoginCode"("expiresAt");

-- CreateTable
CREATE TABLE IF NOT EXISTS "Passkey" (
  "id"         TEXT NOT NULL,
  "accountId"  TEXT NOT NULL,
  "publicKey"  BYTEA NOT NULL,
  "counter"    INTEGER NOT NULL DEFAULT 0,
  "transports" TEXT,
  "createdAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "lastUsedAt" TIMESTAMP(3),
  CONSTRAINT "Passkey_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "Passkey_accountId_idx" ON "Passkey"("accountId");

-- CreateTable
CREATE TABLE IF NOT EXISTS "TotpCredential" (
  "accountId"   TEXT NOT NULL,
  "secret"      TEXT NOT NULL,
  "confirmedAt" TIMESTAMP(3),
  "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "TotpCredential_pkey" PRIMARY KEY ("accountId")
);

-- AlterTable: link existing rows to accounts (nullable, untouched until claimed)
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "accountId" TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS "User_accountId_key" ON "User"("accountId");

ALTER TABLE "LockscreenTenant" ADD COLUMN IF NOT EXISTS "accountId" TEXT;
CREATE INDEX IF NOT EXISTS "LockscreenTenant_accountId_idx" ON "LockscreenTenant"("accountId");

-- Foreign keys (guarded — ADD CONSTRAINT is not idempotent on its own)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'AuthSession_accountId_fkey') THEN
    ALTER TABLE "AuthSession"
      ADD CONSTRAINT "AuthSession_accountId_fkey"
      FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Passkey_accountId_fkey') THEN
    ALTER TABLE "Passkey"
      ADD CONSTRAINT "Passkey_accountId_fkey"
      FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'TotpCredential_accountId_fkey') THEN
    ALTER TABLE "TotpCredential"
      ADD CONSTRAINT "TotpCredential_accountId_fkey"
      FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'User_accountId_fkey') THEN
    ALTER TABLE "User"
      ADD CONSTRAINT "User_accountId_fkey"
      FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'LockscreenTenant_accountId_fkey') THEN
    ALTER TABLE "LockscreenTenant"
      ADD CONSTRAINT "LockscreenTenant_accountId_fkey"
      FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;
