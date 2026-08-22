import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCustomerOrganizationId } from "@/lib/comasyAuth";
import { getOrganizationMetrics, periodStart } from "@/lib/comasyMetrics";
import { makeComasyCsv, makeComasyPdf } from "@/lib/comasyReport";

export async function GET(request: NextRequest, props: { params: Promise<{ format: string }> }) {
  const organizationId = await getCustomerOrganizationId();
  if (!organizationId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { format } = await props.params;
  const reportType = request.nextUrl.searchParams.get("type") || "executive";
  const period = request.nextUrl.searchParams.get("period") || "all";
  if (!["executive", "awareness", "compliance"].includes(reportType)) return NextResponse.json({ error: "invalid_report_type" }, { status: 400 });
  if (!["30", "90", "365", "all"].includes(period)) return NextResponse.json({ error: "invalid_period" }, { status: 400 });
  const [org, metrics] = await Promise.all([
    prisma.comasyOrganization.findUniqueOrThrow({ where: { id: organizationId }, select: { name: true, slug: true } }),
    getOrganizationMetrics(organizationId, periodStart(period)),
  ]);
  const periodLabel = period === "all" ? "all-time" : `${period}-day`;
  const fileBase = `${org.slug}-${reportType}-${periodLabel}-report`;
  if (format === "csv") {
    const csv = makeComasyCsv(org.name, metrics, `${reportType} · ${periodLabel}`);
    return new NextResponse(csv, { headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="${fileBase}.csv"`, "Cache-Control": "no-store" } });
  }
  if (format === "pdf") {
    const pdf = makeComasyPdf(org.name, metrics, reportType);
    return new NextResponse(new Uint8Array(pdf), { headers: { "Content-Type": "application/pdf", "Content-Disposition": `attachment; filename="${fileBase}.pdf"`, "Cache-Control": "no-store" } });
  }
  return NextResponse.json({ error: "invalid_format" }, { status: 400 });
}
