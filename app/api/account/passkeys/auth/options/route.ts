import { NextResponse } from "next/server";
import { passkeyAuthenticationOptions, CHALLENGE_COOKIE } from "@/lib/auth/webauthn";
import { challengeCookieOptions } from "@/lib/auth/challengeCookie";

export const dynamic = "force-dynamic";

export async function POST() {
  const { options, challenge } = await passkeyAuthenticationOptions();
  const res = NextResponse.json(options);
  res.cookies.set(CHALLENGE_COOKIE, `auth:${challenge}`, challengeCookieOptions());
  return res;
}
