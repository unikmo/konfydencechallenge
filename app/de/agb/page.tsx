import Link from "next/link";
import type { Metadata } from "next";
import { legalStyles as s } from "@/lib/theme/legalPageStyles";

export const metadata: Metadata = {
  title: { absolute: "AGB | Konfydence" },
  description: "Konfydence Allgemeine Geschäftsbedingungen für Verbraucher.",
  alternates: { languages: { en: "https://konfydence.com/terms-of-service", de: "https://konfydence.com/de/agb" } },
};

export default function AgbPage() {
  return (
    <div style={s.container}>
      <div style={s.content}>
        <h1 style={s.title}>Allgemeine Geschäftsbedingungen</h1>
        <p style={s.update}>Stand: 11. September 2026 (spiegelt die englischen Terms of Service)</p>

        <div style={s.section}>
          <h2 style={s.heading}>1. Geltungsbereich</h2>
          <p style={s.paragraph}>
            Mit dem Zugriff auf die Website und die Verbraucherdienste von Konfydence stimmst du diesen Allgemeinen
            Geschäftsbedingungen zu. Konfydence wird betrieben von PlanetHike OÜ. Bist du nicht einverstanden, nutze den
            Dienst bitte nicht.
          </p>
        </div>

        <div style={s.section}>
          <h2 style={s.heading}>2. Nutzungsrecht für Verbraucher</h2>
          <p style={s.paragraph}>
            Sofern keine gesonderte schriftliche Vereinbarung gilt, räumt dir Konfydence ein beschränktes,
            nicht-exklusives, widerrufliches Recht ein, auf die Verbraucher-Challenge-Inhalte zuzugreifen und sie für
            persönliche und Bildungszwecke zu nutzen. Eine Weitergabe, Vervielfältigung, Bearbeitung, Weiterverbreitung
            oder kommerzielle Nutzung der Inhalte ohne schriftliche Zustimmung ist nicht gestattet.
          </p>
        </div>

        <div style={s.section}>
          <h2 style={s.heading}>3. Challenges &amp; Bewertung</h2>
          <p style={s.paragraph}>
            <strong>Bildungszweck:</strong> Konfydence Challenges dienen dem Aufbau von Bewusstsein für Betrugs- und
            Sicherheitsentscheidungen. Sie garantieren keinen Schutz vor Betrug, Cybervorfällen oder finanziellen
            Verlusten.
          </p>
          <p style={s.paragraph}>
            <strong>Bewertungen:</strong> Readiness-Scores und andere Trainingssignale basieren auf den Antworten der
            Teilnehmenden und dienen dem pädagogischen Feedback im Rahmen der jeweiligen Methodik.
          </p>
        </div>

        <div style={s.section}>
          <h2 style={s.heading}>4. Käufe, Abonnements &amp; Widerrufsrecht</h2>
          <p style={s.paragraph}>
            Verbraucherkäufe werden über Stripe abgewickelt. Die Challenge-Editionen und der Team-Zugang sind
            jährliche Abonnements; ein Geschenkkauf ist eine einmalige Zahlung, die der beschenkten Person ein Jahr
            Zugang gewährt.
          </p>
          <p style={s.paragraph}>
            <strong>Wichtiger Hinweis zum Widerrufsrecht bei digitalen Inhalten:</strong> Nach EU-Verbraucherrecht steht
            dir bei einem Fernabsatzvertrag über digitale Inhalte grundsätzlich ein 14-tägiges Widerrufsrecht zu — es
            sei denn, du hast der sofortigen Bereitstellung ausdrücklich zugestimmt und dabei bestätigt, dass du dein
            Widerrufsrecht damit verlierst. Der Zugang zu deiner Challenge wird sofort nach dem Kauf freigeschaltet.
            Möchtest du dennoch innerhalb von 14 Tagen widerrufen, wende dich an support@konfydence.com — wir prüfen
            jede Anfrage individuell und kulant.
          </p>
        </div>

        <div style={s.section}>
          <h2 style={s.heading}>5. Gewährleistungsausschluss</h2>
          <p style={s.paragraph}>
            Die Website und die Dienste werden, soweit gesetzlich zulässig, „wie besehen“ und „wie verfügbar“
            bereitgestellt. Konfydence garantiert nicht, dass Inhalte, Bewertungen oder die Verfügbarkeit des Dienstes
            fehlerfrei sind oder für jeden Einsatzzweck geeignet sind.
          </p>
        </div>

        <div style={s.section}>
          <h2 style={s.heading}>6. Haftungsbeschränkung</h2>
          <p style={s.paragraph}>
            Soweit gesetzlich zulässig, haften PlanetHike OÜ und Konfydence nicht für mittelbare oder Folgeschäden aus
            der Nutzung des öffentlichen Verbraucherdienstes. Die gesetzliche Haftung für Vorsatz, grobe Fahrlässigkeit
            sowie Schäden aus der Verletzung von Leben, Körper oder Gesundheit bleibt unberührt.
          </p>
        </div>

        <div style={s.section}>
          <h2 style={s.heading}>7. Zulässige Nutzung</h2>
          <p style={s.paragraph}>Du verpflichtest dich, die Website oder Dienste nicht zu nutzen, um:</p>
          <ul style={s.list}>
            <li>geltendes Recht zu verletzen;</li>
            <li>andere zu belästigen, zu missbrauchen oder zu bedrohen;</li>
            <li>Schadsoftware oder schädlichen Code zu verbreiten;</li>
            <li>den Betrieb des Dienstes zu stören;</li>
            <li>dir unbefugten Zugriff zu verschaffen;</li>
            <li>Rechte am geistigen Eigentum oder der Privatsphäre zu verletzen.</li>
          </ul>
        </div>

        <div style={s.section}>
          <h2 style={s.heading}>8. Geistiges Eigentum</h2>
          <p style={s.paragraph}>
            Sofern nicht anders angegeben, sind Inhalte, Designs, Challenge-Materialien, Bewertungskonzepte und
            Software von Konfydence Eigentum von PlanetHike OÜ oder ihrer Lizenzgeber und durch geltendes
            Immaterialgüterrecht geschützt.
          </p>
        </div>

        <div style={s.section}>
          <h2 style={s.heading}>9. Drittanbieter-Dienste</h2>
          <p style={s.paragraph}>
            Der Dienst kann Drittanbieter für Hosting, Kommunikation, Analyse, Zahlungen oder andere Funktionen
            einsetzen. Diese Anbieter haben eigene Nutzungsbedingungen und Datenschutzerklärungen.
          </p>
        </div>

        <div style={s.section}>
          <h2 style={s.heading}>10. Datenschutz</h2>
          <p style={s.paragraph}>
            Die Nutzung der Website unterliegt außerdem unserer{" "}
            <Link href="/de/datenschutz" style={s.link}>Datenschutzerklärung</Link> und unserer{" "}
            <Link href="/cookie-policy" style={s.link}>Cookie-Richtlinie</Link> (derzeit nur auf Englisch).
          </p>
        </div>

        <div style={s.section}>
          <h2 style={s.heading}>11. Änderungen und Kündigung</h2>
          <p style={s.paragraph}>
            Wir können diese Bedingungen aktualisieren und den Zugang einschränken oder beenden, soweit dies zum Schutz
            des Dienstes, zur Durchsetzung dieser Bedingungen oder zur Erfüllung gesetzlicher Pflichten erforderlich
            ist. Wesentliche Änderungen werden auf dieser Seite ausgewiesen.
          </p>
        </div>

        <div style={s.section}>
          <h2 style={s.heading}>12. Anwendbares Recht und Gerichtsstand</h2>
          <p style={s.paragraph}>
            Das auf einen Verbrauchervertrag anwendbare Recht und der Gerichtsstand richten sich nach zwingendem Recht
            und den jeweiligen Umständen. Verbraucher aus der EU können sich unabhängig davon stets auf die
            zwingenden Verbraucherschutzvorschriften ihres Wohnsitzstaates berufen.
          </p>
        </div>

        <div style={s.section}>
          <h2 style={s.heading}>13. Kontakt</h2>
          <p style={s.paragraph}>
            <strong>Betreiber:</strong> PlanetHike OÜ
            <br />
            <strong>E-Mail:</strong> support@konfydence.com
            <br />
            Siehe das <Link href="/de/impressum" style={s.link}>Impressum</Link> für Firmen- und Kontaktangaben.
          </p>
        </div>

        <div style={{ ...s.paragraph, marginTop: 40, borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 20 }}>
          <Link href="/de/datenschutz" style={s.link}>Datenschutz</Link>
          <span style={{ margin: "0 12px", color: "inherit" }}>•</span>
          <Link href="/de/impressum" style={s.link}>Impressum</Link>
          <span style={{ margin: "0 12px", color: "inherit" }}>•</span>
          <Link href="/de" style={s.link}>← Zur Startseite</Link>
        </div>
      </div>
    </div>
  );
}
