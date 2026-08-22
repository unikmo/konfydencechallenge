import { prisma } from "@/lib/prisma";

type MetricResponse = {
  participantId?: string;
  score: number;
  pause: boolean;
  verification: boolean;
  impulse: boolean;
  hackKey: string;
  campaign: { designation: string };
  participant: { cohortId: string | null; cohort: { name: string } | null };
};

const pct = (n: number, d: number) => (d ? Math.round((n / d) * 1000) / 10 : 0);
const avg = (values: number[]) => values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;

export function periodStart(period?: string | null) {
  if (!period || period === "all") return null;
  const days = period === "30" ? 30 : period === "90" ? 90 : period === "365" ? 365 : 0;
  return days ? new Date(Date.now() - days * 86_400_000) : null;
}

export function summarizeBehaviour(responses: MetricResponse[], participantCount: number, activeCampaigns: number) {
  const participantIds = new Set(responses.map((r) => r.participantId).filter(Boolean));
  const baseline = responses.filter((r) => r.campaign.designation === "BASELINE");
  const followup = responses.filter((r) => r.campaign.designation === "FOLLOWUP");
  const later = followup.length ? followup : responses.filter((r) => r.campaign.designation !== "BASELINE");

  const pauseRate = pct(responses.filter((r) => r.pause).length, responses.length);
  const verificationRate = pct(responses.filter((r) => r.verification).length, responses.length);
  const impulseRate = pct(responses.filter((r) => r.impulse).length, responses.length);
  const baselinePause = pct(baseline.filter((r) => r.pause).length, baseline.length);
  const followupPause = pct(later.filter((r) => r.pause).length, later.length);
  const prePostChange = baseline.length && later.length ? Math.round((followupPause - baselinePause) * 10) / 10 : null;

  const hackProfile = Object.fromEntries(
    ["H", "A", "C", "K"].map((key) => {
      const rows = responses.filter((r) => r.hackKey === key);
      return [key, rows.length ? Math.round((avg(rows.map((r) => r.score)) / 4) * 1000) / 10 : 0];
    })
  ) as Record<"H" | "A" | "C" | "K", number>;

  const cohortMap = new Map<string, { name: string; rows: MetricResponse[] }>();
  for (const row of responses) {
    const id = row.participant.cohortId ?? "unassigned";
    const existing = cohortMap.get(id) ?? { name: row.participant.cohort?.name ?? "Unassigned", rows: [] };
    existing.rows.push(row);
    cohortMap.set(id, existing);
  }

  const cohorts = [...cohortMap.entries()].map(([id, value]) => ({
    id,
    name: value.name,
    pauseAdoption: pct(value.rows.filter((r) => r.pause).length, value.rows.length),
    verificationRate: pct(value.rows.filter((r) => r.verification).length, value.rows.length),
    impulseRate: pct(value.rows.filter((r) => r.impulse).length, value.rows.length),
    responses: value.rows.length,
  }));

  const attentionCohorts = cohorts
    .filter((c) => c.responses >= 3 && (c.pauseAdoption < 60 || c.verificationRate < 50 || c.impulseRate > 25))
    .sort((a, b) => b.impulseRate - a.impulseRate || a.pauseAdoption - b.pauseAdoption)
    .slice(0, 5);

  return {
    participantCount,
    activeCampaigns,
    participationRate: participantCount ? pct(participantIds.size, participantCount) : 0,
    pauseAdoption: pauseRate,
    verificationRate,
    impulseRate,
    baselinePause,
    followupPause,
    prePostChange,
    hackProfile,
    cohorts,
    attentionCohorts,
    responseCount: responses.length,
  };
}

export async function getOrganizationMetrics(organizationId: string, since?: Date | null) {
  const createdAt = since ? { gte: since } : undefined;
  const [participantCount, activeCampaigns, rows] = await Promise.all([
    prisma.comasyParticipant.count({ where: { organizationId } }),
    prisma.comasyCampaign.count({ where: { organizationId, status: { in: ["ACTIVE", "SCHEDULED"] } } }),
    prisma.comasyResponse.findMany({
      where: { organizationId, ...(createdAt ? { createdAt } : {}) },
      select: {
        participantId: true,
        score: true,
        pause: true,
        verification: true,
        impulse: true,
        hackKey: true,
        campaign: { select: { designation: true } },
        participant: { select: { cohortId: true, cohort: { select: { name: true } } } },
      },
    }),
  ]);
  return summarizeBehaviour(rows, participantCount, activeCampaigns);
}

export async function getOrganizationTrend(organizationId: string, since?: Date | null) {
  const campaigns = await prisma.comasyCampaign.findMany({
    where: { organizationId, ...(since ? { createdAt: { gte: since } } : {}) },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      name: true,
      designation: true,
      createdAt: true,
      responses: { select: { pause: true, verification: true, impulse: true, score: true } },
    },
  });
  return campaigns
    .filter((campaign) => campaign.responses.length > 0)
    .map((campaign) => ({
      id: campaign.id,
      name: campaign.name,
      designation: campaign.designation,
      date: campaign.createdAt,
      responses: campaign.responses.length,
      pauseAdoption: pct(campaign.responses.filter((r) => r.pause).length, campaign.responses.length),
      verificationRate: pct(campaign.responses.filter((r) => r.verification).length, campaign.responses.length),
      impulseRate: pct(campaign.responses.filter((r) => r.impulse).length, campaign.responses.length),
      score: Math.round((avg(campaign.responses.map((r) => r.score)) / 4) * 1000) / 10,
    }));
}

export function classifyScenarioResponse(params: {
  selectedKey: "A" | "B" | "C";
  answerText: string;
  score: number;
  pauseKeys?: string | null;
  verificationKeys?: string | null;
  impulseKeys?: string | null;
}) {
  const keyIn = (value: string | null | undefined) => (value ?? "").split(",").map((x) => x.trim()).includes(params.selectedKey);
  const verificationLanguage = /\b(verify|confirm|call|check|known|official|independent|contact|open the app|go directly|in person)\b/i;
  return {
    pause: params.pauseKeys ? keyIn(params.pauseKeys) : params.score >= 3,
    verification: params.verificationKeys ? keyIn(params.verificationKeys) : verificationLanguage.test(params.answerText),
    impulse: params.impulseKeys ? keyIn(params.impulseKeys) : params.score <= 1,
  };
}
