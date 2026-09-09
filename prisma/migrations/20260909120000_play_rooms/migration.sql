-- Play-with-friends party rooms. Idempotent.
CREATE TABLE IF NOT EXISTS "GameRoom" (
  "id"           TEXT NOT NULL,
  "code"         TEXT NOT NULL,
  "hostPlayerId" TEXT,
  "scenarioIds"  TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "status"       TEXT NOT NULL DEFAULT 'lobby',
  "currentIndex" INTEGER NOT NULL DEFAULT 0,
  "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "GameRoom_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "GameRoom_code_key" ON "GameRoom" ("code");
CREATE INDEX IF NOT EXISTS "GameRoom_createdAt_idx" ON "GameRoom" ("createdAt");

CREATE TABLE IF NOT EXISTS "RoomPlayer" (
  "id"          TEXT NOT NULL,
  "roomId"      TEXT NOT NULL,
  "accountId"   TEXT,
  "name"        TEXT NOT NULL,
  "isHost"      BOOLEAN NOT NULL DEFAULT false,
  "score"       INTEGER NOT NULL DEFAULT 0,
  "answerKey"   TEXT,
  "answerIndex" INTEGER,
  "answerScore" INTEGER,
  "joinedAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "lastSeenAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "RoomPlayer_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "RoomPlayer_roomId_name_key" ON "RoomPlayer" ("roomId", "name");
CREATE INDEX IF NOT EXISTS "RoomPlayer_roomId_idx" ON "RoomPlayer" ("roomId");

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'RoomPlayer_roomId_fkey') THEN
    ALTER TABLE "RoomPlayer"
      ADD CONSTRAINT "RoomPlayer_roomId_fkey"
      FOREIGN KEY ("roomId") REFERENCES "GameRoom" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
