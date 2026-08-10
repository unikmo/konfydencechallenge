import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Konfydence Challenge | Scenario-Based Training" },
  description: "Choose a real-life pressure scenario and build the pause habit before the moment is real.",
};

const games = [
  ["travelsafe", "TravelSafe", "Travelers and tourists", "Tickets, hotels, taxis, Wi-Fi, refunds, rentals, and tourist traps.", "Start Free Readiness Check"],
  ["family", "Family", "Parents, children, and elders", "Money requests, shared devices, emotional pressure, and account risks.", "Start Free Readiness Check"],
  ["school", "School", "Students ages 12-18", "Fake links, group chats, gaming pressure, and account takeovers.", "Start Free Readiness Check"],
  ["university", "University", "Students and international offices", "Housing, jobs, tuition, identity, campus messages, and travel traps.", "Start Free Readiness Check"],
  ["workplace", "Workplace", "Teams, HR, and managers", "Phishing, invoices, payroll changes, executive pressure, and data requests.", "Start Free Readiness Check"],
];

const steps = [
  ["01", "Choose your edition", "Pick the pressure situations closest to your real life."],
  ["02", "Face the scenario", "Make a decision while urgency and trust are working against you."],
  ["03", "Get your score", "See your readiness and the pressure pattern to practise next."],
  ["04", "Continue with the Full Challenge", "Unlock the complete scenario-based training experience when you are ready."],
];

