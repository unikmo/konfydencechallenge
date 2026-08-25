import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Request a CoMaSy Security Decision Simulation Pilot" },
  description:
    "Run a defined CoMaSy pilot with a selected cohort, baseline, targeted decision practice, post-variant measurement and an executive scale / adapt / stop review.",
  alternates: { canonical: "/comasy/pilot" },
};

const roles=["CISO / Security Leadership","Security Awareness","Compliance","Risk","HR","L&D","IT","Management","Other"];
const sizes=["<250","250–999","1,000–4,999","5,000–9,999","10,000+"];
const objectives=["Improve security awareness","Measure behaviour","NIS2","Management training","Phishing / social engineering","Compliance evidence","Evaluate CoMaSy","Other"];

export default async function PilotPage({searchParams}:{searchParams:Promise<Record<string,string|undefined>>}){
  const q=await searchParams;
  return <main className="page">
    <header><Link href="/comasy" className="brand">KONFYDENCE <span>/ CoMaSy</span></Link><nav><Link href="/comasy/methodology">Methodology</Link><Link href="/comasy/security">Security & Privacy</Link><Link href="/comasy/dashboard/login">Customer login</Link></nav></header>

    <section className="hero">
      <div>
        <p className="eye">COMASY PILOT</p>
        <h1>Test decision simulation inside your organisation before scaling it.</h1>
        <p>Start with a defined cohort, a defined risk focus and a defined decision point. The pilot is designed to work alongside your existing awareness programme — not force a platform replacement.</p>
        <div className="signals"><span>Bounded scope</span><span>No LMS replacement</span><span>Defined measurement</span><span>Scale / adapt / stop review</span></div>
        <figure className="businessVisual"><Image src="/edition-images/workplace.png" alt="Business professionals reviewing a security decision together" fill priority sizes="(max-width: 900px) 100vw, 54vw"/><figcaption>Designed for security, compliance, risk and learning teams.</figcaption></figure>
        <div className="steps"><span><b>01</b> Agree cohort & risk focus</span><span><b>02</b> Establish baseline</span><span><b>03</b> Targeted practice</span><span><b>04</b> Post-variant review</span><span><b>05</b> Scale / adapt / stop</span></div>
      </div>

      <form action="/api/comasy/pilot" method="post">
        <p className="formEye">REQUEST A PILOT</p><h2>Tell us what you need to learn.</h2>
        <p className="formIntro">This is a qualification request, not a commitment to purchase. We use the information to understand the use case and propose an appropriate pilot scope.</p>
        {q.error&&<div className="error">{q.error==="rate"?"Too many requests. Please try again shortly.":"Please complete the required fields using a valid work email."}</div>}
        <div className="split"><label>First name<input name="firstName" autoComplete="given-name" required/></label><label>Last name<input name="lastName" autoComplete="family-name" required/></label></div>
        <label>Work email<input name="workEmail" type="email" autoComplete="email" required/></label><label>Organisation<input name="organization" autoComplete="organization" required/></label>
        <div className="split"><label>Role<select name="role" required><option value="">Select…</option>{roles.map(x=><option key={x}>{x}</option>)}</select></label><label>Organisation size<select name="organizationSize" required><option value="">Select…</option>{sizes.map(x=><option key={x}>{x}</option>)}</select></label></div>
        <label>Primary objective<select name="primaryObjective" required><option value="">Select…</option>{objectives.map(x=><option key={x}>{x}</option>)}</select></label>
        <label>Current awareness platform <small>optional</small><input name="currentPlatform"/></label><label>Anything we should know? <small>optional</small><textarea name="notes" rows={4} placeholder="Relevant workflows, target cohort, procurement or privacy requirements…"/></label>
        <label className="consent"><input type="checkbox" name="consent" value="yes" required/><span>I agree that Konfydence may use these details to respond to this CoMaSy pilot request.</span></label>
        <input type="hidden" name="utm_source" value={q.utm_source||""}/><input type="hidden" name="utm_medium" value={q.utm_medium||""}/><input type="hidden" name="utm_campaign" value={q.utm_campaign||""}/><input type="hidden" name="landingPage" value="/comasy/pilot"/>
        <button>Request Pilot <span>→</span></button>
        <p className="privacy">Review <Link href="/comasy/security">Security & Privacy</Link> and the <Link href="/privacy-policy">Privacy Policy</Link>. Pilot request data and enterprise programme data are kept separate from consumer challenge activity.</p>
      </form>
    </section>

    <section className="scope">
      <div><p className="eye dark">WHAT THE FIRST PILOT IS FOR</p><h2>Prove the use case before you fund the roadmap.</h2><p>The first objective is not to deploy a broad human-risk platform. It is to determine whether realistic decision rehearsal produces useful behavioural evidence for your organisation.</p></div>
      <div className="scopeGrid">
        <article><b>Included</b><span>Defined cohort and risk focus</span><span>Baseline scenario set</span><span>Targeted decision practice</span><span>Materially varied post scenarios</span><span>Executive evidence review</span></article>
        <article><b>Not required to start</b><span>LMS replacement</span><span>Broad enterprise integrations</span><span>Multiplayer rollout</span><span>AI-driven open-ended simulation</span><span>Long-term platform commitment</span></article>
      </div>
    </section>

    <section className="proof"><article><p>WHAT WE ESTABLISH</p><h2>Baseline</h2><span>How the selected cohort responds before targeted practice.</span></article><article><p>WHAT EMPLOYEES EXPERIENCE</p><h2>Practice</h2><span>Short, realistic social-engineering decisions rather than another long course.</span></article><article><p>WHAT WE COMPARE</p><h2>Change</h2><span>Defined decision signals across baseline and materially varied post scenarios.</span></article><article><p>WHAT LEADERSHIP RECEIVES</p><h2>Evidence</h2><span>A review of what changed, what did not and whether scale is justified.</span></article></section>

    <section className="before"><div><p className="eye">BEFORE PARTICIPANT DATA IS USED</p><h2>Agree the data and review model.</h2></div><div><p>The pilot scope should document participant identifiers, reporting granularity, access, retention/deletion expectations, subprocessors and any works-council or employee-representative requirements.</p><div className="beforeLinks"><Link href="/comasy/security">Security & Privacy →</Link><Link href="/comasy/methodology">Measurement methodology →</Link></div></div></section>

    <footer><Link href="/comasy">CoMaSy</Link><span>CoMaSy supports awareness and effectiveness evidence. It does not by itself establish regulatory compliance.</span></footer>

    <style>{`
      :global(*){box-sizing:border-box}:global(body){margin:0;background:#f3f1eb;color:#071726}.page{font-family:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif}.page a:focus-visible{outline:3px solid #b8ff3d;outline-offset:4px}header{min-height:72px;background:#08243d;color:white;display:flex;align-items:center;justify-content:space-between;gap:24px;padding:12px max(20px,calc((100vw - 1180px)/2));border-bottom:1px solid #ffffff1c}header a{color:white;text-decoration:none;font-size:12px;font-weight:850}.brand{font-size:13px!important}.brand span{color:#b8ff3d}header nav{display:flex;gap:20px}.hero{background:linear-gradient(135deg,#0b3457,#0a2742 58%,#071d31);color:white;padding:78px max(20px,calc((100vw - 1180px)/2)) 82px;display:grid;grid-template-columns:1fr .85fr;gap:72px;align-items:start}.eye,.formEye,.proof p{font-size:11px;letter-spacing:.14em;font-weight:950;color:#b8ff3d;margin:0 0 14px}.eye.dark{color:#d84c43}.hero h1,.scope h2,.before h2{font:500 clamp(48px,5.7vw,76px)/.95 Georgia,serif;letter-spacing:-.05em;margin:0}.hero>div>p:not(.eye){max-width:660px;color:#c2d1da;line-height:1.7;font-size:16px}.signals{display:flex;flex-wrap:wrap;gap:8px;margin:24px 0 0}.signals span{border:1px solid #ffffff27;border-radius:999px;padding:8px 10px;color:#afc1cc;font-size:11px}.businessVisual{position:relative;margin:30px 0 0;border-radius:20px;overflow:hidden;height:250px;background:#0f3a5c;box-shadow:0 24px 55px #0016}.businessVisual img{object-fit:cover;object-position:center 42%}.businessVisual:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,transparent 46%,rgba(4,22,37,.72));z-index:1}.businessVisual figcaption{position:absolute;z-index:2;left:18px;bottom:15px;color:#eef6fb;font-size:11px;font-weight:850;letter-spacing:.02em}.steps{display:grid;grid-template-columns:repeat(5,1fr);margin-top:30px;border-top:1px solid #ffffff22}.steps span{padding:18px 10px 0 0;font-size:11px;color:#b0c2ce;line-height:1.45}.steps b{display:block;color:#ff685e;margin-bottom:7px}form{background:#f8f6f0;color:#071726;padding:32px;border-radius:22px;box-shadow:0 28px 70px #0016}.formEye{color:#d84c43}.hero form h2{font:500 36px/1 Georgia,serif;margin:0 0 12px}.formIntro{font-size:12px!important;color:#687983!important;line-height:1.55!important;margin:0 0 22px!important}.hero form label{display:grid;gap:6px;font-size:12px;font-weight:900;color:#536a76;margin-bottom:13px}.hero form label small{font-weight:600;color:#87979e}.hero form input,.hero form select,.hero form textarea{width:100%;border:1px solid #cad5da;border-radius:10px;background:white;padding:12px 13px;font:inherit;color:#071726;outline:none}.hero form input:focus,.hero form select:focus,.hero form textarea:focus{border-color:#16466b;box-shadow:0 0 0 3px #16466b16}.split{display:grid;grid-template-columns:1fr 1fr;gap:10px}.consent{display:flex!important;grid-template:none!important;align-items:flex-start;gap:9px!important;line-height:1.45}.consent input{width:auto!important;margin-top:2px}.hero form button{width:100%;border:0;border-radius:999px;background:#ff5b50;color:white;padding:14px 17px;font-size:13px;font-weight:950;display:flex;justify-content:space-between;cursor:pointer}.privacy{font-size:11px!important;color:#73858f!important;line-height:1.5!important;margin:13px 0 0!important}.privacy a{color:#16466b!important;text-decoration:underline}.error{background:#fff0ee;border:1px solid #f0b2ac;color:#8e312a;border-radius:10px;padding:10px 12px;font-size:11px;font-weight:800;margin-bottom:14px}.scope{max-width:1180px;margin:auto;padding:90px 20px;display:grid;grid-template-columns:.9fr 1.1fr;gap:70px}.scope h2{font-size:clamp(42px,4.8vw,62px)}.scope>div>p:not(.eye){font-size:14px;line-height:1.7;color:#657883}.scopeGrid{display:grid;grid-template-columns:1fr 1fr;gap:12px}.scopeGrid article{border:1px solid #d2dbde;border-radius:16px;padding:22px;background:#fbfaf6}.scopeGrid b{display:block;font:500 25px Georgia,serif;margin-bottom:15px}.scopeGrid span{display:block;font-size:12px;line-height:1.5;color:#667983;border-top:1px solid #e0e5e6;padding:9px 0}.proof{max-width:1180px;margin:0 auto;padding:78px 20px;display:grid;grid-template-columns:repeat(4,1fr);border-top:1px solid #d5dcde;border-bottom:1px solid #d5dcde}.proof article{padding:0 24px 0 0;border-right:1px solid #d9e0e2}.proof article:not(:first-child){padding-left:24px}.proof article:last-child{border-right:0}.proof p{color:#d84c43}.proof h2{font:500 35px Georgia,serif;margin:0 0 10px}.proof span{font-size:12px;color:#687a83;line-height:1.6}.before{background:#071d31;color:white;padding:86px max(20px,calc((100vw - 1180px)/2));display:grid;grid-template-columns:1fr 1fr;gap:70px}.before h2{font-size:clamp(42px,4.8vw,62px)}.before>div>p{font-size:14px;line-height:1.7;color:#b4c5ce}.beforeLinks{display:flex;gap:18px;flex-wrap:wrap;margin-top:18px}.beforeLinks a{color:#b8ff3d;text-decoration:none;font-size:12px;font-weight:950}footer{max-width:1180px;margin:auto;padding:30px 20px 46px;display:flex;justify-content:space-between;gap:30px;font-size:11px;color:#74858d}footer a{color:#071726;text-decoration:none;font-weight:950}
      @media(max-width:900px){header nav{display:none}.hero,.scope,.before{grid-template-columns:1fr;gap:42px}.businessVisual{height:300px}.steps{grid-template-columns:repeat(3,1fr)}.proof{grid-template-columns:1fr 1fr;gap:30px}.proof article{border:0!important;padding:0!important}}
      @media(max-width:580px){.hero{padding:54px 20px}.hero h1{font-size:48px}.businessVisual{height:220px;border-radius:16px}.steps,.scopeGrid{grid-template-columns:1fr}.split{grid-template-columns:1fr}.hero form{padding:24px 18px}.scope,.before{padding:70px 20px}.proof{grid-template-columns:1fr}.proof article{padding-bottom:22px!important;border-bottom:1px solid #d9e0e2!important}footer{display:grid}}
    `}</style>
  </main>
}
