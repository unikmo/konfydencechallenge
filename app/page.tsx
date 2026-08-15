import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Scam Awareness Training & Travel Scam Challenge | Konfydence" },
  description:
    "Practise safer decisions before a scammer puts you under pressure. Take the free 3-minute TravelSafe scam-awareness challenge and discover your weakest pressure pattern.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Would you spot the scam under pressure? | Konfydence",
    description:
      "Eight realistic travel-scam decisions. No signup. Immediate pressure-pattern result.",
    url: "https://konfydence.com",
    type: "website",
  },
};

const editions = [
  { slug: "family", no: "02", title: "Family", audience: "Households", copy: "Money requests, impersonation, shared devices and the moments when emotion overrides verification." },
  { slug: "school", no: "03", title: "School", audience: "Ages 12–18", copy: "Gaming, group chats, fake links, account takeovers and social pressure without classroom-style lecturing." },
  { slug: "university", no: "04", title: "University", audience: "Students", copy: "Housing, jobs, tuition, identity, international-student pressure and campus impersonation." },
  { slug: "workplace", no: "05", title: "Workplace", audience: "Teams", copy: "Invoices, payroll changes, executive pressure, phishing and sensitive-data requests." },
];

const faqs = [
  ["What is scam-awareness training?", "Practice for recognising and responding to manipulation before money, credentials or personal information are at risk. Konfydence uses decisions rather than passive lessons."],
  ["Is the TravelSafe Readiness Check free?", "Yes. It takes about three minutes, requires no signup and gives you an immediate score and pressure-pattern result."],
  ["What does the Konfydence score measure?", "How consistently you choose safer actions when a scenario uses urgency, authority, familiarity or a critical action moment."],
  ["Can schools and employers use Konfydence?", "Yes. School, University and Workplace editions are designed for scenario-based practice and organizational rollout."],
];

