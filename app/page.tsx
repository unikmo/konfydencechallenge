import Link from "next/link";
import type { Metadata } from "next";
import { PremiumPage } from "@/components/PremiumSiteChrome";
import { PortfolioStrip } from "@/components/PortfolioStrip";

export const metadata: Metadata = {
  title: { absolute: "TravelSafe by Konfydence | Practise safer travel decisions" },
  description:
    "TravelSafe helps travellers practise calm, confident decisions before an urgent message, call or request puts them under pressure.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "TravelSafe by Konfydence | Your trip should be the adventure. Not the scam.",
    description: "Practise the decision before the pressure is real.",
    url: "https://konfydence.com",
    type: "website",
  },
};

const principles = [
  ["01", "Hurry", "Pressure tries to make speed feel more important than verification."],
  ["02", "Authority", "Titles and hierarchy can make a risky request feel unquestionable."],
  ["03", "Comfort", "Familiar people, routines and channels can lower healthy skepticism."],
  ["04", "Kill-Switch", "Pressure often tries to stop you from checking independently or asking someone else."],
];

export default function HomePage() {
  return (
    <PremiumPage ctaHref="/challenge/travelsafe/start?mode=diagnostic" ctaLabel="Try TravelSafe free">
      <section className="k-home-hero" aria-labelledby="home-hero-title">
        <div className="k-shell k-home-hero-copy">
          <h1 id="home-hero-title" className="k-home-hero-title">
            <span>Your trip should be the adventure.</span>
            <span className="k-home-hero-alert">Not the scam.</span>
          </h1>
        </div>

        <div className="k-home-hero-media k-home-hero-media-photo">
          {/* Real licensed travel photography for premium hero fidelity. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.pexels.com/photos/4173213/pexels-photo-4173213.jpeg?auto=compress&cs=tinysrgb&w=2200"
            alt="A mother and daughter travelling together through an airport with luggage"
            loading="eager"
            fetchPriority="high"
          />
        </div>

        <div className="k-shell k-home-hero-after">
          <p>Practise the decision before the pressure is real.</p>
          <div className="k-home-hero-actions">
            <Link className="k-button k-home-primary" href="/challenge/travelsafe/start?mode=diagnostic">Try TravelSafe free</Link>
            <Link className="k-button-quiet k-home-secondary" href="#for-someone">For someone you care about</Link>
          </div>
          <a className="k-home-scroll-cue" href="#inside-it" aria-label="Continue to learn why scam messages are difficult to recognise">
            <span>See why this matters</span>
            <b aria-hidden="true">↓</b>
          </a>
        </div>
      </section>

      <section id="inside-it" className="k-shell k-home-hook k-home-narrow">
        <p className="k-kicker">The moment that matters</p>
        <h2>It rarely looks like a scam<br />when you&apos;re inside it.</h2>

        <div
          className="k-home-scam-scene"
          role="img"
          aria-label="Illustrative hotel booking scam message presented on a phone in an airport setting"
        >
          {/* Licensed airport photography provides context; the phone UI is real HTML so the pressure cues stay crisp and readable. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="k-home-scam-backdrop"
            src="https://images.pexels.com/photos/8704693/pexels-photo-8704693.jpeg?auto=compress&cs=tinysrgb&w=1800"
            alt=""
            loading="lazy"
          />
          <div className="k-home-phone" aria-hidden="true">
            <div className="k-home-phone-bar">
              <span>9:41</span>
              <span>•••</span>
            </div>
            <div className="k-home-phone-message">
              <small>Harbor Grand Hotel · Booking update</small>
              <strong>Payment required to confirm your booking</strong>
              <p>Hi Amelia,</p>
              <p>Your reservation is almost complete. A secure payment of €620 is required within <b>12 hours</b> to confirm your booking.</p>
              <button type="button">Secure payment</button>
              <em>If you did not make this booking, contact us immediately.</em>
            </div>
          </div>
          <span className="k-home-example-label">Illustrative message</span>
        </div>

        <p className="k-home-hook-lede">TravelSafe turns that uncertain moment into something you can practise calmly before you travel.</p>
        <div className="k-home-benefits">
          <article>
            <span aria-hidden="true">01</span>
            <h3>Real-world scenarios</h3>
            <p>Practise with messages that look and feel real—so the habit is there when it counts.</p>
          </article>
          <article>
            <span aria-hidden="true">02</span>
            <h3>Confident decisions</h3>
            <p>Learn a calm, repeatable process to pause, verify independently and decide.</p>
          </article>
          <article>
            <span aria-hidden="true">03</span>
            <h3>Protection you can share</h3>
            <p>Give useful confidence to the people you care about before they travel.</p>
          </article>
        </div>
      </section>

      <section id="for-someone" className="k-shell k-home-care k-home-narrow">
        <div className="k-home-care-copy">
          <p className="k-kicker">For someone you care about</p>
          <h2 className="k-display-sm">A useful kind of care travels with them.</h2>
          <p className="k-copy">
            TravelSafe is digital decision practice—not a physical gift. Give someone you care about a habit they can carry with them when you cannot be there.
          </p>
          <Link className="k-button" href="/travelsafe">Explore TravelSafe</Link>
        </div>
        <div className="k-home-care-grid" aria-label="TravelSafe can support family, friends and colleagues">
          <article><small>Family</small><strong>Before their first trip alone.</strong><p>A calm habit for the moment they have to decide without you beside them.</p></article>
          <article><small>Friends</small><strong>Before a holiday or long journey.</strong><p>Something practical for the person you naturally look out for.</p></article>
          <article><small>Teams</small><strong>Before work takes them away.</strong><p>Useful decision practice for colleagues travelling beyond familiar routines.</p></article>
        </div>
      </section>

      <section className="k-shell k-section k-home-pressure k-home-centered-section">
        <div className="k-section-head">
          <div>
            <p className="k-kicker">Pressure has patterns</p>
            <h2 className="k-display-sm">Recognise what the message is trying to make you do.</h2>
          </div>
          <p className="k-copy">
            TravelSafe does not ask people to memorise a blacklist. It teaches them to notice the pressure pattern, create decision space, and check the request with someone they trust.
          </p>
        </div>
        <div className="k-principles k-principles-four">
          {principles.map(([no, title, copy]) => (
            <article className="k-principle" key={title}>
              <span>{no}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="k-section-dark k-home-method">
        <div className="k-shell k-home-narrow">
          <div className="k-section-head">
            <div>
              <p className="k-kicker">Two frameworks, one habit</p>
              <h2 className="k-display-sm">Spot the pressure. Then Pause, Ask, Think.</h2>
            </div>
            <p className="k-copy">
              H.A.C.K. names what a scam is doing to you. P.A.T. is what you do about it. Together they turn a stressful moment into a decision you have already rehearsed.
            </p>
          </div>
          <div className="k-method-grid">
            <article><small>H.A.C.K. — spot it</small><h3>Name the pressure.</h3><p>Hurry, Authority, Comfort and Kill-Switch are the four patterns almost every scam uses to rush your decision.</p></article>
            <article><small>P.A.T. — do this</small><h3>Pause. Ask. Think.</h3><p>Stop before the click or payment. Say the request out loud to someone you trust — or your bank on the number from your card. Then think: what would a scam actually need here?</p></article>
            <article><small>Decision practice</small><h3>Rehearse the move.</h3><p>Short scenarios make it concrete: what would you do now, and what would make that next step safer?</p></article>
          </div>
        </div>
      </section>

      <PortfolioStrip
        exclude={["travelsafe"]}
        kicker="Beyond travel"
        heading="The same decision habit, wherever pressure appears."
      />

      <section className="k-shell k-callout k-home-final-cta">
        <div>
          <p className="k-kicker">Start here</p>
          <h2 className="k-display-sm">Practise the decision before the pressure is real.</h2>
        </div>
        <div className="k-actions">
          <Link className="k-button" href="/challenge/travelsafe/start?mode=diagnostic">Try TravelSafe free</Link>
        </div>
      </section>
    </PremiumPage>
  );
}
