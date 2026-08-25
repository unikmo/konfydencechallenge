import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "CoMaSy Methodology | Behavioural Security Metrics" },
  description:
    "How CoMaSy defines and interprets Pause Adoption, Verification Rate, Impulse Rate and H.A.C.K. pressure-pattern signals.",
  alternates: { canonical: "/comasy/methodology" },
};

const metrics = [
  ["Pause Adoption", "The participant interrupts the immediate action chain before committing to a consequential step.", "Whether the chosen response explicitly creates time or space to assess the request before acting."],
  ["Verification Rate", "The participant verifies through an independent, known channel rather than relying on the channel that delivered the request.", "Whether the selected response uses a separate trusted source, process or contact path."],
  ["Impulse Rate", "The participant chooses an immediate higher-risk action without sufficient independent verification.", "Whether the selected response commits the requested action, credential, payment, approval or disclosure too early."],
  ["H.A.C.K. Profile", "The pattern of responses across Hurry, Authority, Comfort and Kill-Switch pressure mechanics.", "Which pressure mechanism repeatedly produces weaker decisions across the scenario set."],
];

export default function MethodologyPage() {
  return (
    <main className="page">
      <header><Link href="/comasy" className="brand">KONFYDENCE <span>/ CoMaSy</span></Link><nav><Link href="/comasy">Platform</Link><Link href="/comasy/security">Security & Privacy</Link><Link href="/comasy/pilot">Pilot</Link></nav></header>

      <section className="hero">
        <p className="eye">METHODOLOGY</p>
        <h1>Measure the decision process, not just course completion.</h1>
        <p>CoMaSy turns scenario choices into defined training signals. The purpose is to make behavioural practice observable without pretending that a simulation score is a guarantee of real-world security performance.</p>
      </section>

      <section className="principles">
        <article><b>01</b><h2>Observable</h2><p>Metrics are tied to specific participant choices, not inferred personality traits.</p></article>
        <article><b>02</b><h2>Defined</h2><p>Every metric has a written definition that can be applied consistently across scenario variants.</p></article>
        <article><b>03</b><h2>Comparative</h2><p>Baseline and post-variant results are compared within a defined cohort and use case.</p></article>
        <article><b>04</b><h2>Bounded</h2><p>Results are training evidence. They do not establish individual security competence or regulatory compliance.</p></article>
      </section>

      <section className="section">
        <p className="eye dark">CORE SIGNALS</p>
        <h2>What the dashboard is designed to show.</h2>
        <div className="metricGrid">
          {metrics.map(([name, definition, observed]) => <article key={name}><h3>{name}</h3><p>{definition}</p><span>Observed from</span><p>{observed}</p></article>)}
        </div>
      </section>

      <section className="flow">
        <div><p className="eye">PILOT MEASUREMENT FLOW</p><h2>Baseline → practice → unseen variant → review.</h2></div>
        <ol>
          <li><b>Baseline</b><span>Run a defined scenario set before targeted practice.</span></li>
          <li><b>Targeted practice</b><span>Rehearse the relevant pressure patterns and business workflows.</span></li>
          <li><b>Post variant</b><span>Use unseen or materially varied scenarios so simple answer recall does not masquerade as improvement.</span></li>
          <li><b>Review</b><span>Compare cohort signals, discuss limitations and decide scale / adapt / stop.</span></li>
        </ol>
      </section>

      <section className="section guardrails">
        <p className="eye dark">INTERPRETATION GUARDRAILS</p>
        <div className="twoCol">
          <div><h2>What CoMaSy can support</h2><ul><li>Repeated decision rehearsal</li><li>Defined behavioural training signals</li><li>Cohort-level comparison over time</li><li>Pressure-pattern diagnostics</li><li>Management-ready evidence from the pilot</li></ul></div>
          <div><h2>What CoMaSy does not claim</h2><ul><li>A guarantee that an employee will avoid a real attack</li><li>A clinical or psychometric assessment</li><li>A substitute for incident response, technical controls or policy</li><li>Proof of regulatory compliance by itself</li><li>A verified customer improvement percentage unless a real pilot produced it</li></ul></div>
        </div>
      </section>

      <section className="cta"><div><p className="eye dark">NEXT STEP</p><h2>Test the methodology with a bounded pilot.</h2><p>Agree the cohort, risk focus, scenario set and decision criteria before scaling.</p></div><Link href="/comasy/pilot">Request a Pilot →</Link></section>

      <footer><Link href="/comasy">CoMaSy</Link><Link href="/comasy/security">Security & Privacy</Link><Link href="/privacy-policy">Privacy</Link><Link href="/imprint">Imprint</Link></footer>

      <style>{`
        :global(*){box-sizing:border-box}:global(body){margin:0;background:#f3f1eb;color:#071726}.page{font-family:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif}.page a:focus-visible{outline:3px solid #b8ff3d;outline-offset:4px}header{min-height:72px;background:#071d31;color:white;display:flex;align-items:center;justify-content:space-between;gap:24px;padding:12px max(20px,calc((100vw - 1120px)/2));border-bottom:1px solid #ffffff1c}.brand{color:white;text-decoration:none;font-size:13px;font-weight:950}.brand span{color:#b8ff3d}header nav{display:flex;gap:20px}header nav a{color:#c3d0d8;text-decoration:none;font-size:12px;font-weight:800}.hero{background:linear-gradient(135deg,#0c3455,#071d31 72%);color:white;padding:100px max(20px,calc((100vw - 980px)/2))}.eye{font-size:11px;letter-spacing:.14em;font-weight:950;color:#b8ff3d;margin:0 0 16px}.eye.dark{color:#d54d44}.hero h1,.section>h2,.flow h2,.guardrails h2,.cta h2{font:500 clamp(44px,5.5vw,72px)/.98 Georgia,serif;letter-spacing:-.045em;margin:0}.hero>p:last-child{font-size:16px;line-height:1.72;color:#c1d0d9;max-width:760px;margin:25px 0 0}.principles{max-width:1120px;margin:auto;display:grid;grid-template-columns:repeat(4,1fr);padding:72px 20px}.principles article{padding:0 24px;border-right:1px solid #cad4d8}.principles article:first-child{padding-left:0}.principles article:last-child{border-right:0}.principles b{color:#d54d44;font-size:11px}.principles h2{font:500 29px Georgia,serif;margin:30px 0 10px}.principles p{font-size:13px;line-height:1.6;color:#687b85}.section{max-width:1120px;margin:auto;padding:90px 20px}.section>h2{max-width:760px;font-size:clamp(42px,4.8vw,62px)}.metricGrid{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:46px}.metricGrid article{border:1px solid #d2dbde;border-radius:17px;padding:25px;background:#fbfaf6}.metricGrid h3{font:500 29px Georgia,serif;margin:0 0 12px}.metricGrid p{font-size:13px;line-height:1.62;color:#647782}.metricGrid span{display:block;margin-top:22px;font-size:10px;letter-spacing:.08em;color:#d54d44;font-weight:950;text-transform:uppercase}.flow{background:#071d31;color:white;padding:90px max(20px,calc((100vw - 1120px)/2));display:grid;grid-template-columns:.9fr 1.1fr;gap:70px}.flow h2{font-size:clamp(40px,4.6vw,60px)}.flow ol{list-style:none;padding:0;margin:0}.flow li{display:grid;grid-template-columns:145px 1fr;gap:18px;padding:18px 0;border-top:1px solid #ffffff1c}.flow li:last-child{border-bottom:1px solid #ffffff1c}.flow b{font-size:13px;color:#b8ff3d}.flow span{font-size:13px;line-height:1.6;color:#b3c4ce}.twoCol{display:grid;grid-template-columns:1fr 1fr;gap:60px}.guardrails h2{font-size:42px}.guardrails ul{padding-left:20px}.guardrails li{font-size:14px;line-height:1.65;color:#647782;margin:8px 0}.cta{max-width:1120px;margin:0 auto 90px;background:#e6ebe7;border:1px solid #c9d3cf;border-radius:24px;padding:44px;display:flex;align-items:end;justify-content:space-between;gap:40px}.cta h2{font-size:48px;max-width:700px}.cta p:not(.eye){font-size:14px;color:#637680}.cta>a{background:#071d31;color:white;text-decoration:none;border-radius:999px;padding:14px 18px;font-size:13px;font-weight:950;white-space:nowrap}footer{background:#061624;color:#9aadb8;padding:28px max(20px,calc((100vw - 1120px)/2));display:flex;gap:20px;flex-wrap:wrap}footer a{color:#a8bac4;text-decoration:none;font-size:11px}@media(max-width:820px){header nav{display:none}.principles,.metricGrid,.flow,.twoCol{grid-template-columns:1fr}.principles article{border-right:0;border-bottom:1px solid #cad4d8;padding:24px 0}.flow{gap:40px}.cta{margin-left:20px;margin-right:20px;flex-direction:column;align-items:flex-start}}@media(max-width:520px){.hero{padding:70px 20px}.hero h1{font-size:46px}.section{padding:70px 20px}.flow{padding:70px 20px}.flow li{grid-template-columns:1fr}.cta{padding:28px}.cta h2{font-size:40px}}
      `}</style>
    </main>
  );
}
