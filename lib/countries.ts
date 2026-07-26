import { COUNTRY_LANDMARKS } from "@/lib/country-landmarks";

export type CountrySource = {
  authority: string;
  name: string;
  url: string;
  description: string;
};

export type CountryScamResearch = {
  title: string;
  signal: string;
  summary: string;
  sourceUrls: string[];
  lastReviewed: string;
  status: "draft" | "published";
};
export type CountryProfile = {
  slug: string;
  name: string;
  continent: string;
  region: string;
  landmark: string;
  scamResearch: CountryScamResearch[];
  sources: CountrySource[];
};

type CountryRow = readonly [name: string, slug: string, continent: string, region: string];

const COUNTRY_ROWS: CountryRow[] = [
  ["Algeria", "algeria", "Africa", "North Africa"],
  ["Angola", "angola", "Africa", "Southern Africa"],
  ["Benin", "benin", "Africa", "West Africa"],
  ["Botswana", "botswana", "Africa", "Southern Africa"],
  ["Burkina Faso", "burkina-faso", "Africa", "West Africa"],
  ["Burundi", "burundi", "Africa", "East Africa"],
  ["Cabo Verde", "cabo-verde", "Africa", "West Africa"],
  ["Cameroon", "cameroon", "Africa", "Central Africa"],
  ["Central African Republic", "central-african-republic", "Africa", "Central Africa"],
  ["Chad", "chad", "Africa", "Central Africa"],
  ["Comoros", "comoros", "Africa", "East Africa"],
  ["Congo (Republic of the Congo)", "republic-of-the-congo", "Africa", "Central Africa"],
  ["Democratic Republic of the Congo", "democratic-republic-of-the-congo", "Africa", "Central Africa"],
  ["Cote d'Ivoire", "cote-d-ivoire", "Africa", "West Africa"],
  ["Djibouti", "djibouti", "Africa", "East Africa"],
  ["Egypt", "egypt", "Africa", "North Africa"],
  ["Equatorial Guinea", "equatorial-guinea", "Africa", "Central Africa"],
  ["Eritrea", "eritrea", "Africa", "East Africa"],
  ["Eswatini", "eswatini", "Africa", "Southern Africa"],
  ["Ethiopia", "ethiopia", "Africa", "East Africa"],
  ["Gabon", "gabon", "Africa", "Central Africa"],
  ["The Gambia", "gambia", "Africa", "West Africa"],
  ["Ghana", "ghana", "Africa", "West Africa"],
  ["Guinea", "guinea", "Africa", "West Africa"],
  ["Guinea-Bissau", "guinea-bissau", "Africa", "West Africa"],
  ["Kenya", "kenya", "Africa", "East Africa"],
  ["Lesotho", "lesotho", "Africa", "Southern Africa"],
  ["Liberia", "liberia", "Africa", "West Africa"],
  ["Libya", "libya", "Africa", "North Africa"],
  ["Madagascar", "madagascar", "Africa", "East Africa"],
  ["Malawi", "malawi", "Africa", "Southern Africa"],
  ["Mali", "mali", "Africa", "West Africa"],
  ["Mauritania", "mauritania", "Africa", "West Africa"],
  ["Mauritius", "mauritius", "Africa", "East Africa"],
  ["Morocco", "morocco", "Africa", "North Africa"],
  ["Mozambique", "mozambique", "Africa", "Southern Africa"],
  ["Namibia", "namibia", "Africa", "Southern Africa"],
  ["Niger", "niger", "Africa", "West Africa"],
  ["Nigeria", "nigeria", "Africa", "West Africa"],
  ["Rwanda", "rwanda", "Africa", "East Africa"],
  ["Sao Tome and Principe", "sao-tome-and-principe", "Africa", "Central Africa"],
  ["Senegal", "senegal", "Africa", "West Africa"],
  ["Seychelles", "seychelles", "Africa", "East Africa"],
  ["Sierra Leone", "sierra-leone", "Africa", "West Africa"],
  ["Somalia", "somalia", "Africa", "East Africa"],
  ["South Africa", "south-africa", "Africa", "Southern Africa"],
  ["South Sudan", "south-sudan", "Africa", "East Africa"],
  ["Sudan", "sudan", "Africa", "North Africa"],
  ["Tanzania", "tanzania", "Africa", "East Africa"],
  ["Togo", "togo", "Africa", "West Africa"],
  ["Tunisia", "tunisia", "Africa", "North Africa"],
  ["Uganda", "uganda", "Africa", "East Africa"],
  ["Zambia", "zambia", "Africa", "Southern Africa"],
  ["Zimbabwe", "zimbabwe", "Africa", "Southern Africa"],

  ["Afghanistan", "afghanistan", "Asia", "Central Asia"],
  ["Armenia", "armenia", "Asia", "West Asia"],
  ["Azerbaijan", "azerbaijan", "Asia", "West Asia"],
  ["Bahrain", "bahrain", "Asia", "Gulf"],
  ["Bangladesh", "bangladesh", "Asia", "South Asia"],
  ["Bhutan", "bhutan", "Asia", "South Asia"],
  ["Brunei", "brunei", "Asia", "Southeast Asia"],
  ["Cambodia", "cambodia", "Asia", "Southeast Asia"],
  ["China", "china", "Asia", "East Asia"],
  ["Georgia", "georgia", "Asia", "West Asia"],
  ["India", "india", "Asia", "South Asia"],
  ["Indonesia", "indonesia", "Asia", "Southeast Asia"],
  ["Iran", "iran", "Asia", "West Asia"],
  ["Iraq", "iraq", "Asia", "West Asia"],
  ["Israel", "israel", "Asia", "West Asia"],
  ["Japan", "japan", "Asia", "East Asia"],
  ["Jordan", "jordan", "Asia", "West Asia"],
  ["Kazakhstan", "kazakhstan", "Asia", "Central Asia"],
  ["Kuwait", "kuwait", "Asia", "Gulf"],
  ["Kyrgyzstan", "kyrgyzstan", "Asia", "Central Asia"],
  ["Laos", "laos", "Asia", "Southeast Asia"],
  ["Lebanon", "lebanon", "Asia", "West Asia"],
  ["Malaysia", "malaysia", "Asia", "Southeast Asia"],
  ["Maldives", "maldives", "Asia", "South Asia"],
  ["Mongolia", "mongolia", "Asia", "East Asia"],
  ["Myanmar", "myanmar", "Asia", "Southeast Asia"],
  ["Nepal", "nepal", "Asia", "South Asia"],
  ["North Korea", "north-korea", "Asia", "East Asia"],
  ["Oman", "oman", "Asia", "Gulf"],
  ["Pakistan", "pakistan", "Asia", "South Asia"],
  ["Palestine", "palestine", "Asia", "West Asia"],
  ["Philippines", "philippines", "Asia", "Southeast Asia"],
  ["Qatar", "qatar", "Asia", "Gulf"],
  ["Saudi Arabia", "saudi-arabia", "Asia", "Gulf"],
  ["Singapore", "singapore", "Asia", "Southeast Asia"],
  ["South Korea", "south-korea", "Asia", "East Asia"],
  ["Sri Lanka", "sri-lanka", "Asia", "South Asia"],
  ["Syria", "syria", "Asia", "West Asia"],
  ["Tajikistan", "tajikistan", "Asia", "Central Asia"],
  ["Thailand", "thailand", "Asia", "Southeast Asia"],
  ["Timor-Leste", "timor-leste", "Asia", "Southeast Asia"],
  ["Turkey", "turkey", "Asia", "West Asia"],
  ["Turkmenistan", "turkmenistan", "Asia", "Central Asia"],
  ["United Arab Emirates", "united-arab-emirates", "Asia", "Gulf"],
  ["Uzbekistan", "uzbekistan", "Asia", "Central Asia"],
  ["Vietnam", "vietnam", "Asia", "Southeast Asia"],
  ["Yemen", "yemen", "Asia", "West Asia"],

  ["Albania", "albania", "Europe", "Southeastern Europe"],
  ["Andorra", "andorra", "Europe", "Western Europe"],
  ["Austria", "austria", "Europe", "Central Europe"],
  ["Belarus", "belarus", "Europe", "Eastern Europe"],
  ["Belgium", "belgium", "Europe", "Western Europe"],
  ["Bosnia and Herzegovina", "bosnia-and-herzegovina", "Europe", "Southeastern Europe"],
  ["Bulgaria", "bulgaria", "Europe", "Southeastern Europe"],
  ["Croatia", "croatia", "Europe", "Southeastern Europe"],
  ["Cyprus", "cyprus", "Europe", "Eastern Mediterranean"],
  ["Czechia", "czechia", "Europe", "Central Europe"],
  ["Denmark", "denmark", "Europe", "Northern Europe"],
  ["Estonia", "estonia", "Europe", "Northern Europe"],
  ["Finland", "finland", "Europe", "Northern Europe"],
  ["France", "france", "Europe", "Western Europe"],
  ["Germany", "germany", "Europe", "Central Europe"],
  ["Greece", "greece", "Europe", "Southeastern Europe"],
  ["Hungary", "hungary", "Europe", "Central Europe"],
  ["Iceland", "iceland", "Europe", "Northern Europe"],
  ["Ireland", "ireland", "Europe", "Western Europe"],
  ["Italy", "italy", "Europe", "Southern Europe"],
  ["Latvia", "latvia", "Europe", "Northern Europe"],
  ["Liechtenstein", "liechtenstein", "Europe", "Central Europe"],
  ["Lithuania", "lithuania", "Europe", "Northern Europe"],
  ["Luxembourg", "luxembourg", "Europe", "Western Europe"],
  ["Malta", "malta", "Europe", "Southern Europe"],
  ["Moldova", "moldova", "Europe", "Eastern Europe"],
  ["Monaco", "monaco", "Europe", "Western Europe"],
  ["Montenegro", "montenegro", "Europe", "Southeastern Europe"],
  ["Netherlands", "netherlands", "Europe", "Western Europe"],
  ["North Macedonia", "north-macedonia", "Europe", "Southeastern Europe"],
  ["Norway", "norway", "Europe", "Northern Europe"],
  ["Poland", "poland", "Europe", "Central Europe"],
  ["Portugal", "portugal", "Europe", "Southern Europe"],
  ["Romania", "romania", "Europe", "Eastern Europe"],
  ["Russia", "russia", "Europe", "Eastern Europe"],
  ["San Marino", "san-marino", "Europe", "Southern Europe"],
  ["Serbia", "serbia", "Europe", "Southeastern Europe"],
  ["Slovakia", "slovakia", "Europe", "Central Europe"],
  ["Slovenia", "slovenia", "Europe", "Central Europe"],
  ["Spain", "spain", "Europe", "Southern Europe"],
  ["Sweden", "sweden", "Europe", "Northern Europe"],
  ["Switzerland", "switzerland", "Europe", "Central Europe"],
  ["Ukraine", "ukraine", "Europe", "Eastern Europe"],
  ["United Kingdom", "united-kingdom", "Europe", "Western Europe"],
  ["Vatican City", "vatican-city", "Europe", "Southern Europe"],

  ["Antigua and Barbuda", "antigua-and-barbuda", "North America", "Caribbean"],
  ["Bahamas", "bahamas", "North America", "Caribbean"],
  ["Barbados", "barbados", "North America", "Caribbean"],
  ["Belize", "belize", "North America", "Central America"],
  ["Canada", "canada", "North America", "North America"],
  ["Costa Rica", "costa-rica", "North America", "Central America"],
  ["Cuba", "cuba", "North America", "Caribbean"],
  ["Dominica", "dominica", "North America", "Caribbean"],
  ["Dominican Republic", "dominican-republic", "North America", "Caribbean"],
  ["El Salvador", "el-salvador", "North America", "Central America"],
  ["Grenada", "grenada", "North America", "Caribbean"],
  ["Guatemala", "guatemala", "North America", "Central America"],
  ["Haiti", "haiti", "North America", "Caribbean"],
  ["Honduras", "honduras", "North America", "Central America"],
  ["Jamaica", "jamaica", "North America", "Caribbean"],
  ["Mexico", "mexico", "North America", "North America"],
  ["Nicaragua", "nicaragua", "North America", "Central America"],
  ["Panama", "panama", "North America", "Central America"],
  ["Saint Kitts and Nevis", "saint-kitts-and-nevis", "North America", "Caribbean"],
  ["Saint Lucia", "saint-lucia", "North America", "Caribbean"],
  ["Saint Vincent and the Grenadines", "saint-vincent-and-the-grenadines", "North America", "Caribbean"],
  ["Trinidad and Tobago", "trinidad-and-tobago", "North America", "Caribbean"],
  ["United States", "united-states", "North America", "North America"],

  ["Argentina", "argentina", "South America", "South America"],
  ["Bolivia", "bolivia", "South America", "South America"],
  ["Brazil", "brazil", "South America", "South America"],
  ["Chile", "chile", "South America", "South America"],
  ["Colombia", "colombia", "South America", "South America"],
  ["Ecuador", "ecuador", "South America", "South America"],
  ["Guyana", "guyana", "South America", "South America"],
  ["Paraguay", "paraguay", "South America", "South America"],
  ["Peru", "peru", "South America", "South America"],
  ["Suriname", "suriname", "South America", "South America"],
  ["Uruguay", "uruguay", "South America", "South America"],
  ["Venezuela", "venezuela", "South America", "South America"],

  ["Australia", "australia", "Oceania", "Australasia"],
  ["Fiji", "fiji", "Oceania", "Melanesia"],
  ["Kiribati", "kiribati", "Oceania", "Micronesia"],
  ["Marshall Islands", "marshall-islands", "Oceania", "Micronesia"],
  ["Micronesia", "micronesia", "Oceania", "Micronesia"],
  ["Nauru", "nauru", "Oceania", "Micronesia"],
  ["New Zealand", "new-zealand", "Oceania", "Australasia"],
  ["Palau", "palau", "Oceania", "Micronesia"],
  ["Papua New Guinea", "papua-new-guinea", "Oceania", "Melanesia"],
  ["Samoa", "samoa", "Oceania", "Polynesia"],
  ["Solomon Islands", "solomon-islands", "Oceania", "Melanesia"],
  ["Tonga", "tonga", "Oceania", "Polynesia"],
  ["Tuvalu", "tuvalu", "Oceania", "Polynesia"],
  ["Vanuatu", "vanuatu", "Oceania", "Melanesia"],
];

