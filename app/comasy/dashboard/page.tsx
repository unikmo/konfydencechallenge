import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getCustomerOrganizationId } from "@/lib/comasyAuth";
import { getOrganizationMetrics } from "@/lib/comasyMetrics";
import { isStudentAlias } from "@/lib/comasyStudents";
import { DASH, LANG_COOKIE, VIEW_KEYS, resolveDashLang, type DashLang } from "@/lib/comasyDashboardStrings";
import { LangRemember } from "./LangRemember";
import { ScenarioCreateForm, ScenarioList, type CustomScenarioRow } from "./ScenarioEditor";
import { customScenarioLimit } from "@/lib/comasyCustomScenarios";

type T = (typeof DASH)[DashLang];

export default async function CoMaSyDashboard({ searchParams }: { searchParams: Promise<{ view?: string; lang?: string; notice?: string }> }) {
  const { view: rawView, lang: rawLang, notice } = await searchParams;
  const lang = resolveDashLang(rawLang, (await cookies()).get(LANG_COOKIE)?.value);
  const t = DASH[lang];
  const q = lang === "de" ? "&lang=de" : "";
  const fmt = t.pct;
  const delta = (n: number | null) => (n == null ? t.notEnough : t.pts(n));

  const organizationId = await getCustomerOrganizationId();
  if (!organizationId) redirect(`/comasy/dashboard/login${lang === "de" ? "?lang=de" : ""}`);
  const view = VIEW_KEYS.some((key) => key === rawView) ? rawView! : "overview";
  const viewLabel = t.views[view as keyof T["views"]];
  const status = (value: string) => t.statuses[value] ?? value.replaceAll("_", " ");
  const designation = (value: string) => t.designations[value] ?? value;

  const [org, metrics, cohorts, participants, campaigns, scenarios] = await Promise.all([
    prisma.comasyOrganization.findUniqueOrThrow({ where: { id: organizationId } }),
    getOrganizationMetrics(organizationId),
    prisma.comasyCohort.findMany({ where: { organizationId }, orderBy: { name: "asc" }, include: { _count: { select: { participants: true } } } }),
    prisma.comasyParticipant.findMany({ where: { organizationId }, orderBy: { createdAt: "desc" }, take: 200, include: { cohort: { select: { name: true } } } }),
    prisma.comasyCampaign.findMany({ where: { organizationId }, orderBy: { createdAt: "desc" }, take: 100, include: { cohort: { select: { name: true } }, _count: { select: { responses: true } } } }),
    prisma.scenario.findMany({ where: { active: true, scored: true, lang, edition: "workplace", organizationId: null }, orderBy: [{ hackKey: "asc" }, { externalId: "asc" }], take: 24 }),
  ]);

  // The organisation's own scenarios (see lib/comasyCustomScenarios.ts).
  const ownScenarios = await prisma.scenario.findMany({
    where: { organizationId },
    orderBy: { createdAt: "desc" },
    include: { comasyProfile: { select: { roles: true } } },
  });
  const ownCounts = ownScenarios.length
    ? await prisma.comasyResponse.groupBy({ by: ["scenarioId"], where: { organizationId, scenarioId: { in: ownScenarios.map((x) => x.id) } }, _count: { _all: true } })
    : [];
  const ownRows: CustomScenarioRow[] = ownScenarios.map((x) => ({
    id: x.id,
    title: x.title,
    prompt: x.prompt,
    lang: x.lang,
    hackKey: x.hackKey,
    answersA: x.answersA,
    answersB: x.answersB,
    answersC: x.answersC,
    scoresA: x.scoresA,
    scoresB: x.scoresB,
    scoresC: x.scoresC,
    explanation: x.explanation,
    proTip: x.proTip,
    active: x.active,
    responseCount: ownCounts.find((c) => c.scenarioId === x.id)?._count._all ?? 0,
    roleFocus: x.comasyProfile?.roles ?? null,
  }));
  const pickerScenarios = [...ownScenarios.filter((x) => x.active), ...scenarios];
  const noticeText = noticeMessage(notice, lang);
  const scenarioLimit = customScenarioLimit({ stage: org.stage, arr: org.arr });
  const activeOwn = ownScenarios.filter((x) => x.active).length;

  const activeCampaign = campaigns.find((c) => c.status === "ACTIVE");
  const completedParticipants = new Set((await prisma.comasyResponse.findMany({ where: { organizationId }, select: { participantId: true } })).map((r) => r.participantId)).size;
  const m = t.metrics;
  const switchHref = `/comasy/dashboard?view=${view}&lang=${lang === "de" ? "en" : "de"}`;

  return (
    <main className="appShell">
      <LangRemember lang={lang} />
      <aside className="sidebar">
        <Link className="logo" href="/comasy"><span>K</span><b>CoMaSy</b></Link>
        <p className="workspace">{org.brandingName || org.name}</p>
        <nav>{VIEW_KEYS.map((key) => <Link key={key} className={view === key ? "active" : ""} href={`/comasy/dashboard?view=${key}${q}`}>{t.views[key]}</Link>)}</nav>
        <div className="sideFoot"><span>{t.customerWorkspace}</span><Link href={switchHref} hrefLang={lang === "de" ? "en" : "de"} className="langSwitch">{t.langSwitch}</Link><form action="/api/comasy/auth/logout" method="post"><button>{t.signOut}</button></form></div>
      </aside>

      <section className="content">
        <header className="topbar"><div><p>COMASY / {viewLabel.toUpperCase()}</p><h1>{view === "overview" ? t.overviewTitle : viewLabel}</h1></div><Link href={lang === "de" ? "/de/comasy" : "/comasy"} className="outline">{t.platformHome}</Link></header>

        {view === "overview" && <>
          <div className="metricGrid">
            <Metric label={m.participants} value={String(metrics.participantCount)} note={m.participantsNote(completedParticipants)} />
            <Metric label={m.activeCampaigns} value={String(metrics.activeCampaigns)} note={m.activeCampaignsNote(campaigns.length)} />
            <Metric label={m.participation} value={fmt(metrics.participationRate)} note={m.participationNote} />
            <Metric label={m.pause} value={fmt(metrics.pauseAdoption)} note={m.pauseNote} />
            <Metric label={m.verify} value={fmt(metrics.verificationRate)} note={m.verifyNote} />
            <Metric label={m.impulse} value={fmt(metrics.impulseRate)} note={m.impulseNote} danger={metrics.impulseRate > 25} />
            <Metric label={m.prePost} value={delta(metrics.prePostChange)} note={m.prePostNote} />
          </div>
          <div className="twoCol">
            <Card title={t.hackTitle} eyebrow={t.hackEyebrow}><Hack profile={metrics.hackProfile} labels={t.hack} fmt={fmt} /></Card>
            <Card title={t.attentionTitle} eyebrow={t.attentionEyebrow}>
              {metrics.attentionCohorts.length ? metrics.attentionCohorts.map((c) => <div className="attention" key={c.id}><b>{c.name}</b><span>{t.attentionLine(fmt(c.pauseAdoption), fmt(c.verificationRate), fmt(c.impulseRate))}</span></div>) : <Empty text={t.attentionEmpty} />}
            </Card>
          </div>
          <Card title={t.recentTitle} eyebrow={t.practiceEyebrow}>
            <div className="tableWrap"><table><thead><tr><th>{t.th.campaign}</th><th>{t.th.cohort}</th><th>{t.th.designation}</th><th>{t.th.status}</th><th>{t.th.responses}</th></tr></thead><tbody>{campaigns.slice(0, 6).map((c) => <tr key={c.id}><td><b>{c.name}</b></td><td>{c.cohort?.name || t.allParticipants}</td><td>{designation(c.designation)}</td><td><Status value={c.status} label={status(c.status)} /></td><td>{c._count.responses}</td></tr>)}</tbody></table></div>
          </Card>
        </>}

        {view === "people" && <>
          <div className="twoCol topAlign">
            <Card title={t.people.createCohortTitle} eyebrow={t.people.cohortsEyebrow}><form className="form" action="/api/comasy/manage" method="post"><input type="hidden" name="action" value="create_cohort" /><Field name="name" label={t.people.cohortName} required /><Field name="department" label={t.people.department} /><Field name="country" label={t.people.country} /><Field name="role" label={t.people.role} /><Submit>{t.people.createCohort}</Submit></form></Card>
            <Card title={t.people.inviteTitle} eyebrow={t.people.peopleEyebrow}><form className="form" action="/api/comasy/manage" method="post"><input type="hidden" name="action" value="create_participant" /><div className="split"><Field name="firstName" label={t.people.firstName} required /><Field name="lastName" label={t.people.lastName} required /></div><Field name="email" label={t.people.workEmail} type="email" required /><label>{t.people.cohortLabel}<select name="cohortId"><option value="">{t.people.unassigned}</option>{cohorts.map((c) => <option value={c.id} key={c.id}>{c.name}</option>)}</select></label><Field name="department" label={t.people.department} /><Field name="role" label={t.people.roleSingle} /><Submit>{t.people.addParticipant}</Submit></form></Card>
          </div>
          <Card title={t.people.classTitle} eyebrow={t.people.classEyebrow}><form className="form" action="/api/comasy/manage" method="post"><input type="hidden" name="action" value="create_student_aliases" /><p className="miniTitle">{t.people.classNote}</p><label>{t.people.classCohort}<select name="cohortId" required><option value="">{t.people.selectCohort}</option>{cohorts.map((c) => <option value={c.id} key={c.id}>{c.name}</option>)}</select></label><div className="split"><Field name="prefix" label={t.people.prefix} defaultValue={t.people.prefixDefault} /><Field name="count" label={t.people.count} type="number" required defaultValue="25" /></div><Submit>{t.people.createAliases}</Submit></form><p>{lang === "de" ? <Link href="/api/comasy/links?lang=de">{t.people.csvLinksDe}</Link> : <><Link href="/api/comasy/links">{t.people.csvLinks}</Link> · <Link href="/api/comasy/links?lang=de">{t.people.csvLinksDe}</Link></>}</p></Card>
          <Card title={t.people.participantsTitle} eyebrow={t.people.records(participants.length)}>
            <div className="tableWrap"><table><thead><tr><th>{t.th.participant}</th><th>{t.th.cohort}</th><th>{t.th.department}</th><th>{t.th.status}</th><th>{t.th.practice}</th><th>{t.th.manage}</th></tr></thead><tbody>{participants.map((p) => <tr key={p.id}><td><b>{p.firstName} {p.lastName}</b>{isStudentAlias(p.email) ? <small>{t.people.alias}</small> : <small>{p.email}</small>}</td><td>{p.cohort?.name || "—"}</td><td>{p.department || "—"}</td><td><Status value={p.status} label={status(p.status)} /></td><td>{activeCampaign && (!activeCampaign.cohortId || activeCampaign.cohortId === p.cohortId) ? <Link href={`/comasy/practice/${p.accessToken}?campaign=${activeCampaign.id}${q}`}>{t.people.openLink}</Link> : "—"}</td><td><form action="/api/comasy/manage" method="post" className="inline"><input type="hidden" name="action" value="participant_status"/><input type="hidden" name="participantId" value={p.id}/><input type="hidden" name="status" value={p.status === "DISABLED" ? "INVITED" : "DISABLED"}/><button>{p.status === "DISABLED" ? t.people.enable : t.people.disable}</button></form> <form action="/api/comasy/manage" method="post" className="inline"><input type="hidden" name="action" value="delete_participant"/><input type="hidden" name="participantId" value={p.id}/><button>{t.people.deleteData}</button></form></td></tr>)}</tbody></table></div>
          </Card>
          <Card title={t.people.cohortsTitle} eyebrow={t.people.segmentation}><div className="cohortGrid">{cohorts.map((c) => <div className="cohort" key={c.id}><b>{c.name}</b><span>{t.people.participantsN(c._count.participants)}</span><small>{[c.department,c.country,c.role].filter(Boolean).join(" · ") || t.people.noFilters}</small></div>)}</div></Card>
        </>}

        {view === "practice" && <>
          <div className="twoCol topAlign">
            <Card title={t.practice.createTitle} eyebrow={t.practice.createEyebrow}><form className="form" action="/api/comasy/manage" method="post"><input type="hidden" name="action" value="create_campaign" /><Field name="name" label={t.practice.campaignName} required /><label>{t.people.cohortLabel}<select name="cohortId"><option value="">{t.practice.allParticipantsOpt}</option>{cohorts.map((c) => <option value={c.id} key={c.id}>{c.name}</option>)}</select></label><div className="split"><label>{t.practice.designation}<select name="designation">{(["BASELINE", "PRACTICE", "FOLLOWUP"] as const).map((v) => <option key={v} value={v}>{designation(v)}</option>)}</select></label><label>{t.practice.statusLabel}<select name="status">{(["DRAFT", "SCHEDULED", "ACTIVE"] as const).map((v) => <option key={v} value={v}>{status(v)}</option>)}</select></label></div><Field name="scheduledAt" label={t.practice.schedule} type="datetime-local" /><Field name="roleFocus" label={t.practice.roleFocus} /><label>{t.practice.hackFocus}<select name="hackFocus"><option value="">{t.practice.balanced}</option><option value="H">{t.hack.H}</option><option value="A">{t.hack.A}</option><option value="C">{t.hack.C}</option><option value="K">{t.hack.K}</option></select></label><p className="miniTitle">{t.practice.library}</p><div className="scenarioPicker">{pickerScenarios.map((s) => <label key={s.id}><input type="checkbox" name="scenarioIds" value={s.id} /><span><b>{s.organizationId ? (lang === "de" ? "Eigene" : "Yours") : s.externalId}</b> {s.title || s.prompt.slice(0,70)} <em>{s.hackKey}{s.lang === "de" && lang !== "de" ? " · DE" : ""}</em></span></label>)}</div><Submit>{t.practice.createCampaign}</Submit></form></Card>
            <Card title={t.practice.rulesTitle} eyebrow={t.practice.rulesEyebrow}><div className="rules">{t.practice.rules.map(([name, copy]) => <p key={name}><b>{name}</b> {copy}</p>)}<p>{t.practice.rulesLast}</p></div></Card>
          </div>
          {noticeText ? <p className={noticeText.startsWith("Saved") || noticeText.startsWith("Gespeichert") ? "notice ok" : "notice"} role="status">{noticeText}</p> : null}
          <div className="twoCol topAlign">
            <Card title={lang === "de" ? "Eigenes Szenario schreiben" : "Write your own scenario"} eyebrow={lang === "de" ? "EURE FRAGEN" : "YOUR QUESTIONS"}><ScenarioCreateForm lang={lang} /></Card>
            <Card title={lang === "de" ? "Eure Szenarien" : "Your scenarios"} eyebrow={lang === "de" ? `${activeOwn} VON ${scenarioLimit} IN GEBRAUCH` : `${activeOwn} OF ${scenarioLimit} IN USE`}><ScenarioList scenarios={ownRows} lang={lang} /></Card>
          </div>
          <Card title={t.practice.campaignsTitle} eyebrow={t.practice.liveOps}><div className="tableWrap"><table><thead><tr><th>{t.th.campaign}</th><th>{t.th.cohort}</th><th>{t.th.type}</th><th>{t.th.status}</th><th>{t.th.responses}</th><th>{t.th.control}</th></tr></thead><tbody>{campaigns.map((c) => <tr key={c.id}><td><b>{c.name}</b><small>{c.roleFocus || t.practice.general}</small></td><td>{c.cohort?.name || t.all}</td><td>{designation(c.designation)}</td><td><Status value={c.status} label={status(c.status)} /></td><td>{c._count.responses}</td><td><form action="/api/comasy/manage" method="post" className="inline"><input type="hidden" name="action" value="campaign_status"/><input type="hidden" name="campaignId" value={c.id}/><select name="status" defaultValue={c.status}>{(["DRAFT", "SCHEDULED", "ACTIVE", "PAUSED", "COMPLETED"] as const).map((v) => <option key={v} value={v}>{status(v)}</option>)}</select><button>{t.practice.save}</button></form></td></tr>)}</tbody></table></div></Card>
        </>}

        {view === "measure" && <>
          <div className="metricGrid compact"><Metric label={m.pause} value={fmt(metrics.pauseAdoption)} note={m.pauseNoteShort}/><Metric label={m.verify} value={fmt(metrics.verificationRate)} note={m.verifyNoteShort}/><Metric label={m.impulse} value={fmt(metrics.impulseRate)} note={m.impulseNote} danger={metrics.impulseRate>25}/><Metric label={m.prePostShort} value={delta(metrics.prePostChange)} note={m.baselineLater(fmt(metrics.baselinePause), fmt(metrics.followupPause))}/></div>
          <div className="twoCol"><Card title={t.measure.hackBreakdown} eyebrow={t.measure.trigger}><Hack profile={metrics.hackProfile} labels={t.hack} fmt={fmt}/></Card><Card title={t.measure.definitions} eyebrow={t.measure.transparent}><div className="definitions">{t.measure.defs.map(([name, copy]) => <p key={name}><b>{name}</b> {copy}</p>)}<p>{t.measure.defsNote}</p></div></Card></div>
          <Card title={t.measure.cohortComparison} eyebrow={t.measure.whereFocus}><div className="tableWrap"><table><thead><tr><th>{t.measure.cohortCol}</th><th>{t.th.responses}</th><th>{t.th.pause}</th><th>{t.th.verify}</th><th>{t.th.impulse}</th></tr></thead><tbody>{metrics.cohorts.map((c)=><tr key={c.id}><td><b>{c.name}</b></td><td>{c.responses}</td><td>{fmt(c.pauseAdoption)}</td><td>{fmt(c.verificationRate)}</td><td>{fmt(c.impulseRate)}</td></tr>)}</tbody></table></div></Card>
          <p><Link href={`/comasy/dashboard/insights${lang === "de" ? "?lang=de" : ""}`}>{t.reports.insights}</Link></p>
        </>}

        {view === "reports" && <>
          <div className="reportGrid">{(["executive", "awareness", "compliance"] as const).map((type) => <Report key={type} title={t.reports.items[type][0]} copy={t.reports.items[type][1]} type={type} lang={lang} labels={t.reports} />)}</div>
          <Card title={t.reports.periodsTitle} eyebrow={t.reports.evidence}><p className="muted">{t.reports.periodsCopy}</p><p><Link href={`/comasy/dashboard/insights${lang === "de" ? "?lang=de" : ""}`}>{t.reports.insights}</Link></p></Card>
        </>}

        {view === "settings" && <>
          <div className="twoCol topAlign"><Card title={t.settings.orgTitle} eyebrow={t.settings.workspace}><dl className="facts"><div><dt>{t.settings.organisation}</dt><dd>{org.name}</dd></div><div><dt>{t.settings.country}</dt><dd>{org.country || "—"}</dd></div><div><dt>{t.settings.industry}</dt><dd>{org.industry || "—"}</dd></div><div><dt>{t.settings.nis2}</dt><dd>{org.nis2Relevant ? t.settings.nis2Yes : t.settings.nis2No}</dd></div></dl></Card><Card title={t.settings.wsTitle} eyebrow={t.settings.privacy}><form className="form" action="/api/comasy/manage" method="post"><input type="hidden" name="action" value="settings"/><Field name="brandingName" label={t.settings.displayName} defaultValue={org.brandingName || ""}/><Field name="retentionDays" label={t.settings.retention} type="number" defaultValue={String(org.retentionDays)}/><Submit>{t.settings.saveSettings}</Submit></form><p className="muted small">{t.settings.retentionNote}</p></Card></div>
          <Card title={t.settings.permsTitle} eyebrow={t.settings.status}><div className="statusGrid">{t.settings.perms.map(([name, copy]) => <div key={name}><b>{name}</b><span>{copy}</span></div>)}</div></Card>
        </>}
      </section>

      <style>{styles}</style>
    </main>
  );
}

