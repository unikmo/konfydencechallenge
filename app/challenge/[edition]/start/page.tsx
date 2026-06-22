import { notFound, redirect } from "next/navigation";
import type { ChallengeEdition } from "@/lib/challenge/labels";
import { createPlaceholderUserAndSession } from "@/lib/challenge/startSessionUtil";
import { EDITION_LABELS } from "@/lib/challenge/labels";

const EDITIONS: Record<ChallengeEdition, { label: string }> = {
  travelsafe: { label: EDITION_LABELS.travelsafe },
  student: { label: EDITION_LABELS.student },
  workplace: { label: EDITION_LABELS.workplace },
  home: { label: EDITION_LABELS.home },
};


export function generateStaticParams() {
  return Object.keys(EDITIONS).map((edition) => ({ edition }));
}

// Avoid build-time prerendering failures when DB seed/import has not run yet.
export const dynamic = "force-dynamic";


export default async function StartEditionPage({
  params,
}: {
  params: { edition: string };
}) {
  const raw = (params.edition ?? "").toLowerCase();
  const edition = (Object.keys(EDITIONS) as ChallengeEdition[]).find((e) => e === raw);

  if (!edition) notFound();

  const { sessionId } = await createPlaceholderUserAndSession({ edition });

  redirect(`/challenge/session/${sessionId}`);
}
