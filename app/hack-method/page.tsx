import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "The HACK Method | Konfydence" },
  description: "Learn the four pressure patterns behind common travel scams: Hurry, Authority, Connection and Kill-switch.",
  alternates: { canonical: "/hack-method" },
};

const patterns = [
  ["H", "Hurry", "Create urgency so you act before you think."],
  ["A", "Authority", "Use official-sounding pressure to make a request feel unquestionable."],
  ["C", "Connection", "Build trust or emotion to lower your guard."],
  ["K", "Kill-switch", "Block verification or limit your options before you can pause."],
];

export default function HackMethodPage() {
  return (
    <main className="hack-page">
      <header><Link href="/" className="brand">Konfydence</Link><nav><Link href="/travelsafe">TravelSafe</Link><Link href="/country-alerts">Country Scam Alerts</Link><Link href="/challenge">Other Challenges</Link><Link href="/pricing">Pricing</Link><Link href="/contact">Contact</Link></nav></header>
      <section className="intro"><p className="eyebrow">The HACK Method</p><h1>Recognize pressure before pressure controls the decision.</h1><p>HACK is the simple framework behind Konfydence scenario-based training. It helps you name the pressure pattern, pause, verify through a trusted route and choose the safer next move.</p><Link className="primary" href="/challenge/travelsafe/start?mode=diagnostic">Take the Free Check</Link></section>
      <section className="patterns"><h2>The four pressure patterns</h2><div className="pattern-grid">{patterns.map(([letter, title, copy]) => <article key={letter}><b>{letter}</b><h3>{title}</h3><p>{copy}</p></article>)}</div></section>
      <section className="next"><h2>Put the pause into practice</h2><p>TravelSafe places these patterns inside realistic booking, hotel, taxi, payment and Wi-Fi scenarios so you can rehearse before the stakes are real.</p><Link href="/travelsafe">Explore TravelSafe</Link></section>
      <footer><Link href="/">Konfydence</Link><Link href="/privacy-policy">Privacy</Link><Link href="/terms-of-service">Terms</Link><Link href="/contact">Contact</Link></footer>
      <style>{`.hack-page{min-height:100vh;background:#f7f9fc;color:#102344;padding:0 6vw 48px;font-family:Arial,Helvetica,sans-serif}.hack-page header{max-width:1100px;margin:auto;min-height:72px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #dce5ef;gap:22px}.brand{font-size:23px;font-weight:900;color:#102344;text-decoration:none}.hack-page nav{display:flex;gap:20px;flex-wrap:wrap}.hack-page nav a,.hack-page footer a{color:#365477;text-decoration:none;font-size:12px;font-weight:800}.intro,.patterns,.next{max-width:1100px;margin:0 auto}.intro{padding:86px 0 66px;max-width:760px}.eyebrow{color:#ef4e43;font-size:11px;font-weight:900;letter-spacing:.08em;text-transform:uppercase}.intro h1{font-size:clamp(38px,5vw,64px);line-height:1.04;margin:15px 0 20px}.intro>p:not(.eyebrow),.next p{color:#526b93;line-height:1.6;max-width:680px}.primary{display:inline-flex;margin-top:20px;background:#ff584c;color:#fff;text-decoration:none;font-weight:900;padding:13px 18px;border-radius:9px;box-shadow:0 3px 0 #d74339}.patterns{border-top:1px solid #dce5ef;padding:48px 0}.patterns h2,.next h2{font-size:34px;margin:0 0 22px}.pattern-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}.pattern-grid article{background:#fff;border:1px solid #dce5ef;border-radius:10px;padding:22px;min-height:170px}.pattern-grid b{display:grid;place-items:center;width:32px;height:32px;border-radius:50%;background:#ff584c;color:#fff}.pattern-grid h3{margin:22px 0 8px}.pattern-grid p{color:#526b93;font-size:14px;line-height:1.5}.next{background:#eaf3ff;border:1px solid #d0e2f4;border-radius:10px;padding:28px}.next a{color:#12639d;font-weight:900}.hack-page footer{max-width:1100px;margin:38px auto 0;border-top:1px solid #dce5ef;padding-top:20px;display:flex;gap:20px}@media(max-width:720px){.hack-page header{align-items:flex-start;flex-direction:column;padding:18px 0}.pattern-grid{grid-template-columns:repeat(2,1fr)}}@media(max-width:460px){.pattern-grid{grid-template-columns:1fr}}`}</style>
    </main>
  );
}
