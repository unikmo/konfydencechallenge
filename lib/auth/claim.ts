import type { Account } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { isGuestEmail } from "@/lib/challenge/startSessionUtil";

// Unified accounts — claim/merge existing challenge history on sign-in
// (docs/UNIFIED_ACCOUNTS_PLAN.md, stage 3).
//
// A player has been identified three ways historically:
//   - anonymous kf_uid cookie -> User row with a guest email
//   - /challenge/register     -> User.email set to a real address
//   - stage-2 results gate    -> same, plus User.accountId linked
//
// On sign-in we consolidate onto ONE User row for the account and return its
// id so the caller can point the kf_uid cookie at it (keeping every cookie-
// based read working without a rewrite elsewhere).

async function movePlayerData(fromUserId: string, toUserId: string): Promise<void> {
  if (fromUserId === toUserId) return;
  // Entitlement.shopifyOrderId is globally unique, so the same order can never
  // sit on both users — a plain re-point is safe, no dedupe needed.
  await prisma.$transaction([
    prisma.challengeSession.updateMany({ where: { userId: fromUserId }, data: { userId: toUserId } }),
    prisma.entitlement.updateMany({ where: { userId: fromUserId }, data: { userId: toUserId } }),
  ]);
  await prisma.user.delete({ where: { id: fromUserId } }).catch(() => {});
}

/**
 * Consolidate challenge history onto one User for `account` and return that
 * User's id. Pass the current kf_uid cookie value if present.
 */
export async function claimPlayerForAccount(account: Account, kfUid: string | null): Promise<string> {
  const linkedPlayer = await prisma.user.findFirst({
    where: { accountId: account.id },
    select: { id: true, email: true },
  });
  const emailPlayer = await prisma.user.findUnique({
    where: { email: account.email },
    select: { id: true, accountId: true },
  });
  const cookiePlayer = kfUid
    ? await prisma.user.findUnique({ where: { id: kfUid }, select: { id: true, email: true, accountId: true } })
    : null;

  // Choose the canonical row: prefer the one already linked to this account,
  // then the email-matched row, then the anonymous cookie row.
  const canonicalId = linkedPlayer?.id ?? emailPlayer?.id ?? cookiePlayer?.id ?? null;

  if (!canonicalId) {
    // Fresh device, no history at all — make a player for the account.
    const created = await prisma.user.create({
      data: { email: account.email, accountId: account.id },
      select: { id: true },
    });
    return created.id;
  }

  // Fold the email-matched row in (if distinct and not itself the canonical).
  if (emailPlayer && emailPlayer.id !== canonicalId) {
    await movePlayerData(emailPlayer.id, canonicalId);
  }

  // Fold the anonymous cookie row in — but only if it is genuinely anonymous
  // (guest email, unlinked). A cookie row already tied to a different account
  // or a different real email belongs to someone else; leave it alone.
  if (
    cookiePlayer &&
    cookiePlayer.id !== canonicalId &&
    !cookiePlayer.accountId &&
    isGuestEmail(cookiePlayer.email)
  ) {
    await movePlayerData(cookiePlayer.id, canonicalId);
  }

  await prisma.user.update({
    where: { id: canonicalId },
    data: { email: account.email, accountId: account.id },
  });

  return canonicalId;
}
