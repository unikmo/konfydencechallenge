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

**PlanetHike's Stripe account is registered in Estonia (`country: EE`), base
currency EUR** — i.e. an EU-established company (very likely an e-Residency OÜ),
NOT a US entity. This changes the tax picture from earlier drafts:

| Customer | Treatment |
|---|---|
| Estonian customer | Estonian VAT (22%, 24% from mid-2025) — **PlanetHike must be VAT-registered in EE** |
| Other EU consumer (no VAT ID) | Destination-country VAT via **Union OSS** |
| Other EU business (valid VAT ID) | **Reverse charge** — customer self-accounts, invoice shows €0 VAT + the reverse-charge note |
| Non-EU customer | Outside EU VAT scope (0%) |

Konfydence prices are set in **USD** on this EUR account — Stripe handles the
settlement/FX; EU buyers see USD and a conversion. Acceptable but worth revisiting.

`STRIPE_TAX_ENABLED` is currently **off**, so no VAT is charged on any sale. For a
US seller that was defensible for the dominant EU-B2B case; **for an EU seller it
means under-collecting on every Estonian and EU-consumer sale.** Complete the
Stripe Tax wizard (origin = EE address, add the EE VAT registration + Union OSS)
and set `STRIPE_TAX_ENABLED=true` — ideally before, or immediately after, the
live cutover. Confirm the whole setup with an accountant.

The `stripeInvoice.ts` footer currently states the reverse-charge case only;
once Stripe Tax is on it will add the correct VAT line for domestic/B2C.

## Stages

| Stage | Scope | Status |
|---|---|---|
| 0a | Konfydence sandbox created; `sk_test_`/`pk_test_` keys issued | ✅ done |
| 0b | *You:* run `npm run stripe:sync` (sandbox key); complete the Stripe Tax wizard (origin address, registrations); add keys to Vercel Preview+Dev | **user** |
| 0c | Live catalogue: 9 products + 11 prices created in PlanetHike live (`acct_1Ta8VcCJ0OrrcvFZ`) via API — the machine running the sync could not reach `api.stripe.com`, and names use a plain hyphen (Stripe's form API rejected the em-dash); a later `stripe:sync` from a machine with API access will normalise them | ✅ done |
| 0d | Live webhook endpoint `we_1UCia6CJ0OrrcvFZePNh9fCv` → `konfydence.com/api/webhooks/stripe`, 7 events | ✅ done |
| 0e | *You:* set the 3 Vercel **Production** env vars to the live values (`sk_live_`/`pk_live_`/live `whsec_`) | **user** |
| 0f | Stripe Tax wizard (EE origin + registrations) → `STRIPE_TAX_ENABLED=true` | **user, before/at cutover** |
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
