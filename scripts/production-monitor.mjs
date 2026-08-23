import fs from 'node:fs';
import { chromium } from 'playwright';

const BASE_URL = (process.env.BASE_URL || 'https://konfydence.com').replace(/\/$/, '');
const OUT_DIR = process.env.QA_OUT_DIR || 'monitor-artifacts';
fs.mkdirSync(OUT_DIR, { recursive: true });
const failures = [];
const metrics = {};

async function timedFetch(route, options = {}) {
  const start = performance.now();
  const res = await fetch(`${BASE_URL}${route}`, { redirect: 'manual', cache: 'no-store', ...options }).catch(() => null);
  const ms = Math.round(performance.now() - start);
  metrics[route] = { status: res?.status || 0, ms };
  return { res, ms };
}

for (const route of ['/', '/comasy', '/products', '/api/health/comasy']) {
  const { res, ms } = await timedFetch(route);
  if (!res || res.status >= 500 || res.status === 0) failures.push(`${route} unavailable: HTTP ${res?.status || 'none'}`);
  if (ms > 5000) failures.push(`${route} degraded response time: ${ms}ms`);
}

const invalidPilot = await fetch(`${BASE_URL}/api/comasy/pilot`, {
  method: 'POST',
  redirect: 'manual',
  body: new URLSearchParams({ firstName: '', consent: 'no' }),
}).catch(() => null);
metrics.invalidPilot = invalidPilot?.status || 0;
if (!invalidPilot || ![302, 303, 307, 308].includes(invalidPilot.status)) failures.push(`Pilot validation path unexpected: HTTP ${invalidPilot?.status || 'none'}`);

const invalidCheckout = await fetch(`${BASE_URL}/api/checkout/create`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ sku: 'QA-INVALID-SKU' }),
}).catch(() => null);
metrics.invalidCheckout = invalidCheckout?.status || 0;
if (invalidCheckout?.status !== 400) failures.push(`Checkout validation path unexpected: HTTP ${invalidCheckout?.status || 'none'}`);

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
for (const route of ['/', '/comasy', '/products']) {
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(`pageerror:${error.message}`));
  page.on('console', (msg) => { if (msg.type() === 'error') errors.push(`console:${msg.text()}`); });
  await page.goto(`${BASE_URL}${route}`, { waitUntil: 'networkidle', timeout: 45000 }).catch((error) => errors.push(`navigation:${error.message}`));
  const broken = await page.locator('img').evaluateAll((imgs) => imgs.filter((img) => img.complete && img.naturalWidth === 0).length);
  if (broken) errors.push(`broken-images:${broken}`);
  if (errors.length) failures.push(`${route} frontend errors: ${errors.slice(0, 5).join(' | ')}`);
  await page.close();
}
await browser.close();

const integrationPath = `${OUT_DIR}/integrations.json`;
if (fs.existsSync(integrationPath)) {
  const data = JSON.parse(fs.readFileSync(integrationPath, 'utf8'));
  metrics.integrations = data.integrations;
  for (const key of ['database', 'crm', 'email', 'analytics', 'commerceShopify']) {
    if (data.integrations?.[key]?.state !== 'ok') failures.push(`integration ${key}: ${data.integrations?.[key]?.state || 'missing'}`);
  }
} else failures.push('integration diagnostics missing');

const report = { generatedAt: new Date().toISOString(), baseUrl: BASE_URL, failures, metrics, gate: failures.length ? 'FAIL' : 'PASS' };
fs.writeFileSync(`${OUT_DIR}/production-monitor.json`, JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
process.exit(failures.length ? 1 : 0);
