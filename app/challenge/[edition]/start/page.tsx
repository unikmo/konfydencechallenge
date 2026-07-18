import { notFound, redirect } from "next/navigation";
import { cookies } from "next/headers";
import type { ChallengeEdition } from "@/lib/challenge/labels";
import { createPlaceholderUserAndSession } from "@/lib/challenge/startSessionUtil";
import { EDITION_LABELS } from "@/lib/challenge/labels";
import type { ChallengeMode } from "@/lib/challenge/sessionGenerator";
import { prisma } from "@/lib/prisma";

const EDITIONS: Record<ChallengeEdition, { label: string }> = {
  travelsafe: { label: EDITION_LABELS.travelsafe },
  university: { label: EDITION_LABELS.university },
  workplace: { label: EDITION_LABELS.workplace },
  school: { label: EDITION_LABELS.school },
  family: { label: EDITION_LABELS.family },
};


export function generateStaticParams() {
  return Object.keys(EDITIONS).map((edition) => ({ edition }));
}

// Avoid build-time prerendering failures when DB seed/import has not run yet.
export const dynamic = "force-dynamic";


export default async function StartEditionPage({
  params,
  searchParams,
}: {
  params: { edition: string };
  searchParams: { mode?: string };
}) {
  const raw = (params.edition ?? "").toLowerCase();
  const edition = (Object.keys(EDITIONS) as ChallengeEdition[]).find((e) => e === raw);

  if (!edition) notFound();

  // ?mode=diagnostic selects the free 10-question readiness check; defaults to the full deck.
  let mode: ChallengeMode = searchParams.mode === "diagnostic" ? "diagnostic" : "full";

  // Check entitlements for full mode access
  if (mode === "full") {
    const cookieStore = await cookies();
    const kfUid = cookieStore.get("kf_uid")?.value;

    if (kfUid) {
      const user = await prisma.user.findUnique({
        where: { id: kfUid },
        include: {
          entitlements: {
            where: { status: "active" },
          },
        },
      });

      if (user && user.entitlements && user.entitlements.length > 0) {
        // Check if user has unlimited or this specific edition
        const hasAccess = user.entitlements.some(
          (e) =>
            e.tier === "unlimited" ||
            (e.tier === "single" && e.edition === edition)
        );

        if (!hasAccess) {
          // User has entitlements but not for this edition - redirect to pricing
          redirect(`/pricing?edition=${edition}`);
        }
        // If they have access, proceed with full mode
      } else {
        // No entitlements found - gate access, redirect to pricing
        redirect(`/pricing?edition=${edition}`);
      }
    } else {
      // No cookie - gate access, redirect to pricing
      redirect(`/pricing?edition=${edition}`);
    }
  }

  const { sessionId } = await createPlaceholderUserAndSession({ edition, mode });

  redirect(`/challenge/session/${sessionId}`);
}
