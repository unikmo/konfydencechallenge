CREATE TABLE IF NOT EXISTS "ComasyOrganization" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "industry" TEXT,
  "country" TEXT,
  "employees" INTEGER,
  "nis2Relevant" BOOLEAN NOT NULL DEFAULT false,
  "accountOwner" TEXT,
  "source" TEXT,
  "persona" TEXT,
  "stage" TEXT NOT NULL DEFAULT 'TARGET_ACCOUNT',
  "currentPlatform" TEXT,
  "estimatedValue" INTEGER NOT NULL DEFAULT 0,
  "nextAction" TEXT,
  "lastContactAt" TIMESTAMP(3),
  "customerHealth" TEXT NOT NULL DEFAULT 'PROSPECT',
  "accessCodeHash" TEXT,
  "accessCodeSalt" TEXT,
  "contractStart" TIMESTAMP(3),
  "contractEnd" TIMESTAMP(3),
  "seats" INTEGER,
  "arr" INTEGER NOT NULL DEFAULT 0,
  "renewalDate" TIMESTAMP(3),
  "expansionPotential" TEXT,
  "brandingName" TEXT,
  "retentionDays" INTEGER NOT NULL DEFAULT 365,
  "isDemo" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ComasyOrganization_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "ComasyOrganization_slug_key" ON "ComasyOrganization"("slug");
CREATE INDEX IF NOT EXISTS "ComasyOrganization_stage_idx" ON "ComasyOrganization"("stage");
CREATE INDEX IF NOT EXISTS "ComasyOrganization_customerHealth_idx" ON "ComasyOrganization"("customerHealth");
CREATE INDEX IF NOT EXISTS "ComasyOrganization_renewalDate_idx" ON "ComasyOrganization"("renewalDate");

