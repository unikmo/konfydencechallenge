import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PremiumPage } from "@/components/PremiumSiteChrome";
import { PortfolioStrip } from "@/components/PortfolioStrip";

const EDITIONS = {
  travelsafe: { name: "TravelSafe", audience: "Travellers and tourists", title: "Your booking needs attention. Right now.", description: "You are miles from home. The message looks real. What is your next move? Try the free TravelSafe decision challenge.", scenarios: ["A hotel asks you to pay again within minutes.", "A taxi driver adds an invented fee at the destination.", "A fake airline support account offers urgent compensation."] },
  family: { name: "Family", audience: "Parents, children and older relatives", title: "“Mom, it’s me. I need money.”", description: "What if that message was not from your child? Discover how you would respond before the pressure feels real.", scenarios: ["A message sounds like a relative who needs money now.", "A parcel notice asks for a small redelivery payment.", "A shared device receives an unexpected account reset."] },
  school: { name: "School", audience: "Students ages 12-18", title: "“You just won. Claim it now.”", description: "Free stuff. Urgent links. Group-chat pressure. Would you make the right move? Try it without being judged.", scenarios: ["A gaming reward requires a fast login.", "A group chat pressures you to open a link.", "A giveaway asks for account details to claim a prize."] },
  university: { name: "University", audience: "Students and international offices", title: "“Great apartment. One deposit away.”", description: "Everything looks perfect. There is just one thing you have not checked. Would you spot it?", scenarios: ["A landlord requests a deposit before a viewing.", "A job offer asks for identity documents immediately.", "A tuition message sends you to an unfamiliar payment page."] },
  workplace: { name: "Workplace", audience: "Teams, HR and managers", title: "“The CEO needs this approved. Immediately.”", description: "The request looks official. The clock is ticking. Would you question it?", scenarios: ["An executive asks for a confidential transfer.", "A supplier changes payment details by email.", "A voice message creates urgency around payroll."] },
} as const;

export function generateStaticParams() { return Object.keys(EDITIONS).map((edition) => ({ edition })); }

export async function generateMetadata(props: { params: Promise<{ edition: string }> }): Promise<Metadata> {
  const params = await props.params;
  const edition = EDITIONS[params.edition as keyof typeof EDITIONS];
  if (!edition) return {};
  return { title: { absolute: `${edition.name} Challenge Edition | Konfydence` }, description: edition.description, alternates: { canonical: `/${params.edition}` } };
}

export default async function EditionPage(props: { params: Promise<{ edition: string }> }) {
  const params = await props.params;
  const edition = EDITIONS[params.edition as keyof typeof EDITIONS];
  if (!edition) notFound();
  const startHref = `/challenge/${params.edition}/start?mode=diagnostic`;
  return (
    <PremiumPage ctaHref={startHref} ctaLabel="Take the free check">
      <div className="kg-shell kg-ed">
        <section className="kg-ed-hero">
          <p className="k-kicker">Challenge edition</p>
          <p className="kg-ed-audience">{edition.audience}</p>
          <h1>{edition.title}</h1>
          <p>{edition.description}</p>
          <Link className="k-button" href={startHref}>Find out how you would react →</Link>
        </section>

        <section className="k-section" style={{ borderTop: "1px solid var(--k-line)", paddingTop: 64, paddingBottom: 64 }}>
          <p className="k-kicker">Inside the challenge</p>
          <h2 className="k-display-sm">It seems obvious when you know the answer. What about in the moment?</h2>
          <div className="kg-scenario-grid">
            {edition.scenarios.map((scenario) => (
              <article key={scenario}>
                <span>Scenario</span>
                <h3>{scenario}</h3>
                <p>Your move first. The safer choice—and why—comes next.</p>
              </article>
            ))}
          </div>
        </section>

        <section className="k-callout" style={{ padding: "72px 0" }}>
          <div>
            <p className="k-kicker">Start free</p>
            <h2 className="k-display-sm">Think you would spot it? Prove it to yourself.</h2>
            <p className="k-copy">
              Your first decision check is free. Discover which pressure pattern changes your choices, then decide if you want more practice.
            </p>
          </div>
          <div className="k-actions">
            <Link className="k-button" href={startHref}>Take the free challenge →</Link>
          </div>
        </section>
      </div>

      <p className="k-copy" style={{ marginBottom: 28 }}>Want the practical details before you begin? <Link href="/faq">See the FAQ</Link>. Your free result is useful on its own; a full challenge is optional. For adult guests, results are sent by email after the check.</p>
      <PortfolioStrip exclude={[params.edition as "family" | "school" | "university" | "workplace" | "travelsafe"]} />
    </PremiumPage>
  );
}
