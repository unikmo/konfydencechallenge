// CSP allows 'unsafe-inline' for script-src (the GA4 consent-mode bootstrap in
// app/layout.tsx is inline) and for style-src (the current UI still contains
// React inline style attributes). Tightening this further requires a dedicated
// nonce/CSS refactor; the remaining policy still blocks framing, objects and
// untrusted network origins.
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https://www.google-analytics.com https://www.googletagmanager.com https://upload.wikimedia.org https://commons.wikimedia.org https://images.pexels.com",
  "font-src 'self' data:",
  "connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Short vanity redirects for printed/physical goods (KonfyGuard wallet
  // card, fridge magnet) — a QR code or a URL stamped on a physical item
  // can't be edited after it ships, so it points at a short, memorable slug
  // that redirects to the real page rather than the real page's own path.
  async redirects() {
    return [
      { source: "/scamcheck", destination: "/free-scam-safety-pack", permanent: true },
      { source: "/de/scamcheck", destination: "/de/hack-method", permanent: true },
    ];
  },
  async headers() {
    return [
      {
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
