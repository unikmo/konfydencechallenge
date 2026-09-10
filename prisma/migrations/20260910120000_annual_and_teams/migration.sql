-- Annual entitlements + Challenge Teams foundation. Idempotent.

ALTER TABLE "Entitlement" ADD COLUMN IF NOT EXISTS "expiresAt" TIMESTAMP(3);
ALTER TABLE "Entitlement" ADD COLUMN IF NOT EXISTS "stripeSubscriptionId" TEXT;
ALTER TABLE "Entitlement" ADD COLUMN IF NOT EXISTS "orgId" TEXT;
CREATE INDEX IF NOT EXISTS "Entitlement_stripeSubscriptionId_idx" ON "Entitlement" ("stripeSubscriptionId");
CREATE INDEX IF NOT EXISTS "Entitlement_orgId_idx" ON "Entitlement" ("orgId");

CREATE TABLE IF NOT EXISTS "Org" (
  "id"                   TEXT NOT NULL,
  "name"                 TEXT NOT NULL,
  "ownerAccountId"       TEXT NOT NULL,
  "seatCount"            INTEGER NOT NULL DEFAULT 0,
  "stripeCustomerId"     TEXT,
  "stripeSubscriptionId" TEXT,
  "termEnd"              TIMESTAMP(3),
  "status"              TEXT NOT NULL DEFAULT 'active',
  "overrideSeatPrice"   INTEGER,
  "overrideReason"      TEXT,
  "inviteCode"          TEXT NOT NULL,
  "createdAt"           TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"           TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Org_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "Org_stripeSubscriptionId_key" ON "Org" ("stripeSubscriptionId");
CREATE UNIQUE INDEX IF NOT EXISTS "Org_inviteCode_key" ON "Org" ("inviteCode");
CREATE INDEX IF NOT EXISTS "Org_ownerAccountId_idx" ON "Org" ("ownerAccountId");

CREATE TABLE IF NOT EXISTS "OrgSeat" (
  "id"          TEXT NOT NULL,
  "orgId"       TEXT NOT NULL,
  "accountId"   TEXT,
  "inviteEmail" TEXT,
  "status"      TEXT NOT NULL DEFAULT 'open',
  "claimedAt"   TIMESTAMP(3),
  "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "OrgSeat_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "OrgSeat_orgId_accountId_key" ON "OrgSeat" ("orgId", "accountId");
CREATE INDEX IF NOT EXISTS "OrgSeat_orgId_idx" ON "OrgSeat" ("orgId");
CREATE INDEX IF NOT EXISTS "OrgSeat_accountId_idx" ON "OrgSeat" ("accountId");

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'OrgSeat_orgId_fkey') THEN
    ALTER TABLE "OrgSeat"
      ADD CONSTRAINT "OrgSeat_orgId_fkey"
      FOREIGN KEY ("orgId") REFERENCES "Org" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
