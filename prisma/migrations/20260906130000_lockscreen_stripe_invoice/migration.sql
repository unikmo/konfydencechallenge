-- Stripe migration — stage 5: Workplace/School invoice tracking. Idempotent.
ALTER TABLE "LockscreenOrder" ADD COLUMN IF NOT EXISTS "stripeInvoiceId"     TEXT;
ALTER TABLE "LockscreenOrder" ADD COLUMN IF NOT EXISTS "stripeInvoiceUrl"    TEXT;
ALTER TABLE "LockscreenOrder" ADD COLUMN IF NOT EXISTS "stripeInvoiceStatus" TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS "LockscreenOrder_stripeInvoiceId_key"
  ON "LockscreenOrder" ("stripeInvoiceId");
