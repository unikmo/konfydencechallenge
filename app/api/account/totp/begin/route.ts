import { NextRequest, NextResponse } from "next/server";
import { getAccount } from "@/lib/auth/session";
import { beginTotpEnrolment, accountHasTotp } from "@/lib/auth/totp";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const account = await getAccount();
  if (!account) return NextResponse.redirect(new URL("/account/sign-in", request.url));
  if (await accountHasTotp(account.id)) {
    return NextResponse.redirect(new URL("/account/security", request.url));
  }
  await beginTotpEnrolment(account);
  return NextResponse.redirect(new URL("/account/security/totp", request.url));
}
