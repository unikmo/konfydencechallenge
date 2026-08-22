import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

const answerList = (scenario: { answersA: string; answersB: string; answersC: string }) => [
  ["A", scenario.answersA], ["B", scenario.answersB], ["C", scenario.answersC],
] as const;

export default async function PracticePage({ params, searchParams }: { params: Promise<{ token: string }>; searchParams: Promise<{ campaign?: string; feedback?: string }> }) {
  const { token } = await params;
  const { campaign: requestedCampaign, feedback } = await searchParams;
  const participant = await prisma.comasyParticipant.findUnique({
    where: { accessToken: token },
    include: { cohort: true, organization: { select: { id: true, name: true, brandingName: true } } },
  });
  if (!participant || participant.status === "DISABLED") notFound();

  const campaign = requestedCampaign
    ? await prisma.comasyCampaign.findFirst({ where: { id: requestedCampaign, organizationId: participant.organizationId, OR: [{ cohortId: null }, { cohortId: participant.cohortId ?? "__none__" }], status: { in: ["ACTIVE", "SCHEDULED"] } } })
    : await prisma.comasyCampaign.findFirst({ where: { organizationId: participant.organizationId, OR: [{ cohortId: null }, { cohortId: participant.cohortId ?? "__none__" }], status: { in: ["ACTIVE", "SCHEDULED"] }, orderBy: { createdAt: "desc" } });
  if (!campaign) {
    return <State title="No practice is assigned right now." copy="Your administrator has not assigned an active campaign to your cohort." />;
  }

  const scenarioIds = campaign.scenarioIds.split(",").map((x) => x.trim()).filter(Boolean);
  const responses = await prisma.comasyResponse.findMany({ where: { participantId: participant.id, campaignId: campaign.id }, orderBy: { createdAt: "asc" }, include: { scenario: { select: { title: true, explanation: true, proTip: true } } } });
  const answered = new Set(responses.map((r) => r.scenarioId));
  const currentId = scenarioIds.find((id) => !answered.has(id));
  const latest = feedback ? responses.at(-1) : null;

  if (!currentId) {
    return <State title="Done." copy={`${responses.length} decisions completed. Your results are now included in your organisation's behavioural dashboard.`} />;
  }

  const scenario = await prisma.scenario.findUnique({ where: { id: currentId }, include: { comasyProfile: true } });
  if (!scenario) notFound();
  const progress = Math.round((responses.length / scenarioIds.length) * 100);

  return (
    <main className="page">
      <header><div className="brand"><span>K</span><b>{participant.organization.brandingName || "CoMaSy"}</b></div><small>{campaign.name}</small></header>
      <div className="progress"><i style={{ width: `${progress}%` }} /></div>
      <section className="shell">
        <aside><p>{campaign.designation}</p><strong>{String(responses.length + 1).padStart(2,"0")} / {String(scenarioIds.length).padStart(2,"0")}</strong><span>{scenario.hackKey === "H" ? "Hurry" : scenario.hackKey === "A" ? "Authority" : scenario.hackKey === "C" ? "Comfort" : "Critical Action"}</span></aside>
        <article>
          {latest ? <div className={`feedback score-${latest.score}`}><p>YOUR LAST MOVE</p><h2>{latest.score >= 3 ? "Strong interruption." : latest.score === 2 ? "Partly safe, but exposed." : "Risk stayed in control."}</h2><span>{latest.scenario.explanation || latest.scenario.proTip || "The safer pattern is to slow the request down and verify through an independent channel."}</span></div> : null}
          <p className="eyebrow">REALISTIC DECISION PRACTICE</p>
          <h1>{scenario.title || "What would you do next?"}</h1>
          <p className="prompt">{scenario.prompt}</p>
          <form action="/api/comasy/practice/respond" method="post">
            <input type="hidden" name="token" value={token}/><input type="hidden" name="campaignId" value={campaign.id}/><input type="hidden" name="scenarioId" value={scenario.id}/>
            <fieldset><legend>Choose the strongest next move</legend>{answerList(scenario).map(([key,text])=><label key={key}><input type="radio" name="selectedAnswerKey" value={key} required/><span className="key">{key}</span><span>{text}</span></label>)}</fieldset>
            <button>Lock in my move <span>→</span></button>
          </form>
          <p className="rule">Pressure is a reason to verify—not a reason to skip verification.</p>
        </article>
      </section>
      <style>{`
        :global(*){box-sizing:border-box}:global(body){margin:0;background:#071726}.page{min-height:100vh;background:radial-gradient(circle at 80% 10%,#18486c,transparent 32%),#071726;color:white;font-family:Inter,system-ui,sans-serif;padding:0 22px 40px}header{height:72px;max-width:1100px;margin:auto;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #ffffff1e}.brand{display:flex;align-items:center;gap:9px}.brand>span{width:28px;height:28px;border:1px solid #9aadb9;border-radius:50%;display:grid;place-items:center;font-size:10px}.brand b{font-size:12px}header small{color:#91a5b2;font-size:10px}.progress{max-width:1100px;margin:22px auto 0;height:3px;background:#1f3444}.progress i{display:block;height:100%;background:#b8ff3d}.shell{max-width:1100px;margin:28px auto 0;display:grid;grid-template-columns:190px 1fr;background:#f8f6f0;color:#071726;border-radius:24px;overflow:hidden;box-shadow:0 30px 80px #0006}.shell aside{padding:34px 26px;background:#0c2b43;color:white;display:flex;flex-direction:column}.shell aside p{font-size:9px;letter-spacing:.12em;color:#b8ff3d;font-weight:950}.shell aside strong{font:500 42px Georgia,serif;margin-top:16px}.shell aside span{margin-top:auto;color:#9fb3c0;font-size:11px}.shell article{padding:48px clamp(24px,5vw,64px)}.feedback{border-left:4px solid #b8ff3d;background:#eef6e5;padding:16px 18px;margin-bottom:28px}.feedback.score-0,.feedback.score-1{border-color:#ff5b50;background:#fff0ee}.feedback.score-2{border-color:#f0b84c;background:#fff6df}.feedback p,.eyebrow{font-size:9px;font-weight:950;letter-spacing:.13em;color:#647783;margin:0 0 8px}.feedback h2{font:500 26px Georgia,serif;margin:0 0 8px}.feedback span{font-size:11px;color:#5e6f78;line-height:1.6}.shell h1{font:500 clamp(38px,6vw,64px)/.98 Georgia,serif;letter-spacing:-.045em;margin:0;max-width:770px}.prompt{font-size:17px;line-height:1.65;color:#334854;margin:22px 0 30px;max-width:800px}fieldset{border:0;padding:0;margin:0;display:grid;gap:11px}legend{font-size:10px;font-weight:950;letter-spacing:.08em;color:#657984;margin-bottom:12px}fieldset label{position:relative;display:grid;grid-template-columns:36px 1fr;gap:12px;align-items:center;border:1px solid #ced8dc;border-radius:14px;padding:16px;cursor:pointer;background:white}fieldset label:has(input:checked){border-color:#173e5d;box-shadow:inset 4px 0 #b8ff3d;background:#f5faee}fieldset input{position:absolute;opacity:0}.key{width:31px;height:31px;border:1px solid #bac8cd;border-radius:50%;display:grid;place-items:center;font-size:10px;font-weight:950}fieldset label>span:last-child{font-size:13px;line-height:1.45;font-weight:750}.shell button{margin-top:22px;width:100%;border:0;border-radius:999px;background:#ff5b50;color:white;padding:15px 18px;display:flex;justify-content:space-between;font-weight:950;cursor:pointer}.rule{font-size:10px;color:#7c8b92;margin:16px 0 0}.state{min-height:100vh;display:grid;place-items:center;background:#071726;color:white;padding:20px;font-family:Inter,system-ui}.state>div{width:min(560px,100%);background:#f8f6f0;color:#071726;padding:38px;border-radius:24px}.state h1{font:500 44px Georgia,serif;margin:0 0 14px}.state p{color:#61737c;line-height:1.6}.state a{color:#071726;font-weight:900}@media(max-width:760px){.page{padding:0 12px 24px}.shell{grid-template-columns:1fr;border-radius:18px}.shell aside{padding:16px 18px;display:grid;grid-template-columns:1fr auto;align-items:center}.shell aside strong{font-size:24px;margin:0}.shell aside span{grid-column:1/-1;margin-top:7px}.shell article{padding:30px 18px}.prompt{font-size:15px}fieldset label{padding:14px 12px}.shell button{position:sticky;bottom:10px}}
      `}</style>
    </main>
  );
}

function State({title,copy}:{title:string;copy:string}){return <main className="state"><div><p>COMASY</p><h1>{title}</h1><p>{copy}</p><Link href="/comasy">Return to CoMaSy</Link></div></main>}
