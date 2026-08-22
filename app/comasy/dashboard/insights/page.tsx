import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCustomerOrganizationId } from "@/lib/comasyAuth";
import { getOrganizationMetrics, getOrganizationTrend, periodStart } from "@/lib/comasyMetrics";

const periods = [
  ["30", "30 days"],
  ["90", "90 days"],
  ["365", "12 months"],
  ["all", "All time"],
] as const;

const fmt = (value: number) => `${Math.round(value * 10) / 10}%`;
const delta = (value: number | null) =>
  value == null ? "Not enough data" : `${value > 0 ? "+" : ""}${value} pts`;

export default async function CustomerInsightsPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string }>;
}) {
  const organizationId = await getCustomerOrganizationId();
  if (!organizationId) redirect("/comasy/dashboard/login");

  const { period: rawPeriod } = await searchParams;
  const period = periods.some(([key]) => key === rawPeriod) ? rawPeriod! : "90";
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
      <header className="header">
        <div>
          <p className="eyebrow">COMASY / MEASURE</p>
          <h1>Behaviour over time.</h1>
          <span>{organization.brandingName || organization.name}</span>
        </div>
        <div className="headerActions">
          <Link href="/comasy/dashboard?view=measure">Back to dashboard</Link>
          <Link href="/comasy/dashboard?view=reports">Reports</Link>
        </div>
      </header>

      <section className="periodBar" aria-label="Reporting period">
        <div>
          <p>REPORTING PERIOD</p>
          <span>Metrics, trends and exports use the same selected date window.</span>
        </div>
        <nav>
          {periods.map(([key, label]) => (
            <Link key={key} className={period === key ? "active" : ""} href={`/comasy/dashboard/insights?period=${key}`}>
              {label}
            </Link>
          ))}
        </nav>
      </section>

      <section className="metricGrid">
        <Metric label="Participation" value={fmt(metrics.participationRate)} note={`${metrics.participantCount} participants in workspace`} />
        <Metric label="Pause Adoption" value={fmt(metrics.pauseAdoption)} note="responses that interrupt or safely challenge the risky chain" />
        <Metric label="Verification Rate" value={fmt(metrics.verificationRate)} note="responses using independent verification" />
        <Metric label="Impulse Rate" value={fmt(metrics.impulseRate)} note="immediate higher-risk action" danger={metrics.impulseRate > 25} />
        <Metric label="Pre/post change" value={delta(metrics.prePostChange)} note={`Pause: ${fmt(metrics.baselinePause)} → ${fmt(metrics.followupPause)}`} />
        <Metric label="Recorded decisions" value={String(metrics.responseCount)} note={`${metrics.activeCampaigns} active or scheduled campaigns`} />
      </section>

      <section className="panel">
        <div className="panelHead">
          <div><p className="eyebrow">TREND OVER TIME</p><h2>Campaign-by-campaign behaviour</h2></div>
          <span>{trend.length} campaigns with recorded responses</span>
        </div>
        {trend.length ? (
          <div className="trendList">
            {trend.map((row) => (
              <article key={row.id} className="trendRow">
                <div className="trendMeta">
                  <strong>{row.name}</strong>
                  <span>{row.designation} · {row.date.toISOString().slice(0, 10)} · {row.responses} decisions</span>
                </div>
                <div className="bars">
                  <Bar label="Pause" value={row.pauseAdoption} />
                  <Bar label="Verify" value={row.verificationRate} />
                  <Bar label="Impulse" value={row.impulseRate} inverse />
                </div>
                <div className="responseVolume" title={`${row.responses} recorded decisions`}>
                  <i style={{ width: `${Math.max(5, (row.responses / maxResponses) * 100)}%` }} />
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty">No campaign responses exist in this reporting period yet.</div>
        )}
      </section>

      <section className="split">
        <section className="panel">
          <div className="panelHead"><div><p className="eyebrow">H.A.C.K. PROFILE</p><h2>Pressure resilience</h2></div></div>
          <div className="hack">
            {([[
              "H", "Hurry"], ["A", "Authority"], ["C", "Comfort"], ["K", "Critical Action"]] as const).map(([key, label]) => (
              <div key={key}>
                <span><b>{key}</b>{label}</span>
                <i><em style={{ width: `${metrics.hackProfile[key]}%` }} /></i>
                <strong>{fmt(metrics.hackProfile[key])}</strong>
              </div>
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="panelHead"><div><p className="eyebrow">EVIDENCE</p><h2>Export this period</h2></div></div>
          <div className="reportTypes">
            <Report type="executive" title="Executive" copy="Participation, movement, pressure profile and priority focus." period={period} />
            <Report type="awareness" title="Security Awareness" copy="Campaign activity, behavioural indicators and cohort comparison." period={period} />
            <Report type="compliance" title="Compliance / NIS2" copy="Programme activity and effectiveness evidence with the required compliance disclaimer." period={period} />
          </div>
        </section>
      </section>

      <section className="panel">
        <div className="panelHead"><div><p className="eyebrow">COHORT COMPARISON</p><h2>Where behaviour differs</h2></div><span>No unsupported vulnerability claims—only recorded decisions.</span></div>
        {metrics.cohorts.length ? (
          <div className="tableWrap">
            <table>
              <thead><tr><th>Cohort</th><th>Responses</th><th>Pause</th><th>Verify</th><th>Impulse</th></tr></thead>
              <tbody>{metrics.cohorts.map((cohort) => <tr key={cohort.id}><td><b>{cohort.name}</b></td><td>{cohort.responses}</td><td>{fmt(cohort.pauseAdoption)}</td><td>{fmt(cohort.verificationRate)}</td><td>{fmt(cohort.impulseRate)}</td></tr>)}</tbody>
            </table>
          </div>
        ) : <div className="empty">No cohort-level responses exist in this reporting period yet.</div>}
      </section>

      <style>{styles}</style>
    </main>
  );
}

function Metric({ label, value, note, danger = false }: { label: string; value: string; note: string; danger?: boolean }) {
  return <article className={`metric ${danger ? "danger" : ""}`}><span>{label}</span><strong>{value}</strong><small>{note}</small></article>;
}

function Bar({ label, value, inverse = false }: { label: string; value: number; inverse?: boolean }) {
  return <div className={`bar ${inverse ? "inverse" : ""}`}><span>{label}</span><i><em style={{ width: `${value}%` }} /></i><strong>{fmt(value)}</strong></div>;
}

function Report({ type, title, copy, period }: { type: string; title: string; copy: string; period: string }) {
  return <article><div><b>{title}</b><span>{copy}</span></div><nav><Link href={`/api/comasy/reports/pdf?type=${type}&period=${period}`}>PDF</Link><Link href={`/api/comasy/reports/csv?type=${type}&period=${period}`}>CSV</Link></nav></article>;
}

const styles = `
:global(*){box-sizing:border-box}:global(body){margin:0;background:#edf1f3;color:#071726}.insightsPage{min-height:100vh;padding:34px clamp(18px,4vw,58px) 80px;font-family:Inter,system-ui,sans-serif;max-width:1500px;margin:auto}.header{display:flex;justify-content:space-between;gap:24px;align-items:flex-end;margin-bottom:24px}.eyebrow{font-size:9px;letter-spacing:.14em;font-weight:950;color:#667c89;margin:0 0 8px}.header h1,.panel h2{font-family:Georgia,serif;font-weight:500;letter-spacing:-.04em}.header h1{font-size:clamp(38px,5vw,62px);line-height:.96;margin:0 0 10px}.header>div>span{font-size:11px;color:#71838d}.headerActions{display:flex;gap:8px}.headerActions a{border:1px solid #b8c5cb;border-radius:999px;padding:10px 13px;color:#17354c;text-decoration:none;font-size:10px;font-weight:900}.periodBar{background:#071726;color:white;border-radius:18px;padding:18px 20px;display:flex;justify-content:space-between;gap:20px;align-items:center;margin-bottom:14px}.periodBar p{margin:0 0 5px;color:#b8ff3d;font-size:9px;font-weight:950;letter-spacing:.12em}.periodBar span{font-size:10px;color:#93a7b5}.periodBar nav{display:flex;gap:6px;flex-wrap:wrap}.periodBar a{color:#afbfca;text-decoration:none;border:1px solid #ffffff1f;border-radius:999px;padding:9px 11px;font-size:9px;font-weight:900}.periodBar a.active{background:#b8ff3d;color:#071726;border-color:#b8ff3d}.metricGrid{display:grid;grid-template-columns:repeat(6,minmax(130px,1fr));gap:10px}.metric{background:white;border:1px solid #dae3e6;border-radius:15px;padding:17px;min-height:142px;display:flex;flex-direction:column}.metric>span{font-size:9px;font-weight:900;color:#667b87}.metric strong{font:500 31px Georgia,serif;margin:20px 0 8px}.metric small{font-size:9px;line-height:1.45;color:#84949c;margin-top:auto}.metric.danger strong{color:#c64b42}.panel{background:white;border:1px solid #dbe3e6;border-radius:18px;padding:22px;margin-top:14px}.panelHead{display:flex;justify-content:space-between;gap:20px;align-items:flex-end;margin-bottom:20px}.panel h2{font-size:28px;line-height:1;margin:0}.panelHead>span{font-size:9px;color:#82919a;max-width:320px;text-align:right}.trendList{display:grid;gap:10px}.trendRow{display:grid;grid-template-columns:minmax(180px,280px) 1fr 90px;gap:20px;align-items:center;border-top:1px solid #edf1f2;padding:16px 0}.trendRow:first-child{border-top:0}.trendMeta{display:grid;gap:5px}.trendMeta strong{font-size:12px}.trendMeta span{font-size:9px;color:#7a8c95}.bars{display:grid;gap:7px}.bar{display:grid;grid-template-columns:52px 1fr 45px;gap:9px;align-items:center}.bar span,.bar strong{font-size:9px}.bar strong{text-align:right}.bar i{height:6px;background:#edf1f2;border-radius:99px;overflow:hidden}.bar em{display:block;height:100%;background:#173f5e}.bar.inverse em{background:#e66a5d}.responseVolume{height:5px;background:#edf1f2;border-radius:99px;overflow:hidden}.responseVolume i{display:block;height:100%;background:#b8ff3d}.split{display:grid;grid-template-columns:.9fr 1.1fr;gap:14px}.hack{display:grid;gap:15px}.hack>div{display:grid;grid-template-columns:145px 1fr 50px;gap:10px;align-items:center}.hack span{font-size:10px;color:#5f727e}.hack span b{display:inline-grid;place-items:center;width:25px;height:25px;border:1px solid #bdc9ce;border-radius:50%;margin-right:8px;color:#071726}.hack i{height:7px;background:#edf1f2;border-radius:99px;overflow:hidden}.hack em{display:block;height:100%;background:#173f5e}.hack strong{font-size:10px;text-align:right}.reportTypes{display:grid;gap:9px}.reportTypes article{border:1px solid #e1e7e9;border-radius:12px;padding:13px;display:flex;justify-content:space-between;gap:14px;align-items:center}.reportTypes article>div{display:grid;gap:5px}.reportTypes b{font-size:11px}.reportTypes span{font-size:9px;color:#71828b;line-height:1.4}.reportTypes nav{display:flex;gap:5px}.reportTypes a{background:#071726;color:white;text-decoration:none;border-radius:999px;padding:7px 9px;font-size:8px;font-weight:900}.tableWrap{overflow:auto}table{width:100%;border-collapse:collapse;min-width:590px}th{text-align:left;font-size:8px;letter-spacing:.1em;color:#748690;text-transform:uppercase;padding:10px 8px;border-bottom:1px solid #dfe6e8}td{font-size:10px;padding:12px 8px;border-bottom:1px solid #edf1f2}.empty{border:1px dashed #cdd8dc;border-radius:12px;padding:26px;color:#748690;font-size:11px;text-align:center}@media(max-width:1150px){.metricGrid{grid-template-columns:repeat(3,1fr)}}@media(max-width:820px){.insightsPage{padding:22px 12px 74px}.header{align-items:flex-start;flex-direction:column}.periodBar{align-items:flex-start;flex-direction:column}.metricGrid{grid-template-columns:repeat(2,1fr)}.split{grid-template-columns:1fr}.trendRow{grid-template-columns:1fr}.responseVolume{display:none}.panelHead{align-items:flex-start;flex-direction:column}.panelHead>span{text-align:left}.hack>div{grid-template-columns:125px 1fr 45px}}@media(max-width:480px){.metricGrid{grid-template-columns:1fr}.headerActions{width:100%}.headerActions a{flex:1;text-align:center}.periodBar nav{width:100%}.periodBar a{flex:1;text-align:center}.reportTypes article{align-items:flex-start;flex-direction:column}.reportTypes nav{width:100%}.reportTypes a{flex:1;text-align:center}}
`;
