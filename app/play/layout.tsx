import type { Metadata } from "next";
import "./play.css";

export const metadata: Metadata = {
  title: { absolute: "Play with friends | Konfydence Challenge" },
  description:
    "Start a room, share the link, and play the same scam scenarios together — near or far. Running leaderboard, winner at the end.",
  alternates: {
    canonical: "/play",
    languages: { en: "https://konfydence.com/play", de: "https://konfydence.com/de/spielen" },
  },
  robots: { index: true, follow: true },
};

export default function PlayLayout({ children }: { children: React.ReactNode }) {
  return children;
}
