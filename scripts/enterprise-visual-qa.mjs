import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const BASE = (process.env.BASE_URL || 'https://konfydence.com').replace(/\/$/, '');
const OUT = process.env.QA_OUT_DIR || 'qa-artifacts';
fs.mkdirSync(OUT, { recursive: true });
const defects = [];
const checks = [];
const routes = [
  '/de/comasy',
  '/de/comasy/methodik',
  '/de/comasy/pilotprojekt',
  '/de/pilot',
];
const sizes = {
  desktop: { width: 1440, height: 900 },
  tablet: { width: 834, height: 1050 },
  phone: { width: 390, height: 844 },
};
const browser = await chromium.launch({ headless: true });
try {
  for (const [label, viewport] of Object.entries(sizes)) {
    const context = await browser.newContext({ viewport });
    for (const route of routes) {
      const page = await context.newPage();
      try {
        const response = await page.goto(BASE + route, { waitUntil: 'domcontentloaded', timeout: 45000 });
        await page.locator('h1').first().waitFor({ timeout: 12000 });
        if (!response?.ok()) throw new Error('HTTP ' + (response?.status() ?? 'unavailable'));
        const overflow = await page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth);
        if (overflow > 8) defects.push({ route, viewport: label, issue: 'horizontal overflow', pixels: overflow });
        const h1 = await page.locator('h1').count();
        if (h1 !== 1) defects.push({ route, viewport: label, issue: 'expected exactly one h1', actual: h1 });
        const primary = page.locator('a[href="/de/comasy/pilotprojekt"]').first();
        if (route !== '/de/comasy/pilotprojekt' && await primary.count() === 0)
          defects.push({ route, viewport: label, issue: 'business pilot CTA missing' });
        if (label !== 'desktop') {
          const menu = page.locator('.k-mobile-menu summary').first();
          if (!(await menu.isVisible())) {
            defects.push({ route, viewport: label, issue: 'mobile navigation not accessible' });
          } else {
            await menu.click();
            const pilotLink = page.locator('.k-mobile-menu nav a[href="/de/comasy/pilotprojekt"]').first();
            if (!(await pilotLink.isVisible())) defects.push({ route, viewport: label, issue: 'pilot route missing from mobile menu' });
            await menu.click();
          }
        } else {
          if (!(await page.locator('.k-nav-links').first().isVisible()))
            defects.push({ route, viewport: label, issue: 'desktop navigation hidden' });
        }
        if (route === '/de/comasy/pilotprojekt') {
          const form = page.locator('form[action="/api/comasy/pilot"]');
          if (!(await form.isVisible())) defects.push({ route, viewport: label, issue: 'pilot form unavailable' });
          const inputs = await form.locator('input[required],select[required]').count();
          if (inputs < 5) defects.push({ route, viewport: label, issue: 'pilot form required fields missing', inputs });
        }
        await page.screenshot({ path: path.join(OUT, 'agency-' + label + '-' + route.replace(/\W+/g, '-') + '.png'), fullPage: true });
        checks.push({ route, viewport: label, status: response.status(), overflow });
      } catch (error) {
        defects.push({ route, viewport: label, issue: String(error) });
      } finally {
        await page.close();
      }
    }
    await context.close();
  }
} finally {
  await browser.close();
}
fs.writeFileSync(path.join(OUT, 'enterprise-visual-qa.json'), JSON.stringify({ checks, defects }, null, 2));
console.log(JSON.stringify({ routes: routes.length, viewports: Object.keys(sizes).length, checks: checks.length, defects }, null, 2));
if (defects.length) process.exitCode = 1;
