import fs from 'node:fs';
import path from 'node:path';
import { chromium, firefox, webkit } from 'playwright';

const BASE_URL = (process.env.BASE_URL || 'https://konfydence.com').replace(/\/$/, '');
const OUT_DIR = process.env.QA_OUT_DIR || 'qa-artifacts';
fs.mkdirSync(OUT_DIR, { recursive: true });

const defects = [];
const add = (severity, id, message, meta = {}) => defects.push({ area: 'Commerce', severity, id, message, ...meta });
const browsers = { chromium, firefox, webkit };

for (const [name, browserType] of Object.entries(browsers)) {
  const browser = await browserType.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();

  for (const route of ['/products', '/pricing']) {
    const response = await page.goto(`${BASE_URL}${route}`, { waitUntil: 'networkidle', timeout: 45000 }).catch(() => null);
    if (!response || response.status() >= 500 || response.status() === 404) add('high', `${name}-${route}`, `${route} is unavailable in ${name} (HTTP ${response?.status() || 'none'})`);
    const broken = await page.locator('img').evaluateAll((imgs) => imgs.filter((img) => img.complete && img.naturalWidth === 0).map((img) => img.getAttribute('src') || img.getAttribute('alt') || 'unknown'));
    if (broken.length) add('high', `${name}-${route}-images`, `${route} has broken product assets`, { broken });
  }

  await page.goto(`${BASE_URL}/products`, { waitUntil: 'networkidle' });
  const purchaseButton = page.getByRole('button', { name: /add to cart/i }).first();
  if (!(await purchaseButton.count())) {
    add('high', `${name}-purchase-button`, 'Products page has no Add to cart button');
  } else {
    await page.route('**/api/checkout/create', async (route) => {
      await route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ error: 'QA simulated checkout failure' }) });
    });
    await purchaseButton.click();
    const alert = page.getByRole('alert');
    if (!(await alert.count())) add('high', `${name}-checkout-failure-state`, 'Checkout API failure does not produce a visible error state');
    else if (!/QA simulated checkout failure|failed|error/i.test(await alert.textContent() || '')) add('medium', `${name}-checkout-error-copy`, 'Checkout error state is visible but unclear');
  }

  const invalidSku = await context.request.post(`${BASE_URL}/api/checkout/create`, { data: { sku: 'QA-NOT-A-SKU' } }).catch(() => null);
  if (invalidSku?.status() !== 400) add('high', `${name}-invalid-sku`, `Unknown SKU should return 400, got ${invalidSku?.status() || 'none'}`);

  const invalidQty = await context.request.post(`${BASE_URL}/api/checkout/create`, { data: { sku: 'KG-WALLET', quantity: 11 } }).catch(() => null);
  if (invalidQty?.status() !== 400) add('high', `${name}-invalid-quantity`, `Quantity 11 should return 400, got ${invalidQty?.status() || 'none'}`);

  await browser.close();
}

const counts = defects.reduce((acc, item) => ({ ...acc, [item.severity]: (acc[item.severity] || 0) + 1 }), {});
const gate = defects.some((d) => d.severity === 'critical' || d.severity === 'high') ? 'FAIL' : 'PASS';
const report = { agent: 'Independent QA Agent — Commerce', generatedAt: new Date().toISOString(), gate, counts, defects };
fs.writeFileSync(path.join(OUT_DIR, 'independent-qa-commerce.json'), JSON.stringify(report, null, 2));
fs.writeFileSync(path.join(OUT_DIR, 'independent-qa-commerce.md'), [
  '# Independent Commerce QA',
  '',
  `**Gate:** **${gate}**`,
  `**Critical:** ${counts.critical || 0} · **High:** ${counts.high || 0} · **Medium:** ${counts.medium || 0}`,
  '',
  ...(defects.length ? defects.map((d) => `- **${d.severity.toUpperCase()} · ${d.id}** — ${d.message}`) : ['- None']),
].join('\n'));
console.log(fs.readFileSync(path.join(OUT_DIR, 'independent-qa-commerce.md'), 'utf8'));
process.exit(gate === 'PASS' ? 0 : 1);
