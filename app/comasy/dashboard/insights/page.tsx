import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getCustomerOrganizationId } from "@/lib/comasyAuth";
import { getOrganizationMetrics, getOrganizationTrend, periodStart } from "@/lib/comasyMetrics";
import { DASH, LANG_COOKIE, resolveDashLang, type DashLang } from "@/lib/comasyDashboardStrings";
import { LangRemember } from "../LangRemember";

const periods = ["30", "90", "365", "all"] as const;

const INS = {
  en: {
    periodLabels: { "30": "30 days", "90": "90 days", "365": "12 months", all: "All time" } as Record<string, string>,
    title: "Behaviour over time.",
    back: "Back to dashboard",
    reports: "Reports",
    periodAria: "Reporting period",
    periodEyebrow: "REPORTING PERIOD",
    periodCopy: "Metrics, trends and exports use the same selected date window.",
    inWorkspace: (n: number) => `${n} participants in workspace`,
    pauseNote: "responses that interrupt or safely challenge the risky chain",
    verifyNote: "responses using independent verification",
    impulseNote: "immediate higher-risk action",
    decisions: "Recorded decisions",
    decisionsNote: (n: number) => `${n} active or scheduled campaigns`,
    pauseShort: (a: string, b: string) => `Pause: ${a} → ${b}`,
    trendEyebrow: "TREND OVER TIME",
    trendTitle: "Campaign-by-campaign behaviour",
    trendCount: (n: number) => `${n} campaigns with recorded responses`,
    decisionsN: (n: number) => `${n} decisions`,
    decisionsTitle: (n: number) => `${n} recorded decisions`,
    emptyTrend: "No campaign responses exist in this reporting period yet.",
    hackEyebrow: "H.A.C.K. PROFILE",
    hackTitle: "Pressure resilience",
    evidenceEyebrow: "EVIDENCE",
    exportTitle: "Export this period",
    reportItems: {
      executive: ["Executive", "Participation, movement, pressure profile and priority focus."],
      awareness: ["Security Awareness", "Campaign activity, behavioural indicators and cohort comparison."],
      compliance: ["Compliance / NIS2", "Programme activity and effectiveness evidence with the required compliance disclaimer."],
    },
    cohortEyebrow: "COHORT COMPARISON",
    cohortTitle: "Where behaviour differs",
    cohortNote: "No unsupported vulnerability claims—only recorded decisions.",
    emptyCohort: "No cohort-level responses exist in this reporting period yet.",
    emptyCohortsSimple: "",
  },
  de: {
    periodLabels: { "30": "30 Tage", "90": "90 Tage", "365": "12 Monate", all: "Gesamter Zeitraum" } as Record<string, string>,
    title: "Verhalten im Zeitverlauf.",
    back: "Zurück zum Überblick",
    reports: "Berichte",
    periodAria: "Berichtszeitraum",
    periodEyebrow: "BERICHTSZEITRAUM",
    periodCopy: "Kennzahlen, Verläufe und Exporte beziehen sich auf denselben gewählten Zeitraum.",
    inWorkspace: (n: number) => `${n} Teilnehmende im Arbeitsbereich`,
    pauseNote: "Antworten, die die riskante Handlungskette unterbrechen oder sicher hinterfragen",
    verifyNote: "Antworten mit unabhängiger Überprüfung",
    impulseNote: "sofortiges Handeln trotz höheren Risikos",
    decisions: "Erfasste Entscheidungen",
    decisionsNote: (n: number) => (n === 1 ? "1 aktive oder geplante Kampagne" : `${n} aktive oder geplante Kampagnen`),
    pauseShort: (a: string, b: string) => `Pause: ${a} → ${b}`,
    trendEyebrow: "VERLAUF",
    trendTitle: "Verhalten Kampagne für Kampagne",
    trendCount: (n: number) => (n === 1 ? "1 Kampagne mit erfassten Antworten" : `${n} Kampagnen mit erfassten Antworten`),
    decisionsN: (n: number) => `${n} Entscheidungen`,
    decisionsTitle: (n: number) => `${n} erfasste Entscheidungen`,
    emptyTrend: "In diesem Zeitraum liegen noch keine Kampagnenantworten vor.",
    hackEyebrow: "H.A.C.K.-PROFIL",
    hackTitle: "Widerstandsfähigkeit gegen Druck",
    evidenceEyebrow: "NACHWEISE",
    exportTitle: "Diesen Zeitraum exportieren",
    reportItems: {
      executive: ["Management", "Beteiligung, Entwicklung, Druckprofil und Schwerpunkte."],
      awareness: ["Sicherheitsbewusstsein", "Kampagnenaktivität, Verhaltensindikatoren und Kohortenvergleich."],
      compliance: ["Compliance / NIS2", "Programmaktivität und Wirksamkeitsnachweise mit dem erforderlichen Compliance-Hinweis."],
    },
    cohortEyebrow: "KOHORTENVERGLEICH",
    cohortTitle: "Wo sich das Verhalten unterscheidet",
    cohortNote: "Keine Behauptungen ohne Grundlage – nur erfasste Entscheidungen.",
    emptyCohort: "In diesem Zeitraum liegen noch keine Antworten auf Kohortenebene vor.",
    emptyCohortsSimple: "",
  },
} as const;

