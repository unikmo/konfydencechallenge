import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { PremiumPage } from "@/components/PremiumSiteChrome";

export const metadata: Metadata = {
  title: { absolute: "Konfydence | Confidence under pressure" },
  description: "Practise safer decisions before pressure takes over. Scenario-based scam-readiness experiences for travel, families, students, teams and organisations.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Konfydence | Confidence under pressure",
    description: "Practise the pause before the pressure is real.",
    url: "https://konfydence.com",
    type: "website",
  },
};

const editions = [
  ["01", "TravelSafe", "Travel", "Flights, hotels, payments, identity and the unfamiliar systems that make travel a perfect pressure environment.", "/challenge/travelsafe/start?mode=diagnostic"],
  ["02", "Family", "Households", "Money requests, impersonation, shared devices and emotional pressure around people you trust.", "/challenge/family/start?mode=diagnostic"],
  ["03", "School", "Ages 12–18", "Gaming, group chats, fake links, account takeovers and social pressure without classroom-style lecturing.", "/challenge/school/start?mode=diagnostic"],
  ["04", "University", "Students", "Housing, jobs, tuition, identity and international-student pressure in unfamiliar systems.", "/challenge/university/start?mode=diagnostic"],
  ["05", "Workplace", "Teams", "Invoices, payroll changes, executive pressure, phishing and sensitive-data requests.", "/challenge/workplace/start?mode=diagnostic"],
];

