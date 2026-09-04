import type { Metadata } from "next";
import Link from "next/link";
import { PremiumPage } from "@/components/PremiumSiteChrome";
import { PortfolioStrip } from "@/components/PortfolioStrip";

export const metadata: Metadata = {
  title: "Choose Your Konfydence Challenge",
  description: "Choose the pressure test that matches your real life. Eight free scenarios reveal which scam pressure pattern is most likely to move you.",
  alternates: { canonical: "/challenge" },
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
          Choose the version closest to your real life. You will face 8 decisions — two for each H.A.C.K. pressure pattern — and get a personal readiness profile at the end.
        </p>
        <div className="kg-promise">
          <span>8 scenarios</span><span>About 4 minutes</span><span>No account for round one</span><span>Immediate H.A.C.K. profile</span>
        </div>
      </section>

      <section className="k-shell k-section" aria-labelledby="choose-edition">
        <div className="k-section-head">
          <div>
            <p className="k-kicker">Choose your pressure test</p>
            <h2 id="choose-edition" className="k-display-sm">Where are you most likely to be targeted?</h2>
          </div>
          <p className="k-copy">
            Each edition draws from its own 40-scenario bank. The free check is deliberately balanced across Hurry, Authority, Comfort and Kill-Switch; the full challenge runs 24 scored scenarios, six per pattern.
          </p>
        </div>
        <div className="kg-edition-grid">
          {editions.map((edition, index) => (
            <article className="kg-edition" key={edition.key}>
              <div className="kg-edition-top"><span>{edition.eyebrow}</span><b>0{index + 1}</b></div>
              <h3>{edition.title}</h3>
              <p>{edition.copy}</p>
              <small>{edition.signal}</small>
              <Link href={`/challenge/${edition.key}/start?mode=diagnostic`}>Start free check <span aria-hidden="true">→</span></Link>
            </article>
          ))}
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
