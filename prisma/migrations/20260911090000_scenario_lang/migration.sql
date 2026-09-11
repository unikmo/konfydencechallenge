-- German (de) locale support for Scenario. Idempotent.

ALTER TABLE "Scenario" ADD COLUMN IF NOT EXISTS "lang" TEXT NOT NULL DEFAULT 'en';
CREATE INDEX IF NOT EXISTS "Scenario_edition_lang_active_scored_hackKey_idx"
  ON "Scenario" ("edition", "lang", "active", "scored", "hackKey");
