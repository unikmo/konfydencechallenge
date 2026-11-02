import type { Metadata } from "next";
import { LockscreenIntentPage } from "@/components/LockscreenIntentPage";

export const metadata: Metadata = {
  title: { absolute: "Digitale Sicherheitshinweise statt gedruckter Plakate | Konfydence Lockscreens" },
  description:
    "Sicherheitsplakate veralten an der Wand und erreichen Beschäftigte im Homeoffice nicht. Ein regelmäßig wechselnder Sperrbildschirm bringt einen Anhalten · Abklären · Ansprechen-Hinweis auf jedes Gerät und aktualisiert ihn alle zwei Wochen.",
  alternates: {
    canonical: "/de/lockscreens/sicherheitsplakate",
    languages: { en: "https://konfydence.com/lockscreens/security-awareness-posters", de: "https://konfydence.com/de/lockscreens/sicherheitsplakate" },
  },
  openGraph: {
    title: "Digitale Sicherheitshinweise statt gedruckter Plakate | Konfydence",
    description: "Erreicht jedes Gerät, Beschäftigte im Homeoffice eingeschlossen — und wechselt die Botschaft alle zwei Wochen.",
    url: "https://konfydence.com/de/lockscreens/sicherheitsplakate",
    siteName: "Konfydence",
    type: "article",
  },
};

