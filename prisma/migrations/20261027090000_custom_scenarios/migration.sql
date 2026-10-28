ALTER TABLE "Scenario" ADD COLUMN IF NOT EXISTS "organizationId" TEXT, ADD COLUMN IF NOT EXISTS "publicationStatus" TEXT NOT NULL DEFAULT 'PUBLISHED';
ALTER TABLE "ComasyOrganization" ADD COLUMN IF NOT EXISTS "pilotPlan" TEXT NOT NULL DEFAULT 'FREE';
ALTER TABLE "ComasyPilot" ADD COLUMN IF NOT EXISTS "plan" TEXT NOT NULL DEFAULT 'FREE', ADD COLUMN IF NOT EXISTS "feeUsd" INTEGER NOT NULL DEFAULT 0;
CREATE INDEX IF NOT EXISTS "Scenario_organizationId_publicationStatus_idx" ON "Scenario"("organizationId", "publicationStatus");
DO $$ BEGIN ALTER TABLE "Scenario" ADD CONSTRAINT "Scenario_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "ComasyOrganization"("id") ON DELETE RESTRICT ON UPDATE CASCADE; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE "ComasyOrganization" ADD CONSTRAINT "ComasyOrganization_pilotPlan_check" CHECK ("pilotPlan" IN ('FREE', 'STANDARD', 'CUSTOM')); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE "Scenario" ADD CONSTRAINT "Scenario_custom_scope_check" CHECK ("organizationId" IS NULL OR "edition" = 'comasy-custom'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE "Scenario" ADD CONSTRAINT "Scenario_publication_check" CHECK ("publicationStatus" IN ('DRAFT', 'PUBLISHED')); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

ALTER TABLE "ComasyLead" ADD COLUMN IF NOT EXISTS "requestedPlan" TEXT NOT NULL DEFAULT 'FREE';
CREATE OR REPLACE FUNCTION comasy_custom_scenario_guard() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF TG_TABLE_NAME = 'ComasyResponse' THEN
    IF NOT EXISTS (SELECT 1 FROM "Scenario" s WHERE s.id = NEW."scenarioId" AND (s."organizationId" IS NULL OR (s."organizationId" = NEW."organizationId" AND s."publicationStatus" = 'PUBLISHED'))) THEN
      RAISE EXCEPTION 'Custom scenario tenant or publication violation';
    END IF;
  ELSIF TG_TABLE_NAME = 'Scenario' THEN
    IF OLD."organizationId" IS NOT NULL AND OLD."publicationStatus" = 'PUBLISHED' THEN
      RAISE EXCEPTION 'Published custom scenarios are immutable';
    END IF;
    IF TG_OP = 'DELETE' THEN RETURN OLD; END IF;
  ELSIF TG_TABLE_NAME = 'ComasyScenarioProfile' THEN
    IF EXISTS (SELECT 1 FROM "Scenario" s WHERE s.id = OLD."scenarioId" AND s."organizationId" IS NOT NULL AND s."publicationStatus" = 'PUBLISHED') THEN
      RAISE EXCEPTION 'Published custom scenario classifications are immutable';
    END IF;
    IF TG_OP = 'DELETE' THEN RETURN OLD; END IF;
  END IF;
  RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS comasy_custom_response_guard ON "ComasyResponse";
CREATE TRIGGER comasy_custom_response_guard BEFORE INSERT OR UPDATE ON "ComasyResponse" FOR EACH ROW EXECUTE FUNCTION comasy_custom_scenario_guard();
DROP TRIGGER IF EXISTS comasy_custom_content_guard ON "Scenario";
CREATE TRIGGER comasy_custom_content_guard BEFORE UPDATE OR DELETE ON "Scenario" FOR EACH ROW EXECUTE FUNCTION comasy_custom_scenario_guard();
DROP TRIGGER IF EXISTS comasy_custom_profile_guard ON "ComasyScenarioProfile";
CREATE TRIGGER comasy_custom_profile_guard BEFORE UPDATE OR DELETE ON "ComasyScenarioProfile" FOR EACH ROW EXECUTE FUNCTION comasy_custom_scenario_guard();
