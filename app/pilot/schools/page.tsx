import Link from "next/link";
import type { Metadata } from "next";
import { PremiumPage } from "@/components/PremiumSiteChrome";

export const metadata: Metadata = {
  title: { absolute: "Request a School Pilot | Konfydence" },
  description:
    "Run a bounded decision-practice pilot with a class or year group aged 12–18. The school stays in control of student data and the data model is agreed before any student takes part.",
  alternates: { canonical: "/pilot/schools", languages: { en: "https://konfydence.com/pilot/schools", de: "https://konfydence.com/de/pilot/schulen" } },
};

const roles = ["Head / Principal / Deputy", "Teacher", "Safeguarding / Pastoral lead", "IT / Digital lead", "Data protection lead", "Trust / Authority", "Other"];
const sizes = ["<250 students", "250–999 students", "1,000+ students"];
const ageGroups = ["12–13", "14–15", "16–18", "Mixed"];
const objectives = ["Support online-safety teaching", "Safeguarding programme", "Measure student decisions", "Evaluate Konfydence", "Other"];

const gate = [
  ["The school is in control", "The school (or its authority) is the data controller and Konfydence acts on its behalf under a written data-processing agreement."],
  ["Lawful basis and notice are set by the school", "The school decides the lawful basis and the parent or guardian information it provides. The age at which a child can consent online is set nationally between 13 and 16 in the EU, so we agree the rule for your country first."],
  ["Teacher-managed aliases", "Your teacher creates numbered aliases for the class (Student 01, 02…). No names or email addresses are entered or stored, and you keep the key that links each alias to a student. You can disable an alias or delete its data at any time."],
  ["Cohort-level reporting by default", "Results are reported for the class or year group. Individual-level results are not a default and are only agreed with named school staff if the school asks."],
  ["No marketing to students", "Student data is used only to deliver the pilot, never for advertising or marketing to students. The agreement says so. We may still contact your staff about the service."],
  ["Automatic deletion", "The retention period is written into the agreement. When it has passed, student responses and aliases are deleted automatically."],
  ["An impact assessment, if you need one", "Where your country or school requires a data protection impact assessment, we provide the information about the service that it needs."],
];

const flow = [
  ["01 · Group", "Agree the class or year group and the risk focus."],
  ["02 · Baseline", "See how students decide today."],
  ["03 · Practice", "Short, targeted decision rehearsal."],
  ["04 · Post set", "A materially varied set of scenarios."],
  ["05 · Decision", "Scale, adapt or stop."],
];

export default async function SchoolPilotPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const q = await searchParams;
  return (
    <PremiumPage ctaHref="#request" ctaLabel="Request a pilot">
      <section className="kg-shell kc-pilot">
        <div className="kc-pilot-intro">
          <p className="k-kicker">School pilots · ages 12–18</p>
          <h1 className="k-display" style={{ fontSize: "clamp(31px,4vw,52px)" }}>
            Test decision practice with your students before you scale it.
          </h1>
          <p className="k-lede">
            Start with a defined class or year group and a defined risk focus: gaming rewards, fake giveaways,
            group-chat pressure and account takeovers. The data model is agreed with your school before any student
            takes part.
          </p>
          <div className="kg-promise">
            <span>School controls student data</span><span>Data model agreed first</span><span>Cohort-level reporting</span><span>Scale / adapt / stop review</span>
          </div>
          <ol className="kc-flow">
            {flow.map(([title, copy]) => (
              <li key={title}><b>{title}</b><span>{copy}</span></li>
            ))}
          </ol>
        </div>

        <form id="request" className="kc-form" action="/api/comasy/pilot" method="post">
          <p className="k-kicker">Request a school pilot</p>
          <h2 className="k-display-sm" style={{ fontSize: "28px", margin: "0 0 10px" }}>Tell us what you need to learn.</h2>
          <p className="kc-form-intro">
            This is a qualification request, not a commitment to purchase. It is completed by school staff.
            <strong> Please do not enter any student names or personal details.</strong>
          </p>
          {q.error && (
            <div className="kc-form-error">
              {q.error === "rate" ? "Too many requests. Please try again shortly." : "Please complete the required fields using a valid school email."}
            </div>
          )}
          <div className="kc-form-row">
            <label>First name<input name="firstName" autoComplete="given-name" required /></label>
            <label>Last name<input name="lastName" autoComplete="family-name" required /></label>
          </div>
          <label>School email<input name="workEmail" type="email" autoComplete="email" required /></label>
          <label>School or trust name<input name="organization" autoComplete="organization" required /></label>
          <div className="kc-form-row">
            <label>Your role<select name="role" required><option value="">Select…</option>{roles.map((x) => <option key={x}>{x}</option>)}</select></label>
            <label>School size<select name="organizationSize" required><option value="">Select…</option>{sizes.map((x) => <option key={x}>{x}</option>)}</select></label>
          </div>
          <div className="kc-form-row">
            <label>Country<input name="country" autoComplete="country-name" required /></label>
            <label>Student age group<select name="ageGroup" required><option value="">Select…</option>{ageGroups.map((x) => <option key={x}>{x}</option>)}</select></label>
          </div>
          <label>Primary objective<select name="primaryObjective" required><option value="">Select…</option>{objectives.map((x) => <option key={x}>{x}</option>)}</select></label>
          <label>Anything we should know? <small>optional</small><textarea name="notes" rows={4} placeholder="Year group, term dates, safeguarding or data-protection requirements…" /></label>
          <label className="kc-form-consent">
            <input type="checkbox" name="consent" value="yes" required />
            <span>I agree that Konfydence may use these details to respond to this school pilot request. I have not included any student personal data.</span>
          </label>
          <input type="hidden" name="audience" value="school" />
          <input type="hidden" name="utm_source" value={q.utm_source || ""} />
          <input type="hidden" name="utm_medium" value={q.utm_medium || ""} />
          <input type="hidden" name="utm_campaign" value={q.utm_campaign || ""} />
          <input type="hidden" name="landingPage" value="/pilot/schools" />
          <button className="k-button" type="submit">Request school pilot</button>
          <p className="kc-form-privacy">
            Review <Link href="/comasy/security#schools">Schools &amp; student data</Link> and the <Link href="/privacy-policy#children">Privacy Policy</Link>.
          </p>
        </form>
      </section>

      <section id="student-data" className="k-section-dark">
        <div className="kg-shell kc-split">
          <div>
            <p className="k-kicker">Student data</p>
            <h2 className="k-display-sm">Seven conditions we agree before any student takes part.</h2>
            <p className="k-copy">
              Children&apos;s data needs more care than adult data. These conditions are the starting point for the
              pilot agreement, not a certification or a substitute for your own legal review.
            </p>
          </div>
          <ul className="kc-list">
            {gate.map(([title, copy]) => (
              <li key={title}><strong style={{ color: "#fff", display: "block", marginBottom: 4 }}>{title}</strong>{copy}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="kg-shell k-callout">
        <div>
          <p className="k-kicker">Not a school?</p>
          <h2 className="k-display-sm">Companies and teams have their own pilot.</h2>
        </div>
        <div className="k-actions">
          <Link className="k-button-quiet" href="/comasy/pilot">CoMaSy team pilot</Link>
          <Link className="k-button-quiet" href="/pilot">All pilots</Link>
        </div>
      </section>
    </PremiumPage>
  );
}
