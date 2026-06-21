import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { computeChallengeTotals } from "@/lib/scoring/scoringEngine";
import type { ChallengeEdition } from "@/lib/challenge/sessionGenerator";

export default async function CertificatePage({ params }: { params: { sessionId: string } }) {
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

  const completedAll = sections.every((s) => s.currentIndex >= s.cards.length);
  const certificateEligible = completedAll && totals.pass;

  if (!certificateEligible) {
    return (
      <div style={styles.page}>
        <div style={styles.shell}>
          <div style={styles.card}>
            <h2 style={{ marginTop: 0 }}>Certificate locked</h2>
            <p style={styles.p}>
              Complete all sections and reach the passing score to unlock your certificate.
            </p>
            <Link style={styles.secondary} href={`/challenge/session/${sessionId}/results`}>
              Back to results
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const completionDate = session.completedAt ? session.completedAt.toISOString().slice(0, 10) : "—";

  return (
    <div style={styles.page}>
      <div style={styles.shell}>
        <div style={styles.card}>
          <div style={styles.header}>
            <div style={styles.title}>Konfydence Challenge</div>
            <div style={styles.sub}>Certificate of Completion</div>
          </div>

          <div style={styles.body}>
            <div style={styles.line}>
              Name: <strong>Session Participant</strong>
            </div>
            <div style={styles.line}>
              Edition: <strong>{session.edition}</strong>
            </div>
            <div style={styles.line}>
              Score: <strong>{totals.totalPercent.toFixed(0)}%</strong>
            </div>
            <div style={styles.line}>
              Result level: <strong>{totals.level}</strong>
            </div>
            <div style={styles.line}>
              Completion date: <strong>{completionDate}</strong>
            </div>
            <div style={styles.line}>
              Certificate ID: <strong>{sessionId}</strong>
            </div>

            <div style={styles.disclaimer}>
              “This certificate confirms completion of Konfydence Challenge awareness training. It does not guarantee protection from scams.”
            </div>
          </div>

          <Link style={styles.secondary} href={`/challenge/session/${sessionId}/results`}>
            Back to results
          </Link>
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
  card: {
    background: "white",
    color: "#0b1b2b",
    borderRadius: 14,
    padding: 20,
    boxShadow: "0 14px 40px rgba(0,0,0,0.25)",
    minHeight: 420,
  },
  header: { borderBottom: "1px solid rgba(11,27,43,0.12)", paddingBottom: 14, marginBottom: 14 },
  title: { fontSize: 22, fontWeight: 1000 },
  sub: { marginTop: 6, color: "#344a5e", fontWeight: 800 },
  body: { display: "grid", gap: 10 },
  line: { fontSize: 15, color: "#0b1b2b" },
  disclaimer: {
    marginTop: 18,
    background: "rgba(255,198,0,0.08)",
    border: "1px solid rgba(255,198,0,0.25)",
    padding: 12,
    borderRadius: 12,
    color: "#344a5e",
    lineHeight: 1.6,
    fontWeight: 700,
  },
  p: { color: "#344a5e", lineHeight: 1.6 },
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
    marginTop: 12,
  },
};

