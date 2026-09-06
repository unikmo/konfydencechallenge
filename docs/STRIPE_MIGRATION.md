# Shopify → Stripe migration

Konfydence sells only digital licences (no physical goods, no shipping), so the
storefront platform is unnecessary overhead. Stripe covers checkout, invoicing,
subscriptions and tax determination in one account, one payout, one tax config.

**Stripe account:** Konfydence is a project of **PlanetHike** (same legal
entity).

- **Test / build:** a dedicated Stripe **Sandbox** — "Konfydence sandbox",
  `acct_1UCcuwGWznsZfuhr` — isolated test data, its own `sk_test_`/`pk_test_`
  keys. All of stages 1–6 are built and verified here.
- **Live:** runs through **PlanetHike's live account** (`acct_1Ta8VcCJ0OrrcvFZ`).
  A sandbox cannot be activated for live payments. Production env vars point at
  PlanetHike's live keys; Konfydence products are namespaced
  (`metadata.konfydence_sku`, `Konfydence …` names) and card statements carry a
  `KONFYDENCE` descriptor suffix so the two projects stay legible in one
  account, one payout, one tax registration set.

Run `npm run stripe:sync` once against the sandbox key, then again against the
live key at cutover.

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
| 0a | Konfydence sandbox created; `sk_test_`/`pk_test_` keys issued | ✅ done |
| 0b | *You:* run `npm run stripe:sync` (sandbox key); complete the Stripe Tax wizard (origin address, registrations); add keys to Vercel Preview+Dev | **user** |
| 0c | *You, at cutover:* enable Stripe Tax on PlanetHike live; add `KONFYDENCE` descriptor suffix; live keys to Vercel Production; `npm run stripe:sync` (live key) | **user** |
| 1 | `lib/stripe/` foundation, `stripe` dep, catalogue + sync script, env scaffold | ✅ done |
| 2 | Schema: `ProcessedWebhookEvent` dedupe table; `source`/`shopifyOrderId` columns reused as opaque source-order keys | ✅ done |
| 3 | Consumer checkout → Stripe Checkout Session; same `{sku}→{checkoutUrl}` contract | ✅ done |
| 4 | `POST /api/webhooks/stripe` → `checkout.session.completed` reuses shared fulfilment; `charge.refunded` → revoke | ✅ done |
| 5 | Workplace/School: PO submit also raises a Stripe invoice; `invoice.paid` auto-activates the tenant | ✅ done |
| 6 | Home/Teen: Stripe subscription (`mode: subscription`, one-time $19.99 y1 + trialing $14.99/yr renewal), checkout + renewal + cancel webhooks | ✅ backend done |
| 7 | Flip to live keys, monitor, delete `lib/shopify/` + Shopify webhook + env; cancel Shopify plan; drop `/products` merch | pending |

## Catalogue

`lib/stripe/catalog.ts` is the source of truth. `npm run stripe:sync` (needs
`STRIPE_SECRET_KEY`) idempotently upserts a Product + Price per entry, matched on
`metadata.konfydence_sku` / `lookup_key`. No price IDs in env; `lib/stripe/prices.ts`
resolves lookup keys at runtime with a cold-start cache.

Run it once per account (test, then live):

```
STRIPE_SECRET_KEY=sk_test_... npm run stripe:sync
```

## Open items

- **Physical merch** (`/products`: KG-WALLET, KG-MAGNET): decided — **drop**.
  Stage 7 removes the page, `CrossSellStrip`, and the KG SKUs.
- **Home/Teen buy button**: stage 6 is backend-only. Nothing on the site sells
  `LOCKSCREENS-HOME`/`-TEEN` yet — a `CheckoutRedirectButton sku="LOCKSCREENS-HOME"`
  will work as soon as `stripe:sync` has run, but the page/copy/price display is
  a product decision. Likely home: `/lockscreens` or the family-scam-protection
  SEO page.
- **Consumer B2C EU VAT**: once `STRIPE_TAX_ENABLED=true`, Stripe Tax computes
  the rate, but selling digital to EU consumers still needs PlanetHike to hold a
  non-Union OSS registration to actually remit it.
- **Stripe Tax wizard** must be completed before `STRIPE_TAX_ENABLED=true`;
  until then invoices/checkout carry no tax line (correct for EU B2B reverse
  charge; under-collects for US-nexus and EU-B2C until switched on).

## Idempotency

`Entitlement.shopifyOrderId` and `GiftCode.shopifyOrderId` are globally-unique
opaque keys — Stripe fulfilment writes `stripe_cs_<checkout_session_id>` into
them, no column rename. Webhook events are also deduped on `event.id` via
`ProcessedWebhookEvent` (stage 2).
