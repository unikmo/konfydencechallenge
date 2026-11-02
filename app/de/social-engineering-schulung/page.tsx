import type { Metadata } from "next";
import { ComasyIntentPage } from "@/components/ComasyIntentPage";

export const metadata: Metadata = {
  title: { absolute: "Social-Engineering-Schulung für Mitarbeitende | CoMaSy" },
  description: "Social-Engineering-Schulung mit realistischen Entscheidungen, missbrauchten Identitäten, unabhängiger Überprüfung und nachvollziehbaren Trainingsergebnissen.",
  alternates: {
    canonical: "/de/social-engineering-schulung",
    languages: { en: "https://konfydence.com/social-engineering-training", de: "https://konfydence.com/de/social-engineering-schulung" },
  },
};

export default function Page() {
  return <ComasyIntentPage
    lang="de"
    eyebrow="SOCIAL-ENGINEERING-SCHULUNG"
    title="Betrugsversuche erkennen, auch wenn der Absender vertrauenswürdig erscheint."
    intro="CoMaSy konzentriert sich auf den Entscheidungsdruck hinter Social Engineering: Hetze, Autorität, Vertrautheit und Aufforderungen, die eine unabhängige Überprüfung verhindern sollen. Mitarbeitende üben, was zu tun ist, wenn Nachricht, Anrufer oder Account echt erscheinen."
    problemTitle="Die schwierige Frage ist nicht „Wer ist böswillig?“, sondern „Was macht diese Handlung sicher?“"
    problemCopy="Das Benutzerkonto eines vertrauten Kollegen kann übernommen worden sein. Ein Lieferant kann imitiert werden. Eine Stimme kann vertraut klingen. CoMaSy trainiert die unabhängige Überprüfung von Angaben — statt Mitarbeitenden beizubringen, jeder ungewöhnlichen Bitte grundsätzlich zu misstrauen."
    sections={[
      { title: "Missbrauchte Identität", copy: "Trenne die Vertrauenswürdigkeit einer Person von der Sicherheit eines bestimmten Accounts, einer Nachricht oder Handlung." },
      { title: "Unabhängige Überprüfung", copy: "Übe, den Kanal der anfragenden Person zu verlassen und über einen bekannten Kontaktweg, Prozess oder ein System zu prüfen." },
      { title: "Angemessene Reaktion", copy: "Lerne, verdächtige Vorgänge angemessen zu stoppen oder weiterzugeben, ohne den Arbeitsablauf unnötig zu unterbrechen." },
    ]}
    proofTitle="Ein besseres Ergebnis ist eine wiederholbare Überprüfungsgewohnheit."
    proofCopy="Das CoMaSy-Messmodell sucht nach beobachtbaren Entscheidungen wie Innehalten, unabhängigem Prüfen und dem Vermeiden verfrühter risikoreicher Handlungen."
    faq={[
      { question: "Geht es nur um Phishing-E-Mails?", answer: "Nein. Der vorgesehene Umfang schließt breitere Geschäftsabläufe ein — Chef-Anfragen, Lieferantenbetrug, Zahlungsänderungen, Account-Übernahmen und stimmbasierte Imitation." },
      { question: "Was bedeutet die H.A.C.K.-Methode?", answer: "H.A.C.K. beschreibt vier typische Muster: Zeitdruck, vorgetäuschte Autorität, missbrauchtes Vertrauen und das Verhindern unabhängiger Rückfragen." },
      { question: "Kann CoMaSy einen echten Abteilungsablauf simulieren?", answer: "Ein Pilot kann um ausgewählte Arbeitsabläufe und Risikothemen herum konfiguriert werden. Eine vollständig individuell entwickelte Plattform ist für einen ersten Test nicht nötig." },
      { question: "Was passiert nach der Übung?", answer: "Teilnehmende erhalten Feedback zu ihren Entscheidungen, und die Organisation prüft definierte Teilnehmergruppensignale, um über weiteres Training oder eine Ausweitung zu entscheiden." },
    ]}
  />;
}