export default function HomePage() {
  return (
    <main className="site">
      <header className="nav">
        <Link className="brand" href="/" aria-label="Konfydence home"><span>K</span><b>Konfydence</b></Link>
        <nav className="desktopNav" aria-label="Main navigation">
          <a href="#how">How it works</a>
          <a href="#editions">Editions</a>
          <Link href="/countries">Travel alerts</Link>
          <a href="#organizations">Organizations</a>
        </nav>
        <Link className="navCta" href="/challenge/travelsafe/start?mode=diagnostic">Test yourself <span>→</span></Link>
      </header>

      <section className="hero">
        <div className="heroCopy">
          <p className="eyebrow"><i /> TravelSafe by Konfydence</p>
          <h1>Scammers rehearse.<br/><em>You should too.</em></h1>
          <p className="heroLead">Eight realistic travel-scam decisions. About three minutes. See which pressure pattern is most likely to catch you before it happens for real.</p>
          <div className="heroActions">
            <Link className="primaryCta" href="/challenge/travelsafe/start?mode=diagnostic">Start the free readiness check <span>→</span></Link>
            <a className="textCta" href="#how">See how it works</a>
          </div>
          <div className="proofRow">
            <span><b>01</b>No signup</span><span><b>02</b>~3 minutes</span><span><b>03</b>Instant result</span>
          </div>
        </div>

        <div className="heroVisual" aria-label="TravelSafe scam-awareness training">
          <div className="imageFrame">
            <Image src="/travelsafe-hero-scene.png" alt="Traveler using a phone while navigating a real-world travel situation" width={960} height={1120} priority sizes="(max-width: 900px) 100vw, 48vw" />
          </div>
        </div>
      </section>

      <section className="signalBand">
        <div><span>H</span><b>Hurry</b><small>“Do it now.”</small></div>
        <div><span>A</span><b>Authority</b><small>“Trust the title.”</small></div>
        <div><span>C</span><b>Comfort</b><small>“This feels familiar.”</small></div>
        <div><span>K</span><b>Critical action</b><small>“Click. Pay. Share.”</small></div>
      </section>

      <section id="how" className="section how">
        <div className="sectionLead">
          <div><p className="eyebrow dark"><i /> How it works</p><h2>Train the moment judgment gets compressed.</h2></div>
          <p>Konfydence does not ask whether you know scams exist. It puts credible choices in front of you and measures the quality of the action you choose.</p>
        </div>
        <div className="steps">
          <article><span>01</span><h3>Face a credible situation</h3><p>Realistic context, incomplete information and the same pressure cues used in real scams.</p></article>
          <article><span>02</span><h3>Choose the strongest move</h3><p>Three plausible moves. One breaks the risk chain best. No throwaway answer.</p></article>
          <article><span>03</span><h3>Learn the decision rule</h3><p>Immediate feedback explains why your move was strong, exposed or unsafe.</p></article>
          <article><span>04</span><h3>Train your weak pattern</h3><p>Your score shows which type of pressure deserves more practice.</p></article>
        </div>
      </section>

      <section id="editions" className="section editions">
        <div className="featuredEdition">
          <div className="featuredImage"><Image src="/challenge-editions/travelsafe.png" alt="TravelSafe edition" width={960} height={720} sizes="(max-width: 900px) 100vw, 50vw" /><span>01 / FLAGSHIP</span></div>
          <div className="featuredCopy">
            <p className="eyebrow dark"><i /> TravelSafe</p>
            <h2>Travel creates exactly the conditions scammers need.</h2>
            <p>Unfamiliar systems, urgency, roaming phones, airport stress, hotel messages and payments away from home. Practise the decision before the trip makes it real.</p>
            <ul><li>Flights, refunds and loyalty accounts</li><li>Hotels, taxis, QR codes and public Wi-Fi</li><li>Payments, identity documents and border pressure</li></ul>
            <Link className="darkCta" href="/challenge/travelsafe/start?mode=diagnostic">Take the free TravelSafe check <span>→</span></Link>
          </div>
        </div>

        <div className="editionIntro"><div><p className="eyebrow dark"><i /> More editions</p><h2>The scam changes. The pressure mechanics repeat.</h2></div><p>Choose the environment where you want safer decisions to become automatic.</p></div>
        <div className="editionGrid">
          {editions.map((e) => <article className="editionCard" key={e.slug}><div className="meta"><span>{e.no}</span><small>{e.audience}</small></div><h3>{e.title}</h3><p>{e.copy}</p><Link href={`/challenge/${e.slug}/start?mode=diagnostic`}>Start readiness check <span>→</span></Link></article>)}
        </div>
      </section>

      <section id="organizations" className="org">
        <div><p className="eyebrow light"><i /> For organizations</p><h2>Awareness is not the same as readiness.</h2><p>Give students or teams short, realistic decisions they can actually rehearse. Use School, University or Workplace editions for practical scam and social-engineering training.</p></div>
        <div className="orgAction"><Link className="limeCta" href="/contact?topic=organization">Discuss organizational access <span>→</span></Link><small>Schools · Universities · Employers</small></div>
      </section>

      <section className="section faq">
        <p className="eyebrow dark"><i /> Questions</p><h2>Scam-awareness training, without the lecture.</h2>
        <div className="faqGrid">{faqs.map(([q,a]) => <details key={q}><summary>{q}<span>+</span></summary><p>{a}</p></details>)}</div>
      </section>

      <footer className="footer"><div className="brandFooter"><Link className="brand darkBrand" href="/"><span>K</span><b>Konfydence</b></Link><p>Practise the pause before the pressure is real.</p></div><nav><Link href="/countries">Travel alerts</Link><Link href="/contact">Contact</Link><Link href="/imprint">Imprint</Link><Link href="/privacy-policy">Privacy</Link><Link href="/terms-of-service">Terms</Link><Link href="/cookie-policy">Cookies</Link></nav></footer>

      <style>{`
        :global(*){box-sizing:border-box}:global(html){scroll-behavior:smooth}:global(body){margin:0;background:#f2efe8;color:#071522}.site{--ink:#071522;--paper:#fffdf8;--cream:#f2efe8;--coral:#ff5b50;--lime:#b9ff38;--line:rgba(7,21,34,.14);font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;background:var(--cream);min-height:100vh}.nav{height:76px;max-width:1240px;padding:0 28px;margin:0 auto;color:#fff;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(255,255,255,.12);position:relative;z-index:5}.brand{color:inherit;text-decoration:none;display:inline-flex;align-items:center;gap:9px}.brand>span{width:29px;height:29px;border:1px solid currentColor;border-radius:50%;display:grid;place-items:center;font-size:11px}.brand b{font-size:13px;letter-spacing:-.02em}.desktopNav{display:flex;gap:28px}.desktopNav a{color:#d6e0e8;text-decoration:none;font-size:12px;font-weight:750}.navCta,.primaryCta,.limeCta,.darkCta{display:inline-flex;align-items:center;gap:14px;text-decoration:none;font-weight:900}.navCta{padding:10px 16px;background:var(--lime);color:var(--ink);border-radius:999px;font-size:12px}
        .hero{margin-top:-76px;min-height:740px;padding:144px max(28px,calc((100vw - 1184px)/2)) 72px;background:radial-gradient(circle at 88% 18%,rgba(71,122,165,.20),transparent 30%),var(--ink);color:#fff;display:grid;grid-template-columns:minmax(0,1.02fr) minmax(420px,.98fr);gap:64px;align-items:center}.eyebrow{display:flex;align-items:center;gap:9px;margin:0 0 20px;color:#cbd6df;font-size:10px;letter-spacing:.14em;font-weight:900;text-transform:uppercase}.eyebrow i{width:24px;height:2px;background:var(--coral)}.eyebrow.dark{color:#68737a}.eyebrow.light{color:#d8e4ec}.eyebrow.light i{background:var(--lime)}.hero h1,.section h2,.org h2{font-family:Georgia,"Times New Roman",serif;font-weight:500;letter-spacing:-.045em}.hero h1{font-size:clamp(56px,6vw,90px);line-height:.91;margin:0;max-width:690px}.hero h1 em{font-style:normal;color:var(--coral)}.heroLead{font-size:18px;line-height:1.65;color:#bdc9d3;max-width:590px;margin:28px 0 30px}.heroActions{display:flex;align-items:center;gap:22px;flex-wrap:wrap}.primaryCta{padding:15px 21px;border-radius:999px;background:var(--coral);color:#fff;font-size:13px}.textCta{color:#fff;font-size:13px;font-weight:800;text-underline-offset:5px}.proofRow{display:flex;gap:24px;flex-wrap:wrap;margin-top:28px;color:#aebcc8;font-size:11px;font-weight:750}.proofRow span{display:flex;gap:7px;align-items:center}.proofRow b{color:var(--lime);font-size:9px}
        .heroVisual{display:flex;align-items:center;justify-content:center;min-width:0}.imageFrame{width:100%;max-width:590px;overflow:hidden;border-radius:20px;background:#0b1a28;border:1px solid rgba(255,255,255,.13);box-shadow:0 34px 80px rgba(0,0,0,.30)}.imageFrame img{width:100%;height:auto;display:block;object-fit:contain}
        .signalBand{background:#0c2439;color:#fff;padding:0 max(28px,calc((100vw - 1184px)/2));display:grid;grid-template-columns:repeat(4,1fr)}.signalBand>div{min-height:110px;padding:25px 18px;border-right:1px solid rgba(255,255,255,.09);display:grid;grid-template-columns:36px 1fr;align-content:center}.signalBand>div:first-child{border-left:1px solid rgba(255,255,255,.09)}.signalBand>div>span{grid-row:1/3;width:27px;height:27px;border:1px solid #62778a;border-radius:50%;display:grid;place-items:center;color:var(--lime);font-size:10px;font-weight:900}.signalBand b{font-size:12px}.signalBand small{font-size:10px;color:#91a2b0;margin-top:3px}
        .section{max-width:1184px;margin:0 auto;padding:108px 28px}.section h2,.org h2{font-size:clamp(40px,4.6vw,62px);line-height:1;margin:0}.sectionLead{display:grid;grid-template-columns:1fr .9fr;gap:80px;align-items:end}.sectionLead>p{margin:0;color:#69737a;line-height:1.7;font-size:14px}.steps{margin-top:58px;border-top:1px solid var(--line);display:grid;grid-template-columns:repeat(4,1fr)}.steps article{min-height:220px;padding:28px 22px 0 0;border-right:1px solid var(--line)}.steps article:not(:first-child){padding-left:22px}.steps article:last-child{border-right:0}.steps span,.meta>span{font-size:9px;color:#d94d43;font-weight:900}.steps h3{font-family:Georgia,serif;font-size:22px;line-height:1.08;margin:34px 0 10px}.steps p,.editionCard p{font-size:12px;line-height:1.65;color:#69737a;margin:0}
        .editions{padding-top:24px}.featuredEdition{display:grid;grid-template-columns:.9fr 1.1fr;background:var(--paper);border:1px solid var(--line);min-height:520px}.featuredImage{position:relative;overflow:hidden;min-height:520px;background:#101d28}.featuredImage img{width:100%;height:100%;object-fit:cover;display:block}.featuredImage:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,transparent 48%,rgba(7,21,34,.68))}.featuredImage span{position:absolute;z-index:2;left:24px;bottom:22px;color:#fff;font-size:9px;letter-spacing:.12em;font-weight:900}.featuredCopy{padding:52px 56px;display:flex;flex-direction:column;justify-content:center}.featuredCopy h2{font-size:clamp(38px,4vw,56px)}.featuredCopy>p:not(.eyebrow){font-size:14px;line-height:1.7;color:#657078;margin:20px 0}.featuredCopy ul{list-style:none;margin:0 0 27px;padding:0;display:grid;gap:9px}.featuredCopy li{font-size:12px;font-weight:750}.featuredCopy li:before{content:"↳";color:var(--coral);margin-right:8px}.darkCta{align-self:flex-start;padding:14px 18px;border-radius:999px;background:var(--ink);color:#fff;font-size:12px}.editionIntro{display:grid;grid-template-columns:1.2fr .8fr;gap:70px;align-items:end;margin:96px 0 34px}.editionIntro>p{color:#69737a;font-size:13px;line-height:1.65;margin:0}.editionGrid{display:grid;grid-template-columns:repeat(2,1fr);border-left:1px solid var(--line);border-top:1px solid var(--line)}.editionCard{min-height:300px;padding:30px;border-right:1px solid var(--line);border-bottom:1px solid var(--line);display:flex;flex-direction:column;transition:.18s}.editionCard:hover{background:var(--paper)}.meta{display:flex;justify-content:space-between}.meta small{text-transform:uppercase;font-size:8px;letter-spacing:.1em;font-weight:900;color:#7a8389}.editionCard h3{font-family:Georgia,serif;font-size:38px;font-weight:500;margin:48px 0 12px}.editionCard>a{margin-top:auto;color:var(--ink);text-decoration:none;display:flex;justify-content:space-between;font-size:11px;font-weight:900;padding-top:20px}
        .org{background:var(--ink);color:#fff;padding:86px max(28px,calc((100vw - 1128px)/2));display:grid;grid-template-columns:1.25fr .75fr;gap:70px;align-items:end}.org>div>p:not(.eyebrow){max-width:650px;color:#b9c6d0;line-height:1.7;font-size:14px;margin:22px 0 0}.orgAction{display:flex;flex-direction:column;align-items:flex-start;gap:13px}.limeCta{padding:14px 18px;border-radius:999px;background:var(--lime);color:var(--ink);font-size:12px}.orgAction small{color:#8395a5;font-size:10px}.faq h2{max-width:790px}.faqGrid{margin-top:48px;border-top:1px solid var(--line)}.faq details{border-bottom:1px solid var(--line)}.faq summary{list-style:none;cursor:pointer;display:flex;justify-content:space-between;gap:20px;padding:21px 0;font-family:Georgia,serif;font-size:18px}.faq summary::-webkit-details-marker{display:none}.faq summary span{color:var(--coral)}.faq details p{max-width:760px;color:#68737a;font-size:13px;line-height:1.7;margin:-6px 0 22px}.footer{max-width:1184px;margin:0 auto;padding:28px;border-top:1px solid var(--line);display:flex;justify-content:space-between;align-items:flex-end}.darkBrand{color:var(--ink)}.brandFooter p{font-size:10px;color:#7b858b}.footer nav{display:flex;gap:16px;flex-wrap:wrap}.footer nav a{color:var(--ink);text-decoration:none;font-size:9px;font-weight:800}
        @media(max-width:900px){.desktopNav{display:none}.hero{grid-template-columns:1fr;gap:44px;padding-top:130px}.heroVisual{max-width:680px;width:100%;margin:0 auto}.sectionLead,.editionIntro,.org{grid-template-columns:1fr}.steps{grid-template-columns:repeat(2,1fr)}.steps article:nth-child(2){border-right:0}.featuredEdition{grid-template-columns:1fr}.featuredImage{min-height:400px}.org{gap:34px}}
        @media(max-width:620px){.nav{height:64px;padding:0 14px}.navCta{padding:9px 12px;font-size:10px}.hero{margin-top:-64px;padding:112px 16px 44px;min-height:auto}.hero h1{font-size:clamp(48px,15vw,68px)}.heroLead{font-size:15px}.heroVisual{margin-top:4px}.imageFrame{border-radius:16px}.signalBand{grid-template-columns:repeat(2,1fr);padding:0}.signalBand>div{min-height:92px}.section{padding:76px 16px}.sectionLead{gap:24px}.steps{grid-template-columns:1fr}.steps article,.steps article:not(:first-child){padding:24px 0;border-right:0;border-bottom:1px solid var(--line);min-height:auto}.featuredCopy{padding:36px 22px}.featuredImage{min-height:330px}.editionIntro{gap:22px;margin-top:70px}.editionGrid{grid-template-columns:1fr}.editionCard{min-height:250px}.org{padding:64px 16px}.footer{padding:24px 16px;display:grid;gap:26px}.footer nav{gap:12px}}
      `}</style>
    </main>
  );
}
