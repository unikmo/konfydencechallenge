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
            <Link href="/challenge">Challenges</Link>
            <Link href="/#how-it-works">How It Works</Link>
            <Link href="/#for-organizations">For Organizations</Link>
            <Link href="/countries" aria-current="page">Resources</Link>
            <Link href="/contact">Contact</Link>
          </nav>
        </header>

        <section className={styles.hero}>
          <p className={styles.eyebrow}>Country Alert</p>
          <h1>Official travel information. Spot fraud and scams.</h1>

        </section>

        <section className={styles.sourceNotice} aria-label="Official country information sources">
          <p className={styles.eyebrow}>Official sources</p>
          <p>Country information comes from official Canadian and New Zealand travel guidance. We surface the fraud and scam wording those advisories publish, then link you to the original pages. Use government sources for current travel decisions.</p>
        </section>
        <CountryDirectory profiles={profiles} />

        <section className={styles.checkinSection}>
          <div>
            <p className={styles.eyebrow}>Planned, not live</p>
            <h2>Would a voluntary travel check-in help?</h2>
            <p>Tell us what you would want from a future WhatsApp-based check-in. It would be opt-in and would never promise emergency response.</p>
          </div>
          <Link href="/contact?topic=travel-check-in" className={styles.primaryLink}>Join the interest list</Link>
        </section>
        <section className={styles.flowSection} aria-label="How to use the country pages">
          <p className={styles.eyebrow}>The safer sequence</p>
          <div className={styles.flowGrid}>
            <div><span>1</span><strong>Read official advice</strong><p>Start with the current government sources.</p></div>
            <div><span>2</span><strong>Review sourced signals</strong><p>Look for evidence-backed country intelligence.</p></div>
            <div><span>3</span><strong>Practise under pressure</strong><p>Use TravelSafe to rehearse your response.</p></div>
          </div>
        </section>

        <section className={styles.practice}>
          <div><p className={styles.eyebrow}>Practise before you travel</p><h2>How would you react under pressure?</h2><p>Start with the TravelSafe Free Readiness Check, then unlock the Full Challenge when you are ready.</p></div>
          <Link href="/challenge/travelsafe/start?mode=diagnostic" className={styles.primaryLink}>Start Free Readiness Check</Link>
        </section>

        <section className={styles.affiliate}>
          <p className={styles.eyebrow}>Travel and book-tour resources</p>
          <h2>Useful next steps, clearly labelled.</h2>
          <p>Approved travel, insurance, tour, and book-tour partners can appear here after the safety guidance. Affiliate relationships will be disclosed beside every relevant link.</p>
        </section>

        <footer className={styles.footer}>
          <Link href="/">Home</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/imprint">Imprint</Link>
          <Link href="/privacy-policy">Privacy</Link>
          <Link href="/terms-of-service">Terms</Link>
          <Link href="/cookie-policy">Cookies</Link>
        </footer>
      </div>
    </main>
  );
}

