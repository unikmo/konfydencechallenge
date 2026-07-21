import React from "react";
import Script from "next/script";
import { CookieConsent } from "@/components/CookieConsent";

export const metadata = {
  title: "Konfydence Challenge",
  description: "Scenario-based decision game",
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

