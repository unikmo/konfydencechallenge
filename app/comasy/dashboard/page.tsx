import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCustomerOrganizationId } from "@/lib/comasyAuth";
import { getOrganizationMetrics } from "@/lib/comasyMetrics";

const views = [
  ["overview", "Overview"], ["people", "People"], ["practice", "Practice"], ["measure", "Measure"], ["reports", "Reports"], ["settings", "Settings"],
] as const;

const fmt = (n: number) => `${Math.round(n * 10) / 10}%`;
const delta = (n: number | null) => n == null ? "Not enough data" : `${n > 0 ? "+" : ""}${n} pts`;

export default async function CoMaSyDashboard({ searchParams }: { searchParams: Promise<{ view?: string }> }) {
  const organizationId = await getCustomerOrganizationId();
  if (!organizationId) redirect("/comasy/dashboard/login");
  const { view: rawView } = await searchParams;
  const view = views.some(([key]) => key === rawView) ? rawView! : "overview";

  const [org, metrics, cohorts, participants, campaigns, scenarios] = await Promise.all([
    prisma.comasyOrganization.findUniqueOrThrow({ where: { id: organizationId } }),
    getOrganizationMetrics(organizationId),
    prisma.comasyCohort.findMany({ where: { organizationId }, orderBy: { name: "asc" }, include: { _count: { select: { participants: true } } } }),
    prisma.comasyParticipant.findMany({ where: { organizationId }, orderBy: { createdAt: "desc" }, take: 200, include: { cohort: { select: { name: true } } } }),
    prisma.comasyCampaign.findMany({ where: { organizationId }, orderBy: { createdAt: "desc" }, take: 100, include: { cohort: { select: { name: true } }, _count: { select: { responses: true } } } }),
    prisma.scenario.findMany({ where: { active: true, scored: true, edition: "workplace" }, orderBy: [{ hackKey: "asc" }, { externalId: "asc" }], take: 24 }),
  ]);

  const activeCampaign = campaigns.find((c) => c.status === "ACTIVE");
  const completedParticipants = new Set((await prisma.comasyResponse.findMany({ where: { organizationId }, select: { participantId: true } })).map((r) => r.participantId)).size;

  return (
    <main className="appShell">
      <aside className="sidebar">
        <Link className="logo" href="/comasy"><span>K</span><b>CoMaSy</b></Link>
        <p className="workspace">{org.brandingName || org.name}</p>
        <nav>{views.map(([key, label]) => <Link key={key} className={view === key ? "active" : ""} href={`/comasy/dashboard?view=${key}`}>{label}</Link>)}</nav>
        <div className="sideFoot"><span>Customer workspace</span><form action="/api/comasy/auth/logout" method="post"><button>Sign out</button></form></div>
      </aside>

      <section className="content">
        <header className="topbar"><div><p>COMASY / {view.toUpperCase()}</p><h1>{view === "overview" ? "Behaviour at a glance" : views.find(([k]) => k === view)?.[1]}</h1></div><Link href="/comasy" className="outline">Platform home</Link></header>

        {view === "overview" && <>
          <div className="metricGrid">
            <Metric label="Participants" value={String(metrics.participantCount)} note={`${completedParticipants} with activity`} />
            <Metric label="Active campaigns" value={String(metrics.activeCampaigns)} note={`${campaigns.length} total`} />
            <Metric label="Participation" value={fmt(metrics.participationRate)} note="participants with recorded decisions" />
            <Metric label="Pause Adoption" value={fmt(metrics.pauseAdoption)} note="interrupt / challenge before proceeding" />
            <Metric label="Verification Rate" value={fmt(metrics.verificationRate)} note="independent verification behaviour" />
            <Metric label="Impulse Rate" value={fmt(metrics.impulseRate)} note="immediate higher-risk action" danger={metrics.impulseRate > 25} />
            <Metric label="Pre/post change" value={delta(metrics.prePostChange)} note="Pause Adoption movement" />
          </div>
          <div className="twoCol">
            <Card title="H.A.C.K. profile" eyebrow="PRESSURE RESILIENCE"><Hack profile={metrics.hackProfile} /></Card>
            <Card title="Cohorts requiring attention" eyebrow="FOCUS NEXT">
              {metrics.attentionCohorts.length ? metrics.attentionCohorts.map((c) => <div className="attention" key={c.id}><b>{c.name}</b><span>Pause {fmt(c.pauseAdoption)} · Verify {fmt(c.verificationRate)} · Impulse {fmt(c.impulseRate)}</span></div>) : <Empty text="No cohort has enough concerning data to flag." />}
            </Card>
          </div>
          <Card title="Recent campaigns" eyebrow="PRACTICE">
            <div className="tableWrap"><table><thead><tr><th>Campaign</th><th>Cohort</th><th>Designation</th><th>Status</th><th>Responses</th></tr></thead><tbody>{campaigns.slice(0, 6).map((c) => <tr key={c.id}><td><b>{c.name}</b></td><td>{c.cohort?.name || "All participants"}</td><td>{c.designation}</td><td><Status value={c.status} /></td><td>{c._count.responses}</td></tr>)}</tbody></table></div>
          </Card>
        </>}

        {view === "people" && <>
          <div className="twoCol topAlign">
            <Card title="Create cohort" eyebrow="COHORTS"><form className="form" action="/api/comasy/manage" method="post"><input type="hidden" name="action" value="create_cohort" /><Field name="name" label="Cohort name" required /><Field name="department" label="Department" /><Field name="country" label="Country" /><Field name="role" label="Role / audience" /><Submit>Create cohort</Submit></form></Card>
            <Card title="Invite participant" eyebrow="PEOPLE"><form className="form" action="/api/comasy/manage" method="post"><input type="hidden" name="action" value="create_participant" /><div className="split"><Field name="firstName" label="First name" required /><Field name="lastName" label="Last name" required /></div><Field name="email" label="Work email" type="email" required /><label>Cohort<select name="cohortId"><option value="">Unassigned</option>{cohorts.map((c) => <option value={c.id} key={c.id}>{c.name}</option>)}</select></label><Field name="department" label="Department" /><Field name="role" label="Role" /><Submit>Add participant</Submit></form></Card>
          </div>
          <Card title="Participants" eyebrow={`${participants.length} RECORDS`}>
            <div className="tableWrap"><table><thead><tr><th>Participant</th><th>Cohort</th><th>Department</th><th>Status</th><th>Practice</th></tr></thead><tbody>{participants.map((p) => <tr key={p.id}><td><b>{p.firstName} {p.lastName}</b><small>{p.email}</small></td><td>{p.cohort?.name || "—"}</td><td>{p.department || "—"}</td><td><Status value={p.status} /></td><td>{activeCampaign && (!activeCampaign.cohortId || activeCampaign.cohortId === p.cohortId) ? <Link href={`/comasy/practice/${p.accessToken}?campaign=${activeCampaign.id}`}>Open link ↗</Link> : "—"}</td></tr>)}</tbody></table></div>
          </Card>
          <Card title="Cohorts" eyebrow="SEGMENTATION"><div className="cohortGrid">{cohorts.map((c) => <div className="cohort" key={c.id}><b>{c.name}</b><span>{c._count.participants} participants</span><small>{[c.department,c.country,c.role].filter(Boolean).join(" · ") || "No filters"}</small></div>)}</div></Card>
        </>}

        {view === "practice" && <>
          <div className="twoCol topAlign">
            <Card title="Create / assign campaign" eyebrow="PRACTICE"><form className="form" action="/api/comasy/manage" method="post"><input type="hidden" name="action" value="create_campaign" /><Field name="name" label="Campaign name" required /><label>Cohort<select name="cohortId"><option value="">All participants</option>{cohorts.map((c) => <option value={c.id} key={c.id}>{c.name}</option>)}</select></label><div className="split"><label>Designation<select name="designation"><option>BASELINE</option><option>PRACTICE</option><option>FOLLOWUP</option></select></label><label>Status<select name="status"><option>DRAFT</option><option>SCHEDULED</option><option>ACTIVE</option></select></label></div><Field name="scheduledAt" label="Schedule" type="datetime-local" /><Field name="roleFocus" label="Role focus" /><label>H.A.C.K. focus<select name="hackFocus"><option value="">Balanced</option><option value="H">Hurry</option><option value="A">Authority</option><option value="C">Comfort</option><option value="K">Critical Action</option></select></label><p className="miniTitle">Scenario library — select 3–8</p><div className="scenarioPicker">{scenarios.map((s) => <label key={s.id}><input type="checkbox" name="scenarioIds" value={s.id} /><span><b>{s.externalId}</b> {s.title || s.prompt.slice(0,70)} <em>{s.hackKey}</em></span></label>)}</div><Submit>Create campaign</Submit></form></Card>
            <Card title="Campaign design rules" eyebrow="BASELINE → PRACTICE → FOLLOW-UP"><div className="rules"><p><b>Baseline</b> records the starting behaviour before targeted practice.</p><p><b>Practice</b> gives repeated short decision rehearsal.</p><p><b>Follow-up</b> is stored separately and powers pre/post comparison.</p><p>Every customer metric is calculated from recorded scenario decisions—not completion alone.</p></div></Card>
          </div>
          <Card title="Campaigns" eyebrow="LIVE OPERATIONS"><div className="tableWrap"><table><thead><tr><th>Campaign</th><th>Cohort</th><th>Type</th><th>Status</th><th>Responses</th><th>Control</th></tr></thead><tbody>{campaigns.map((c) => <tr key={c.id}><td><b>{c.name}</b><small>{c.roleFocus || "General"}</small></td><td>{c.cohort?.name || "All"}</td><td>{c.designation}</td><td><Status value={c.status} /></td><td>{c._count.responses}</td><td><form action="/api/comasy/manage" method="post" className="inline"><input type="hidden" name="action" value="campaign_status"/><input type="hidden" name="campaignId" value={c.id}/><select name="status" defaultValue={c.status}><option>DRAFT</option><option>SCHEDULED</option><option>ACTIVE</option><option>PAUSED</option><option>COMPLETED</option></select><button>Save</button></form></td></tr>)}</tbody></table></div></Card>
        </>}

        {view === "measure" && <>
          <div className="metricGrid compact"><Metric label="Pause Adoption" value={fmt(metrics.pauseAdoption)} note="safe interruption / challenge"/><Metric label="Verification Rate" value={fmt(metrics.verificationRate)} note="independent verification"/><Metric label="Impulse Rate" value={fmt(metrics.impulseRate)} note="immediate higher-risk action" danger={metrics.impulseRate>25}/><Metric label="Pre/post" value={delta(metrics.prePostChange)} note={`Baseline ${fmt(metrics.baselinePause)} → later ${fmt(metrics.followupPause)}`}/></div>
          <div className="twoCol"><Card title="H.A.C.K. breakdown" eyebrow="TRIGGER RESPONSE"><Hack profile={metrics.hackProfile}/></Card><Card title="Metric definitions" eyebrow="TRANSPARENT BY DESIGN"><div className="definitions"><p><b>Pause Adoption</b> — applicable responses classified as interrupting, safely challenging or slowing the risky action chain.</p><p><b>Verification Rate</b> — responses classified as independently verifying the request or source.</p><p><b>Impulse Rate</b> — immediate higher-risk responses.</p><p>These are defined CoMaSy operational metrics, not claims of validated psychological constructs.</p></div></Card></div>
          <Card title="Cohort comparison" eyebrow="WHERE TO FOCUS"><div className="tableWrap"><table><thead><tr><th>Cohort</th><th>Responses</th><th>Pause</th><th>Verify</th><th>Impulse</th></tr></thead><tbody>{metrics.cohorts.map((c)=><tr key={c.id}><td><b>{c.name}</b></td><td>{c.responses}</td><td>{fmt(c.pauseAdoption)}</td><td>{fmt(c.verificationRate)}</td><td>{fmt(c.impulseRate)}</td></tr>)}</tbody></table></div></Card>
        </>}

        {view === "reports" && <>
          <div className="reportGrid"><Report title="Executive report" copy="Participation, behaviour movement, H.A.C.K. profile and priority focus." type="executive"/><Report title="Security Awareness report" copy="Campaign activity, behavioural indicators and cohort comparison." type="awareness"/><Report title="Compliance / NIS2 evidence report" copy="Defined programme activity and effectiveness evidence with an explicit non-compliance disclaimer." type="compliance"/></div>
          <Card title="Reporting periods" eyebrow="EVIDENCE"><p className="muted">Exports currently reflect all recorded organisation activity. Date-window reporting is retained as the next filter layer once enough customer history exists to make period selection meaningful.</p></Card>
        </>}

        {view === "settings" && <>
          <div className="twoCol topAlign"><Card title="Organisation" eyebrow="WORKSPACE"><dl className="facts"><div><dt>Organisation</dt><dd>{org.name}</dd></div><div><dt>Country</dt><dd>{org.country || "—"}</dd></div><div><dt>Industry</dt><dd>{org.industry || "—"}</dd></div><div><dt>NIS2 relevance</dt><dd>{org.nis2Relevant ? "Flagged for review" : "Not flagged"}</dd></div></dl></Card><Card title="Workspace settings" eyebrow="PRIVACY & BRANDING"><form className="form" action="/api/comasy/manage" method="post"><input type="hidden" name="action" value="settings"/><Field name="brandingName" label="Workspace display name" defaultValue={org.brandingName || ""}/><Field name="retentionDays" label="Retention period (days)" type="number" defaultValue={String(org.retentionDays)}/><Submit>Save settings</Submit></form><p className="muted small">Retention is stored as an organisation policy value; automated deletion is not claimed until a scheduled retention worker is deployed.</p></Card></div>
          <Card title="Permissions and integrations" eyebrow="STATUS"><div className="statusGrid"><div><b>Organisation isolation</b><span>Active — signed tenant session + server-side org filters</span></div><div><b>Customer administrators</b><span>Workspace access code active</span></div><div><b>SSO</b><span>Not advertised — not implemented</span></div><div><b>External integrations</b><span>Not advertised — no customer integration enabled yet</span></div></div></Card>
        </>}
      </section>

      <style>{styles}</style>
    </main>
  );
}

