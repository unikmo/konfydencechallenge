import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAccount } from "@/lib/auth/session";
import { listPasskeys } from "@/lib/auth/webauthn";
import { AddPasskeyButton } from "@/components/account/PasskeyManager";

export const metadata: Metadata = {
  title: { absolute: "Security | Konfydence account" },
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function SecurityPage() {
  const account = await getAccount();
  if (!account) redirect("/account/sign-in?next=/account/security");

  const passkeys = await listPasskeys(account.id);

  return (
    <main className="kg-state">
      <section className="kg-state-card" style={{ textAlign: "left" }}>
        <Link className="kf-back" href="/account">← Your account</Link>
        <p className="k-kicker" style={{ marginTop: 18 }}>Security</p>
        <h1 style={{ fontSize: "clamp(26px,3.4vw,34px)" }}>Passkeys</h1>
        <p>
          A passkey signs you in with your device&rsquo;s screen lock or fingerprint — nothing to type, nothing to
          phish. Add one and it becomes the fast way back in.
        </p>

        {passkeys.length > 0 ? (
          <div className="kf-pk-list">
            {passkeys.map((p) => (
              <div key={p.id} className="kf-pk-row">
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>Passkey</div>
                  <div style={{ fontSize: 12, color: "var(--k-muted)", fontWeight: 600 }}>
                    Added {new Date(p.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
                    {p.lastUsedAt ? ` · last used ${new Date(p.lastUsedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}` : ""}
                  </div>
                </div>
                <form method="post" action={`/api/account/passkeys/${p.id}/delete`}>
                  <button type="submit" className="kf-link-button">Remove</button>
                </form>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ fontSize: 13, color: "var(--k-muted)" }}>No passkeys yet.</p>
        )}

        <div style={{ marginTop: 18 }}>
          <AddPasskeyButton />
        </div>
      </section>

      <style>{`
        .kf-back{color:var(--k-muted);font-size:13px;font-weight:600;text-decoration:none}
        .kf-back:hover{color:var(--k-gold)}
        .kf-pk-list{display:flex;flex-direction:column;gap:8px;margin:6px 0 0}
        .kf-pk-row{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:12px 14px;border:1px solid var(--k-line);border-radius:12px}
        .kf-link-button{background:none;border:none;padding:0;color:var(--k-muted);font:inherit;font-size:13px;font-weight:600;text-decoration:underline;cursor:pointer}
        .kf-link-button:hover{color:var(--k-gold)}
      `}</style>
    </main>
  );
}
