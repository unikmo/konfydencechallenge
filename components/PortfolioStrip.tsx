import Link from "next/link";

type PackageKey =
  | "travelsafe"
  | "family"
  | "school"
  | "university"
  | "workplace"
  | "comasy"
  | "lockscreens";

type PackageItem = {
  key: PackageKey;
  eyebrow: string;
  name: string;
  copy: string;
  price: string;
  href: string;
  cta: string;
};

const PACKAGES: PackageItem[] = [
  {
    key: "travelsafe",
    eyebrow: "Challenge",
    name: "TravelSafe",
    copy: "Bookings, transport, Wi-Fi and payment scams under real travel pressure.",
    price: "Free check · $6.99 full",
    href: "/challenge/travelsafe/start?mode=diagnostic",
    cta: "Try free",
  },
  {
    key: "family",
    eyebrow: "Challenge",
    name: "Family",
    copy: "Impersonation, emergency money requests and shared-device risks at home.",
    price: "Free check · $6.99 full",
    href: "/family",
    cta: "Explore",
  },
  {
    key: "school",
    eyebrow: "Challenge",
    name: "School",
    copy: "Gaming rewards, fake giveaways and group-chat pressure for ages 12–18.",
    price: "Free check · $6.99 full",
    href: "/school",
    cta: "Explore",
  },
  {
    key: "university",
    eyebrow: "Challenge",
    name: "University",
    copy: "Housing deposits, fake jobs, tuition fraud and identity scams.",
    price: "Free check · $6.99 full",
    href: "/university",
    cta: "Explore",
  },
  {
    key: "workplace",
    eyebrow: "Challenge",
    name: "Workplace",
    copy: "Invoice fraud, executive impersonation, payroll changes and phishing.",
    price: "Free check · $6.99 full",
    href: "/workplace",
    cta: "Explore",
  },
  {
    key: "comasy",
    eyebrow: "For teams",
    name: "CoMaSy",
    copy: "Security decision simulation for teams. Measure how people pause and verify.",
    price: "Bounded pilot",
    href: "/comasy/pilot",
    cta: "Request a pilot",
  },
  {
    key: "lockscreens",
    eyebrow: "Reminder service",
    name: "Lockscreens",
    copy: "A Pause · Assess · Talk lock screen, with a fresh prompt every two weeks as scams change.",
    price: "From $19.99/yr · per-seat for teams",
    href: "/lockscreens",
    cta: "See pricing",
  },
];

const PACKAGES_DE: Record<PackageKey, Omit<PackageItem, "key">> = {
  travelsafe: { eyebrow: "Challenge", name: "TravelSafe", copy: "Betrug bei Buchung, Transport, WLAN und Zahlung – unter echtem Reisedruck.", price: "Kostenloser Check · €6,99 voll", href: "/de/challenge/travelsafe/start?mode=diagnostic", cta: "Kostenlos testen" },
  family: { eyebrow: "Challenge", name: "Familie", copy: "Falsche Verwandte, Geldforderungen im Notfall und Risiken auf geteilten Geräten.", price: "Kostenloser Check · €6,99 voll", href: "/de/family", cta: "Ansehen" },
  school: { eyebrow: "Challenge", name: "Schule", copy: "Gaming-Belohnungen, Fake-Gewinnspiele und Druck im Klassenchat für 12- bis 18-Jährige.", price: "Kostenloser Check · €6,99 voll", href: "/de/school", cta: "Ansehen" },
  university: { eyebrow: "Challenge", name: "Universität", copy: "Mietkaution, Fake-Jobs, Studiengebühren-Betrug und Identitätsdiebstahl.", price: "Kostenloser Check · €6,99 voll", href: "/de/university", cta: "Ansehen" },
  workplace: { eyebrow: "Challenge", name: "Arbeitsplatz", copy: "Rechnungsbetrug, Chef-Masche, geänderte Gehaltsdaten und Phishing.", price: "Kostenloser Check · €6,99 voll", href: "/de/workplace", cta: "Ansehen" },
  comasy: { eyebrow: "Für Teams", name: "CoMaSy", copy: "Simulation für Sicherheitsentscheidungen in Teams. Messen, wer innehält und nachprüft.", price: "Pilotprojekt", href: "/de/comasy/pilotprojekt", cta: "Pilotprojekt anfragen" },
  lockscreens: { eyebrow: "Erinnerung", name: "Lockscreens", copy: "Ein Sperrbildschirm mit „Anhalten · Abklären · Ansprechen“ – alle zwei Wochen neu, weil sich die Maschen ändern.", price: "Ab $19,99/Jahr · pro Platz für Teams", href: "/de/lockscreens", cta: "Preise ansehen" },
};

const STRIP_COPY = {
  en: {
    heading: "Practise the decision wherever the pressure shows up.",
    kicker: "The full toolkit",
    lede: "One decision habit — spot the pressure with H.A.C.K., then Pause, Assess, Talk. Choose the situation closest to your life, or equip a team.",
    note: "Own more than one situation?",
    noteLink: "Get all five challenges for $24.99 →",
    noteHref: "/pricing",
  },
  de: {
    heading: "Übe die Entscheidung überall dort, wo Druck entsteht.",
    kicker: "Das ganze Angebot",
    lede: "Eine Entscheidungsgewohnheit: Druck mit H.A.C.K. erkennen, dann Anhalten, Abklären, Ansprechen. Such dir die Situation aus, die zu deinem Leben passt – oder rüste ein Team aus.",
    note: "Mehr als eine Situation?",
    noteLink: "Alle fünf Challenges ansehen →",
    noteHref: "/de/pricing",
  },
} as const;

export function PortfolioStrip({
  exclude = [],
  lead = [],
  lang = "en",
  heading,
  kicker,
}: {
  exclude?: PackageKey[];
  lead?: PackageKey[];
  lang?: "en" | "de";
  heading?: string;
  kicker?: string;
}) {
  const copy = STRIP_COPY[lang];
  const all: PackageItem[] = lang === "de"
    ? (Object.keys(PACKAGES_DE) as PackageKey[]).map((key) => ({ key, ...PACKAGES_DE[key] }))
    : PACKAGES;
  const visible = all.filter((item) => !exclude.includes(item.key));
  const items = [
    ...lead.flatMap((key) => visible.filter((item) => item.key === key)),
    ...visible.filter((item) => !lead.includes(item.key)),
  ];

  return (
    <section className="kp-strip" aria-labelledby="kp-strip-title">
      <div className="kp-strip-inner">
        <div className="kp-strip-head">
          <p className="k-kicker">{kicker ?? copy.kicker}</p>
          <h2 id="kp-strip-title" className="k-display-sm">{heading ?? copy.heading}</h2>
          <p className="kp-strip-lede">{copy.lede}</p>
        </div>

        <div className="kp-grid">
          {items.map((item) => (
            <Link className="kp-card" key={item.key} href={item.href}>
              <span className="kp-card-eyebrow">{item.eyebrow}</span>
              <span className="kp-card-name">{item.name}</span>
              <span className="kp-card-copy">{item.copy}</span>
              <span className="kp-card-foot">
                <b>{item.price}</b>
                <em>{item.cta} <span aria-hidden="true">→</span></em>
              </span>
            </Link>
          ))}
        </div>

        {!exclude.includes("family") || !exclude.includes("workplace") ? (
          <p className="kp-strip-note">
            {copy.note} <Link href={copy.noteHref}>{copy.noteLink}</Link>
          </p>
        ) : null}
      </div>
    </section>
  );
}
