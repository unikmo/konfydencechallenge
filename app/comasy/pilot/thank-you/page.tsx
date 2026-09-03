import { PremiumPage } from "@/components/PremiumSiteChrome";

const steps = [
  ["01", "Review the use case", "We check the buyer objective, current programme and intended cohort."],
  ["02", "Agree the cohort and risk focus", "Department, role, geography and the pressure situations worth rehearsing."],
  ["03", "Establish pilot measures", "Participation, Pause Adoption, Verification, Impulse and trigger-specific movement."],
  ["04", "Configure the programme", "Baseline, targeted practice, follow-up and the final results review."],
];

export default async function PilotThankYou({ searchParams }: { searchParams: Promise<{ org?: string }> }) {
  const { org } = await searchParams;
  const calendar = process.env.NEXT_PUBLIC_COMASY_CALENDAR_URL;
  return (
    <PremiumPage ctaHref="/comasy" ctaLabel="Back to CoMaSy">
      <section className="kg-shell kc-hero">
        <p className="k-kicker">Pilot request received</p>
        <h1>Your pilot request is in.</h1>
        <p>
          {org ? `We have recorded the request for ${org}. ` : ""}
          The next step is to turn the request into a defined enterprise evaluation — not a generic software demo.
        </p>
        {calendar ? (
          <div className="k-actions">
            <a className="k-button" href={calendar} rel="noopener noreferrer">Book a 20-minute scoping call</a>
          </div>
        ) : null}
      </section>

      <section className="kg-shell k-section">
        <div className="k-section-head">
          <div>
            <p className="k-kicker">What happens next</p>
            <h2 className="k-display-sm">From request to scoped evaluation.</h2>
          </div>
        </div>
        <div className="kc-pillars">
          {steps.map(([no, title, copy]) => (
            <article key={no}><b>{no}</b><h3>{title}</h3><p>{copy}</p></article>
          ))}
        </div>
        {!calendar ? (
          <div className="kc-note" style={{ marginTop: 28 }}>
            <b>Request recorded</b>
            <p>The account team will use the details you submitted to arrange scoping. A calendar link appears here only when scheduling is configured.</p>
          </div>
        ) : null}
      </section>
    </PremiumPage>
  );
}
