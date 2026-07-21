import React from "react";
import { tokens, readinessTierColor } from "@/lib/theme/tokens";

type Props = {
  editionLabel: string;
  attempts: number;
  bestPercent: number | null;
  latestPercent: number | null;
  latestLevel: string | null;
};

// Small per-edition summary tile for the player dashboard — best score, most
// recent score, and how many completed runs, so a returning player can see
// improvement at a glance without opening every past session.
export function EditionSummaryCard({ editionLabel, attempts, bestPercent, latestPercent, latestLevel }: Props) {
  const hasResults = bestPercent !== null;
  const color = hasResults ? readinessTierColor(bestPercent!) : tokens.textMuted;

  return (
    <div
      style={{
        background: tokens.gradientCard,
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 14,
        padding: 16,
        minWidth: 200,
        flex: "1 1 200px",
      }}
    >
      <div style={{ fontWeight: 950, fontSize: 15, color: tokens.textOnDark, marginBottom: 6 }}>{editionLabel}</div>

      {hasResults ? (
        <>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span style={{ fontWeight: 1000, fontSize: 28, color }}>{Math.round(bestPercent!)}%</span>
            <span style={{ fontSize: 12, fontWeight: 800, color: tokens.textMuted }}>best</span>
          </div>
          <div style={{ fontSize: 12, fontWeight: 750, color: tokens.textMuted, marginTop: 4 }}>
            Latest: {latestPercent !== null ? `${Math.round(latestPercent)}%` : "—"}
            {latestLevel ? ` · ${latestLevel}` : ""}
          </div>
          <div style={{ fontSize: 12, fontWeight: 750, color: tokens.textMuted, marginTop: 2 }}>
            {attempts} {attempts === 1 ? "run" : "runs"} completed
          </div>
        </>
      ) : (
        <div style={{ fontSize: 13, fontWeight: 750, color: tokens.textMuted }}>Not attempted yet</div>
      )}
    </div>
  );
}
