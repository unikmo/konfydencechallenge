import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { EDITION_LABELS } from "@/lib/challenge/labels";
import { getCurrentChallengeCard } from "@/lib/challenge/sessionGenerator";
import { SessionEventHooks, AnswerTrackerForm } from "@/components/SessionEventHooks";
import { getScenarioInteraction } from "@/lib/challenge/interactionTypes";

const ANSWER_KEYS = ["A", "B", "C", "D"] as const;

const MODE_LABEL: Record<string, string> = {
  diagnostic: "Free diagnostic",
  full: "Full challenge",
};

export default async function SessionPage({ params }: { params: { sessionId: string } }) {
  const sessionId = params.sessionId;

  const session = await prisma.challengeSession.findUnique({
    where: { id: sessionId },
    select: { id: true, edition: true, mode: true, status: true },
  });

  if (!session) notFound();

  if (session.status !== "IN_PROGRESS") {
    return (
      <main className="page">
        <section className="card">
          <p>This session is completed.</p>
          <Link className="link" href={`/challenge/session/${sessionId}/results`}>
            View results
          </Link>
        </section>
      </main>
    );
  }

  const current = await getCurrentChallengeCard({ sessionId });

  if (!current) {
    return (
      <main className="page">
        <section className="card">
          <p>No remaining scenarios. Continue to results.</p>
          <Link className="link" href={`/challenge/session/${sessionId}/results`}>
            Results
          </Link>
        </section>
      </main>
    );
  }

  const scenario = await prisma.scenario.findUnique({
    where: { id: current.scenarioId },
    select: {
      id: true,
      externalId: true,
      title: true,
      prompt: true,
      answersA: true,
      answersB: true,
      answersC: true,
      answersD: true,
    },
  });

  if (!scenario) notFound();

  const interaction = getScenarioInteraction(scenario.externalId);
  const completionPrompt = interaction.type === "completion"
    ? scenario.prompt.replace(/[.!?]\\s*$/, "") + " - safest next move: ____"
    : scenario.prompt;

  const answers = {
    A: scenario.answersA,
    B: scenario.answersB,
    C: scenario.answersC,
    D: scenario.answersD,
  };

  const questionNumber = current.currentIndex + 1;
  const progressPercent =
    current.totalCards > 0 ? Math.max(0, Math.min(100, (current.currentIndex / current.totalCards) * 100)) : 0;

  return (
    <main className="page">
      <section className="shell">
        <header className="header">
          <strong>Konfydence Challenge</strong>
          <Link className="navLink" href="/challenge">
            Choose edition
          </Link>
        </header>

        <section className="card">
          <div className="meta">
            <span className="badgeEdition">
              {(EDITION_LABELS as Record<string, string>)[session.edition] ?? session.edition}
            </span>
            <span className="badgeMode">{MODE_LABEL[session.mode] ?? session.mode}</span>
            <span className="badgeProgress">
              Question {questionNumber} of {current.totalCards}
            </span>
          </div>

          <div className="progressWrap">
            <div className="progressTop">
              <span className="progressText">Progress</span>
              <span className="progressText">{Math.round(progressPercent)}%</span>
            </div>
            <div className="progressBar" aria-label="Challenge progress">
              <div className="progressFill" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>

          <h1>{scenario.title ?? `Scenario ${questionNumber}`}</h1>

          <div className="interactionMeta">
            {interaction.type === "completion" ? "Complete the safer next move" : "Choose your response"}
          </div>
          <p className="prompt">{completionPrompt}</p>
          {interaction.lightLine ? <p className="lightLine">{interaction.lightLine}</p> : null}

          <SessionEventHooks
            sessionId={sessionId}
            edition={session.edition}
            mode={session.mode}
            scenarioIndex={current.currentIndex}
            totalScenarios={current.totalCards}
            isFirstScenario={current.currentIndex === 0}
          />

          <AnswerTrackerForm sessionId={sessionId} scenarioIndex={current.currentIndex}>
            <div className="answers">
              {ANSWER_KEYS.map((key) => (
                <label key={key} className="answer">
                  <input type="radio" name="selectedAnswerKey" value={key} required />
                  <span className="answerKey">{key}</span>
                  <span className="answerText">{answers[key]}</span>
                </label>
              ))}
            </div>

            <input type="hidden" name="cardId" value={current.cardId} />
            <input type="hidden" name="scenarioId" value={scenario.id} />

            <button type="submit">Submit answer</button>
          </AnswerTrackerForm>
        </section>
      </section>

      <style>{`
        .page {
          min-height: 100vh;
          background: #f4f7fb; color: #102344;
          padding: 24px 16px;
          display: flex;
          justify-content: center;
        }

        .shell {
          width: 100%;
          max-width: 860px;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          font-size: 16px;
        }

        .navLink,
        .link {
          color: #365477;
          font-weight: 700;
          text-decoration: none;
        }

        .card {
          background: #ffffff;
          color: #0f172a;
          border-radius: 14px;
          padding: 24px;
          box-shadow: 0 12px 30px rgba(16, 35, 68, 0.1);
        }

        .meta {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 14px;
          font-size: 13px;
          color: #475569;
        }

        .meta span {
          border: 1px solid #bfdbfe;
          background: #eff6ff;
          color: #035494;
          border-radius: 999px;
          padding: 5px 10px;
          font-weight: 800;
        }

        .progressWrap {
          margin: 10px 0 18px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 12px 14px;
        }

        .progressTop {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          justify-content: space-between;
          margin-bottom: 10px;
        }

        .progressText {
          font-size: 13px;
          font-weight: 900;
          color: #0f172a;
        }

        .progressBar {
          height: 10px;
          background: #e2e8f0;
          border-radius: 999px;
          overflow: hidden;
        }

        .progressFill {
          height: 100%;
          background: #ffb31d;
          border-radius: 999px;
          transition: width 180ms ease;
        }

        h1 {
          margin: 0 0 10px;
          font-size: 28px;
          line-height: 1.15;
          letter-spacing: -0.02em;
        }

        .prompt {
          margin: 0 0 18px;
          font-size: 17px;
          line-height: 1.55;
          color: #0f172a;
        }

        .interactionMeta {
          margin: 0 0 7px;
          color: #12639d;
          font-size: 12px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: .04em;
        }

        .lightLine {
          margin: -7px 0 16px;
          color: #b76500;
          font-size: 13px;
          font-weight: 800;
        }

        .answers {
          display: grid;
          gap: 10px;
        }

        .answer {
          display: grid;
          grid-template-columns: 34px 1fr;
          gap: 12px;
          align-items: center;
          border: 1px solid #cbd5e1;
          border-radius: 10px;
          padding: 13px 14px;
          cursor: pointer;
          background: #ffffff;
          transition: border-color 120ms ease, background 120ms ease, box-shadow 120ms ease;
        }

        .answer:hover {
          border-color: #035494;
          background: #eff6ff;
        }

        .answer:has(input:checked) {
          border-color: #035494;
          background: #dbeafe;
          box-shadow: 0 0 0 3px rgba(3, 84, 148, 0.16);
        }

        .answer input {
          position: absolute;
          opacity: 0;
          pointer-events: none;
        }

        .answerKey {
          width: 28px;
          height: 28px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: #eff6ff;
          color: #035494;
          font-weight: 900;
        }

        .answer:has(input:checked) .answerKey {
          background: #035494;
          color: #ffffff;
        }

        .answerText {
          font-weight: 700;
          line-height: 1.35;
        }

        button {
          width: 100%;
          margin-top: 16px;
          border: 0;
          border-radius: 10px;
          background: #ffb31d;
          color: #08111f;
          padding: 13px 16px;
          font-weight: 900;
          cursor: pointer;
        }

        button:hover {
          background: #e6a119;
        }

        @media (max-width: 640px) {
          .page {
            padding: 14px;
          }

          .card {
            padding: 18px;
          }

          h1 {
            font-size: 24px;
          }
        }
      `}</style>
    </main>
  );
}
