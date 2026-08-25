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
    <main className="gamePage">
      <section className="gameShell">
        <header className="topbar">
          <Link href="/" className="brand" aria-label="Konfydence home">Konfydence</Link>
          <div className="topMeta"><span>{editionLabel}</span><i /> <span>{modeLabel}</span><Link href="/challenge">Exit</Link></div>
        </header>

        <div className="gameGrid">
          <aside className="rail">
            <div className="railTop"><small>SCENARIO</small><strong>{String(questionNumber).padStart(2, "0")}</strong><span>of {String(totalCards).padStart(2, "0")}</span></div>
            <div className="railTrack" aria-label={`${progressPercent}% complete`}><span style={{ height: `${progressPercent}%` }} /></div>
            <div className="railBottom"><b>{progressPercent}%</b><small>complete</small></div>
          </aside>

          <section className="decisionCard">
            <div className="cardChrome"><div><span className="statusDot" /> DECISION IN PROGRESS</div><span>THREE PLAUSIBLE MOVES · ONE STRONGEST</span></div>
            <div className="scenarioBody">
              <div className="scenarioNumber">{String(questionNumber).padStart(2, "0")}</div>
              <p className="overline">WHAT HAPPENS NEXT?</p>
              <h1>{title}</h1>
              <p className="prompt">{scenario.prompt}</p>
              <div className="ruleLine"><span>RULE</span><p>Choose the move you would trust with your own money, identity, account or safety.</p></div>
            </div>

            <SessionEventHooks sessionId={sessionId} edition={session.edition} mode={session.mode} scenarioIndex={current.currentIndex} totalScenarios={totalCards} isFirstScenario={current.currentIndex === 0} />

            <AnswerTrackerForm sessionId={sessionId} scenarioIndex={current.currentIndex}>
              <fieldset>
                <legend className="srOnly">Choose your response</legend>
                <div className="answerGrid">
                  {answers.map(({ key, text }, index) => (
                    <label className="answer" key={key}>
                      <input type="radio" name="selectedAnswerKey" value={key} required />
                      <span className="answerIndex">0{index + 1}</span>
                      <span className="answerKey">{key}</span>
                      <span className="answerText">{text}</span>
                      <span className="answerAction" aria-hidden="true">SELECT <b>↗</b></span>
                    </label>
                  ))}
                </div>
              </fieldset>
              <input type="hidden" name="cardId" value={current.cardId} />
              <input type="hidden" name="scenarioId" value={scenario.id} />
              <div className="submitBar">
                <div className="submitHint"><span>NO TRICK WORDING</span><p>The strongest move breaks the requester&apos;s control of what happens next.</p></div>
                <button type="submit"><span>Lock in my move</span><b>→</b></button>
              </div>
            </AnswerTrackerForm>
          </section>
        </div>
        <footer className="gameFooter"><span>Konfydence / Decision practice</span><span>Pause → verify → act</span></footer>
      </section>

      <style>{`
        :global(*){box-sizing:border-box}:global(body){margin:0;background:#e8e4dc}.gamePage{--ink:#171717;--paper:#fbfaf6;--cream:#f2efe8;--accent:#d9574c;--stone:#d9d3c8;--muted:#746f67;min-height:100vh;background:#e8e4dc;color:var(--ink);padding:0 24px 36px;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}.gameShell{width:min(1200px,100%);margin:0 auto}.topbar{height:78px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(23,23,23,.18)}.brand{font:400 25px Georgia,"Times New Roman",serif;color:var(--ink);text-decoration:none;letter-spacing:-.03em}.topMeta{display:flex;align-items:center;gap:13px;font-size:9px;letter-spacing:.09em;font-weight:800;color:#7c766e}.topMeta i{width:3px;height:3px;border-radius:50%;background:#9c968d}.topMeta a{color:var(--ink);text-decoration:none;border-left:1px solid rgba(23,23,23,.18);padding-left:15px}
        .gameGrid{display:grid;grid-template-columns:82px 1fr;gap:24px;padding-top:34px}.rail{min-height:690px;border-right:1px solid rgba(23,23,23,.18);padding:20px 18px 20px 0;display:flex;flex-direction:column;align-items:center}.railTop{display:flex;flex-direction:column;align-items:center}.railTop small,.railBottom small{font-size:7px;letter-spacing:.13em;color:#89837a;font-weight:900}.railTop strong{font:400 45px/1 Georgia,serif;margin-top:7px}.railTop>span{font-size:9px;color:#8f897f;margin-top:3px}.railTrack{width:1px;flex:1;background:#c8c2b7;margin:26px 0;position:relative;overflow:hidden}.railTrack span{position:absolute;left:0;right:0;bottom:0;background:var(--ink)}.railBottom{display:flex;flex-direction:column;align-items:center;gap:2px}.railBottom b{font-size:12px;color:var(--ink)}
        .decisionCard{background:var(--paper);color:var(--ink);overflow:hidden;border:1px solid rgba(23,23,23,.16);box-shadow:0 25px 65px rgba(30,27,22,.08)}.cardChrome{height:54px;border-bottom:1px solid #ded9d0;display:flex;align-items:center;justify-content:space-between;padding:0 30px;color:#807a72;font-size:8px;letter-spacing:.12em;font-weight:900}.cardChrome>div{display:flex;align-items:center;gap:8px}.statusDot{width:6px;height:6px;border-radius:50%;background:var(--accent)}.scenarioBody{padding:50px 56px 32px;position:relative;border-bottom:1px solid #ded9d0}.scenarioNumber{position:absolute;right:42px;top:20px;font:400 112px/1 Georgia,serif;color:#eeeae3;letter-spacing:-.07em;pointer-events:none}.overline{font-size:8px;letter-spacing:.14em;font-weight:900;color:#9b4f47;margin:0 0 14px}.scenarioBody h1{font:400 clamp(44px,5.2vw,70px)/.96 Georgia,"Times New Roman",serif;letter-spacing:-.055em;margin:0 0 24px;max-width:780px;position:relative}.prompt{font-size:17px;line-height:1.72;color:#4f4a44;max-width:820px;margin:0;position:relative}.ruleLine{display:grid;grid-template-columns:64px 1fr;gap:15px;margin-top:30px;align-items:start;max-width:720px}.ruleLine>span{font-size:8px;letter-spacing:.12em;font-weight:900;color:#8e887f;padding-top:3px}.ruleLine p{font-size:11px;line-height:1.55;color:#777168;margin:0}
        fieldset{margin:0;padding:0;border:0}.srOnly{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}.answerGrid{display:grid;grid-template-columns:repeat(3,1fr);background:#ded9d0;gap:1px}.answer{position:relative;min-height:220px;background:#fbfaf6;display:grid;grid-template-columns:32px 1fr;grid-template-rows:36px 1fr 28px;gap:11px;padding:25px 27px;cursor:pointer;transition:background .16s ease,box-shadow .16s ease}.answer:hover{background:#f5f2ec;z-index:1}.answer input{position:absolute;opacity:0;pointer-events:none}.answer:has(input:focus-visible){outline:3px solid #315f8f;outline-offset:-3px}.answer:has(input:checked){background:#ebe7de;box-shadow:inset 0 -4px 0 var(--ink)}.answerIndex{font-size:8px;font-weight:900;color:#9b958c;letter-spacing:.08em}.answerKey{grid-column:2;width:34px;height:34px;border:1px solid #bbb5ab;border-radius:50%;display:grid;place-items:center;font-size:10px;font-weight:900;justify-self:end;margin-top:-3px}.answer:has(input:checked) .answerKey{background:var(--ink);color:#fff;border-color:var(--ink)}.answerText{grid-column:1/3;font:400 20px/1.3 Georgia,serif;align-self:start}.answerAction{grid-column:1/3;align-self:end;font-size:8px;letter-spacing:.1em;color:#8d877f;font-weight:900;display:flex;align-items:center;justify-content:space-between}.answerAction b{font-size:14px;font-weight:400}.answer:has(input:checked) .answerAction{color:#3f3b36;font-size:0}.answer:has(input:checked) .answerAction:before{content:"SELECTED";font-size:8px}.answer:has(input:checked) .answerAction b{font-size:14px}
        .submitBar{min-height:100px;padding:21px 30px 21px 38px;background:#f1eee7;display:flex;align-items:center;justify-content:space-between;gap:28px}.submitHint span{font-size:7px;letter-spacing:.13em;font-weight:900;color:#9b4f47}.submitHint p{font-size:10px;line-height:1.45;color:#777168;margin:5px 0 0;max-width:410px}.submitBar button{border:0;border-radius:999px;background:var(--accent);color:#fff;min-width:230px;min-height:52px;padding:0 18px 0 21px;display:flex;align-items:center;justify-content:space-between;gap:18px;font-size:12px;font-weight:900;cursor:pointer}.submitBar button:hover{background:#c64c43}.submitBar button:focus-visible{outline:3px solid #315f8f;outline-offset:3px}.submitBar button b{font-size:17px}.gameFooter{display:flex;justify-content:space-between;padding:17px 4px 0;color:#8b857c;font-size:8px;letter-spacing:.09em;text-transform:uppercase}
        @media(max-width:900px){.gameGrid{grid-template-columns:1fr}.rail{min-height:auto;height:72px;display:grid;grid-template-columns:100px 1fr 70px;gap:15px;padding:12px 0;border-right:0;border-bottom:1px solid rgba(23,23,23,.18)}.railTop{flex-direction:row;gap:8px}.railTop small{display:none}.railTop strong{font-size:28px;margin:0}.railTrack{width:100%;height:1px;margin:0}.railTrack span{height:100%!important;width:${progressPercent}%;bottom:auto}.railBottom{align-items:flex-end}.answerGrid{grid-template-columns:1fr}.answer{min-height:150px}.scenarioBody{padding:40px 34px 27px}}
        @media(max-width:620px){.gamePage{padding:0 10px 18px}.topbar{height:62px;padding:0 4px}.brand{font-size:21px}.topMeta>span:first-child,.topMeta i{display:none}.gameGrid{padding-top:12px;gap:12px}.rail{height:58px;grid-template-columns:72px 1fr 58px;padding:9px 2px}.railTop strong{font-size:23px}.railTop>span{font-size:8px}.railBottom b{font-size:10px}.cardChrome{height:46px;padding:0 16px}.cardChrome>span{display:none}.scenarioBody{padding:30px 18px 22px}.scenarioNumber{font-size:78px;right:12px;top:10px}.scenarioBody h1{font-size:clamp(36px,11vw,49px);margin-bottom:16px}.prompt{font-size:15px;line-height:1.6}.ruleLine{grid-template-columns:52px 1fr;margin-top:20px}.answer{padding:19px;min-height:136px;grid-template-rows:28px 1fr 24px}.answerText{font-size:18px}.answerKey{width:30px;height:30px}.submitBar{position:sticky;bottom:0;z-index:4;padding:12px 14px;background:#f1eee7;min-height:72px}.submitHint{display:none}.submitBar button{width:100%;min-width:0;min-height:52px}.gameFooter{padding:11px 4px 0}.gameFooter span:first-child{display:none}}
        @media(prefers-reduced-motion:reduce){.answer{transition:none}}
      `}</style>
    </main>
  );
}

function CompleteState({ sessionId }: { sessionId: string }) {
  return (
    <main className="complete"><section><p>ROUND COMPLETE</p><h1>Your result is ready.</h1><Link href={`/challenge/session/${sessionId}/results`}>View my result <span>→</span></Link></section><style>{`:global(body){margin:0}.complete{min-height:100vh;background:#e8e4dc;display:grid;place-items:center;padding:20px;color:#171717;font-family:Inter,system-ui,sans-serif}.complete section{width:min(600px,100%);background:#fbfaf6;border:1px solid rgba(23,23,23,.16);padding:48px;box-shadow:0 25px 65px rgba(30,27,22,.08)}.complete p{font-size:9px;letter-spacing:.13em;font-weight:900;color:#9b4f47}.complete h1{font:400 52px/1 Georgia,serif;letter-spacing:-.045em;margin:15px 0 30px}.complete a{display:inline-flex;align-items:center;gap:22px;background:#d9574c;color:#fff;text-decoration:none;border-radius:999px;padding:15px 19px;font-size:12px;font-weight:900}`}</style></main>
  );
}
