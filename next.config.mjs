// CSP allows 'unsafe-inline' for script-src (the GA4 consent-mode bootstrap in
// app/layout.tsx is inline, not file-based) and for style-src (virtually every
// component in this app uses React's style={{...}} prop, which renders as
// inline `style="..."` attributes — without 'unsafe-inline' here the entire
// site's styling would break). This is a real tradeoff, not an oversight:
// a stricter CSP (nonces/hashes) would need every inline style converted to
// CSS classes/modules first, which is a larger refactor than fits here.
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https://www.google-analytics.com https://www.googletagmanager.com https://upload.wikimedia.org https://commons.wikimedia.org",
  "font-src 'self' data:",
  "connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com https://*.myshopify.com",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Lint errors (e.g. react/no-unescaped-entities on static legal pages)
    // are cosmetic and shouldn't block production builds/deploys.
    // `next lint` still runs normally in CI/local dev.
    ignoreDuringBuilds: true,
  },
  async headers() {
    return [
      {
        // Applies site-wide, including /admin — clickjacking/MIME-sniffing
        // protection matters most exactly there.
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: CSP },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
        ],
      },
    ];
  },
};

export default nextConfig;

