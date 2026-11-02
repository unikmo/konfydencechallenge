import type { Metadata } from "next";
import { ComasyIntentPage } from "@/components/ComasyIntentPage";

export const metadata: Metadata = {
  title: { absolute: "IT-Sicherheit-Schulung, die Entscheidungen misst | CoMaSy" },
  description: "CoMaSy ergänzt IT-Sicherheit-Schulungen um realistische Entscheidungssimulationen, die Innehalten, Überprüfung und Eskalationsverhalten unter Druck messen.",
  alternates: {
    canonical: "/de/sicherheitsbewusstsein-schulung",
    languages: { en: "https://konfydence.com/security-awareness-training", de: "https://konfydence.com/de/sicherheitsbewusstsein-schulung" },
  },
};

export default function Page() {
  return <ComasyIntentPage
    lang="de"
    eyebrow="SECURITY-AWARENESS-SCHULUNG"
    title="Sicherheitsregeln kennen reicht nicht. Man muss sie auch unter Druck anwenden können."
    intro="CoMaSy ergänzt bestehende IT-Sicherheit-Schulungen um kurze Entscheidungssimulationen, zu Zeitdruck, vorgetäuschter Autorität, vertrauten Absendern und erschwerter Überprüfung. Gedacht für Organisationen, die bereits schulen, aber besser verstehen möchten, wie Mitarbeitende in schwierigen Situationen entscheiden."
    problemTitle="Eine abgeschlossene Schulung zeigt noch nicht, ob Mitarbeitende im Ernstfall richtig handeln."
    problemCopy="Im Arbeitsalltag geht es selten um eine Quizfrage. Es ist eine dringende Zahlungsanweisung, ein vertrauter Account, der sich seltsam verhält, ein Lieferantenwechsel oder eine Führungskraft, die um eine Ausnahme bittet. CoMaSy übt den Entscheidungsprozess genau in diesen Momenten."
    sections={[
      { title: "Realistische Entscheidungen üben", copy: "Praxisnahe Szenarien, in denen die Bitte legitim wirken kann und der sicherste nächste Schritt von Überprüfung abhängt, nicht von bloßem Misstrauen." },
      { title: "Definierte Signale messen", copy: "Erfasse Innehalten, unabhängige Überprüfung, Impulshandlungen und Reaktionen auf H.A.C.K.-Druckmuster aus den Entscheidungen der Teilnehmenden." },
      { title: "Ergänzt eure bestehende Lösung", copy: "Ein begrenztes Pilotprojekt läuft neben eurem LMS, eurer Phishing-Plattform oder eurem Schulungsprogramm zur IT-Sicherheit — statt es zuerst zu ersetzen." },
    ]}
    proofTitle="Verhaltensbelege sollten aus echten Teilnehmerentscheidungen stammen."
    proofCopy="Das CoMaSy-Pilotreporting wird aus Szenarioantworten berechnet. Beispielhafte Prozentzahlen auf der Website sind ausdrücklich als Beispiele gekennzeichnet, nicht als Kundenergebnisse."
    faq={[
      { question: "Ist CoMaSy eine weitere Sicherheitsbewusstsein-Content-Bibliothek?", answer: "Nein. Der Kernfall ist wiederholtes Entscheidungstraining und Messung — nicht der Ersatz eures bestehenden Kurskatalogs." },
      { question: "Läuft das mit unserem aktuellen Anbieter zusammen?", answer: "Genau das ist der vorgesehene Pilot-Ansatz. CoMaSy positioniert sich als ergänzende Ebene, nicht als verpflichtender Plattformwechsel." },
      { question: "Was soll ein Pilotprojekt beweisen?", answer: "Ob die gewählte Teilnehmergruppe definierte Entscheidungssignale bei deutlich unterschiedlichen Szenarien verändert — und ob der Beleg überzeugend genug für eine Ausweitung ist." },
      { question: "Beweist ein Score echte Sicherheitskompetenz?", answer: "Nein. CoMaSy-Kennzahlen sind Trainingssignale aus simulierten Entscheidungen, keine Garantie für reales Verhalten." },
    ]}
  />;
}
