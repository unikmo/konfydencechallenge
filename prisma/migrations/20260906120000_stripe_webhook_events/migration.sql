-- Stripe migration — stage 2: cross-provider webhook idempotency. Idempotent.
CREATE TABLE IF NOT EXISTS "ProcessedWebhookEvent" (
  "id"         TEXT NOT NULL,
  "provider"   TEXT NOT NULL DEFAULT 'stripe',
  "type"       TEXT NOT NULL,
  "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ProcessedWebhookEvent_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "ProcessedWebhookEvent_receivedAt_idx"
  ON "ProcessedWebhookEvent" ("receivedAt");
