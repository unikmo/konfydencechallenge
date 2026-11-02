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
  ["H", "Hetze", "Setzt dich unter Zeitdruck, damit du nicht in Ruhe nachprüfst — Fristen, „jetzt sofort“, ein Countdown, der tickt."],
  ["A", "Autorität", "Nutzt Status, Titel, Uniformen oder Amtsdeutsch, damit du eine Aufforderung nicht hinterfragst."],
  ["C", "Vertrautheit", "Nutzt Bekanntes, Routine oder Emotion, damit sich die Bitte sicherer anfühlt, als sie tatsächlich ist."],
  ["K", "Notbremse", "Drängt zur entscheidenden Handlung — Klick, Zahlung, Weitergabe, Freigabe, Antwort — und schneidet dir dabei die Zeit zum Prüfen ab."],
];

const pat = [
  ["Anhalten", "Stopp vor dem Klick, der Zahlung, dem Code oder der Antwort. Betrüger setzen gezielt auf Eile — ein paar Sekunden nehmen es ihm.", "Nimm der Eile ihre Macht."],
  ["Abklären", "Frag dich, was hier eigentlich von dir verlangt wird: Geld, ein Code, ein Login, eine Freigabe. Wenn das die Antwort ist, ist es Druck — kein Beweis.", "Was will es wirklich?"],
  ["Ansprechen", "Sag die Bitte laut zu jemandem, dem du vertraust — Partner, Kollegin — oder ruf deine Bank unter der Nummer auf deiner Karte an. Nie die Nummer aus der Nachricht.", "Hol eine zweite Person dazu."],
];

export default function HackMethodPageDe() {
  return (
    <PremiumPageDe ctaHref="/de/challenge/family/start?mode=diagnostic" ctaLabel="Kostenlos testen">
      <section className="kg-shell k-section" style={{ borderTop: 0, paddingTop: 72, maxWidth: 820 }}>
        <p className="k-kicker">Die Methode</p>
        <h1 className="k-display">Betrugsversuche erkennen. Erst prüfen, dann handeln.</h1>
        <p className="k-lede">
          Konfydence arbeitet mit zwei einfachen Methoden. <strong>H.A.C.K.</strong> benennt, was ein Betrug mit dir macht.
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
            <h2 className="k-display-sm">Vier Tricks, mit denen Betrüger Druck aufbauen.</h2>
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
          <p className="k-kicker">Wissen ist der Anfang. Mit Übung fällt richtiges Handeln leichter.</p>
          <h2 className="k-display-sm">Probiere die Methode in einer realistischen Situation aus.</h2>
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
