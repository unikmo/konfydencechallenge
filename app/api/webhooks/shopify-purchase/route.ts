import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { prisma } from "@/lib/prisma";
import { generateGiftCode } from "@/lib/gift";
import { sendTransactionalEmail, escapeHtml } from "@/lib/email";
import { createPersonalLockscreenTenant, revokePersonalLockscreenTenant, type PersonalTrack } from "@/lib/lockscreens/personalOrderService";

type ShopifyNoteAttribute = { name?: string; value?: string };
type ShopifyLineItem = { id?: string | number; sku?: string | null };
type ShopifyCustomer = { email?: string | null; first_name?: string | null; last_name?: string | null };
type ShopifyOrder = {
  id?: string | number;
  note_attributes?: ShopifyNoteAttribute[];
  customer?: ShopifyCustomer | null;
  line_items?: ShopifyLineItem[];
  // Present on Shopify subscription-contract billing orders (renewals);
  // the initial checkout order does not carry this value.
  source_name?: string | null;
};
type ShopifyRefund = {
  order_id?: string | number;
  order?: { id?: string | number } | null;
};

function verifySignature(bodyText: string, signature: string, secret: string): boolean {
  const digest = createHmac("sha256", secret).update(bodyText, "utf8").digest("base64");
  const digestBuf = Buffer.from(digest, "base64");
  const signatureBuf = Buffer.from(signature, "base64");
  if (digestBuf.length !== signatureBuf.length) return false;
  return timingSafeEqual(digestBuf, signatureBuf);
}

function getEditionFromSku(sku: string): string | null {
  const match = sku.match(/^CHAL-SINGLE-(.+)$/);
  return match ? match[1].toLowerCase() : null;
}

function asOrder(payload: unknown): ShopifyOrder {
  if (!payload || typeof payload !== "object") return {};
  return payload as ShopifyOrder;
}

function asRefund(payload: unknown): ShopifyRefund {
  if (!payload || typeof payload !== "object") return {};
  return payload as ShopifyRefund;
}

