import type { Metadata } from "next";
import { PremiumPage } from "@/components/PremiumSiteChrome";
import { ScamSafetyPack } from "@/components/ScamSafetyPack";

export const metadata: Metadata = {
  title: { absolute: "Free Emergency Scam Protocol & Screen Lockers | Konfydence" },
  description:
    "Download the free Konfydence Scam Safety Pack: a printable household Emergency Scam Protocol plus phone and computer screen reminders.",
  alternates: { canonical: "/free-scam-safety-pack" },
  openGraph: {
    title: "Free Konfydence Scam Safety Pack",
    description: "Emergency Scam Protocol + phone and computer screen reminders for households.",
    url: "https://konfydence.com/free-scam-safety-pack",
    siteName: "Konfydence",
    type: "website",
  },
};

export default function FreeScamSafetyPackPage() {
  return (
    <PremiumPage ctaHref="#free-scam-safety-pack" ctaLabel="Get the free pack">
      <div className="k-pack-page-intro k-shell">
        <p className="k-breadcrumb">Free resources · Household scam safety</p>
        <p className="k-kicker">Emergency readiness</p>
        <h1 className="k-display">A simple protocol for the moment pressure takes over.</h1>
        <p className="k-lede">
          The Emergency Scam Protocol is designed to be visible, printable and easy to remember: stop, pause, verify independently and call someone you trust before acting.
        </p>
      </div>
      <ScamSafetyPack source="resource-page" />
    </PremiumPage>
  );
}
