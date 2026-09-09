import { randomInt } from "crypto";
import { prisma } from "@/lib/prisma";

// Play-with-friends: a synchronous party round. Everyone answers the same
// scenario, then a reveal + running leaderboard. State is polled, not realtime.

const DECK_SIZE = 6;
const MAX_PLAYERS = 12;
const NAME_MAX = 24;
const ROOM_TTL_MS = 3 * 60 * 60 * 1000;

const ANSWER_KEYS = ["A", "B", "C"] as const;
export type AnswerKey = (typeof ANSWER_KEYS)[number];

const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no I/O/0/1

function newCode(): string {
  let out = "";
  for (let i = 0; i < 4; i += 1) out += CODE_ALPHABET[randomInt(0, CODE_ALPHABET.length)];
  return out;
}

export function cleanName(raw: string): string {
  return raw.replace(/\s+/g, " ").trim().slice(0, NAME_MAX);
}

export type PlayError =
  | "room_not_found"
  | "room_started"
  | "room_full"
  | "name_taken"
  | "bad_name"
  | "not_host"
  | "not_in_room"
  | "wrong_phase"
  | "no_scenarios";

type Fail = { ok: false; error: PlayError };
const fail = (error: PlayError): Fail => ({ ok: false, error });

// ---- deck ----------------------------------------------------------------

async function pickPartyDeck(): Promise<string[]> {
  const pool = await prisma.scenario.findMany({
    where: { active: true, scored: true, hackKey: { in: ["H", "A", "C", "K"] } },
    select: { id: true, hackKey: true },
  });
  if (pool.length === 0) return [];

  const byKey: Record<string, string[]> = { H: [], A: [], C: [], K: [] };
  for (const s of pool) if (s.hackKey && byKey[s.hackKey]) byKey[s.hackKey].push(s.id);
  for (const k of Object.keys(byKey)) shuffle(byKey[k]);

  // Round-robin across the four pressure patterns for a balanced deck.
  const deck: string[] = [];
  const order = ["H", "A", "C", "K"];
  let i = 0;
  while (deck.length < DECK_SIZE && i < DECK_SIZE * 4) {
    const k = order[i % 4];
    const next = byKey[k].shift();
    if (next) deck.push(next);
    i += 1;
  }
  if (deck.length < DECK_SIZE) {
    const rest = shuffle(pool.map((s) => s.id).filter((id) => !deck.includes(id)));
    deck.push(...rest.slice(0, DECK_SIZE - deck.length));
  }
  return deck.slice(0, DECK_SIZE);
}

