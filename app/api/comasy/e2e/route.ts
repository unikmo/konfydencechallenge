import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashAccessCode } from "@/lib/comasyAuth";
import { verifyGitHubActionsOidc } from "@/lib/githubActionsOidc";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const ORG_ID = "e2e-org-a";
const COHORT_ID = "e2e-cohort-a";
const PARTICIPANT_ID = "e2e-participant-a1";
const PARTICIPANT_TOKEN = "e2e-token-a1";
const CAMPAIGN_ID = "e2e-http-a";
const SCENARIO_ID = "workplace-wrk-01";
const ACCESS_CODE = "E2E-Access-2026";

async function authorize(request: NextRequest) {
  await verifyGitHubActionsOidc(request.headers.get("authorization"));
}

export async function POST(request: NextRequest) {
  try {
    await authorize(request);
  } catch {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const action = request.nextUrl.searchParams.get("action");

  if (action === "cleanup") {
    await prisma.comasyOrganization.deleteMany({ where: { id: ORG_ID } });
    return NextResponse.json({ ok: true, cleaned: true }, { headers: { "Cache-Control": "no-store" } });
  }

  if (action !== "setup") {
    return NextResponse.json({ error: "invalid_action" }, { status: 400 });
  }

  const scenario = await prisma.scenario.findUnique({
    where: { id: SCENARIO_ID },
    select: { id: true, active: true, scored: true },
  });
  if (!scenario?.active || !scenario.scored) {
    return NextResponse.json({ error: "e2e_scenario_unavailable" }, { status: 503 });
  }

  const { hash, salt } = hashAccessCode(ACCESS_CODE);

  await prisma.$transaction(async (tx) => {
    await tx.comasyOrganization.deleteMany({ where: { id: ORG_ID } });

    await tx.comasyOrganization.create({
      data: {
        id: ORG_ID,
        name: "E2E Alpha GmbH",
        slug: "e2e-alpha",
        country: "DE",
        industry: "Release validation",
        stage: "PILOT_ACTIVE",
        customerHealth: "TEST",
        brandingName: "E2E Alpha",
        isDemo: true,
        accessCodeHash: hash,
        accessCodeSalt: salt,
      },
    });

    await tx.comasyCohort.create({
      data: {
        id: COHORT_ID,
        organizationId: ORG_ID,
        name: "Release cohort",
        department: "Security",
        role: "Release validation",
      },
    });

    await tx.comasyParticipant.create({
      data: {
        id: PARTICIPANT_ID,
        organizationId: ORG_ID,
        cohortId: COHORT_ID,
        firstName: "Release",
        lastName: "Validator",
        email: "e2e-release@invalid.example",
        department: "Security",
        role: "Release validation",
        status: "INVITED",
        accessToken: PARTICIPANT_TOKEN,
      },
    });

    await tx.comasyCampaign.create({
      data: {
        id: CAMPAIGN_ID,
        organizationId: ORG_ID,
        cohortId: COHORT_ID,
        name: "HTTP Release Practice",
        status: "ACTIVE",
        designation: "PRACTICE",
        roleFocus: "Release validation",
        hackFocus: "A",
        scenarioIds: SCENARIO_ID,
      },
    });
  });

  return NextResponse.json(
    { ok: true, organization: "e2e-alpha", participantToken: PARTICIPANT_TOKEN, campaignId: CAMPAIGN_ID },
    { headers: { "Cache-Control": "no-store" } },
  );
}
