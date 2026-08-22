import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { classifyScenarioResponse } from "@/lib/comasyMetrics";

const answerKey = (value: string): value is "A" | "B" | "C" => ["A", "B", "C"].includes(value);

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const token = String(form.get("token") ?? "");
  const campaignId = String(form.get("campaignId") ?? "");
  const scenarioId = String(form.get("scenarioId") ?? "");
  const selectedAnswerKey = String(form.get("selectedAnswerKey") ?? "");
  if (!token || !campaignId || !scenarioId || !answerKey(selectedAnswerKey)) return NextResponse.json({ error: "invalid_submission" }, { status: 400 });

  const participant = await prisma.comasyParticipant.findUnique({ where: { accessToken: token }, select: { id: true, organizationId: true, cohortId: true, status: true } });
  if (!participant || participant.status === "DISABLED") return NextResponse.json({ error: "participant_not_found" }, { status: 404 });

  const campaign = await prisma.comasyCampaign.findFirst({ where: { id: campaignId, organizationId: participant.organizationId, status: { in: ["ACTIVE", "SCHEDULED"] } } });
  if (!campaign || (campaign.cohortId && campaign.cohortId !== participant.cohortId)) return NextResponse.json({ error: "campaign_not_assigned" }, { status: 403 });
  const scenarioIds = campaign.scenarioIds.split(",").map((x) => x.trim()).filter(Boolean);
  if (!scenarioIds.includes(scenarioId)) return NextResponse.json({ error: "scenario_not_in_campaign" }, { status: 403 });

  const scenario = await prisma.scenario.findUnique({ where: { id: scenarioId }, include: { comasyProfile: true } });
  if (!scenario || !scenario.active || !scenario.scored) return NextResponse.json({ error: "scenario_unavailable" }, { status: 404 });
  const score = selectedAnswerKey === "A" ? scenario.scoresA : selectedAnswerKey === "B" ? scenario.scoresB : scenario.scoresC;
  const answerText = selectedAnswerKey === "A" ? scenario.answersA : selectedAnswerKey === "B" ? scenario.answersB : scenario.answersC;
  const classified = classifyScenarioResponse({ selectedKey: selectedAnswerKey, answerText, score, pauseKeys: scenario.comasyProfile?.pauseKeys, verificationKeys: scenario.comasyProfile?.verificationKeys, impulseKeys: scenario.comasyProfile?.impulseKeys });

  try {
    await prisma.comasyResponse.create({ data: { organizationId: participant.organizationId, campaignId, participantId: participant.id, scenarioId, selectedAnswerKey, score, pause: classified.pause, verification: classified.verification, impulse: classified.impulse, hackKey: scenario.hackKey || "K" } });
  } catch {
    return NextResponse.redirect(new URL(`/comasy/practice/${token}?campaign=${campaignId}`, request.url), 303);
  }

  const responseCount = await prisma.comasyResponse.count({ where: { participantId: participant.id, campaignId } });
  await prisma.comasyParticipant.update({ where: { id: participant.id }, data: { status: responseCount >= scenarioIds.length ? "COMPLETED" : "ACTIVE", onboardedAt: participant.status === "INVITED" ? new Date() : undefined, completedAt: responseCount >= scenarioIds.length ? new Date() : null } });

  return NextResponse.redirect(new URL(`/comasy/practice/${token}?campaign=${campaignId}&feedback=1`, request.url), 303);
}
