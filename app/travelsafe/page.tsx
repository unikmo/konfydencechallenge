import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { PremiumPage } from "@/components/PremiumSiteChrome";

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

const experiences = [
  {
    label: "Family edition",
    title: "Protect what matters most",
    copy: "Learn together. Build stronger habits around money requests, impersonation and shared devices.",
    image: "/edition-images/family.png",
    href: "/challenge/family/start?mode=diagnostic",
  },
  {
    label: "School edition",
    title: "Safer students. Stronger schools",
    copy: "Age-appropriate practice for gaming, messages, account takeovers and social pressure.",
    image: "/edition-images/school.png",
    href: "/challenge/school/start?mode=diagnostic",
  },
  {
    label: "University edition",
    title: "Independence with confidence",
    copy: "Practise decisions around housing, jobs, tuition, identity and unfamiliar systems.",
    image: "/edition-images/university.png",
    href: "/challenge/university/start?mode=diagnostic",
  },
];

export default function TravelSafePage() {
  return (
    <PremiumPage ctaHref="/challenge/travelsafe/start?mode=diagnostic" ctaLabel="Start free check">
      <section className="k-travel-hero">
        <div className="k-travel-copy">
          <p className="k-breadcrumb">For people · TravelSafe</p>
          <p className="k-kicker">TravelSafe by Konfydence</p>
          <h1 className="k-display">Practise safer decisions before the trip makes them real.</h1>
          <p className="k-lede">
            Short, realistic scenarios help you build the habit to pause, verify and choose well when unfamiliar systems and time pressure collide.
          </p>
          <div className="k-actions">
            <Link className="k-button" href="/challenge/travelsafe/start?mode=diagnostic">Start the free TravelSafe check</Link>
            <Link className="k-button-quiet" href="/hack-method">How the method works</Link>
          </div>
        </div>
        <div className="k-travel-media">
          <Image src="/edition-images/travelsafe-hero.png" alt="Traveller reviewing a phone while in transit" fill priority sizes="(max-width: 980px) 100vw, 55vw" />
        </div>
      </section>

      <section className="k-shell k-section">
        <div className="k-section-head">
          <div>
            <p className="k-kicker">Real-life situations. Safer decisions.</p>
            <h2 className="k-display-sm">The story changes. The decision habit stays useful.</h2>
          </div>
          <p className="k-copy">
            TravelSafe focuses on the moments where unfamiliarity, urgency and trust can combine: bookings, payment changes, account access, identity requests and messages that look legitimate.
          </p>
        </div>
        <div className="k-travel-cards">
          {experiences.map((experience) => (
            <article className="k-travel-card" key={experience.title}>
              <Image src={experience.image} alt="" width={760} height={520} sizes="(max-width: 980px) 100vw, 33vw" />
              <div>
                <small>{experience.label}</small>
                <h3>{experience.title}</h3>
                <p>{experience.copy}</p>
                <Link href={experience.href}>Start experience →</Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="k-section-dark">
        <div className="k-shell">
          <div className="k-section-head">
            <div>
              <p className="k-kicker">How TravelSafe works</p>
              <h2 className="k-display-sm">Choose. Experience. Learn. Improve.</h2>
            </div>
            <p className="k-copy">
              You are not asked to memorise a checklist. You make a decision, see what the situation was testing and learn the safer rule behind it.
            </p>
          </div>
          <div className="k-flow">
            <article><span>01</span><h3>Choose</h3><p>Pick a short scenario that fits your world.</p></article>
            <article><span>02</span><h3>Experience</h3><p>Make a decision in a realistic situation.</p></article>
            <article><span>03</span><h3>Learn</h3><p>See what happened, why and which pressure pattern was active.</p></article>
            <article><span>04</span><h3>Improve</h3><p>Build the pause-and-verify habit through repeated practice.</p></article>
          </div>
        </div>
      </section>

      <section className="k-quote">
        <blockquote>Confidence is not knowing that every message is safe. It is knowing what to verify when the situation matters.</blockquote>
        <cite>Konfydence decision principle</cite>
      </section>

      <section className="k-shell k-callout">
        <div>
          <p className="k-kicker">Ready?</p>
          <h2 className="k-display-sm">Three minutes now. A stronger instinct later.</h2>
        </div>
        <div className="k-actions">
          <Link className="k-button-gold" href="/challenge/travelsafe/start?mode=diagnostic">Start the free check</Link>
        </div>
      </section>
    </PremiumPage>
  );
}
