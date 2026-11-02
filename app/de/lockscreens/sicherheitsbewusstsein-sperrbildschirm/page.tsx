import type { Metadata } from "next";
import { LockscreenIntentPage } from "@/components/LockscreenIntentPage";

export const metadata: Metadata = {
  title: { absolute: "Sicherheitshinweise auf dem Sperrbildschirm | Konfydence Lockscreens" },
  description:
    "Ein verwalteter Sicherheitshinweis auf dem Sperrbildschirm: ein kurzer Hinweis zur Methode „Anhalten, Abklären, Ansprechen“ auf jedem Gerät, alle zwei Wochen aktualisiert. Für Arbeitsplatz, Schulen und Familien.",
  alternates: {
    canonical: "/de/lockscreens/sicherheitsbewusstsein-sperrbildschirm",
    languages: { en: "https://konfydence.com/lockscreens/security-awareness-lock-screens", de: "https://konfydence.com/de/lockscreens/sicherheitsbewusstsein-sperrbildschirm" },
  },
  openGraph: {
    title: "Sicherheitshinweise auf dem Sperrbildschirm | Konfydence",
    description: "Der Hinweis, den man wirklich sieht — alle zwei Wochen aktualisiert, statt einer Sammlung statischer Hintergrundbilder.",
    url: "https://konfydence.com/de/lockscreens/sicherheitsbewusstsein-sperrbildschirm",
    siteName: "Konfydence",
    type: "article",
  },
};