export async function POST(request: NextRequest) {
  try {
    const secret = process.env.SHOPIFY_WEBHOOK_SECRET;
    if (!secret) {
      console.error("SHOPIFY_WEBHOOK_SECRET not configured");
      return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
    }

    const bodyText = await request.text();
    const signature = request.headers.get("X-Shopify-Hmac-Sha256") || "";
    if (!verifySignature(bodyText, signature, secret)) {
      console.error("Invalid webhook signature");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let payload: unknown;
    try {
      payload = JSON.parse(bodyText) as unknown;
    } catch {
      return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
    }

    const topic = request.headers.get("X-Shopify-Topic") || "";
    if (topic === "orders/paid") {
      await handleOrderPaid(asOrder(payload));
    } else if (topic === "orders/cancelled") {
      await handleOrderCancelled(asOrder(payload));
    } else if (topic === "refunds/create") {
      await handleRefund(asRefund(payload));
    }

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

async function handleOrderPaid(order: ShopifyOrder) {
  if (order.id === undefined || order.id === null) {
    console.error("Paid order webhook is missing order id");
    return;
  }

  const shopifyOrderId = String(order.id);
  const attr = (name: string) => order.note_attributes?.find((a) => a.name === name)?.value;
  const kfUid = attr("konfydenceUserId");
  const customerEmail = order.customer?.email || undefined;

  const digitalChallengeSkus = (order.line_items || [])
    .map((li) => li.sku)
    .filter((s): s is string => typeof s === "string" && s.startsWith("CHAL-"));

  if (attr("isGift") === "true") {
    await handleGiftOrder(shopifyOrderId, attr("giftToEmail"), attr("giftFromName"), attr("giftMessage"), digitalChallengeSkus, customerEmail);
    return;
  }

  const personalLockscreenSku = (order.line_items || [])
    .map((li) => li.sku)
    .find((sku): sku is string => sku === "LOCKSCREENS-HOME" || sku === "LOCKSCREENS-TEEN");
  if (personalLockscreenSku) {
    await handlePersonalLockscreenOrder(shopifyOrderId, personalLockscreenSku, order);
    return;
  }

  if (!kfUid && !customerEmail) {
    console.log("Order has no Konfydence user id or email, skipping", shopifyOrderId);
    return;
  }

  let user = kfUid ? await prisma.user.findFirst({ where: { id: kfUid } }) : null;
  if (!user && customerEmail) {
    user = await prisma.user.upsert({
      where: { email: customerEmail },
      update: {},
      create: { email: customerEmail },
    });
  }
  if (!user) {
    console.log("Cannot determine user for order", shopifyOrderId);
    return;
  }

  const digitalSkus = (order.line_items || [])
    .map((lineItem) => lineItem.sku)
    .filter((sku): sku is string => typeof sku === "string" && sku.startsWith("CHAL-"));

  if (!digitalSkus.length) {
    for (const lineItem of order.line_items || []) {
      if (typeof lineItem.sku === "string" && lineItem.sku.startsWith("KG-")) {
        console.log(`Physical item purchased: ${lineItem.sku}`);
      }
    }
    return;
  }

  // The current storefront creates one digital-challenge SKU per checkout.
  // If Shopify ever delivers more than one challenge SKU in one order, fail
  // closed instead of silently granting the wrong edition under the schema's
  // one-order/one-entitlement invariant.
  if (digitalSkus.length !== 1) {
    console.error("Order contains multiple digital challenge SKUs; manual review required", {
      shopifyOrderId,
      digitalSkus,
    });
    return;
  }

  const sku = digitalSkus[0];
  const tier = sku === "CHAL-UNLIMITED" || sku === "CHAL-UPGRADE" ? "unlimited" : "single";
  const edition = tier === "single" ? getEditionFromSku(sku) : null;
  if (tier === "single" && !edition) {
    console.error("Unknown single-edition challenge SKU", sku);
    return;
  }

  await prisma.entitlement.upsert({
    where: { shopifyOrderId },
    update: { status: "active", tier, edition },
    create: {
      userId: user.id,
      tier,
      edition,
      shopifyOrderId,
      status: "active",
    },
  });
}

async function handlePersonalLockscreenOrder(shopifyOrderId: string, sku: string, order: ShopifyOrder) {
  const customerEmail = order.customer?.email;
  if (!customerEmail) {
    console.error("Personal lockscreens order missing customer email", shopifyOrderId);
    return;
  }
  const track: PersonalTrack = sku === "LOCKSCREENS-HOME" ? "home" : "teen";
  const nameParts = [order.customer?.first_name, order.customer?.last_name].filter(Boolean);
  const contactName = nameParts.length ? nameParts.join(" ") : null;
  const isRenewal = order.source_name === "subscription_contract";

  await createPersonalLockscreenTenant({
    track,
    shopifyOrderId,
    contactEmail: customerEmail,
    contactName,
    isRenewal,
  });
}

async function handleGiftOrder(
  shopifyOrderId: string,
  toEmailRaw: string | undefined,
  fromName: string | undefined,
  message: string | undefined,
  challengeSkus: string[],
  fromEmail: string | undefined,
) {
  const toEmail = (toEmailRaw || "").trim().toLowerCase();
  if (!toEmail) {
    console.error("Gift order missing recipient email", shopifyOrderId);
    return;
  }
  if (challengeSkus.length !== 1) {
    console.error("Gift order must contain exactly one challenge SKU", { shopifyOrderId, challengeSkus });
    return;
  }
  const sku = challengeSkus[0];
  const tier = sku === "CHAL-UNLIMITED" ? "unlimited" : "single";
  const edition = tier === "single" ? getEditionFromSku(sku) : null;
  if (tier === "single" && !edition) {
    console.error("Gift order has unknown single-edition SKU", sku);
    return;
  }

  const existing = await prisma.giftCode.findUnique({ where: { shopifyOrderId } });
  if (existing) {
    console.log("Gift code already issued for order", shopifyOrderId);
    return;
  }

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
      shopifyOrderId,
      fromName: fromName?.slice(0, 80) || null,
      fromEmail: fromEmail || null,
      toEmail,
      message: message?.slice(0, 500) || null,
      status: "issued",
    },
  });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://konfydence.com";
  const redeemUrl = `${appUrl}/gift/redeem?code=${encodeURIComponent(code)}`;
  const editionLabel = tier === "unlimited" ? "all five Konfydence Challenges" : `the ${edition} Konfydence Challenge`;
  const fromLine = fromName ? `${escapeHtml(fromName)} has sent you a gift.` : "Someone has sent you a gift.";
  const note = message
    ? `<p style="margin:16px 0;padding:12px 16px;border-left:3px solid #af8752;background:#f7f4ee;">${escapeHtml(message)}</p>`
    : "";

  await sendTransactionalEmail({
    to: toEmail,
    subject: "You've been gifted a Konfydence Challenge",
    replyTo: fromEmail,
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
}

async function handleOrderCancelled(order: ShopifyOrder) {
  if (order.id === undefined || order.id === null) return;
  await revokeOrderEntitlement(String(order.id));
}

async function handleRefund(refund: ShopifyRefund) {
  const orderId = refund.order_id ?? refund.order?.id;
  if (orderId === undefined || orderId === null) return;
  await revokeOrderEntitlement(String(orderId));
}

async function revokeOrderEntitlement(shopifyOrderId: string) {
  await revokePersonalLockscreenTenant(shopifyOrderId);

  const entitlement = await prisma.entitlement.findUnique({ where: { shopifyOrderId } });
  if (entitlement) {
    await prisma.entitlement.update({
      where: { id: entitlement.id },
      data: { status: "revoked" },
    });
  }

  // Gift orders: revoke the unredeemed code, or the entitlement it was redeemed into.
  const gift = await prisma.giftCode.findUnique({ where: { shopifyOrderId } });
  if (gift && gift.status !== "revoked") {
    await prisma.giftCode.update({ where: { id: gift.id }, data: { status: "revoked" } });
    if (gift.status === "redeemed") {
      const redeemed = await prisma.entitlement.findUnique({
        where: { shopifyOrderId: `gift:${gift.code}` },
      });
      if (redeemed) {
        await prisma.entitlement.update({ where: { id: redeemed.id }, data: { status: "revoked" } });
      }
    }
  }
}
