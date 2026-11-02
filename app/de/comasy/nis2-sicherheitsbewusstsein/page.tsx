import type { Metadata } from "next";
import { ComasyIntentPage } from "@/components/ComasyIntentPage";

export const metadata: Metadata = {
  title: { absolute: "NIS2-Sicherheitsbewusstsein & Wirksamkeitsnachweis | CoMaSy" },
  description: "Ein CoMaSy-Anwendungsfall für regelmäßige Schulungen zur Cybersicherheit, definierte Wirksamkeitsindikatoren und nachvollziehbare Ergebnisse für die Geschäftsleitung. CoMaSy stellt allein keine NIS2-Konformität her.",
  alternates: {
    canonical: "/de/comasy/nis2-sicherheitsbewusstsein",
    languages: { en: "https://konfydence.com/comasy/nis2-security-awareness", de: "https://konfydence.com/de/comasy/nis2-sicherheitsbewusstsein" },
  },
};

export default function Page() {
  return <ComasyIntentPage
    lang="de"
    eyebrow="NIS2-SICHERHEITSBEWUSSTSEIN-ANWENDUNGSFALL"
    title="Zeigt, ob eure Sicherheitsschulungen etwas bewirken."
    intro="CoMaSy kann die menschliche Seite eines Cybersicherheits-Awareness-Programms mit wiederholtem Entscheidungstraining, festgelegten Kriterien für Entscheidungen und über die Zeit überprüfbaren Aufzeichnungen unterstützen. Es macht eine Organisation allein nicht NIS2-konform."
    problemTitle="Ein Schulungsnachweis zeigt, wer teilgenommen hat. Entscheidend ist, ob sich das Verhalten verbessert hat."
    problemCopy="Wo Organisationen wiederholte Awareness-Aktivität und einen klareren Weg zur Wirksamkeitsprüfung brauchen, kann ein begrenzter CoMaSy-Pilot klar definierte Messgrößen hinzufügen — ohne vorzugeben, dass eine einzelne Plattform die umfassenderen rechtlichen, organisatorischen und technischen Pflichten aus NIS2 erfüllt."
    sections={[
      { title: "Regelmäßige Sicherheitsschulungen", copy: "Kurze, szenariobasierte Übungen über das Jahr verteilt, statt sich auf eine einzelne jährliche Schulungsveranstaltung zu verlassen." },
      { title: "Definierte Indikatoren", copy: "Nutze dokumentierte Kennzahlen wie Innehalten, unabhängige Verifizierung, Impulshandlungen und Reaktion auf Druckmuster." },
      { title: "Überprüfbare Belege", copy: "Halte Pilotteilnahme und Verhaltensergebnisse klar genug für die Auswertung durch die Geschäftsleitung — bei gleichzeitiger Transparenz über die Grenzen dessen, was die Daten belegen können." },
    ]}
    proofTitle="Nutze CoMaSy als unterstützenden Beleg, nicht als Compliance-Abkürzung."
    proofCopy="Methodik und Pilotbericht sollten genau festhalten, was gemessen wurde, wie sich die Kohorte verändert hat und was außerhalb des Übungsumfangs bleibt. Die rechtliche Konformität bleibt Aufgabe der Organisation."
    faq={[
      { question: "Zertifiziert CoMaSy NIS2-Konformität?", answer: "Nein. CoMaSy unterstützt Elemente von Cybersicherheits-Awareness und Wirksamkeitsbelegen. Es ist keine Zertifizierung und kein Ersatz für rechtliche, rechtliche Prüfung, organisatorische Maßnahmen oder technische Schutzvorkehrungen." },
      { question: "Ist das Training auch für Führungskräfte geeignet?", answer: "Ein Pilot kann um Management- oder abteilungsspezifische Entscheidungsszenarien herum ausgerichtet werden, sofern das Teil des vereinbarten Umfangs ist." },
      { question: "Welche Belege liefert der Pilot?", answer: "Vorgesehen sind Teilnahmeprotokolle, nachvollziehbare Trainingsergebnisse, ein Vergleich vor und nach dem Training und eine Auswertung für die Führungsebene darüber, was die Belege stützen." },
      { question: "Funktioniert es mit unserem bisherigen Schulungsanbieter?", answer: "Ja. Der vorgesehene kommerzielle Ansatz ist ergänzend: Entscheidungstraining und Messung hinzufügen, statt die bestehende Lösung zuerst zu ersetzen." },
    ]}
  />;
}
