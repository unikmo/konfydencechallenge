export const PILOT_LIMITS = { days: 28, participants: 20, scenarios: 12 } as const;
export const COMASY_PLANS = { FREE: { label: "Free four-week pilot", priceUsd: 0, customScenarioLimit: 12 } } as const;
export type ComasyPlan = keyof typeof COMASY_PLANS;
export const isComasyPlan = (value: string): value is ComasyPlan => value === "FREE";
export function availableComasyScenarios(organizationId: string) {
  return { active: true, scored: true, OR: [{ organizationId: null }, { organizationId, publicationStatus: "PUBLISHED" }] };
}
export function pilotExpired(organization: { pilotEndsAt: Date | null }, now = new Date()) {
  return Boolean(organization.pilotEndsAt && organization.pilotEndsAt <= now);
}
export function scenarioProgrammeIds(campaigns: Array<{scenarioIds: string}>, selected: string[]) {
  return [...new Set([...campaigns.flatMap(c => c.scenarioIds.split(",").filter(Boolean)), ...selected])];
}
