CREATE OR REPLACE FUNCTION comasy_enforce_tenant_consistency()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_TABLE_NAME = 'ComasyParticipant' AND NEW."cohortId" IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM "ComasyCohort" c WHERE c."id" = NEW."cohortId" AND c."organizationId" = NEW."organizationId") THEN
      RAISE EXCEPTION 'CoMaSy tenant violation: participant cohort belongs to another organisation';
    END IF;
  ELSIF TG_TABLE_NAME = 'ComasyCampaign' AND NEW."cohortId" IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM "ComasyCohort" c WHERE c."id" = NEW."cohortId" AND c."organizationId" = NEW."organizationId") THEN
      RAISE EXCEPTION 'CoMaSy tenant violation: campaign cohort belongs to another organisation';
    END IF;
  ELSIF TG_TABLE_NAME = 'ComasyPilot' AND NEW."cohortId" IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM "ComasyCohort" c WHERE c."id" = NEW."cohortId" AND c."organizationId" = NEW."organizationId") THEN
      RAISE EXCEPTION 'CoMaSy tenant violation: pilot cohort belongs to another organisation';
    END IF;
  ELSIF TG_TABLE_NAME = 'ComasyResponse' THEN
    IF NOT EXISTS (SELECT 1 FROM "ComasyCampaign" c WHERE c."id" = NEW."campaignId" AND c."organizationId" = NEW."organizationId") THEN
      RAISE EXCEPTION 'CoMaSy tenant violation: response campaign belongs to another organisation';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM "ComasyParticipant" p WHERE p."id" = NEW."participantId" AND p."organizationId" = NEW."organizationId") THEN
      RAISE EXCEPTION 'CoMaSy tenant violation: response participant belongs to another organisation';
    END IF;
  ELSIF TG_TABLE_NAME = 'ComasyActivity' AND NEW."contactId" IS NOT NULL AND NEW."organizationId" IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM "ComasyContact" c WHERE c."id" = NEW."contactId" AND c."organizationId" = NEW."organizationId") THEN
      RAISE EXCEPTION 'CoMaSy tenant violation: activity contact belongs to another organisation';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS comasy_participant_tenant_guard ON "ComasyParticipant";
CREATE TRIGGER comasy_participant_tenant_guard BEFORE INSERT OR UPDATE OF "organizationId", "cohortId" ON "ComasyParticipant" FOR EACH ROW EXECUTE FUNCTION comasy_enforce_tenant_consistency();
DROP TRIGGER IF EXISTS comasy_campaign_tenant_guard ON "ComasyCampaign";
CREATE TRIGGER comasy_campaign_tenant_guard BEFORE INSERT OR UPDATE OF "organizationId", "cohortId" ON "ComasyCampaign" FOR EACH ROW EXECUTE FUNCTION comasy_enforce_tenant_consistency();
DROP TRIGGER IF EXISTS comasy_pilot_tenant_guard ON "ComasyPilot";
CREATE TRIGGER comasy_pilot_tenant_guard BEFORE INSERT OR UPDATE OF "organizationId", "cohortId" ON "ComasyPilot" FOR EACH ROW EXECUTE FUNCTION comasy_enforce_tenant_consistency();
DROP TRIGGER IF EXISTS comasy_response_tenant_guard ON "ComasyResponse";
CREATE TRIGGER comasy_response_tenant_guard BEFORE INSERT OR UPDATE OF "organizationId", "campaignId", "participantId" ON "ComasyResponse" FOR EACH ROW EXECUTE FUNCTION comasy_enforce_tenant_consistency();
DROP TRIGGER IF EXISTS comasy_activity_tenant_guard ON "ComasyActivity";
CREATE TRIGGER comasy_activity_tenant_guard BEFORE INSERT OR UPDATE OF "organizationId", "contactId" ON "ComasyActivity" FOR EACH ROW EXECUTE FUNCTION comasy_enforce_tenant_consistency();
