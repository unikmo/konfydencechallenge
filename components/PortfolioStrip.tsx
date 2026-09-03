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
    price: "Free check · $4.99 full",
    href: "/challenge/travelsafe/start?mode=diagnostic",
    cta: "Try free",
  },
  {
    key: "family",
    eyebrow: "Challenge",
    name: "Family",
    copy: "Impersonation, emergency money requests and shared-device risks at home.",
    price: "Free check · $4.99 full",
    href: "/family",
    cta: "Explore",
  },
  {
    key: "school",
    eyebrow: "Challenge",
    name: "School",
    copy: "Gaming rewards, fake giveaways and group-chat pressure for ages 12–18.",
    price: "Free check · $4.99 full",
    href: "/school",
    cta: "Explore",
  },
  {
    key: "university",
    eyebrow: "Challenge",
    name: "University",
    copy: "Housing deposits, fake jobs, tuition fraud and identity scams.",
    price: "Free check · $4.99 full",
    href: "/university",
    cta: "Explore",
  },
  {
    key: "workplace",
    eyebrow: "Challenge",
    name: "Workplace",
    copy: "Invoice fraud, executive impersonation, payroll changes and phishing.",
    price: "Free check · $4.99 full",
    href: "/workplace",
    cta: "Explore",
  },
  {
    key: "comasy",
    eyebrow: "For organisations",
    name: "CoMaSy",
    copy: "Security decision simulation for teams. Measure how people pause and verify.",
    price: "Bounded pilot",
    href: "/comasy",
    cta: "Request a pilot",
  },
  {
    key: "lockscreens",
    eyebrow: "Reminder",
    name: "Lockscreens",
    copy: "Phone and desktop wallpapers that keep Pause · Think · Call in view all day.",
    price: "$4.99",
    href: "/lockscreens",
    cta: "Get the pack",
  },
];

export function PortfolioStrip({
  exclude = [],
  heading = "Practise the decision wherever the pressure shows up.",
  kicker = "The full toolkit",
}: {
  exclude?: PackageKey[];
  heading?: string;
  kicker?: string;
}) {
  const items = PACKAGES.filter((item) => !exclude.includes(item.key));

  return (
    <section className="kp-strip" aria-labelledby="kp-strip-title">
      <div className="kp-strip-inner">
        <div className="kp-strip-head">
          <p className="k-kicker">{kicker}</p>
          <h2 id="kp-strip-title" className="k-display-sm">{heading}</h2>
          <p className="kp-strip-lede">
            One decision habit — spot the pressure with H.A.C.K., then Pause, Think, Call.
            Choose the situation closest to your life, or equip a team.
          </p>
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
            Own more than one situation? <Link href="/pricing">Get all five challenges for $19.99 →</Link>
          </p>
        ) : null}
      </div>
    </section>
  );
}
