import type { Metadata } from "next";
import { LockscreenIntentPage } from "@/components/LockscreenIntentPage";

export const metadata: Metadata = {
  title: { absolute: "Security-Awareness-Hintergrundbild für Microsoft Intune | Konfydence Lockscreens" },
  description:
    "Rollt einen rotierenden Security-Awareness-Sperrbildschirm und ein Desktop-Hintergrundbild über Microsoft Intune aus. Eine Richtlinie, eine URL, alle zwei Wochen ein frischer Anhalten · Abklären · Ansprechen-Hinweis — kein erneutes Ausrollen.",
  alternates: {
    canonical: "/de/lockscreens/intune",
    languages: { en: "https://konfydence.com/lockscreens/intune", de: "https://konfydence.com/de/lockscreens/intune" },
  },
  openGraph: {
    title: "Security-Awareness-Hintergrundbild für Microsoft Intune | Konfydence",
    description: "Richtet eine Intune-Hintergrundbild-Richtlinie einmal auf eine URL aus, und sie bleibt das ganze Jahr aktuell.",
    url: "https://konfydence.com/de/lockscreens/intune",
    siteName: "Konfydence",
    type: "article",
  },
};

export default function Page() {
  return (
    <LockscreenIntentPage
      lang="de"
      slug="intune"
      breadcrumbName="Microsoft Intune"
      eyebrow="MICROSOFT INTUNE"
      title="Security-Awareness-Hintergrundbild, das ihr einmal in Intune einrichtet."
      intro="Ihr könnt mit Intune bereits ein Desktop-Hintergrundbild und ein Sperrbildschirmbild ausrollen. Das Problem ist, es sehenswert zu halten — ein statisches Bild wird schnell alt, und alle zwei Wochen ein neues zu verpacken, will niemand machen. Konfydence gibt euch eine stabile URL, die immer zum aktuellen Screen führt, damit eure Intune-Richtlinie ohne weiteres Zutun frisch bleibt."
      primaryCtaHref="/de/lockscreens#pricing"
      primaryCtaLabel="Sofort-Angebot erhalten"
      heroImage={{
        src: "/lockscreens/workplace/desktop/05.png",
        alt: "Ein Konfydence-Desktop-Sperrbildschirm mit dem Text „Neue Bankverbindung. Derselbe Lieferant. Ruf die Nummer an, die schon hinterlegt ist.“",
      }}
      problemTitle="Ein im März ausgerolltes Hintergrundbild ist im Mai unsichtbar."
      problemCopy="Windows-Geräte unter Intune übernehmen ein Personalization-CSP-Hintergrundbild und ein Sperrbildschirmbild. Einmal eingerichtet und vergessen, und Mitarbeitende hören innerhalb von Wochen auf, es zu sehen. Der Wert liegt darin, dass sich die Botschaft ändert — und dass sie etwas Konkretes darüber sagt, wie Betrug Druck aufbaut, nicht nur eine Richtlinienzeile."
      sections={[
        {
          title: "Eine URL, immer aktuell",
          copy: "Der aktuelle Screen wird über eine einzige Konfydence-URL aufgelöst. DesktopImageUrl und LockScreenImageUrl einmal setzen; jede zweiwöchentliche Änderung wird beim nächsten Geräte-Sync übernommen.",
        },
        {
          title: "Windows, passend zugeschnitten",
          copy: "Das Windows-Rendering ist für 16:9-Desktop- und Sperrbildschirme gebaut. Notebook- und Tablet-Formate stehen für gemischte Flotten zur Verfügung, die genauso verwaltet werden.",
        },
        {
          title: "Eine Botschaft, kein Mandat",
          copy: "Jeder Screen macht einen klaren Punkt zu einer echten Drucktaktik — Hetze, falsche Autorität, missbrauchtes Vertrauen, eine überhastete Übergabe — und dem Schritt, der sie entschärft.",
        },
      ]}
      howTitle="Zwei Richtlinieneinstellungen, dann läuft es von selbst."
      howCopy="Konfydence kümmert sich um den Content-Kalender und die Renderings. Euer Intune-Konfigurationsprofil zeigt auf die Resolver-URL und muss nie wieder angefasst werden."
      howSteps={[
        "Kauft eine Arbeitsplatz-Lizenz — 4 € pro Mitarbeitendem pro Jahr, 300 € Minimum.",
        "Erstellt in Intune ein Device-Restrictions- oder Settings-Catalog-Profil mit den Personalization-Sperrbildschirm- und Desktop-Bild-URLs, die Konfydence euch gibt.",
        "Weist es eurer Windows-Gerätegruppe zu.",
        "Alle zwei Wochen ändert sich das Bild unter dieser URL. Geräte übernehmen es beim Sync — kein neues Profil, keine erneute Zuweisung.",
      ]}
      orgValue={{
        title: "Kontinuierliche Awareness, kein Test-und-vergessen.",
        copy: "Der Grund, das über Intune laufen zu lassen, ist nicht das Hintergrundbild — es ist, dass Awareness zu einer fortlaufenden Kontrolle wird statt zu einem Abschlussdatum. Ein Hinweis, der sich alle zwei Wochen ändert, auf jedem verwalteten Gerät, ist sichtbare Aktivität zwischen den formalen Schulungen.",
        points: [
          "Fortlaufende Cyber-Hygiene-Verstärkung — NIS2 (Artikel 21) erwartet kontinuierliche Awareness und eine Aufsicht durch die Leitungsorgane. Ein rotierender Hinweis ist sichtbare Aktivität zwischen den formalen Schulungen.",
          "Beitrag zum Human Risk Management — verschiebt Awareness von einem Wissenstest zu einem Gewohnheits-Cue im Moment der Entscheidung, genau der Punkt, den NIST- und ISO/IEC-27001-Kontrollen betonen.",
          "Ein leichtes Prüfprotokoll — der Arbeitsplatz-Admin erfasst die Screen-Sequenz und die Änderungsdaten, damit ihr für jeden Prüfzeitraum zeigen könnt, was den Mitarbeitenden gezeigt wurde.",
          "Erreicht die gesamte Belegschaft — jedes Gerät in eurer Intune-Gruppe erhält denselben Hinweis nach demselben Zeitplan, Remote- und Frontline-Mitarbeitende eingeschlossen, ohne Abschlüsse nachzuverfolgen.",
        ],
        note: "Konfydence Lockscreens unterstützt die menschliche Seite eines Awareness-Programms. Es macht eine Organisation allein nicht NIS2-, ISO/IEC-27001- oder anderweitig konform — die umfassenderen rechtlichen, governance- und technischen Pflichten bleiben Aufgabe der Organisation.",
      }}
      faq={[
        {
          question: "Welche Intune-Einstellung wird dafür genutzt?",
          answer:
            "Die Personalization-CSP — DesktopImageUrl und LockScreenImageUrl — verfügbar über ein Settings-Catalog- oder Device-Restrictions-Profil auf Windows 10/11 Enterprise und Education. Konfydence stellt die genaue URL zum Einfügen bereit.",
        },
        {
          question: "Muss ich neu ausrollen, wenn sich der Screen ändert?",
          answer:
            "Nein. Die URL ist stabil; nur das ausgelieferte Bild ändert sich. Geräte holen das aktuelle Bild bei ihrem normalen Intune-Sync, sodass die zweiwöchentliche Aktualisierung automatisch läuft.",
        },
        {
          question: "Funktioniert das auch für macOS- oder ChromeOS-Geräte?",
          answer:
            "Ja. macOS unter Jamf oder Intune und ChromeOS über die Google-Admin-Konsole können denselben Resolver mit ihrer eigenen Hintergrundbild-Richtlinie ansteuern. Jede Plattform erhält ein passend zugeschnittenes Rendering.",
        },
        {
          question: "Können wir das komplette Set vor dem Kauf sehen?",
          answer:
            "Ja — fordert ein Angebot an, und wir teilen die aktuelle Bibliothek und den kommenden Content-Kalender, damit ihr Ton und Abdeckung gegen eure Richtlinie prüfen könnt.",
        },
      ]}
      calloutTitle="Richtlinie einmal einrichten. Die Botschaft bleibt aktuell."
    />
  );
}
