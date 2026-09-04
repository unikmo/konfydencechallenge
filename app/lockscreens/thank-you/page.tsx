import Link from "next/link";
import type { Metadata } from "next";
import { PremiumPage } from "@/components/PremiumSiteChrome";

export const metadata: Metadata = {
  title: { absolute: "Thank you | Konfydence Lockscreens" },
  description: "Your Konfydence Lockscreens subscription is active — protect your first device.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/lockscreens/thank-you" },
};

export default function LockscreensThankYouPage() {
  return (
    <PremiumPage ctaHref="/challenge" ctaLabel="Try a free check">
      <section className="kg-narrow k-section" style={{ borderTop: 0, textAlign: "center", maxWidth: 640 }}>
        <p className="k-kicker">Subscription active</p>
        <h1 className="k-display-sm">Protect your first device.</h1>
        <p className="k-copy" style={{ margin: "18px auto 0" }}>
          Choose the device you use most, install prompt one in under a minute, then add any others. Every two weeks we email you the next screen as scam patterns change.
        </p>
        <div className="k-actions" style={{ justifyContent: "center", marginTop: 28 }}>
          <Link className="k-button" href="/challenge/travelsafe/start?mode=diagnostic">Take the free readiness check</Link>
          <Link className="k-button-quiet" href="/hack-method">See the method</Link>
        </div>
        <p className="k-copy" style={{ margin: "26px auto 0", fontSize: 12 }}>
          Nothing arrived after a few minutes? <Link href="/contact">Contact us</Link> and we will sort it out.
        </p>
      </section>
    </PremiumPage>
  );
}
