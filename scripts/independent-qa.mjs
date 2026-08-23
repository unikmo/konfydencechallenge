import fs from 'node:fs';
import path from 'node:path';
import { chromium, firefox, webkit } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

const BASE_URL = (process.env.BASE_URL || 'https://konfydence.com').replace(/\/$/, '');
const SHA = process.env.GITHUB_SHA || 'local';
const OUT_DIR = process.env.QA_OUT_DIR || 'qa-artifacts';
fs.mkdirSync(OUT_DIR, { recursive: true });

const browsers = { chromium, firefox, webkit };
const viewports = {
  phone: { width: 390, height: 844 },
  tablet: { width: 834, height: 1112 },
  desktop: { width: 1440, height: 1000 },
};
const routes = ['/', '/comasy', '/comasy/pilot', '/comasy/dashboard/login', '/challenge/travelsafe/start?mode=diagnostic'];
const publicPolicyRoutes = ['/privacy-policy', '/cookie-policy', '/terms-of-service', '/imprint'];

const defects = [];
const checks = [];
const add = (area, severity, id, message, meta = {}) => defects.push({ area, severity, id, message, ...meta });
const pass = (area, id, message, meta = {}) => checks.push({ area, id, message, ...meta });

function slug(value) {
  return value.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase();
}

async function safeScreenshot(page, name) {
  try { await page.screenshot({ path: path.join(OUT_DIR, `${slug(name)}.png`), fullPage: true }); } catch {}
}

async function verifyRoute(context, browserName, viewportName, route) {
  const page = await context.newPage();
  const errors = [];
  page.on('console', (msg) => { if (msg.type() === 'error') errors.push(`console: ${msg.text()}`); });
  page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));
  const response = await page.goto(`${BASE_URL}${route}`, { waitUntil: 'networkidle', timeout: 45000 }).catch(() => null);
  const status = response?.status() || 0;
  const key = `${browserName}-${viewportName}-${route}`;
  if (!response || status >= 500 || status === 0) {
    add('Functional', 'critical', `route-${key}`, `${route} failed to load in ${browserName}/${viewportName} (HTTP ${status || 'none'})`, { route, browserName, viewportName });
    await safeScreenshot(page, `critical-${key}`);
    await page.close();
    return;
  }
  if (status >= 400 && route !== '/404-qa-probe') {
    add('Functional', 'high', `route-${key}`, `${route} returned HTTP ${status} in ${browserName}/${viewportName}`, { route, browserName, viewportName });
  } else {
    pass('Functional', `route-${key}`, `${route} loaded with HTTP ${status}`);
  }

  const title = await page.title();
  if (!title.trim()) add('Content', 'high', `title-${key}`, `${route} has no document title`);

  const overflow = await page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth);
  if (overflow > 8) add('Responsive', 'high', `overflow-${key}`, `${route} horizontally overflows by ${overflow}px in ${browserName}/${viewportName}`);

  const brokenImages = await page.locator('img').evaluateAll((imgs) => imgs
    .filter((img) => img instanceof HTMLImageElement && img.complete && img.naturalWidth === 0)
    .map((img) => img.getAttribute('src') || img.getAttribute('alt') || 'unknown'));
  if (brokenImages.length) add('Content', 'high', `images-${key}`, `${route} has broken images: ${brokenImages.join(', ')}`, { brokenImages });

  const backgroundFailures = await page.evaluate(async () => {
    const urls = new Set();
    for (const el of Array.from(document.querySelectorAll('*'))) {
      const bg = getComputedStyle(el).backgroundImage;
      for (const match of bg.matchAll(/url\(["']?([^"')]+)["']?\)/g)) {
        const raw = match[1];
        if (!raw || raw.startsWith('data:')) continue;
        urls.add(new URL(raw, location.href).href);
      }
    }
    const failed = [];
    for (const url of urls) {
      try {
        const res = await fetch(url, { method: 'GET', cache: 'no-store' });
        if (!res.ok) failed.push(`${res.status} ${url}`);
      } catch { failed.push(`network ${url}`); }
    }
    return failed;
  });
  if (backgroundFailures.length) add('Content', 'high', `backgrounds-${key}`, `${route} has broken CSS background assets`, { backgroundFailures });

  if (errors.length) {
    add('Errors', errors.some((x) => /uncaught|referenceerror|typeerror/i.test(x)) ? 'high' : 'medium', `console-${key}`, `${route} emitted browser errors`, { errors: errors.slice(0, 10) });
  }

  const axe = await new AxeBuilder({ page }).analyze().catch(() => null);
  if (axe) {
    const serious = axe.violations.filter((v) => v.impact === 'critical' || v.impact === 'serious');
    if (serious.length) {
      add('Accessibility', 'high', `axe-${key}`, `${route} has ${serious.length} serious/critical accessibility violations`, {
        violations: serious.map((v) => ({ id: v.id, impact: v.impact, help: v.help, nodes: v.nodes.length })),
      });
    }
  }

  const heading = await page.locator('h1').count();
  if (route === '/' || route === '/comasy' || route === '/comasy/pilot') {
    if (heading !== 1) add('Accessibility', 'medium', `h1-${key}`, `${route} should expose exactly one H1; found ${heading}`);
  }

  if (viewportName === 'phone') {
    const interactive = await page.locator('a,button,input,select,textarea').evaluateAll((els) => els.slice(0, 100).map((el) => {
      const r = el.getBoundingClientRect();
      return { label: (el.getAttribute('aria-label') || el.textContent || el.getAttribute('name') || '').trim().slice(0, 80), w: r.width, h: r.height, visible: r.width > 0 && r.height > 0 };
    }));
    const tiny = interactive.filter((x) => x.visible && x.w < 28 && x.h < 28);
    if (tiny.length > 3) add('Responsive', 'medium', `targets-${key}`, `${route} has ${tiny.length} very small touch targets`, { examples: tiny.slice(0, 6) });
  }

  await page.close();
}

