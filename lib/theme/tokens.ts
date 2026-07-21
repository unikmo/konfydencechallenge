export const tokens = {
  bgCanvas: "#08111F",     // dark navy background (pricing, challenge, results)
  bgCardWhite: "#FFFFFF",
  bgCardDark: "#0B1F3A",   // footer / dark card (products page "next" band)
  textOnDark: "#FFFFFF",
  textOnLight: "#0F172A",
  textMuted: "#64748B",
  badgeBlue: "#035494",
  accentAmber: "#FFB31D",
  btnBlack: "#000000",

  // Tier colors for readiness score / feedback reinforcement (risk -> safe)
  tierDanger: "#FF4D5E",
  tierWarning: "#FFB31D",
  tierGood: "#22C55E",

  // Secondary accent used sparingly for "real stakes" moments (alert copy, risky badges)
  accentRed: "#FF4D5E",

  // Gradients for hero/section backgrounds — replaces flat bgCanvas where noted
  gradientHero: "radial-gradient(120% 140% at 15% 0%, #14243D 0%, #08111F 55%, #050B14 100%)",
  gradientCard: "linear-gradient(145deg, rgba(255,179,29,0.10), rgba(255,255,255,0.02))",
} as const;

// Returns the readiness tier color for a given percentage, 0-100. Text labels
// come from lib/scoring/scoringEngine's computeKRSLevel — this only drives color.
export function readinessTierColor(pct: number): string {
  if (pct >= 75) return tokens.tierGood;
  if (pct >= 45) return tokens.tierWarning;
  return tokens.tierDanger;
}
