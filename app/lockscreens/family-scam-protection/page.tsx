import type { Metadata } from "next";
import { LockscreenIntentPage } from "@/components/LockscreenIntentPage";

export const metadata: Metadata = {
  title: { absolute: "A Scam-Warning Lock Screen for the Family | Konfydence Lockscreens" },
  description:
    "A calm anti-scam reminder on a parent's or teenager's phone. One Pause · Assess · Talk prompt on the lock screen, refreshed every two weeks — no app, no nagging.",
  alternates: { canonical: "/lockscreens/family-scam-protection" },
  openGraph: {
    title: "A Scam-Warning Lock Screen for the Family | Konfydence",
    description: "The reminder that's there when the scam text arrives — without you having to send it.",
    url: "https://konfydence.com/lockscreens/family-scam-protection",
    siteName: "Konfydence",
    type: "article",
  },
};

export default function Page() {
  return (
    <LockscreenIntentPage
      slug="family-scam-protection"
      breadcrumbName="Family scam protection"
      eyebrow="HOME & TEEN"
      title="The scam reminder that's already on their phone."
      intro="You can't be there when the fake courier text arrives, or the message from a friend's hacked account, or the call that says the bank account is compromised. But a lock screen can. Konfydence puts one calm prompt — Pause, Assess, Talk — on a parent's or teenager's phone, and quietly swaps it for a new one every two weeks."
      primaryCtaHref="/contact?topic=lockscreens-home"
      primaryCtaLabel="Get early access"
      problemTitle="The people you worry about won't install another app or read another forwarded article."
      problemCopy="Warnings from a worried adult child get tuned out. Security apps get ignored or uninstalled. A lock screen asks nothing of anyone — it's just there, in the half-second before the phone unlocks, saying the one thing that matters: stop and check before you act."
      sections={[
        {
          title: "For a parent who keeps getting targeted",
          copy: "Prompts written for the scams that hit older adults hardest — bank-impersonation calls, 'family member in trouble' messages, refund and tech-support cons.",
        },
        {
          title: "For a teenager's phone",
          copy: "A separate set for gaming, social and peer-pressure scams — account 'boosts', fake giveaways, sextortion, deepfake and voice-clone tricks — in language a teenager won't roll their eyes at.",
        },
        {
          title: "No app, no tracking, no nagging",
          copy: "It's a wallpaper image, set once. It doesn't monitor anything, doesn't send notifications, and doesn't report back. It just changes every fortnight.",
        },
      ]}
      howTitle="Set it once. It keeps itself current."
      howCopy="You install the first screen in about a minute. After that, a new one is ready every two weeks — one tap to update, or leave it and the reminder simply refreshes."
      howSteps={[
        "Choose Home or Teen Home and check out on konfydence.com.",
        "Open the link on the phone you're protecting and save the current screen as the wallpaper — short, guided steps for iPhone and Android.",
        "Every two weeks, 'Your next Konfydence screen is ready.' One tap to refresh.",
        "The wording tracks the scams that are actually circulating, all year.",
      ]}
      faq={[
        {
          question: "Does this need an app or a subscription to a service?",
          answer:
            "No app. It's a lock-screen image you set like any wallpaper. It's an annual plan — $19.99 the first year, then $14.99 a year — which keeps the fortnightly updates and the full prompt set coming.",
        },
        {
          question: "Can I set it up on my parent's phone remotely?",
          answer:
            "You'll need the phone once to set the first wallpaper, or to walk them through it on a call. After that the refresh is a single tap they can do themselves, or you can do on a visit.",
        },
        {
          question: "Is the teenager version actually different?",
          answer:
            "Yes — a different 27-screen set covering the scams aimed at younger people: fake in-game currency, 'expose' apps, grooming and isolation tactics, deepfake and voice-clone messages.",
        },
        {
          question: "Does it track location or activity?",
          answer:
            "No. It's a static image. It doesn't monitor the phone, doesn't send notifications and doesn't report anything back to you or to Konfydence.",
        },
      ]}
      calloutTitle="Put the reminder where they'll see it — without being the one who nags."
    />
  );
}
