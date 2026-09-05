import type { Account } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { normalizeEmail } from "@/lib/auth/email";

// Unified accounts — stage 4. Link a Lockscreens subscription to a Konfydence
// account when the account's verified email matches the tenant's contact
// email. A verified-email match is reasonable proof of ownership for a
// subscription the person bought; the emailed admin/delivery link keeps
// working regardless.

/**
 * Attach any unlinked LockscreenTenant whose contactEmail matches this
 * account's (verified) email. Returns the number linked. No-op if the
 * account's email is not yet verified.
 */
export async function linkLockscreenSubscriptions(account: Account): Promise<number> {
  if (!account.emailVerifiedAt) return 0;
  const email = normalizeEmail(account.email);

  const candidates = await prisma.lockscreenTenant.findMany({
    where: { accountId: null },
    select: { id: true, contactEmail: true },
  });
  const toLink = candidates.filter((t) => normalizeEmail(t.contactEmail) === email).map((t) => t.id);
  if (toLink.length === 0) return 0;

  const { count } = await prisma.lockscreenTenant.updateMany({
    where: { id: { in: toLink } },
    data: { accountId: account.id },
  });
  return count;
}

export type AccountSubscription = {
  id: string;
  kind: string;
  kindLabel: string;
  orgName: string;
  tokenStatus: string;
  managePath: string;
  manageLabel: string;
  termEnd: Date | null;
};

const KIND_LABEL: Record<string, string> = {
  workplace: "Workplace",
  school: "Schools",
  home: "Home",
  teen: "Teen Home",
};

export function subscriptionKindLabel(kind: string): string {
  return KIND_LABEL[kind] ?? kind;
}

export async function getAccountSubscriptions(accountId: string): Promise<AccountSubscription[]> {
  const tenants = await prisma.lockscreenTenant.findMany({
    where: { accountId },
    select: {
      id: true,
      kind: true,
      orgName: true,
      tokenStatus: true,
      adminToken: true,
      token: true,
      termEnd: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
  return tenants.map((t) => {
    const isManaged = t.kind === "workplace" || t.kind === "school";
    return {
      id: t.id,
      kind: t.kind,
      kindLabel: subscriptionKindLabel(t.kind),
      orgName: t.orgName,
      tokenStatus: t.tokenStatus,
      managePath: isManaged
        ? `/lockscreens/${t.kind}/admin/${t.adminToken}`
        : `/lockscreens/screen/${t.token}`,
      manageLabel: isManaged ? "Manage screens" : "Open lock screen",
      termEnd: t.termEnd,
    };
  });
}
