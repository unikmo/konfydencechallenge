import Link from "next/link";
import type { Metadata } from "next";
import { getAccount } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: { absolute: "Your account | Konfydence" },
  description: "Your Konfydence account — Challenge results and Lockscreens subscriptions in one place.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const account = await getAccount();

  if (!account) {
    return (
      <main className="kg-state">
        <section className="kg-state-card">
          <Link className="kf-back" href="/">← Konfydence</Link>
          <p className="k-kicker" style={{ marginTop: 22 }}>Your account</p>
          <h1>One account for everything Konfydence.</h1>
          <p>
            Your Challenge results on any device, and your Lockscreens subscription in the same place. Sign in
            with a one-time email code — no password.
          </p>
          <Link className="k-button" href="/account/sign-in">Sign in</Link>
        </section>
        <style>{`.kf-back{color:var(--k-muted);font-size:13px;font-weight:600;text-decoration:none}.kf-back:hover{color:var(--k-gold)}`}</style>
      </main>
    );
  }

  return (
    <main className="kg-state">
      <section className="kg-state-card" style={{ textAlign: "left" }}>
        <div className="kf-acct-head">
          <Link className="kf-back" href="/">← Konfydence</Link>
          <form action="/api/account/sign-out" method="post">
            <button type="submit" className="kf-link-button">Sign out</button>
          </form>
        </div>

        <p className="k-kicker" style={{ marginTop: 18 }}>Your account</p>
        <h1 style={{ fontSize: "clamp(26px,3.4vw,36px)" }}>{account.email}</h1>
        <p>
          {account.emailVerifiedAt
            ? "Email verified. "
            : "Email not verified yet — use the link in a sign-in email to verify. "}
          Your Challenge results and Lockscreens subscriptions will appear here.
        </p>

        <div className="kf-acct-links">
          <Link href="/challenge">Take a Challenge →</Link>
          <Link href="/lockscreens">Konfydence Lockscreens →</Link>
        </div>
      </section>

      <style>{`
        .kf-back{color:var(--k-muted);font-size:13px;font-weight:600;text-decoration:none}
        .kf-back:hover{color:var(--k-gold)}
        .kf-acct-head{display:flex;justify-content:space-between;align-items:center}
        .kf-link-button{background:none;border:none;padding:0;color:var(--k-muted);font:inherit;font-size:13px;font-weight:600;text-decoration:underline;cursor:pointer}
        .kf-link-button:hover{color:var(--k-gold)}
        .kf-acct-links{display:grid;gap:10px;margin-top:8px}
        .kf-acct-links a{color:var(--k-ink);font-weight:600;font-size:14px;text-decoration:none;padding:14px 16px;border:1px solid var(--k-line);border-radius:12px}
        .kf-acct-links a:hover{border-color:var(--k-gold)}
      `}</style>
    </main>
  );
}
