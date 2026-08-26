import type { Metadata } from "next";
import { PremiumPage } from "@/components/PremiumSiteChrome";
import { ScamSafetyPack } from "@/components/ScamSafetyPack";

export const metadata: Metadata = {
  title: { absolute: "Free Scam Protocol & Lock Screens | Konfydence" },
  description:
    "Choose up to three free Konfydence scam-safety resources: the household Emergency Scam Protocol plus official phone and computer lock screens.",
  alternates: { canonical: "/free-scam-safety-pack" },
  openGraph: {
    title: "Free Konfydence Scam Safety Resources",
    description: "Choose up to three: Emergency Scam Protocol, phone lock screens and computer lock screens.",
    url: "https://konfydence.com/free-scam-safety-pack",
    siteName: "Konfydence",
    type: "website",
  },
};

export default function FreeScamSafetyPackPage() {
  return (
    <PremiumPage ctaHref="#free-scam-safety-pack" ctaLabel="Choose free resources">
      <div className="k-pack-page-intro k-shell">
        <p className="k-breadcrumb">Free resources · Household scam safety</p>
        <p className="k-kicker">Emergency readiness</p>
        <h1 className="k-display">Put the right reminder where pressure finds you.</h1>
        <p className="k-lede">
          Choose up to three official Konfydence resources per request. Start with the household Emergency Scam Protocol, then add the phone or computer lock screens you would actually keep visible.
        </p>
      </div>
      <ScamSafetyPack source="resource-page" />
    </PremiumPage>
  );
}
