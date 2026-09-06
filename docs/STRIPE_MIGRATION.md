# Shopify → Stripe migration

Konfydence sells only digital licences (no physical goods, no shipping), so the
storefront platform is unnecessary overhead. Stripe covers checkout, invoicing,
subscriptions and tax determination in one account, one payout, one tax config.

**Stripe account:** Konfydence is a project of **PlanetHike** (same legal
entity), so it bills through PlanetHike's existing Stripe account
(`acct_1Ta8VcCJ0OrrcvFZ`). No separate account. Konfydence products are
namespaced (`metadata.konfydence_sku`, `Konfydence …` names) and card statements
carry a `KONFYDENCE` descriptor suffix, so the two projects stay legible in one
account, one payout, one tax registration set.

## VAT / tax position

Billing entity is **PlanetHike** (US); Konfydence is one of its projects. For
electronically-supplied digital services:

| Customer | Treatment | Invoice shows |
|---|---|---|
| EU business with a valid VAT ID | **Reverse charge** — customer self-accounts | VAT ID + "Reverse charge — VAT to be accounted for by the recipient", €0 VAT |
| EU consumer (no VAT ID) | Destination-country VAT — needs **non-Union OSS** registration | local VAT rate |
| US customer | US sales tax where PlanetHike has nexus | per state |
| Rest of world | Generally no US tax; local rules vary | — |

Stripe Tax resolves all of this per transaction once the account's origin
address and registrations are set. Confirm the setup once with an accountant,
especially the first public-sector/school order without a VAT ID.

## Stages

| Stage | Scope | Status |
|---|---|---|
| 0 | In PlanetHike's Stripe account: enable Stripe Tax, add `KONFYDENCE` to allowed descriptor suffixes, keys | **user** |
| 1 | `lib/stripe/` foundation, `stripe` dep, catalogue + sync script, env scaffold | ✅ done |
| 2 | Schema: `ProcessedWebhookEvent` dedupe table; `source`/`shopifyOrderId` columns reused as opaque source-order keys | ✅ done |
| 3 | Consumer checkout → Stripe Checkout Session; same `{sku}→{checkoutUrl}` contract | ✅ done |
| 4 | `POST /api/webhooks/stripe` → `checkout.session.completed` reuses shared fulfilment; `charge.refunded` → revoke | ✅ done |
| 5 | Workplace/School: PO submit also raises a Stripe invoice; `invoice.paid` auto-activates the tenant | pending |
| 6 | Home/Teen: Stripe subscription products ($19.99 y1 → $14.99/yr), `mode: subscription` checkout, renewal webhooks | pending |
| 7 | Flip to live keys, monitor, delete `lib/shopify/` + Shopify webhook + env; cancel Shopify plan | pending |

## Catalogue

`lib/stripe/catalog.ts` is the source of truth. `npm run stripe:sync` (needs
`STRIPE_SECRET_KEY`) idempotently upserts a Product + Price per entry, matched on
`metadata.konfydence_sku` / `lookup_key`. No price IDs in env; `lib/stripe/prices.ts`
resolves lookup keys at runtime with a cold-start cache.

Run it once per account (test, then live):

```
STRIPE_SECRET_KEY=sk_test_... npm run stripe:sync
```

## Open decisions

- **Physical merch** (`/products`: KG-WALLET $14.99, KG-MAGNET $9.99) currently
  checks out through Shopify. Not in the Stripe catalogue — checkout returns
  "not available right now" for these SKUs. Decide: move to Stripe with manual
  shipping, keep Shopify for merch only, or drop the products.
- **Consumer B2C EU VAT**: `automatic_tax` is on, but selling digital to EU
  consumers requires non-Union OSS registration for PlanetHike. Until that
  exists, Stripe Tax will still compute the rate but PlanetHike is not filing it.

## Idempotency

`Entitlement.shopifyOrderId` and `GiftCode.shopifyOrderId` are globally-unique
opaque keys — Stripe fulfilment writes `stripe_cs_<checkout_session_id>` into
them, no column rename. Webhook events are also deduped on `event.id` via
`ProcessedWebhookEvent` (stage 2).
