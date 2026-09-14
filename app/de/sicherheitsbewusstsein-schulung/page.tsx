import type { Metadata } from "next";
import { ComasyIntentPage } from "@/components/ComasyIntentPage";

export const metadata: Metadata = {
  title: { absolute: "Security-Awareness-Schulung, die Entscheidungen misst | CoMaSy" },
  description: "CoMaSy ergänzt Security-Awareness-Schulungen um realistische Entscheidungssimulationen, die Innehalten, Verifizierung und Eskalationsverhalten unter Druck messen.",
  alternates: {
    canonical: "/de/sicherheitsbewusstsein-schulung",
    languages: { en: "https://konfydence.com/security-awareness-training", de: "https://konfydence.com/de/sicherheitsbewusstsein-schulung" },
  },
};

export default function Page() {
  return <ComasyIntentPage
    lang="de"
    eyebrow="SECURITY-AWARENESS-SCHULUNG"
    title="Vom Kennen der Regel zum Anwenden unter Druck."
    intro="CoMaSy ergänzt bestehende Security-Awareness-Schulungen um kurze Entscheidungssimulationen, aufgebaut um Hetze, Autorität, Vertrautheit und blockierte Verifizierung. Gedacht für Organisationen, die bereits schulen, aber klarere Belege dafür wollen, wie Mitarbeitende tatsächlich entscheiden."
    problemTitle="Ein Abschluss zeigt, wer fertig wurde. Er zeigt nicht, wie entschieden wird."
    problemCopy="Der schwierige Moment ist selten eine Quizfrage. Es ist eine dringende Zahlungsanweisung, ein vertrauter Account, der sich seltsam verhält, ein Lieferantenwechsel oder eine Führungskraft, die um eine Ausnahme bittet. CoMaSy übt den Entscheidungsprozess genau in diesen Momenten."
    sections={[
      { title: "Realistische Entscheidungen üben", copy: "Praxisnahe Szenarien, in denen die Bitte legitim wirken kann und der sicherste nächste Schritt von Verifizierung abhängt, nicht von bloßem Misstrauen." },
      { title: "Definierte Signale messen", copy: "Erfasse Innehalten, unabhängige Verifizierung, Impulshandlungen und Reaktionen auf H.A.C.K.-Druckmuster aus den Entscheidungen der Teilnehmenden." },
      { title: "Ergänzt eure bestehende Lösung", copy: "Ein begrenztes Pilotprojekt läuft neben eurem LMS, eurer Phishing-Plattform oder eurem Awareness-Programm — statt es zuerst zu ersetzen." },
    ]}
    proofTitle="Verhaltensbelege sollten aus echten Teilnehmerentscheidungen stammen."
    proofCopy="Das CoMaSy-Pilotreporting wird aus Szenarioantworten berechnet. Beispielhafte Prozentzahlen auf der Website sind ausdrücklich als Beispiele gekennzeichnet, nicht als Kundenergebnisse."
    faq={[
      { question: "Ist CoMaSy eine weitere Awareness-Content-Bibliothek?", answer: "Nein. Der Kernfall ist wiederholtes Entscheidungstraining und Messung — nicht der Ersatz eures bestehenden Kurskatalogs." },
      { question: "Läuft das mit unserem aktuellen Anbieter zusammen?", answer: "Genau das ist der vorgesehene Pilot-Ansatz. CoMaSy positioniert sich als ergänzende Ebene, nicht als verpflichtender Plattformwechsel." },
      { question: "Was soll ein Pilotprojekt beweisen?", answer: "Ob die gewählte Kohorte definierte Entscheidungssignale bei deutlich unterschiedlichen Szenarien verändert — und ob der Beleg überzeugend genug für eine Skalierung ist." },
      { question: "Beweist ein Score echte Sicherheitskompetenz?", answer: "Nein. CoMaSy-Kennzahlen sind Trainingssignale aus simulierten Entscheidungen, keine Garantie für reales Verhalten." },
    ]}
  />;
}
