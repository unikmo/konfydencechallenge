import Link from "next/link";
import { notFound } from "next/navigation";
import { COUNTRY_PROFILES } from "@/lib/countries";
import CountryLandmarkImage from "../CountryLandmarkImage";
import OfficialRiskAssessment from "../OfficialRiskAssessment";
import styles from "../countries.module.css";

export function generateStaticParams() {
  return Object.keys(COUNTRY_PROFILES).map((country) => ({ country }));
}

export default function CountryPage({ params }: { params: { country: string } }) {
  const profile = COUNTRY_PROFILES[params.country];
  if (!profile) notFound();

  const showProducts = profile.continent === "Europe" || profile.continent === "North America";

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.nav}>
          <Link href="/" className={styles.brand}>Konfydence</Link>
          <nav className={styles.navLinks}>
            <Link href="/countries">All countries</Link>
            <Link href="/challenge">Challenge</Link>
            <Link href="/products">Products</Link>
          </nav>
        </header>

        <section className={styles.hero}>
          <Link href="/countries" className={styles.back}>Travel Scams &amp; Risks</Link>
          <p className={styles.eyebrow}>{profile.continent} Â· {profile.region}</p>
          <h1>{profile.name}</h1>

        </section>

        <CountryLandmarkImage
          countryName={profile.name}
          landmark={profile.landmark}
          slug={profile.slug}
        />

        <OfficialRiskAssessment country={profile.slug} />

        <p className={styles.riskSource}>Source: official <a href={profile.sources[0].url} target="_blank" rel="noreferrer">Canada</a> / <a href={profile.sources[1].url} target="_blank" rel="noreferrer">New Zealand</a> information.</p>
        {showProducts ? (
          <section className={styles.productSection}>
            <div className={styles.sourceHeading}>
              <p className={styles.eyebrow}>Konfydence Safety Suite</p>
              <h2>Keep the safer action visible.</h2>
              <p>Practical reminders for trips, homes, and workspaces. Digital add-ons are available immediately; physical fulfilment can expand by region as shipping partners are approved.</p>
            </div>
            <div className={styles.productGrid}>
              <article className={styles.productCard}>
                <p className={styles.productType}>Physical reminder</p>
                <h3>KonfyGuard Wallet Card</h3>
                <p>Keep the HACK pause where payment pressure often arrives.</p>
                <Link href="/products">View product</Link>
              </article>
              <article className={styles.productCard}>
                <p className={styles.productType}>Physical reminder</p>
                <h3>KonfyGuard Fridge Magnet</h3>
                <p>A visible household cue to pause, verify, then act.</p>
                <Link href="/products">View product</Link>
              </article>
              <article className={styles.productCard}>
                <p className={styles.productType}>Free digital add-on</p>
                <h3>Phone lockscreen</h3>
                <p>Put the pause cue on the screen you check most.</p>
                <a href="/assets/lockscreens/konfyguard-phone-lockscreen.pdf" download>Download free</a>
              </article>
              <article className={styles.productCard}>
                <p className={styles.productType}>Free digital add-on</p>
                <h3>Computer lockscreen</h3>
                <p>Keep a reminder visible where work requests arrive.</p>
                <a href="/assets/lockscreens/konfyguard-computer-lockscreen.pdf" download>Download free</a>
              </article>
            </div>
          </section>
        ) : null}

        <section className={styles.checkinSection}>
          <div>
            <p className={styles.eyebrow}>Planned, not live</p>
            <h2>Would a voluntary travel check-in help?</h2>
            <p>Tell us what you would want from a future WhatsApp-based check-in. It would be opt-in and would never promise emergency response.</p>
          </div>
          <Link href="/contact?topic=travel-check-in" className={styles.primaryLink}>Join the interest list</Link>
        </section>
        <section className={styles.practice}>
          <div>
            <p className={styles.eyebrow}>TravelSafe</p>
            <h2>Test your response before the trip.</h2>
            <p>Face short, travel-framed scenarios and see which pressure tactic needs more practice.</p>
          </div>
          <Link href="/challenge/travelsafe/start?mode=diagnostic" className={styles.primaryLink}>Take the free check</Link>
        </section>

        <section className={styles.affiliate}>
          <p className={styles.eyebrow}>Travel and book-tour resources</p>
          <h2>Useful partner links belong here, below the evidence.</h2>
          <p>Insurance, transport, tours, and book-tour partners can be added after approval. Every commercial relationship will be labelled clearly.</p>
        </section>

        <footer className={styles.footer}>
          <Link href="/countries">Countries</Link>
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




