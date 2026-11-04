import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import "./preview.css";

export const metadata: Metadata = {
  title: "Konfydence | Elite design preview",
  description: "Private design review concept for Konfydence.",
  robots: { index: false, follow: false },
};

const products = [
  { title: "TravelSafe", eyebrow: "TRAVEL", text: "Spot the pressure before it follows you abroad.", image: "/challenge-editions/travelsafe.png", href: "/travelsafe" },
  { title: "Family", eyebrow: "EVERYDAY LIFE", text: "Confidence and safer decisions, together.", image: "/challenge-editions/family.png", href: "/family" },
  { title: "School", eyebrow: "YOUNG PEOPLE", text: "Practical judgment for the situations that matter.", image: "/challenge-editions/school.png", href: "/school" },
  { title: "CoMaSy", eyebrow: "ORGANISATIONS", text: "Turn difficult choices into measurable readiness.", image: "/edition-images/workplace.png", href: "/comasy" },
];

export default function KonfydenceDesignPreview() {
  return <main className="kp-elite">
    <div className="kp-review">KONFYDENCE · DESIGN REVIEW ONLY · NOT THE LIVE WEBSITE</div>
    <header className="kp-navigation">
      <Link href="/design-preview" className="kp-logo" aria-label="Konfydence"><Image src="/brand/LOGO-06.png" width={228} height={64} unoptimized alt="Konfydence" /></Link>
      <nav aria-label="Design preview navigation"><a href="#solutions">Challenges</a><a href="#philosophy">How it works</a><a href="#for-teams">For organisations</a></nav>
      <Link href="/challenge/travelsafe/start?mode=diagnostic" className="kp-nav-action">Try a free challenge <span aria-hidden="true">↗</span></Link>
    </header>
    <section className="kp-hero">
      <div className="kp-hero-picture"><Image src="/challenge-editions/travelsafe.png" fill priority unoptimized sizes="100vw" alt="Premium travel imagery representing the TravelSafe scenario" /></div>
      <div className="kp-hero-shade" />
      <div className="kp-hero-content"><p className="kp-overline">REAL SITUATIONS. SHARPER JUDGMENT.</p><h1>Confidence when<br />it matters <em>most.</em></h1><p className="kp-hero-description">A message. A moment of pressure. One choice. Train the instinct to pause, question and decide with confidence.</p><div className="kp-buttons"><Link className="kp-primary" href="/challenge/travelsafe/start?mode=diagnostic">Try a free challenge <span aria-hidden="true">↗</span></Link><a className="kp-secondary" href="#solutions">Explore the solutions</a></div></div>
      <div className="kp-hero-foot"><span>01 / REAL-WORLD DECISIONS</span><span>SCROLL TO EXPLORE ↓</span></div>
    </section>
    <section className="kp-intro" id="philosophy"><span className="kp-index">01 — WHY KONFYDENCE</span><div><h2>The right question changes <em>everything.</em></h2><p>Most scams don't begin with a clever trick. They begin with a moment of urgency, trust or uncertainty. Konfydence helps people recognise that moment and choose what happens next.</p></div></section>
    <section className="kp-solutions" id="solutions"><div className="kp-section-head"><span className="kp-index">02 — BUILT FOR REAL LIFE</span><h2>One skill.<br /><em>Many situations.</em></h2><p>Short, practical challenges for the situations where pressure can override good judgment.</p></div><div className="kp-product-grid">{products.map((item,index)=><Link href={item.href} className="kp-product" key={item.title}><div className="kp-product-img"><Image src={item.image} width={620} height={440} unoptimized alt="" /></div><div className="kp-product-copy"><div className="kp-product-meta"><span>{item.eyebrow}</span><span>0{index+1}</span></div><h3>{item.title}<span aria-hidden="true">↗</span></h3><p>{item.text}</p></div></Link>)}</div></section>
    <section className="kp-method"><div className="kp-method-heading"><span className="kp-index">03 — A PRACTICAL HABIT</span><h2>Pause.<br />Think.<br /><em>Decide.</em></h2></div><div className="kp-method-details"><p>We make the pressure visible. You practise the response. Then you take that confidence into the real world.</p><div className="kp-steps"><div><strong>01</strong><span>Recognise pressure before reacting.</span></div><div><strong>02</strong><span>Question what you're being asked to trust.</span></div><div><strong>03</strong><span>Make a decision you can stand behind.</span></div></div></div></section>
    <section className="kp-team" id="for-teams"><div className="kp-team-copy"><span className="kp-index">04 — FOR ORGANISATIONS</span><h2>Better decisions<br />are a <em>team skill.</em></h2><p>CoMaSy helps organisations practise and understand how their people respond to pressure—before it becomes a real incident.</p><Link className="kp-primary" href="/comasy">Explore CoMaSy <span aria-hidden="true">↗</span></Link></div><div className="kp-team-art"><Image src="/edition-images/workplace.png" fill unoptimized sizes="(max-width: 840px) 100vw, 50vw" alt="Workplace awareness example" /></div></section>
    <footer className="kp-end"><Image src="/brand/LOGO-06.png" width={200} height={56} unoptimized alt="Konfydence" /><p>Confidence under pressure.</p><span>Design preview · Canonical Konfydence artwork only</span></footer>
  </main>;
}