export default function Page() {
  return (
    <LockscreenIntentPage
      lang="de"
      slug="sicherheitsplakate"
      breadcrumbName="Sicherheitsplakate"
      eyebrow="SECURITY-AWARENESS-PLAKATE"
      title="Sicherheitshinweise, die auch im Homeoffice ankommen."
      intro="Sicherheitsplakate haben eine Aufgabe: die Botschaft zwischen den Schulungen sichtbar halten. Das gelingt ihnen allerdings nur begrenzt. Sie hängen an einer Wand, erreichen niemanden im Homeoffice, und sobald ein Plakat einen Monat hängt, nimmt es niemand mehr wahr. Ein regelmäßig wechselnder Sperrbildschirm erledigt dieselbe Aufgabe auf der Fläche, auf die ohnehin schon jeder dutzende Male am Tag schaut — und die Botschaft wechselt alle zwei Wochen."
      primaryCtaHref="/de/lockscreens#pricing"
      primaryCtaLabel="Sofort-Angebot erhalten"
      heroImage={{
        src: "/lockscreens/workplace/desktop/41.png",
        alt: "Ein Konfydence-Desktop-Sperrbildschirm mit dem Text „Dein Gehirn hat 37 Tabs offen. Nimm zwei Minuten Abstand vom Bildschirm.“",
      }}
      problemTitle="Die Wand erreicht, wer im Büro ist. Alle anderen verpassen es."
      problemCopy="Hybrid- und Außendienstmitarbeitende sehen das Poster im Pausenraum nie. Wer es sieht, bemerkt es nach ein paar Wochen nicht mehr. Und ein gedrucktes Poster kann nicht reagieren, wenn ein neues Betrugsmuster in eurer Branche auftaucht — es sagt, was zum Zeitpunkt des Drucks galt."
      sections={[
        {
          title: "Auf dem Bildschirm statt an der Wand",
          copy: "Handy- und Notebook-Sperrbildschirme werden jedes Mal gesehen, wenn jemand das Gerät aufnimmt oder aufweckt — im Büro, zu Hause, unterwegs. Die Reichweite hängt nicht vom Arbeitsweg ab.",
        },
        {
          title: "Alle zwei Wochen eine neue Botschaft",
          copy: "Statt einer Botschaft für ein Quartal gibt es alle zwei Wochen einen frischen Hinweis. Jeder macht einen einzigen Punkt zu einer echten Drucktaktik und dem Schritt, der sie stoppt.",
        },
        {
          title: "Kein Druck, kein Austausch von Plakaten",
          copy: "Keine Druckaufträge und kein regelmäßiger Austausch von Plakaten. Eine Lizenz, ausgerollt über eure Geräteverwaltung, von Konfydence aktuell gehalten.",
        },
      ]}
      howTitle="Dieselbe Absicht wie eine Plakat-Kampagne. Weniger Logistik."
      howCopy="Ihr verwaltet kein Artwork und keinen Druckplan. Konfydence erstellt und aktualisiert die Motive; ihr richtet eure Flotte einmal darauf aus."
      howSteps={[
        "Kauft eine Arbeitsplatz-Lizenz — 4 € pro Mitarbeitendem pro Jahr, 300 € Minimum.",
        "Verteilt das aktuelle Motiv über Intune, Jamf oder Google Admin.",
        "Alle zwei Wochen wird das bisherige Motiv durch ein neues ersetzt.",
        "Der Wortlaut verfolgt aktuelle Betrugsmuster und die Anhalten-Abklären-Ansprechen-Methode über das Jahr hinweg.",
      ]}
      orgValue={{
        title: "Sicherheit auch zwischen den Schulungen präsent halten.",
        copy: "Gedruckte Plakate erreichen viele Beschäftigte nur unregelmäßig. Hinweise auf verwalteten Geräten können eine praktische Ergänzung sein. Regelmäßig aktualisierte Sperrbildschirme können Plakate sinnvoll ergänzen. Ihr könnt festhalten, welche Hinweise in welchem Zeitraum angezeigt wurden.",
        points: [
          "Regelmäßige Sicherheitskommunikation — wechselnde Hinweise können das Bewusstsein für Betrugsversuche zwischen den Schulungen stärken. Welche Maßnahmen zur Erfüllung von NIS2 erforderlich sind, muss jede Organisation gesondert beurteilen.",
          "Erinnerung im Arbeitsalltag — die Hinweise greifen konkrete Betrugsmaschen auf und erinnern an das unabhängige Überprüfen verdächtiger Aufforderungen.",
          "Nachvollziehbare Aktualisierungen — die zuständige Person kann festhalten, welche Motive in welchem Zeitraum eingesetzt wurden.",
          "Für verteilte Teams geeignet — Hinweise lassen sich über die Geräteverwaltung auch an Arbeitsplätzen außerhalb des Büros bereitstellen.",
        ],
        note: "Die Sperrbildschirm-Hinweise ergänzen bestehende Sicherheitsschulungen. Sie ersetzen weder technische Schutzmaßnahmen noch die organisatorischen Pflichten eines Unternehmens.",
      }}
      faq={[
        {
          question: "Können wir physische Poster weiterhin daneben nutzen?",
          answer:
            "Ja. Viele Teams behalten ein paar gedruckte Elemente in Gemeinschaftsräumen und nutzen den Sperrbildschirm für Reichweite und Frische. Der Sperrbildschirm ist der Teil, der sich häufig ändert und Mitarbeitende auch außerhalb des Büros begleitet.",
        },
        {
          question: "Wie oft ändert sich die Botschaft?",
          answer:
            "Alle zwei Wochen. Das ist häufig genug, um aufzufallen, und mit genug Abstand, dass jeder Hinweis richtig gelesen wird, bevor der nächste kommt.",
        },
        {
          question: "Können wir die Reihenfolge der Motive anpassen?",
          answer:
            "Ja. In der Verwaltung könnt ihr die Reihenfolge der Motive anpassen und ungeeignete Hinweise auslassen.",
        },
        {
          question: "Wie erreicht es Mitarbeitende im Homeoffice?",
          answer:
            "Das Motiv wird über eure Geräteverwaltung auf dem Firmenlaptop oder -handy gesetzt, egal wo sich das Gerät befindet. Beschäftigte im Homeoffice erhalten denselben Hinweis nach demselben Zeitplan wie alle anderen.",
        },
      ]}
      calloutTitle="Die Botschaft sichtbar halten — überall, nicht nur im Büro."
    />
  );
}
