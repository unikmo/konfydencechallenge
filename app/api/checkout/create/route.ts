import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { randomUUID } from "crypto";
import type Stripe from "stripe";
import { rateLimit, getClientIp } from "@/lib/rateLimit";
import { getStripe, stripeConfigured, stripeTaxEnabled } from "@/lib/stripe/client";
import {
  CONSUMER_CATALOG,
  SUBSCRIPTION_CATALOG,
  isConsumerSku,
  isSubscriptionSku,
} from "@/lib/stripe/catalog";
import { resolvePriceId, resolvePriceIds } from "@/lib/stripe/prices";

export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const KF_UID_COOKIE = "kf_uid";
const SUBSCRIPTION_TRIAL_DAYS = 365; // year 1 is the one-time line; renewals bill after

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
    if (!isConsumerSku(sku) && !isSubscriptionSku(sku)) {
      // Physical merch (KG-*) and anything else: no Stripe catalogue entry.
      return NextResponse.json({ error: "This item is not available for purchase right now." }, { status: 400 });
    }

    const giftable = isConsumerSku(sku) && CONSUMER_CATALOG[sku].giftable;
    let giftAttrs: GiftInput | null = null;
    if (gift && typeof gift === "object") {
      if (!giftable) {
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
    const taxEnabled = stripeTaxEnabled();
    const stripe = getStripe();

    const common: Stripe.Checkout.SessionCreateParams = {
      client_reference_id: kfUid,
      billing_address_collection: "required",
      tax_id_collection: { enabled: true },
      cancel_url: `${appUrl}/pricing`,
      ...(taxEnabled ? { automatic_tax: { enabled: true } } : {}),
    };

    let session: Stripe.Checkout.Session;

    if (isSubscriptionSku(sku)) {
      const entry = SUBSCRIPTION_CATALOG[sku];
      const prices = await resolvePriceIds([entry.lookupKey, entry.firstYearLookupKey]);
      const metadata = { konfydenceUserId: kfUid, sku, track: entry.track };
      session = await stripe.checkout.sessions.create({
        ...common,
        mode: "subscription",
        line_items: [
          { price: prices[entry.lookupKey], quantity: 1 }, // recurring $14.99/yr (trials 365d)
          { price: prices[entry.firstYearLookupKey], quantity: 1 }, // one-time $19.99 year 1
        ],
        subscription_data: {
          trial_period_days: SUBSCRIPTION_TRIAL_DAYS,
          metadata,
        },
        metadata,
        success_url: `${appUrl}/lockscreens/thank-you`,
        cancel_url: `${appUrl}/lockscreens`,
      });
    } else {
      const entry = CONSUMER_CATALOG[sku];
      const editionSlug = sku.startsWith("CHAL-SINGLE-") ? sku.slice("CHAL-SINGLE-".length).toLowerCase() : null;
      const successUrl = giftAttrs
        ? `${appUrl}/gift/thank-you`
        : editionSlug
          ? `${appUrl}/challenge/claim?edition=${editionSlug}`
          : `${appUrl}/challenge/claim`;

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

      session = await stripe.checkout.sessions.create({
        ...common,
        mode: "payment",
        line_items: [{ price: await resolvePriceId(entry.lookupKey), quantity: 1 }],
        customer_creation: "always",
        metadata,
        // Konfydence bills through PlanetHike's Stripe account; the suffix puts
        // "KONFYDENCE" on the card statement so buyers recognise the charge.
        payment_intent_data: { metadata, statement_descriptor_suffix: "KONFYDENCE" },
        success_url: successUrl,
        allow_promotion_codes: true,
      });
    }

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
