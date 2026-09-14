import type { Metadata } from "next";
import { LockscreenIntentPage } from "@/components/LockscreenIntentPage";

export const metadata: Metadata = {
  title: { absolute: "Phishing-Bewusstsein zwischen den Schulungen aufrechterhalten | Konfydence Lockscreens" },
  description:
    "Jährliches Phishing-Training verblasst innerhalb weniger Wochen. Ein rotierender Sperrbildschirm hält jeden Tag einen Anhalten · Abklären · Ansprechen-Hinweis vor Mitarbeitenden, alle zwei Wochen aktualisiert.",
  alternates: {
    canonical: "/de/lockscreens/phishing-sensibilisierung-zwischen-schulungen",
    languages: { en: "https://konfydence.com/lockscreens/phishing-awareness-between-trainings", de: "https://konfydence.com/de/lockscreens/phishing-sensibilisierung-zwischen-schulungen" },
  },
  openGraph: {
    title: "Phishing-Bewusstsein zwischen den Schulungen aufrechterhalten | Konfydence",
    description: "Der stetige Hinweis, der die Monate zwischen den Trainingsmodulen füllt.",
    url: "https://konfydence.com/de/lockscreens/phishing-sensibilisierung-zwischen-schulungen",
    siteName: "Konfydence",
    type: "article",
  },
};

