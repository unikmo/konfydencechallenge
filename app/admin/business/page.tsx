import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getStripe, stripeConfigured, stripeIsTestMode } from "@/lib/stripe/client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const VIEWS = [
  ["overview", "Overview"],
  ["challenge", "Challenge"],
  ["gifts", "Gift codes"],
  ["lockscreens", "Lockscreens · B2B"],
  ["subscriptions", "Subscriptions"],
  ["accounts", "Accounts"],
] as const;
type View = (typeof VIEWS)[number][0];

const usd = (cents: number) =>
  (cents / 100).toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });
const dollars = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });
const day = (d: Date | null) => (d ? d.toISOString().slice(0, 10) : "—");
const ago = (d: Date) => {
  const h = (Date.now() - d.getTime()) / 3.6e6;
  if (h < 1) return `${Math.round(h * 60)}m`;
  if (h < 48) return `${Math.round(h)}h`;
  return `${Math.round(h / 24)}d`;
};

type Charge = { amount: number; amount_refunded: number; created: number; paid: boolean; refunded: boolean; description: string | null; payment_intent: string | null; billing_details?: { email?: string | null } };
type Sub = { id: string; status: string; created: number; customer: string; items: { data: { price: { nickname: string | null; unit_amount: number | null } }[] }; current_period_end?: number; trial_end?: number | null; customer_email?: string | null };
type Inv = { id: string; status: string | null; amount_due: number; amount_paid: number; created: number; customer_email: string | null; hosted_invoice_url: string | null; number: string | null; custom_fields?: { name: string; value: string }[] | null; metadata?: Record<string, string> };

async function loadStripe() {
  if (!stripeConfigured()) return null;
  try {
    const s = getStripe();
    const [charges, subs, invoices] = await Promise.all([
      s.charges.list({ limit: 100 }),
      s.subscriptions.list({ status: "all", limit: 100, expand: ["data.customer"] }),
      s.invoices.list({ limit: 100 }),
    ]);
    return {
      charges: charges.data as unknown as Charge[],
      subs: subs.data.map((x) => ({
        ...x,
        customer_email: typeof x.customer === "object" && x.customer && !("deleted" in x.customer) ? (x.customer as { email?: string | null }).email ?? null : null,
      })) as unknown as Sub[],
      invoices: invoices.data as unknown as Inv[],
    };
  } catch (err) {
    return { error: err instanceof Error ? err.message : String(err) } as const;
  }
}

