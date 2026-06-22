import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { EDITION_LABELS, SECTION_LABELS } from "@/lib/challenge/labels";

const SCORE_TEXT: Record<0 | 1 | 2 | 3 | 4, { eyebrow: string; title: string; tone: "good" | "risk" }> = {
  4: { tone: "good", eyebrow: "✅ Good call", title: "✅ Good call. You chose the safest path." },
  3: { tone: "good", eyebrow: "✅ Solid instinct", title: "✅ Solid instinct. One safer step would make this stronger." },
  2: { tone: "risk", eyebrow: "⚠️ Understandable choice", title: "⚠️ Understandable choice, but this is where scams create pressure." },
  1: { tone: "risk", eyebrow: "⚠️ Understandable choice", title: "⚠️ Understandable choice, but this is where scams create pressure." },
  0: { tone: "risk", eyebrow: "⚠️ This is the exact trap", title: "⚠️ This is the exact trap scammers want people to fall into." },
};


export default async function FeedbackPage({ params }: { params: { sessionId: string } }) {
  const sessionId = params.sessionId;

  const last = await prisma.challengeAnswerResponse.findFirst({
    where: { sessionId },
    orderBy: { createdAt: "desc" },
    select: {
      selectedAnswerKey: true,
      score: true,
      section: true,
      explanation: true,
      proTip: true,
      scenario: {
        select: {
          safeActions: true,
          answersA: true,
          answersB: true,
          answersC: true,
          answersD: true,
        },
      },
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
      currentIndex: true,
      cards: { select: { id: true } },
    },
  });

  const remaining = sections.reduce(
    (sum, section) => sum + Math.max(0, section.cards.length - section.currentIndex),
    0
  );

  const isCompleted = remaining === 0;

  const reinforcementBucket = Math.max(0, Math.min(4, Math.trunc(last.score)));

  const answerText: Record<"A" | "B" | "C" | "D", string> = {
    A: last.scenario.answersA,
    B: last.scenario.answersB,
    C: last.scenario.answersC,
    D: last.scenario.answersD,
  };

  const safeActions = (last.scenario.safeActions ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter((item): item is "A" | "B" | "C" | "D" => ["A", "B", "C", "D"].includes(item));

  const reinforcement = (() => {
    switch (reinforcementBucket) {
      case 4:
        return {
          tone: "good" as const,
          eyebrow: "✅ Good call",
          title: "✅ Good call. You chose the safest path.",
        };
      case 3:
        return {
          tone: "good" as const,
          eyebrow: "✅ Solid instinct",
          title: "✅ Solid instinct. One safer step would make this stronger.",
        };
      case 1:
      case 2:
        return {
          tone: "risk" as const,
          eyebrow: "⚠️ Understandable choice",
          title: "⚠️ Understandable choice, but this is where scams create pressure.",
        };
      default:
        return {
          tone: "risk" as const,
          eyebrow: "⚠️ Exact trap",
          title: "⚠️ This is the exact trap scammers want people to fall into.",
        };
    }
  })();

  const isStrongChoice = reinforcement.tone === "good";








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
          <div className="meta">
            <span>{session.edition}</span>
            <span>Section {last.section}</span>
            <span>{remaining} left</span>
          </div>

          <div className={isStrongChoice ? "status good" : "status risk"}>
            <div>
              <p className="eyebrow">{isStrongChoice ? "Good decision" : "Risky decision"}</p>
              <h1>{isStrongChoice ? "You chose a safer action." : "This choice could expose you."}</h1>
            </div>
            <div className="score">{last.score}/4</div>
          </div>

          <div className="section">
            <p className="label">Your answer</p>
            <div className="answerBox selected">
              <span>{last.selectedAnswerKey}</span>
              <strong>{answerText[last.selectedAnswerKey as "A" | "B" | "C" | "D"]}</strong>
            </div>
          </div>

          <div className="section">
            <p className="label">Safer action{safeActions.length > 1 ? "s" : ""}</p>
            <div className="safeGrid">
              {safeActions.map((key) => (
                <div key={key} className="answerBox safe">
                  <span>{key}</span>
                  <strong>{answerText[key]}</strong>
                </div>
              ))}
            </div>
          </div>

          <div className="learnBox">
            <p className="label">Why this matters</p>
            <p>{last.explanation ?? "No explanation available."}</p>
          </div>

          {last.proTip ? (
            <div className="tipBox">
              <p className="label">Pro tip</p>
              <p>{last.proTip}</p>
            </div>
          ) : null}

          <Link
            className="button"
            href={isCompleted ? `/challenge/session/${sessionId}/results` : `/challenge/session/${sessionId}`}
          >
            {isCompleted ? "View results" : "Continue"}
          </Link>
        </section>
      </section>

      <style>{`
        .page {
          min-height: 100vh;
          background: #0b1f3a;
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
          background: #ffffff;
          color: #0f172a;
          border-radius: 14px;
          padding: 24px;
          box-shadow: 0 18px 40px rgba(0, 0, 0, 0.22);
        }

        .meta {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 18px;
        }

        .meta span {
          border: 1px solid #bfdbfe;
          background: #eff6ff;
          color: #1d4ed8;
          border-radius: 999px;
          padding: 5px 10px;
          font-size: 13px;
          font-weight: 800;
        }

        .status {
          display: flex;
          justify-content: space-between;
          gap: 18px;
          align-items: center;
          border-radius: 12px;
          padding: 18px;
          margin-bottom: 20px;
        }

        .status.good {
          background: #ecfdf5;
          border: 1px solid #bbf7d0;
        }

        .status.risk {
          background: #fff7ed;
          border: 1px solid #fed7aa;
        }

        .eyebrow {
          margin: 0 0 4px;
          font-size: 13px;
          font-weight: 900;
          color: #1d4ed8;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        h1 {
          margin: 0;
          font-size: 26px;
          line-height: 1.15;
          letter-spacing: -0.02em;
        }

        .score {
          min-width: 70px;
          text-align: center;
          border-radius: 12px;
          background: #0b1f3a;
          color: #ffffff;
          padding: 12px;
          font-size: 22px;
          font-weight: 950;
        }

        .section {
          margin-top: 16px;
        }

        .label {
          margin: 0 0 8px;
          color: #475569;
          font-size: 13px;
          font-weight: 900;
        }

        .answerBox {
          display: grid;
          grid-template-columns: 34px 1fr;
          gap: 12px;
          align-items: center;
          border-radius: 10px;
          padding: 13px 14px;
          line-height: 1.35;
        }

        .answerBox span {
          width: 28px;
          height: 28px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          font-weight: 950;
        }

        .selected {
          border: 1px solid #cbd5e1;
          background: #f8fafc;
        }

        .selected span {
          background: #e2e8f0;
          color: #0f172a;
        }

        .safe {
          border: 1px solid #bfdbfe;
          background: #eff6ff;
        }

        .safe span {
          background: #1d4ed8;
          color: #ffffff;
        }

        .safeGrid {
          display: grid;
          gap: 10px;
        }

        .learnBox,
        .tipBox {
          margin-top: 16px;
          border-radius: 12px;
          padding: 16px;
          line-height: 1.55;
        }

        .learnBox {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
        }

        .tipBox {
          background: #eff6ff;
          border: 1px solid #bfdbfe;
        }

        .learnBox p,
        .tipBox p {
          margin: 0;
        }

        .button {
          margin-top: 18px;
          width: 100%;
          display: inline-flex;
          justify-content: center;
          border-radius: 10px;
          background: #1d4ed8;
          color: #ffffff;
          padding: 13px 16px;
          font-weight: 950;
          text-decoration: none;
        }

        .button:hover {
          background: #1e40af;
        }

        @media (max-width: 640px) {
          .card {
            padding: 18px;
          }

          .status {
            align-items: flex-start;
            flex-direction: column;
          }

          h1 {
            font-size: 23px;
          }

          .score {
            width: 100%;
          }
        }
      `}</style>
    </main>
  );
}