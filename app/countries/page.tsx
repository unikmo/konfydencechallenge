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
          <nav className={styles.navLinks} aria-label="Main navigation"><Link href="/challenge/travelsafe/start?mode=diagnostic">TravelSafe</Link><Link href="/hack-method">H.A.C.K.</Link><Link href="/challenge">Challenges</Link><Link href="/comasy">For organisations</Link></nav>
        </header>

        <section className={styles.hero}><p className={styles.eyebrow}>Travel intelligence</p><h1>Know the local signal.<br/>Rehearse the pressure.</h1><p className={styles.lede}>Official fraud and scam guidance by country, presented before commercial travel content. Read the evidence first. Then use TravelSafe to practise how you would respond.</p></section>

        <section className={styles.sourceNotice} aria-label="Official country information sources"><p className={styles.eyebrow}>Evidence first</p><p>Country information is grounded in official Canadian and New Zealand travel guidance and links back to the original advisory pages. Government sources remain the authority for current travel decisions.</p></section>
        <CountryDirectory profiles={profiles} />

        <section className={styles.flowSection} aria-label="How to use the country pages"><p className={styles.eyebrow}>The safer sequence</p><div className={styles.flowGrid}><div><span>1</span><strong>Read official advice</strong><p>Start with current government sources.</p></div><div><span>2</span><strong>Review scam signals</strong><p>Focus on the fraud patterns flagged for the destination.</p></div><div><span>3</span><strong>Practise the response</strong><p>Use TravelSafe to rehearse decisions under pressure.</p></div></div></section>

        <section className={styles.practice}><div><p className={styles.eyebrow}>TravelSafe</p><h2>Test your response before the trip.</h2><p>Eight realistic decisions reveal which pressure pattern deserves more practice before you travel.</p></div><Link href="/challenge/travelsafe/start?mode=diagnostic" className={styles.primaryLink}>Start the free readiness check <span>↗</span></Link></section>

        <section className={styles.checkinSection}><div><p className={styles.eyebrow}>Travel Check-In research</p><h2>Help shape a voluntary check-in service.</h2><p>We are researching an opt-in WhatsApp check-in concept. It would never replace official emergency services or promise emergency response.</p></div><Link href="/contact?topic=travel-check-in" className={styles.primaryLink}>Share what would help <span>↗</span></Link></section>

        <section className={styles.affiliate}><p className={styles.eyebrow}>Commercial transparency</p><h2>Guidance comes before recommendations.</h2><p>Any future insurance, transport, tour or book-tour relationship will appear after the safety guidance and will be labelled clearly beside the relevant link.</p></section>

        <footer className={styles.footer}><Link href="/">Home</Link><Link href="/challenge">Challenges</Link><Link href="/contact">Contact</Link><Link href="/imprint">Imprint</Link><Link href="/privacy-policy">Privacy</Link><Link href="/terms-of-service">Terms</Link><Link href="/cookie-policy">Cookies</Link></footer>
      </div>
    </main>
  );
}
