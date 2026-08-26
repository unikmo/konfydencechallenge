import type { Metadata } from "next";
import { ComasyIntentPage } from "@/components/ComasyIntentPage";

export const metadata: Metadata = {
  title: { absolute: "Security Decision Simulation | CoMaSy by Konfydence" },
  description: "Security decision simulation for organisations that want employees to rehearse verification, escalation and proportionate action under social-engineering pressure.",
  alternates: { canonical: "/security-decision-simulation" },
};

export default function Page() {
  return <ComasyIntentPage
    eyebrow="SECURITY DECISION SIMULATION"
    title="Rehearse the decisions attackers try to compress."
    intro="Security decision simulation places employees inside realistic business moments where urgency, authority, trusted identities and incomplete evidence compete for attention. CoMaSy measures the decision process rather than asking only whether someone recognises a threat label."
    problemTitle="The attack succeeds when pressure outruns verification."
    problemCopy="A decision can be risky even when the sender is known, the story is plausible and the action feels routine. CoMaSy is designed to practise the verification discipline that sits between blind trust and blanket suspicion."
    sections={[
      { title: "Evidence before judgement", copy: "Use evidence and independent verification to decide whether an action is safe rather than relying on superficial red flags." },
      { title: "Pressure-aware practice", copy: "Expose participants to Hurry, Authority, Comfort and Kill-Switch mechanics across realistic business contexts." },
      { title: "Measured response", copy: "Turn participant choices into defined training signals that can be compared across a bounded pilot." },
    ]}
    proofTitle="Simulation is useful only if the result changes a real decision."
    proofCopy="The pilot ends with an executive review: what changed, what did not, what the evidence can support and whether the organisation should scale, adapt or stop."
    faq={[
      { question: "How is this different from a phishing simulation?", answer: "Phishing is one possible scenario type. Security decision simulation covers broader business decisions where the request may arrive through trusted accounts, voice, workflow exceptions or supplier relationships." },
      { question: "Is CoMaSy a social deduction game?", answer: "No. The design emphasises evidence, independent verification and proportionate action rather than guessing who is ‘good’ or ‘bad’." },
      { question: "Does simulation mean multiplayer?", answer: "Not necessarily. A paid pilot can validate the decision and measurement model without requiring broad multiplayer or enterprise integrations first." },
      { question: "What is the commercial next step?", answer: "Request a bounded pilot with a defined cohort, risk focus, measurement plan and scale/stop decision point." },
    ]}
  />;
}
