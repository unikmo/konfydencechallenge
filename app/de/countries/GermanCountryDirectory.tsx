import Link from "next/link";
import { COUNTRY_PROFILES } from "@/lib/countries";
import { COUNTRY_NAME_DE, CONTINENT_DE } from "@/lib/country-guides-de";
import styles from "../../countries/countries.module.css";

const CONTINENTS_EN = ["North America", "South America", "Europe", "Africa", "Asia", "Oceania"];

/**
 * Deliberately lean compared to the English CountryDirectory: this only
 * lists the ~36 countries with a finished German guide translation (see
 * lib/country-guides-de.ts), not the full ~200-country English directory —
 * same "focused funnel, not a full site translation" precedent as the rest
 * of the German site. No search/filter UI at this scale; a flat
 * continent-grouped grid is enough.
 */
export default function GermanCountryDirectory({ slugs }: { slugs: string[] }) {
  const profiles = slugs.map((slug) => COUNTRY_PROFILES[slug]).filter(Boolean);
  const grouped = CONTINENTS_EN.map((continent) => ({
    continent,
    profiles: profiles.filter((p) => p.continent === continent),
  })).filter((g) => g.profiles.length);

  return (
    <>
      {grouped.map((group) => (
        <section className={styles.section} key={group.continent}>
          <p className={styles.eyebrow}>{CONTINENT_DE[group.continent] ?? group.continent}</p>
          <h2>Reisehinweise nach Land</h2>
          <div className={styles.countryGrid}>
            {group.profiles.map((profile) => (
              <article className={styles.countryCard} key={profile.slug}>
                <div>
                  <p className={styles.countryRegion}>{profile.region}</p>
                  <h3>{COUNTRY_NAME_DE[profile.slug] ?? profile.name}</h3>
                </div>
                <Link href={`/de/countries/${profile.slug}`} className={styles.countryLink}>
                  Betrugswarnungen ansehen
                </Link>
              </article>
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
