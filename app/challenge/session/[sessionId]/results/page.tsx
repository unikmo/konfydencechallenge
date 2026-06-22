import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  computeChallengeTotals,
  getPassThreshold,
} from "@/lib/scoring/scoringEngine";
import type { ChallengeEdition } from "@/lib/challenge/sessionGenerator";
import { EDITION_LABELS, SECTION_LABELS, type SectionKey } from "@/lib/challenge/labels";


const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #071421, #0b2237)",
    padding: 18,
    color: "white",
    display: "flex",
    justifyContent: "center",
  },
  shell: { width: "100%", maxWidth: 980 },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  headerTitle: { fontWeight: 950, color: "white" },
  smallLink: { color: "#ffffffcc", fontSize: 13, fontWeight: 700, textDecoration: "none" },
  card: {
    background: "white",
    color: "#0b1b2b",
    borderRadius: 14,
    padding: 18,
    boxShadow: "0 14px 40px rgba(0,0,0,0.25)",
  },
  badge: {
    display: "inline-flex",
    borderRadius: 999,
    padding: "6px 10px",
    border: "1px solid rgba(255,198,0,0.35)",
    background: "rgba(255,198,0,0.08)",
    fontWeight: 950,
  },
  button: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    padding: "10px 12px",
    borderRadius: 12,
    background: "#ffc600",
    border: "1px solid rgba(0,0,0,0.05)",
    color: "#0b1b2b",
    textDecoration: "none",
    fontWeight: 950,
    marginTop: 12,
  },
  secondary: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    padding: "10px 12px",
    borderRadius: 12,
    background: "#fff",
    border: "1px solid rgba(11,27,43,0.14)",
    color: "#0b1b2b",
    textDecoration: "none",
    fontWeight: 950,
    marginTop: 10,
  },
  sectionRow: { display: "flex", justifyContent: "space-between", gap: 10, marginTop: 8 },
  sectionKey: { fontWeight: 950, color: "#0b1b2b" },
  muted: { color: "#344a5e" },
};

export default async function ResultsPage({ params }: { params: { sessionId: string } }) {
  const sessionId = params.sessionId;

  const session = await prisma.challengeSession.findUnique({
    where: { id: sessionId },
    select: { id: true, edition: true, status: true, completedAt: true },
  });

  if (!session) notFound();

  const sections = await prisma.challengeSessionSection.findMany({
    where: { sessionId },
    select: {
      section: true,
      currentIndex: true,
      cards: { select: { id: true } },
      sectionScoreTotal: true,
      sectionScoreMax: true,
    },
  });

  const totals = computeChallengeTotals({
    edition: session.edition as ChallengeEdition,
    sections: sections.map((s) => ({
      sectionScoreTotal: s.sectionScoreTotal,
      sectionScoreMax: s.sectionScoreMax || s.cards.length * 4,
    })),
  });

  const requiredThreshold = getPassThreshold(session.edition as ChallengeEdition);

  const completedAll = sections.every((s) => s.currentIndex >= s.cards.length);
  const certificateEligible = completedAll && totals.pass;

  const readinessScorePoints = totals.totalScoreTotal;
  const readinessMaxPoints = totals.totalScoreMax;
  const readinessPercentage = totals.totalPercent;

  const readinessInterpretation = (() => {
    const pct = readinessPercentage;
    if (pct >= 90) return "Stay sharp. Your instincts hold up under pressure.";
    if (pct >= 75) return "You’re street smart. A safer rhythm will make you even stronger.";
    if (pct >= 55) return "Pressure is getting to you. Slow the moment that feels rushed.";
    return "High risk under pressure. Assume urgency is a scam signal.";
  })();

  const hackBreakdown: Array<{ section: SectionKey; label: string; pct: number }> = ([
    "A",
    "B",
    "C",
    "D",
  ] as SectionKey[]).map((section) => {

    const row = sections.find((s) => s.section === section);
    const sectionCards = row?.cards?.length ?? 0;
    const max = row?.sectionScoreMax ?? sectionCards * 4;
    const total = row?.sectionScoreTotal ?? 0;
    const pct = max > 0 ? Math.max(0, Math.min(100, (total / max) * 100)) : 0;

    const hackLabel = section === "A"
      ? "Hurry"
      : section === "B"
        ? "Authority"
        : section === "C"
          ? "Comfort"
          : "Kill-Switch";

    return { section, label: hackLabel, pct };
  });



  // Mark session completed when fully finished
  if (completedAll && session.status !== "COMPLETED") {
    await prisma.challengeSession.update({
      where: { id: sessionId },
      data: { status: "COMPLETED", completedAt: new Date() },
    });
  }

  return (
    <div style={styles.page}>
      <div style={styles.shell}>
        <div style={styles.header}>
          <div style={styles.headerTitle}>Konfydence Challenge</div>
          <Link style={styles.smallLink} href="/challenge">
            Start over
          </Link>
        </div>

        <div style={styles.card}>
          <h2 style={{ marginTop: 0 }}>Results</h2>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
            <div>
              <div style={styles.muted as React.CSSProperties}>Readiness Score</div>
              <div style={{ fontWeight: 1000, fontSize: 40 }}>
                {readinessScorePoints} / {readinessMaxPoints}
              </div>
              <div style={{ color: "#344a5e", fontWeight: 900, marginTop: 6 }}>{readinessPercentage.toFixed(0)}%</div>
            </div>
            <div style={styles.badge}>{totals.level}</div>
          </div>

          <p style={{ marginTop: 10, marginBottom: 0, color: "#344a5e" }}>
            {readinessInterpretation}
          </p>

          <div style={{ marginTop: 16 }}>
            <div style={{ fontWeight: 950 }}>HACK breakdown</div>
            {(hackBreakdown ?? []).map((h) => (
              <div key={h.section} style={styles.sectionRow}>
                <div style={styles.sectionKey}>
                  {h.section}: {h.label}
                </div>
                <div className="" style={styles.muted}>
                  {h.pct.toFixed(0)}%
                </div>
              </div>
            ))}
          </div>


          <div style={{ marginTop: 14 }}>
            <Link className="" style={styles.secondary} href={`/challenge/session/${sessionId}/certificate`}>
              {certificateEligible ? "View certificate" : "Certificate (locked)"}
            </Link>
            <Link style={styles.button} href={`/challenge/${session.edition}/start`}>
              Retry challenge
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

