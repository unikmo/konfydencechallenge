import type { Metadata } from "next";
import { ComasyIntentPage } from "@/components/ComasyIntentPage";

export const metadata: Metadata = {
  title: { absolute: "Simulation sicherheitsrelevanter Entscheidungen | CoMaSy von Konfydence" },
  description: "Simulation sicherheitsrelevanter Entscheidungen für Organisationen, deren Mitarbeitende Überprüfung, Eskalation und angemessenes Handeln unter Social-Engineering-Druck üben sollen.",
  alternates: {
    canonical: "/de/entscheidungssimulation-sicherheit",
    languages: { en: "https://konfydence.com/security-decision-simulation", de: "https://konfydence.com/de/entscheidungssimulation-sicherheit" },
  },
};

export default function Page() {
  return <ComasyIntentPage
    lang="de"
    eyebrow="ENTSCHEIDUNGSSIMULATION SICHERHEIT"
    title="Sicher entscheiden – auch unter Zeitdruck."
    intro="Eine Entscheidungssimulation stellt Mitarbeitende in realistische Geschäftsmomente, in denen Hetze, Autorität, vertraute Identitäten und unvollständige Beweise um Aufmerksamkeit konkurrieren. CoMaSy misst den Entscheidungsprozess, nicht nur, ob jemand ein Bedrohungs-Etikett erkennt."
    problemTitle="Unter Druck werden wichtige Prüfungen schnell übersprungen."
    problemCopy="Eine Entscheidung kann riskant sein, selbst wenn die absendende Person bekannt ist, die Geschichte plausibel klingt und die Handlung routinemäßig wirkt. CoMaSy übt genau die Überprüfungsdisziplin, die zwischen blindem Vertrauen und pauschalem Misstrauen liegt."
    sections={[
      { title: "Erst prüfen, dann handeln", copy: "Nutze Beweise und unabhängige Überprüfung, um zu entscheiden, ob eine Handlung sicher ist — statt dich auf oberflächliche Warnsignale zu verlassen." },
      { title: "Entscheidungen unter Druck trainieren", copy: "Konfrontiere Teilnehmende mit Hetze-, Autoritäts-, Vertrautheits- und Notbremse-Mechanik in realistischen Geschäftskontexten." },
      { title: "Ergebnisse vergleichen", copy: "Verwandle die Entscheidungen der Teilnehmenden in definierte Trainingsergebnisse, die über ein begrenztes Pilotprojekt hinweg verglichen werden können." },
    ]}
    proofTitle="Eine Simulation nützt nur, wenn das Ergebnis eine echte Entscheidung verändert."
    proofCopy="Der Pilot endet mit einer Auswertung für die Führungsebene: was sich verändert hat, was nicht, was die Belege stützen können und ob die Organisation skalieren, anpassen oder stoppen sollte."
    faq={[
      { question: "Was unterscheidet das von einer Phishing-Simulation?", answer: "Phishing ist ein möglicher Szenariotyp. Simulation sicherheitsrelevanter Entscheidungen deckt breitere Geschäftsentscheidungen ab, bei denen die Bitte über vertraute Accounts, Stimme, Prozessausnahmen oder Lieferantenbeziehungen ankommen kann." },
      { question: "Müssen Teilnehmende herausfinden, wer hinter dem Betrugsversuch steckt?", answer: "Nein. Es geht um sichere Entscheidungen anhand überprüfbarer Informationen und nicht darum, Personen zu erraten." },
      { question: "Müssen mehrere Personen gleichzeitig teilnehmen?", answer: "Nicht zwingend. Ein bezahlter Pilot kann das Entscheidungs- und Messmodell validieren, ohne zunächst umfassende Mehrspieler- oder Anbindungen an bestehende Unternehmenssysteme zu benötigen." },
      { question: "Wie starten wir mit CoMaSy?", answer: "Fragt ein Pilotprojekt an. Gemeinsam legen wir Zielgruppe, Risikothemen, Messung und die Entscheidung nach dem Test fest." },
    ]}
  />;
}
