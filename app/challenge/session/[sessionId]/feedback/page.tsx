import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

const SECTION_ORDER = ["A", "B", "C", "D"] as const;

export default async function FeedbackPage({ params }: { params: { sessionId: string } }) {
  const sessionId = params.sessionId;

  const last = await prisma.challengeAnswerResponse.findFirst({
    where: { sessionId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      selectedAnswerKey: true,
      score: true,
      section: true,
      explanation: true,
      proTip: true,
      scenario: { select: { safeActions: true } },
    },
  });

  if (!last) notFound();

  const session = await prisma.challengeSession.findUnique({
    where: { id: sessionId },
    select: { id: true, edition: true },
  });

  if (!session) notFound();

  const sections = await prisma.challengeSessionSection.findMany({
    where: { sessionId },
    select: {
      section: true,
      currentIndex: true,
      cards: { select: { id: true } },
    },
  });

  const remaining = sections.reduce((sum, s) => sum + Math.max(0, s.cards.length - s.currentIndex), 0);
  const isCompleted = remaining === 0;

  const safeActions = (last.scenario.safeActions ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <div style={styles.page}>
      <div style={styles.shell}>
        <div style={styles.header}>
          <div style={styles.headerTitle}>Konfydence Challenge</div>
          <Link style={styles.smallLink} href={`/challenge/session/${sessionId}/results`}>
            Results
          </Link>
        </div>

        <div style={styles.card}>
          <div style={styles.meta}>
            Edition: <strong>{session.edition}</strong> • Section: <span style={styles.pill}>{last.section}</span>
          </div>

          <h2 style={{ marginTop: 0 }}>Feedback</h2>

          <div style={styles.grid}>
            <div>
              <div style={styles.label}>Your selection</div>
              <div style={styles.value}>{last.selectedAnswerKey}</div>
            </div>
            <div>
              <div style={styles.label}>Points earned</div>
              <div style={styles.value}>{last.score} / 4</div>
            </div>
          </div>

          <div style={{ marginTop: 14 }}>
            <div style={styles.label}>Safe actions</div>
            {safeActions.length ? (
              <ul style={styles.ul}>
                {safeActions.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            ) : (
              <div style={styles.muted}>—</div>
            )}
          </div>

          <div style={{ marginTop: 14 }}>
            <div style={styles.label}>Explanation</div>
            <div style={styles.text}>{last.explanation ?? "—"}</div>
          </div>

          {last.proTip ? (
            <div style={{ marginTop: 14 }}>
              <div style={styles.label}>Pro tip</div>
              <div style={styles.textStrong}>{last.proTip}</div>
            </div>
          ) : null}

          <div style={{ marginTop: 16 }}>
            <Link
              href={isCompleted ? `/challenge/session/${sessionId}/results` : `/challenge/session/${sessionId}`}
              style={styles.button}
            >
              {isCompleted ? "View results" : "Next scenario"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

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
  meta: { fontSize: 13, color: "#344a5e", marginBottom: 10 },
  pill: {
    display: "inline-flex",
    alignItems: "center",
    borderRadius: 999,
    padding: "6px 10px",
    border: "1px solid rgba(255,198,0,0.35)",
    background: "rgba(255,198,0,0.08)",
    fontWeight: 900,
    color: "#6a4b00",
  },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  label: { fontSize: 13, color: "#344a5e", marginBottom: 6 },
  value: { fontWeight: 950, fontSize: 20 },
  ul: { margin: 0, paddingLeft: 18, color: "#344a5e", lineHeight: 1.6 },
  muted: { color: "#344a5e" },
  text: { lineHeight: 1.55, color: "#344a5e" },
  textStrong: { lineHeight: 1.55, fontWeight: 900, color: "#344a5e" },
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
  },
};

