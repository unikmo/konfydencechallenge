-- Customer-authored CoMaSy scenarios: a Scenario can belong to one organisation. Idempotent.

ALTER TABLE "Scenario" ADD COLUMN IF NOT EXISTS "organizationId" TEXT;
CREATE INDEX IF NOT EXISTS "Scenario_organizationId_idx" ON "Scenario" ("organizationId");
