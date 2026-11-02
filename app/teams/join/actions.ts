"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAccount } from "@/lib/auth/session";
import { claimSeatByInviteCode } from "@/lib/commerce/org";
import { KF_UID_COOKIE } from "@/lib/challenge/kfUidCookie";

export async function claimSeatAction(formData: FormData): Promise<void> {
  const code = String(formData.get("code") ?? "").trim().toUpperCase();
  const de = String(formData.get("lang") ?? "") === "de";
  const back = `${de ? "/de" : ""}/teams/join?code=${encodeURIComponent(code)}`;

  const account = await getAccount();
  if (!account) redirect(`/account/sign-in?next=${encodeURIComponent(back)}&reason=team-invite${de ? "&lang=de" : ""}`);

  const store = await cookies();
  const result = await claimSeatByInviteCode(code, account, store.get(KF_UID_COOKIE)?.value ?? null);
  if (!result.ok) redirect(`${back}&err=${result.reason}`);

  redirect(de ? "/de/teams?joined=1" : "/teams?joined=1");
}
