import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { randomUUID } from "crypto";
import { getVariantIds, SHOPIFY_API_VERSION } from "@/lib/shopify/testData";
import { rateLimit, getClientIp } from "@/lib/rateLimit";

const SKU_TO_VARIANT_GID = getVariantIds();

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const { allowed } = rateLimit(`checkout:${getClientIp(request)}`, 10, 60_000);
    if (!allowed) {
      return NextResponse.json({ error: "Too many requests, please try again shortly." }, { status: 429 });
    }

    const body = await request.json();
    const { sku, quantity = 1 } = body;

    if (!sku || typeof sku !== "string") {
      return NextResponse.json({ error: "sku is required" }, { status: 400 });
    }
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 10) {
      return NextResponse.json({ error: "quantity must be between 1 and 10" }, { status: 400 });
    }

    const variantId = (SKU_TO_VARIANT_GID as Record<string, string | undefined>)[sku];
    if (!variantId) {
      return NextResponse.json({ error: "Unknown SKU" }, { status: 400 });
    }

    const cookieStore = await cookies();
    const kfUid = cookieStore.get("kf_uid")?.value ?? randomUUID();

    const storeDomain = process.env.SHOPIFY_STORE_DOMAIN;
    const accessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
    if (!storeDomain || !accessToken) {
      return NextResponse.json({ error: "Shopify credentials not configured" }, { status: 500 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const returnUrl = sku === "LOCKSCREENS-PACK"
      ? `${appUrl}/lockscreens/thank-you`
      : `${appUrl}/challenge/claim?edition=${sku.includes("SINGLE") ? sku.split("-").pop()?.toLowerCase() : "travelsafe"}`;

    const query = `
      mutation cartCreate($lines: [CartLineInput!]!, $attributes: [AttributeInput!]!, $buyerIdentity: CartBuyerIdentityInput) {
        cartCreate(input: { lines: $lines, attributes: $attributes, buyerIdentity: $buyerIdentity }) {
          cart { checkoutUrl }
          userErrors { field message }
        }
      }
    `;

    const response = await fetch(`https://${storeDomain}/api/${SHOPIFY_API_VERSION}/graphql.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": accessToken,
      },
      body: JSON.stringify({
        query,
        variables: {
          lines: [{ merchandiseId: variantId, quantity }],
          attributes: [
            { key: "konfydenceUserId", value: kfUid },
            { key: "returnUrl", value: returnUrl },
          ],
        },
      }),
    });

    if (!response.ok) {
      console.error("Shopify Storefront request failed:", response.status);
      return NextResponse.json({ error: "Failed to create cart" }, { status: 502 });
    }

    const data = await response.json();
    if (data.errors) {
      console.error("Shopify GraphQL errors:", data.errors);
      return NextResponse.json({ error: "Failed to create cart" }, { status: 500 });
    }

    const { cart, userErrors } = data.data.cartCreate;
    if (userErrors?.length) {
      console.error("Shopify user errors:", userErrors);
      return NextResponse.json({ error: "Failed to create cart" }, { status: 500 });
    }
    if (!cart?.checkoutUrl) {
      return NextResponse.json({ error: "Shopify did not return a checkout URL" }, { status: 502 });
    }

    const result = NextResponse.json({ checkoutUrl: cart.checkoutUrl });
    result.cookies.set("kf_uid", kfUid, {
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
