import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const releaseSha = process.env.VERCEL_GIT_COMMIT_SHA || process.env.GITHUB_SHA || "unknown";
const noStore = { "Cache-Control": "no-store, max-age=0" };

export async function GET() {
  // Stage 1: prove that the configured Postgres endpoint is reachable.
  try {
    await prisma.$queryRaw<Array<{ ok: number }>>`SELECT 1::int AS ok`;
  } catch {
    return NextResponse.json(
      {
        ready: false,
        database: "unavailable",
        schema: "unknown",
        releaseSha,
        error: "database_unreachable",
      },
      { status: 503, headers: noStore },
    );
  }

  // Stage 2: prove that this is the CoMaSy database, without exposing any
  // connection details or raw database errors.
  try {
    const tables = await prisma.$queryRaw<Array<{ organizations: string | null; campaigns: string | null; participants: string | null; responses: string | null }>>`
      SELECT
        to_regclass('public."ComasyOrganization"')::text AS organizations,
        to_regclass('public."ComasyCampaign"')::text AS campaigns,
        to_regclass('public."ComasyParticipant"')::text AS participants,
        to_regclass('public."ComasyResponse"')::text AS responses
    `;
    const schema = tables[0];
    const schemaReady = Boolean(
      schema?.organizations &&
      schema?.campaigns &&
      schema?.participants &&
      schema?.responses,
    );

    if (!schemaReady) {
      return NextResponse.json(
        {
          ready: false,
          database: "available",
          schema: "missing",
          releaseSha,
          error: "comasy_schema_missing",
        },
        { status: 503, headers: noStore },
      );
    }
  } catch {
    return NextResponse.json(
      {
        ready: false,
        database: "available",
        schema: "unknown",
        releaseSha,
        error: "schema_check_failed",
      },
      { status: 503, headers: noStore },
    );
  }

  // Stage 3: verify that Prisma can actually read the operational CoMaSy
  // models from that schema.
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
      { status: 200, headers: noStore },
    );
  } catch {
    return NextResponse.json(
      {
        ready: false,
        database: "available",
        schema: "comasy_v1",
        releaseSha,
        error: "comasy_query_failed",
      },
      { status: 503, headers: noStore },
    );
  }
}
