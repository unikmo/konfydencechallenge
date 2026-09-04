import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatUsd, TIER_CONFIG, type Tier } from "@/lib/lockscreens/pricing";

export const dynamic = "force-dynamic";

export default async function LockscreenOrderAdminDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await prisma.lockscreenOrder.findUnique({ where: { id }, include: { tenant: true } });
  if (!order) notFound();

  const tier: Tier = order.tenant?.kind === "school" ? "school" : "workplace";
  const config = TIER_CONFIG[tier];
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://konfydence.com";
  const poUrl = `${appUrl}/lockscreens/${tier}/po/${order.id}`;
  const adminUrl = order.tenant ? `${appUrl}/lockscreens/${tier}/admin/${order.tenant.adminToken}` : null;
  const billed = order.overrideAnnualTotal ?? order.annualTotal;

  return (
    <main style={{ background: "#0c0f12", minHeight: "100vh", color: "#e7e2d8", padding: "32px 28px", fontFamily: "system-ui, sans-serif" }}>
      <p style={{ fontSize: 11, letterSpacing: ".1em", color: "#8d8980", textTransform: "uppercase" }}>Konfydence internal</p>
      <h1 style={{ margin: "6px 0 4px", fontSize: 26 }}>{order.poNumber}</h1>
      <p style={{ color: "#8d8980", fontSize: 13, marginBottom: 20 }}>{order.orgName} &middot; {order.contactEmail}</p>
      <Link href="/admin/lockscreens/orders" style={{ color: "#af8752", fontSize: 13 }}>&larr; All orders</Link>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginTop: 24 }}>
        <section style={card}>
          <h2 style={h2}>Order</h2>
          <Row label="Tier" value={tier === "school" ? "School" : "Workplace"} />
          <Row label={`${config.unitLabelPlural[0].toUpperCase()}${config.unitLabelPlural.slice(1)} licensed`} value={order.employeeCount.toLocaleString()} />
          <Row label="Screen package" value={String(order.screenCount)} />
          <Row label="Cadence" value={order.cadence} />
          <Row label="Base rate" value={`${formatUsd(order.baseRatePerHead)}/${config.unitLabel}/yr`} />
          <Row label="Extended-library surcharge" value={`${formatUsd(order.surchargePerHead)}/${config.unitLabel}/yr`} />
          <Row label="List rate (calculated)" value={`${formatUsd(order.ratePerHead)}/${config.unitLabel}/yr`} />
          <Row label="List total" value={formatUsd(order.annualTotal)} />
          <Row label="Minimum applied?" value={order.minimumApplied ? "Yes" : "No"} />
          <Row label="Status" value={order.status.replace("_", " ")} />
          <Row label="Licence" value={order.tenant?.tokenStatus ?? "—"} />
          {order.notes ? <Row label="Notes" value={order.notes} /> : null}
          <div style={{ marginTop: 14, display: "flex", gap: 14 }}>
            <a href={poUrl} target="_blank" rel="noreferrer" style={link}>View customer PO &rarr;</a>
            {adminUrl ? <a href={adminUrl} target="_blank" rel="noreferrer" style={link}>View customer admin &rarr;</a> : null}
          </div>
        </section>

        <section style={card}>
          <h2 style={h2}>Negotiated price</h2>
          <p style={{ fontSize: 13, color: "#8d8980", marginBottom: 14 }}>
            Overrides what the customer sees as their billed annual total. The calculated list total above stays
            on record either way. Clearing the override reverts the PO to list price.
          </p>

          <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>
            Currently billed: {formatUsd(billed)}{order.overrideAnnualTotal != null ? <span style={{ fontSize: 12, color: "#af8752", marginLeft: 8 }}>NEGOTIATED</span> : null}
          </div>

          {order.overrideAnnualTotal != null ? (
            <div style={{ fontSize: 12, color: "#8d8980", marginBottom: 16 }}>
              {order.overrideReason ? <>Reason: {order.overrideReason}<br /></> : null}
              {order.overriddenBy ? <>By: {order.overriddenBy}<br /></> : null}
              {order.overriddenAt ? <>On: {order.overriddenAt.toLocaleString()}</> : null}
            </div>
          ) : null}

          <form action={`/api/admin/lockscreens/orders/${order.id}/override`} method="POST" style={{ display: "grid", gap: 12, marginTop: 12 }}>
            <label style={label}>
              Negotiated annual total (USD)
              <input
                name="overrideAnnualTotal"
                type="number"
                min={0}
                step="0.01"
                defaultValue={order.overrideAnnualTotal ?? ""}
                placeholder={String(order.annualTotal)}
                style={input}
              />
            </label>
            <label style={label}>
              Reason (shown internally only)
              <textarea name="overrideReason" rows={2} defaultValue={order.overrideReason ?? ""} style={{ ...input, resize: "vertical" as const }} />
            </label>
            <label style={label}>
              Approved by
              <input name="overriddenBy" type="text" defaultValue={order.overriddenBy ?? ""} style={input} />
            </label>
            <div style={{ display: "flex", gap: 10 }}>
              <button type="submit" name="action" value="set" style={primaryBtn}>Save negotiated price</button>
              {order.overrideAnnualTotal != null ? (
                <button type="submit" name="action" value="clear" style={quietBtn}>Revert to list price</button>
              ) : null}
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,.06)" }}>
      <span style={{ color: "#8d8980" }}>{label}</span>
      <span>{value}</span>
    </div>
  );
}

const card: React.CSSProperties = { background: "#14181d", border: "1px solid rgba(255,255,255,.08)", borderRadius: 12, padding: 22 };
const h2: React.CSSProperties = { fontSize: 15, fontWeight: 700, marginBottom: 12 };
const link: React.CSSProperties = { color: "#af8752", fontSize: 13, textDecoration: "none" };
const label: React.CSSProperties = { display: "grid", gap: 6, fontSize: 12, color: "#8d8980" };
const input: React.CSSProperties = { padding: "9px 10px", borderRadius: 8, border: "1px solid rgba(255,255,255,.15)", background: "#0c0f12", color: "#e7e2d8", fontSize: 14 };
const primaryBtn: React.CSSProperties = { background: "#af8752", color: "#111417", border: "none", borderRadius: 8, padding: "10px 18px", fontWeight: 700, fontSize: 13, cursor: "pointer" };
const quietBtn: React.CSSProperties = { background: "transparent", color: "#e7e2d8", border: "1px solid rgba(255,255,255,.2)", borderRadius: 8, padding: "10px 18px", fontSize: 13, cursor: "pointer" };