function Metric({label,value,note,danger=false}:{label:string;value:string;note:string;danger?:boolean}){return <article className={`metric ${danger?"danger":""}`}><span>{label}</span><strong>{value}</strong><small>{note}</small></article>}
function Card({title,eyebrow,children}:{title:string;eyebrow:string;children:React.ReactNode}){return <section className="card"><p className="cardEye">{eyebrow}</p><h2>{title}</h2>{children}</section>}
function Status({value}:{value:string}){return <span className={`status status-${value.toLowerCase()}`}>{value.replaceAll("_"," ")}</span>}
function Empty({text}:{text:string}){return <p className="muted">{text}</p>}
function Hack({profile}:{profile:Record<"H"|"A"|"C"|"K",number>}){return <div className="hack">{([["H","Hurry"],["A","Authority"],["C","Comfort"],["K","Critical Action"]] as const).map(([k,label])=><div key={k}><span><b>{k}</b>{label}</span><i><em style={{width:`${profile[k]}%`}}/></i><strong>{fmt(profile[k])}</strong></div>)}</div>}
function Field({name,label,type="text",required=false,defaultValue}:{name:string;label:string;type?:string;required?:boolean;defaultValue?:string}){return <label>{label}<input name={name} type={type} required={required} defaultValue={defaultValue}/></label>}
function Submit({children}:{children:React.ReactNode}){return <button className="submit" type="submit">{children}<span>→</span></button>}
function Report({title,copy,type}:{title:string;copy:string;type:string}){return <article className="report"><p>REPORT</p><h3>{title}</h3><span>{copy}</span><div><Link href={`/api/comasy/reports/pdf?type=${type}`}>PDF export</Link><Link href={`/api/comasy/reports/csv?type=${type}`}>CSV export</Link></div></article>}

