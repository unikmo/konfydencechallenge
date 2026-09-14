import Link from "next/link";
import { PremiumPage, PremiumPageDe } from "@/components/PremiumSiteChrome";
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

export type LockscreenUiLang = "en" | "de";

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
  lang?: LockscreenUiLang;
};

const STRINGS: Record<LockscreenUiLang, {
  howItWorks: string;
  theGap: string;
  howItRuns: string;
  whyOrg: string;
  questions: string;
  whatBuyersAsk: string;
  calloutKicker: string;
  portfolioKicker: string;
  portfolioHeading: string;
  breadcrumbRoot: string;
}> = {
  en: {
    howItWorks: "How Lockscreens works",
    theGap: "The gap",
    howItRuns: "How it runs",
    whyOrg: "Why it matters to the organisation",
    questions: "Questions",
    whatBuyersAsk: "What buyers ask first.",
    calloutKicker: "Pause. Assess. Talk — where it’s seen.",
    portfolioKicker: "Also from Konfydence",
    portfolioHeading: "Practise the decision, not just the reminder.",
    breadcrumbRoot: "Konfydence Lockscreens",
  },
  de: {
    howItWorks: "So funktioniert Lockscreens",
    theGap: "Die Lücke",
    howItRuns: "So läuft es ab",
    whyOrg: "Warum das für die Organisation wichtig ist",
    questions: "Fragen",
    whatBuyersAsk: "Was Einkäufer zuerst fragen.",
    calloutKicker: "Anhalten. Abklären. Ansprechen — wo es gesehen wird.",
    portfolioKicker: "Auch von Konfydence",
    portfolioHeading: "Die Entscheidung üben, nicht nur die Erinnerung.",
    breadcrumbRoot: "Konfydence Lockscreens",
  },
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
  lang = "en",
}: LockscreenIntentPageProps) {
  const t = STRINGS[lang];
  const Page = lang === "de" ? PremiumPageDe : PremiumPage;
  const pathPrefix = lang === "de" ? "/de" : "";
  const jsonLd: Record<string, unknown>[] = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: t.breadcrumbRoot, item: `${BASE}${pathPrefix}/lockscreens` },
        { "@type": "ListItem", position: 2, name: breadcrumbName, item: `${BASE}${pathPrefix}/lockscreens/${slug}` },
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
    <Page ctaHref={primaryCtaHref} ctaLabel={primaryCtaLabel}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="kls-hero kg-shell">
        <div className="kls-hero-copy">
          <p className="k-kicker">{eyebrow}</p>
          <h1 className="k-display">{title}</h1>
          <p className="k-lede">{intro}</p>
          <div className="k-actions">
            <Link className="k-button" href={primaryCtaHref}>{primaryCtaLabel}</Link>
            <Link className="k-button-quiet" href={`${pathPrefix}/lockscreens`}>{t.howItWorks}</Link>
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
            <p className="k-kicker">{t.theGap}</p>
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
            <p className="k-kicker">{t.howItRuns}</p>
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
              <p className="k-kicker">{t.whyOrg}</p>
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
              <p className="k-kicker">{t.questions}</p>
              <h2 className="k-display-sm">{t.whatBuyersAsk}</h2>
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
          <p className="k-kicker">{t.calloutKicker}</p>
          <h2 className="k-display-sm">{calloutTitle}</h2>
        </div>
        <div className="k-actions">
          <Link className="k-button" href={primaryCtaHref}>{primaryCtaLabel}</Link>
        </div>
      </section>

      {lang === "de" ? null : (
        <PortfolioStrip exclude={["lockscreens"]} kicker={t.portfolioKicker} heading={t.portfolioHeading} />
      )}
    </Page>
  );
}
