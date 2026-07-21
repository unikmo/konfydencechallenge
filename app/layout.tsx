import React from "react";
import Script from "next/script";
import type { Metadata } from "next";
import { CookieConsent } from "@/components/CookieConsent";

// Site-wide default metadata. Acts as the actual metadata for "/" (app/page.tsx
// is a client component and can't export its own), and as the fallback for any
// other client-component page that hasn't defined its own metadata.
export const metadata: Metadata = {
  metadataBase: new URL("https://konfydence.com"),
  title: {
    default: "Konfydence | Scam Readiness Game & Online Scam Training",
    template: "%s | Konfydence",
  },
  description:
    "Scammers don't look like scammers. Take a free 3-minute scam-readiness challenge with real-life scenarios, get your Konfydence Readiness Score, and learn which pressure tricks could catch you.",
  openGraph: {
    title: "Konfydence | Scam Readiness Game & Online Scam Training",
    description:
      "Take a free 3-minute scam-readiness challenge built on real scam scripts, and see how you'd hold up under pressure.",
    url: "https://konfydence.com",
    siteName: "Konfydence",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Konfydence | Scam Readiness Game & Online Scam Training",
    description:
      "Take a free 3-minute scam-readiness challenge built on real scam scripts, and see how you'd hold up under pressure.",
  },
};

// Set once real analytics were wired in — see lib/events.ts and CookieConsent.tsx,
// which both already assumed a `window.gtag` would exist (consent-mode calls, event
// pushes) but no gtag.js script was ever actually loaded. Guarded by env var so a
// missing/blank value just skips analytics entirely rather than injecting a broken tag.
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial" }}>
        {GA_MEASUREMENT_ID ? (
          <>
            {/*
              Consent Mode default: analytics_storage starts "denied" so no
              measurement/cookies fire until CookieConsent's "Accept All" grants it
              (or immediately re-grants it on return visits — see CookieConsent.tsx).
              This must run before gtag.js loads, so it's a separate, earlier script.
            */}
            <Script id="ga-consent-default" strategy="beforeInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                window.gtag = gtag;
                gtag('consent', 'default', {
                  analytics_storage: 'denied'
                });
              `}
            </Script>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                window.gtag = gtag;
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}');
              `}
            </Script>
          </>
        ) : null}
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}

