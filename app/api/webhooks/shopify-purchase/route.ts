import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { prisma } from "@/lib/prisma";

type ShopifyNoteAttribute = { name?: string; value?: string };
type ShopifyLineItem = { id?: string | number; sku?: string | null };
type ShopifyCustomer = { email?: string | null };
type ShopifyOrder = {
  id?: string | number;
  note_attributes?: ShopifyNoteAttribute[];
  customer?: ShopifyCustomer | null;
  line_items?: ShopifyLineItem[];
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
  const kfUid = order.note_attributes?.find((attr) => attr.name === "konfydenceUserId")?.value;
  const customerEmail = order.customer?.email || undefined;

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
  const entitlement = await prisma.entitlement.findUnique({ where: { shopifyOrderId } });
  if (!entitlement) return;
  await prisma.entitlement.update({
    where: { id: entitlement.id },
    data: { status: "revoked" },
  });
}
