import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { COUNTRY_PROFILES } from "@/lib/countries";
import { dominantPatterns, type HackKey } from "@/lib/country-guides";
import { COUNTRY_GUIDES_DE, COUNTRY_NAME_DE, HACK_LABEL_DE, HACK_DEF_DE } from "@/lib/country-guides-de";
import { PremiumPageDe } from "@/components/PremiumSiteChrome";
import CountryAlert from "../../../countries/CountryAlert";
import styles from "../../../countries/countries.module.css";

export function generateStaticParams() {
  return Object.keys(COUNTRY_GUIDES_DE).map((country) => ({ country }));
}

export async function generateMetadata(props: { params: Promise<{ country: string }> }): Promise<Metadata> {
  const { country } = await props.params;
  const profile = COUNTRY_PROFILES[country];
  const guide = COUNTRY_GUIDES_DE[country];
  if (!profile || !guide) return {};
  const name = COUNTRY_NAME_DE[country] ?? profile.name;
  return {
    title: { absolute: `Häufige Betrugsmaschen in ${name} (${new Date().getFullYear()}) — und wie du sie vermeidest | Konfydence` },
    description: `Die Betrugsmaschen, auf die Reisende in ${name} tatsächlich treffen — wie jede funktioniert, welche Drucktaktik dahintersteckt, und der einfache Schritt, der sie stoppt.`,
    alternates: {
      canonical: `/de/countries/${country}`,
      languages: { en: `https://konfydence.com/countries/${country}`, de: `https://konfydence.com/de/countries/${country}` },
    },
    openGraph: {
      title: `Häufige Betrugsmaschen in ${name} — und wie du sie vermeidest`,
      description: `Wie die häufigen Betrugsmaschen in ${name} funktionieren, und der eine Schritt, der jede entschärft.`,
      url: `https://konfydence.com/de/countries/${country}`,
      siteName: "Konfydence",
      type: "article",
    },
  };
}

