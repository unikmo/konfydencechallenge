import type { Metadata } from "next";
import { ComasyIntentPage } from "@/components/ComasyIntentPage";

export const metadata: Metadata = {
  title: { absolute: "Cybersecurity Awareness Training for Employees | CoMaSy" },
  description: "Short, realistic cybersecurity decision practice for employees — designed to complement existing awareness programs and measure verification behaviour.",
  alternates: { canonical: "/cybersecurity-awareness-training-for-employees" },
};

export default function Page() {
  return <ComasyIntentPage
    eyebrow="EMPLOYEE CYBERSECURITY PRACTICE"
    title="Train the next decision, not just the next quiz answer."
    intro="CoMaSy gives employees realistic choices involving payment requests, executive impersonation, supplier changes, account compromise and other social-engineering pressure. The aim is to build a repeatable habit: pause, verify independently and escalate when needed."
    problemTitle="Employees need practice where trust, pressure and business continuity collide."
    problemCopy="Real incidents do not arrive with a label saying ‘phishing’. A message may come from a real account. A caller may know internal details. A process exception may look reasonable. Decision rehearsal helps employees practise the verification step before the pressure is real."
    sections={[
      { title: "Short practice", copy: "Use focused decision missions rather than adding another long course to the employee workload." },
      { title: "Role-relevant scenarios", copy: "Prioritise scenarios that match the cohort’s actual workflows, such as payments, payroll, supplier changes or privileged actions." },
      { title: "Immediate feedback", copy: "Explain why one response is stronger and reinforce the reusable verification principle behind the choice." },
    ]}
    proofTitle="Measure how the cohort responds, not whether they opened a lesson."
    proofCopy="Pilot reporting can compare defined decision signals before and after targeted practice using materially varied scenarios."
    faq={[
      { question: "How long does a CoMaSy exercise take?", answer: "The pilot is designed around short scenario decisions rather than a long course. Exact duration depends on the agreed scenario set." },
      { question: "Can scenarios be role-specific?", answer: "A pilot can focus on relevant workflows and pressure patterns without promising an unlimited authoring platform." },
      { question: "Will employees be individually ranked?", answer: "Reporting granularity should be agreed before the pilot. Cohort-level reporting can be used where individual-level analysis is not required." },
      { question: "Does this replace policy or technical controls?", answer: "No. CoMaSy is a training and measurement layer, not a substitute for technical security controls, policy or incident response." },
    ]}
  />;
}
