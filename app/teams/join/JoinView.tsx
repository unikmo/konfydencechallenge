import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getAccount } from "@/lib/auth/session";
import type { UiLang } from "@/lib/challenge/uiStrings";
import { claimSeatAction } from "./actions";

type SP = { code?: string; err?: string };

const T = {
  en: {
    home: "/",
    base: "/teams",
    pricing: "/pricing",
    back: "← Konfydence",
    kicker: "Team seat",
    invalidH: "This invite link isn’t valid.",
    invalidP: "Ask whoever invited you to send a fresh link, or the 8-character code.",
    seePricing: "See Konfydence pricing",
    joinH: (n: string) => `Join ${n} on Konfydence.`,
    joinP:
      "A team seat unlocks all five Challenge editions with unlimited rounds. Your answers and scores stay private to you — your admin sees which editions you’ve completed, not how you answered.",
    claim: "Claim my seat",
    signInClaim: "Sign in and claim my seat",
    legalSignIn: "You’ll sign in with a one-time email code — no password.",
    signedInAs: (e: string) => `Signing in as ${e}.`,
    errors: {
      not_found: "That invite link is not valid. Ask your admin for a fresh one.",
      inactive: "This team's subscription is not active right now. Ask your admin.",
      full: "This team has no open seats left. Ask your admin to add one.",
    } as Record<string, string>,
    errFallback: "Something went wrong claiming that seat.",
  },
  de: {
    home: "/de",
    base: "/de/teams",
    pricing: "/de/pricing",
    back: "← Konfydence",
    kicker: "Teamplatz",
    invalidH: "Dieser Einladungslink ist ungültig.",
    invalidP: "Bitte die Person, die dich eingeladen hat, um einen neuen Link oder den 8-stelligen Code.",
    seePricing: "Preise ansehen",
    joinH: (n: string) => `Tritt ${n} bei Konfydence bei.`,
    joinP:
      "Mit einem Teamplatz hast du Zugang zu allen fünf Challenge-Editionen mit unbegrenzten Runden. Deine Antworten und Ergebnisse bleiben privat – dein Admin sieht nur, welche Editionen du abgeschlossen hast, nicht wie du geantwortet hast.",
    claim: "Meinen Platz übernehmen",
    signInClaim: "Anmelden und Platz übernehmen",
    legalSignIn: "Du meldest dich mit einem einmaligen Code per E-Mail an – ganz ohne Passwort.",
    signedInAs: (e: string) => `Angemeldet als ${e}.`,
    errors: {
      not_found: "Dieser Einladungslink ist ungültig. Bitte deinen Admin um einen neuen.",
      inactive: "Das Abo dieses Teams ist derzeit nicht aktiv. Wende dich bitte an deinen Admin.",
      full: "In diesem Team ist kein Platz mehr frei. Bitte deinen Admin, einen weiteren Platz hinzuzufügen.",
    } as Record<string, string>,
    errFallback: "Beim Übernehmen des Platzes ist etwas schiefgelaufen.",
  },
} as const;

export default async function TeamJoinView(props: { searchParams: Promise<SP>; lang?: UiLang }) {
  const lang: UiLang = props.lang ?? "en";
  const t = T[lang];
  const sp = await props.searchParams;
  const code = String(sp.code ?? "").trim().toUpperCase();
  const org = code ? await prisma.org.findUnique({ where: { inviteCode: code } }) : null;
  const account = await getAccount();

  if (org && account) {
    const seat = await prisma.orgSeat.findFirst({
      where: { orgId: org.id, accountId: account.id, status: "active" },
      select: { id: true },
    });
    if (seat && !sp.err) redirect(t.base);
  }

  const error = sp.err ? t.errors[sp.err] ?? t.errFallback : null;

  return (
    <main className="kg-state">
      <section className="kg-state-card">
        <Link className="kf-back" href={t.home}>{t.back}</Link>
        <p className="k-kicker" style={{ marginTop: 22 }}>{t.kicker}</p>

        {!org ? (
          <>
            <h1>{t.invalidH}</h1>
            <p>{t.invalidP}</p>
            <Link className="k-button" href={t.pricing}>{t.seePricing}</Link>
          </>
        ) : (
          <>
            <h1>{t.joinH(org.name)}</h1>
            <p>{t.joinP}</p>
            {error ? <p className="kf-error" role="alert">{error}</p> : null}
            <form action={claimSeatAction} className="kf-form">
              <input type="hidden" name="code" value={code} />
              <input type="hidden" name="lang" value={lang} />
              <button type="submit" className="k-button">
                {account ? t.claim : t.signInClaim}
              </button>
            </form>
            {!account ? (
              <p className="kf-legal">{t.legalSignIn}</p>
            ) : (
              <p className="kf-legal">{t.signedInAs(account.email)}</p>
            )}
          </>
        )}
      </section>
      <style>{`
        .kf-back{color:var(--k-muted);font-size:13px;font-weight:600;text-decoration:none}
        .kf-back:hover{color:var(--k-gold)}
        .kf-form{margin-top:18px}
        .kf-error{padding:12px 14px;border-radius:12px;background:#fbeaea;color:#8a2b2b;border:1px solid #f0cccc;font-size:13px;line-height:1.5}
        .kf-legal{margin-top:12px;font-size:12px;color:var(--k-muted)}
      `}</style>
    </main>
  );
}