function Metric({label,value,note,danger=false}:{label:string;value:string;note:string;danger?:boolean}){return <article className={`metric ${danger?"danger":""}`}><span>{label}</span><strong>{value}</strong><small>{note}</small></article>}
function noticeMessage(notice: string | undefined, lang: DashLang): string | null {
  if (!notice) return null;
  const de = lang === "de";
  if (notice === "scenario-saved") return de ? "Gespeichert. Euer Szenario steht bei neuen Kampagnen in der Bibliothek." : "Saved. Your scenario is in the library for new campaigns.";
  if (notice === "scenario-locked") return de ? "Dieses Szenario wurde schon beantwortet und lässt sich nicht mehr ändern. Archiviert es und schreibt eine neue Fassung." : "That scenario has already been answered, so it can no longer be edited. Archive it and write a new version.";
  if (notice === "scenario-in-use") return de ? "Dieses Szenario steckt in einer geplanten oder laufenden Kampagne. Pausiert oder beendet zuerst die Kampagne." : "That scenario is in a scheduled or active campaign. Pause or complete the campaign first.";
  if (notice === "scenario-limit") return de ? "Ihr habt die Zahl eigener Szenarien erreicht, die in eurem Paket enthalten ist. Archiviert eines, das ihr nicht mehr braucht, oder fragt uns nach einem größeren Kontingent." : "You have reached the number of own scenarios included in your plan. Archive one you no longer use, or ask us about a larger allowance.";
  if (notice.startsWith("scenario-invalid:")) return notice.slice("scenario-invalid:".length);
  return null;
}

