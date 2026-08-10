import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Travel Scam Test: Free 3-Minute TravelSafe Check | Konfydence" },
  description: "Take the free 3-minute TravelSafe travel scam test. Face realistic booking, hotel, taxi, payment and Wi-Fi scams, get your readiness score, and learn your weak spot.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Konfydence",
    title: "Would You Spot a Travel Scam Before It Cost You?",
    description: "Take the free 3-minute TravelSafe check and discover which scam-pressure tactic is most likely to catch you off guard.",
    url: "https://konfydence.com/",
    images: [{ url: "/opengraph-image.png", alt: "TravelSafe free travel scam check by Konfydence" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Would You Spot a Travel Scam Before It Cost You?",
    description: "Take the free 3-minute TravelSafe check and discover your scam-pressure weak spot.",
    images: ["/opengraph-image.png"],
  },
};

const steps = [
  ["01", "Face the scenario", "Respond to realistic travel scams rather than general knowledge questions."],
  ["02", "Choose what you would do", "Make the decision you would genuinely make when urgency, authority or trust is being used against you."],
  ["03", "Get your readiness score", "See how prepared you are and which pressure pattern is your weak spot."],
  ["04", "Learn the safer move", "Get a practical pause-and-verify response you can use during your trip."],
];

const coverage = [
  ["Booking and hotel scams", "Fake confirmations, payment changes, cancellation threats and fraudulent accommodation listings."],
  ["Taxi and transport scams", "Unofficial drivers, invented fees, unnecessary detours and fake disruption assistance."],
  ["Payment and refund scams", "Urgent transfers, card-payment tricks, fake airline support and fraudulent compensation offers."],
  ["Wi-Fi, QR and device scams", "Fake networks, login traps, malicious QR codes and attempts to steal account details."],
  ["Fake officials and emergencies", "Invented fines, official impersonation, document pressure and staged emergencies."],
  ["Tourist and social manipulation", "Distraction tactics, overfriendly strangers, emotional requests and rushed decisions."],
];

const editions = [
  ["Family", "PARENTS, CHILDREN AND OLDER RELATIVES", "Practise responding to emergency money requests, family impersonation, parcel scams, shared-device risks and account takeovers.", "family", "Start Family", "amber", "/edition-images/family-art.png"],
  ["School", "STUDENTS AGES 12-18", "Recognize fake giveaways, gaming scams, group-chat pressure, phishing links and attempts to steal social accounts.", "school", "Start School", "blue", "/edition-images/school-art.png"],
  ["University", "STUDENTS AND INTERNATIONAL OFFICES", "Prepare for student housing scams, fake jobs, tuition fraud, marketplace scams and identity theft.", "university", "Start University", "green", "/edition-images/university-art.png"],
  ["Workplace", "TEAMS, HR AND MANAGERS", "Test readiness for phishing, invoice fraud, payroll changes, executive impersonation and AI voice scams.", "workplace", "Start Workplace", "coral", "/edition-images/workplace-art.png"],
];

const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Konfydence",
    url: "https://konfydence.com/",
  },
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Konfydence",
    url: "https://konfydence.com/",
    logo: "https://konfydence.com/icon.png",
  },
];

