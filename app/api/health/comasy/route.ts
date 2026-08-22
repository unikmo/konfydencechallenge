import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const releaseSha = process.env.VERCEL_GIT_COMMIT_SHA || process.env.GITHUB_SHA || "unknown";

export async function GET() {
  try {
    const [organizations, campaigns, participants, responses, scenarioProfiles] = await Promise.all([
      prisma.comasyOrganization.count(),
      prisma.comasyCampaign.count(),
      prisma.comasyParticipant.count(),
      prisma.comasyResponse.count(),
      prisma.comasyScenarioProfile.count(),
    ]);

    return NextResponse.json(
      {
        ready: true,
        database: "available",
        schema: "comasy_v1",
        releaseSha,
        counts: {
          organizations,
          campaigns,
          participants,
          responses,
          scenarioProfiles,
        },
      },
      { status: 200, headers: { "Cache-Control": "no-store, max-age=0" } },
    );
  } catch {
    return NextResponse.json(
      {
        ready: false,
        database: "unavailable",
        schema: "comasy_v1",
        releaseSha,
        error: "comasy_backend_unavailable",
      },
      { status: 503, headers: { "Cache-Control": "no-store, max-age=0" } },
    );
  }
}
