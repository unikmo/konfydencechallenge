import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { randomUUID } from "crypto";
import { rateLimit, getClientIp } from "@/lib/rateLimit";
import { getStripe, stripeConfigured } from "@/lib/stripe/client";
import { CONSUMER_CATALOG, isConsumerSku, isSubscriptionSku } from "@/lib/stripe/catalog";
import { resolvePriceId } from "@/lib/stripe/prices";

export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const KF_UID_COOKIE = "kf_uid";

type GiftInput = { toEmail: string; fromName: string; message: string };

export async function POST(request: NextRequest) {
  try {
    const { allowed } = rateLimit(`checkout:${getClientIp(request)}`, 10, 60_000);
    if (!allowed) {
      return NextResponse.json({ error: "Too many requests, please try again shortly." }, { status: 429 });
    }

    if (!stripeConfigured()) {
      return NextResponse.json({ error: "Checkout is not configured." }, { status: 500 });
    }

    const body = await request.json().catch(() => ({}));
    const sku = typeof body.sku === "string" ? body.sku : "";
    const { gift } = body;

    if (!sku) {
      return NextResponse.json({ error: "sku is required" }, { status: 400 });
    }
    if (isSubscriptionSku(sku)) {
      return NextResponse.json({ error: "This subscription is not available for purchase yet." }, { status: 400 });
    }
    if (!isConsumerSku(sku)) {
      // Physical merch (KG-*) and anything else: no Stripe catalogue entry.
      return NextResponse.json({ error: "This item is not available for purchase right now." }, { status: 400 });
    }

    const entry = CONSUMER_CATALOG[sku];

    let giftAttrs: GiftInput | null = null;
    if (gift && typeof gift === "object") {
      if (!entry.giftable) {
        return NextResponse.json({ error: "This item cannot be gifted." }, { status: 400 });
      }
      const toEmail = String(gift.toEmail || "").trim().toLowerCase();
      if (!EMAIL_RE.test(toEmail) || toEmail.length > 254) {
        return NextResponse.json({ error: "A valid recipient email is required for a gift." }, { status: 400 });
      }
      giftAttrs = {
        toEmail,
        fromName: String(gift.fromName || "").trim().slice(0, 80),
        message: String(gift.message || "").trim().slice(0, 500),
      };
    }

    const cookieStore = await cookies();
    const kfUid = cookieStore.get(KF_UID_COOKIE)?.value ?? randomUUID();

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const editionSlug = sku.startsWith("CHAL-SINGLE-") ? sku.slice("CHAL-SINGLE-".length).toLowerCase() : null;
    const successUrl = giftAttrs
      ? `${appUrl}/gift/thank-you`
      : editionSlug
        ? `${appUrl}/challenge/claim?edition=${editionSlug}`
        : `${appUrl}/challenge/claim`;
    const cancelUrl = `${appUrl}/pricing`;

    const priceId = await resolvePriceId(entry.lookupKey);

    // Metadata is the fulfilment contract: the webhook reads it to grant the
    // right entitlement / mint the right gift code. Stripe caps each value at
    // 500 chars and the whole map at 50 keys — well within range here.
    const metadata: Record<string, string> = {
      konfydenceUserId: kfUid,
      sku,
      tier: sku === "CHAL-UNLIMITED" || sku === "CHAL-UPGRADE" ? "unlimited" : "single",
      edition: editionSlug ?? "",
    };
    if (giftAttrs) {
      metadata.isGift = "true";
      metadata.giftToEmail = giftAttrs.toEmail;
      metadata.giftFromName = giftAttrs.fromName;
      metadata.giftMessage = giftAttrs.message;
    }

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      automatic_tax: { enabled: true },
      billing_address_collection: "required",
      tax_id_collection: { enabled: true },
      customer_creation: "always",
      client_reference_id: kfUid,
      metadata,
      payment_intent_data: { metadata },
      success_url: successUrl,
      cancel_url: cancelUrl,
      allow_promotion_codes: true,
    });

    if (!session.url) {
      return NextResponse.json({ error: "Stripe did not return a checkout URL" }, { status: 502 });
    }

    const result = NextResponse.json({ checkoutUrl: session.url });
    result.cookies.set(KF_UID_COOKIE, kfUid, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
    });
    return result;
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
