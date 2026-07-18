import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";
import { prisma } from "@/lib/prisma";

async function verifyWebhookSignature(
  request: NextRequest,
  secret: string
): Promise<boolean> {
  const signature = request.headers.get("X-Shopify-Hmac-Sha256") || "";
  const body = await request.text();

  const hmac = createHmac("sha256", secret);
  hmac.update(body, "utf8");
  const digest = hmac.digest("base64");

  return digest === signature;
}

function getEditionFromSku(sku: string): string | null {
  const match = sku.match(/^CHAL-SINGLE-(.+)$/);
  if (match) {
    return match[1].toLowerCase();
  }
  return null;
}

export async function POST(request: NextRequest) {
  try {
    const secret = process.env.SHOPIFY_WEBHOOK_SECRET;
    if (!secret) {
      console.error("SHOPIFY_WEBHOOK_SECRET not configured");
      return NextResponse.json(
        { error: "Webhook not configured" },
        { status: 500 }
      );
    }

    // Verify signature BEFORE parsing body
    const isValid = await verifyWebhookSignature(request, secret);
    if (!isValid) {
      console.error("Invalid webhook signature");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const topic = request.headers.get("X-Shopify-Topic") || "";
    const body = await request.json();

    if (topic === "orders/paid") {
      await handleOrderPaid(body);
    } else if (topic === "orders/cancelled") {
      await handleOrderCancelled(body);
    } else if (topic === "refunds/create") {
      await handleRefund(body);
    }

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function handleOrderPaid(order: any) {
  const shopifyOrderId = order.id.toString();
  const kfUid = order.note_attributes?.find(
    (attr: any) => attr.name === "konfydenceUserId"
  )?.value;
  const customerEmail = order.customer?.email;

  if (!kfUid && !customerEmail) {
    console.log("Order has no kf_uid or email, skipping");
    return;
  }

  // Find or create user
  let user = null;
  if (kfUid) {
    user = await prisma.user.findFirst({
      where: { id: kfUid },
    });
  }

  if (!user && customerEmail) {
    user = await prisma.user.upsert({
      where: { email: customerEmail },
      update: {},
      create: { email: customerEmail },
    });
  }

  if (!user) {
    // Fallback: create user with email derived from order
    if (!customerEmail) {
      console.log("Cannot determine user for order", shopifyOrderId);
      return;
    }
    user = await prisma.user.create({
      data: { email: customerEmail },
    });
  }

  // Process line items
  for (const lineItem of order.line_items || []) {
    const sku = lineItem.sku;

    if (sku.startsWith("CHAL-")) {
      // Digital challenge - create entitlement
      let tier = "single";
      let edition = null;

      if (sku === "CHAL-UNLIMITED" || sku === "CHAL-UPGRADE") {
        tier = "unlimited";
      } else {
        edition = getEditionFromSku(sku);
      }

      // Upsert to prevent duplicates on webhook retry
      await prisma.entitlement.upsert({
        where: { shopifyOrderId },
        update: { status: "active" },
        create: {
          userId: user.id,
          tier,
          edition,
          shopifyOrderId,
          status: "active",
        },
      });
    } else if (sku.startsWith("KG-")) {
      // Physical item - just log, no entitlement
      console.log(`Physical item purchased: ${sku}`);
    }
  }
}

async function handleOrderCancelled(order: any) {
  const shopifyOrderId = order.id.toString();

  const entitlement = await prisma.entitlement.findUnique({
    where: { shopifyOrderId },
  });

  if (entitlement) {
    await prisma.entitlement.update({
      where: { id: entitlement.id },
      data: { status: "revoked" },
    });
  }
}

async function handleRefund(refund: any) {
  // Refund webhook includes the order
  const order = refund.order || {};
  const shopifyOrderId = order.id?.toString();

  if (shopifyOrderId) {
    const entitlement = await prisma.entitlement.findUnique({
      where: { shopifyOrderId },
    });

    if (entitlement) {
      await prisma.entitlement.update({
        where: { id: entitlement.id },
        data: { status: "revoked" },
      });
    }
  }
}
