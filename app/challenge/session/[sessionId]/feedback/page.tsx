import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { HACK_LABELS, type HackTrigger } from "@/lib/challenge/labels";
import { HackIcon } from "@/components/illustrations/HackIcon";

type AnswerKey = "A" | "B" | "C";

const pressureLesson: Record<HackTrigger, { question: string; reflex: string }> = {
  H: { question: "Did urgency try to take away your thinking time?", reflex: "Pause the clock. Verify before the deadline becomes your decision-maker." },
  A: { question: "Did an official name, role or institution make the request feel pre-verified?", reflex: "Authority is a claim until you verify it through a channel you already trust." },
  C: { question: "Did familiarity make the request feel safer than the evidence justified?", reflex: "Comfort is context, not proof. Confirm the person, account or destination independently." },
  K: { question: "Did you stop before the irreversible click, transfer, code, credential or reply?", reflex: "Stop at the critical action moment. Leave the request, then verify from a clean starting point." },
};

export default async function FeedbackPage({ params }: { params: { sessionId: string } }) {
  const { sessionId } = params;
  const session = await prisma.challengeSession.findUnique({ where: { id: sessionId }, select: { id: true, edition: true, currentIndex: true } });
  if (!session) notFound();
  const answeredOrderIndex = session.currentIndex - 1;
  if (answeredOrderIndex < 0) notFound();

  const card = await prisma.challengeSessionCard.findUnique({
    where: { sessionId_orderIndex: { sessionId, orderIndex: answeredOrderIndex } },
    select: {
      selectedAnswerKey: true,
      score: true,
      scenario: { select: { hackKey: true, explanation: true, proTip: true, answersA: true, answersB: true, answersC: true, scoresA: true, scoresB: true, scoresC: true } },
    },
  });
  if (!card || !card.selectedAnswerKey || card.score === null) notFound();
  if (!["A", "B", "C"].includes(card.selectedAnswerKey)) notFound();

  const totalCards = await prisma.challengeSessionCard.count({ where: { sessionId } });
  const remaining = Math.max(0, totalCards - session.currentIndex);
  const isCompleted = remaining === 0;
  const selectedKey = card.selectedAnswerKey as AnswerKey;
  const hackKey = (["H", "A", "C", "K"].includes(card.scenario.hackKey ?? "") ? card.scenario.hackKey : "K") as HackTrigger;
  const answers: Record<AnswerKey, string> = { A: card.scenario.answersA, B: card.scenario.answersB, C: card.scenario.answersC };
  const scores: Record<AnswerKey, number> = { A: card.scenario.scoresA, B: card.scenario.scoresB, C: card.scenario.scoresC };
  const strongestKey = (Object.entries(scores) as Array<[AnswerKey, number]>).sort((a,b) => b[1] - a[1])[0]?.[0];
  const score = Math.max(0, Math.min(4, Math.trunc(card.score)));

  const feedback = {
    4: { label: "STRONG MOVE", title: "You broke the pressure chain.", body: "You took control of the next step away from the requester and put verification back in your hands.", tone: "strong", mark: "✓" },
    3: { label: "SAFE MOVE", title: "Protected — but not the cleanest move.", body: "You reduced the risk. One option verified the situation with even less dependence on the original request.", tone: "safe", mark: "↗" },
    2: { label: "PARTLY PROTECTED", title: "Cautious, but the door stayed open.", body: "You added friction, but one important part still depended on a claim, channel or person you had not independently verified.", tone: "caution", mark: "!" },
    1: { label: "RISK REMAINS", title: "It felt careful. It was not proof.", body: "The move sounded sensible but still left the requester in control of what happened next.", tone: "risk", mark: "!" },
    0: { label: "PRESSURE WON", title: "That is the move the scam needed.", body: "The request still controlled the link, payment, credential or next action. That is where the risk compounds.", tone: "risk", mark: "×" },
  }[score as 0|1|2|3|4];

  const explanation = card.scenario.explanation ?? "Verify the request through a channel you opened independently.";
  const proTip = card.scenario.proTip ?? pressureLesson[hackKey].reflex;
  const showStrongest = score < 4 && strongestKey && strongestKey !== selectedKey;
  const nextHref = isCompleted ? `/challenge/session/${sessionId}/results` : `/challenge/session/${sessionId}`;

  return (
    <main className="feedbackPage">
      <section className="shell">
        <header className="topbar"><Link className="brand" href="/"><span>K</span><b>Konfydence</b></Link><div><span>{session.currentIndex} / {totalCards}</span><Link href="/">Exit</Link></div></header>

        <section className={`resultCard ${feedback.tone}`}>
          <div className="resultHero">
            <div className="resultMark">{feedback.mark}</div>
            <div className="resultCopy"><p>{feedback.label}</p><h1>{feedback.title}</h1><span>{feedback.body}</span></div>
            <div className="scoreDial"><strong>{score}</strong><small>/4</small></div>
          </div>

          <div className="pressureBlock">
            <div className="pressureIcon"><HackIcon trigger={hackKey} size={21} color="#06131f" /></div>
            <div><p className="mini">H.A.C.K. SIGNAL · {HACK_LABELS[hackKey].short.toUpperCase()}</p><h2>{pressureLesson[hackKey].question}</h2><p>{pressureLesson[hackKey].reflex}</p></div>
          </div>

          <div className="resultGrid">
            <article><p className="mini">YOUR MOVE</p><div className="move"><span>{selectedKey}</span><strong>{answers[selectedKey]}</strong></div></article>
            <article className="why"><p className="mini">WHY IT MATTERS</p><p>{explanation}</p></article>
            <article className="rule"><p className="mini">KEEP THIS RULE</p><strong>{proTip}</strong></article>
          </div>

          {showStrongest ? <div className="strongest"><div><p className="mini">STRONGEST MOVE</p><span>Use this as the decision pattern next time.</span></div><div className="move best"><span>{strongestKey}</span><strong>{answers[strongestKey]}</strong></div></div> : null}

          <div className="nextBar"><p>{isCompleted ? "Your pressure-pattern result is ready." : `${remaining} decision${remaining === 1 ? "" : "s"} remaining.`}</p><Link href={nextHref}>{isCompleted ? "See my H.A.C.K. profile" : "Next pressure test"}<span>→</span></Link></div>
        </section>
      </section>

      <style>{`
        :global(*){box-sizing:border-box}:global(body){margin:0;background:#06131f}.feedbackPage{--ink:#06131f;--paper:#fbfaf6;--coral:#ff5b50;--lime:#b9ff38;min-height:100vh;background:radial-gradient(circle at 78% 8%,rgba(50,91,127,.25),transparent 30%),linear-gradient(180deg,#06131f,#091a2a);color:#fff;padding:0 24px 36px;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}.shell{width:min(1060px,100%);margin:0 auto}.topbar{height:78px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(255,255,255,.12)}.brand{display:inline-flex;align-items:center;gap:9px;color:#fff;text-decoration:none}.brand>span{width:30px;height:30px;border:1px solid rgba(255,255,255,.65);border-radius:50%;display:grid;place-items:center;font-size:11px}.brand b{font-size:13px}.topbar>div{display:flex;gap:16px;align-items:center;font-size:9px;letter-spacing:.1em;color:#8ea1b0}.topbar a{color:#fff;text-decoration:none}
        .resultCard{margin-top:34px;background:var(--paper);color:var(--ink);border-radius:30px;overflow:hidden;box-shadow:0 40px 90px rgba(0,0,0,.32);border-top:6px solid var(--coral)}.resultCard.strong{border-top-color:var(--lime)}.resultCard.safe{border-top-color:#7fb8ff}.resultCard.caution{border-top-color:#efb23c}.resultHero{min-height:285px;padding:40px 44px;display:grid;grid-template-columns:66px 1fr 106px;gap:25px;align-items:start;border-bottom:1px solid #dedfdc}.resultMark{width:56px;height:56px;border-radius:50%;background:#0b1c2c;color:#fff;display:grid;place-items:center;font-size:25px;font-family:Georgia,serif}.strong .resultMark{background:#5b8e11}.safe .resultMark{background:#286b9f}.caution .resultMark{background:#a56b00}.risk .resultMark{background:#c9483f}.resultCopy>p,.mini{margin:0 0 10px;font-size:8px;letter-spacing:.13em;font-weight:900;color:#818b91}.strong .resultCopy>p{color:#5f8c1b}.safe .resultCopy>p{color:#2e75a8}.caution .resultCopy>p{color:#a76e00}.risk .resultCopy>p{color:#c94940}.resultCopy h1{font-family:Georgia,"Times New Roman",serif;font-weight:500;font-size:clamp(42px,5vw,64px);line-height:.98;letter-spacing:-.045em;margin:0 0 17px;max-width:700px}.resultCopy>span{display:block;max-width:650px;color:#5e6c75;font-size:14px;line-height:1.65}.scoreDial{width:96px;height:96px;border-radius:50%;background:#071522;color:var(--lime);display:flex;align-items:center;justify-content:center;position:relative}.scoreDial strong{font-size:33px}.scoreDial small{position:absolute;right:18px;bottom:19px;color:#8da1af;font-size:9px}
        .pressureBlock{display:grid;grid-template-columns:52px 1fr;gap:17px;padding:23px 28px;background:#eef8df;border-bottom:1px solid #cfe2ad}.pressureIcon{width:46px;height:46px;border-radius:50%;background:var(--lime);display:grid;place-items:center}.pressureBlock h2{font-family:Georgia,serif;font-size:23px;line-height:1.18;font-weight:500;margin:0 0 6px}.pressureBlock p:not(.mini){font-size:11px;line-height:1.55;color:#596a50;margin:0}.resultGrid{display:grid;grid-template-columns:1.15fr 1fr .9fr;background:#e6e4dd;gap:1px}.resultGrid article{background:#fff;padding:28px;min-height:190px}.move{display:grid;grid-template-columns:38px 1fr;gap:13px;align-items:center}.move>span{width:36px;height:36px;border-radius:50%;background:#071522;color:#fff;display:grid;place-items:center;font-size:10px;font-weight:900}.move strong{font-family:Georgia,serif;font-size:18px;line-height:1.3;font-weight:500}.why>p:last-child{font-size:13px;line-height:1.65;color:#596872;margin:24px 0 0}.rule{background:#071522!important;color:#fff}.rule .mini{color:#8397a7}.rule>strong{display:block;font-family:Georgia,serif;font-size:21px;line-height:1.3;font-weight:500;margin-top:24px}.strongest{padding:23px 28px;display:grid;grid-template-columns:.55fr 1.45fr;gap:30px;align-items:center;background:#f6f3eb;border-top:1px solid #dedfdc}.strongest>div:first-child>span{font-size:10px;color:#6e7a69}.move.best>span{background:#5b8e11}.nextBar{min-height:86px;padding:18px 26px 18px 30px;background:#f7f4ed;border-top:1px solid #dedfdc;display:flex;align-items:center;justify-content:space-between;gap:25px}.nextBar p{font-size:10px;color:#738087;margin:0}.nextBar a{min-width:210px;min-height:50px;padding:0 18px;border-radius:999px;background:var(--coral);color:#fff;text-decoration:none;font-size:12px;font-weight:900;display:flex;align-items:center;justify-content:space-between}
        @media(max-width:800px){.resultHero{grid-template-columns:55px 1fr}.scoreDial{grid-column:1/3;width:72px;height:72px}.resultGrid{grid-template-columns:1fr}.resultGrid article{min-height:auto}.strongest{grid-template-columns:1fr}.resultCopy h1{font-size:44px}}
        @media(max-width:620px){.feedbackPage{padding:0 10px 18px}.topbar{height:60px;padding:0 4px}.resultCard{margin-top:14px;border-radius:20px}.resultHero{padding:27px 18px 22px;grid-template-columns:44px 1fr;gap:12px}.resultMark{width:42px;height:42px;font-size:19px}.resultCopy h1{font-size:36px}.resultCopy>span{font-size:12px}.scoreDial{width:62px;height:62px}.pressureBlock{grid-template-columns:42px 1fr;padding:18px}.pressureIcon{width:40px;height:40px}.resultGrid article{padding:22px 18px}.strongest{padding:20px 18px}.nextBar{position:sticky;bottom:0;z-index:4;padding:12px 14px}.nextBar p{display:none}.nextBar a{width:100%}}
      `}</style>
    </main>
  );
}
