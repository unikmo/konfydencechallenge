import type { Metadata } from "next";
import type { ReactNode } from "react";

// app/de/pricing/page.tsx is a client component (edition picker + search
// params) — this server layout owns its metadata, same pattern as app/pricing.
export const metadata: Metadata = {
  title: { absolute: "Preise | Konfydence" },
  description: "Konfydence-Preise — kostenloser Check, Familie- oder Schule-Edition, oder das komplette Paket.",
  alternates: { canonical: "/de/pricing", languages: { en: "https://konfydence.com/pricing", de: "https://konfydence.com/de/pricing" } },
};

export default function GermanPricingLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