export default function HomePage() {
  return (
    <main className="home-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      <header className="site-nav">
        <Link className="brand" href="/" aria-label="Konfydence home">
          <img className="brand-logo" src="/konfydence-logo-horizontal-color.png" alt="Konfydence" />
        </Link>
        <nav aria-label="Main navigation">
          <Link className="active" href="/travelsafe">TravelSafe</Link>
          <Link href="#how-it-works">How It Works</Link>
          <Link href="/country-alerts">Country Scam Alerts</Link>
          <Link href="#other-challenges">Other Challenges</Link>
          <Link href="#for-organizations">For Organizations</Link>
          <Link href="/pricing">Pricing</Link>
          <Link className="nav-cta" href="/challenge/travelsafe/start?mode=diagnostic">Take the Free Check</Link>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Free 3-minute travel scam test</p>
          <h1><span>Would you spot a <strong>travel scam</strong></span><span>before it cost you?</span></h1>
          <p className="lede">TravelSafe puts you inside realistic scams involving bookings, hotels, taxis, payments, refunds and public Wi-Fi. Make the decisions, receive your Konfydence Readiness Score, and discover which pressure tactic is most likely to catch you off guard.</p>
          <div className="actions">
            <Link className="primary" href="/challenge/travelsafe/start?mode=diagnostic">Take the Free Check</Link>
            <Link className="secondary" href="#how-it-works">See How It Works</Link>
          </div>
          <p className="trust-line"><span>No signup</span><span>3 minutes</span><span>Immediate personal score</span></p>
          <p className="hero-price">Full TravelSafe Challenge: $4.99 after the free check.</p>
        </div>

        <div className="travel-visual" role="img" aria-label="TravelSafe travel scam readiness visual with a hotel booking warning and a pause-first action">
          <img className="travel-art" src="/edition-images/travelsafe-hero.png" alt="TravelSafe travel scam readiness for every trip, with a hotel booking warning and a pause-first action." />
        </div>
      </section>

      <section id="how-it-works" className="section how-section">
        <p className="section-label">How TravelSafe Works</p>
        <h2>A three-minute check before your trip</h2>
        <div className="steps">
          {steps.map(([number, title, copy]) => (
            <article className="step" key={number}>
              <span className="step-icon">{number}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
        <Link className="primary centered-cta" href="/challenge/travelsafe/start?mode=diagnostic">Take the Free Check</Link>
      </section>

      <section className="section coverage-section">
        <p className="section-label">What TravelSafe Covers</p>
        <h2>The travel scams most likely to reach you</h2>
        <p className="section-intro">TravelSafe uses practical scenarios based on common pressure moments before and during a trip.</p>
        <div className="coverage-grid">
          {coverage.map(([title, copy], index) => (
            <article className={`coverage-card coverage-${index + 1}`} key={title}>
              <span className="coverage-mark">0{index + 1}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
        <Link className="secondary centered-cta coverage-cta" href="/challenge/travelsafe/start?mode=diagnostic">See How You Would Respond</Link>
      </section>

      <section className="result-section">
        <div className="result-copy">
          <p className="section-label">Your Result</p>
          <h2>Know which kind of pressure works on you</h2>
          <p>TravelSafe does more than mark answers right or wrong. Your Konfydence Readiness Score shows how you respond to four recurring scam-pressure patterns: Hurry, Authority, Connection and Kill-switch. You leave knowing which weak spot to practise before your trip.</p>
          <p className="supporting-line">The HACK method helps you recognize pressure before pressure controls the decision.</p>
          <Link className="text-link" href="/hack-method">How the HACK method works <span aria-hidden="true">-&gt;</span></Link>
        </div>
        <div className="result-panel" aria-label="Konfydence HACK pressure patterns">
          <div className="hack-list">
            <p className="hack-title">HACK</p>
            <p><b className="hack-letter hurry">H</b><span><strong>Hurry</strong> Create urgency so you act before you think.</span></p>
            <p><b className="hack-letter authority">A</b><span><strong>Authority</strong> Use official-sounding pressure.</span></p>
            <p><b className="hack-letter connection">C</b><span><strong>Connection</strong> Build trust or emotion to lower your guard.</span></p>
            <p><b className="hack-letter killswitch">K</b><span><strong>Kill-switch</strong> Block verification or limit your options.</span></p>
          </div>
        </div>
      </section>

      <section className="country-promo">
        <div>
          <p className="section-label">Travelling Soon?</p>
          <h2>Check common scams at your destination</h2>
          <p>Review destination-specific tourist scams, payment risks and pressure tactics before you leave.</p>
        </div>
        <Link className="primary country-cta" href="/country-alerts">View Country Scam Alerts</Link>
      </section>

      <section id="other-challenges" className="section editions-section">
        <p className="section-label">More Konfydence Challenges</p>
        <h2>Prepare for the pressure situations closest to your life</h2>
        <p className="section-intro">Every edition starts with a free readiness check and uses realistic scenarios to show where safer decisions need more practice.</p>
        <div className="edition-grid">
          {editions.map(([title, audience, copy, slug, cta, color, imagePath]) => (
            <article className={`edition-card edition-${color}`} key={slug}>
              <div className="edition-heading">
                <h3>{title}</h3>
                <p className="edition-audience">{audience}</p>
                <p className="edition-price">Full Challenge: $4.99</p>
              </div>
              <div className="edition-media">
                <img className="edition-image" src={imagePath} alt={`${title} challenge edition`} />
              </div>
              <p className="edition-copy">{copy}</p>
              <Link href={`/challenge/${slug}/start?mode=diagnostic`}>{cta}</Link>
            </article>
          ))}
        </div>
      </section>

      <section id="for-organizations" className="organization-section">
        <div>
          <p className="section-label">For Organizations</p>
          <h2>Practical scam-readiness training for schools and workplaces</h2>
          <p>Give students or employees realistic practice with phishing, impersonation, payment pressure and account-takeover scenarios. Talk to Konfydence about group access, tailored scenario sets and an organization pilot.</p>
        </div>
        <Link className="organization-cta" href="/contact?topic=organization-pilot">Request an Organization Pilot</Link>
      </section>

      <footer className="footer">
        <div className="footer-brand">
          <Link className="footer-logo" href="/" aria-label="Konfydence home">
            <img src="/konfydence-logo-horizontal-white.png" alt="Konfydence" />
          </Link>
          <span>Scenario-based scam-readiness training for safer decisions under pressure.</span>
          <div className="social-placeholders" aria-label="Social media links"><span>in</span><span>X</span></div>
        </div>
        <div className="footer-column"><strong>Challenges</strong><Link href="/travelsafe">TravelSafe</Link><Link href="/family">Family</Link><Link href="/school">School</Link><Link href="/university">University</Link><Link href="/workplace">Workplace</Link></div>
        <div className="footer-column"><strong>Resources</strong><Link href="/country-alerts">Country Scam Alerts</Link><Link href="/hack-method">HACK Method</Link><Link href="#for-organizations">For Organizations</Link><Link href="/contact">Contact</Link></div>
        <div className="footer-column"><strong>Legal</strong><Link href="/imprint">Imprint</Link><Link href="/privacy-policy">Privacy</Link><Link href="/terms-of-service">Terms</Link><Link href="/cookie-policy">Cookies</Link></div>
        <p className="disclaimer">Konfydence provides educational scam-readiness training. It does not guarantee protection from fraud, financial loss or other harm.</p>
      </footer>

      <style>{`
        .home-page{min-height:100vh;background:#f7f9fc;color:#102344;padding:0 clamp(18px,4vw,56px);font-family:Arial,Helvetica,sans-serif}.home-page *{box-sizing:border-box}.home-page a{color:inherit}.site-nav{max-width:1180px;margin:auto;min-height:72px;display:flex;align-items:center;justify-content:space-between;gap:28px;border-bottom:1px solid #dbe4ef}.site-nav .brand{font-size:23px;font-weight:900;color:#102344;text-decoration:none}.site-nav nav{display:flex;align-items:center;justify-content:flex-end;gap:20px;flex-wrap:wrap}.site-nav nav a{font-size:12px;font-weight:800;color:#1e3556;text-decoration:none;white-space:nowrap}.site-nav nav a.active{color:#ef4e43;border-bottom:2px solid #ef4e43;padding-bottom:9px}.nav-cta{background:#ff584c!important;color:#fff!important;padding:12px 16px;border-radius:9px;box-shadow:0 3px 0 #d74339}.hero{max-width:1180px;margin:auto;display:grid;grid-template-columns:minmax(500px,1.08fr) minmax(420px,1fr);gap:clamp(42px,5vw,68px);align-items:center;padding:72px 0 60px}.eyebrow,.section-label{color:#e9463e;font-size:11px;font-weight:900;letter-spacing:.08em;text-transform:uppercase;margin:0 0 14px}.hero h1{font-size:clamp(34px,3vw,46px);line-height:1.08;letter-spacing:0;margin:0 0 20px;max-width:none}.hero h1 span{display:block;white-space:nowrap}.hero h1 strong{color:#ff584c}.lede{max-width:450px;color:#50698e;font-size:16px;line-height:1.55;margin:0 0 24px}.actions{display:flex;gap:12px;flex-wrap:wrap}.primary,.secondary{display:inline-flex;align-items:center;justify-content:center;text-decoration:none;font-weight:900;border-radius:9px;padding:13px 18px}.primary{background:#ff584c;color:#fff;box-shadow:0 3px 0 #d74339}.secondary{background:#fff;color:#102344;border:1px solid #d6e0ed;box-shadow:0 3px 0 #dce5f0}.trust-line{display:flex;flex-wrap:wrap;gap:16px;color:#365477;font-size:11px;font-weight:800;margin:20px 0 0}.trust-line span:before{content:'+';display:inline-grid;place-items:center;width:14px;height:14px;margin-right:5px;border-radius:50%;background:#9bdc3d;color:#fff;font-size:10px}.scenario-card{display:flex;width:100%;max-width:650px;min-height:350px;border-radius:18px;overflow:hidden;background:#fff;box-shadow:0 14px 0 #dce5f0,0 12px 32px rgba(16,35,68,.08)}.scenario-main{flex:1;padding:38px 32px}.card-kicker{color:#12639d;font-size:10px;font-weight:900;letter-spacing:.08em;text-transform:uppercase;margin:0 0 16px}.scenario-main h2{font-size:26px;line-height:1.15;margin:0 0 12px;max-width:430px}.scenario-prompt{color:#50698e;font-size:13px;margin:0 0 14px}.pressure-tag{display:inline-flex;border-radius:7px;background:#fff0ed;color:#eb5045;padding:7px 10px;font-size:10px;font-weight:900;text-transform:uppercase}.scenario-options{display:grid;gap:10px;margin-top:22px}.scenario-options div{display:flex;align-items:center;gap:10px;border:1px solid #dbe4ef;border-radius:8px;padding:11px;color:#293c5b;font-size:12px}.radio{width:12px;height:12px;border:1px solid #8fa6c0;border-radius:50%;flex:0 0 12px}.scenario-focus{width:150px;background:#102344;color:#fff;padding:28px 20px;display:flex;flex-direction:column;align-items:center;justify-content:space-between}.scenario-focus p{font-size:10px;font-weight:900;letter-spacing:.08em;text-transform:uppercase;align-self:flex-start;margin:0;color:#fff}.scenario-focus strong{font-size:30px;color:#9cff24;text-transform:uppercase}.pause-mark{display:grid;place-items:center;width:64px;height:64px;border:6px solid #9cff24;border-radius:50%;color:#9cff24;font-size:22px;font-weight:900}.hack-strip{max-width:1180px;margin:0 auto;background:#102344;color:#fff;border-radius:10px;padding:13px 20px;display:flex;align-items:center;justify-content:center;gap:28px;font-size:12px;font-weight:900;letter-spacing:.04em;text-transform:uppercase;overflow:hidden}.hack-strip strong{color:#9cff24;letter-spacing:.12em;white-space:nowrap}.hack-strip span{display:inline-block;opacity:.45;animation:hackFocus 8s ease-in-out infinite}.hack-strip span:nth-of-type(2){animation-delay:2s}.hack-strip span:nth-of-type(3){animation-delay:4s}.hack-strip span:nth-of-type(4){animation-delay:6s}.section{max-width:1180px;margin:0 auto;padding:54px 0 62px;border-top:1px solid #e0e7f0}.section h2,.result-section h2,.country-promo h2,.organization-section h2{font-size:clamp(28px,3.4vw,42px);line-height:1.08;margin:0 0 25px}.how-section,.editions-section{text-align:center}.how-section .section-label,.coverage-section .section-label,.editions-section .section-label{text-align:center}.steps{display:grid;grid-template-columns:repeat(4,1fr);gap:28px;text-align:center;margin-top:38px}.step{padding:0 8px}.step-icon{display:grid;place-items:center;width:50px;height:50px;margin:0 auto 16px;border-radius:50%;background:#e6f0ff;color:#12639d;font-size:12px;font-weight:900}.step:nth-child(2) .step-icon{background:#fff0ed;color:#ef4e43}.step:nth-child(3) .step-icon{background:#edf8dc;color:#68a52f}.step:nth-child(4) .step-icon{background:#e7f0ff;color:#102344}.step h3,.coverage-card h3,.edition-card h3{font-size:16px;line-height:1.2;margin:0 0 8px}.step p,.coverage-card p,.edition-card p{color:#526b93;font-size:13px;line-height:1.45;margin:0}.centered-cta{margin:30px auto 0}.coverage-section h2,.coverage-section .section-intro{text-align:center;margin-left:auto;margin-right:auto}.coverage-section h2{max-width:1000px}.section-intro{max-width:640px;margin:0 auto 24px;text-align:center;color:#526b93;line-height:1.5}.coverage-grid{display:grid;grid-template-columns:repeat(6,1fr);gap:10px}.coverage-card{background:#fff;border:1px solid #dde5ef;border-radius:10px;padding:18px 14px;min-height:210px;box-shadow:0 7px 16px rgba(16,35,68,.04)}.coverage-mark{display:grid;place-items:center;width:34px;height:34px;border-radius:50%;background:#eaf3ff;color:#12639d;font-size:10px;font-weight:900;margin-bottom:22px}.coverage-2 .coverage-mark{background:#fff1dd;color:#df8217}.coverage-3 .coverage-mark{background:#ffe9e9;color:#d94545}.coverage-4 .coverage-mark{background:#e5f3ff;color:#1372ae}.coverage-5 .coverage-mark{background:#eef8df;color:#65a42d}.coverage-6 .coverage-mark{background:#fff0ed;color:#e84942}.result-section{max-width:1180px;margin:0 auto;padding:24px 0 60px;display:grid;grid-template-columns:minmax(300px,1fr) minmax(420px,1.35fr);gap:32px;align-items:stretch}.result-copy{background:#eaf3ff;border:1px solid #d1e2f4;border-radius:10px;padding:30px}.result-copy h2{font-size:30px}.result-copy>p:not(.section-label){color:#526b93;line-height:1.5;font-size:13px}.supporting-line{font-weight:800;color:#365477!important}.text-link{display:inline-block;color:#12639d;font-size:13px;font-weight:900;margin-top:8px}.result-panel{display:grid;grid-template-columns:1.6fr .8fr;gap:16px;align-items:center;background:#fff;border:1px solid #dce5ef;border-radius:10px;padding:26px}.hack-list .card-kicker{color:#12639d;line-height:1.4}.hack-list>p:not(.card-kicker){display:flex;align-items:flex-start;gap:10px;color:#526b93;font-size:12px;line-height:1.4;margin:14px 0}.hack-list span{display:flex;flex-direction:column}.hack-list strong{color:#102344;text-transform:uppercase;font-size:11px;margin-bottom:2px}.hack-letter{display:grid;place-items:center;width:22px;height:22px;flex:0 0 22px;border-radius:50%;color:#fff;font-size:11px}.hurry{background:#ee4d46}.authority{background:#f2a315}.connection{background:#2783df}.killswitch{background:#69b632}.score-badge{min-height:180px;border:5px solid #e1e7ef;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;clip-path:polygon(50% 0,95% 17%,95% 78%,50% 100%,5% 78%,5% 17%);padding:10px;background:#fbfcfe}.score-badge>strong{font-size:54px;line-height:1;color:#102344}.score-badge span{color:#526b93;font-size:11px;font-weight:800;margin-top:5px}.score-badge small{color:#526b93;font-size:10px;line-height:1.3;margin-top:12px}.country-promo{max-width:1180px;margin:0 auto;padding:42px 0 50px;display:grid;grid-template-columns:1.2fr auto .6fr;gap:28px;align-items:center;border-top:1px solid #e0e7f0}.country-promo h2{font-size:30px;margin-bottom:10px}.country-promo p:not(.section-label){color:#526b93;line-height:1.5;margin:0;max-width:410px}.travel-map{justify-self:end;width:180px;height:82px;border-bottom:4px solid #9bc9ed;border-radius:50%;color:#ff584c;display:flex;align-items:center;justify-content:space-around;font-size:40px}.edition-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;text-align:left}.editions-section h2{font-size:clamp(26px,2.8vw,34px);max-width:820px;margin-left:auto;margin-right:auto}.edition-card{background:#fff;border:1px solid #dce5ef;border-radius:10px;padding:20px;display:flex;flex-direction:column;min-height:240px;box-shadow:0 7px 16px rgba(16,35,68,.04)}.edition-audience{color:#12639d!important;font-size:10px!important;font-weight:900!important;text-transform:uppercase;min-height:28px}.edition-card h3{font-size:24px}.edition-card>a{display:flex;justify-content:center;margin-top:auto;padding:10px;border-radius:8px;text-decoration:none;color:#102344;font-size:12px;font-weight:900;background:#ffb31d}.edition-blue>a{background:#4c91e8;color:#fff}.edition-green>a{background:#7dcc22}.edition-coral>a{background:#ef4e43;color:#fff}.organization-section{max-width:1180px;margin:0 auto;padding:28px 32px;display:flex;align-items:center;justify-content:space-between;gap:28px;border-radius:12px;background:#102344;color:#fff}.organization-section h2{font-size:25px;margin-bottom:10px}.organization-section p:not(.section-label){max-width:720px;color:#d5e0ed;font-size:13px;line-height:1.5;margin:0}.organization-section .section-label{color:#9bdc3d}.organization-section .secondary{white-space:nowrap}.footer{max-width:1180px;margin:0 auto;padding:38px 0 60px;display:grid;grid-template-columns:1.4fr repeat(3,.75fr);gap:28px;color:#fff;background:#102344;position:relative}.footer:before{content:'';position:absolute;left:0;right:0;bottom:0;height:180px;background:#102344;z-index:-1}.footer-brand,.footer-column{display:flex;flex-direction:column;gap:7px}.footer-brand strong{font-size:19px}.footer-brand span{max-width:240px;color:#d5e0ed;font-size:12px;line-height:1.45}.footer-column strong{color:#9bdc3d;font-size:10px;text-transform:uppercase;letter-spacing:.08em}.footer-column a{color:#fff;text-decoration:none;font-size:12px}.social-placeholders{display:flex;gap:10px;margin-top:9px}.social-placeholders span{display:grid;place-items:center;width:24px;height:24px;border:1px solid #8ea9c8;border-radius:50%;color:#fff;font-weight:900}.disclaimer{grid-column:1/-1;color:#9fb2c8;font-size:10px;line-height:1.4;margin:10px 0 0}.home-page>.footer:after{content:'K';position:absolute;right:12px;bottom:22px;color:#9ed0f5;border:3px solid #9ed0f5;border-radius:50%;width:52px;height:52px;display:grid;place-items:center;font-size:30px;font-weight:900}@keyframes focusCycle{0%,24%{opacity:1;transform:translateY(0)}31%,100%{opacity:0;transform:translateY(5px)}}@keyframes pausePulse{0%,100%{transform:scale(1);box-shadow:0 0 0 0 rgba(156,255,36,.35)}50%{transform:scale(1.06);box-shadow:0 0 0 10px rgba(156,255,36,0)}}@keyframes hackFocus{0%,100%{opacity:.45}50%{opacity:1;color:#9cff24}}.focus-cycle{position:relative;display:grid;place-items:center;min-height:42px;width:100%;text-transform:uppercase}.focus-cycle strong{grid-area:1/1;font-size:30px;color:#9cff24;opacity:0;animation:focusCycle 9s ease-in-out infinite}.focus-cycle strong:nth-child(2){animation-delay:3s}.focus-cycle strong:nth-child(3){animation-delay:6s}.pause-mark{animation:pausePulse 2.7s ease-in-out infinite}
        @media(max-width:1050px){.site-nav{align-items:flex-start;padding:18px 0;flex-direction:column}.site-nav nav{justify-content:flex-start;gap:12px}.hero{grid-template-columns:1fr;gap:34px}.hero h1{max-width:620px}.scenario-card{max-width:none}.coverage-grid{grid-template-columns:repeat(3,1fr)}.country-promo{grid-template-columns:1fr auto}.travel-map{grid-column:2;grid-row:1 / span 2}.edition-grid{grid-template-columns:repeat(2,1fr)}}
        @media(max-width:720px){.hero{padding-top:45px}.hero h1{font-size:clamp(34px,9vw,44px)}.hero h1 span{white-space:normal}.scenario-card{min-height:0;flex-direction:column}.scenario-focus{width:auto;min-height:130px;align-items:flex-start;flex-direction:row}.scenario-focus strong{font-size:28px}.pause-mark{width:44px;height:44px}.steps{grid-template-columns:repeat(2,1fr)}.coverage-grid{grid-template-columns:repeat(2,1fr)}.result-section{grid-template-columns:1fr}.country-promo{grid-template-columns:1fr}.travel-map{grid-column:auto;grid-row:auto;justify-self:start}.organization-section{align-items:flex-start;flex-direction:column}.organization-section .secondary{white-space:normal}.footer{grid-template-columns:repeat(2,1fr)}.footer-brand{grid-column:1/-1}.hack-strip{gap:12px;justify-content:flex-start;overflow-x:auto;white-space:nowrap}.hack-strip span{font-size:10px}}
        @media(max-width:460px){.site-nav nav{gap:10px}.site-nav nav a{font-size:11px}.site-nav nav .nav-cta{width:100%;text-align:center}.hero{padding-bottom:34px}.scenario-main{padding:26px 22px}.scenario-main h2{font-size:22px}.steps,.coverage-grid,.edition-grid{grid-template-columns:1fr}.result-panel{grid-template-columns:1fr}.score-badge{min-height:160px}.footer{grid-template-columns:1fr}.footer:after{display:none}}
        .travel-visual{position:relative;width:100%;max-width:650px;aspect-ratio:16 / 9;border-radius:18px;overflow:hidden;background:#eaf3ff;box-shadow:0 14px 0 #dce5f0,0 12px 32px rgba(16,35,68,.08)}.travel-art{display:block;width:100%;height:100%;object-fit:cover}.travel-copy{position:absolute;left:6%;top:34%;display:flex;flex-direction:column;gap:8px;color:#102344}.travel-copy strong{font-size:clamp(24px,3vw,42px);line-height:1;font-weight:900;letter-spacing:-.03em}.travel-copy span{font-size:clamp(11px,1.35vw,17px);line-height:1.35;color:#12639d;font-weight:700}.travel-phone{position:absolute;right:6%;top:6%;width:25%;height:88%;padding:5px;border-radius:20px;background:#17263a;box-shadow:0 5px 14px rgba(16,35,68,.3)}.travel-phone-screen{height:100%;display:flex;flex-direction:column;gap:5px;padding:10px 8px;border-radius:15px;background:#f7fbff;color:#102344;font-family:Arial,Helvetica,sans-serif}.phone-status{font-size:clamp(7px,.85vw,10px);font-weight:900;color:#12639d}.phone-alert{font-size:clamp(8px,1vw,12px);line-height:1.15;text-transform:uppercase}.travel-phone-screen p{font-size:clamp(7px,.85vw,10px);line-height:1.3;margin:0;color:#365477}.phone-danger,.phone-support{display:flex;align-items:center;justify-content:center;min-height:19px;border-radius:4px;font-size:clamp(7px,.8vw,10px);font-weight:900}.phone-danger{background:#ff584c;color:#fff}.phone-support{border:1px solid #b8c9db;color:#365477}.phone-safe{display:flex;align-items:center;gap:4px;margin-top:auto;padding-top:5px;border-top:1px solid #dbe4ef}.phone-logo{display:block;width:21px;height:21px;overflow:hidden;border-radius:4px;background:#fff;flex:0 0 21px}.phone-logo img{display:block;width:42px;height:21px;max-width:none;object-fit:cover;object-position:left center}.phone-safe strong{font-size:clamp(8px,1vw,12px);color:#68b52d;letter-spacing:.04em}@media(max-width:1050px){.travel-visual{max-width:none}}@media(max-width:720px){.travel-copy{top:30%}.travel-phone{right:5%;top:5%;width:26%;height:88%}}
        .site-nav .brand{display:inline-flex;align-items:center;min-width:132px}.brand-logo{display:block;width:132px;height:auto}.footer-logo{display:inline-flex;align-items:center;width:min(180px,100%);padding:5px 8px;border-radius:7px;background:#102344}.footer-logo img{display:block;width:100%;height:auto}.home-page>.footer:after{display:none}.phone-logo img{width:42px;height:21px;max-width:none;object-fit:cover;object-position:left center}
        .site-nav,.hero,.hack-strip,.section,.result-section,.country-promo,.organization-section,.footer{max-width:1200px}.section{max-width:1140px}.hero{grid-template-columns:minmax(390px,.86fr) minmax(560px,1.14fr);gap:18px}.hero h1{font-size:clamp(31px,2.55vw,40px);line-height:1.06}.travel-visual{max-width:760px;aspect-ratio:957 / 495}.travel-art{object-fit:cover}.editions-section h2{font-size:clamp(24px,2.35vw,30px)}.edition-card{padding:0 0 12px;min-height:0;overflow:hidden}.edition-heading{padding:14px 14px 10px;min-height:70px}.edition-heading h3{font-size:23px;line-height:1.1;margin:0 0 5px}.edition-heading .edition-audience{min-height:0;font-size:9px!important;line-height:1.2}.edition-image{display:block;width:100%;height:180px;object-fit:cover;object-position:top}.edition-copy{padding:0 14px;min-height:58px;color:#526b93;font-size:12px;line-height:1.42;margin:12px 0 0}.edition-card>a{margin:12px 12px 0;margin-top:auto}.hack-strip{display:none}.result-panel{grid-template-columns:minmax(185px,.86fr) minmax(240px,1.14fr);gap:18px;padding:18px;align-items:stretch}.score-summary{display:flex;flex-direction:column;justify-content:center;padding:22px 20px;border-radius:10px;background:#eaf3ff;border:1px solid #d1e2f4}.score-summary .card-kicker{margin-bottom:12px;line-height:1.3}.score-number{font-size:72px;line-height:.95;color:#102344}.score-weak{margin:14px 0 0;color:#365477;font-size:13px;font-weight:800;line-height:1.35}.score-weak strong{color:#ef4e43}.hack-list{padding:4px 2px}.hack-list>p:not(.card-kicker){margin:10px 0;font-size:12px}.country-promo{grid-template-columns:minmax(0,1fr) minmax(360px,.95fr);gap:34px;padding:58px 0 62px}.country-promo p:not(.section-label){max-width:520px}.country-search{display:flex;align-items:stretch;gap:10px;align-self:center}.country-search input{min-width:0;flex:1;padding:13px 14px;border:1px solid #cbd9e8;border-radius:9px;background:#fff;color:#102344;font:inherit;font-size:13px}.country-search input::placeholder{color:#7890ad}.country-search .primary{border:0;cursor:pointer;white-space:nowrap}.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}.organization-section{padding:34px 38px;min-height:156px}.organization-cta{display:inline-flex;align-items:center;justify-content:center;white-space:nowrap;text-decoration:none;font-weight:900;border-radius:9px;padding:13px 18px;background:#fff;color:#102344;box-shadow:0 3px 0 #dce5f0}.edition-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}.edition-card{height:100%}.footer{grid-template-columns:1.35fr repeat(3,1fr);gap:38px;padding:46px 28px 50px}.footer-brand,.footer-column{gap:10px}.footer-brand span{font-size:13px;line-height:1.6}.footer-column strong{font-size:11px}.footer-column a{font-size:13px;line-height:1.45}@media(max-width:1050px){.hero{grid-template-columns:1fr;gap:34px}.travel-visual{max-width:none}}
        @media(max-width:720px){.edition-grid{grid-template-columns:1fr}.country-promo{grid-template-columns:1fr;gap:22px}.country-search{flex-direction:column}.country-search .primary{width:100%}.result-panel{grid-template-columns:1fr}.organization-section{padding:28px 24px}.organization-cta{white-space:normal;width:100%}.footer{grid-template-columns:repeat(2,1fr);gap:24px;padding:36px 20px 42px}}
        .home-page{padding-left:clamp(28px,6vw,96px);padding-right:clamp(28px,6vw,96px)}.site-nav,.hero,.section,.result-section,.country-promo,.organization-section,.footer{width:100%;max-width:1200px}.hero{padding-top:54px;padding-bottom:46px;gap:18px}.section{padding-top:42px;padding-bottom:48px}.coverage-section{max-width:1120px}.coverage-section h2{font-size:clamp(26px,2.7vw,36px);max-width:900px;margin-bottom:16px}.coverage-section .section-intro{max-width:590px;margin-bottom:22px}.coverage-grid{grid-template-columns:repeat(3,280px);justify-content:center;gap:16px;max-width:872px;margin:0 auto}.coverage-card{width:280px;min-height:350px;padding:20px 18px}.coverage-card h3{font-size:18px;line-height:1.18}.coverage-card p{font-size:13px;line-height:1.45}.coverage-mark{margin-bottom:24px}.editions-section{max-width:1080px}.editions-section h2{font-size:clamp(24px,2.35vw,30px);margin-bottom:14px}.editions-section .section-intro{max-width:580px;margin-bottom:22px}.editions-section .edition-grid{grid-template-columns:repeat(2,minmax(0,440px));justify-content:center;gap:16px;max-width:896px;margin:0 auto}.editions-section .edition-card{width:100%;min-height:0}.editions-section .edition-image{height:170px}.country-promo{max-width:1080px;padding:42px 0 46px;grid-template-columns:minmax(0,1fr) minmax(420px,.9fr);gap:28px}.country-promo h2{font-size:clamp(25px,2.5vw,31px);line-height:1.1}.country-search{max-width:520px;margin-left:auto}.country-search input{font-size:12px}.travel-map{display:none!important}.organization-section{max-width:1080px;padding:28px 32px;min-height:0}.footer{max-width:1080px;padding-top:38px;padding-bottom:46px;gap:30px}
        .editions-section .edition-card{display:grid;grid-template-rows:auto 220px minmax(74px,1fr) auto;height:100%;padding:0 0 12px}.editions-section .edition-media{display:grid;place-items:center;min-width:0;overflow:hidden;background:#f9fbff}.editions-section .edition-image{width:100%;height:100%;object-fit:contain;object-position:center}.editions-section .edition-copy{padding:14px 16px 0;min-height:0;margin:0;font-size:12px;line-height:1.42}.editions-section .edition-card>a{align-items:center;min-height:42px;margin:12px 12px 0}
        @media(max-width:1050px){.home-page{padding-left:clamp(24px,4vw,56px);padding-right:clamp(24px,4vw,56px)}.coverage-grid{grid-template-columns:repeat(3,minmax(0,280px));max-width:872px}.editions-section .edition-grid{max-width:896px}.country-promo{grid-template-columns:minmax(0,1fr) minmax(360px,.85fr)}}
        @media(max-width:720px){.home-page{padding-left:18px;padding-right:18px}.coverage-grid{grid-template-columns:1fr;max-width:280px}.coverage-card{width:280px}.editions-section .edition-grid{grid-template-columns:1fr;max-width:440px}.country-promo{grid-template-columns:1fr;gap:20px}.country-search{max-width:none;margin-left:0}.footer{max-width:100%}}
        .coverage-grid{grid-auto-rows:270px}.coverage-card{height:270px;min-height:0}.editions-section .edition-grid{width:min(100%,840px);max-width:840px;grid-template-columns:repeat(2,minmax(0,400px));gap:16px}.editions-section .edition-card{height:100%;min-height:0}.editions-section .edition-heading{padding:12px 16px 6px;min-height:62px}.editions-section .edition-heading h3{font-size:21px}.editions-section .edition-image{height:145px}.editions-section .edition-copy{padding:14px 16px 0;min-height:70px;margin:0;font-size:12px;line-height:1.42}.editions-section .edition-card>a{margin:12px 12px 0}.country-promo{width:min(100%,1080px);padding:32px 0 36px;grid-template-columns:minmax(0,1fr) minmax(240px,280px);gap:28px}.country-search{display:grid;grid-template-columns:1fr;gap:12px;max-width:280px;margin-left:auto}.country-search .primary{width:100%}.travel-map{display:none!important}
        @media(max-width:720px){.coverage-grid{grid-auto-rows:auto}.coverage-card{height:auto}.editions-section .edition-grid{width:100%;max-width:400px;grid-template-columns:1fr}.country-promo{width:100%;grid-template-columns:1fr;gap:20px}.country-search{max-width:none;margin-left:0}}
        .coverage-grid{grid-auto-rows:240px}.coverage-card{height:240px;min-height:0}.coverage-cta{display:flex;width:max-content;margin:18px auto 0}.editions-section .edition-grid{width:min(100%,840px);max-width:840px;grid-template-columns:repeat(2,minmax(0,400px));gap:16px}.editions-section .edition-card{height:100%;min-height:0}.editions-section .edition-heading{padding:12px 16px 6px;min-height:62px}.editions-section .edition-heading h3{font-size:21px}.editions-section .edition-image{height:auto;object-fit:contain;object-position:center;flex:0 0 auto}.editions-section .edition-copy{padding:16px 16px 0;min-height:62px;margin:0;font-size:12px;line-height:1.42}.editions-section .edition-card>a{margin:12px 12px 0}.country-promo{width:min(100%,1080px);padding:32px 0 36px;grid-template-columns:minmax(0,1fr) minmax(240px,280px);gap:28px}.country-cta{justify-self:end;align-self:center;white-space:nowrap}.travel-map{display:none!important}.hero h1{font-size:clamp(29px,2.25vw,36px);max-width:560px}.hero h1 span{white-space:normal}.result-panel{grid-template-columns:minmax(190px,.76fr) minmax(280px,1.24fr);gap:14px;padding:14px;min-height:0;overflow:hidden}.score-summary{align-items:center;text-align:center;padding:16px 12px}.score-summary .card-kicker{font-size:10px;margin-bottom:8px}.score-number{font-size:56px}.score-weak{margin-top:8px;font-size:12px}.hack-list{padding:2px 8px}.hack-list .card-kicker{font-size:15px;margin-bottom:10px}.hack-list>p:not(.card-kicker){margin:8px 0;font-size:11px}.text-link{padding:10px 14px;border:1px solid #12639d;border-radius:8px;background:#fff;text-decoration:none;box-shadow:0 2px 0 #d0e2f4}.coverage-section .centered-cta{margin-top:18px}
        @media(max-width:1050px){.hero h1{font-size:clamp(29px,3.2vw,36px)}}
        @media(max-width:720px){.coverage-grid{grid-auto-rows:auto}.coverage-card{height:auto}.editions-section .edition-grid{width:100%;max-width:400px;grid-template-columns:1fr}.country-promo{width:100%;grid-template-columns:1fr;gap:20px}.country-cta{justify-self:start}.country-search{max-width:none;margin-left:0}}
        .travel-visual{aspect-ratio:456 / 368;max-width:560px}.travel-art{object-fit:contain;background:#eaf3ff}.hero h1{font-size:clamp(29px,2.2vw,35px);max-width:540px}.hero h1 span{white-space:normal}.editions-section .edition-image{height:auto;object-fit:contain}.editions-section .edition-copy{padding-top:16px}.result-panel{grid-template-columns:minmax(170px,.7fr) minmax(280px,1.3fr);gap:12px;padding:14px}.score-summary{align-items:center;text-align:center;padding:14px 10px}.score-number{font-size:54px}.hack-list .card-kicker{font-size:15px}.hack-title{color:#12639d;font-size:18px;font-weight:900;letter-spacing:.08em;line-height:1;margin:0 0 12px;text-transform:uppercase}.text-link{display:inline-flex;align-items:center;padding:10px 14px;border:1px solid #12639d;border-radius:8px;background:#fff;text-decoration:none;box-shadow:0 2px 0 #d0e2f4}.coverage-card{height:240px;min-height:0}.coverage-cta{display:flex;width:max-content;margin:18px auto 0}.country-cta{justify-self:end;align-self:center;white-space:nowrap}.travel-map{display:none!important}
        .result-panel{display:block;min-height:0}.result-panel .hack-list{padding:4px 8px}.result-panel .hack-list>p:not(.hack-title){margin:10px 0}
        .editions-section .edition-media .edition-image{width:100%;height:100%;object-fit:contain;object-position:center}
        @media(max-width:720px){.travel-visual{max-width:none}.country-cta{justify-self:start}.result-panel{grid-template-columns:1fr}.coverage-card{height:auto}}
        .how-section .steps{gap:16px;margin-top:28px}.how-section .step{min-height:162px;padding:16px 14px 14px;background:#fff;border:1px solid #dce5ef;border-radius:10px;box-shadow:0 6px 14px rgba(16,35,68,.04)}.how-section .step-icon{width:38px;height:38px;margin-bottom:12px}.how-section .step h3{font-size:15px;line-height:1.2;margin-bottom:7px}.how-section .step p{font-size:12px;line-height:1.38}
        @media(max-width:720px){.how-section .steps{gap:12px}.how-section .step{min-height:0}}
        .hero-price{margin:10px 0 0;color:#526b93;font-size:11px;font-weight:800}.edition-price{margin:7px 0 0;color:#12639d;font-size:11px;font-weight:900}
      `}</style>
    </main>
  );
}
