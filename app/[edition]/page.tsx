import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PremiumPage } from "@/components/PremiumSiteChrome";
import { PortfolioStrip } from "@/components/PortfolioStrip";

const EDITIONS = {
  travelsafe: { name: "TravelSafe", audience: "Travellers and tourists", title: "Would you spot a travel scam before it cost you?", description: "Face realistic booking, hotel, taxi, payment and Wi-Fi scams, get your readiness score, and learn your safer next move.", scenarios: ["A hotel asks you to pay again within minutes.", "A taxi driver adds an invented fee at the destination.", "A fake airline support account offers urgent compensation."] },
  family: { name: "Family", audience: "Parents, children and older relatives", title: "Practise the pressure moments that reach your family.", description: "Build safer responses to emergency money requests, family impersonation, parcel scams, shared-device risks and account takeovers.", scenarios: ["A message sounds like a relative who needs money now.", "A parcel notice asks for a small redelivery payment.", "A shared device receives an unexpected account reset."] },
  school: { name: "School", audience: "Students ages 12-18", title: "Recognize the pressure behind the next online offer.", description: "Practise recognizing fake giveaways, gaming scams, group-chat pressure, phishing links and attempts to steal social accounts.", scenarios: ["A gaming reward requires a fast login.", "A group chat pressures you to open a link.", "A giveaway asks for account details to claim a prize."] },
  university: { name: "University", audience: "Students and international offices", title: "Pause before a student opportunity becomes a costly mistake.", description: "Prepare for student housing scams, fake jobs, tuition fraud, marketplace scams and identity theft.", scenarios: ["A landlord requests a deposit before a viewing.", "A job offer asks for identity documents immediately.", "A tuition message sends you to an unfamiliar payment page."] },
  workplace: { name: "Workplace", audience: "Teams, HR and managers", title: "Test your response to pressure at work.", description: "Practise safer responses to phishing, invoice fraud, payroll changes, executive impersonation and AI voice scams.", scenarios: ["An executive asks for a confidential transfer.", "A supplier changes payment details by email.", "A voice message creates urgency around payroll."] },
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
          <Link className="k-button" href={startHref}>Start the free readiness check</Link>
        </section>

        <section className="k-section" style={{ borderTop: "1px solid var(--k-line)", paddingTop: 64, paddingBottom: 64 }}>
          <p className="k-kicker">Inside the challenge</p>
          <h2 className="k-display-sm">Realistic pressure scenarios for {edition.name}.</h2>
          <div className="kg-scenario-grid">
            {edition.scenarios.map((scenario) => (
              <article key={scenario}>
                <span>Scenario</span>
                <h3>{scenario}</h3>
                <p>Choose what you would do, then see the safer move.</p>
              </article>
            ))}
          </div>
        </section>

        <section className="k-callout" style={{ padding: "72px 0" }}>
          <div>
            <p className="k-kicker">Start free</p>
            <h2 className="k-display-sm">Every edition starts with a free readiness check.</h2>
            <p className="k-copy">
              Use the short diagnostic first. When you are ready, continue with the full challenge for the complete scenario-based training experience.
            </p>
          </div>
          <div className="k-actions">
            <Link className="k-button" href={startHref}>Start the free check</Link>
          </div>
        </section>
      </div>

      <PortfolioStrip exclude={[params.edition as "family" | "school" | "university" | "workplace" | "travelsafe"]} />
    </PremiumPage>
  );
}
