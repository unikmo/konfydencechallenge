import fs from 'node:fs';
import path from 'node:path';

const BASE_URL = (process.env.BASE_URL || 'https://konfydence.com').replace(/\/$/, '');
const SHA = process.env.GITHUB_SHA || 'local';
const OUT_DIR = process.env.QA_OUT_DIR || 'qa-artifacts';
fs.mkdirSync(OUT_DIR, { recursive: true });

const findings = [];
const measurements = {};
const add = (gate, severity, id, message, data = {}) => findings.push({ gate, severity, id, message, ...data });

async function get(pathname, options = {}) {
  const res = await fetch(`${BASE_URL}${pathname}`, { redirect: 'follow', cache: 'no-store', ...options });
  return res;
}

function extract(html, re) {
  const m = html.match(re);
  return m ? m[1].trim() : '';
}

async function auditSeoRoute(route) {
  const res = await get(route);
  if (!res.ok) {
    add('SEO', 'high', `seo-status-${route}`, `${route} returned HTTP ${res.status}`);
    return;
  }
  const html = await res.text();
  const title = extract(html, /<title[^>]*>([^<]+)<\/title>/i);
  const description = extract(html, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i) || extract(html, /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i);
  const canonical = extract(html, /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i) || extract(html, /<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i);
  if (!title) add('SEO', 'high', `seo-title-${route}`, `${route} is missing a title`);
  if (!description) add('SEO', 'medium', `seo-description-${route}`, `${route} is missing a meta description`);
  if (!canonical) add('SEO', 'medium', `seo-canonical-${route}`, `${route} is missing a canonical URL`);
  measurements[`seo:${route}`] = { status: res.status, titleLength: title.length, descriptionLength: description.length, canonical };
}

async function auditSecurity() {
  const res = await get('/');
  const required = {
    'content-security-policy': 'CSP',
    'strict-transport-security': 'HSTS',
    'x-content-type-options': 'X-Content-Type-Options',
    'referrer-policy': 'Referrer-Policy',
    'permissions-policy': 'Permissions-Policy',
  };
  measurements.securityHeaders = {};
  for (const [header, label] of Object.entries(required)) {
    const value = res.headers.get(header);
    measurements.securityHeaders[label] = Boolean(value);
    if (!value) add('Security', 'high', `security-${header}`, `${label} header is missing`);
  }
  const csp = res.headers.get('content-security-policy') || '';
  if (/default-src\s+\*/i.test(csp)) add('Security', 'high', 'security-csp-wildcard', 'CSP default-src allows wildcard origins');
  if (!/object-src\s+'none'/i.test(csp)) add('Security', 'medium', 'security-csp-object', "CSP should block object-src");
}

async function auditCompliance() {
  for (const route of ['/privacy-policy', '/cookie-policy', '/terms-of-service', '/imprint']) {
    const res = await get(route);
    measurements[`compliance:${route}`] = res.status;
    if (!res.ok) add('Compliance', 'high', `compliance-${route}`, `${route} is unavailable (HTTP ${res.status})`);
  }
  const home = await (await get('/')).text();
  if (!home.includes('cookie')) add('Compliance', 'medium', 'compliance-cookie-ui', 'Cookie consent UI is not discoverable in initial markup; verify client rendering manually');
}

async function auditSitemapRobots() {
  const robots = await get('/robots.txt');
  const sitemap = await get('/sitemap.xml');
  if (!robots.ok) add('SEO', 'high', 'robots', `robots.txt returned ${robots.status}`);
  if (!sitemap.ok) add('SEO', 'high', 'sitemap', `sitemap.xml returned ${sitemap.status}`);
  if (sitemap.ok) {
    const xml = await sitemap.text();
    for (const pathName of ['/', '/comasy', '/comasy/pilot']) {
      if (!xml.includes(`${BASE_URL}${pathName}`) && !xml.includes(`https://konfydence.com${pathName}`)) {
        add('SEO', pathName === '/comasy' ? 'high' : 'medium', `sitemap-${pathName}`, `${pathName} is missing from sitemap.xml`);
      }
    }
  }
}

function readLighthouse(name) {
  const file = path.join(OUT_DIR, `lighthouse-${name}.json`);
  if (!fs.existsSync(file)) return null;
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  const categories = Object.fromEntries(Object.entries(data.categories || {}).map(([key, value]) => [key, Math.round((value.score || 0) * 100)]));
  const audits = data.audits || {};
  return {
    categories,
    lcpMs: audits['largest-contentful-paint']?.numericValue ?? null,
    cls: audits['cumulative-layout-shift']?.numericValue ?? null,
    tbtMs: audits['total-blocking-time']?.numericValue ?? null,
    speedIndexMs: audits['speed-index']?.numericValue ?? null,
  };
}

