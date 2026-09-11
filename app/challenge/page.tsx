import type { Metadata } from "next";
import Link from "next/link";
import { PremiumPage } from "@/components/PremiumSiteChrome";
import { PortfolioStrip } from "@/components/PortfolioStrip";
import { CheckoutRedirectButton } from "@/components/commerce/CheckoutRedirectButton";

export const metadata: Metadata = {
  title: "Choose Your Konfydence Challenge",
  description: "Choose the pressure test that matches your real life. Eight free scenarios reveal which scam pressure pattern is most likely to move you.",
  alternates: {
    canonical: "/challenge",
    languages: { en: "https://konfydence.com/challenge", de: "https://konfydence.com/de/challenge" },
  },
};

const editions = [
  {
    key: "family",
    eyebrow: "Home & family",
    title: "Family",
    copy: "Bank alerts, deliveries, relatives, marketplace messages and everyday requests that exploit familiarity.",
    signal: "Best for households and mixed-age families",
  },
  {
    key: "school",
    eyebrow: "Students",
    title: "School",
    copy: "Gaming, social accounts, fake giveaways, school messages and pressure that targets younger decision-makers.",
    signal: "Best for school-age learners",
  },
  {
    key: "university",
    eyebrow: "Campus life",
    title: "University",
    copy: "Housing, student jobs, account access, ticketing, payments and scams built around independence and urgency.",
    signal: "Best for students living and transacting independently",
  },
  {
    key: "workplace",
    eyebrow: "Professional",
    title: "Workplace",
    copy: "Executive impersonation, invoice changes, HR requests, credentials and authority pressure inside real work flows.",
    signal: "Best for employees and teams",
  },
  {
    key: "travelsafe",
    eyebrow: "On the move",
    title: "TravelSafe",
    copy: "Bookings, transport, Wi-Fi, payment, accommodation and urgent travel problems where verification is harder.",
    signal: "Best before or during travel",
  },
] as const;

const hack = [
  ["H", "Hurry", "Can urgency make you act before you verify?"],
  ["A", "Authority", "Do official-looking people or institutions get a shortcut to trust?"],
  ["C", "Comfort", "Does familiarity lower your guard before the evidence is checked?"],
  ["K", "Kill-Switch", "Can you stop at the critical action moment and verify independently?"],
] as const;

export default function ChallengeLanding() {
  return (
    <PremiumPage ctaHref="/challenge/family/start?mode=diagnostic" ctaLabel="Start free check">
      <section className="k-shell k-section" style={{ borderTop: 0, paddingTop: 72 }}>
        <p className="k-kicker">Free scam-pressure diagnostic</p>
        <h1 className="k-display">
          Scams do not test what you know. <span style={{ color: "var(--k-gold)" }}>They test what you do under pressure.</span>
        </h1>
        <p className="k-lede">
          Choose the version closest to your real life. You will face a short run of decisions — balanced across the four H.A.C.K. pressure patterns — and get a personal readiness profile at the end.
        </p>
        <div className="kg-promise">
          <span>Quick scored check</span><span>About 4 minutes</span><span>No account for round one</span><span>Immediate H.A.C.K. profile</span>
        </div>
        <p className="k-copy" style={{ marginTop: 18 }}>
          Rather do it with people? <Link href="/play" style={{ fontWeight: 700 }}>Play with friends</Link> — same scenarios, same room, running leaderboard.
        </p>
      </section>

      <section className="k-shell k-section" aria-labelledby="choose-edition">
        <div className="k-section-head">
          <div>
            <p className="k-kicker">Choose your pressure test</p>
            <h2 id="choose-edition" className="k-display-sm">Where are you most likely to be targeted?</h2>
          </div>
          <p className="k-copy">
            Each edition has 40+ real-life scenarios — balanced across Hurry, Authority, Comfort and Kill-Switch, and added to regularly. Try it free, or unlock the full edition for $6.99/year and play the whole set in short rounds.
          </p>
        </div>
        <div className="kg-edition-grid">
          {editions.map((edition, index) => (
            <article className="kg-edition" key={edition.key}>
              <div className="kg-edition-top"><span>{edition.eyebrow}</span><b>0{index + 1}</b></div>
              <h3>{edition.title}</h3>
              <p>{edition.copy}</p>
              <small>{edition.signal}</small>
              <div className="kg-edition-actions">
                <Link href={`/challenge/${edition.key}/start?mode=diagnostic`}>Try free check <span aria-hidden="true">→</span></Link>
                <Link className="kg-edition-buy" href={`/pricing?edition=${edition.key}`}>Buy — $6.99/yr</Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="k-section-dark" aria-labelledby="buy-now">
        <div className="k-shell">
          <div className="k-section-head">
            <div>
              <p className="k-kicker">Skip the free check</p>
              <h2 id="buy-now" className="k-display-sm">Already know you want the full set?</h2>
            </div>
            <p className="k-copy">
              All five editions — 200+ real-life scenarios, unlimited rounds, a readiness dashboard and certificate for each. Instant access after checkout. Annual plan — cancel anytime.
            </p>
          </div>
          <div className="kg-buy-band">
            <div className="kg-buy-card">
              <p className="kg-buy-name">One edition</p>
              <p className="kg-buy-price"><strong>$6.99</strong> / year · per edition</p>
              <p className="kg-buy-copy">Pick the version closest to your life and unlock the whole scenario bank.</p>
              <Link className="k-button-quiet" href="/pricing">Choose an edition</Link>
            </div>
            <div className="kg-buy-card is-featured">
              <p className="kg-buy-name">Complete pack</p>
              <p className="kg-buy-price"><strong>$24.99</strong> / year · all five</p>
              <p className="kg-buy-copy">Every edition, best value — Family, School, University, Workplace and TravelSafe.</p>
              <CheckoutRedirectButton sku="CHAL-UNLIMITED" label="Get all five — $24.99/yr" />
            </div>
          </div>
          <p className="k-copy" style={{ marginTop: 18, fontSize: 13 }}>
            Buying for someone else? <Link href="/gift">Gift a challenge</Link>. Need cohort licensing for a school or team? <Link href="/pricing">See pricing</Link>.
          </p>
        </div>
      </section>

      <section className="k-section-dark">
        <div className="k-shell">
          <div className="k-section-head">
            <div>
              <p className="k-kicker">What the result measures</p>
              <h2 className="k-display-sm">Your H.A.C.K. pressure profile.</h2>
            </div>
            <p className="k-copy">
              Not a personality label. A practical signal showing which kind of pressure most changes your decisions — and which reflex to practise next.
            </p>
          </div>
          <div className="k-principles k-principles-four" style={{ borderColor: "rgba(255,255,255,.14)" }}>
            {hack.map(([key, title, copy]) => (
              <article className="k-principle" key={key} style={{ borderColor: "rgba(255,255,255,.14)" }}>
                <span style={{ borderColor: "rgba(255,255,255,.22)" }}>{key}</span>
                <h3>{title}</h3>
                <p style={{ color: "#aaa7a2" }}>{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <PortfolioStrip kicker="Also from Konfydence" heading="Beyond the free check." />

      <section className="k-shell k-callout">
        <div>
          <p className="k-kicker">Start where the risk is real</p>
          <h2 className="k-display-sm">You do not need to study first.</h2>
          <p className="k-copy">Make the decisions you would make today, then use the result to train the reflex that needs work.</p>
        </div>
        <div className="k-actions">
          <Link className="k-button" href="/challenge/family/start?mode=diagnostic">Start the Family check</Link>
        </div>
      </section>
    </PremiumPage>
  );
}
