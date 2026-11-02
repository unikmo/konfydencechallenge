import type { Metadata } from "next";
import TeamJoinView from "@/app/teams/join/JoinView";

export const metadata: Metadata = {
  title: { absolute: "Eurem Team beitreten | Konfydence" },
  description: "Übernimm deinen Teamplatz für die Konfydence Challenge.",
  alternates: { languages: { en: "https://konfydence.com/teams/join", de: "https://konfydence.com/de/teams/join" } },
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function TeamBeitrittPage(props: { searchParams: Promise<{ code?: string; err?: string }> }) {
  return <TeamJoinView searchParams={props.searchParams} lang="de" />;
}
