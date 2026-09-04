import Link from "next/link";
import type { Metadata } from "next";
import { PremiumPage } from "@/components/PremiumSiteChrome";
import { PortfolioStrip } from "@/components/PortfolioStrip";

export const metadata: Metadata = {
  title: { absolute: "Konfydence Lockscreens | Pause. Ask. Think." },
  description:
    "A lock-screen reminder service. Pick your device, install the first screen, and get a fresh Pause · Ask · Think prompt every two weeks as scam patterns change.",
  alternates: { canonical: "/lockscreens" },
  openGraph: {
    title: "Konfydence Lockscreens | Pause. Ask. Think.",
    description: "A calm reminder where you will actually see it — refreshed every two weeks.",
    url: "https://konfydence.com/lockscreens",
    siteName: "Konfydence",
    type: "website",
  },
};

const howItWorks = [
  ["Buy on konfydence.com", "One checkout. You land on a page that says: protect your first device."],
  ["Choose your device", "iPhone, Android, Windows, Mac or iPad. We show the right format automatically — no guessing, no ZIP."],
  ["Install screen one", "Download prompt 1 and follow a few short, device-specific steps. Add another device if you want."],
  ["A new screen every two weeks", "“Your next Konfydence screen is ready.” One click, one download. The wording and the scam patterns stay current."],
];

const tiers = [
  {
    name: "Home",
    price: "$19.99",
    unit: "first year",
    renew: "then $14.99 / year",
    copy: "Every device in the household. A new prompt every two weeks and continued access to the full set.",
    cta: "Get early access",
    href: "/contact?topic=lockscreens-home",
  },
  {
    name: "Teen Home",
    price: "$19.99",
    unit: "first year",
    renew: "then $14.99 / year",
    copy: "The same service with prompts written for a teenager's phone — gaming, social and peer-pressure scams.",
    cta: "Get early access",
    href: "/contact?topic=lockscreens-teen",
  },
  {
    name: "Schools",
    price: "$2",
    unit: "per managed computer / year",
    renew: "Sized for shared and MDM-managed devices",
    copy: "One licence per managed computer. Rolled out to lab, library and classroom machines through your device management.",
    cta: "Get a school quote",
    href: "/contact?topic=lockscreens-schools",
  },
  {
    name: "Workplace",
    price: "$4",
    unit: "per employee / year",
    renew: "$300 minimum annual licence",
    copy: "Per-employee licensing for company devices. Pairs with a CoMaSy pilot when you also want to measure behaviour.",
    cta: "Get a workplace quote",
    href: "/contact?topic=lockscreens-workplace",
  },
];

export default function LockscreensPage() {
  return (
    <PremiumPage ctaHref="#pricing" ctaLabel="See pricing">
      <section className="kls-hero kg-shell">
        <div className="kls-hero-copy">
          <p className="k-kicker">Konfydence Lockscreens</p>
          <h1 className="k-display">The reminder, where you will actually see it.</h1>
          <p className="k-lede">
            Scam pressure works because it catches you mid-scroll. A lock screen puts <strong>Pause. Ask. Think.</strong> in
            front of you before you reply, click or pay — and a fresh prompt lands every two weeks as the scams change.
          </p>
          <div className="k-actions">
            <a className="k-button" href="#pricing">See pricing</a>
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
            <p className="k-kicker">How it works</p>
            <h2 className="k-display-sm">A service, not a folder of wallpapers.</h2>
          </div>
          <p className="k-copy">
            You never touch a ZIP of 180 files. You install one screen, on one device, in under a minute — and Konfydence
            keeps it current for you.
          </p>
        </div>
        <div className="kls-includes">
          {howItWorks.map(([title, copy], i) => (
            <article key={title}>
              <span className="kls-step-no">{String(i + 1).padStart(2, "0")}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="pricing" className="kg-shell kls-buy">
        <div className="k-section-head">
          <div>
            <p className="k-kicker">Pricing</p>
            <h2 className="k-display-sm">Annual, because the prompts are refreshed all year.</h2>
          </div>
          <p className="k-copy">
            Year one includes onboarding and the full prompt set. The renewal keeps the fortnightly updates, new scam
            patterns and access coming.
          </p>
        </div>
        <div className="kls-tiers is-4">
          {tiers.map((tier, i) => (
            <article className={`kls-tier ${i < 2 ? "is-featured" : ""}`} key={tier.name}>
              <p className="kls-tier-name">{tier.name}</p>
              <p className="kls-tier-price"><strong>{tier.price}</strong> {tier.unit}</p>
              <p className="kls-tier-renew">{tier.renew}</p>
              <p className="kls-tier-copy">{tier.copy}</p>
              <div className="kls-tier-cta">
                <Link className="k-button-quiet" href={tier.href}>{tier.cta}</Link>
              </div>
            </article>
          ))}
        </div>
        <p className="kls-buy-note">
          Checkout and device onboarding are being set up now — the quote links reach us directly in the meantime. Prefer a
          free reminder first? The <Link href="/free-scam-safety-pack">Emergency Scam Protocol</Link> is a free download.
        </p>
      </section>

      <PortfolioStrip exclude={["lockscreens"]} kicker="Also from Konfydence" heading="Practise the decision, not just the reminder." />
    </PremiumPage>
  );
}
