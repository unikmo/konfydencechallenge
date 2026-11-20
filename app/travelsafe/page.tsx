import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { PremiumPage } from "@/components/PremiumSiteChrome";
import { PortfolioStrip } from "@/components/PortfolioStrip";

export const metadata: Metadata = {
  title: { absolute: "TravelSafe | Scam-awareness decision practice by Konfydence" },
  description:
    "Practise safer travel decisions through short, realistic scenarios covering payments, identity, messages, bookings and unfamiliar systems.",
  alternates: { canonical: "/travelsafe" },
  openGraph: {
    title: "TravelSafe | Practise safer decisions before you travel",
    description: "Short simulations. Real choices. Immediate feedback.",
    url: "https://konfydence.com/travelsafe",
    siteName: "Konfydence",
    type: "website",
  },
};

const familyUses = [
  {
    label: "Before a first trip alone",
    copy: "A calm habit for the moment they have to decide about a booking, payment or message without you beside them.",
  },
  {
    label: "For older relatives",
    copy: "Impersonation and urgent-payment scams travel too. Short practice makes the pause automatic.",
  },
  {
    label: "As a shared habit",
    copy: "Everyone runs the same free check, so the whole family reaches for Pause, Assess, Talk.",
  },
];

export default function TravelSafePage() {
  return (
    <PremiumPage ctaHref="/challenge/travelsafe/start?mode=diagnostic" ctaLabel="Start free check">
      <section className="k-travel-hero">
        <div className="k-travel-copy">
          <p className="k-breadcrumb">For people · TravelSafe</p>
          <p className="k-kicker">TravelSafe by Konfydence</p>
          <h1 className="k-display">“Your booking needs attention. Right now.”</h1>
          <p className="k-lede">
            You are miles from home. The message looks real. What is your next move?
          </p>
          <div className="k-actions">
            <Link className="k-button" href="/challenge/travelsafe/start?mode=diagnostic">Find out what I would do →</Link>
            <Link className="k-button-quiet" href="/hack-method">Why does the pressure work?</Link>
          </div>
        </div>
        <div className="k-travel-media">
          <Image src="/edition-images/travelsafe.png" alt="TravelSafe luggage, passport and phone safety illustration" fill priority sizes="(max-width: 980px) 100vw, 55vw" style={{ objectPosition: "center" }} />
        </div>
      </section>

      <section id="families" className="k-shell k-section k-home-care">
        <div className="k-home-care-copy">
          <p className="k-kicker">For families</p>
          <h2 className="k-display-sm">A useful kind of care travels with them.</h2>
          <p className="k-copy">
            TravelSafe is decision practice, not a gadget. It gives the people you care about a habit they can carry into the exact moment a booking, payment or message tries to rush them.
          </p>
        </div>
        <div className="k-home-care-grid">
          {familyUses.map((use) => (
            <article key={use.label}>
              <small>Family</small>
              <strong>{use.label}</strong>
              <p>{use.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="k-section-dark">
        <div className="k-shell">
          <div className="k-section-head">
            <div>
              <p className="k-kicker">How TravelSafe works</p>
              <h2 className="k-display-sm">You are up. What is your move?</h2>
            </div>
            <p className="k-copy">
              A booking, a payment request, a surprise deadline. Decide first. Then see what the pressure was trying to change.
            </p>
          </div>
          <div className="k-flow">
            <article><span>01</span><h3>See the moment.</h3><p>Pick a short scenario that fits your world.</p></article>
            <article><span>02</span><h3>Make the call.</h3><p>Make a decision in a realistic situation.</p></article>
            <article><span>03</span><h3>Spot what you missed.</h3><p>See what happened, why and which pressure pattern was active.</p></article>
            <article><span>04</span><h3>Try a better next move.</h3><p>Repeat until Pause, Assess, Talk is the automatic next move.</p></article>
          </div>
        </div>
      </section>

      <section className="k-quote">
        <blockquote>Confidence is not knowing that every message is safe. It is knowing what to verify when the situation matters.</blockquote>
        <cite>Konfydence decision principle</cite>
      </section>

      <p className="k-shell k-copy" style={{ marginTop: 24, marginBottom: 24 }}>Want the rules, prices or privacy details? <Link href="/faq">See the FAQ</Link>.</p>
      <PortfolioStrip exclude={["travelsafe"]} />

      <section className="k-shell k-callout">
        <div>
          <p className="k-kicker">Ready?</p>
          <h2 className="k-display-sm">Think you would spot it? Prove it to yourself.</h2>
        </div>
        <div className="k-actions">
          <Link className="k-button-gold" href="/challenge/travelsafe/start?mode=diagnostic">Start the free check</Link>
        </div>
      </section>
    </PremiumPage>
  );
}
