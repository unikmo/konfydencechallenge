# Engineer-Level QA Checklist

Complete quality assurance checklist for production readiness.

---

## Pre-Deployment Checks

### Code Quality

- [ ] **No console.logs in production code**
  - Search: `grep -r "console.log" app/ --exclude-dir=node_modules | grep -v "console.error"`
  - All logging should use `console.error()` only (or structured logging)

- [ ] **All TypeScript types are strict**
  - Verify: `tsconfig.json` has `"strict": true`
  - No `any` types except in 3rd party integrations
  - Command: `npx tsc --noEmit`

- [ ] **No hardcoded secrets or keys**
  - Search: No API keys in code
  - All secrets in environment variables
  - `.env.example` has placeholders, not real values

- [ ] **Proper error handling**
  - ✓ Try/catch blocks on all async operations
  - ✓ Error logging included
  - ✓ User-friendly error messages returned
  - ✓ No stack traces exposed to client

- [ ] **No unused imports**
  - Command: `npm run lint`
  - All imports are used
  - No dead code

### Security

- [ ] **CORS properly configured**
  - Only trusted origins allowed
  - Credentials handled correctly

- [ ] **Webhook signature verification**
  - ✓ `shopify-purchase` webhook verifies HMAC
  - ✓ Rejects unsigned requests
  - ✓ Cannot be fooled with replay attacks

- [ ] **Database injection prevention**
  - ✓ Prisma prevents SQL injection
  - ✓ No raw queries
  - ✓ Input validation on all user inputs

- [ ] **Rate limiting** (optional but recommended)
  - [ ] Contact form endpoint
  - [ ] Checkout endpoint

- [ ] **No sensitive data in logs**
  - No credit card numbers
  - No API tokens
  - No user emails in logs (unless necessary)

### Database

- [ ] **Migrations are clean**
  - Command: `npm run prisma:migrate`
  - No errors
  - Schema matches implementation

- [ ] **Database indexes exist**
  - ✓ `Entitlement.userId` indexed
  - ✓ `Entitlement.shopifyOrderId` unique
  - ✓ Efficient queries

- [ ] **No N+1 queries**
  - ✓ Webhook doesn't loop over queries
  - ✓ Entitlements fetch uses `.include()`

- [ ] **Schema is final**
  - No breaking changes
  - All fields necessary
  - Comments on complex fields

### API Endpoints

#### `POST /api/checkout/create`

- [ ] **Input validation**
  - ✓ SKU is required and string
  - ✓ SKU is in valid list
  - ✓ Quantity defaults to 1
  - [ ] Rejects unknown SKUs
  - [ ] Returns 400 on invalid input

- [ ] **Cookie handling**
  - ✓ Creates kf_uid if missing
  - ✓ Uses httpOnly: false (client needs to read)
  - ✓ sameSite: "lax"
  - ✓ 1-year expiry

