import Link from "next/link";
import type { Metadata } from "next";
import { PremiumPageDe } from "@/components/PremiumSiteChrome";

export const metadata: Metadata = {
  title: { absolute: "Die H.A.C.K.- und P.A.T.-Methode | Konfydence" },
  description:
    "Zwei einfache Werkzeuge: H.A.C.K. (Hetze, Autorität, Vertrautheit, Notbremse) erkennt den Druck hinter einem Betrug, P.A.T. — Anhalten, Abklären, Ansprechen — sagt dir, was du dagegen tust.",
  alternates: {
    canonical: "/de/hack-method",
    languages: { en: "https://konfydence.com/hack-method", de: "https://konfydence.com/de/hack-method" },
  },
};

const patterns = [
  ["H", "Hetze", "Presst dir Zeit ab, bevor du unabhängig prüfen kannst — Fristen, „jetzt sofort“, ein Countdown, der tickt."],
  ["A", "Autorität", "Nutzt Status, Titel, Uniformen oder Amtsdeutsch, damit eine Bitte unhinterfragbar wirkt."],
  ["C", "Vertrautheit", "Nutzt Bekanntes, Routine oder Emotion, damit sich die Bitte sicherer anfühlt, als die Beweislage hergibt."],
  ["K", "Notbremse", "Drängt zur entscheidenden Handlung — Klick, Zahlung, Weitergabe, Freigabe, Antwort — und schneidet dir dabei die Zeit zum Prüfen ab."],
];

const pat = [
  ["Anhalten", "Stopp vor dem Klick, der Zahlung, dem Code oder der Antwort. Eile ist das Werkzeug des Betrugs — ein paar Sekunden nehmen es ihm.", "Nimm der Eile ihre Macht."],
  ["Abklären", "Frag dich, was hier eigentlich von dir verlangt wird: Geld, ein Code, ein Login, eine Freigabe. Wenn das die Antwort ist, ist es Druck — kein Beweis.", "Was will es wirklich?"],
  ["Ansprechen", "Sag die Bitte laut zu jemandem, dem du vertraust — Partner, Kollegin — oder ruf deine Bank unter der Nummer auf deiner Karte an. Nie die Nummer aus der Nachricht.", "Hol eine zweite Person dazu."],
];

export default function HackMethodPageDe() {
  return (
    <PremiumPageDe ctaHref="/de/challenge/family/start?mode=diagnostic" ctaLabel="Kostenlos testen">
      <section className="kg-shell k-section" style={{ borderTop: 0, paddingTop: 72, maxWidth: 820 }}>
        <p className="k-kicker">Die Methode</p>
        <h1 className="k-display">Erkenne den Druck. Dann: Anhalten, Abklären, Ansprechen.</h1>
        <p className="k-lede">
          Konfydence läuft auf zwei kleinen Werkzeugen. <strong>H.A.C.K.</strong> benennt, was ein Betrug mit dir macht.
          <strong> P.A.T.</strong> sagt dir, was du dagegen tust. Du übst beides, bis sich der Moment vertraut statt beängstigend anfühlt.
        </p>
        <div className="k-actions">
          <Link className="k-button" href="/de/challenge/family/start?mode=diagnostic">Kostenlosen Check machen</Link>
        </div>
      </section>

      <section className="kg-shell k-section">
        <div className="k-section-head">
          <div>
            <p className="k-kicker">H.A.C.K. — erkennen</p>
            <h2 className="k-display-sm">Die vier Druckmuster hinter fast jedem Betrug.</h2>
          </div>
          <p className="k-copy">
            Du musst nicht jeden Betrug erkennen. Du musst den Druck erkennen. Fast immer ist es eines dieser vier Muster.
          </p>
        </div>
        <div className="kg-scenario-grid kg-scenario-grid-4">
          {patterns.map(([letter, title, copy]) => (
            <article key={letter}>
              <span>{letter}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="k-section-dark">
        <div className="kg-shell">
          <div className="k-section-head">
            <div>
              <p className="k-kicker">P.A.T. — das tust du</p>
              <h2 className="k-display-sm">Anhalten. Abklären. Ansprechen.</h2>
            </div>
            <p className="k-copy">
              Dieselben drei Schritte funktionieren bei einer SMS, einem Anruf, einer E-Mail oder an der Haustür. Bewusst kurz gehalten, damit es auch unter Stress funktioniert.
            </p>
          </div>
          <div className="k-method-grid">
            {pat.map(([title, copy, heading]) => (
              <article key={title}>
                <small>{title}</small>
                <h3>{heading}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="kg-shell k-callout">
        <div>
          <p className="k-kicker">Wissen hilft. Üben verändert die nächste Entscheidung.</p>
          <h2 className="k-display-sm">Übe es in einem realistischen Szenario.</h2>
          <p className="k-copy">
            Konfydence baut diese Mechanik in Familie-, Schule-, Universitäts-, Arbeitsplatz- und TravelSafe-Szenarien ein. Auf jede Entscheidung folgen eine Erklärung und eine Regel, die du behältst.
          </p>
        </div>
        <div className="k-actions">
          <Link className="k-button" href="/de/challenge">Challenge wählen</Link>
        </div>
      </section>
    </PremiumPageDe>
  );
}
