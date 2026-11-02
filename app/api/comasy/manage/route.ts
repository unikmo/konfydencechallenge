import { randomBytes } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCustomerOrganizationId } from "@/lib/comasyAuth";

import { STUDENT_ALIAS_DOMAIN } from "@/lib/comasyStudents";

const text = (form: FormData, key: string) => String(form.get(key) ?? "").trim();
const optional = (form: FormData, key: string) => text(form, key) || null;

function redirect(request: NextRequest, view: string) {
  return NextResponse.redirect(new URL(`/comasy/dashboard?view=${encodeURIComponent(view)}`, request.url), 303);
}

export async function POST(request: NextRequest) {
  const organizationId = await getCustomerOrganizationId();
  if (!organizationId) return NextResponse.redirect(new URL("/comasy/dashboard/login", request.url), 303);
  const form = await request.formData();
  const action = text(form, "action");

  if (action === "create_cohort") {
    const name = text(form, "name");
    if (!name) return redirect(request, "people");
    await prisma.comasyCohort.upsert({
      where: { organizationId_name: { organizationId, name } },
      update: { department: optional(form, "department"), country: optional(form, "country"), role: optional(form, "role"), active: true },
      create: { organizationId, name, department: optional(form, "department"), country: optional(form, "country"), role: optional(form, "role") },
    });
    return redirect(request, "people");
  }

  if (action === "create_participant") {
    const email = text(form, "email").toLowerCase();
    const cohortId = optional(form, "cohortId");
    if (!email || !text(form, "firstName") || !text(form, "lastName")) return redirect(request, "people");
    if (cohortId) {
      const cohort = await prisma.comasyCohort.findFirst({ where: { id: cohortId, organizationId }, select: { id: true } });
      if (!cohort) return redirect(request, "people");
    }
    await prisma.comasyParticipant.upsert({
      where: { organizationId_email: { organizationId, email } },
      update: { cohortId, firstName: text(form, "firstName"), lastName: text(form, "lastName"), department: optional(form, "department"), role: optional(form, "role"), status: "INVITED" },
      create: { organizationId, cohortId, firstName: text(form, "firstName"), lastName: text(form, "lastName"), email, department: optional(form, "department"), role: optional(form, "role"), accessToken: randomBytes(24).toString("base64url") },
    });
    return redirect(request, "people");
  }

  // Class set-up for students under 18: the teacher creates numbered aliases for a
  // class. No names and no email addresses are entered or stored; the school keeps
  // the key that links each alias to a student. Each alias gets its own access link.
  if (action === "create_student_aliases") {
    const cohortId = optional(form, "cohortId");
    const count = Math.max(1, Math.min(60, Math.floor(Number(text(form, "count")) || 0)));
    const prefix = (text(form, "prefix") || "Student").replace(/[^p{L}p{N} _-]/gu, "").slice(0, 24).trim() || "Student";
    if (!cohortId) return redirect(request, "people");
    const cohort = await prisma.comasyCohort.findFirst({ where: { id: cohortId, organizationId }, select: { id: true } });
    if (!cohort) return redirect(request, "people");
    const existing = await prisma.comasyParticipant.count({ where: { organizationId, cohortId, email: { endsWith: STUDENT_ALIAS_DOMAIN } } });
    if (existing + count > 300) return redirect(request, "people");
    for (let i = 1; i <= count; i += 1) {
      const token = randomBytes(24).toString("base64url");
      await prisma.comasyParticipant.create({
        data: {
          organizationId,
          cohortId,
          firstName: `${prefix} ${String(existing + i).padStart(2, "0")}`,
          lastName: "",
          email: `${randomBytes(9).toString("hex")}${STUDENT_ALIAS_DOMAIN}`,
          accessToken: token,
        },
      });
    }
    return redirect(request, "people");
  }

  if (action === "participant_status") {
    const participantId = text(form, "participantId");
    const status = text(form, "status");
    if (["DISABLED", "INVITED"].includes(status)) {
      await prisma.comasyParticipant.updateMany({ where: { id: participantId, organizationId }, data: { status } });
    }
    return redirect(request, "people");
  }

  // Erasure controlled by the school: removes the participant and, by cascade,
  // every response they gave.
  if (action === "delete_participant") {
    await prisma.comasyParticipant.deleteMany({ where: { id: text(form, "participantId"), organizationId } });
    return redirect(request, "people");
  }

  if (action === "create_campaign") {
    const name = text(form, "name");
    const cohortId = optional(form, "cohortId");
    const scenarioIds = form.getAll("scenarioIds").map(String).filter(Boolean);
    if (!name || !scenarioIds.length) return redirect(request, "practice");
    if (cohortId) {
      const cohort = await prisma.comasyCohort.findFirst({ where: { id: cohortId, organizationId }, select: { id: true } });
      if (!cohort) return redirect(request, "practice");
    }
    const validScenarios = await prisma.scenario.findMany({ where: { id: { in: scenarioIds }, active: true, scored: true }, select: { id: true } });
    if (validScenarios.length !== scenarioIds.length) return redirect(request, "practice");
    await prisma.comasyCampaign.create({
      data: {
        organizationId,
        cohortId,
        name,
        status: text(form, "status") || "DRAFT",
        designation: text(form, "designation") || "PRACTICE",
        scheduledAt: optional(form, "scheduledAt") ? new Date(text(form, "scheduledAt")) : null,
        roleFocus: optional(form, "roleFocus"),
        hackFocus: optional(form, "hackFocus"),
        scenarioIds: validScenarios.map((s) => s.id).join(","),
      },
    });
    return redirect(request, "practice");
  }

  if (action === "campaign_status") {
    const campaignId = text(form, "campaignId");
    const status = text(form, "status");
    if (["DRAFT", "SCHEDULED", "ACTIVE", "COMPLETED", "PAUSED"].includes(status)) {
      await prisma.comasyCampaign.updateMany({ where: { id: campaignId, organizationId }, data: { status, ...(status === "ACTIVE" ? { startAt: new Date() } : {}), ...(status === "COMPLETED" ? { endAt: new Date() } : {}) } });
    }
    return redirect(request, "practice");
  }

  if (action === "settings") {
    await prisma.comasyOrganization.update({
      where: { id: organizationId },
      data: {
        brandingName: optional(form, "brandingName"),
        retentionDays: Math.max(30, Math.min(3650, Number(text(form, "retentionDays")) || 365)),
      },
    });
    return redirect(request, "settings");
  }

  return redirect(request, "overview");
}
