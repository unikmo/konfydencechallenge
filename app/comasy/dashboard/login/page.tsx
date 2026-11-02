import Link from "next/link";
import { cookies } from "next/headers";
import { LANG_COOKIE, resolveDashLang } from "@/lib/comasyDashboardStrings";
import { LangRemember } from "../LangRemember";

const LOGIN = {
  en: {
    home: "/comasy",
    kicker: "Customer workspace",
    h1: "See who trained, what changed, and where risk remains.",
    lede: "Organisation administrators use this workspace to manage cohorts and campaigns, measure behaviour and export evidence.",
    error: "We could not verify that organisation and access code.",
    slug: "Organisation workspace",
    slugPlaceholder: "acme-gmbh",
    code: "Access code",
    submit: "Open CoMaSy workspace",
    help: "Need access? Contact your CoMaSy administrator or the Konfydence account team.",
    other: "Deutsch",
    otherHref: "/comasy/dashboard/login?lang=de",
  },
  de: {
    home: "/de/comasy",
    kicker: "Kundenbereich",
    h1: "Sehen, wer trainiert hat, was sich verändert hat und wo das Risiko bleibt.",
    lede: "Administratorinnen und Administratoren der Organisation verwalten hier Kohorten und Kampagnen, werten Verhalten aus und exportieren Nachweise.",
    error: "Wir konnten diese Organisation und diesen Zugangscode nicht bestätigen.",
    slug: "Arbeitsbereich der Organisation",
    slugPlaceholder: "musterschule-gmbh",
    code: "Zugangscode",
    submit: "CoMaSy-Arbeitsbereich öffnen",
    help: "Ihr braucht einen Zugang? Wendet euch an die CoMaSy-Administration eurer Organisation oder an das Konfydence-Team.",
    other: "English",
    otherHref: "/comasy/dashboard/login?lang=en",
  },
} as const;

export default async function CoMaSyLoginPage({ searchParams }: { searchParams: Promise<{ error?: string; lang?: string }> }) {
  const { error, lang: rawLang } = await searchParams;
  const lang = resolveDashLang(rawLang, (await cookies()).get(LANG_COOKIE)?.value);
  const t = LOGIN[lang];
  return (
    <main className="kg-state">
      <section className="kg-state-card" style={{ width: "min(600px, 100%)" }}>
        <LangRemember lang={lang} />
        <Link href={t.home} className="k-wordmark" style={{ textDecoration: "none", fontSize: 15 }}>Konfydence</Link>
        <p className="k-kicker" style={{ marginTop: 22 }}>{t.kicker}</p>
        <h1>{t.h1}</h1>
        <p>{t.lede}</p>
        {error ? <p className="kg-login-error" role="alert">{t.error}</p> : null}
        <form method="post" action="/api/comasy/auth/login" className="kc-form" style={{ boxShadow: "none", padding: 0, border: 0, background: "transparent" }}>
          <input type="hidden" name="lang" value={lang} />
          <label>{t.slug}<input name="slug" placeholder={t.slugPlaceholder} autoComplete="organization" required /></label>
          <label>{t.code}<input name="accessCode" type="password" autoComplete="current-password" required minLength={6} /></label>
          <button className="k-button" type="submit">{t.submit}</button>
        </form>
        <p style={{ fontSize: 11, color: "var(--k-soft)", margin: "16px 0 0" }}>
          {t.help} · <Link href={t.otherHref} hrefLang={lang === "de" ? "en" : "de"}>{t.other}</Link>
        </p>
      </section>
      <style>{`.kg-login-error{background:#fbeee9;border:1px solid #ecccc4;color:#9f2f25;border-radius:12px;padding:12px 14px;font-size:13px;line-height:1.5;margin:0 0 8px}`}</style>
    </main>
  );
}
