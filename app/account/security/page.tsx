import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAccount } from "@/lib/auth/session";
import { listPasskeys } from "@/lib/auth/webauthn";
import { totpStatus } from "@/lib/auth/totp";
import { AddPasskeyButton } from "@/components/account/PasskeyManager";
import type { UiLang } from "@/lib/challenge/uiStrings";
import { SECURITY_STRINGS } from "@/lib/challenge/accountStrings";

export const metadata: Metadata = {
  title: { absolute: "Security | Konfydence account" },
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function SecurityPage(props: { searchParams: Promise<{ totp?: string; lang?: string }> }) {
  const account = await getAccount();
  const sp = await props.searchParams;
  const lang: UiLang = sp.lang === "de" ? "de" : "en";
  if (!account) redirect(`/account/sign-in?next=/account/security${lang === "de" ? "&lang=de" : ""}`);

  const t = SECURITY_STRINGS[lang];
  const passkeys = await listPasskeys(account.id);
  const totp = await totpStatus(account.id);

  return (
    <main className="kg-state">
      <section className="kg-state-card" style={{ textAlign: "left" }}>
        <Link className="kf-back" href={`/account${lang === "de" ? "?lang=de" : ""}`}>{t.backAccount}</Link>
        <p className="k-kicker" style={{ marginTop: 18 }}>{t.kicker}</p>
        <h1 style={{ fontSize: "clamp(26px,3.4vw,34px)" }}>{t.passkeysHeading}</h1>
        <p>{t.passkeysBody}</p>

        {passkeys.length > 0 ? (
          <div className="kf-pk-list">
            {passkeys.map((p) => (
              <div key={p.id} className="kf-pk-row">
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>{t.passkeyRowTitle}</div>
                  <div style={{ fontSize: 12, color: "var(--k-muted)", fontWeight: 600 }}>
                    {t.added(new Date(p.createdAt).toLocaleDateString(t.dateLocale, { year: "numeric", month: "short", day: "numeric" }))}
                    {p.lastUsedAt ? t.lastUsed(new Date(p.lastUsedAt).toLocaleDateString(t.dateLocale, { month: "short", day: "numeric" })) : ""}
                  </div>
                </div>
                <form method="post" action={`/api/account/passkeys/${p.id}/delete${lang === "de" ? "?lang=de" : ""}`}>
                  <button type="submit" className="kf-link-button">{t.remove}</button>
                </form>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ fontSize: 13, color: "var(--k-muted)" }}>{t.noPasskeys}</p>
        )}

        <div style={{ marginTop: 18 }}>
          <AddPasskeyButton lang={lang} />
        </div>

        <hr style={{ border: 0, borderTop: "1px solid var(--k-line)", margin: "28px 0 22px" }} />

        <h2 style={{ fontSize: 20, margin: "0 0 6px" }}>{t.totpHeading}</h2>
        <p style={{ margin: 0 }}>
          {t.totpBody}
          {passkeys.length > 0 ? t.totpBodyOptional : ""}
        </p>
        {sp.totp === "badcode" ? (
          <p className="kf-error" role="alert" style={{ marginTop: 10 }}>{t.totpBadCode}</p>
        ) : null}
        {totp.enabled ? (
          <div style={{ marginTop: 12 }}>
            <p style={{ margin: "0 0 10px", fontSize: 13, color: "var(--k-muted)" }}>
              {t.totpOnNote(totp.recoveryRemaining)}
            </p>
            <form method="post" action={`/api/account/totp/disable${lang === "de" ? "?lang=de" : ""}`} className="kf-pk-list">
              <label htmlFor="totp-off" style={{ fontSize: 13, fontWeight: 650 }}>{t.totpOffLabel}</label>
              <input id="totp-off" name="code" inputMode="text" autoComplete="one-time-code" required placeholder="123456" className="kf-off-input" />
              <button type="submit" className="kf-link-button" style={{ justifySelf: "start" }}>{t.totpOffButton}</button>
            </form>
          </div>
        ) : (
          <div style={{ marginTop: 12 }}>
            <Link className="k-button" href={`/account/security/totp${lang === "de" ? "?lang=de" : ""}`}>{t.totpOnButton}</Link>
          </div>
        )}
      </section>

      <style>{`
        .kf-back{color:var(--k-muted);font-size:13px;font-weight:600;text-decoration:none}
        .kf-back:hover{color:var(--k-gold)}
        .kf-pk-list{display:flex;flex-direction:column;gap:8px;margin:6px 0 0}
        .kf-pk-row{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:12px 14px;border:1px solid var(--k-line);border-radius:12px}
        .kf-link-button{background:none;border:none;padding:0;color:var(--k-muted);font:inherit;font-size:13px;font-weight:600;text-decoration:underline;cursor:pointer}
        .kf-link-button:hover{color:var(--k-gold)}
        .kf-error{padding:12px 14px;border-radius:12px;background:#fbeee9;color:#9f2f25;border:1px solid #ecccc4;font-size:13px;line-height:1.5}
        .kf-off-input{width:100%;box-sizing:border-box;border:1px solid var(--k-line);border-radius:12px;padding:11px 13px;font:inherit;background:var(--k-paper)}
        .kf-off-input:focus{outline:2px solid var(--k-gold);outline-offset:1px}
        .k-button{text-decoration:none}
      `}</style>
    </main>
  );
}
