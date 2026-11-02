import Link from "next/link";
import { cookies } from "next/headers";
import { AGE_BAND_COOKIE, isAgeBand } from "@/lib/challenge/ageGate";
import { AgeScreen } from "@/components/challenge/AgeScreen";

export default async function RegisterForReplayPage(
  props: {
    searchParams?: Promise<{ next?: string; error?: string; ageError?: string }>;
  }
) {
  const searchParams = await props.searchParams;
  const next = searchParams?.next?.startsWith("/") && !searchParams.next.startsWith("//") ? searchParams.next : "/challenge";
  const error = searchParams?.error;
  const cookieStore = await cookies();
  const stored = cookieStore.get(AGE_BAND_COOKIE)?.value;
  const band = isAgeBand(stored) ? stored : null;

  return (
    <main className="kg-state">
      <section className="kg-state-card">
        <Link className="kg-reg-back" href="/challenge">← Back to challenges</Link>

        {band === null ? (
          <>
            <p className="k-kicker" style={{ marginTop: 22 }}>One more free round</p>
            <AgeScreen lang="en" next={next} returnTo={`/challenge/register?next=${encodeURIComponent(next)}`} invalid={searchParams?.ageError === "1"} />
          </>
        ) : band === "under13" ? (
          <>
            <p className="k-kicker" style={{ marginTop: 22 }}>Free practice</p>
            <h1>We can&apos;t set this up with an email address.</h1>
            <p>
              You can keep using the free practice without an account. If you would like to carry on, ask a parent,
              guardian or teacher to help.
            </p>
            <Link className="k-button" href="/challenge">Back to challenges</Link>
          </>
        ) : (
          <>
            <p className="k-kicker" style={{ marginTop: 22 }}>One more free round</p>
            <h1>Keep practising without losing your progress.</h1>
            <p>
              {band === "13to15"
                ? "To unlock one more free readiness check, a parent or guardian needs to enter their email address. We will send the progress link to them."
                : "Enter your email to unlock one more free readiness check. Free access covers two rounds; the full challenge is available whenever you are ready."}
            </p>
            {error === "already-used" ? (
              <p className="kg-reg-error" role="alert">
                That email is already linked to another player. Use the email from this device or continue with the full challenge.
              </p>
            ) : null}
            {error === "age" ? (
              <p className="kg-reg-error" role="alert">Please complete the questions to continue.</p>
            ) : null}
            <form method="post" action="/api/challenge/register" className="kg-reg-form">
              <input type="hidden" name="next" value={next} />
              <label htmlFor="email">{band === "13to15" ? "Parent or guardian's email address" : "Email address"}</label>
              <input id="email" name="email" type="email" autoComplete="email" required placeholder={band === "13to15" ? "parent@example.com" : "you@example.com"} />
              {band === "13to15" ? (
                <label className="kg-reg-consent">
                  <input type="checkbox" name="parent" value="yes" required />
                  <span>I am the parent or guardian, and I am happy for this email address to be used to send a progress link.</span>
                </label>
              ) : null}
              <label className="kg-reg-consent">
                <input type="checkbox" name="consent" value="yes" required />
                <span>Send the progress link to this address. It is used for nothing else.</span>
              </label>
              <button type="submit" className="k-button">Unlock my next free round</button>
            </form>
          </>
        )}

        <p className="kg-reg-legal">
          We ask for a month and year of birth to set this up in the right way. We do not keep it, and this is a self-declared answer, not a check of age.
          Read our <Link href="/privacy-policy#children">children&apos;s privacy information</Link>, the <Link href="/privacy-policy">Privacy Policy</Link> and <Link href="/terms-of-service">Terms</Link>.
        </p>
      </section>

      <style>{`
        .kg-reg-back{color:var(--k-muted);font-size:13px;font-weight:600;text-decoration:none}
        .kg-reg-back:hover{color:var(--k-gold)}
        .kg-reg-error{padding:12px 14px;border-radius:12px;background:#fbeee9;color:#9f2f25;border:1px solid #ecccc4;font-size:13px;line-height:1.5}
        .kg-reg-form{display:grid;gap:12px}
        .kg-reg-form label{font-weight:650;color:var(--k-ink);font-size:13px}
        .kg-reg-form input[type=email]{width:100%;box-sizing:border-box;border:1px solid var(--k-line);border-radius:12px;padding:13px 14px;font:inherit;color:var(--k-ink);background:var(--k-paper)}
        .kg-reg-form input[type=email]:focus{outline:2px solid var(--k-gold);outline-offset:1px}
        .kg-reg-consent{display:flex;align-items:flex-start;gap:9px;margin:4px 0;color:var(--k-muted);font-size:12px;line-height:1.5;font-weight:400}
        .kg-reg-consent input{margin-top:3px;accent-color:var(--k-gold)}
        .kg-reg-form .k-button{margin-top:4px}
        .kg-reg-legal{font-size:12px;color:var(--k-soft);line-height:1.6;margin:18px 0 0}
        .kg-reg-legal a{color:var(--k-ink);font-weight:600}
      `}</style>
    </main>
  );
}
