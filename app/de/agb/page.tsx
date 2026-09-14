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
        <p style={s.update}>Stand: 14. September 2026 (spiegelt die englischen Terms of Service)</p>

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
            Verbraucherkäufe werden über Stripe abgewickelt. Die Challenge-Editionen, Konfydence Lockscreens (Home/Teen)
            und der Team-Zugang sind jährliche Abonnements mit automatischer Verlängerung, kündbar jederzeit zum Ende
            der laufenden Laufzeit über dein Konto oder per E-Mail an support@konfydence.com; ein Geschenkkauf ist eine
            einmalige Zahlung, die der beschenkten Person ein Jahr Zugang gewährt.
          </p>

          <h3 style={s.subheading}>4.1 Widerrufsrecht</h3>
          <p style={s.paragraph}>
            Verbraucherinnen und Verbrauchern (natürliche Personen, die den Vertrag zu einem Zweck abschließen, der
            überwiegend weder ihrer gewerblichen noch ihrer selbständigen beruflichen Tätigkeit zugerechnet werden
            kann) steht bei einem außerhalb von Geschäftsräumen oder im Fernabsatz geschlossenen Vertrag ein
            gesetzliches Widerrufsrecht zu.
          </p>
          <div style={s.infoBox}>
            <p style={{ ...s.paragraph, marginBottom: 8 }}><strong>Widerrufsbelehrung</strong></p>
            <p style={s.paragraph}>
              Du hast das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen. Die
              Widerrufsfrist beträgt vierzehn Tage ab dem Tag des Vertragsabschlusses.
            </p>
            <p style={s.paragraph}>
              Um dein Widerrufsrecht auszuüben, musst du uns (PlanetHike OÜ, Kontaktdaten siehe{" "}
              <Link href="/de/impressum" style={s.link}>Impressum</Link>, E-Mail: support@konfydence.com) mittels
              einer eindeutigen Erklärung (z. B. ein mit der Post versandter Brief oder eine E-Mail) über deinen
              Entschluss, diesen Vertrag zu widerrufen, informieren. Du kannst dafür das unten stehende
              Muster-Widerrufsformular verwenden, was jedoch nicht vorgeschrieben ist.
            </p>
            <p style={s.paragraph}>
              Zur Wahrung der Widerrufsfrist reicht es aus, dass du die Mitteilung über die Ausübung des
              Widerrufsrechts vor Ablauf der Widerrufsfrist absendest.
            </p>
            <p style={{ ...s.paragraph, marginBottom: 8 }}><strong>Folgen des Widerrufs</strong></p>
            <p style={s.paragraph}>
              Wenn du diesen Vertrag widerrufst, haben wir dir alle Zahlungen, die wir von dir erhalten haben,
              unverzüglich und spätestens binnen vierzehn Tagen ab dem Tag zurückzuzahlen, an dem die Mitteilung über
              deinen Widerruf bei uns eingegangen ist. Für diese Rückzahlung verwenden wir dasselbe Zahlungsmittel,
              das du bei der ursprünglichen Transaktion eingesetzt hast, es sei denn, mit dir wurde ausdrücklich etwas
              anderes vereinbart; in keinem Fall werden dir wegen dieser Rückzahlung Entgelte berechnet.
            </p>
            <p style={s.paragraph}>
              Hast du verlangt, dass die Dienstleistung während der Widerrufsfrist beginnen soll, oder digitale
              Inhalte, die nicht auf einem körperlichen Datenträger geliefert werden, sollen bereitgestellt werden, so
              hast du uns einen angemessenen Betrag zu zahlen, der dem Anteil der bis zu dem Zeitpunkt, zu dem du uns
              von der Ausübung des Widerrufsrechts hinsichtlich dieses Vertrags unterrichtest, bereits erbrachten
              Leistung im Vergleich zum Gesamtumfang der im Vertrag vorgesehenen Leistungen entspricht — soweit dein
              Widerrufsrecht nach Ziffer 4.2 nicht bereits vollständig erloschen ist.
            </p>
          </div>

          <h3 style={s.subheading}>4.2 Vorzeitiges Erlöschen bei digitalen Inhalten &amp; sofort erbrachten Leistungen</h3>
          <p style={s.paragraph}>
            Konfydence-Zugänge (Challenge-Editionen, Lockscreens, Team-Zugang) werden dir unmittelbar nach Zahlungs­
            eingang vollständig freigeschaltet — es handelt sich um digitale Inhalte, die nicht auf einem körperlichen
            Datenträger geliefert werden, bzw. um eine Dienstleistung, die vollständig erbracht wird. Dein
            Widerrufsrecht <strong>erlischt vorzeitig</strong>, sobald wir mit der Ausführung des Vertrags begonnen
            haben, wenn du
          </p>
          <ul style={s.list}>
            <li>ausdrücklich zugestimmt hast, dass wir mit der Ausführung des Vertrags vor Ablauf der Widerrufsfrist
              beginnen, und</li>
            <li>bestätigt hast, dass du dadurch mit vollständiger Vertragserfüllung dein Widerrufsrecht verlierst
              (bei digitalen Inhalten) bzw. bei vollständig erbrachter Dienstleistung dein Widerrufsrecht verlierst.</li>
          </ul>
          <p style={s.paragraph}>
            Diese Zustimmung holen wir im Bestellprozess vor Vertragsschluss über eine gesondert anzuklickende
            Checkbox ein, deren Wortlaut die vorstehenden beiden Erklärungen ausdrücklich enthält; deine Bestätigung
            wird zusammen mit der Bestellung dauerhaft gespeichert. Ohne dieses Häkchen kann die Bestellung nicht
            abgeschlossen werden. Solltest du diese Zustimmung ausnahmsweise nicht erteilt haben oder ist die
            Leistung noch nicht vollständig erbracht, gilt das 14-tägige Widerrufsrecht nach Ziffer 4.1 unverändert
            fort.
          </p>

          <h3 style={s.subheading}>4.3 Muster-Widerrufsformular</h3>
          <div style={s.infoBox}>
            <p style={{ ...s.paragraph, marginBottom: 8 }}>
              (Wenn du den Vertrag widerrufen willst, fülle bitte dieses Formular aus und sende es zurück.)
            </p>
            <p style={{ ...s.paragraph, marginBottom: 4 }}>An: PlanetHike OÜ, support@konfydence.com</p>
            <p style={{ ...s.paragraph, marginBottom: 4 }}>
              Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen Vertrag über den Kauf der
              folgenden Ware/Dienstleistung (*):
            </p>
            <p style={{ ...s.paragraph, marginBottom: 4 }}>Bestellt am (*)/erhalten am (*):</p>
            <p style={{ ...s.paragraph, marginBottom: 4 }}>Name des/der Verbraucher(s):</p>
            <p style={{ ...s.paragraph, marginBottom: 4 }}>Anschrift des/der Verbraucher(s):</p>
            <p style={{ ...s.paragraph, marginBottom: 4 }}>
              Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier):
            </p>
            <p style={{ ...s.paragraph, marginBottom: 0 }}>Datum:</p>
            <p style={{ ...s.paragraph, marginTop: 12, marginBottom: 0, fontSize: 12 }}>(*) Unzutreffendes streichen.</p>
          </div>

          <h3 style={s.subheading}>4.4 Rückerstattungen außerhalb des Widerrufsrechts</h3>
          <p style={s.paragraph}>
            Unabhängig vom gesetzlichen Widerrufsrecht prüfen wir jede Rückerstattungsanfrage individuell und
            kulant — schreib uns einfach an support@konfydence.com. Zwingende gesetzliche Gewährleistungsrechte
            (z. B. bei mangelhafter Leistung) bleiben davon unberührt.
          </p>
          <p style={{ ...s.paragraph, fontSize: 12, fontStyle: "italic" }}>
            Diese Widerrufsbelehrung orientiert sich an der Muster-Widerrufsbelehrung nach Anlage 1 zu Art. 246a §&nbsp;1
            Abs.&nbsp;2 Satz&nbsp;1 Nr.&nbsp;1 EGBGB und wird vor einer breiteren Vermarktung an deutsche
            Verbraucherinnen und Verbraucher noch anwaltlich geprüft.
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
