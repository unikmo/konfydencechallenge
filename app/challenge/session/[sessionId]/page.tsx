import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { EDITION_LABELS } from "@/lib/challenge/labels";
import { getCurrentChallengeCard } from "@/lib/challenge/sessionGenerator";
import { SessionEventHooks, AnswerTrackerForm } from "@/components/SessionEventHooks";

type AnswerKey = "A" | "B" | "C";
type AnswerOption = { key: AnswerKey; text: string };

export default async function SessionPage({ params }: { params: { sessionId: string } }) {
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
      <div className="noise" />
      <section className="gameShell">
        <header className="topbar">
          <Link href="/" className="brand" aria-label="Konfydence home"><span>K</span><b>Konfydence</b></Link>
          <div className="topMeta"><span>{editionLabel}</span><i /> <span>{modeLabel}</span><Link href="/">Exit</Link></div>
        </header>

        <div className="gameGrid">
          <aside className="rail">
            <div className="railTop">
              <small>SCENARIO</small>
              <strong>{String(questionNumber).padStart(2, "0")}</strong>
              <span>of {String(totalCards).padStart(2, "0")}</span>
            </div>
            <div className="railTrack" aria-label={`${progressPercent}% complete`}><span style={{ height: `${progressPercent}%` }} /></div>
            <div className="railBottom"><b>{progressPercent}%</b><small>complete</small></div>
          </aside>

          <section className="decisionCard">
            <div className="cardChrome">
              <div><span className="statusDot" /> LIVE DECISION</div>
              <span>THREE MOVES · ONE STRONGEST</span>
            </div>

            <div className="scenarioBody">
              <div className="scenarioNumber">{String(questionNumber).padStart(2, "0")}</div>
              <p className="overline">WHAT HAPPENS NEXT?</p>
              <h1>{title}</h1>
              <p className="prompt">{scenario.prompt}</p>
              <div className="ruleLine"><span>RULE</span><p>Choose the move you would trust with your own money, identity, account or safety.</p></div>
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
        :global(*){box-sizing:border-box}:global(body){margin:0;background:#06131f}.gamePage{--ink:#06131f;--navy:#0d2237;--paper:#fbfaf6;--cream:#f2efe7;--coral:#ff5b50;--lime:#b9ff38;--muted:#788690;min-height:100vh;background:radial-gradient(circle at 75% 5%,rgba(50,91,127,.24),transparent 28%),linear-gradient(180deg,#06131f 0%,#091a2a 100%);color:#fff;padding:0 24px 36px;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;position:relative;overflow:hidden}.noise{position:fixed;inset:0;pointer-events:none;opacity:.04;background-image:radial-gradient(rgba(255,255,255,.7) .6px,transparent .6px);background-size:6px 6px}.gameShell{position:relative;z-index:1;width:min(1180px,100%);margin:0 auto}.topbar{height:78px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(255,255,255,.12)}.brand{display:inline-flex;align-items:center;gap:9px;color:#fff;text-decoration:none}.brand>span{width:30px;height:30px;border:1px solid rgba(255,255,255,.65);border-radius:50%;display:grid;place-items:center;font-size:11px}.brand b{font-size:13px;letter-spacing:-.02em}.topMeta{display:flex;align-items:center;gap:13px;font-size:9px;letter-spacing:.09em;font-weight:850;color:#91a3b1}.topMeta i{width:3px;height:3px;border-radius:50%;background:#536879}.topMeta a{color:#fff;text-decoration:none;border-left:1px solid rgba(255,255,255,.18);padding-left:15px}
        .gameGrid{display:grid;grid-template-columns:92px 1fr;gap:24px;padding-top:34px}.rail{min-height:690px;border:1px solid rgba(255,255,255,.12);border-radius:22px;padding:20px 18px;display:flex;flex-direction:column;align-items:center;background:rgba(255,255,255,.025);backdrop-filter:blur(12px)}.railTop{display:flex;flex-direction:column;align-items:center}.railTop small,.railBottom small{font-size:7px;letter-spacing:.13em;color:#718798;font-weight:900}.railTop strong{font-family:Georgia,serif;font-weight:500;font-size:45px;line-height:1;margin-top:7px}.railTop>span{font-size:9px;color:#7d92a2;margin-top:3px}.railTrack{width:2px;flex:1;background:rgba(255,255,255,.12);margin:26px 0;position:relative;overflow:hidden}.railTrack span{position:absolute;left:0;right:0;bottom:0;background:var(--lime)}.railBottom{display:flex;flex-direction:column;align-items:center;gap:2px}.railBottom b{font-size:12px;color:var(--lime)}
        .decisionCard{background:var(--paper);color:var(--ink);border-radius:30px;box-shadow:0 40px 90px rgba(0,0,0,.32);overflow:hidden;border:1px solid rgba(255,255,255,.65)}.cardChrome{height:54px;border-bottom:1px solid #dedfdc;display:flex;align-items:center;justify-content:space-between;padding:0 28px;color:#78838a;font-size:8px;letter-spacing:.12em;font-weight:900}.cardChrome>div{display:flex;align-items:center;gap:8px;color:#42515b}.statusDot{width:7px;height:7px;border-radius:50%;background:var(--lime);box-shadow:0 0 0 4px rgba(185,255,56,.18)}.scenarioBody{padding:44px 52px 28px;position:relative;border-bottom:1px solid #dedfdc}.scenarioNumber{position:absolute;right:42px;top:22px;font-family:Georgia,serif;font-size:108px;line-height:1;color:#eeeae2;letter-spacing:-.07em;pointer-events:none}.overline{font-size:8px;letter-spacing:.14em;font-weight:900;color:#d44b42;margin:0 0 14px}.scenarioBody h1{font-family:Georgia,"Times New Roman",serif;font-weight:500;font-size:clamp(42px,5vw,66px);line-height:.98;letter-spacing:-.045em;margin:0 0 22px;max-width:760px;position:relative}.prompt{font-size:17px;line-height:1.68;color:#34444f;max-width:820px;margin:0;position:relative}.ruleLine{display:grid;grid-template-columns:64px 1fr;gap:15px;margin-top:28px;align-items:start;max-width:700px}.ruleLine>span{font-size:8px;letter-spacing:.12em;font-weight:900;color:#90999f;padding-top:3px}.ruleLine p{font-size:11px;line-height:1.55;color:#707b82;margin:0}
        fieldset{margin:0;padding:0;border:0}.srOnly{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}.answerGrid{display:grid;grid-template-columns:repeat(3,1fr);background:#ebe8e1;gap:1px}.answer{position:relative;min-height:210px;background:#fff;display:grid;grid-template-columns:32px 1fr;grid-template-rows:36px 1fr 28px;gap:11px;padding:23px 25px;cursor:pointer;transition:background .16s ease,transform .16s ease,box-shadow .16s ease}.answer:hover{background:#faf8f2;z-index:1;box-shadow:0 15px 40px rgba(7,19,31,.08)}.answer input{position:absolute;opacity:0;pointer-events:none}.answer:has(input:focus-visible){outline:3px solid #77aeee;outline-offset:-3px}.answer:has(input:checked){background:#eef8df;box-shadow:inset 0 -5px 0 var(--lime)}.answerIndex{font-size:8px;font-weight:900;color:#9aa2a7;letter-spacing:.08em}.answerKey{grid-column:2;width:34px;height:34px;border:1px solid #c7cecf;border-radius:50%;display:grid;place-items:center;font-size:10px;font-weight:900;justify-self:end;margin-top:-3px}.answer:has(input:checked) .answerKey{background:var(--ink);color:#fff;border-color:var(--ink)}.answerText{grid-column:1/3;font-family:Georgia,serif;font-size:20px;line-height:1.26;font-weight:500;align-self:start}.answerAction{grid-column:1/3;align-self:end;font-size:8px;letter-spacing:.1em;color:#8d969b;font-weight:900;display:flex;align-items:center;justify-content:space-between}.answerAction b{font-size:14px;font-weight:400}.answer:has(input:checked) .answerAction{color:#334814}.answer:has(input:checked) .answerAction:before{content:"SELECTED"}.answer:has(input:checked) .answerAction{font-size:0}.answer:has(input:checked) .answerAction:before{font-size:8px}.answer:has(input:checked) .answerAction b{font-size:14px}
        .submitBar{min-height:98px;padding:20px 28px 20px 36px;background:#f7f4ed;display:flex;align-items:center;justify-content:space-between;gap:28px}.submitHint span{font-size:7px;letter-spacing:.13em;font-weight:900;color:#d54c42}.submitHint p{font-size:10px;line-height:1.45;color:#758087;margin:5px 0 0;max-width:390px}.submitBar button{border:0;border-radius:999px;background:var(--coral);color:#fff;min-width:230px;min-height:52px;padding:0 18px 0 21px;display:flex;align-items:center;justify-content:space-between;gap:18px;font-size:12px;font-weight:900;cursor:pointer;box-shadow:0 10px 25px rgba(255,91,80,.18)}.submitBar button:hover{background:#e94e45;transform:translateY(-1px)}.submitBar button b{font-size:17px}.gameFooter{display:flex;justify-content:space-between;padding:16px 5px 0;color:#647c8e;font-size:8px;letter-spacing:.09em;text-transform:uppercase}
        @media(max-width:900px){.gameGrid{grid-template-columns:1fr}.rail{min-height:auto;height:72px;display:grid;grid-template-columns:100px 1fr 70px;gap:15px;padding:12px 16px}.railTop{flex-direction:row;gap:8px}.railTop small{display:none}.railTop strong{font-size:28px;margin:0}.railTrack{width:100%;height:2px;margin:0}.railTrack span{height:100%!important;width:${progressPercent}%;bottom:auto}.railBottom{align-items:flex-end}.answerGrid{grid-template-columns:1fr}.answer{min-height:150px}.scenarioBody{padding:38px 34px 25px}}
        @media(max-width:620px){.gamePage{padding:0 10px 18px}.topbar{height:60px;padding:0 4px}.topMeta>span:first-child,.topMeta i{display:none}.gameGrid{padding-top:14px;gap:12px}.rail{height:58px;border-radius:16px;grid-template-columns:72px 1fr 58px;padding:9px 12px}.railTop strong{font-size:23px}.railTop>span{font-size:8px}.railBottom b{font-size:10px}.decisionCard{border-radius:20px}.cardChrome{height:46px;padding:0 16px}.cardChrome>span{display:none}.scenarioBody{padding:28px 18px 21px}.scenarioNumber{font-size:78px;right:12px;top:10px}.scenarioBody h1{font-size:clamp(36px,11vw,47px);margin-bottom:16px}.prompt{font-size:15px;line-height:1.58}.ruleLine{grid-template-columns:52px 1fr;margin-top:20px}.answer{padding:18px;min-height:132px;grid-template-rows:28px 1fr 24px}.answerText{font-size:18px}.answerKey{width:30px;height:30px}.submitBar{position:sticky;bottom:0;z-index:4;padding:12px 14px;background:#f7f4ed;min-height:72px}.submitHint{display:none}.submitBar button{width:100%;min-width:0;min-height:52px}.gameFooter{padding:11px 4px 0}.gameFooter span:first-child{display:none}}
      `}</style>
    </main>
  );
}

function CompleteState({ sessionId }: { sessionId: string }) {
  return (
    <main className="complete"><section><p>ROUND COMPLETE</p><h1>Your result is ready.</h1><Link href={`/challenge/session/${sessionId}/results`}>View my result <span>→</span></Link></section><style>{`:global(body){margin:0}.complete{min-height:100vh;background:#06131f;display:grid;place-items:center;padding:20px;color:#06131f;font-family:Inter,system-ui,sans-serif}.complete section{width:min(560px,100%);background:#fffdf8;border-radius:28px;padding:42px;box-shadow:0 35px 80px rgba(0,0,0,.3)}.complete p{font-size:9px;letter-spacing:.13em;font-weight:900;color:#d54c42}.complete h1{font-family:Georgia,serif;font-size:48px;font-weight:500;line-height:1;margin:15px 0 28px}.complete a{display:inline-flex;align-items:center;gap:18px;background:#ff5b50;color:#fff;text-decoration:none;border-radius:999px;padding:15px 19px;font-size:12px;font-weight:900}`}</style></main>
  );
}
