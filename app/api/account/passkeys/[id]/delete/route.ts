import { NextRequest, NextResponse } from "next/server";
import { getAccount } from "@/lib/auth/session";
import { deletePasskey } from "@/lib/auth/webauthn";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const account = await getAccount();
  if (!account) return NextResponse.redirect(new URL("/account/sign-in", request.url));
  const { id } = await props.params;
  await deletePasskey(account.id, id);
  return NextResponse.redirect(new URL("/account/security", request.url));
}
