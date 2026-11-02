import type { Metadata } from "next";
import { LockscreenIntentPage } from "@/components/LockscreenIntentPage";

export const metadata: Metadata = {
  title: { absolute: "Auch zwischen den Schulungen für Phishing sensibilisieren | Konfydence Lockscreens" },
  description:
    "Jährliches Phishing-Training verblasst innerhalb weniger Wochen. Ein rotierender Sperrbildschirm hält jeden Tag einen Anhalten · Abklären · Ansprechen-Hinweis vor Mitarbeitenden, alle zwei Wochen aktualisiert.",
  alternates: {
    canonical: "/de/lockscreens/phishing-sensibilisierung-zwischen-schulungen",
    languages: { en: "https://konfydence.com/lockscreens/phishing-awareness-between-trainings", de: "https://konfydence.com/de/lockscreens/phishing-sensibilisierung-zwischen-schulungen" },
  },
  openGraph: {
    title: "Auch zwischen den Schulungen für Phishing sensibilisieren | Konfydence",
    description: "Regelmäßige Sicherheitshinweise für die Zeit zwischen den Schulungen.",
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
      title="Phishing erkennen – nicht nur direkt nach der Schulung."
      intro="Ihr führt regelmäßig Schulungen durch. Im Arbeitsalltag geraten die Inhalte jedoch leicht in Vergessenheit. Die Herausforderung liegt darin, Sicherheitsregeln auch zwischen den Schulungen präsent zu halten. Regelmäßig wechselnde Hinweise auf dem Sperrbildschirm setzen hier an: ein kurzer Hinweis auf jedem Gerät, jeden Tag, alle zwei Wochen aktualisiert."
      primaryCtaHref="/de/lockscreens#pricing"
      primaryCtaLabel="Sofort-Angebot erhalten"
      heroImage={{
        src: "/lockscreens/workplace/desktop/12.png",
        alt: "Ein Konfydence-Desktop-Sperrbildschirm mit dem Text „Passwort123 ist in Rente. Dein Klebezettel nicht. Passwörter gehören in den Tresor.“",
      }}
      problemTitle="Sicherheitsbewusstsein zerfällt entlang einer Kurve. Euer Programm ist ein einzelner Punkt darauf."
      problemCopy="Ein Kurs lehrt die Regel. Unter Druck — eine dringende Zahlung, ein gefälschter Lieferant, ein Chef, der es sofort braucht — erinnern sich Menschen nicht an eine Regel von vor Monaten. Sie brauchen den Hinweis nah am Moment, und sie brauchen ihn oft genug, damit Innehalten zum Reflex wird."
      sections={[
        {
          title: "Sicherheitshinweise im Alltag sichtbar machen",
          copy: "Kein neues Modul zuzuweisen, kein Abschluss nachzuverfolgen. Der Hinweis ist einfach auf dem Sperrbildschirm, gelesen in den zwei Sekunden vor dem Entsperren.",
        },
        {
          title: "Regelmäßig wechselnde Betrugsmaschen",
          copy: "Alle zwei Wochen ein neuer Hinweis zu aktuellen Betrugsmaschen — QR-Code-Phishing, Rückruf-Betrug, KI-Stimmen, Lieferantenwechsel-Betrug.",
        },
        {
          title: "Bei Bedarf messen",
          copy: "Kombiniert den Sperrbildschirm mit einem CoMaSy-Piloten, um zu sehen, ob die verstärkte Teilnehmergruppe definierte Entscheidungssignale — Innehalten, Überprüfung, Eskalation — bei unterschiedlichen Szenarien verändert.",
        },
      ]}
      howTitle="Verstärkung, die von selbst läuft."
      howCopy="Konfydence schreibt und rotiert die Hinweise. Euer Team rollt es einmal über die Geräteverwaltung aus und lässt es neben der Trainingsplattform laufen, die ihr bereits nutzt."
      howSteps={[
        "Kauft eine Arbeitsplatz-Lizenz — 4 € pro Mitarbeitendem pro Jahr, 300 € Minimum.",
        "Verteilt das aktuelle Motiv über Intune, Jamf oder Google Admin aus.",
        "Führt euer bestehendes jährliches Training und die Phishing-Simulationen weiter — das hier läuft darunter.",
        "Alle zwei Wochen passt sich der Hinweis an, was tatsächlich in den Postfächern ankommt.",
      ]}
      orgValue={{
        title: "Sicherheit auch zwischen den Schulungen präsent halten.",
        copy: "Regelmäßige Hinweise sollen an sicheres Verhalten erinnern – auch wenn die letzte Schulung schon länger zurückliegt. Wechselnde Sperrbildschirm-Hinweise können dafür sorgen, dass zentrale Sicherheitsregeln auch zwischen den Schulungen präsent bleiben.",
        points: [
          "Regelmäßige Sicherheitskommunikation — wechselnde Hinweise können das Bewusstsein für Betrugsversuche zwischen den Schulungen stärken. Welche Maßnahmen zur Erfüllung von NIS2 erforderlich sind, muss jede Organisation gesondert beurteilen.",
          "Erinnerung im Arbeitsalltag — die Hinweise greifen konkrete Betrugsmaschen auf und erinnern an das unabhängige Überprüfen verdächtiger Aufforderungen.",
          "Nachvollziehbare Aktualisierungen — die zuständige Person kann festhalten, welche Motive in welchem Zeitraum eingesetzt wurden.",
          "Mit CoMaSy kombinierbar — in einem Pilotprojekt könnt ihr zusätzlich untersuchen, wie Mitarbeitende in realistischen Übungssituationen entscheiden.",
        ],
        note: "Die Sperrbildschirm-Hinweise ergänzen bestehende Sicherheitsschulungen. Sie ersetzen weder technische Schutzmaßnahmen noch die organisatorischen Pflichten eines Unternehmens.",
      }}
      faq={[
        {
          question: "Ersetzt das unsere Phishing-Simulationsplattform?",
          answer:
            "Nein. Simulationen testen Menschen; dieser Dienst verstärkt sie zwischen den Tests. Beides funktioniert gut zusammen — der Sperrbildschirm hält die Gewohnheit warm, sodass sich Simulationsergebnisse über die Zeit verbessern.",
        },
        {
          question: "Was ist der Vorteil gegenüber einer monatlichen Sicherheitsmail?",
          answer:
            "Eine E-Mail kann im Posteingang untergehen. Ein Hinweis auf dem Sperrbildschirm ist beim täglichen Entsperren sichtbar – ersetzt aber keine ausführliche Schulung. Er erreicht auch Handys, wo inzwischen viel Phishing landet.",
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
      calloutTitle="Haltet wichtige Sicherheitsregeln auch zwischen den Schulungen präsent."
    />
  );
}
