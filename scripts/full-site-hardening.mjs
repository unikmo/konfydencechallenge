import fs from 'node:fs';
import path from 'node:path';

const BASE_URL = (process.env.BASE_URL || 'https://konfydence.com').replace(/\/$/, '');
const SHA = process.env.GITHUB_SHA || 'local';
const OUT_DIR = process.env.QA_OUT_DIR || 'qa-artifacts';
fs.mkdirSync(OUT_DIR, { recursive: true });

const findings = [];
const measurements = {};
const add = (gate, severity, id, message, data = {}) => findings.push({ gate, severity, id, message, ...data });
const slug = (value) => value.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase().slice(0, 120);

function extract(html, regex) {
  const match = html.match(regex);
  return match ? match[1].trim() : '';
}

async function getPublicRoutes() {
  const response = await fetch(`${BASE_URL}/sitemap.xml`, { cache: 'no-store' }).catch(() => null);
  if (!response?.ok) {
    add('SEO', 'critical', 'sitemap-unavailable', `sitemap.xml unavailable (HTTP ${response?.status || 'none'})`);
    return [BASE_URL + '/'];
  }
  const xml = await response.text();
  const origin = new URL(BASE_URL).origin;
  const urls = [...xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)].map((match) => match[1].trim());
  const routes = [...new Set(urls.filter((url) => {
    try { return new URL(url).origin === origin; } catch { return false; }
  }))];
  measurements.sitemapUrlCount = routes.length;
  if (!routes.length) add('SEO', 'critical', 'sitemap-empty', 'sitemap.xml contains no same-origin URLs');
  return routes.length ? routes : [BASE_URL + '/'];
}

async function headAsset(assetUrl, pageRoute) {
  let response;
  try {
    response = await fetch(assetUrl, { method: 'HEAD', redirect: 'follow', cache: 'no-store' });
    if (response.status === 405) response = await fetch(assetUrl, { method: 'GET', redirect: 'follow', cache: 'no-store' });
  } catch {
    add('Performance', 'high', `asset-network-${slug(assetUrl)}`, `Asset could not be loaded from ${pageRoute}: ${assetUrl}`);
    return;
  }
  if (!response.ok) {
    add('Performance', 'high', `asset-status-${slug(assetUrl)}`, `Asset returned HTTP ${response.status} from ${pageRoute}: ${assetUrl}`);
    return;
  }
  const bytes = Number(response.headers.get('content-length') || 0);
  const type = response.headers.get('content-type') || '';
  if (/video/i.test(type) && bytes > 2_000_000) {
    add('Performance', 'high', `video-size-${slug(assetUrl)}`, `Direct video is ${(bytes / 1_000_000).toFixed(1)}MB on ${pageRoute}; mandatory production rule is <=2MB`, { assetUrl, bytes });
  }
  if (/image/i.test(type) && bytes > 1_500_000) {
    add('Performance', 'high', `image-size-${slug(assetUrl)}`, `Image is ${(bytes / 1_000_000).toFixed(1)}MB on ${pageRoute}`, { assetUrl, bytes });
  } else if (/image/i.test(type) && bytes > 750_000) {
    add('Performance', 'medium', `image-size-${slug(assetUrl)}`, `Image is ${(bytes / 1_000_000).toFixed(1)}MB on ${pageRoute}; consider a smaller responsive derivative`, { assetUrl, bytes });
  }
}

