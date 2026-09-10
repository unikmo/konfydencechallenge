import type { Prisma } from "@prisma/client";

// An entitlement grants access only while it is active AND not lapsed.
// expiresAt NULL = never expires (legacy one-time unlocks / pre-annual gifts).
// Annual subscriptions and Teams seats set expiresAt and push it forward on
// renewal; a cancelled subscription simply lets it lapse.
export function activeEntitlementWhere(now: Date = new Date()): Prisma.EntitlementWhereInput {
  return {
    status: "active",
    OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
  };
}
