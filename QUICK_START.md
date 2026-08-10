# Konfydence Website - Quick Start Guide

Get the Konfydence website running locally in 5 minutes.

---

## Prerequisites

- Node.js 18+ installed
- Git cloned locally
- Shopify store admin access (for credentials)

---

## Step 1: Install Dependencies

```bash
npm install
```

This adds uuid and all other required packages.

---

## Step 2: Set Up Database

```bash
npm run prisma:migrate
```

This creates the Entitlement table and all schema changes.

---

## Step 3: Get Shopify Credentials

### Option A: Quick Test (Skip Shopify for now)

Skip this if you just want to see the homepage and play free diagnostics. Come back to this later.

### Option B: Full Setup (Recommended)

1. **Get Storefront Access Token**
   - Go to Shopify Admin → Settings → Apps and integrations → Develop apps
   - Find or create "Konfydence" app
   - Copy the Storefront API Access Token

2. **Get Webhook Secret**
   - Go to Shopify Admin → Settings → Notifications
   - View any webhook pointing to `/api/webhooks/shopify-purchase`
   - Copy the Webhook Signing Secret

3. **Get Variant GIDs**
   - For each product in Shopify, note the variant ID from the URL
   - Convert to format: `gid://shopify/ProductVariant/XXXXX`
   - See docs/SHOPIFY_SETUP_GUIDE.md for detailed instructions

---

## Step 4: Configure Environment

Create/update `.env` file:

```bash
# Local database
DATABASE_URL="file:./dev.db"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Auth placeholder
AUTH_SECRET="replace-me"

# Shopify (fill these in with your credentials)
SHOPIFY_STORE_DOMAIN="shop.konfydence.com"
SHOPIFY_STOREFRONT_ACCESS_TOKEN="<paste your token here>"
SHOPIFY_WEBHOOK_SECRET="<paste your secret here>"
```

---

## Step 5: Update SKU to Variant Mapping

Edit `/app/api/checkout/create/route.ts`:

Find this section:
```ts
const SKU_TO_VARIANT_GID: Record<string, string> = {
  "CHAL-SINGLE-SCHOOL": "gid://shopify/ProductVariant/SCHOOL_VARIANT_ID",
  // ... etc
};
```

Replace each `SCHOOL_VARIANT_ID` etc. with your actual variant GIDs from Shopify.

---

## Step 6: Start Dev Server

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

---

## What You'll See

✅ **Homepage** - Travel-led design with all sections
✅ **Free Diagnostic** - Play the 10-question TravelSafe challenge
✅ **Results Page** - See your Readiness Score
✅ **Upsell CTAs** - (Will error if Shopify not configured yet)
✅ **Contact Form** - Schools & Teams inquiry form
✅ **All 5 Editions** - All challenge editions available

---

## Testing Without Shopify (Recommended First Step)

1. Run `npm run dev`
2. Visit `http://localhost:3000`
3. Click "Take Free TravelSafe Check"
4. Play the 8-scenario readiness check
5. See your Readiness Score
6. (Skip the "Buy" buttons for now)

This confirms the game and scoring system work.

---

## Testing With Shopify (Full E2E)

Once Shopify credentials are configured:

1. Start dev server: `npm run dev`
2. Set up ngrok for webhook testing:
   ```bash
   ngrok http 3000
   ```
3. Update Shopify webhooks to point to your ngrok URL
4. Play full end-to-end flow:
   - Play diagnostic
   - Click "Upgrade to Full Challenge"
   - Complete test purchase with card: `4111 1111 1111 1111`
   - Verify redirect to claim page
   - Verify entitlement is created
   - Verify you can now play full challenge

See `docs/E2E_TEST_SCENARIOS.md` for complete test flows.

---

## Troubleshooting

### Port 3000 already in use

```bash
npm run dev -- -p 3001
```

Then visit `http://localhost:3001`

### Database errors

```bash
rm dev.db
npm run prisma:migrate
```

### Checkout button does nothing

This means variant GIDs aren't configured. Check:
- Are they in `/app/api/checkout/create/route.ts`?
- Are they in the correct format: `gid://shopify/ProductVariant/XXXXX`?
- Did you get them from your actual Shopify products?

### Webhook not working (local testing)

1. Make sure ngrok is running: `ngrok http 3000`
2. Update Shopify webhooks to use ngrok URL
3. Check ngrok logs to see if requests are arriving
4. Check server logs for signature verification errors

---

## Common URLs

- Homepage: `http://localhost:3000`
- Challenge selection: `http://localhost:3000/challenge`
- Start free diagnostic: `http://localhost:3000/challenge/travelsafe/start?mode=diagnostic`
- Pricing tiers: `http://localhost:3000/pricing`
- Products/Merch: `http://localhost:3000/products`
- Contact/Schools form: `http://localhost:3000/contact?topic=schools-teams`

---

## Key Features Implemented

- ✅ **Homepage redesign** - Travel-led, single CTA hero
- ✅ **Challenge games** - 5 editions × 2 modes (free diagnostic + paid full)
- ✅ **Readiness Score** - KRS rating system
- ✅ **Pressure patterns** - HACK framework tracking
- ✅ **Shopify checkout** - One-click purchase flow
- ✅ **Entitlements** - Digital access gating via purchased tier
- ✅ **Webhook handling** - Automatic entitlement creation/revocation
- ✅ **Claim page** - Post-purchase verification
- ✅ **Contact form** - Schools & Teams institutional lead capture
- ✅ **Merch cross-sell** - Physical products on results page
- ✅ **Mobile responsive** - All flows work on mobile

---

## File Structure

Most important files for customization:

```
app/
  └── page.tsx                    # Homepage (main landing page)
  └── contact/page.tsx            # Contact form for Schools & Teams
  └── api/checkout/create/route.ts # THIS IS WHERE YOU ADD VARIANT GIDs
  └── api/webhooks/shopify-purchase/route.ts  # Webhook receiver
  └── challenge/                  # All challenge game pages

components/commerce/
  └── CheckoutRedirectButton.tsx  # The button that starts checkout

lib/theme/
  └── tokens.ts                   # Color palette (customize here)

docs/
  └── SHOPIFY_SETUP_GUIDE.md      # Detailed Shopify configuration
  └── E2E_TEST_SCENARIOS.md       # Complete test flows
  └── IMPLEMENTATION_SUMMARY.md   # What was built and what's left
```

---

## Next Steps

1. ✅ Run `npm install`
2. ✅ Run `npm run prisma:migrate`
3. ✅ Create `.env` file
4. ✅ Run `npm run dev`
5. ✅ Test homepage and free diagnostic
6. ⏳ Get Shopify credentials (blocking)
7. ⏳ Configure variant GIDs
8. ⏳ Test end-to-end flow
9. ⏳ Deploy to staging
10. ⏳ Deploy to production

---

## Support

- **Homepage/UI issues**: Check `lib/theme/tokens.ts` for colors
- **Game flow issues**: Check `/app/challenge/*` pages
- **Checkout issues**: Check `/app/api/checkout/create/route.ts` variant mapping
- **Webhook issues**: Check `/app/api/webhooks/shopify-purchase/route.ts` and Shopify webhook logs
- **Entitlement issues**: Check database with `npm run prisma:studio` (interactive DB viewer)

---

## Running Prisma Studio (Database Browser)

See/edit your database visually:

```bash
npm run prisma:studio
```

This opens a web UI where you can:
- View all Entitlements created
- View all Users
- View all Challenge Sessions
- Test queries

---

**You're ready!** 🚀

Start with Step 1 above and you'll have everything running in minutes.
