import type { Account, Org, OrgSeat } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { grantChallengeEntitlement } from "@/lib/commerce/fulfilment";
import { claimPlayerForAccount } from "@/lib/auth/claim";
import { normalizeEmail, isValidEmail } from "@/lib/auth/email";
import { sendTransactionalEmail, escapeHtml } from "@/lib/email";
import type { ChallengeEdition } from "@/lib/challenge/labels";
import { computeChallengeTotals } from "@/lib/scoring/scoringEngine";

// Challenge Teams — an org buys N seats (Stripe subscription, $4.99/seat/year).
// Each claimed seat grants the member an all-editions ("team") entitlement that
// tracks the org's term. The admin (owner) sees per-name completion.
//
// The seat entitlement's idempotency key is "org_seat_<seatId>" so a renewal,
// a re-claim or a webhook retry all land on the same row.

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://konfydence.com";
const INVITE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const YEAR_MS = 366 * 24 * 60 * 60 * 1000;

export const ALL_EDITIONS: ChallengeEdition[] = [
  "travelsafe",
  "school",
  "university",
  "family",
  "workplace",
];

export function generateInviteCode(): string {
  let code = "";
  for (let i = 0; i < 8; i++) code += INVITE_ALPHABET[Math.floor(Math.random() * INVITE_ALPHABET.length)];
  return code;
}

/** The org this account owns (admin), if any. */
export async function orgOwnedBy(accountId: string): Promise<Org | null> {
  return prisma.org.findFirst({ where: { ownerAccountId: accountId } });
}

/** The active seat this account holds, with its org, if any. */
export async function seatFor(accountId: string): Promise<(OrgSeat & { org: Org }) | null> {
  return prisma.orgSeat.findFirst({
    where: { accountId, status: "active" },
    include: { org: true },
  });
}

/** The canonical challenge player id for an account (creating one if needed). */
async function canonicalPlayerId(account: Account): Promise<string> {
  const existing = await prisma.user.findFirst({ where: { accountId: account.id }, select: { id: true } });
  if (existing) return existing.id;
  return claimPlayerForAccount(account, null);
}

type CreateOrgInput = {
  name: string;
  ownerAccount: Account;
  ownerKfUid?: string | null;
  seatCount: number;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string;
  termEnd: Date;
};

/** Idempotent on stripeSubscriptionId. Creates the org, its seats, and the
 *  owner's own (seat #1) entitlement. */
export async function createOrgFromSubscription(input: CreateOrgInput): Promise<Org> {
  const existing = await prisma.org.findUnique({ where: { stripeSubscriptionId: input.stripeSubscriptionId } });
  if (existing) return existing;

  const seatCount = Math.max(1, Math.floor(input.seatCount));
  const org = await prisma.org.create({
    data: {
      name: input.name.trim().slice(0, 120) || "My team",
      ownerAccountId: input.ownerAccount.id,
      seatCount,
      stripeCustomerId: input.stripeCustomerId,
      stripeSubscriptionId: input.stripeSubscriptionId,
      termEnd: input.termEnd,
      status: "active",
      inviteCode: await uniqueInviteCode(),
    },
  });

  await prisma.orgSeat.createMany({
    data: Array.from({ length: seatCount }, () => ({ orgId: org.id, status: "open" })),
  });

  // Seat #1 → the buyer.
  const firstSeat = await prisma.orgSeat.findFirst({ where: { orgId: org.id }, orderBy: { createdAt: "asc" } });
  if (firstSeat) {
    await prisma.orgSeat.update({
      where: { id: firstSeat.id },
      data: { accountId: input.ownerAccount.id, status: "active", claimedAt: new Date() },
    });
    await grantSeatEntitlement(firstSeat.id, org, input.ownerAccount, input.ownerKfUid ?? null);
  }

  return org;
}

async function uniqueInviteCode(): Promise<string> {
  for (let i = 0; i < 6; i++) {
    const code = generateInviteCode();
    const clash = await prisma.org.findUnique({ where: { inviteCode: code } });
    if (!clash) return code;
  }
  return generateInviteCode();
}

async function grantSeatEntitlement(
  seatId: string,
  org: Org,
  account: Account,
  kfUid: string | null,
): Promise<void> {
  const playerId = await canonicalPlayerId(account);
  await grantChallengeEntitlement({
    sourceOrderId: `org_seat_${seatId}`,
    source: "stripe",
    kfUid: playerId,
    email: account.email,
    tier: "team",
    edition: null,
    expiresAt: org.termEnd ?? new Date(Date.now() + YEAR_MS),
    stripeSubscriptionId: org.stripeSubscriptionId,
    orgId: org.id,
  });
  // Best-effort: fold in whatever anonymous history sits on this device.
  if (kfUid && kfUid !== playerId) {
    await claimPlayerForAccount(account, kfUid).catch(() => {});
  }
}

