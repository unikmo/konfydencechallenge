import type { Metadata } from "next";
import { LockscreenIntentPage } from "@/components/LockscreenIntentPage";

export const metadata: Metadata = {
  title: { absolute: "Keep Staff Phishing-Aware Between Trainings | Konfydence Lockscreens" },
  description:
    "Annual phishing training fades within weeks. A rotating lock screen keeps one Pause · Assess · Talk prompt in front of employees every day, refreshed every two weeks as tactics change.",
  alternates: { canonical: "/lockscreens/phishing-awareness-between-trainings" },
  openGraph: {
    title: "Keep Staff Phishing-Aware Between Trainings | Konfydence",
    description: "The steady reminder that fills the months between training modules.",
    url: "https://konfydence.com/lockscreens/phishing-awareness-between-trainings",
    siteName: "Konfydence",
    type: "article",
  },
};

export default function Page() {
  return (
    <LockscreenIntentPage
      slug="phishing-awareness-between-trainings"
      breadcrumbName="Phishing awareness between trainings"
      eyebrow="BETWEEN THE TRAININGS"
      title="Phishing awareness that doesn't wear off by March."
      intro="You run the annual module. Completion hits 95%. Six weeks later the recall is gone and the next simulated phish still catches people. The gap isn't the training — it's the eleven months after it, when nothing is reinforcing the habit. A rotating lock screen sits in that gap: one short prompt on every device, every day, refreshed every two weeks."
      primaryCtaHref="/lockscreens/workplace/order"
      primaryCtaLabel="Get an instant quote"
      problemTitle="Awareness decays on a curve. Your programme is a single point on it."
      problemCopy="A course teaches the rule. Under pressure — an urgent payment, a spoofed supplier, a boss who needs it now — people don't recall a rule from months ago. They need the prompt close to the moment, and they need it often enough that pausing becomes reflex."
      sections={[
        {
          title: "Daily exposure, low effort",
          copy: "No new module to assign, no completion to chase. The prompt is just there on the lock screen, read in the two seconds before the device unlocks.",
        },
        {
          title: "Tracks current tactics",
          copy: "A new screen every fortnight, written around the pressure patterns showing up now — QR-code phishing, callback scams, AI voice, supplier-change fraud.",
        },
        {
          title: "Measure it if you want to",
          copy: "Pair the lock screen with a CoMaSy pilot to see whether the reinforced cohort changes defined decision signals — pause, verification, escalation — on varied scenarios.",
        },
      ]}
      howTitle="Reinforcement that runs on its own."
      howCopy="Konfydence writes and rotates the prompts. Your team deploys once through device management and leaves it running alongside whatever training platform you already use."
      howSteps={[
        "Buy a Workplace licence — $4 per employee per year, $300 minimum.",
        "Deploy the current screen through Intune, Jamf or Google Admin.",
        "Keep running your existing annual training and phishing simulations — this sits underneath them.",
        "Every two weeks the prompt changes to match what's actually landing in inboxes.",
      ]}
      faq={[
        {
          question: "Does this replace our phishing simulation platform?",
          answer:
            "No. Simulations test people; this reinforces them between tests. They work well together — the lock screen keeps the habit warm so simulation results improve over time.",
        },
        {
          question: "How is this better than a monthly awareness email?",
          answer:
            "An email is opened once, if at all. A lock screen is seen dozens of times a day and can't be left in an unread folder. It also reaches phones, where a lot of phishing now lands.",
        },
        {
          question: "What's the evidence a lock-screen prompt changes behaviour?",
          answer:
            "Konfydence doesn't claim outcome numbers it can't stand behind. What it offers is frequency at the point of decision. If you want measured behavioural signals, run a bounded CoMaSy pilot alongside it.",
        },
        {
          question: "How quickly can we start?",
          answer:
            "The Workplace order is self-serve — you get a licence, a purchase order and a deployment URL immediately, then set the policy in your MDM.",
        },
      ]}
      calloutTitle="Fill the eleven months your training doesn't cover."
    />
  );
}
