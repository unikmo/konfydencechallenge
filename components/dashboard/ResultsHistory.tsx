import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { computeChallengeTotals } from "@/lib/scoring/scoringEngine";
import { EDITION_LABELS, type ChallengeEdition } from "@/lib/challenge/labels";
import { readinessTierColor, tokens } from "@/lib/theme/tokens";
import { EditionSummaryCard } from "@/components/dashboard/EditionSummaryCard";

// The player's Challenge results — edition rollups + run history. Rendered on
// /account for a signed-in account's consolidated player, and (with a "sign in
// to keep these" nudge) for a signed-out visitor who has a device history.

const EDITION_ORDER: ChallengeEdition[] = ["travelsafe", "school", "university", "family", "workplace"];
const MODE_LABEL: Record<string, string> = { diagnostic: "Free diagnostic", full: "Full challenge" };

export async function ResultsHistory({ playerId }: { playerId: string | null }) {
  const sessions = playerId
    ? await prisma.challengeSession.findMany({
        where: { userId: playerId },
        orderBy: { createdAt: "desc" },
        select: { id: true, edition: true, mode: true, status: true, scoreTotal: true, scoreMax: true, createdAt: true },
      })
    : [];

  if (sessions.length === 0) {
    return (
      <div style={styles.card}>
        <p style={{ color: tokens.textMuted, fontWeight: 700, lineHeight: 1.5, margin: 0 }}>
          No Konfydence Challenge runs here yet. Take a free challenge to start building your Readiness Score history.
        </p>
        <Link href="/challenge" style={styles.button}>Start a free challenge</Link>
      </div>
    );
  }

  const editionStats = new Map<string, { attempts: number; bestPercent: number; latestPercent: number; latestLevel: string }>();
  for (const s of sessions) {
    if (s.status !== "COMPLETED" || s.scoreMax <= 0) continue;
    const totals = computeChallengeTotals({ scoreTotal: s.scoreTotal, scoreMax: s.scoreMax });
    const existing = editionStats.get(s.edition);
    if (!existing) {
      editionStats.set(s.edition, {
        attempts: 1,
        bestPercent: totals.totalPercent,
        latestPercent: totals.totalPercent,
        latestLevel: totals.level,
      });
    } else {
      existing.attempts += 1;
      existing.bestPercent = Math.max(existing.bestPercent, totals.totalPercent);
    }
  }
  const totalCompleted = sessions.filter((s) => s.status === "COMPLETED").length;

  return (
    <>
      <div style={styles.card}>
        <p style={{ color: tokens.textMuted, fontWeight: 750, marginTop: 0 }}>
          {totalCompleted} completed {totalCompleted === 1 ? "run" : "runs"}.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 6 }}>
          {EDITION_ORDER.map((edition) => {
            const stat = editionStats.get(edition);
            return (
              <EditionSummaryCard
                key={edition}
                editionLabel={EDITION_LABELS[edition]}
                attempts={stat?.attempts ?? 0}
                bestPercent={stat?.bestPercent ?? null}
                latestPercent={stat?.latestPercent ?? null}
                latestLevel={stat?.latestLevel ?? null}
              />
            );
          })}
        </div>
      </div>

      <div style={{ ...styles.card, marginTop: 14 }}>
        <div style={{ fontWeight: 950, marginBottom: 10 }}>Run history</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {sessions.map((s) => {
            const isCompleted = s.status === "COMPLETED" && s.scoreMax > 0;
            const totals = isCompleted ? computeChallengeTotals({ scoreTotal: s.scoreTotal, scoreMax: s.scoreMax }) : null;
            const color = totals ? readinessTierColor(totals.totalPercent) : tokens.textMuted;
            const editionLabel = EDITION_LABELS[s.edition as ChallengeEdition] ?? s.edition;
            const href = isCompleted ? `/challenge/session/${s.id}/results` : `/challenge/session/${s.id}`;
            const dateLabel = new Date(s.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
            return (
              <Link key={s.id} href={href} style={styles.row}>
                <div>
                  <div style={{ fontWeight: 900 }}>
                    {editionLabel} <span style={{ color: tokens.textMuted, fontWeight: 700 }}>· {MODE_LABEL[s.mode] ?? s.mode}</span>
                  </div>
                  <div style={{ fontSize: 12, color: tokens.textMuted, fontWeight: 700, marginTop: 2 }}>{dateLabel}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  {isCompleted && totals ? (
                    <>
                      <div style={{ fontWeight: 1000, fontSize: 18, color }}>{Math.round(totals.totalPercent)}%</div>
                      <div style={{ fontSize: 11, color: tokens.textMuted, fontWeight: 750 }}>{totals.level}</div>
                    </>
                  ) : (
                    <div style={{ fontWeight: 800, fontSize: 13, color: tokens.textMuted }}>
                      {s.status === "IN_PROGRESS" ? "Continue →" : "—"}
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    background: tokens.bgCardWhite,
    color: tokens.textOnLight,
    borderRadius: 14,
    padding: 18,
    boxShadow: "0 14px 40px rgba(0,0,0,0.25)",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    padding: "12px 14px",
    borderRadius: 10,
    border: "1px solid rgba(11,27,43,0.10)",
    textDecoration: "none",
    color: tokens.textOnLight,
  },
  button: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "10px 16px",
    borderRadius: 12,
    background: tokens.accentAmber,
    border: "none",
    color: tokens.bgCanvas,
    textDecoration: "none",
    fontWeight: 950,
    marginTop: 12,
  },
};
