import type { Metadata } from "next";
import Link from "next/link";
import { PremiumPage } from "@/components/PremiumSiteChrome";
import { PortfolioStrip } from "@/components/PortfolioStrip";

const PDF_PATH = "/resources/konfydence-emergency-scam-protocol.pdf";

export const metadata: Metadata = {
  title: { absolute: "Free Emergency Scam Protocol | Konfydence" },
  description:
    "Download the free Konfydence Emergency Scam Protocol — a printable Pause · Assess · Talk response sheet for the household. No email required.",
  alternates: { canonical: "/free-scam-safety-pack" },
  openGraph: {
    title: "Free Konfydence Emergency Scam Protocol",
    description: "A printable Pause · Assess · Talk response sheet for the household. Free, no sign-up.",
    url: "https://konfydence.com/free-scam-safety-pack",
    siteName: "Konfydence",
    type: "website",
  },
};

const steps = [
  ["Pause", "Do not reply, click, pay or share information yet."],
  ["Assess", "What does it really want — money, a code, a login, an approval? If so, it is pressure, not proof."],
  ["Talk", "Say the request out loud to someone you trust, or call your bank on the number from your card."],
] as const;

export default function FreeScamSafetyPackPage() {
  return (
    <PremiumPage ctaHref={PDF_PATH} ctaLabel="Download the free PDF">
      <section className="k-shell k-free-dl">
        <div className="k-free-dl-copy">
          <p className="k-breadcrumb">Free resource · Household scam safety</p>
          <p className="k-kicker">Emergency readiness</p>
          <h1 className="k-display">One page. On the fridge. Before you need it.</h1>
          <p className="k-lede">
            The Emergency Scam Protocol is a free, printable <strong>Pause · Assess · Talk</strong> response sheet for
            the moment a message, call or payment request feels urgent. No email, no sign-up — the PDF downloads on click.
          </p>
          <div className="k-free-dl-actions">
            <a className="k-button" href={PDF_PATH} download>Download the PDF</a>
            <a className="k-button-quiet" href={PDF_PATH} target="_blank" rel="noopener">Open in a new tab</a>
          </div>
          <ol className="k-free-dl-steps">
            {steps.map(([name, copy]) => (
              <li key={name}>
                <b>{name}</b>
                <span>{copy}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="k-free-dl-preview">
          <a href={PDF_PATH} download aria-label="Download the Emergency Scam Protocol PDF">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/resources/konfydence-emergency-scam-protocol.svg" alt="The Konfydence Emergency Scam Protocol — a one-page Pause, Assess, Talk response sheet." />
          </a>
        </div>
      </section>

      <section className="k-section-dark" aria-labelledby="always-on">
        <div className="k-shell k-free-dl-lockscreen">
          <div className="k-free-dl-lockscreen-shot" aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/lockscreens/home/phone/21.png" alt="" />
          </div>
          <div>
            <p className="k-kicker">The reminder that stays</p>
            <h2 id="always-on" className="k-display-sm">A printout works once. A lock screen works every time you pick up your phone.</h2>
            <p className="k-copy">
              The protocol is the sheet you reach for in a crisis. <strong>Konfydence Lockscreens</strong> puts the same
              calm prompt where you actually see it — on the lock screen of a phone or computer — and quietly swaps it for
              a new one every two weeks as the scams change. Home and Teen plans check out instantly; Schools and Workplace
              get a licensed rollout for managed devices.
            </p>
            <div className="k-actions">
              <Link className="k-button" href="/lockscreens">See Konfydence Lockscreens</Link>
              <Link className="k-button-quiet" href="/lockscreens#pricing">Pricing</Link>
            </div>
          </div>
        </div>
      </section>

      <PortfolioStrip kicker="Also from Konfydence" heading="Practise the decision, not just the reminder." exclude={["lockscreens"]} />
    </PremiumPage>
  );
}
