import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

const SECTION_ORDER = ["A", "B", "C", "D"] as const;
const ANSWER_KEYS = ["A", "B", "C", "D"] as const;

export default async function SessionPage({ params }: { params: { sessionId: string } }) {
  const sessionId = params.sessionId;

  const session = await prisma.challengeSession.findUnique({
    where: { id: sessionId },
    select: { id: true, edition: true, status: true },
  });

  if (!session) notFound();

  if (session.status !== "IN_PROGRESS") {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <p style={{ marginTop: 0 }}>This session is completed.</p>
          <Link style={styles.link} href={`/challenge/session/${sessionId}/results`}>
            View results
          </Link>
        </div>
      </div>
    );
  }

  const sections = await prisma.challengeSessionSection.findMany({
    where: { sessionId },
    select: {
      section: true,
      currentIndex: true,
      cards: { select: { scenarioId: true, orderIndex: true }, orderBy: { orderIndex: "asc" } },
    },
  });

  const currentSection = SECTION_ORDER.find((s) => {
    const row = sections.find((x) => x.section === s);
    return row ? row.currentIndex < row.cards.length : false;
  });

  if (!currentSection) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <p style={{ marginTop: 0 }}>No remaining scenarios. Continue to results.</p>
          <Link style={styles.link} href={`/challenge/session/${sessionId}/results`}>
            Results
          </Link>
        </div>
      </div>
    );
  }

  const sectionRow = sections.find((x) => x.section === currentSection)!;
  const idx = sectionRow.currentIndex;
  const card = sectionRow.cards[idx];

  const scenario = await prisma.scenario.findUnique({
    where: { id: card.scenarioId },
    select: {
      id: true,
      title: true,
      prompt: true,
      answersA: true,
      answersB: true,
      answersC: true,
      answersD: true,
    },
  });

  if (!scenario) notFound();

  const progress = { current: idx + 1, total: sectionRow.cards.length };

  const answers: Record<(typeof ANSWER_KEYS)[number], string> = {
    A: scenario.answersA,
    B: scenario.answersB,
    C: scenario.answersC,
    D: scenario.answersD,
  };

  return (
    <div style={styles.page}>
      <div style={styles.shell}>
        <div style={styles.header}>
          <div style={styles.headerTitle}>Konfydence Challenge</div>
          <Link style={styles.smallLink} href="/challenge">
            Choose edition
          </Link>
        </div>

        <div style={styles.card}>
          <div style={styles.meta}>
            Edition: <strong style={{ color: "#0b1b2b" }}>{session.edition}</strong> • Section:{" "}
            <span style={styles.pill}>{currentSection}</span> • Progress: {progress.current}/{progress.total}
          </div>

          <h2 style={{ marginTop: 0, marginBottom: 8 }}>{scenario.title ?? `Scenario ${idx + 1}`}</h2>

          <div style={styles.prompt}>{scenario.prompt}</div>

          <form action={`/challenge/session/${sessionId}/submit`}>
            <div style={styles.answers}>
              {ANSWER_KEYS.map((k) => (
                <label key={k} style={styles.answer}>
                  <input type="radio" name="selectedAnswerKey" value={k} required style={styles.hidden} />
                  <div style={styles.answerKey}>{k}</div>
                  <div style={styles.answerText}>{answers[k]}</div>
                </label>
              ))}
            </div>

            <button type="submit" style={styles.submit}>
              Submit answer
            </button>

            <input type="hidden" name="scenarioId" value={scenario.id} />
            <input type="hidden" name="section" value={currentSection} />
          </form>
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
    gap: 8,
    borderRadius: 999,
    padding: "6px 10px",
    border: "1px solid rgba(255,198,0,0.35)",
    background: "rgba(255,198,0,0.08)",
    fontWeight: 900,
    color: "#6a4b00",
  },
  prompt: { fontSize: 16, lineHeight: 1.6, margin: "8px 0 14px" },
  answers: { display: "grid", gridTemplateColumns: "1fr", gap: 10 },
  answer: {
    display: "grid",
    gridTemplateColumns: "48px 1fr",
    gap: 10,
    padding: "12px 12px",
    borderRadius: 12,
    border: "1px solid rgba(11,27,43,0.14)",
    background: "#fff",
    cursor: "pointer",
    alignItems: "start",
  },
  answerKey: { fontWeight: 950, color: "#6a4b00", marginTop: 2 },
  answerText: { fontWeight: 800, color: "#0b1b2b" },
  hidden: { display: "none" },
  submit: {
    marginTop: 16,
    width: "100%",
    padding: "12px 14px",
    borderRadius: 12,
    background: "#ffc600",
    border: "1px solid rgba(0,0,0,0.05)",
    fontWeight: 950,
    cursor: "pointer",
    color: "#0b1b2b",
  },
  link: { color: "#0b1b2b", fontWeight: 900 },
};

