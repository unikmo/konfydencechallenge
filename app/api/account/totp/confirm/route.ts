import { NextRequest, NextResponse } from "next/server";
import { getAccount } from "@/lib/auth/session";
import { confirmTotpEnrolment } from "@/lib/auth/totp";
import { TOTP_RECOVERY_FLASH_COOKIE, totpFlashCookieOptions } from "@/lib/auth/totpFlash";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const lang = request.nextUrl.searchParams.get("lang") === "de" ? "&lang=de" : "";
  const account = await getAccount();
  if (!account) return NextResponse.redirect(new URL(`/account/sign-in${lang}`, request.url));

  const form = await request.formData();
  const code = String(form.get("code") ?? "");
  const result = await confirmTotpEnrolment(account, code);

  if (!result.ok) {
    return NextResponse.redirect(new URL(`/account/security/totp?error=code${lang}`, request.url));
  }

  const res = NextResponse.redirect(new URL(`/account/security/totp?done=1${lang}`, request.url));
  res.cookies.set(TOTP_RECOVERY_FLASH_COOKIE, result.recoveryCodes.join(","), totpFlashCookieOptions());
  return res;
}