function Card({title,eyebrow,children}:{title:string;eyebrow:string;children:React.ReactNode}){return <section className="card"><p className="cardEye">{eyebrow}</p><h2>{title}</h2>{children}</section>}
function Status({value,label}:{value:string;label:string}){return <span className={`status status-${value.toLowerCase()}`}>{label}</span>}
function Empty({text}:{text:string}){return <p className="muted">{text}</p>}
function Hack({profile,labels,fmt}:{profile:Record<"H"|"A"|"C"|"K",number>;labels:Record<"H"|"A"|"C"|"K",string>;fmt:(n:number)=>string}){return <div className="hack">{(["H","A","C","K"] as const).map((k)=><div key={k}><span><b>{k}</b>{labels[k]}</span><i><em style={{width:`${profile[k]}%`}}/></i><strong>{fmt(profile[k])}</strong></div>)}</div>}
function Field({name,label,type="text",required=false,defaultValue}:{name:string;label:string;type?:string;required?:boolean;defaultValue?:string}){return <label>{label}<input name={name} type={type} required={required} defaultValue={defaultValue}/></label>}
function Submit({children}:{children:React.ReactNode}){return <button className="submit" type="submit">{children}<span>→</span></button>}
function Report({title,copy,type,lang,labels}:{title:string;copy:string;type:string;lang:DashLang;labels:{report:string;pdf:string;csv:string}}){const l=lang==="de"?"&lang=de":"";return <article className="report"><p>{labels.report}</p><h3>{title}</h3><span>{copy}</span><div><Link href={`/api/comasy/reports/pdf?type=${type}${l}`}>{labels.pdf}</Link><Link href={`/api/comasy/reports/csv?type=${type}${l}`}>{labels.csv}</Link></div></article>}

