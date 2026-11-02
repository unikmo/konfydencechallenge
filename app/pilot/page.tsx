import Link from "next/link";
import type { Metadata } from "next";
import { PremiumPage } from "@/components/PremiumSiteChrome";

export const metadata: Metadata = {
  title: { absolute: "Bounded Pilots for Schools and Organisations | Konfydence" },
  description:
    "Test decision practice before you scale it. Run a bounded pilot with a school or team: defined group, baseline, targeted practice, post comparison and a scale / adapt / stop review.",
  alternates: { canonical: "/pilot", languages: { en: "https://konfydence.com/pilot", de: "https://konfydence.com/de/pilot" } },
};

const steps = [
  ["01 · Group", "Agree the group and the risk focus."],
  ["02 · Baseline", "Establish how the group decides today."],
  ["03 · Practice", "Short, targeted decision rehearsal."],
  ["04 · Post set", "A materially varied set of scenarios, then review."],
  ["05 · Decision", "Scale, adapt or stop."],
];

const gets = [
  ["Scope", "Defined scope", "A named group, a risk focus and a start and end date, written down before anything begins."],
  ["Signals", "Observable signals", "Pause adoption, independent verification and higher-risk impulse, compared across baseline and post set."],
  ["Review", "Evidence review", "What changed, what did not, and whether it is worth scaling. Training evidence, not a compliance claim."],
  ["Privacy", "Data model first", "Identifiers, access, reporting level and retention are agreed before any participant data is used."],
];

export default function PilotHubPage() {
  return (
    <PremiumPage ctaHref="#paths" ctaLabel="Request a pilot">
      <section className="kg-shell kc-hero">
        <p className="k-kicker">Bounded pilots</p>
        <h1>Test decision practice before you scale it.</h1>
        <p>
          Start small. Measure observable decision signals. Decide whether to expand, adapt or stop, with clear
          evidence. We are now accepting pilot requests from schools and organisations.
        </p>
        <div className="kg-promise" style={{ marginTop: 22 }}>
          <span>Bounded scope</span><span>No LMS replacement</span><span>Data model agreed first</span><span>Scale / adapt / stop review</span>
        </div>
      </section>

      <section id="paths" className="kg-shell k-section">
        <div className="k-section-head">
          <div>
            <p className="k-kicker">Two paths</p>
            <h2 className="k-display-sm">Choose the pilot that fits.</h2>
          </div>
        </div>
        <div className="kc-split-2">
          <article className="kc-note">
            <b>Schools · ages 12–18</b>
            <h3 style={{ fontFamily: "var(--k-display)", fontWeight: 400, fontSize: 26, margin: "10px 0 8px" }}>Classroom decision practice</h3>
            <p>
              Gaming rewards, fake giveaways, group-chat pressure and account takeovers. The school remains in
              control of student data, and the data model is agreed before any student takes part.
            </p>
            <div className="k-actions" style={{ marginTop: 20 }}>
              <Link className="k-button" href="/pilot/schools">Request a school pilot</Link>
              <Link className="k-button-quiet" href="/school">Try the student check</Link>
            </div>
          </article>
          <article className="kc-note">
            <b>Companies &amp; teams</b>
            <h3 style={{ fontFamily: "var(--k-display)", fontWeight: 400, fontSize: 26, margin: "10px 0 8px" }}>CoMaSy security decision simulation</h3>
            <p>
              Realistic social-engineering decisions for a defined cohort, with a baseline, targeted practice and a
              post comparison. Designed to run alongside your existing awareness programme.
            </p>
            <div className="k-actions" style={{ marginTop: 20 }}>
              <Link className="k-button" href="/comasy/pilot">Request a pilot</Link>
              <Link className="k-button-quiet" href="/comasy/methodology">See methodology</Link>
            </div>
          </article>
        </div>
      </section>

      <section className="k-section-dark">
        <div className="kg-shell kc-split">
          <div>
            <p className="k-kicker">How a pilot works</p>
            <h2 className="k-display-sm">The same five steps for schools and teams.</h2>
          </div>
          <ol className="kc-flow" style={{ marginTop: 0 }}>
            {steps.map(([title, copy]) => (
              <li key={title}><b>{title}</b><span>{copy}</span></li>
            ))}
          </ol>
        </div>
      </section>

      <section className="kg-shell k-section">
        <div className="kc-pillars">
          {gets.map(([eyebrow, title, copy]) => (
            <article key={title}><b>{eyebrow}</b><h3>{title}</h3><p>{copy}</p></article>
          ))}
        </div>
      </section>

      <section className="kg-shell k-callout">
        <div>
          <p className="k-kicker">Before participant data is used</p>
          <h2 className="k-display-sm">Review the privacy model first.</h2>
          <p className="k-copy">
            A pilot request is a qualification conversation, not a purchase commitment. It does not ask for any
            participant data.
          </p>
        </div>
        <div className="k-actions">
          <Link className="k-button-quiet" href="/comasy/security">Security &amp; Privacy</Link>
          <Link className="k-button-quiet" href="/privacy-policy">Privacy Policy</Link>
        </div>
      </section>
    </PremiumPage>
  );
}
