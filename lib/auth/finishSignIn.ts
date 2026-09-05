import { cookies, headers } from "next/headers";
import type { Account } from "@prisma/client";
import { createSession, setSessionCookie, hashIp } from "./session";
import { getClientIp } from "./request";
import { claimPlayerForAccount } from "./claim";
import { linkLockscreenSubscriptions } from "@/lib/lockscreens/linkToAccount";
import { KF_UID_COOKIE, KF_UID_COOKIE_OPTIONS } from "@/lib/challenge/kfUidCookie";

// Shared final step of every sign-in path (email code, magic link, passkey,
// TOTP): create the session, consolidate the challenge player, link any
// Lockscreens subscription, re-point kf_uid. Server-action context only
// (needs cookies() write access).
export async function finishSignInAction(account: Account): Promise<void> {
  const hdrs = await headers();
  const store = await cookies();
  const ip = getClientIp(hdrs);

  const { token, expiresAt } = await createSession(account.id, {
    userAgent: hdrs.get("user-agent"),
    ipHash: hashIp(ip),
  });
  await setSessionCookie(token, expiresAt);

  const canonicalPlayerId = await claimPlayerForAccount(account, store.get(KF_UID_COOKIE)?.value ?? null);
  store.set(KF_UID_COOKIE, canonicalPlayerId, KF_UID_COOKIE_OPTIONS);
  await linkLockscreenSubscriptions(account);
}
