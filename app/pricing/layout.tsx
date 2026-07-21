import type { Metadata } from "next";
import type { ReactNode } from "react";

// app/pricing/page.tsx is "use client" (it reads useSearchParams for the
// edition preselect), so it can't export its own metadata — a client
// component's metadata export is silently ignored by Next.js. This sibling
// layout is a server component purely to carry page-specific metadata; it
// otherwise just passes children through untouched.
export const metadata: Metadata = {
  title: "Pricing | Konfydence",
  description:
    "Unlock the full Konfydence Challenge — 50 real-life scenarios per edition, five complete runs, and your full Konfydence Readiness Score breakdown. $4.99 per edition or go unlimited.",
};

export default function PricingLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
