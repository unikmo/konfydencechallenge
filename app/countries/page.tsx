import Link from "next/link";
import { COUNTRY_PROFILES } from "@/lib/countries";
import CountryDirectory from "./CountryDirectory";
import styles from "./countries.module.css";

export default function CountriesPage() {
  const profiles = Object.values(COUNTRY_PROFILES);

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.nav}>
          <Link href="/" className={styles.brand}>Konfydence</Link>
          <nav className={styles.navLinks} aria-label="Main navigation">
            <Link href="/challenge/travelsafe/start?mode=diagnostic">TravelSafe</Link>
            <Link href="/hack-method">Method</Link>
            <Link href="/challenge">Challenges</Link>
            <Link href="/comasy">For organisations</Link>
          </nav>
        </header>

        <section className={styles.hero}>
          <p className={styles.eyebrow}>Travel intelligence</p>
          <h1>Official guidance, organised around the scams travellers actually face.</h1>
        </section>

        <section className={styles.sourceNotice} aria-label="Official country information sources">
          <p className={styles.eyebrow}>Source discipline</p>
          <p>Country information comes from official Canadian and New Zealand travel guidance. Konfydence surfaces fraud- and scam-relevant wording and links back to the original advisory. Government sources remain the authority for current travel decisions.</p>
        </section>

        <CountryDirectory profiles={profiles} />

        <section className={styles.flowSection} aria-label="How to use the country pages">
          <p className={styles.eyebrow}>The safer sequence</p>
          <div className={styles.flowGrid}>
            <div><span>01</span><strong>Read official advice</strong><p>Start with current government sources, not social posts or forwarded messages.</p></div>
            <div><span>02</span><strong>Notice the pressure pattern</strong><p>Separate the urgency or authority cue from the evidence supporting the request.</p></div>
            <div><span>03</span><strong>Practise before departure</strong><p>Use TravelSafe to rehearse the decision while the stakes are still low.</p></div>
          </div>
        </section>

        <section className={styles.practice}>
          <div><p className={styles.eyebrow}>TravelSafe</p><h2>Test your response before the trip.</h2><p>Eight realistic travel-scam decisions reveal which pressure pattern deserves more practice before departure.</p></div>
          <Link href="/challenge/travelsafe/start?mode=diagnostic" className={styles.primaryLink}>Start free readiness check</Link>
        </section>

        <footer className={styles.footer}>
          <Link href="/">Home</Link><Link href="/challenge">Challenges</Link><Link href="/contact">Contact</Link><Link href="/imprint">Imprint</Link><Link href="/privacy-policy">Privacy</Link><Link href="/terms-of-service">Terms</Link><Link href="/cookie-policy">Cookies</Link>
        </footer>
      </div>
    </main>
  );
}
