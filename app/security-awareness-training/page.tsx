import type { Metadata } from "next";
import { ComasyIntentPage } from "@/components/ComasyIntentPage";

export const metadata: Metadata = {
  title: { absolute: "Security Awareness Training That Measures Decisions | CoMaSy" },
  description: "Complement security awareness training with realistic decision simulations that measure pause, verification and escalation behaviour under pressure.",
  alternates: { canonical: "/security-awareness-training" },
};

export default function Page() {
  return <ComasyIntentPage
    eyebrow="SECURITY AWARENESS TRAINING"
    title="Move from knowing the rule to applying it under pressure."
    intro="CoMaSy complements security awareness training with short decision simulations built around urgency, authority, familiarity and blocked verification. It is designed for organisations that already train employees but want clearer evidence of how people decide."
    problemTitle="Completion tells you who finished. It does not tell you how they decide."
    problemCopy="The difficult moment is rarely a textbook question. It is an urgent payment request, a trusted account behaving strangely, a supplier change or an executive asking for an exception. CoMaSy rehearses the decision process inside those moments."
    sections={[
      { title: "Rehearse realistic decisions", copy: "Use business-workflow scenarios where the request can look legitimate and the safest next move depends on verification, not suspicion alone." },
      { title: "Measure defined signals", copy: "Track pause behaviour, independent verification, impulse actions and H.A.C.K. pressure-pattern responses from participant choices." },
      { title: "Complement your stack", copy: "Run a bounded pilot alongside the LMS, phishing platform or awareness programme you already use rather than replacing it first." },
    ]}
    proofTitle="Behavioural evidence should come from real participant decisions."
    proofCopy="CoMaSy pilot reporting is calculated from scenario responses. Illustrative website percentages are labelled as examples and are not presented as customer outcomes."
    faq={[
      { question: "Is CoMaSy another awareness content library?", answer: "No. The core use case is repeated decision rehearsal and measurement, not replacing your existing course catalogue." },
      { question: "Can it run with our current provider?", answer: "That is the intended pilot motion. CoMaSy is positioned as a complementary layer rather than a mandatory platform replacement." },
      { question: "What should a pilot prove?", answer: "Whether the selected cohort changes defined decision signals on materially varied scenarios and whether the evidence is useful enough to justify scale." },
      { question: "Does a score prove security competence?", answer: "No. CoMaSy metrics are training signals from simulated decisions, not guarantees of real-world performance." },
    ]}
  />;
}
