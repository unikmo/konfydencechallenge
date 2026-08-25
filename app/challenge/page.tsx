import type { Metadata } from "next";
import Link from "next/link";
import { PremiumPage } from "@/components/PremiumSiteChrome";

export const metadata: Metadata = {
  title: "Choose Your Konfydence Challenge",
  description: "Choose the pressure test that matches your real life. Eight free scenarios reveal which scam pressure pattern is most likely to move you.",
  alternates: { canonical: "/challenge" },
};

const editions = [
  ["01", "TravelSafe", "On the move", "Bookings, transport, Wi‑Fi, payment, accommodation and urgent travel problems where verification is harder.", "/challenge/travelsafe/start?mode=diagnostic"],
  ["02", "Family", "Home & family", "Bank alerts, deliveries, relatives, marketplace messages and everyday requests that exploit familiarity.", "/challenge/family/start?mode=diagnostic"],
  ["03", "School", "Students", "Gaming, social accounts, fake giveaways, school messages and pressure that targets younger decision-makers.", "/challenge/school/start?mode=diagnostic"],
  ["04", "University", "Campus life", "Housing, student jobs, account access, ticketing, payments and scams built around independence and urgency.", "/challenge/university/start?mode=diagnostic"],
  ["05", "Workplace", "Professional", "Executive impersonation, invoice changes, HR requests, credentials and authority pressure inside real workflows.", "/challenge/workplace/start?mode=diagnostic"],
];

export default function ChallengeLanding() {
  return (
    <PremiumPage ctaHref="/challenge/travelsafe/start?mode=diagnostic" ctaLabel="Start free">
      <section className="k-shell k-page-hero">
        <p className="k-kicker">Free scam-pressure diagnostic</p>
        <h1 className="k-display">Scams test what you do under pressure.</h1>
        <p className="k-lede">Choose the version closest to your real life. Eight decisions reveal which H.A.C.K. pressure pattern changes your behaviour most—and what to practise next.</p>
        <div className="k-meta-row"><span><b>8</b> scenarios</span><span><b>~4 minutes</b></span><span><b>No account</b> for round one</span><span><b>Immediate</b> H.A.C.K. profile</span></div>
      </section>

      <section className="k-shell k-section-tight">
        <div className="k-section-head">
          <div><p className="k-kicker">Choose your pressure test</p><h2 className="k-display-sm">Where are you most likely to be targeted?</h2></div>
          <p className="k-copy">Each edition draws from its own scenario bank. The free check is balanced across Hurry, Authority, Comfort and Kill‑Switch pressure.</p>
        </div>
        <div className="k-editions">
          {editions.map(([no,title,audience,copy,href]) => <Link className="k-edition" href={href} key={title}><small>{no} · {audience}</small><h3>{title}</h3><p>{copy}</p><span>Start free check →</span></Link>)}
        </div>
      </section>

      <section className="k-section-dark">
        <div className="k-shell">
          <p className="k-kicker">What the result measures</p>
          <div className="k-section-head"><h2 className="k-display-sm">Your H.A.C.K. pressure profile.</h2><p className="k-copy" style={{color:"#b9b7b1"}}>Not a personality label. A practical signal showing which kind of pressure most changes your decisions.</p></div>
          <div className="k-dark-grid">
            <article className="k-dark-card"><span>H</span><h3>Hurry</h3><p>Can urgency make you act before you verify?</p></article>
            <article className="k-dark-card"><span>A</span><h3>Authority</h3><p>Do official-looking people or institutions get a shortcut to trust?</p></article>
            <article className="k-dark-card"><span>C</span><h3>Comfort</h3><p>Does familiarity lower your guard before the evidence is checked?</p></article>
            <article className="k-dark-card"><span>K</span><h3>Kill‑Switch</h3><p>Can you stop at the critical action moment and verify independently?</p></article>
          </div>
        </div>
      </section>

      <section className="k-shell k-callout">
        <div><p className="k-kicker">Start without studying</p><h2 className="k-display-sm">Make the decisions you would make today.</h2><p className="k-copy">Then use the result to train the reflex that needs work.</p></div>
        <div className="k-actions"><Link className="k-button" href="/challenge/travelsafe/start?mode=diagnostic">Start TravelSafe <span>→</span></Link></div>
      </section>
    </PremiumPage>
  );
}
