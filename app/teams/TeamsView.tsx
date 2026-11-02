import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { tokens } from "@/lib/theme/tokens";
import { getAccount } from "@/lib/auth/session";
import { EDITION_LABELS, type ChallengeEdition } from "@/lib/challenge/labels";
import { EDITION_LABELS_DE, type UiLang } from "@/lib/challenge/uiStrings";
import { orgOwnedBy, seatFor, teamMemberRows, ALL_EDITIONS, type EditionState } from "@/lib/commerce/org";
import { CopyLink, InviteForm, AddSeatsForm, RemoveSeatButton } from "./ui";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://konfydence.com";

const L = {
  en: {
    locale: undefined as string | undefined,
    base: "/teams",
    home: "/",
    account: "/account",
    challenge: "/challenge",
    pricing: "/pricing?team=1",
    signIn: "/account/sign-in?next=/teams&reason=team-invite",
    settingUpH: "Setting up your team…",
    settingUpP: "Payment received. Your seats are being provisioned — this usually takes a few seconds. Refresh this page in a moment.",
    refresh: "Refresh",
    onTeam: (n: string) => <>You&rsquo;re on {n}.</>,
    memberP: (end: string | null) =>
      `Your seat unlocks all five Challenge editions with unlimited rounds${end ? `, through ${end}` : ""}. Your answers stay private to you.`,
    goChallenges: "Go to the challenges",
    progressLives: "Progress and results live on your ",
    accountWord: "account",
    setUp: "Your team is set up.",
    setUpP: "Invite people below — by email, or share the join link. Each person signs in and claims a seat.",
    seatsUsed: (u: number, n: number) => `${u} of ${n} seats in use`,
    invitedN: (n: number) => ` · ${n} invited`,
    openN: (n: number) => ` · ${n} open`,
    renews: (d: string) => `renews ${d}`,
    subStatus: (st: string) => `subscription ${st}`,
    negotiated: (cents: number) => `Negotiated rate: $${(cents / 100).toFixed(2)}/seat/year.`,
    addPeople: "Add people",
    seatsReady: (n: number) => `${n} seat${n === 1 ? "" : "s"} ready to fill.`,
    allTaken: "Every seat is taken — add more below to invite anyone else.",
    shareLink: "Or share the join link",
    seatsBilling: "Seats & billing",
    billingNote:
      "Seats are billed yearly. Increases are invoiced straight away (prorated); reductions take effect at renewal and can’t go below the number in use.",
    members: "Members",
    member: "Member",
    done: "Done",
    openSeat: "Open seat",
    admin: " · admin",
    invitedTag: " · invited",
    thisMember: "this member",
    pctNote: "Percentages are each member’s best full-challenge score per edition. You never see their answers.",
    back: "← Konfydence",
    yourAccount: "Your account",
    takeChallenge: "Take a challenge",
    editionLabel: (e: string) => EDITION_LABELS[e as ChallengeEdition].replace(" Edition", ""),
  },
  de: {
    locale: "de-DE" as string | undefined,
    base: "/de/teams",
    home: "/de",
    account: "/account?lang=de",
    challenge: "/de/challenge",
    pricing: "/de/pricing?team=1",
    signIn: "/account/sign-in?next=/de/teams&reason=team-invite&lang=de",
    settingUpH: "Euer Team wird eingerichtet …",
    settingUpP:
      "Die Zahlung ist eingegangen. Eure Plätze werden gerade angelegt – das dauert meist nur ein paar Sekunden. Lade die Seite gleich noch einmal.",
    refresh: "Neu laden",
    onTeam: (n: string) => <>Du gehörst zu {n}.</>,
    memberP: (end: string | null) =>
      `Mit deinem Platz hast du Zugang zu allen fünf Challenge-Editionen mit unbegrenzten Runden${end ? ` bis zum ${end}` : ""}. Deine Antworten bleiben privat.`,
    goChallenges: "Zu den Challenges",
    progressLives: "Fortschritt und Ergebnisse findest du in deinem ",
    accountWord: "Konto",
    setUp: "Euer Team ist eingerichtet.",
    setUpP: "Lade unten Personen ein – per E-Mail oder mit dem Beitrittslink. Jede Person meldet sich an und übernimmt einen Platz.",
    seatsUsed: (u: number, n: number) => `${u} von ${n} Plätzen belegt`,
    invitedN: (n: number) => ` · ${n} eingeladen`,
    openN: (n: number) => ` · ${n} frei`,
    renews: (d: string) => `verlängert sich am ${d}`,
    subStatus: (st: string) => `Abo-Status: ${st}`,
    negotiated: (cents: number) =>
      `Vereinbarter Preis: ${(cents / 100).toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} € pro Platz und Jahr.`,
    addPeople: "Personen hinzufügen",
    seatsReady: (n: number) => (n === 1 ? "1 Platz ist bereit zum Vergeben." : `${n} Plätze sind bereit zum Vergeben.`),
    allTaken: "Alle Plätze sind vergeben – erweitere unten die Anzahl, um weitere Personen einzuladen.",
    shareLink: "Oder teile den Beitrittslink",
    seatsBilling: "Plätze und Abrechnung",
    billingNote:
      "Die Plätze werden jährlich abgerechnet. Erhöhungen werden sofort anteilig in Rechnung gestellt; Verringerungen gelten ab der Verlängerung und können die Zahl der belegten Plätze nicht unterschreiten.",
    members: "Mitglieder",
    member: "Mitglied",
    done: "Fertig",
    openSeat: "Freier Platz",
    admin: " · Admin",
    invitedTag: " · eingeladen",
    thisMember: "dieses Mitglied",
    pctNote:
      "Die Prozentwerte zeigen das beste Ergebnis jedes Mitglieds in der vollständigen Challenge je Edition. Die Antworten selbst siehst du nie.",
    back: "← Konfydence",
    yourAccount: "Dein Konto",
    takeChallenge: "Challenge starten",
    editionLabel: (e: string) => (EDITION_LABELS_DE[e] ?? e).replace("-Edition", ""),
  },
} as const;

