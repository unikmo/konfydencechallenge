import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatUsd } from "@/lib/lockscreens/pricing";

export const dynamic = "force-dynamic";

export default async function LockscreenOrdersAdminPage() {
  const orders = await prisma.lockscreenOrder.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { tenant: { select: { tokenStatus: true, kind: true } } },
  });

  return (
    <main style={{ background: "#0c0f12", minHeight: "100vh", color: "#e7e2d8", padding: "32px 28px", fontFamily: "system-ui, sans-serif" }}>
      <p style={{ fontSize: 11, letterSpacing: ".1em", color: "#8d8980", textTransform: "uppercase" }}>Konfydence internal</p>
      <h1 style={{ margin: "6px 0 20px", fontSize: 26 }}>Lockscreens orders</h1>
      <Link href="/admin" style={{ color: "#af8752", fontSize: 13 }}>&larr; Back to Konfydence OS</Link>

      <div style={{ marginTop: 24, overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ textAlign: "left", color: "#8d8980", borderBottom: "1px solid rgba(255,255,255,.12)" }}>
              <th style={th}>Tier</th>
              <th style={th}>PO</th>
              <th style={th}>Organisation</th>
              <th style={th}>Units</th>
              <th style={th}>Screens</th>
              <th style={th}>Cadence</th>
              <th style={th}>List total</th>
              <th style={th}>Billed total</th>
              <th style={th}>Status</th>
              <th style={th}>Licence</th>
              <th style={th}>Created</th>
              <th style={th}></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} style={{ borderBottom: "1px solid rgba(255,255,255,.06)" }}>
                <td style={td}>{o.tenant?.kind === "school" ? "School" : "Workplace"}</td>
                <td style={td}>{o.poNumber}</td>
                <td style={td}>{o.orgName}</td>
                <td style={td}>{o.employeeCount.toLocaleString()}</td>
                <td style={td}>{o.screenCount}</td>
                <td style={td}>{o.cadence}</td>
                <td style={td}>{formatUsd(o.annualTotal)}</td>
                <td style={td}>
                  {o.overrideAnnualTotal != null ? (
                    <span style={{ color: "#af8752", fontWeight: 700 }}>{formatUsd(o.overrideAnnualTotal)}</span>
                  ) : (
                    formatUsd(o.annualTotal)
                  )}
                </td>
                <td style={td}>{o.status.replace("_", " ")}</td>
                <td style={td}>{o.tenant?.tokenStatus ?? "—"}</td>
                <td style={td}>{o.createdAt.toLocaleDateString()}</td>
                <td style={td}>
                  <Link href={`/admin/lockscreens/orders/${o.id}`} style={{ color: "#af8752" }}>Open</Link>
                </td>
              </tr>
            ))}
            {orders.length === 0 ? (
              <tr>
                <td style={td} colSpan={12}>No lockscreen orders yet.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </main>
  );
}

const th: React.CSSProperties = { padding: "8px 12px", whiteSpace: "nowrap" };
const td: React.CSSProperties = { padding: "10px 12px", whiteSpace: "nowrap" };
