import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAccount } from "@/lib/auth/session";
import { requestCode, submitCode, submitTotp } from "./actions";
import { PasskeySignInButton } from "@/components/account/PasskeySignInButton";
import type { UiLang } from "@/lib/challenge/uiStrings";
import { SIGNIN_STRINGS, SIGNIN_REASONS, SIGNIN_ERRORS } from "@/lib/challenge/accountStrings";

export const metadata: Metadata = {
  title: { absolute: "Sign in | Konfydence" },
  description: "Sign in to Konfydence with a one-time email code — no password.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type SP = { step?: string; email?: string; next?: string; error?: string; sent?: string; reason?: string; lang?: string };

// This page is shared across locales (there's no /de/account/sign-in route) —
// a German visitor is carried here via an explicit ?lang=de param rather than
// a scenario-derived signal. See lib/challenge/accountStrings.ts.

export default async function SignInPage(props: { searchParams: Promise<SP> }) {
  const sp = await props.searchParams;
  const lang: UiLang = sp.lang === "de" ? "de" : "en";
  if (await getAccount()) redirect(sp.next?.startsWith("/") ? sp.next : "/account");

  const step = sp.step === "code" ? "code" : sp.step === "totp" ? "totp" : "email";
  const email = sp.email ?? "";
  const next = sp.next?.startsWith("/") ? sp.next : "/account";
  const t = SIGNIN_STRINGS[lang];
  const error = sp.error ? SIGNIN_ERRORS[lang][sp.error] : null;
  const reason = sp.reason ? SIGNIN_REASONS[lang][sp.reason] : null;

  return (
    <main className="kg-state">
      <section className="kg-state-card">
        <Link className="kf-back" href="/">{t.backHome}</Link>
        <p className="k-kicker" style={{ marginTop: 22 }}>{t.kicker}</p>

        {step === "totp" ? (
          <>
            <h1>{t.totpHeading}</h1>
            <p>{t.totpBody}</p>
            {error ? <p className="kf-error" role="alert">{error}</p> : null}
            <form action={submitTotp} className="kf-form">
              <input type="hidden" name="next" value={next} />
              <input type="hidden" name="lang" value={lang} />
              <label htmlFor="code">{t.totpLabel}</label>
              <input
                id="code"
                name="code"
                inputMode="text"
                autoComplete="one-time-code"
                autoFocus
                required
                placeholder="123456"
                className="kf-code-input"
              />
              <button type="submit" className="k-button">{t.totpSubmit}</button>
            </form>
          </>
        ) : step === "email" ? (
          <>
            <h1>{t.emailHeading}</h1>
            <p>{t.emailBody}</p>
            {reason ? <p className="kf-reason">{reason}</p> : null}
            {error ? <p className="kf-error" role="alert">{error}</p> : null}
            <form action={requestCode} className="kf-form">
              <input type="hidden" name="next" value={next} />
              <input type="hidden" name="lang" value={lang} />
              <label htmlFor="email">{t.emailLabel}</label>
              <input id="email" name="email" type="email" autoComplete="email" required defaultValue={email} placeholder="you@example.com" />
              <label className="kf-consent">
                <input type="checkbox" name="consent" value="yes" required />
                <span>{t.consentText}</span>
              </label>
              <button type="submit" className="k-button">{t.emailSubmit}</button>
            </form>
            <PasskeySignInButton next={next} lang={lang} />
          </>
        ) : (
          <>
            <h1>{t.codeHeading}</h1>
            <p>{t.codeBody(email)}</p>
            {error ? <p className="kf-error" role="alert">{error}</p> : null}
            <form action={submitCode} className="kf-form">
              <input type="hidden" name="next" value={next} />
              <input type="hidden" name="email" value={email} />
              <input type="hidden" name="lang" value={lang} />
              <label htmlFor="code">{t.codeLabel}</label>
              <input
                id="code"
                name="code"
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="[0-9 ]*"
                maxLength={7}
                required
                placeholder="123456"
                className="kf-code-input"
              />
              <button type="submit" className="k-button">{t.codeSubmit}</button>
            </form>
            <form action={requestCode} className="kf-resend">
              <input type="hidden" name="next" value={next} />
              <input type="hidden" name="email" value={email} />
              <input type="hidden" name="consent" value="yes" />
              <input type="hidden" name="lang" value={lang} />
              <button type="submit" className="kf-link-button">{t.resend}</button>
            </form>
          </>
        )}

        <p className="kf-legal">
          {t.legalPrefix} <Link href={t.privacyHref}>{t.privacyPolicy}</Link> {t.and}{" "}
          <Link href={t.termsHref}>{t.terms}</Link>.
        </p>
      </section>

      <style>{`
        .kf-back{color:var(--k-muted);font-size:13px;font-weight:600;text-decoration:none}
        .kf-back:hover{color:var(--k-gold)}
        .kf-error{padding:12px 14px;border-radius:12px;background:#fbeee9;color:#9f2f25;border:1px solid #ecccc4;font-size:13px;line-height:1.5}
        .kf-reason{padding:12px 14px;border-radius:12px;background:#f3efe4;color:#5a5344;border:1px solid #e4dcc9;font-size:13px;line-height:1.55}
        .kf-form{display:grid;gap:12px}
        .kf-form label{font-weight:650;color:var(--k-ink);font-size:13px}
        .kf-form input[type=email],.kf-form input[name=code]{width:100%;box-sizing:border-box;border:1px solid var(--k-line);border-radius:12px;padding:13px 14px;font:inherit;color:var(--k-ink);background:var(--k-paper)}
        .kf-form input:focus{outline:2px solid var(--k-gold);outline-offset:1px}
        .kf-code-input{letter-spacing:.4em;font-size:18px;text-align:center}
        .kf-consent{display:flex;align-items:flex-start;gap:9px;margin:4px 0;color:var(--k-muted);font-size:12px;line-height:1.5;font-weight:400}
        .kf-consent input{margin-top:3px;accent-color:var(--k-gold)}
        .kf-form .k-button{margin-top:4px}
        .kf-resend{margin:14px 0 0}
        .kf-link-button{background:none;border:none;padding:0;color:var(--k-muted);font:inherit;font-size:13px;font-weight:600;text-decoration:underline;cursor:pointer}
        .kf-link-button:hover{color:var(--k-gold)}
        .kf-legal{font-size:12px;color:var(--k-soft);line-height:1.6;margin:18px 0 0}
        .kf-legal a{color:var(--k-ink);font-weight:600}
      `}</style>
    </main>
  );
}
