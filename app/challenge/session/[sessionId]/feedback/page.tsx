import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function FeedbackPage({ params }: { params: { sessionId: string } }) {
  const sessionId = params.sessionId;

  const session = await prisma.challengeSession.findUnique({
    where: { id: sessionId },
    select: { id: true, edition: true, currentIndex: true },
  });

  if (!session) notFound();

  // The card just answered is the one immediately before the session's current pointer.
  const answeredOrderIndex = session.currentIndex - 1;
  if (answeredOrderIndex < 0) notFound();

  const card = await prisma.challengeSessionCard.findUnique({
    where: { sessionId_orderIndex: { sessionId, orderIndex: answeredOrderIndex } },
    select: {
      selectedAnswerKey: true,
      score: true,
      scenario: {
        select: {
          safeActions: true,
          explanation: true,
          answersA: true,
          answersB: true,
          answersC: true,
          answersD: true,
          scoresA: true,
          scoresB: true,
          scoresC: true,
          scoresD: true,
        },
      },
    },
  });

  if (!card || !card.selectedAnswerKey || card.score === null) notFound();

  const totalCards = await prisma.challengeSessionCard.count({ where: { sessionId } });
  const remaining = Math.max(0, totalCards - session.currentIndex);
  const isCompleted = remaining === 0;

  const reinforcementBucket = Math.max(0, Math.min(4, Math.trunc(card.score)));

  const answerText: Record<"A" | "B" | "C" | "D", string> = {
    A: card.scenario.answersA,
    B: card.scenario.answersB,
    C: card.scenario.answersC,
    D: card.scenario.answersD,
  };

  const answerScore: Record<"A" | "B" | "C" | "D", number> = {
    A: card.scenario.scoresA,
    B: card.scenario.scoresB,
    C: card.scenario.scoresC,
    D: card.scenario.scoresD,
  };

  const safeActions = (card.scenario.safeActions ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter((item): item is "A" | "B" | "C" | "D" => ["A", "B", "C", "D"].includes(item));

  const selectedAnswerKey = card.selectedAnswerKey as "A" | "B" | "C" | "D";

  // Best single safe option, ranked by score — used for the 1pt / 2-3pt "SAFER OPTION" (singular).
  const bestSafeAction = [...safeActions].sort((a, b) => answerScore[b] - answerScore[a])[0] ?? null;

  // Spec §7 (Screen 3 — Feedback card): exact copy per point bucket.
  const reinforcement = (() => {
    switch (reinforcementBucket) {
      case 4:
        return {
          tone: "good" as const,
          title: "Good call.",
          scoreLabel: "4 points",
          body: "You chose the safest option and avoided the pressure trap.",
          saferMode: "none" as const,
        };
      case 3:
      case 2:
        return {
          tone: "risk" as const,
          title: "Close — but not safest.",
          scoreLabel: `${reinforcementBucket} points`,
          body: "This might work, but it still leaves room for impersonation, pressure, or a risky shortcut.",
          saferMode: "single" as const,
        };
      case 1:
        return {
          tone: "risk" as const,
          title: "Still risky.",
          scoreLabel: "1 point",
          body: "You noticed something, but the action still leaves you exposed.",
          saferMode: "single" as const,
        };
      default:
        return {
          tone: "risk" as const,
          title: "Risky choice.",
          scoreLabel: "0 points",
          body: "Scammers count on urgency, trust, or fear to make you act before verifying.",
          saferMode: "all" as const,
        };
    }
  })();

  const isStrongChoice = reinforcement.tone === "good";
  const saferKeysToShow = reinforcement.saferMode === "all" ? safeActions : reinforcement.saferMode === "single" && bestSafeAction ? [bestSafeAction] : [];

  return (
    <main className="page">
      <section className="shell">
        <header className="header">
          <strong>Konfydence Challenge</strong>
          <Link className="headerLink" href={`/challenge/session/${sessionId}/results`}>
            Results
          </Link>
        </header>

        <section className="card">
          <div className="logoArea">
            <div className="logoCircle" aria-hidden="true">K</div>
          </div>

          <div className="statusRow">
            <div className={isStrongChoice ? "status good" : "status risk"}>
              <div className="statusIcon" aria-hidden="true">
                {isStrongChoice ? (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" fill="#22C55E" />
                    <path d="M7.5 12.5l3 3 6-6.5" stroke="#08111F" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  </svg>
                ) : (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path d="M12 3l10 18H2L12 3z" fill="#FF4D5E" />
                    <rect x="11" y="9" width="2" height="6" rx="1" fill="#08111F" />
                    <rect x="11" y="17" width="2" height="2" rx="1" fill="#08111F" />
                  </svg>
                )}
              </div>
              <h1 className="title">{reinforcement.title}</h1>
              <p className="body">{reinforcement.body}</p>
            </div>
            <div className={isStrongChoice ? "scoreBox good" : "scoreBox risk"}>{reinforcement.scoreLabel}</div>
          </div>

          <div className="section">
            <p className="label">Your answer</p>
            <div className="answerBox selected">
              <span>{selectedAnswerKey}</span>
              <strong>{answerText[selectedAnswerKey]}</strong>
            </div>
          </div>

          <div className="learnBox">
            <p className="label">WHY THIS MATTERS</p>
            <p className="learnText">{card.scenario.explanation ?? "No explanation available."}</p>
          </div>

          {saferKeysToShow.length ? (
            <div className="section">
              <div className="subLabel">{reinforcement.saferMode === "all" ? "SAFER OPTIONS" : "SAFER OPTION"}</div>
              <div className="safeGrid">
                {saferKeysToShow.map((key) => (
                  <div key={key} className="answerBox safe">
                    <span>{key}</span>
                    <strong>{answerText[key]}</strong>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <div className="cta">
            <Link
              className="button"
              href={isCompleted ? `/challenge/session/${sessionId}/results` : `/challenge/session/${sessionId}`}
            >
              {isCompleted ? "View results" : "Next Question"}
            </Link>
          </div>
        </section>
      </section>

      <style>{`
        .page {
          min-height: 100vh;
          background: #08111f;
          color: #ffffff;
          padding: 24px 16px;
          display: flex;
          justify-content: center;
        }

        .shell {
          width: 100%;
          max-width: 820px;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          font-size: 16px;
        }

        .headerLink {
          color: #dbeafe;
          text-decoration: none;
          font-weight: 800;
        }

        .card {
          background: #0b1f3a;
          color: #ffffff;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 18px 40px rgba(0, 0, 0, 0.28);
          border: 3px solid #ffb31d;
        }

        .logoArea {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 14px;
        }

        .logoCircle {
          width: 44px;
          height: 44px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 179, 29, 0.15);
          border: 2px solid rgba(255, 179, 29, 0.65);
          font-weight: 950;
          color: #ffb31d;
          letter-spacing: 0.02em;
        }

        .statusRow {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          align-items: flex-start;
          margin-bottom: 16px;
        }

        .status {
          flex: 1;
          border-radius: 14px;
          padding: 16px;
          border: 1px solid rgba(255, 179, 29, 0.35);
          border-left-width: 4px;
        }

        .statusIcon {
          margin-bottom: 8px;
        }

        .status.good {
          background: rgba(236, 253, 245, 0.08);
          border-left-color: #22c55e;
        }

        .status.risk {
          background: rgba(255, 247, 237, 0.06);
          border-left-color: #ff4d5e;
        }

        .title {
          margin: 0 0 8px;
          font-size: 24px;
          line-height: 1.15;
          letter-spacing: -0.02em;
        }

        .body {
          margin: 0;
          font-size: 15px;
          line-height: 1.5;
          color: rgba(255, 255, 255, 0.88);
          font-weight: 700;
        }

        .scoreBox {
          min-width: 100px;
          text-align: center;
          border-radius: 14px;
          background: rgba(255, 179, 29, 0.12);
          border: 2px solid rgba(255, 179, 29, 0.65);
          padding: 12px;
          color: #ffffff;
          font-weight: 950;
          font-size: 16px;
        }

        .scoreBox.good {
          background: rgba(34, 197, 94, 0.14);
          border-color: rgba(34, 197, 94, 0.65);
        }

        .scoreBox.risk {
          background: rgba(255, 77, 94, 0.14);
          border-color: rgba(255, 77, 94, 0.65);
        }

        .section {
          margin-top: 16px;
        }

        .label {
          margin: 0 0 8px;
          font-size: 13px;
          font-weight: 950;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: #dbeafe;
        }

        .subLabel {
          font-size: 13px;
          font-weight: 950;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: #ffb31d;
          margin-bottom: 10px;
        }

        .answerBox {
          display: grid;
          grid-template-columns: 34px 1fr;
          gap: 12px;
          align-items: center;
          border-radius: 14px;
          padding: 14px;
          border: 1px solid rgba(255, 179, 29, 0.35);
          background: rgba(11, 31, 58, 0.4);
        }

        .answerBox span {
          width: 28px;
          height: 28px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          font-weight: 950;
          background: rgba(255, 179, 29, 0.18);
          color: #ffb31d;
        }

        .answerBox strong {
          font-weight: 850;
        }

        .selected {
          border-color: rgba(255, 179, 29, 0.95);
          background: rgba(255, 179, 29, 0.08);
          box-shadow: 0 0 0 3px rgba(255, 179, 29, 0.12);
        }

        .safeGrid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 10px;
        }

        .safe {
          border-color: rgba(255, 179, 29, 0.55);
        }

        .learnBox {
          margin-top: 16px;
          border-radius: 14px;
          padding: 16px;
          border: 1px solid rgba(255, 179, 29, 0.35);
          background: rgba(255, 255, 255, 0.03);
        }

        .learnText {
          margin: 0;
          line-height: 1.55;
          color: rgba(255, 255, 255, 0.92);
          font-weight: 800;
        }

        .cta {
          margin-top: 18px;
        }

        .button {
          width: 100%;
          display: inline-flex;
          justify-content: center;
          align-items: center;
          border-radius: 16px;
          background: rgba(255, 179, 29, 0.12);
          border: 2px solid rgba(255, 179, 29, 0.85);
          color: #ffffff;
          padding: 13px 16px;
          font-weight: 950;
          text-decoration: none;
        }

        .button:hover {
          background: rgba(255, 179, 29, 0.18);
        }

        @media (max-width: 640px) {
          .card {
            padding: 18px;
          }

          .statusRow {
            flex-direction: column;
            align-items: stretch;
          }

          .title {
            font-size: 21px;
          }

          .scoreBox {
            width: 100%;
          }
        }
      `}</style>
    </main>
  );
}
