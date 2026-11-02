import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

// The page speaks the language of the scenarios it shows (German scenarios are
// seeded with lang "de"). A ?lang=de link covers screens that show no scenario.
const COPY = {
  en: {
    noPractice: "No practice is assigned right now.",
    noPracticeCopy: "Your administrator has not assigned an active campaign to your cohort.",
    strong: "Strong interruption.",
    partly: "Partly safe, but exposed.",
    risk: "Risk stayed in control.",
    fallbackExplanation: "The safer pattern is to slow the request down and verify through an independent channel.",
    lastMove: "YOUR LAST MOVE",
    done: "Done.",
    completed: (n: number) => `${n} decision${n === 1 ? "" : "s"} completed. Your results are now included in your organisation's behavioural dashboard.`,
    pressure: { H: "Hurry", A: "Authority", C: "Comfort", K: "Critical Action" },
    complete: (p: number) => `${p}% complete`,
    eyebrow: "REALISTIC DECISION PRACTICE",
    fallbackTitle: "What would you do next?",
    legend: "Choose the strongest next move",
    submit: "Lock in my move",
    rule: "Pressure is a reason to verify—not a reason to skip verification.",
    back: "Return to CoMaSy",
    backHref: "/comasy",
  },
  de: {
    noPractice: "Aktuell ist keine Übung zugewiesen.",
    noPracticeCopy: "Deine Administratorin oder dein Administrator hat deiner Gruppe noch keine aktive Kampagne zugewiesen.",
    strong: "Stark unterbrochen.",
    partly: "Teilweise sicher, aber angreifbar.",
    risk: "Der Druck hat gewirkt.",
    fallbackExplanation: "Sicherer ist es, die Anfrage auszubremsen und über einen unabhängigen Weg nachzufragen.",
    lastMove: "DEIN LETZTER ZUG",
    done: "Geschafft.",
    completed: (n: number) => `${n} ${n === 1 ? "Entscheidung" : "Entscheidungen"} abgeschlossen. Deine Ergebnisse fließen jetzt in die Auswertung deiner Organisation ein.`,
    pressure: { H: "Hetze", A: "Autorität", C: "Vertrautheit", K: "Notbremse" },
    complete: (p: number) => `${p} % geschafft`,
    eyebrow: "ENTSCHEIDUNGEN REALISTISCH ÜBEN",
    fallbackTitle: "Was würdest du als Nächstes tun?",
    legend: "Wähle den stärksten nächsten Schritt",
    submit: "Meine Wahl festlegen",
    rule: "Druck ist ein Grund, nachzuprüfen – kein Grund, es sich zu sparen.",
    back: "Zurück zu CoMaSy",
    backHref: "/de/comasy",
  },
} as const;
type Lang = keyof typeof COPY;

const answerList = (scenario: { answersA: string; answersB: string; answersC: string }) => [
  ["A", scenario.answersA],
  ["B", scenario.answersB],
  ["C", scenario.answersC],
] as const;

