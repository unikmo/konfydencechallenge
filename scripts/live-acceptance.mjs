import fs from 'node:fs';
import path from 'node:path';
import dns from 'node:dns/promises';
import { chromium } from 'playwright';

const BASE_URL = (process.env.BASE_URL || 'https://konfydence.com').replace(/\/$/, '');
const SHA = process.env.GITHUB_SHA || 'local';
const OUT_DIR = process.env.QA_OUT_DIR || 'qa-artifacts';
fs.mkdirSync(OUT_DIR, { recursive: true });

const findings = [];
const measurements = {};
const add = (area, severity, id, message, data = {}) => findings.push({ area, severity, id, message, ...data });

async function infrastructure() {
  const https = await fetch(`${BASE_URL}/`, { redirect: 'manual', cache: 'no-store' }).catch(() => null);
  if (!https?.ok) add('Infrastructure', 'critical', 'https', `Production HTTPS unavailable (HTTP ${https?.status || 'none'})`);
  measurements.https = https?.status || 0;

  const http = await fetch('http://konfydence.com/', { redirect: 'manual' }).catch(() => null);
  const location = http?.headers.get('location') || '';
  measurements.httpRedirect = { status: http?.status || 0, location };
  if (!http || ![301, 302, 307, 308].includes(http.status) || !location.startsWith('https://')) {
    add('Infrastructure', 'high', 'https-redirect', 'HTTP does not reliably redirect to HTTPS');
  }

  const addresses = await dns.resolve4('konfydence.com').catch(() => []);
  measurements.dnsA = addresses;
  if (!addresses.length) add('Infrastructure', 'critical', 'dns', 'konfydence.com has no resolvable A record');

  const asset = await fetch(`${BASE_URL}/hero/konfydence-travelsafe-vacation.jpg`, { method: 'HEAD', cache: 'no-store' }).catch(() => null);
  measurements.heroAsset = {
    status: asset?.status || 0,
    cacheControl: asset?.headers.get('cache-control') || '',
    contentLength: Number(asset?.headers.get('content-length') || 0),
  };
  if (!asset?.ok) add('Infrastructure', 'high', 'cdn-static-asset', 'Static hero asset is unavailable through production CDN');
}

async function analyticsAndJourneys() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1365, height: 900 } });
  const analyticsRequests = [];
  context.on('request', (req) => {
    if (/google-analytics\.com|googletagmanager\.com/.test(req.url())) analyticsRequests.push(req.url());
  });
  const page = await context.newPage();

  await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  const beforeConsent = analyticsRequests.length;
  measurements.analyticsRequestsBeforeConsent = beforeConsent;
  if (beforeConsent > 0) add('Compliance', 'high', 'analytics-before-consent', `Analytics made ${beforeConsent} network request(s) before explicit consent`);

  const accept = page.getByRole('button', { name: /accept all/i });
  if (await accept.count()) {
    await accept.click();
    await page.waitForTimeout(1200);
  }
  const consent = await page.evaluate(() => localStorage.getItem('analytics-consent'));
  if (consent !== 'true') add('Analytics', 'high', 'consent-state', 'Accept All did not persist analytics consent');

  await page.evaluate(() => {
    const w = window;
    w.__qaAnalyticsEvents = [];
    const original = w.gtag;
    w.gtag = (...args) => {
      w.__qaAnalyticsEvents.push(args);
      if (original) original(...args);
    };
  });

  const comasy = page.locator('a[href="/comasy"]').first();
  if (!(await comasy.count())) {
    add('Navigation', 'high', 'home-comasy-nav', 'Home page has no CoMaSy navigation link');
  } else {
    await comasy.evaluate((node) => node.addEventListener('click', (event) => event.preventDefault(), { once: true }));
    await comasy.click();
    const events = await page.evaluate(() => window.__qaAnalyticsEvents || []);
    measurements.homeCtaEvents = events.map((event) => event[0]);
    if (!events.some((event) => ['cta_click', 'pilot_cta_click', 'challenge_cta_click'].includes(event[0]))) {
      add('Analytics', 'high', 'cta-event', 'CTA click did not emit a measurable analytics event after consent');
    }
    await page.goto(`${BASE_URL}/comasy`, { waitUntil: 'networkidle' });
  }

  const pilotLink = page.locator('a[href="/comasy/pilot"]').first();
  if (!(await pilotLink.count())) add('Lead Journey', 'high', 'pilot-cta', 'CoMaSy page has no pilot CTA');
  else {
    await pilotLink.click();
    await page.waitForURL('**/comasy/pilot');
  }

  const form = page.locator('form').first();
  if (!(await form.count())) {
    add('Lead Journey', 'critical', 'pilot-form', 'Pilot form is missing');
  } else {
    await page.evaluate(() => {
      window.__qaAnalyticsEvents = [];
      const original = window.gtag;
      window.gtag = (...args) => {
        window.__qaAnalyticsEvents.push(args);
        if (original) original(...args);
      };
    });
    await page.locator('input[name="firstName"]').focus();
    await page.waitForTimeout(100);
    const events = await page.evaluate(() => window.__qaAnalyticsEvents || []);
    if (!events.some((event) => event[0] === 'form_start')) add('Analytics', 'high', 'form-start-event', 'Pilot form start is not instrumented');
    const validWhenEmpty = await form.evaluate((node) => node.checkValidity());
    if (validWhenEmpty) add('Lead Journey', 'high', 'empty-form', 'Pilot form is valid while empty');
  }

  const productPage = await context.newPage();
  const productResponse = await productPage.goto(`${BASE_URL}/products`, { waitUntil: 'networkidle' }).catch(() => null);
  if (!productResponse?.ok()) add('Commerce', 'high', 'products-page', `Products page unavailable (HTTP ${productResponse?.status() || 'none'})`);
  const checkout = await context.request.post(`${BASE_URL}/api/checkout/create`, {
    data: { sku: 'KG-WALLET', quantity: 1 },
    headers: { 'Content-Type': 'application/json' },
  }).catch(() => null);
  if (!checkout || !checkout.ok()) {
    add('Commerce', 'high', 'checkout-create', `Shopify checkout handoff failed (HTTP ${checkout?.status() || 'none'})`);
  } else {
    const body = await checkout.json().catch(() => ({}));
    measurements.checkoutUrlHost = body.checkoutUrl ? new URL(body.checkoutUrl).host : '';
    if (!body.checkoutUrl || !/^https:\/\//.test(body.checkoutUrl)) add('Commerce', 'high', 'checkout-url', 'Checkout API did not return a valid HTTPS checkout URL');
  }
  measurements.paymentOrderAcceptance = 'manual-required-no-charge-performed';
  add('Commerce', 'medium', 'payment-order-manual', 'Automated QA stops before charging a real payment method. Payment → order → confirmation must be exercised with a designated Shopify test order before major commerce launches.');

  await browser.close();
}