export default async function BusinessAdmin({ searchParams }: { searchParams: Promise<{ view?: string }> }) {
  const { view: raw } = await searchParams;
  const view: View = (VIEWS.some(([k]) => k === raw) ? raw : "overview") as View;

  const [stripe, entitlements, gifts, orders, tenants, accountCount, accounts, sessionAgg] = await Promise.all([
    loadStripe(),
    prisma.entitlement.findMany({ orderBy: { createdAt: "desc" }, take: 80, include: { user: { select: { email: true } } } }),
    prisma.giftCode.findMany({ orderBy: { createdAt: "desc" }, take: 80 }),
    prisma.lockscreenOrder.findMany({ orderBy: { createdAt: "desc" }, include: { tenant: { select: { tokenStatus: true, kind: true, termEnd: true } } } }),
    prisma.lockscreenTenant.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.account.count(),
    prisma.account.findMany({ orderBy: { createdAt: "desc" }, take: 60, include: { _count: { select: { players: true, subscriptions: true, sessions: true } } } }),
    prisma.challengeSession.aggregate({ _count: { _all: true } }),
  ]);
  const completedCount = await prisma.challengeSession.count({ where: { status: "COMPLETED" } });

  const stripeErr = stripe && "error" in stripe ? stripe.error : null;
  const charges = stripe && !("error" in stripe) ? stripe.charges : [];
  const subs = stripe && !("error" in stripe) ? stripe.subs : [];
  const invoices = stripe && !("error" in stripe) ? stripe.invoices : [];

  const now = Date.now() / 1000;
  const sumSince = (secs: number) => charges.filter((c) => c.paid && c.created >= now - secs).reduce((s, c) => s + c.amount - c.amount_refunded, 0);
  const rev = { today: sumSince(86400), week: sumSince(7 * 86400), month: sumSince(30 * 86400), recent100: charges.reduce((s, c) => s + (c.paid ? c.amount - c.amount_refunded : 0), 0) };
  const refunded30 = charges.filter((c) => c.created >= now - 30 * 86400).reduce((s, c) => s + c.amount_refunded, 0);

  const entActive = entitlements.filter((e) => e.status === "active");
  const editionCounts = tally(entActive.map((e) => e.edition ?? e.tier));
  const giftOpen = gifts.filter((g) => g.status === "issued").length;
  const giftRedeemed = gifts.filter((g) => g.status === "redeemed").length;
  const ordersByStatus = tally(orders.map((o) => o.status));
  const openInvoices = invoices.filter((i) => i.status === "open");
  const b2bTenants = tenants.filter((t) => t.kind === "workplace" || t.kind === "school");
  const personalTenants = tenants.filter((t) => t.kind === "home" || t.kind === "teen");
  const activeSubs = subs.filter((s) => s.status === "active" || s.status === "trialing");

  return (
    <main className="b">
      <aside>
        <Link href="/admin" className="bk">← Konfydence OS</Link>
        <h1>Business</h1>
        <nav>{VIEWS.map(([k, l]) => <Link key={k} href={`/admin/business?view=${k}`} className={view === k ? "on" : ""}>{l}</Link>)}</nav>
        <a href="https://dashboard.stripe.com/dashboard" target="_blank" rel="noreferrer" className="ext">Stripe dashboard ↗</a>
        <p className="mode">{!stripeConfigured() ? "STRIPE NOT CONFIGURED" : stripeIsTestMode() ? "STRIPE · TEST MODE" : "STRIPE · LIVE"}</p>
      </aside>

      <section>
        <header><h2>{VIEWS.find(([k]) => k === view)?.[1]}</h2><span>INTERNAL · AUTHENTICATED</span></header>
        {stripeErr && <div className="warn">Stripe read failed: {stripeErr}. DB figures below are still accurate.</div>}

        {view === "overview" && <>
          <div className="tiles">
            <T l="Revenue · today" v={usd(rev.today)} />
            <T l="Revenue · 7 days" v={usd(rev.week)} />
            <T l="Revenue · 30 days" v={usd(rev.month)} s={`refunds ${usd(refunded30)}`} />
            <T l="Last 100 charges" v={usd(rev.recent100)} s={`${charges.length} charges`} />
            <T l="Active entitlements" v={String(entActive.length)} s={`${entitlements.length} total shown`} />
            <T l="Active subscriptions" v={String(activeSubs.length)} s={`${subs.length} total`} />
            <T l="Registered accounts" v={String(accountCount)} />
            <T l="Challenge plays" v={String(sessionAgg._count._all)} s={`${completedCount} completed`} />
            <T l="Open B2B invoices" v={String(openInvoices.length)} s={usd(openInvoices.reduce((s, i) => s + i.amount_due, 0))} />
            <T l="B2B orders to action" v={String(orders.filter((o) => o.status === "quote_issued").length)} />
          </div>
          <Box title="Recent activity" note="LATEST 20 CHARGES">
            <Table heads={["When", "Amount", "Description", "Email", "Status"]}>
              {charges.slice(0, 20).map((c, i) => (
                <tr key={i}>
                  <td>{ago(new Date(c.created * 1000))} ago</td>
                  <td><b>{usd(c.amount)}</b>{c.amount_refunded > 0 && <small>−{usd(c.amount_refunded)} refunded</small>}</td>
                  <td>{c.description || "—"}</td>
                  <td>{c.billing_details?.email || "—"}</td>
                  <td><Tag v={c.refunded ? "refunded" : c.paid ? "paid" : "failed"} /></td>
                </tr>
              ))}
            </Table>
          </Box>
        </>}

        {view === "challenge" && <>
          <div className="tiles">
            <T l="Active" v={String(entActive.length)} />
            <T l="Revoked" v={String(entitlements.filter((e) => e.status === "revoked").length)} />
            <T l="From Stripe" v={String(entActive.filter((e) => e.source === "stripe").length)} />
            <T l="From gift" v={String(entActive.filter((e) => e.source === "gift").length)} />
            <T l="Legacy (Shopify)" v={String(entActive.filter((e) => e.source === "shopify").length)} />
          </div>
          <Box title="By edition / tier" note="ACTIVE ENTITLEMENTS">
            <div className="chips">{Object.entries(editionCounts).map(([k, n]) => <span key={k}><b>{n}</b> {k}</span>)}</div>
          </Box>
          <Box title="Recent entitlements" note="LATEST 80">
            <Table heads={["When", "Email", "Tier / edition", "Source", "Status", ""]}>
              {entitlements.map((e) => (
                <tr key={e.id}>
                  <td>{day(e.createdAt)}</td>
                  <td>{e.user.email}</td>
                  <td><b>{e.tier}</b>{e.edition && <small>{e.edition}</small>}</td>
                  <td>{e.source}</td>
                  <td><Tag v={e.status} /></td>
                  <td>
                    <form action="/api/admin/business" method="post" className="rf">
                      <input type="hidden" name="view" value="challenge" />
                      <input type="hidden" name="id" value={e.id} />
                      <button name="action" value={e.status === "active" ? "revoke_entitlement" : "restore_entitlement"}>
                        {e.status === "active" ? "Revoke" : "Restore"}
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </Table>
          </Box>
        </>}

        {view === "gifts" && <>
          <div className="tiles">
            <T l="Issued (unredeemed)" v={String(giftOpen)} />
            <T l="Redeemed" v={String(giftRedeemed)} />
            <T l="Revoked" v={String(gifts.filter((g) => g.status === "revoked").length)} />
          </div>
          <Box title="Gift codes" note="LATEST 80">
            <Table heads={["When", "Code", "Tier / edition", "From", "To", "Status"]}>
              {gifts.map((g) => (
                <tr key={g.id}>
                  <td>{day(g.createdAt)}</td>
                  <td><code>{g.code}</code></td>
                  <td><b>{g.tier}</b>{g.edition && <small>{g.edition}</small>}</td>
                  <td>{g.fromName || g.fromEmail || "—"}</td>
                  <td>{g.toEmail}</td>
                  <td><Tag v={g.status} /></td>
                </tr>
              ))}
            </Table>
          </Box>
        </>}

        {view === "lockscreens" && <>
          <div className="tiles">
            {Object.entries(ordersByStatus).map(([k, n]) => <T key={k} l={k.replace("_", " ")} v={String(n)} />)}
            <T l="Active B2B tenants" v={String(b2bTenants.filter((t) => t.tokenStatus === "active").length)} s={`${b2bTenants.length} total`} />
          </div>
          <Box title="Workplace / School orders" note="QUOTE → INVOICE → PAID → ACTIVE">
            <Table heads={["When", "PO", "Org", "Employees", "Annual", "Invoice", "Order", "Tenant", ""]}>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td>{day(o.createdAt)}</td>
                  <td><b>{o.poNumber}</b></td>
                  <td>{o.orgName}<small>{o.contactEmail}</small></td>
                  <td>{o.employeeCount.toLocaleString()}</td>
                  <td>{dollars(o.overrideAnnualTotal ?? o.annualTotal)}</td>
                  <td>{o.stripeInvoiceStatus ? <Tag v={o.stripeInvoiceStatus} /> : "—"}{o.stripeInvoiceUrl && <a href={o.stripeInvoiceUrl} target="_blank" rel="noreferrer"> pay↗</a>}</td>
                  <td><Tag v={o.status} /></td>
                  <td>{o.tenant ? <Tag v={o.tenant.tokenStatus} /> : "—"}</td>
                  <td>
                    <form action="/api/admin/business" method="post" className="rf">
                      <input type="hidden" name="view" value="lockscreens" />
                      <input type="hidden" name="orderId" value={o.id} />
                      <input type="hidden" name="invoiceId" value={o.stripeInvoiceId ?? ""} />
                      {o.tenant?.tokenStatus !== "active" && <button name="action" value="activate_tenant">Activate</button>}
                      {o.tenant?.tokenStatus === "active" && <button name="action" value="revoke_tenant">Revoke</button>}
                      {o.stripeInvoiceStatus === "open" && <button name="action" value="void_invoice">Void inv</button>}
                    </form>
                  </td>
                </tr>
              ))}
            </Table>
          </Box>
        </>}

        {view === "subscriptions" && <>
          <div className="tiles">
            <T l="Active" v={String(subs.filter((s) => s.status === "active").length)} />
            <T l="Trialing (year 1)" v={String(subs.filter((s) => s.status === "trialing").length)} />
            <T l="Canceled" v={String(subs.filter((s) => s.status === "canceled").length)} />
            <T l="Past due" v={String(subs.filter((s) => s.status === "past_due").length)} />
            <T l="Home/Teen tenants" v={String(personalTenants.length)} s={`${personalTenants.filter((t) => t.tokenStatus === "active").length} active`} />
          </div>
          <Box title="Stripe subscriptions" note="HOME / TEEN LOCKSCREENS">
            <Table heads={["Started", "Email", "Plan", "Renews / trial ends", "Status", ""]}>
              {subs.map((s) => (
                <tr key={s.id}>
                  <td>{day(new Date(s.created * 1000))}</td>
                  <td>{s.customer_email || s.customer}</td>
                  <td>{s.items.data[0]?.price?.nickname || "—"}</td>
                  <td>{s.trial_end ? `trial → ${day(new Date(s.trial_end * 1000))}` : s.current_period_end ? day(new Date(s.current_period_end * 1000)) : "—"}</td>
                  <td><Tag v={s.status} /></td>
                  <td>
                    {(s.status === "active" || s.status === "trialing") && (
                      <form action="/api/admin/business" method="post" className="rf">
                        <input type="hidden" name="view" value="subscriptions" />
                        <input type="hidden" name="subId" value={s.id} />
                        <button name="action" value="cancel_subscription">Cancel</button>
                      </form>
                    )}
                  </td>
                </tr>
              ))}
            </Table>
          </Box>
        </>}

        {view === "accounts" && <>
          <div className="tiles">
            <T l="Total accounts" v={String(accountCount)} />
            <T l="Email verified" v={String(accounts.filter((a) => a.emailVerifiedAt).length)} s="of latest 60" />
            <T l="With a subscription" v={String(accounts.filter((a) => a._count.subscriptions > 0).length)} s="of latest 60" />
          </div>
          <Box title="Recent accounts" note="LATEST 60">
            <Table heads={["Created", "Email", "Verified", "Players", "Subscriptions", "Sessions"]}>
              {accounts.map((a) => (
                <tr key={a.id}>
                  <td>{day(a.createdAt)}</td>
                  <td>{a.email}</td>
                  <td>{a.emailVerifiedAt ? "✓" : "—"}</td>
                  <td>{a._count.players}</td>
                  <td>{a._count.subscriptions}</td>
                  <td>{a._count.sessions}</td>
                </tr>
              ))}
            </Table>
          </Box>
        </>}
      </section>

      <style>{css}</style>
    </main>
  );
}

