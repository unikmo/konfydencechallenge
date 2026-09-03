import Link from "next/link";
import type { Metadata } from "next";
import { PremiumPage } from "@/components/PremiumSiteChrome";

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

const principles = [
  ["01", "Observable", "Metrics are tied to specific participant choices, not inferred personality traits."],
  ["02", "Defined", "Every metric has a written definition that can be applied consistently across scenario variants."],
  ["03", "Comparative", "Baseline and post-variant results are compared within a defined cohort and use case."],
  ["04", "Bounded", "Results are training evidence. They do not establish individual security competence or regulatory compliance."],
];

const flow = [
  ["Baseline", "Run a defined scenario set before targeted practice."],
  ["Targeted practice", "Rehearse the relevant pressure patterns and business workflows."],
  ["Post variant", "Use unseen or materially varied scenarios so simple answer recall does not masquerade as improvement."],
  ["Review", "Compare cohort signals, discuss limitations and decide scale / adapt / stop."],
];

export default function MethodologyPage() {
  return (
    <PremiumPage ctaHref="/comasy/pilot" ctaLabel="Request a pilot">
      <section className="kg-shell kc-hero">
        <p className="k-kicker">Methodology</p>
        <h1>Measure the decision process, not just course completion.</h1>
        <p>
          CoMaSy turns scenario choices into defined training signals. The purpose is to make behavioural
          practice observable without pretending that a simulation score is a guarantee of real-world security performance.
        </p>
      </section>

      <section className="kg-shell">
        <div className="kc-pillars">
          {principles.map(([no, title, copy]) => (
            <article key={title}><b>{no}</b><h3>{title}</h3><p>{copy}</p></article>
          ))}
        </div>
      </section>

      <section className="kg-shell k-section">
        <div className="k-section-head">
          <div>
            <p className="k-kicker">Core signals</p>
            <h2 className="k-display-sm">What the dashboard is designed to show.</h2>
          </div>
        </div>
        <div className="kc-cards">
          {metrics.map(([name, definition, observed]) => (
            <article key={name}>
              <h3>{name}</h3>
              <p>{definition}</p>
              <span className="kc-obs">Observed from</span>
              <p>{observed}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="k-section-dark">
        <div className="kg-shell kc-split">
          <div>
            <p className="k-kicker">Pilot measurement flow</p>
            <h2 className="k-display-sm">Baseline → practice → unseen variant → review.</h2>
          </div>
          <ol className="kc-flow">
            {flow.map(([step, copy]) => (
              <li key={step}><b>{step}</b><span>{copy}</span></li>
            ))}
          </ol>
        </div>
      </section>

      <section className="kg-shell k-section">
        <div className="k-section-head">
          <div>
            <p className="k-kicker">Interpretation guardrails</p>
            <h2 className="k-display-sm">What CoMaSy can support — and what it does not claim.</h2>
          </div>
        </div>
        <div className="kc-split-2">
          <div>
            <h3 style={{ fontFamily: "var(--k-display)", fontWeight: 400, fontSize: 22, margin: "0 0 8px" }}>What CoMaSy can support</h3>
            <ul className="kc-list">
              <li>Repeated decision rehearsal</li>
              <li>Defined behavioural training signals</li>
              <li>Cohort-level comparison over time</li>
              <li>Pressure-pattern diagnostics</li>
              <li>Management-ready evidence from the pilot</li>
            </ul>
          </div>
          <div>
            <h3 style={{ fontFamily: "var(--k-display)", fontWeight: 400, fontSize: 22, margin: "0 0 8px" }}>What CoMaSy does not claim</h3>
            <ul className="kc-list">
              <li>A guarantee that an employee will avoid a real attack</li>
              <li>A clinical or psychometric assessment</li>
              <li>A substitute for incident response, technical controls or policy</li>
              <li>Proof of regulatory compliance by itself</li>
              <li>A verified customer improvement percentage unless a real pilot produced it</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="kg-shell k-callout">
        <div>
          <p className="k-kicker">Next step</p>
          <h2 className="k-display-sm">Test the methodology with a bounded pilot.</h2>
          <p className="k-copy">Agree the cohort, risk focus, scenario set and decision criteria before scaling.</p>
        </div>
        <div className="k-actions">
          <Link className="k-button" href="/comasy/pilot">Request a pilot</Link>
        </div>
      </section>
    </PremiumPage>
  );
}
