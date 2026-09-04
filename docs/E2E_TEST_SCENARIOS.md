# End-to-End Test Scenarios

Complete test flows to verify all functionality works correctly.

---

## Scenario 1: Free Diagnostic → Upgrade to Full

**Goal**: Verify a user can play free diagnostic, see upsell, and purchase full challenge.

### Steps

1. **Visit homepage**
   - URL: `http://localhost:3000`
   - ✓ See travel-led hero with "Take Free TravelSafe Check" CTA
   - ✓ See how-it-works strip (4 steps)
   - ✓ See lockscreen giveaway block with email capture
   - ✓ See merch strip (Wallet Card + Fridge Magnet)
   - ✓ See other editions below
   - ✓ See Schools & Teams CTA at bottom

2. **Start free diagnostic**
   - Click "Take Free TravelSafe Check"
   - ✓ Redirected to `/challenge/travelsafe/start?mode=diagnostic`
   - ✓ Creates a new ChallengeSession with `mode: "diagnostic"`
   - ✓ Redirected to `/challenge/session/[sessionId]`

3. **Play diagnostic challenge**
   - ✓ See 10 questions about travel scams
   - ✓ Each question has 4 answer options (A, B, C, D)
   - ✓ Clicking an answer advances to next question
   - ✓ No payment required to play

4. **View results**
   - ✓ After 10 questions, see Readiness Score (0-100)
   - ✓ See weakest pressure pattern (Hurry, Authority, Connection, Kill-switch)
   - ✓ See 2 upsell CTAs:
     - "Unlock Full Challenge — $6.99"
     - "Get All 5 Challenges — $24.99"
   - ✓ See cross-sell strip for Wallet Card or Fridge Magnet

5. **Click upsell to buy**
   - Click "Unlock Full Challenge — $6.99"
   - ✓ Browser loads `/api/checkout/create` with `sku: "CHAL-SINGLE-TRAVELSAFE"`
   - ✓ Returns `checkoutUrl` from Shopify
   - ✓ Redirected to `https://shop.konfydence.com/checkout/...`

6. **Complete Shopify checkout**
   - ✓ Shopify checkout shows TravelSafe Challenge for $6.99
   - ✓ Enter test card: `4111 1111 1111 1111`
   - ✓ Complete purchase
   - ✓ Redirected back to `http://localhost:3000/challenge/claim?edition=travelsafe`

7. **Claim page processes entitlement**
   - ✓ See "Processing your purchase" spinner
   - ✓ Page polls `/api/entitlements/me` every 1.5 seconds
   - ✓ After webhook arrives (~5 seconds), entitlement is created
   - ✓ Page auto-redirects to `/challenge/travelsafe/start?mode=full`

8. **Play full challenge**
   - ✓ Can now access full 50-question challenge
   - ✓ Challenge persists progress
   - ✓ After completion, see results page with certificate download
   - ✓ See "Replay full challenge" option

---

## Scenario 2: Purchase Unlimited Access

**Goal**: Verify user can purchase unlimited access to all 5 editions.

### Steps

1. **Visit pricing page**
   - URL: `http://localhost:3000/pricing`
   - ✓ See 4 pricing tiers
   - ✓ Free Readiness Check (links to /challenge)
   - ✓ Full Challenge - shows edition selector (School, University, Family, TravelSafe, Workplace)
   - ✓ Complete Scam-Readiness Pack ($24.99)
   - ✓ Schools & Teams (contact form link)

2. **Click to buy Unlimited**
   - Click "Get All 5 Challenges — $24.99"
   - ✓ Redirected to Shopify checkout with `sku: "CHAL-UNLIMITED"`

3. **Complete purchase**
   - ✓ Use test card to complete
   - ✓ Webhook delivers `orders/paid` event
   - ✓ Entitlement created: `tier: "unlimited", edition: null`

4. **Verify unlimited access**
   - Visit `/challenge/school/start?mode=full`
   - ✓ No redirect to pricing (has unlimited access)
   - ✓ Can start full School Edition challenge
   - Visit `/challenge/workplace/start?mode=full`
   - ✓ Can also start Workplace challenge
   - ✓ All editions are accessible

---

## Scenario 3: Purchase Physical Product

**Goal**: Verify users can buy physical products (Wallet Card) without creating entitlements.

### Steps

