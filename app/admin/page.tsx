import React from "react";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminPage() {
  const [scenarioCount, sessionCount] = await Promise.all([
    prisma.scenario.count({}),
    prisma.challengeSession.count({}),
  ]);

  return (
    <div style={styles.page}>
      <div style={styles.shell}>
        <header style={styles.header}>
          <div>
            <div style={styles.title}>Admin Dashboard</div>
            <div style={styles.subtitle}>V1 placeholder</div>
          </div>
        </header>

        <main>
          <div style={styles.stats}>
            <div style={styles.statCard}>
              <div style={styles.statLabel}>Total scenarios</div>
              <div style={styles.statValue}>{scenarioCount}</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statLabel}>Total sessions</div>
              <div style={styles.statValue}>{sessionCount}</div>
            </div>
          </div>

          <div style={styles.grid}>
            <div style={styles.tile}>
              <div style={styles.tileTitle}>Scenario Manager</div>
              <div style={styles.tileBody}>Placeholder for scenario CRUD / import status.</div>
            </div>

            <div style={styles.tile}>
              <div style={styles.tileTitle}>Challenge Sessions</div>
              <div style={styles.tileBody}>Placeholder for session list + export.</div>
            </div>

            <div style={styles.tile}>
              <div style={styles.tileTitle}>Import Status</div>
              <div style={styles.tileBody}>Placeholder for last seed/import run details.</div>
            </div>
          </div>

          <div style={styles.backLinkWrap}>
            <Link style={styles.backLink} href="/challenge">Back to challenge</Link>
          </div>
        </main>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #071421, #0b2237)",
    padding: 18,
    color: "white",
    display: "flex",
    justifyContent: "center",
  },
  shell: { width: "100%", maxWidth: 980 },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 16 },
  title: { fontWeight: 1000, fontSize: 22 },
  subtitle: { marginTop: 6, color: "#ffffffcc", fontWeight: 800 },
  stats: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  statCard: {
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.14)",
    borderRadius: 14,
    padding: 14,
  },
  statLabel: { color: "#ffffffcc", fontWeight: 800, fontSize: 13 },
  statValue: { fontWeight: 1000, fontSize: 30, color: "#ffc600", marginTop: 6 },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12, marginTop: 14 },
  tile: {
    background: "white",
    color: "#0b1b2b",
    borderRadius: 14,
    padding: 16,
    border: "1px solid rgba(11,27,43,0.12)",
  },
  tileTitle: { fontWeight: 1000, marginBottom: 8 },
  tileBody: { color: "#344a5e", lineHeight: 1.5, fontWeight: 700, fontSize: 13 },
  backLinkWrap: { marginTop: 16 },
  backLink: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "10px 12px",
    borderRadius: 12,
    background: "#ffc600",
    color: "#0b1b2b",
    textDecoration: "none",
    fontWeight: 950,
    width: "100%",
    maxWidth: 260,
  },
};

