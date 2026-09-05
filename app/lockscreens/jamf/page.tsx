import type { Metadata } from "next";
import { LockscreenIntentPage } from "@/components/LockscreenIntentPage";

export const metadata: Metadata = {
  title: { absolute: "Security Awareness Lock Screen for Jamf-Managed Macs & iPads | Konfydence Lockscreens" },
  description:
    "A rotating security awareness lock screen for Apple fleets managed with Jamf Pro or Jamf School. One configuration profile, a fresh Pause · Assess · Talk prompt every two weeks.",
  alternates: { canonical: "/lockscreens/jamf" },
  openGraph: {
    title: "Security Awareness Lock Screen for Jamf | Konfydence",
    description: "Deploy once with a Jamf profile; the message stays current all year.",
    url: "https://konfydence.com/lockscreens/jamf",
    siteName: "Konfydence",
    type: "article",
  },
};

export default function Page() {
  return (
    <LockscreenIntentPage
      slug="jamf"
      breadcrumbName="Jamf"
      eyebrow="JAMF PRO / JAMF SCHOOL"
      title="A security awareness lock screen for your Apple fleet."
      intro="Jamf can set a lock-screen message and a wallpaper on Macs, iPads and iPhones. What it can't do is keep that message from going stale. Konfydence supplies the content — one clear prompt about how scams apply pressure — and rotates it every two weeks, so your Jamf profile keeps working long after you deployed it."
      primaryCtaHref="/lockscreens/workplace/order"
      primaryCtaLabel="Get an instant quote"
      heroImage={{
        src: "/lockscreens/workplace/tablet-landscape/18.png",
        alt: "A Konfydence iPad lock screen reading 'You clicked it. Report it fast. Hiding it only helps the attacker.'",
      }}
      problemTitle="A static lock-screen message is read once and never again."
      problemCopy="Jamf's Login Window and lock-screen footer text, or a pushed wallpaper, are easy to set and easy to tune out. The reminder only keeps its value if the wording changes and actually says something — about the urgency, the false authority, the rushed hand-off that a real scam uses."
      sections={[
        {
          title: "macOS and iPadOS renders",
          copy: "Notebook 16:10 for MacBooks, tablet landscape and portrait for iPad. Each screen is sized for the device so text stays legible behind the clock and controls.",
        },
        {
          title: "Rotates without a re-push",
          copy: "Point the wallpaper policy at the Konfydence resolver URL. The image behind it changes every fortnight; managed devices pick it up on their next check-in.",
        },
        {
          title: "Built for schools too",
          copy: "Jamf School fleets get the same service at the Schools rate — $2 per managed computer per year — with wording pitched for a student device.",
        },
      ]}
      howTitle="One profile, then Konfydence keeps it fresh."
      howCopy="You manage the Jamf policy; Konfydence manages the content calendar and the renders. The URL never changes, so the profile never needs revisiting."
      howSteps={[
        "Buy a Workplace or Schools licence.",
        "In Jamf Pro or Jamf School, add a Wallpaper payload (or a lock-screen image policy) pointing at the Konfydence resolver URL.",
        "Scope it to your Mac and iPad groups.",
        "Every two weeks the served image changes — no new package, no re-scope.",
      ]}
      orgValue={{
        title: "Continuous awareness, not take-the-test-and-forget.",
        copy: "One Jamf profile turns awareness into an ongoing control instead of a completion date. A prompt that changes every fortnight, on every managed Mac and iPad, is visible evidence of activity between formal trainings.",
        points: [
          "Ongoing cyber-hygiene reinforcement — NIS2 (Article 21) expects awareness to be continuous and management bodies to oversee it. A rotating prompt is visible activity between formal trainings.",
          "Human risk management contribution — shifts awareness from a knowledge check to a habit cue at the moment of the decision, the point NIST and ISO/IEC 27001 controls emphasise.",
          "A light audit trail — the Workplace admin records the screen sequence and change dates, so you can show what was in front of staff across any review period.",
          "Reaches the whole fleet — every device in your Jamf scope gets the same prompt on the same schedule, remote and frontline staff included, with no completions to chase.",
        ],
        note: "Konfydence Lockscreens supports the human side of an awareness programme. It does not by itself make an organisation NIS2, ISO/IEC 27001 or otherwise compliant — the wider legal, governance and technical obligations remain the organisation's.",
      }}
      faq={[
        {
          question: "Does this use the Jamf lock-screen message or a wallpaper?",
          answer:
            "A wallpaper / lock-screen image, pointed at a stable URL. It carries a full designed prompt rather than a line of footer text, so the message has room to make its point.",
        },
        {
          question: "Will the fortnightly change reach devices automatically?",
          answer:
            "Yes. The resolver URL is fixed; only the image changes. Devices fetch the current image on their normal Jamf check-in, so no manual re-deployment is needed.",
        },
        {
          question: "Can we run it on a mixed Mac and Windows fleet?",
          answer:
            "Yes. Windows devices under Intune and Apple devices under Jamf can both point at the same resolver, each getting a correctly-sized render for the platform.",
        },
        {
          question: "Is there a version for student iPads?",
          answer:
            "Yes — the Schools tier uses the same delivery with prompts written for a student's device, covering gaming, social and peer-pressure scams alongside the classics.",
        },
      ]}
      calloutTitle="Deploy it once in Jamf. Keep the message alive all year."
    />
  );
}
