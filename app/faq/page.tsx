import Link from "next/link";
import type { Metadata } from "next";
import { PremiumPage } from "@/components/PremiumSiteChrome";

export const metadata: Metadata = {
  title: "Konfydence FAQ | Scoring, challenges, pricing and privacy",
  description: "Straight answers about the free scam-readiness check, scores, H.A.C.K. and P.A.T., annual plans, school access and privacy.",
  alternates: { canonical: "/faq", languages: { en: "https://konfydence.com/faq", de: "https://konfydence.com/de/faq" } },
};

const questions: Array<[string, string]> = [
  ["What exactly happens in a challenge?", "You read a realistic situation, choose one of three plausible actions, and immediately see why your choice was strong or risky. A short free check introduces the pressure patterns; paid editions offer deeper practice in short rounds."],
  ["What can I try for free?", "Your first readiness check is free and needs no account to begin. It includes a short selection of scored decisions, feedback after every choice and a personal Readiness Score and H.A.C.K. pattern at completion. The free result is meaningful by itself; purchasing a full edition is optional."],
  ["Do I need an email address to see my result?", "For guests aged 16 or older, the completed result is delivered by email and then accessible on screen after the email step. A guest under 16 sees the result on screen without being asked for an email. A second free check requires a verified account, and the current limit is two free readiness checks."],
  ["What does the Konfydence Readiness Score measure?", "It summarizes the quality of your choices in the scenarios you played. The separate H.A.C.K. profile shows which pressure patterns changed those choices. It is a training signal, not a personality assessment, a prediction of future behaviour or a guarantee against scams or financial loss."],
  ["What is H.A.C.K.?", "Hurry is artificial urgency. Authority is pressure from official-looking people or institutions. Comfort uses familiar names or routines to lower scrutiny. Kill-Switch is the critical moment when you are pushed to click, pay, approve, share a code or reply before checking independently."],
  ["And what is P.A.T.?", "Pause before acting. Assess what the request is really asking you to do. Talk to a trusted person or verify through an independent channel that you already know. P.A.T. is a practical decision habit, not a promise of protection."],
  ["Which challenge edition should I choose?", "Family covers impersonation, payments and accounts at home. School focuses on gaming, social platforms and peer pressure for ages 12–18. University covers housing, jobs, tuition and identity. Workplace focuses on invoices, payroll and executive impersonation. TravelSafe covers booking, payment and travel pressure."],
  ["How many situations are in each paid edition?", "Each edition has 40+ real-life scenarios, added to regularly. The current source banks contain 48 scored situations per edition. Full challenges are played in short balanced rounds, with unseen scenarios prioritised before repeats."],
  ["How much does it cost?", "The free readiness check costs $0. One full edition is $6.99 per year; all five editions together are $24.99 per year. Schools and workplaces have a listed team option at $4.99 per seat per year, subject to the purchase terms shown at checkout. Local currency and final payable amount appear before you approve payment."],
  ["Is this a one-time purchase?", "No. The paid challenge plans are annual subscriptions. Check the final amount, renewal and cancellation terms in the checkout and terms of service before buying. Your purchase gives access according to the displayed plan; it does not purchase insurance or emergency assistance."],
  ["Can I give someone a challenge?", "Yes. The gift flow can send a claim code with your note. Check the gift product and redemption details before paying. Konfydence is digital scenario-based practice, not a physical gift item."],
  ["Can a school or workplace use this?", "Yes. Konfydence has School and Workplace editions and offers team seats and pilot enquiries. Organisational data handling, pilot scope and the final number of seats should be agreed before participation, especially where students are involved."],
  ["Does Konfydence prevent scams or provide incident response?", "No. It provides educational decision practice. It cannot verify every real-world message, guarantee safety, recover lost funds, or substitute for advice from your bank, authorities, legal counsel or security specialists. If you think a real incident has occurred, contact the relevant provider through an independently verified channel."],
  ["What happens to my data?", "The challenge needs some session and progress information to score and return results. Adult guests who choose to receive their result by email provide an address as part of that flow. Consult the Privacy Policy for processing, retention, accounts, analytics consent and your privacy rights."],
];

export default function FAQPage() {
  return <PremiumPage ctaHref="/challenge" ctaLabel="Try a free check">
    <section className="kg-shell k-section" style={{ borderTop: 0, maxWidth: 850, paddingTop: 72 }}>
      <p className="k-kicker">The details, without the mystery</p>
      <h1 className="k-display">Everything you were wondering, answered.</h1>
      <p className="k-lede">A curious question deserves a straight answer. Here is how the game, your result and the optional paid practice really work.</p>
      <div style={{ display: "grid", gap: 8, marginTop: 36 }}>
        {questions.map(([question, answer]) => <details key={question} style={{ borderBottom: "1px solid var(--k-line)", padding: "18px 4px" }}>
          <summary style={{ cursor: "pointer", fontSize: 19, fontWeight: 700 }}>{question}</summary>
          <p className="k-copy" style={{ marginTop: 12, maxWidth: 760 }}>{answer}</p>
        </details>)}
      </div>
      <p className="k-copy" style={{ marginTop: 34 }}>
        The complete policies are in our <Link href="/terms-of-service">Terms</Link> and <Link href="/privacy-policy">Privacy Policy</Link>.
        Still have a question? <Link href="/contact">Contact us</Link>.
      </p>
      <div className="k-actions" style={{ marginTop: 24 }}>
        <Link className="k-button" href="/challenge">Think you would spot it? Try free →</Link>
      </div>
    </section>
  </PremiumPage>;
}
