import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Choose Your Konfydence Challenge",
  description: "Choose the pressure test closest to your real life. Eight free decisions reveal which scam pressure pattern is most likely to move you.",
  alternates: { canonical: "/challenge" },
};

const editions = [
  ["travelsafe", "01", "TravelSafe", "Travel", "Bookings, transport, Wi-Fi, payments and urgent travel problems where independent verification is harder."],
  ["family", "02", "Family", "Households", "Bank alerts, deliveries, relatives, marketplaces and everyday requests that exploit familiarity."],
  ["school", "03", "School", "Ages 12–18", "Gaming, social accounts, fake giveaways, school messages and pressure aimed at younger decision-makers."],
  ["university", "04", "University", "Students", "Housing, jobs, account access, ticketing, payments and scams built around independence and urgency."],
  ["workplace", "05", "Workplace", "Teams", "Executive impersonation, invoice changes, HR requests, credentials and authority pressure inside real workflows."],
] as const;

const hack = [
  ["H", "Hurry", "Urgency compresses the time available to verify."],
  ["A", "Authority", "Status and official language shortcut scrutiny."],
  ["C", "Comfort", "Familiarity makes weak evidence feel safer."],
  ["K", "Kill-Switch", "The critical action—click, pay, share, approve—becomes the point of no return."],
] as const;