const EMPTY_SCAM_RESEARCH: CountryScamResearch[] = [];

const CANADA_SOURCE_SLUGS: Record<string, string> = {
  "republic-of-the-congo": "congo-brazzaville",
  "democratic-republic-of-the-congo": "congo-kinshasa",
  "cote-d-ivoire": "cote-d-ivoire-ivory-coast",
  "gambia": "gambia-the",
  "israel": "israel-and-palestine",
  "palestine": "israel-and-palestine",
  "timor-leste": "timor-leste-east-timor",
  "micronesia": "micronesia-fsm",
  "saint-vincent-and-the-grenadines": "saint-vincent-the-grenadines",
};

const NEW_ZEALAND_SOURCE_SLUGS: Record<string, string> = {
  "gambia": "the-gambia",
  "cote-d-ivoire": "cote-d%E2%80%99ivoire",
  "netherlands": "the-netherlands",
  "brunei": "brunei-darussalam",
  "israel": "israel-and-the-occupied-palestinian-territories",
  "palestine": "israel-and-the-occupied-palestinian-territories",
  "turkey": "turkiye",
  "czechia": "czech-republic",
  "saint-kitts-and-nevis": "st-kitts-and-nevis",
  "saint-lucia": "st-lucia",
  "saint-vincent-and-the-grenadines": "st-vincent-and-the-grenadines",
  "united-states": "united-states-of-america",
  "micronesia": "federated-states-of-micronesia",
  "vietnam": "viet-nam",
};