CREATE TABLE IF NOT EXISTS "ComasyContact" (
  "id" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "firstName" TEXT NOT NULL,
  "lastName" TEXT NOT NULL,
  "jobTitle" TEXT,
  "persona" TEXT,
  "email" TEXT NOT NULL,
  "linkedIn" TEXT,
  "buyingRole" TEXT,
  "decisionMaker" BOOLEAN NOT NULL DEFAULT false,
  "champion" BOOLEAN NOT NULL DEFAULT false,
  "technicalEvaluator" BOOLEAN NOT NULL DEFAULT false,
  "procurement" BOOLEAN NOT NULL DEFAULT false,
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ComasyContact_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "ComasyContact_organizationId_idx" ON "ComasyContact"("organizationId");
CREATE INDEX IF NOT EXISTS "ComasyContact_email_idx" ON "ComasyContact"("email");

CREATE TABLE IF NOT EXISTS "ComasyCohort" (
  "id" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "department" TEXT,
  "country" TEXT,
  "role" TEXT,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ComasyCohort_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "ComasyCohort_organizationId_name_key" ON "ComasyCohort"("organizationId", "name");
CREATE INDEX IF NOT EXISTS "ComasyCohort_organizationId_idx" ON "ComasyCohort"("organizationId");

CREATE TABLE IF NOT EXISTS "ComasyParticipant" (
  "id" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "cohortId" TEXT,
  "firstName" TEXT NOT NULL,
  "lastName" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "department" TEXT,
  "role" TEXT,
  "status" TEXT NOT NULL DEFAULT 'INVITED',
  "accessToken" TEXT NOT NULL,
  "invitedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "onboardedAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ComasyParticipant_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "ComasyParticipant_accessToken_key" ON "ComasyParticipant"("accessToken");
CREATE UNIQUE INDEX IF NOT EXISTS "ComasyParticipant_organizationId_email_key" ON "ComasyParticipant"("organizationId", "email");
CREATE INDEX IF NOT EXISTS "ComasyParticipant_organizationId_idx" ON "ComasyParticipant"("organizationId");
CREATE INDEX IF NOT EXISTS "ComasyParticipant_cohortId_idx" ON "ComasyParticipant"("cohortId");
CREATE INDEX IF NOT EXISTS "ComasyParticipant_status_idx" ON "ComasyParticipant"("status");

CREATE TABLE IF NOT EXISTS "ComasyCampaign" (
  "id" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "cohortId" TEXT,
  "name" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'DRAFT',
  "designation" TEXT NOT NULL DEFAULT 'PRACTICE',
  "scheduledAt" TIMESTAMP(3),
  "startAt" TIMESTAMP(3),
  "endAt" TIMESTAMP(3),
  "roleFocus" TEXT,
  "hackFocus" TEXT,
  "scenarioIds" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ComasyCampaign_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "ComasyCampaign_organizationId_idx" ON "ComasyCampaign"("organizationId");
CREATE INDEX IF NOT EXISTS "ComasyCampaign_cohortId_idx" ON "ComasyCampaign"("cohortId");
CREATE INDEX IF NOT EXISTS "ComasyCampaign_status_idx" ON "ComasyCampaign"("status");
CREATE INDEX IF NOT EXISTS "ComasyCampaign_designation_idx" ON "ComasyCampaign"("designation");

CREATE TABLE IF NOT EXISTS "ComasyResponse" (
  "id" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "campaignId" TEXT NOT NULL,
  "participantId" TEXT NOT NULL,
  "scenarioId" TEXT NOT NULL,
  "selectedAnswerKey" TEXT NOT NULL,
  "score" INTEGER NOT NULL,
  "pause" BOOLEAN NOT NULL,
  "verification" BOOLEAN NOT NULL,
  "impulse" BOOLEAN NOT NULL,
  "hackKey" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ComasyResponse_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "ComasyResponse_campaignId_participantId_scenarioId_key" ON "ComasyResponse"("campaignId", "participantId", "scenarioId");
CREATE INDEX IF NOT EXISTS "ComasyResponse_organizationId_idx" ON "ComasyResponse"("organizationId");
CREATE INDEX IF NOT EXISTS "ComasyResponse_campaignId_idx" ON "ComasyResponse"("campaignId");
CREATE INDEX IF NOT EXISTS "ComasyResponse_participantId_idx" ON "ComasyResponse"("participantId");
CREATE INDEX IF NOT EXISTS "ComasyResponse_hackKey_idx" ON "ComasyResponse"("hackKey");
CREATE INDEX IF NOT EXISTS "ComasyResponse_createdAt_idx" ON "ComasyResponse"("createdAt");

CREATE TABLE IF NOT EXISTS "ComasyOpportunity" (
  "id" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "stage" TEXT NOT NULL DEFAULT 'TARGET_ACCOUNT',
  "estimatedValue" INTEGER NOT NULL DEFAULT 0,
  "probability" INTEGER NOT NULL DEFAULT 10,
  "expectedClose" TIMESTAMP(3),
  "nextAction" TEXT,
  "objection" TEXT,
  "owner" TEXT,
  "lostReason" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ComasyOpportunity_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "ComasyOpportunity_organizationId_idx" ON "ComasyOpportunity"("organizationId");
CREATE INDEX IF NOT EXISTS "ComasyOpportunity_stage_idx" ON "ComasyOpportunity"("stage");
CREATE INDEX IF NOT EXISTS "ComasyOpportunity_expectedClose_idx" ON "ComasyOpportunity"("expectedClose");

CREATE TABLE IF NOT EXISTS "ComasyPilot" (
  "id" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "cohortId" TEXT,
  "startAt" TIMESTAMP(3),
  "endAt" TIMESTAMP(3),
  "objectives" TEXT,
  "successCriteria" TEXT,
  "health" TEXT NOT NULL DEFAULT 'PLANNED',
  "customerFeedback" TEXT,
  "finalReviewDate" TIMESTAMP(3),
  "conversionStatus" TEXT NOT NULL DEFAULT 'OPEN',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ComasyPilot_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "ComasyPilot_organizationId_idx" ON "ComasyPilot"("organizationId");
CREATE INDEX IF NOT EXISTS "ComasyPilot_conversionStatus_idx" ON "ComasyPilot"("conversionStatus");
CREATE INDEX IF NOT EXISTS "ComasyPilot_finalReviewDate_idx" ON "ComasyPilot"("finalReviewDate");

CREATE TABLE IF NOT EXISTS "ComasyActivity" (
  "id" TEXT NOT NULL,
  "organizationId" TEXT,
  "contactId" TEXT,
  "type" TEXT NOT NULL,
  "source" TEXT,
  "medium" TEXT,
  "campaign" TEXT,
  "page" TEXT,
  "persona" TEXT,
  "metadata" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ComasyActivity_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "ComasyActivity_organizationId_idx" ON "ComasyActivity"("organizationId");
CREATE INDEX IF NOT EXISTS "ComasyActivity_contactId_idx" ON "ComasyActivity"("contactId");
CREATE INDEX IF NOT EXISTS "ComasyActivity_type_idx" ON "ComasyActivity"("type");
CREATE INDEX IF NOT EXISTS "ComasyActivity_source_idx" ON "ComasyActivity"("source");
CREATE INDEX IF NOT EXISTS "ComasyActivity_createdAt_idx" ON "ComasyActivity"("createdAt");

CREATE TABLE IF NOT EXISTS "ComasyRevenueEvent" (
  "id" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "amount" INTEGER NOT NULL,
  "source" TEXT NOT NULL DEFAULT 'manual',
  "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "note" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ComasyRevenueEvent_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "ComasyRevenueEvent_organizationId_idx" ON "ComasyRevenueEvent"("organizationId");
CREATE INDEX IF NOT EXISTS "ComasyRevenueEvent_type_idx" ON "ComasyRevenueEvent"("type");
CREATE INDEX IF NOT EXISTS "ComasyRevenueEvent_occurredAt_idx" ON "ComasyRevenueEvent"("occurredAt");

CREATE TABLE IF NOT EXISTS "ComasyLead" (
  "id" TEXT NOT NULL,
  "organizationId" TEXT,
  "firstName" TEXT NOT NULL,
  "lastName" TEXT NOT NULL,
  "workEmail" TEXT NOT NULL,
  "organizationName" TEXT NOT NULL,
  "role" TEXT,
  "organizationSize" TEXT,
  "primaryObjective" TEXT,
  "currentPlatform" TEXT,
  "notes" TEXT,
  "source" TEXT,
  "medium" TEXT,
  "campaign" TEXT,
  "landingPage" TEXT,
  "status" TEXT NOT NULL DEFAULT 'NEW',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ComasyLead_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "ComasyLead_workEmail_idx" ON "ComasyLead"("workEmail");
CREATE INDEX IF NOT EXISTS "ComasyLead_status_idx" ON "ComasyLead"("status");
CREATE INDEX IF NOT EXISTS "ComasyLead_source_idx" ON "ComasyLead"("source");
CREATE INDEX IF NOT EXISTS "ComasyLead_createdAt_idx" ON "ComasyLead"("createdAt");

CREATE TABLE IF NOT EXISTS "ComasyScenarioProfile" (
  "id" TEXT NOT NULL,
  "scenarioId" TEXT NOT NULL,
  "segment" TEXT NOT NULL DEFAULT 'B2B',
  "industries" TEXT,
  "roles" TEXT,
  "riskType" TEXT,
  "difficulty" TEXT NOT NULL DEFAULT 'MEDIUM',
  "pauseKeys" TEXT,
  "verificationKeys" TEXT,
  "impulseKeys" TEXT,
  "version" INTEGER NOT NULL DEFAULT 1,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ComasyScenarioProfile_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "ComasyScenarioProfile_scenarioId_key" ON "ComasyScenarioProfile"("scenarioId");

CREATE TABLE IF NOT EXISTS "ComasyScenarioVersion" (
  "id" TEXT NOT NULL,
  "scenarioId" TEXT NOT NULL,
  "version" INTEGER NOT NULL,
  "snapshot" TEXT NOT NULL,
  "createdBy" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ComasyScenarioVersion_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "ComasyScenarioVersion_scenarioId_version_key" ON "ComasyScenarioVersion"("scenarioId", "version");
CREATE INDEX IF NOT EXISTS "ComasyScenarioVersion_scenarioId_idx" ON "ComasyScenarioVersion"("scenarioId");

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='ComasyContact_organizationId_fkey') THEN
    ALTER TABLE "ComasyContact" ADD CONSTRAINT "ComasyContact_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "ComasyOrganization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='ComasyCohort_organizationId_fkey') THEN
    ALTER TABLE "ComasyCohort" ADD CONSTRAINT "ComasyCohort_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "ComasyOrganization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='ComasyParticipant_organizationId_fkey') THEN
    ALTER TABLE "ComasyParticipant" ADD CONSTRAINT "ComasyParticipant_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "ComasyOrganization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='ComasyParticipant_cohortId_fkey') THEN
    ALTER TABLE "ComasyParticipant" ADD CONSTRAINT "ComasyParticipant_cohortId_fkey" FOREIGN KEY ("cohortId") REFERENCES "ComasyCohort"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='ComasyCampaign_organizationId_fkey') THEN
    ALTER TABLE "ComasyCampaign" ADD CONSTRAINT "ComasyCampaign_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "ComasyOrganization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='ComasyCampaign_cohortId_fkey') THEN
    ALTER TABLE "ComasyCampaign" ADD CONSTRAINT "ComasyCampaign_cohortId_fkey" FOREIGN KEY ("cohortId") REFERENCES "ComasyCohort"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='ComasyResponse_organizationId_fkey') THEN
    ALTER TABLE "ComasyResponse" ADD CONSTRAINT "ComasyResponse_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "ComasyOrganization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='ComasyResponse_campaignId_fkey') THEN
    ALTER TABLE "ComasyResponse" ADD CONSTRAINT "ComasyResponse_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "ComasyCampaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='ComasyResponse_participantId_fkey') THEN
    ALTER TABLE "ComasyResponse" ADD CONSTRAINT "ComasyResponse_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "ComasyParticipant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='ComasyResponse_scenarioId_fkey') THEN
    ALTER TABLE "ComasyResponse" ADD CONSTRAINT "ComasyResponse_scenarioId_fkey" FOREIGN KEY ("scenarioId") REFERENCES "Scenario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='ComasyOpportunity_organizationId_fkey') THEN
    ALTER TABLE "ComasyOpportunity" ADD CONSTRAINT "ComasyOpportunity_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "ComasyOrganization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='ComasyPilot_organizationId_fkey') THEN
    ALTER TABLE "ComasyPilot" ADD CONSTRAINT "ComasyPilot_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "ComasyOrganization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='ComasyPilot_cohortId_fkey') THEN
    ALTER TABLE "ComasyPilot" ADD CONSTRAINT "ComasyPilot_cohortId_fkey" FOREIGN KEY ("cohortId") REFERENCES "ComasyCohort"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='ComasyActivity_organizationId_fkey') THEN
    ALTER TABLE "ComasyActivity" ADD CONSTRAINT "ComasyActivity_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "ComasyOrganization"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='ComasyActivity_contactId_fkey') THEN
    ALTER TABLE "ComasyActivity" ADD CONSTRAINT "ComasyActivity_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "ComasyContact"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='ComasyRevenueEvent_organizationId_fkey') THEN
    ALTER TABLE "ComasyRevenueEvent" ADD CONSTRAINT "ComasyRevenueEvent_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "ComasyOrganization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='ComasyLead_organizationId_fkey') THEN
    ALTER TABLE "ComasyLead" ADD CONSTRAINT "ComasyLead_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "ComasyOrganization"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='ComasyScenarioProfile_scenarioId_fkey') THEN
    ALTER TABLE "ComasyScenarioProfile" ADD CONSTRAINT "ComasyScenarioProfile_scenarioId_fkey" FOREIGN KEY ("scenarioId") REFERENCES "Scenario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='ComasyScenarioVersion_scenarioId_fkey') THEN
    ALTER TABLE "ComasyScenarioVersion" ADD CONSTRAINT "ComasyScenarioVersion_scenarioId_fkey" FOREIGN KEY ("scenarioId") REFERENCES "Scenario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;