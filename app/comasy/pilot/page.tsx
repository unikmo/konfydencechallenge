import Link from "next/link";
import type { Metadata } from "next";
import { PremiumPage } from "@/components/PremiumSiteChrome";

export const metadata: Metadata = {
  title: { absolute: "Request a CoMaSy Security Decision Simulation Pilot" },
  description:
    "Run a defined CoMaSy pilot with a selected cohort, baseline, targeted decision practice, post-variant measurement and an executive scale / adapt / stop review.",
  alternates: { canonical: "/comasy/pilot" },
};

const roles = ["CISO / Security Leadership", "Security Awareness", "Compliance", "Risk", "HR", "L&D", "IT", "Management", "Other"];
const sizes = ["<250", "250–999", "1,000–4,999", "5,000–9,999", "10,000+"];
const objectives = ["Improve security awareness", "Measure behaviour", "NIS2", "Management training", "Phishing / social engineering", "Compliance evidence", "Evaluate CoMaSy", "Other"];

const proof = [
  ["What we establish", "Baseline", "How the selected cohort responds before targeted practice."],
  ["What employees experience", "Practice", "Short, realistic social-engineering decisions rather than another long course."],
  ["What we compare", "Change", "Defined decision signals across baseline and materially varied post scenarios."],
  ["What leadership receives", "Evidence", "A review of what changed, what did not and whether scale is justified."],
];

export default async function PilotPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const q = await searchParams;
  return (
    <PremiumPage ctaHref="/comasy" ctaLabel="See CoMaSy">
      <section className="kg-shell kc-pilot">
        <div className="kc-pilot-intro">
          <p className="k-kicker">CoMaSy pilot</p>
          <h1 className="k-display" style={{ fontSize: "clamp(38px,5vw,66px)" }}>
            Test decision simulation inside your organisation before scaling it.
          </h1>
          <p className="k-lede">
            Start with a defined cohort, a defined risk focus and a defined decision point. The pilot is designed to
            work alongside your existing awareness programme — not force a platform replacement.
          </p>
          <div className="kg-promise">
            <span>Bounded scope</span><span>No LMS replacement</span><span>Defined measurement</span><span>Scale / adapt / stop review</span>
          </div>
          <ol className="kc-flow">
            <li><b>01 · Cohort</b><span>Agree the cohort and risk focus.</span></li>
            <li><b>02 · Baseline</b><span>Establish how the cohort decides today.</span></li>
            <li><b>03 · Practice</b><span>Targeted decision rehearsal.</span></li>
            <li><b>04 · Post variant</b><span>Materially varied scenarios and review.</span></li>
            <li><b>05 · Decision</b><span>Scale, adapt or stop.</span></li>
          </ol>
        </div>

        <form className="kc-form" action="/api/comasy/pilot" method="post">
          <p className="k-kicker">Request a pilot</p>
          <h2 className="k-display-sm" style={{ fontSize: "28px", margin: "0 0 10px" }}>Tell us what you need to learn.</h2>
          <p className="kc-form-intro">
            This is a qualification request, not a commitment to purchase. We use the information to understand the use
            case and propose an appropriate pilot scope.
          </p>
          {q.error && (
            <div className="kc-form-error">
              {q.error === "rate" ? "Too many requests. Please try again shortly." : "Please complete the required fields using a valid work email."}
            </div>
          )}
          <div className="kc-form-row">
            <label>First name<input name="firstName" autoComplete="given-name" required /></label>
            <label>Last name<input name="lastName" autoComplete="family-name" required /></label>
          </div>
          <label>Work email<input name="workEmail" type="email" autoComplete="email" required /></label>
          <label>Organisation<input name="organization" autoComplete="organization" required /></label>
          <div className="kc-form-row">
            <label>Role<select name="role" required><option value="">Select…</option>{roles.map((x) => <option key={x}>{x}</option>)}</select></label>
            <label>Organisation size<select name="organizationSize" required><option value="">Select…</option>{sizes.map((x) => <option key={x}>{x}</option>)}</select></label>
          </div>
          <label>Primary objective<select name="primaryObjective" required><option value="">Select…</option>{objectives.map((x) => <option key={x}>{x}</option>)}</select></label>
          <label>Current awareness platform <small>optional</small><input name="currentPlatform" /></label>
          <label>Anything we should know? <small>optional</small><textarea name="notes" rows={4} placeholder="Relevant workflows, target cohort, procurement or privacy requirements…" /></label>
          <label className="kc-form-consent">
            <input type="checkbox" name="consent" value="yes" required />
            <span>I agree that Konfydence may use these details to respond to this CoMaSy pilot request.</span>
          </label>
          <input type="hidden" name="utm_source" value={q.utm_source || ""} />
          <input type="hidden" name="utm_medium" value={q.utm_medium || ""} />
          <input type="hidden" name="utm_campaign" value={q.utm_campaign || ""} />
          <input type="hidden" name="landingPage" value="/comasy/pilot" />
          <button className="k-button" type="submit">Request pilot</button>
          <p className="kc-form-privacy">
            Review <Link href="/comasy/security">Security &amp; Privacy</Link> and the <Link href="/privacy-policy">Privacy Policy</Link>.
            Pilot request data and enterprise programme data are kept separate from consumer challenge activity.
          </p>
        </form>
      </section>

      <section className="k-section-dark">
        <div className="kg-shell kc-split">
          <div>
            <p className="k-kicker">What the first pilot is for</p>
            <h2 className="k-display-sm">Prove the use case before you fund the roadmap.</h2>
            <p className="k-copy">
              The first objective is not to deploy a broad human-risk platform. It is to determine whether realistic
              decision rehearsal produces useful behavioural evidence for your organisation.
            </p>
          </div>
          <div className="kc-split-2">
            <div>
              <h3 style={{ fontFamily: "var(--k-display)", fontWeight: 400, fontSize: 20, margin: "0 0 8px", color: "#fff" }}>Included</h3>
              <ul className="kc-list">
                <li>Defined cohort and risk focus</li>
                <li>Baseline scenario set</li>
                <li>Targeted decision practice</li>
                <li>Materially varied post scenarios</li>
                <li>Executive evidence review</li>
              </ul>
            </div>
            <div>
              <h3 style={{ fontFamily: "var(--k-display)", fontWeight: 400, fontSize: 20, margin: "0 0 8px", color: "#fff" }}>Not required to start</h3>
              <ul className="kc-list">
                <li>LMS replacement</li>
                <li>Broad enterprise integrations</li>
                <li>Multiplayer rollout</li>
                <li>AI-driven open-ended simulation</li>
                <li>Long-term platform commitment</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="kg-shell k-section">
        <div className="kc-pillars">
          {proof.map(([eyebrow, title, copy]) => (
            <article key={title}><b>{eyebrow}</b><h3>{title}</h3><p>{copy}</p></article>
          ))}
        </div>
      </section>

      <section className="kg-shell k-callout">
        <div>
          <p className="k-kicker">Before participant data is used</p>
          <h2 className="k-display-sm">Agree the data and review model.</h2>
          <p className="k-copy">
            The pilot scope should document participant identifiers, reporting granularity, access, retention/deletion
            expectations, subprocessors and any works-council or employee-representative requirements.
          </p>
        </div>
        <div className="k-actions">
          <Link className="k-button-quiet" href="/comasy/security">Security &amp; Privacy</Link>
          <Link className="k-button-quiet" href="/comasy/methodology">Methodology</Link>
        </div>
      </section>
    </PremiumPage>
  );
}
