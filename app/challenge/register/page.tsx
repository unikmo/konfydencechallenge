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
    <main className="page">
      <section className="card">
        <Link className="back" href="/challenge">Back to challenges</Link>
        <p className="eyebrow">One more free round</p>
        <h1>Keep practising without losing your progress.</h1>
        <p className="lede">
          Enter your email to unlock one additional 8-scenario readiness check. Your free access ends after 20 questions;
          the full 50-question challenge is available when you are ready.
        </p>
        {error === "already-used" ? (
          <p className="error" role="alert">
            That email is already linked to another player. Use the email from this device or continue with the full challenge.
          </p>
        ) : null}
        <form method="post" action="/api/challenge/register" className="form">
          <input type="hidden" name="next" value={next} />
          <label htmlFor="email">Email address</label>
          <input id="email" name="email" type="email" autoComplete="email" required placeholder="you@example.com" />
          <label className="consent">
            <input type="checkbox" name="consent" value="yes" required />
            <span>Send me my progress link and occasional Konfydence updates. Unsubscribe anytime.</span>
          </label>
          <button type="submit">Unlock my next free round</button>
        </form>
        <p className="legal">
          By continuing, you agree to our <Link href="/privacy-policy">Privacy Policy</Link> and <Link href="/terms-of-service">Terms</Link>.
        </p>
      </section>

      <style>{".page{min-height:100vh;background:#f4f7fb;color:#102344;padding:32px 16px;display:flex;justify-content:center;align-items:center;font-family:Arial,Helvetica,sans-serif}.card{width:100%;max-width:560px;background:#fff;border:1px solid #dce5f0;border-radius:16px;padding:28px;box-shadow:0 16px 40px rgba(16,35,68,.1)}.back{color:#365477;font-size:13px;font-weight:800;text-decoration:none}.eyebrow{margin:30px 0 10px;color:#12639d;text-transform:uppercase;letter-spacing:.08em;font-size:12px;font-weight:900}h1{margin:0;color:#102344;font-size:34px;line-height:1.08}.lede{color:#526b93;line-height:1.6;margin:16px 0 22px}.error{padding:12px;border-radius:9px;background:#fff1ed;color:#9f2f25;border:1px solid #ffc9c2;font-weight:700;line-height:1.4}.form{display:grid;gap:10px}label{font-weight:800;color:#102344;font-size:14px}input[type=email]{width:100%;box-sizing:border-box;border:1px solid #cbd5e1;border-radius:9px;padding:13px 14px;font:inherit;color:#102344}.consent{display:flex;align-items:flex-start;gap:9px;margin:5px 0;color:#526b93;font-size:13px;line-height:1.4;font-weight:600}.consent input{margin-top:3px;accent-color:#12639d}button{border:0;border-radius:10px;padding:14px 16px;background:#ff584c;color:#fff;font-weight:900;font-size:15px;cursor:pointer;box-shadow:0 4px 0 #d74339}.legal{font-size:12px;color:#607797;line-height:1.5;margin:18px 0 0}.legal a{color:#12639d;font-weight:800}"}</style>
    </main>
  );
}
