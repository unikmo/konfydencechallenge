import type { Metadata } from "next";
import { LockscreenIntentPage } from "@/components/LockscreenIntentPage";

export const metadata: Metadata = {
  title: { absolute: "Security-Awareness-Sperrbildschirm für Jamf-verwaltete Macs & iPads | Konfydence Lockscreens" },
  description:
    "Ein rotierender Security-Awareness-Sperrbildschirm für Apple-Flotten unter Jamf Pro oder Jamf School. Ein Konfigurationsprofil, alle zwei Wochen ein frischer Anhalten · Abklären · Ansprechen-Hinweis.",
  alternates: {
    canonical: "/de/lockscreens/jamf",
    languages: { en: "https://konfydence.com/lockscreens/jamf", de: "https://konfydence.com/de/lockscreens/jamf" },
  },
  openGraph: {
    title: "Security-Awareness-Sperrbildschirm für Jamf | Konfydence",
    description: "Einmal mit einem Jamf-Profil ausrollen; die Botschaft bleibt das ganze Jahr aktuell.",
    url: "https://konfydence.com/de/lockscreens/jamf",
    siteName: "Konfydence",
    type: "article",
  },
};

export default function Page() {
  return (
    <LockscreenIntentPage
      lang="de"
      slug="jamf"
      breadcrumbName="Jamf"
      eyebrow="JAMF PRO / JAMF SCHOOL"
      title="Ein Security-Awareness-Sperrbildschirm für eure Apple-Flotte."
      intro="Jamf kann eine Sperrbildschirm-Nachricht und ein Hintergrundbild auf Macs, iPads und iPhones setzen. Was es nicht kann, ist zu verhindern, dass diese Nachricht veraltet. Konfydence liefert den Inhalt — einen klaren Hinweis dazu, wie Betrug Druck aufbaut — und rotiert ihn alle zwei Wochen, damit euer Jamf-Profil auch lange nach dem Ausrollen noch wirkt."
      primaryCtaHref="/de/lockscreens#pricing"
      primaryCtaLabel="Sofort-Angebot erhalten"
      heroImage={{
        src: "/lockscreens/workplace/tablet-landscape/18.png",
        alt: "Ein Konfydence-iPad-Sperrbildschirm mit dem Text „Draufgeklickt? Schnell melden. Verstecken hilft nur dem Angreifer.“",
      }}
      problemTitle="Eine statische Sperrbildschirm-Nachricht wird einmal gelesen und nie wieder."
      problemCopy="Jamfs Login-Window- und Sperrbildschirm-Fußzeilentext oder ein ausgerolltes Hintergrundbild sind leicht einzurichten und leicht auszublenden. Der Hinweis behält seinen Wert nur, wenn sich der Wortlaut ändert und tatsächlich etwas sagt — über die Hetze, die falsche Autorität, die überhastete Übergabe, die ein echter Betrug nutzt."
      sections={[
        {
          title: "macOS- und iPadOS-Renderings",
          copy: "Notebook 16:10 für MacBooks, Tablet-Querformat und -Hochformat für iPad. Jeder Screen ist für das Gerät zugeschnitten, damit der Text hinter Uhr und Bedienelementen lesbar bleibt.",
        },
        {
          title: "Rotiert ohne erneutes Ausrollen",
          copy: "Richtet die Hintergrundbild-Richtlinie auf die Konfydence-Resolver-URL. Das dahinterliegende Bild ändert sich alle zwei Wochen; verwaltete Geräte übernehmen es beim nächsten Check-in.",
        },
        {
          title: "Auch für Schulen gebaut",
          copy: "Jamf-School-Flotten erhalten denselben Dienst zum Schulen-Tarif — 2 € pro verwaltetem Computer pro Jahr — mit Formulierungen für ein Schülergerät.",
        },
      ]}
      howTitle="Ein Profil, dann hält Konfydence es frisch."
      howCopy="Ihr verwaltet die Jamf-Richtlinie; Konfydence verwaltet den Content-Kalender und die Renderings. Die URL ändert sich nie, sodass das Profil nie wieder angefasst werden muss."
      howSteps={[
        "Kauft eine Arbeitsplatz- oder Schulen-Lizenz.",
        "Fügt in Jamf Pro oder Jamf School ein Wallpaper-Payload (oder eine Sperrbildschirm-Bild-Richtlinie) hinzu, das auf die Konfydence-Resolver-URL zeigt.",
        "Weist es euren Mac- und iPad-Gruppen zu.",
        "Alle zwei Wochen ändert sich das ausgelieferte Bild — kein neues Paket, keine erneute Zuweisung.",
      ]}
      orgValue={{
        title: "Kontinuierliche Awareness, kein Test-und-vergessen.",
        copy: "Ein Jamf-Profil macht aus Awareness eine fortlaufende Kontrolle statt eines Abschlussdatums. Ein Hinweis, der sich alle zwei Wochen ändert, auf jedem verwalteten Mac und iPad, ist sichtbare Aktivität zwischen den formalen Schulungen.",
        points: [
          "Fortlaufende Cyber-Hygiene-Verstärkung — NIS2 (Artikel 21) erwartet kontinuierliche Awareness und eine Aufsicht durch die Leitungsorgane. Ein rotierender Hinweis ist sichtbare Aktivität zwischen den formalen Schulungen.",
          "Beitrag zum Human Risk Management — verschiebt Awareness von einem Wissenstest zu einem Gewohnheits-Cue im Moment der Entscheidung, genau der Punkt, den NIST- und ISO/IEC-27001-Kontrollen betonen.",
          "Ein leichtes Prüfprotokoll — der Arbeitsplatz-Admin erfasst die Screen-Sequenz und die Änderungsdaten, damit ihr für jeden Prüfzeitraum zeigen könnt, was den Mitarbeitenden gezeigt wurde.",
          "Erreicht die gesamte Flotte — jedes Gerät in eurem Jamf-Scope erhält denselben Hinweis nach demselben Zeitplan, Remote- und Frontline-Mitarbeitende eingeschlossen, ohne Abschlüsse nachzuverfolgen.",
        ],
        note: "Konfydence Lockscreens unterstützt die menschliche Seite eines Awareness-Programms. Es macht eine Organisation allein nicht NIS2-, ISO/IEC-27001- oder anderweitig konform — die umfassenderen rechtlichen, governance- und technischen Pflichten bleiben Aufgabe der Organisation.",
      }}
      faq={[
        {
          question: "Nutzt das die Jamf-Sperrbildschirm-Nachricht oder ein Hintergrundbild?",
          answer:
            "Ein Hintergrundbild / Sperrbildschirmbild, das auf eine stabile URL zeigt. Es trägt einen vollständig gestalteten Hinweis statt einer Fußzeilenzeile, sodass die Botschaft Platz hat, ihren Punkt zu machen.",
        },
        {
          question: "Erreicht die zweiwöchentliche Änderung Geräte automatisch?",
          answer:
            "Ja. Die Resolver-URL ist fest; nur das Bild ändert sich. Geräte holen das aktuelle Bild bei ihrem normalen Jamf-Check-in, sodass kein manuelles erneutes Ausrollen nötig ist.",
        },
        {
          question: "Können wir das auf einer gemischten Mac- und Windows-Flotte laufen lassen?",
          answer:
            "Ja. Windows-Geräte unter Intune und Apple-Geräte unter Jamf können beide denselben Resolver ansteuern und erhalten jeweils ein passend zugeschnittenes Rendering für die Plattform.",
        },
        {
          question: "Gibt es eine Version für Schüler-iPads?",
          answer:
            "Ja — die Schulen-Stufe nutzt dieselbe Auslieferung mit Hinweisen für ein Schülergerät, inklusive Gaming-, Social- und Gruppendruck-Betrug neben den Klassikern.",
        },
      ]}
      calloutTitle="Einmal in Jamf ausrollen. Die Botschaft das ganze Jahr lebendig halten."
    />
  );
}
