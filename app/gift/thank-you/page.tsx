import Link from "next/link";
import type { Metadata } from "next";
import { PremiumPage } from "@/components/PremiumSiteChrome";

export const metadata: Metadata = {
  title: "Your gift is on its way",
  robots: { index: false, follow: true },
};

export default function GiftThankYouPage() {
  return (
    <PremiumPage ctaHref="/challenge" ctaLabel="Start a free check">
      <section className="kg-shell kc-hero is-narrow" style={{ paddingBottom: 48 }}>
        <p className="k-kicker">Gift sent</p>
        <h1>That&rsquo;s done — thank you.</h1>
        <p>
          We&rsquo;ve emailed the recipient a claim code and your note. They can redeem it whenever
          they&rsquo;re ready. If it doesn&rsquo;t arrive within a few minutes, ask them to check spam.
        </p>
        <p style={{ marginTop: 24 }}>
          <Link className="k-button" href="/">Back to Konfydence</Link>
        </p>
      </section>
    </PremiumPage>
  );
}