export default function HomePage() {
  return (
    <PremiumPage>
      <section className="k-shell k-hero">
        <div>
          <p className="k-kicker">Konfydence</p>
          <h1 className="k-display">Confidence begins before you click.</h1>
          <p className="k-lede">Train the instinct to pause, verify and choose well when urgency, authority or familiarity compresses your judgment.</p>
          <div className="k-actions">
            <Link className="k-button" href="/challenge/travelsafe/start?mode=diagnostic">Experience the free challenge <span>→</span></Link>
            <Link className="k-button-quiet" href="/hack-method">Explore the method</Link>
          </div>
          <div className="k-meta-row"><span><b>No signup</b> for the readiness check</span><span><b>~3 minutes</b> to complete</span><span><b>Immediate</b> pressure-pattern result</span></div>
        </div>
        <div className="k-media">
          <Image src="/hero/konfydence-travelsafe-vacation.jpg" alt="Traveler reviewing an urgent payment message on a phone" width={1200} height={900} priority sizes="(max-width: 980px) 100vw, 55vw" />
          <div className="k-media-overlay"><strong>The moment matters.</strong><br/>Scams rarely arrive when you have time, certainty and perfect information. Konfydence trains the decision before the real pressure appears.</div>
        </div>
      </section>

      <section className="k-section-dark">
        <div className="k-shell">
          <p className="k-kicker">The H.A.C.K. pressure model</p>
          <div className="k-section-head">
            <h2 className="k-display-sm">Four patterns. Thousands of situations. One stronger response.</h2>
            <p className="k-copy" style={{color:"#b9b7b1"}}>Pressure changes the story, not the mechanics. Learn to recognise the cue, interrupt the impulse and verify independently before you act.</p>
          </div>
          <div className="k-dark-grid">
            <article className="k-dark-card"><span>H</span><h3>Hurry</h3><p>Artificial urgency pushes you to act before you verify.</p></article>
            <article className="k-dark-card"><span>A</span><h3>Authority</h3><p>Titles, uniforms and hierarchy make the request feel unquestionable.</p></article>
            <article className="k-dark-card"><span>C</span><h3><b>Comfort</b></h3><p>Familiar names, channels and routines lower suspicion.</p></article>
            <article className="k-dark-card"><span>K</span><h3>Kill‑Switch</h3><p>The critical action moment: click, pay, share, approve or reply before you independently verify.</p></article>
          </div>
        </div>
      </section>

      <section className="k-shell k-section">
        <div className="k-section-head">
          <div><p className="k-kicker">The Konfydence method</p><h2 className="k-display-sm">Train the moment judgment gets compressed.</h2></div>
          <p className="k-copy">Not another lecture about scams. Konfydence puts credible choices in front of you and trains the quality of the action you choose.</p>
        </div>
        <div className="k-statements">
          <article className="k-statement"><span className="k-index">01</span><h3>Recognise</h3><p>Notice the pressure cue before you get absorbed by the story around it.</p></article>
          <article className="k-statement"><span className="k-index">02</span><h3>Pause</h3><p>Create enough time and distance to stop the risky action chain.</p></article>
          <article className="k-statement"><span className="k-index">03</span><h3>Verify</h3><p>Move to a known, independent channel instead of trusting the incoming request.</p></article>
          <article className="k-statement"><span className="k-index">04</span><h3>Choose</h3><p>Take the strongest safe action, not merely the least uncomfortable one.</p></article>
        </div>
      </section>

      <section className="k-shell k-section">
        <div className="k-feature">
          <div className="k-feature-media"><Image src="/challenge-editions/travelsafe.png" alt="TravelSafe edition" width={960} height={960} sizes="(max-width: 980px) 100vw, 50vw" /></div>
          <div className="k-feature-copy">
            <p className="k-kicker">Flagship experience · TravelSafe</p>
            <h2 className="k-display-sm">Travel creates exactly the conditions scammers need.</h2>
            <p className="k-lede">Unfamiliar systems. Roaming phones. Airport stress. Hotel messages. Payments away from home. Practise the decision before the trip makes it real.</p>
            <ul><li>Flights, refunds and loyalty accounts</li><li>Hotels, taxis, QR codes and public Wi‑Fi</li><li>Payments, identity documents and border pressure</li></ul>
            <div className="k-actions"><Link className="k-button" href="/challenge/travelsafe/start?mode=diagnostic">Take the free TravelSafe check <span>→</span></Link><Link className="k-button-quiet" href="/countries">Explore travel intelligence</Link></div>
          </div>
        </div>
      </section>

      <section className="k-shell k-section">
        <div className="k-section-head">
          <div><p className="k-kicker">Experiences</p><h2 className="k-display-sm">The story changes. The pressure mechanics repeat.</h2></div>
          <p className="k-copy">Choose the environment where you want safer decisions to become more automatic.</p>
        </div>
        <div className="k-editions">
          {editions.map(([no,title,audience,copy,href]) => <Link className="k-edition" href={href} key={title}><small>{no} · {audience}</small><h3>{title}</h3><p>{copy}</p><span>Start readiness check →</span></Link>)}
        </div>
      </section>

      <section className="k-section-dark">
        <div className="k-shell k-feature">
          <div className="k-feature-copy">
            <p className="k-kicker">For organisations · CoMaSy™</p>
            <h2 className="k-display-sm">Awareness is not the same as readiness.</h2>
            <p className="k-lede" style={{color:"#c7c5c0"}}>Give employees realistic decisions to rehearse, then measure how pause, verification and impulse behaviour changes over time.</p>
            <div className="k-actions"><Link className="k-button-dark" href="/comasy">Explore CoMaSy <span>→</span></Link><Link className="k-button-quiet" style={{color:"#fff",borderColor:"rgba(255,255,255,.24)"}} href="/comasy/pilot">Request a pilot</Link></div>
          </div>
          <div className="k-feature-media"><Image src="/edition-images/workplace.png" alt="Workplace team discussing a security decision" width={1000} height={900} sizes="(max-width: 980px) 100vw, 50vw" /></div>
        </div>
      </section>

      <section className="k-shell k-callout">
        <div><p className="k-kicker">Start here</p><h2 className="k-display-sm">Three minutes now. A better instinct when it matters.</h2></div>
        <div className="k-actions"><Link className="k-button" href="/challenge/travelsafe/start?mode=diagnostic">Start free challenge <span>→</span></Link></div>
      </section>
    </PremiumPage>
  );
}
