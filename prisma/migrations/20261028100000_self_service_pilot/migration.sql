CREATE TABLE IF NOT EXISTS "ComasyAdministrator" (
 "id" TEXT PRIMARY KEY, "organizationId" TEXT NOT NULL REFERENCES "ComasyOrganization"("id") ON DELETE CASCADE ON UPDATE CASCADE,
 "email" TEXT NOT NULL, "name" TEXT NOT NULL, "active" BOOLEAN NOT NULL DEFAULT true, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX IF NOT EXISTS "ComasyAdministrator_organizationId_email_key" ON "ComasyAdministrator"("organizationId", "email");
CREATE INDEX IF NOT EXISTS "ComasyAdministrator_email_active_idx" ON "ComasyAdministrator"("email", "active");
ALTER TABLE "ComasyOrganization" ADD COLUMN IF NOT EXISTS "pilotStartedAt" TIMESTAMP(3), ADD COLUMN IF NOT EXISTS "pilotEndsAt" TIMESTAMP(3), ADD COLUMN IF NOT EXISTS "pilotObjectives" TEXT, ADD COLUMN IF NOT EXISTS "evidenceOwner" TEXT, ADD COLUMN IF NOT EXISTS "evidenceReviewAt" TIMESTAMP(3), ADD COLUMN IF NOT EXISTS "evidenceReviewNotes" TEXT, ADD COLUMN IF NOT EXISTS "dataHandlingConfirmedAt" TIMESTAMP(3);
ALTER TABLE "ComasyParticipant" ADD COLUMN IF NOT EXISTS "invitationSentAt" TIMESTAMP(3), ADD COLUMN IF NOT EXISTS "invitationError" TEXT;
UPDATE "ComasyOrganization" SET "pilotPlan" = 'FREE' WHERE "pilotPlan" <> 'FREE';
-- Historical quoted pilot fees are preserved on existing pilot records. New pilots are free.
-- Existing workspaces need a named administrator provisioned by the internal account owner.
CREATE OR REPLACE FUNCTION comasy_keep_administrator() RETURNS trigger LANGUAGE plpgsql SET search_path=public AS $$
BEGIN
 IF OLD.active AND (TG_OP = 'DELETE' OR NOT NEW.active OR NEW."organizationId" <> OLD."organizationId") THEN
   PERFORM id FROM "ComasyOrganization" WHERE id = OLD."organizationId" FOR UPDATE;
   IF EXISTS (SELECT 1 FROM "ComasyOrganization" WHERE id=OLD."organizationId") AND NOT EXISTS (SELECT 1 FROM "ComasyAdministrator" WHERE "organizationId"=OLD."organizationId" AND active AND id<>OLD.id) THEN
     RAISE EXCEPTION 'An organisation must retain at least one active administrator';
   END IF;
 END IF;
 IF TG_OP='DELETE' THEN RETURN OLD; END IF;
 RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS comasy_keep_administrator ON "ComasyAdministrator";
CREATE TRIGGER comasy_keep_administrator BEFORE UPDATE OR DELETE ON "ComasyAdministrator" FOR EACH ROW EXECUTE FUNCTION comasy_keep_administrator();
