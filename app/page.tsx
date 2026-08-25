import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Konfydence | Confidence Under Pressure" },
  description:
    "Practise safer decisions before pressure takes over. Konfydence uses realistic scenarios to train the pause, verification and next move.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Confidence under pressure | Konfydence",
    description: "Realistic decision practice for the moments when urgency, authority and familiarity distort judgment.",
    url: "https://konfydence.com",
    type: "website",
  },
};

const editions = [
  { slug: "travelsafe", no: "01", title: "TravelSafe", audience: "Travel", copy: "Bookings, payments, transport, Wi-Fi and unfamiliar systems when independent verification is harder." },
  { slug: "family", no: "02", title: "Family", audience: "Households", copy: "Money requests, impersonation, shared devices and the moments when emotion overrides verification." },
  { slug: "school", no: "03", title: "School", audience: "Ages 12–18", copy: "Gaming, group chats, fake links, account takeovers and social pressure without classroom-style lecturing." },
  { slug: "university", no: "04", title: "University", audience: "Students", copy: "Housing, jobs, tuition, identity, international-student pressure and campus impersonation." },
  { slug: "workplace", no: "05", title: "Workplace", audience: "Teams", copy: "Invoices, payroll changes, executive pressure, phishing and sensitive-data requests." },
];

const patterns = [
  ["H", "Hurry", "Pressure compresses time."],
  ["A", "Authority", "Status shortcuts scrutiny."],
  ["C", "Comfort", "Familiarity lowers the guard."],
  ["K", "Kill-Switch", "The critical action becomes the point of no return."],
];

