import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyGitHubActionsOidc } from "@/lib/githubActionsOidc";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

type IntegrationState = "ok" | "failed" | "not_configured" | "not_applicable";

type Result = {
  state: IntegrationState;
  status?: number;
  detail?: string;
};

async function checkDatabase(): Promise<Result> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { state: "ok" };
  } catch {
    return { state: "failed", detail: "database_query_failed" };
  }
}

async function checkCrmWrite(): Promise<Result> {
  const token = randomUUID().replaceAll("-", "");
  const orgId = `qa-org-${token}`;
  const slug = `qa-live-${token}`;
  try {
    await prisma.comasyOrganization.create({
      data: {
        id: orgId,
        name: "QA Live Acceptance",
        slug,
        source: "independent-qa",
        persona: "QA",
        stage: "TARGET_ACCOUNT",
        customerHealth: "TEST",
        isDemo: true,
      },
    });
    const lead = await prisma.comasyLead.create({
      data: {
        organizationId: orgId,
        firstName: "QA",
        lastName: "Agent",
        workEmail: "qa-live-acceptance@invalid.example",
        organizationName: "QA Live Acceptance",
        role: "Independent QA",
        organizationSize: "test",
        primaryObjective: "production acceptance",
        source: "independent-qa",
        landingPage: "/comasy/pilot",
        status: "QA_PROBE",
      },
    });
    const activity = await prisma.comasyActivity.create({
      data: {
        organizationId: orgId,
        type: "qa_lead_probe",
        source: "independent-qa",
        page: "/comasy/pilot",
        persona: "QA",
      },
    });
    const persisted = await prisma.comasyLead.count({ where: { id: lead.id, organizationId: orgId } });
    await prisma.comasyActivity.deleteMany({ where: { id: activity.id } });
    await prisma.comasyLead.deleteMany({ where: { id: lead.id } });
    await prisma.comasyOrganization.deleteMany({ where: { id: orgId } });
    return persisted === 1 ? { state: "ok", detail: "synthetic_lead_persisted_and_cleaned" } : { state: "failed", detail: "synthetic_lead_not_persisted" };
  } catch {
    await prisma.comasyActivity.deleteMany({ where: { organizationId: orgId } }).catch(() => undefined);
    await prisma.comasyLead.deleteMany({ where: { organizationId: orgId } }).catch(() => undefined);
    await prisma.comasyOrganization.deleteMany({ where: { id: orgId } }).catch(() => undefined);
    return { state: "failed", detail: "crm_write_probe_failed" };
  }
}

async function checkResend(): Promise<Result> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!key || !from) return { state: "not_configured" };
  try {
    const auth = await fetch("https://api.resend.com/domains", {
      headers: { Authorization: `Bearer ${key}` },
      cache: "no-store",
    });
    if (!auth.ok) return { state: "failed", status: auth.status, detail: "resend_auth_failed" };

    const send = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: "delivered@resend.dev",
        subject: "Konfydence production QA probe",
        html: "<p>Automated production integration probe. No action required.</p>",
      }),
      cache: "no-store",
    });
    return send.ok ? { state: "ok", status: send.status, detail: "resend_test_delivery_accepted" } : { state: "failed", status: send.status, detail: "resend_test_delivery_rejected" };
  } catch {
    return { state: "failed", detail: "resend_network_failed" };
  }
}

async function checkShopify(): Promise<Result> {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  if (!domain || !token) return { state: "not_configured" };
  try {
    const res = await fetch(`https://${domain}/api/2025-07/graphql.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": token,
      },
      body: JSON.stringify({ query: "{ shop { name } }" }),
      cache: "no-store",
    });
    return res.ok ? { state: "ok", status: res.status } : { state: "failed", status: res.status };
  } catch {
    return { state: "failed", detail: "shopify_network_failed" };
  }
}

async function checkStripe(): Promise<Result> {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return { state: "not_applicable", detail: "Current commerce checkout uses Shopify" };
  try {
    const res = await fetch("https://api.stripe.com/v1/account", {
      headers: { Authorization: `Bearer ${key}` },
      cache: "no-store",
    });
    return res.ok ? { state: "ok", status: res.status } : { state: "failed", status: res.status };
  } catch {
    return { state: "failed", detail: "stripe_network_failed" };
  }
}

export async function POST(request: NextRequest) {
  try {
    await verifyGitHubActionsOidc(request.headers.get("authorization"), {
      allowedEvents: ["push", "schedule", "workflow_dispatch"],
    });
  } catch (error) {
    const reason = error instanceof Error && error.message.startsWith("github_oidc_")
      ? error.message
      : "github_oidc_verification_failed";
    return NextResponse.json({ error: "unauthorized", reason }, { status: 401 });
  }

  const [database, crm, email, commerceShopify, commerceStripe] = await Promise.all([
    checkDatabase(),
    checkCrmWrite(),
    checkResend(),
    checkShopify(),
    checkStripe(),
  ]);

  const analytics: Result = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
    ? { state: "ok" }
    : { state: "not_configured" };

  const cms: Result = { state: "not_applicable", detail: "No production CMS connector is used by this application" };
  const required = [database, crm, email, analytics, commerceShopify];

  return NextResponse.json(
    {
      ok: required.every((item) => item.state === "ok"),
      integrations: { database, crm, email, analytics, commerceShopify, commerceStripe, cms },
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
