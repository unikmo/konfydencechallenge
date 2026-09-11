import Script from "next/script";
import type { Metadata } from "next";

// The root layout owns the single <html> tag and stays lang="en" so the rest
// of the (mostly static) site keeps its build-time rendering — see
// app/layout.tsx. This corrects documentElement.lang for everything under
// /de/ right after hydration; browsers and screen readers read the live DOM.
export const metadata: Metadata = {
  title: { template: "%s | Konfydence", default: "Konfydence — Vertrauen unter Druck" },
  description: "Szenario-basiertes Training, das Familien hilft, unter Druck sichere Entscheidungen zu treffen.",
  alternates: { languages: { en: "https://konfydence.com", de: "https://konfydence.com/de" } },
};

export default function GermanLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Script id="kf-de-lang" strategy="beforeInteractive">
        {`document.documentElement.lang = "de";`}
      </Script>
      {children}
    </>
  );
}
