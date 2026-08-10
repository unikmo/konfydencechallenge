import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Scam Awareness Training & Travel Scam Challenge | Konfydence" },
  description:
    "Practise safer decisions before a scammer puts you under pressure. Take the free 3-minute TravelSafe scam-awareness challenge and discover your weakest pressure pattern.",
  alternates: { canonical: "/" },
  keywords: [
    "scam awareness training",
    "scam prevention training",
    "travel scams",
    "social engineering training",
    "phishing awareness",
    "fraud awareness",
  ],
  openGraph: {
    title: "Would you spot the scam under pressure? | Konfydence",
    description:
      "Take the free 3-minute TravelSafe readiness check. Eight realistic decisions. No signup. Immediate pressure-pattern result.",
    url: "https://konfydence.com",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Would you spot the scam under pressure? | Konfydence",
    description:
      "Eight realistic travel-scam decisions. See which pressure pattern could catch you.",
  },
};

const editions = [
  {
    slug: "family",
    number: "02",
    title: "Family",
    audience: "Households",
    copy: "Money requests, impersonation, shared devices and the moments when emotion overrides verification.",
  },
  {
    slug: "school",
    number: "03",
    title: "School",
    audience: "Ages 12–18",
    copy: "Gaming, group chats, fake links, account takeovers and social pressure without classroom-style lecturing.",
  },
  {
    slug: "university",
    number: "04",
    title: "University",
    audience: "Students",
    copy: "Housing, jobs, tuition, identity, international-student pressure and campus impersonation.",
  },
  {
    slug: "workplace",
    number: "05",
    title: "Workplace",
    audience: "Teams",
    copy: "Invoices, payroll changes, executive pressure, phishing and sensitive-data requests.",
  },
];

const faqs = [
  [
    "What is scam-awareness training?",
    "It is practice for recognising and responding to manipulation before money, credentials or personal information are at risk. Konfydence uses short decisions rather than passive lessons.",
  ],
  [
    "Is the TravelSafe Readiness Check free?",
    "Yes. The first TravelSafe Readiness Check is free, takes about three minutes, requires no signup and gives you an immediate score and pressure-pattern result.",
  ],
  [
    "What does the Konfydence score measure?",
    "It measures how consistently you choose safer actions when a scenario uses urgency, authority, familiarity or a critical action moment. It is a readiness signal, not a guarantee of protection.",
  ],
  [
    "Can schools and employers use Konfydence?",
    "Yes. Konfydence has dedicated School, University and Workplace editions designed for scenario-based practice and organizational rollout.",
  ],
];

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://konfydence.com/#organization",
      name: "Konfydence",
      url: "https://konfydence.com",
    },
    {
      "@type": "WebSite",
      "@id": "https://konfydence.com/#website",
      url: "https://konfydence.com",
      name: "Konfydence",
      publisher: { "@id": "https://konfydence.com/#organization" },
    },
    {
      "@type": "FAQPage",
      mainEntity: faqs.map(([question, answer]) => ({
        "@type": "Question",
        name: question,
        acceptedAnswer: { "@type": "Answer", text: answer },
      })),
    },
  ],
};