export default async function PracticePage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ campaign?: string; feedback?: string; lang?: string }>;
}) {
  const { token } = await params;
  const { campaign: requestedCampaign, feedback, lang: requestedLang } = await searchParams;
  const paramLang: Lang = requestedLang === "de" ? "de" : "en";

  const participant = await prisma.comasyParticipant.findUnique({
    where: { accessToken: token },
    include: {
      cohort: true,
      organization: {
        select: { id: true, name: true, brandingName: true },
      },
    },
  });

  if (!participant || participant.status === "DISABLED") notFound();

  const campaignScope = {
    organizationId: participant.organizationId,
    OR: [
      { cohortId: null },
      { cohortId: participant.cohortId ?? "__none__" },
    ],
    status: { in: ["ACTIVE", "SCHEDULED"] as string[] },
  };

  const campaign = requestedCampaign
    ? await prisma.comasyCampaign.findFirst({
        where: { ...campaignScope, id: requestedCampaign },
      })
    : await prisma.comasyCampaign.findFirst({
        where: campaignScope,
        orderBy: { createdAt: "desc" },
      });

  if (!campaign) {
    return (
      <State
        lang={paramLang}
        title={COPY[paramLang].noPractice}
        copy={COPY[paramLang].noPracticeCopy}
      />
    );
  }

  const scenarioIds = campaign.scenarioIds
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  const firstScenario = scenarioIds[0]
    ? await prisma.scenario.findUnique({ where: { id: scenarioIds[0] }, select: { lang: true } })
    : null;
  const lang: Lang = paramLang === "de" || firstScenario?.lang === "de" ? "de" : "en";
  const c = COPY[lang];

  const responses = await prisma.comasyResponse.findMany({
    where: { participantId: participant.id, campaignId: campaign.id },
    orderBy: { createdAt: "asc" },
    include: {
      scenario: {
        select: { title: true, explanation: true, proTip: true },
      },
    },
  });

  const answered = new Set(responses.map((response) => response.scenarioId));
  const currentId = scenarioIds.find((id) => !answered.has(id));
  const latest = feedback ? responses.at(-1) : null;

  if (!currentId) {
    if (latest) {
      const verdict = latest.score >= 3 ? c.strong : latest.score === 2 ? c.partly : c.risk;
      const explanation = latest.scenario.explanation || latest.scenario.proTip || c.fallbackExplanation;
      return (
        <State
          lang={lang}
          eyebrow={c.lastMove}
          title={verdict}
          copy={`${explanation} ${c.completed(responses.length)}`}
        />
      );
    }

    return (
      <State lang={lang} title={c.done} copy={c.completed(responses.length)} />
    );
  }

  const scenario = await prisma.scenario.findUnique({
    where: { id: currentId },
    include: { comasyProfile: true },
  });

  if (!scenario) notFound();

  const progress = Math.round((responses.length / scenarioIds.length) * 100);
  const pressureLabel = c.pressure[scenario.hackKey as "H" | "A" | "C" | "K"] ?? c.pressure.K;

  return (
    <main className="page">
      <header>
        <div className="brand">
          <span>K</span>
          <b>{participant.organization.brandingName || "CoMaSy"}</b>
        </div>
        <small>{campaign.name}</small>
      </header>

      <div className="progress" aria-label={c.complete(progress)}>
        <i style={{ width: `${progress}%` }} />
      </div>

      <section className="shell">
        <aside>
          <p>{campaign.designation}</p>
          <strong>
            {String(responses.length + 1).padStart(2, "0")} / {String(scenarioIds.length).padStart(2, "0")}
          </strong>
          <span>{pressureLabel}</span>
        </aside>

        <article>
          {latest ? (
            <div className={`feedback score-${latest.score}`}>
              <p>{c.lastMove}</p>
              <h2>{latest.score >= 3 ? c.strong : latest.score === 2 ? c.partly : c.risk}</h2>
              <span>{latest.scenario.explanation || latest.scenario.proTip || c.fallbackExplanation}</span>
            </div>
          ) : null}

          <p className="eyebrow">{c.eyebrow}</p>
          <h1>{scenario.title || c.fallbackTitle}</h1>
          <p className="prompt">{scenario.prompt}</p>

          <form action="/api/comasy/practice/respond" method="post">
            <input type="hidden" name="token" value={token} />
            <input type="hidden" name="campaignId" value={campaign.id} />
            <input type="hidden" name="scenarioId" value={scenario.id} />

            <fieldset>
              <legend>{c.legend}</legend>
              {answerList(scenario).map(([key, text]) => (
                <label key={key}>
                  <input type="radio" name="selectedAnswerKey" value={key} required />
                  <span className="key">{key}</span>
                  <span>{text}</span>
                </label>
              ))}
            </fieldset>

            <button type="submit">
              {c.submit} <span>→</span>
            </button>
          </form>
          <p className="rule">{c.rule}</p>
        </article>
      </section>

      <style>{`
        :global(*){box-sizing:border-box}:global(body){margin:0;background:#12191f}.page{min-height:100vh;background:radial-gradient(circle at 80% 10%,#18486c,transparent 32%),#12191f;color:white;font-family:Inter,system-ui,sans-serif;padding:0 22px 40px}header{height:72px;max-width:1100px;margin:auto;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #ffffff1e}.brand{display:flex;align-items:center;gap:9px}.brand>span{width:28px;height:28px;border:1px solid #9aadb9;border-radius:50%;display:grid;place-items:center;font-size:10px}.brand b{font-size:12px}header small{color:#91a5b2;font-size:10px}.progress{max-width:1100px;margin:22px auto 0;height:3px;background:#1f3444}.progress i{display:block;height:100%;background:#af8752}.shell{max-width:1100px;margin:28px auto 0;display:grid;grid-template-columns:190px 1fr;background:#f8f6f0;color:#12191f;border-radius:24px;overflow:hidden;box-shadow:0 30px 80px #0006}.shell aside{padding:34px 26px;background:#0c2b43;color:white;display:flex;flex-direction:column}.shell aside p{font-size:9px;letter-spacing:.12em;color:#af8752;font-weight:950}.shell aside strong{font:500 42px "Iowan Old Style",Baskerville,Georgia,serif;margin-top:16px}.shell aside span{margin-top:auto;color:#9fb3c0;font-size:11px}.shell article{padding:48px clamp(24px,5vw,64px)}.feedback{border-left:4px solid #af8752;background:#eef6e5;padding:16px 18px;margin-bottom:28px}.feedback.score-0,.feedback.score-1{border-color:#111417;background:#fff0ee}.feedback.score-2{border-color:#f0b84c;background:#fff6df}.feedback p,.eyebrow{font-size:9px;font-weight:950;letter-spacing:.13em;color:#647783;margin:0 0 8px}.feedback h2{font:500 26px "Iowan Old Style",Baskerville,Georgia,serif;margin:0 0 8px}.feedback span{font-size:11px;color:#5e6f78;line-height:1.6}.shell h1{font:500 clamp(38px,6vw,64px)/.98 "Iowan Old Style",Baskerville,Georgia,serif;letter-spacing:-.045em;margin:0;max-width:770px}.prompt{font-size:17px;line-height:1.65;color:#334854;margin:22px 0 30px;max-width:800px}fieldset{border:0;padding:0;margin:0;display:grid;gap:11px}legend{font-size:10px;font-weight:950;letter-spacing:.08em;color:#657984;margin-bottom:12px}fieldset label{position:relative;display:grid;grid-template-columns:36px 1fr;gap:12px;align-items:center;border:1px solid #ced8dc;border-radius:14px;padding:16px;cursor:pointer;background:white}fieldset label:has(input:checked){border-color:#173e5d;box-shadow:inset 4px 0 #af8752;background:#f5faee}fieldset input{position:absolute;opacity:0}.key{width:31px;height:31px;border:1px solid #bac8cd;border-radius:50%;display:grid;place-items:center;font-size:10px;font-weight:950}fieldset label>span:last-child{font-size:13px;line-height:1.45;font-weight:750}.shell button{margin-top:22px;width:100%;border:0;border-radius:999px;background:#111417;color:white;padding:15px 18px;display:flex;justify-content:space-between;font-weight:950;cursor:pointer}.rule{font-size:10px;color:#7c8b92;margin:16px 0 0}@media(max-width:760px){.page{padding:0 12px 24px}.shell{grid-template-columns:1fr;border-radius:18px}.shell aside{padding:16px 18px;display:grid;grid-template-columns:1fr auto;align-items:center}.shell aside strong{font-size:24px;margin:0}.shell aside span{grid-column:1/-1;margin-top:7px}.shell article{padding:30px 18px}.prompt{font-size:15px}fieldset label{padding:14px 12px}.shell button{position:sticky;bottom:10px}}
      `}</style>
    </main>
  );
}

