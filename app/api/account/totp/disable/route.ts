import { NextRequest, NextResponse } from "next/server";
import { getAccount } from "@/lib/auth/session";
import { verifyTotpForAccount, disableTotp, accountHasTotp } from "@/lib/auth/totp";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const account = await getAccount();
  if (!account) return NextResponse.redirect(new URL("/account/sign-in", request.url));

  if (await accountHasTotp(account.id)) {
    const form = await request.formData();
    const code = String(form.get("code") ?? "");
    // Turning it off needs the factor itself, so a stolen session alone can't.
    if (!(await verifyTotpForAccount(account.id, code))) {
      return NextResponse.redirect(new URL("/account/security?totp=badcode", request.url));
    }
    await disableTotp(account.id);
  }
  return NextResponse.redirect(new URL("/account/security?totp=off", request.url));
}
