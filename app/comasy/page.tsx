import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { PremiumPage } from "@/components/PremiumSiteChrome";
import { PortfolioStrip } from "@/components/PortfolioStrip";

export const metadata: Metadata = {
  title: { absolute: "CoMaSy | Security Decision Simulation by Konfydence" },
  description:
    "CoMaSy complements security awareness programmes with realistic decision simulations that measure pause, verification and escalation behaviour under pressure.",
  alternates: { canonical: "/comasy" },
  openGraph: {
    title: "CoMaSy | Security Decision Simulation",
    description:
      "Rehearse the moments where trusted identities, urgency and incomplete evidence compress judgement — then measure how people respond.",
    url: "https://konfydence.com/comasy",
    siteName: "Konfydence",
    type: "website",
  },
};

const faqs = [
  [
    "Does CoMaSy replace our LMS or phishing platform?",
    "No. CoMaSy is designed as a complementary decision-simulation layer. A pilot can run alongside your existing awareness programme without requiring a platform replacement.",
  ],
  [
    "What does CoMaSy measure?",
    "CoMaSy measures training signals from scenario decisions, including pause behaviour, independent verification, higher-risk impulse actions and H.A.C.K. pressure-pattern responses. These are learning signals, not guarantees of real-world security performance.",
  ],
  [
    "Is CoMaSy a phishing simulator?",
    "Phishing can be one scenario type, but the core use case is broader: executive impersonation, supplier changes, payment requests, account compromise and other business decisions where a request can look legitimate.",
  ],
  [
    "Does CoMaSy make an organisation NIS2 compliant?",
    "No. CoMaSy can support repeated cybersecurity-awareness activity and defined effectiveness evidence, but using CoMaSy does not by itself establish regulatory compliance.",
  ],
];

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      "@id": "https://konfydence.com/comasy#service",
      name: "CoMaSy",
      serviceType: "Security decision simulation",
      provider: { "@type": "Organization", name: "Konfydence", url: "https://konfydence.com" },
      url: "https://konfydence.com/comasy",
      description:
        "A decision-simulation layer that helps organisations rehearse realistic social-engineering decisions and measure observable verification behaviour.",
      areaServed: ["Europe", "North America"],
    },
    {
      "@type": "FAQPage",
      mainEntity: faqs.map(([question, answer]) => ({
        "@type": "Question",
        name: question,
        acceptedAnswer: { "@type": "Answer", text: answer },
      })),
    },
  ],
};

