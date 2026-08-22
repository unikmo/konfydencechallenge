import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashAccessCode } from "@/lib/comasyAuth";

const text = (f: FormData, k: string) => String(f.get(k) ?? "").trim();
const opt = (f: FormData, k: string) => text(f, k) || null;
const int = (f: FormData, k: string) => Number.parseInt(text(f, k) || "0", 10) || 0;
const date = (f: FormData, k: string) => opt(f, k) ? new Date(text(f, k)) : null;

function back(request: NextRequest, view: string) {
  return NextResponse.redirect(new URL(`/admin?view=${encodeURIComponent(view)}`, request.url), 303);
}

export async function POST(request: NextRequest) {
  const f = await request.formData();
  const action = text(f, "action");

  if (action === "create_org") {
    const name = text(f, "name");
    const slug = text(f, "slug").toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
    const accessCode = text(f, "accessCode");
    if (!name || !slug) return back(request, "accounts");
    const access = accessCode ? hashAccessCode(accessCode) : null;
    await prisma.comasyOrganization.create({ data: { name, slug, industry: opt(f,"industry"), country: opt(f,"country"), employees: int(f,"employees") || null, nis2Relevant: text(f,"nis2Relevant") === "on", accountOwner: opt(f,"accountOwner"), source: opt(f,"source"), persona: opt(f,"persona"), stage: text(f,"stage") || "TARGET_ACCOUNT", currentPlatform: opt(f,"currentPlatform"), estimatedValue: int(f,"estimatedValue"), nextAction: opt(f,"nextAction"), accessCodeHash: access?.hash, accessCodeSalt: access?.salt } });
    return back(request, "accounts");
  }

  if (action === "reset_access") {
    const organizationId = text(f, "organizationId");
    const code = text(f, "accessCode");
    if (organizationId && code.length >= 6) {
      const access = hashAccessCode(code);
      await prisma.comasyOrganization.update({ where: { id: organizationId }, data: { accessCodeHash: access.hash, accessCodeSalt: access.salt } });
    }
    return back(request, "accounts");
  }

  if (action === "update_org") {
    const organizationId = text(f,"organizationId");
    await prisma.comasyOrganization.update({ where:{id:organizationId}, data:{ stage:text(f,"stage")||undefined, customerHealth:text(f,"customerHealth")||undefined, nextAction:opt(f,"nextAction"), arr:int(f,"arr"), seats:int(f,"seats")||null, renewalDate:date(f,"renewalDate"), expansionPotential:opt(f,"expansionPotential"), lastContactAt:new Date() } });
    return back(request, "customers");
  }

  if (action === "create_contact") {
    const organizationId = text(f,"organizationId");
    await prisma.comasyContact.create({ data:{ organizationId, firstName:text(f,"firstName"), lastName:text(f,"lastName"), email:text(f,"email").toLowerCase(), jobTitle:opt(f,"jobTitle"), persona:opt(f,"persona"), linkedIn:opt(f,"linkedIn"), buyingRole:opt(f,"buyingRole"), decisionMaker:text(f,"decisionMaker")==="on", champion:text(f,"champion")==="on", technicalEvaluator:text(f,"technicalEvaluator")==="on", procurement:text(f,"procurement")==="on", notes:opt(f,"notes") } });
    return back(request,"contacts");
  }

  if (action === "create_opportunity") {
    await prisma.comasyOpportunity.create({ data:{ organizationId:text(f,"organizationId"), name:text(f,"name"), stage:text(f,"stage")||"QUALIFIED", estimatedValue:int(f,"estimatedValue"), probability:Math.max(0,Math.min(100,int(f,"probability"))), expectedClose:date(f,"expectedClose"), nextAction:opt(f,"nextAction"), objection:opt(f,"objection"), owner:opt(f,"owner") } });
    return back(request,"pipeline");
  }

  if (action === "opportunity_stage") {
    await prisma.comasyOpportunity.update({ where:{id:text(f,"opportunityId")}, data:{ stage:text(f,"stage"), probability:Math.max(0,Math.min(100,int(f,"probability"))), nextAction:opt(f,"nextAction"), objection:opt(f,"objection"), lostReason:opt(f,"lostReason") } });
    return back(request,"pipeline");
  }

  if (action === "create_pilot") {
    await prisma.comasyPilot.create({ data:{ organizationId:text(f,"organizationId"), cohortId:opt(f,"cohortId"), startAt:date(f,"startAt"), endAt:date(f,"endAt"), objectives:opt(f,"objectives"), successCriteria:opt(f,"successCriteria"), health:text(f,"health")||"PLANNED", finalReviewDate:date(f,"finalReviewDate") } });
    await prisma.comasyOrganization.update({ where:{id:text(f,"organizationId")}, data:{stage:"PILOT_ACTIVE"} });
    return back(request,"pilots");
  }

  if (action === "pilot_to_paid") {
    const pilotId=text(f,"pilotId");
    const pilot=await prisma.comasyPilot.findUniqueOrThrow({where:{id:pilotId},select:{organizationId:true}});
    const arr=int(f,"arr");
    const contractStart=date(f,"contractStart") || new Date();
    const contractEnd=date(f,"contractEnd");
    await prisma.$transaction([
      prisma.comasyPilot.update({where:{id:pilotId},data:{conversionStatus:"PAID",health:"COMPLETED"}}),
      prisma.comasyOrganization.update({where:{id:pilot.organizationId},data:{stage:"WON",customerHealth:"HEALTHY",arr,contractStart,contractEnd,renewalDate:contractEnd}}),
      ...(arr>0?[prisma.comasyRevenueEvent.create({data:{organizationId:pilot.organizationId,type:"NEW_ARR",amount:arr,source:"pilot_conversion",note:`Pilot ${pilotId} converted`}})]:[]),
    ]);
    return back(request,"pilots");
  }

  if (action === "add_revenue") {
    await prisma.comasyRevenueEvent.create({data:{organizationId:text(f,"organizationId"),type:text(f,"type")||"NEW_ARR",amount:int(f,"amount"),source:text(f,"source")||"manual",occurredAt:date(f,"occurredAt")||new Date(),note:opt(f,"note")}});
    return back(request,"revenue");
  }

  if (action === "scenario_profile") {
    const scenarioId=text(f,"scenarioId");
    const current=await prisma.comasyScenarioProfile.findUnique({where:{scenarioId}});
    if(current){
      await prisma.comasyScenarioVersion.upsert({where:{scenarioId_version:{scenarioId,version:current.version}},update:{snapshot:JSON.stringify(current),createdBy:"admin"},create:{scenarioId,version:current.version,snapshot:JSON.stringify(current),createdBy:"admin"}});
    }
    await prisma.comasyScenarioProfile.upsert({where:{scenarioId},create:{scenarioId,segment:text(f,"segment")||"B2B",industries:opt(f,"industries"),roles:opt(f,"roles"),riskType:opt(f,"riskType"),difficulty:text(f,"difficulty")||"MEDIUM",pauseKeys:opt(f,"pauseKeys"),verificationKeys:opt(f,"verificationKeys"),impulseKeys:opt(f,"impulseKeys"),version:1},update:{segment:text(f,"segment")||"B2B",industries:opt(f,"industries"),roles:opt(f,"roles"),riskType:opt(f,"riskType"),difficulty:text(f,"difficulty")||"MEDIUM",pauseKeys:opt(f,"pauseKeys"),verificationKeys:opt(f,"verificationKeys"),impulseKeys:opt(f,"impulseKeys"),version:{increment:1}}});
    return back(request,"scenarios");
  }

  if(action === "lead_status"){
    await prisma.comasyLead.update({where:{id:text(f,"leadId")},data:{status:text(f,"status")}});
    return back(request,"marketing");
  }

  return back(request,"overview");
}