export default function ChallengeLandingPage() {
  return (
    <main className="challenge-page">
      <header className="site-nav">
        <Link className="brand" href="/">Konfydence</Link>
        <nav aria-label="Main navigation">
          <Link href="/travelsafe">TravelSafe</Link>
          <Link href="/#how-it-works">How It Works</Link>
          <Link href="/country-alerts">Country Scam Alerts</Link>
          <Link href="/#other-challenges">Other Challenges</Link>
          <Link href="/#for-organizations">For Organizations</Link>
          <Link href="/pricing">Pricing</Link>
          <Link className="nav-cta" href="/challenge/travelsafe/start?mode=diagnostic">Take the Free Check</Link>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Konfydence Challenge</p>
          <h1><span className="travel-question">Travelling?</span><br /><strong>What's your Konfydence level?</strong></h1>
          <p className="lede">Don't let scammers ruin your trip before it starts. Start with the 3-minute TravelSafe Free Readiness Check, face realistic travel-scam scenarios, and discover which pressure tactics you should watch for.</p>
          <div className="actions">
            <Link className="primary" href="/challenge/travelsafe/start?mode=diagnostic">Start Free Readiness Check</Link>
            <Link className="secondary" href="#how-it-works">See how it works</Link>
          </div>
          <p className="proof"><span>✓</span> No signup <span>✓</span> 3 minutes <span>✓</span> Immediate readiness score</p>
        </div>
        <div className="score-card animated-score" aria-label="Animated example of the TravelSafe readiness check">
          <div className="demo-stages">
            <div className="demo-stage stage-before">
              <small>BEFORE THE TEST</small>
              <h3>Ready to discover your pressure pattern?</h3>
              <p>Start the 3-minute TravelSafe Free Readiness Check.</p>
            </div>
            <div className="demo-stage stage-during">
              <small>INSIDE THE CHALLENGE</small>
              <h3>Face a real travel-scam scenario.</h3>
              <p>What would you do when the pressure feels real?</p>
              <div className="scenario-chip">SCENARIO: <b>HURRY</b></div>
            </div>
            <div className="demo-stage stage-after">
              <small>AFTER THE TEST · EXAMPLE RESULT</small>
              <h3>TravelSafe Readiness Score</h3>
              <p>Your result shows what to practise next.</p>
              <div className="example-score"><b>82</b><span>/ 100</span></div>
            </div>
          </div>
          <div className="demo-focus">
            <small>YOUR FOCUS</small>
            <div className="focus-stage focus-before">START</div>
            <div className="focus-stage focus-during">PAUSE</div>
            <div className="focus-stage focus-after">VERIFY<br />THEN ACT</div>
          </div>
        </div>
      </section>

      <div className="hack-strip">HURRY · AUTHORITY · CONNECTION · KILL-SWITCH</div>

      <section id="how-it-works" className="section">
        <p className="section-kicker">How it works</p>
        <h2>Practise the moment before it matters.</h2>
        <div className="steps">{steps.map(([number, title, text]) => <article className="step" key={number}><b>{number}</b><h3>{title}</h3><p>{text}</p></article>)}</div>
      </section>

      <section id="challenge-editions" className="section games-section">
        <p className="section-kicker">Challenge Editions</p>
        <h2>Which pressure situations feel familiar?</h2>
        <p className="section-intro">Built from real scam scripts and designed for scenario-based training, not lectures. Start with a Free Readiness Check, then unlock the Full Challenge when you want the complete experience.</p>
        <div className="games">{games.map(([edition, title, audience, description, cta]) => <article className="game" key={edition}><div><span className="game-label">{audience}</span><h3>{title}</h3><p>{description}</p></div><Link href={`/challenge/${edition}/start?mode=diagnostic`} className="game-link">{cta}</Link></article>)}</div>
      </section>

      <section id="for-organizations" className="trust"><b>Scenario-based training for organizations</b><p>Pressure tactics are built to make people act before they verify. Konfydence gives schools, employers, and institutional partners a practical way to rehearse safer decisions while the stakes are still low.</p></section>

      <footer className="footer">
        <div><b>Konfydence</b><span>Safer digital decisions under pressure.</span></div>
        <nav><Link href="/">Home</Link><Link href="/contact">Contact</Link><Link href="/imprint">Imprint</Link><Link href="/privacy-policy">Privacy</Link><Link href="/terms-of-service">Terms</Link><Link href="/cookie-policy">Cookies</Link></nav>
      </footer>

      <style>{`
        .challenge-page{min-height:100vh;background:#f4f7fb;color:#102344;padding:0 clamp(18px,5vw,64px) 56px;font-family:Arial,Helvetica,sans-serif}.site-nav{max-width:1120px;margin:auto;min-height:72px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #dce5f0}.brand{font-size:22px;font-weight:900;color:#102344;text-decoration:none}.site-nav nav{display:flex;align-items:center;gap:22px}.site-nav nav a,.footer a{font-size:13px;font-weight:700;color:#365477;text-decoration:none}.nav-cta{background:#ff584c!important;color:#fff!important;padding:11px 15px;border-radius:9px}
        .hero{max-width:1120px;margin:auto;display:grid;grid-template-columns:minmax(280px,500px) minmax(320px,1fr);gap:clamp(32px,5vw,68px);align-items:center;padding:70px 0 46px}.eyebrow,.section-kicker{color:#12639d;font-size:12px;font-weight:900;letter-spacing:.09em;text-transform:uppercase;margin:0 0 14px}.hero h1{font-size:clamp(31px,3.9vw,49px);line-height:1.05;letter-spacing:0;margin:0;font-weight:850}.hero h1 .travel-question{font-size:1.15em}.hero h1 strong{color:#ff584c}.lede{max-width:430px;color:#526b93;font-size:18px;line-height:1.65;margin:24px 0 26px}.actions{display:flex;flex-direction:row;flex-wrap:wrap;align-items:center;gap:12px}.primary,.secondary{display:inline-flex;text-decoration:none;font-weight:850;border-radius:10px;padding:14px 20px}.primary{background:#ff584c;color:#fff;box-shadow:0 4px 0 #d74339}.secondary{background:#fff;color:#102344;border:2px solid #d9e2ef;box-shadow:0 4px 0 #d9e2ef}.proof{display:flex;flex-wrap:wrap;gap:12px;color:#365477;font-size:12px;font-weight:700;margin-top:18px}.proof span{color:#70b923}
        .score-card{display:flex;width:100%;max-width:520px;min-height:300px;filter:drop-shadow(0 14px 0 #dce4f0);border-radius:22px;overflow:hidden;background:#fff}.score-main{flex:1;padding:34px 26px;display:flex;flex-direction:column;justify-content:center}.score-meta{display:flex;gap:40px;text-transform:uppercase;color:#486187;font-size:10px;line-height:1.6;margin-bottom:22px}.score-meta b{font-size:13px;color:#102344}.route{font-size:16px;font-weight:850;margin:0 0 20px;letter-spacing:.02em}.route b{color:#ff584c;margin:0 8px}.score-main p{color:#486187;font-size:12px;line-height:1.5;margin:0}.score-pill{display:flex;align-items:center;gap:12px;background:#9cff24;border-radius:11px;padding:12px 14px;margin-top:20px;color:#102344}.score-pill>b{font-size:26px}.score-pill span{font-size:11px;font-weight:700;line-height:1.2}.score-pill small{display:block;font-size:9px;font-weight:700;margin-top:5px}.gate{width:124px;background:#102344;color:#9cff24;padding:22px 13px;display:flex;flex-direction:column;justify-content:space-between;font-size:11px}.gate>b{font-size:20px}.gate div{font-size:11px;color:#fff;line-height:1.5;letter-spacing:.08em}
        .hack-strip{max-width:1120px;margin:auto;background:#102344;color:#fff;border-radius:10px;text-align:center;padding:12px;font-size:12px;font-weight:850;letter-spacing:.04em}.section{max-width:1120px;margin:58px auto 0}.section h2{font-size:clamp(28px,4vw,42px);margin:0 0 22px;line-height:1.08}.section-intro{max-width:680px;color:#526b93;line-height:1.55}.steps{display:grid;grid-template-columns:repeat(4,1fr);gap:20px}.step{border-top:3px solid #dce5f0;padding-top:14px}.step>b{color:#ff584c;font-size:12px}.step h3{font-size:17px;margin:9px 0 6px}.step p,.game p,.trust p{color:#607797;font-size:14px;line-height:1.5;margin:0}.games-section{border-top:1px solid #dce5f0;padding-top:42px}.games{display:grid;grid-template-columns:repeat(5,1fr);gap:14px}.game{min-height:240px;background:#fff;border:1px solid #dce5f0;border-radius:12px;padding:18px;display:flex;flex-direction:column;justify-content:space-between}.game-label{font-size:10px;text-transform:uppercase;font-weight:850;color:#12639d}.game h3{font-size:21px;margin:12px 0 8px}.game-link{display:flex;justify-content:center;text-align:center;background:#ffb31d;color:#102344;text-decoration:none;font-size:13px;font-weight:850;border-radius:9px;padding:11px 8px}.trust{max-width:1120px;margin:42px auto 0;background:#eaf3ff;border:1px solid #cfe1f4;border-radius:12px;padding:22px}.trust b{font-size:18px}.trust p{margin-top:8px}.footer{max-width:1120px;margin:46px auto 0;border-top:1px solid #dce5f0;padding-top:20px;display:flex;justify-content:space-between;gap:20px}.footer div{display:flex;flex-direction:column;gap:6px}.footer span{color:#607797;font-size:12px}.footer nav{display:flex;flex-wrap:wrap;gap:16px;align-content:flex-start}
        @media(max-width:900px){.games{grid-template-columns:repeat(2,1fr)}.steps{grid-template-columns:repeat(2,1fr)}}@media(max-width:720px){.site-nav nav a:not(.nav-cta){display:none}.hero{grid-template-columns:1fr;padding-top:40px}.score-card{max-width:560px}.footer{flex-direction:column}}@media(max-width:440px){.games{grid-template-columns:1fr}.steps{grid-template-columns:1fr}.gate{width:84px}.score-meta{gap:18px}}
.animated-score{min-height:330px}.demo-stages{position:relative;flex:1;min-width:0;min-height:330px;background:#fff}.demo-stage{position:absolute;inset:0;padding:38px 30px;opacity:0;animation:demoStage 15s infinite;display:flex;flex-direction:column;justify-content:center}.demo-stage small,.demo-focus small{font-size:10px;font-weight:900;letter-spacing:.06em;color:#526b93}.demo-stage h3{font-size:23px;line-height:1.15;margin:16px 0 10px;color:#102344}.demo-stage p{font-size:14px;line-height:1.5;color:#526b93;margin:0;max-width:280px}.stage-before{animation-delay:0s}.stage-during{animation-delay:5s}.stage-after{animation-delay:10s}.scenario-chip{display:inline-flex;align-self:flex-start;margin-top:20px;padding:9px 12px;border-radius:8px;background:#fff1ed;color:#d94b3f;font-size:11px;font-weight:900}.example-score{display:flex;align-items:baseline;gap:5px;margin-top:18px;color:#102344}.example-score b{font-size:42px}.example-score span{font-size:14px;color:#526b93;font-weight:800}.demo-focus{width:124px;background:#102344;color:#9cff24;padding:28px 16px;display:flex;flex-direction:column;justify-content:space-between}.demo-focus small{color:#9cff24}.focus-stage{font-size:19px;font-weight:900;line-height:1.35;opacity:0;animation:demoStage 15s infinite}.focus-before{animation-delay:0s}.focus-during{animation-delay:5s}.focus-after{animation-delay:10s}@keyframes demoStage{0%,27%{opacity:1;transform:translateY(0)}33%,100%{opacity:0;transform:translateY(5px)}}@media(max-width:420px){.demo-stage{padding:28px 18px}.demo-stage h3{font-size:19px}.demo-focus{width:96px;padding:22px 12px}}      `}</style>
    </main>
  );
}
