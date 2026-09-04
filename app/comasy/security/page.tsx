import Link from "next/link";
import type { Metadata } from "next";
import { PremiumPage } from "@/components/PremiumSiteChrome";

export const metadata: Metadata = {
  title: { absolute: "CoMaSy Security & Privacy | Konfydence" },
  description:
    "Current CoMaSy security, privacy and pilot data-handling information for enterprise review and procurement conversations.",
  alternates: { canonical: "/comasy/security" },
};

const controls = [
  ["Application security", "The current web application configures security headers including CSP, HSTS, X-Content-Type-Options, Referrer-Policy and frame restrictions."],
  ["Pilot form protection", "Pilot requests are validated server-side and rate-limited before lead records are created."],
  ["Consent-aware analytics", "GA4 instrumentation is optional and is designed to respect explicit analytics consent before behavioural analytics events are sent."],
  ["Data minimisation", "Pilot scope should define which participant and cohort data are actually required before the exercise begins. Individual-level reporting is not treated as a default requirement."],
];

const dataItems = [
  ["Pilot request data", "Name, work email, organisation, role, organisation size, objective, current platform, notes, consent and attribution fields may be collected through the pilot request flow."],
  ["Participant data", "Scenario responses and derived training signals may be required for a pilot. The exact participant identifiers and reporting granularity should be agreed before the exercise."],
  ["Access & retention", "Customer-specific access, retention and deletion requirements should be documented in the pilot scope or commercial agreement before live participant data is processed."],
];

const checklist = [
  "Who is the customer data controller and who processes data on its behalf?",
  "Which participant identifiers are necessary?",
  "Can the pilot be reported at cohort level?",
  "Who can access raw responses and derived signals?",
  "What retention/deletion period applies?",
  "Are works-council or employee-representative approvals required?",
  "Which subprocessors and hosting regions apply to the agreed environment?",
  "What happens if the customer stops after the pilot?",
];

const legalLinks = [
  ["/privacy-policy", "Privacy Policy", "Website and service privacy information."],
  ["/terms-of-service", "Terms of Service", "Current public service terms."],
  ["/imprint", "Imprint", "Legal operator and contact information."],
  ["/cookie-policy", "Cookie Policy", "Cookie and analytics information."],
];

export default function SecurityPage() {
  return (
    <PremiumPage ctaHref="/comasy/pilot" ctaLabel="Request a pilot">
      <section className="kg-shell kc-hero">
        <p className="k-kicker">Security &amp; privacy</p>
        <h1>Enterprise review should start before the pilot, not after it.</h1>
        <p>
          This page documents what is visible in the current CoMaSy implementation and the data-governance
          questions that must be agreed for a pilot. It is not a certification, DPA or substitute for your
          organisation&apos;s legal and security review.
        </p>
      </section>

      <section className="kg-shell k-section">
        <div className="k-section-head">
          <div>
            <p className="k-kicker">Current implementation</p>
            <h2 className="k-display-sm">Technical safeguards already present in the application.</h2>
          </div>
        </div>
        <div className="kc-cards">
          {controls.map(([title, copy]) => (
            <article key={title}><h3>{title}</h3><p>{copy}</p></article>
          ))}
        </div>
      </section>

      <section className="k-section-dark">
        <div className="kg-shell kc-split">
          <div>
            <p className="k-kicker">Pilot data</p>
            <h2 className="k-display-sm">Agree the minimum data set before launch.</h2>
            <p className="k-copy">
              CoMaSy is designed around observable scenario decisions. The pilot should establish exactly which
              fields are required, who may access results and whether reporting is individual, cohort-level or both.
            </p>
          </div>
          <ul className="kc-list">
            {dataItems.map(([title, copy]) => (
              <li key={title}><strong style={{ color: "#fff", display: "block", marginBottom: 4 }}>{title}</strong>{copy}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="kg-shell k-section">
        <div className="kc-split-2">
          <div>
            <p className="k-kicker">Architecture &amp; service providers</p>
            <h2 className="k-display-sm" style={{ fontSize: "clamp(24px,2.6vw,32px)" }}>What the current codebase uses.</h2>
            <p className="k-copy" style={{ marginTop: 14 }}>
              The current Konfydence application is built on Next.js/React with Prisma and PostgreSQL/Supabase
              architecture and is deployed through Vercel. The pilot workflow includes a Resend email integration
              when configured. Consumer checkout uses Shopify.
            </p>
          </div>
          <div className="kc-note">
            <b>Procurement note</b>
            <p>
              Deployment-specific subprocessors, regions, retention, data-processing terms and customer security
              requirements must be confirmed for the actual pilot environment. This page intentionally does not claim
              a certification or contractual control that has not been verified.
            </p>
          </div>
        </div>
      </section>

      <section className="k-section-dark">
        <div className="kg-shell kc-split">
          <div>
            <p className="k-kicker">Pilot review checklist</p>
            <h2 className="k-display-sm">Questions to close before participant data is used.</h2>
          </div>
          <ul className="kc-list">
            {checklist.map((q) => <li key={q}>{q}</li>)}
          </ul>
        </div>
      </section>

      <section className="kg-shell k-section">
        <div className="k-section-head">
          <div>
            <p className="k-kicker">Legal &amp; policy links</p>
            <h2 className="k-display-sm">Reference documents.</h2>
          </div>
        </div>
        <div className="kc-linkcards">
          {legalLinks.map(([href, title, copy]) => (
            <Link key={href} href={href}><b>{title}</b><span>{copy}</span></Link>
          ))}
        </div>
      </section>

      <section className="kg-shell k-callout">
        <div>
          <p className="k-kicker">Request a pilot</p>
          <h2 className="k-display-sm">Bring your security and privacy questions into the pilot scope.</h2>
          <p className="k-copy">A qualified pilot request should make the data model and review requirements explicit before scale.</p>
        </div>
        <div className="k-actions">
          <Link className="k-button" href="/comasy/pilot">Request a pilot</Link>
        </div>
      </section>
    </PremiumPage>
  );
}