export default function ChallengeLanding() {
  return (
    <main className="page">
      <header className="nav"><Link href="/" className="brand">Konfydence</Link><nav><Link href="/hack-method">H.A.C.K.</Link><Link href="/countries">Travel intelligence</Link><Link href="/comasy">For organisations</Link></nav></header>

      <section className="hero shell">
        <p className="eyebrow">Free pressure diagnostic</p>
        <h1>What would you do<br/><em>under pressure?</em></h1>
        <p className="lede">No lesson first. Choose the version closest to your real life, make eight decisions as you would today, then see which H.A.C.K. pressure pattern changes your judgment most.</p>
        <div className="promise"><span>8 realistic decisions</span><span>About 4 minutes</span><span>No signup for round one</span><span>Immediate pressure profile</span></div>
      </section>

      <section className="shell editions" aria-labelledby="choose-edition">
        <div className="sectionHead"><div><p className="eyebrow">Choose your edition</p><h2 id="choose-edition">Start where the risk feels familiar.</h2></div><p>Different situations. The same human pressure mechanics. Every diagnostic is balanced across Hurry, Authority, Comfort and Kill-Switch.</p></div>
        <div className="editionList">
          {editions.map(([key,no,title,audience,copy]) => (
            <article key={key} className={key === "travelsafe" ? "edition featured" : "edition"}>
              <div className="no">{no}</div><div><small>{audience}</small><h3>{title}</h3></div><p>{copy}</p><Link href={`/challenge/${key}/start?mode=diagnostic`}>Start <span>↗</span></Link>
            </article>
          ))}
        </div>
      </section>

      <section className="framework">
        <div className="shell"><div className="sectionHead light"><div><p className="eyebrow">Your result</p><h2>A pressure profile, not a personality label.</h2></div><p>Your H.A.C.K. result shows which kind of pressure most changes your decisions and which reflex deserves more rehearsal.</p></div>
          <div className="hackList">{hack.map(([key,title,copy]) => <article key={key}><span>{key}</span><h3>{title}</h3><p>{copy}</p></article>)}</div>
        </div>
      </section>

      <section className="shell finalCta"><p className="eyebrow">No preparation required</p><h2>The value is seeing what you would do today.</h2><p>Make the decisions first. Learn the rule second. Rehearse until the safer move becomes easier to access under pressure.</p><Link href="/challenge/travelsafe/start?mode=diagnostic">Start with TravelSafe <span>↗</span></Link></section>

      <footer><Link href="/">Konfydence</Link><nav><Link href="/hack-method">Method</Link><Link href="/countries">Travel intelligence</Link><Link href="/contact">Contact</Link><Link href="/privacy-policy">Privacy</Link></nav></footer>

      <style>{`
        :global(*){box-sizing:border-box}:global(body){margin:0;background:#f4f1ea;color:#171717}.page{--paper:#f4f1ea;--white:#fbfaf6;--ink:#171717;--muted:#716c64;--accent:#d9574c;--line:rgba(23,23,23,.16);font-family:Inter,ui-sans-serif,system-ui,sans-serif;min-height:100vh;background:var(--paper)}.shell{width:min(1240px,calc(100% - 56px));margin:auto}.nav{height:78px;width:min(1240px,calc(100% - 56px));margin:auto;display:flex;align-items:center;border-bottom:1px solid var(--line)}.brand{font:400 25px Georgia,serif;color:var(--ink);text-decoration:none}.nav nav{display:flex;gap:28px;margin-left:auto}.nav nav a{font-size:12px;color:#58554f;text-decoration:none}.hero{padding:118px 0 130px}.eyebrow{font-size:10px;letter-spacing:.16em;text-transform:uppercase;font-weight:800;color:#817b72;margin:0 0 22px}.hero h1,.sectionHead h2,.finalCta h2{font:400 clamp(58px,7.7vw,110px)/.9 Georgia,serif;letter-spacing:-.06em;margin:0}.hero h1 em{font-style:normal;color:#a9a198}.lede{font-size:19px;line-height:1.7;color:var(--muted);max-width:720px;margin:38px 0 0}.promise{display:flex;gap:24px;flex-wrap:wrap;margin-top:38px;border-top:1px solid var(--line);padding-top:22px}.promise span{font-size:12px;color:#69645d}.editions{padding:120px 0;border-top:1px solid var(--line)}.sectionHead{display:grid;grid-template-columns:1fr .75fr;gap:90px;align-items:end;margin-bottom:60px}.sectionHead h2{font-size:clamp(48px,5.8vw,80px);line-height:.96}.sectionHead>p{font-size:15px;line-height:1.7;color:var(--muted);margin:0}.editionList{border-top:1px solid var(--line)}.edition{display:grid;grid-template-columns:70px .75fr 1.4fr 80px;gap:28px;align-items:center;min-height:155px;border-bottom:1px solid var(--line);transition:background .2s ease}.edition:hover{background:#ebe7df}.edition .no{font:400 28px Georgia,serif;color:#a39d94}.edition small{text-transform:uppercase;letter-spacing:.12em;font-size:9px;color:#817b72}.edition h3{font:400 36px Georgia,serif;letter-spacing:-.04em;margin:6px 0 0}.edition>p{font-size:14px;line-height:1.6;color:var(--muted);margin:0}.edition>a{justify-self:end;color:var(--ink);text-decoration:none;font-size:12px;font-weight:800}.edition.featured{background:#1c1e20;color:#f4f1ea;margin:0 -28px;padding:0 28px;border-color:#1c1e20}.featured .no,.featured small,.featured>p{color:#aaa69f}.featured>a{color:#fff}.framework{background:#1c1e20;color:#f4f1ea;padding:120px 0}.sectionHead.light>p{color:#aaa69f}.framework .eyebrow{color:#b7b1a8}.hackList{border-top:1px solid #444546}.hackList article{display:grid;grid-template-columns:70px .7fr 1fr;gap:28px;align-items:center;min-height:130px;border-bottom:1px solid #383a3b}.hackList span{font:400 36px Georgia,serif;color:#d8d2c7}.hackList h3{font:400 32px Georgia,serif;margin:0}.hackList p{font-size:14px;line-height:1.6;color:#a7a49e;margin:0}.finalCta{text-align:center;padding:135px 0 145px}.finalCta h2{font-size:clamp(50px,6.2vw,88px);line-height:.96;max-width:980px;margin:auto}.finalCta>p:not(.eyebrow){font-size:16px;line-height:1.7;color:var(--muted);max-width:650px;margin:30px auto}.finalCta a{display:inline-flex;gap:34px;background:var(--accent);color:#fff;text-decoration:none;border-radius:999px;padding:15px 19px;font-size:13px;font-weight:800}footer{background:#151719;color:#9d9992;padding:48px max(28px,calc((100vw - 1240px)/2));display:flex;justify-content:space-between;gap:40px}footer>a{font:400 24px Georgia,serif;color:#fff;text-decoration:none}footer nav{display:flex;gap:22px;flex-wrap:wrap}footer nav a{font-size:11px;color:#aaa6a0;text-decoration:none}
        @media(max-width:800px){.shell,.nav{width:calc(100% - 40px)}.nav nav{display:none}.hero{padding:90px 0}.hero h1{font-size:clamp(54px,15vw,78px)}.sectionHead{grid-template-columns:1fr;gap:22px}.edition{grid-template-columns:48px 1fr 44px;gap:16px;padding:22px 0}.edition>p{grid-column:2/4}.edition.featured{margin:0 -20px;padding:22px 20px}.hackList article{grid-template-columns:45px 1fr;padding:22px 0}.hackList p{grid-column:2}.finalCta{padding:100px 0}footer{flex-direction:column}}
        @media(prefers-reduced-motion:reduce){.edition{transition:none}}
      `}</style>
    </main>
  );
}
