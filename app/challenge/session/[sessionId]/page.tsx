import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { EDITION_LABELS } from "@/lib/challenge/labels";
import { getCurrentChallengeCard } from "@/lib/challenge/sessionGenerator";
import { SessionEventHooks, AnswerTrackerForm } from "@/components/SessionEventHooks";

type AnswerKey = "A" | "B" | "C";
type AnswerOption = { key: AnswerKey; text: string };

export default async function SessionPage(props: { params: Promise<{ sessionId: string }> }) {
  const params = await props.params;
  const { sessionId } = params;

  const session = await prisma.challengeSession.findUnique({
    where: { id: sessionId },
    select: { id: true, edition: true, mode: true, status: true },
  });
  if (!session) notFound();

  if (session.status !== "IN_PROGRESS") return <CompleteState sessionId={sessionId} />;

  const current = await getCurrentChallengeCard({ sessionId });
  if (!current) return <CompleteState sessionId={sessionId} />;

  const scenario = await prisma.scenario.findUnique({
    where: { id: current.scenarioId },
    select: {
      id: true,
      title: true,
      prompt: true,
      answersA: true,
      answersB: true,
      answersC: true,
    },
  });
  if (!scenario) notFound();

  const allAnswers: AnswerOption[] = [
    { key: "A", text: scenario.answersA },
    { key: "B", text: scenario.answersB },
    { key: "C", text: scenario.answersC },
  ];
  const answers = allAnswers.filter((answer) => answer.text.trim().length > 0);
  if (answers.length !== 3) throw new Error(`Scenario ${scenario.id} is not playable: expected exactly three answers`);

  const questionNumber = current.currentIndex + 1;
  const totalCards = current.totalCards;
  const progressPercent = Math.round((questionNumber / totalCards) * 100);
  const editionLabel = (EDITION_LABELS as Record<string, string>)[session.edition] ?? session.edition;
  const modeLabel = session.mode === "diagnostic" ? "READINESS CHECK" : "FULL CHALLENGE";
  const title = scenario.title ?? `Scenario ${questionNumber}`;

  return (
    <main className="kg-page">
      <div className="kg-shell">
        <header className="kg-top">
          <Link href="/" className="k-wordmark" aria-label="Konfydence home">Konfydence</Link>
          <div className="kg-top-meta"><span>{editionLabel}</span><i /><span>{modeLabel}</span><Link href="/">Exit</Link></div>
        </header>
      </div>

      <div className="kg-narrow kg-game">
        <div className="kg-progress">
          <span className="kg-progress-label">Scenario <b>{String(questionNumber).padStart(2, "0")}</b> / {String(totalCards).padStart(2, "0")}</span>
          <span className="kg-progress-track" aria-label={`${progressPercent}% complete`}><span style={{ width: `${progressPercent}%` }} /></span>
          <span className="kg-progress-pct">{progressPercent}%</span>
        </div>

        <section className="kg-card">
          <div className="kg-card-chrome">
            <span className="kg-live"><span className="kg-dot" /> Live decision</span>
            <span>Three moves · one strongest</span>
          </div>

          <div className="kg-scenario">
            <p className="k-kicker">What happens next?</p>
            <h1>{title}</h1>
            <p className="kg-prompt">{scenario.prompt}</p>
            <div className="kg-rule"><span>Rule</span><p>Choose the move you would trust with your own money, identity, account or safety.</p></div>
          </div>

          <SessionEventHooks
            sessionId={sessionId}
            edition={session.edition}
            mode={session.mode}
            scenarioIndex={current.currentIndex}
            totalScenarios={totalCards}
            isFirstScenario={current.currentIndex === 0}
          />

          <AnswerTrackerForm sessionId={sessionId} scenarioIndex={current.currentIndex}>
            <fieldset style={{ margin: 0, padding: 0, border: 0 }}>
              <legend className="srOnly">Choose your response</legend>
              <div className="kg-answers">
                {answers.map(({ key, text }) => (
                  <label className="kg-answer" key={key}>
                    <input type="radio" name="selectedAnswerKey" value={key} required />
                    <span className="kg-answer-key">{key}</span>
                    <span className="kg-answer-text">{text}</span>
                    <span className="kg-answer-pick" aria-hidden="true">Select</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <input type="hidden" name="cardId" value={current.cardId} />
            <input type="hidden" name="scenarioId" value={scenario.id} />

            <div className="kg-submit">
              <div className="kg-submit-hint"><span>No trick wording</span><p>The strongest move breaks the requester&apos;s control of what happens next.</p></div>
              <button type="submit"><span>Lock in my move</span><b aria-hidden="true">→</b></button>
            </div>
          </AnswerTrackerForm>
        </section>

        <footer className="kg-game-footer"><span>Konfydence · Decision practice</span><span>Pause → verify → act</span></footer>
      </div>

      <style>{`
        .srOnly{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
      `}</style>
    </main>
  );
}

function CompleteState({ sessionId }: { sessionId: string }) {
  return (
    <main className="kg-state">
      <section className="kg-state-card">
        <p className="k-kicker">Round complete</p>
        <h1>Your result is ready.</h1>
        <Link className="k-button" href={`/challenge/session/${sessionId}/results`}>View my result →</Link>
      </section>
    </main>
  );
}
