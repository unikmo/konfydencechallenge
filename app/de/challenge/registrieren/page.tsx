import Link from "next/link";
import { cookies } from "next/headers";
import { AGE_BAND_COOKIE, isAgeBand } from "@/lib/challenge/ageGate";
import { AgeScreen } from "@/components/challenge/AgeScreen";

export const metadata = {
  title: { absolute: "Noch eine kostenlose Runde | Konfydence" },
  alternates: { languages: { en: "https://konfydence.com/challenge/register", de: "https://konfydence.com/de/challenge/registrieren" } },
};

export default async function RegistrierenPage(
  props: {
    searchParams?: Promise<{ next?: string; error?: string; ageError?: string }>;
  }
) {
  const searchParams = await props.searchParams;
  const next = searchParams?.next?.startsWith("/") && !searchParams.next.startsWith("//") ? searchParams.next : "/de/challenge";
  const error = searchParams?.error;
  const cookieStore = await cookies();
  const stored = cookieStore.get(AGE_BAND_COOKIE)?.value;
  const band = isAgeBand(stored) ? stored : null;

  return (
    <main className="kg-state">
      <section className="kg-state-card">
        <Link className="kg-reg-back" href="/de/challenge">← Zurück zu den Challenges</Link>

        {band === null ? (
          <>
            <p className="k-kicker" style={{ marginTop: 22 }}>Noch eine kostenlose Runde</p>
            <AgeScreen lang="de" next={next} returnTo={`/de/challenge/registrieren?next=${encodeURIComponent(next)}`} invalid={searchParams?.ageError === "1"} />
          </>
        ) : band === "under13" ? (
          <>
            <p className="k-kicker" style={{ marginTop: 22 }}>Kostenlos üben</p>
            <h1>Mit einer E-Mail-Adresse geht das hier leider nicht.</h1>
            <p>
              Du kannst weiter ohne Konto kostenlos üben. Wenn du mehr machen möchtest, bitte ein Elternteil, eine
              erziehungsberechtigte Person oder deine Lehrkraft um Hilfe.
            </p>
            <Link className="k-button" href="/de/challenge">Zurück zu den Challenges</Link>
          </>
        ) : (
          <>
            <p className="k-kicker" style={{ marginTop: 22 }}>Noch eine kostenlose Runde</p>
            <h1>Übe weiter, ohne deinen Fortschritt zu verlieren.</h1>
            <p>
              {band === "13to15"
                ? "Damit du noch einen kostenlosen Bereitschaftscheck freischalten kannst, muss ein Elternteil oder eine erziehungsberechtigte Person die eigene E-Mail-Adresse eintragen. Den Link zu deinem Fortschritt schicken wir dorthin."
                : "Trag deine E-Mail-Adresse ein, um noch einen kostenlosen Bereitschaftscheck freizuschalten. Kostenlos sind zwei Runden; die volle Challenge kannst du jederzeit starten."}
            </p>
            {error === "already-used" ? (
              <p className="kg-reg-error" role="alert">
                Diese E-Mail-Adresse gehört schon zu einem anderen Spieler. Nutze die Adresse von diesem Gerät oder starte die volle Challenge.
              </p>
            ) : null}
            {error === "age" ? (
              <p className="kg-reg-error" role="alert">Bitte beantworte die Fragen, um fortzufahren.</p>
            ) : null}
            <form method="post" action="/api/challenge/register" className="kg-reg-form">
              <input type="hidden" name="next" value={next} />
              <input type="hidden" name="lang" value="de" />
              <label htmlFor="email">{band === "13to15" ? "E-Mail-Adresse des Elternteils oder der erziehungsberechtigten Person" : "E-Mail-Adresse"}</label>
              <input id="email" name="email" type="email" autoComplete="email" required placeholder={band === "13to15" ? "eltern@beispiel.de" : "du@beispiel.de"} />
              {band === "13to15" ? (
                <label className="kg-reg-consent">
                  <input type="checkbox" name="parent" value="yes" required />
                  <span>Ich bin Elternteil bzw. erziehungsberechtigt und bin damit einverstanden, dass diese E-Mail-Adresse für den Link zum Fortschritt verwendet wird.</span>
                </label>
              ) : null}
              <label className="kg-reg-consent">
                <input type="checkbox" name="consent" value="yes" required />
                <span>Schickt den Link zum Fortschritt an diese Adresse. Sie wird für nichts anderes verwendet.</span>
              </label>
              <button type="submit" className="k-button">Nächste kostenlose Runde freischalten</button>
            </form>
          </>
        )}

        <p className="kg-reg-legal">
          Wir fragen nach Geburtsmonat und -jahr, um alles passend einzurichten. Wir speichern die Angabe nicht; sie beruht auf
          deiner eigenen Auskunft und ist keine Altersprüfung. Mehr dazu in den <Link href="/de/datenschutz#kinder">Hinweisen zum Datenschutz von Kindern</Link>,
          in der <Link href="/de/datenschutz">Datenschutzerklärung</Link> und in den <Link href="/de/agb">AGB</Link>.
        </p>
      </section>

      <style>{`
        .kg-reg-back{color:var(--k-muted);font-size:13px;font-weight:600;text-decoration:none}
        .kg-reg-back:hover{color:var(--k-gold)}
        .kg-reg-error{padding:12px 14px;border-radius:12px;background:#fbeee9;color:#9f2f25;border:1px solid #ecccc4;font-size:13px;line-height:1.5}
        .kg-reg-form{display:grid;gap:12px}
        .kg-reg-form label{font-weight:650;color:var(--k-ink);font-size:13px}
        .kg-reg-form input[type=email]{width:100%;box-sizing:border-box;border:1px solid var(--k-line);border-radius:12px;padding:13px 14px;font:inherit;color:var(--k-ink);background:var(--k-paper)}
        .kg-reg-form input[type=email]:focus{outline:2px solid var(--k-gold);outline-offset:1px}
        .kg-reg-consent{display:flex;align-items:flex-start;gap:9px;margin:4px 0;color:var(--k-muted);font-size:12px;line-height:1.5;font-weight:400}
        .kg-reg-consent input{margin-top:3px;accent-color:var(--k-gold)}
        .kg-reg-form .k-button{margin-top:4px}
        .kg-reg-legal{font-size:12px;color:var(--k-soft);line-height:1.6;margin:18px 0 0}
        .kg-reg-legal a{color:var(--k-ink);font-weight:600}
      `}</style>
    </main>
  );
}
