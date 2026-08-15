import type { Metadata } from "next";
import type { ReactNode } from "react";

// app/pricing/page.tsx is a client component because it reads search params.
// This server layout owns pricing-specific metadata.
export const metadata: Metadata = {
  title: { absolute: "Pricing | Konfydence" },
  description:
    "Unlock a full 24-decision Konfydence Challenge drawn from a balanced 40-scenario edition bank, with a deeper H.A.C.K. pressure profile and completion certificate. $4.99 per edition or unlock all five challenges.",
};

export default function PricingLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
