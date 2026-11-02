import Link from "next/link";
import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { legalStyles as s } from "@/lib/theme/legalPageStyles";
import { tokens } from "@/lib/theme/tokens";

export const metadata: Metadata = {
  title: { absolute: "Cookie-Richtlinie | Konfydence" },
  description: "Welche Cookies Konfydence verwendet, wofür sie gebraucht werden und wie du sie steuern kannst.",
  alternates: {
    canonical: "/de/cookie-richtlinie",
    languages: { en: "https://konfydence.com/cookie-policy", de: "https://konfydence.com/de/cookie-richtlinie" },
  },
};

const td: CSSProperties = { padding: "10px", borderBottom: "1px solid rgba(255,255,255,0.1)", textAlign: "left" };
const th: CSSProperties = { ...td, fontWeight: 800, backgroundColor: "rgba(255,255,255,0.04)" };
const table: CSSProperties = { width: "100%", borderCollapse: "collapse", marginBottom: 20, fontSize: 13 };

const cookies = [
  ["kf_uid", "Kennung, die einen Kauf deinem Zugang zuordnet", "1 Jahr", "Notwendig"],
  ["kf_age_band", "Grobe Altersstufe aus der Altersabfrage bei der Anmeldung für weitere kostenlose Runden", "24 Stunden", "Notwendig"],
  ["cookie-consent", "Merkt sich deine Cookie-Auswahl", "1 Jahr", "Notwendig"],
  ["analytics-consent", "Merkt sich, ob du der Analyse zugestimmt hast", "1 Jahr", "Notwendig"],
  ["_ga", "Google Analytics (nur mit deiner Einwilligung)", "2 Jahre", "Analyse"],
  ["_gid", "Google-Analytics-Sitzungskennung (nur mit deiner Einwilligung)", "24 Stunden", "Analyse"],
];

