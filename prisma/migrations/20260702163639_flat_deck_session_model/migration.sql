-- DropIndex
DROP INDEX "ChallengeAnswerResponse_scenarioId_idx";

-- DropIndex
DROP INDEX "ChallengeAnswerResponse_sessionId_idx";

-- DropIndex
DROP INDEX "ChallengeSessionSection_sessionId_section_key";

-- DropIndex
DROP INDEX "ChallengeSessionSectionCard_sectionId_orderIndex_key";

-- DropIndex
DROP INDEX "ChallengeSessionSectionCard_scenarioId_idx";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ChallengeAnswerResponse";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ChallengeSessionSection";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ChallengeSessionSectionCard";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "ChallengeSessionCard" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionId" TEXT NOT NULL,
    "scenarioId" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL,
    "answered" BOOLEAN NOT NULL DEFAULT false,
    "selectedAnswerKey" TEXT,
    "score" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ChallengeSessionCard_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "ChallengeSession" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ChallengeSessionCard_scenarioId_fkey" FOREIGN KEY ("scenarioId") REFERENCES "Scenario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ChallengeSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "edition" TEXT NOT NULL,
    "mode" TEXT NOT NULL DEFAULT 'full',
    "runNumber" INTEGER NOT NULL DEFAULT 1,
    "status" TEXT NOT NULL DEFAULT 'IN_PROGRESS',
    "currentIndex" INTEGER NOT NULL DEFAULT 0,
    "scoreTotal" INTEGER NOT NULL DEFAULT 0,
    "scoreMax" INTEGER NOT NULL DEFAULT 0,
    "completedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ChallengeSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ChallengeSession" ("completedAt", "createdAt", "edition", "id", "status", "updatedAt", "userId") SELECT "completedAt", "createdAt", "edition", "id", "status", "updatedAt", "userId" FROM "ChallengeSession";
DROP TABLE "ChallengeSession";
ALTER TABLE "new_ChallengeSession" RENAME TO "ChallengeSession";
CREATE TABLE "new_Scenario" (
    "id" TEXT NOT NULL PRIMARY KEY,
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Scenario" ("active", "answersA", "answersB", "answersC", "answersD", "createdAt", "edition", "explanation", "externalId", "id", "proTip", "prompt", "safeActions", "scoresA", "scoresB", "scoresC", "scoresD", "section", "tags", "title", "updatedAt") SELECT "active", "answersA", "answersB", "answersC", "answersD", "createdAt", "edition", "explanation", "externalId", "id", "proTip", "prompt", "safeActions", "scoresA", "scoresB", "scoresC", "scoresD", "section", "tags", "title", "updatedAt" FROM "Scenario";
DROP TABLE "Scenario";
ALTER TABLE "new_Scenario" RENAME TO "Scenario";
CREATE UNIQUE INDEX "Scenario_externalId_key" ON "Scenario"("externalId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "ChallengeSessionCard_scenarioId_idx" ON "ChallengeSessionCard"("scenarioId");

-- CreateIndex
CREATE INDEX "ChallengeSessionCard_sessionId_idx" ON "ChallengeSessionCard"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "ChallengeSessionCard_sessionId_orderIndex_key" ON "ChallengeSessionCard"("sessionId", "orderIndex");
