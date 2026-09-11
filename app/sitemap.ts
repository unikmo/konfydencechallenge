import type { MetadataRoute } from "next";
import { COUNTRY_PROFILES } from "@/lib/countries";
import { COUNTRY_GUIDES } from "@/lib/country-guides";

const BASE = "https://konfydence.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/comasy`, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/comasy/pilot`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/comasy/methodology`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/comasy/security`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/comasy/nis2-security-awareness`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/security-awareness-training`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/cybersecurity-awareness-training-for-employees`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/social-engineering-training`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/security-decision-simulation`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/hack-method`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/challenge`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/travelsafe`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/lockscreens`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/lockscreens/security-awareness-lock-screens`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/lockscreens/intune`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/lockscreens/jamf`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/lockscreens/security-awareness-posters`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/lockscreens/phishing-awareness-between-trainings`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/lockscreens/family-scam-protection`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/lockscreens/workplace/order`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/lockscreens/school/order`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/free-scam-safety-pack`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/countries`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/country-alerts`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE}/pricing`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/gift`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/contact`, changeFrequency: "yearly", priority: 0.5 },
    { url: `${BASE}/privacy-policy`, changeFrequency: "yearly", priority: 0.4 },
    { url: `${BASE}/terms-of-service`, changeFrequency: "yearly", priority: 0.4 },
    { url: `${BASE}/cookie-policy`, changeFrequency: "yearly", priority: 0.4 },
    { url: `${BASE}/imprint`, changeFrequency: "yearly", priority: 0.4 },
    // German funnel (Stage 4, in progress) — only the Familie edition plays in German so far.
    { url: `${BASE}/de`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/de/challenge`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/de/pricing`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/de/impressum`, changeFrequency: "yearly", priority: 0.4 },
    { url: `${BASE}/de/datenschutz`, changeFrequency: "yearly", priority: 0.4 },
    { url: `${BASE}/de/agb`, changeFrequency: "yearly", priority: 0.4 },
  ];

  const countryPages: MetadataRoute.Sitemap = Object.values(COUNTRY_PROFILES)
    .filter((profile) => COUNTRY_GUIDES[profile.slug]?.status === "published")
    .map((profile) => ({
      url: `${BASE}/countries/${profile.slug}`,
      changeFrequency: "monthly",
      priority: 0.6,
    }));

  return [...staticPages, ...countryPages];
}