export default function CookieRichtliniePage() {
  return (
    <div style={s.container}>
      <div style={s.content}>
        <h1 style={s.title}>Cookie-Richtlinie</h1>
        <p style={s.update}>Stand: 2. November 2026 (entspricht der englischen Cookie Policy)</p>

        <div style={s.section}>
          <h2 style={s.heading}>1. Was sind Cookies?</h2>
          <p style={s.paragraph}>
            Cookies sind kleine Textdateien, die beim Besuch unserer Website auf deinem Gerät gespeichert werden. Sie helfen
            uns, deine Einstellungen zu merken und zu verstehen, wie die Seite genutzt wird. Manche Cookies bleiben
            gespeichert, bis du sie löschst, andere verschwinden, sobald du den Browser schließt.
          </p>
        </div>

        <div style={s.section}>
          <h2 style={s.heading}>2. Welche Arten von Cookies wir verwenden</h2>

          <h3 style={s.subheading}>Notwendige Cookies (immer aktiv)</h3>
          <p style={s.paragraph}>Diese Cookies braucht die Website, damit sie richtig funktioniert. Sie sorgen zum Beispiel für:</p>
          <ul style={s.list}>
            <li>Anmeldung (Login-Sitzungen)</li>
            <li>Sicherheit (Schutz vor CSRF-Angriffen)</li>
            <li>deine Cookie-Auswahl</li>
            <li>kf_uid (Kennung, die einen Kauf deinem Zugang zuordnet)</li>
            <li>kf_age_band (eine grobe Altersstufe, 24 Stunden gespeichert, damit die Altersabfrage bei der Anmeldung nicht mit der Zurück-Taste noch einmal beantwortet werden kann; dein Geburtsdatum wird nicht gespeichert)</li>
          </ul>

          <h3 style={s.subheading}>Analyse-Cookies (nur mit Einwilligung)</h3>
          <p style={s.paragraph}>Diese Cookies zeigen uns, wie die Website genutzt wird. Sie erfassen:</p>
          <ul style={s.list}>
            <li>besuchte Seiten</li>
            <li>Verweildauer pro Seite</li>
            <li>Klicks und Interaktionen</li>
            <li>Gerätetyp und Browser</li>
          </ul>

          <h3 style={s.subheading}>Marketing-Cookies (nur mit Einwilligung)</h3>
          <p style={s.paragraph}>
            Diese Cookies verfolgen dein Verhalten über mehrere Websites hinweg, um gezielte Werbung anzuzeigen. Du kannst sie
            im Cookie-Banner ablehnen.
          </p>
        </div>

        <div style={s.section}>
          <h2 style={s.heading}>3. Cookies auf unserer Website</h2>
          <table style={table}>
            <thead>
              <tr>
                <th style={th}>Name</th>
                <th style={th}>Zweck</th>
                <th style={th}>Dauer</th>
                <th style={th}>Art</th>
              </tr>
            </thead>
            <tbody>
              {cookies.map(([name, purpose, duration, kind]) => (
                <tr key={name}>
                  <td style={td}><strong>{name}</strong></td>
                  <td style={td}>{purpose}</td>
                  <td style={td}>{duration}</td>
                  <td style={td}>{kind}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={s.section}>
          <h2 style={s.heading}>4. Cookies von Drittanbietern</h2>
          <p style={s.paragraph}>Auf unserer Website können Cookies von Dritten gesetzt werden, zum Beispiel von:</p>
          <ul style={s.list}>
            <li><strong>Stripe:</strong> für Zahlungsabwicklung, Rechnungen und die Verwaltung von Abonnements</li>
            <li><strong>Google Analytics:</strong> für die Analyse des Website-Verkehrs (nur mit deiner Einwilligung)</li>
          </ul>
          <p style={s.paragraph}>
            Für diese Anbieter gelten ihre eigenen Datenschutzerklärungen. Für den Umgang mit Cookies auf ihrer Seite sind sie selbst verantwortlich.
          </p>
        </div>

        <div style={s.section}>
          <h2 style={s.heading}>5. So steuerst du deine Cookie-Auswahl</h2>
          <p style={s.paragraph}><strong>Cookie-Banner:</strong> Beim ersten Besuch fragt dich ein Banner nach deiner Einwilligung. Du kannst:</p>
          <ul style={s.list}>
            <li><strong>Alle akzeptieren:</strong> alle Cookies zulassen (notwendige, Analyse- und Marketing-Cookies)</li>
            <li><strong>Alle ablehnen:</strong> nur notwendige Cookies werden verwendet</li>
          </ul>
          <p style={s.paragraph}><strong>Browser-Einstellungen:</strong> Cookies lassen sich auch im Browser verwalten:</p>
          <ul style={s.list}>
            <li>Chrome: Einstellungen → Datenschutz und Sicherheit → Cookies und andere Websitedaten</li>
            <li>Firefox: Einstellungen → Datenschutz &amp; Sicherheit → Cookies und Website-Daten</li>
            <li>Safari: Einstellungen → Datenschutz → Cookies und Website-Daten</li>
            <li>Edge: Einstellungen → Datenschutz, Suche und Dienste → Browserdaten löschen</li>
          </ul>
          <p style={s.paragraph}><strong>Hinweis:</strong> Wenn du Cookies deaktivierst, funktionieren einzelne Teile der Website unter Umständen nicht mehr.</p>
        </div>

        <div style={s.section}>
          <h2 style={s.heading}>6. „Do Not Track“ (DNT)</h2>
          <p style={s.paragraph}>
            Manche Browser bieten die Funktion „Do Not Track“. Einen branchenweiten Standard dafür, wie dieses Signal zu
            behandeln ist, gibt es bisher nicht. Wir richten uns nach deiner Auswahl im Cookie-Banner, unabhängig von der DNT-Einstellung.
          </p>
        </div>

        <div style={s.section}>
          <h2 style={s.heading}>7. Datenschutz-Grundverordnung (DSGVO)</h2>
          <p style={s.paragraph}>Für Besucherinnen und Besucher aus der EU gilt bei Cookies:</p>
          <ul style={s.list}>
            <li>Nicht notwendige Cookies setzen wir nur mit deiner ausdrücklichen Einwilligung.</li>
            <li>Im Cookie-Banner kannst du alle Cookies annehmen oder ablehnen.</li>
            <li>Du kannst deine Auswahl jederzeit ändern.</li>
            <li>Wir erklären für jedes Cookie, wofür es gebraucht wird.</li>
          </ul>
        </div>

        <div style={s.section}>
          <h2 style={s.heading}>8. Änderungen dieser Richtlinie</h2>
          <p style={s.paragraph}>
            Wir passen diese Cookie-Richtlinie an, wenn sich unser Vorgehen ändert oder aus betrieblichen, rechtlichen oder
            regulatorischen Gründen. Das Datum oben zeigt, wann sie zuletzt geändert wurde.
          </p>
        </div>

        <div style={s.section}>
          <h2 style={s.heading}>9. Kontakt</h2>
          <p style={s.paragraph}>
            Fragen zu unserem Umgang mit Cookies beantwortet dir <strong>privacy@konfydence.com</strong>.
          </p>
        </div>

        <div style={{ ...s.paragraph, marginTop: 40, borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 20 }}>
          <Link href="/de/datenschutz" style={s.link}>Datenschutzerklärung</Link>
          <span style={{ margin: "0 12px", color: tokens.textMuted }}>•</span>
          <Link href="/de" style={s.link}>Zurück zur Startseite</Link>
        </div>
      </div>
    </div>
  );
}
