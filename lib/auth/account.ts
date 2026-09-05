import type { Account } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { normalizeEmail } from "./email";

// Unified accounts — account lookup/creation (docs/UNIFIED_ACCOUNTS_PLAN.md).
// Stage 1 provides the primitives; sign-in (stage 2) and the claim/merge of
// existing kf_uid players (stage 3) build on these.

export { normalizeEmail, isValidEmail } from "./email";

/** Find the account for an email, creating it (unverified) if absent. */
export async function findOrCreateAccount(rawEmail: string): Promise<Account> {
  const email = normalizeEmail(rawEmail);
  return prisma.account.upsert({
    where: { email },
    update: {},
    create: { email },
  });
}

export async function findAccountByEmail(rawEmail: string): Promise<Account | null> {
  return prisma.account.findUnique({ where: { email: normalizeEmail(rawEmail) } });
}

export async function markEmailVerified(accountId: string): Promise<Account> {
  return prisma.account.update({
    where: { id: accountId },
    data: { emailVerifiedAt: new Date() },
  });
}
