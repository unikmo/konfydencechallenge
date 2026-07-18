import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { randomUUID } from "crypto";
import { getVariantIds, SHOPIFY_API_VERSION } from "@/lib/shopify/testData";

// SKU to variant GID mapping (Shopify Storefront API)
// Uses TEST_VARIANT_IDS for development, PRODUCTION_VARIANT_IDS for live
// See lib/shopify/testData.ts for setup instructions
const SKU_TO_VARIANT_GID = getVariantIds();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sku, quantity = 1 } = body;

    if (!sku || typeof sku !== "string") {
      return NextResponse.json({ error: "sku is required" }, { status: 400 });
    }

    const variantId = (SKU_TO_VARIANT_GID as Record<string, string | undefined>)[sku];
    if (!variantId) {
      return NextResponse.json({ error: "Unknown SKU" }, { status: 400 });
    }

    // Get or create kf_uid cookie
    const cookieStore = await cookies();
    let kfUid: string = cookieStore.get("kf_uid")?.value ?? randomUUID();

    // Call Shopify Storefront API to create cart
    const storeDomain = process.env.SHOPIFY_STORE_DOMAIN;
    const accessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

    if (!storeDomain || !accessToken) {
      return NextResponse.json(
        { error: "Shopify credentials not configured" },
        { status: 500 }
      );
    }

    // Build the return URL for post-checkout
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const returnUrl = `${appUrl}/challenge/claim?edition=${sku.includes("SINGLE") ? sku.split("-").pop()?.toLowerCase() : "travelsafe"}`;

    const query = `
      mutation cartCreate($lines: [CartLineInput!]!, $attributes: [AttributeInput!]!, $buyerIdentity: CartBuyerIdentityInput) {
        cartCreate(input: { lines: $lines, attributes: $attributes, buyerIdentity: $buyerIdentity }) {
          cart {
            checkoutUrl
          }
          userErrors {
            field
            message
          }
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
          lines: [
            {
              merchandiseId: variantId,
              quantity,
            },
          ],
          attributes: [
            {
              key: "konfydenceUserId",
              value: kfUid,
            },
            {
              key: "returnUrl",
              value: returnUrl,
            },
          ],
        },
      }),
    });

    const data = await response.json();

    if (data.errors) {
      console.error("Shopify GraphQL errors:", data.errors);
      return NextResponse.json(
        { error: "Failed to create cart" },
        { status: 500 }
      );
    }

    const { cart, userErrors } = data.data.cartCreate;

    if (userErrors && userErrors.length > 0) {
      console.error("Shopify user errors:", userErrors);
      return NextResponse.json(
        { error: "Failed to create cart" },
        { status: 500 }
      );
    }

    const checkoutUrl = cart.checkoutUrl;

    // Set kf_uid cookie in response
    const result = NextResponse.json({ checkoutUrl });
    result.cookies.set("kf_uid", kfUid, {
      httpOnly: false, // Client JS needs to read it
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: "/",
    });

    return result;
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
