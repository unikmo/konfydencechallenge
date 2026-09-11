import { NextRequest, NextResponse } from "next/server";
import { handleChallengeStart } from "@/lib/challenge/startHandler";

export async function GET(request: NextRequest, props: { params: Promise<{ edition: string }> }): Promise<NextResponse> {
  const params = await props.params;
  return handleChallengeStart(request, params.edition ?? "", { basePath: "/challenge", lang: "en" });
}
