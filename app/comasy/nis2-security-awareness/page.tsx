import type { Metadata } from "next";
import { ComasyIntentPage } from "@/components/ComasyIntentPage";

export const metadata: Metadata = {
  title: { absolute: "NIS2 Security Awareness & Effectiveness Evidence | CoMaSy" },
  description: "A CoMaSy use case for repeated cybersecurity-awareness activity, defined effectiveness indicators and management-ready evidence. CoMaSy does not by itself establish NIS2 compliance.",
  alternates: { canonical: "/comasy/nis2-security-awareness" },
};

export default function Page() {
  return <ComasyIntentPage
    eyebrow="NIS2 SECURITY AWARENESS USE CASE"
    title="Turn repeated awareness activity into clearer effectiveness evidence."
    intro="CoMaSy can support the human side of a cybersecurity-awareness programme with repeat decision practice, defined behavioural training signals and records that can be reviewed over time. It does not by itself make an organisation NIS2 compliant."
    problemTitle="A training record answers ‘did it happen?’ Effectiveness evidence asks ‘what changed?’"
    problemCopy="Where organisations need repeated awareness activity and a clearer way to review effectiveness, a bounded CoMaSy pilot can add defined decision measures without pretending that one platform satisfies the wider legal, organisational and technical obligations of NIS2."
    sections={[
      { title: "Repeat awareness activity", copy: "Run short, scenario-based practice over time rather than relying on a single annual learning event." },
      { title: "Defined indicators", copy: "Use documented measures such as pause, independent verification, impulse actions and pressure-pattern response." },
      { title: "Reviewable evidence", copy: "Keep pilot participation and behavioural results clear enough for management review while preserving the limits of what the data can prove." },
    ]}
    proofTitle="Use CoMaSy as supporting evidence, not as a compliance shortcut."
    proofCopy="The methodology and pilot report should state exactly what was measured, how the cohort changed and what remains outside the scope of the exercise. Legal compliance remains the organisation’s responsibility."
    faq={[
      { question: "Does CoMaSy certify NIS2 compliance?", answer: "No. CoMaSy supports elements of cybersecurity awareness and effectiveness evidence. It is not a certification or a substitute for legal, governance or technical compliance work." },
      { question: "Can management teams use it?", answer: "A pilot can be configured around management or department-specific decision scenarios where that is part of the agreed scope." },
      { question: "What evidence does the pilot produce?", answer: "The intended outputs are participation records, defined decision signals, baseline/post comparison and an executive review of what the evidence supports." },
      { question: "Can it work with our current awareness provider?", answer: "Yes. The intended commercial motion is complementary: add decision rehearsal and measurement rather than replace the existing stack first." },
    ]}
  />;
}
