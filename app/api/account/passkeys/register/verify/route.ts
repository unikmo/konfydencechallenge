import { NextRequest, NextResponse } from "next/server";
import { getAccount } from "@/lib/auth/session";
import { verifyPasskeyRegistration, CHALLENGE_COOKIE } from "@/lib/auth/webauthn";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const account = await getAccount();
  if (!account) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const raw = request.cookies.get(CHALLENGE_COOKIE)?.value ?? "";
  const [kind, accountId, challenge] = raw.split(":");
  const clear = (res: NextResponse) => {
    res.cookies.delete(CHALLENGE_COOKIE);
    return res;
  };
  if (kind !== "reg" || accountId !== account.id || !challenge) {
    return clear(NextResponse.json({ ok: false, error: "expired" }, { status: 400 }));
  }

  const body = await request.json().catch(() => null);
  if (!body) return clear(NextResponse.json({ ok: false }, { status: 400 }));

  const { ok } = await verifyPasskeyRegistration({ account, response: body, expectedChallenge: challenge });
  return clear(NextResponse.json({ ok }));
}
