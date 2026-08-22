import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashAccessCode, hasUsableCustomerSessionSecret } from "@/lib/comasyAuth";
import { verifyGitHubActionsOidc } from "@/lib/githubActionsOidc";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const ORG_ID = "e2e-org-a";
const COHORT_ID = "e2e-cohort-a";
const PARTICIPANT_ID = "e2e-participant-a1";
const PARTICIPANT_TOKEN = "e2e-token-a1";
const CAMPAIGN_ID = "e2e-http-a";
const SCENARIO_EXTERNAL_ID = "workplace-wrk-01";
const ACCESS_CODE = "E2E-Access-2026";

async function authorize(request: NextRequest) {
  await verifyGitHubActionsOidc(request.headers.get("authorization"));
}

async function scenarioVisibilityReason() {
  try {
    const [row] = await prisma.$queryRaw<Array<{
      visible_scored: number;
      supabase: boolean;
      bypass_rls: boolean;
    }>>`
      SELECT
        (SELECT COUNT(*)::int FROM "Scenario" WHERE active = true AND scored = true) AS visible_scored,
        (
          EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')
          AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'storage')
        ) AS supabase,
        COALESCE(
          (SELECT rolbypassrls FROM pg_roles WHERE rolname = current_user),
          false
        ) AS bypass_rls
    `;

    return `scenario_visibility_${row?.visible_scored ?? 0}_supabase_${row?.supabase ? 1 : 0}_bypass_${row?.bypass_rls ? 1 : 0}`;
  } catch {
    return "scenario_visibility_diagnostic_failed";
  }
}

export async function POST(request: NextRequest) {
  try {
    await authorize(request);
  } catch (error) {
    const reason = error instanceof Error && error.message.startsWith("github_oidc_")
      ? error.message
      : "github_oidc_verification_failed";
    return NextResponse.json({ error: "unauthorized", reason }, { status: 401 });
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
    where: { externalId: SCENARIO_EXTERNAL_ID },
    select: { id: true, externalId: true, active: true, scored: true },
  });
  if (!scenario?.active || !scenario.scored) {
    return NextResponse.json(
      {
        error: "e2e_scenario_unavailable",
        reason: await scenarioVisibilityReason(),
      },
      { status: 503 },
    );
  }

  const { hash, salt } = hashAccessCode(ACCESS_CODE);

  try {
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
          scenarioIds: scenario.id,
        },
      });
    });
  } catch {
    return NextResponse.json({ error: "e2e_fixture_setup_failed" }, { status: 500 });
  }

  const authConfigured = hasUsableCustomerSessionSecret();

  return NextResponse.json(
    {
      ok: true,
      reason: `fixture_ready_auth_${authConfigured ? 1 : 0}`,
      authConfigured,
      organization: "e2e-alpha",
      participantToken: PARTICIPANT_TOKEN,
      campaignId: CAMPAIGN_ID,
      scenarioId: scenario.id,
      scenarioExternalId: scenario.externalId,
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