export default function ComasyPage() {
  return (
    <PremiumPage ctaHref="/comasy/pilot" ctaLabel="Request a pilot">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <section className="k-comasy-hero">
        <div className="k-comasy-copy">
          <p className="k-breadcrumb">For organisations · CoMaSy</p>
          <p className="k-kicker">The Human Firewall Simulation Platform</p>
          <h1 className="k-display">Security decisions deserve practice too.</h1>
          <p className="k-lede">
            CoMaSy places employees inside realistic incidents where urgency, authority, compromised identities and incomplete evidence create pressure — then measures how they pause, verify and act.
          </p>
          <div className="k-actions">
            <Link className="k-button-gold" href="/comasy/pilot">Request a pilot</Link>
            <Link className="k-button-quiet" href="/comasy/methodology">See how it works</Link>
          </div>
          <div className="k-inline-proof">
            <span><b>No LMS replacement</b></span>
            <span><b>Defined pilot scope</b></span>
            <span><b>Observable training signals</b></span>
          </div>
        </div>
        <div className="k-comasy-media">
          <Image
            src="/edition-images/workplace.png"
            alt="Workplace team discussing a security decision"
            fill
            priority
            sizes="(max-width: 980px) 100vw, 52vw"
          />
        </div>
      </section>

      <section className="k-comasy-pillars k-shell">
        <article><span>01</span><h3>Realistic simulations</h3><p>Context-rich scenarios built around decisions people actually have to make.</p></article>
        <article><span>02</span><h3>Behavioural signals</h3><p>Observe pause, verification, escalation and higher-risk impulse choices.</p></article>
        <article><span>03</span><h3>Team & enterprise</h3><p>Start with a bounded cohort and expand only when the signal proves useful.</p></article>
        <article><span>04</span><h3>Measurable change</h3><p>Compare baseline and post-practice decisions instead of relying on completion alone.</p></article>
      </section>

      <section className="k-shell k-section">
        <div className="k-section-head">
          <div>
            <p className="k-kicker">Inside CoMaSy</p>
            <h2 className="k-display-sm">See decisions. Understand drivers. Improve outcomes.</h2>
          </div>
          <p className="k-copy">
            The interface is designed around evidence rather than suspicion. A trusted person may be real while a specific message, channel or action is compromised. CoMaSy trains verification without teaching blanket distrust.
          </p>
        </div>

        <div className="k-dashboard">
          <article className="k-dashboard-side">
            <small>Illustrative incident</small>
            <h3>Executive payment request</h3>
            <div className="k-event"><span>09:12 · Request received</span><em>Hurry</em></div>
            <div className="k-event"><span>09:15 · Approval path changes</span><em>Authority</em></div>
            <div className="k-event"><span>09:17 · Known account used</span><em>Comfort</em></div>
            <div className="k-event"><span>09:19 · Independent call discouraged</span><em>Kill-Switch</em></div>
          </article>
          <article className="k-dashboard-main">
            <small>Illustrative reporting model · not customer outcome data</small>
            <div className="k-metrics">
              <div className="k-metric"><strong>72%</strong><span>Pause adoption example</span></div>
              <div className="k-metric"><strong>67%</strong><span>Independent verification example</span></div>
              <div className="k-metric"><strong>18%</strong><span>Higher-risk impulse example</span></div>
              <div className="k-metric"><strong>4</strong><span>Pressure-pattern dimensions</span></div>
            </div>
            <div className="k-linechart" aria-label="Illustrative behavioural trend line" />
          </article>
        </div>
      </section>

      <section className="k-shell k-section">
        <div className="k-section-head">
          <div>
            <p className="k-kicker">From awareness to behaviour change</p>
            <h2 className="k-display-sm">One incident. Four moments that matter.</h2>
          </div>
          <p className="k-copy">
            Knowledge matters, but the critical question is what happens when a legitimate-looking request arrives under pressure.
          </p>
        </div>
        <div className="k-simulation">
          <article><b>01</b><h3>Simulate</h3><p>Present a realistic incident with pressure, ambiguity and competing priorities.</p></article>
          <article><b>02</b><h3>Decide</h3><p>Employees choose an action rather than passively reading the right answer.</p></article>
          <article><b>03</b><h3>Review</h3><p>Reveal the evidence, pressure pattern and stronger verification path.</p></article>
          <article><b>04</b><h3>Improve</h3><p>Repeat targeted practice and compare defined behavioural signals over time.</p></article>
        </div>
      </section>

      <section className="k-shell k-section">
        <div className="k-pilot">
          <div>
            <p className="k-kicker">Start with a pilot</p>
            <h2 className="k-display-sm">Prove whether the signal is useful before you scale.</h2>
            <p className="k-copy">
              The initial CoMaSy motion is deliberately bounded. Select a cohort and risk focus, establish a baseline, run targeted decision practice, compare a post variant and decide whether to scale, adapt or stop.
            </p>
            <div className="k-actions">
              <Link className="k-button-gold" href="/comasy/pilot">Request a pilot</Link>
              <Link className="k-button-quiet" href="/comasy/security">Security & privacy</Link>
            </div>
          </div>
          <div className="k-pilot-list">
            <span>01 · Agree cohort and risk focus</span>
            <span>02 · Establish baseline</span>
            <span>03 · Run targeted decision practice</span>
            <span>04 · Review a post variant</span>
            <span>05 · Scale / adapt / stop</span>
          </div>
        </div>
      </section>

      <section className="k-shell k-section">
        <div className="k-section-head">
          <div>
            <p className="k-kicker">Buyer questions</p>
            <h2 className="k-display-sm">What CoMaSy is — and what it is not.</h2>
          </div>
          <p className="k-copy">Clear boundaries are part of the product: CoMaSy complements existing awareness programmes and does not make standalone compliance guarantees.</p>
        </div>
        <div className="k-two-paths">
          <article className="k-path" style={{minHeight: "420px"}}>
            <div className="k-path-copy" style={{top: "30px", bottom: "auto"}}>
              <small>Methodology</small>
              <h3>Measure defined training signals responsibly.</h3>
              <p>See what is measured, how example values are treated and where interpretation should stop.</p>
              <Link href="/comasy/methodology">Read methodology →</Link>
            </div>
          </article>
          <article className="k-path" style={{minHeight: "420px"}}>
            <div className="k-path-copy" style={{top: "30px", bottom: "auto"}}>
              <small>Security & privacy</small>
              <h3>Give procurement clearer answers earlier.</h3>
              <p>Review current data handling, safeguards and enterprise security notes before a pilot.</p>
              <Link href="/comasy/security">Review security →</Link>
            </div>
          </article>
        </div>
      </section>

      <PortfolioStrip exclude={["comasy"]} kicker="For individuals" heading="The same habit, for the people on your team too." />

      <section className="k-shell k-callout">
        <div>
          <p className="k-kicker">CoMaSy pilot</p>
          <h2 className="k-display-sm">Start small. Measure honestly. Scale only if it earns the right.</h2>
        </div>
        <div className="k-actions">
          <Link className="k-button-gold" href="/comasy/pilot">Request a pilot</Link>
        </div>
      </section>
    </PremiumPage>
  );
}