export type ClaimResult =
  | { ok: true; alreadyMember?: boolean }
  | { ok: false; reason: "not_found" | "inactive" | "full" };

/** A signed-in invitee claims a seat in the org identified by an invite code. */
export async function claimSeatByInviteCode(
  inviteCode: string,
  account: Account,
  kfUid: string | null,
): Promise<ClaimResult> {
  const org = await prisma.org.findUnique({ where: { inviteCode: inviteCode.trim().toUpperCase() } });
  if (!org) return { ok: false, reason: "not_found" };
  if (org.status === "cancelled") return { ok: false, reason: "inactive" };
  if (org.termEnd && org.termEnd.getTime() <= Date.now()) return { ok: false, reason: "inactive" };

  const mine = await prisma.orgSeat.findFirst({ where: { orgId: org.id, accountId: account.id } });
  if (mine && mine.status === "active") {
    await grantSeatEntitlement(mine.id, org, account, kfUid);
    return { ok: true, alreadyMember: true };
  }

  // Prefer a seat this person was explicitly invited to, else any open seat.
  const seat =
    (await prisma.orgSeat.findFirst({
      where: { orgId: org.id, status: "invited", inviteEmail: account.email },
    })) ??
    (await prisma.orgSeat.findFirst({ where: { orgId: org.id, status: "open" }, orderBy: { createdAt: "asc" } }));
  if (!seat) return { ok: false, reason: "full" };

  await prisma.orgSeat.update({
    where: { id: seat.id },
    data: { accountId: account.id, status: "active", claimedAt: new Date(), inviteEmail: null },
  });
  await grantSeatEntitlement(seat.id, org, account, kfUid);
  return { ok: true };
}

/** Owner removes a member: frees the seat and revokes their team entitlement. */
export async function removeSeatMember(org: Org, seatId: string): Promise<void> {
  const seat = await prisma.orgSeat.findFirst({ where: { id: seatId, orgId: org.id } });
  if (!seat) return;
  if (seat.accountId === org.ownerAccountId) return; // never remove the admin's own seat here

  await prisma.entitlement.updateMany({
    where: { shopifyOrderId: `org_seat_${seatId}` },
    data: { status: "revoked" },
  });
  await prisma.orgSeat.update({
    where: { id: seatId },
    data: { accountId: null, status: "open", claimedAt: null, inviteEmail: null },
  });
}

export type InviteReport = { invited: string[]; skipped: string[]; noCapacity: string[] };

/** Owner invites people by email — each takes an open seat and gets a mail. */
export async function inviteToSeats(org: Org, rawEmails: string[]): Promise<InviteReport> {
  const report: InviteReport = { invited: [], skipped: [], noCapacity: [] };
  const seen = new Set<string>();

  for (const raw of rawEmails) {
    const email = normalizeEmail(raw);
    if (!isValidEmail(email) || email.length > 254 || seen.has(email)) continue;
    seen.add(email);

    const acct = await prisma.account.findUnique({ where: { email }, select: { id: true } });
    const held = await prisma.orgSeat.findFirst({
      where: {
        orgId: org.id,
        OR: [{ inviteEmail: email }, ...(acct ? [{ accountId: acct.id }] : [])],
      },
    });
    if (held) {
      report.skipped.push(email);
      continue;
    }

    const open = await prisma.orgSeat.findFirst({
      where: { orgId: org.id, status: "open" },
      orderBy: { createdAt: "asc" },
    });
    if (!open) {
      report.noCapacity.push(email);
      continue;
    }

    await prisma.orgSeat.update({
      where: { id: open.id },
      data: { status: "invited", inviteEmail: email },
    });
    await sendInviteEmail(org, email);
    report.invited.push(email);
  }

  return report;
}

async function sendInviteEmail(org: Org, to: string): Promise<void> {
  const joinUrl = `${APP_URL}/teams/join?code=${encodeURIComponent(org.inviteCode)}`;
  await sendTransactionalEmail({
    to,
    subject: `You've been added to ${org.name} on Konfydence`,
    tags: ["teams", "invite"],
    html: `
      <div style="font-family:Georgia,'Times New Roman',serif;color:#111417;max-width:520px;">
        <p style="font-size:18px;">${escapeHtml(org.name)} has given you a Konfydence Challenge seat.</p>
        <p>All five editions, unlimited rounds — a short, sharp way to build real scam-readiness.
        Your progress is private to you; your team admin sees completion, not your answers.</p>
        <p style="margin:24px 0;">
          <a href="${joinUrl}" style="background:#111417;color:#fffdf9;padding:12px 22px;text-decoration:none;border-radius:4px;display:inline-block;">Claim your seat</a>
        </p>
        <p style="font-size:13px;color:#66645f;">Or open ${APP_URL}/teams/join and enter code <strong>${escapeHtml(org.inviteCode)}</strong></p>
      </div>
    `,
  });
}

/** Grow or shrink the seat pool to match a new Stripe quantity. Never drops
 *  below the number of seats currently claimed. */
