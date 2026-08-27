import React from "react";
import Script from "next/script";
import type { Metadata, Viewport } from "next";
import { CookieConsent } from "@/components/CookieConsent";
import { AnalyticsInstrumentation } from "@/components/AnalyticsInstrumentation";
import "./konfydence-premium.css";
import "./brand-logos.css";
import "./scam-safety-pack.css";
import "./asset-hardening.css";
import "./home-travelsafe.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://konfydence.com"),
  title: {
    default: "Konfydence | Confidence under pressure",
    template: "%s | Konfydence",
  },
  description:
    "Scenario-based practice that helps people and organisations make safer decisions under pressure.",
  applicationName: "Konfydence",
  category: "education",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: "Konfydence | Confidence under pressure",
    description: "Practise safer decisions before the pressure is real.",
    url: "https://konfydence.com",
    siteName: "Konfydence",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Konfydence | Confidence under pressure",
    description: "Practise safer decisions before the pressure is real.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f7f4ee",
  colorScheme: "light",
};

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {GA_MEASUREMENT_ID ? (
          <>
            <Script id="ga-consent-default" strategy="beforeInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                window.gtag = gtag;
                gtag('consent', 'default', {
                  analytics_storage: 'denied',
                  ad_storage: 'denied',
                  ad_user_data: 'denied',
                  ad_personalization: 'denied'
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
                gtag('config', '${GA_MEASUREMENT_ID}', { send_page_view: true });
              `}
            </Script>
          </>
        ) : null}
        {children}
        <AnalyticsInstrumentation />
        <CookieConsent />
      </body>
    </html>
  );
}
