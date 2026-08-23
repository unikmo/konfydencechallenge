import fs from 'node:fs';
import path from 'node:path';
import { chromium, firefox, webkit } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

const BASE_URL = (process.env.BASE_URL || 'https://konfydence.com').replace(/\/$/, '');
const SHA = process.env.GITHUB_SHA || 'local';
const OUT_DIR = process.env.QA_OUT_DIR || 'qa-artifacts';
fs.mkdirSync(OUT_DIR, { recursive: true });

const browserTypes = { chromium, firefox, webkit };
const viewports = {
  phone: { width: 390, height: 844 },
  tablet: { width: 834, height: 1112 },
  desktop: { width: 1440, height: 1000 },
};

const findings = [];
const checks = [];
const internalLinks = new Set();
const add = (area, severity, id, message, data = {}) => findings.push({ area, severity, id, message, ...data });
const pass = (area, id, message) => checks.push({ area, id, message });
const slug = (value) => value.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase().slice(0, 120);

async function publicRoutes() {
  const response = await fetch(`${BASE_URL}/sitemap.xml`, { cache: 'no-store' }).catch(() => null);
  if (!response?.ok) {
    add('Navigation', 'critical', 'sitemap-unavailable', `sitemap.xml unavailable (HTTP ${response?.status || 'none'})`);
    return [BASE_URL + '/'];
  }
  const xml = await response.text();
  const urls = [...xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)].map((match) => match[1].trim());
  const normalized = [...new Set(urls.map((url) => {
    try {
      const parsed = new URL(url);
      return parsed.origin === new URL(BASE_URL).origin ? parsed.href : null;
    } catch { return null; }
  }).filter(Boolean))];
  if (!normalized.length) add('Navigation', 'critical', 'sitemap-empty', 'sitemap.xml contains no same-origin public URLs');
  return normalized.length ? normalized : [BASE_URL + '/'];
}

async function screenshot(page, name) {
  try {
    await page.screenshot({ path: path.join(OUT_DIR, `${slug(name)}.png`), fullPage: true });
  } catch {}
}

async function inspectPage(context, browserName, viewportName, url, runAxe) {
  const page = await context.newPage();
  const errors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(`console: ${msg.text()}`);
  });
  page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));

  const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 35000 }).catch(() => null);
  await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => undefined);
  await page.waitForTimeout(150);
  const status = response?.status() || 0;
  const route = new URL(url).pathname || '/';
  const key = `${browserName}-${viewportName}-${route}`;

  if (!response || status === 0 || status >= 500) {
    add('Functional', 'critical', `route-${slug(key)}`, `${route} failed in ${browserName}/${viewportName} (HTTP ${status || 'none'})`, { url, status });
    await screenshot(page, `critical-${key}`);
    await page.close();
    return;
  }
  if (status >= 400) {
    add('Functional', 'high', `route-${slug(key)}`, `${route} returned HTTP ${status} in ${browserName}/${viewportName}`, { url, status });
  } else {
    pass('Functional', `route-${slug(key)}`, `${route} loaded in ${browserName}/${viewportName}`);
  }

  const title = (await page.title()).trim();
  if (!title) add('Content', 'high', `title-${slug(key)}`, `${route} has no document title in ${browserName}/${viewportName}`);

  const h1Count = await page.locator('h1').count();
  if (h1Count !== 1) add('Accessibility', 'medium', `h1-${slug(key)}`, `${route} exposes ${h1Count} H1 elements in ${browserName}/${viewportName}`);

  const overflow = await page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth);
  if (overflow > 8) {
    add('Responsive', 'high', `overflow-${slug(key)}`, `${route} horizontally overflows by ${overflow}px in ${browserName}/${viewportName}`);
    await screenshot(page, `overflow-${key}`);
  }

  const brokenImages = await page.locator('img').evaluateAll((imgs) => imgs
    .filter((img) => img instanceof HTMLImageElement && img.complete && img.naturalWidth === 0)
    .map((img) => img.getAttribute('src') || img.getAttribute('alt') || 'unknown'));
  if (brokenImages.length) {
    add('Content', 'high', `images-${slug(key)}`, `${route} has broken images in ${browserName}/${viewportName}`, { brokenImages });
    await screenshot(page, `broken-images-${key}`);
  }

  if (errors.length) {
    const severe = errors.some((entry) => /uncaught|referenceerror|typeerror|failed to load resource.*5\d\d/i.test(entry));
    add('Errors', severe ? 'high' : 'medium', `browser-errors-${slug(key)}`, `${route} emitted browser errors in ${browserName}/${viewportName}`, { errors: errors.slice(0, 12) });
  }

  if (browserName === 'chromium' && viewportName === 'desktop') {
    const hrefs = await page.locator('a[href]').evaluateAll((nodes) => nodes.map((node) => node.getAttribute('href')).filter(Boolean));
    for (const href of hrefs) {
      try {
        if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) continue;
        const target = new URL(href, url);
        if (target.origin === new URL(BASE_URL).origin) {
          target.hash = '';
          internalLinks.add(target.href);
        }
      } catch {}
    }

    if (runAxe) {
      const result = await new AxeBuilder({ page }).analyze().catch(() => null);
      if (result) {
        const serious = result.violations.filter((violation) => violation.impact === 'critical' || violation.impact === 'serious');
        if (serious.length) {
          add('Accessibility', 'high', `axe-${slug(route)}`, `${route} has ${serious.length} serious/critical accessibility violations`, {
            violations: serious.map((violation) => ({ id: violation.id, impact: violation.impact, help: violation.help, nodes: violation.nodes.length })),
          });
        }
      }
    }
  }

  await page.close();
}

