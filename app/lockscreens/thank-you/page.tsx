import Link from "next/link";
import type { Metadata } from "next";
import { PremiumPage } from "@/components/PremiumSiteChrome";

export const metadata: Metadata = {
  title: { absolute: "Thank you | Konfydence Lockscreens" },
  description: "Your Konfydence lockscreen pack is on its way.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/lockscreens/thank-you" },
};

export default function LockscreensThankYouPage() {
  return (
    <PremiumPage ctaHref="/challenge" ctaLabel="Try a free check">
      <section className="kg-narrow k-section" style={{ borderTop: 0, textAlign: "center", maxWidth: 640 }}>
        <p className="k-kicker">Payment received</p>
        <h1 className="k-display-sm">Your lockscreen pack is on its way.</h1>
        <p className="k-copy" style={{ margin: "18px auto 0" }}>
          Check your email for the download link, including your junk folder. Set a phone and a desktop wallpaper today so the reminder is there the next time a message tries to rush you.
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
