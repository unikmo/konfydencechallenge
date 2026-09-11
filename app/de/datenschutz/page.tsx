import Link from "next/link";
import type { Metadata } from "next";
import { legalStyles as s } from "@/lib/theme/legalPageStyles";

export const metadata: Metadata = {
  title: { absolute: "Datenschutz | Konfydence" },
  description: "Konfydence Datenschutzerklärung — wie wir deine Daten schützen.",
  alternates: { languages: { en: "https://konfydence.com/privacy-policy", de: "https://konfydence.com/de/datenschutz" } },
};

export default function DatenschutzPage() {
  return (
    <div style={s.container}>
      <div style={s.content}>
        <h1 style={s.title}>Datenschutzerklärung</h1>
        <p style={s.update}>Stand: 11. September 2026 (spiegelt die englische Datenschutzerklärung)</p>

        <div style={s.section}>
          <h2 style={s.heading}>1. Einleitung</h2>
          <p style={s.paragraph}>
            Konfydence wird betrieben von PlanetHike OÜ („wir“, „uns“). Diese Datenschutzerklärung erläutert, wie wir
            Informationen erheben, verwenden, weitergeben und schützen, wenn du konfydence.com besuchst und Konfydence-
            oder CoMaSy-Dienste nutzt.
          </p>
        </div>

        <div style={s.section}>
          <h2 style={s.heading}>2. Welche Informationen wir erheben</h2>
          <p style={s.paragraph}>Wir können folgende Informationen über dich erheben:</p>
          <ul style={s.list}>
            <li><strong>Direkt von dir bereitgestellte Angaben:</strong> Name, E-Mail-Adresse, Organisationsname und weitere Angaben aus Kontakt- oder Pilotanfrageformularen.</li>
            <li><strong>Anfragen kostenloser Ressourcen:</strong> E-Mail-Adresse, die gewählten Scam-Safety-Materialien, die Herkunftsseite und ob du separat gelegentliche Marketing-Mitteilungen angefordert hast.</li>
            <li><strong>CoMaSy-Pilotanfragen:</strong> Rolle, Organisationsgröße, Hauptziel, aktuelle Awareness-Plattform, Notizen, Einwilligung und Kampagnen-/Herkunftszuordnung, soweit angegeben.</li>
            <li><strong>Challenge- und Programmantworten:</strong> Antworten auf Challenge- oder Simulationsszenarien und daraus abgeleitete Trainingssignale, soweit der jeweilige Dienst dies erfordert.</li>
            <li><strong>Kaufinformationen:</strong> E-Mail-Adresse, Rechnungsdaten und Bestellinformationen, die von Stripe für Verbraucherkäufe verarbeitet werden.</li>
            <li><strong>Geräte- und Nutzungsinformationen:</strong> Technische Informationen wie IP-Adresse, Browsertyp und besuchte Seiten, soweit vom Dienst erhoben.</li>
            <li><strong>Cookies und Analyse:</strong> Analyse-Cookies unterliegen den Einwilligungsoptionen unserer Cookie-Richtlinie.</li>
          </ul>
        </div>

        <div style={s.section}>
          <h2 style={s.heading}>3. Wofür wir deine Daten verwenden</h2>
          <ul style={s.list}>
            <li>Bereitstellung und Verbesserung der Konfydence-Challenge- und CoMaSy-Dienste.</li>
            <li>Zusendung angeforderter kostenloser Scam-Safety-Materialien.</li>
            <li>Zusendung von Scam-Safety-Tipps oder Marketing-Mitteilungen nur bei separater Einwilligung.</li>
            <li>Beantwortung von Kontakt- und CoMaSy-Pilotanfragen.</li>
            <li>Einrichtung und Verwaltung vereinbarter Pilotprojekte oder Kundenprogramme.</li>
            <li>Abwicklung von Verbraucherkäufen, Rechnungen und Abonnements über Stripe.</li>
            <li>Konto-, Kauf-, Pilot- oder dienstbezogene Mitteilungen.</li>
            <li>Nutzungsanalyse bei erteilter Analyse-Einwilligung.</li>
            <li>Erfüllung gesetzlicher Pflichten und Schutz des Dienstes.</li>
          </ul>
        </div>

        <div style={s.section}>
          <h2 style={s.heading}>4. Rechtsgrundlage (DSGVO)</h2>
          <p style={s.paragraph}>
            Soweit die DSGVO anwendbar ist, richtet sich die Rechtsgrundlage nach dem jeweiligen Zweck und kann
            Einwilligung, Vertragserfüllung oder vorvertragliche Maßnahmen, gesetzliche Pflichten sowie — soweit
            angemessen — berechtigte Interessen umfassen. Die Anforderung eines kostenlosen Materials wird getrennt von
            einer optionalen Marketing-Einwilligung behandelt.
          </p>
        </div>

        <div style={s.section}>
          <h2 style={s.heading}>5. Speicherdauer</h2>
          <p style={s.paragraph}>
            Wir speichern personenbezogene Daten nur so lange, wie es für den jeweiligen Dienst, eine gesetzliche
            Pflicht oder ein vereinbartes Kundenprogramm erforderlich ist. Bestehende Verbraucherdatensätze können für
            Kundenservice- sowie gesetzliche Buchhaltungs-/Steuerzwecke aufbewahrt werden, soweit anwendbar.
          </p>
        </div>

        <div style={s.section}>
          <h2 style={s.heading}>6. Weitergabe deiner Daten</h2>
          <p style={s.paragraph}>
            Wir verkaufen keine personenbezogenen Daten. Wir können Informationen mit Dienstleistern teilen, die uns
            beim Betrieb der Website, dem Versand von Mitteilungen, dem Hosting von Anwendungsdaten, der Abwicklung von
            Verbraucherzahlungen, der Bereitstellung von Analysen nach Einwilligung oder der Erfüllung gesetzlicher
            Anforderungen unterstützen. Brevo kann E-Mail-Adressen und Zustelldaten für angeforderte Material-E-Mails
            und — bei separater Einwilligung — Marketing-Mitteilungen verarbeiten. Google Drive kann die von dir
            gewählten herunterladbaren Materialien hosten.
          </p>
        </div>

        <div style={s.section}>
          <h2 style={s.heading}>7. Deine Rechte</h2>
          <p style={s.paragraph}>
            Soweit anwendbar, hast du das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung
            oder Widerspruch, das Recht auf Datenübertragbarkeit sowie das Recht, eine erteilte Einwilligung zu
            widerrufen. Zur Ausübung eines Datenschutzrechts kontaktiere{" "}
            <strong>privacy@konfydence.com</strong>. Du hast außerdem das Recht, dich bei einer
            Datenschutz-Aufsichtsbehörde zu beschweren.
          </p>
        </div>

        <div style={s.section}>
          <h2 style={s.heading}>8. Cookies</h2>
          <p style={s.paragraph}>
            Siehe unsere <Link href="/cookie-policy" style={s.link}>Cookie-Richtlinie</Link> (derzeit nur auf Englisch)
            für Informationen zu Cookies und Analyse-Einwilligung.
          </p>
        </div>

        <div style={s.section}>
          <h2 style={s.heading}>9. Sicherheit</h2>
          <p style={s.paragraph}>
            Wir setzen dem Dienst angemessene technische und organisatorische Schutzmaßnahmen ein. Für die Übertragung
            oder Speicherung von Daten über das Internet kann keine absolute Sicherheit garantiert werden.
          </p>
        </div>

        <div style={s.section}>
          <h2 style={s.heading}>10. Änderungen dieser Erklärung</h2>
          <p style={s.paragraph}>
            Wir können diese Datenschutzerklärung von Zeit zu Zeit aktualisieren. Wesentliche Änderungen werden auf
            dieser Seite mit aktualisiertem Datum ausgewiesen.
          </p>
        </div>

        <div style={s.section}>
          <h2 style={s.heading}>11. Kontakt</h2>
          <p style={s.paragraph}>
            <strong>Verantwortlicher:</strong> PlanetHike OÜ
            <br />
            <strong>E-Mail:</strong> privacy@konfydence.com
            <br />
            <strong>Sitz:</strong> Järvevana tee 9, 11314 Tallinn, Estland
            <br />
            <strong>Registernummer:</strong> 80656111
            <br />
            Siehe das <Link href="/de/impressum" style={s.link}>Impressum</Link> für die aktuellen rechtlichen Angaben.
          </p>
        </div>

        <div style={{ ...s.paragraph, marginTop: 40, borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 20 }}>
          <Link href="/de/impressum" style={s.link}>Impressum</Link>
          <span style={{ margin: "0 12px", color: "inherit" }}>•</span>
          <Link href="/de/agb" style={s.link}>AGB</Link>
          <span style={{ margin: "0 12px", color: "inherit" }}>•</span>
          <Link href="/de" style={s.link}>← Zur Startseite</Link>
        </div>
      </div>
    </div>
  );
}
