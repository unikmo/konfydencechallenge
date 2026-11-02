import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCustomerOrganizationId } from "@/lib/comasyAuth";
import { isStudentAlias } from "@/lib/comasyStudents";

export const dynamic = "force-dynamic";

const csv = (value: string) => `"${value.replace(/"/g, '""')}"`;

// Class link sheet for a teacher: one row per participant with their personal
// practice link. For student aliases only the alias and link are listed, so the
// sheet contains nothing that identifies a student until the school adds its own key.
export async function GET(request: NextRequest) {
  const organizationId = await getCustomerOrganizationId();
  if (!organizationId) return NextResponse.redirect(new URL("/comasy/dashboard/login", request.url), 303);

  const cohortId = request.nextUrl.searchParams.get("cohortId");
  const langSuffix = request.nextUrl.searchParams.get("lang") === "de" ? "?lang=de" : "";
  const participants = await prisma.comasyParticipant.findMany({
    where: { organizationId, ...(cohortId ? { cohortId } : {}), status: { not: "DISABLED" } },
    orderBy: [{ createdAt: "asc" }],
    include: { cohort: { select: { name: true } } },
  });

  const origin = process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;
  const german = langSuffix !== "";
  const rows = [(german ? ["Pseudonym", "Klasse", "Übungslink"] : ["Alias", "Class", "Practice link"]).map(csv).join(",")];
  for (const p of participants) {
    const label = isStudentAlias(p.email) ? p.firstName : `${p.firstName} ${p.lastName}`.trim();
    rows.push([label, p.cohort?.name ?? "", `${origin}/comasy/practice/${p.accessToken}${langSuffix}`].map(csv).join(","));
  }

  return new NextResponse(rows.join("\r\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="practice-links.csv"',
      "Cache-Control": "no-store",
    },
  });
}
