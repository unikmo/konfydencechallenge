import type { Metadata } from "next";
import { LockscreenIntentPage } from "@/components/LockscreenIntentPage";

export const metadata: Metadata = {
  title: { absolute: "Die digitale Alternative zu Security-Awareness-Plakaten | Konfydence Lockscreens" },
  description:
    "Security-Awareness-Plakate veralten an der Wand und erreichen Remote-Mitarbeitende nicht. Ein rotierender Sperrbildschirm bringt einen Anhalten · Abklären · Ansprechen-Hinweis auf jedes Gerät und aktualisiert ihn alle zwei Wochen.",
  alternates: {
    canonical: "/de/lockscreens/sicherheitsplakate",
    languages: { en: "https://konfydence.com/lockscreens/security-awareness-posters", de: "https://konfydence.com/de/lockscreens/sicherheitsplakate" },
  },
  openGraph: {
    title: "Die digitale Alternative zu Security-Awareness-Plakaten | Konfydence",
    description: "Erreicht jedes Gerät, Remote-Mitarbeitende eingeschlossen — und wechselt die Botschaft alle zwei Wochen.",
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
      breadcrumbName="Security-Awareness-Plakate"
      eyebrow="SECURITY-AWARENESS-PLAKATE"
      title="Ein Plakat, an dem niemand vorbeilaufen muss."
      intro="Security-Awareness-Plakate haben eine Aufgabe: die Botschaft zwischen den Schulungen sichtbar halten. Sie tun sich schwer damit. Sie hängen an einer Wand, erreichen niemanden im Homeoffice, und sobald ein Plakat einen Monat hängt, nimmt es niemand mehr wahr. Ein rotierender Sperrbildschirm erledigt dieselbe Aufgabe auf der Fläche, auf die ohnehin schon jeder dutzende Male am Tag schaut — und die Botschaft wechselt alle zwei Wochen."
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
          title: "Auf dem Gerät, nicht an der Wand",
          copy: "Handy- und Notebook-Sperrbildschirme werden jedes Mal gesehen, wenn jemand das Gerät aufnimmt oder aufweckt — im Büro, zu Hause, unterwegs. Die Reichweite hängt nicht vom Arbeitsweg ab.",
        },
        {
          title: "Alle zwei Wochen eine neue Botschaft",
          copy: "Statt einer Botschaft für ein Quartal gibt es alle zwei Wochen einen frischen Hinweis. Jeder macht einen einzigen Punkt zu einer echten Drucktaktik und dem Schritt, der sie stoppt.",
        },
        {
          title: "Nichts zu drucken, aufzuhängen oder auszutauschen",
          copy: "Kein Design-Zyklus, kein Druckauftrag, kein Herumlaufen zum Rahmenwechsel. Eine Lizenz, ausgerollt über eure Geräteverwaltung, von Konfydence aktuell gehalten.",
        },
      ]}
      howTitle="Dieselbe Absicht wie eine Plakat-Kampagne. Weniger Logistik."
      howCopy="Ihr verwaltet kein Artwork und keinen Druckplan. Konfydence schreibt und rendert die Screens; ihr richtet eure Flotte einmal darauf aus."
      howSteps={[
        "Kauft eine Arbeitsplatz-Lizenz — 4 € pro Mitarbeitendem pro Jahr, 300 € Minimum.",
        "Rollt den aktuellen Screen über Intune, Jamf oder Google Admin aus.",
        "Ein neuer Screen ersetzt ihn alle zwei Wochen automatisch.",
        "Der Wortlaut verfolgt aktuelle Betrugsmuster und die Anhalten-Abklären-Ansprechen-Methode über das Jahr hinweg.",
      ]}
      orgValue={{
        title: "Kontinuierliche Awareness, kein Test-und-vergessen.",
        copy: "Eine Plakat-Kampagne ist eine Geste in Richtung kontinuierlicher Awareness, die die Logistik immer wieder untergräbt. Ein rotierender Sperrbildschirm liefert dieselbe Absicht als permanente Kontrolle — und gibt euch ein Protokoll darüber, was wann lief.",
        points: [
          "Fortlaufende Cyber-Hygiene-Verstärkung — NIS2 (Artikel 21) erwartet kontinuierliche Awareness und eine Aufsicht durch die Leitungsorgane. Ein rotierender Hinweis ist sichtbare Aktivität zwischen den formalen Schulungen.",
          "Beitrag zum Human Risk Management — verschiebt Awareness von einem Wissenstest zu einem Gewohnheits-Cue im Moment der Entscheidung, genau der Punkt, den NIST- und ISO/IEC-27001-Kontrollen betonen.",
          "Ein leichtes Prüfprotokoll — der Arbeitsplatz-Admin erfasst die Screen-Sequenz und die Änderungsdaten, damit ihr für jeden Prüfzeitraum zeigen könnt, was den Mitarbeitenden gezeigt wurde.",
          "Erreicht die gesamte Belegschaft — Firmengeräte unter MDM erhalten denselben Hinweis nach demselben Zeitplan, Remote- und Frontline-Mitarbeitende eingeschlossen, ohne Abschlüsse nachzuverfolgen.",
        ],
        note: "Konfydence Lockscreens unterstützt die menschliche Seite eines Awareness-Programms. Es macht eine Organisation allein nicht NIS2-, ISO/IEC-27001- oder anderweitig konform — die umfassenderen rechtlichen, governance- und technischen Pflichten bleiben Aufgabe der Organisation.",
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
          question: "Können wir die Screens auswählen oder anordnen?",
          answer:
            "Ja. Der Arbeitsplatz-Admin lässt euch die Playlist über die gesamte Bibliothek neu ordnen und Screens entfernen, die nicht zu eurem Kontext passen.",
        },
        {
          question: "Wie erreicht es Mitarbeitende im Homeoffice?",
          answer:
            "Der Screen wird über eure Geräteverwaltungsrichtlinie auf dem Firmenlaptop oder -handy gesetzt, egal wo sich das Gerät befindet. Remote-Mitarbeitende erhalten denselben Hinweis nach demselben Zeitplan wie alle anderen.",
        },
      ]}
      calloutTitle="Die Botschaft sichtbar halten — überall, nicht nur im Büro."
    />
  );
}
