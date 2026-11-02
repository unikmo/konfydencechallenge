import type { Metadata } from "next";
import { LockscreenIntentPage } from "@/components/LockscreenIntentPage";

export const metadata: Metadata = {
  title: { absolute: "Sicherheitshinweise für Microsoft Intune für Microsoft Intune | Konfydence Lockscreens" },
  description:
    "Verteilt einen regelmäßig wechselnden Sicherheitshinweis auf dem Sperrbildschirm und ein Desktop-Hintergrundbild über Microsoft Intune aus. Eine Richtlinie, eine URL, alle zwei Wochen ein neuer Hinweis zur Methode „Anhalten, Abklären, Ansprechen“ — kein erneutes Ausrollen.",
  alternates: {
    canonical: "/de/lockscreens/intune",
    languages: { en: "https://konfydence.com/lockscreens/intune", de: "https://konfydence.com/de/lockscreens/intune" },
  },
  openGraph: {
    title: "Sicherheitshinweise für Microsoft Intune für Microsoft Intune | Konfydence",
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
      title="Sicherheitshinweise über Microsoft Intune auf den Geräten anzeigen."
      intro="Ihr könnt mit Intune bereits ein Desktop-Hintergrundbild und ein Sperrbildschirmbild ausrollen. Schwieriger ist es, den Inhalt regelmäßig aktuell zu halten — ein statisches Bild wird schnell alt, und alle zwei Wochen ein neues zu verpacken, will niemand machen. Konfydence gibt euch eine stabile URL, die immer zum aktuellen Screen führt, damit eure Intune-Richtlinie ohne weiteres Zutun frisch bleibt."
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
          title: "Ein zentraler Link für aktuelle Hinweise",
          copy: "Der aktuelle Hinweis wird über einen zentralen Konfydence-Link bereitgestellt. DesktopImageUrl und LockScreenImageUrl einmal setzen; jede zweiwöchentliche Änderung wird beim nächsten Geräte-Sync übernommen.",
        },
        {
          title: "Windows, passend zugeschnitten",
          copy: "Das Windows-Bildformat ist für 16:9-Desktop- und Sperrbildschirme gebaut. Notebook- und Tablet-Formate stehen für gemischte Flotten zur Verfügung, die genauso verwaltet werden.",
        },
        {
          title: "Ein klarer Hinweis statt langer Anweisungen",
          copy: "Jedes Motiv erklärt verständlich eine typische Betrugsmasche — Hetze, falsche Autorität, missbrauchtes Vertrauen, eine überhastete Übergabe — und dem Schritt, der sie entschärft.",
        },
      ]}
      howTitle="Zwei Richtlinieneinstellungen, dann läuft es von selbst."
      howCopy="Konfydence kümmert sich um den Redaktionsplanung und die passenden Bildformate. Euer Intune-Konfigurationsprofil zeigt auf die Resolver-URL und muss nie wieder angefasst werden."
      howSteps={[
        "Kauft eine Arbeitsplatz-Lizenz — 4 € pro Mitarbeitendem pro Jahr, 300 € Minimum.",
        "Erstellt in Intune ein Device-Restrictions- oder Settings-Catalog-Profil mit den Personalization-Sperrbildschirm- und Desktop-Bild-URLs, die Konfydence euch gibt.",
        "Weist es eurer Windows-Gerätegruppe zu.",
        "Alle zwei Wochen ändert sich das Bild unter dieser URL. Geräte übernehmen es beim Sync — kein neues Profil, keine erneute Zuweisung.",
      ]}
      orgValue={{
        title: "Sicherheit auch zwischen den Schulungen präsent halten.",
        copy: "Der Grund, das über Intune laufen zu lassen, ist nicht das Hintergrundbild — es ist, dass Sicherheitshinweise zu einem festen Bestandteil des Arbeitsalltags werden statt zu einem Abschlussdatum. Ein Hinweis, der sich alle zwei Wochen ändert, auf jedem verwalteten Gerät, ist sichtbare Aktivität zwischen den formalen Schulungen.",
        points: [
          "Regelmäßige Sicherheitskommunikation — wechselnde Hinweise können das Bewusstsein für Betrugsversuche zwischen den Schulungen stärken. Welche Maßnahmen zur Erfüllung von NIS2 erforderlich sind, muss jede Organisation gesondert beurteilen.",
          "Erinnerung im Arbeitsalltag — die Hinweise greifen konkrete Betrugsmaschen auf und erinnern an das unabhängige Überprüfen verdächtiger Aufforderungen.",
          "Nachvollziehbare Aktualisierungen — die zuständige Person kann festhalten, welche Motive in welchem Zeitraum eingesetzt wurden.",
          "Über Intune verwaltbar — ausgewählte Geräte können zentral mit aktuellen Sicherheitshinweisen ausgestattet werden.",
        ],
        note: "Die Sperrbildschirm-Hinweise ergänzen bestehende Sicherheitsschulungen. Sie ersetzen weder technische Schutzmaßnahmen noch die organisatorischen Pflichten eines Unternehmens.",
      }}
      faq={[
        {
          question: "Welche Intune-Einstellung wird dafür genutzt?",
          answer:
            "Die Personalization-CSP — DesktopImageUrl und LockScreenImageUrl — verfügbar über ein Settings-Catalog- oder Device-Restrictions-Profil auf Windows 10/11 Enterprise und Education. Konfydence stellt die genaue URL zum Einfügen bereit.",
        },
        {
          question: "Muss ich bei jedem neuen Motiv die Einstellungen ändern?",
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
            "Ja — fordert ein Angebot an, und wir teilen die aktuelle Bibliothek und den Plan für weitere Motive, damit ihr Ton und Abdeckung gegen eure Richtlinie prüfen könnt.",
        },
      ]}
      calloutTitle="Richtlinie einmal einrichten. Die Botschaft bleibt aktuell."
    />
  );
}
