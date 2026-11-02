-- Language of the order flow for Lockscreens tenants (emails + pages). Idempotent.
ALTER TABLE "LockscreenTenant" ADD COLUMN IF NOT EXISTS "lang" TEXT NOT NULL DEFAULT 'en';
