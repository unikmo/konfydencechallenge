import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { STUDENT_ALIAS_DOMAIN } from "@/lib/comasyStudents";

export const dynamic = "force-dynamic";

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

// Applies each CoMaSy organisation's retention setting (ComasyOrganization.retentionDays).
// An organisation's clock starts at its LAST recorded response, so a pilot keeps
// everything until retentionDays after the final activity (which is when the final
// report has been delivered) and is then cleared in one go:
//   - every response the organisation's participants gave is deleted;
//   - student alias participants (no name, no email) are deleted with them.
// Named participants and organisation contacts are not touched here; they are
// handled as the customer relationship, or on request.
//
// Safety: this endpoint requires CRON_SECRET, skips demo organisations, and only
// deletes when COMASY_RETENTION_ENABLED=true. Otherwise it runs as a dry run and
// returns what it WOULD delete, so the first runs can be reviewed before it is switched on.
export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret || request.headers.get("authorization") !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const enabled = process.env.COMASY_RETENTION_ENABLED === "true";
  const now = Date.now();
  const orgs = await prisma.comasyOrganization.findMany({
    where: { isDemo: false },
    select: { id: true, slug: true, retentionDays: true },
  });

  const report: Array<{ organization: string; responses: number; studentAliases: number }> = [];

  for (const org of orgs) {
    const last = await prisma.comasyResponse.aggregate({
      where: { organizationId: org.id },
      _max: { createdAt: true },
    });
    const lastActivity = last._max.createdAt;
    if (!lastActivity) continue;
    if (now - lastActivity.getTime() < org.retentionDays * ONE_DAY_MS) continue;

    const aliasWhere = { organizationId: org.id, email: { endsWith: STUDENT_ALIAS_DOMAIN } };
    if (enabled) {
      const [responses, aliases] = await prisma.$transaction([
        prisma.comasyResponse.deleteMany({ where: { organizationId: org.id } }),
        prisma.comasyParticipant.deleteMany({ where: aliasWhere }),
      ]);
      report.push({ organization: org.slug, responses: responses.count, studentAliases: aliases.count });
    } else {
      const [responses, aliases] = await Promise.all([
        prisma.comasyResponse.count({ where: { organizationId: org.id } }),
        prisma.comasyParticipant.count({ where: aliasWhere }),
      ]);
      report.push({ organization: org.slug, responses, studentAliases: aliases });
    }
  }

  console.log("CoMaSy retention run", { enabled, organisations: report.length, report });
  return NextResponse.json({ enabled, dryRun: !enabled, report });
}
