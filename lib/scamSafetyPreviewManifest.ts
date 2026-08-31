export type ScamSafetyPreviewKind = "phone" | "computer";

export const SCAM_SAFETY_PREVIEW_LIMITS = {
  phone: 9,
  computer: 6,
} as const;

export function scamSafetyPreviewPath(kind: ScamSafetyPreviewKind, ordinal: number) {
  return `/resources/scam-safety/full/${kind}-${String(ordinal).padStart(2, "0")}.webp`;
}
