import type { Metadata } from "next";
import TeamJoinView from "./JoinView";

export const metadata: Metadata = {
  title: { absolute: "Join your team | Konfydence" },
  description: "Claim your Konfydence Challenge team seat.",
  alternates: { languages: { en: "https://konfydence.com/teams/join", de: "https://konfydence.com/de/teams/join" } },
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function TeamJoinPage(props: { searchParams: Promise<{ code?: string; err?: string }> }) {
  return <TeamJoinView searchParams={props.searchParams} lang="en" />;
}