1. **Visit products page**
   - URL: `http://localhost:3000/products`
   - ✓ See 4 products:
     - KonfyGuard Wallet Card ($14.99)
     - KonfyGuard Fridge Magnet ($9.99)
     - Free Phone Lockscreen (blue "Free addon" badge)
     - Free Computer Lockscreen (blue "Free addon" badge)

2. **Add Wallet Card to cart**
   - Click "Add to cart" on Wallet Card
   - ✓ Redirected to Shopify checkout

3. **Complete purchase**
   - ✓ Use test card
   - ✓ Enter shipping address (physical product)
   - ✓ Complete purchase

4. **Verify no entitlement created**
   - Check database or `/api/entitlements/me`
   - ✓ No new Entitlement row created (physical products don't grant digital access)
   - ✓ User still can't access full challenges without paying for digital SKU

---

## Scenario 4: Upgrade from Single to Unlimited

**Goal**: Verify users with single edition can see and use upgrade offer.

### Prerequisites

- User must already have purchased one challenge edition (e.g., School)

### Steps

1. **User has single entitlement**
   - Database has: `Entitlement(tier: "single", edition: "school", status: "active")`

2. **Visit pricing page**
   - URL: `http://localhost:3000/pricing`
   - ✓ See different CTA for "Complete Pack" tier
   - ✓ Instead of "$24.99 Get All 5 Challenges"
   - ✓ Shows "$15 Upgrade to Unlimited"
   - ✓ This is the `CHAL-UPGRADE` SKU

3. **Click upgrade**
   - Click "Upgrade to Unlimited — $15"
   - ✓ Redirected to Shopify checkout with `sku: "CHAL-UPGRADE"`

4. **Complete upgrade purchase**
   - ✓ Use test card
   - ✓ Webhook delivers `orders/paid`
   - ✓ New entitlement created: `tier: "unlimited", edition: null`

5. **Verify upgraded access**
   - ✓ Can now access all 5 editions full challenges
   - Previous single edition still works
   - All 4 other editions now also work

---

## Scenario 5: Schools & Teams Contact Flow

**Goal**: Verify institutional inquiry flow works.

### Steps

1. **Visit contact page from homepage**
   - Click "Request a quote" on Schools & Teams section
   - ✓ Redirected to `/contact?topic=schools-teams`

2. **See contact form**
   - ✓ Form pre-labeled for schools/teams
   - ✓ Fields: Name, Email, Organization, Seat Count, Message
   - ✓ No price shown anywhere
   - ✓ No "Buy" verbs used

3. **Fill out form**
   - Name: "Jane Doe"
   - Email: "jane@myschool.edu"
   - Organization: "Lincoln High School"
   - Seat Count: "500"
   - Message: "Interested in bringing Konfydence to our 9th graders"

4. **Submit form**
   - Click "Send message"
   - ✓ Button shows "Sending..."
   - ✓ Form data POSTed to `/api/contact`
   - ✓ Server logs submission (in v1, logged to console only)

5. **See success message**
   - ✓ See "✓ Message received" confirmation
   - ✓ "We'll review your message and get back to you within 1-2 business days"
   - ✓ "Back to home" link appears

---

## Scenario 6: Free Lockscreen Download

**Goal**: Verify free lockscreen download works without friction.

### Steps

1. **On homepage**
   - Scroll to lockscreen block
   - ✓ Headline: "Keep pressure patterns visible"
   - ✓ Description mentions free download
   - ✓ Email input field
   - ✓ "Get free lockscreens" button

2. **Click download**
   - Enter email: "user@example.com"
   - Click "Get free lockscreens"
   - ✓ No checkout required
   - ✓ No account creation required
   - ✓ Button shows "Downloading..." 
   - ✓ No payment taken

3. **Verify no entitlement created**
   - ✓ Lockscreen download does NOT grant digital challenge access
   - ✓ User must still pay to play full challenges

---

## Scenario 7: Webhook Cancellation/Refund

**Goal**: Verify refunds properly revoke entitlements.

### Prerequisites

- User has purchased a challenge (has active entitlement)

### Steps

1. **In Shopify Admin**
   - Go to Orders
   - Find the test purchase order
   - Click to open order details

2. **Cancel the order**
   - Click "More actions" → "Cancel order"
   - ✓ Webhook `orders/cancelled` is sent

3. **Check entitlement revoked**
   - Database: entitlement.status should change from "active" to "revoked"
   - ✓ User can no longer access full challenges
   - ✓ If they try to visit `/challenge/school/start?mode=full`
   - ✓ Redirected back to `/pricing?edition=school`

4. **Alternative: Process refund**
   - Go back to order
   - Click "Refund" button
   - Select items to refund
   - ✓ Webhook `refunds/create` is sent
   - ✓ Same result: entitlement status → "revoked"

---

## Scenario 8: Cross-Sell Conversion

**Goal**: Verify merch cross-sell on results page works.

### Steps

1. **Complete diagnostic challenge**
   - Play 8-scenario readiness check
   - See results and Readiness Score

2. **See cross-sell strip**
   - Below the upsell CTAs
   - ✓ See "Build your armor" heading
   - ✓ See Wallet Card or Fridge Magnet
   - ✓ Price ($14.99 or $9.99)
   - ✓ Short description
   - ✓ "Add to cart" button

3. **Click to add merch**
   - Click "Add to cart — $14.99"
   - ✓ Redirected to Shopify checkout

4. **Purchase merch independently**
   - ✓ User can buy merch without buying any challenge
   - ✓ Merch purchase does NOT grant challenge access
   - ✓ After purchase, no entitlement created

---

## Scenario 9: Entitlement Gating - Blocked Access

**Goal**: Verify users without entitlements cannot access full challenges.

### Steps

1. **Without any purchase**
   - Fresh user, no `kf_uid` cookie yet
   - Try to visit: `/challenge/school/start?mode=full`
   - ✓ Redirected to `/pricing?edition=school`
   - ✓ Can see pricing tiers and upgrade options

2. **After free diagnostic only**
   - User played diagnostic (mode=diagnostic is free)
   - Try to visit: `/challenge/university/start?mode=full`
   - ✓ Redirected to `/pricing?edition=university`
   - ✓ Forced to pay before accessing full mode

3. **With wrong edition entitlement**
   - User purchased School Edition only
   - Try to visit: `/challenge/family/start?mode=full`
   - ✓ Redirected to `/pricing?edition=family`
   - ✓ Must purchase Family Edition to access it

---

## Scenario 10: Mobile Responsiveness

**Goal**: Verify all flows work on mobile (375px viewport).

### Steps

1. **Homepage**
   - ✓ Hero stacks vertically
   - ✓ Merch strip responsive
   - ✓ Editions grid wraps properly
   - ✓ CTAs are tappable (44px minimum touch target)

2. **Challenge session**
   - ✓ Questions readable on small screens
   - ✓ Answer buttons stacked and tappable
   - ✓ Progress indicator visible

3. **Checkout flow**
   - ✓ Shopify checkout is mobile-optimized (Shopify's responsibility)
   - ✓ Claim page spinner and text are readable

4. **Contact form**
   - ✓ Form fields are full-width
   - ✓ Submit button is tappable
   - ✓ Success message is readable

---

## Passing Criteria

All scenarios should pass with:

✅ No console errors
✅ No 404s or server errors
✅ Correct redirects at each step
✅ Database entitlements created/revoked at right times
✅ Shopify webhooks successfully deliver and process
✅ User flows are smooth with no unexpected gating
✅ Physical products don't create digital entitlements
✅ Free resources (lockscreen, diagnostic) stay free
✅ All CTAs work end-to-end to Shopify checkout
✅ Mobile and desktop both work

---

## Running Tests Locally

1. **Start the dev server**
   ```bash
   npm run dev
   ```

2. **Set up ngrok (for webhook testing)**
   ```bash
   ngrok http 3000
   # Copy the URL like https://abc123.ngrok.io
   ```

3. **Update Shopify webhooks**
   - Go to Shopify Admin → Settings → Notifications
   - Edit each webhook
   - Change URL to `https://abc123.ngrok.io/api/webhooks/shopify-purchase`

4. **Update .env**
   ```bash
   SHOPIFY_STOREFRONT_ACCESS_TOKEN="your-token"
   SHOPIFY_WEBHOOK_SECRET="your-secret"
   NEXT_PUBLIC_APP_URL="https://abc123.ngrok.io"
   ```

5. **Run migrations**
   ```bash
   npm run prisma:migrate
   ```

6. **Walk through each scenario**
   - Verify each step
   - Check database after each purchase
   - Watch ngrok logs for webhook deliveries
   - Check server logs for any errors