function integrations() {
  const file = path.join(OUT_DIR, 'integrations.json');
  if (!fs.existsSync(file)) {
    add('Integrations', 'high', 'integration-report', 'Protected production integration report is missing');
    return;
  }
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  measurements.integrations = data.integrations || {};
  for (const name of ['database', 'crm', 'email', 'analytics', 'commerceShopify']) {
    const state = data.integrations?.[name]?.state || 'missing';
    if (state !== 'ok') add('Integrations', 'high', `integration-${name}`, `${name} integration state is ${state}`);
  }
}

await infrastructure();
await analyticsAndJourneys();
integrations();

const counts = findings.reduce((acc, item) => ({ ...acc, [item.severity]: (acc[item.severity] || 0) + 1 }), {});
const gate = findings.some((item) => item.severity === 'critical' || item.severity === 'high') ? 'FAIL' : 'PASS';
const report = {
  agent: 'Live Acceptance Agent',
  sha: SHA,
  baseUrl: BASE_URL,
  generatedAt: new Date().toISOString(),
  gate,
  counts,
  measurements,
  findings,
  journeys: {
    leadGeneration: 'landing → CoMaSy CTA → pilot form validation → CRM write probe → email provider test delivery → analytics instrumentation',
    commerce: 'products → cart/checkout handoff → Shopify checkout URL; real payment/order confirmation intentionally requires designated test order',
  },
};
fs.writeFileSync(path.join(OUT_DIR, 'live-acceptance-report.json'), JSON.stringify(report, null, 2));
const md = [
  '# Live Acceptance Report', '',
  `**SHA:** \`${SHA}\``,
  `**Gate:** **${gate}**`,
  `**Critical:** ${counts.critical || 0} · **High:** ${counts.high || 0} · **Medium:** ${counts.medium || 0}`,
  '', '## Findings',
  ...(findings.length ? findings.map((f) => `- **${f.severity.toUpperCase()} · ${f.area} · ${f.id}** — ${f.message}`) : ['- None']),
  '', '## Customer journeys',
  `- Lead generation: ${report.journeys.leadGeneration}`,
  `- Commerce: ${report.journeys.commerce}`,
].join('\n');
fs.writeFileSync(path.join(OUT_DIR, 'live-acceptance-report.md'), md);
console.log(md);
process.exit(gate === 'PASS' ? 0 : 1);
