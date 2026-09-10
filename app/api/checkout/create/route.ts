import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { randomUUID } from "crypto";
import type Stripe from "stripe";
import { rateLimit, getClientIp } from "@/lib/rateLimit";
import { prisma } from "@/lib/prisma";
import { isGuestEmail } from "@/lib/challenge/startSessionUtil";
import { getStripe, stripeConfigured, stripeTaxEnabled } from "@/lib/stripe/client";
import {
  CONSUMER_CATALOG,
  SUBSCRIPTION_CATALOG,
  TEAM_SEAT,
  isConsumerSku,
  isSubscriptionSku,
  isTeamSku,
} from "@/lib/stripe/catalog";
import { resolvePriceId, resolvePriceIds } from "@/lib/stripe/prices";
import { getAccount } from "@/lib/auth/session";

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
    if (!isConsumerSku(sku) && !isSubscriptionSku(sku) && !isTeamSku(sku)) {
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

    // Prefill the buyer's email at Stripe if we already know it (a returning
    // player who signed in before) — one less field, and it keeps the
    // post-purchase account link keyed on the same address.
    const player = await prisma.user
      .findUnique({ where: { id: kfUid }, select: { email: true } })
      .catch(() => null);
    const knownEmail = player && !isGuestEmail(player.email) ? player.email : null;

    const common: Stripe.Checkout.SessionCreateParams = {
      client_reference_id: kfUid,
      billing_address_collection: "required",
      tax_id_collection: { enabled: true },
      cancel_url: `${appUrl}/pricing`,
      ...(knownEmail ? { customer_email: knownEmail } : {}),
      ...(taxEnabled ? { automatic_tax: { enabled: true } } : {}),
    };

    let session: Stripe.Checkout.Session;

    if (isTeamSku(sku)) {
      // Challenge Teams — the buyer becomes the org admin, so they must be a
      // signed-in account. Seats are an adjustable-quantity yearly subscription.
      const account = await getAccount();
      if (!account) {
        return NextResponse.json(
          { error: "Please sign in first — the buyer becomes the team admin.", needsAuth: true },
          { status: 401 },
        );
      }
      const orgName = String(body.orgName || "").trim().slice(0, 120);
      if (!orgName) {
        return NextResponse.json({ error: "A team or organisation name is required." }, { status: 400 });
      }
      const seats = Math.floor(Number(body.seats));
      if (!Number.isFinite(seats) || seats < TEAM_SEAT.minSeats || seats > TEAM_SEAT.maxSeats) {
        return NextResponse.json(
          { error: `Choose between ${TEAM_SEAT.minSeats} and ${TEAM_SEAT.maxSeats} seats.` },
          { status: 400 },
        );
      }
      const metadata = { konfydenceUserId: kfUid, sku, orgName, ownerAccountId: account.id };
      session = await stripe.checkout.sessions.create({
        ...common,
        customer_email: account.email,
        mode: "subscription",
        line_items: [
          {
            price: await resolvePriceId(TEAM_SEAT.lookupKey),
            quantity: seats,
            adjustable_quantity: { enabled: true, minimum: TEAM_SEAT.minSeats, maximum: TEAM_SEAT.maxSeats },
          },
        ],
        subscription_data: { metadata },
        metadata,
        success_url: `${appUrl}/teams?welcome=1`,
        allow_promotion_codes: true,
      });
    } else if (isSubscriptionSku(sku)) {
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
      const tier = sku === "CHAL-UNLIMITED" ? "unlimited" : "single";

      const metadata: Record<string, string> = {
        konfydenceUserId: kfUid,
        sku,
        tier,
        edition: editionSlug ?? "",
      };

      if (giftAttrs) {
        // A gift is a one-time payment that grants the recipient one year — not
        // a subscription in their name. Inline price_data keeps it off the
        // recurring catalogue.
        metadata.isGift = "true";
        metadata.giftToEmail = giftAttrs.toEmail;
        metadata.giftFromName = giftAttrs.fromName;
        metadata.giftMessage = giftAttrs.message;
        session = await stripe.checkout.sessions.create({
          ...common,
          mode: "payment",
          line_items: [{
            quantity: 1,
            price_data: {
              currency: entry.currency,
              unit_amount: entry.unitAmount,
              tax_behavior: "exclusive",
              product_data: { name: `${entry.name} — 1-year gift` },
            },
          }],
          customer_creation: "always",
          metadata,
          payment_intent_data: { metadata, statement_descriptor_suffix: "KONFYDENCE" },
          success_url: `${appUrl}/gift/thank-you`,
          allow_promotion_codes: true,
        });
      } else {
        // Direct purchase: an annual subscription.
        const successUrl = editionSlug
          ? `${appUrl}/challenge/claim?edition=${editionSlug}&cs={CHECKOUT_SESSION_ID}`
          : `${appUrl}/challenge/claim?cs={CHECKOUT_SESSION_ID}`;
        session = await stripe.checkout.sessions.create({
          ...common,
          mode: "subscription",
          line_items: [{ price: await resolvePriceId(entry.lookupKey), quantity: 1 }],
          metadata,
          subscription_data: { metadata },
          success_url: successUrl,
          allow_promotion_codes: true,
        });
      }
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