function buildSources(country: CountryProfile): CountrySource[] {
  const canadaSlug = CANADA_SOURCE_SLUGS[country.slug];
  const newZealandSlug = NEW_ZEALAND_SOURCE_SLUGS[country.slug] ?? country.slug;
  const canadaUrl = country.slug === "canada" || country.slug === "vatican-city"
    ? "https://travel.gc.ca/travelling/advisories"
    : "https://travel.gc.ca/destinations/" + (canadaSlug ?? country.slug);
  const newZealandUrl = country.slug === "vatican-city" || country.slug === "new-zealand" ? "https://www.safetravel.govt.nz/destinations/" : "https://www.safetravel.govt.nz/destinations/" + newZealandSlug;
  return [
    {
      authority: "Canada",
      name: "Global Affairs Canada advice for " + country.name,
      url: canadaUrl,
      description: "Official Canadian travel guidance for this destination.",
    },
    {
      authority: "New Zealand",
      name: "SafeTravel advice for " + country.name,
      url: newZealandUrl,
      description: "Official New Zealand travel guidance for this destination.",
    },
  ];
}
export const COUNTRY_PROFILES: Record<string, CountryProfile> = Object.fromEntries(
  COUNTRY_ROWS.map(([name, slug, continent, region]) => {
    const profile = {
      slug,
      name,
      continent,
      region,
      landmark: COUNTRY_LANDMARKS[slug] ?? (name + ' landmark'),
      scamResearch: EMPTY_SCAM_RESEARCH,
      sources: [] as CountrySource[],
    } satisfies CountryProfile;
    profile.sources = buildSources(profile);
    return [slug, profile];
  }),
);

export const CONTINENTS = ["North America", "South America", "Europe", "Africa", "Asia", "Oceania"];




