import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getAccount } from "@/lib/auth/session";
import { decryptSecret } from "@/lib/auth/secretCrypto";
import { TOTP_RECOVERY_FLASH_COOKIE } from "@/lib/auth/totpFlash";
import * as OTPAuth from "otpauth";
import QRCode from "qrcode";

export const metadata: Metadata = {
  title: { absolute: "Two-step verification | Konfydence" },
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function TotpSetupPage(props: { searchParams: Promise<{ done?: string; error?: string }> }) {
  const account = await getAccount();
  if (!account) redirect("/account/sign-in?next=/account/security/totp");
  const sp = await props.searchParams;

  const row = await prisma.totpCredential.findUnique({ where: { accountId: account.id } });
  const store = await cookies();

  // Done: show the recovery codes once.
  if (sp.done && row?.confirmedAt) {
    const flash = store.get(TOTP_RECOVERY_FLASH_COOKIE)?.value;
    const codes = flash ? flash.split(",") : [];
    return (
      <Shell title="Two-step verification is on.">
        {codes.length > 0 ? (
          <>
            <p>Save these recovery codes somewhere safe. Each works once if you lose your authenticator. This is the only time they&rsquo;re shown.</p>
            <div className="kf-codes">{codes.map((c) => <code key={c}>{c}</code>)}</div>
          </>
        ) : (
          <p>Two-step verification is active on your account.</p>
        )}
        <Link className="k-button" href="/account/security">Back to security</Link>
      </Shell>
    );
  }

  // Already on.
  if (row?.confirmedAt) {
    return (
      <Shell title="Two-step verification is already on.">
        <p>You can turn it off from the security page.</p>
        <Link className="k-button" href="/account/security">Back to security</Link>
      </Shell>
    );
  }

  // Mid-enrolment: show the QR + confirm form.
  if (row && !row.confirmedAt) {
    const secret = decryptSecret(row.secret);
    if (!secret) {
      return (
        <Shell title="Something went wrong.">
          <form method="post" action="/api/account/totp/begin"><button className="k-button" type="submit">Start again</button></form>
        </Shell>
      );
    }
    const uri = new OTPAuth.TOTP({ issuer: "Konfydence", label: account.email, secret: OTPAuth.Secret.fromBase32(secret) }).toString();
    const qr = await QRCode.toDataURL(uri, { margin: 1, width: 200 });
    return (
      <Shell title="Scan this with your authenticator.">
        <p>Use Google Authenticator, 1Password, Authy or similar. Can&rsquo;t scan? Enter this key: <code>{secret}</code></p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={qr} alt="TOTP setup QR code" width={200} height={200} style={{ borderRadius: 12, border: "1px solid var(--k-line)" }} />
        {sp.error ? <p className="kf-error" role="alert">That code didn&rsquo;t match. Try the current one.</p> : null}
        <form method="post" action="/api/account/totp/confirm" className="kf-form">
          <label htmlFor="code">Enter the 6-digit code to confirm</label>
          <input id="code" name="code" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9 ]*" maxLength={7} required placeholder="123456" className="kf-code-input" />
          <button type="submit" className="k-button">Confirm</button>
        </form>
      </Shell>
    );
  }

  // Nothing yet: start.
  return (
    <Shell title="Add two-step verification.">
      <p>
        A time-based code from an authenticator app, asked for after your email code. It doesn&rsquo;t replace a
        passkey — if you have one, you already have strong sign-in.
      </p>
      <form method="post" action="/api/account/totp/begin">
        <button type="submit" className="k-button">Set it up</button>
      </form>
    </Shell>
  );
}

function Shell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <main className="kg-state">
      <section className="kg-state-card" style={{ textAlign: "left" }}>
        <Link className="kf-back" href="/account/security">← Security</Link>
        <p className="k-kicker" style={{ marginTop: 18 }}>Two-step verification</p>
        <h1 style={{ fontSize: "clamp(24px,3.2vw,32px)" }}>{title}</h1>
        {children}
      </section>
      <style>{`
        .kf-back{color:var(--k-muted);font-size:13px;font-weight:600;text-decoration:none}
        .kf-back:hover{color:var(--k-gold)}
        .kg-state-card p{margin:10px 0 16px}
        .kg-state-card code{background:var(--k-paper);border:1px solid var(--k-line);border-radius:6px;padding:2px 6px;font-size:12px}
        .kf-error{padding:12px 14px;border-radius:12px;background:#fbeee9;color:#9f2f25;border:1px solid #ecccc4;font-size:13px}
        .kf-form{display:grid;gap:12px;margin-top:14px}
        .kf-form label{font-weight:650;color:var(--k-ink);font-size:13px}
        .kf-code-input{width:100%;box-sizing:border-box;border:1px solid var(--k-line);border-radius:12px;padding:13px 14px;font:inherit;letter-spacing:.4em;font-size:18px;text-align:center;background:var(--k-paper)}
        .kf-code-input:focus{outline:2px solid var(--k-gold);outline-offset:1px}
        .kf-codes{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:0 0 18px}
        .kf-codes code{text-align:center;padding:8px;font-size:13px}
        .kg-state-card .k-button{margin-top:6px;text-decoration:none}
      `}</style>
    </main>
  );
}
