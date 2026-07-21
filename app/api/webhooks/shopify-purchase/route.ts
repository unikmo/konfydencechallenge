import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { prisma } from "@/lib/prisma";

// Takes the already-read body text + signature header directly, rather than
// the NextRequest itself. A Request's body stream can only be consumed ONCE —
// this function used to call request.text() internally, and the POST handler
// below separately called request.json() on the same request afterward to
// get the payload for orders/paid etc. That second read throws ("body stream
// already read"), which was silently caught by the handler's try/catch and
// turned into a 500 — meaning EVERY real webhook call (valid signature or
// not) was failing before any entitlement was ever created or revoked. The
// QA script (scripts/qa-webhook-matrix.ts) is what surfaced this: TC-03/04/05
// all failed because handleOrderPaid/handleOrderCancelled never actually ran.
function verifySignature(bodyText: string, signature: string, secret: string): boolean {
  const hmac = createHmac("sha256", secret);
  hmac.update(bodyText, "utf8");
  const digest = hmac.digest("base64");

  // Plain `===` on secret-derived values is vulnerable to timing attacks (an
  // attacker can statistically infer bytes from response-time differences).
  // timingSafeEqual needs equal-length buffers, so compare lengths first —
  // that length check itself is safe to short-circuit on, only the byte
  // comparison of the digest needs to be constant-time.
  const digestBuf = Buffer.from(digest, "base64");
  const signatureBuf = Buffer.from(signature, "base64");
  if (digestBuf.length !== signatureBuf.length) return false;

  return timingSafeEqual(digestBuf, signatureBuf);
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

    // Read the body ONCE as text — needed for signature verification, and
    // reused (via JSON.parse below) for the actual payload. Do not call
    // request.json() separately; see the comment on verifySignature above.
    const bodyText = await request.text();
    const signature = request.headers.get("X-Shopify-Hmac-Sha256") || "";

    const isValid = verifySignature(bodyText, signature, secret);
    if (!isValid) {
      console.error("Invalid webhook signature");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const topic = request.headers.get("X-Shopify-Topic") || "";
    const body = JSON.parse(bodyText);

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

    // Guard against line items with no SKU (custom items, edge cases) —
    // without this, one bad line item throws and aborts processing of every
    // other line item in the same order, not just the malformed one.
    if (!sku || typeof sku !== "string") {
      console.log("Line item has no sku, skipping:", lineItem);
      continue;
    }

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
