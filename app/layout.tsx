import React from "react";
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

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        {children}
        <AnalyticsInstrumentation />
        <CookieConsent />
      </body>
    </html>
  );
}
