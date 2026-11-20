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
    copy: "“Mom, it’s me. I need money.” What if that one message was not from your child?",
    signal: "Best for households and mixed-age families",
  },
  {
    key: "school",
    eyebrow: "Students",
    title: "School",
    copy: "“You just won. Claim it now.” Free stuff. Urgent links. What would you do?",
    signal: "Best for school-age learners",
  },
  {
    key: "university",
    eyebrow: "Campus life",
    title: "University",
    copy: "“Great apartment. One deposit away.” Everything looks perfect. Have you checked the one thing that matters?",
    signal: "Best for students living and transacting independently",
  },
  {
    key: "workplace",
    eyebrow: "Professional",
    title: "Workplace",
    copy: "“The CEO needs this approved. Immediately.” The message looks official. Would you question it?",
    signal: "Best for employees and teams",
  },
  {
    key: "travelsafe",
    eyebrow: "On the move",
    title: "TravelSafe",
    copy: "“Your booking needs attention. Right now.” You are far from home. What is your next move?",
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
        <p className="k-kicker">Your move. Your result.</p>
        <h1 className="k-display">
          Think you would spot it? <span style={{ color: "var(--k-gold)" }}>There is one way to find out.</span>
        </h1>
        <p className="k-lede">
          You know the warning signs. But what would you actually do when the message feels real? Choose your world. Make the call. Discover your pressure pattern.
        </p>
        <div className="kg-promise">
          <span>First check free</span><span>Short, realistic decisions</span><span>No account to begin</span><span>Practical feedback after every move</span>
        </div>
        <p className="k-copy" style={{ marginTop: 18 }}>
          Rather do it with people? <Link href="/play" style={{ fontWeight: 700 }}>Play with friends</Link> — same scenarios, same room, running leaderboard.
        </p>
      </section>

      <section className="k-shell k-section" aria-labelledby="choose-edition">
        <div className="k-section-head">
          <div>
            <p className="k-kicker">Choose your pressure test</p>
            <h2 id="choose-edition" className="k-display-sm">Which message would make you hesitate?</h2>
          </div>
          <p className="k-copy">
            Five familiar worlds. Five different kinds of pressure. Pick the situation that feels closest to your life. Your first check is free; deeper practice is optional.
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
                <Link href={`/challenge/${edition.key}/start?mode=diagnostic`}>See what I would do <span aria-hidden="true">→</span></Link>
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
              <p className="kg-buy-copy">Pick the version closest to your life and practise 40+ real-life scenarios, added to regularly.</p>
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
              <p className="k-kicker">The surprise after the score</p>
              <h2 className="k-display-sm">Your score tells one story. Your pressure pattern tells another.</h2>
            </div>
            <p className="k-copy">
              Find out whether urgency, authority, familiarity or the final action moment changed your choices. Then see the move worth practising. This is training feedback, not a protection guarantee.
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

      <p className="k-shell k-copy" style={{ marginTop: 32, marginBottom: 32 }}>Looking for the details on scoring, privacy, subscriptions or the editions? <Link href="/faq">Read the straight answers in our FAQ</Link>. For adult guests, the completed free result is delivered by email.</p>
      <PortfolioStrip kicker="Also from Konfydence" heading="Beyond the free check." />

      <section className="k-shell k-callout">
        <div>
          <p className="k-kicker">Start where the risk is real</p>
          <h2 className="k-display-sm">You are up. What is your move?</h2>
          <p className="k-copy">No studying first. Decide as you would today; discover what you noticed and what you missed.</p>
        </div>
        <div className="k-actions">
          <Link className="k-button" href="/challenge/family/start?mode=diagnostic">Find out how I would react →</Link>
        </div>
      </section>
    </PremiumPage>
  );
}
