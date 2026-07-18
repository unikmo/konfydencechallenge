/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Lint errors (e.g. react/no-unescaped-entities on static legal pages)
    // are cosmetic and shouldn't block production builds/deploys.
    // `next lint` still runs normally in CI/local dev.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;

