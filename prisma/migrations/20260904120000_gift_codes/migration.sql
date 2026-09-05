-- CreateTable
CREATE TABLE IF NOT EXISTS "GiftCode" (
  "id" TEXT NOT NULL,
  "code" TEXT NOT NULL,
  "tier" TEXT NOT NULL,
  "edition" TEXT,
  "shopifyOrderId" TEXT NOT NULL,
  "fromName" TEXT,
  "fromEmail" TEXT,
  "toEmail" TEXT NOT NULL,
  "message" TEXT,
  "status" TEXT NOT NULL DEFAULT 'issued',
  "redeemedByUserId" TEXT,
  "redeemedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "GiftCode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "GiftCode_code_key" ON "GiftCode"("code");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "GiftCode_shopifyOrderId_key" ON "GiftCode"("shopifyOrderId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "GiftCode_toEmail_idx" ON "GiftCode"("toEmail");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "GiftCode_status_idx" ON "GiftCode"("status");
