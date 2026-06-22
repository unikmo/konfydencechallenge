import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { EDITION_LABELS, type SectionKey } from "@/lib/challenge/labels";

const SECTION_ORDER: SectionKey[] = ["A", "B", "C", "D"];
const ANSWER_KEYS = ["A", "B", "C", "D"] as const;


export default async function SessionPage({ params }: { params: { sessionId: string } }) {
  const sessionId = params.sessionId;

  const session = await prisma.challengeSession.findUnique({
    where: { id: sessionId },
    select: { id: true, edition: true, status: true },
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

  const sections = await prisma.challengeSessionSection.findMany({
    where: { sessionId },
    select: {
      section: true,
      currentIndex: true,
      cards: {
        select: { scenarioId: true, orderIndex: true },
        orderBy: { orderIndex: "asc" },
      },
    },
  });

  const currentSection = SECTION_ORDER.find((section) => {
    const row = sections.find((item) => item.section === section);
    return row ? row.currentIndex < row.cards.length : false;
  });

  const totalQuestions = sections.reduce((sum, s) => sum + (s.cards?.length ?? 0), 0);

  const answeredSoFarInTotal = sections.reduce((sum, s) => {
    const isCurrent = s.section === currentSection;
    if (isCurrent) return sum;
    return sum + Math.max(0, s.cards.length - (s.currentIndex ?? 0));
  }, 0);

  const overallIndex =
    answeredSoFarInTotal +
    (currentSection ? (sections.find((s) => s.section === currentSection)?.currentIndex ?? 0) : 0);

  if (!currentSection) {

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

  const sectionRow = sections.find((item) => item.section === currentSection)!;
  const currentIndex = sectionRow.currentIndex;
  const currentCard = sectionRow.cards[currentIndex];

  const scenario = await prisma.scenario.findUnique({
    where: { id: currentCard.scenarioId },
    select: {
      id: true,
      title: true,
      prompt: true,
      answersA: true,
      answersB: true,
      answersC: true,
      answersD: true,
    },
  });


  if (!scenario) notFound();

  const answers = {
    A: scenario.answersA,
    B: scenario.answersB,
    C: scenario.answersC,
    D: scenario.answersD,
  };


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
            <span>{(EDITION_LABELS as Record<string, string>)[session.edition] ?? session.edition}</span>

            <span>
              Question {overallIndex + 1} of {totalQuestions}
            </span>

          </div>


          <div className="progressWrap">
            <div className="progressTop">
              <span className="progressText">
                Question {currentIndex + 1} of {sectionRow.cards.length} in this section
              </span>
              <span className="progressText">
                Overall progress {Math.min(100, Math.max(0, Math.round(((overallIndex + 1) / Math.max(1, totalQuestions)) * 100)))}%
              </span>
            </div>
            <div className="progressBar" aria-label="Full challenge progress">
              <div className="progressFill" style={{ width: `${
                Math.min(100, Math.max(0, ((overallIndex + 1) / Math.max(1, totalQuestions)) * 100))
              }%` }} />
            </div>
          </div>


          <h1>{scenario.title ?? `Scenario ${currentIndex + 1}`}</h1>
          <p className="prompt">{scenario.prompt}</p>

          <form method="post" action={`/challenge/session/${sessionId}/submit`}>
            <div className="answers">
              {ANSWER_KEYS.map((key) => (
                <label key={key} className="answer">
                  <input type="radio" name="selectedAnswerKey" value={key} required />
                  <span className="answerKey">{key}</span>
                  <span className="answerText">{answers[key]}</span>
                </label>
              ))}
            </div>

            <input type="hidden" name="scenarioId" value={scenario.id} />
            <input type="hidden" name="section" value={currentSection} />

            <button type="submit">Submit answer</button>
          </form>
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
          color: #dbeafe;
          font-weight: 700;
          text-decoration: none;
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
          margin-bottom: 14px;
          font-size: 13px;
          color: #475569;
        }

        .meta span {
          border: 1px solid #bfdbfe;
          background: #eff6ff;
          color: #1d4ed8;
          border-radius: 999px;
          padding: 5px 10px;
          font-weight: 800;
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
          background: #1d4ed8;
          border-radius: 999px;
          transition: width 180ms ease;
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
          border-color: #1d4ed8;
          background: #eff6ff;
        }

        .answer:has(input:checked) {
          border-color: #1d4ed8;
          background: #dbeafe;
          box-shadow: 0 0 0 3px rgba(29, 78, 216, 0.16);
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
          color: #1d4ed8;
          font-weight: 900;
        }

        .answer:has(input:checked) .answerKey {
          background: #1d4ed8;
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
          background: #1d4ed8;
          color: #ffffff;
          padding: 13px 16px;
          font-weight: 900;
          cursor: pointer;
        }

        button:hover {
          background: #1e40af;
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