import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getAccount } from "@/lib/auth/session";
import { claimSeatAction } from "./actions";

export const metadata: Metadata = {
  title: { absolute: "Join your team | Konfydence" },
  description: "Claim your Konfydence Challenge team seat.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type SP = { code?: string; err?: string };

const ERRORS: Record<string, string> = {
  not_found: "That invite link is not valid. Ask your admin for a fresh one.",
  inactive: "This team's subscription is not active right now. Ask your admin.",
  full: "This team has no open seats left. Ask your admin to add one.",
};

export default async function TeamJoinPage(props: { searchParams: Promise<SP> }) {
  const sp = await props.searchParams;
  const code = String(sp.code ?? "").trim().toUpperCase();
  const org = code ? await prisma.org.findUnique({ where: { inviteCode: code } }) : null;
  const account = await getAccount();

  if (org && account) {
    const seat = await prisma.orgSeat.findFirst({
      where: { orgId: org.id, accountId: account.id, status: "active" },
      select: { id: true },
    });
    if (seat && !sp.err) redirect("/teams");
  }

  const error = sp.err ? ERRORS[sp.err] ?? "Something went wrong claiming that seat." : null;

  return (
    <main className="kg-state">
      <section className="kg-state-card">
        <Link className="kf-back" href="/">← Konfydence</Link>
        <p className="k-kicker" style={{ marginTop: 22 }}>Team seat</p>

        {!org ? (
          <>
            <h1>This invite link isn&rsquo;t valid.</h1>
            <p>Ask whoever invited you to send a fresh link, or the 8-character code.</p>
            <Link className="k-button" href="/pricing">See Konfydence pricing</Link>
          </>
        ) : (
          <>
            <h1>Join {org.name} on Konfydence.</h1>
            <p>
              A team seat unlocks all five Challenge editions with unlimited rounds. Your answers and
              scores stay private to you — your admin sees which editions you&rsquo;ve completed, not
              how you answered.
            </p>
            {error ? <p className="kf-error" role="alert">{error}</p> : null}
            <form action={claimSeatAction} className="kf-form">
              <input type="hidden" name="code" value={code} />
              <button type="submit" className="k-button">
                {account ? "Claim my seat" : "Sign in and claim my seat"}
              </button>
            </form>
            {!account ? (
              <p className="kf-legal">You&rsquo;ll sign in with a one-time email code — no password.</p>
            ) : (
              <p className="kf-legal">Signing in as {account.email}.</p>
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
