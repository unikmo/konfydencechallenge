import { NextRequest, NextResponse } from "next/server";
import { verifyLoginLink } from "@/lib/auth/loginCode";
import { getClientIp } from "@/lib/auth/request";
import { createSession, sessionCookieOptions, hashIp, SESSION_COOKIE_NAME } from "@/lib/auth/session";
import { claimPlayerForAccount } from "@/lib/auth/claim";
import { linkLockscreenSubscriptions } from "@/lib/lockscreens/linkToAccount";
import { KF_UID_COOKIE, KF_UID_COOKIE_OPTIONS } from "@/lib/challenge/kfUidCookie";
import { accountHasTotp } from "@/lib/auth/totp";
import { issuePendingMfa, pendingMfaCookieOptions, PENDING_MFA_COOKIE } from "@/lib/auth/pendingMfa";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token") ?? "";
  const nextParam = request.nextUrl.searchParams.get("next");
  const next = nextParam && nextParam.startsWith("/") && !nextParam.startsWith("//") ? nextParam : "/account";

  const result = await verifyLoginLink(token);
  if (!result.ok) {
    const reason = result.reason === "expired" ? "expired" : "code";
    return NextResponse.redirect(new URL(`/account/sign-in?error=${reason}`, request.url));
  }

  // Second factor owed -> hand off to the TOTP step instead of finishing.
  if (await accountHasTotp(result.account.id)) {
    const res = NextResponse.redirect(
      new URL(`/account/sign-in?step=totp&next=${encodeURIComponent(next)}`, request.url),
    );
    res.cookies.set(PENDING_MFA_COOKIE, issuePendingMfa(result.account.id), pendingMfaCookieOptions());
    return res;
  }

  const ip = getClientIp(request.headers);
  const { token: sessionToken, expiresAt } = await createSession(result.account.id, {
    userAgent: request.headers.get("user-agent"),
    ipHash: hashIp(ip),
  });
  const canonicalPlayerId = await claimPlayerForAccount(
    result.account,
    request.cookies.get(KF_UID_COOKIE)?.value ?? null,
  );
  await linkLockscreenSubscriptions(result.account);

  const response = NextResponse.redirect(new URL(next, request.url));
  response.cookies.set(SESSION_COOKIE_NAME, sessionToken, sessionCookieOptions(expiresAt));
  response.cookies.set(KF_UID_COOKIE, canonicalPlayerId, KF_UID_COOKIE_OPTIONS);
  return response;
}
