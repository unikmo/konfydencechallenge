import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "CoMaSy | Security Decision Simulation by Konfydence" },
  description:
    "CoMaSy complements security awareness programs with realistic decision simulations that measure pause, verification and escalation behaviour under pressure.",
  alternates: { canonical: "/comasy" },
  openGraph: {
    title: "CoMaSy | Security Decision Simulation",
    description:
      "Rehearse the moments where trusted identities, urgency and incomplete evidence compress judgement — then measure how people respond.",
    url: "https://konfydence.com/comasy",
    siteName: "Konfydence",
    type: "website",
  },
};

const audiences = [
  ["CISO / Security Leadership", "See whether awareness is changing observable decision behaviour."],
  ["Security Awareness", "Add decision rehearsal without replacing the programme you already run."],
  ["Compliance & Risk", "Create clearer evidence around repeated awareness activity and defined effectiveness indicators."],
  ["HR / L&D", "Use short, relevant practice instead of adding another long course library."],
];

const faqs = [
  [
    "Does CoMaSy replace our LMS or phishing platform?",
    "No. CoMaSy is designed as a complementary decision-simulation layer. A pilot can run alongside your existing awareness programme without requiring a platform replacement.",
  ],
  [
    "What does CoMaSy measure?",
    "CoMaSy measures training signals from scenario decisions, including pause behaviour, independent verification, higher-risk impulse actions and H.A.C.K. pressure-pattern responses. These are learning signals, not guarantees of real-world security performance.",
  ],
  [
    "Is CoMaSy a phishing simulator?",
    "Phishing can be one scenario type, but the core use case is broader: executive impersonation, supplier changes, payment requests, account compromise and other business decisions where a request can look legitimate.",
  ],
  [
    "Does CoMaSy make an organisation NIS2 compliant?",
    "No. CoMaSy can support repeated cybersecurity-awareness activity and defined effectiveness evidence, but using CoMaSy does not by itself establish regulatory compliance.",
  ],
];

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      "@id": "https://konfydence.com/comasy#service",
      name: "CoMaSy",
      serviceType: "Security decision simulation",
      provider: {
        "@type": "Organization",
        name: "Konfydence",
        url: "https://konfydence.com",
      },
      url: "https://konfydence.com/comasy",
      description:
        "A decision-simulation layer that helps organisations rehearse realistic social-engineering decisions and measure observable verification behaviour.",
      areaServed: ["Europe", "North America"],
      audience: {
        "@type": "Audience",
        audienceType: "Security, compliance, risk and learning teams",
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: faqs.map(([question, answer]) => ({
        "@type": "Question",
        name: question,
        acceptedAnswer: { "@type": "Answer", text: answer },
      })),
    },
  ],
};