export default function HomePage() {
  return (
    <main className="site">
      <header className="nav">
        <Link className="brand" href="/" aria-label="Konfydence home"><span>K</span><b>Konfydence</b></Link>
        <nav className="desktopNav" aria-label="Main navigation">
          <a href="#method">Method</a>
          <a href="#editions">Editions</a>
          <Link href="/countries">Travel intelligence</Link>
          <Link href="/comasy">For organisations</Link>
        </nav>
        <Link className="navCta" href="/challenge">Start a challenge <span>↗</span></Link>
      </header>

      <section className="hero">
        <div className="heroMedia">
          <Image
            src="/hero/konfydence-travelsafe-vacation.jpg"
            alt="Traveler reviewing a suspicious payment message on a phone"
            fill
            priority
            unoptimized
            sizes="100vw"
          />
          <div className="heroShade" />
        </div>
        <div className="heroCopy">
          <p className="kicker">Konfydence · Decision practice</p>
          <h1>Confidence begins<br/>before you click.</h1>
          <p className="heroLead">Train the pause before urgency, authority or familiarity decides for you.</p>
          <div className="heroActions">
            <Link className="primaryCta" href="/challenge">Experience the free challenge <span>↗</span></Link>
            <a className="textCta" href="#method">Discover the method</a>
          </div>
          <div className="proofRow"><span>No signup for round one</span><span>About 4 minutes</span><span>Immediate pressure profile</span></div>
        </div>
      </section>

      <section className="manifesto">
        <p className="kicker dark">Why Konfydence</p>
        <h2>The world got faster.<br/><em>Your judgment needs room.</em></h2>
        <p>Scams rarely win because people know nothing. They win because a credible request arrives at the wrong moment, under the right pressure. Konfydence rehearses that moment before it is real.</p>
      </section>

      <section id="method" className="method">
        <div className="sectionHead">
          <p className="kicker light">The H.A.C.K. Method</p>
          <h2>Four patterns.<br/>Thousands of situations.</h2>
          <Link href="/hack-method">Explore the method <span>→</span></Link>
        </div>
        <div className="patternList">
          {patterns.map(([key,title,copy]) => (
            <article key={key}><span>{key}</span><h3>{title}</h3><p>{copy}</p></article>
          ))}
        </div>
      </section>

      <section className="experience">
        <div className="experienceCopy">
          <p className="kicker dark">The experience</p>
          <h2>Do not study first.<br/>Make the decision you would make today.</h2>
          <p>Each scenario gives you plausible choices, immediate feedback and a reusable decision rule. Your result shows which pressure pattern deserves more practice.</p>
          <Link className="inkCta" href="/challenge">Choose your challenge <span>↗</span></Link>
        </div>
        <div className="experienceSteps" aria-label="Konfydence experience steps">
          <div><span>01</span><strong>Face</strong><p>A credible situation with incomplete information.</p></div>
          <div><span>02</span><strong>Choose</strong><p>The strongest next move—not the most obvious answer.</p></div>
          <div><span>03</span><strong>Learn</strong><p>See why the safer action breaks the risk chain.</p></div>
          <div><span>04</span><strong>Repeat</strong><p>Rehearse until the pause becomes a reflex.</p></div>
        </div>
      </section>

      <section id="editions" className="editions">
        <div className="editionLead">
          <p className="kicker dark">Konfydence Editions</p>
          <h2>Same human pressure.<br/>Different real lives.</h2>
          <p>Choose the environment where you want safer decisions to become automatic.</p>
        </div>
        <div className="editionGrid">
          {editions.map((e, index) => (
            <article className={index === 0 ? "editionCard featured" : "editionCard"} key={e.slug}>
              {index === 0 ? <div className="editionImage"><Image src="/challenge-editions/travelsafe.png" alt="TravelSafe edition" fill sizes="(max-width: 760px) 100vw, 40vw" /></div> : null}
              <div className="editionBody"><div className="editionMeta"><span>{e.no}</span><small>{e.audience}</small></div><h3>{e.title}</h3><p>{e.copy}</p><Link href={`/challenge/${e.slug}/start?mode=diagnostic`}>Start readiness check <span>↗</span></Link></div>
            </article>
          ))}
        </div>
      </section>

      <section className="travel">
        <div><p className="kicker light">Travel intelligence</p><h2>Read the official signal.<br/>Then rehearse your response.</h2></div>
        <div><p>Country pages surface official fraud and scam guidance before any commercial travel content. Use the evidence first, then practise the pressure moments with TravelSafe.</p><Link className="lightCta" href="/countries">Explore country scam alerts <span>↗</span></Link></div>
      </section>

      <section className="organizations">
        <div className="orgImage"><Image src="/edition-images/workplace.png" alt="Professionals discussing a workplace decision" fill sizes="(max-width: 800px) 100vw, 46vw" /></div>
        <div className="orgCopy"><p className="kicker dark">CoMaSy™ for organisations</p><h2>Awareness is not the same as readiness.</h2><p>Give teams short, realistic decisions to rehearse—and give security, risk, compliance and learning leaders evidence of how behaviour changes over time.</p><Link className="inkCta" href="/comasy">Explore CoMaSy <span>↗</span></Link></div>
      </section>

      <section className="closing">
        <p className="kicker dark">Start now</p>
        <h2>The next request will not tell you it is a test.</h2>
        <Link className="primaryCta" href="/challenge">Train before the pressure is real <span>↗</span></Link>
      </section>

      <footer className="footer"><div><Link className="footerBrand" href="/">Konfydence</Link><p>Confidence under pressure.</p></div><nav><Link href="/challenge">Challenges</Link><Link href="/hack-method">H.A.C.K.</Link><Link href="/countries">Travel intelligence</Link><Link href="/comasy">CoMaSy</Link><Link href="/contact">Contact</Link><Link href="/privacy-policy">Privacy</Link><Link href="/terms-of-service">Terms</Link></nav></footer>

      <style>{`
        :global(*){box-sizing:border-box}:global(html){scroll-behavior:smooth}:global(body){margin:0;background:#f4f1ea;color:#161616}.site{--ink:#171717;--paper:#f4f1ea;--white:#fbfaf6;--stone:#ddd7cc;--muted:#706c65;--accent:#d9574c;--dark:#171a1d;--line:rgba(23,23,23,.16);min-height:100vh;background:var(--paper);font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}.nav{height:78px;padding:0 max(28px,calc((100vw - 1280px)/2));display:flex;align-items:center;gap:34px;position:absolute;inset:0 0 auto;color:#fff;z-index:5;border-bottom:1px solid rgba(255,255,255,.2)}.brand{display:flex;align-items:center;gap:10px;color:inherit;text-decoration:none}.brand>span{width:31px;height:31px;border:1px solid currentColor;border-radius:50%;display:grid;place-items:center;font-size:11px}.brand b{font-size:15px;letter-spacing:-.03em}.desktopNav{display:flex;gap:30px;margin-left:auto}.desktopNav a{color:rgba(255,255,255,.82);text-decoration:none;font-size:13px;font-weight:650}.navCta,.primaryCta,.inkCta,.lightCta{display:inline-flex;align-items:center;justify-content:space-between;gap:28px;text-decoration:none;font-size:13px;font-weight:800}.navCta{border:1px solid rgba(255,255,255,.42);border-radius:999px;color:#fff;padding:11px 15px}.hero{height:min(900px,100svh);min-height:720px;position:relative;display:flex;align-items:flex-end;color:#fff;overflow:hidden}.heroMedia{position:absolute;inset:0}.heroMedia img{object-fit:cover;object-position:58% center}.heroShade{position:absolute;inset:0;background:linear-gradient(90deg,rgba(10,12,14,.82) 0%,rgba(10,12,14,.50) 44%,rgba(10,12,14,.10) 72%),linear-gradient(0deg,rgba(8,10,12,.38),transparent 48%)}.heroCopy{position:relative;z-index:2;width:min(1280px,calc(100% - 56px));margin:0 auto;padding:0 0 82px}.kicker{font-size:11px;line-height:1.2;text-transform:uppercase;letter-spacing:.16em;font-weight:800;margin:0 0 22px;color:rgba(255,255,255,.74)}.kicker.dark{color:#756f66}.kicker.light{color:#bcb6ac}.hero h1,.manifesto h2,.sectionHead h2,.experience h2,.editionLead h2,.travel h2,.organizations h2,.closing h2{font-family:Georgia,"Times New Roman",serif;font-weight:400;letter-spacing:-.055em}.hero h1{font-size:clamp(62px,8.1vw,124px);line-height:.86;margin:0;max-width:1000px}.heroLead{font-size:clamp(18px,1.7vw,23px);line-height:1.5;color:rgba(255,255,255,.82);max-width:610px;margin:30px 0}.heroActions{display:flex;align-items:center;gap:25px;flex-wrap:wrap}.primaryCta{background:var(--accent);color:#fff;border-radius:999px;padding:15px 19px}.textCta{color:#fff;text-underline-offset:5px;font-size:13px;font-weight:700}.proofRow{display:flex;gap:28px;margin-top:30px;color:rgba(255,255,255,.62);font-size:12px}.manifesto{width:min(1280px,calc(100% - 56px));margin:auto;padding:150px 0 160px}.manifesto h2{font-size:clamp(54px,7vw,102px);line-height:.94;margin:0;max-width:1080px}.manifesto h2 em{font-style:normal;color:#aaa298}.manifesto>p:last-child{font-size:18px;line-height:1.75;color:var(--muted);max-width:640px;margin:45px 0 0 auto}.method{background:var(--dark);color:#f4f1ea;padding:126px max(28px,calc((100vw - 1280px)/2)) 110px}.sectionHead{display:grid;grid-template-columns:1fr 1fr;gap:70px;align-items:end}.sectionHead .kicker{grid-column:1/-1;margin-bottom:0}.sectionHead h2{font-size:clamp(52px,6vw,86px);line-height:.94;margin:0}.sectionHead>a{color:#f4f1ea;justify-self:end;text-decoration:none;font-size:13px;border-bottom:1px solid #716e68;padding-bottom:7px}.patternList{margin-top:80px;border-top:1px solid #484847}.patternList article{display:grid;grid-template-columns:80px minmax(180px,.7fr) 1fr;gap:30px;align-items:center;min-height:132px;border-bottom:1px solid #3a3a39}.patternList article>span{font:400 42px Georgia,serif;color:#d6d0c6}.patternList h3{font:400 clamp(28px,3vw,42px) Georgia,serif;margin:0}.patternList p{font-size:15px;color:#aaa69f;line-height:1.55;margin:0}.experience{width:min(1280px,calc(100% - 56px));margin:auto;padding:145px 0;display:grid;grid-template-columns:.95fr 1.05fr;gap:110px}.experience h2{font-size:clamp(48px,5.4vw,76px);line-height:.98;margin:0}.experienceCopy>p:not(.kicker){font-size:16px;line-height:1.75;color:var(--muted);max-width:570px;margin:30px 0}.inkCta{background:var(--ink);color:#fff;border-radius:999px;padding:14px 17px;width:max-content}.experienceSteps{border-top:1px solid var(--line)}.experienceSteps>div{display:grid;grid-template-columns:58px 150px 1fr;gap:18px;align-items:center;min-height:122px;border-bottom:1px solid var(--line)}.experienceSteps span{font-size:11px;color:#958f86}.experienceSteps strong{font:400 28px Georgia,serif}.experienceSteps p{font-size:14px;color:var(--muted);line-height:1.5}.editions{background:#fbfaf6;padding:140px max(28px,calc((100vw - 1280px)/2))}.editionLead{display:grid;grid-template-columns:1fr .7fr;gap:90px;align-items:end;margin-bottom:70px}.editionLead .kicker{grid-column:1/-1;margin-bottom:-50px}.editionLead h2{font-size:clamp(50px,5.8vw,82px);line-height:.96;margin:0}.editionLead>p:last-child{color:var(--muted);font-size:16px;line-height:1.7;margin:0}.editionGrid{display:grid;grid-template-columns:repeat(4,1fr);border-top:1px solid var(--line);border-left:1px solid var(--line)}.editionCard{min-height:360px;border-right:1px solid var(--line);border-bottom:1px solid var(--line);display:flex;flex-direction:column}.editionCard.featured{grid-column:span 2;grid-row:span 2;min-height:720px}.editionImage{position:relative;min-height:410px;overflow:hidden}.editionImage img{object-fit:cover}.editionBody{padding:28px;display:flex;flex-direction:column;flex:1}.editionMeta{display:flex;justify-content:space-between;font-size:11px;color:#8c867e;text-transform:uppercase;letter-spacing:.1em}.editionBody h3{font:400 38px Georgia,serif;letter-spacing:-.04em;margin:45px 0 12px}.editionBody p{font-size:14px;line-height:1.62;color:var(--muted);margin:0}.editionBody a{color:var(--ink);text-decoration:none;font-size:12px;font-weight:800;margin-top:auto;padding-top:28px;display:flex;justify-content:space-between}.travel{background:#222426;color:#f5f2eb;padding:120px max(28px,calc((100vw - 1280px)/2));display:grid;grid-template-columns:1fr .78fr;gap:110px}.travel h2{font-size:clamp(52px,5.8vw,82px);line-height:.96;margin:0}.travel>div:last-child{align-self:end}.travel>div:last-child p{font-size:16px;line-height:1.75;color:#aaa9a5;margin:0 0 30px}.lightCta{color:#fff;border-bottom:1px solid #727272;padding-bottom:8px;width:max-content}.organizations{display:grid;grid-template-columns:.94fr 1.06fr;min-height:700px;background:#eeeae2}.orgImage{position:relative;min-height:700px}.orgImage img{object-fit:cover}.orgCopy{padding:100px max(48px,calc((100vw - 1280px)/2)) 100px 80px;align-self:center}.organizations h2{font-size:clamp(52px,5.6vw,80px);line-height:.96;margin:0}.orgCopy>p:not(.kicker){font-size:16px;line-height:1.75;color:var(--muted);max-width:560px;margin:30px 0}.closing{text-align:center;padding:145px 28px 155px;background:#fbfaf6}.closing h2{font-size:clamp(52px,6.5vw,90px);line-height:.96;max-width:980px;margin:0 auto 40px}.footer{background:#151719;color:#c5c0b7;padding:58px max(28px,calc((100vw - 1280px)/2));display:flex;justify-content:space-between;gap:60px}.footerBrand{font:400 27px Georgia,serif;color:#fff;text-decoration:none}.footer p{font-size:12px;color:#77756f}.footer nav{display:flex;gap:24px;flex-wrap:wrap;align-items:flex-start}.footer nav a{color:#aaa7a0;text-decoration:none;font-size:12px}
        @media(max-width:900px){.desktopNav{display:none}.nav{padding:0 20px}.navCta{margin-left:auto}.heroCopy{width:calc(100% - 40px);padding-bottom:55px}.hero h1{font-size:clamp(54px,12vw,82px)}.manifesto{width:calc(100% - 40px);padding:100px 0}.manifesto>p:last-child{margin-left:0}.sectionHead,.experience,.editionLead,.travel,.organizations{grid-template-columns:1fr}.sectionHead>a{justify-self:start}.experience{width:calc(100% - 40px);gap:55px;padding:95px 0}.patternList article{grid-template-columns:55px 1fr}.patternList p{grid-column:2}.editionLead .kicker{margin-bottom:0}.editionGrid{grid-template-columns:1fr 1fr}.editionCard.featured{grid-column:span 2;grid-row:auto;min-height:620px}.travel{gap:45px}.organizations{min-height:auto}.orgImage{min-height:520px}.orgCopy{padding:80px 24px}.footer{flex-direction:column}}
        @media(max-width:560px){.navCta{font-size:0;gap:0;width:42px;height:42px;padding:0;display:grid;place-items:center}.navCta span{font-size:16px}.hero{min-height:720px}.heroShade{background:linear-gradient(0deg,rgba(8,10,12,.88) 0%,rgba(8,10,12,.42) 62%,rgba(8,10,12,.22))}.heroCopy{padding-bottom:46px}.hero h1{font-size:clamp(52px,15vw,72px)}.heroLead{font-size:17px}.proofRow{gap:12px;flex-direction:column}.manifesto h2,.sectionHead h2,.experience h2,.editionLead h2,.travel h2,.organizations h2,.closing h2{font-size:clamp(45px,13vw,62px)}.method,.editions,.travel{padding-left:20px;padding-right:20px}.patternList article{padding:22px 0;min-height:0}.experienceSteps>div{grid-template-columns:46px 1fr;padding:18px 0}.experienceSteps p{grid-column:2;margin:0}.editionGrid{grid-template-columns:1fr}.editionCard.featured{grid-column:auto;min-height:560px}.editionImage{min-height:300px}.orgImage{min-height:390px}.closing{padding:100px 20px}.footer{padding:50px 20px}.footer nav{display:grid;grid-template-columns:1fr 1fr}}
        @media(prefers-reduced-motion:reduce){:global(html){scroll-behavior:auto}}
      `}</style>
    </main>
  );
}