export default async function CustomerInsightsPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string; lang?: string }>;
}) {
  const { period: rawPeriod, lang: rawLang } = await searchParams;
  const lang: DashLang = resolveDashLang(rawLang, (await cookies()).get(LANG_COOKIE)?.value);
  const t = INS[lang];
  const d = DASH[lang];
  const q = lang === "de" ? "&lang=de" : "";
  const qFirst = lang === "de" ? "?lang=de" : "";
  const fmt = d.pct;
  const delta = (value: number | null) => (value == null ? d.notEnough : d.pts(value));

  const organizationId = await getCustomerOrganizationId();
  if (!organizationId) redirect(`/comasy/dashboard/login${qFirst}`);

  const period = periods.some((key) => key === rawPeriod) ? rawPeriod! : "90";
  const since = periodStart(period);

  const [organization, metrics, trend] = await Promise.all([
    prisma.comasyOrganization.findUniqueOrThrow({
      where: { id: organizationId },
      select: { name: true, brandingName: true },
    }),
    getOrganizationMetrics(organizationId, since),
    getOrganizationTrend(organizationId, since),
  ]);

  const maxResponses = Math.max(1, ...trend.map((row) => row.responses));

  return (
    <main className="insightsPage">
      <LangRemember lang={lang} />
      <header className="header">
        <div>
          <p className="eyebrow">COMASY / {d.views.measure.toUpperCase()}</p>
          <h1>{t.title}</h1>
          <span>{organization.brandingName || organization.name}</span>
        </div>
        <div className="headerActions">
          <Link href={`/comasy/dashboard?view=measure${q}`}>{t.back}</Link>
          <Link href={`/comasy/dashboard?view=reports${q}`}>{t.reports}</Link>
        </div>
      </header>

      <section className="periodBar" aria-label={t.periodAria}>
        <div>
          <p>{t.periodEyebrow}</p>
          <span>{t.periodCopy}</span>
        </div>
        <nav>
          {periods.map((key) => (
            <Link key={key} className={period === key ? "active" : ""} href={`/comasy/dashboard/insights?period=${key}${q}`}>
              {t.periodLabels[key]}
            </Link>
          ))}
        </nav>
      </section>

      <section className="metricGrid">
        <Metric label={d.metrics.participation} value={fmt(metrics.participationRate)} note={t.inWorkspace(metrics.participantCount)} />
        <Metric label={d.metrics.pause} value={fmt(metrics.pauseAdoption)} note={t.pauseNote} />
        <Metric label={d.metrics.verify} value={fmt(metrics.verificationRate)} note={t.verifyNote} />
        <Metric label={d.metrics.impulse} value={fmt(metrics.impulseRate)} note={t.impulseNote} danger={metrics.impulseRate > 25} />
        <Metric label={d.metrics.prePost} value={delta(metrics.prePostChange)} note={t.pauseShort(fmt(metrics.baselinePause), fmt(metrics.followupPause))} />
        <Metric label={t.decisions} value={String(metrics.responseCount)} note={t.decisionsNote(metrics.activeCampaigns)} />
      </section>

      <section className="panel">
        <div className="panelHead">
          <div><p className="eyebrow">{t.trendEyebrow}</p><h2>{t.trendTitle}</h2></div>
          <span>{t.trendCount(trend.length)}</span>
        </div>
        {trend.length ? (
          <div className="trendList">
            {trend.map((row) => (
              <article key={row.id} className="trendRow">
                <div className="trendMeta">
                  <strong>{row.name}</strong>
                  <span>{d.designations[row.designation] ?? row.designation} · {row.date.toISOString().slice(0, 10)} · {t.decisionsN(row.responses)}</span>
                </div>
                <div className="bars">
                  <Bar label={d.th.pause} value={row.pauseAdoption} fmt={fmt} />
                  <Bar label={d.th.verify} value={row.verificationRate} fmt={fmt} />
                  <Bar label={d.th.impulse} value={row.impulseRate} fmt={fmt} inverse />
                </div>
                <div className="responseVolume" title={t.decisionsTitle(row.responses)}>
                  <i style={{ width: `${Math.max(5, (row.responses / maxResponses) * 100)}%` }} />
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty">{t.emptyTrend}</div>
        )}
      </section>

      <section className="split">
        <section className="panel">
          <div className="panelHead"><div><p className="eyebrow">{t.hackEyebrow}</p><h2>{t.hackTitle}</h2></div></div>
          <div className="hack">
            {(["H", "A", "C", "K"] as const).map((key) => (
              <div key={key}>
                <span><b>{key}</b>{d.hack[key]}</span>
                <i><em style={{ width: `${metrics.hackProfile[key]}%` }} /></i>
                <strong>{fmt(metrics.hackProfile[key])}</strong>
              </div>
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="panelHead"><div><p className="eyebrow">{t.evidenceEyebrow}</p><h2>{t.exportTitle}</h2></div></div>
          <div className="reportTypes">
            {(["executive", "awareness", "compliance"] as const).map((type) => (
              <Report key={type} type={type} title={t.reportItems[type][0]} copy={t.reportItems[type][1]} period={period} q={q} />
            ))}
          </div>
        </section>
      </section>

      <section className="panel">
        <div className="panelHead"><div><p className="eyebrow">{t.cohortEyebrow}</p><h2>{t.cohortTitle}</h2></div><span>{t.cohortNote}</span></div>
        {metrics.cohorts.length ? (
          <div className="tableWrap">
            <table>
              <thead><tr><th>{d.measure.cohortCol}</th><th>{d.th.responses}</th><th>{d.th.pause}</th><th>{d.th.verify}</th><th>{d.th.impulse}</th></tr></thead>
              <tbody>{metrics.cohorts.map((cohort) => <tr key={cohort.id}><td><b>{cohort.name}</b></td><td>{cohort.responses}</td><td>{fmt(cohort.pauseAdoption)}</td><td>{fmt(cohort.verificationRate)}</td><td>{fmt(cohort.impulseRate)}</td></tr>)}</tbody>
            </table>
          </div>
        ) : <div className="empty">{t.emptyCohort}</div>}
      </section>

      <style>{styles}</style>
    </main>
  );
}

function Metric({ label, value, note, danger = false }: { label: string; value: string; note: string; danger?: boolean }) {
  return <article className={`metric ${danger ? "danger" : ""}`}><span>{label}</span><strong>{value}</strong><small>{note}</small></article>;
}

function Bar({ label, value, fmt, inverse = false }: { label: string; value: number; fmt: (n: number) => string; inverse?: boolean }) {
  return <div className={`bar ${inverse ? "inverse" : ""}`}><span>{label}</span><i><em style={{ width: `${value}%` }} /></i><strong>{fmt(value)}</strong></div>;
}

function Report({ type, title, copy, period, q }: { type: string; title: string; copy: string; period: string; q: string }) {
  return <article><div><b>{title}</b><span>{copy}</span></div><nav><Link href={`/api/comasy/reports/pdf?type=${type}&period=${period}${q}`}>PDF</Link><Link href={`/api/comasy/reports/csv?type=${type}&period=${period}${q}`}>CSV</Link></nav></article>;
}

const styles = `
:global(*){box-sizing:border-box}:global(body){margin:0;background:#edf1f3;color:#12191f}.insightsPage{min-height:100vh;padding:34px clamp(18px,4vw,58px) 80px;font-family:Inter,system-ui,sans-serif;max-width:1500px;margin:auto}.header{display:flex;justify-content:space-between;gap:24px;align-items:flex-end;margin-bottom:24px}.eyebrow{font-size:9px;letter-spacing:.14em;font-weight:950;color:#667c89;margin:0 0 8px}.header h1,.panel h2{font-family:"Iowan Old Style",Baskerville,Georgia,serif;font-weight:500;letter-spacing:-.04em}.header h1{font-size:clamp(38px,5vw,62px);line-height:.96;margin:0 0 10px}.header>div>span{font-size:11px;color:#71838d}.headerActions{display:flex;gap:8px}.headerActions a{border:1px solid #b8c5cb;border-radius:999px;padding:10px 13px;color:#17354c;text-decoration:none;font-size:10px;font-weight:900}.periodBar{background:#12191f;color:white;border-radius:18px;padding:18px 20px;display:flex;justify-content:space-between;gap:20px;align-items:center;margin-bottom:14px}.periodBar p{margin:0 0 5px;color:#af8752;font-size:9px;font-weight:950;letter-spacing:.12em}.periodBar span{font-size:10px;color:#93a7b5}.periodBar nav{display:flex;gap:6px;flex-wrap:wrap}.periodBar a{color:#afbfca;text-decoration:none;border:1px solid #ffffff1f;border-radius:999px;padding:9px 11px;font-size:9px;font-weight:900}.periodBar a.active{background:#af8752;color:#12191f;border-color:#af8752}.metricGrid{display:grid;grid-template-columns:repeat(6,minmax(130px,1fr));gap:10px}.metric{background:white;border:1px solid #dae3e6;border-radius:15px;padding:17px;min-height:142px;display:flex;flex-direction:column}.metric>span{font-size:9px;font-weight:900;color:#667b87}.metric strong{font:500 31px "Iowan Old Style",Baskerville,Georgia,serif;margin:20px 0 8px}.metric small{font-size:9px;line-height:1.45;color:#84949c;margin-top:auto}.metric.danger strong{color:#c64b42}.panel{background:white;border:1px solid #dbe3e6;border-radius:18px;padding:22px;margin-top:14px}.panelHead{display:flex;justify-content:space-between;gap:20px;align-items:flex-end;margin-bottom:20px}.panel h2{font-size:28px;line-height:1;margin:0}.panelHead>span{font-size:9px;color:#82919a;max-width:320px;text-align:right}.trendList{display:grid;gap:10px}.trendRow{display:grid;grid-template-columns:minmax(180px,280px) 1fr 90px;gap:20px;align-items:center;border-top:1px solid #edf1f2;padding:16px 0}.trendRow:first-child{border-top:0}.trendMeta{display:grid;gap:5px}.trendMeta strong{font-size:12px}.trendMeta span{font-size:9px;color:#7a8c95}.bars{display:grid;gap:7px}.bar{display:grid;grid-template-columns:52px 1fr 45px;gap:9px;align-items:center}.bar span,.bar strong{font-size:9px}.bar strong{text-align:right}.bar i{height:6px;background:#edf1f2;border-radius:99px;overflow:hidden}.bar em{display:block;height:100%;background:#173f5e}.bar.inverse em{background:#e66a5d}.responseVolume{height:5px;background:#edf1f2;border-radius:99px;overflow:hidden}.responseVolume i{display:block;height:100%;background:#af8752}.split{display:grid;grid-template-columns:.9fr 1.1fr;gap:14px}.hack{display:grid;gap:15px}.hack>div{display:grid;grid-template-columns:145px 1fr 50px;gap:10px;align-items:center}.hack span{font-size:10px;color:#5f727e}.hack span b{display:inline-grid;place-items:center;width:25px;height:25px;border:1px solid #bdc9ce;border-radius:50%;margin-right:8px;color:#12191f}.hack i{height:7px;background:#edf1f2;border-radius:99px;overflow:hidden}.hack em{display:block;height:100%;background:#173f5e}.hack strong{font-size:10px;text-align:right}.reportTypes{display:grid;gap:9px}.reportTypes article{border:1px solid #e1e7e9;border-radius:12px;padding:13px;display:flex;justify-content:space-between;gap:14px;align-items:center}.reportTypes article>div{display:grid;gap:5px}.reportTypes b{font-size:11px}.reportTypes span{font-size:9px;color:#71828b;line-height:1.4}.reportTypes nav{display:flex;gap:5px}.reportTypes a{background:#12191f;color:white;text-decoration:none;border-radius:999px;padding:7px 9px;font-size:8px;font-weight:900}.tableWrap{overflow:auto}table{width:100%;border-collapse:collapse;min-width:590px}th{text-align:left;font-size:8px;letter-spacing:.1em;color:#748690;text-transform:uppercase;padding:10px 8px;border-bottom:1px solid #dfe6e8}td{font-size:10px;padding:12px 8px;border-bottom:1px solid #edf1f2}.empty{border:1px dashed #cdd8dc;border-radius:12px;padding:26px;color:#748690;font-size:11px;text-align:center}@media(max-width:1150px){.metricGrid{grid-template-columns:repeat(3,1fr)}}@media(max-width:820px){.insightsPage{padding:22px 12px 74px}.header{align-items:flex-start;flex-direction:column}.periodBar{align-items:flex-start;flex-direction:column}.metricGrid{grid-template-columns:repeat(2,1fr)}.split{grid-template-columns:1fr}.trendRow{grid-template-columns:1fr}.responseVolume{display:none}.panelHead{align-items:flex-start;flex-direction:column}.panelHead>span{text-align:left}.hack>div{grid-template-columns:125px 1fr 45px}}@media(max-width:480px){.metricGrid{grid-template-columns:1fr}.headerActions{width:100%}.headerActions a{flex:1;text-align:center}.periodBar nav{width:100%}.periodBar a{flex:1;text-align:center}.reportTypes article{align-items:flex-start;flex-direction:column}.reportTypes nav{width:100%}.reportTypes a{flex:1;text-align:center}}
`;
