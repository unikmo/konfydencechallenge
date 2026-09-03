import Link from "next/link";

export default async function CoMaSyLoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return (
    <main className="kg-state">
      <section className="kg-state-card" style={{ width: "min(600px, 100%)" }}>
        <Link href="/comasy" className="k-wordmark" style={{ textDecoration: "none", fontSize: 15 }}>Konfydence</Link>
        <p className="k-kicker" style={{ marginTop: 22 }}>Customer workspace</p>
        <h1>See who trained, what changed, and where risk remains.</h1>
        <p>Organisation administrators use this workspace to manage cohorts and campaigns, measure behaviour and export evidence.</p>
        {error ? <p className="kg-login-error" role="alert">We could not verify that organisation and access code.</p> : null}
        <form method="post" action="/api/comasy/auth/login" className="kc-form" style={{ boxShadow: "none", padding: 0, border: 0, background: "transparent" }}>
          <label>Organisation workspace<input name="slug" placeholder="acme-gmbh" autoComplete="organization" required /></label>
          <label>Access code<input name="accessCode" type="password" autoComplete="current-password" required minLength={6} /></label>
          <button className="k-button" type="submit">Open CoMaSy workspace</button>
        </form>
        <p style={{ fontSize: 11, color: "var(--k-soft)", margin: "16px 0 0" }}>
          Need access? Contact your CoMaSy administrator or the Konfydence account team.
        </p>
      </section>
      <style>{`.kg-login-error{background:#fbeee9;border:1px solid #ecccc4;color:#9f2f25;border-radius:12px;padding:12px 14px;font-size:13px;line-height:1.5;margin:0 0 8px}`}</style>
    </main>
  );
}
