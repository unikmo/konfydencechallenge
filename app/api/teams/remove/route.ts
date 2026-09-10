import { NextRequest, NextResponse } from "next/server";
import { getAccount } from "@/lib/auth/session";
import { orgOwnedBy, removeSeatMember } from "@/lib/commerce/org";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const account = await getAccount();
  if (!account) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const org = await orgOwnedBy(account.id);
  if (!org) return NextResponse.json({ error: "No team to manage." }, { status: 403 });

  const body = await request.json().catch(() => ({}));
  const seatId = typeof body.seatId === "string" ? body.seatId : "";
  if (!seatId) return NextResponse.json({ error: "seatId is required." }, { status: 400 });

  await removeSeatMember(org, seatId);
  return NextResponse.json({ ok: true });
}