async function checkInternalLinks() {
  const links = [...internalLinks];
  for (const url of links) {
    const response = await fetch(url, { redirect: 'follow', cache: 'no-store' }).catch(() => null);
    const status = response?.status || 0;
    if (!response || status === 404 || status >= 500) {
      add('Navigation', 'high', `internal-link-${slug(url)}`, `Internal link is broken: ${url} (HTTP ${status || 'none'})`);
    }
  }
  return links.length;
}

const routes = await publicRoutes();
for (const [browserName, browserType] of Object.entries(browserTypes)) {
  const browser = await browserType.launch({ headless: true });
  for (const [viewportName, viewport] of Object.entries(viewports)) {
    const context = await browser.newContext({ viewport, locale: 'en-GB' });
    for (const url of routes) {
      await inspectPage(context, browserName, viewportName, url, browserName === 'chromium' && viewportName === 'desktop');
    }
    await context.close();
  }
  await browser.close();
}

const internalLinkCount = await checkInternalLinks();
const counts = findings.reduce((acc, finding) => ({ ...acc, [finding.severity]: (acc[finding.severity] || 0) + 1 }), {});
const gate = findings.some((finding) => finding.severity === 'critical' || finding.severity === 'high') ? 'FAIL' : 'PASS';
const report = {
  agent: 'Independent QA Agent — full public-site crawl',
  mission: 'Break what the builders believe is finished across every public sitemap URL.',
  sha: SHA,
  baseUrl: BASE_URL,
  generatedAt: new Date().toISOString(),
  gate,
  routeCount: routes.length,
  routes,
  browserEngines: Object.keys(browserTypes),
  viewports: Object.keys(viewports),
  internalLinkCount,
  checksPassed: checks.length,
  counts,
  findings,
};

fs.writeFileSync(path.join(OUT_DIR, 'full-site-public-qa-report.json'), JSON.stringify(report, null, 2));
const markdown = [
  '# Independent QA — Full Public Site', '',
  `**SHA:** \`${SHA}\``,
  `**Gate:** **${gate}**`,
  `**Public sitemap URLs:** ${routes.length}`,
  `**Browser engines:** ${Object.keys(browserTypes).join(', ')}`,
  `**Viewports:** ${Object.keys(viewports).join(', ')}`,
  `**Internal links checked:** ${internalLinkCount}`,
  `**Critical:** ${counts.critical || 0} · **High:** ${counts.high || 0} · **Medium:** ${counts.medium || 0} · **Low:** ${counts.low || 0}`,
  '', '## Findings',
  ...(findings.length ? findings.map((finding) => `- **${finding.severity.toUpperCase()} · ${finding.area} · ${finding.id}** — ${finding.message}`) : ['- None']),
].join('\n');
fs.writeFileSync(path.join(OUT_DIR, 'full-site-public-qa-report.md'), markdown);
console.log(markdown);
process.exit(gate === 'PASS' ? 0 : 1);
