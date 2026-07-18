# Shopify Setup Guide for Konfydence

This guide walks through all the Shopify configuration needed to make the Konfydence website fully functional with commerce.

## Prerequisites

- Shopify store already created at `https://admin.shopify.com/store/konfydence`
- Store domain: `shop.konfydence.com`
- Admin access to the store
- Storefront API access token generated

---

## Step 1: Get Your Shopify Credentials

### Storefront Access Token

1. Go to **Shopify Admin** → **Settings** → **Apps and integrations**
2. Click **Develop apps**
3. If no "Konfydence" app exists, create one:
   - App name: `Konfydence`
   - Admin API access scopes: (not needed for v1)
   - Storefront API access scopes: Select **`unauthenticated_read_products`**, **`unauthenticated_write_checkouts`**
4. Click **Install app**
5. Go to the **Configuration** tab
6. Under **Storefront API credentials**, copy the **Access token** (looks like: `Z2lkOi8vc2hvcGlmeS9...`)
7. Save this value

### Webhook Secret

1. Go to **Settings** → **Notifications**
2. Scroll to **Webhooks**
3. You should see three webhooks already created pointing to `https://konfydence.com/api/webhooks/shopify-purchase`:
   - `orders/paid`
   - `orders/cancelled`
   - `refunds/create`
4. If not created yet, click **Create webhook** for each topic and set:
   - **Webhook topics**: Select the topic
   - **Webhook URL**: `https://konfydence.com/api/webhooks/shopify-purchase` (or `http://localhost:3000/api/webhooks/shopify-purchase` for local testing)
   - **Format**: JSON
5. Click **Save webhook**
6. For any webhook, click **Edit** and copy the **Signing secret** (looks like: `abcd1234efgh5678...`)
7. Save this value

---

## Step 2: Get Product Variant IDs

Each SKU needs a **variant GID** (GraphQL ID) from Shopify. Follow these steps for each product:

### For each Challenge SKU:

1. Go to **Products** in Shopify admin
2. Click the product (e.g., "Konfydence Challenge — Single Edition")
3. Click on the variant (e.g., "School")
4. Look at the URL bar — it will show something like:
   ```
   https://admin.shopify.com/store/konfydence/products/123456789/variants/987654321
   ```
5. The variant ID is the number after `/variants/` — note it down
6. Convert to GID format:
   ```
   gid://shopify/ProductVariant/987654321
   ```

**SKUs to configure:**

| SKU | Product | Variant | Expected GID Format |
|-----|---------|---------|----------------------|
| `CHAL-SINGLE-SCHOOL` | Konfydence Challenge — Single Edition | School | `gid://shopify/ProductVariant/...` |
| `CHAL-SINGLE-UNIVERSITY` | Konfydence Challenge — Single Edition | University | `gid://shopify/ProductVariant/...` |
| `CHAL-SINGLE-FAMILY` | Konfydence Challenge — Single Edition | Family | `gid://shopify/ProductVariant/...` |
| `CHAL-SINGLE-TRAVELSAFE` | Konfydence Challenge — Single Edition | TravelSafe | `gid://shopify/ProductVariant/...` |
| `CHAL-SINGLE-WORKPLACE` | Konfydence Challenge — Single Edition | Workplace | `gid://shopify/ProductVariant/...` |
| `CHAL-UNLIMITED` | Konfydence Challenge — Unlimited Access | (default) | `gid://shopify/ProductVariant/...` |
| `CHAL-UPGRADE` | Konfydence Challenge — Upgrade to Unlimited | (default) | `gid://shopify/ProductVariant/...` |
| `KG-WALLET` | KonfyGuard Wallet Card | (default) | `gid://shopify/ProductVariant/...` |
| `KG-MAGNET` | KonfyGuard Home Fridge Magnet | (default) | `gid://shopify/ProductVariant/...` |

---

## Step 3: Update Environment Variables

In your `.env` file, add:

```bash
# Shopify
SHOPIFY_STORE_DOMAIN="shop.konfydence.com"
SHOPIFY_STOREFRONT_ACCESS_TOKEN="<paste your token here>"
SHOPIFY_WEBHOOK_SECRET="<paste your webhook secret here>"
```

For **local development** (testing), use the local webhook URL:

Update Shopify webhooks to point to:
```
http://localhost:3000/api/webhooks/shopify-purchase
```

Use ngrok or a similar service to expose your local server to the internet so Shopify can reach it:
```bash
ngrok http 3000
# This gives you a URL like: https://abc123.ngrok.io
# Update webhooks to: https://abc123.ngrok.io/api/webhooks/shopify-purchase
```

---

## Step 4: Update SKU to Variant GID Mapping

In `/app/api/checkout/create/route.ts`, update the `SKU_TO_VARIANT_GID` map with your actual variant IDs:

