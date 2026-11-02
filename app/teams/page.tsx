import type { Metadata } from "next";
import TeamsView from "./TeamsView";

export const metadata: Metadata = {
  title: { absolute: "Your team | Konfydence" },
  description: "Manage your Konfydence Challenge team — seats, invites and completion.",
  alternates: { languages: { en: "https://konfydence.com/teams", de: "https://konfydence.com/de/teams" } },
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function TeamsPage(props: { searchParams: Promise<{ welcome?: string; joined?: string }> }) {
  return <TeamsView searchParams={props.searchParams} lang="en" />;
}
