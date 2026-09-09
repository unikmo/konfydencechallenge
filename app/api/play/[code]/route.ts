import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getClientIp } from "@/lib/rateLimit";
import { getAccount } from "@/lib/auth/session";
import {
  getRoomState,
  joinRoom,
  startRoom,
  submitAnswer,
  revealNow,
  advanceRoom,
  touchPlayer,
} from "@/lib/play/room";

export const dynamic = "force-dynamic";

// Polled by every client in the room (~1.5s). `p` is the caller's RoomPlayer id.
export async function GET(request: NextRequest, ctx: { params: Promise<{ code: string }> }) {
  const { code } = await ctx.params;
  const playerId = request.nextUrl.searchParams.get("p");
  if (playerId) await touchPlayer(playerId).catch(() => {});
  const state = await getRoomState(code, playerId);
  if (!state) return NextResponse.json({ error: "room_not_found" }, { status: 404 });
  return NextResponse.json(state);
}

// All room actions: join | start | answer | reveal | next.
export async function POST(request: NextRequest, ctx: { params: Promise<{ code: string }> }) {
  const { code } = await ctx.params;
  const { allowed } = rateLimit(`play-act:${getClientIp(request)}`, 90, 60_000);
  if (!allowed) return NextResponse.json({ error: "Slow down a moment." }, { status: 429 });

  const body = await request.json().catch(() => ({}));
  const action = String(body.action ?? "");
  const playerId = String(body.playerId ?? "");

  if (action === "join") {
    const account = await getAccount();
    const res = await joinRoom(code, String(body.name ?? ""), account?.id ?? null);
    if (!res.ok) return NextResponse.json({ error: res.error }, { status: 400 });
    return NextResponse.json({ playerId: res.playerId });
  }

  if (!playerId) return NextResponse.json({ error: "not_in_room" }, { status: 400 });

  const run =
    action === "start"
      ? startRoom(code, playerId)
      : action === "answer"
        ? submitAnswer(code, playerId, Number(body.index), String(body.key ?? ""))
        : action === "reveal"
          ? revealNow(code, playerId)
          : action === "next"
            ? advanceRoom(code, playerId)
            : Promise.resolve({ ok: false as const, error: "wrong_phase" as const });

  const res = await run;
  if (!res.ok) return NextResponse.json({ error: res.error }, { status: 400 });
  return NextResponse.json({ ok: true });
}
