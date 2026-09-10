import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAccount } from "@/lib/auth/session";
import { getStripe, stripeConfigured } from "@/lib/stripe/client";
import { orgOwnedBy } from "@/lib/commerce/org";
import { TEAM_SEAT } from "@/lib/stripe/catalog";

export const dynamic = "force-dynamic";

// Change the org's seat count. We push the new quantity to Stripe (prorated,
// invoiced now); the customer.subscription.updated webhook then reconciles the
// OrgSeat pool and entitlement terms.
export async function POST(request: NextRequest) {
  const account = await getAccount();
  if (!account) return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  if (!stripeConfigured()) return NextResponse.json({ error: "Billing is not configured." }, { status: 500 });

  const org = await orgOwnedBy(account.id);
  if (!org || !org.stripeSubscriptionId) {
    return NextResponse.json({ error: "No team subscription to change." }, { status: 403 });
  }

  const body = await request.json().catch(() => ({}));
  const seats = Math.floor(Number(body.seats));
  if (!Number.isFinite(seats) || seats < TEAM_SEAT.minSeats || seats > TEAM_SEAT.maxSeats) {
    return NextResponse.json(
      { error: `Choose between ${TEAM_SEAT.minSeats} and ${TEAM_SEAT.maxSeats} seats.` },
      { status: 400 },
    );
  }

  const claimed = await prisma.orgSeat.count({ where: { orgId: org.id, status: "active" } });
  if (seats < claimed) {
    return NextResponse.json(
      { error: `${claimed} seats are in use. Remove members before reducing below that.` },
      { status: 400 },
    );
  }

  const stripe = getStripe();
  const sub = await stripe.subscriptions.retrieve(org.stripeSubscriptionId);
  const item = sub.items.data[0];
  if (!item) return NextResponse.json({ error: "Subscription has no seat line." }, { status: 500 });
  if (item.quantity === seats) return NextResponse.json({ ok: true, unchanged: true });

  await stripe.subscriptions.update(org.stripeSubscriptionId, {
    items: [{ id: item.id, quantity: seats }],
    proration_behavior: "always_invoice",
  });

  return NextResponse.json({ ok: true, seats });
}
