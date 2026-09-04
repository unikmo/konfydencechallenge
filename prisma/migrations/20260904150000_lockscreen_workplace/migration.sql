-- CreateTable
CREATE TABLE IF NOT EXISTS "LockscreenAsset" (
  "id"        TEXT NOT NULL,
  "number"    INTEGER NOT NULL,
  "category"  TEXT NOT NULL,
  "hook"      TEXT NOT NULL,
  "body"      TEXT NOT NULL,
  "action"    TEXT NOT NULL,
  "imagePath" TEXT NOT NULL,
  "status"    TEXT NOT NULL DEFAULT 'live',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "LockscreenAsset_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "LockscreenAsset_number_key" ON "LockscreenAsset"("number");
CREATE INDEX IF NOT EXISTS "LockscreenAsset_status_idx" ON "LockscreenAsset"("status");

-- CreateTable
CREATE TABLE IF NOT EXISTS "LockscreenTenant" (
  "id"            TEXT NOT NULL,
  "kind"          TEXT NOT NULL,
  "orgName"       TEXT NOT NULL,
  "token"         TEXT NOT NULL,
  "tokenStatus"   TEXT NOT NULL DEFAULT 'active',
  "adminToken"    TEXT NOT NULL,
  "licensedCount" INTEGER NOT NULL,
  "contactName"   TEXT,
  "contactEmail"  TEXT NOT NULL,
  "termStart"     TIMESTAMP(3),
  "termEnd"       TIMESTAMP(3),
  "createdAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "LockscreenTenant_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "LockscreenTenant_token_key" ON "LockscreenTenant"("token");
CREATE UNIQUE INDEX IF NOT EXISTS "LockscreenTenant_adminToken_key" ON "LockscreenTenant"("adminToken");
CREATE INDEX IF NOT EXISTS "LockscreenTenant_contactEmail_idx" ON "LockscreenTenant"("contactEmail");

-- CreateTable
CREATE TABLE IF NOT EXISTS "LockscreenPlan" (
  "id"          TEXT NOT NULL,
  "tenantId"    TEXT NOT NULL,
  "sequence"    INTEGER[],
  "screenCount" INTEGER NOT NULL DEFAULT 27,
  "cadence"     TEXT NOT NULL DEFAULT 'fortnightly',
  "anchor"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "loop"        BOOLEAN NOT NULL DEFAULT true,
  "updatedAt"   TIMESTAMP(3) NOT NULL,
  CONSTRAINT "LockscreenPlan_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "LockscreenPlan_tenantId_key" ON "LockscreenPlan"("tenantId");
ALTER TABLE "LockscreenPlan"
  ADD CONSTRAINT "LockscreenPlan_tenantId_fkey"
  FOREIGN KEY ("tenantId") REFERENCES "LockscreenTenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE IF NOT EXISTS "LockscreenOrder" (
  "id"             TEXT NOT NULL,
  "poNumber"       TEXT NOT NULL,
  "tenantId"       TEXT,
  "orgName"        TEXT NOT NULL,
  "contactName"    TEXT,
  "contactEmail"   TEXT NOT NULL,
  "billingAddress" TEXT,
  "employeeCount"  INTEGER NOT NULL,
  "screenCount"    INTEGER NOT NULL,
  "cadence"        TEXT NOT NULL,
  "sequence"       INTEGER[],
  "baseRatePerHead"  DOUBLE PRECISION NOT NULL DEFAULT 4.0,
  "surchargePerHead" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "ratePerHead"    DOUBLE PRECISION NOT NULL,
  "annualTotal"    DOUBLE PRECISION NOT NULL,
  "minimumApplied" BOOLEAN NOT NULL DEFAULT false,
  "currency"       TEXT NOT NULL DEFAULT 'USD',
  "status"         TEXT NOT NULL DEFAULT 'quote_issued',
  "notes"          TEXT,
  "overrideAnnualTotal" DOUBLE PRECISION,
  "overrideReason"      TEXT,
  "overriddenBy"        TEXT,
  "overriddenAt"        TIMESTAMP(3),
  "createdAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "LockscreenOrder_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "LockscreenOrder_poNumber_key" ON "LockscreenOrder"("poNumber");
CREATE INDEX IF NOT EXISTS "LockscreenOrder_contactEmail_idx" ON "LockscreenOrder"("contactEmail");
CREATE INDEX IF NOT EXISTS "LockscreenOrder_status_idx" ON "LockscreenOrder"("status");
ALTER TABLE "LockscreenOrder"
  ADD CONSTRAINT "LockscreenOrder_tenantId_fkey"
  FOREIGN KEY ("tenantId") REFERENCES "LockscreenTenant"("id") ON DELETE SET NULL ON UPDATE CASCADE;
