import { NextRequest, NextResponse } from "next/server";
import { handleChallengeStart } from "@/lib/challenge/startHandler";

// Only editions with a seeded German scenario bank so far (Stage 4, in
// progress) — see data/scenarios-de/README.md. The rest redirect back to
// the German challenge landing with a "not yet" flag rather than silently
// dropping the player into an English deck.
const GERMAN_EDITIONS = new Set(["family", "school", "university"]);

export async function GET(request: NextRequest, props: { params: Promise<{ edition: string }> }): Promise<NextResponse> {
  const params = await props.params;
  const edition = (params.edition ?? "").toLowerCase();

  if (!GERMAN_EDITIONS.has(edition)) {
    return NextResponse.redirect(new URL(`/de/challenge?bald=${edition}`, request.url));
  }

  return handleChallengeStart(request, edition, { basePath: "/de/challenge", lang: "de" });
}
