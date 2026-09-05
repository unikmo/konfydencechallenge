import { NextResponse } from "next/server";
import { getAccount } from "@/lib/auth/session";
import { passkeyRegistrationOptions, CHALLENGE_COOKIE } from "@/lib/auth/webauthn";
import { challengeCookieOptions } from "@/lib/auth/challengeCookie";

export const dynamic = "force-dynamic";

export async function POST() {
  const account = await getAccount();
  if (!account) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { options, challenge } = await passkeyRegistrationOptions(account);
  const res = NextResponse.json(options);
  res.cookies.set(CHALLENGE_COOKIE, `reg:${account.id}:${challenge}`, challengeCookieOptions());
  return res;
}
