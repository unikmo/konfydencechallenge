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
import type { UiLang } from "@/lib/challenge/uiStrings";
import { TOTP_SETUP_STRINGS } from "@/lib/challenge/accountStrings";

export const metadata: Metadata = {
  title: { absolute: "Two-step verification | Konfydence" },
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function TotpSetupPage(props: { searchParams: Promise<{ done?: string; error?: string; lang?: string }> }) {
  const sp = await props.searchParams;
  const lang: UiLang = sp.lang === "de" ? "de" : "en";
  const t = TOTP_SETUP_STRINGS[lang];
  const account = await getAccount();
  if (!account) redirect(`/account/sign-in?next=/account/security/totp${lang === "de" ? "&lang=de" : ""}`);

  const row = await prisma.totpCredential.findUnique({ where: { accountId: account.id } });
  const store = await cookies();

  // Done: show the recovery codes once.
  if (sp.done && row?.confirmedAt) {
    const flash = store.get(TOTP_RECOVERY_FLASH_COOKIE)?.value;
    const codes = flash ? flash.split(",") : [];
    return (
      <Shell title={t.doneTitle} lang={lang}>
        {codes.length > 0 ? (
          <>
            <p>{t.doneSaveCodes}</p>
            <div className="kf-codes">{codes.map((c) => <code key={c}>{c}</code>)}</div>
          </>
        ) : (
          <p>{t.doneActiveOnly}</p>
        )}
        <Link className="k-button" href={`/account/security${lang === "de" ? "?lang=de" : ""}`}>{t.backToSecurity}</Link>
      </Shell>
    );
  }

  // Already on.
  if (row?.confirmedAt) {
    return (
      <Shell title={t.alreadyOnTitle} lang={lang}>
        <p>{t.alreadyOnBody}</p>
        <Link className="k-button" href={`/account/security${lang === "de" ? "?lang=de" : ""}`}>{t.backToSecurity}</Link>
      </Shell>
    );
  }

  // Mid-enrolment: show the QR + confirm form.
  if (row && !row.confirmedAt) {
    const secret = decryptSecret(row.secret);
    if (!secret) {
      return (
        <Shell title={t.brokenTitle} lang={lang}>
          <form method="post" action={`/api/account/totp/begin${lang === "de" ? "?lang=de" : ""}`}><button className="k-button" type="submit">{t.startAgain}</button></form>
        </Shell>
      );
    }
    const uri = new OTPAuth.TOTP({ issuer: "Konfydence", label: account.email, secret: OTPAuth.Secret.fromBase32(secret) }).toString();
    const qr = await QRCode.toDataURL(uri, { margin: 1, width: 200 });
    return (
      <Shell title={t.scanTitle} lang={lang}>
        <p>{t.cantScan} <code>{secret}</code></p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={qr} alt="TOTP setup QR code" width={200} height={200} style={{ borderRadius: 12, border: "1px solid var(--k-line)" }} />
        {sp.error ? <p className="kf-error" role="alert">{t.badCode}</p> : null}
        <form method="post" action={`/api/account/totp/confirm${lang === "de" ? "?lang=de" : ""}`} className="kf-form">
          <label htmlFor="code">{t.confirmLabel}</label>
          <input id="code" name="code" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9 ]*" maxLength={7} required placeholder="123456" className="kf-code-input" />
          <button type="submit" className="k-button">{t.confirm}</button>
        </form>
      </Shell>
    );
  }

  // Nothing yet: start.
  return (
    <Shell title={t.startTitle} lang={lang}>
      <p>{t.startBody}</p>
      <form method="post" action={`/api/account/totp/begin${lang === "de" ? "?lang=de" : ""}`}>
        <button type="submit" className="k-button">{t.setItUp}</button>
      </form>
    </Shell>
  );
}

function Shell({ title, lang, children }: { title: string; lang: UiLang; children: React.ReactNode }) {
  const t = TOTP_SETUP_STRINGS[lang];
  return (
    <main className="kg-state">
      <section className="kg-state-card" style={{ textAlign: "left" }}>
        <Link className="kf-back" href={`/account/security${lang === "de" ? "?lang=de" : ""}`}>{t.backSecurity}</Link>
        <p className="k-kicker" style={{ marginTop: 18 }}>{t.kicker}</p>
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
