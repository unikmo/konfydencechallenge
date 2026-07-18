import React from "react";
import { CookieConsent } from "@/components/CookieConsent";

export const metadata = {
  title: "Konfydence Challenge",
  description: "Scenario-based decision game",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial" }}>
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}

