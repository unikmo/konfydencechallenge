import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { PremiumPage } from "@/components/PremiumSiteChrome";
import { ScamSafetyPack } from "@/components/ScamSafetyPack";

export const metadata: Metadata = {
  title: { absolute: "Konfydence | Confidence under pressure" },
  description:
    "Practise safer decisions before pressure takes over. Scenario-based experiences for travellers, families, students, teams and organisations.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Konfydence | Confidence under pressure",
    description: "Practise the pause before the pressure is real.",
    url: "https://konfydence.com",
    type: "website",
  },
};

const principles = [
  ["01", "Urgency", "Pressure tries to make speed feel more important than verification."],
  ["02", "Authority", "Titles and hierarchy can make a risky request feel unquestionable."],
  ["03", "Familiarity", "Known people, routines and channels can lower healthy skepticism."],
  ["04", "Isolation", "Attackers often try to keep you away from independent verification."],
  ["05", "Impact", "One rushed decision can affect money, identity, access or operations."],
];

export default function HomePage() {
  return (
    <PremiumPage>
      <section className="k-shell k-hero">
        <div>
          <p className="k-kicker">Konfydence</p>
          <h1 className="k-display">Confidence begins before you click.</h1>
          <p className="k-lede">
            Realistic simulations. Better decisions. Safer outcomes for people and organisations.
          </p>
          <div className="k-actions">
            <Link className="k-button" href="/travelsafe">For you</Link>
            <Link className="k-button-quiet" href="/comasy">For organisations</Link>
          </div>
          <div className="k-inline-proof">
            <span><b>Short practice</b> instead of long lectures</span>
            <span><b>Real choices</b> instead of obvious answers</span>
            <span><b>Immediate feedback</b> at the decision point</span>
          </div>
        </div>
        <div className="k-hero-art k-hero-audiences" aria-label="Konfydence experiences for families, schools, universities and workplaces">
          <div className="k-audience-tile"><Image src="/edition-images/family-art.png" alt="Family safety" width={512} height={512} priority /><span>Family</span></div>
          <div className="k-audience-tile"><Image src="/edition-images/school-art.png" alt="School safety" width={512} height={512} priority /><span>School</span></div>
          <div className="k-audience-tile"><Image src="/edition-images/university-art.png" alt="University safety" width={512} height={512} priority /><span>University</span></div>
          <div className="k-audience-tile"><Image src="/edition-images/workplace-art.png" alt="Workplace security" width={512} height={512} priority /><span>Workplace</span></div>
        </div>
      </section>

      <section className="k-shell k-section">
        <div className="k-section-head">
          <div>
            <p className="k-kicker">Human decisions face pressure</p>
            <h2 className="k-display-sm">Stay confident when the situation stops feeling simple.</h2>
          </div>
          <p className="k-copy">
            The story changes, but pressure patterns repeat. Konfydence trains people to recognise the cue, create a pause, verify independently and choose the strongest safe action.
          </p>
        </div>
        <div className="k-principles">
          {principles.map(([no, title, copy]) => (
            <article className="k-principle" key={title}>
              <span>{no}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <ScamSafetyPack source="homepage" />

      <section className="k-section-dark">
        <div className="k-shell">
          <div className="k-section-head">
            <div>
              <p className="k-kicker">The Konfydence method</p>
              <h2 className="k-display-sm">Built for behaviour. Designed for pressure.</h2>
            </div>
            <p className="k-copy">
              The shared method behind consumer experiences and CoMaSy is simple: notice pressure, interrupt the impulse, verify through a known channel, then act.
            </p>
          </div>
          <div className="k-method-grid">
            <article><small>H.A.C.K. framework</small><h3>Recognise the trigger.</h3><p>Hurry, Authority, Comfort and Kill-Switch patterns make pressure easier to name before it drives action.</p></article>
            <article><small>Five-Second Pause</small><h3>Create decision space.</h3><p>A deliberate pause interrupts the risky action chain long enough to ask what should be independently verified.</p></article>
            <article><small>Decision practice</small><h3>Learn by choosing.</h3><p>Short scenarios make the response concrete: what would you do now, and what would make that action safer?</p></article>
          </div>
        </div>
      </section>

      <section className="k-shell k-section">
        <div className="k-section-head">
          <div>
            <p className="k-kicker">Two paths. One purpose.</p>
            <h2 className="k-display-sm">Confidence under pressure.</h2>
          </div>
          <p className="k-copy">Choose the environment that matches the decision you need to practise.</p>
        </div>
        <div className="k-two-paths">
          <article className="k-path k-path-illustration">
            <Image src="/edition-images/family-art.png" alt="Family safety experience illustration" fill sizes="(max-width: 980px) 100vw, 50vw" />
            <div className="k-path-overlay" />
            <div className="k-path-copy">
              <small>For you</small>
              <h3>TravelSafe experiences</h3>
              <p>Practise the moments that happen around travel, family, school and everyday digital life.</p>
              <Link href="/travelsafe">Explore TravelSafe →</Link>
            </div>
          </article>
          <article className="k-path k-path-illustration">
            <Image src="/edition-images/workplace-art.png" alt="Workplace security decision illustration" fill sizes="(max-width: 980px) 100vw, 50vw" />
            <div className="k-path-overlay" />
            <div className="k-path-copy">
              <small>For organisations</small>
              <h3>CoMaSy™ security decision simulation</h3>
              <p>Rehearse realistic security decisions, observe training signals and start with a bounded pilot.</p>
              <Link href="/comasy">Explore CoMaSy →</Link>
            </div>
          </article>
        </div>
      </section>

      <section className="k-shell k-callout">
        <div>
          <p className="k-kicker">Start here</p>
          <h2 className="k-display-sm">Practise the decision before the pressure is real.</h2>
        </div>
        <div className="k-actions">
          <Link className="k-button" href="/challenge/travelsafe/start?mode=diagnostic">Start the free challenge</Link>
        </div>
      </section>
    </PremiumPage>
  );
}
