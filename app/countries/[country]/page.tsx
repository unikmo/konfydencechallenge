import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { COUNTRY_PROFILES } from "@/lib/countries";
import { COUNTRY_GUIDES, HACK_LABEL } from "@/lib/country-guides";
import { PremiumPage } from "@/components/PremiumSiteChrome";
import CountryAlert from "../CountryAlert";
import styles from "../countries.module.css";

export function generateStaticParams() {
  return Object.keys(COUNTRY_PROFILES).map((country) => ({ country }));
}

export async function generateMetadata(props: { params: Promise<{ country: string }> }): Promise<Metadata> {
  const { country } = await props.params;
  const profile = COUNTRY_PROFILES[country];
  if (!profile) return {};
  const guide = COUNTRY_GUIDES[country];
  const indexable = guide?.status === "published";
  return {
    title: { absolute: `Common scams in ${profile.name} (${new Date().getFullYear()}) — and how to avoid them | Konfydence` },
    description: indexable
      ? `The scams travellers actually run into in ${profile.name} — how each one works, the pressure tactic behind it, and the simple move that stops it.`
      : `Scam and fraud awareness for travel to ${profile.name}, with links to official government advisories.`,
    alternates: { canonical: `/countries/${country}` },
    robots: indexable ? undefined : { index: false, follow: true },
    openGraph: {
      title: `Common scams in ${profile.name} — and how to avoid them`,
      description: `How the common ${profile.name} scams work and the one move that defuses each.`,
      url: `https://konfydence.com/countries/${country}`,
      siteName: "Konfydence",
      type: "article",
    },
  };
}

export default async function CountryPage(props: { params: Promise<{ country: string }> }) {
  const params = await props.params;
  const profile = COUNTRY_PROFILES[params.country];
  if (!profile) notFound();
  const guide = COUNTRY_GUIDES[params.country];

  const nearby = Object.values(COUNTRY_PROFILES)
    .filter((p) => p.slug !== profile.slug && p.region === profile.region && COUNTRY_GUIDES[p.slug]?.status === "published")
    .slice(0, 6);
  const nearbyFallback = nearby.length
    ? nearby
    : Object.entries(COUNTRY_GUIDES)
        .filter(([slug, g]) => slug !== profile.slug && g.status === "published")
        .slice(0, 6)
        .map(([slug]) => COUNTRY_PROFILES[slug])
        .filter(Boolean);

  const jsonLd: Record<string, unknown>[] = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Country scam alerts", item: "https://konfydence.com/countries" },
        { "@type": "ListItem", position: 2, name: profile.name, item: `https://konfydence.com/countries/${profile.slug}` },
      ],
    },
  ];
  if (guide?.faqs.length) {
    jsonLd.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: guide.faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    });
  }

  return (
    <PremiumPage ctaHref="/challenge/travelsafe/start?mode=diagnostic" ctaLabel="Try TravelSafe free">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className={styles.shell}>
        <section className={styles.hero}>
          <Link href="/countries" className={styles.back}>← Country scam alerts</Link>
          <p className={styles.eyebrow}>{profile.continent} · {profile.region}</p>
          <h1>Common scams in {profile.name}</h1>
          {guide ? <p className={styles.lede}>{guide.intro}</p> : null}
        </section>

        {guide ? (
          <>
            <section className={styles.section}>
              <h2>The scams you'll actually run into</h2>
              <ol className={styles.scamList}>
                {guide.scams.map((scam) => (
                  <li key={scam.name} className={styles.scamCard}>
                    <h3>{scam.name}</h3>
                    <p className={styles.scamHow}>{scam.how}</p>
                    <div className={styles.scamMeta}>
                      <span className={styles.hackChip}>H.A.C.K. · {HACK_LABEL[scam.hack]}</span>
                    </div>
                    <p className={styles.scamMove}><strong>The move:</strong> {scam.move}</p>
                  </li>
                ))}
              </ol>
            </section>

            <section className={styles.section}>
              <h2>How the Konfydence method applies</h2>
              <p className={styles.lede}>
                Every scam above uses one of four pressure tactics — <strong>H.A.C.K.</strong>: Hurry, Authority,
                Comfort or Kill-Switch. You don't need to memorise a list of tricks. You need to notice the pressure and
                run <strong>Pause · Assess · Talk</strong>: stop before you pay, hand over a document or follow someone;
                ask what the request really wants (money, a document, access); then say it out loud to someone you trust,
                or your bank on the number from your card.
              </p>
              <Link href="/challenge/travelsafe/start?mode=diagnostic" className={styles.primaryLink}>
                Practise it — free TravelSafe check
              </Link>
            </section>

            {guide.faqs.length ? (
              <section className={styles.section}>
                <h2>{profile.name} travel-scam FAQ</h2>
                <div className={styles.faqList}>
                  {guide.faqs.map((f) => (
                    <details key={f.q} className={styles.faqItem}>
                      <summary>{f.q}</summary>
                      <p>{f.a}</p>
                    </details>
                  ))}
                </div>
              </section>
            ) : null}
          </>
        ) : (
          <section className={styles.section}>
            <p className={styles.lede}>
              A detailed {profile.name} scam guide is in preparation. In the meantime, review the official government
              advisories below before you travel, and practise your response with the{" "}
              <Link href="/challenge/travelsafe/start?mode=diagnostic">free TravelSafe check</Link>.
            </p>
          </section>
        )}

        <section className={styles.section}>
          <h2>Official travel advisories for {profile.name}</h2>
          <p className={styles.sourceNote}>
            Fraud and scam wording pulled from the official{" "}
            <a href={profile.sources[0].url} target="_blank" rel="noreferrer">Canadian</a> and{" "}
            <a href={profile.sources[1].url} target="_blank" rel="noreferrer">New Zealand</a> travel advisories. Use the
            government sources for current travel decisions.
          </p>
          <CountryAlert country={profile.slug} />
        </section>

        {nearbyFallback.length ? (
          <section className={styles.section}>
            <h2>Scam guides for nearby destinations</h2>
            <div className={styles.nearbyGrid}>
              {nearbyFallback.map((p) => (
                <Link key={p.slug} href={`/countries/${p.slug}`}>{p.name} →</Link>
              ))}
            </div>
          </section>
        ) : null}

        {guide ? (
          <p className={styles.reviewedNote}>Last reviewed {guide.lastReviewed}. Scams change — always cross-check the official advisory before travelling.</p>
        ) : null}
      </div>
    </PremiumPage>
  );
}