async function auditRoute(url) {
  const route = new URL(url).pathname || '/';
  const response = await fetch(url, { redirect: 'follow', cache: 'no-store' }).catch(() => null);
  if (!response) {
    add('Performance', 'critical', `route-network-${slug(route)}`, `${route} is unreachable`);
    return;
  }
  measurements[`status:${route}`] = response.status;
  if (response.status >= 500) add('Performance', 'critical', `route-${slug(route)}`, `${route} returned HTTP ${response.status}`);
  else if (response.status >= 400) add('SEO', 'high', `route-${slug(route)}`, `${route} returned HTTP ${response.status}`);
  if (!response.ok) return;

  const html = await response.text();
  const title = extract(html, /<title[^>]*>([^<]+)<\/title>/i);
  const description = extract(html, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i) || extract(html, /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i);
  const canonical = extract(html, /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i) || extract(html, /<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i);
  const robots = extract(html, /<meta[^>]+name=["']robots["'][^>]+content=["']([^"']+)["']/i).toLowerCase();
  const h1Count = (html.match(/<h1\b/gi) || []).length;

  measurements[`seo:${route}`] = { titleLength: title.length, descriptionLength: description.length, canonical, h1Count };
  if (!title) add('SEO', 'high', `title-${slug(route)}`, `${route} has no title`);
  if (!description) add('SEO', 'medium', `description-${slug(route)}`, `${route} has no meta description`);
  if (!canonical) add('SEO', 'medium', `canonical-${slug(route)}`, `${route} has no canonical URL`);
  if (/noindex/.test(robots)) add('SEO', 'high', `noindex-${slug(route)}`, `${route} is in sitemap but declares noindex`);
  if (h1Count !== 1) add('Accessibility', 'medium', `h1-${slug(route)}`, `${route} exposes ${h1Count} H1 elements in server-rendered HTML`);

  for (const header of ['content-security-policy', 'strict-transport-security', 'x-content-type-options', 'referrer-policy', 'permissions-policy']) {
    if (!response.headers.get(header)) add('Security', 'high', `header-${slug(route)}-${header}`, `${route} is missing ${header}`);
  }

  const assets = new Set();
  for (const match of html.matchAll(/<(?:img|source|video)[^>]+(?:src|srcset)=["']([^"']+)["']/gi)) {
    for (const part of match[1].split(',').map((value) => value.trim().split(/\s+/)[0]).filter(Boolean)) {
      try {
        const asset = new URL(part, url);
        if (asset.protocol === 'http:' || asset.protocol === 'https:') assets.add(asset.href);
      } catch {}
    }
  }
  const limitedAssets = [...assets].slice(0, 80);
  await Promise.all(limitedAssets.map((assetUrl) => headAsset(assetUrl, route)));
}

const routes = await getPublicRoutes();
for (const url of routes) await auditRoute(url);

for (const route of ['/privacy-policy', '/cookie-policy', '/terms-of-service', '/imprint']) {
  if (!routes.some((url) => new URL(url).pathname === route)) {
    add('Compliance', 'medium', `legal-sitemap-${slug(route)}`, `${route} is not represented in the public sitemap`);
  }
}

const homepage = await fetch(`${BASE_URL}/`, { cache: 'no-store' }).then((response) => response.text()).catch(() => '');
if (!/application\/ld\+json/i.test(homepage)) add('SEO', 'medium', 'structured-data-home', 'Homepage has no JSON-LD structured data');

const counts = findings.reduce((acc, finding) => ({ ...acc, [finding.severity]: (acc[finding.severity] || 0) + 1 }), {});
const gate = findings.some((finding) => finding.severity === 'critical' || finding.severity === 'high') ? 'FAIL' : 'PASS';
const report = {
  agent: 'Production Hardening Agent — full public-site structural audit',
  sha: SHA,
  baseUrl: BASE_URL,
  generatedAt: new Date().toISOString(),
  gate,
  routeCount: routes.length,
  routes,
  counts,
  measurements,
  findings,
};
fs.writeFileSync(path.join(OUT_DIR, 'full-site-hardening-report.json'), JSON.stringify(report, null, 2));
const markdown = [
  '# Full-Site Production Hardening', '',
  `**SHA:** \`${SHA}\``,
  `**Gate:** **${gate}**`,
  `**Public sitemap URLs audited:** ${routes.length}`,
  `**Critical:** ${counts.critical || 0} · **High:** ${counts.high || 0} · **Medium:** ${counts.medium || 0} · **Low:** ${counts.low || 0}`,
  '', '## Findings',
  ...(findings.length ? findings.map((finding) => `- **${finding.severity.toUpperCase()} · ${finding.gate} · ${finding.id}** — ${finding.message}`) : ['- None']),
].join('\n');
fs.writeFileSync(path.join(OUT_DIR, 'full-site-hardening-report.md'), markdown);
console.log(markdown);
process.exit(gate === 'PASS' ? 0 : 1);