async function verifyNavigation(context, browserName) {
  const page = await context.newPage();
  await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' });
  const links = await page.locator('a[href]').evaluateAll((nodes) => Array.from(new Set(nodes.map((n) => n.getAttribute('href')).filter(Boolean))));
  const localLinks = links.filter((href) => href.startsWith('/') && !href.startsWith('//')).slice(0, 40);
  for (const href of localLinks) {
    if (href.includes('#')) continue;
    const res = await page.request.get(`${BASE_URL}${href}`, { maxRedirects: 5 }).catch(() => null);
    const status = res?.status() || 0;
    if (!res || status >= 500 || status === 404) add('Navigation', 'high', `link-${browserName}-${slug(href)}`, `Broken internal link ${href} (HTTP ${status || 'none'})`);
  }
  const comasyLink = page.locator('a[href="/comasy"]').first();
  if (await comasyLink.count()) {
    await comasyLink.click();
    await page.waitForURL('**/comasy');
    await page.goBack();
    if (new URL(page.url()).pathname !== '/') add('Navigation', 'high', `back-${browserName}`, 'Browser back did not return from CoMaSy to home');
  } else add('Navigation', 'high', `menu-comasy-${browserName}`, 'CoMaSy is missing from the main navigation');
  await page.close();
}

async function verifyForms(context, browserName) {
  const page = await context.newPage();
  await page.goto(`${BASE_URL}/comasy/pilot`, { waitUntil: 'networkidle' });
  const form = page.locator('form').first();
  if (!(await form.count())) {
    add('Forms', 'critical', `pilot-form-${browserName}`, 'CoMaSy pilot form is missing');
    await page.close();
    return;
  }
  const emptyValid = await form.evaluate((f) => f.checkValidity());
  if (emptyValid) add('Forms', 'high', `pilot-empty-${browserName}`, 'Pilot form accepts an empty submission');

  await page.locator('input[name="firstName"]').fill('QA');
  await page.locator('input[name="lastName"]').fill('Agent');
  await page.locator('input[name="workEmail"]').fill('not-an-email');
  await page.locator('input[name="organization"]').fill('Independent QA');
  await page.locator('select[name="role"]').selectOption({ index: 1 });
  await page.locator('select[name="organizationSize"]').selectOption({ index: 1 });
  await page.locator('select[name="primaryObjective"]').selectOption({ index: 1 });
  await page.locator('input[name="consent"]').check();
  const invalidEmailValid = await form.evaluate((f) => f.checkValidity());
  if (invalidEmailValid) add('Forms', 'high', `pilot-invalid-email-${browserName}`, 'Pilot form accepts an invalid email address');

  await page.locator('input[name="workEmail"]').fill('qa-agent@invalid.example');
  await page.locator('textarea[name="notes"]').fill('x'.repeat(5000));
  const unusualValid = await form.evaluate((f) => f.checkValidity());
  if (!unusualValid) add('Forms', 'medium', `pilot-unusual-${browserName}`, 'Pilot form rejects an otherwise valid unusual/long-input case at browser-validation level');
  await page.close();
}

