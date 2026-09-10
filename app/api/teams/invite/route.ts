import { NextRequest, NextResponse } from "next/server";
import { getAccount } from "@/lib/auth/session";
import { orgOwnedBy, inviteToSeats } from "@/lib/commerce/org";
import { rateLimit, getClientIp } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const { allowed } = rateLimit(`team-invite:${getClientIp(request)}`, 20, 60_000);
  if (!allowed) return NextResponse.json({ error: "Too many requests." }, { status: 429 });

  const account = await getAccount();
  if (!account) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const org = await orgOwnedBy(account.id);
  if (!org) return NextResponse.json({ error: "No team to manage." }, { status: 403 });

  const body = await request.json().catch(() => ({}));
  const raw = typeof body.emails === "string" ? body.emails : Array.isArray(body.emails) ? body.emails.join("\n") : "";
  const emails = raw
    .split(/[\s,;]+/)
    .map((s: string) => s.trim())
    .filter(Boolean)
    .slice(0, 100);
  if (emails.length === 0) return NextResponse.json({ error: "Enter at least one email." }, { status: 400 });

  const report = await inviteToSeats(org, emails);
  return NextResponse.json({ ok: true, ...report });
}