function fmtDate(d: Date | null, locale?: string): string {
  return d ? d.toLocaleDateString(locale, { year: "numeric", month: "long", day: "numeric" }) : "—";
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

export default async function TeamsView(props: {
  searchParams: Promise<{ welcome?: string; joined?: string }>;
  lang?: UiLang;
}) {
  const lang: UiLang = props.lang ?? "en";
  const t = L[lang];
  const sp = await props.searchParams;
  const account = await getAccount();
  if (!account) redirect(t.signIn);

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
              <Header lang={lang} />
              <div style={styles.card}>
                <h1 style={{ marginTop: 0, fontSize: 22 }}>{t.settingUpH}</h1>
                <p style={{ color: tokens.textMuted, fontWeight: 700 }}>{t.settingUpP}</p>
                <Link href={`${t.base}?welcome=1`} style={styles.button}>{t.refresh}</Link>
              </div>
            </div>
          </main>
        );
      }
      redirect(t.pricing);
    }
    return (
      <main style={styles.page}>
        <div style={styles.shell}>
          <Header lang={lang} />
          <div style={styles.card}>
            <h1 style={{ marginTop: 0, fontSize: 22 }}>{t.onTeam(seat.org.name)}</h1>
            <p style={{ color: tokens.textMuted, fontWeight: 700 }}>
              {t.memberP(seat.org.termEnd ? fmtDate(seat.org.termEnd, t.locale) : null)}
            </p>
            <Link href={t.challenge} style={styles.button}>{t.goChallenges}</Link>
            <p style={{ fontSize: 12, color: tokens.textMuted, marginTop: 12, marginBottom: 0 }}>
              {t.progressLives}<Link href={t.account}>{t.accountWord}</Link>.
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
  const joinUrl = `${APP_URL}${t.base}/join?code=${org.inviteCode}`;

  return (
    <main style={styles.page}>
      <div style={styles.shell}>
        <Header lang={lang} />

        {sp.welcome ? (
          <div style={{ ...styles.card, background: "#1c2b1c", color: "#e9efe6", marginBottom: 14 }}>
            <div style={{ fontWeight: 900, fontSize: 15 }}>{t.setUp}</div>
            <p style={{ fontSize: 13, lineHeight: 1.6, margin: "6px 0 0", color: "#c9d4c5" }}>{t.setUpP}</p>
          </div>
        ) : null}

        <div style={styles.card}>
          <h1 style={{ marginTop: 0, fontSize: 22 }}>{org.name}</h1>
          <p style={{ color: tokens.textMuted, fontWeight: 700, margin: "4px 0 0" }}>
            {t.seatsUsed(used, org.seatCount)}
            {invited ? t.invitedN(invited) : ""}
            {openCount ? t.openN(openCount) : ""}
            {" · "}
            {org.status === "active" ? t.renews(fmtDate(org.termEnd, t.locale)) : t.subStatus(org.status)}
          </p>
          {org.overrideSeatPrice ? (
            <p style={{ fontSize: 12, color: tokens.textMuted, marginTop: 6 }}>{t.negotiated(org.overrideSeatPrice)}</p>
          ) : null}
        </div>

        <div style={{ ...styles.card, marginTop: 14 }}>
          <h2 style={{ margin: "0 0 4px", fontSize: 18 }}>{t.addPeople}</h2>
          <p style={{ color: tokens.textMuted, fontWeight: 700, fontSize: 13, marginTop: 0 }}>
            {openCount > 0 ? t.seatsReady(openCount) : t.allTaken}
          </p>
          <InviteForm lang={lang} />
          <div style={{ marginTop: 16 }}>
            <div style={{ fontWeight: 800, fontSize: 13, marginBottom: 6 }}>{t.shareLink}</div>
            <CopyLink url={joinUrl} lang={lang} />
          </div>
        </div>

        <div style={{ ...styles.card, marginTop: 14 }}>
          <h2 style={{ margin: "0 0 10px", fontSize: 18 }}>{t.seatsBilling}</h2>
          <AddSeatsForm current={org.seatCount} lang={lang} />
          <p style={{ fontSize: 12, color: tokens.textMuted, marginTop: 10, marginBottom: 0 }}>{t.billingNote}</p>
        </div>

        <div style={{ ...styles.card, marginTop: 14, overflowX: "auto" }}>
          <h2 style={{ margin: "0 0 10px", fontSize: 18 }}>{t.members}</h2>
          <table style={{ borderCollapse: "collapse", width: "100%", fontSize: 13 }}>
            <thead>
              <tr>
                <th style={th}>{t.member}</th>
                {ALL_EDITIONS.map((e) => (
                  <th key={e} style={{ ...th, textAlign: "center" }}>
                    {t.editionLabel(e)}
                  </th>
                ))}
                <th style={{ ...th, textAlign: "center" }}>{t.done}</th>
                <th style={th} />
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.seatId} style={{ borderTop: "1px solid rgba(11,27,43,0.10)" }}>
                  <td style={td}>
                    {r.status === "open" ? (
                      <span style={{ color: tokens.textMuted, fontWeight: 700 }}>{t.openSeat}</span>
                    ) : (
                      <>
                        <span style={{ fontWeight: 800 }}>{r.email}</span>
                        {r.isOwner ? <span style={{ color: tokens.textMuted, fontWeight: 700 }}>{t.admin}</span> : null}
                        {r.status === "invited" ? (
                          <span style={{ color: "#8a5a12", fontWeight: 700 }}>{t.invitedTag}</span>
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
                      <RemoveSeatButton seatId={r.seatId} email={r.email ?? t.thisMember} lang={lang} />
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p style={{ fontSize: 12, color: tokens.textMuted, marginTop: 10, marginBottom: 0 }}>{t.pctNote}</p>
        </div>
      </div>
    </main>
  );
}

function Header({ lang }: { lang: UiLang }) {
  const t = L[lang];
  return (
    <div style={styles.header}>
      <Link href={t.home} style={styles.smallLink}>{t.back}</Link>
      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <Link href={t.account} style={styles.smallLink}>{t.yourAccount}</Link>
        <Link href={t.challenge} style={styles.smallLink}>{t.takeChallenge}</Link>
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
