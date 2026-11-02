import type { UiLang } from "@/lib/challenge/uiStrings";

const MONTHS = {
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  de: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
};

const COPY = {
  en: {
    heading: "First, a quick question.",
    body: "We ask when you were born so we can set this up in the right way. We do not store your date of birth.",
    month: "Month of birth",
    monthPlaceholder: "Month",
    year: "Year of birth",
    invalid: "Please enter a month and a year of birth.",
    submit: "Continue",
  },
  de: {
    heading: "Kurz vorab eine Frage.",
    body: "Wir fragen nach deinem Geburtsmonat und -jahr, um alles passend für dich einzurichten. Dein Geburtsdatum speichern wir nicht.",
    month: "Geburtsmonat",
    monthPlaceholder: "Monat",
    year: "Geburtsjahr",
    invalid: "Bitte gib Geburtsmonat und Geburtsjahr an.",
    submit: "Weiter",
  },
} as const;

/**
 * Neutral age screen (free entry of birth month and year, nothing pre-selected).
 * Posts to /api/challenge/age, which keeps only a coarse age band in a short-lived
 * cookie and sends the visitor on to `returnTo`.
 */
export function AgeScreen({
  lang = "en",
  next,
  returnTo,
  invalid = false,
}: {
  lang?: UiLang;
  next: string;
  returnTo: string;
  invalid?: boolean;
}) {
  const t = COPY[lang];
  return (
    <>
      <h1>{t.heading}</h1>
      <p>{t.body}</p>
      {invalid ? <p className="kg-reg-error" role="alert">{t.invalid}</p> : null}
      <form method="post" action="/api/challenge/age" className="kg-reg-form">
        <input type="hidden" name="next" value={next} />
        <input type="hidden" name="return" value={returnTo} />
        <input type="hidden" name="lang" value={lang} />
        <div className="kg-reg-row">
          <label htmlFor="month">{t.month}
            <select id="month" name="month" required defaultValue="">
              <option value="" disabled>{t.monthPlaceholder}</option>
              {MONTHS[lang].map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
            </select>
          </label>
          <label htmlFor="year">{t.year}
            <input id="year" name="year" type="text" inputMode="numeric" pattern="[0-9]{4}" maxLength={4} autoComplete="off" required placeholder={lang === "de" ? "JJJJ" : "YYYY"} />
          </label>
        </div>
        <button type="submit" className="k-button">{t.submit}</button>
      </form>
      <style>{`
        .kg-reg-error{padding:12px 14px;border-radius:12px;background:#fbeee9;color:#9f2f25;border:1px solid #ecccc4;font-size:13px;line-height:1.5}
        .kg-reg-form{display:grid;gap:12px}
        .kg-reg-form label{font-weight:650;color:var(--k-ink);font-size:13px}
        .kg-reg-row{display:grid;grid-template-columns:1.4fr 1fr;gap:12px}
        .kg-reg-row label{display:grid;gap:6px}
        .kg-reg-form input[type=text],.kg-reg-form select{width:100%;box-sizing:border-box;border:1px solid var(--k-line);border-radius:12px;padding:13px 14px;font:inherit;color:var(--k-ink);background:var(--k-paper)}
        .kg-reg-form input[type=text]:focus,.kg-reg-form select:focus{outline:2px solid var(--k-gold);outline-offset:1px}
        .kg-reg-form .k-button{margin-top:4px}
      `}</style>
    </>
  );
}