export default function Page() {
  return (
    <LockscreenIntentPage
      lang="de"
      slug="phishing-sensibilisierung-zwischen-schulungen"
      breadcrumbName="Phishing-Sensibilisierung zwischen Schulungen"
      eyebrow="ZWISCHEN DEN SCHULUNGEN"
      title="Phishing-Bewusstsein, das nicht bis März verfliegt."
      intro="Ihr führt das jährliche Modul durch. Die Abschlussquote liegt bei 95%. Sechs Wochen später ist die Erinnerung weg, und der nächste simulierte Phishing-Versuch erwischt immer noch Leute. Die Lücke ist nicht das Training — es sind die elf Monate danach, in denen nichts die Gewohnheit verstärkt. Ein rotierender Sperrbildschirm sitzt genau in dieser Lücke: ein kurzer Hinweis auf jedem Gerät, jeden Tag, alle zwei Wochen aktualisiert."
      primaryCtaHref="/de/lockscreens#pricing"
      primaryCtaLabel="Sofort-Angebot erhalten"
      heroImage={{
        src: "/lockscreens/workplace/desktop/12.png",
        alt: "Ein Konfydence-Desktop-Sperrbildschirm mit dem Text „Passwort123 ist in Rente. Dein Klebezettel nicht. Passwörter gehören in den Tresor.“",
      }}
      problemTitle="Awareness zerfällt entlang einer Kurve. Euer Programm ist ein einzelner Punkt darauf."
      problemCopy="Ein Kurs lehrt die Regel. Unter Druck — eine dringende Zahlung, ein gefälschter Lieferant, ein Chef, der es sofort braucht — erinnern sich Menschen nicht an eine Regel von vor Monaten. Sie brauchen den Hinweis nah am Moment, und sie brauchen ihn oft genug, damit Innehalten zum Reflex wird."
      sections={[
        {
          title: "Tägliche Sichtbarkeit, geringer Aufwand",
          copy: "Kein neues Modul zuzuweisen, kein Abschluss nachzuverfolgen. Der Hinweis ist einfach auf dem Sperrbildschirm, gelesen in den zwei Sekunden vor dem Entsperren.",
        },
        {
          title: "Verfolgt aktuelle Taktiken",
          copy: "Alle zwei Wochen ein neuer Screen, geschrieben um die Druckmuster, die gerade auftauchen — QR-Code-Phishing, Rückruf-Betrug, KI-Stimmen, Lieferantenwechsel-Betrug.",
        },
        {
          title: "Bei Bedarf messen",
          copy: "Kombiniert den Sperrbildschirm mit einem CoMaSy-Piloten, um zu sehen, ob die verstärkte Kohorte definierte Entscheidungssignale — Innehalten, Verifizierung, Eskalation — bei unterschiedlichen Szenarien verändert.",
        },
      ]}
      howTitle="Verstärkung, die von selbst läuft."
      howCopy="Konfydence schreibt und rotiert die Hinweise. Euer Team rollt es einmal über die Geräteverwaltung aus und lässt es neben der Trainingsplattform laufen, die ihr bereits nutzt."
      howSteps={[
        "Kauft eine Arbeitsplatz-Lizenz — 4 € pro Mitarbeitendem pro Jahr, 300 € Minimum.",
        "Rollt den aktuellen Screen über Intune, Jamf oder Google Admin aus.",
        "Führt euer bestehendes jährliches Training und die Phishing-Simulationen weiter — das hier läuft darunter.",
        "Alle zwei Wochen passt sich der Hinweis an, was tatsächlich in den Postfächern ankommt.",
      ]}
      orgValue={{
        title: "Kontinuierliche Awareness, kein Test-und-vergessen.",
        copy: "Der Sinn, die Lücke zwischen den Schulungen zu füllen, ist, Awareness zu einer fortlaufenden Kontrolle zu machen statt zu einem jährlichen Abschlussdatum. Ein Hinweis, der sich alle zwei Wochen ändert, auf jedem Gerät, ist sichtbare Aktivität das ganze Jahr über.",
        points: [
          "Fortlaufende Cyber-Hygiene-Verstärkung — NIS2 (Artikel 21) erwartet kontinuierliche Awareness und eine Aufsicht durch die Leitungsorgane. Ein rotierender Hinweis ist sichtbare Aktivität zwischen den formalen Schulungen.",
          "Beitrag zum Human Risk Management — verschiebt Awareness von einem Wissenstest zu einem Gewohnheits-Cue im Moment der Entscheidung, genau der Punkt, den NIST- und ISO/IEC-27001-Kontrollen betonen.",
          "Ein leichtes Prüfprotokoll — der Arbeitsplatz-Admin erfasst die Screen-Sequenz und die Änderungsdaten, damit ihr für jeden Prüfzeitraum zeigen könnt, was den Mitarbeitenden gezeigt wurde.",
          "Kombiniert sich mit Messung — führt einen begrenzten CoMaSy-Piloten daneben durch, für definierte Verhaltenssignale — Innehalten, Verifizierung, Eskalation — statt Abschlussquoten.",
        ],
        note: "Konfydence Lockscreens unterstützt die menschliche Seite eines Awareness-Programms. Es macht eine Organisation allein nicht NIS2-, ISO/IEC-27001- oder anderweitig konform — die umfassenderen rechtlichen, governance- und technischen Pflichten bleiben Aufgabe der Organisation.",
      }}
      faq={[
        {
          question: "Ersetzt das unsere Phishing-Simulationsplattform?",
          answer:
            "Nein. Simulationen testen Menschen; dieser Dienst verstärkt sie zwischen den Tests. Beides funktioniert gut zusammen — der Sperrbildschirm hält die Gewohnheit warm, sodass sich Simulationsergebnisse über die Zeit verbessern.",
        },
        {
          question: "Wie ist das besser als eine monatliche Awareness-E-Mail?",
          answer:
            "Eine E-Mail wird einmal geöffnet, wenn überhaupt. Ein Sperrbildschirm wird dutzende Male am Tag gesehen und kann nicht in einem ungelesenen Ordner liegen bleiben. Er erreicht auch Handys, wo inzwischen viel Phishing landet.",
        },
        {
          question: "Welche Belege gibt es dafür, dass ein Sperrbildschirm-Hinweis Verhalten ändert?",
          answer:
            "Konfydence behauptet keine Ergebniszahlen, die es nicht belegen kann. Was es bietet, ist Häufigkeit im Moment der Entscheidung. Für gemessene Verhaltenssignale läuft ein begrenzter CoMaSy-Pilot daneben.",
        },
        {
          question: "Wie schnell können wir starten?",
          answer:
            "Die Arbeitsplatz-Bestellung ist selbstbedient — ihr erhaltet sofort eine Lizenz, eine Bestellnummer und eine Auslieferungs-URL, dann setzt ihr die Richtlinie in eurem MDM.",
        },
      ]}
      calloutTitle="Füllt die elf Monate, die euer Training nicht abdeckt."
    />
  );
}
