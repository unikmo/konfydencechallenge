-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Scenario" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "externalId" TEXT NOT NULL,
    "edition" TEXT NOT NULL,
    "section" TEXT NOT NULL,
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ChallengeSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "edition" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'IN_PROGRESS',
    "completedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ChallengeSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ChallengeSessionSection" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionId" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "currentIndex" INTEGER NOT NULL DEFAULT 0,
    "sectionScoreTotal" INTEGER NOT NULL DEFAULT 0,
    "sectionScoreMax" INTEGER NOT NULL DEFAULT 0,
    "completedScenarioIds" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ChallengeSessionSection_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "ChallengeSession" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ChallengeSessionSectionCard" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sectionId" TEXT NOT NULL,
    "scenarioId" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL,
    CONSTRAINT "ChallengeSessionSectionCard_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "ChallengeSessionSection" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ChallengeSessionSectionCard_scenarioId_fkey" FOREIGN KEY ("scenarioId") REFERENCES "Scenario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ChallengeAnswerResponse" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionId" TEXT NOT NULL,
    "scenarioId" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "selectedAnswerKey" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "explanation" TEXT,
    "proTip" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ChallengeAnswerResponse_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "ChallengeSession" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ChallengeAnswerResponse_scenarioId_fkey" FOREIGN KEY ("scenarioId") REFERENCES "Scenario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Scenario_externalId_key" ON "Scenario"("externalId");

-- CreateIndex
CREATE UNIQUE INDEX "ChallengeSessionSection_sessionId_section_key" ON "ChallengeSessionSection"("sessionId", "section");

-- CreateIndex
CREATE INDEX "ChallengeSessionSectionCard_scenarioId_idx" ON "ChallengeSessionSectionCard"("scenarioId");

-- CreateIndex
CREATE UNIQUE INDEX "ChallengeSessionSectionCard_sectionId_orderIndex_key" ON "ChallengeSessionSectionCard"("sectionId", "orderIndex");

-- CreateIndex
CREATE INDEX "ChallengeAnswerResponse_sessionId_idx" ON "ChallengeAnswerResponse"("sessionId");

-- CreateIndex
CREATE INDEX "ChallengeAnswerResponse_scenarioId_idx" ON "ChallengeAnswerResponse"("scenarioId");