export async function reconcileSeatCount(orgId: string, targetCount: number): Promise<void> {
  const org = await prisma.org.findUnique({ where: { id: orgId }, include: { seats: true } });
  if (!org) return;
  const target = Math.max(1, Math.floor(targetCount));
  const total = org.seats.length;

  if (target > total) {
    await prisma.orgSeat.createMany({
      data: Array.from({ length: target - total }, () => ({ orgId, status: "open" })),
    });
  } else if (target < total) {
    const claimed = org.seats.filter((s) => s.status === "active").length;
    const removable = org.seats
      .filter((s) => s.status !== "active")
      .slice(0, total - Math.max(target, claimed))
      .map((s) => s.id);
    if (removable.length) {
      await prisma.orgSeat.deleteMany({ where: { id: { in: removable } } });
    }
  }

  const fresh = await prisma.orgSeat.count({ where: { orgId } });
  await prisma.org.update({ where: { id: orgId }, data: { seatCount: fresh } });
}

/** Push every live seat entitlement's expiry to a new term end. */
export async function extendSeatEntitlements(orgId: string, termEnd: Date): Promise<void> {
  await prisma.entitlement.updateMany({
    where: { orgId, status: "active" },
    data: { expiresAt: termEnd },
  });
}

// --- admin dashboard read model -------------------------------------------

export type EditionState =
  | { state: "done"; percent: number; level: string }
  | { state: "progress"; done: number; total: number }
  | { state: "none" };

export type MemberRow = {
  seatId: string;
  status: string; // active | invited | open
  email: string | null;
  isOwner: boolean;
  editions: Record<ChallengeEdition, EditionState>;
  completedCount: number;
};

export async function teamMemberRows(orgId: string): Promise<MemberRow[]> {
  const org = await prisma.org.findUnique({ where: { id: orgId } });
  const seats = await prisma.orgSeat.findMany({
    where: { orgId },
    orderBy: [{ status: "asc" }, { createdAt: "asc" }],
  });

  // OrgSeat has no Prisma relation to Account — join by accountId by hand.
  const accountIds = seats.map((s) => s.accountId).filter((id): id is string => id != null);
  const accounts = accountIds.length
    ? await prisma.account.findMany({
        where: { id: { in: accountIds } },
        select: { id: true, email: true, players: { select: { id: true } } },
      })
    : [];
  const accountById = new Map(accounts.map((a) => [a.id, a]));

  const playerToSeat = new Map<string, string>();
  for (const seat of seats) {
    const acct = seat.accountId ? accountById.get(seat.accountId) : null;
    for (const p of acct?.players ?? []) playerToSeat.set(p.id, seat.id);
  }
  const playerIds = [...playerToSeat.keys()];

  const sessions = playerIds.length
    ? await prisma.challengeSession.findMany({
        where: { userId: { in: playerIds }, mode: "full" },
        select: {
          userId: true,
          edition: true,
          status: true,
          scoreTotal: true,
          scoreMax: true,
          currentIndex: true,
          _count: { select: { cards: true } },
        },
      })
    : [];

  // seatId -> edition -> best state
  const bySeat = new Map<string, Record<string, EditionState>>();
  const rank = (s: EditionState) => (s.state === "done" ? 2 : s.state === "progress" ? 1 : 0);

  for (const s of sessions) {
    const seatId = playerToSeat.get(s.userId);
    if (!seatId) continue;
    const editions = bySeat.get(seatId) ?? {};
    let next: EditionState = { state: "none" };
    if (s.status === "COMPLETED" && s.scoreMax > 0) {
      const totals = computeChallengeTotals({ scoreTotal: s.scoreTotal, scoreMax: s.scoreMax });
      next = { state: "done", percent: Math.round(totals.totalPercent), level: totals.level };
    } else if (s.status === "IN_PROGRESS") {
      const total = s._count.cards || 12;
      next = { state: "progress", done: Math.min(s.currentIndex, total), total };
    }
    const current = editions[s.edition] ?? { state: "none" };
    if (rank(next) > rank(current) || (next.state === "done" && current.state === "done" && next.percent > current.percent)) {
      editions[s.edition] = next;
    }
    bySeat.set(seatId, editions);
  }

  return seats.map((seat) => {
    const editionMap = bySeat.get(seat.id) ?? {};
    const editions = Object.fromEntries(
      ALL_EDITIONS.map((e) => [e, editionMap[e] ?? ({ state: "none" } as EditionState)]),
    ) as Record<ChallengeEdition, EditionState>;
    return {
      seatId: seat.id,
      status: seat.status,
      email: (seat.accountId ? accountById.get(seat.accountId)?.email : null) ?? seat.inviteEmail ?? null,
      isOwner: seat.accountId != null && seat.accountId === org?.ownerAccountId,
      editions,
      completedCount: ALL_EDITIONS.filter((e) => editions[e].state === "done").length,
    };
  });
}
