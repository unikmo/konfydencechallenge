import React from "react";
import Link from "next/link";
import { cookies } from "next/headers";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { tokens } from "@/lib/theme/tokens";
import { getAccount } from "@/lib/auth/session";
import { ResultsHistory } from "@/components/dashboard/ResultsHistory";
import { KF_UID_COOKIE } from "@/lib/challenge/kfUidCookie";
import { linkLockscreenSubscriptions, getAccountSubscriptions } from "@/lib/lockscreens/linkToAccount";

export const metadata: Metadata = {
  title: { absolute: "Your account | Konfydence" },
  description: "Your Konfydence account — Challenge results and Lockscreens subscriptions in one place.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const account = await getAccount();
  const store = await cookies();
  const kfUid = store.get(KF_UID_COOKIE)?.value ?? null;

  // Signed out, no device history -> a plain sign-in invitation.
  if (!account && !kfUid) {
    return (
      <main className="kg-state">
        <section className="kg-state-card">
          <Link className="kf-back" href="/">← Konfydence</Link>
          <p className="k-kicker" style={{ marginTop: 22 }}>Your account</p>
          <h1>One account for everything Konfydence.</h1>
          <p>
            Your Challenge results on any device, and your Lockscreens subscription in the same place. Sign in
            with a one-time email code — no password.
          </p>
          <Link className="k-button" href="/account/sign-in">Sign in</Link>
        </section>
        <style>{`.kf-back{color:var(--k-muted);font-size:13px;font-weight:600;text-decoration:none}.kf-back:hover{color:var(--k-gold)}`}</style>
      </main>
    );
  }

  const playerId = account
    ? (await prisma.user.findFirst({ where: { accountId: account.id }, select: { id: true } }))?.id ?? null
    : kfUid;

  // Catch any Lockscreens subscription bought after sign-in, then list them.
  if (account) await linkLockscreenSubscriptions(account).catch(() => {});
  const subscriptions = account ? await getAccountSubscriptions(account.id) : [];

  return (
    <main style={styles.page}>
      <div style={styles.shell}>
        <div style={styles.header}>
          <Link href="/" style={styles.smallLink}>← Konfydence</Link>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            {account ? <Link href="/account/security" style={styles.smallLink}>Security</Link> : null}
            <Link href="/challenge" style={styles.smallLink}>Take a challenge</Link>
            {account ? (
              <form action="/api/account/sign-out" method="post">
                <button type="submit" style={styles.signOut}>Sign out</button>
              </form>
            ) : null}
          </div>
        </div>

        {account ? (
          <div style={styles.card}>
            <h1 style={{ marginTop: 0, fontSize: 22 }}>Your account</h1>
            <p style={{ color: tokens.textMuted, fontWeight: 700, margin: "4px 0 0" }}>
              {account.email}
              {account.emailVerifiedAt ? (
                <span style={styles.verified}> · verified</span>
              ) : (
                <span style={styles.unverified}> · unverified</span>
              )}
            </p>
            {subscriptions.length > 0 ? (
              <div style={{ marginTop: 16 }}>
                <div style={{ fontWeight: 900, fontSize: 13, marginBottom: 8 }}>Lockscreens subscriptions</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {subscriptions.map((s) => (
                    <Link key={s.id} href={s.managePath} style={styles.subRow}>
                      <div>
                        <div style={{ fontWeight: 800 }}>{s.orgName}</div>
                        <div style={{ fontSize: 12, color: tokens.textMuted, fontWeight: 700, marginTop: 2 }}>
                          {s.kindLabel}
                          {s.tokenStatus !== "active" ? ` · ${s.tokenStatus}` : ""}
                        </div>
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 800, color: tokens.textOnLight }}>{s.manageLabel} →</span>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <div style={styles.acctLinks}>
                <Link href="/lockscreens" style={styles.acctLink}>Konfydence Lockscreens →</Link>
              </div>
            )}
            <p style={{ fontSize: 12, color: tokens.textMuted, marginTop: 12, marginBottom: 0 }}>
              {subscriptions.length > 0
                ? "Bought a subscription with a different email? Sign in with that address to link it too."
                : `Lockscreens subscriptions bought with ${account.email} appear here automatically.`}
            </p>
          </div>
        ) : (
          <div style={{ ...styles.card, background: "#1c2b1c", color: "#e9efe6" }}>
            <div style={{ fontWeight: 900, fontSize: 15 }}>These results only live on this device.</div>
            <p style={{ fontSize: 13, lineHeight: 1.6, margin: "6px 0 0", color: "#c9d4c5" }}>
              Sign in with your email and we&rsquo;ll keep them on any device — and connect any Lockscreens
              subscription bought with the same address.
            </p>
            <Link href="/account/sign-in" style={{ ...styles.button, marginTop: 12 }}>Sign in to keep them</Link>
          </div>
        )}

        <div style={{ marginTop: 14 }}>
          <div style={{ ...styles.card, marginBottom: 14 }}>
            <h2 style={{ margin: 0, fontSize: 18 }}>Your Challenge results</h2>
          </div>
          <ResultsHistory playerId={playerId} />
        </div>
      </div>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", background: tokens.gradientHero, padding: 18, display: "flex", justifyContent: "center" },
  shell: { width: "100%", maxWidth: 900 },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  smallLink: { color: "#ffffffcc", fontSize: 13, fontWeight: 800, textDecoration: "none" },
  signOut: { background: "none", border: "none", padding: 0, color: "#ffffffcc", fontSize: 13, fontWeight: 800, textDecoration: "underline", cursor: "pointer" },
  card: { background: tokens.bgCardWhite, color: tokens.textOnLight, borderRadius: 14, padding: 18, boxShadow: "0 14px 40px rgba(0,0,0,0.25)" },
  verified: { color: "#4f8a10", fontWeight: 800 },
  unverified: { color: "#a66d00", fontWeight: 800 },
  acctLinks: { display: "flex", flexWrap: "wrap", gap: 10, marginTop: 14 },
  acctLink: { color: tokens.textOnLight, fontWeight: 700, fontSize: 13, textDecoration: "none", padding: "10px 14px", border: "1px solid rgba(11,27,43,0.12)", borderRadius: 10 },
  subRow: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 10, border: "1px solid rgba(11,27,43,0.12)", textDecoration: "none", color: tokens.textOnLight },
  button: { display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "10px 16px", borderRadius: 12, background: tokens.accentAmber, border: "none", color: tokens.bgCanvas, textDecoration: "none", fontWeight: 950 },
};