async function verifyAuth(context, browserName) {
  const page = await context.newPage();
  const res = await page.goto(`${BASE_URL}/comasy/dashboard`, { waitUntil: 'domcontentloaded' });
  const finalPath = new URL(page.url()).pathname;
  if (!finalPath.includes('/comasy/dashboard/login')) {
    add('Functional', 'critical', `auth-${browserName}`, `Unauthenticated customer dashboard did not redirect to login (HTTP ${res?.status()})`);
  }
  await page.close();
}

async function verifyErrorStates(context, browserName) {
  const page = await context.newPage();
  const res = await page.goto(`${BASE_URL}/404-independent-qa-probe`, { waitUntil: 'domcontentloaded' });
  if (res?.status() !== 404) add('Errors', 'medium', `404-${browserName}`, `Unknown route should return 404, got ${res?.status()}`);
  await page.close();
}

async function verifyReducedMotion(browserType, browserName) {
  const browser = await browserType.launch({ headless: true });
  const context = await browser.newContext({ viewport: viewports.desktop, reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' });
  const longMotion = await page.evaluate(() => Array.from(document.querySelectorAll('*')).filter((el) => {
    const s = getComputedStyle(el);
    const durations = `${s.animationDuration},${s.transitionDuration}`.split(',').map((v) => parseFloat(v) || 0);
    return durations.some((n) => n > 0.5);
  }).length);
  if (longMotion > 0) add('Animation', 'medium', `reduced-motion-${browserName}`, `${longMotion} elements still expose >500ms motion under prefers-reduced-motion`);
  await browser.close();
}

for (const [browserName, browserType] of Object.entries(browsers)) {
  const browser = await browserType.launch({ headless: true });
  for (const [viewportName, viewport] of Object.entries(viewports)) {
    const context = await browser.newContext({ viewport, locale: 'en-GB' });
    for (const route of routes) await verifyRoute(context, browserName, viewportName, route);
    for (const route of publicPolicyRoutes) await verifyRoute(context, browserName, viewportName, route);
    await context.close();
  }
  const desktopContext = await browser.newContext({ viewport: viewports.desktop });
  await verifyNavigation(desktopContext, browserName);
  await verifyForms(desktopContext, browserName);
  await verifyAuth(desktopContext, browserName);
  await verifyErrorStates(desktopContext, browserName);
  await desktopContext.close();
  await browser.close();
  await verifyReducedMotion(browserType, browserName);
}

const rank = { critical: 4, high: 3, medium: 2, low: 1 };
const counts = defects.reduce((acc, d) => ({ ...acc, [d.severity]: (acc[d.severity] || 0) + 1 }), {});
const gate = defects.some((d) => rank[d.severity] >= rank.high) ? 'FAIL' : 'PASS';
const report = {
  agent: 'Independent QA Agent',
  mission: 'Break what the builders believe is finished.',
  sha: SHA,
  baseUrl: BASE_URL,
  generatedAt: new Date().toISOString(),
  gate,
  counts,
  matrix: { browsers: Object.keys(browsers), viewports: Object.keys(viewports), routes: [...routes, ...publicPolicyRoutes] },
  defects,
  checksPassed: checks.length,
};
fs.writeFileSync(path.join(OUT_DIR, 'independent-qa-report.json'), JSON.stringify(report, null, 2));
const md = [
  '# Independent QA Report',
  '',
  `**Mission:** ${report.mission}`,
  `**SHA:** \`${SHA}\``,
  `**Gate:** **${gate}**`,
  `**Critical:** ${counts.critical || 0} · **High:** ${counts.high || 0} · **Medium:** ${counts.medium || 0} · **Low:** ${counts.low || 0}`,
  '',
  '## Matrix',
  `Browsers: ${Object.keys(browsers).join(', ')}`,
  `Viewports: ${Object.keys(viewports).join(', ')}`,
  '',
  '## Defects',
  ...(defects.length ? defects.map((d) => `- **${d.severity.toUpperCase()} · ${d.area} · ${d.id}** — ${d.message}`) : ['- None']),
  '',
  `Checks passed: ${checks.length}`,
].join('\n');
fs.writeFileSync(path.join(OUT_DIR, 'independent-qa-report.md'), md);
console.log(md);
process.exit(gate === 'PASS' ? 0 : 1);