- [ ] **Shopify integration**
  - ✓ Calls Storefront API correctly
  - ✓ Handles errors gracefully
  - ✓ Returns checkoutUrl
  - [ ] Timeout protection (doesn't hang)
  - [ ] Retries on network errors (optional)

- [ ] **Response format**
  - ✓ Returns `{ checkoutUrl: "..." }`
  - ✓ Sets cookies correctly
  - ✓ HTTPS only in production

#### `POST /api/webhooks/shopify-purchase`

- [ ] **Signature verification**
  - ✓ Reads X-Shopify-HMAC-Sha256 header
  - ✓ Verifies signature before parsing body
  - ✓ Returns 401 on invalid signature
  - ✓ Doesn't touch database if invalid

- [ ] **Webhook topic handling**
  - ✓ `orders/paid` → creates Entitlement
  - ✓ `orders/cancelled` → sets status "revoked"
  - ✓ `refunds/create` → sets status "revoked"
  - [ ] Ignores unknown topics gracefully

- [ ] **Idempotency**
  - ✓ Uses `shopifyOrderId` as unique key
  - ✓ Webhook retries don't create duplicates
  - ✓ Upsert logic prevents duplicates

- [ ] **User lookup**
  - ✓ Tries kf_uid first (from note_attributes)
  - ✓ Falls back to email
  - ✓ Creates User if missing
  - ✓ Doesn't error if no user found

- [ ] **Entitlement creation**
  - ✓ Correct tier: "single" or "unlimited"
  - ✓ Correct edition (lowercase, null for unlimited)
  - ✓ Status: "active"
  - ✓ Source: "shopify"
  - ✓ shopifyOrderId: unique

- [ ] **Physical products**
  - ✓ SKUs starting with "KG-" don't create Entitlements
  - ✓ Just logged/ignored

- [ ] **Response**
  - ✓ Always returns 200 (even on errors)
  - ✓ Responds quickly (Shopify retries on timeout)

#### `GET /api/entitlements/me`

- [ ] **Cookie reading**
  - ✓ Reads kf_uid from cookies
  - ✓ Returns empty array if no cookie
  - ✓ Returns empty array if user not found

- [ ] **Query correctness**
  - ✓ Only returns status: "active"
  - ✓ Includes tier and edition
  - ✓ Doesn't expose internal fields

- [ ] **Response format**
  - ✓ Returns `{ entitlements: Array }`
  - ✓ Each entitlement has: `{ tier, edition }`
  - ✓ No other fields exposed

#### `POST /api/contact`

- [ ] **Input validation**
  - ✓ Requires: name, email, organization, message
  - ✓ Optional: seatCount, topic
  - ✓ Email format validation
  - ✓ Returns 400 if missing fields

- [ ] **Storage**
  - ✓ Logs submission
  - ✓ Ready for email/CRM integration
  - [ ] No sensitive data stored in plain text

- [ ] **Response**
  - ✓ Returns `{ success: true }`

### Frontend Pages

#### `/` (Homepage)

- [ ] **Renders without errors**
  - No 404s
  - No console errors
  - All images load

- [ ] **All 8 sections present**
  - ✓ Hero with single CTA
  - ✓ How it works (4 steps)
  - ✓ Lockscreen block
  - ✓ Differentiation (4 cards)
  - ✓ Merch strip (2 products)
  - ✓ Other editions (4 cards)
  - ✓ Schools & Teams CTA
  - ✓ Footer disclaimer

- [ ] **Interactive elements**
  - ✓ Hero CTA → `/challenge/travelsafe/start?mode=diagnostic`
  - ✓ Merch CTAs → Checkout
  - ✓ Edition CTAs → Diagnostic
  - ✓ Contact link → `/contact`

- [ ] **Mobile responsive**
  - ✓ 375px width works
  - ✓ 768px works
  - ✓ 1440px works
  - ✓ No overflow
  - ✓ Touch targets ≥44px

- [ ] **Accessibility**
  - ✓ All images have alt text
  - ✓ Links are keyboard-navigable
  - ✓ Color contrast meets WCAG AA
  - ✓ Form labels present

#### `/challenge` (Challenge selection)

- [ ] **All 5 editions render**
  - ✓ TravelSafe
  - ✓ School
  - ✓ University
  - ✓ Family
  - ✓ Workplace

- [ ] **Pricing corrected**
  - ✓ School: $4.99 (not "$1/student/year")
  - ✓ University: $4.99 (not "$1/student/year")
  - ✓ Workplace: $4.99 (not "$5/employee/year")
  - ✓ Family: $4.99
  - ✓ TravelSafe: $4.99

- [ ] **CTAs work**
  - ✓ Diagnostic mode links work
  - ✓ Pricing link works

#### `/challenge/[edition]/start?mode=diagnostic`

- [ ] **Creates session**
  - ✓ No errors in database
  - ✓ Session has correct edition and mode
  - ✓ Redirects to `/challenge/session/[sessionId]`

- [ ] **Entitlement gating (full mode)**
  - [ ] Without entitlement → redirects to `/pricing?edition=X`
  - [ ] With single entitlement → allows start
  - [ ] With unlimited entitlement → allows start
  - [ ] With wrong edition → redirects to pricing

#### `/challenge/session/[sessionId]` (Game play)

- [ ] **Game loads**
  - ✓ Session data loads
  - ✓ Scenarios load correctly
  - ✓ No card rendering errors

- [ ] **Gameplay works**
  - ✓ Clicking answer advances
  - ✓ Progress indicator updates
  - ✓ Scoring calculated correctly

#### `/challenge/session/[sessionId]/results` (Results)

- [ ] **Results calculated**
  - ✓ Readiness Score computed correctly
  - ✓ Pressure pattern identified correctly
  - ✓ Explanations shown

- [ ] **Upsells rendered**
  - ✓ "Unlock Full Challenge" CTA visible
  - ✓ "Get All 5 Challenges" CTA visible
  - ✓ Cross-sell strip visible

- [ ] **CTAs work**
  - ✓ CheckoutRedirectButton functions
  - ✓ Calls correct SKUs
  - ✓ Redirects to Shopify

#### `/challenge/claim`

- [ ] **Page renders**
  - ✓ Loading spinner shown
  - ✓ Message displays

- [ ] **Polling works**
  - ✓ Calls `/api/entitlements/me`
  - ✓ Polls every 1.5 seconds
  - ✓ Stops after 10 attempts (~15 seconds)

- [ ] **Redirect on success**
  - ✓ Finds entitlement
  - ✓ Redirects to full challenge
  - ✓ User can play full mode

- [ ] **Error handling**
  - ✓ Shows message if timeout
  - ✓ Refresh button works

#### `/contact`

- [ ] **Form renders**
  - ✓ All fields present
  - ✓ Topic parameter respected
  - ✓ No prices shown

- [ ] **Form validation**
  - ✓ Requires fields
  - ✓ Email validation
  - ✓ Shows errors

- [ ] **Submission**
  - ✓ Sends to `/api/contact`
  - ✓ Shows success message
  - ✓ Links back to home

### Components

#### `CheckoutRedirectButton`

- [ ] **Rendering**
  - ✓ Renders button
  - ✓ Shows correct label
  - ✓ Primary and outline variants work

- [ ] **Functionality**
  - ✓ Calls `/api/checkout/create`
  - ✓ Shows loading state
  - ✓ Redirects to Shopify
  - ✓ Error handling

- [ ] **Accessibility**
  - ✓ Button type correct
  - ✓ Disabled state works
  - ✓ Error message visible

#### `PricingCard`, `ProductCard`, `CrossSellStrip`, `InstitutionalCTA`

- [ ] **Rendering**
  - ✓ All props handled
  - ✓ Responsive layout
  - ✓ Design tokens used

- [ ] **No hardcoded colors**
  - ✓ Uses tokens.bgCanvas
  - ✓ Uses tokens.textOnDark
  - ✓ Uses tokens.accentAmber
  - ✓ etc.

- [ ] **No box-shadows**
  - ✓ Flat design system
  - ✓ No drop shadows

---

## Performance Checks

- [ ] **Build size**
  - Check: `npm run build`
  - Total bundle size reasonable
  - No huge dependencies added

- [ ] **Database query performance**
  - [ ] Webhook doesn't do N+1 queries
  - [ ] Entitlements fetch is efficient
  - [ ] No missing indexes

- [ ] **API response times**
  - [ ] Checkout: <2 seconds
  - [ ] Entitlements: <500ms
  - [ ] Contact: <1 second

- [ ] **Page load times**
  - [ ] Homepage: <3 seconds
  - [ ] Challenge page: <2 seconds
  - [ ] Mobile: <4 seconds

---

## Browser/Device Testing

### Desktop

- [ ] **Chrome latest**
  - No errors
  - All features work

- [ ] **Firefox latest**
  - No errors
  - All features work

- [ ] **Safari latest**
  - No errors
  - All features work

### Mobile

- [ ] **iPhone (iOS 16+)**
  - All flows work
  - Touch targets work
  - Keyboard doesn't block content

- [ ] **Android (Chrome, Samsung)**
  - All flows work
  - Touch targets work
  - Responsive layout

### Tablets

- [ ] **iPad landscape/portrait**
  - Layouts work on both
  - Not mobile, not desktop

---

## Shopify Integration Tests

### Test Mode (Shopify)

- [ ] **Credentials configured**
  - ✓ Token present
  - ✓ Secret present
  - ✓ Domain correct

- [ ] **Products in Shopify**
  - ✓ All 9 products created
  - ✓ All variants created
  - ✓ All prices correct
  - ✓ SKUs match code

- [ ] **Webhooks configured**
  - ✓ `orders/paid` points to correct URL
  - ✓ `orders/cancelled` configured
  - ✓ `refunds/create` configured
  - ✓ All in JSON format

- [ ] **Test checkout flow**
  - ✓ Click checkout button
  - ✓ Redirected to Shopify
  - ✓ Test card accepted: `4111 1111 1111 1111`
  - ✓ Order created in Shopify
  - ✓ Webhook fires
  - ✓ Entitlement created in database
  - ✓ Claim page redirects
  - ✓ Can play full challenge

### Webhook Testing

- [ ] **Webhook delivery**
  - ✓ Check Shopify webhook logs
  - ✓ All 3 webhook types deliver
  - ✓ Status: 200 OK

- [ ] **Signature verification**
  - [ ] Test invalid signature → 401
  - [ ] Test valid signature → 200
  - [ ] Webhook retries work

- [ ] **Database effects**
  - ✓ `orders/paid` → Entitlement created
  - ✓ `orders/cancelled` → Status "revoked"
  - ✓ `refunds/create` → Status "revoked"

---

## Edge Cases & Error Scenarios

### Checkout Edge Cases

- [ ] **Double-click checkout**
  - ✓ Creates only one cart
  - ✓ No duplicate orders

- [ ] **Network timeout**
  - ✓ Error message shown
  - ✓ Button can be retried

- [ ] **Invalid SKU**
  - ✓ Returns 400
  - ✓ Error message shown

- [ ] **Missing Shopify credentials**
  - ✓ Returns 500
  - ✓ Error logged

### Webhook Edge Cases

- [ ] **Duplicate webhooks**
  - ✓ Idempotent (upsert)
  - ✓ No duplicate entitlements

- [ ] **Webhook arrives before redirect**
  - ✓ Claim page finds entitlement
  - ✓ Immediate redirect

- [ ] **Webhook delayed**
  - ✓ Claim page times out
  - ✓ Shows error message
  - ✓ Refresh works

- [ ] **Webhook never arrives**
  - ✓ Claim page times out after 15 seconds
  - ✓ Error message shown
  - ✓ Manual refresh button works

### Entitlement Edge Cases

- [ ] **No kf_uid cookie**
  - ✓ Returns empty entitlements
  - ✓ No error

- [ ] **Wrong edition entitlement**
  - ✓ Gating blocks access
  - ✓ Redirects to pricing

- [ ] **Revoked entitlement**
  - ✓ Can't play full challenge
  - ✓ Redirects to pricing

- [ ] **Unlimited entitlement**
  - ✓ Can play any edition
  - ✓ No redirect

### Contact Form Edge Cases

- [ ] **Missing required fields**
  - ✓ Form validation catches it
  - ✓ Shows error

- [ ] **Invalid email**
  - ✓ Form validation catches it
  - ✓ Shows error

- [ ] **Very long message**
  - ✓ Form accepts it
  - ✓ Submission works

---

## Deployment Checklist

Before deploying to production:

- [ ] All QA checks above pass
- [ ] No console.logs in production code
- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] Shopify webhooks point to production domain
- [ ] SSL certificate active
- [ ] Backups configured
- [ ] Error monitoring set up (optional)
- [ ] Analytics configured (optional)
- [ ] CDN/caching rules set (optional)

---

## Post-Deployment Verification

After deploying:

- [ ] **Homepage loads**
  - ✓ All sections render
  - ✓ No errors

- [ ] **Sample user flow**
  - ✓ Play diagnostic
  - ✓ See results
  - ✓ Try checkout (don't complete)
  - ✓ Contact form submits

- [ ] **Monitor logs**
  - ✓ No errors
  - ✓ No 500s
  - ✓ Normal request volume

- [ ] **Check webhook delivery**
  - ✓ Shopify webhook logs show 200s
  - ✓ Entitlements being created
  - ✓ Database updating

- [ ] **Sample payment flow** (after 24 hours)
  - ✓ Complete test purchase
  - ✓ Webhook delivers
  - ✓ Entitlement created
  - ✓ Full challenge unlocked

---

## Sign-Off

- [ ] Code reviewed
- [ ] All QA checks passed
- [ ] All tests passing
- [ ] Shopify integration verified
- [ ] Edge cases handled
- [ ] Documentation up to date
- [ ] Ready for production

**QA Approved**: ____________  Date: ____________

**Deployed By**: ____________  Date: ____________
