import type { Account } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { findOrCreateAccount, markEmailVerified } from "@/lib/auth/account";
import { claimPlayerForAccount } from "@/lib/auth/claim";
import { normalizeEmail, isValidEmail } from "@/lib/auth/email";

// Make a purchase recoverable. A Stripe checkout collects the buyer's email;
// without this the entitlement / subscription is tied only to the kf_uid
// device cookie and is lost on a cookie clear or a new device.
//
// A completed card purchase confirms the buyer's email (Stripe collected it,
// billed the card, and sends the receipt there) — the account is marked
// verified, so the buyer is a confirmed user with no extra code step. The
// challenge/lockscreen access is then anchored to the account, not the
// kf_uid cookie, and survives a cache clear.
//
// These run from the Stripe webhook (server-authoritative, no cookie context).
// The buyer's device is signed in separately by /api/challenge/claim-purchase.

/** Resolve or create the (verified) account for a checkout email. Null if unusable. */
export async function ensurePurchaseAccount(rawEmail: string | null | undefined): Promise<Account | null> {
  const email = normalizeEmail(rawEmail ?? "");
  if (!isValidEmail(email) || email.length > 254) return null;
  const account = await findOrCreateAccount(email);
  if (account.emailVerifiedAt) return account;
  return markEmailVerified(account.id);
}

/** Challenge purchase → account + consolidate the kf_uid player onto it. */
export async function linkChallengePurchase(input: {
  email?: string | null;
  kfUid?: string | null;
}): Promise<Account | null> {
  const account = await ensurePurchaseAccount(input.email);
  if (!account) return null;
  await claimPlayerForAccount(account, input.kfUid?.trim() || null);
  return account;
}

/** Home / Teen subscription → account + direct link of the tenant just created. */
export async function linkLockscreenPurchase(input: {
  email?: string | null;
  tenantId: string;
}): Promise<Account | null> {
  const account = await ensurePurchaseAccount(input.email);
  if (!account) return null;
  await prisma.lockscreenTenant.updateMany({
    where: { id: input.tenantId, accountId: null },
    data: { accountId: account.id },
  });
  return account;
}
