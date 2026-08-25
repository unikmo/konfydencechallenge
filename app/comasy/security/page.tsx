import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "CoMaSy Security & Privacy | Konfydence" },
  description:
    "Current CoMaSy security, privacy and pilot data-handling information for enterprise review and procurement conversations.",
  alternates: { canonical: "/comasy/security" },
};

const controls = [
  ["Application security", "The current web application configures security headers including CSP, HSTS, X-Content-Type-Options, Referrer-Policy and frame restrictions."],
  ["Pilot form protection", "Pilot requests are validated server-side and rate-limited before lead records are created."],
  ["Consent-aware analytics", "GA4 instrumentation is optional and is designed to respect explicit analytics consent before behavioural analytics events are sent."],
  ["Data minimisation", "Pilot scope should define which participant and cohort data are actually required before the exercise begins. Individual-level reporting is not treated as a default requirement."],
];

export default function SecurityPage() {
  return (
    <main className="page">
      <header><Link href="/comasy" className="brand">KONFYDENCE <span>/ CoMaSy</span></Link><nav><Link href="/comasy">Platform</Link><Link href="/comasy/methodology">Methodology</Link><Link href="/comasy/pilot">Pilot</Link></nav></header>

      <section className="hero">
        <p className="eye">SECURITY & PRIVACY</p>
        <h1>Enterprise review should start before the pilot, not after it.</h1>
        <p>This page documents what is visible in the current CoMaSy implementation and the data-governance questions that must be agreed for a pilot. It is not a certification, DPA or substitute for your organisation’s legal/security review.</p>
      </section>

      <section className="section">
        <p className="eye dark">CURRENT IMPLEMENTATION</p>
        <h2>Technical safeguards already present in the application.</h2>
        <div className="grid">{controls.map(([title, copy]) => <article key={title}><h3>{title}</h3><p>{copy}</p></article>)}</div>
      </section>

      <section className="data">
        <div><p className="eye">PILOT DATA</p><h2>Agree the minimum data set before launch.</h2><p>CoMaSy is designed around observable scenario decisions. The pilot should establish exactly which fields are required, who may access results and whether reporting is individual, cohort-level or both.</p></div>
        <div className="dataList">
          <article><b>Pilot request data</b><span>Name, work email, organisation, role, organisation size, objective, current platform, notes, consent and attribution fields may be collected through the pilot request flow.</span></article>
          <article><b>Participant data</b><span>Scenario responses and derived training signals may be required for a pilot. The exact participant identifiers and reporting granularity should be agreed before the exercise.</span></article>
          <article><b>Access & retention</b><span>Customer-specific access, retention and deletion requirements should be documented in the pilot scope or commercial agreement before live participant data is processed.</span></article>
        </div>
      </section>

      <section className="section">
        <p className="eye dark">ARCHITECTURE & SERVICE PROVIDERS</p>
        <div className="twoCol">
          <div><h2>What the current codebase uses.</h2><p>The current Konfydence application is built on Next.js/React with Prisma and PostgreSQL/Supabase architecture and is deployed through Vercel. The pilot workflow includes a Resend email integration when configured. Consumer checkout uses Shopify.</p></div>
          <div className="note"><b>Procurement note</b><p>Deployment-specific subprocessors, regions, retention, data-processing terms and customer security requirements must be confirmed for the actual pilot environment. This page intentionally does not claim a certification or contractual control that has not been verified.</p></div>
        </div>
      </section>

      <section className="review">
        <div><p className="eye">PILOT REVIEW CHECKLIST</p><h2>Questions to close before participant data is used.</h2></div>
        <ul>
          <li>Who is the customer data controller and who processes data on its behalf?</li>
          <li>Which participant identifiers are necessary?</li>
          <li>Can the pilot be reported at cohort level?</li>
          <li>Who can access raw responses and derived signals?</li>
          <li>What retention/deletion period applies?</li>
          <li>Are works-council or employee-representative approvals required?</li>
          <li>Which subprocessors and hosting regions apply to the agreed environment?</li>
          <li>What happens if the customer stops after the pilot?</li>
        </ul>
      </section>

      <section className="legal section">
        <p className="eye dark">LEGAL & POLICY LINKS</p>
        <div className="links"><Link href="/privacy-policy"><b>Privacy Policy</b><span>Website and service privacy information.</span></Link><Link href="/terms-of-service"><b>Terms of Service</b><span>Current public service terms.</span></Link><Link href="/imprint"><b>Imprint</b><span>Legal operator and contact information.</span></Link><Link href="/cookie-policy"><b>Cookie Policy</b><span>Cookie and analytics information.</span></Link></div>
      </section>

      <section className="cta"><div><p className="eye dark">REQUEST A PILOT</p><h2>Bring your security and privacy questions into the pilot scope.</h2><p>A qualified pilot request should make the data model and review requirements explicit before scale.</p></div><Link href="/comasy/pilot">Request a Pilot →</Link></section>

      <footer><Link href="/comasy">CoMaSy</Link><Link href="/comasy/methodology">Methodology</Link><Link href="/privacy-policy">Privacy</Link><Link href="/imprint">Imprint</Link></footer>

      <style>{`
        :global(*){box-sizing:border-box}:global(body){margin:0;background:#f3f1eb;color:#071726}.page{font-family:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif}.page a:focus-visible{outline:3px solid #b8ff3d;outline-offset:4px}header{min-height:72px;background:#071d31;color:white;display:flex;align-items:center;justify-content:space-between;gap:24px;padding:12px max(20px,calc((100vw - 1120px)/2));border-bottom:1px solid #ffffff1c}.brand{color:white;text-decoration:none;font-size:13px;font-weight:950}.brand span{color:#b8ff3d}header nav{display:flex;gap:20px}header nav a{color:#c3d0d8;text-decoration:none;font-size:12px;font-weight:800}.eye{font-size:11px;letter-spacing:.14em;font-weight:950;color:#b8ff3d;margin:0 0 16px}.eye.dark{color:#d54d44}.hero{background:linear-gradient(135deg,#0c3455,#071d31 72%);color:white;padding:100px max(20px,calc((100vw - 980px)/2))}.hero h1,.section>h2,.data h2,.review h2,.twoCol h2,.cta h2{font:500 clamp(44px,5.5vw,70px)/.98 Georgia,serif;letter-spacing:-.045em;margin:0}.hero>p:last-child{font-size:16px;line-height:1.72;color:#c1d0d9;max-width:780px;margin:25px 0 0}.section{max-width:1120px;margin:auto;padding:90px 20px}.section>h2{font-size:clamp(42px,4.7vw,60px);max-width:780px}.grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:45px}.grid article{border:1px solid #d2dbde;border-radius:17px;padding:25px;background:#fbfaf6}.grid h3{font:500 28px Georgia,serif;margin:0 0 11px}.grid p,.twoCol p{font-size:13px;line-height:1.65;color:#647782}.data{background:#071d31;color:white;padding:90px max(20px,calc((100vw - 1120px)/2));display:grid;grid-template-columns:.9fr 1.1fr;gap:70px}.data h2{font-size:clamp(42px,4.8vw,62px)}.data>div>p:not(.eye){font-size:14px;line-height:1.65;color:#aebfca}.dataList article{padding:18px 0;border-top:1px solid #ffffff1c}.dataList article:last-child{border-bottom:1px solid #ffffff1c}.dataList b{display:block;color:#b8ff3d;font-size:13px;margin-bottom:8px}.dataList span{font-size:13px;line-height:1.6;color:#b5c6cf}.twoCol{display:grid;grid-template-columns:1.1fr .9fr;gap:60px;align-items:start}.twoCol h2{font-size:48px}.note{background:#e8ece8;border:1px solid #c9d3cf;border-radius:18px;padding:26px}.note b{font-size:12px;color:#d54d44;letter-spacing:.08em;text-transform:uppercase}.review{background:#0c3455;color:white;padding:85px max(20px,calc((100vw - 1120px)/2));display:grid;grid-template-columns:.9fr 1.1fr;gap:70px}.review h2{font-size:clamp(40px,4.7vw,60px)}.review ul{margin:0;padding-left:20px}.review li{font-size:13px;line-height:1.6;color:#bdcbd3;margin:10px 0}.links{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}.links a{border:1px solid #d2dbde;border-radius:15px;padding:20px;text-decoration:none;color:#071726;background:#fbfaf6}.links b{display:block;font:500 22px Georgia,serif;margin-bottom:9px}.links span{display:block;font-size:12px;line-height:1.55;color:#647782}.cta{max-width:1120px;margin:0 auto 90px;background:#e6ebe7;border:1px solid #c9d3cf;border-radius:24px;padding:44px;display:flex;align-items:end;justify-content:space-between;gap:40px}.cta h2{font-size:48px;max-width:700px}.cta p:not(.eye){font-size:14px;color:#637680}.cta>a{background:#071d31;color:white;text-decoration:none;border-radius:999px;padding:14px 18px;font-size:13px;font-weight:950;white-space:nowrap}footer{background:#061624;color:#9aadb8;padding:28px max(20px,calc((100vw - 1120px)/2));display:flex;gap:20px;flex-wrap:wrap}footer a{color:#a8bac4;text-decoration:none;font-size:11px}@media(max-width:820px){header nav{display:none}.grid,.data,.twoCol,.review,.links{grid-template-columns:1fr}.data,.review{gap:40px}.cta{margin-left:20px;margin-right:20px;flex-direction:column;align-items:flex-start}}@media(max-width:520px){.hero{padding:70px 20px}.hero h1{font-size:46px}.section{padding:70px 20px}.data,.review{padding:70px 20px}.cta{padding:28px}.cta h2{font-size:40px}}
      `}</style>
    </main>
  );
}