export default function Page() {
  return (
    <LockscreenIntentPage
      lang="de"
      slug="sicherheitsbewusstsein-sperrbildschirm"
      breadcrumbName="Sicherheitshinweise auf dem Sperrbildschirm"
      eyebrow="SICHERHEITSHINWEISE AUF SPERRBILDSCHIRMEN"
      title="Sicherheitshinweise dort anzeigen, wo Mitarbeitende täglich hinschauen."
      intro="Viele Hinweise zur IT-Sicherheit gehen im Arbeitsalltag schnell unter. Ein Sperrbildschirm bringt einen kurzen Hinweis — Anhalten, Abklären, Ansprechen — genau in dem Moment vor jemanden, in dem er zum Handy greift oder den Laptop aufweckt, in den Sekunden vor dem Klick, der Antwort oder der Zahlung. Konfydence schreibt die Hinweise, hält sie aktuell und liefert alle zwei Wochen einen neuen."
      primaryCtaHref="/de/lockscreens"
      primaryCtaLabel="So funktioniert es"
      heroImage={{
        src: "/lockscreens/workplace/notebook-16x10/30.png",
        alt: "Ein Konfydence-Sperrbildschirm mit dem Text „Bevor der Klick zum Vorfall wird… Anhalten · Abklären · Ansprechen.“",
      }}
      problemTitle="Sicherheitsbewusstsein verblasst zwischen den Schulungen. Druck wartet nicht auf das nächste Modul."
      problemCopy="Der riskante Moment ist nie eine Quizfrage. Es ist eine dringende Rechnung, eine SMS eines Paketdienstes, eine Nachricht eines Chefs, der komisch klingt. Ein Sperrbildschirm erscheint genau dort — auf dem Gerät, im Moment der Entscheidung — statt in einem Kurs, der vor Monaten abgeschlossen wurde."
      sections={[
        {
          title: "Ein Hinweis, keine Plakatwand",
          copy: "Jeder Hinweis vermittelt einen konkreten Gedanken: Welche Betrugsmasche steckt dahinter, und wie reagierst du richtig? Ohne unnötige Ablenkung.",
        },
        {
          title: "Alle zwei Wochen aktualisiert",
          copy: "Alle zwei Wochen kommt ein neuer Hinweis hinzu. So bleiben verschiedene Betrugsmaschen im Alltag präsent.",
        },
        {
          title: "Jedes Gerät, das richtige Format",
          copy: "Handy, Tablet, Notebook und Desktop erhalten jeweils ein passend zugeschnittenes Bild — ausgerollt über eure Geräteverwaltung oder zu Hause in unter einer Minute eingerichtet.",
        },
      ]}
      howTitle="Regelmäßig neue Sicherheitshinweise für eure Geräte."
      howCopy="Ihr verwaltet keine Dateibibliothek und müsst niemandem hinterherlaufen, der das Hintergrundbild aktualisieren soll. Konfydence stellt regelmäßig neue Motive bereit. Ihr richtet die Verteilung passend zu euren Geräten ein."
      howSteps={[
        "Wählt eure Stufe — Arbeitsplatz, Schulen oder Home — und erhaltet eine Lizenz.",
        "Rollt den aktuellen Screen aus: über Intune, Jamf oder Google Admin für eine Flotte, oder eine einminütige Einrichtung zu Hause.",
        "Alle zwei Wochen ersetzt ihn automatisch ein neuer Screen. Kein erneutes Ausrollen, keine Erinnerungsmails.",
        "Der Wortlaut verfolgt aktuelle Betrugsmuster und die Anhalten-Abklären-Ansprechen-Methode das ganze Jahr.",
      ]}
      orgValue={{
        title: "Sicherheitsbewusstsein im Alltag stärken.",
        copy: "Jährliches Training gibt euch ein Abschlussdatum. Geschäftsleitungen und Aufsichtsstellen erwarten zunehmend Belege dafür, dass Sicherheitsbewusstsein eine fortlaufende Aktivität ist, kein Ereignis einmal im Jahr. Ein Sperrbildschirm, der sich alle zwei Wochen ändert, ist eine kostengünstige, permanente Kontrolle — und der Admin behält ein Protokoll darüber, was wann lief.",
        points: [
          "Fortlaufende Cyber-Hygiene-Verstärkung — NIS2 (Artikel 21) erwartet kontinuierliche Sensibilisierung für IT-Sicherheit und eine Aufsicht durch die Leitungsorgane. Ein rotierender Hinweis ist sichtbare Aktivität zwischen den formalen Schulungen.",
          "Beitrag zum Human Risk Management — verschiebt Sicherheitsbewusstsein von einem Wissenstest zu einem regelmäßigen Denkanstoß im Moment der Entscheidung, genau der Punkt, den NIST- und ISO/IEC-27001-Kontrollen betonen.",
          "Ein leichtes Prüfprotokoll — die zuständige Verwaltungsperson erfasst die Screen-Sequenz und die Änderungsdaten, damit ihr für jeden Prüfzeitraum zeigen könnt, was den Mitarbeitenden gezeigt wurde.",
          "Erreicht die gesamte Belegschaft — Firmengeräte unter MDM erhalten denselben Hinweis nach demselben Zeitplan, Remote- und Frontline-Mitarbeitende eingeschlossen, ohne Abschlüsse nachzuverfolgen.",
        ],
        note: "Konfydence Lockscreens unterstützt die menschliche Seite eines Schulungsprogramms zur IT-Sicherheits. Es macht eine Organisation allein nicht NIS2-, ISO/IEC-27001- oder anderweitig konform — die umfassenderen rechtlichen, governance- und technischen Pflichten bleiben Aufgabe der Organisation.",
      }}
      faq={[
        {
          question: "Wie unterscheidet sich das von IT-Sicherheit-Postern?",
          answer:
            "Poster sind statisch und werden schnell unsichtbar. Ein Sperrbildschirm wird dutzende Male am Tag gesehen, ändert sich alle zwei Wochen und erreicht Remote- und mobile Mitarbeitende, die nie an einer Bürowand vorbeikommen.",
        },
        {
          question: "Ersetzt das IT-Sicherheit-Training?",
          answer:
            "Nein. Es füllt die Lücke zwischen den Schulungen — ein stetiger, aufwandsarmer Hinweis im Moment der Entscheidung. Es passt gut zu einem CoMaSy-Piloten, wenn ihr auch messen wollt, wie Menschen entscheiden.",
        },
        {
          question: "Wie erreicht es verwaltete Geräte?",
          answer:
            "Der aktuelle Screen wird über eine einzige stabile URL aufgelöst, sodass Microsoft Intune, Jamf Pro und die Google-Admin-Konsole ihre Sperrbildschirm- oder Hintergrundbild-Richtlinie darauf ausrichten und jede zweiwöchentliche Änderung automatisch übernehmen können.",
        },
        {
          question: "Was kostet es?",
          answer:
            "Arbeitsplatz kostet 4 € pro Mitarbeitendem pro Jahr (300 € Minimum). Schulen kosten 2 € pro verwaltetem Computer pro Jahr. Home kostet 19,99 € im ersten Jahr, danach 14,99 € pro Jahr. Details auf der Lockscreens-Seite.",
        },
      ]}
      calloutTitle="Bring den Hinweis dorthin, wo die Entscheidung passiert."
    />
  );
}
