import { formatUsd, TIER_CONFIG, type Tier } from "@/lib/lockscreens/pricing";
import type { LockscreenOrder, LockscreenTenant } from "@prisma/client";

function fmtDate(d: Date) {
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export function PurchaseOrderDocument({
  tier,
  order,
}: {
  tier: Tier;
  order: LockscreenOrder & { tenant: LockscreenTenant | null };
}) {
  const config = TIER_CONFIG[tier];
  const tierLabel = tier === "school" ? "Schools" : "Workplace";
  const issued = order.createdAt;
  const baseTotal = order.employeeCount * order.baseRatePerHead;
  const surchargeTotal = order.employeeCount * order.surchargePerHead;
  const rawTotal = baseTotal + surchargeTotal;
  const termStart = order.tenant?.termStart ?? issued;
  const termEnd = order.tenant?.termEnd ?? null;
  const adminUrl = order.tenant
    ? `${process.env.NEXT_PUBLIC_APP_URL || "https://konfydence.com"}/lockscreens/${tier}/admin/${order.tenant.adminToken}`
    : null;

  return (
    <div style={{ background: "#f4efe4", minHeight: "100vh", padding: "48px 20px" }}>
      <div
        style={{
          maxWidth: 720,
          margin: "0 auto",
          background: "#fffefc",
          border: "1px solid rgba(17,20,23,.12)",
          borderRadius: 8,
          padding: "44px 48px",
          color: "#111417",
          fontFamily: "Georgia, 'Times New Roman', serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "2px solid #111417", paddingBottom: 20, marginBottom: 28 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-.02em" }}>Konfydence</div>
            <div style={{ fontSize: 12, color: "#66645f", marginTop: 4 }}>konfydence.com &middot; Lockscreens for {tierLabel}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase", color: "#af8752", fontWeight: 700 }}>Purchase Order</div>
            <div style={{ fontSize: 18, fontWeight: 700, marginTop: 4 }}>{order.poNumber}</div>
            <div style={{ fontSize: 12, color: "#66645f", marginTop: 4 }}>Issued {fmtDate(issued)}</div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 28 }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: ".08em", textTransform: "uppercase", color: "#8d8980", marginBottom: 6 }}>Bill to</div>
            <div style={{ fontWeight: 700 }}>{order.orgName}</div>
            {order.contactName ? <div>{order.contactName}</div> : null}
            <div>{order.contactEmail}</div>
            {order.billingAddress ? <div style={{ whiteSpace: "pre-line", marginTop: 4 }}>{order.billingAddress}</div> : null}
          </div>
          <div>
            <div style={{ fontSize: 11, letterSpacing: ".08em", textTransform: "uppercase", color: "#8d8980", marginBottom: 6 }}>Licence term</div>
            <div>{fmtDate(termStart)} &ndash; {termEnd ? fmtDate(termEnd) : "—"}</div>
            <div style={{ marginTop: 10, fontSize: 11, letterSpacing: ".08em", textTransform: "uppercase", color: "#8d8980", marginBottom: 6 }}>Status</div>
            <div style={{ textTransform: "capitalize" }}>{order.status.replace("_", " ")}</div>
          </div>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 24 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(17,20,23,.2)", fontSize: 11, letterSpacing: ".06em", textTransform: "uppercase", color: "#8d8980" }}>
              <th style={{ textAlign: "left", padding: "8px 0" }}>Description</th>
              <th style={{ textAlign: "right", padding: "8px 0" }}>Qty</th>
              <th style={{ textAlign: "right", padding: "8px 0" }}>Rate</th>
              <th style={{ textAlign: "right", padding: "8px 0" }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: "1px solid rgba(17,20,23,.08)" }}>
              <td style={{ padding: "12px 0" }}>
                Konfydence Lockscreens &mdash; {tierLabel} licence
                <div style={{ fontSize: 12, color: "#66645f" }}>27-screen sequence, {order.cadence} rotation</div>
              </td>
              <td style={{ textAlign: "right", padding: "12px 0" }}>{order.employeeCount.toLocaleString()} {config.unitLabelPlural}</td>
              <td style={{ textAlign: "right", padding: "12px 0" }}>{formatUsd(order.baseRatePerHead)}/yr</td>
              <td style={{ textAlign: "right", padding: "12px 0" }}>{formatUsd(baseTotal)}</td>
            </tr>
            {order.surchargePerHead > 0 ? (
              <tr style={{ borderBottom: "1px solid rgba(17,20,23,.08)" }}>
                <td style={{ padding: "12px 0" }}>
                  Extended library upgrade
                  <div style={{ fontSize: 12, color: "#66645f" }}>{order.screenCount} screens instead of 27</div>
                </td>
                <td style={{ textAlign: "right", padding: "12px 0" }}>{order.employeeCount.toLocaleString()} {config.unitLabelPlural}</td>
                <td style={{ textAlign: "right", padding: "12px 0" }}>{formatUsd(order.surchargePerHead)}/yr</td>
                <td style={{ textAlign: "right", padding: "12px 0" }}>{formatUsd(surchargeTotal)}</td>
              </tr>
            ) : null}
            {order.minimumApplied ? (
              <tr style={{ borderBottom: "1px solid rgba(17,20,23,.08)" }}>
                <td style={{ padding: "12px 0" }} colSpan={3}>
                  Annual minimum licence adjustment
                  <div style={{ fontSize: 12, color: "#66645f" }}>{formatUsd(config.minimumAnnual)} minimum annual licence applies</div>
                </td>
                <td style={{ textAlign: "right", padding: "12px 0" }}>{formatUsd(order.annualTotal - rawTotal)}</td>
              </tr>
            ) : null}
            {order.overrideAnnualTotal != null ? (
              <tr style={{ borderBottom: "1px solid rgba(17,20,23,.08)" }}>
                <td style={{ padding: "12px 0" }} colSpan={3}>
                  Negotiated pricing adjustment
                  <div style={{ fontSize: 12, color: "#66645f" }}>Agreed rate for this licence</div>
                </td>
                <td style={{ textAlign: "right", padding: "12px 0" }}>{formatUsd(order.overrideAnnualTotal - order.annualTotal)}</td>
              </tr>
            ) : null}
          </tbody>
        </table>

        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 28 }}>
          <div style={{ minWidth: 220 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 20, fontWeight: 700, borderTop: "2px solid #111417", paddingTop: 10 }}>
              <span>Total / year</span>
              <span>{formatUsd(order.overrideAnnualTotal ?? order.annualTotal)}</span>
            </div>
          </div>
        </div>

        {adminUrl ? (
          <div className="poPrintHide" style={{ background: "#f7f4ee", border: "1px solid rgba(17,20,23,.1)", borderRadius: 6, padding: "14px 16px", fontSize: 13, marginBottom: 24 }}>
            Manage your screen sequence, cadence, and see the delivery link:{" "}
            <a href={adminUrl} style={{ color: "#af8752", fontWeight: 700 }}>{adminUrl}</a>
          </div>
        ) : null}

        {order.notes ? (
          <div style={{ background: "#f7f4ee", border: "1px solid rgba(17,20,23,.1)", borderRadius: 6, padding: "14px 16px", fontSize: 13, marginBottom: 24 }}>
            <strong>Notes:</strong> {order.notes}
          </div>
        ) : null}

        <div style={{ fontSize: 12, color: "#66645f", borderTop: "1px solid rgba(17,20,23,.1)", paddingTop: 16 }}>
          <p>
            This purchase order confirms pricing and does not itself activate the licence. A Konfydence team
            member will follow up to confirm payment terms; the lockscreen sequence goes live once the order
            is confirmed. Konfydence is an educational scam-readiness product and does not guarantee
            protection from fraud.
          </p>
          <p style={{ marginTop: 8 }}>Questions? Reply to the email this PO arrived in, or contact concierge@konfydence.com.</p>
        </div>
      </div>

      <div className="poPrintHide" style={{ maxWidth: 720, margin: "16px auto 0", textAlign: "center" }}>
        <button
          type="button"
          style={{ background: "transparent", border: "1px solid rgba(17,20,23,.3)", borderRadius: 999, padding: "10px 20px", fontSize: 13, cursor: "pointer" }}
          className="poPrintButton"
        >
          Print / Save as PDF
        </button>
      </div>

      <style>{`
        @media print {
          .poPrintHide { display: none !important; }
          body { background: #fff !important; }
        }
      `}</style>
      <script
        dangerouslySetInnerHTML={{
          __html: `document.querySelector('.poPrintButton')?.addEventListener('click', function(){ window.print(); });`,
        }}
      />
    </div>
  );
}
