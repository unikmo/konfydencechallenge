import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "The H.A.C.K. Method | Konfydence" },
  description: "Learn the four pressure patterns behind common scams: Hurry, Authority, Comfort and Kill-Switch — and practise the pause before pressure becomes action.",
  alternates: { canonical: "/hack-method" },
};

const patterns = [
  ["H", "Hurry", "Compress time", "Urgency makes verification feel like delay. The safer response is to create time before acting."],
  ["A", "Authority", "Shortcut scrutiny", "Titles, uniforms, institutions and hierarchy can make weak evidence feel stronger than it is."],
  ["C", "Comfort", "Lower the guard", "Familiarity, routine and emotion can make a request feel safe before the evidence supports it."],
  ["K", "Kill-Switch", "Trigger the action", "Click, pay, share, approve or reply: the critical action is where pressure becomes consequence."],
] as const;

export default function HackMethodPage() {
  return (
    <main className="page">
      <header><Link href="/" className="brand">Konfydence</Link><nav><Link href="/challenge">Challenges</Link><Link href="/countries">Travel intelligence</Link><Link href="/comasy">For organisations</Link></nav></header>

      <section className="intro shell"><p className="eyebrow">The H.A.C.K. Method</p><h1>Name the pressure.<br/><em>Change the next move.</em></h1><p>H.A.C.K. is the decision framework behind Konfydence. It gives four repeatable names to the forces that distort judgment, so you can create distance, verify independently and choose deliberately.</p><Link className="primary" href="/challenge">Test your pressure profile <span>↗</span></Link></section>

      <section className="patterns shell"><div className="lead"><p className="eyebrow">Four pressure patterns</p><h2>The scenario changes.<br/>The mechanics repeat.</h2></div><div className="patternList">{patterns.map(([letter,title,signal,copy]) => <article key={letter}><span>{letter}</span><div><small>{signal}</small><h3>{title}</h3></div><p>{copy}</p></article>)}</div></section>

      <section className="rule"><div className="shell ruleGrid"><div><p className="eyebrow light">The reusable response</p><h2>Pause.<br/>Leave the channel.<br/>Verify independently.</h2></div><div><p>Do not verify a suspicious request using the phone number, link, reply address or instructions supplied inside that same request. Move to a channel you already know and trust.</p><p className="ruleNote">The goal is not permanent suspicion. It is disciplined trust when pressure is high.</p></div></div></section>

      <section className="practice shell"><p className="eyebrow">From knowledge to reflex</p><h2>Reading the framework is not the training.</h2><p>Konfydence places H.A.C.K. inside Family, School, University, Workplace and TravelSafe situations. You make the decision first, then see the rule that would have broken the risk chain.</p><Link className="primary" href="/challenge">Choose a challenge <span>↗</span></Link></section>

      <footer><Link href="/">Konfydence</Link><nav><Link href="/challenge">Challenges</Link><Link href="/privacy-policy">Privacy</Link><Link href="/terms-of-service">Terms</Link><Link href="/contact">Contact</Link></nav></footer>
      <style>{`
        :global(*){box-sizing:border-box}:global(body){margin:0;background:#f4f1ea;color:#171717}.page{--paper:#f4f1ea;--ink:#171717;--muted:#716c64;--accent:#d9574c;--line:rgba(23,23,23,.16);font-family:Inter,ui-sans-serif,system-ui,sans-serif;min-height:100vh}.shell{width:min(1240px,calc(100% - 56px));margin:auto}header{height:78px;width:min(1240px,calc(100% - 56px));margin:auto;display:flex;align-items:center;border-bottom:1px solid var(--line)}.brand{font:400 25px Georgia,serif;color:var(--ink);text-decoration:none}header nav{display:flex;gap:28px;margin-left:auto}header nav a{font-size:12px;color:#5f5a53;text-decoration:none}.eyebrow{font-size:10px;letter-spacing:.16em;text-transform:uppercase;font-weight:800;color:#807a71;margin:0 0 22px}.eyebrow.light{color:#b4afa7}.intro{padding:118px 0 140px}.intro h1,.lead h2,.rule h2,.practice h2{font:400 clamp(58px,7.5vw,106px)/.91 Georgia,serif;letter-spacing:-.06em;margin:0}.intro h1 em{font-style:normal;color:#aaa298}.intro>p:not(.eyebrow){max-width:690px;font-size:18px;line-height:1.72;color:var(--muted);margin:38px 0 30px}.primary{display:inline-flex;align-items:center;justify-content:space-between;gap:34px;background:var(--ink);color:#fff;border-radius:999px;padding:15px 18px;text-decoration:none;font-size:13px;font-weight:800}.patterns{padding:120px 0 140px;border-top:1px solid var(--line)}.lead{max-width:940px;margin-bottom:70px}.lead h2{font-size:clamp(52px,6.2vw,86px);line-height:.95}.patternList{border-top:1px solid var(--line)}.patternList article{display:grid;grid-template-columns:80px .75fr 1fr;gap:30px;align-items:center;min-height:160px;border-bottom:1px solid var(--line)}.patternList>article>span{font:400 43px Georgia,serif;color:#9b958c}.patternList small{font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:#8a847b}.patternList h3{font:400 38px Georgia,serif;letter-spacing:-.04em;margin:6px 0 0}.patternList p{font-size:15px;line-height:1.65;color:var(--muted);margin:0}.rule{background:#1b1d1f;color:#f4f1ea;padding:125px 0}.ruleGrid{display:grid;grid-template-columns:1.15fr .85fr;gap:100px;align-items:end}.rule h2{font-size:clamp(52px,6vw,84px);line-height:.96}.ruleGrid>div:last-child>p{font-size:17px;line-height:1.72;color:#aaa6a0;margin:0}.ruleNote{border-top:1px solid #464647;padding-top:25px!important;margin-top:34px!important;font-size:13px!important;color:#7f7d78!important}.practice{text-align:center;padding:135px 0 150px}.practice h2{font-size:clamp(52px,6.5vw,90px);line-height:.96;max-width:1000px;margin:auto}.practice>p:not(.eyebrow){max-width:650px;font-size:16px;line-height:1.7;color:var(--muted);margin:30px auto}.practice .primary{background:var(--accent)}footer{background:#151719;color:#aaa6a0;padding:48px max(28px,calc((100vw - 1240px)/2));display:flex;justify-content:space-between;gap:40px}footer>a{font:400 24px Georgia,serif;color:#fff;text-decoration:none}footer nav{display:flex;gap:22px;flex-wrap:wrap}footer nav a{font-size:11px;color:#aaa6a0;text-decoration:none}@media(max-width:780px){.shell,header{width:calc(100% - 40px)}header nav{display:none}.intro{padding:90px 0 105px}.intro h1{font-size:clamp(54px,15vw,78px)}.patterns{padding:90px 0}.patternList article{grid-template-columns:50px 1fr;padding:24px 0}.patternList p{grid-column:2}.ruleGrid{grid-template-columns:1fr;gap:45px}.practice{padding:100px 0}footer{flex-direction:column}}
      `}</style>
    </main>
  );
}
