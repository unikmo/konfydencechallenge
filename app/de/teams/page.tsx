import type { Metadata } from "next";
import TeamsView from "@/app/teams/TeamsView";

export const metadata: Metadata = {
  title: { absolute: "Euer Team | Konfydence" },
  description: "Verwaltet euer Konfydence-Challenge-Team: Plätze, Einladungen und Fortschritt.",
  alternates: { languages: { en: "https://konfydence.com/teams", de: "https://konfydence.com/de/teams" } },
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function TeamsSeiteDe(props: { searchParams: Promise<{ welcome?: string; joined?: string }> }) {
  return <TeamsView searchParams={props.searchParams} lang="de" />;
}
