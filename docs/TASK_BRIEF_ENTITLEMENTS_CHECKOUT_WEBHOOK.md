## Task brief — Entitlement model, Shopify checkout, and purchase webhook

Hand this to Blackbox or Qodo as-is. It's self-contained: the "why" is included so the
implementer isn't just following instructions blind. Grounded in `docs/UX_UI_COMMERCE_SPEC_V1.docx`
(§5) and the actual live Konfydence Shopify store — every SKU, product name, and env var below has
been verified against the real store, not assumed.

### Context

Konfydence Challenge (5 scenario decks) and KonfyGuard (2 physical items) sell through one shared
Shopify store (`konfydence`, storefront domain `shop.konfydence.com`) and one buying route: Storefront
API `cartCreate` → redirect to Shopify's hosted `checkoutUrl`. No card data ever touches this app.
Institutional (Schools & Teams / Workplace) is out of scope here — it stays a `/contact` lead form,
never a Shopify SKU.

There is currently no auth system — every player is a guest. A first-party cookie (`kf_uid`) is the
only identity we have pre-purchase, so it rides along as a Shopify cart attribute and comes back on
the order, letting the webhook reconnect an anonymous browsing session to its paid order without
forcing login before the free diagnostic.

### 1. Prisma schema change

Add to `prisma/schema.prisma`, then run a migration:

```prisma
model Entitlement {
  id             String   @id @default(cuid())
  userId         String
  user           User     @relation(fields: [userId], references: [id])
  tier           String   // "single" | "unlimited"
  edition        String?  // set when tier = "single"; null covers all editions
  source         String   @default("shopify")
  shopifyOrderId String   @unique
  status         String   @default("active") // "active" | "revoked"
  createdAt      DateTime @default(now())

  @@index([userId])
}
```

Add the inverse relation to `User`:

```prisma
model User {
  // ...existing fields...
  entitlements Entitlement[]
}
```

`User` currently only has `id`/`email`/`createdAt` (guest-only, no password). If no `User` row exists
yet for a given `kf_uid`/email at webhook time, create one — don't assume it pre-exists.

### 2. Environment variables

Add to `.env.example` (and your local `.env`):

```
SHOPIFY_STORE_DOMAIN=shop.konfydence.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=<public storefront token, cartCreate scope only>
SHOPIFY_WEBHOOK_SECRET=<from Shopify Admin → Settings → Notifications → Webhooks — already generated, ask Tichi for the value>
```

`SHOPIFY_ADMIN_ACCESS_TOKEN` is **not needed** for v1 — the upgrade path uses a flat product
(`CHAL-UPGRADE`), not a generated discount code.

Remove the dead Stripe stubs while you're in `.env.example` (`STRIPE_SECRET_KEY`,
`STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`) — that's task #13, but it's a one-line delete, no
reason to leave it for a separate pass if you're already touching the file.

### 3. Confirmed real SKUs (verified live in Shopify, not placeholders)