function tally(xs: string[]): Record<string, number> {
  return xs.reduce<Record<string, number>>((acc, x) => ((acc[x] = (acc[x] ?? 0) + 1), acc), {});
}
function T({ l, v, s }: { l: string; v: string; s?: string }) {
  return <div className="t"><span>{l}</span><b>{v}</b>{s && <small>{s}</small>}</div>;
}
function Box({ title, note, children }: { title: string; note: string; children: React.ReactNode }) {
  return <section className="box"><p>{note}</p><h3>{title}</h3>{children}</section>;
}
function Table({ heads, children }: { heads: string[]; children: React.ReactNode }) {
  return <div className="tw"><table><thead><tr>{heads.map((h, i) => <th key={i}>{h}</th>)}</tr></thead><tbody>{children}</tbody></table></div>;
}
function Tag({ v }: { v: string }) {
  return <span className={`tag tag-${v.toLowerCase().replace(/[^a-z]/g, "")}`}>{v.replace(/_/g, " ")}</span>;
}

const css = `
:global(body){margin:0;background:#eef1f2;color:#081826;font-family:Inter,system-ui,sans-serif}
.b{min-height:100vh;display:grid;grid-template-columns:230px 1fr}
aside{position:sticky;top:0;height:100vh;background:#061624;color:#fff;padding:22px 16px;overflow:auto}
.bk{color:#8ea6b6;font-size:10px;font-weight:800;text-decoration:none}
aside h1{font:400 26px/1 Georgia,serif;margin:12px 0 18px}
aside nav{display:grid;gap:3px}
aside nav a{color:#92a5b2;font-size:11px;font-weight:800;padding:8px 10px;border-radius:8px;text-decoration:none}
aside nav a:hover,aside nav a.on{background:#123149;color:#fff}
aside nav a.on{box-shadow:inset 3px 0 #b8ff3d}
.ext{display:block;margin-top:18px;color:#7fd0ff;font-size:10px;font-weight:800;text-decoration:none}
.mode{font-size:8px;letter-spacing:.1em;color:#5f7a89;margin-top:14px}
section>header{display:flex;justify-content:space-between;align-items:baseline;padding:28px clamp(14px,3vw,40px) 14px}
section>header h2{font:400 40px/1 Georgia,serif;margin:0;letter-spacing:-.03em}
section>header span{font-size:8px;color:#66808e;border:1px solid #c4d0d5;border-radius:99px;padding:6px 9px}
.warn{margin:0 clamp(14px,3vw,40px);background:#fff2f0;border:1px solid #f3c9c2;color:#8a3a30;font-size:11px;padding:10px 12px;border-radius:10px}
.tiles{display:grid;grid-template-columns:repeat(5,1fr);gap:9px;padding:8px clamp(14px,3vw,40px)}
.t{background:#fff;border:1px solid #dce4e7;border-radius:13px;padding:13px;min-height:96px;display:flex;flex-direction:column}
.t span{font-size:8px;font-weight:900;color:#687c87;text-transform:uppercase;letter-spacing:.05em}
.t b{font:400 24px Georgia,serif;margin:12px 0 3px}
.t small{font-size:9px;color:#87959b}
.box{background:#fff;border:1px solid #dce4e7;border-radius:15px;padding:18px;margin:12px clamp(14px,3vw,40px)}
.box p{font-size:8px;letter-spacing:.12em;font-weight:900;color:#617886;margin:0 0 6px}
.box h3{font:400 22px/1 Georgia,serif;margin:0 0 14px}
.chips{display:flex;flex-wrap:wrap;gap:7px}
.chips span{background:#f1f4f5;border-radius:8px;padding:6px 9px;font-size:10px}
.chips b{font-weight:900}
.tw{overflow:auto}
table{width:100%;border-collapse:collapse;min-width:720px}
th{text-align:left;padding:8px 6px;border-bottom:1px solid #dfe6e8;font-size:8px;color:#71848e;text-transform:uppercase;letter-spacing:.06em}
td{padding:10px 6px;border-bottom:1px solid #edf1f2;font-size:10px;vertical-align:top}
td b{display:block;font-size:11px}
td small{display:block;color:#7e8d94;margin-top:3px}
td code{font-size:10px}
td a{color:#245d91;font-weight:800}
.tag{display:inline-block;background:#edf1f2;border-radius:99px;padding:3px 6px;font-size:7px;font-weight:900;text-transform:uppercase}
.tag-paid,.tag-active,.tag-confirmed,.tag-redeemed,.tag-trialing{background:#e7f6cf;color:#466621}
.tag-refunded,.tag-revoked,.tag-cancelled,.tag-canceled,.tag-void,.tag-expired,.tag-failed,.tag-pastdue{background:#ffe8e5;color:#9c3e36}
.tag-open,.tag-quoteissued,.tag-issued,.tag-pending,.tag-draft{background:#fef3d8;color:#8a6300}
.rf{display:flex;gap:4px;flex-wrap:wrap}
.rf button{border:0;background:#ff5b50;color:#fff;border-radius:99px;padding:5px 9px;font-size:8px;font-weight:900;cursor:pointer}
@media(max-width:1100px){.tiles{grid-template-columns:repeat(3,1fr)}}
@media(max-width:760px){.b{grid-template-columns:1fr}aside{position:relative;height:auto}aside nav{display:flex;overflow:auto}.tiles{grid-template-columns:repeat(2,1fr)}}
`;