export default function ComasyPage() {
  return (
    <main className="page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <header>
        <Link className="brand" href="/">KONFYDENCE <span>/ CoMaSy</span></Link>
        <nav aria-label="CoMaSy navigation">
          <a href="#platform">Platform</a>
          <Link href="/comasy/methodology">Methodology</Link>
          <Link href="/comasy/security">Security & Privacy</Link>
          <a href="#nis2">NIS2</a>
          <Link href="/comasy/dashboard/login">Customer login</Link>
        </nav>
        <Link className="pilot" href="/comasy/pilot">Request a Pilot →</Link>
      </header>

      <section className="hero">
        <div className="copy">
          <p className="eye">COMASY™ BY KONFYDENCE</p>
          <h1>Security awareness that measures behaviour under pressure.</h1>
          <p className="lede">
            CoMaSy complements the awareness programme you already run with short, realistic security decisions — then shows whether people pause, verify independently and escalate when a request looks legitimate.
          </p>
          <div className="actions">
            <Link href="/comasy/pilot">Request a Pilot <span>→</span></Link>
            <Link href="/security-decision-simulation">Why decision simulation?</Link>
          </div>
          <div className="heroSignals" aria-label="Pilot attributes">
            <span>No LMS replacement</span><span>Defined pilot scope</span><span>Behavioural evidence</span>
          </div>
        </div>
        <figure className="heroPhoto">
          <Image
            src="/edition-images/workplace.png"
            alt="Business professionals discussing a security decision in a modern office"
            fill
            priority
            sizes="(max-width: 900px) 100vw, 46vw"
          />
          <figcaption>Decision rehearsal for the moments where trust and pressure collide.</figcaption>
        </figure>
      </section>

      <section className="hack" aria-label="H.A.C.K. pressure framework">
        <article><b>H</b><span>Hurry<small>Artificial urgency compresses judgement.</small></span></article>
        <article><b>A</b><span>Authority<small>Titles and hierarchy make requests feel unquestionable.</small></span></article>
        <article><b>C</b><span>Comfort<small>Familiarity and routine lower suspicion.</small></span></article>
        <article><b>K</b><span>Kill-Switch<small>The requester pushes action while cutting off independent verification.</small></span></article>
      </section>

      <section className="section wedge">
        <p className="eye dark">THE DECISION GAP</p>
        <div className="lead">
          <h2>A trusted person can be real. The request can still be unsafe.</h2>
          <p>
            CoMaSy is built for the hard middle ground between “spot the bad email” and a real business incident. Accounts are compromised. Voices can be imitated. Suppliers change details. Executives create urgency. The safer response is not automatic distrust — it is evidence, independent verification and proportionate action.
          </p>
        </div>
        <div className="wedgeGrid">
          <article><span>01</span><h3>Compromised identity</h3><p>Separate a trusted person from the safety of a specific message, account or action.</p></article>
          <article><span>02</span><h3>Evidence stream</h3><p>Practise evidence → verification → decision → action instead of guessing who looks suspicious.</p></article>
          <article><span>03</span><h3>Business continuity</h3><p>Contain what needs containing without training people to freeze every legitimate workflow.</p></article>
        </div>
      </section>

      <section className="productProof">
        <div className="proofIntro">
          <div>
            <p className="eye dark">EMPLOYEE DECISION → ORGANISATIONAL SIGNAL</p>
            <h2>One realistic choice. One observable behaviour.</h2>
          </div>
          <p>
            CoMaSy does not present sample percentages as customer outcomes. The example below shows the measurement model. Real pilot reporting is calculated from actual participant decisions.
          </p>
        </div>
        <div className="proofGrid">
          <article className="scenario">
            <p>ILLUSTRATIVE SCENARIO · AUTHORITY + HURRY</p>
            <h3>Your CFO messages at 16:47.</h3>
            <blockquote>“I’m boarding now. Please approve this supplier payment before 17:00.”</blockquote>
            <div><span>A</span>Approve now; verify later.</div>
            <div><span>B</span>Ask a colleague if it looks genuine.</div>
            <div className="best"><span>C</span>Verify through the known finance approval channel first.</div>
          </article>
          <article className="dash">
            <p>ILLUSTRATIVE DASHBOARD · NOT CUSTOMER OUTCOME DATA</p>
            <strong>Pause Adoption <em>72%</em></strong>
            <strong>Verification <em>67%</em></strong>
            <strong>Impulse <em>18%</em></strong>
            <i><span style={{ width: "72%" }} /></i>
            <small>Example values demonstrate the reporting format only. Pilot metrics are calculated from stored scenario decisions.</small>
          </article>
        </div>
      </section>

      <section id="platform" className="section platform">
        <p className="eye dark">BASELINE → PRACTICE → MEASURE → EVIDENCE</p>
        <div className="lead">
          <h2>Knowing the rule is not the same as applying it.</h2>
          <p>
            Start with a defined cohort and a defined decision point. CoMaSy adds repeated decision rehearsal and a behavioural measurement layer without asking you to replace your current awareness stack.
          </p>
        </div>
        <div className="steps">
          <article><b>01</b><h3>Baseline</h3><p>Establish how the selected cohort responds before targeted practice.</p></article>
          <article><b>02</b><h3>Practice</h3><p>Rehearse realistic decisions across pressure patterns and business workflows.</p></article>
          <article><b>03</b><h3>Measure</h3><p>Track defined decision signals from participant responses.</p></article>
          <article><b>04</b><h3>Evidence</h3><p>Review change and decide whether to scale, adapt or stop.</p></article>
        </div>
      </section>

      <section id="measurement" className="measure">
        <div>
          <p className="eye">DEFINED TRAINING SIGNALS</p>
          <h2>See more than completion rates.</h2>
          <p>Every metric has a written definition. The methodology page explains what is measured, what is not measured and how to interpret the result responsibly.</p>
          <Link className="textLink" href="/comasy/methodology">Read the measurement methodology →</Link>
        </div>
        <div className="metricCards">
          <article><span>Pause Adoption</span><b>Interrupt the risky action chain before acting.</b></article>
          <article><span>Verification Rate</span><b>Verify through an independent, known channel.</b></article>
          <article><span>Impulse Rate</span><b>Choose an immediate higher-risk action without sufficient verification.</b></article>
          <article><span>H.A.C.K. Profile</span><b>Identify which pressure pattern remains hardest to handle.</b></article>
        </div>
      </section>

      <section className="section audiences">
        <p className="eye dark">ONE DECISION LAYER · DIFFERENT ORGANISATIONAL NEEDS</p>
        <div className="audGrid">
          {audiences.map(([name, copy]) => <article key={name}><h3>{name}</h3><p>{copy}</p></article>)}
        </div>
      </section>

      <section className="pilotOffer">
        <div>
          <p className="eye">PAID-PILOT MOTION</p>
          <h2>Start small. Prove whether the signal is useful.</h2>
          <p>A CoMaSy pilot is deliberately bounded: a defined cohort, selected risk focus, baseline, targeted practice, post-variant and an executive review. Broad integrations, multiplayer and platform replacement are not prerequisites.</p>
        </div>
        <div className="pilotChecklist">
          <span>01 · Agree cohort and risk focus</span>
          <span>02 · Establish baseline</span>
          <span>03 · Run targeted decision practice</span>
          <span>04 · Review change on a post variant</span>
          <span>05 · Scale / adapt / stop</span>
          <Link href="/comasy/pilot">See pilot scope →</Link>
        </div>
      </section>

      <section id="nis2" className="nis2">
        <div><p className="eye">NIS2 USE CASE</p><h2>Support the human side of awareness and effectiveness evidence.</h2></div>
        <div>
          <p>CoMaSy is designed to support repeated awareness activity, defined effectiveness indicators and records of participation and behavioural change.</p>
          <ul><li>Repeat awareness activity over time</li><li>Assess defined effectiveness indicators</li><li>Maintain clearer evidence and reporting</li></ul>
          <small>CoMaSy supports elements of an organisation’s cybersecurity awareness and training programme. Use of CoMaSy does not by itself establish regulatory compliance.</small>
          <Link className="textLink light" href="/comasy/nis2-security-awareness">Explore the NIS2 use case →</Link>
        </div>
      </section>

      <section className="trustSection">
        <div>
          <p className="eye dark">ENTERPRISE REVIEW</p>
          <h2>Clearer answers before procurement asks.</h2>
          <p>Review the measurement model, data handling and current technical safeguards before requesting a pilot.</p>
        </div>
        <div className="trustLinks">
          <Link href="/comasy/methodology"><b>Methodology</b><span>Definitions, limits and interpretation.</span></Link>
          <Link href="/comasy/security"><b>Security & Privacy</b><span>Data flow, safeguards and procurement notes.</span></Link>
          <Link href="/privacy-policy"><b>Privacy Policy</b><span>Website and service privacy information.</span></Link>
          <Link href="/imprint"><b>Legal operator</b><span>Company and contact information.</span></Link>
        </div>
      </section>

      <section className="faq section">
        <p className="eye dark">COMMON BUYER QUESTIONS</p>
        <h2>What CoMaSy is — and what it is not.</h2>
        <div className="faqGrid">
          {faqs.map(([question, answer]) => <article key={question}><h3>{question}</h3><p>{answer}</p></article>)}
        </div>
      </section>

      <section className="pilotBand">
        <div><p className="eye dark">DEFINED COHORT. DEFINED METRICS. DEFINED DECISION POINT.</p><h2>Test the decision-simulation layer before scaling it.</h2></div>
        <Link href="/comasy/pilot">Request a CoMaSy Pilot <span>→</span></Link>
      </section>

      <footer>
        <b>CoMaSy by Konfydence</b>
        <nav>
          <Link href="/">Individuals</Link><Link href="/comasy/methodology">Methodology</Link><Link href="/comasy/security">Security</Link><Link href="/comasy/pilot">Pilot</Link><Link href="/comasy/dashboard/login">Customer login</Link><Link href="/privacy-policy">Privacy</Link><Link href="/terms-of-service">Terms</Link>
        </nav>
      </footer>

      <style>{`
        :global(*){box-sizing:border-box}:global(body){margin:0;background:#f3f1eb;color:#071726}.page{font-family:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif}.page a:focus-visible{outline:3px solid #b8ff3d;outline-offset:4px}
        header{min-height:74px;background:#071d31;color:white;display:flex;align-items:center;gap:28px;padding:12px max(20px,calc((100vw - 1180px)/2));position:sticky;top:0;z-index:10;border-bottom:1px solid #ffffff1c}.brand{color:white;text-decoration:none;font-size:13px;font-weight:950}.brand span{color:#b8ff3d}header nav{display:flex;gap:22px;margin-left:auto;align-items:center}header nav a{color:#c1ced6;text-decoration:none;font-size:12px;font-weight:800}.pilot{background:#b8ff3d;color:#071d31;text-decoration:none;border-radius:999px;padding:11px 15px;font-size:12px;font-weight:950;white-space:nowrap}
        .hero{min-height:650px;background:linear-gradient(135deg,#0c3455,#071d31 68%);color:white;padding:74px max(20px,calc((100vw - 1180px)/2));display:grid;grid-template-columns:minmax(0,1fr) minmax(400px,.88fr);gap:72px;align-items:center}.eye{font-size:11px;letter-spacing:.14em;font-weight:950;color:#b8ff3d;margin:0 0 16px}.eye.dark{color:#d54d44}.hero h1,.section h2,.measure h2,.nis2 h2,.pilotBand h2,.productProof h2,.pilotOffer h2,.trustSection h2{font:500 clamp(43px,4.7vw,67px)/.98 Georgia,serif;letter-spacing:-.045em;margin:0}.lede{max-width:650px;color:#c3d1da;line-height:1.7;font-size:16px;margin:25px 0}.actions{display:flex;align-items:center;gap:20px;margin:28px 0}.actions a:first-child,.pilotBand>a{display:flex;justify-content:space-between;gap:26px;background:#ff5b50;color:white;text-decoration:none;border-radius:999px;padding:14px 18px;font-size:13px;font-weight:950}.actions a:last-child{color:white;font-size:13px;font-weight:850}.heroSignals{display:flex;gap:9px;flex-wrap:wrap}.heroSignals span{border:1px solid #ffffff26;border-radius:999px;padding:8px 11px;color:#aebfca;font-size:11px}.heroPhoto{position:relative;width:100%;height:500px;border-radius:24px;overflow:hidden;box-shadow:0 34px 75px #0017;border:1px solid #ffffff1c;margin:0}.heroPhoto img{object-fit:cover;object-position:center}.heroPhoto:after{content:"";position:absolute;inset:55% 0 0;background:linear-gradient(180deg,transparent,rgba(7,29,49,.78));z-index:1}.heroPhoto figcaption{position:absolute;z-index:2;left:20px;right:20px;bottom:18px;color:#eef5f8;font-size:12px;line-height:1.5}
        .hack{background:#0b2a43;color:white;display:grid;grid-template-columns:repeat(4,1fr);padding:0 max(20px,calc((100vw - 1180px)/2))}.hack article{min-height:118px;display:flex;align-items:center;gap:13px;border-right:1px solid #ffffff12;padding:14px}.hack article:first-child{border-left:1px solid #ffffff12}.hack b{flex:0 0 34px;width:34px;height:34px;border:1px solid #6d8391;border-radius:50%;display:grid;place-items:center;color:#b8ff3d;font-size:11px}.hack span{font-size:13px;font-weight:900}.hack small{display:block;color:#91a4b0;font-size:11px;line-height:1.45;margin-top:4px;font-weight:600}
        .section{max-width:1180px;margin:auto;padding:100px 20px}.lead{display:grid;grid-template-columns:1.15fr .85fr;gap:70px;align-items:end}.lead p,.proofIntro>p,.trustSection>div>p{color:#687b85;font-size:15px;line-height:1.72;margin:0}.wedgeGrid{display:grid;grid-template-columns:repeat(3,1fr);gap:15px;margin-top:52px}.wedgeGrid article{border:1px solid #d4dcdf;border-radius:18px;padding:25px;background:#faf9f5}.wedgeGrid span{font-size:11px;color:#d54d44;font-weight:950}.wedgeGrid h3{font:500 29px Georgia,serif;margin:32px 0 12px}.wedgeGrid p{font-size:13px;line-height:1.6;color:#667a84;margin:0}
        .productProof{max-width:1180px;margin:auto;padding:20px 20px 100px}.proofIntro{display:grid;grid-template-columns:1.05fr .95fr;gap:70px;align-items:end}.proofGrid{display:grid;grid-template-columns:1.15fr .85fr;gap:24px;margin-top:48px}.scenario,.dash{border-radius:20px;padding:31px}.scenario{background:#fffdf8;border:1px solid #d3dcdf;color:#071726}.scenario>p,.dash>p{font-size:10px;letter-spacing:.12em;font-weight:950;color:#d54d44}.scenario h3{font:500 38px/1 Georgia,serif;margin:18px 0}.scenario blockquote{margin:0 0 23px;font-size:15px;line-height:1.65;color:#4f6470}.scenario>div{display:grid;grid-template-columns:34px 1fr;gap:11px;align-items:center;border:1px solid #d9e1e4;border-radius:11px;padding:13px;margin-top:9px;font-size:12px}.scenario>div>span{width:28px;height:28px;border:1px solid #b9c7cd;border-radius:50%;display:grid;place-items:center;font-weight:950}.scenario>div.best{background:#edf7df;border-color:#b6d58f}.dash{background:#0e2b43;color:white;border:1px solid #ffffff1c;box-shadow:0 24px 55px #0015;display:flex;flex-direction:column;justify-content:center}.dash>p{color:#b8ff3d}.dash strong{display:flex;justify-content:space-between;align-items:center;font-size:12px;padding:15px 0;border-bottom:1px solid #ffffff16}.dash em{font:500 30px Georgia,serif;font-style:normal}.dash i{display:block;height:7px;background:#ffffff18;border-radius:5px;margin:25px 0}.dash i span{display:block;height:100%;background:#b8ff3d}.dash small{color:#9bb0bb;font-size:11px;line-height:1.6}
        .steps{display:grid;grid-template-columns:repeat(4,1fr);margin-top:55px;border-top:1px solid #cfd8dc}.steps article{padding:27px 22px 0 0;border-right:1px solid #d9e0e3;min-height:205px}.steps article:not(:first-child){padding-left:22px}.steps b{font-size:11px;color:#d54d44}.steps h3{font:500 29px Georgia,serif;margin:38px 0 10px}.steps p{color:#6e7f87;font-size:13px;line-height:1.6}
        .measure{background:#071d31;color:white;padding:92px max(20px,calc((100vw - 1180px)/2));display:grid;grid-template-columns:.9fr 1.1fr;gap:80px}.measure>div>p:not(.eye){color:#a7bac6;line-height:1.7;font-size:14px}.textLink{display:inline-block;margin-top:13px;color:#12639d;font-size:12px;font-weight:900;text-decoration:none}.textLink.light{color:#b8ff3d}.metricCards{display:grid;grid-template-columns:1fr 1fr;gap:10px}.metricCards article{border:1px solid #ffffff1b;border-radius:13px;padding:20px;background:#ffffff08}.metricCards span{display:block;color:#b8ff3d;font-size:11px;font-weight:950;margin-bottom:18px}.metricCards b{font:500 21px/1.2 Georgia,serif}
        .audiences{padding-top:88px}.audGrid{display:grid;grid-template-columns:repeat(4,1fr);border-top:1px solid #ced7db;border-left:1px solid #ced7db}.audGrid article{min-height:225px;padding:25px;border-right:1px solid #ced7db;border-bottom:1px solid #ced7db}.audGrid h3{font:500 28px/1.05 Georgia,serif;margin:42px 0 13px}.audGrid p{font-size:13px;line-height:1.6;color:#6c7e87}
        .pilotOffer{background:#e9ece7;padding:90px max(20px,calc((100vw - 1180px)/2));display:grid;grid-template-columns:1fr .9fr;gap:75px}.pilotOffer>div>p:not(.eye){font-size:15px;line-height:1.7;color:#60727c}.pilotChecklist{display:grid;align-content:center;border-top:1px solid #bec9c5}.pilotChecklist span,.pilotChecklist a{padding:14px 2px;border-bottom:1px solid #bec9c5;font-size:13px}.pilotChecklist a{color:#071d31;font-weight:950;text-decoration:none}
        .nis2{background:#0c3455;color:white;padding:82px max(20px,calc((100vw - 1180px)/2));display:grid;grid-template-columns:1fr 1fr;gap:80px}.nis2 h2{font-size:clamp(42px,4.5vw,62px)}.nis2>div>p{color:#aec1cc;line-height:1.7;font-size:14px}.nis2 li{font-size:13px;margin:12px 0}.nis2 small{display:block;color:#91a7b4;font-size:11px;line-height:1.6;margin-top:21px}
        .trustSection{max-width:1180px;margin:auto;padding:95px 20px;display:grid;grid-template-columns:.85fr 1.15fr;gap:70px}.trustLinks{display:grid;grid-template-columns:1fr 1fr;gap:12px}.trustLinks a{border:1px solid #d4dcdf;border-radius:15px;padding:20px;text-decoration:none;color:#071726;background:#fbfaf6}.trustLinks b{display:block;font:500 22px Georgia,serif;margin-bottom:9px}.trustLinks span{display:block;color:#687b85;font-size:12px;line-height:1.55}
        .faq{padding-top:70px}.faq>h2{max-width:760px}.faqGrid{display:grid;grid-template-columns:1fr 1fr;gap:13px;margin-top:45px}.faqGrid article{border-top:1px solid #cdd6d9;padding:22px 12px 10px 0}.faqGrid h3{font:500 24px/1.18 Georgia,serif;margin:0 0 12px}.faqGrid p{font-size:13px;line-height:1.65;color:#647680;margin:0}
        .pilotBand{max-width:1180px;margin:auto;padding:96px 20px;display:flex;justify-content:space-between;align-items:end;gap:50px}.pilotBand h2{font-size:clamp(42px,4.5vw,62px);max-width:760px}.pilotBand>a{background:#071d31;min-width:245px}footer{background:#061624;color:#7e95a4;padding:30px max(20px,calc((100vw - 1180px)/2));display:flex;justify-content:space-between;gap:25px;font-size:11px}footer b{color:white}footer nav{display:flex;gap:16px;flex-wrap:wrap;justify-content:flex-end}footer a{color:#a5b5bf;text-decoration:none}
        @media(max-width:960px){header nav{display:none}.hero{grid-template-columns:1fr;gap:40px;min-height:auto}.heroPhoto{height:440px}.lead,.proofIntro,.proofGrid,.measure,.nis2,.pilotOffer,.trustSection{grid-template-columns:1fr}.wedgeGrid,.steps,.audGrid{grid-template-columns:1fr 1fr}.trustLinks{grid-template-columns:1fr 1fr}.pilotBand{align-items:flex-start;flex-direction:column}.hack{grid-template-columns:1fr 1fr}}
        @media(max-width:600px){header{padding:10px 18px}.pilot{padding:10px 12px}.hero{padding:55px 20px}.hero h1{font-size:46px}.heroPhoto{height:330px}.section,.productProof{padding-left:20px;padding-right:20px}.wedgeGrid,.steps,.audGrid,.metricCards,.trustLinks,.faqGrid{grid-template-columns:1fr}.hack{grid-template-columns:1fr}.hack article:first-child{border-left:0}.steps article{border-right:0;border-bottom:1px solid #d9e0e3;padding-left:0!important}.pilotOffer,.measure,.nis2{padding:70px 20px}.scenario,.dash{padding:24px}.trustSection{padding:75px 20px}footer{display:grid}footer nav{justify-content:flex-start}}
      `}</style>
    </main>
  );
}