| SKU | Product in Shopify | Price | Ships? | Entitlement effect |
|---|---|---|---|---|
| `CHAL-SINGLE-SCHOOL` | Konfydence Challenge — Single Edition (variant: School) | $4.99 | No | `Entitlement(tier: "single", edition: "school")` |
| `CHAL-SINGLE-UNIVERSITY` | " (variant: University) | $4.99 | No | `Entitlement(tier: "single", edition: "university")` |
| `CHAL-SINGLE-FAMILY` | " (variant: Family) | $4.99 | No | `Entitlement(tier: "single", edition: "family")` |
| `CHAL-SINGLE-TRAVELSAFE` | " (variant: TravelSafe) | $4.99 | No | `Entitlement(tier: "single", edition: "travelsafe")` |
| `CHAL-SINGLE-WORKPLACE` | " (variant: Workplace) | $4.99 | No | `Entitlement(tier: "single", edition: "workplace")` |
| `CHAL-UNLIMITED` | Konfydence Challenge — Unlimited Access | $19.99 | No | `Entitlement(tier: "unlimited", edition: null)` |
| `CHAL-UPGRADE` | Konfydence Challenge — Upgrade to Unlimited | $15.00 | No | Same effect as `CHAL-UNLIMITED` — upgrades existing single holder. Only ever shown client-side to someone who already holds a `single` entitlement (task #8/#12, not this brief) |
| `KG-WALLET` | KonfyGuard Wallet Card | $14.99 | Yes | None — physical fulfillment is the unlock |
| `KG-MAGNET` | KonfyGuard Home Fridge Magnet | $9.99 | Yes | None — physical fulfillment is the unlock |

Lowercase the `{EDITION}` suffix from the SKU to get the `edition` value stored on `Entitlement` and
used elsewhere in the app (`school`, `university`, `family`, `travelsafe`, `workplace` — matches
`Scenario.edition` and `ChallengeSession.edition` string values already in the schema).

Note: "KonfyGuard Screens – Free Phone Lockscreen Pack" and "KonfyGuard Protection Bundle" also exist
in the store but are **not** part of this checkout/webhook flow — lockscreens are a free download with
no cart, and the Protection Bundle is not yet part of the v1 plan (no bundle SKU decision has been
made — leave it alone, don't wire it up).

### 4. `POST /api/checkout/create`

New route. Request body:

```ts
{ sku: string; quantity?: number } // quantity defaults to 1; only relevant if you ever allow multi-line carts client-side — v1 is one item per call
```

Logic:
1. Look up the Storefront `merchandiseId` (variant GID) for the given SKU. Simplest approach for v1:
   a small static map of `SKU → variant GID` in code (9 entries, see table above), refreshed manually
   if products change — no need to query Shopify's product catalog at request time.
2. Read (or create, if missing) the `kf_uid` cookie — a random UUID, `httpOnly: false` (client JS
   needs to read it too for polling), `sameSite: "lax"`, long expiry (e.g. 1 year).
3. Call the Storefront API `cartCreate` mutation:
   ```graphql
   mutation cartCreate($lines: [CartLineInput!]!, $attributes: [AttributeInput!]!) {
     cartCreate(input: { lines: $lines, attributes: $attributes }) {
       cart { checkoutUrl }
       userErrors { field message }
     }
   }
   ```
   with `attributes: [{ key: "konfydenceUserId", value: kf_uid }]`.
4. Respond `{ checkoutUrl }`. Client-side redirects the browser to it (`window.location.href =
   checkoutUrl`) — this is a full navigation to Shopify's hosted checkout, not an iframe.

This one endpoint is called by every "Buy" CTA on the site — digital and physical, `/pricing` and
`/products` alike. Do not create a second checkout implementation anywhere.

### 5. `POST /api/webhooks/shopify-purchase`

New route, single endpoint handling three webhook topics (all three are already registered in
Shopify's Notifications settings, pointing here): `orders/paid`, `orders/cancelled`, `refunds/create`.

1. Verify the `X-Shopify-Hmac-Sha256` header: base64 HMAC-SHA256 of the raw request body using
   `SHOPIFY_WEBHOOK_SECRET`. **You must read the raw body before any JSON parsing** — Next.js App
   Router route handlers need `await request.text()` first, verify, then `JSON.parse`. Return `401`
   immediately on mismatch, do not touch the database.
2. Branch on the topic (available in the `X-Shopify-Topic` header):
   - **`orders/paid`**: for each line item whose SKU starts with `CHAL-`, upsert an `Entitlement`
     keyed on `shopifyOrderId` (unique — if the webhook retries, this must be idempotent, not create
     duplicates). Resolve the `User`: try `kf_uid` from `order.note_attributes` (key
     `konfydenceUserId`) first; if no local user matches that value, fall back to
     `order.customer.email` (find-or-create a `User` by email). Line items whose SKU starts with
     `KG-` get no `Entitlement` row — just log them (fulfillment is Shopify's job, not ours).
   - **`orders/cancelled`** and **`refunds/create`**: find the `Entitlement` by `shopifyOrderId` and
     set `status: "revoked"`. If no matching entitlement exists (e.g. it was a KonfyGuard-only order),
     no-op — don't error.
3. Always respond `200` quickly (Shopify retries on non-2xx) — do the database work synchronously
   since volume is low for v1, no queue needed.

### 6. `GET /api/entitlements/me`

Reads the `kf_uid` cookie, finds the `User`, returns their active entitlements:

```ts
{ entitlements: Array<{ tier: "single" | "unlimited"; edition: string | null }> }
```

Only rows with `status: "active"` are returned. Used by `/challenge/claim` (task #12, not this brief)
to poll for a few seconds after the Shopify redirect back, so the user isn't stuck waiting on the
async webhook to land.

### 7. Entitlement gate (ties into task #9)

Before starting a `mode=full` session (`ChallengeSession.mode === "full"`), check: does this user have
an active `Entitlement` with `tier: "unlimited"`, OR `tier: "single"` matching the requested edition?
If neither, block and redirect to `/pricing` with edition-specific upsell copy. Diagnostic mode
(`mode: "diagnostic"`, 5 questions) stays fully ungated regardless — never check entitlements there.

### Acceptance criteria (subset of the full QA matrix relevant to this brief — see
`docs/UX_UI_COMMERCE_SPEC_V1.docx` §8 for the complete TC-01…TC-11 list)

- TC-03: Buying `CHAL-SINGLE-SCHOOL` in Shopify test mode fires `orders/paid` → an `Entitlement(tier:
  "single", edition: "school")` row appears → `GET /api/entitlements/me` reflects it within ~10s.
- TC-04: Completing checkout with the `kf_uid` cookie cleared still attaches the entitlement, via the
  email fallback.
- TC-05: Cancelling/refunding that order in Shopify admin flips the entitlement to `status: "revoked"`.
- TC-07: Buying `KG-WALLET` + `KG-MAGNET` in one cart creates a real Shopify order with a shipping
  address, writes **zero** `Entitlement` rows, and doesn't touch `/api/entitlements/me` output at all.
- TC-09: POSTing to the webhook route with a deliberately wrong HMAC signature returns `401` and
  causes no database writes — check this explicitly, it's the easiest thing to get subtly wrong.
- TC-11: `/pricing`, `/products`, and any future consumer surface all call the same
  `/api/checkout/create` — no divergent second implementation anywhere.
