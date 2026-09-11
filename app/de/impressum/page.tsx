import Link from "next/link";
import type { Metadata } from "next";
import { legalStyles as s } from "@/lib/theme/legalPageStyles";

export const metadata: Metadata = {
  title: { absolute: "Impressum | Konfydence" },
  description: "Konfydence Impressum — Angaben gemäß § 5 TMG / Anbieterkennzeichnung.",
  alternates: { languages: { en: "https://konfydence.com/imprint", de: "https://konfydence.com/de/impressum" } },
};

export default function ImpressumPage() {
  return (
    <div style={s.container}>
      <div style={s.content}>
        <h1 style={s.title}>Impressum</h1>

        <div style={s.section}>
          <h2 style={s.heading}>1. Angaben zum Anbieter</h2>
          <div style={s.infoBox}>
            <p style={s.paragraph}>
              <strong>Unternehmen:</strong> PlanetHike OÜ
              <br />
              <strong>Produkt:</strong> Konfydence Challenge
              <br />
              <strong>Sitz:</strong> Järvevana tee 9, 11314 Tallinn, Estland
              <br />
              <strong>Registernummer:</strong> 80656111
              <br />
              <strong>Gesetzlicher Vertreter / Gründer:</strong> Tichi Mbanwie
              <br />
              <strong>E-Mail:</strong>{" "}
              <a href="mailto:hello@planethike.org" style={s.link}>hello@planethike.org</a>
              <br />
              <strong>Telefon:</strong> +49 (0)1634668380
              <br />
              <strong>Inhaltlich verantwortlich:</strong> Tichi Mbanwie
            </p>
          </div>
          <p style={s.paragraph}>
            PlanetHike OÜ ist eine in Estland eingetragene Gesellschaft (osaühing, vergleichbar einer GmbH). Es handelt
            sich nicht um eine deutsche Gesellschaft — die Angaben oben erfüllen die Anbieterkennzeichnung nach § 5 TMG
            für ein in der EU niedergelassenes Unternehmen.
          </p>
        </div>

        <div style={s.section}>
          <h2 style={s.heading}>2. Angaben zum Dienst</h2>
          <p style={s.paragraph}>
            Konfydence Challenge ist ein pädagogisches Spiel zum Aufbau von Betrugs-Bewusstsein und
            Entscheidungssicherheit. Der Dienst bietet interaktives, szenariobasiertes Training mit einer
            Readiness-Score-Bewertung und optionalem kostenpflichtigem Zugang; Zahlungen werden über Stripe abgewickelt.
          </p>
        </div>

        <div style={s.section}>
          <h2 style={s.heading}>3. Haftung für externe Links</h2>
          <p style={s.paragraph}>
            Diese Website kann Links zu externen, von Dritten betriebenen Websites enthalten. Wir haben diese Links zum
            Zeitpunkt der Verlinkung sorgfältig geprüft. Auf die aktuelle und zukünftige Gestaltung sowie auf die
            Inhalte der verlinkten Seiten hat PlanetHike OÜ jedoch keinen Einfluss. Für die Inhalte externer Links ist
            stets der jeweilige Anbieter verantwortlich.
          </p>
          <p style={s.paragraph}>
            PlanetHike OÜ distanziert sich ausdrücklich von allen Inhalten verlinkter Seiten, die nach der Linksetzung
            verändert wurden. Der Zugriff auf externe Links erfolgt auf eigenes Risiko.
          </p>
        </div>

        <div style={s.section}>
          <h2 style={s.heading}>4. Urheberrecht</h2>
          <p style={s.paragraph}>
            Sofern nicht anders angegeben, sind sämtliche auf dieser Website veröffentlichten Inhalte — Texte,
            Grafiken, Bilder, Logos, Designs, Audio, Video, Software, das Konzept „Konfydence Readiness Score“ sowie
            die zugrunde liegende Technologie — geistiges Eigentum von PlanetHike OÜ oder ihrer Lizenzgeber und
            weltweit urheber-, marken- und immaterialgüterrechtlich geschützt.
          </p>
          <p style={s.paragraph}>
            Stockbilder, Schriften und andere Materialien Dritter sind von den jeweiligen Anbietern lizenziert und
            bleiben deren geistiges Eigentum. Eine unbefugte Nutzung oder Vervielfältigung ist untersagt.
          </p>
          <p style={s.paragraph}>
            Jede Nutzung der Original-Inhalte von Konfydence über die persönliche, nicht kommerzielle Ansicht und die
            Teilnahme an den Challenges hinaus — insbesondere Vervielfältigung, Verbreitung, Bearbeitung, öffentliche
            Wiedergabe oder kommerzielle Verwertung — bedarf der vorherigen ausdrücklichen schriftlichen Zustimmung von
            PlanetHike OÜ. Anfragen bitte an{" "}
            <a href="mailto:hello@planethike.org" style={s.link}>hello@planethike.org</a>.
          </p>
        </div>

        <div style={s.section}>
          <h2 style={s.heading}>5. Haftungsausschluss</h2>
          <p style={s.paragraph}>
            <strong>Inhalte:</strong> Die auf dieser Website bereitgestellten Informationen und Challenges dienen
            ausschließlich allgemeinen Informations- und Bildungszwecken und stellen keine Rechts-, Sicherheits- oder
            sonstige Fachberatung dar. PlanetHike OÜ übernimmt keine Gewähr für Vollständigkeit, Richtigkeit oder
            Eignung der Website oder der angebotenen Challenges.
          </p>
          <p style={s.paragraph}>
            <strong>Nur zu Bildungszwecken:</strong> Konfydence Challenge dient dem Aufbau von Bewusstsein für
            Betrugsdruckmuster. Es handelt sich nicht um eine Garantie für Schutz vor Betrug, Cybervorfällen oder
            finanziellen Verlusten.
          </p>
          <p style={s.paragraph}>
            <strong>Nutzung auf eigenes Risiko:</strong> Jegliches Vertrauen in Informationen dieser Website erfolgt auf
            eigenes Risiko. PlanetHike OÜ haftet nicht für Aktualität, Richtigkeit, Vollständigkeit oder Qualität der
            bereitgestellten Informationen oder Challenges.
          </p>
        </div>

        <div style={s.section}>
          <h2 style={s.heading}>6. Streitbeilegung</h2>
          <p style={s.paragraph}>
            Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{" "}
            <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" style={s.link}>
              ec.europa.eu/consumers/odr
            </a>
            . Wir sind zur Teilnahme an einem Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle weder
            verpflichtet noch bereit.
          </p>
        </div>

        <div style={{ ...s.paragraph, marginTop: 40, borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 20 }}>
          <Link href="/de/datenschutz" style={s.link}>Datenschutz</Link>
          <span style={{ margin: "0 12px", color: "inherit" }}>•</span>
          <Link href="/de/agb" style={s.link}>AGB</Link>
          <span style={{ margin: "0 12px", color: "inherit" }}>•</span>
          <Link href="/de" style={s.link}>← Zur Startseite</Link>
        </div>
      </div>
    </div>
  );
}
