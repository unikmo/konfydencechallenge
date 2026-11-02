import type { Metadata } from "next";
import { LockscreenIntentPage } from "@/components/LockscreenIntentPage";

export const metadata: Metadata = {
  title: { absolute: "Betrugsschutz für Familien auf dem Sperrbildschirm | Konfydence Lockscreens" },
  description:
    "Ein ruhiger Betrugswarn-Hinweis auf dem Handy eines Elternteils oder Teenagers. Ein Anhalten · Abklären · Ansprechen-Hinweis auf dem Sperrbildschirm, alle zwei Wochen aktualisiert — ohne zusätzliche App.",
  alternates: {
    canonical: "/de/lockscreens/familie-betrugsschutz",
    languages: { en: "https://konfydence.com/lockscreens/family-scam-protection", de: "https://konfydence.com/de/lockscreens/familie-betrugsschutz" },
  },
  openGraph: {
    title: "Betrugsschutz für Familien auf dem Sperrbildschirm | Konfydence",
    description: "Regelmäßige Hinweise, die deine Familie auf typische Betrugsmaschen aufmerksam machen.",
    url: "https://konfydence.com/de/lockscreens/familie-betrugsschutz",
    siteName: "Konfydence",
    type: "article",
  },
};

export default function Page() {
  return (
    <LockscreenIntentPage
      lang="de"
      slug="familie-betrugsschutz"
      breadcrumbName="Betrugsschutz für die Familie"
      eyebrow="HOME & TEEN"
      title="Betrugsmaschen erkennen – mit regelmäßigen Hinweisen auf dem Handy."
      intro="Du kannst nicht bei jedem verdächtigen Anruf und jeder gefälschten Nachricht helfen. Ein kurzer Hinweis auf dem Sperrbildschirm erinnert deine Familie daran, erst nachzudenken und dann zu handeln. Konfydence stellt dafür regelmäßig neue Motive bereit – für Erwachsene und Jugendliche."
      primaryCtaHref="/de/lockscreens#pricing"
      primaryCtaLabel="Home oder Teen holen — 19,99 €"
      heroImage={{
        src: "/lockscreens/home/phone/11.png",
        alt: "Ein Konfydence-Handy-Sperrbildschirm mit dem Text „Steuerrückzahlung wartet? Öffne das offizielle Steuerportal selbst.“",
        frame: "phone",
      }}
      problemTitle="Nicht jede Warnung bleibt im Gedächtnis – ein sichtbarer Hinweis kann helfen."
      problemCopy="Warnungen werden schnell vergessen. Ein kurzer Hinweis auf dem Handy kann täglich an sichere Gewohnheiten erinnern – etwa unbekannte Nummern zu überprüfen und niemals aus Zeitdruck Geld zu überweisen."
      sections={[
        {
          title: "Für Eltern und ältere Angehörige",
          copy: "Hinweise zu typischen Betrugsversuchen gegen ältere Menschen — Bank-Anrufe mit falscher Identität, „Familienmitglied in Not“-Nachrichten, Rückerstattungs- und Tech-Support-Betrug.",
        },
        {
          title: "Für das Handy eines Teenagers",
          copy: "Eigene Hinweise zu Betrug beim Gaming, in sozialen Netzwerken und im Freundeskreis — Account-„Boosts“, gefälschte Gewinnspiele, Sextortion, Deepfake- und Stimmklon-Tricks — verständlich und ohne belehrenden Ton.",
        },
      ]}
      howTitle="Einmal einrichten. Neue Hinweise einfach übernehmen."
      howCopy="Richte den ersten Hinweis als Hintergrundbild ein. Alle zwei Wochen steht ein neues Motiv bereit, das du herunterladen und selbst als Hintergrundbild festlegen kannst."
      howSteps={[
        "Wähle Home oder Teen Home und schließe den Kauf auf konfydence.com ab.",
        "Öffne den Link auf dem gewünschten Handy und speichere das Bild. Eine kurze Anleitung zeigt dir die Einrichtung auf iPhone und Android.",
        "Alle zwei Wochen erhältst du einen neuen Hinweis zum Herunterladen.",
        "Die Motive behandeln unterschiedliche Betrugsmaschen aus dem Alltag.",
      ]}
      faq={[
        {
          question: "Braucht das eine App oder ein Abo bei einem Dienst?",
          answer:
            "Keine App. Es ist ein Sperrbildschirmbild, das du wie jedes Hintergrundbild einrichtest. Es ist ein Jahresplan — 19,99 € im ersten Jahr, danach 14,99 € pro Jahr —, der die zweiwöchentlichen Updates und das komplette Hinweis-Set liefert.",
        },
        {
          question: "Kann ich die Hinweise aus der Ferne auf dem Handy meiner Eltern einrichten?",
          answer:
            "Für die erste Einrichtung brauchst du das Handy oder musst die Person telefonisch anleiten. Danach ist die Aktualisierung ein einzelner Tipp, den sie selbst machen können, oder den du bei einem Besuch erledigst.",
        },
        {
          question: "Ist die Teenager-Version wirklich anders?",
          answer:
            "Ja — ein eigenes 27-Screen-Set für die Betrugsmaschen, die auf jüngere Menschen zielen: gefälschte Ingame-Währung, „Bloßstellungs“-Apps, Grooming und Isolationstaktiken, Deepfake- und Stimmklon-Nachrichten.",
        },
        {
          question: "Verfolgt es Standort oder Aktivität?",
          answer:
            "Nein. Es ist ein statisches Bild. Es überwacht das Handy nicht, sendet keine Benachrichtigungen und meldet nichts an dich oder Konfydence zurück.",
        },
      ]}
      calloutTitle="Betrugsschutz beginnt mit einem einfachen Hinweis auf dem Handy."
    />
  );
}
