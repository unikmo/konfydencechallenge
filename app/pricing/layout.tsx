import type { Metadata } from "next";
import type { ReactNode } from "react";

// app/pricing/page.tsx is a client component because it reads search params.
// This server layout owns pricing-specific metadata.
export const metadata: Metadata = {
  title: { absolute: "Pricing | Konfydence" },
  description:
    "Unlock the full Konfydence Challenge — 40+ real-life scenarios per edition, balanced across the H.A.C.K. pressure patterns, with a deeper profile and completion certificate. $6.99 per edition or unlock all five challenges.",
};

export default function PricingLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