function State({
  title,
  copy,
  eyebrow = "COMASY",
  lang = "en",
}: {
  title: string;
  copy: string;
  eyebrow?: string;
  lang?: Lang;
}) {
  return (
    <main className="state">
      <div>
        <p className="stateEyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{copy}</p>
        <Link href={COPY[lang].backHref}>{COPY[lang].back}</Link>
      </div>
      <style>{`
        :global(*){box-sizing:border-box}:global(body){margin:0;background:#12191f}.state{min-height:100vh;display:grid;place-items:center;background:radial-gradient(circle at 75% 10%,#18486c,transparent 34%),#12191f;color:white;padding:20px;font-family:Inter,system-ui,sans-serif}.state>div{width:min(620px,100%);background:#f8f6f0;color:#12191f;padding:clamp(28px,6vw,52px);border-radius:24px;box-shadow:0 30px 80px #0006}.stateEyebrow{font-size:10px;font-weight:950;letter-spacing:.14em;color:#58707d;margin:0 0 14px}.state h1{font:500 clamp(38px,7vw,58px)/1 "Iowan Old Style",Baskerville,Georgia,serif;letter-spacing:-.035em;margin:0 0 18px}.state p:not(.stateEyebrow){color:#61737c;line-height:1.7}.state a{display:inline-block;margin-top:12px;color:#12191f;font-weight:900}
      `}</style>
    </main>
  );
}
