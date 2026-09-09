import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getStripe, stripeConfigured } from "@/lib/stripe/client";
import { claimPlayerForAccount } from "@/lib/auth/claim";
import { finishSignInAction } from "@/lib/auth/finishSignIn";
import { getSession } from "@/lib/auth/session";
import { ensurePurchaseAccount } from "@/lib/commerce/purchaseAccount";
import { KF_UID_COOKIE } from "@/lib/challenge/kfUidCookie";

export const dynamic = "force-dynamic";

// Post-purchase: sign the buyer in on THIS device so the purchase is portable.
// Keyed on the Stripe Checkout Session id from the success_url — reliable even
// if the kf_uid cookie is stale. The account itself is created here (or by the
// webhook, whichever runs first); both paths are idempotent.
//
// Returns { linked, email?, entitlements } — the claim page polls this while
// the fulfilment webhook lands.

type ActiveEntitlement = { tier: string; edition: string | null };

async function entitlementsForAccount(accountId: string): Promise<ActiveEntitlement[]> {
  const player = await prisma.user.findFirst({
    where: { accountId },
    select: { entitlements: { where: { status: "active" }, select: { tier: true, edition: true } } },
  });
  return player?.entitlements ?? [];
}

async function entitlementsForCookie(): Promise<ActiveEntitlement[]> {
  const store = await cookies();
  const kfUid = store.get(KF_UID_COOKIE)?.value;
  if (!kfUid) return [];
  const player = await prisma.user.findUnique({
    where: { id: kfUid },
    select: { entitlements: { where: { status: "active" }, select: { tier: true, edition: true } } },
  });
  return player?.entitlements ?? [];
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const sessionId = typeof body.sessionId === "string" ? body.sessionId : "";

  if (!sessionId || !sessionId.startsWith("cs_") || !stripeConfigured()) {
    // No session ref (old link / direct nav) — fall back to the cookie player.
    return NextResponse.json({ linked: false, entitlements: await entitlementsForCookie() });
  }

  let email: string | null = null;
  let clientRef: string | null = null;
  try {
    const session = await getStripe().checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== "paid" && session.status !== "complete") {
      return NextResponse.json({ ready: false, linked: false, entitlements: [] });
    }
    email = session.customer_details?.email ?? session.customer_email ?? null;
    clientRef = typeof session.client_reference_id === "string" ? session.client_reference_id : null;
  } catch (err) {
    console.error("claim-purchase: session lookup failed", sessionId, err);
    return NextResponse.json({ linked: false, entitlements: await entitlementsForCookie() });
  }

  if (!email) {
    return NextResponse.json({ linked: false, entitlements: await entitlementsForCookie() });
  }

  // Paid session → confirmed account.
  const account = await ensurePurchaseAccount(email);
  if (!account) {
    return NextResponse.json({ linked: false, entitlements: await entitlementsForCookie() });
  }

  // Sign this device in once. The claim page polls this endpoint while the
  // fulfilment webhook lands, so skip if the cookie already holds this account.
  const existing = await getSession();
  if (!existing || existing.account.id !== account.id) {
    await finishSignInAction(account); // session + cookie repoint + lockscreen link
    // Fold in the exact player that made the purchase, in case the kf_uid
    // cookie was cleared between checkout and return.
    if (clientRef) {
      await claimPlayerForAccount(account, clientRef).catch(() => {});
    }
  }

  return NextResponse.json({
    linked: true,
    email: account.email,
    entitlements: await entitlementsForAccount(account.id),
  });
}
