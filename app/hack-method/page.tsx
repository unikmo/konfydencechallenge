import Link from "next/link";
import type { Metadata } from "next";
import { PremiumPage } from "@/components/PremiumSiteChrome";

export const metadata: Metadata = {
  title: { absolute: "The H.A.C.K. Method | Konfydence" },
  description: "Learn the four pressure patterns behind common scams: Hurry, Authority, Comfort and Kill-Switch — and practise the pause before pressure becomes action.",
  alternates: { canonical: "/hack-method" },
};

const patterns = [
  ["H", "Hurry", "Compress time so you act before you independently verify."],
  ["A", "Authority", "Use status, uniforms, titles or official language to make a request feel unquestionable."],
  ["C", "Comfort", "Use familiarity, trust, routine or emotion to make the request feel safer than the evidence supports."],
  ["K", "Kill-Switch", "Push the critical action — click, pay, share, approve or reply — while cutting off your chance to verify independently."],
];

export default function HackMethodPage() {
  return (
    <PremiumPage>
      <section className="k-shell k-page-hero">
        <p className="k-kicker">The H.A.C.K. method</p>
        <h1 className="k-display">Name the pressure before it chooses for you.</h1>
        <p className="k-lede">H.A.C.K. separates scam pressure into four repeatable patterns so you can recognise what is happening, interrupt the impulse and verify independently.</p>
        <div className="k-actions"><Link className="k-button" href="/challenge/travelsafe/start?mode=diagnostic">Take the free check <span>→</span></Link><Link className="k-button-quiet" href="/challenge">Choose another edition</Link></div>
      </section>

      <section className="k-section-dark">
        <div className="k-shell">
          <div className="k-section-head"><div><p className="k-kicker">Four pressure patterns</p><h2 className="k-display-sm">The story changes. The mechanics repeat.</h2></div><p className="k-copy" style={{color:"#b9b7b1"}}>Once you can name the pressure, it becomes easier to step outside the requester’s channel and choose a stronger verification path.</p></div>
          <div className="k-dark-grid">
            {patterns.map(([letter,title,copy]) => <article className="k-dark-card" key={letter}><span>{letter}</span><h3>{title}</h3><p>{copy}</p></article>)}
          </div>
        </div>
      </section>

      <section className="k-shell k-section">
        <div className="k-section-head"><div><p className="k-kicker">From knowledge to behaviour</p><h2 className="k-display-sm">Knowing the rule is useful. Rehearsal changes the next move.</h2></div><p className="k-copy">Konfydence places these pressure mechanics inside realistic Family, School, University, Workplace and TravelSafe scenarios. Every decision is followed by an explanation and a reusable rule.</p></div>
        <div className="k-statements">
          <article className="k-statement"><span className="k-index">01</span><h3>Notice</h3><p>Identify the pressure cue before the story pulls you forward.</p></article>
          <article className="k-statement"><span className="k-index">02</span><h3>Interrupt</h3><p>Create enough distance to stop the risky action chain.</p></article>
          <article className="k-statement"><span className="k-index">03</span><h3>Verify</h3><p>Use a known, independent channel rather than the incoming request.</p></article>
          <article className="k-statement"><span className="k-index">04</span><h3>Choose</h3><p>Act only after the evidence—not the pressure—supports the move.</p></article>
        </div>
      </section>

      <section className="k-shell k-callout"><div><p className="k-kicker">Practice it</p><h2 className="k-display-sm">A framework becomes useful when you can use it under pressure.</h2></div><div className="k-actions"><Link className="k-button" href="/challenge">Choose a challenge <span>→</span></Link></div></section>
    </PremiumPage>
  );
}
