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

async function checkResend(): Promise<Result> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { state: "not_configured" };
  try {
    const res = await fetch("https://api.resend.com/domains", {
      headers: { Authorization: `Bearer ${key}` },
      cache: "no-store",
    });
    return res.ok ? { state: "ok", status: res.status } : { state: "failed", status: res.status };
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
  if (!key) return { state: "not_configured" };
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
    await verifyGitHubActionsOidc(request.headers.get("authorization"));
  } catch (error) {
    const reason = error instanceof Error && error.message.startsWith("github_oidc_")
      ? error.message
      : "github_oidc_verification_failed";
    return NextResponse.json({ error: "unauthorized", reason }, { status: 401 });
  }

  const [database, email, commerceShopify, commerceStripe] = await Promise.all([
    checkDatabase(),
    checkResend(),
    checkShopify(),
    checkStripe(),
  ]);

  const analytics: Result = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
    ? { state: "ok" }
    : { state: "not_configured" };

  const crm: Result = database.state === "ok"
    ? { state: "ok", detail: "CoMaSy CRM uses the shared PostgreSQL business records" }
    : { state: "failed", detail: "CRM_database_unavailable" };

  const cms: Result = { state: "not_applicable", detail: "No production CMS connector is used by this application" };

  return NextResponse.json(
    {
      ok: [database, crm].every((item) => item.state === "ok"),
      integrations: { database, crm, email, analytics, commerceShopify, commerceStripe, cms },
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
