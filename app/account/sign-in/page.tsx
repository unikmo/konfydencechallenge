import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAccount } from "@/lib/auth/session";
import { requestCode, submitCode } from "./actions";
import { PasskeySignInButton } from "@/components/account/PasskeySignInButton";

export const metadata: Metadata = {
  title: { absolute: "Sign in | Konfydence" },
  description: "Sign in to Konfydence with a one-time email code — no password.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type SP = { step?: string; email?: string; next?: string; error?: string; sent?: string };

const ERRORS: Record<string, string> = {
  consent: "Tick the box to continue.",
  email: "That doesn't look like an email address.",
  send: "We couldn't send the email just now. Try again in a moment.",
  code: "That code didn't match. Check the latest email and try again.",
  expired: "That code has expired. Ask for a new one.",
  attempts: "Too many tries on that code. Ask for a new one.",
  throttled: "Too many attempts. Wait a few minutes and try again.",
};

export default async function SignInPage(props: { searchParams: Promise<SP> }) {
  const sp = await props.searchParams;
  if (await getAccount()) redirect(sp.next?.startsWith("/") ? sp.next : "/account");

  const step = sp.step === "code" ? "code" : "email";
  const email = sp.email ?? "";
  const next = sp.next?.startsWith("/") ? sp.next : "/account";
  const error = sp.error ? ERRORS[sp.error] : null;

  return (
    <main className="kg-state">
      <section className="kg-state-card">
        <Link className="kf-back" href="/">← Konfydence</Link>
        <p className="k-kicker" style={{ marginTop: 22 }}>Your account</p>

        {step === "email" ? (
          <>
            <h1>Sign in with a code.</h1>
            <p>
              No password. Enter your email and we&rsquo;ll send a one-time code. The same account holds your
              Challenge results and any Lockscreens subscription.
            </p>
            {error ? <p className="kf-error" role="alert">{error}</p> : null}
            <form action={requestCode} className="kf-form">
              <input type="hidden" name="next" value={next} />
              <label htmlFor="email">Email address</label>
              <input id="email" name="email" type="email" autoComplete="email" required defaultValue={email} placeholder="you@example.com" />
              <label className="kf-consent">
                <input type="checkbox" name="consent" value="yes" required />
                <span>Send me my sign-in code and occasional Konfydence updates. Unsubscribe anytime.</span>
              </label>
              <button type="submit" className="k-button">Email me a code</button>
            </form>
            <PasskeySignInButton next={next} />
          </>
        ) : (
          <>
            <h1>Enter your code.</h1>
            <p>
              We sent a 6-digit code to <strong>{email}</strong>. It expires in 10 minutes. You can also tap the
              link in that email.
            </p>
            {error ? <p className="kf-error" role="alert">{error}</p> : null}
            <form action={submitCode} className="kf-form">
              <input type="hidden" name="next" value={next} />
              <input type="hidden" name="email" value={email} />
              <label htmlFor="code">6-digit code</label>
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
              <button type="submit" className="k-button">Sign in</button>
            </form>
            <form action={requestCode} className="kf-resend">
              <input type="hidden" name="next" value={next} />
              <input type="hidden" name="email" value={email} />
              <input type="hidden" name="consent" value="yes" />
              <button type="submit" className="kf-link-button">Send a new code</button>
            </form>
          </>
        )}

        <p className="kf-legal">
          By continuing you agree to our <Link href="/privacy-policy">Privacy Policy</Link> and{" "}
          <Link href="/terms-of-service">Terms</Link>.
        </p>
      </section>

      <style>{`
        .kf-back{color:var(--k-muted);font-size:13px;font-weight:600;text-decoration:none}
        .kf-back:hover{color:var(--k-gold)}
        .kf-error{padding:12px 14px;border-radius:12px;background:#fbeee9;color:#9f2f25;border:1px solid #ecccc4;font-size:13px;line-height:1.5}
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
