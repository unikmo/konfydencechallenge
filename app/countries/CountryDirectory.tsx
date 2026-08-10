"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { CountryProfile } from "@/lib/countries";
import styles from "./countries.module.css";

const CONTINENTS = ["North America", "South America", "Europe", "Africa", "Asia", "Oceania"];

export default function CountryDirectory({ profiles }: { profiles: CountryProfile[] }) {
  const [query, setQuery] = useState("");
  const [continent, setContinent] = useState("All continents");

  const filteredProfiles = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return profiles.filter((profile) => {
      const matchesContinent = continent === "All continents" || profile.continent === continent;
      const matchesQuery = !normalizedQuery
        || profile.name.toLowerCase().includes(normalizedQuery)
        || profile.region.toLowerCase().includes(normalizedQuery);
      return matchesContinent && matchesQuery;
    });
  }, [continent, profiles, query]);

  const grouped = CONTINENTS.map((name) => ({
    name,
    profiles: filteredProfiles.filter((profile) => profile.continent === name),
  })).filter((group) => group.profiles.length);

  return (
    <>
      <section className={styles.directoryTools} aria-label="Find a country">
        <div className={styles.filterRow}>
          <label className={styles.filterLabel}>
            <span>Search country or region</span>
            <input
              className={styles.searchInput}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Try France or Caribbean"
            />
          </label>
          <label className={styles.filterLabel}>
            <span>Continent</span>
            <select
              className={styles.continentSelect}
              value={continent}
              onChange={(event) => setContinent(event.target.value)}
            >
              <option>All continents</option>
              {CONTINENTS.map((name) => <option key={name}>{name}</option>)}
            </select>
          </label>
          <button
            className={styles.clearButton}
            type="button"
            onClick={() => {
              setQuery("");
              setContinent("All continents");
            }}
          >
            Clear filters
          </button>
        </div>
        <p className={styles.resultCount} aria-live="polite">
          {filteredProfiles.length} {filteredProfiles.length === 1 ? "country" : "countries"} shown
        </p>
      </section>

      <nav className={styles.continentNav} aria-label="Continents">
        {grouped.map((group) => (
          <a key={group.name} href={"#" + group.name.toLowerCase().replaceAll(" ", "-")}>
            {group.name}
          </a>
        ))}
      </nav>

      {grouped.map((group) => (
        <section className={styles.section} id={group.name.toLowerCase().replaceAll(" ", "-")} key={group.name}>
          <p className={styles.eyebrow}>{group.name}</p>
          <h2>Travel guidance by country</h2>
          <div className={styles.countryGrid}>
            {group.profiles.map((profile) => (
              <article className={styles.countryCard} key={profile.slug}>
                <div>
                  <p className={styles.countryRegion}>{profile.region}</p>
                  <h3>{profile.name}</h3>
                </div>
                <Link href={"/countries/" + profile.slug} className={styles.countryLink}>
                  Open Country Scam Alerts
                </Link>
              </article>
            ))}
          </div>
        </section>
      ))}

      {!grouped.length ? (
        <p className={styles.empty}>No country matches those filters. Clear the search and try again.</p>
      ) : null}
    </>
  );
}

