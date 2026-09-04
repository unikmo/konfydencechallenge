import Link from "next/link";

export default async function RegisterForReplayPage(
  props: {
    searchParams?: Promise<{ next?: string; error?: string }>;
  }
) {
  const searchParams = await props.searchParams;
  const next = searchParams?.next?.startsWith("/") ? searchParams.next : "/challenge";
  const error = searchParams?.error;

  return (
    <main className="kg-state">
      <section className="kg-state-card">
        <Link className="kg-reg-back" href="/challenge">← Back to challenges</Link>
        <p className="k-kicker" style={{ marginTop: 22 }}>One more free round</p>
        <h1>Keep practising without losing your progress.</h1>
        <p>
          Enter your email to unlock one more free readiness check. Free access covers two rounds;
          the full challenge is available whenever you are ready.
        </p>
        {error === "already-used" ? (
          <p className="kg-reg-error" role="alert">
            That email is already linked to another player. Use the email from this device or continue with the full challenge.
          </p>
        ) : null}
        <form method="post" action="/api/challenge/register" className="kg-reg-form">
          <input type="hidden" name="next" value={next} />
          <label htmlFor="email">Email address</label>
          <input id="email" name="email" type="email" autoComplete="email" required placeholder="you@example.com" />
          <label className="kg-reg-consent">
            <input type="checkbox" name="consent" value="yes" required />
            <span>Send me my progress link and occasional Konfydence updates. Unsubscribe anytime.</span>
          </label>
          <button type="submit" className="k-button">Unlock my next free round</button>
        </form>
        <p className="kg-reg-legal">
          By continuing, you agree to our <Link href="/privacy-policy">Privacy Policy</Link> and <Link href="/terms-of-service">Terms</Link>.
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
