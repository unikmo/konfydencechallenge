import Link from "next/link";
import type { UiLang } from "@/lib/challenge/uiStrings";
import { EMAIL_GATE_STRINGS, EDITION_DECK_NAME_DE } from "@/lib/challenge/resultStrings";

const EDITION_LABEL: Record<string, string> = {
  school: "School",
  university: "University",
  family: "Family",
  travelsafe: "TravelSafe",
  workplace: "Workplace",
};

/**
 * Free play is free to start, but the result is delivered by email. This gate
 * stands in front of the result for a not-yet-registered player. Entering an
 * email emails the result, unlocks it on-screen, and signs the player in.
 */
export function ResultEmailGate({
  sessionId,
  edition,
  claim,
  lang = "en",
}: {
  sessionId: string;
  edition: string;
  claim?: string;
  lang?: UiLang;
}) {
  const t = EMAIL_GATE_STRINGS[lang];
  const label = (lang === "de" ? EDITION_DECK_NAME_DE : EDITION_LABEL)[edition] ?? edition;
  const message = claim ? t.claimMessages[claim] : null;

  return (
    <main className="kg-state">
      <section className="kg-state-card">
        <Link className="kf-back" href="/challenge">{t.backToChallenges}</Link>
        <p className="k-kicker" style={{ marginTop: 22 }}>{t.readyHeading(label)}</p>
        <h1>{t.h1}</h1>
        <p>{t.body}</p>
        {message ? <p className="kf-error" role="alert">{message}</p> : null}
        <form method="post" action={`/api/challenge/session/${sessionId}/claim`} className="kf-form">
          <label htmlFor="email">{t.emailLabel}</label>
          <input id="email" name="email" type="email" autoComplete="email" required placeholder="you@example.com" />
          <label className="kf-consent">
            <input type="checkbox" name="consent" value="yes" required />
            <span>{t.consentText}</span>
          </label>
          <button type="submit" className="k-button">{t.submit}</button>
        </form>
        <p className="kf-legal">
          {t.alreadyHaveAccount} <Link href={`/account/sign-in?next=${encodeURIComponent(`/challenge/session/${sessionId}/results`)}${lang === "de" ? "&lang=de" : ""}`}>{t.signIn}</Link> {t.signInSuffix}
          <br />
          {t.legalPrefix} <Link href={t.privacyHref}>{t.privacyPolicy}</Link> {t.and}{" "}
          <Link href={t.termsHref}>{t.terms}</Link>.
        </p>
      </section>

      <style>{`
        .kf-back{color:var(--k-muted);font-size:13px;font-weight:600;text-decoration:none}
        .kf-back:hover{color:var(--k-gold)}
        .kf-error{padding:12px 14px;border-radius:12px;background:#fbeee9;color:#9f2f25;border:1px solid #ecccc4;font-size:13px;line-height:1.5}
        .kf-form{display:grid;gap:12px}
        .kf-form label{font-weight:650;color:var(--k-ink);font-size:13px}
        .kf-form input[type=email]{width:100%;box-sizing:border-box;border:1px solid var(--k-line);border-radius:12px;padding:13px 14px;font:inherit;color:var(--k-ink);background:var(--k-paper)}
        .kf-form input[type=email]:focus{outline:2px solid var(--k-gold);outline-offset:1px}
        .kf-consent{display:flex;align-items:flex-start;gap:9px;margin:4px 0;color:var(--k-muted);font-size:12px;line-height:1.5;font-weight:400}
        .kf-consent input{margin-top:3px;accent-color:var(--k-gold)}
        .kf-form .k-button{margin-top:4px}
        .kf-legal{font-size:12px;color:var(--k-soft);line-height:1.7;margin:18px 0 0}
        .kf-legal a{color:var(--k-ink);font-weight:600}
      `}</style>
    </main>
  );
}
