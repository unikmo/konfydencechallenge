import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { COUNTRY_PROFILES } from "@/lib/countries";
import CountryLandmarkImage from "../CountryLandmarkImage";
import CountryAlert from "../CountryAlert";
import styles from "../countries.module.css";

export function generateStaticParams() {
  return Object.keys(COUNTRY_PROFILES).map((country) => ({ country }));
}

export async function generateMetadata(props: { params: Promise<{ country: string }> }): Promise<Metadata> {
  const { country } = await props.params;
  const profile = COUNTRY_PROFILES[country];
  if (!profile) return {};
  return {
    title: { absolute: `${profile.name} Scam Alerts & Travel Safety | Konfydence` },
    description: `Travel scam-awareness resources and official travel-safety source links for ${profile.name}.`,
    alternates: { canonical: `/countries/${profile.slug}` },
  };
}

export default async function CountryPage(props: { params: Promise<{ country: string }> }) {
  const params = await props.params;
  const profile = COUNTRY_PROFILES[params.country];
  if (!profile) notFound();

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.nav}>
          <Link href="/" className={styles.brand}>Konfydence</Link>
          <nav className={styles.navLinks} aria-label="Main navigation">
            <Link href="/travelsafe">TravelSafe</Link>
            <Link href="/#how-it-works">How It Works</Link>
            <Link href="/country-alerts">Country Scam Alerts</Link>
            <Link href="/#other-challenges">Other Challenges</Link>
            <Link href="/#for-organizations">For Organizations</Link>
          </nav>
        </header>

        <section className={styles.hero}>
          <Link href="/country-alerts" className={styles.back}>Country Scam Alerts</Link>
          <p className={styles.eyebrow}>{profile.continent} / {profile.region}</p>
          <h1>{profile.name}</h1>
        </section>

        <CountryLandmarkImage countryName={profile.name} landmark={profile.landmark} slug={profile.slug} />
        <CountryAlert country={profile.slug} />

        <p className={styles.sourceNote}>
          Travel-safety sources for {profile.name}:{" "}
          {profile.sources.map((source, index) => (
            <span key={source.url}>
              {index > 0 ? " · " : ""}
              <a href={source.url} target="_blank" rel="noreferrer">{source.authority}</a>
            </span>
          ))}
          . Source links are official travel guidance and should not be read as country-specific Konfydence incident claims.
        </p>

        <section className={styles.checkinSection}>
          <div><p className={styles.eyebrow}>Planned, not live</p><h2>Would a voluntary travel check-in help?</h2><p>Tell us what you would want from a future WhatsApp-based check-in. It would be opt-in and would never promise emergency response.</p></div>
          <Link href="/contact?topic=travel-check-in" className={styles.primaryLink}>Join the interest list</Link>
        </section>
        <section className={styles.practice}>
          <div><p className={styles.eyebrow}>TravelSafe</p><h2>Test your response before the trip.</h2><p>Start with the TravelSafe Free Readiness Check, then see which pressure tactic needs more practice before the trip.</p></div>
          <Link href="/challenge/travelsafe/start?mode=diagnostic" className={styles.primaryLink}>Start Free Readiness Check</Link>
        </section>

        <section className={styles.affiliate}><p className={styles.eyebrow}>Travel and book-tour resources</p><h2>Useful partner links belong here, below the evidence.</h2><p>Insurance, transport, tours, and book-tour partners can be added after approval. Every commercial relationship will be labelled clearly.</p></section>

        <footer className={styles.footer}><Link href="/countries">Countries</Link><Link href="/contact">Contact</Link><Link href="/imprint">Imprint</Link><Link href="/privacy-policy">Privacy</Link><Link href="/terms-of-service">Terms</Link><Link href="/cookie-policy">Cookies</Link></footer>
      </div>
    </main>
  );
}
