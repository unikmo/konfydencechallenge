import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

type AnswerKey = "A" | "B" | "C";

export default async function FeedbackPage({ params }: { params: { sessionId: string } }) {
  const sessionId = params.sessionId;
  const session = await prisma.challengeSession.findUnique({
    where: { id: sessionId },
    select: { id: true, edition: true, currentIndex: true },
  });
  if (!session) notFound();

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
          proTip: true,
          answersA: true,
          answersB: true,
          answersC: true,
          scoresA: true,
          scoresB: true,
          scoresC: true,
        },
      },
    },
  });

  if (!card || !card.selectedAnswerKey || card.score === null) notFound();
  if (!["A", "B", "C"].includes(card.selectedAnswerKey)) notFound();

  const totalCards = await prisma.challengeSessionCard.count({ where: { sessionId } });
  const remaining = Math.max(0, totalCards - session.currentIndex);
  const isCompleted = remaining === 0;
  const selectedKey = card.selectedAnswerKey as AnswerKey;

  const answers: Record<AnswerKey, string> = {
    A: card.scenario.answersA,
    B: card.scenario.answersB,
    C: card.scenario.answersC,
  };
  const scores: Record<AnswerKey, number> = {
    A: card.scenario.scoresA,
    B: card.scenario.scoresB,
    C: card.scenario.scoresC,
  };

  const strongestKey = (Object.entries(scores) as Array<[AnswerKey, number]>)
    .sort((a, b) => b[1] - a[1])[0]?.[0];

  const score = Math.max(0, Math.min(4, Math.trunc(card.score)));
  const feedback = {
    4: { label: "STRONG MOVE", title: "You broke the pressure chain.", body: "That move takes control of the next step away from the requester and puts verification back in your hands.", tone: "strong" },
    3: { label: "SAFE MOVE", title: "Good call. There is an even cleaner move.", body: "You protected yourself. The strongest option simply verifies with less dependence on the original request.", tone: "safe" },
    2: { label: "PARTLY PROTECTED", title: "Cautious—but the door is still open.", body: "You reduced some risk, but one important part still depends on a channel, claim or person you have not independently verified.", tone: "caution" },
    1: { label: "RISK REMAINS", title: "The move feels careful. It is not proof.", body: "The action adds friction without actually proving who controls the request or destination.", tone: "risk" },
    0: { label: "PRESSURE WON", title: "That is exactly the move the scam needs.", body: "The request still controls the link, payment, credential or next action. That is where the risk compounds.", tone: "risk" },
  }[score as 0 | 1 | 2 | 3 | 4];

  const explanation = card.scenario.explanation ?? "Verify the request through a channel you opened independently.";
  const proTip = card.scenario.proTip ?? "Pause. Leave the request. Verify independently.";
  const showStrongest = score < 4 && strongestKey && strongestKey !== selectedKey;
  const nextHref = isCompleted ? `/challenge/session/${sessionId}/results` : `/challenge/session/${sessionId}`;

  return (
    <main className="page">
      <section className="shell">
        <header className="topbar">
          <Link href="/" className="brand">Konfydence</Link>
          <span>{session.currentIndex} / {totalCards}</span>
        </header>

        <section className={`feedback ${feedback.tone}`}>
          <div className="resultHead">
            <div>
              <p className="label">{feedback.label}</p>
              <h1>{feedback.title}</h1>
              <p className="body">{feedback.body}</p>
            </div>
            <div className="score">{score}<span>/4</span></div>
          </div>

          <div className="divider" />

          <div className="decision">
            <p className="mini">YOUR MOVE</p>
            <div className="decisionCard">
              <span>{selectedKey}</span>
              <strong>{answers[selectedKey]}</strong>
            </div>
          </div>

          <div className="lessonGrid">
            <article>
              <p className="mini">WHY IT MATTERS</p>
              <p>{explanation}</p>
            </article>
            <article className="rule">
              <p className="mini">KEEP THIS RULE</p>
              <strong>{proTip}</strong>
            </article>
          </div>

          {showStrongest ? (
            <div className="strongest">
              <p className="mini">STRONGEST MOVE</p>
              <div className="decisionCard best">
                <span>{strongestKey}</span>
                <strong>{answers[strongestKey]}</strong>
              </div>
            </div>
          ) : null}

          <div className="next">
            <p>{isCompleted ? "Your pressure-pattern result is ready." : `${remaining} decision${remaining === 1 ? "" : "s"} remaining.`}</p>
            <Link href={nextHref}>{isCompleted ? "See my pressure pattern" : "Give me the next one"} <span>→</span></Link>
          </div>
        </section>
      </section>

      <style>{`
        :global(*){box-sizing:border-box}.page{min-height:100vh;background:#091522;color:white;padding:0 20px 40px;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}.shell{max-width:820px;margin:auto}.topbar{height:70px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(255,255,255,.12)}.brand{color:white;text-decoration:none;font-weight:900;letter-spacing:-.03em}.topbar>span{font-size:10px;color:#8093a4;font-weight:900;letter-spacing:.08em}
        .feedback{margin-top:30px;background:#fffdf8;color:#091522;border-radius:24px;padding:34px 37px 30px;box-shadow:0 25px 70px rgba(0,0,0,.25);border-top:6px solid #ff5b50}.feedback.strong{border-top-color:#92d52a}.feedback.safe{border-top-color:#7fb8ff}.feedback.caution{border-top-color:#f0b33c}.resultHead{display:grid;grid-template-columns:1fr 92px;gap:25px;align-items:start}.label,.mini{font-size:9px;letter-spacing:.12em;font-weight:900;color:#7a858c;margin:0 0 10px}.feedback.strong .label{color:#5a8d10}.feedback.safe .label{color:#2870a8}.feedback.caution .label{color:#a66d00}.feedback.risk .label{color:#d6473e}
        h1{font-family:Georgia,"Times New Roman",serif;font-weight:500;letter-spacing:-.04em;line-height:1.04;font-size:clamp(33px,5vw,46px);margin:0 0 13px}.body{color:#5f6c75;font-size:14px;line-height:1.6;margin:0;max-width:590px}.score{width:82px;height:82px;border-radius:50%;display:grid;place-items:center;background:#091522;color:#b8ff3d;font-size:28px;font-weight:900}.score span{font-size:10px;color:#9eb0bd;margin-left:-10px;margin-top:35px;position:absolute}.divider{height:1px;background:#dcded9;margin:28px 0}.decisionCard{display:grid;grid-template-columns:36px 1fr;gap:12px;align-items:center;border:1px solid #d9dbd7;border-radius:13px;padding:13px 14px;background:white}.decisionCard>span{width:31px;height:31px;border-radius:50%;display:grid;place-items:center;background:#091522;color:white;font-size:10px;font-weight:900}.decisionCard strong{font-size:12px;line-height:1.45}.lessonGrid{display:grid;grid-template-columns:1.15fr .85fr;gap:12px;margin-top:19px}.lessonGrid article{border:1px solid #dedfdc;border-radius:14px;padding:17px;background:#f8f7f2}.lessonGrid p:not(.mini){font-size:13px;line-height:1.6;color:#4f5e68;margin:0}.lessonGrid .rule{background:#091522;border-color:#091522;color:white}.rule .mini{color:#8da0b0}.rule strong{font-family:Georgia,"Times New Roman",serif;font-size:18px;line-height:1.3;font-weight:500}.strongest{margin-top:19px}.decisionCard.best{background:#eaf8d7;border-color:#acd969}.decisionCard.best>span{background:#538a0a}.next{border-top:1px solid #dcded9;margin-top:24px;padding-top:19px;display:flex;align-items:center;justify-content:space-between;gap:20px}.next p{font-size:10px;color:#7b858b;margin:0}.next a{display:inline-flex;align-items:center;gap:20px;background:#ff5b50;color:white;border-radius:999px;padding:14px 18px;text-decoration:none;font-size:12px;font-weight:900;min-height:48px}
        @media(max-width:620px){.page{padding:0 12px 18px}.topbar{height:58px}.feedback{margin-top:18px;border-radius:18px;padding:24px 17px 18px}.resultHead{grid-template-columns:1fr 65px;gap:12px}.score{width:62px;height:62px;font-size:22px}.score span{margin-top:28px}.body{font-size:13px}.divider{margin:21px 0}.lessonGrid{grid-template-columns:1fr}.next{position:sticky;bottom:0;background:#fffdf8;margin:21px -17px -18px;padding:13px 17px 15px;z-index:3}.next p{display:none}.next a{width:100%;justify-content:space-between;min-height:52px}}
      `}</style>
    </main>
  );
}
