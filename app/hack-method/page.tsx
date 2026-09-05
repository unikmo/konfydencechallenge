import Link from "next/link";
import type { Metadata } from "next";
import { PremiumPage } from "@/components/PremiumSiteChrome";
import { PortfolioStrip } from "@/components/PortfolioStrip";

export const metadata: Metadata = {
  title: { absolute: "The H.A.C.K. and P.A.T. method | Konfydence" },
  description:
    "Two simple frameworks: H.A.C.K. (Hurry, Authority, Comfort, Kill-Switch) to spot the pressure behind a scam, and P.A.T. (Pause, Assess, Talk) for what to do about it.",
  alternates: { canonical: "/hack-method" },
};

const patterns = [
  ["H", "Hurry", "Compress time so you act before you independently verify — deadlines, cut-offs, “right now”."],
  ["A", "Authority", "Use status, titles, uniforms or official language to make a request feel unquestionable."],
  ["C", "Comfort", "Use familiarity, routine or emotion to make the request feel safer than the evidence supports."],
  ["K", "Kill-Switch", "Push the critical action — click, pay, share, approve or reply — while cutting off your chance to check."],
];

const pat = [
  ["Pause", "Stop before the click, payment, code or reply. Urgency is the scam's tool; a few seconds takes it away.", "Take urgency's power away."],
  ["Assess", "Ask what this really wants from you: money, a code, a login, an approval. If that's the answer, it's pressure — not proof.", "What does it actually want?"],
  ["Talk", "Say the request out loud to someone you trust — a partner, a colleague — or your bank on the number from your card. Never the number in the message.", "Bring another person in."],
];

export default function HackMethodPage() {
  return (
    <PremiumPage ctaHref="/challenge/travelsafe/start?mode=diagnostic" ctaLabel="Try a free check">
      <section className="kg-shell k-section" style={{ borderTop: 0, paddingTop: 72, maxWidth: 820 }}>
        <p className="k-kicker">The method</p>
        <h1 className="k-display">Spot the pressure. Then Pause, Assess, Talk.</h1>
        <p className="k-lede">
          Konfydence runs on two small frameworks. <strong>H.A.C.K.</strong> names what a scam is doing to you.
          <strong> P.A.T.</strong> is what you do about it. You practise both until the moment feels familiar instead of frightening.
        </p>
        <div className="k-actions">
          <Link className="k-button" href="/challenge/travelsafe/start?mode=diagnostic">Take the free check</Link>
        </div>
      </section>

      <section className="kg-shell k-section">
        <div className="k-section-head">
          <div>
            <p className="k-kicker">H.A.C.K. — spot it</p>
            <h2 className="k-display-sm">The four pressure patterns behind almost every scam.</h2>
          </div>
          <p className="k-copy">
            You do not need to recognise every scam. You need to recognise the pressure. Almost all of it is one of these four.
          </p>
        </div>
        <div className="kg-scenario-grid kg-scenario-grid-4">
          {patterns.map(([letter, title, copy]) => (
            <article key={letter}>
              <span>{letter}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="k-section-dark">
        <div className="kg-shell">
          <div className="k-section-head">
            <div>
              <p className="k-kicker">P.A.T. — do this</p>
              <h2 className="k-display-sm">Pause. Assess. Talk.</h2>
            </div>
            <p className="k-copy">
              The same three moves work for a text, a call, an email or a knock at the door. It is deliberately short so it holds up under stress.
            </p>
          </div>
          <div className="k-method-grid">
            {pat.map(([title, copy, heading]) => (
              <article key={title}>
                <small>{title}</small>
                <h3>{heading}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="kg-shell k-callout">
        <div>
          <p className="k-kicker">Knowledge is useful. Rehearsal changes the next move.</p>
          <h2 className="k-display-sm">Practise it inside a realistic scenario.</h2>
          <p className="k-copy">
            Konfydence places these mechanics inside Family, School, University, Workplace and TravelSafe scenarios. Every decision is followed by an explanation and a rule you keep.
          </p>
        </div>
        <div className="k-actions">
          <Link className="k-button" href="/challenge">Choose a challenge</Link>
        </div>
      </section>

      <PortfolioStrip kicker="Put it into practice" heading="Choose the situation closest to your life." />
    </PremiumPage>
  );
}
