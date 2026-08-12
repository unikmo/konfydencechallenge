import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Choose Your Konfydence Challenge",
  description: "Choose the pressure test that matches your real life. Eight free scenarios reveal which scam pressure pattern is most likely to move you.",
  alternates: { canonical: "/challenge" },
};

const editions = [
  {
    key: "family",
    eyebrow: "Home & family",
    title: "Family",
    copy: "Bank alerts, deliveries, relatives, marketplace messages and everyday requests that exploit familiarity.",
    signal: "Best for households and mixed-age families",
  },
  {
    key: "school",
    eyebrow: "Students",
    title: "School",
    copy: "Gaming, social accounts, fake giveaways, school messages and pressure that targets younger decision-makers.",
    signal: "Best for school-age learners",
  },
  {
    key: "university",
    eyebrow: "Campus life",
    title: "University",
    copy: "Housing, student jobs, account access, ticketing, payments and scams built around independence and urgency.",
    signal: "Best for students living and transacting independently",
  },
  {
    key: "workplace",
    eyebrow: "Professional",
    title: "Workplace",
    copy: "Executive impersonation, invoice changes, HR requests, credentials and authority pressure inside real work flows.",
    signal: "Best for employees and teams",
  },
  {
    key: "travelsafe",
    eyebrow: "On the move",
    title: "TravelSafe",
    copy: "Bookings, transport, Wi-Fi, payment, accommodation and urgent travel problems where verification is harder.",
    signal: "Best before or during travel",
  },
] as const;

const hack = [
  ["H", "Hurry", "Can urgency make you act before you verify?"],
  ["A", "Authority", "Do official-looking people or institutions get a shortcut to trust?"],
  ["C", "Comfort", "Does familiarity lower your guard before the evidence is checked?"],
  ["K", "Kill-Switch", "Can you stop at the critical action moment and verify independently?"],
] as const;

