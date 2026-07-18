## Task brief — Design tokens, CTA wiring, claim page, cross-sell, contact form

Hand this to Blackbox or Qodo alongside `docs/TASK_BRIEF_ENTITLEMENTS_CHECKOUT_WEBHOOK.md` — that
brief builds `/api/checkout/create`, `/api/webhooks/shopify-purchase`, and `/api/entitlements/me`.
This brief is everything that calls those endpoints from the UI. Build order matters: the backend
brief should land first (or at least `/api/checkout/create` and `/api/entitlements/me`), since
`CheckoutRedirectButton` and `/challenge/claim` call them directly.

Every file path, current copy, and bug below was read directly from the live repo
(`app/pricing/page.tsx`, `app/products/page.tsx`, `app/challenge/page.tsx`,
`app/challenge/session/[sessionId]/results/page.tsx`) — nothing here is guessed.

### 1. `lib/theme/tokens.ts` — new file, single source of truth

Three near-identical color palettes currently exist across the codebase (hardcoded per-page). Centralize on the values actually shipping in `app/pricing/page.tsx` and `app/products/page.tsx` today:

```ts
export const tokens = {
  bgCanvas: "#08111F",     // dark navy background (pricing, challenge, results)
  bgCardWhite: "#FFFFFF",
  bgCardDark: "#0B1F3A",   // footer / dark card (products page "next" band)
  textOnDark: "#FFFFFF",
  textOnLight: "#0F172A",
  textMuted: "#64748B",
  badgeBlue: "#035494",
  accentAmber: "#FFB31D",
  btnBlack: "#000000",
};
```

Every page listed below currently defines its own `styles` object with duplicated hex values —
replace the color literals with `tokens.*` as you touch each file. Don't do a repo-wide find/replace
in one pass; do it file-by-file as part of each change below so it's reviewable.

Two concrete fixes while you're in these files:
- Remove `boxShadow` drop-shadows from card styles in `app/pricing/page.tsx` (`.card`, line ~129) and
  `app/products/page.tsx` (`.card`, line ~52) and `app/challenge/page.tsx` (`.card`, line ~307) —
  flat-design system, no drop shadows.
- Keep buttons solid, no gradient/glow hover states — `opacity: 0.85` or `scale(0.98)` on hover only.

### 2. New shared components (they don't exist yet — everything is currently inline JSX per page)

**`components/commerce/CheckoutRedirectButton.tsx`** — the single checkout entry point, reused
everywhere:

```tsx
type Props = {
  sku: string;
  label: string;
  variant?: "primary" | "outline";
};
```

On click: `POST /api/checkout/create` with `{ sku }`, show a loading state on the button, then
`window.location.href = checkoutUrl` from the response. On error, show an inline message and re-enable
the button — don't silently fail. This is the *only* place `/api/checkout/create` gets called from;
if you find yourself writing a second fetch-and-redirect somewhere, stop and reuse this component
instead (this is TC-11 from the QA matrix).

**`components/commerce/PricingCard.tsx`** — extract the card markup already in `app/pricing/page.tsx`
into a reusable component (name, price, includes list, CTA slot), themed off `tokens.ts`.

**`components/commerce/ProductCard.tsx`** — extract the card markup already in `app/products/page.tsx`,
themed off `tokens.ts`, with a `variant: "paid" | "free"` prop. Free variant renders a blue "Free
addon" badge instead of a price — never the same visual weight as a paid CTA (this is a stated rule,
not a style preference: lockscreens must never look like they cost money).

**`components/commerce/CrossSellStrip.tsx`** — compact, dark, single KonfyGuard item, reuses
`ProductCard` in a smaller layout. Takes a `product: "wallet" | "magnet"` prop.

**`components/commerce/InstitutionalCTA.tsx`** — renders only a "Contact us" / "Request a quote"
link to `/contact?topic=schools-teams`. Never accepts a price or SKU prop — this component
structurally cannot render a buy button, that's the point of it existing separately from
`PricingCard`.