function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = randomInt(0, i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ---- lifecycle ----------------------------------------------------------

export async function createRoom(
  hostName: string,
  accountId: string | null,
): Promise<{ ok: true; code: string; playerId: string } | Fail> {
  const name = cleanName(hostName);
  if (name.length < 1) return fail("bad_name");

  const deck = await pickPartyDeck();
  if (deck.length < DECK_SIZE) return fail("no_scenarios");

  // Retry on the (unlikely) code collision.
  for (let attempt = 0; attempt < 6; attempt += 1) {
    const code = newCode();
    const clash = await prisma.gameRoom.findUnique({ where: { code }, select: { id: true } });
    if (clash) continue;

    const room = await prisma.gameRoom.create({
      data: { code, scenarioIds: deck, status: "lobby" },
      select: { id: true },
    });
    const host = await prisma.roomPlayer.create({
      data: { roomId: room.id, name, accountId, isHost: true },
      select: { id: true },
    });
    await prisma.gameRoom.update({ where: { id: room.id }, data: { hostPlayerId: host.id } });
    return { ok: true, code, playerId: host.id };
  }
  return fail("room_not_found");
}

async function loadRoom(code: string) {
  return prisma.gameRoom.findUnique({
    where: { code: code.toUpperCase() },
    include: { players: { orderBy: { joinedAt: "asc" } } },
  });
}

export async function joinRoom(
  code: string,
  rawName: string,
  accountId: string | null,
): Promise<{ ok: true; playerId: string } | Fail> {
  const room = await loadRoom(code);
  if (!room || Date.now() - room.createdAt.getTime() > ROOM_TTL_MS) return fail("room_not_found");
  if (room.status !== "lobby") return fail("room_started");
  if (room.players.length >= MAX_PLAYERS) return fail("room_full");

  const name = cleanName(rawName);
  if (name.length < 1) return fail("bad_name");
  if (room.players.some((p) => p.name.toLowerCase() === name.toLowerCase())) return fail("name_taken");

  const player = await prisma.roomPlayer.create({
    data: { roomId: room.id, name, accountId },
    select: { id: true },
  });
  return { ok: true, playerId: player.id };
}

export async function startRoom(code: string, playerId: string): Promise<{ ok: true } | Fail> {
  const room = await loadRoom(code);
  if (!room) return fail("room_not_found");
  if (room.hostPlayerId !== playerId) return fail("not_host");
  if (room.status !== "lobby") return fail("wrong_phase");

  await prisma.gameRoom.update({
    where: { id: room.id },
    data: { status: "playing", currentIndex: 0 },
  });
  return { ok: true };
}

export async function submitAnswer(
  code: string,
  playerId: string,
  index: number,
  key: string,
): Promise<{ ok: true } | Fail> {
  const room = await loadRoom(code);
  if (!room) return fail("room_not_found");
  if (room.status !== "playing" || index !== room.currentIndex) return fail("wrong_phase");

  const me = room.players.find((p) => p.id === playerId);
  if (!me) return fail("not_in_room");
  if (!ANSWER_KEYS.includes(key as AnswerKey)) return fail("wrong_phase");
  if (me.answerIndex === room.currentIndex) return { ok: true }; // already answered this round

  const scenarioId = room.scenarioIds[room.currentIndex];
  const scenario = await prisma.scenario.findUnique({
    where: { id: scenarioId },
    select: { scoresA: true, scoresB: true, scoresC: true },
  });
  const points = scenario
    ? ({ A: scenario.scoresA, B: scenario.scoresB, C: scenario.scoresC }[key as AnswerKey] ?? 0)
    : 0;

  await prisma.roomPlayer.update({
    where: { id: playerId },
    data: {
      answerKey: key,
      answerIndex: room.currentIndex,
      answerScore: points,
      score: { increment: points },
      lastSeenAt: new Date(),
    },
  });

  // Auto-reveal once every player in the room has answered this scenario. A
  // genuine leaver blocks this — the host's "Reveal now" is the escape hatch.
  const fresh = await loadRoom(code);
  if (fresh && fresh.status === "playing") {
    const waiting = fresh.players.filter((p) => p.answerIndex !== fresh.currentIndex);
    if (waiting.length === 0) {
      await prisma.gameRoom.update({ where: { id: fresh.id }, data: { status: "revealed" } });
    }
  }
  return { ok: true };
}

export async function revealNow(code: string, playerId: string): Promise<{ ok: true } | Fail> {
  const room = await loadRoom(code);
  if (!room) return fail("room_not_found");
  if (room.hostPlayerId !== playerId) return fail("not_host");
  if (room.status !== "playing") return fail("wrong_phase");
  await prisma.gameRoom.update({ where: { id: room.id }, data: { status: "revealed" } });
  return { ok: true };
}

export async function advanceRoom(code: string, playerId: string): Promise<{ ok: true } | Fail> {
  const room = await loadRoom(code);
  if (!room) return fail("room_not_found");
  if (!room.players.some((p) => p.id === playerId)) return fail("not_in_room");
  if (room.status !== "revealed") return fail("wrong_phase");

  const nextIndex = room.currentIndex + 1;
  if (nextIndex >= room.scenarioIds.length) {
    await prisma.gameRoom.update({ where: { id: room.id }, data: { status: "finished" } });
    return { ok: true };
  }
  await prisma.$transaction([
    prisma.roomPlayer.updateMany({
      where: { roomId: room.id },
      data: { answerKey: null, answerIndex: null, answerScore: null },
    }),
    prisma.gameRoom.update({
      where: { id: room.id },
      data: { status: "playing", currentIndex: nextIndex },
    }),
  ]);
  return { ok: true };
}

export async function touchPlayer(playerId: string): Promise<void> {
  await prisma.roomPlayer.updateMany({ where: { id: playerId }, data: { lastSeenAt: new Date() } });
}

// ---- state for the client ---------------------------------------------

export type RoomStateView = {
  code: string;
  status: "lobby" | "playing" | "revealed" | "finished";
  index: number;
  total: number;
  you: { id: string; name: string; isHost: boolean } | null;
  players: { id: string; name: string; score: number; answered: boolean; isHost: boolean }[];
  scenario:
    | {
        prompt: string;
        hackKey: string | null;
        options: { key: AnswerKey; text: string }[];
      }
    | null;
  reveal:
    | {
        bestKey: AnswerKey;
        scores: Record<AnswerKey, number>;
        explanation: string | null;
        proTip: string | null;
        picks: { name: string; key: AnswerKey | null; points: number }[];
      }
    | null;
  yourAnswer: AnswerKey | null;
};

export async function getRoomState(code: string, playerId: string | null): Promise<RoomStateView | null> {
  const room = await loadRoom(code);
  if (!room) return null;

  const me = playerId ? room.players.find((p) => p.id === playerId) ?? null : null;
  const scenarioId = room.scenarioIds[room.currentIndex];

  let scenario: RoomStateView["scenario"] = null;
  let reveal: RoomStateView["reveal"] = null;

  if ((room.status === "playing" || room.status === "revealed") && scenarioId) {
    const s = await prisma.scenario.findUnique({
      where: { id: scenarioId },
      select: {
        prompt: true, hackKey: true,
        answersA: true, answersB: true, answersC: true,
        scoresA: true, scoresB: true, scoresC: true,
        explanation: true, proTip: true,
      },
    });
    if (s) {
      scenario = {
        prompt: s.prompt,
        hackKey: s.hackKey,
        options: [
          { key: "A", text: s.answersA },
          { key: "B", text: s.answersB },
          { key: "C", text: s.answersC },
        ],
      };
      if (room.status === "revealed") {
        const scores: Record<AnswerKey, number> = { A: s.scoresA, B: s.scoresB, C: s.scoresC };
        const bestKey = (["A", "B", "C"] as AnswerKey[]).reduce((best, k) => (scores[k] > scores[best] ? k : best), "A");
        reveal = {
          bestKey,
          scores,
          explanation: s.explanation,
          proTip: s.proTip,
          picks: room.players.map((p) => ({
            name: p.name,
            key: (p.answerIndex === room.currentIndex ? p.answerKey : null) as AnswerKey | null,
            points: p.answerIndex === room.currentIndex ? p.answerScore ?? 0 : 0,
          })),
        };
      }
    }
  }

  return {
    code: room.code,
    status: room.status as RoomStateView["status"],
    index: room.currentIndex,
    total: room.scenarioIds.length,
    you: me ? { id: me.id, name: me.name, isHost: me.isHost } : null,
    players: [...room.players]
      .sort((a, b) => b.score - a.score || a.joinedAt.getTime() - b.joinedAt.getTime())
      .map((p) => ({
        id: p.id,
        name: p.name,
        score: p.score,
        answered: p.answerIndex === room.currentIndex,
        isHost: p.isHost,
      })),
    scenario,
    reveal,
    yourAnswer: (me && me.answerIndex === room.currentIndex ? me.answerKey : null) as AnswerKey | null,
  };
}