export default function ChallengeLanding() {
  return (
    <main className="page">
      <section className="hero shell">
        <Link className="brand" href="/">Konfydence</Link>
        <p className="eyebrow">Free scam-pressure diagnostic</p>
        <h1>Scams do not test what you know. <span>They test what you do under pressure.</span></h1>
        <p className="lede">
          Choose the version closest to your real life. You will face 8 decisions — two for each H.A.C.K. pressure pattern — and get a personal readiness profile at the end.
        </p>
        <div className="promise">
          <span>8 scenarios</span><span>About 4 minutes</span><span>No account for round one</span><span>Immediate H.A.C.K. profile</span>
        </div>
      </section>

      <section className="shell editions" aria-labelledby="choose-edition">
        <div className="sectionHead">
          <div><p className="eyebrow">Choose your pressure test</p><h2 id="choose-edition">Where are you most likely to be targeted?</h2></div>
          <p>Each edition draws from its own 40-scenario bank. The free check is deliberately balanced across Hurry, Authority, Comfort and Kill-Switch.</p>
        </div>
        <div className="editionGrid">
          {editions.map((edition, index) => (
            <article className={`edition ${index === 0 ? "featured" : ""}`} key={edition.key}>
              <div className="editionTop"><span>{edition.eyebrow}</span><b>0{index + 1}</b></div>
              <h3>{edition.title}</h3>
              <p>{edition.copy}</p>
              <small>{edition.signal}</small>
              <Link href={`/challenge/${edition.key}/start?mode=diagnostic`}>Start free check <span>→</span></Link>
            </article>
          ))}
        </div>
      </section>

      <section className="framework">
        <div className="shell">
          <div className="sectionHead light">
            <div><p className="eyebrow">What the result measures</p><h2>Your H.A.C.K. pressure profile.</h2></div>
            <p>Not a personality label. A practical signal showing which kind of pressure most changes your decisions — and which reflex to practise next.</p>
          </div>
          <div className="hackGrid">
            {hack.map(([key, title, copy]) => <article key={key}><span>{key}</span><div><h3>{title}</h3><p>{copy}</p></div></article>)}
          </div>
        </div>
      </section>

      <section className="shell finalCta">
        <p className="eyebrow">Start where the risk is real</p>
        <h2>You do not need to study first.</h2>
        <p>That is the point. Make the decisions you would make today, then use the result to train the reflex that needs work.</p>
        <Link href="/challenge/family/start?mode=diagnostic">Start the Family check <span>→</span></Link>
      </section>

      <style>{`
        :global(*){box-sizing:border-box}.page{min-height:100vh;background:#fffdf8;color:#091522;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}.shell{width:min(1120px,calc(100% - 40px));margin:0 auto}.hero{padding:30px 0 72px}.brand{display:inline-block;color:#091522;text-decoration:none;font-weight:950;letter-spacing:-.04em;margin-bottom:70px}.eyebrow{margin:0 0 13px;color:#d34b42;font-size:10px;font-weight:950;letter-spacing:.13em;text-transform:uppercase}.hero h1,.sectionHead h2,.finalCta h2{font-family:Georgia,"Times New Roman",serif;font-weight:500;letter-spacing:-.05em}.hero h1{font-size:clamp(48px,7.4vw,88px);line-height:.94;max-width:980px;margin:0}.hero h1 span{color:#d34b42}.lede{max-width:710px;font-size:18px;line-height:1.7;color:#50606d;margin:30px 0 0}.promise{display:flex;flex-wrap:wrap;gap:8px;margin-top:28px}.promise span{border:1px solid #d9ddd9;border-radius:999px;padding:9px 12px;font-size:11px;font-weight:850;color:#52616c;background:white}.editions{padding:74px 0 92px;border-top:1px solid #e5e4df}.sectionHead{display:grid;grid-template-columns:1.1fr .7fr;gap:70px;align-items:end;margin-bottom:36px}.sectionHead h2{font-size:clamp(38px,5vw,58px);line-height:1;margin:0}.sectionHead>p{font-size:14px;line-height:1.7;color:#67747d;margin:0}.editionGrid{display:grid;grid-template-columns:repeat(6,1fr);gap:12px}.edition{grid-column:span 2;border:1px solid #dfe1dc;border-radius:22px;padding:24px;background:white;min-height:315px;display:flex;flex-direction:column}.edition:nth-child(4),.edition:nth-child(5){grid-column:span 3}.edition.featured{background:#091522;color:white;border-color:#091522}.editionTop{display:flex;justify-content:space-between;align-items:center}.editionTop span{font-size:9px;letter-spacing:.12em;font-weight:950;text-transform:uppercase;color:#d34b42}.featured .editionTop span{color:#b8ff3d}.editionTop b{font-family:Georgia,serif;font-size:20px;font-weight:500;color:#aab2b6}.edition h3{font-family:Georgia,serif;font-weight:500;letter-spacing:-.04em;font-size:34px;margin:30px 0 10px}.edition>p{font-size:13px;line-height:1.6;color:#66747d;margin:0}.featured>p{color:#b8c4ce}.edition small{display:block;margin-top:18px;color:#82909a;font-weight:750;line-height:1.45}.edition a{margin-top:auto;padding-top:24px;color:#091522;text-decoration:none;font-size:12px;font-weight:950;display:flex;justify-content:space-between}.featured a{color:#b8ff3d}.framework{background:#091522;color:white;padding:88px 0}.sectionHead.light>p{color:#9eb0bd}.sectionHead.light .eyebrow{color:#b8ff3d}.hackGrid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}.hackGrid article{border:1px solid #26394a;border-radius:18px;padding:20px;display:flex;gap:14px;min-height:155px}.hackGrid article>span{width:36px;height:36px;border-radius:50%;display:grid;place-items:center;background:#b8ff3d;color:#091522;font-weight:950;flex:0 0 auto}.hackGrid h3{margin:3px 0 8px;font-size:15px}.hackGrid p{font-size:12px;line-height:1.55;color:#9eb0bd;margin:0}.finalCta{text-align:center;padding:92px 0 105px}.finalCta h2{font-size:clamp(42px,6vw,66px);margin:0}.finalCta>p:not(.eyebrow){max-width:610px;margin:20px auto 28px;color:#67747d;line-height:1.65}.finalCta a{display:inline-flex;align-items:center;gap:32px;border-radius:999px;background:#ff5b50;color:white;padding:15px 20px;text-decoration:none;font-size:12px;font-weight:950}
        @media(max-width:800px){.shell{width:min(100% - 24px,1120px)}.hero{padding-bottom:50px}.brand{margin-bottom:46px}.hero h1{font-size:clamp(44px,13vw,67px)}.lede{font-size:16px}.sectionHead{grid-template-columns:1fr;gap:15px}.editionGrid{grid-template-columns:1fr}.edition,.edition:nth-child(4),.edition:nth-child(5){grid-column:auto;min-height:265px}.hackGrid{grid-template-columns:1fr 1fr}}
        @media(max-width:520px){.promise{display:grid;grid-template-columns:1fr 1fr}.promise span{text-align:center}.editions{padding:55px 0 65px}.framework{padding:65px 0}.hackGrid{grid-template-columns:1fr}.hackGrid article{min-height:auto}.finalCta{padding:70px 0 82px}}
      `}</style>
    </main>
  );
}
