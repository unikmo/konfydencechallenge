import Link from "next/link";
import { notFound } from "next/navigation";
import { COUNTRY_PROFILES } from "@/lib/countries";
import CountryLandmarkImage from "../CountryLandmarkImage";
import CountryAlert from "../CountryAlert";
import styles from "../countries.module.css";

export function generateStaticParams() {
  return Object.keys(COUNTRY_PROFILES).map((country) => ({ country }));
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
            <Link href="/challenge/travelsafe/start?mode=diagnostic">TravelSafe</Link>
            <Link href="/countries">Countries</Link>
            <Link href="/hack-method">Method</Link>
            <Link href="/challenge">Challenges</Link>
          </nav>
        </header>

        <section className={styles.hero}>
          <Link href="/countries" className={styles.back}>← All countries</Link>
          <p className={styles.eyebrow}>{profile.continent} / {profile.region}</p>
          <h1>{profile.name}</h1>
        </section>

        <CountryLandmarkImage countryName={profile.name} landmark={profile.landmark} slug={profile.slug} />

        <CountryAlert country={profile.slug} />

        <p className={styles.sourceNote}>Official source pages: <a href={profile.sources[0].url} target="_blank" rel="noreferrer">Canada</a> · <a href={profile.sources[1].url} target="_blank" rel="noreferrer">New Zealand</a>. Open the original advisories before making a travel decision.</p>

        <section className={styles.practice}>
          <div>
            <p className={styles.eyebrow}>TravelSafe</p>
            <h2>Read the advice. Then rehearse the decision.</h2>
            <p>Official guidance tells you what to watch for. TravelSafe lets you practise what you would do when the pressure arrives in a hotel message, payment request, taxi, booking flow or public network.</p>
          </div>
          <Link href="/challenge/travelsafe/start?mode=diagnostic" className={styles.primaryLink}>Start free readiness check</Link>
        </section>

        <footer className={styles.footer}>
          <Link href="/countries">Countries</Link><Link href="/challenge">Challenges</Link><Link href="/contact">Contact</Link><Link href="/imprint">Imprint</Link><Link href="/privacy-policy">Privacy</Link><Link href="/terms-of-service">Terms</Link><Link href="/cookie-policy">Cookies</Link>
        </footer>
      </div>
    </main>
  );
}