const styles = `
:global(*){box-sizing:border-box}:global(body){margin:0;background:#edf1f3;color:#0a1a28}.appShell{min-height:100vh;display:grid;grid-template-columns:250px 1fr;font-family:Inter,system-ui,sans-serif}.sidebar{position:sticky;top:0;height:100vh;background:#12191f;color:white;padding:28px 20px;display:flex;flex-direction:column}.logo{display:flex;align-items:center;gap:10px;color:white;text-decoration:none}.logo span{width:30px;height:30px;border:1px solid #8ba0ae;border-radius:50%;display:grid;place-items:center;font-size:11px}.logo b{font-size:15px}.workspace{color:#90a4b3;font-size:11px;margin:22px 0 14px;padding-bottom:16px;border-bottom:1px solid #ffffff18}.sidebar nav{display:grid;gap:5px}.sidebar nav a{color:#9fb0bc;text-decoration:none;padding:11px 12px;border-radius:9px;font-size:12px;font-weight:800}.sidebar nav a:hover,.sidebar nav a.active{background:#13314a;color:white}.sidebar nav a.active:before{content:"";display:inline-block;width:6px;height:6px;background:#af8752;border-radius:50%;margin-right:9px}.sideFoot{margin-top:auto;color:#718797;font-size:10px;display:grid;gap:10px}.langSwitch{color:#aabac5;text-decoration:underline;font-size:10px}.sideFoot button{background:none;color:#aabac5;border:0;padding:0;text-align:left;text-decoration:underline;cursor:pointer}.content{padding:36px clamp(20px,4vw,54px) 70px;min-width:0}.topbar{display:flex;justify-content:space-between;gap:20px;align-items:flex-end;margin-bottom:28px}.topbar p,.notice{background:#fbeee9;border:1px solid #ecccc4;color:#9f2f25;border-radius:12px;padding:12px 14px;font-size:13px;line-height:1.5;margin:0 0 12px}.notice.ok{background:#eaf5ee;border-color:#c8e3d1;color:#1f5a35}.scenarioList{display:grid;gap:12px}.scenarioItem{border:1px solid #dce3e6;border-radius:14px;padding:14px}.scenarioItem.isArchived{opacity:.6}.scenarioItem header{display:flex;justify-content:space-between;gap:10px;align-items:center}.scenarioItem p{font-size:12px;line-height:1.55;color:#536873;margin:8px 0}.scenarioItem details{margin-top:10px}.scenarioItem summary{cursor:pointer;font-size:11px;font-weight:900;color:#0a1a28}.scenarioItem .locked{display:block;margin-top:8px;color:#8a6a1f}.answerRow{display:grid;grid-template-columns:1.3fr 1fr;gap:10px}textarea{width:100%;border:1px solid #ccd7db;border-radius:10px;padding:11px;font:inherit;color:#0a1a28;background:white}.cardEye{font-size:9px;letter-spacing:.14em;font-weight:950;color:#607786;margin:0 0 8px}.topbar h1{font:500 clamp(32px,4vw,50px)/1 "Iowan Old Style",Baskerville,Georgia,serif;letter-spacing:-.04em;margin:0}.outline{border:1px solid #aebcc4;border-radius:999px;padding:10px 14px;text-decoration:none;color:#183044;font-size:11px;font-weight:900}.metricGrid{display:grid;grid-template-columns:repeat(4,minmax(150px,1fr));gap:12px;margin-bottom:16px}.metricGrid.compact{grid-template-columns:repeat(4,1fr)}.metric{background:white;border:1px solid #dce3e6;border-radius:16px;padding:18px;min-height:138px;display:flex;flex-direction:column}.metric>span{font-size:10px;font-weight:900;color:#667983}.metric strong{font:500 34px/1 "Iowan Old Style",Baskerville,Georgia,serif;margin:22px 0 9px}.metric small{margin-top:auto;color:#89969c;font-size:10px;line-height:1.4}.metric.danger strong{color:#cc473f}.twoCol{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin:16px 0}.topAlign{align-items:start}.card{background:white;border:1px solid #dce3e6;border-radius:18px;padding:22px;margin:16px 0}.twoCol>.card{margin:0}.card h2{font:500 28px/1.05 "Iowan Old Style",Baskerville,Georgia,serif;letter-spacing:-.03em;margin:0 0 20px}.hack{display:grid;gap:14px}.hack>div{display:grid;grid-template-columns:150px 1fr 50px;gap:12px;align-items:center}.hack span{font-size:11px;color:#586d79}.hack span b{display:inline-grid;place-items:center;width:24px;height:24px;border:1px solid #b8c5ca;border-radius:50%;margin-right:9px;color:#0a1a28}.hack i{height:7px;background:#e9eef0;border-radius:9px;overflow:hidden}.hack em{display:block;height:100%;background:#173e5d}.hack strong{font-size:11px;text-align:right}.attention{display:flex;justify-content:space-between;gap:16px;padding:14px 0;border-bottom:1px solid #e8edef}.attention:last-child{border-bottom:0}.attention b{font-size:13px}.attention span{color:#697b85;font-size:10px;text-align:right}.tableWrap{overflow:auto}table{width:100%;border-collapse:collapse;min-width:670px}th{text-align:left;font-size:9px;letter-spacing:.08em;color:#73858f;text-transform:uppercase;padding:10px 8px;border-bottom:1px solid #e0e7e9}td{padding:13px 8px;border-bottom:1px solid #edf1f2;font-size:11px;vertical-align:top}td b{display:block;font-size:12px}td small{display:block;color:#829098;margin-top:4px}.status{display:inline-block;border-radius:99px;padding:5px 8px;background:#edf1f2;font-size:8px;font-weight:950}.status-active,.status-completed{background:#e7f6cf;color:#456520}.status-invited,.status-scheduled{background:#edf4ff;color:#285b8d}.status-paused{background:#fff0cf;color:#85641b}.form{display:grid;gap:13px}.form label{display:grid;gap:6px;font-size:10px;font-weight:900;color:#536873}.form input,.form select,.inline select{width:100%;border:1px solid #ccd7db;border-radius:10px;padding:11px;background:white;font:inherit;color:#0a1a28}.split{display:grid;grid-template-columns:1fr 1fr;gap:10px}.submit{border:0;border-radius:999px;padding:12px 15px;background:#111417;color:white;font-weight:950;display:flex;justify-content:space-between;cursor:pointer}.cohortGrid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.cohort{border:1px solid #e0e6e8;border-radius:12px;padding:14px;display:grid;gap:7px}.cohort b{font:500 20px "Iowan Old Style",Baskerville,Georgia,serif}.cohort span,.cohort small{font-size:10px;color:#71818a}.scenarioPicker{max-height:310px;overflow:auto;border:1px solid #dae2e5;border-radius:12px;padding:6px}.scenarioPicker label{display:flex;grid-template-columns:none;align-items:flex-start;gap:9px;padding:9px;border-bottom:1px solid #edf1f2;cursor:pointer}.scenarioPicker input{width:auto;margin-top:2px}.scenarioPicker span{font-size:10px;font-weight:600;line-height:1.4}.scenarioPicker em{font-style:normal;background:#e9eef0;border-radius:6px;padding:2px 5px;margin-left:5px}.miniTitle{font-size:10px;font-weight:950;color:#536873;margin:5px 0 -5px}.rules,.definitions{color:#5e707a;font-size:12px;line-height:1.65}.rules b,.definitions b{color:#0a1a28}.inline{display:flex;gap:6px}.inline button{border:0;background:#0a1a28;color:white;border-radius:8px;padding:7px 9px;font-size:9px;font-weight:900}.reportGrid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}.report{background:#12191f;color:white;border-radius:18px;padding:24px;min-height:250px;display:flex;flex-direction:column}.report>p{font-size:9px;letter-spacing:.12em;color:#af8752;font-weight:950}.report h3{font:500 28px/1.02 "Iowan Old Style",Baskerville,Georgia,serif;margin:18px 0 12px}.report>span{font-size:11px;line-height:1.6;color:#a7b8c3}.report>div{margin-top:auto;display:flex;gap:9px}.report a{background:white;color:#12191f;text-decoration:none;border-radius:999px;padding:9px 11px;font-size:9px;font-weight:950}.muted{color:#70818a;font-size:12px;line-height:1.6}.muted.small{font-size:10px}.facts{margin:0}.facts div{display:flex;justify-content:space-between;gap:20px;padding:10px 0;border-bottom:1px solid #edf1f2}.facts dt{font-size:10px;color:#74858e}.facts dd{margin:0;font-size:11px;font-weight:900}.statusGrid{display:grid;grid-template-columns:1fr 1fr;gap:10px}.statusGrid>div{border:1px solid #e1e7e9;border-radius:12px;padding:14px;display:grid;gap:6px}.statusGrid b{font-size:11px}.statusGrid span{font-size:10px;color:#71818a;line-height:1.4}
@media(max-width:1050px){.metricGrid,.metricGrid.compact{grid-template-columns:repeat(2,1fr)}.cohortGrid,.reportGrid{grid-template-columns:1fr 1fr}}
@media(max-width:780px){.appShell{grid-template-columns:1fr}.sidebar{position:relative;height:auto;padding:14px 16px}.sidebar nav{display:flex;overflow:auto;margin-top:12px}.sidebar nav a{white-space:nowrap}.workspace,.sideFoot{display:none}.content{padding:24px 14px 55px}.topbar{align-items:flex-start}.twoCol{grid-template-columns:1fr}.reportGrid,.cohortGrid{grid-template-columns:1fr}.hack>div{grid-template-columns:120px 1fr 46px}}
@media(max-width:520px){.metricGrid,.metricGrid.compact{grid-template-columns:1fr 1fr}.metric{min-height:120px;padding:14px}.metric strong{font-size:27px;margin-top:16px}.topbar .outline{display:none}.card{padding:17px}.split,.statusGrid{grid-template-columns:1fr}.reportGrid{grid-template-columns:1fr}}
`;
