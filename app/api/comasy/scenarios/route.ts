import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getCustomerOrganizationId } from "@/lib/comasyAuth";
import { parseCustomScenario } from "@/lib/customScenario";
import { COMASY_PLANS, isComasyPlan, pilotExpired } from "@/lib/comasyPlans";

class ScenarioInputError extends Error {}

export async function POST(request: NextRequest) {
  const organizationId = await getCustomerOrganizationId();
  if (!organizationId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  let sameOrigin = false;
  try { sameOrigin = new URL(request.headers.get("origin") || "").host === request.headers.get("host"); } catch {}
  if (!sameOrigin) return NextResponse.json({ error: "invalid_origin" }, { status: 403 });
  const form = await request.formData();
  const action = String(form.get("action") ?? "create");
  const fail = (message: string) => NextResponse.redirect(new URL("/comasy/dashboard?view=scenarios&error=" + encodeURIComponent(message), request.url), 303);
  const success = () => NextResponse.redirect(new URL("/comasy/dashboard?view=scenarios&saved=1", request.url), 303);
  if (!["create", "edit", "publish", "delete"].includes(action)) return fail("Unknown scenario action.");
  const parsed = ["create", "edit"].includes(action) ? parseCustomScenario(form) : null;
  if (parsed && !parsed.success) return fail(parsed.error.issues[0].message);
  try {
    await prisma.$transaction(async tx => {
      // Serialize allocation and plan changes against the same tenant row.
      await tx.$queryRaw`SELECT id FROM "ComasyOrganization" WHERE id = ${organizationId} FOR UPDATE`;
      const org = await tx.comasyOrganization.findUniqueOrThrow({ where: { id: organizationId } });
      if (pilotExpired(org)) throw new ScenarioInputError("The free pilot has ended. Reports remain available.");
      if (!isComasyPlan(org.pilotPlan) || !COMASY_PLANS[org.pilotPlan].customScenarioLimit) throw new ScenarioInputError("Scenario authoring is included in the free pilot. Contact your administrator if access is unavailable.");
      const id = String(form.get("scenarioId") ?? "");
      if (action !== "create") {
        const scenario = await tx.scenario.findFirst({ where: { id, organizationId }, include: { comasyProfile: true } });
        if (!scenario) throw new ScenarioInputError("Scenario not found in this workspace.");
        if (action === "edit") {
          if (scenario.publicationStatus !== "DRAFT" || !parsed?.success) throw new ScenarioInputError("Only valid drafts can be edited.");
          const { pauseKeys, verificationKeys, impulseKeys, ...content } = parsed.data;
          await tx.scenario.update({ where: { id }, data: { ...content, comasyProfile: { update: { pauseKeys, verificationKeys, impulseKeys } } } });
          return;
        }
        if (action === "delete") {
          if (scenario.publicationStatus !== "DRAFT") throw new ScenarioInputError("Published scenarios are immutable evidence and cannot be deleted.");
          await tx.scenario.delete({ where: { id } });
          return;
        }
        if (scenario.publicationStatus === "PUBLISHED") return;
        const checked = parseCustomScenario(new MapFormData(scenario, scenario.comasyProfile));
        if (!checked.success) throw new ScenarioInputError("Scenario needs valid content and classifications before publication.");
        await tx.scenario.update({ where: { id }, data: { publicationStatus: "PUBLISHED" } });
        await tx.comasyScenarioVersion.upsert({ where: { scenarioId_version: { scenarioId: id, version: 1 } }, update: {}, create: { scenarioId: id, version: 1, snapshot: JSON.stringify({ ...scenario, publicationStatus: "PUBLISHED" }), createdBy: organizationId } });
        return;
      }
      if (!parsed?.success) throw new ScenarioInputError("Invalid scenario.");
      const count = await tx.scenario.count({ where: { organizationId } });
      if (count >= COMASY_PLANS[org.pilotPlan].customScenarioLimit) throw new ScenarioInputError("This pilot supports up to 12 custom scenarios. Delete an unused draft to free a slot.");
      const { pauseKeys, verificationKeys, impulseKeys, ...content } = parsed.data;
      await tx.scenario.create({ data: { ...content, organizationId, publicationStatus: "DRAFT", edition: "comasy-custom", externalId: "CUSTOM-" + randomUUID(), answersD: "", scoresD: 0, category: "Organisation-specific practice", comasyProfile: { create: { pauseKeys, verificationKeys, impulseKeys, segment: "CUSTOM" } } } });
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) return fail("The scenario could not be saved. Please retry.");
    return fail(error instanceof ScenarioInputError ? error.message : "The scenario could not be saved. Please retry.");
  }
  return success();
}

// Revalidate persisted drafts through the same schema before publication.
class MapFormData extends FormData {
  constructor(scenario: object, profile: object | null) {
    super();
    for (const [key, value] of Object.entries({ ...scenario, ...profile })) if (value != null) this.set(key, String(value));
  }
}
