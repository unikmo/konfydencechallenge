import type { Metadata } from "next";
import { ComasyIntentPage } from "@/components/ComasyIntentPage";

export const metadata: Metadata = {
  title: { absolute: "Social-Engineering-Schulung für Mitarbeitende | CoMaSy" },
  description: "Social-Engineering-Schulung mit realistischen Entscheidungen, kompromittierten Identitäten, unabhängiger Verifizierung und messbaren Verhaltenssignalen.",
  alternates: {
    canonical: "/de/social-engineering-schulung",
    languages: { en: "https://konfydence.com/social-engineering-training", de: "https://konfydence.com/de/social-engineering-schulung" },
  },
};

export default function Page() {
  return <ComasyIntentPage
    lang="de"
    eyebrow="SOCIAL-ENGINEERING-SCHULUNG"
    title="Übe den Moment, in dem der Angreifer vertrauenswürdig wirkt."
    intro="CoMaSy konzentriert sich auf den Entscheidungsdruck hinter Social Engineering: Hetze, Autorität, Vertrautheit und Bitten, die unabhängige Verifizierung abschneiden. Mitarbeitende üben, was zu tun ist, wenn Nachricht, Anrufer oder Account legitim wirken."
    problemTitle="Die schwierige Frage ist nicht „Wer ist böswillig?“, sondern „Was macht diese Handlung sicher?“"
    problemCopy="Ein vertrauter Kollege kann einen kompromittierten Account haben. Ein Lieferant kann imitiert werden. Eine Stimme kann vertraut klingen. CoMaSy trainiert beweisbasierte Verifizierung — statt Mitarbeitenden beizubringen, jeder ungewöhnlichen Bitte grundsätzlich zu misstrauen."
    sections={[
      { title: "Kompromittierte Identität", copy: "Trenne die Vertrauenswürdigkeit einer Person von der Sicherheit eines bestimmten Accounts, einer Nachricht oder Handlung." },
      { title: "Unabhängige Verifizierung", copy: "Übe, den Kanal der anfragenden Person zu verlassen und über einen bekannten Kontaktweg, Prozess oder ein System zu prüfen." },
      { title: "Angemessene Reaktion", copy: "Wähle Eindämmung oder Eskalation, ohne jede unsichere Bitte zu unnötiger Betriebsstörung zu machen." },
    ]}
    proofTitle="Ein besseres Ergebnis ist eine wiederholbare Verifizierungsgewohnheit."
    proofCopy="Das CoMaSy-Messmodell sucht nach beobachtbaren Entscheidungen wie Innehalten, unabhängigem Prüfen und dem Vermeiden verfrühter risikoreicher Handlungen."
    faq={[
      { question: "Geht es nur um Phishing-E-Mails?", answer: "Nein. Der vorgesehene Umfang schließt breitere Geschäftsabläufe ein — Chef-Anfragen, Lieferantenbetrug, Zahlungsänderungen, Account-Übernahmen und stimmbasierte Imitation." },
      { question: "Was ist das H.A.C.K.-Framework?", answer: "H.A.C.K. gruppiert Druck in Hetze, Autorität, Vertrautheit und Notbremse — der Punkt, an dem eine anfragende Person eine folgenreiche Handlung erzwingt und dabei die Verifizierung abschneidet." },
      { question: "Kann CoMaSy einen echten Abteilungsablauf simulieren?", answer: "Ein Pilot kann um ausgewählte Arbeitsabläufe und Risikothemen herum konfiguriert werden. Eine umfassende Custom-Plattform-Funktionalität ist für den ersten Piloten bewusst keine Voraussetzung." },
      { question: "Was passiert nach der Übung?", answer: "Teilnehmende erhalten Feedback zu ihren Entscheidungen, und die Organisation prüft definierte Kohortensignale, um über weiteres Training oder eine Skalierung zu entscheiden." },
    ]}
  />;
}
