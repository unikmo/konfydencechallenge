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
        <header className={styles.nav}><Link href="/" className={styles.brand}>Konfydence</Link><nav className={styles.navLinks} aria-label="Main navigation"><Link href="/challenge/travelsafe/start?mode=diagnostic">TravelSafe</Link><Link href="/hack-method">H.A.C.K.</Link><Link href="/countries">Travel intelligence</Link><Link href="/challenge">Challenges</Link></nav></header>

        <section className={styles.hero}><Link href="/countries" className={styles.back}>← Travel intelligence</Link><p className={styles.eyebrow}>{profile.continent} / {profile.region}</p><h1>{profile.name}</h1><p className={styles.lede}>Official fraud and scam signals first. Practical decision rehearsal second.</p></section>

        <CountryLandmarkImage countryName={profile.name} landmark={profile.landmark} slug={profile.slug} />
        <CountryAlert country={profile.slug} />
        <p className={styles.sourceNote}>Primary fraud sources: official <a href={profile.sources[0].url} target="_blank" rel="noreferrer">Canadian</a> and <a href={profile.sources[1].url} target="_blank" rel="noreferrer">New Zealand</a> travel information.</p>

        <section className={styles.practice}><div><p className={styles.eyebrow}>TravelSafe</p><h2>Now rehearse the pressure.</h2><p>Knowing a scam exists is useful. Practising the decision you may need to make under urgency, authority or unfamiliarity is different.</p></div><Link href="/challenge/travelsafe/start?mode=diagnostic" className={styles.primaryLink}>Start the free readiness check <span>↗</span></Link></section>

        <section className={styles.checkinSection}><div><p className={styles.eyebrow}>Travel Check-In research</p><h2>Help shape a voluntary check-in service.</h2><p>We are researching an opt-in WhatsApp check-in concept. It would never replace official emergency services or promise emergency response.</p></div><Link href="/contact?topic=travel-check-in" className={styles.primaryLink}>Share what would help <span>↗</span></Link></section>

        <section className={styles.affiliate}><p className={styles.eyebrow}>Commercial transparency</p><h2>Evidence stays separate from recommendations.</h2><p>Any future commercial travel links will appear below the safety guidance and be clearly labelled at the point of use.</p></section>

        <footer className={styles.footer}><Link href="/countries">Countries</Link><Link href="/challenge">Challenges</Link><Link href="/contact">Contact</Link><Link href="/imprint">Imprint</Link><Link href="/privacy-policy">Privacy</Link><Link href="/terms-of-service">Terms</Link><Link href="/cookie-policy">Cookies</Link></footer>
      </div>
    </main>
  );
}
