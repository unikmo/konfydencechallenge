import { NextRequest, NextResponse } from "next/server";
import { verifyPasskeyAuthentication, CHALLENGE_COOKIE } from "@/lib/auth/webauthn";
import { getClientIp } from "@/lib/auth/request";
import { createSession, sessionCookieOptions, hashIp, SESSION_COOKIE_NAME } from "@/lib/auth/session";
import { claimPlayerForAccount } from "@/lib/auth/claim";
import { linkLockscreenSubscriptions } from "@/lib/lockscreens/linkToAccount";
import { KF_UID_COOKIE, KF_UID_COOKIE_OPTIONS } from "@/lib/challenge/kfUidCookie";

export const dynamic = "force-dynamic";

function safeNext(value: string | null): string {
  return value && value.startsWith("/") && !value.startsWith("//") ? value : "/account";
}

export async function POST(request: NextRequest) {
  const raw = request.cookies.get(CHALLENGE_COOKIE)?.value ?? "";
  const [kind, challenge] = raw.split(":");
  const clear = (res: NextResponse) => {
    res.cookies.delete(CHALLENGE_COOKIE);
    return res;
  };
  if (kind !== "auth" || !challenge) {
    return clear(NextResponse.json({ ok: false, error: "expired" }, { status: 400 }));
  }

  const body = await request.json().catch(() => null);
  if (!body?.response) return clear(NextResponse.json({ ok: false }, { status: 400 }));

  const result = await verifyPasskeyAuthentication({ response: body.response, expectedChallenge: challenge });
  if (!result.ok) return clear(NextResponse.json({ ok: false }, { status: 400 }));

  const ip = getClientIp(request.headers);
  const { token, expiresAt } = await createSession(result.account.id, {
    userAgent: request.headers.get("user-agent"),
    ipHash: hashIp(ip),
  });
  const canonicalPlayerId = await claimPlayerForAccount(result.account, request.cookies.get(KF_UID_COOKIE)?.value ?? null);
  await linkLockscreenSubscriptions(result.account);

  const res = clear(NextResponse.json({ ok: true, redirect: safeNext(body.next ?? null) }));
  res.cookies.set(SESSION_COOKIE_NAME, token, sessionCookieOptions(expiresAt));
  res.cookies.set(KF_UID_COOKIE, canonicalPlayerId, KF_UID_COOKIE_OPTIONS);
  return res;
}