export default function HomePage() {
  return (
    <main className="site">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <header className="nav">
        <Link className="brand" href="/" aria-label="Konfydence home">
          <span className="brandMark">K</span>
          <span>Konfydence</span>
        </Link>
        <nav className="desktopNav" aria-label="Main navigation">
          <a href="#how">How it works</a>
          <a href="#editions">Editions</a>
          <Link href="/countries">Travel alerts</Link>
          <a href="#organizations">Organizations</a>
        </nav>
        <Link className="navCta" href="/challenge/travelsafe/start?mode=diagnostic">
          Test yourself <span aria-hidden="true">→</span>
        </Link>
      </header>

      <section className="hero">
        <div className="heroCopy">
          <p className="eyebrow"><span /> TravelSafe by Konfydence</p>
          <h1>
            Scammers rehearse.
            <br />
            <em>You should too.</em>
          </h1>
          <p className="heroLead">
            Eight realistic travel-scam decisions. About three minutes. See whether urgency,
            authority, familiarity or the final action moment is most likely to catch you.
          </p>
          <div className="heroActions">
            <Link className="primaryCta" href="/challenge/travelsafe/start?mode=diagnostic">
              Start the free readiness check <span aria-hidden="true">→</span>
            </Link>
            <a className="textCta" href="#how">See how it works</a>
          </div>
          <div className="proofRow" aria-label="Readiness check details">
            <span><b>01</b> No signup</span>
            <span><b>02</b> ~3 minutes</span>
            <span><b>03</b> Instant result</span>
          </div>
        </div>

        <div className="scenarioDemo" aria-label="Example Konfydence scenario">
          <div className="demoTop">
            <div>
              <span className="tiny">TRAVELSAFE · EXAMPLE</span>
              <strong>07 / 08</strong>
            </div>
            <span className="liveDot">UNDER PRESSURE</span>
          </div>
          <div className="demoProgress"><span /></div>
          <div className="phoneMessage">
            <div className="sender">
              <span className="senderIcon">A</span>
              <div><b>Airline Support</b><small>Now</small></div>
            </div>
            <p>
              Your refund of €486 is ready. Confirm your payment details within
              <strong> 30 minutes</strong> or the request will close.
            </p>
          </div>
          <p className="demoQuestion">What is the safest next move?</p>
          <div className="demoAnswers">
            <div className="demoAnswer muted"><span>A</span> Check the sender details first</div>
            <div className="demoAnswer selected"><span>B</span> Open the airline app yourself <b>✓</b></div>
            <div className="demoAnswer muted"><span>C</span> Search for a support number</div>
          </div>
          <div className="demoFooter">
            <span>Not “spot the bad link.”</span>
            <b>Choose the strongest action.</b>
          </div>
        </div>
      </section>

      <section className="signalBand" aria-label="Konfydence pressure patterns">
        <div><span>H</span><b>Hurry</b><small>“Do it now.”</small></div>
        <div><span>A</span><b>Authority</b><small>“Trust the title.”</small></div>
        <div><span>C</span><b>Connection</b><small>“You know me.”</small></div>
        <div><span>K</span><b>Critical action</b><small>“Click. Pay. Share.”</small></div>
      </section>

      <section id="how" className="section how">
        <div className="sectionHead">
          <p className="eyebrow dark"><span /> How it works</p>
          <h2>Training for the moment your judgment gets compressed.</h2>
          <p>
            Konfydence does not ask whether you know that scams exist. It puts plausible options
            in front of you and measures the quality of the action you choose.
          </p>
        </div>
        <div className="steps">
          <article>
            <span>01</span>
            <h3>Face a credible situation</h3>
            <p>Realistic context, incomplete information and the same pressure cues used in real scams.</p>
          </article>
          <article>
            <span>02</span>
            <h3>Choose the strongest move</h3>
            <p>Three plausible moves. One breaks the risk chain best. No throwaway fourth answer.</p>
          </article>
          <article>
            <span>03</span>
            <h3>Learn the decision rule</h3>
            <p>Immediate feedback explains why the action was strong, acceptable, exposed or unsafe.</p>
          </article>
          <article>
            <span>04</span>
            <h3>Train your weak pattern</h3>
            <p>Your score shows which type of pressure deserves more practice in a 24-scenario full run.</p>
          </article>
        </div>
      </section>

      <section id="editions" className="section editions">
        <div className="featuredEdition">
          <div className="editionVisual">
            <span className="editionNo">01</span>
            <div className="routeLine"><i /><i /><i /><i /><i /></div>
            <div className="editionBadge">FLAGSHIP FREE CHECK</div>
          </div>
          <div className="editionCopy">
            <p className="eyebrow dark"><span /> TravelSafe</p>
            <h2>Travel creates exactly the conditions scammers need.</h2>
            <p>
              Unfamiliar systems, urgency, roaming phones, airport stress, hotel messages and payments
              away from home. Practise the decision before the trip makes it real.
            </p>
            <ul>
              <li>Flights, refunds and loyalty accounts</li>
              <li>Hotels, taxis, QR codes and public Wi-Fi</li>
              <li>Payments, identity documents and border pressure</li>
            </ul>
            <Link className="darkCta" href="/challenge/travelsafe/start?mode=diagnostic">
              Take the free TravelSafe check <span>→</span>
            </Link>
          </div>
        </div>

        <div className="editionIntro">
          <div>
            <p className="eyebrow dark"><span /> More editions</p>
            <h2>The scam changes. The pressure mechanics repeat.</h2>
          </div>
          <p>Choose the environment where you want safer decisions to become automatic.</p>
        </div>
        <div className="editionGrid">
          {editions.map((edition) => (
            <article key={edition.slug} className="editionCard">
              <div className="editionMeta"><span>{edition.number}</span><small>{edition.audience}</small></div>
              <h3>{edition.title}</h3>
              <p>{edition.copy}</p>
              <Link href={`/challenge/${edition.slug}/start?mode=diagnostic`}>
                Start readiness check <span>→</span>
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section id="organizations" className="org">
        <div>
          <p className="eyebrow light"><span /> For organizations</p>
          <h2>Awareness is not the same as readiness.</h2>
          <p>
            Give students or teams short, realistic decisions they can actually rehearse.
            Use School, University or Workplace editions for practical scam and social-engineering training.
          </p>
        </div>
        <div className="orgActions">
          <Link className="primaryCta lime" href="/contact?topic=organization">Discuss organizational access →</Link>
          <small>Schools · Universities · Employers</small>
        </div>
      </section>

      <section className="section faq">
        <div className="sectionHead compact">
          <p className="eyebrow dark"><span /> Questions</p>
          <h2>Scam-awareness training, without the lecture.</h2>
        </div>
        <div className="faqGrid">
          {faqs.map(([question, answer]) => (
            <details key={question}>
              <summary>{question}<span>+</span></summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>

      <footer className="footer">
        <div className="brandFooter">
          <Link className="brand" href="/"><span className="brandMark">K</span><span>Konfydence</span></Link>
          <p>Practise the pause before the pressure is real.</p>
        </div>
        <nav>
          <Link href="/countries">Travel alerts</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/imprint">Imprint</Link>
          <Link href="/privacy-policy">Privacy</Link>
          <Link href="/terms-of-service">Terms</Link>
          <Link href="/cookie-policy">Cookies</Link>
        </nav>
      </footer>

      <style>{`
        :global(*){box-sizing:border-box}
        :global(html){scroll-behavior:smooth}
        :global(body){background:#f3f0e9}
        .site{--ink:#091522;--navy:#0d2238;--cream:#f3f0e9;--paper:#fffdf8;--coral:#ff5b50;--lime:#b8ff3d;--blue:#7fb8ff;--line:rgba(9,21,34,.14);min-height:100vh;background:var(--cream);color:var(--ink);font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
        .nav{height:76px;max-width:1240px;margin:0 auto;padding:0 28px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(255,255,255,.13);position:relative;z-index:10;color:white}
        .brand{display:inline-flex;align-items:center;gap:10px;color:inherit;text-decoration:none;font-weight:900;letter-spacing:-.025em}
        .brandMark{width:30px;height:30px;display:grid;place-items:center;border:1px solid currentColor;border-radius:50%;font-size:13px}
        .desktopNav{display:flex;align-items:center;gap:26px}
        .desktopNav a{color:#d9e3ec;text-decoration:none;font-size:13px;font-weight:700}
        .desktopNav a:hover{color:white}
        .navCta{display:inline-flex;gap:10px;align-items:center;background:var(--lime);color:var(--ink);text-decoration:none;border-radius:999px;padding:11px 17px;font-size:13px;font-weight:900}
        .hero{margin-top:-76px;padding:150px max(28px,calc((100vw - 1184px)/2)) 78px;min-height:750px;background:radial-gradient(circle at 79% 23%,rgba(127,184,255,.16),transparent 31%),radial-gradient(circle at 8% 72%,rgba(255,91,80,.12),transparent 30%),var(--ink);color:white;display:grid;grid-template-columns:minmax(0,1.03fr) minmax(420px,.97fr);gap:76px;align-items:center}
        .eyebrow{margin:0 0 20px;display:flex;align-items:center;gap:9px;color:#c6d1dc;font-size:11px;font-weight:900;letter-spacing:.15em;text-transform:uppercase}.eyebrow span{width:24px;height:2px;background:var(--coral)}
        .eyebrow.dark{color:#5f6a72}.eyebrow.light{color:#dbe7ef}.eyebrow.light span{background:var(--lime)}
        .hero h1{font-family:Georgia,"Times New Roman",serif;font-size:clamp(50px,6.2vw,88px);line-height:.93;letter-spacing:-.055em;margin:0;max-width:720px;font-weight:500}
        .hero h1 em{font-style:normal;color:var(--coral)}
        .heroLead{max-width:600px;margin:28px 0 30px;color:#c6d1dc;font-size:19px;line-height:1.62}
        .heroActions{display:flex;align-items:center;gap:22px;flex-wrap:wrap}
        .primaryCta,.darkCta{display:inline-flex;align-items:center;justify-content:center;gap:14px;text-decoration:none;font-weight:900}
        .primaryCta{background:var(--coral);color:white;border-radius:999px;padding:16px 22px;box-shadow:0 10px 30px rgba(255,91,80,.17)}
        .primaryCta:hover{transform:translateY(-1px)}
        .textCta{color:#fff;text-underline-offset:5px;font-size:14px;font-weight:800}
        .proofRow{display:flex;gap:24px;flex-wrap:wrap;margin-top:30px;color:#b7c4cf;font-size:12px;font-weight:700}.proofRow span{display:flex;align-items:center;gap:7px}.proofRow b{color:var(--lime);font-size:10px}
        .scenarioDemo{background:var(--paper);color:var(--ink);border-radius:26px;padding:22px;box-shadow:22px 24px 0 rgba(127,184,255,.1),0 35px 80px rgba(0,0,0,.24);transform:rotate(1.1deg);position:relative}
        .scenarioDemo:before{content:"";position:absolute;inset:-1px;border-radius:26px;border:1px solid rgba(255,255,255,.65);pointer-events:none}
        .demoTop{display:flex;align-items:flex-start;justify-content:space-between;gap:20px}.demoTop>div{display:flex;flex-direction:column;gap:3px}.tiny{font-size:9px;letter-spacing:.12em;font-weight:900;color:#74808a}.demoTop strong{font-size:13px}
        .liveDot{font-size:9px;font-weight:900;letter-spacing:.08em;color:#a4372f;background:#ffe4df;border-radius:999px;padding:7px 9px}
        .demoProgress{height:4px;border-radius:999px;background:#e6e2db;margin:15px 0 22px;overflow:hidden}.demoProgress span{display:block;width:83%;height:100%;background:var(--coral)}
        .phoneMessage{border:1px solid #dedad2;border-radius:17px;padding:17px;background:white}.sender{display:flex;gap:11px;align-items:center}.senderIcon{width:35px;height:35px;border-radius:50%;display:grid;place-items:center;background:#ecf2f8;color:#12395e;font-weight:900}.sender div{display:flex;flex-direction:column}.sender b{font-size:12px}.sender small{font-size:10px;color:#7c858d;margin-top:2px}.phoneMessage p{font-size:15px;line-height:1.48;margin:15px 0 1px}.phoneMessage strong{color:#d64237}
        .demoQuestion{font-family:Georgia,"Times New Roman",serif;font-size:22px;margin:24px 0 12px}
        .demoAnswers{display:grid;gap:9px}.demoAnswer{min-height:48px;border-radius:12px;padding:11px 12px;display:grid;grid-template-columns:28px 1fr auto;align-items:center;gap:10px;font-size:12px;font-weight:800;border:1px solid #dedad2}.demoAnswer span{width:26px;height:26px;display:grid;place-items:center;border-radius:50%;border:1px solid #ccd3d8;font-size:10px}.demoAnswer.muted{color:#67727b}.demoAnswer.selected{background:#e9f8d7;border-color:#9bd835}.demoAnswer.selected span{background:var(--ink);color:white;border-color:var(--ink)}.demoAnswer.selected b{color:#487900}
        .demoFooter{border-top:1px solid #dedad2;margin-top:17px;padding-top:14px;display:flex;justify-content:space-between;gap:12px;font-size:10px;color:#727d85}.demoFooter b{color:var(--ink)}
        .signalBand{background:var(--navy);color:white;display:grid;grid-template-columns:repeat(4,1fr);padding:0 max(28px,calc((100vw - 1184px)/2));border-top:1px solid rgba(255,255,255,.07)}
        .signalBand>div{min-height:116px;padding:25px 20px;border-right:1px solid rgba(255,255,255,.1);display:grid;grid-template-columns:38px 1fr;grid-template-rows:auto auto;align-content:center}.signalBand>div:first-child{border-left:1px solid rgba(255,255,255,.1)}.signalBand span{grid-row:1/3;width:28px;height:28px;border:1px solid #60758a;border-radius:50%;display:grid;place-items:center;color:var(--lime);font-weight:900;font-size:11px}.signalBand b{font-size:13px}.signalBand small{color:#92a2b0;font-size:11px;margin-top:3px}
        .section{max-width:1184px;margin:0 auto;padding:112px 28px}.sectionHead{display:grid;grid-template-columns:minmax(260px,.85fr) minmax(360px,1.15fr);column-gap:70px;align-items:end}.sectionHead .eyebrow{grid-column:1/3}.section h2,.org h2{font-family:Georgia,"Times New Roman",serif;font-weight:500;letter-spacing:-.035em;line-height:1.02;margin:0;font-size:clamp(38px,4.5vw,61px)}.sectionHead>p:last-child{margin:0;color:#667078;line-height:1.7;font-size:15px;max-width:540px}
        .steps{margin-top:58px;border-top:1px solid var(--line);display:grid;grid-template-columns:repeat(4,1fr)}.steps article{padding:26px 24px 0 0;border-right:1px solid var(--line);min-height:210px}.steps article:not(:first-child){padding-left:24px}.steps article:last-child{border-right:0}.steps span,.editionNo{font-size:10px;letter-spacing:.09em;font-weight:900;color:#d94f45}.steps h3{font-family:Georgia,"Times New Roman",serif;font-size:22px;line-height:1.1;margin:30px 0 10px}.steps p{font-size:13px;line-height:1.65;color:#69737a;margin:0}
        .editions{padding-top:30px}.featuredEdition{display:grid;grid-template-columns:.9fr 1.1fr;background:var(--paper);border:1px solid var(--line);min-height:500px}.editionVisual{background:var(--coral);min-height:500px;padding:38px;display:flex;flex-direction:column;justify-content:space-between;overflow:hidden;position:relative}.editionNo{color:var(--ink);font-size:12px}.routeLine{display:flex;align-items:center;justify-content:space-between;position:relative}.routeLine:before{content:"";position:absolute;left:0;right:0;height:1px;background:rgba(9,21,34,.45)}.routeLine i{position:relative;width:17px;height:17px;border:3px solid var(--coral);outline:1px solid rgba(9,21,34,.65);border-radius:50%;background:var(--ink);z-index:1}.routeLine i:nth-child(3){width:44px;height:44px;border-width:8px;box-shadow:0 0 0 1px rgba(9,21,34,.65)}
        .editionBadge{display:inline-flex;align-self:flex-start;border:1px solid rgba(9,21,34,.5);border-radius:999px;padding:9px 12px;font-size:10px;font-weight:900;letter-spacing:.07em}.editionCopy{padding:54px 58px;display:flex;flex-direction:column;justify-content:center}.editionCopy h2{font-size:clamp(36px,4vw,55px)}.editionCopy>p:not(.eyebrow){color:#637078;line-height:1.65;margin:22px 0 16px}.editionCopy ul{list-style:none;padding:0;margin:0 0 26px;display:grid;gap:9px}.editionCopy li{font-size:13px;font-weight:750}.editionCopy li:before{content:"↳";color:var(--coral);margin-right:9px}.darkCta{align-self:flex-start;background:var(--ink);color:white;border-radius:999px;padding:14px 19px;font-size:13px}
        .editionIntro{display:flex;justify-content:space-between;gap:40px;align-items:end;margin:98px 0 35px}.editionIntro h2{max-width:690px}.editionIntro>p{max-width:330px;color:#687279;line-height:1.6;margin:0 0 5px}
        .editionGrid{display:grid;grid-template-columns:repeat(2,1fr);border-top:1px solid var(--line);border-left:1px solid var(--line)}.editionCard{min-height:310px;padding:32px;border-right:1px solid var(--line);border-bottom:1px solid var(--line);display:flex;flex-direction:column}.editionMeta{display:flex;justify-content:space-between;align-items:center}.editionMeta span{font-size:10px;font-weight:900;color:#d94f45}.editionMeta small{text-transform:uppercase;letter-spacing:.08em;font-size:9px;font-weight:900;color:#747d83}.editionCard h3{font-family:Georgia,"Times New Roman",serif;font-size:38px;font-weight:500;margin:54px 0 12px}.editionCard p{font-size:13px;line-height:1.65;color:#687279;margin:0;max-width:460px}.editionCard>a{margin-top:auto;padding-top:24px;color:var(--ink);text-decoration:none;font-size:12px;font-weight:900;display:flex;justify-content:space-between;border-top:1px solid transparent}.editionCard:hover{background:var(--paper)}.editionCard:hover>a{border-top-color:var(--line)}
        .org{background:var(--ink);color:white;padding:88px max(28px,calc((100vw - 1128px)/2));display:grid;grid-template-columns:minmax(0,1.25fr) minmax(260px,.75fr);gap:70px;align-items:end}.org h2{max-width:690px}.org>div>p:not(.eyebrow){max-width:660px;color:#bdc9d3;line-height:1.7;margin:24px 0 0}.orgActions{display:flex;flex-direction:column;align-items:flex-start;gap:14px}.primaryCta.lime{background:var(--lime);color:var(--ink);box-shadow:none}.orgActions small{color:#8193a4}
        .compact{grid-template-columns:1fr}.compact .eyebrow{grid-column:1}.compact h2{max-width:780px}.faqGrid{margin-top:52px;border-top:1px solid var(--line)}.faq details{border-bottom:1px solid var(--line)}.faq summary{list-style:none;cursor:pointer;display:flex;justify-content:space-between;gap:20px;padding:23px 0;font-family:Georgia,"Times New Roman",serif;font-size:21px}.faq summary::-webkit-details-marker{display:none}.faq summary span{font-family:Arial,sans-serif;color:#d94f45}.faq details p{max-width:760px;color:#667078;line-height:1.7;margin:0 0 24px;font-size:14px}
        .footer{max-width:1184px;margin:0 auto;padding:42px 28px 58px;border-top:1px solid var(--line);display:flex;justify-content:space-between;gap:40px}.brandFooter p{font-size:12px;color:#747d83;margin:12px 0 0}.footer nav{display:flex;flex-wrap:wrap;gap:18px;align-content:flex-start;justify-content:flex-end}.footer nav a{color:#53616a;text-decoration:none;font-size:11px;font-weight:800}
        @media(max-width:980px){.desktopNav{display:none}.hero{grid-template-columns:1fr;gap:58px;padding-top:132px}.scenarioDemo{max-width:650px;transform:none}.signalBand{grid-template-columns:repeat(2,1fr)}.sectionHead{grid-template-columns:1fr;gap:20px}.sectionHead .eyebrow{grid-column:1}.steps{grid-template-columns:repeat(2,1fr)}.steps article:nth-child(2){border-right:0}.featuredEdition{grid-template-columns:1fr}.editionVisual{min-height:280px}.org{grid-template-columns:1fr}.orgActions{margin-top:8px}}
        @media(max-width:640px){.nav{height:68px;padding:0 18px}.brand{font-size:14px}.brandMark{width:27px;height:27px}.navCta{padding:10px 13px;font-size:11px}.navCta span{display:none}.hero{margin-top:-68px;padding:116px 18px 54px;min-height:0}.hero h1{font-size:clamp(46px,15vw,65px)}.heroLead{font-size:16px;line-height:1.55;margin:22px 0 26px}.primaryCta{width:100%;padding:15px 17px}.textCta{width:100%;text-align:center}.proofRow{gap:10px;margin-top:22px}.proofRow span{flex:1;min-width:96px;font-size:10px}.scenarioDemo{padding:15px;border-radius:18px;box-shadow:8px 10px 0 rgba(127,184,255,.1)}.demoTop{gap:8px}.phoneMessage{padding:14px}.phoneMessage p{font-size:13px}.demoQuestion{font-size:19px;margin-top:19px}.demoAnswer{font-size:11px;line-height:1.35}.demoFooter{display:none}.signalBand{padding:0 18px}.signalBand>div{min-height:98px;padding:20px 10px;border-left:0!important}.section{padding:76px 18px}.section h2,.org h2{font-size:clamp(36px,11vw,48px)}.sectionHead>p:last-child{font-size:14px}.steps{grid-template-columns:1fr;margin-top:40px}.steps article,.steps article:not(:first-child){padding:24px 0;border-right:0;border-bottom:1px solid var(--line);min-height:0}.steps h3{margin:18px 0 8px}.featuredEdition{margin-left:-18px;margin-right:-18px;border-left:0;border-right:0}.editionVisual{min-height:210px;padding:25px}.editionCopy{padding:36px 24px}.darkCta{width:100%;justify-content:space-between}.editionIntro{display:block;margin:72px 0 28px}.editionIntro>p{margin-top:20px}.editionGrid{grid-template-columns:1fr;margin-left:-18px;margin-right:-18px;border-left:0}.editionCard{min-height:265px;padding:27px 22px}.editionCard h3{margin-top:42px;font-size:34px}.org{padding:70px 18px;gap:35px}.orgActions{width:100%}.faq summary{font-size:18px}.footer{padding:35px 18px 48px;flex-direction:column}.footer nav{justify-content:flex-start}}
        @media(prefers-reduced-motion:reduce){:global(html){scroll-behavior:auto}.primaryCta:hover{transform:none}}
      `}</style>
    </main>
  );
}
