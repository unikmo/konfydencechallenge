import { NextRequest, NextResponse } from "next/server";
import { handleChallengeStart } from "@/lib/challenge/startHandler";

// Stage 4 complete (2026-09-12): every edition now has a seeded German
// scenario bank — see data/scenarios-de/README.md. Kept as an explicit
// allow-list (not just "any valid edition") so a sixth edition added later
// defaults to English-only until its German deck actually ships.
const GERMAN_EDITIONS = new Set(["family", "school", "university", "travelsafe", "workplace"]);

export async function GET(request: NextRequest, props: { params: Promise<{ edition: string }> }): Promise<NextResponse> {
  const params = await props.params;
  const edition = (params.edition ?? "").toLowerCase();

  if (!GERMAN_EDITIONS.has(edition)) {
    return NextResponse.redirect(new URL(`/de/challenge?bald=${edition}`, request.url));
  }

  return handleChallengeStart(request, edition, { basePath: "/de/challenge", lang: "de" });
}
