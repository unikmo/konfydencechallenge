import Link from "next/link";
import { PremiumPage } from "@/components/PremiumSiteChrome";
import { PortfolioStrip } from "@/components/PortfolioStrip";

export type LockscreenIntentSection = {
  title: string;
  copy: string;
};

export type LockscreenIntentFaq = {
  question: string;
  answer: string;
};

export type LockscreenHeroImage = {
  src: string;
  alt: string;
  frame?: "desktop" | "phone";
};

export type LockscreenOrgValue = {
  title: string;
  copy: string;
  points: string[];
  note?: string;
};

export type LockscreenIntentPageProps = {
  slug: string;
  eyebrow: string;
  title: string;
  intro: string;
  primaryCtaHref: string;
  primaryCtaLabel: string;
  heroImage: LockscreenHeroImage;
  problemTitle: string;
  problemCopy: string;
  sections: LockscreenIntentSection[];
  howTitle: string;
  howCopy: string;
  howSteps: string[];
  orgValue?: LockscreenOrgValue;
  faq: LockscreenIntentFaq[];
  calloutTitle: string;
  breadcrumbName: string;
};

const BASE = "https://konfydence.com";

export function LockscreenIntentPage({
  slug,
  eyebrow,
  title,
  intro,
  primaryCtaHref,
  primaryCtaLabel,
  heroImage,
  problemTitle,
  problemCopy,
  sections,
  howTitle,
  howCopy,
  howSteps,
  orgValue,
  faq,
  calloutTitle,
  breadcrumbName,
}: LockscreenIntentPageProps) {
  const jsonLd: Record<string, unknown>[] = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Konfydence Lockscreens", item: `${BASE}/lockscreens` },
        { "@type": "ListItem", position: 2, name: breadcrumbName, item: `${BASE}/lockscreens/${slug}` },
      ],
    },
  ];
  if (faq.length) {
    jsonLd.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faq.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    });
  }

  const frameClass = heroImage.frame === "phone" ? "kls-phone" : "kls-desktop";

  return (
    <PremiumPage ctaHref={primaryCtaHref} ctaLabel={primaryCtaLabel}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="kls-hero kg-shell">
        <div className="kls-hero-copy">
          <p className="k-kicker">{eyebrow}</p>
          <h1 className="k-display">{title}</h1>
          <p className="k-lede">{intro}</p>
          <div className="k-actions">
            <Link className="k-button" href={primaryCtaHref}>{primaryCtaLabel}</Link>
            <Link className="k-button-quiet" href="/lockscreens">How Lockscreens works</Link>
          </div>
        </div>
        <div className="kls-devices">
          <div className={frameClass}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={heroImage.src} alt={heroImage.alt} />
          </div>
        </div>
      </section>

      <section className="kg-shell k-section">
        <div className="k-section-head">
          <div>
            <p className="k-kicker">The gap</p>
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
            <p className="k-kicker">How it runs</p>
            <h2 className="k-display-sm">{howTitle}</h2>
          </div>
          <div>
            <p className="k-copy">{howCopy}</p>
            <ol className="kc-list" style={{ marginTop: 18 }}>
              {howSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {orgValue ? (
        <section className="kg-shell k-section">
          <div className="k-section-head">
            <div>
              <p className="k-kicker">Why it matters to the organisation</p>
              <h2 className="k-display-sm">{orgValue.title}</h2>
            </div>
            <p className="k-copy">{orgValue.copy}</p>
          </div>
          <ul className="kc-list">
            {orgValue.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
          {orgValue.note ? (
            <p className="k-copy" style={{ marginTop: 16, fontSize: 12, opacity: 0.75 }}>{orgValue.note}</p>
          ) : null}
        </section>
      ) : null}

      {faq.length ? (
        <section className="kg-shell k-section">
          <div className="k-section-head">
            <div>
              <p className="k-kicker">Questions</p>
              <h2 className="k-display-sm">What buyers ask first.</h2>
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
      ) : null}

      <section className="kg-shell k-callout">
        <div>
          <p className="k-kicker">Pause. Assess. Talk — where it&rsquo;s seen.</p>
          <h2 className="k-display-sm">{calloutTitle}</h2>
        </div>
        <div className="k-actions">
          <Link className="k-button" href={primaryCtaHref}>{primaryCtaLabel}</Link>
        </div>
      </section>

      <PortfolioStrip exclude={["lockscreens"]} kicker="Also from Konfydence" heading="Practise the decision, not just the reminder." />
    </PremiumPage>
  );
}
