import Link from "next/link";
import type { Metadata } from "next";
import { PremiumPage } from "@/components/PremiumSiteChrome";
import { PortfolioStrip } from "@/components/PortfolioStrip";
import { CheckoutRedirectButton } from "@/components/commerce/CheckoutRedirectButton";

export const metadata: Metadata = {
  title: { absolute: "Konfydence Lockscreens | Pause. Think. Call." },
  description:
    "Phone and desktop wallpapers that keep the Pause · Think · Call reminder in view — so the habit is there the moment a message tries to rush you.",
  alternates: { canonical: "/lockscreens" },
  openGraph: {
    title: "Konfydence Lockscreens | Pause. Think. Call.",
    description: "A calm reminder where you will actually see it.",
    url: "https://konfydence.com/lockscreens",
    siteName: "Konfydence",
    type: "website",
  },
};

const includes = [
  ["Phone wallpapers", "Sized for modern iPhone and Android lock screens, with the message legible above the clock."],
  ["Desktop wallpapers", "1440p and higher for work, study and home computers."],
  ["Several designs", "Calm, plain-language and high-contrast versions — pick the one you would actually keep."],
  ["The H.A.C.K. cue", "A discreet reminder of the four pressure patterns almost every scam uses."],
];

export default function LockscreensPage() {
  return (
    <PremiumPage ctaHref="#get" ctaLabel="Get the pack">
      <section className="kls-hero kg-shell">
        <div className="kls-hero-copy">
          <p className="k-kicker">Konfydence Lockscreens</p>
          <h1 className="k-display">The reminder, where you will actually see it.</h1>
          <p className="k-lede">
            Scam pressure works because it catches you mid-scroll. A lock screen puts <strong>Pause. Think. Call.</strong> in front of you before you reply, click or pay.
          </p>
          <div className="k-actions">
            <a className="k-button" href="#get">Get the pack — $19.99</a>
            <Link className="k-button-quiet" href="/hack-method">See the method</Link>
          </div>
        </div>
        <div className="kls-devices" aria-hidden="true">
          <div className="kls-phone">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/resources/konfydence-phone-lock-screen.svg" alt="" />
          </div>
          <div className="kls-desktop">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/resources/konfydence-desktop-lock-screen.svg" alt="" />
          </div>
        </div>
      </section>

      <section className="kg-shell k-section">
        <div className="k-section-head">
          <div>
            <p className="k-kicker">What's in the pack</p>
            <h2 className="k-display-sm">One small purchase. A habit that stays in view.</h2>
          </div>
          <p className="k-copy">
            Instant download after checkout. Set it once and the reminder does its work every time your screen lights up.
          </p>
        </div>
        <div className="kls-includes">
          {includes.map(([title, copy]) => (
            <article key={title}>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="get" className="kg-shell kls-buy">
        <div className="k-section-head">
          <div>
            <p className="k-kicker">Pricing</p>
            <h2 className="k-display-sm">One pack for you. Per-seat for a group.</h2>
          </div>
          <p className="k-copy">
            The individual pack is a one-time payment with instant download. Schools and organisations are priced per seat so everyone gets the reminder on their own devices.
          </p>
        </div>
        <div className="kls-tiers">
          <article className="kls-tier is-featured">
            <p className="kls-tier-name">Individual</p>
            <p className="kls-tier-price"><strong>$19.99</strong> one-time</p>
            <p className="kls-tier-copy">Phone and desktop wallpapers, several designs, for you and your household.</p>
            <div className="kls-tier-cta">
              <CheckoutRedirectButton sku="LOCKSCREENS-PACK" label="Buy the pack — $19.99" />
            </div>
          </article>
          <article className="kls-tier">
            <p className="kls-tier-name">Schools</p>
            <p className="kls-tier-price"><strong>Per seat</strong></p>
            <p className="kls-tier-copy">One licence per student or staff member, with a version sized for shared and managed devices.</p>
            <div className="kls-tier-cta">
              <Link className="k-button-quiet" href="/contact?topic=lockscreens-schools">Get a school quote</Link>
            </div>
          </article>
          <article className="kls-tier">
            <p className="kls-tier-name">Organisations</p>
            <p className="kls-tier-price"><strong>Per seat</strong></p>
            <p className="kls-tier-copy">Volume per-seat licensing for employee devices, alongside a CoMaSy pilot if you want measurement too.</p>
            <div className="kls-tier-cta">
              <Link className="k-button-quiet" href="/contact?topic=lockscreens-organisations">Get an org quote</Link>
            </div>
          </article>
        </div>
        <p className="kls-buy-note">
          Prefer a free reminder first? The <Link href="/free-scam-safety-pack">Emergency Scam Protocol</Link> is a free download.
        </p>
      </section>

      <PortfolioStrip exclude={["lockscreens"]} kicker="Also from Konfydence" heading="Practise the decision, not just the reminder." />
    </PremiumPage>
  );
}
