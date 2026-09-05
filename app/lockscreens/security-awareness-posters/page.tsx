import type { Metadata } from "next";
import { LockscreenIntentPage } from "@/components/LockscreenIntentPage";

export const metadata: Metadata = {
  title: { absolute: "The Digital Alternative to Security Awareness Posters | Konfydence Lockscreens" },
  description:
    "Security awareness posters go stale on the wall and miss remote staff. A rotating lock screen puts one Pause · Assess · Talk prompt on every device and refreshes it every two weeks.",
  alternates: { canonical: "/lockscreens/security-awareness-posters" },
  openGraph: {
    title: "The Digital Alternative to Security Awareness Posters | Konfydence",
    description: "Reach every device, remote staff included — and change the message every fortnight.",
    url: "https://konfydence.com/lockscreens/security-awareness-posters",
    siteName: "Konfydence",
    type: "article",
  },
};

export default function Page() {
  return (
    <LockscreenIntentPage
      slug="security-awareness-posters"
      breadcrumbName="Security awareness posters"
      eyebrow="SECURITY AWARENESS POSTERS"
      title="A poster nobody has to walk past."
      intro="Security awareness posters have one job: keep the message visible between trainings. They struggle with it. They live on one wall, they don't reach anyone working from home, and once a poster has been up a month people stop registering it. A rotating lock screen does the same job on the surface everyone already looks at dozens of times a day — and the message changes every two weeks."
      primaryCtaHref="/lockscreens/workplace/order"
      primaryCtaLabel="Get an instant quote"
      heroImage={{
        src: "/lockscreens/workplace/desktop/41.png",
        alt: "A Konfydence desktop lock screen reading 'Your brain has 37 tabs open. Take two minutes away from the screen.'",
      }}
      problemTitle="The wall reaches whoever is in the office. Everyone else misses it."
      problemCopy="Hybrid and field staff never see the break-room poster. The people who do see it stop noticing it after a few weeks. And a printed poster can't respond when a new scam pattern starts hitting your sector — it says whatever it said when it went to print."
      sections={[
        {
          title: "On the device, not the wall",
          copy: "Phone and laptop lock screens are seen every time someone picks up or wakes a device — in the office, at home, on the move. Coverage doesn't depend on a commute.",
        },
        {
          title: "New message every fortnight",
          copy: "Instead of one message for a quarter, a fresh prompt every two weeks. Each makes a single point about a real pressure tactic and the move that stops it.",
        },
        {
          title: "Nothing to print, mount or replace",
          copy: "No design cycle, no print run, no walking round swapping frames. One licence, deployed through your device management, kept current by Konfydence.",
        },
      ]}
      howTitle="Same intent as a poster campaign. Less logistics."
      howCopy="You're not managing artwork or a print schedule. Konfydence writes and renders the screens; you point your fleet at them once."
      howSteps={[
        "Buy a Workplace licence — $4 per employee per year, $300 minimum.",
        "Deploy the current screen through Intune, Jamf or Google Admin.",
        "A new screen replaces it every two weeks, automatically.",
        "The wording tracks live scam patterns and the Pause · Assess · Talk method through the year.",
      ]}
      orgValue={{
        title: "Continuous awareness, not take-the-test-and-forget.",
        copy: "A poster campaign is a gesture towards continuous awareness that logistics keep undermining. A rotating lock screen delivers the same intent as an always-on control — and gives you a record of what ran and when.",
        points: [
          "Ongoing cyber-hygiene reinforcement — NIS2 (Article 21) expects awareness to be continuous and management bodies to oversee it. A rotating prompt is visible activity between formal trainings.",
          "Human risk management contribution — shifts awareness from a knowledge check to a habit cue at the moment of the decision, the point NIST and ISO/IEC 27001 controls emphasise.",
          "A light audit trail — the Workplace admin records the screen sequence and change dates, so you can show what was in front of staff across any review period.",
          "Reaches the whole workforce — company devices under MDM get the same prompt on the same schedule, remote and frontline staff included, with no completions to chase.",
        ],
        note: "Konfydence Lockscreens supports the human side of an awareness programme. It does not by itself make an organisation NIS2, ISO/IEC 27001 or otherwise compliant — the wider legal, governance and technical obligations remain the organisation's.",
      }}
      faq={[
        {
          question: "Can we still use physical posters alongside this?",
          answer:
            "Yes. Many teams keep a few printed pieces in shared spaces and use the lock screen for reach and freshness. The lock screen is the part that changes often and follows people off-site.",
        },
        {
          question: "How often does the message change?",
          answer:
            "Every two weeks. That's frequent enough to stay noticed, spaced enough that each prompt gets read properly before the next one lands.",
        },
        {
          question: "Do we get to choose or sequence the screens?",
          answer:
            "Yes. The Workplace admin lets you reorder the playlist and drop screens that don't fit your context, over the full library.",
        },
        {
          question: "How does it reach staff who work from home?",
          answer:
            "The screen is set by your device management policy on the company laptop or phone, wherever that device is. Remote staff get the same prompt on the same schedule as everyone else.",
        },
      ]}
      calloutTitle="Keep the message visible — everywhere, not just the office."
    />
  );
}
