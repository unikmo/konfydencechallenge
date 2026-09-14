import type { Metadata } from "next";
import { ComasyIntentPage } from "@/components/ComasyIntentPage";

export const metadata: Metadata = {
  title: { absolute: "Sicherheits-Entscheidungssimulation | CoMaSy von Konfydence" },
  description: "Sicherheits-Entscheidungssimulation für Organisationen, deren Mitarbeitende Verifizierung, Eskalation und angemessenes Handeln unter Social-Engineering-Druck üben sollen.",
  alternates: {
    canonical: "/de/entscheidungssimulation-sicherheit",
    languages: { en: "https://konfydence.com/security-decision-simulation", de: "https://konfydence.com/de/entscheidungssimulation-sicherheit" },
  },
};

export default function Page() {
  return <ComasyIntentPage
    lang="de"
    eyebrow="ENTSCHEIDUNGSSIMULATION SICHERHEIT"
    title="Übe die Entscheidungen, die Angreifer verkürzen wollen."
    intro="Eine Entscheidungssimulation stellt Mitarbeitende in realistische Geschäftsmomente, in denen Hetze, Autorität, vertraute Identitäten und unvollständige Beweise um Aufmerksamkeit konkurrieren. CoMaSy misst den Entscheidungsprozess, nicht nur, ob jemand ein Bedrohungs-Etikett erkennt."
    problemTitle="Der Angriff gelingt, wenn Druck schneller ist als Verifizierung."
    problemCopy="Eine Entscheidung kann riskant sein, selbst wenn die absendende Person bekannt ist, die Geschichte plausibel klingt und die Handlung routinemäßig wirkt. CoMaSy übt genau die Verifizierungsdisziplin, die zwischen blindem Vertrauen und pauschalem Misstrauen liegt."
    sections={[
      { title: "Beweise vor Urteil", copy: "Nutze Beweise und unabhängige Verifizierung, um zu entscheiden, ob eine Handlung sicher ist — statt dich auf oberflächliche Warnsignale zu verlassen." },
      { title: "Druckbewusstes Üben", copy: "Konfrontiere Teilnehmende mit Hetze-, Autoritäts-, Vertrautheits- und Notbremse-Mechanik in realistischen Geschäftskontexten." },
      { title: "Gemessene Reaktion", copy: "Verwandle die Entscheidungen der Teilnehmenden in definierte Trainingssignale, die über ein begrenztes Pilotprojekt hinweg verglichen werden können." },
    ]}
    proofTitle="Eine Simulation nützt nur, wenn das Ergebnis eine echte Entscheidung verändert."
    proofCopy="Der Pilot endet mit einer Auswertung für die Führungsebene: was sich verändert hat, was nicht, was die Belege stützen können und ob die Organisation skalieren, anpassen oder stoppen sollte."
    faq={[
      { question: "Was unterscheidet das von einer Phishing-Simulation?", answer: "Phishing ist ein möglicher Szenariotyp. Sicherheits-Entscheidungssimulation deckt breitere Geschäftsentscheidungen ab, bei denen die Bitte über vertraute Accounts, Stimme, Prozessausnahmen oder Lieferantenbeziehungen ankommen kann." },
      { question: "Ist CoMaSy ein soziales Deduktionsspiel?", answer: "Nein. Der Fokus liegt auf Beweisen, unabhängiger Verifizierung und angemessenem Handeln — nicht auf dem Erraten, wer „gut“ oder „böse“ ist." },
      { question: "Bedeutet Simulation Mehrspieler?", answer: "Nicht zwingend. Ein bezahlter Pilot kann das Entscheidungs- und Messmodell validieren, ohne zunächst umfassende Mehrspieler- oder Enterprise-Integrationen zu benötigen." },
      { question: "Was ist der nächste kommerzielle Schritt?", answer: "Fordere ein begrenztes Pilotprojekt an — mit definierter Kohorte, Risikofokus, Messplan und Skalierungs-/Stopp-Entscheidungspunkt." },
    ]}
  />;
}