export default async function CountryPageDe(props: { params: Promise<{ country: string }> }) {
  const params = await props.params;
  const profile = COUNTRY_PROFILES[params.country];
  const guide = COUNTRY_GUIDES_DE[params.country];
  if (!profile || !guide) notFound();
  const name = COUNTRY_NAME_DE[params.country] ?? profile.name;

  const nearby = Object.values(COUNTRY_PROFILES)
    .filter((p) => p.slug !== profile.slug && p.region === profile.region && COUNTRY_GUIDES_DE[p.slug])
    .slice(0, 6);
  const nearbyFallback = nearby.length
    ? nearby
    : Object.keys(COUNTRY_GUIDES_DE)
        .filter((slug) => slug !== profile.slug)
        .slice(0, 6)
        .map((slug) => COUNTRY_PROFILES[slug])
        .filter(Boolean);

  const jsonLd: Record<string, unknown>[] = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Länder-Betrugswarnungen", item: "https://konfydence.com/de/countries" },
        { "@type": "ListItem", position: 2, name, item: `https://konfydence.com/de/countries/${profile.slug}` },
      ],
    },
  ];
  if (guide.faqs.length) {
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
    <PremiumPageDe ctaHref="/de/challenge/travelsafe/start?mode=diagnostic" ctaLabel="TravelSafe kostenlos testen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className={styles.shell}>
        <section className={styles.hero}>
          <Link href="/de/countries" className={styles.back}>← Länder-Betrugswarnungen</Link>
          <p className={styles.eyebrow}>{profile.continent} · {profile.region}</p>
          <h1>Häufige Betrugsmaschen in {name}</h1>
          <p className={styles.lede}>{guide.intro}</p>
        </section>

        <section className={styles.section}>
          <h2>Die Betrugsmaschen, auf die du tatsächlich triffst</h2>
          <ol className={styles.scamList}>
            {guide.scams.map((scam) => (
              <li key={scam.name} className={`${styles.scamCard} ${styles[`hack${scam.hack}`]}`}>
                <h3>{scam.name}</h3>
                <p className={styles.scamHow}>{scam.how}</p>
                <div className={styles.scamMeta}>
                  <span className={styles.hackChip}>H.A.C.K. · {HACK_LABEL_DE[scam.hack]}</span>
                </div>
                <p className={styles.scamMove}><strong>Der Schritt —</strong> {scam.move}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className={styles.section}>
          <h2>Was diese Betrugsmaschen gemeinsam haben</h2>
          <p className={styles.lede}>
            {(() => {
              const dom = dominantPatterns(guide);
              const names = dom.map((k: HackKey) => HACK_LABEL_DE[k]);
              const phrase = names.length === 1 ? names[0] : names.length === 2 ? `${names[0]} und ${names[1]}` : names.join(", ");
              return `Die meisten Betrugsmaschen in ${name} setzen auf ${phrase}. `;
            })()}
            Egal welcher Trick — der Ausweg ist derselbe: <strong>Anhalten · Abklären · Ansprechen</strong>:
            stopp, bevor du zahlst, ein Dokument hergibst oder jemandem folgst; frag, was die Bitte wirklich will;
            sag es dann laut zu jemandem, dem du vertraust, oder deiner Bank unter der Nummer auf deiner Karte.
          </p>
          <Link href="/de/challenge/travelsafe/start?mode=diagnostic" className={styles.primaryLink}>
            Üben — kostenloser TravelSafe-Check
          </Link>
        </section>

        {guide.faqs.length ? (
          <section className={styles.section}>
            <h2>{name}: Betrugs-FAQ für Reisende</h2>
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

        <section className={styles.section}>
          <h2>Offizielle Reisehinweise für {name}</h2>
          <p className={styles.sourceNote}>
            Betrugs- und Abzockehinweise aus den offiziellen{" "}
            <a href={profile.sources[0].url} target="_blank" rel="noreferrer">kanadischen</a> und{" "}
            <a href={profile.sources[1].url} target="_blank" rel="noreferrer">neuseeländischen</a> Reisehinweisen (Originalzitate auf Englisch).
            Nutz die staatlichen Quellen für aktuelle Reiseentscheidungen.
          </p>
          <CountryAlert country={profile.slug} lang="de" />
        </section>

        {nearbyFallback.length ? (
          <section className={styles.section}>
            <h2>Betrugswarnungen für Ziele in der Nähe</h2>
            <div className={styles.nearbyGrid}>
              {nearbyFallback.map((p) => (
                <Link key={p.slug} href={`/de/countries/${p.slug}`}>{COUNTRY_NAME_DE[p.slug] ?? p.name} →</Link>
              ))}
            </div>
          </section>
        ) : null}

        <section className={styles.section}>
          <h2>H.A.C.K. — die vier Drucktaktiken</h2>
          <p className={styles.sourceNote} style={{ maxWidth: 640 }}>
            Jede Betrugsmasche auf dieser Seite ist mit der genutzten Taktik markiert. Erkenne die Taktik, nicht den Trick.
          </p>
          <dl className={styles.hackDefs}>
            {(["H", "A", "C", "K"] as HackKey[]).map((k) => (
              <div key={k} className={styles[`hack${k}`]}>
                <dt><b>{k}</b> {HACK_LABEL_DE[k]}</dt>
                <dd>{HACK_DEF_DE[k]}</dd>
              </div>
            ))}
          </dl>
          <p className={styles.sourceNote} style={{ maxWidth: 640, marginTop: 16 }}>
            Der Ausweg aus allen vieren: <strong>Anhalten · Abklären · Ansprechen</strong>.
          </p>
        </section>

        <p className={styles.reviewedNote}>Zuletzt geprüft {guide.lastReviewed}. Betrugsmaschen ändern sich — prüf vor der Reise immer den offiziellen Reisehinweis.</p>
      </div>
    </PremiumPageDe>
  );
}
