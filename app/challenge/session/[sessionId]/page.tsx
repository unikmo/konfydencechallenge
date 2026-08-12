import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { EDITION_LABELS } from "@/lib/challenge/labels";
import { getCurrentChallengeCard } from "@/lib/challenge/sessionGenerator";
import { SessionEventHooks, AnswerTrackerForm } from "@/components/SessionEventHooks";

type AnswerKey = "A" | "B" | "C";
type AnswerOption = { key: AnswerKey; text: string };

export default async function SessionPage({ params }: { params: { sessionId: string } }) {
  const sessionId = params.sessionId;

  const session = await prisma.challengeSession.findUnique({
    where: { id: sessionId },
    select: { id: true, edition: true, mode: true, status: true },
  });
  if (!session) notFound();

  if (session.status !== "IN_PROGRESS") {
    return (
      <main className="statePage">
        <section className="stateCard">
          <p className="overline">Round complete</p>
          <h1>Your result is ready.</h1>
          <Link href={`/challenge/session/${sessionId}/results`}>View results →</Link>
        </section>
        <style>{stateStyles}</style>
      </main>
    );
  }

  const current = await getCurrentChallengeCard({ sessionId });
  if (!current) {
    return (
      <main className="statePage">
        <section className="stateCard">
          <p className="overline">Round complete</p>
          <h1>Your result is ready.</h1>
          <Link href={`/challenge/session/${sessionId}/results`}>View results →</Link>
        </section>
        <style>{stateStyles}</style>
      </main>
    );
  }

  const scenario = await prisma.scenario.findUnique({
    where: { id: current.scenarioId },
    select: {
      id: true,
      title: true,
      prompt: true,
      answersA: true,
      answersB: true,
      answersC: true,
      hackKey: true,
    },
  });
  if (!scenario) notFound();

  const allAnswers: AnswerOption[] = [
    { key: "A", text: scenario.answersA },
    { key: "B", text: scenario.answersB },
    { key: "C", text: scenario.answersC },
  ];
  const answers = allAnswers.filter((answer) => answer.text.trim().length > 0);

  if (answers.length !== 3) {
    throw new Error(`Scenario ${scenario.id} is not playable: expected exactly three answers`);
  }

  const title = scenario.title ?? `Scenario ${current.currentIndex + 1}`;
  const questionNumber = current.currentIndex + 1;
  const progressPercent = Math.round((questionNumber / current.totalCards) * 100);
  const editionLabel = (EDITION_LABELS as Record<string, string>)[session.edition] ?? session.edition;
  const isDiagnostic = session.mode === "diagnostic";

  return (
    <main className="page">
      <section className="shell">
        <header className="topbar">
          <Link className="brand" href="/">Konfydence</Link>
          <div className="topMeta">
            <span>{editionLabel}</span>
            <Link href="/">Exit</Link>
          </div>
        </header>

        <div className="progressRow">
          <div>
            <span className="progressLabel">{isDiagnostic ? "FREE READINESS CHECK" : "FULL CHALLENGE"}</span>
            <strong>{String(questionNumber).padStart(2, "0")} / {String(current.totalCards).padStart(2, "0")}</strong>
          </div>
          <div className="progressTrack" aria-label={`Scenario ${questionNumber} of ${current.totalCards}`}>
            <span style={{ width: `${progressPercent}%` }} />
          </div>
          <small>{progressPercent}%</small>
        </div>

        <section className="scenario">
          <div className="scenarioHead">
            <span className="scenarioNo">SCENARIO {String(questionNumber).padStart(2, "0")}</span>
            <span className="pressure">THREE MOVES · ONE STRONGEST</span>
          </div>

          <h1>{title}</h1>
          <p className="prompt">{scenario.prompt}</p>
          <p className="instruction">What would you do <strong>next</strong>? Pick the move you would trust with your own money, identity or account.</p>

          <SessionEventHooks
            sessionId={sessionId}
            edition={session.edition}
            mode={session.mode}
            scenarioIndex={current.currentIndex}
            totalScenarios={current.totalCards}
            isFirstScenario={current.currentIndex === 0}
          />

          <AnswerTrackerForm sessionId={sessionId} scenarioIndex={current.currentIndex}>
            <fieldset>
              <legend className="srOnly">Choose your response</legend>
              <div className="answers">
                {answers.map(({ key, text }) => (
                  <label key={key} className="answer">
                    <input type="radio" name="selectedAnswerKey" value={key} required />
                    <span className="answerKey">{key}</span>
                    <span className="answerText">{text}</span>
                    <span className="choiceMark" aria-hidden="true">↗</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <input type="hidden" name="cardId" value={current.cardId} />
            <input type="hidden" name="scenarioId" value={scenario.id} />

            <div className="submitZone">
              <p>No trick wording. The strongest move is the one that breaks the scammer’s control of the next step.</p>
              <button type="submit">Lock in my move <span>→</span></button>
            </div>
          </AnswerTrackerForm>
        </section>
      </section>

      <style>{`
        :global(*){box-sizing:border-box}
        .page{min-height:100vh;background:#091522;color:#f8fafc;padding:0 22px 46px;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
        .shell{width:100%;max-width:900px;margin:0 auto}.topbar{height:72px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(255,255,255,.12)}
        .brand{color:white;text-decoration:none;font-weight:900;letter-spacing:-.03em}.topMeta{display:flex;align-items:center;gap:20px;color:#8fa1b1;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.06em}.topMeta a{color:#c8d2dc;text-decoration:none}
        .progressRow{display:grid;grid-template-columns:180px 1fr 42px;gap:16px;align-items:end;padding:29px 0 26px}.progressRow>div:first-child{display:flex;flex-direction:column;gap:4px}.progressLabel{font-size:9px;letter-spacing:.11em;font-weight:900;color:#7f93a5}.progressRow strong{font-size:14px}.progressTrack{height:3px;background:#273748;overflow:hidden;margin-bottom:5px}.progressTrack span{display:block;height:100%;background:#b8ff3d}.progressRow small{font-size:10px;color:#8597a7;text-align:right;margin-bottom:1px}
        .scenario{background:#fffdf8;color:#091522;border-radius:24px;padding:35px 39px 31px;box-shadow:0 24px 70px rgba(0,0,0,.22)}.scenarioHead{display:flex;justify-content:space-between;gap:14px;align-items:center;margin-bottom:32px}.scenarioNo,.pressure{font-size:9px;font-weight:900;letter-spacing:.11em}.scenarioNo{color:#d34b42}.pressure{color:#7a858c}
        h1{font-family:Georgia,"Times New Roman",serif;font-size:clamp(34px,5vw,49px);font-weight:500;letter-spacing:-.04em;line-height:1.02;margin:0 0 20px;max-width:720px}.prompt{font-size:17px;line-height:1.66;color:#2d3c48;margin:0;max-width:760px}.instruction{margin:18px 0 24px;color:#6b747b;font-size:12px;line-height:1.5}.instruction strong{color:#091522}
        fieldset{padding:0;margin:0;border:0}.srOnly{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}.answers{display:grid;gap:10px}.answer{position:relative;display:grid;grid-template-columns:38px 1fr 24px;gap:12px;align-items:center;min-height:72px;border:1px solid #d7d7d2;border-radius:13px;padding:13px 14px;cursor:pointer;background:white;transition:border-color .12s ease,background .12s ease,transform .12s ease}.answer:hover{border-color:#8094a3;transform:translateY(-1px)}.answer input{position:absolute;opacity:0;pointer-events:none}.answer:has(input:focus-visible){outline:3px solid #7fb8ff;outline-offset:2px}.answer:has(input:checked){border-color:#091522;background:#edf9dd;box-shadow:inset 4px 0 0 #b8ff3d}.answerKey{width:32px;height:32px;border:1px solid #c8ced2;border-radius:50%;display:grid;place-items:center;font-size:10px;font-weight:900}.answer:has(input:checked) .answerKey{background:#091522;color:white;border-color:#091522}.answerText{font-size:13px;line-height:1.48;font-weight:750}.choiceMark{color:#98a1a7;font-size:13px}.answer:has(input:checked) .choiceMark{color:#091522}
        .submitZone{border-top:1px solid #dcddd8;margin-top:24px;padding-top:20px;display:flex;align-items:center;justify-content:space-between;gap:20px}.submitZone p{font-size:10px;color:#788188;margin:0;max-width:350px;line-height:1.5}.submitZone button{border:0;border-radius:999px;background:#ff5b50;color:white;padding:14px 19px;font-weight:900;cursor:pointer;display:inline-flex;align-items:center;gap:18px;font-size:12px;min-height:48px}.submitZone button:hover{background:#e94e45}
        @media(max-width:640px){.page{padding:0 12px 20px}.topbar{height:60px;padding:0 4px}.topMeta span{display:none}.progressRow{grid-template-columns:1fr 38px;padding:20px 4px 18px}.progressRow>div:first-child{grid-column:1/3;flex-direction:row;justify-content:space-between;align-items:center}.scenario{border-radius:18px;padding:24px 17px 18px}.scenarioHead{margin-bottom:23px}.pressure{display:none}h1{font-size:clamp(31px,10vw,41px);margin-bottom:16px}.prompt{font-size:15px;line-height:1.58}.instruction{font-size:11px;margin:14px 0 19px}.answer{grid-template-columns:34px 1fr 18px;min-height:76px;padding:12px 10px;gap:9px}.answerKey{width:29px;height:29px}.answerText{font-size:12px}.submitZone{position:sticky;bottom:0;margin:20px -17px -18px;padding:13px 17px 15px;background:#fffdf8;z-index:3;box-shadow:0 -12px 25px rgba(9,21,34,.08)}.submitZone p{display:none}.submitZone button{width:100%;justify-content:space-between;min-height:52px}}
      `}</style>
    </main>
  );
}

const stateStyles = `
  .statePage{min-height:100vh;display:grid;place-items:center;background:#091522;padding:20px;font-family:Inter,system-ui,sans-serif}.stateCard{max-width:520px;background:#fffdf8;color:#091522;border-radius:22px;padding:35px}.overline{font-size:10px;font-weight:900;letter-spacing:.1em;color:#d34b42;text-transform:uppercase}.stateCard h1{font-family:Georgia,serif;font-size:40px;line-height:1;margin:14px 0 25px}.stateCard a{display:inline-flex;background:#ff5b50;color:white;text-decoration:none;border-radius:999px;padding:14px 18px;font-size:13px;font-weight:900}
`;
