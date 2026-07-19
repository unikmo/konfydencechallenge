-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Scenario" (
    "id" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "edition" TEXT NOT NULL,
    "category" TEXT,
    "cardType" TEXT NOT NULL DEFAULT 'scenario',
    "scored" BOOLEAN NOT NULL DEFAULT true,
    "section" TEXT,
    "hackKey" TEXT,
    "title" TEXT,
    "prompt" TEXT NOT NULL,
    "answersA" TEXT NOT NULL,
    "answersB" TEXT NOT NULL,
    "answersC" TEXT NOT NULL,
    "answersD" TEXT NOT NULL,
    "scoresA" INTEGER NOT NULL,
    "scoresB" INTEGER NOT NULL,
    "scoresC" INTEGER NOT NULL,
    "scoresD" INTEGER NOT NULL,
    "safeActions" TEXT,
    "tags" TEXT,
    "explanation" TEXT,
    "proTip" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Scenario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChallengeSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "edition" TEXT NOT NULL,
    "mode" TEXT NOT NULL DEFAULT 'full',
    "runNumber" INTEGER NOT NULL DEFAULT 1,
    "status" TEXT NOT NULL DEFAULT 'IN_PROGRESS',
    "currentIndex" INTEGER NOT NULL DEFAULT 0,
    "scoreTotal" INTEGER NOT NULL DEFAULT 0,
    "scoreMax" INTEGER NOT NULL DEFAULT 0,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChallengeSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChallengeSessionCard" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "scenarioId" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL,
    "answered" BOOLEAN NOT NULL DEFAULT false,
    "selectedAnswerKey" TEXT,
    "score" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChallengeSessionCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Entitlement" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tier" TEXT NOT NULL,
    "edition" TEXT,
    "source" TEXT NOT NULL DEFAULT 'shopify',
    "shopifyOrderId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Entitlement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Scenario_externalId_key" ON "Scenario"("externalId");

-- CreateIndex
CREATE INDEX "ChallengeSessionCard_scenarioId_idx" ON "ChallengeSessionCard"("scenarioId");

-- CreateIndex
CREATE INDEX "ChallengeSessionCard_sessionId_idx" ON "ChallengeSessionCard"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "ChallengeSessionCard_sessionId_orderIndex_key" ON "ChallengeSessionCard"("sessionId", "orderIndex");

-- CreateIndex
CREATE UNIQUE INDEX "Entitlement_shopifyOrderId_key" ON "Entitlement"("shopifyOrderId");

-- CreateIndex
CREATE INDEX "Entitlement_userId_idx" ON "Entitlement"("userId");

-- AddForeignKey
ALTER TABLE "ChallengeSession" ADD CONSTRAINT "ChallengeSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChallengeSessionCard" ADD CONSTRAINT "ChallengeSessionCard_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "ChallengeSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChallengeSessionCard" ADD CONSTRAINT "ChallengeSessionCard_scenarioId_fkey" FOREIGN KEY ("scenarioId") REFERENCES "Scenario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entitlement" ADD CONSTRAINT "Entitlement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
