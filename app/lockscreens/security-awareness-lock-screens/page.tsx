import type { Metadata } from "next";
import { LockscreenIntentPage } from "@/components/LockscreenIntentPage";

export const metadata: Metadata = {
  title: { absolute: "Security Awareness Lock Screens | Konfydence Lockscreens" },
  description:
    "A managed security awareness lock screen: one short Pause · Assess · Talk prompt on every device, refreshed every two weeks as scam patterns change. For workplaces, schools and families.",
  alternates: { canonical: "/lockscreens/security-awareness-lock-screens" },
  openGraph: {
    title: "Security Awareness Lock Screens | Konfydence",
    description: "The reminder where people actually see it — refreshed every two weeks, not a folder of wallpapers.",
    url: "https://konfydence.com/lockscreens/security-awareness-lock-screens",
    siteName: "Konfydence",
    type: "article",
  },
};

export default function Page() {
  return (
    <LockscreenIntentPage
      slug="security-awareness-lock-screens"
      breadcrumbName="Security awareness lock screens"
      eyebrow="SECURITY AWARENESS LOCK SCREENS"
      title="The security reminder people actually see."
      intro="Most security awareness lands in an inbox once a year and is gone by lunchtime. A lock screen puts one short prompt — Pause, Assess, Talk — in front of someone every time they pick up a phone or wake a laptop, in the seconds before they click, reply or pay. Konfydence writes the prompts, keeps them current, and delivers a fresh one every two weeks."
      primaryCtaHref="/lockscreens"
      primaryCtaLabel="See how it works"
      problemTitle="Awareness fades between trainings. Pressure doesn't wait for the next module."
      problemCopy="The risky moment is never a quiz question. It's an urgent invoice, a text from a courier, a message from a boss who sounds off. A lock screen sits exactly there — on the device, at the moment of the decision — instead of in a course completed months ago."
      sections={[
        {
          title: "One prompt, not a poster wall",
          copy: "Each screen makes a single point in plain language and shows the H.A.C.K. pressure pattern behind it. No clutter, no logo soup, nothing to dismiss.",
        },
        {
          title: "Refreshed every two weeks",
          copy: "Scam tactics move. The wording moves with them. A new screen lands fortnightly so the reminder never becomes wallpaper people stop seeing.",
        },
        {
          title: "Every device, the right format",
          copy: "Phone, tablet, laptop and desktop each get a render sized for that screen — pushed through your device management, or installed in under a minute at home.",
        },
      ]}
      howTitle="A service, not a ZIP of images."
      howCopy="You don't manage a library of files or chase people to update their wallpaper. Konfydence keeps the current screen current; you point your fleet — or your family — at it once."
      howSteps={[
        "Choose your tier — Workplace, Schools, or Home — and get a licence.",
        "Deploy the current screen: through Intune, Jamf or Google Admin for a fleet, or a one-minute install at home.",
        "Every two weeks a new screen replaces it automatically. No re-deploy, no reminder emails.",
        "The wording tracks live scam patterns and the Pause · Assess · Talk method all year.",
      ]}
      faq={[
        {
          question: "How is this different from security awareness posters?",
          answer:
            "Posters are static and quickly become invisible. A lock screen is seen dozens of times a day, changes every two weeks, and reaches remote and mobile staff who never walk past an office wall.",
        },
        {
          question: "Does it replace security awareness training?",
          answer:
            "No. It fills the gap between trainings — a steady, low-effort reminder at the moment of the decision. It pairs with a CoMaSy pilot when you also want to measure how people decide.",
        },
        {
          question: "How does it reach managed devices?",
          answer:
            "The current screen resolves from a single stable URL, so Microsoft Intune, Jamf Pro and the Google Admin console can all point a lock-screen or wallpaper policy at it and pick up each fortnightly change automatically.",
        },
        {
          question: "What does it cost?",
          answer:
            "Workplace is $4 per employee per year ($300 minimum). Schools are $2 per managed computer per year. Home is $19.99 the first year, then $14.99 a year. See the Lockscreens page for details.",
        },
      ]}
      calloutTitle="Put the reminder where the decision happens."
    />
  );
}