function auditLighthouse(name) {
  const data = readLighthouse(name);
  if (!data) {
    add('Performance', 'high', `lighthouse-${name}`, `Missing Lighthouse report for ${name}`);
    return;
  }
  measurements[`lighthouse:${name}`] = data;
  const p = data.categories.performance ?? 0;
  const a = data.categories.accessibility ?? 0;
  const s = data.categories.seo ?? 0;
  const bp = data.categories['best-practices'] ?? 0;
  if (p < 60) add('Performance', 'high', `performance-${name}`, `${name} performance score is ${p}/100`);
  else if (p < 75) add('Performance', 'medium', `performance-${name}`, `${name} performance score is ${p}/100`);
  if (a < 80) add('Accessibility', 'high', `accessibility-${name}`, `${name} accessibility score is ${a}/100`);
  else if (a < 90) add('Accessibility', 'medium', `accessibility-${name}`, `${name} accessibility score is ${a}/100`);
  if (s < 80) add('SEO', 'high', `seo-score-${name}`, `${name} SEO score is ${s}/100`);
  else if (s < 90) add('SEO', 'medium', `seo-score-${name}`, `${name} SEO score is ${s}/100`);
  if (bp < 80) add('Security', 'high', `best-practices-${name}`, `${name} best-practices score is ${bp}/100`);
  if (data.lcpMs !== null && data.lcpMs > 4000) add('Performance', 'high', `lcp-${name}`, `${name} lab LCP is ${Math.round(data.lcpMs)}ms`);
  else if (data.lcpMs !== null && data.lcpMs > 2500) add('Performance', 'medium', `lcp-${name}`, `${name} lab LCP is ${Math.round(data.lcpMs)}ms`);
  if (data.cls !== null && data.cls > 0.25) add('Performance', 'high', `cls-${name}`, `${name} lab CLS is ${data.cls.toFixed(3)}`);
  else if (data.cls !== null && data.cls > 0.1) add('Performance', 'medium', `cls-${name}`, `${name} lab CLS is ${data.cls.toFixed(3)}`);
  if (data.tbtMs !== null && data.tbtMs > 600) add('Performance', 'high', `tbt-${name}`, `${name} lab TBT is ${Math.round(data.tbtMs)}ms`);
}

async function auditMedia() {
  for (const route of ['/', '/comasy']) {
    const html = await (await get(route)).text();
    const videoSources = [...html.matchAll(/<(?:video|source)[^>]+src=["']([^"']+)["']/gi)].map((m) => m[1]);
    for (const src of videoSources) {
      const url = new URL(src, BASE_URL);
      const res = await fetch(url, { method: 'HEAD', redirect: 'follow' }).catch(() => null);
      const bytes = Number(res?.headers.get('content-length') || 0);
      if (bytes > 2_000_000) add('Performance', 'high', `video-${route}-${src}`, `Video asset is ${(bytes / 1_000_000).toFixed(1)}MB; production rule is <=2MB per directly loaded video source`);
    }
    measurements[`videoSources:${route}`] = videoSources.length;
  }
}

for (const route of ['/', '/comasy', '/comasy/pilot', '/challenge/travelsafe/start?mode=diagnostic']) await auditSeoRoute(route);
await auditSecurity();
await auditCompliance();
await auditSitemapRobots();
await auditMedia();
for (const name of ['home', 'comasy', 'pilot']) auditLighthouse(name);

const counts = findings.reduce((acc, f) => ({ ...acc, [f.severity]: (acc[f.severity] || 0) + 1 }), {});
const gate = findings.some((f) => f.severity === 'critical' || f.severity === 'high') ? 'FAIL' : 'PASS';
const report = {
  agent: 'Production Hardening Agent',
  sha: SHA,
  baseUrl: BASE_URL,
  generatedAt: new Date().toISOString(),
  gate,
  gates: ['Performance', 'SEO', 'Accessibility', 'Security', 'Compliance'],
  counts,
  measurements,
  findings,
  notes: {
    cwv: 'Lighthouse metrics are controlled lab measurements. Real-user Core Web Vitals require field telemetry (GA4/CrUX/RUM).',
    commerce: 'Stripe/checkout is reported by live acceptance as configured, not configured, or not applicable; no fake commerce pass is created.',
  },
};
fs.writeFileSync(path.join(OUT_DIR, 'production-hardening-report.json'), JSON.stringify(report, null, 2));
const lines = [
  '# Production Hardening Report', '',
  `**SHA:** \`${SHA}\``,
  `**Gate:** **${gate}**`,
  `**Critical:** ${counts.critical || 0} · **High:** ${counts.high || 0} · **Medium:** ${counts.medium || 0} · **Low:** ${counts.low || 0}`,
  '', '## Lighthouse',
  ...['home', 'comasy', 'pilot'].map((name) => {
    const m = measurements[`lighthouse:${name}`];
    return m ? `- **${name}** — Performance ${m.categories.performance}, Accessibility ${m.categories.accessibility}, Best Practices ${m.categories['best-practices']}, SEO ${m.categories.seo}; LCP ${Math.round(m.lcpMs || 0)}ms; CLS ${(m.cls || 0).toFixed(3)}; TBT ${Math.round(m.tbtMs || 0)}ms` : `- **${name}** — missing`;
  }),
  '', '## Findings',
  ...(findings.length ? findings.map((f) => `- **${f.severity.toUpperCase()} · ${f.gate} · ${f.id}** — ${f.message}`) : ['- None']),
  '', '> Gate rule: zero critical/high-severity findings.',
];
fs.writeFileSync(path.join(OUT_DIR, 'production-hardening-report.md'), lines.join('\n'));
console.log(lines.join('\n'));
process.exit(gate === 'PASS' ? 0 : 1);
