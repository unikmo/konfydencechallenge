import type { Metadata } from "next";
import Link from "next/link";
import { PremiumPage } from "@/components/PremiumSiteChrome";
import { ScamSafetyPack } from "@/components/ScamSafetyPack";

export const metadata: Metadata = {
  title: { absolute: "Free Emergency Scam Protocol | Konfydence" },
  description:
    "Download the free Konfydence Emergency Scam Protocol — a printable Pause · Ask · Think response sheet for the household.",
  alternates: { canonical: "/free-scam-safety-pack" },
  openGraph: {
    title: "Free Konfydence Emergency Scam Protocol",
    description: "A printable Pause · Ask · Think response sheet for the household.",
    url: "https://konfydence.com/free-scam-safety-pack",
    siteName: "Konfydence",
    type: "website",
  },
};

export default function FreeScamSafetyPackPage() {
  return (
    <PremiumPage ctaHref="#free-scam-safety-pack" ctaLabel="Get the free protocol">
      <div className="k-pack-page-intro k-shell">
        <p className="k-breadcrumb">Free resource · Household scam safety</p>
        <p className="k-kicker">Emergency readiness</p>
        <h1 className="k-display">One page. On the fridge. Before you need it.</h1>
        <p className="k-lede">
          The Emergency Scam Protocol is a free, printable Pause · Ask · Think response sheet for when a message,
          call or payment request feels urgent. For an always-on reminder on your phone and computer, see the{" "}
          <Link href="/lockscreens">Konfydence Lockscreens</Link> service.
        </p>
      </div>
      <ScamSafetyPack source="resource-page" />
    </PremiumPage>
  );
}
