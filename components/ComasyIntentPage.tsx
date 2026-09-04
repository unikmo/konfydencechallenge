import Link from "next/link";
import { PremiumPage } from "@/components/PremiumSiteChrome";
import { PortfolioStrip } from "@/components/PortfolioStrip";

export type IntentSection = {
  title: string;
  copy: string;
};

export type IntentFaq = {
  question: string;
  answer: string;
};

export function ComasyIntentPage({
  eyebrow,
  title,
  intro,
  problemTitle,
  problemCopy,
  sections,
  proofTitle,
  proofCopy,
  faq,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  problemTitle: string;
  problemCopy: string;
  sections: IntentSection[];
  proofTitle: string;
  proofCopy: string;
  faq: IntentFaq[];
}) {
  return (
    <PremiumPage ctaHref="/comasy/pilot" ctaLabel="Request a pilot">
      <section className="kg-shell kc-hero">
        <p className="k-kicker">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{intro}</p>
        <div className="k-actions">
          <Link className="k-button" href="/comasy/pilot">Request a pilot</Link>
          <Link className="k-button-quiet" href="/comasy">See CoMaSy</Link>
        </div>
      </section>

      <section className="kg-shell k-section">
        <div className="k-section-head">
          <div>
            <p className="k-kicker">The decision gap</p>
            <h2 className="k-display-sm">{problemTitle}</h2>
          </div>
          <p className="k-copy">{problemCopy}</p>
        </div>
        <div className="kc-cards is-3">
          {sections.map((section, index) => (
            <article key={section.title}>
              <span className="kc-obs">0{index + 1}</span>
              <h3>{section.title}</h3>
              <p>{section.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="k-section-dark">
        <div className="kg-shell kc-split">
          <div>
            <p className="k-kicker">Measurement</p>
            <h2 className="k-display-sm">{proofTitle}</h2>
          </div>
          <div>
            <p className="k-copy">{proofCopy}</p>
            <p style={{ marginTop: 18 }}>
              <Link className="k-button-quiet" href="/comasy/methodology">Read the methodology</Link>
            </p>
          </div>
        </div>
      </section>

      <section className="kg-shell k-section">
        <div className="k-section-head">
          <div>
            <p className="k-kicker">Buyer questions</p>
            <h2 className="k-display-sm">What to know before you pilot it.</h2>
          </div>
        </div>
        <div className="kc-cards">
          {faq.map((item) => (
            <article key={item.question}>
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="kg-shell k-callout">
        <div>
          <p className="k-kicker">Defined cohort. Defined metrics. Defined decision point.</p>
          <h2 className="k-display-sm">Test the use case before you scale it.</h2>
        </div>
        <div className="k-actions">
          <Link className="k-button" href="/comasy/pilot">Request a CoMaSy pilot</Link>
        </div>
      </section>

      <PortfolioStrip exclude={["comasy"]} kicker="Also from Konfydence" heading="Practise the decision, individually or as a team." />
    </PremiumPage>
  );
}
