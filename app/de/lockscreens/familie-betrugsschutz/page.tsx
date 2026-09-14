import type { Metadata } from "next";
import { LockscreenIntentPage } from "@/components/LockscreenIntentPage";

export const metadata: Metadata = {
  title: { absolute: "Ein Betrugswarn-Sperrbildschirm für die Familie | Konfydence Lockscreens" },
  description:
    "Ein ruhiger Betrugswarn-Hinweis auf dem Handy eines Elternteils oder Teenagers. Ein Anhalten · Abklären · Ansprechen-Hinweis auf dem Sperrbildschirm, alle zwei Wochen aktualisiert — keine App, kein Nörgeln.",
  alternates: {
    canonical: "/de/lockscreens/familie-betrugsschutz",
    languages: { en: "https://konfydence.com/lockscreens/family-scam-protection", de: "https://konfydence.com/de/lockscreens/familie-betrugsschutz" },
  },
  openGraph: {
    title: "Ein Betrugswarn-Sperrbildschirm für die Familie | Konfydence",
    description: "Der Hinweis, der schon da ist, wenn die Betrugs-SMS ankommt — ohne dass du sie selbst schicken musst.",
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
      title="Der Betrugshinweis, der schon auf ihrem Handy ist."
      intro="Du kannst nicht dabei sein, wenn die gefälschte Paketdienst-SMS ankommt, die Nachricht vom gehackten Freundes-Account, der Anruf, der behauptet, das Bankkonto sei kompromittiert. Aber ein Sperrbildschirm kann es. Konfydence bringt einen ruhigen Hinweis — Anhalten, Abklären, Ansprechen — auf das Handy eines Elternteils oder Teenagers und tauscht ihn still alle zwei Wochen gegen einen neuen."
      primaryCtaHref="/de/lockscreens#pricing"
      primaryCtaLabel="Home oder Teen holen — 19,99 €"
      heroImage={{
        src: "/lockscreens/home/phone/11.png",
        alt: "Ein Konfydence-Handy-Sperrbildschirm mit dem Text „Steuerrückzahlung wartet? Öffne das offizielle Steuerportal selbst.“",
        frame: "phone",
      }}
      problemTitle="Die Menschen, um die du dir Sorgen machst, installieren keine weitere App und lesen keinen weitergeleiteten Artikel."
      problemCopy="Warnungen von einem besorgten erwachsenen Kind werden überhört. Sicherheits-Apps werden ignoriert oder deinstalliert. Ein Sperrbildschirm verlangt von niemandem etwas — er ist einfach da, in der halben Sekunde vor dem Entsperren, und sagt das eine, was zählt: anhalten und prüfen, bevor du handelst."
      sections={[
        {
          title: "Für ein Elternteil, das immer wieder ins Visier gerät",
          copy: "Hinweise für die Betrugsmaschen, die ältere Erwachsene am härtesten treffen — Bank-Anrufe mit falscher Identität, „Familienmitglied in Not“-Nachrichten, Rückerstattungs- und Tech-Support-Betrug.",
        },
        {
          title: "Für das Handy eines Teenagers",
          copy: "Ein eigenes Set für Gaming-, Social- und Gruppendruck-Betrug — Account-„Boosts“, gefälschte Gewinnspiele, Sextortion, Deepfake- und Stimmklon-Tricks — in einer Sprache, bei der ein Teenager nicht die Augen verdreht.",
        },
      ]}
      howTitle="Einmal einrichten. Es hält sich selbst aktuell."
      howCopy="Du richtest den ersten Screen in etwa einer Minute ein. Danach ist alle zwei Wochen ein neuer bereit — ein Tipp zum Aktualisieren, oder du lässt es liegen, und der Hinweis erneuert sich einfach."
      howSteps={[
        "Wähle Home oder Teen Home und schließe den Kauf auf konfydence.com ab.",
        "Öffne den Link auf dem Handy, das du schützt, und speichere den aktuellen Screen als Hintergrundbild — kurze, geführte Schritte für iPhone und Android.",
        "Alle zwei Wochen: „Dein nächster Konfydence-Screen ist bereit.“ Ein Tipp zum Aktualisieren.",
        "Der Wortlaut verfolgt das ganze Jahr über die Betrugsmaschen, die gerade kursieren.",
      ]}
      faq={[
        {
          question: "Braucht das eine App oder ein Abo bei einem Dienst?",
          answer:
            "Keine App. Es ist ein Sperrbildschirmbild, das du wie jedes Hintergrundbild einrichtest. Es ist ein Jahresplan — 19,99 € im ersten Jahr, danach 14,99 € pro Jahr —, der die zweiwöchentlichen Updates und das komplette Hinweis-Set liefert.",
        },
        {
          question: "Kann ich es remote auf dem Handy meiner Eltern einrichten?",
          answer:
            "Du brauchst das Handy einmal, um das erste Hintergrundbild zu setzen, oder um am Telefon durchzugehen. Danach ist die Aktualisierung ein einzelner Tipp, den sie selbst machen können, oder den du bei einem Besuch erledigst.",
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
      calloutTitle="Bring den Hinweis dorthin, wo sie ihn sehen — ohne dass du derjenige bist, der nörgelt."
    />
  );
}
