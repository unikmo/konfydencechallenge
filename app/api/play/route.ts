import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getClientIp } from "@/lib/rateLimit";
import { getAccount } from "@/lib/auth/session";
import { createRoom } from "@/lib/play/room";

export const dynamic = "force-dynamic";

// Create a play-with-friends room. Host may be signed in (name defaults to
// their account) or a guest who supplies a name.
export async function POST(request: NextRequest) {
  const { allowed } = rateLimit(`play-create:${getClientIp(request)}`, 8, 60_000);
  if (!allowed) return NextResponse.json({ error: "Slow down a moment." }, { status: 429 });

  const body = await request.json().catch(() => ({}));
  const account = await getAccount();
  const name = String(body.name ?? "").trim() || account?.email?.split("@")[0] || "Host";

  const result = await createRoom(name, account?.id ?? null);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.error === "no_scenarios" ? 503 : 400 });
  }
  return NextResponse.json({ code: result.code, playerId: result.playerId });
}
