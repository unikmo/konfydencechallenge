import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { HACK_LABELS, type HackTrigger } from "@/lib/challenge/labels";
import { HackIcon } from "@/components/illustrations/HackIcon";
import type { UiLang } from "@/lib/challenge/uiStrings";
import { PRESSURE_LESSON_DE, FEEDBACK_TIERS_DE, FEEDBACK_STRINGS, hackLabel } from "@/lib/challenge/resultStrings";

type AnswerKey = "A" | "B" | "C";

const pressureLesson: Record<HackTrigger, { question: string; reflex: string }> = {
  H: { question: "Did urgency try to take away your thinking time?", reflex: "Pause the clock. Verify before the deadline becomes your decision-maker." },
  A: { question: "Did an official name, role or institution make the request feel pre-verified?", reflex: "Authority is a claim until you verify it through a channel you already trust." },
  C: { question: "Did familiarity make the request feel safer than the evidence justified?", reflex: "Comfort is context, not proof. Confirm the person, account or destination independently." },
  K: { question: "Did you stop before the irreversible click, transfer, code, credential or reply?", reflex: "Stop at the critical action moment. Leave the request, then verify from a clean starting point." },
};

const feedbackEn = {
  4: { label: "STRONG MOVE", title: "You broke the pressure chain.", body: "You took control of the next step away from the requester and put verification back in your hands.", tone: "strong", mark: "✓" },
  3: { label: "SAFE MOVE", title: "Protected — but not the cleanest move.", body: "You reduced the risk. One option verified the situation with even less dependence on the original request.", tone: "safe", mark: "↗" },
  2: { label: "PARTLY PROTECTED", title: "Cautious, but the door stayed open.", body: "You added friction, but one important part still depended on a claim, channel or person you had not independently verified.", tone: "caution", mark: "!" },
  1: { label: "RISK REMAINS", title: "It felt careful. It was not proof.", body: "The move sounded sensible but still left the requester in control of what happened next.", tone: "risk", mark: "!" },
  0: { label: "PRESSURE WON", title: "That is the move the scam needed.", body: "The request still controlled the link, payment, credential or next action. That is where the risk compounds.", tone: "risk", mark: "×" },
} as const;

export default async function FeedbackPage(props: { params: Promise<{ sessionId: string }> }) {
  const params = await props.params;
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
      scenario: { select: { hackKey: true, explanation: true, proTip: true, answersA: true, answersB: true, answersC: true, scoresA: true, scoresB: true, scoresC: true, lang: true } },
    },
  });
  if (!card || !card.selectedAnswerKey || card.score === null) notFound();
  if (!["A", "B", "C"].includes(card.selectedAnswerKey)) notFound();

  // A session's language is whatever its own scenario rows were seeded in —
  // see lib/challenge/sessionGenerator.ts and lib/challenge/uiStrings.ts.
  const lang: UiLang = card.scenario.lang === "de" ? "de" : "en";
  const t = FEEDBACK_STRINGS[lang];

  const totalCards = await prisma.challengeSessionCard.count({ where: { sessionId } });
  const remaining = Math.max(0, totalCards - session.currentIndex);
  const isCompleted = remaining === 0;
  const selectedKey = card.selectedAnswerKey as AnswerKey;
  const hackKey = (["H", "A", "C", "K"].includes(card.scenario.hackKey ?? "") ? card.scenario.hackKey : "K") as HackTrigger;
  const answers: Record<AnswerKey, string> = { A: card.scenario.answersA, B: card.scenario.answersB, C: card.scenario.answersC };
  const scores: Record<AnswerKey, number> = { A: card.scenario.scoresA, B: card.scenario.scoresB, C: card.scenario.scoresC };
  const strongestKey = (Object.entries(scores) as Array<[AnswerKey, number]>).sort((a,b) => b[1] - a[1])[0]?.[0];
  const score = Math.max(0, Math.min(4, Math.trunc(card.score))) as 0 | 1 | 2 | 3 | 4;

  const feedback = lang === "de" ? FEEDBACK_TIERS_DE[score] : feedbackEn[score];
  const lesson = lang === "de" ? PRESSURE_LESSON_DE[hackKey] : pressureLesson[hackKey];

  const explanation = card.scenario.explanation ?? t.defaultExplanation;
  const proTip = card.scenario.proTip ?? lesson.reflex;
  const showStrongest = score < 4 && strongestKey && strongestKey !== selectedKey;
  const nextHref = isCompleted ? `/challenge/session/${sessionId}/results` : `/challenge/session/${sessionId}`;

  const toneClass = { strong: "is-strong", safe: "is-safe", caution: "is-caution", risk: "is-risk" }[feedback.tone];

  return (
    <main className="kg-page">
      <div className="kg-shell">
        <header className="kg-top">
          <Link className="k-wordmark" href="/">Konfydence</Link>
          <div className="kg-top-meta"><span>{session.currentIndex} / {totalCards}</span><Link href="/">{t.exit}</Link></div>
        </header>
      </div>

      <div className="kg-narrow kg-fb">
        <section className={`kg-fb-card ${toneClass}`}>
          <div className="kg-fb-hero">
            <div className="kg-fb-mark">{feedback.mark}</div>
            <div><p className="kg-fb-label">{feedback.label}</p><h1>{feedback.title}</h1><span>{feedback.body}</span></div>
            <div className="kg-fb-dial"><strong>{score}</strong><small>/4</small></div>
          </div>

          <div className="kg-fb-pressure">
            <div className="kg-fb-pressure-icon"><HackIcon trigger={hackKey} size={21} color="#111417" /></div>
            <div><p className="kg-fb-mini">{t.hackSignal} · {hackLabel(hackKey, "short", lang, HACK_LABELS[hackKey].short)}</p><h2>{lesson.question}</h2><p>{lesson.reflex}</p></div>
          </div>

          <div className="kg-fb-grid">
            <article><p className="kg-fb-mini">{t.yourMove}</p><div className="kg-move"><span>{selectedKey}</span><strong>{answers[selectedKey]}</strong></div></article>
            <article className="kg-fb-why"><p className="kg-fb-mini">{t.whyItMatters}</p><p>{explanation}</p></article>
            <article className="kg-fb-rule"><p className="kg-fb-mini">{t.keepThisRule}</p><strong>{proTip}</strong></article>
          </div>

          {showStrongest ? <div className="kg-fb-strongest"><div><p className="kg-fb-mini">{t.strongestMove}</p><span>{t.strongestMoveHint}</span></div><div className="kg-move is-best"><span>{strongestKey}</span><strong>{answers[strongestKey]}</strong></div></div> : null}

          <div className="kg-fb-next"><p>{isCompleted ? t.resultReady : t.decisionsRemaining(remaining)}</p><Link href={nextHref}>{isCompleted ? t.seeProfile : t.nextTest} <span aria-hidden="true">→</span></Link></div>
        </section>
      </div>

    </main>
  );
}