```ts
const SKU_TO_VARIANT_GID: Record<string, string> = {
  "CHAL-SINGLE-SCHOOL": "gid://shopify/ProductVariant/YOUR_VARIANT_ID_HERE",
  "CHAL-SINGLE-UNIVERSITY": "gid://shopify/ProductVariant/YOUR_VARIANT_ID_HERE",
  "CHAL-SINGLE-FAMILY": "gid://shopify/ProductVariant/YOUR_VARIANT_ID_HERE",
  "CHAL-SINGLE-TRAVELSAFE": "gid://shopify/ProductVariant/YOUR_VARIANT_ID_HERE",
  "CHAL-SINGLE-WORKPLACE": "gid://shopify/ProductVariant/YOUR_VARIANT_ID_HERE",
  "CHAL-UNLIMITED": "gid://shopify/ProductVariant/YOUR_VARIANT_ID_HERE",
  "CHAL-UPGRADE": "gid://shopify/ProductVariant/YOUR_VARIANT_ID_HERE",
  "KG-WALLET": "gid://shopify/ProductVariant/YOUR_VARIANT_ID_HERE",
  "KG-MAGNET": "gid://shopify/ProductVariant/YOUR_VARIANT_ID_HERE",
};
```

---

## Step 5: Verify Shopify Products

Make sure all products exist in your Shopify store with correct pricing:

- **CHAL-SINGLE-***: $4.99 each (digital, no shipping)
- **CHAL-UNLIMITED**: $19.99 (digital, no shipping)
- **CHAL-UPGRADE**: $15.00 (digital, no shipping, shown only to existing single-tier holders)
- **KG-WALLET**: $14.99 (physical, ships)
- **KG-MAGNET**: $9.99 (physical, ships)

---

## Step 6: Test the Integration

### Test Mode (Shopify)

1. In Shopify Admin → **Settings** → **Payment providers**
2. Enable **Test mode** to use Shopify's test credit card
3. Test card: `4111 1111 1111 1111` / Any future date / Any CVC

### Local Testing Flow

1. Start your dev server:
   ```bash
   npm run dev
   ```

2. Visit `http://localhost:3000`

3. Click "Take Free TravelSafe Check" to start a diagnostic session

4. After the diagnostic completes, click "Unlock Full Challenge" ($4.99)

5. You'll be redirected to Shopify checkout

6. Use test card `4111 1111 1111 1111` to complete purchase

7. After checkout, Shopify redirects you to `/challenge/claim`

8. The claim page polls your entitlements every 1.5 seconds

9. When the webhook delivers and you have an entitlement, you're automatically redirected to `/challenge/travelsafe/start?mode=full`

10. Verify you can now play the full 50-question challenge

---

## Step 7: Database Migration

Before testing, run the Prisma migration to add the Entitlement model:

```bash
npm run prisma:migrate
```

This creates the `entitlements` table in your database.

---

## Troubleshooting

### Webhook not delivering

- Check that your webhook URL is correct and publicly accessible
- Use ngrok for local testing: `ngrok http 3000`
- In Shopify admin, view webhook logs in **Settings** → **Notifications** → **Webhooks**
- Look for error messages in the webhook delivery log

### Variant GID not working

- Make sure you're using the correct variant ID from Shopify
- Format must be: `gid://shopify/ProductVariant/XXXXX` (replace XXXXX with your ID)
- Test the variant GID by trying to add it to a cart through the Storefront API

### Entitlements not appearing

- Check that the webhook secret is correct
- Verify HMAC signature validation in logs
- Check that the order is marked as "paid" in Shopify
- Look for any error messages in server logs when the webhook arrives

### Checkout redirect not working

- Make sure `NEXT_PUBLIC_APP_URL` is set correctly (for production, should be `https://www.konfydence.com`)
- Verify the return URL is being passed to the Storefront API correctly
- Check browser console for any errors

---

## Next Steps

Once testing is complete and verified:

1. Update webhooks to point to production domain: `https://www.konfydence.com/api/webhooks/shopify-purchase`
2. Deploy to production
3. Set up email notifications for contact form submissions (currently logs to console only)
4. Monitor webhook delivery logs in Shopify admin
5. Test with real payment methods in production

---

## Environment Variables Summary

```bash
# .env file
DATABASE_URL="file:./dev.db"
NEXT_PUBLIC_APP_URL="http://localhost:3000"  # For prod: "https://www.konfydence.com"
AUTH_SECRET="replace-me"

SHOPIFY_STORE_DOMAIN="shop.konfydence.com"
SHOPIFY_STOREFRONT_ACCESS_TOKEN="Z2lkOi8vc2hvcGlmeS8..."  # Your token
SHOPIFY_WEBHOOK_SECRET="abcd1234efgh5678..."  # Your secret
```