### 3. Fix a real content bug on `app/challenge/page.tsx` before wiring CTAs

Look at the `editions` array (line 12): School shows `"$1 per student / year"` and Workplace shows
`"$5 per employee / year"` as the price badge on their deck cards. Family and TravelSafe show
`"$4.99"`. **This is inconsistent with the actual Shopify SKU table** — all five editions'
individual/self-serve Single Edition purchase is `$4.99` (`CHAL-SINGLE-{EDITION}`, confirmed live in
Shopify). The per-student/per-employee numbers are institutional bulk pricing, which belongs only on
the Schools & Teams contact flow — they should never appear as the price badge on an individual
consumer's deck card, because that price is exactly what a self-serve buyer will be charged one line
below via `CheckoutRedirectButton`, and $1/student isn't a real checkout price for anyone buying
individually.

Fix: change School and Workplace's price badge to `"$4.99"` to match the other three. If you want to
keep signaling that bulk pricing exists for these two editions, add a small secondary line ("Bulk
pricing available for schools/workplaces →" linking to `/contact?topic=schools-teams`) rather than
replacing the individual price.

### 4. Wire `/pricing` (3 CTAs)

Current state: 4 tiers, only "Free Readiness Check" has a working link; the other three are
`disabled` spans with "(coming soon)" copy.

- **Free Readiness Check** ($0): leave as-is, links to `/challenge`.
- **Full Challenge** ($4.99): this tier is edition-agnostic today, but the SKU is per-edition
  (`CHAL-SINGLE-{EDITION}`). Handle it like this:
  - `/pricing` accepts an optional `?edition=` query param. When present (e.g. a user arrives here
    from a results page or a deck card that already knows their edition), render
    `<CheckoutRedirectButton sku={`CHAL-SINGLE-${edition.toUpperCase()}`} label={`Unlock ${label} — $4.99`} />`.
  - When absent (someone lands on `/pricing` directly with no prior edition context), render a small
    inline edition selector (5 buttons/pills: School, University, Family, TravelSafe, Workplace)
    above the CTA; picking one reveals the `CheckoutRedirectButton` for that edition. Don't let
    someone check out a Single Edition without an edition selected — Shopify has no "any edition"
    SKU.
- **Complete Scam-Readiness Pack** ($19.99): `<CheckoutRedirectButton sku="CHAL-UNLIMITED" label="Get All 5 Challenges — $19.99" />`. If the visitor already holds a `single` entitlement (check
  `GET /api/entitlements/me` client-side on page load), swap this for
  `<CheckoutRedirectButton sku="CHAL-UPGRADE" label="Upgrade to Unlimited — $15" />` instead — this is
  the upgrade-credit mechanism from the spec, surfaced only to people who qualify for it.
- **Schools & Teams** (Custom): replace the disabled span with `<InstitutionalCTA />` →
  `/contact?topic=schools-teams`. Never a price, never a Shopify link.

### 5. Wire `/products` (2 paid CTAs + 2 free items)

Current state: 4 items (Wallet card, Fridge magnet, Phone lockscreen, Computer lockscreen), all four
"View options" links dead-end at `/pricing` (the original bug this whole project started from).

- **Wallet card**: `<CheckoutRedirectButton sku="KG-WALLET" label="Add to cart — $14.99" />`
- **Fridge magnet**: `<CheckoutRedirectButton sku="KG-MAGNET" label="Add to cart — $9.99" />`
- **Phone lockscreen** and **Computer lockscreen**: these are not Shopify products (confirmed — only
  one combined "KonfyGuard Screens – Free Phone Lockscreen Pack" product exists in Shopify, and it's
  not part of the checkout flow). Give both a "Free addon" badge (via `ProductCard variant="free"`)
  and a direct download link — no cart, no checkout, no entitlement check. If there's no actual
  lockscreen asset file yet to link to, use a placeholder path and flag it back rather than blocking
  on asset production.

### 6. Wire the results page conversion moment (`app/challenge/session/[sessionId]/results/page.tsx`)

Two things here, both in the `isDiagnostic && weakestTrigger` block (line 258 onward):

1. Replace the two generic `/pricing` links (line 284 `"Unlock Full Challenge — $4.99"` and line 287
   `"Get All 5 Challenges — $19.99"`) with direct `CheckoutRedirectButton`s — `session.edition` is
   already available in scope, so this skips a hop through `/pricing` entirely:
   - `<CheckoutRedirectButton sku={`CHAL-SINGLE-${session.edition.toUpperCase()}`} label="Unlock Full Challenge — $4.99" />`
   - `<CheckoutRedirectButton sku="CHAL-UNLIMITED" label="Get All 5 Challenges — $19.99" />`
2. Add `<CrossSellStrip product="wallet" />` (or rotate between wallet/magnet) directly below the
   conversion card — this is the "Build your armor" contextual cross-sell moment from the spec,
   surfaced right after a scored weakness. Keep it visually separate from the digital upsell above it
   — different card, not merged into the same box, since physical and digital are independent
   purchases that don't gate each other.

### 7. New page: `app/challenge/claim/page.tsx`

Doesn't exist yet. This is where Shopify's checkout redirects back to after a **digital** purchase
(`CHAL-*` SKUs only — physical KonfyGuard orders just land on Shopify's own order confirmation, no
claim page needed for those).

- Accepts a query param identifying the session to return to (decide the exact param name based on
  what you set as the cart's redirect/return URL when building `/api/checkout/create` in the other
  brief — keep them in sync).
- On mount, polls `GET /api/entitlements/me` every ~1.5s for up to ~10s.
- As soon as the response includes an entitlement matching what was just purchased (single/edition or
  unlimited), redirect into `/challenge/{edition}/start?mode=full` (or, if unlimited was purchased
  with no specific edition in context, back to `/challenge` to pick one).
- If nothing shows up after ~10s, don't spin forever — show a "still processing, this can take a
  minute" message with a manual refresh button. The webhook is the real source of truth; this page is
  just smoothing over the async gap, not a hard dependency.

### 8. New page: `app/contact/page.tsx` (with `?topic=schools-teams` handling)

Doesn't exist yet — there's no CRM/lead-pipeline integration anywhere in this codebase currently, so
don't assume one. Build:
- A simple form: name, email, organization, seat count, message.
- `POST` to a new `app/api/contact/route.ts` that, for v1, sends an email (pick whatever mail-sending
  approach is simplest to stand up given the stack — Resend, Nodemailer with an SMTP relay, etc.) to
  the business inbox, or at minimum persists the submission to the database if email isn't feasible
  yet. Flag back if you need a decision on which — don't block on it, a logged/stored submission that
  someone checks manually is an acceptable v1 fallback.
- This form must never show a price, never mention Shopify, never say "buy" — it's a lead form, not a
  checkout. `?topic=schools-teams` just pre-fills a hidden field / adjusts the intro copy so the
  business knows which CTA sent them here.

### Acceptance criteria (subset of `docs/UX_UI_COMMERCE_SPEC_V1.docx` §8 relevant to this brief)

- TC-01: Load `/pricing` and `/products` desktop + mobile — no `boxShadow` in computed styles, every
  color resolves from `tokens.ts`.
- TC-06: A user holding a `single` entitlement sees the $15 upgrade CTA on `/pricing`; a user without
  `single` does not see it.
- TC-08: Clicking the Schools & Teams CTA anywhere on the site always lands on `/contact` — at no
  point is a price or Shopify link rendered for that path.
- TC-10: Opening a lockscreen download with zero purchases proceeds immediately — never blocked by a
  paywall or cart.
- TC-11: `/pricing`, `/products`, and the results-page cross-sell all call the same
  `CheckoutRedirectButton` → same `/api/checkout/create` → same Shopify store. Diff the three call
  sites to confirm there's no second implementation anywhere.
