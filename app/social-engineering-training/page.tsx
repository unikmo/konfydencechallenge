import type { Metadata } from "next";
import { ComasyIntentPage } from "@/components/ComasyIntentPage";

export const metadata: Metadata = {
  title: { absolute: "Social Engineering Training for Employees | CoMaSy" },
  description: "Social engineering training built around realistic decisions, compromised identities, independent verification and measurable behavioural signals.",
  alternates: { canonical: "/social-engineering-training" },
};

export default function Page() {
  return <ComasyIntentPage
    eyebrow="SOCIAL ENGINEERING TRAINING"
    title="Practise the moment when the attacker looks trustworthy."
    intro="CoMaSy focuses on the decision pressure behind social engineering: urgency, authority, familiarity and requests that cut off independent verification. Employees rehearse what to do when the message, caller or account looks legitimate."
    problemTitle="The difficult question is not ‘who is malicious?’ It is ‘what makes this action safe?’"
    problemCopy="A trusted colleague can have a compromised account. A supplier can be impersonated. A voice can sound familiar. CoMaSy trains evidence-first verification instead of teaching employees to distrust every unusual request."
    sections={[
      { title: "Compromised identity", copy: "Separate the person’s trustworthiness from the safety of a specific account, message or action." },
      { title: "Independent verification", copy: "Practise leaving the requester’s channel and checking through a known contact path, process or system." },
      { title: "Proportionate response", copy: "Choose containment or escalation without turning every uncertain request into unnecessary business disruption." },
    ]}
    proofTitle="A stronger outcome is a repeatable verification habit."
    proofCopy="The CoMaSy measurement model looks for observable choices such as pausing, verifying independently and avoiding premature high-risk action."
    faq={[
      { question: "Is this only about phishing emails?", answer: "No. The intended scope includes broader business workflows such as executive requests, supplier fraud, payment changes, account takeover and voice-based impersonation." },
      { question: "What is the H.A.C.K. framework?", answer: "H.A.C.K. groups pressure into Hurry, Authority, Comfort and Kill-Switch — the point where a requester pushes a consequential action while verification is being cut off." },
      { question: "Can CoMaSy simulate a real department workflow?", answer: "A pilot can be configured around selected workflows and risk themes. Broad custom-platform functionality is intentionally not a prerequisite for the first pilot." },
      { question: "What happens after the exercise?", answer: "Participants receive decision feedback and the organisation reviews defined cohort signals to decide whether further practice or scale is justified." },
    ]}
  />;
}
