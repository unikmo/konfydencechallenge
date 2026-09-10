import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { tokens } from "@/lib/theme/tokens";
import { getAccount } from "@/lib/auth/session";
import { EDITION_LABELS, type ChallengeEdition } from "@/lib/challenge/labels";
import { orgOwnedBy, seatFor, teamMemberRows, ALL_EDITIONS, type EditionState } from "@/lib/commerce/org";
import { CopyLink, InviteForm, AddSeatsForm, RemoveSeatButton } from "./ui";

export const metadata: Metadata = {
  title: { absolute: "Your team | Konfydence" },
  description: "Manage your Konfydence Challenge team — seats, invites and completion.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://konfydence.com";

function fmtDate(d: Date | null): string {
  return d ? d.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" }) : "—";
}

function EditionPill({ state }: { state: EditionState }) {
  if (state.state === "done") {
    return <span style={{ ...pill, background: "#e6f4e6", color: "#2f6d2f" }}>{state.percent}%</span>;
  }
  if (state.state === "progress") {
    return <span style={{ ...pill, background: "#fdf0dc", color: "#8a5a12" }}>{state.done}/{state.total}</span>;
  }
  return <span style={{ ...pill, background: "#f0eee9", color: tokens.textMuted }}>—</span>;
}

export default async function TeamsPage(props: { searchParams: Promise<{ welcome?: string; joined?: string }> }) {
  const sp = await props.searchParams;
  const account = await getAccount();
  if (!account) redirect("/account/sign-in?next=/teams&reason=team-invite");

  const org = await orgOwnedBy(account.id);

  // Member (not the admin) — a lighter view.
  if (!org) {
    const seat = await seatFor(account.id);
    if (!seat) {
      // Just paid? The fulfilment webhook may not have landed yet.
      if (sp.welcome) {
        return (
          <main style={styles.page}>
            <div style={styles.shell}>
              <Header />
              <div style={styles.card}>
                <h1 style={{ marginTop: 0, fontSize: 22 }}>Setting up your team…</h1>
                <p style={{ color: tokens.textMuted, fontWeight: 700 }}>
                  Payment received. Your seats are being provisioned — this usually takes a few seconds.
                  Refresh this page in a moment.
                </p>
                <Link href="/teams?welcome=1" style={styles.button}>Refresh</Link>
              </div>
            </div>
          </main>
        );
      }
      redirect("/pricing?team=1");
    }
    return (
      <main style={styles.page}>
        <div style={styles.shell}>
          <Header />
          <div style={styles.card}>
            <h1 style={{ marginTop: 0, fontSize: 22 }}>You&rsquo;re on {seat.org.name}.</h1>
            <p style={{ color: tokens.textMuted, fontWeight: 700 }}>
              Your seat unlocks all five Challenge editions with unlimited rounds
              {seat.org.termEnd ? `, through ${fmtDate(seat.org.termEnd)}` : ""}. Your answers stay private
              to you.
            </p>
            <Link href="/challenge" style={styles.button}>Go to the challenges</Link>
            <p style={{ fontSize: 12, color: tokens.textMuted, marginTop: 12, marginBottom: 0 }}>
              Progress and results live on your <Link href="/account">account</Link>.
            </p>
          </div>
        </div>
      </main>
    );
  }

  const rows = await teamMemberRows(org.id);
  const used = rows.filter((r) => r.status === "active").length;
  const invited = rows.filter((r) => r.status === "invited").length;
  const openCount = rows.filter((r) => r.status === "open").length;
  const joinUrl = `${APP_URL}/teams/join?code=${org.inviteCode}`;

  return (
    <main style={styles.page}>
      <div style={styles.shell}>
        <Header />

        {sp.welcome ? (
          <div style={{ ...styles.card, background: "#1c2b1c", color: "#e9efe6", marginBottom: 14 }}>
            <div style={{ fontWeight: 900, fontSize: 15 }}>Your team is set up.</div>
            <p style={{ fontSize: 13, lineHeight: 1.6, margin: "6px 0 0", color: "#c9d4c5" }}>
              Invite people below — by email, or share the join link. Each person signs in and claims a seat.
            </p>
          </div>
        ) : null}

        <div style={styles.card}>
          <h1 style={{ marginTop: 0, fontSize: 22 }}>{org.name}</h1>
          <p style={{ color: tokens.textMuted, fontWeight: 700, margin: "4px 0 0" }}>
            {used} of {org.seatCount} seats in use
            {invited ? ` · ${invited} invited` : ""}
            {openCount ? ` · ${openCount} open` : ""}
            {" · "}
            {org.status === "active" ? `renews ${fmtDate(org.termEnd)}` : `subscription ${org.status}`}
          </p>
          {org.overrideSeatPrice ? (
            <p style={{ fontSize: 12, color: tokens.textMuted, marginTop: 6 }}>
              Negotiated rate: ${(org.overrideSeatPrice / 100).toFixed(2)}/seat/year.
            </p>
          ) : null}
        </div>

        <div style={{ ...styles.card, marginTop: 14 }}>
          <h2 style={{ margin: "0 0 4px", fontSize: 18 }}>Add people</h2>
          <p style={{ color: tokens.textMuted, fontWeight: 700, fontSize: 13, marginTop: 0 }}>
            {openCount > 0
              ? `${openCount} seat${openCount === 1 ? "" : "s"} ready to fill.`
              : "Every seat is taken — add more below to invite anyone else."}
          </p>
          <InviteForm />
          <div style={{ marginTop: 16 }}>
            <div style={{ fontWeight: 800, fontSize: 13, marginBottom: 6 }}>Or share the join link</div>
            <CopyLink url={joinUrl} />
          </div>
        </div>

        <div style={{ ...styles.card, marginTop: 14 }}>
          <h2 style={{ margin: "0 0 10px", fontSize: 18 }}>Seats &amp; billing</h2>
          <AddSeatsForm current={org.seatCount} />
          <p style={{ fontSize: 12, color: tokens.textMuted, marginTop: 10, marginBottom: 0 }}>
            Seats are billed yearly. Increases are invoiced straight away (prorated); reductions take effect
            at renewal and can&rsquo;t go below the number in use.
          </p>
        </div>

        <div style={{ ...styles.card, marginTop: 14, overflowX: "auto" }}>
          <h2 style={{ margin: "0 0 10px", fontSize: 18 }}>Members</h2>
          <table style={{ borderCollapse: "collapse", width: "100%", fontSize: 13 }}>
            <thead>
              <tr>
                <th style={th}>Member</th>
                {ALL_EDITIONS.map((e) => (
                  <th key={e} style={{ ...th, textAlign: "center" }}>
                    {EDITION_LABELS[e as ChallengeEdition].replace(" Edition", "")}
                  </th>
                ))}
                <th style={{ ...th, textAlign: "center" }}>Done</th>
                <th style={th} />
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.seatId} style={{ borderTop: "1px solid rgba(11,27,43,0.10)" }}>
                  <td style={td}>
                    {r.status === "open" ? (
                      <span style={{ color: tokens.textMuted, fontWeight: 700 }}>Open seat</span>
                    ) : (
                      <>
                        <span style={{ fontWeight: 800 }}>{r.email}</span>
                        {r.isOwner ? <span style={{ color: tokens.textMuted, fontWeight: 700 }}> · admin</span> : null}
                        {r.status === "invited" ? (
                          <span style={{ color: "#8a5a12", fontWeight: 700 }}> · invited</span>
                        ) : null}
                      </>
                    )}
                  </td>
                  {ALL_EDITIONS.map((e) => (
                    <td key={e} style={{ ...td, textAlign: "center" }}>
                      {r.status === "active" ? <EditionPill state={r.editions[e as ChallengeEdition]} /> : <span style={{ color: tokens.textMuted }}>—</span>}
                    </td>
                  ))}
                  <td style={{ ...td, textAlign: "center", fontWeight: 800 }}>
                    {r.status === "active" ? `${r.completedCount}/5` : "—"}
                  </td>
                  <td style={{ ...td, textAlign: "right" }}>
                    {r.status !== "open" && !r.isOwner ? (
                      <RemoveSeatButton seatId={r.seatId} email={r.email ?? "this member"} />
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p style={{ fontSize: 12, color: tokens.textMuted, marginTop: 10, marginBottom: 0 }}>
            Percentages are each member&rsquo;s best full-challenge score per edition. You never see their answers.
          </p>
        </div>
      </div>
    </main>
  );
}

function Header() {
  return (
    <div style={styles.header}>
      <Link href="/" style={styles.smallLink}>← Konfydence</Link>
      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <Link href="/account" style={styles.smallLink}>Your account</Link>
        <Link href="/challenge" style={styles.smallLink}>Take a challenge</Link>
      </div>
    </div>
  );
}

const pill: React.CSSProperties = {
  display: "inline-block",
  minWidth: 40,
  padding: "3px 8px",
  borderRadius: 999,
  fontWeight: 800,
  fontSize: 12,
};
const th: React.CSSProperties = {
  textAlign: "left",
  padding: "6px 8px",
  fontSize: 11,
  textTransform: "uppercase",
  letterSpacing: 0.4,
  color: tokens.textMuted,
  whiteSpace: "nowrap",
};
const td: React.CSSProperties = { padding: "10px 8px", verticalAlign: "middle" };

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", background: tokens.gradientHero, padding: 18, display: "flex", justifyContent: "center" },
  shell: { width: "100%", maxWidth: 900 },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  smallLink: { color: "#ffffffcc", fontSize: 13, fontWeight: 800, textDecoration: "none" },
  card: { background: tokens.bgCardWhite, color: tokens.textOnLight, borderRadius: 14, padding: 18, boxShadow: "0 14px 40px rgba(0,0,0,0.25)" },
  button: {
    display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "10px 16px",
    borderRadius: 12, background: tokens.accentAmber, border: "none", color: tokens.bgCanvas,
    textDecoration: "none", fontWeight: 950, marginTop: 12,
  },
};