const styles = `
:global(*){box-sizing:border-box}:global(body){margin:0;background:#edf1f3;color:#0a1a28}.appShell{min-height:100vh;display:grid;grid-template-columns:250px 1fr;font-family:Inter,system-ui,sans-serif}.sidebar{position:sticky;top:0;height:100vh;background:#12191f;color:white;padding:28px 20px;display:flex;flex-direction:column}.logo{display:flex;align-items:center;gap:10px;color:white;text-decoration:none}.logo span{width:30px;height:30px;border:1px solid #8ba0ae;border-radius:50%;display:grid;place-items:center;font-size:11px}.logo b{font-size:15px}.workspace{color:#90a4b3;font-size:11px;margin:22px 0 14px;padding-bottom:16px;border-bottom:1px solid #ffffff18}.sidebar nav{display:grid;gap:5px}.sidebar nav a{color:#9fb0bc;text-decoration:none;padding:11px 12px;border-radius:9px;font-size:12px;font-weight:800}.sidebar nav a:hover,.sidebar nav a.active{background:#13314a;color:white}.sidebar nav a.active:before{content:"";display:inline-block;width:6px;height:6px;background:#af8752;border-radius:50%;margin-right:9px}.sideFoot{margin-top:auto;color:#718797;font-size:10px;display:grid;gap:10px}.sideFoot button{background:none;color:#aabac5;border:0;padding:0;text-align:left;text-decoration:underline;cursor:pointer}.content{padding:36px clamp(20px,4vw,54px) 70px;min-width:0}.topbar{display:flex;justify-content:space-between;gap:20px;align-items:flex-end;margin-bottom:28px}.topbar p,.cardEye{font-size:9px;letter-spacing:.14em;font-weight:950;color:#607786;margin:0 0 8px}.topbar h1{font:500 clamp(32px,4vw,50px)/1 "Iowan Old Style",Baskerville,Georgia,serif;letter-spacing:-.04em;margin:0}.outline{border:1px solid #aebcc4;border-radius:999px;padding:10px 14px;text-decoration:none;color:#183044;font-size:11px;font-weight:900}.metricGrid{display:grid;grid-template-columns:repeat(4,minmax(150px,1fr));gap:12px;margin-bottom:16px}.metricGrid.compact{grid-template-columns:repeat(4,1fr)}.metric{background:white;border:1px solid #dce3e6;border-radius:16px;padding:18px;min-height:138px;display:flex;flex-direction:column}.metric>span{font-size:10px;font-weight:900;color:#667983}.metric strong{font:500 34px/1 "Iowan Old Style",Baskerville,Georgia,serif;margin:22px 0 9px}.metric small{margin-top:auto;color:#89969c;font-size:10px;line-height:1.4}.metric.danger strong{color:#cc473f}.twoCol{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin:16px 0}.topAlign{align-items:start}.card{background:white;border:1px solid #dce3e6;border-radius:18px;padding:22px;margin:16px 0}.twoCol>.card{margin:0}.card h2{font:500 28px/1.05 "Iowan Old Style",Baskerville,Georgia,serif;letter-spacing:-.03em;margin:0 0 20px}.hack{display:grid;gap:14px}.hack>div{display:grid;grid-template-columns:150px 1fr 50px;gap:12px;align-items:center}.hack span{font-size:11px;color:#586d79}.hack span b{display:inline-grid;place-items:center;width:24px;height:24px;border:1px solid #b8c5ca;border-radius:50%;margin-right:9px;color:#0a1a28}.hack i{height:7px;background:#e9eef0;border-radius:9px;overflow:hidden}.hack em{display:block;height:100%;background:#173e5d}.hack strong{font-size:11px;text-align:right}.attention{display:flex;justify-content:space-between;gap:16px;padding:14px 0;border-bottom:1px solid #e8edef}.attention:last-child{border-bottom:0}.attention b{font-size:13px}.attention span{color:#697b85;font-size:10px;text-align:right}.tableWrap{overflow:auto}table{width:100%;border-collapse:collapse;min-width:670px}th{text-align:left;font-size:9px;letter-spacing:.08em;color:#73858f;text-transform:uppercase;padding:10px 8px;border-bottom:1px solid #e0e7e9}td{padding:13px 8px;border-bottom:1px solid #edf1f2;font-size:11px;vertical-align:top}td b{display:block;font-size:12px}td small{display:block;color:#829098;margin-top:4px}.status{display:inline-block;border-radius:99px;padding:5px 8px;background:#edf1f2;font-size:8px;font-weight:950}.status-active,.status-completed{background:#e7f6cf;color:#456520}.status-invited,.status-scheduled{background:#edf4ff;color:#285b8d}.status-paused{background:#fff0cf;color:#85641b}.form{display:grid;gap:13px}.form label{display:grid;gap:6px;font-size:10px;font-weight:900;color:#536873}.form input,.form select,.inline select{width:100%;border:1px solid #ccd7db;border-radius:10px;padding:11px;background:white;font:inherit;color:#0a1a28}.split{display:grid;grid-template-columns:1fr 1fr;gap:10px}.submit{border:0;border-radius:999px;padding:12px 15px;background:#111417;color:white;font-weight:950;display:flex;justify-content:space-between;cursor:pointer}.cohortGrid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.cohort{border:1px solid #e0e6e8;border-radius:12px;padding:14px;display:grid;gap:7px}.cohort b{font:500 20px "Iowan Old Style",Baskerville,Georgia,serif}.cohort span,.cohort small{font-size:10px;color:#71818a}.scenarioPicker{max-height:310px;overflow:auto;border:1px solid #dae2e5;border-radius:12px;padding:6px}.scenarioPicker label{display:flex;grid-template-columns:none;align-items:flex-start;gap:9px;padding:9px;border-bottom:1px solid #edf1f2;cursor:pointer}.scenarioPicker input{width:auto;margin-top:2px}.scenarioPicker span{font-size:10px;font-weight:600;line-height:1.4}.scenarioPicker em{font-style:normal;background:#e9eef0;border-radius:6px;padding:2px 5px;margin-left:5px}.miniTitle{font-size:10px;font-weight:950;color:#536873;margin:5px 0 -5px}.rules,.definitions{color:#5e707a;font-size:12px;line-height:1.65}.rules b,.definitions b{color:#0a1a28}.inline{display:flex;gap:6px}.inline button{border:0;background:#0a1a28;color:white;border-radius:8px;padding:7px 9px;font-size:9px;font-weight:900}.reportGrid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}.report{background:#12191f;color:white;border-radius:18px;padding:24px;min-height:250px;display:flex;flex-direction:column}.report>p{font-size:9px;letter-spacing:.12em;color:#af8752;font-weight:950}.report h3{font:500 28px/1.02 "Iowan Old Style",Baskerville,Georgia,serif;margin:18px 0 12px}.report>span{font-size:11px;line-height:1.6;color:#a7b8c3}.report>div{margin-top:auto;display:flex;gap:9px}.report a{background:white;color:#12191f;text-decoration:none;border-radius:999px;padding:9px 11px;font-size:9px;font-weight:950}.muted{color:#70818a;font-size:12px;line-height:1.6}.muted.small{font-size:10px}.facts{margin:0}.facts div{display:flex;justify-content:space-between;gap:20px;padding:10px 0;border-bottom:1px solid #edf1f2}.facts dt{font-size:10px;color:#74858e}.facts dd{margin:0;font-size:11px;font-weight:900}.statusGrid{display:grid;grid-template-columns:1fr 1fr;gap:10px}.statusGrid>div{border:1px solid #e1e7e9;border-radius:12px;padding:14px;display:grid;gap:6px}.statusGrid b{font-size:11px}.statusGrid span{font-size:10px;color:#71818a;line-height:1.4}
@media(max-width:1050px){.metricGrid,.metricGrid.compact{grid-template-columns:repeat(2,1fr)}.cohortGrid,.reportGrid{grid-template-columns:1fr 1fr}}
@media(max-width:780px){.appShell{grid-template-columns:1fr}.sidebar{position:relative;height:auto;padding:14px 16px}.sidebar nav{display:flex;overflow:auto;margin-top:12px}.sidebar nav a{white-space:nowrap}.workspace,.sideFoot{display:none}.content{padding:24px 14px 55px}.topbar{align-items:flex-start}.twoCol{grid-template-columns:1fr}.reportGrid,.cohortGrid{grid-template-columns:1fr}.hack>div{grid-template-columns:120px 1fr 46px}}
@media(max-width:520px){.metricGrid,.metricGrid.compact{grid-template-columns:1fr 1fr}.metric{min-height:120px;padding:14px}.metric strong{font-size:27px;margin-top:16px}.topbar .outline{display:none}.card{padding:17px}.split,.statusGrid{grid-template-columns:1fr}.reportGrid{grid-template-columns:1fr}}
`;
