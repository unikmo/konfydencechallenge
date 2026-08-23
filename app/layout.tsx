import React from "react";
import Script from "next/script";
import type { Metadata, Viewport } from "next";
import { CookieConsent } from "@/components/CookieConsent";
import { AnalyticsInstrumentation } from "@/components/AnalyticsInstrumentation";

export const metadata: Metadata = {
  metadataBase: new URL("https://konfydence.com"),
  title: {
    default: "Konfydence | Scenario-Based Scam Awareness Training",
    template: "%s | Konfydence",
  },
  description:
    "Scenario-based scam-awareness training that helps people practise safer decisions under pressure.",
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
    title: "Konfydence | Scenario-Based Scam Awareness Training",
    description: "Practise safer decisions before the pressure is real.",
    url: "https://konfydence.com",
    siteName: "Konfydence",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Konfydence | Scenario-Based Scam Awareness Training",
    description: "Practise safer decisions before the pressure is real.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#091522",
  colorScheme: "light",
};

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
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
