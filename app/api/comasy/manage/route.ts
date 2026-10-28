import { Prisma } from "@prisma/client";
import { sendComasyInvitation } from "@/lib/comasyInvitations";
import { getAccount } from "@/lib/auth/session";
import { PILOT_LIMITS, pilotExpired, scenarioProgrammeIds, availableComasyScenarios } from "@/lib/comasyPlans";
import { randomBytes } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCustomerOrganizationId } from "@/lib/comasyAuth";

const text = (form: FormData, key: string) => String(form.get(key) ?? "").trim();
const optional = (form: FormData, key: string) => text(form, key) || null;

function redirect(request: NextRequest, view: string, error?: string) {
  return NextResponse.redirect(new URL(`/comasy/dashboard?view=${encodeURIComponent(view)}${error ? "&error=" + encodeURIComponent(error) : "&saved=1"}`, request.url), 303);
}

export async function POST(request: NextRequest) {
  const organizationId = await getCustomerOrganizationId();
  if (!organizationId) return NextResponse.redirect(new URL("/comasy/dashboard/login", request.url), 303);
  let sameOrigin = false;
  try { sameOrigin = new URL(request.headers.get("origin") || "").host === request.headers.get("host"); } catch {}
  if (!sameOrigin) return NextResponse.json({ error: "invalid_origin" }, { status: 403 });
  const form = await request.formData();
  const action = text(form, "action");
  const org = await prisma.comasyOrganization.findUniqueOrThrow({where:{id:organizationId}});
  if (!["settings", "evidence", "add_admin", "disable_admin", "disable_participant"].includes(action) && pilotExpired(org)) return redirect(request,"overview","The free pilot has ended. Reports remain available. Agree onboarding and per-seat fees before continuing.");
  const account = await getAccount();
  const audit = async (type:string) => {await prisma.comasyActivity.create({data:{organizationId,type,metadata:JSON.stringify({actor:account?.email})}});};
  if (action === "start_pilot") {
    if (!org.dataHandlingConfirmedAt) return redirect(request,"compliance","Record the organisation's data-handling agreement before starting.");
    await prisma.$transaction(async tx=>{
      await tx.$queryRaw`SELECT id FROM "ComasyOrganization" WHERE id=${organizationId} FOR UPDATE`;
      const current=await tx.comasyOrganization.findUniqueOrThrow({where:{id:organizationId}});
      if(current.pilotStartedAt)return;
      const startAt=new Date(),endAt=new Date(startAt.getTime()+PILOT_LIMITS.days*86400000);
      await tx.comasyOrganization.update({where:{id:organizationId},data:{pilotStartedAt:startAt,pilotEndsAt:endAt,stage:"PILOT_ACTIVE"}});
      const planned=await tx.comasyPilot.findFirst({where:{organizationId,health:"PLANNED"},orderBy:{createdAt:"desc"}});
      const data={plan:"FREE",feeUsd:0,startAt,endAt,health:"ACTIVE",objectives:current.pilotObjectives};
      if(planned)await tx.comasyPilot.update({where:{id:planned.id},data});else await tx.comasyPilot.create({data:{organizationId,...data}});
    },{isolationLevel:Prisma.TransactionIsolationLevel.Serializable});
    await audit("pilot_started"); return redirect(request,"overview");
  }
  if (action === "evidence") {
    await prisma.comasyOrganization.update({where:{id:organizationId},data:{pilotObjectives:optional(form,"pilotObjectives"),evidenceOwner:optional(form,"evidenceOwner"),evidenceReviewNotes:optional(form,"evidenceReviewNotes"),...(text(form,"reviewed")==="yes"?{evidenceReviewAt:new Date()}:{}),...(text(form,"dataHandlingConfirmed")==="yes"?{dataHandlingConfirmedAt:new Date()}: {})}});
    await audit("evidence_updated"); return redirect(request,"compliance");
  }
  if (action === "add_admin") {
    const email=text(form,"email").toLowerCase(),name=text(form,"name");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||!name) return redirect(request,"people","Enter an administrator name and valid email.");
    await prisma.comasyAdministrator.upsert({where:{organizationId_email:{organizationId,email}},create:{organizationId,email,name},update:{name,active:true}});
    await audit("administrator_added"); return redirect(request,"people");
  }
  if (action === "disable_admin") {
    try {await prisma.$transaction(async tx=>{
      await tx.$queryRaw`SELECT id FROM "ComasyOrganization" WHERE id=${organizationId} FOR UPDATE`;
      if(await tx.comasyAdministrator.count({where:{organizationId,active:true}})<=1)throw new Error("last_admin");
      await tx.comasyAdministrator.updateMany({where:{id:text(form,"administratorId"),organizationId},data:{active:false}});
    },{isolationLevel:Prisma.TransactionIsolationLevel.Serializable});}catch{return redirect(request,"people","Keep at least one active administrator. Please retry if another administrator was changing access.");}
    await audit("administrator_disabled"); return redirect(request,"people");
  }
  if (action === "disable_participant") {
    await prisma.comasyParticipant.updateMany({where:{id:text(form,"participantId"),organizationId},data:{status:"DISABLED",accessToken:randomBytes(24).toString("base64url")}});
    await audit("participant_disabled"); return redirect(request,"people");
  }
  if (action === "resend_participant") {
    const p=await prisma.comasyParticipant.findFirst({where:{id:text(form,"participantId"),organizationId,status:{not:"DISABLED"}}});
    if(!p)return redirect(request,"people","Participant not found.");
    const result=await sendComasyInvitation(p.email,org.name,new URL("/comasy/participant/"+p.accessToken,request.url).href);
    await prisma.comasyParticipant.update({where:{id:p.id},data:{...(result.sent?{invitationSentAt:new Date()}:{}),invitationError:result.error}});
    return redirect(request,"people",result.error||undefined);
  }

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
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return redirect(request,"people","Enter a valid email.");
    if(!org.pilotStartedAt||!org.dataHandlingConfirmedAt)return redirect(request,"people","Record data arrangements and start the free pilot before inviting participants.");
    let participant;
    try {participant=await prisma.$transaction(async tx=>{
      await tx.$queryRaw`SELECT id FROM "ComasyOrganization" WHERE id=${organizationId} FOR UPDATE`;
      if(!await tx.comasyAdministrator.count({where:{organizationId,active:true}}))throw new Error("admin_required");
      const existing=await tx.comasyParticipant.findUnique({where:{organizationId_email:{organizationId,email}}});
      if(!existing&&await tx.comasyParticipant.count({where:{organizationId}})>=PILOT_LIMITS.participants)throw new Error("participant_limit");
      return tx.comasyParticipant.upsert({where:{organizationId_email:{organizationId,email}},update:{cohortId,firstName:text(form,"firstName"),lastName:text(form,"lastName"),department:optional(form,"department"),role:optional(form,"role"),...(existing?.status==="DISABLED"?{status:"INVITED"}: {})},create:{organizationId,cohortId,email,firstName:text(form,"firstName"),lastName:text(form,"lastName"),department:optional(form,"department"),role:optional(form,"role"),accessToken:randomBytes(24).toString("base64url")}});
    },{isolationLevel:Prisma.TransactionIsolationLevel.Serializable});}catch{return redirect(request,"people","Pilot limit: 20 participants and at least one active administrator. Please retry if invitations were being added concurrently.");}
    const result=await sendComasyInvitation(participant.email,org.name,new URL("/comasy/participant/"+participant.accessToken,request.url).href);
    await prisma.comasyParticipant.update({where:{id:participant.id},data:{...(result.sent?{invitationSentAt:new Date()}:{}),invitationError:result.error}});
    await audit("participant_invited");
    return redirect(request,"people",result.error||undefined);

  }

  if (action === "create_campaign") {
    const name = text(form, "name");
    const cohortId = optional(form, "cohortId");
    const scenarioIds = [...new Set(form.getAll("scenarioIds").map(String).filter(Boolean))];
    if (!name || !scenarioIds.length || scenarioIds.length > PILOT_LIMITS.scenarios) return redirect(request, "practice", "Select 1–12 scenarios.");
    if (!org.pilotStartedAt && text(form,"status") !== "DRAFT") return redirect(request,"practice","Start the free pilot before assigning live practice.");
    if (cohortId) {
      const cohort = await prisma.comasyCohort.findFirst({ where: { id: cohortId, organizationId }, select: { id: true } });
      if (!cohort) return redirect(request, "practice");
    }
    const validScenarios = await prisma.scenario.findMany({ where: { id: { in: scenarioIds }, ...availableComasyScenarios(organizationId) }, select: { id: true } });
    if (validScenarios.length !== scenarioIds.length) return redirect(request, "practice");
    try {await prisma.$transaction(async tx=>{
      await tx.$queryRaw`SELECT id FROM "ComasyOrganization" WHERE id=${organizationId} FOR UPDATE`;
      const previous=await tx.comasyCampaign.findMany({where:{organizationId},select:{scenarioIds:true}});
      if(scenarioProgrammeIds(previous,scenarioIds).length>PILOT_LIMITS.scenarios)throw new Error("scenario_limit");
      await tx.comasyCampaign.create({
      data: {
        organizationId,
        cohortId,
        name,
        status: ["DRAFT", "ACTIVE", "SCHEDULED"].includes(text(form, "status")) ? text(form, "status") : "DRAFT",
        designation: ["BASELINE", "PRACTICE", "FOLLOWUP"].includes(text(form, "designation")) ? text(form, "designation") : "PRACTICE",
        scheduledAt: optional(form, "scheduledAt") ? new Date(text(form, "scheduledAt")) : null,
        roleFocus: optional(form, "roleFocus"),
        hackFocus: optional(form, "hackFocus"),
        scenarioIds: validScenarios.map((s) => s.id).join(","),
      },
    });
    },{isolationLevel:Prisma.TransactionIsolationLevel.Serializable});}catch{return redirect(request,"practice","The free pilot supports 12 distinct scenarios across all campaigns. Please retry if campaigns were being created concurrently.");}
    await audit("campaign_created");
    return redirect(request, "practice");
  }

  if (action === "campaign_status") {
    const campaignId = text(form, "campaignId");
    const status = text(form, "status");
    if (["ACTIVE","SCHEDULED"].includes(status) && !org.pilotStartedAt) return redirect(request,"practice","Start the free pilot first.");
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
