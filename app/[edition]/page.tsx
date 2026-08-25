import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PremiumPage } from "@/components/PremiumSiteChrome";

const EDITIONS = {
  travelsafe: { name: "TravelSafe", audience: "Travellers and tourists", title: "Would you spot a travel scam before it cost you?", description: "Face realistic booking, hotel, taxi, payment and Wi‑Fi scams, get your readiness score, and learn your safer next move.", scenarios: ["A hotel asks you to pay again within minutes.", "A taxi driver adds an invented fee at the destination.", "A fake airline support account offers urgent compensation."] },
  family: { name: "Family", audience: "Parents, children and older relatives", title: "Practise the pressure moments that reach your family.", description: "Build safer responses to emergency money requests, family impersonation, parcel scams, shared-device risks and account takeovers.", scenarios: ["A message sounds like a relative who needs money now.", "A parcel notice asks for a small redelivery payment.", "A shared device receives an unexpected account reset."] },
  school: { name: "School", audience: "Students ages 12–18", title: "Recognise the pressure behind the next online offer.", description: "Practise recognising fake giveaways, gaming scams, group-chat pressure, phishing links and attempts to steal social accounts.", scenarios: ["A gaming reward requires a fast login.", "A group chat pressures you to open a link.", "A giveaway asks for account details to claim a prize."] },
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
    <PremiumPage ctaHref={startHref} ctaLabel="Take free check">
      <section className="k-shell k-page-hero">
        <p className="k-kicker">{edition.name} edition · {edition.audience}</p>
        <h1 className="k-display">{edition.title}</h1>
        <p className="k-lede">{edition.description}</p>
        <div className="k-actions"><Link className="k-button" href={startHref}>Start the free readiness check <span>→</span></Link><Link className="k-button-quiet" href="/challenge">See all editions</Link></div>
      </section>

      <section className="k-shell k-section-tight">
        <div className="k-section-head"><div><p className="k-kicker">Inside the experience</p><h2 className="k-display-sm">Real pressure. Plausible choices. Immediate feedback.</h2></div><p className="k-copy">The point is not to memorise scam examples. It is to practise the safer decision when the request feels credible and the clock is working against you.</p></div>
        <div className="k-statements">
          {edition.scenarios.map((scenario,index) => <article className="k-statement" key={scenario}><span className="k-index">0{index+1}</span><h3>{scenario}</h3><p>Choose what you would do, then see the stronger move and the decision rule behind it.</p></article>)}
          <article className="k-statement"><span className="k-index">RESULT</span><h3>Your pressure profile</h3><p>See which H.A.C.K. pattern deserves more practice next.</p></article>
        </div>
      </section>

      <section className="k-section-dark">
        <div className="k-shell k-section-head" style={{marginBottom:0}}>
          <div><p className="k-kicker">Free first</p><h2 className="k-display-sm">Start with the short readiness check.</h2></div>
          <div><p className="k-copy" style={{color:"#b9b7b1"}}>No account for round one. When you want the complete training experience, continue with the full challenge and deeper result history.</p><div className="k-actions"><Link className="k-button-dark" href={startHref}>Start {edition.name} <span>→</span></Link><Link className="k-button-quiet" style={{color:"#fff",borderColor:"rgba(255,255,255,.24)"}} href={`/pricing?edition=${params.edition}`}>View challenge access</Link></div></div>
        </div>
      </section>

      <section className="k-shell k-section-tight">
        <p className="k-kicker">Other environments</p>
        <div className="k-editions">
          {Object.entries(EDITIONS).filter(([slug]) => slug !== params.edition).map(([slug,item]) => <Link key={slug} className="k-edition" href={`/${slug}`}><small>Konfydence edition</small><h3>{item.name}</h3><p>{item.description}</p><span>Explore edition →</span></Link>)}
        </div>
      </section>
    </PremiumPage>
  );
}
