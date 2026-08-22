import Link from "next/link";

export default async function CoMaSyLoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return (
    <main className="page">
      <section className="panel">
        <Link href="/comasy" className="brand">KONFYDENCE <span>/ CoMaSy</span></Link>
        <p className="eyebrow">CUSTOMER WORKSPACE</p>
        <h1>See who trained, what changed, and where risk remains.</h1>
        <p className="intro">Organisation administrators use this workspace to manage cohorts and campaigns, measure behaviour and export evidence.</p>
        {error ? <div className="error">We could not verify that organisation and access code.</div> : null}
        <form method="post" action="/api/comasy/auth/login">
          <label>Organisation workspace<input name="slug" placeholder="acme-gmbh" autoComplete="organization" required /></label>
          <label>Access code<input name="accessCode" type="password" autoComplete="current-password" required minLength={6} /></label>
          <button type="submit">Open CoMaSy workspace <span>→</span></button>
        </form>
        <p className="help">Need access? Contact your CoMaSy administrator or Konfydence account team.</p>
      </section>
      <style>{`
        :global(*){box-sizing:border-box}:global(body){margin:0;background:#071726}.page{min-height:100vh;display:grid;place-items:center;padding:28px;background:radial-gradient(circle at 82% 12%,#174c72 0,transparent 35%),#071726;color:#0a1a28;font-family:Inter,system-ui,sans-serif}.panel{width:min(610px,100%);background:#f7f5ef;border-radius:26px;padding:42px;box-shadow:0 30px 90px #0007}.brand{color:#071726;text-decoration:none;font-size:12px;font-weight:950;letter-spacing:.08em}.brand span{color:#e85349}.eyebrow{margin:46px 0 12px;color:#d64d43;font-size:10px;font-weight:950;letter-spacing:.14em}.panel h1{font:500 clamp(40px,7vw,64px)/.97 Georgia,serif;letter-spacing:-.05em;margin:0}.intro{color:#5f6e78;line-height:1.7;margin:22px 0 28px;max-width:520px}.error{background:#fff0ee;border:1px solid #f2b3ad;color:#8c2f28;border-radius:12px;padding:12px 14px;margin:0 0 18px;font-size:13px;font-weight:800}form{display:grid;gap:15px}label{display:grid;gap:7px;font-size:11px;font-weight:900;color:#30414d}input{width:100%;border:1px solid #cfd7d9;background:white;border-radius:12px;padding:14px 15px;font:inherit;outline:none}input:focus{border-color:#173e5d;box-shadow:0 0 0 3px #173e5d1a}button{border:0;border-radius:999px;background:#ff5b50;color:white;padding:15px 19px;font-weight:950;display:flex;justify-content:space-between;cursor:pointer;margin-top:4px}.help{font-size:11px;color:#76838a;margin:18px 0 0}@media(max-width:620px){.page{padding:12px}.panel{padding:28px 20px;border-radius:20px}.eyebrow{margin-top:34px}}
      `}</style>
    </main>
  );
}
