import React from "react";
import Link from "next/link";
import { cookies } from "next/headers";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { tokens } from "@/lib/theme/tokens";
import { getAccount } from "@/lib/auth/session";
import { ResultsHistory } from "@/components/dashboard/ResultsHistory";
import { KF_UID_COOKIE } from "@/lib/challenge/kfUidCookie";
import { EDITION_LABELS, type ChallengeEdition } from "@/lib/challenge/labels";
import { activeEntitlementWhere } from "@/lib/commerce/entitlementAccess";
import { linkLockscreenSubscriptions, getAccountSubscriptions } from "@/lib/lockscreens/linkToAccount";
import type { UiLang } from "@/lib/challenge/uiStrings";
import { ACCOUNT_STRINGS } from "@/lib/challenge/accountStrings";
import { EDITION_DECK_NAME_DE } from "@/lib/challenge/resultStrings";

export const metadata: Metadata = {
  title: { absolute: "Your account | Konfydence" },
  description: "Your Konfydence account — Challenge results and Lockscreens subscriptions in one place.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AccountPage(props: { searchParams: Promise<{ lang?: string }> }) {
  const sp = await props.searchParams;
  const lang: UiLang = sp.lang === "de" ? "de" : "en";
  const t = ACCOUNT_STRINGS[lang];
  const langQS = lang === "de" ? "?lang=de" : "";
  const account = await getAccount();
  const store = await cookies();
  const kfUid = store.get(KF_UID_COOKIE)?.value ?? null;

  // Signed out, no device history -> a plain sign-in invitation.
  if (!account && !kfUid) {
    return (
      <main className="kg-state">
        <section className="kg-state-card">
          <Link className="kf-back" href="/">{t.backHome}</Link>
          <p className="k-kicker" style={{ marginTop: 22 }}>{t.kicker}</p>
          <h1>{t.signedOutHeading}</h1>
          <p>{t.signedOutBody}</p>
          <Link className="k-button" href={`/account/sign-in${langQS}`}>{t.signInCta}</Link>
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

  const ownedOrg = account
    ? await prisma.org.findFirst({ where: { ownerAccountId: account.id }, select: { name: true } })
    : null;
  const memberSeat = account && !ownedOrg
    ? await prisma.orgSeat.findFirst({
        where: { accountId: account.id, status: "active" },
        select: { org: { select: { name: true } } },
      })
    : null;

  const entitlements = playerId
    ? await prisma.entitlement.findMany({
        where: { userId: playerId, ...activeEntitlementWhere() },
        select: { tier: true, edition: true, expiresAt: true, stripeSubscriptionId: true, orgId: true },
      })
    : [];
  const renewsAt = entitlements
    .map((e) => e.expiresAt)
    .filter((d): d is Date => d != null)
    .sort((a, b) => a.getTime() - b.getTime())[0] ?? null;
  const viaTeam = entitlements.some((e) => e.orgId != null);
  const hasUnlimited = entitlements.some((e) => e.tier === "unlimited" || e.tier === "team");
  const ownedEditions: ChallengeEdition[] = hasUnlimited
    ? (["travelsafe", "school", "university", "family", "workplace"] as ChallengeEdition[])
    : (entitlements
        .map((e) => e.edition)
        .filter((e): e is ChallengeEdition => !!e && e in EDITION_LABELS));
  const inProgress = playerId
    ? await prisma.challengeSession.findMany({
        where: { userId: playerId, mode: "full", status: "IN_PROGRESS" },
        orderBy: { updatedAt: "desc" },
        select: {
          id: true,
          edition: true,
          currentIndex: true,
          runNumber: true,
          _count: { select: { cards: true } },
        },
      })
    : [];
  const resumeByEdition = new Map(
    inProgress.map((s) => {
      const total = s._count.cards || 12;
      const done = Math.min(s.currentIndex, total);
      return [s.edition, { id: s.id, done, total, round: s.runNumber, pct: Math.round((done / total) * 100) }];
    })
  );

  return (
    <main style={styles.page}>
      <div style={styles.shell}>
        <div style={styles.header}>
          <Link href="/" style={styles.smallLink}>{t.backHome}</Link>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            {account ? <Link href={`/account/security${langQS}`} style={styles.smallLink}>{t.security}</Link> : null}
            <Link href={lang === "de" ? "/de/challenge" : "/challenge"} style={styles.smallLink}>{t.takeChallenge}</Link>
            {account ? (
              <form action="/api/account/sign-out" method="post">
                <button type="submit" style={styles.signOut}>{t.signOut}</button>
              </form>
            ) : null}
          </div>
        </div>

        {account ? (
          <div style={styles.card}>
            <h1 style={{ marginTop: 0, fontSize: 22 }}>{t.yourAccount}</h1>
            <p style={{ color: tokens.textMuted, fontWeight: 700, margin: "4px 0 0" }}>
              {account.email}
              {account.emailVerifiedAt ? (
                <span style={styles.verified}> · {t.verified}</span>
              ) : (
                <span style={styles.unverified}> · {t.unverified}</span>
              )}
            </p>
            {subscriptions.length > 0 ? (
              <div style={{ marginTop: 16 }}>
                <div style={{ fontWeight: 900, fontSize: 13, marginBottom: 8 }}>{t.lockscreensHeading}</div>
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
                <Link href="/lockscreens" style={styles.acctLink}>{t.lockscreensLink}</Link>
              </div>
            )}
            <p style={{ fontSize: 12, color: tokens.textMuted, marginTop: 12, marginBottom: 0 }}>
              {subscriptions.length > 0
                ? t.lockscreensNoteWithSubs
                : t.lockscreensNoteEmpty(account.email)}
            </p>
          </div>
        ) : (
          <div style={{ ...styles.card, background: "#1c2b1c", color: "#e9efe6" }}>
            <div style={{ fontWeight: 900, fontSize: 15 }}>{t.deviceOnlyHeading}</div>
            <p style={{ fontSize: 13, lineHeight: 1.6, margin: "6px 0 0", color: "#c9d4c5" }}>
              {t.deviceOnlyBody}
            </p>
            <Link href={`/account/sign-in${langQS}`} style={{ ...styles.button, marginTop: 12 }}>{t.deviceOnlySignIn}</Link>
          </div>
        )}

        {ownedOrg ? (
          <div style={{ ...styles.card, marginTop: 14, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
            <div>
              <div style={{ fontWeight: 900, fontSize: 15 }}>{ownedOrg.name}</div>
              <div style={{ fontSize: 12, color: tokens.textMuted, fontWeight: 700, marginTop: 2 }}>
                {t.teamAdminNote}
              </div>
            </div>
            <Link href="/teams" style={{ fontSize: 13, fontWeight: 800, color: tokens.textOnLight }}>{t.teamAdminManage}</Link>
          </div>
        ) : memberSeat ? (
          <div style={{ ...styles.card, marginTop: 14, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
            <div>
              <div style={{ fontWeight: 900, fontSize: 15 }}>{memberSeat.org.name}</div>
              <div style={{ fontSize: 12, color: tokens.textMuted, fontWeight: 700, marginTop: 2 }}>
                {t.teamMemberNote}
              </div>
            </div>
            <Link href="/teams" style={{ fontSize: 13, fontWeight: 800, color: tokens.textOnLight }}>{t.teamMemberView}</Link>
          </div>
        ) : null}

        {ownedEditions.length > 0 ? (
          <div style={{ ...styles.card, marginTop: 14 }}>
            <h2 style={{ margin: 0, fontSize: 18 }}>{t.yourChallenges}</h2>
            <p style={{ color: tokens.textMuted, fontWeight: 700, fontSize: 13, margin: "4px 0 12px" }}>
              {hasUnlimited ? t.ownedUnlimited : t.ownedSingle}
              {viaTeam
                ? t.viaTeam
                : renewsAt
                  ? t.renews(renewsAt.toLocaleDateString(lang === "de" ? "de-DE" : undefined, { year: "numeric", month: "long", day: "numeric" }))
                  : ""}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {ownedEditions.map((ed) => {
                const resume = resumeByEdition.get(ed);
                const startBase = lang === "de" ? "/de/challenge" : "/challenge";
                return (
                  <Link
                    key={ed}
                    href={resume ? `/challenge/session/${resume.id}` : `${startBase}/${ed}/start?mode=full`}
                    style={{ ...styles.subRow, alignItems: resume ? "stretch" : "center", flexDirection: resume ? "column" : "row", gap: resume ? 8 : 12 }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                      <div style={{ fontWeight: 800 }}>{lang === "de" ? EDITION_DECK_NAME_DE[ed] ?? EDITION_LABELS[ed] : EDITION_LABELS[ed]}</div>
                      <span style={{ fontSize: 12, fontWeight: 800, color: tokens.textOnLight }}>
                        {resume ? t.continueLabel : t.playLabel}
                      </span>
                    </div>
                    {resume ? (
                      <div style={{ width: "100%" }}>
                        <div style={{ fontSize: 11, color: tokens.textMuted, fontWeight: 700, marginBottom: 5 }}>
                          {t.roundProgress(resume.round, resume.done + 1, resume.total)}
                        </div>
                        <div style={{ height: 5, borderRadius: 999, background: "rgba(11,27,43,0.12)", overflow: "hidden" }}>
                          <div style={{ width: `${resume.pct}%`, height: "100%", background: tokens.accentAmber }} />
                        </div>
                      </div>
                    ) : null}
                  </Link>
                );
              })}
            </div>
          </div>
        ) : null}

        <div style={{ marginTop: 14 }}>
          <div style={{ ...styles.card, marginBottom: 14 }}>
            <h2 style={{ margin: 0, fontSize: 18 }}>{t.yourResults}</h2>
          </div>
          <ResultsHistory playerId={playerId} lang={lang} />
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
