import Link from "next/link";

export type IntentSection = {
  title: string;
  copy: string;
};

export type IntentFaq = {
  question: string;
  answer: string;
};

export function ComasyIntentPage({
  eyebrow,
  title,
  intro,
  problemTitle,
  problemCopy,
  sections,
  proofTitle,
  proofCopy,
  faq,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  problemTitle: string;
  problemCopy: string;
  sections: IntentSection[];
  proofTitle: string;
  proofCopy: string;
  faq: IntentFaq[];
}) {
  return (
    <main className="page">
      <header><Link href="/" className="brand">KONFYDENCE <span>/ CoMaSy</span></Link><nav><Link href="/comasy">Platform</Link><Link href="/comasy/methodology">Methodology</Link><Link href="/comasy/security">Security</Link><Link href="/comasy/pilot">Pilot</Link></nav></header>
      <section className="hero"><p className="eye">{eyebrow}</p><h1>{title}</h1><p>{intro}</p><div className="actions"><Link href="/comasy/pilot">Request a Pilot →</Link><Link href="/comasy">See CoMaSy</Link></div></section>
      <section className="problem"><p className="eye dark">THE DECISION GAP</p><div><h2>{problemTitle}</h2><p>{problemCopy}</p></div></section>
      <section className="grid">{sections.map((section, index) => <article key={section.title}><b>0{index + 1}</b><h2>{section.title}</h2><p>{section.copy}</p></article>)}</section>
      <section className="proof"><div><p className="eye">MEASUREMENT</p><h2>{proofTitle}</h2></div><div><p>{proofCopy}</p><Link href="/comasy/methodology">Read the methodology →</Link></div></section>
      <section className="faq"><p className="eye dark">BUYER QUESTIONS</p><h2>What to know before you pilot it.</h2><div>{faq.map((item) => <article key={item.question}><h3>{item.question}</h3><p>{item.answer}</p></article>)}</div></section>
      <section className="cta"><div><p className="eye dark">DEFINED COHORT. DEFINED METRICS. DEFINED DECISION POINT.</p><h2>Test the use case before you scale it.</h2></div><Link href="/comasy/pilot">Request a CoMaSy Pilot →</Link></section>
      <footer><Link href="/comasy">CoMaSy</Link><Link href="/comasy/security">Security & Privacy</Link><Link href="/privacy-policy">Privacy</Link><Link href="/imprint">Imprint</Link></footer>
      <style>{`
        :global(*){box-sizing:border-box}:global(body){margin:0;background:#f3f1eb;color:#071726}.page{font-family:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif}.page a:focus-visible{outline:3px solid #b8ff3d;outline-offset:4px}header{min-height:72px;background:#071d31;color:white;display:flex;align-items:center;justify-content:space-between;gap:24px;padding:12px max(20px,calc((100vw - 1120px)/2));border-bottom:1px solid #ffffff1c}.brand{color:white;text-decoration:none;font-size:13px;font-weight:950}.brand span{color:#b8ff3d}header nav{display:flex;gap:20px}header nav a{color:#c3d0d8;text-decoration:none;font-size:12px;font-weight:800}.eye{font-size:11px;letter-spacing:.14em;font-weight:950;color:#b8ff3d;margin:0 0 16px}.eye.dark{color:#d54d44}.hero{background:linear-gradient(135deg,#0c3455,#071d31 72%);color:white;padding:105px max(20px,calc((100vw - 980px)/2))}.hero h1,.problem h2,.grid h2,.proof h2,.faq>h2,.cta h2{font:500 clamp(44px,5.5vw,70px)/.98 Georgia,serif;letter-spacing:-.045em;margin:0}.hero>p:not(.eye){font-size:16px;line-height:1.72;color:#c1d0d9;max-width:780px;margin:25px 0}.actions{display:flex;gap:18px;align-items:center;margin-top:27px}.actions a:first-child,.cta>a{background:#ff5b50;color:white;text-decoration:none;border-radius:999px;padding:14px 18px;font-size:13px;font-weight:950}.actions a:last-child{color:white;font-size:13px;font-weight:850}.problem{max-width:1120px;margin:auto;padding:90px 20px}.problem>div{display:grid;grid-template-columns:1.1fr .9fr;gap:65px;align-items:end}.problem h2{font-size:clamp(42px,4.8vw,62px)}.problem p:not(.eye){font-size:15px;line-height:1.72;color:#657883;margin:0}.grid{max-width:1120px;margin:0 auto 95px;display:grid;grid-template-columns:repeat(3,1fr);border-top:1px solid #ccd6d9;border-left:1px solid #ccd6d9}.grid article{padding:28px;border-right:1px solid #ccd6d9;border-bottom:1px solid #ccd6d9;min-height:260px}.grid b{font-size:11px;color:#d54d44}.grid h2{font-size:31px;margin:45px 0 13px}.grid p{font-size:13px;line-height:1.62;color:#657883}.proof{background:#071d31;color:white;padding:90px max(20px,calc((100vw - 1120px)/2));display:grid;grid-template-columns:1fr 1fr;gap:70px}.proof h2{font-size:clamp(42px,4.8vw,62px)}.proof p{font-size:14px;line-height:1.7;color:#b5c6cf;margin:0}.proof a{display:inline-block;margin-top:18px;color:#b8ff3d;text-decoration:none;font-size:12px;font-weight:950}.faq{max-width:1120px;margin:auto;padding:90px 20px}.faq>h2{font-size:clamp(42px,4.8vw,62px);max-width:760px}.faq>div{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:45px}.faq article{border-top:1px solid #ccd6d9;padding:22px 10px 8px 0}.faq h3{font:500 25px/1.2 Georgia,serif;margin:0 0 11px}.faq p{font-size:13px;line-height:1.65;color:#657883;margin:0}.cta{max-width:1120px;margin:0 auto 90px;background:#e6ebe7;border:1px solid #c9d3cf;border-radius:24px;padding:44px;display:flex;align-items:end;justify-content:space-between;gap:40px}.cta h2{font-size:48px;max-width:720px}.cta>a{background:#071d31;white-space:nowrap}footer{background:#061624;padding:28px max(20px,calc((100vw - 1120px)/2));display:flex;gap:20px;flex-wrap:wrap}footer a{color:#a8bac4;text-decoration:none;font-size:11px}@media(max-width:820px){header nav{display:none}.problem>div,.proof,.faq>div{grid-template-columns:1fr}.grid{grid-template-columns:1fr}.cta{margin-left:20px;margin-right:20px;flex-direction:column;align-items:flex-start}}@media(max-width:520px){.hero{padding:70px 20px}.hero h1{font-size:46px}.problem,.faq{padding:70px 20px}.proof{padding:70px 20px}.cta{padding:28px}.cta h2{font-size:40px}.actions{align-items:flex-start;flex-direction:column}}
      `}</style>
    </main>
  );
}
