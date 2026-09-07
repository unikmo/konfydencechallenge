// Provider-agnostic commerce fulfilment. Both the Stripe webhook
// (app/api/webhooks/stripe) and the legacy Shopify webhook
// (app/api/webhooks/shopify-purchase) call into here so the entitlement /
// gift-code / revoke semantics stay identical across the migration.
//
// `sourceOrderId` is the opaque, globally-unique idempotency key stored on
// Entitlement.shopifyOrderId / GiftCode.shopifyOrderId:
//   Stripe:  "stripe_cs_<checkout_session_id>"
//   Shopify: the numeric order id (legacy)
import { prisma } from "@/lib/prisma";
import { generateGiftCode } from "@/lib/gift";
import { sendTransactionalEmail, escapeHtml } from "@/lib/email";

export type ChallengeTier = "single" | "unlimited";

/** Resolve or create the challenge player this purchase belongs to. */
async function resolveUser(ref: { kfUid?: string | null; email?: string | null }) {
  const kfUid = ref.kfUid?.trim() || null;
  const email = ref.email?.trim().toLowerCase() || null;

  let user = kfUid ? await prisma.user.findFirst({ where: { id: kfUid } }) : null;
  if (!user && email) {
    user = await prisma.user.upsert({ where: { email }, update: {}, create: { email } });
  }
  return user;
}

export type GrantEntitlementInput = {
  sourceOrderId: string;
  source: "stripe" | "shopify";
  kfUid?: string | null;
  email?: string | null;
  tier: ChallengeTier;
  edition: string | null;
};

/** Idempotent on sourceOrderId (Entitlement.shopifyOrderId is @unique). */
export async function grantChallengeEntitlement(input: GrantEntitlementInput): Promise<"granted" | "skipped"> {
  const { sourceOrderId, source, tier } = input;
  const edition = tier === "single" ? input.edition : null;
  if (tier === "single" && !edition) {
    console.error("grantChallengeEntitlement: single tier with no edition", { sourceOrderId });
    return "skipped";
  }

  const user = await resolveUser({ kfUid: input.kfUid, email: input.email });
  if (!user) {
    console.error("grantChallengeEntitlement: cannot resolve a user", { sourceOrderId });
    return "skipped";
  }

  await prisma.entitlement.upsert({
    where: { shopifyOrderId: sourceOrderId },
    update: { status: "active", tier, edition },
    create: { userId: user.id, tier, edition, source, shopifyOrderId: sourceOrderId, status: "active" },
  });
  return "granted";
}

export type IssueGiftInput = {
  sourceOrderId: string;
  tier: ChallengeTier;
  edition: string | null;
  toEmail: string;
  fromName?: string | null;
  fromEmail?: string | null;
  message?: string | null;
};

/** Idempotent on sourceOrderId (GiftCode.shopifyOrderId is @unique). */
export async function issueGiftCode(input: IssueGiftInput): Promise<"issued" | "skipped"> {
  const { sourceOrderId, tier } = input;
  const edition = tier === "single" ? input.edition : null;
  const toEmail = (input.toEmail || "").trim().toLowerCase();
  if (!toEmail) {
    console.error("issueGiftCode: missing recipient email", { sourceOrderId });
    return "skipped";
  }
  if (tier === "single" && !edition) {
    console.error("issueGiftCode: single tier with no edition", { sourceOrderId });
    return "skipped";
  }

  const existing = await prisma.giftCode.findUnique({ where: { shopifyOrderId: sourceOrderId } });
  if (existing) return "skipped";

  let code = generateGiftCode();
  for (let attempt = 0; attempt < 5; attempt++) {
    const clash = await prisma.giftCode.findUnique({ where: { code } });
    if (!clash) break;
    code = generateGiftCode();
  }

  await prisma.giftCode.create({
    data: {
      code,
      tier,
      edition,
      shopifyOrderId: sourceOrderId,
      fromName: input.fromName?.slice(0, 80) || null,
      fromEmail: input.fromEmail || null,
      toEmail,
      message: input.message?.slice(0, 500) || null,
      status: "issued",
    },
  });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://konfydence.com";
  const redeemUrl = `${appUrl}/gift/redeem?code=${encodeURIComponent(code)}`;
  const editionLabel = tier === "unlimited" ? "all five Konfydence Challenges" : `the ${edition} Konfydence Challenge`;
  const fromLine = input.fromName ? `${escapeHtml(input.fromName)} has sent you a gift.` : "Someone has sent you a gift.";
  const note = input.message
    ? `<p style="margin:16px 0;padding:12px 16px;border-left:3px solid #af8752;background:#f7f4ee;">${escapeHtml(input.message)}</p>`
    : "";

  await sendTransactionalEmail({
    to: toEmail,
    subject: "You've been gifted a Konfydence Challenge",
    replyTo: input.fromEmail || undefined,
    tags: ["gift"],
    html: `
      <div style="font-family:Georgia,'Times New Roman',serif;color:#111417;max-width:520px;">
        <p style="font-size:18px;">${fromLine}</p>
        <p>You now have access to <strong>${escapeHtml(editionLabel)}</strong> — a short, sharp way to build real scam-readiness.</p>
        ${note}
        <p style="margin:24px 0;">
          <a href="${redeemUrl}" style="background:#111417;color:#fffdf9;padding:12px 22px;text-decoration:none;border-radius:4px;display:inline-block;">Claim your challenge</a>
        </p>
        <p style="font-size:13px;color:#66645f;">Or paste this code at ${appUrl}/gift/redeem — <strong>${code}</strong></p>
      </div>
    `,
  });
  return "issued";
}

/**
 * Revoke everything a source order granted: direct entitlement, gift code, and
 * (if the gift was already redeemed) the entitlement it became. Idempotent.
 */
export async function revokeSourceOrder(sourceOrderId: string): Promise<void> {
  const entitlement = await prisma.entitlement.findUnique({ where: { shopifyOrderId: sourceOrderId } });
  if (entitlement && entitlement.status !== "revoked") {
    await prisma.entitlement.update({ where: { id: entitlement.id }, data: { status: "revoked" } });
  }

  const gift = await prisma.giftCode.findUnique({ where: { shopifyOrderId: sourceOrderId } });
  if (gift && gift.status !== "revoked") {
    await prisma.giftCode.update({ where: { id: gift.id }, data: { status: "revoked" } });
    if (gift.status === "redeemed") {
      const redeemed = await prisma.entitlement.findUnique({ where: { shopifyOrderId: `gift:${gift.code}` } });
      if (redeemed && redeemed.status !== "revoked") {
        await prisma.entitlement.update({ where: { id: redeemed.id }, data: { status: "revoked" } });
      }
    }
  }
}

/**
 * Webhook idempotency guard. Returns true the first time an event id is seen,
 * false on every retry/duplicate. Shared by all providers.
 */
export async function claimWebhookEvent(id: string, type: string, provider = "stripe"): Promise<boolean> {
  try {
    await prisma.processedWebhookEvent.create({ data: { id, type, provider } });
    return true;
  } catch {
    return false; // unique-constraint violation → already processed
  }
}
