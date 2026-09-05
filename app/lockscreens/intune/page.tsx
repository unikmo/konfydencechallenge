import type { Metadata } from "next";
import { LockscreenIntentPage } from "@/components/LockscreenIntentPage";

export const metadata: Metadata = {
  title: { absolute: "Security Awareness Wallpaper for Microsoft Intune | Konfydence Lockscreens" },
  description:
    "Deploy a rotating security awareness lock screen and desktop wallpaper through Microsoft Intune. One policy, one URL, a fresh Pause · Assess · Talk prompt every two weeks — no re-deploy.",
  alternates: { canonical: "/lockscreens/intune" },
  openGraph: {
    title: "Security Awareness Wallpaper for Microsoft Intune | Konfydence",
    description: "Point an Intune wallpaper policy at one URL and it stays current all year.",
    url: "https://konfydence.com/lockscreens/intune",
    siteName: "Konfydence",
    type: "article",
  },
};

export default function Page() {
  return (
    <LockscreenIntentPage
      slug="intune"
      breadcrumbName="Microsoft Intune"
      eyebrow="MICROSOFT INTUNE"
      title="Security awareness wallpaper you set once in Intune."
      intro="You can already push a desktop wallpaper and a lock-screen image with Intune. The problem is keeping it worth looking at — a static image goes stale, and re-packaging a new one every fortnight is a job nobody wants. Konfydence gives you one stable URL that always resolves to the current screen, so your Intune policy stays fresh without you touching it again."
      primaryCtaHref="/lockscreens/workplace/order"
      primaryCtaLabel="Get an instant quote"
      heroImage={{
        src: "/lockscreens/workplace/desktop/05.png",
        alt: "A Konfydence desktop lock screen reading 'New bank details. Same supplier. Call the number already on file.'",
      }}
      problemTitle="A wallpaper you deployed in March is invisible by May."
      problemCopy="Windows devices under Intune take a Personalization CSP wallpaper and lock-screen image. Set it and forget it, and staff stop seeing it within weeks. The value is in the message changing — and in it saying something specific about how scams pressure people, not just a policy line."
      sections={[
        {
          title: "One URL, always current",
          copy: "The current screen resolves from a single Konfydence URL. Set DesktopImageUrl and LockScreenImageUrl once; every fortnightly change is picked up on the device's next sync.",
        },
        {
          title: "Windows, sized right",
          copy: "The Windows render is built for 16:9 desktop and lock screens. Notebook and tablet formats are available for mixed fleets managed the same way.",
        },
        {
          title: "A message, not a mandate",
          copy: "Each screen makes one plain-language point about a real pressure tactic — urgency, false authority, misplaced trust, a rushed hand-off — and the move that defuses it.",
        },
      ]}
      howTitle="Two policy settings, then it runs itself."
      howCopy="Konfydence handles the content calendar and the renders. Your Intune configuration profile points at the resolver URL and never needs revisiting."
      howSteps={[
        "Buy a Workplace licence — $4 per employee per year, $300 minimum.",
        "In Intune, create a Device Restrictions or Settings Catalog profile with the Personalization lock-screen and desktop image URLs Konfydence gives you.",
        "Assign it to your Windows device group.",
        "Every two weeks the image at that URL changes. Devices pick it up on sync — no new profile, no re-assignment.",
      ]}
      orgValue={{
        title: "Continuous awareness, not take-the-test-and-forget.",
        copy: "The reason to run this through Intune isn't the wallpaper — it's that awareness becomes an ongoing control instead of a completion date. A prompt that changes every fortnight, on every managed device, is visible evidence of activity between formal trainings.",
        points: [
          "Ongoing cyber-hygiene reinforcement — NIS2 (Article 21) expects awareness to be continuous and management bodies to oversee it. A rotating prompt is visible activity between formal trainings.",
          "Human risk management contribution — shifts awareness from a knowledge check to a habit cue at the moment of the decision, the point NIST and ISO/IEC 27001 controls emphasise.",
          "A light audit trail — the Workplace admin records the screen sequence and change dates, so you can show what was in front of staff across any review period.",
          "Reaches the whole workforce — every device in your Intune group gets the same prompt on the same schedule, remote and frontline staff included, with no completions to chase.",
        ],
        note: "Konfydence Lockscreens supports the human side of an awareness programme. It does not by itself make an organisation NIS2, ISO/IEC 27001 or otherwise compliant — the wider legal, governance and technical obligations remain the organisation's.",
      }}
      faq={[
        {
          question: "Which Intune setting does this use?",
          answer:
            "The Personalization CSP — DesktopImageUrl and LockScreenImageUrl — available through a Settings Catalog or Device Restrictions profile on Windows 10/11 Enterprise and Education. Konfydence provides the exact URL to paste in.",
        },
        {
          question: "Do I have to re-deploy when the screen changes?",
          answer:
            "No. The URL is stable; only the image it serves changes. Devices fetch the current image on their normal Intune sync, so the fortnightly refresh is automatic.",
        },
        {
          question: "Does it work for macOS or ChromeOS devices too?",
          answer:
            "Yes. macOS managed by Jamf or Intune and ChromeOS via the Google Admin console can point at the same resolver with their own wallpaper policy. Each platform gets a correctly-sized render.",
        },
        {
          question: "Can we see the full set of screens before buying?",
          answer:
            "Yes — request a quote and we'll share the current library and the upcoming content calendar so you can check tone and coverage against your policy.",
        },
      ]}
      calloutTitle="Set the policy once. Let the message stay current."
    />
  );
}
