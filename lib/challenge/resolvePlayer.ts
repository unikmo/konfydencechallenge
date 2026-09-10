import { randomUUID } from "crypto";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateSessionToken } from "@/lib/auth/session";
import { claimPlayerForAccount } from "@/lib/auth/claim";
import { SESSION_COOKIE_NAME } from "@/lib/auth/tokens";
import { ensureVisitorUser } from "@/lib/challenge/startSessionUtil";
import { activeEntitlementWhere } from "@/lib/commerce/entitlementAccess";
import { KF_UID_COOKIE } from "@/lib/challenge/kfUidCookie";

export type ResolvedPlayer = {
  /** The User row id that owns this request's challenge sessions / entitlements. */
  playerId: string;
  /** The confirmed account, if the request is signed in with one. */
  accountId: string | null;
  /** True only for a signed-in account whose email is verified (code or purchase). */
  verified: boolean;
  /**
   * The value the kf_uid cookie should be set to on the response, or null to
   * leave it untouched. Callers that issue a redirect must apply this.
   */
  kfUidToSet: string | null;
};

/**
 * Resolve the challenge player for the current request, account-first:
 *   - signed in  -> the account's consolidated player (kf_uid re-pointed to it)
 *   - signed out -> the kf_uid cookie's guest player (a fresh cookie if absent)
 *
 * This is what makes progress / results / purchases survive a cache clear: a
 * signed-in visitor always lands on their real player, whatever the cookie says.
 */
export async function resolveChallengePlayer(request: NextRequest): Promise<ResolvedPlayer> {
  const cookieKfUid = request.cookies.get(KF_UID_COOKIE)?.value ?? null;
  const sessionToken = request.cookies.get(SESSION_COOKIE_NAME)?.value ?? null;

  if (sessionToken) {
    const { account } = await validateSessionToken(sessionToken);
    if (account) {
      const playerId = await claimPlayerForAccount(account, cookieKfUid);
      return {
        playerId,
        accountId: account.id,
        verified: account.emailVerifiedAt != null,
        kfUidToSet: playerId === cookieKfUid ? null : playerId,
      };
    }
  }

  const kfUid = cookieKfUid ?? randomUUID();
  await ensureVisitorUser(kfUid);
  return {
    playerId: kfUid,
    accountId: null,
    verified: false,
    kfUidToSet: cookieKfUid ? null : kfUid,
  };
}

/** Whether the resolved player has current full access to an edition. */
export async function hasEditionAccess(playerId: string, edition: string): Promise<boolean> {
  const row = await prisma.entitlement.findFirst({
    where: {
      userId: playerId,
      AND: [
        activeEntitlementWhere(),
        { OR: [{ tier: "unlimited" }, { tier: "team" }, { tier: "single", edition }] },
      ],
    },
    select: { id: true },
  });
  return row != null;
}
