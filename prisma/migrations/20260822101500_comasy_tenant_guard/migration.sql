CREATE OR REPLACE FUNCTION comasy_enforce_tenant_consistency()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  row_data jsonb := to_jsonb(NEW);
  org_id text := row_data ->> 'organizationId';
  cohort_id text := row_data ->> 'cohortId';
  campaign_id text := row_data ->> 'campaignId';
  participant_id text := row_data ->> 'participantId';
  contact_id text := row_data ->> 'contactId';
BEGIN
  IF TG_TABLE_NAME IN ('ComasyParticipant', 'ComasyCampaign', 'ComasyPilot') AND cohort_id IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM "ComasyCohort" c WHERE c."id" = cohort_id AND c."organizationId" = org_id) THEN
      RAISE EXCEPTION 'CoMaSy tenant violation: cohort belongs to another organisation';
    END IF;
  ELSIF TG_TABLE_NAME = 'ComasyResponse' THEN
    IF NOT EXISTS (SELECT 1 FROM "ComasyCampaign" c WHERE c."id" = campaign_id AND c."organizationId" = org_id) THEN
      RAISE EXCEPTION 'CoMaSy tenant violation: response campaign belongs to another organisation';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM "ComasyParticipant" p WHERE p."id" = participant_id AND p."organizationId" = org_id) THEN
      RAISE EXCEPTION 'CoMaSy tenant violation: response participant belongs to another organisation';
    END IF;
  ELSIF TG_TABLE_NAME = 'ComasyActivity' AND contact_id IS NOT NULL AND org_id IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM "ComasyContact" c WHERE c."id" = contact_id AND c."organizationId" = org_id) THEN
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
