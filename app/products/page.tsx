import Link from "next/link";
import type { Metadata } from "next";
import { PremiumPage } from "@/components/PremiumSiteChrome";
import { PortfolioStrip } from "@/components/PortfolioStrip";
import { CheckoutRedirectButton } from "@/components/commerce/CheckoutRedirectButton";

export const metadata: Metadata = {
  title: { absolute: "Konfydence Merch | Wallet Card & Fridge Magnet" },
  description:
    "Physical reminders of the H.A.C.K. framework — a wallet-sized scam-check card and a fridge magnet — to keep pressure-tactic red flags visible at the moment they matter.",
  alternates: { canonical: "/products" },
};

export default function ProductsPage() {
  return (
    <PremiumPage ctaHref="/challenge" ctaLabel="Try a free check">
      <section className="kg-shell kc-hero is-narrow">
        <p className="k-kicker">Konfydence Safety Suite</p>
        <h1>Keep the pause close when pressure hits.</h1>
        <p>
          Small, physical cues that help you slow down, verify the request and protect the people and
          workspaces that matter to you.
        </p>
      </section>

      <section className="kg-shell kc-price-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        <article className="kc-price">
          <p className="kc-price-kicker">Wallet card</p>
          <p className="kc-price-amount"><strong>$14.99</strong></p>
          <ul className="kc-price-list">
            <li>Pocket-sized H.A.C.K. reminder for the moment a message, call or payment request feels urgent</li>
            <li>Keeps the pause within reach</li>
            <li>Ships as a printed card</li>
          </ul>
          <div className="kc-price-cta">
            <CheckoutRedirectButton sku="KG-WALLET" label="Add to cart — $14.99" />
          </div>
        </article>

        <article className="kc-price">
          <p className="kc-price-kicker">Fridge magnet</p>
          <p className="kc-price-amount"><strong>$9.99</strong></p>
          <ul className="kc-price-list">
            <li>Makes the safer question part of the household routine</li>
            <li>Pause. Think. Call.</li>
            <li>Ships as a printed magnet</li>
          </ul>
          <div className="kc-price-cta">
            <CheckoutRedirectButton sku="KG-MAGNET" label="Add to cart — $9.99" />
          </div>
        </article>

        <article className="kc-price is-featured">
          <p className="kc-price-kicker">Lockscreens</p>
          <p className="kc-price-amount"><strong>Digital</strong></p>
          <ul className="kc-price-list">
            <li>A Pause · Think · Call reminder on the screen you check most</li>
            <li>A fresh prompt every two weeks as scam patterns change</li>
            <li>For yourself, a household, a school or a team</li>
          </ul>
          <div className="kc-price-cta">
            <Link className="k-button" href="/lockscreens">See Lockscreens</Link>
          </div>
        </article>
      </section>

      <section className="kg-shell k-callout">
        <div>
          <p className="k-kicker">Separate experience</p>
          <h2 className="k-display-sm">Want to practise the pause?</h2>
          <p className="k-copy">
            Try realistic pressure scenarios and see how you respond before the moment is real.
          </p>
        </div>
        <div className="k-actions">
          <Link className="k-button" href="/challenge">Open the challenge</Link>
        </div>
      </section>

      <PortfolioStrip kicker="More from Konfydence" heading="The rest of the toolkit." />
    </PremiumPage>
  );
}
