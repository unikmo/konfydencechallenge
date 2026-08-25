import Link from "next/link";
import Image from "next/image";
import { PremiumPage } from "@/components/PremiumSiteChrome";

const audiences = [
  ["CISO / Security", "Know whether awareness is changing behaviour."],
  ["Compliance & Risk", "Create clearer evidence around awareness activity and effectiveness."],
  ["HR / L&D", "Replace training fatigue with short, relevant practice."],
  ["Security Awareness", "Add behavioural rehearsal to the programme you already run."],
];

export default function ComasyPage() {
  return (
    <PremiumPage ctaHref="/comasy/pilot" ctaLabel="Request pilot">
      <section className="k-shell k-hero">
        <div>
          <p className="k-kicker">CoMaSy™ by Konfydence</p>
          <h1 className="k-display">Measure behaviour under pressure.</h1>
          <p className="k-lede">Give employees realistic social-engineering decisions to practise—and give security, compliance and L&D teams evidence of how behaviour changes over time.</p>
          <div className="k-actions"><Link className="k-button" href="/comasy/pilot">Request a pilot <span>→</span></Link><Link className="k-button-quiet" href="#platform">See how it works</Link></div>
          <div className="k-meta-row"><span><b>Baseline</b> behaviour</span><span><b>Repeat</b> practice</span><span><b>Defined</b> metrics</span><span><b>Evidence</b> for management</span></div>
        </div>
        <div className="k-media"><Image src="/edition-images/workplace.png" alt="Workplace team discussing a security decision" width={1100} height={900} priority sizes="(max-width:980px) 100vw,55vw"/><div className="k-media-overlay"><strong>Completion is activity.</strong><br/>CoMaSy is designed to show whether safer decision behaviour is actually becoming more consistent.</div></div>
      </section>

      <section className="k-section-dark">
        <div className="k-shell">
          <p className="k-kicker">Employee practice → organisational evidence</p>
          <div className="k-section-head"><h2 className="k-display-sm">One decision for the employee. One measurable signal for the organisation.</h2><p className="k-copy" style={{color:"#b9b7b1"}}>Short scenario decisions create behavioural data that can be compared over time rather than another completion percentage.</p></div>
          <div className="k-dark-grid">
            <article className="k-dark-card"><span>Pause adoption</span><h3>Interrupt the chain</h3><p>How often participants stop the higher-risk action before it is completed.</p></article>
            <article className="k-dark-card"><span>Verification</span><h3>Move channels</h3><p>How often participants verify through an independent, known route.</p></article>
            <article className="k-dark-card"><span>Impulse</span><h3>Act immediately</h3><p>How often pressure still produces a higher-risk immediate action.</p></article>
            <article className="k-dark-card"><span>H.A.C.K. profile</span><h3>Find the weak pattern</h3><p>See whether Hurry, Authority, Comfort or Kill‑Switch pressure remains most effective.</p></article>
          </div>
        </div>
      </section>

      <section id="platform" className="k-shell k-section">
        <div className="k-section-head"><div><p className="k-kicker">Practice → measure → improve → evidence</p><h2 className="k-display-sm">Knowing the rule is not the same as applying it.</h2></div><p className="k-copy">CoMaSy complements existing awareness programmes. It adds short decision rehearsal and a behavioural measurement layer rather than another course library.</p></div>
        <div className="k-statements">
          <article className="k-statement"><span className="k-index">01</span><h3>Baseline</h3><p>Establish how the cohort responds today.</p></article>
          <article className="k-statement"><span className="k-index">02</span><h3>Practice</h3><p>Rehearse realistic decisions repeatedly.</p></article>
          <article className="k-statement"><span className="k-index">03</span><h3>Measure</h3><p>See which behaviours and pressure patterns change.</p></article>
          <article className="k-statement"><span className="k-index">04</span><h3>Evidence</h3><p>Turn activity into management-ready reporting.</p></article>
        </div>
      </section>

      <section className="k-shell k-section-tight">
        <div className="k-section-head"><div><p className="k-kicker">Who it serves</p><h2 className="k-display-sm">One behavioural layer. Different organisational questions.</h2></div><p className="k-copy">The same participant decisions can answer different questions for security, compliance, risk and learning teams.</p></div>
        <div className="k-editions">
          {audiences.map(([name,copy]) => <article className="k-edition" key={name}><small>CoMaSy stakeholder</small><h3>{name}</h3><p>{copy}</p><span>Behavioural evidence, not another content library.</span></article>)}
        </div>
      </section>

      <section className="k-section-dark">
        <div className="k-shell k-section-head" style={{marginBottom:0}}>
          <div><p className="k-kicker">NIS2 use case</p><h2 className="k-display-sm">Support the human side of cybersecurity awareness and effectiveness evidence.</h2></div>
          <div><p className="k-copy" style={{color:"#b9b7b1"}}>CoMaSy is designed to support repeated awareness activity, defined effectiveness indicators and records of participation and behavioural change. It does not by itself establish regulatory compliance.</p><div className="k-actions"><Link className="k-button-dark" href="/comasy/pilot">Request a CoMaSy pilot <span>→</span></Link><Link className="k-button-quiet" style={{color:"#fff",borderColor:"rgba(255,255,255,.24)"}} href="/comasy/dashboard/login">Customer login</Link></div></div>
        </div>
      </section>
    </PremiumPage>
  );
}
