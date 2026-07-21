import React from "react";
import Link from "next/link";
import { cookies } from "next/headers";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { computeChallengeTotals } from "@/lib/scoring/scoringEngine";
import { EDITION_LABELS, type ChallengeEdition } from "@/lib/challenge/labels";
import { readinessTierColor, tokens } from "@/lib/theme/tokens";
import { EditionSummaryCard } from "@/components/dashboard/EditionSummaryCard";

export const metadata: Metadata = {
  title: "My Results",
  description: "Your Konfydence Challenge history and Konfydence Readiness Score progress across every edition.",
  // Per-visitor page keyed off a device cookie — nothing here is useful to crawl or index.
  robots: { index: false, follow: false },
};

// Reads the kf_uid cookie, so this page is inherently per-visitor and must
// never be statically cached/prerendered.
export const dynamic = "force-dynamic";

const EDITION_ORDER: ChallengeEdition[] = ["travelsafe", "school", "university", "family", "workplace"];

const MODE_LABEL: Record<string, string> = {
  diagnostic: "Free diagnostic",
  full: "Full challenge",
};

function EmptyState() {
  return (
    <main style={styles.page}>
      <div style={styles.shell}>
        <div style={styles.header}>
          <Link href="/" style={styles.smallLink}>
            &larr; Konfydence
          </Link>
        </div>
        <div style={styles.card}>
          <h1 style={{ marginTop: 0, fontSize: 22 }}>My Results</h1>
          <p style={{ color: tokens.textMuted, fontWeight: 700, lineHeight: 1.5 }}>
            You haven&rsquo;t played a Konfydence Challenge on this device yet. Take a free challenge to start
            building your Readiness Score history.
          </p>
          <Link href="/challenge" style={styles.button}>
            Start a free challenge
          </Link>
        </div>
      </div>
    </main>
  );
}

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const kfUid = cookieStore.get("kf_uid")?.value;

  if (!kfUid) {
    return <EmptyState />;
  }

  const sessions = await prisma.challengeSession.findMany({
    where: { userId: kfUid },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      edition: true,
      mode: true,
      status: true,
      scoreTotal: true,
      scoreMax: true,
      completedAt: true,
      createdAt: true,
    },
  });

  if (sessions.length === 0) {
    return <EmptyState />;
  }

  // Per-edition rollup: best % and most recent % across completed, scored runs.
  const editionStats = new Map<
    string,
    { attempts: number; bestPercent: number; latestPercent: number; latestLevel: string }
  >();

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
      // sessions are ordered newest-first, so the first one seen per edition is already the latest
    }
  }

  const totalCompleted = sessions.filter((s) => s.status === "COMPLETED").length;

  return (
    <main style={styles.page}>
      <div style={styles.shell}>
        <div style={styles.header}>
          <Link href="/" style={styles.smallLink}>
            &larr; Konfydence
          </Link>
          <Link href="/challenge" style={styles.smallLink}>
            Take another challenge
          </Link>
        </div>

        <div style={styles.card}>
          <h1 style={{ marginTop: 0, fontSize: 22 }}>My Results</h1>
          <p style={{ color: tokens.textMuted, fontWeight: 750, marginTop: 0 }}>
            {totalCompleted} completed {totalCompleted === 1 ? "run" : "runs"} on this device.
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 16 }}>
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
              const totals = isCompleted
                ? computeChallengeTotals({ scoreTotal: s.scoreTotal, scoreMax: s.scoreMax })
                : null;
              const color = totals ? readinessTierColor(totals.totalPercent) : tokens.textMuted;
              const editionLabel = EDITION_LABELS[s.edition as ChallengeEdition] ?? s.edition;
              const href = isCompleted
                ? `/challenge/session/${s.id}/results`
                : `/challenge/session/${s.id}`;
              const dateLabel = new Date(s.createdAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              });

              return (
                <Link
                  key={s.id}
                  href={href}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 12,
                    padding: "12px 14px",
                    borderRadius: 10,
                    border: "1px solid rgba(11,27,43,0.10)",
                    textDecoration: "none",
                    color: tokens.textOnLight,
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 900 }}>
                      {editionLabel} <span style={{ color: tokens.textMuted, fontWeight: 700 }}>· {MODE_LABEL[s.mode] ?? s.mode}</span>
                    </div>
                    <div style={{ fontSize: 12, color: tokens.textMuted, fontWeight: 700, marginTop: 2 }}>
                      {dateLabel}
                    </div>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    {isCompleted && totals ? (
                      <>
                        <div style={{ fontWeight: 1000, fontSize: 18, color }}>
                          {Math.round(totals.totalPercent)}%
                        </div>
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
      </div>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: tokens.gradientHero,
    padding: 18,
    display: "flex",
    justifyContent: "center",
  },
  shell: { width: "100%", maxWidth: 900 },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  smallLink: { color: "#ffffffcc", fontSize: 13, fontWeight: 800, textDecoration: "none" },
  card: {
    background: tokens.bgCardWhite,
    color: tokens.textOnLight,
    borderRadius: 14,
    padding: 18,
    boxShadow: "0 14px 40px rgba(0,0,0,0.25)",
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
