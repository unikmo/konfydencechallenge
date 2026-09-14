import type { Metadata } from "next";
import { ComasyIntentPage } from "@/components/ComasyIntentPage";

export const metadata: Metadata = {
  title: { absolute: "Cybersicherheit-Schulung für Mitarbeitende | CoMaSy" },
  description: "Kurze, realistische Entscheidungsübungen zur Cybersicherheit für Mitarbeitende — ergänzt bestehende Awareness-Programme und misst Verifizierungsverhalten.",
  alternates: {
    canonical: "/de/cybersicherheit-schulung-mitarbeiter",
    languages: { en: "https://konfydence.com/cybersecurity-awareness-training-for-employees", de: "https://konfydence.com/de/cybersicherheit-schulung-mitarbeiter" },
  },
};

export default function Page() {
  return <ComasyIntentPage
    lang="de"
    eyebrow="CYBERSICHERHEIT FÜR MITARBEITENDE"
    title="Trainiere die nächste Entscheidung, nicht nur die nächste Quizantwort."
    intro="CoMaSy stellt Mitarbeitende vor realistische Entscheidungen zu Zahlungsanweisungen, Chef-Betrug, Lieferantenwechseln, kompromittierten Accounts und anderem Social-Engineering-Druck. Ziel ist eine wiederholbare Gewohnheit: Innehalten, unabhängig prüfen, bei Bedarf eskalieren."
    problemTitle="Mitarbeitende brauchen Übung genau dort, wo Vertrauen, Druck und Betriebsablauf aufeinandertreffen."
    problemCopy="Echte Vorfälle kommen nicht mit dem Etikett „Phishing“. Eine Nachricht kann von einem echten Account stammen. Ein Anrufer kann interne Details kennen. Eine Ausnahme im Prozess kann plausibel wirken. Entscheidungstraining übt den Verifizierungsschritt, bevor der Druck echt wird."
    sections={[
      { title: "Kurze Übungen", copy: "Fokussierte Entscheidungsmissionen statt eines weiteren langen Kurses im Arbeitsalltag." },
      { title: "Rollenrelevante Szenarien", copy: "Priorisiere Szenarien, die zu den tatsächlichen Arbeitsabläufen der Kohorte passen — Zahlungen, Lohnbuchhaltung, Lieferantenwechsel oder privilegierte Handlungen." },
      { title: "Sofortiges Feedback", copy: "Erklärt, warum eine Antwort stärker ist, und verankert das wiederverwendbare Verifizierungsprinzip dahinter." },
    ]}
    proofTitle="Miss, wie die Kohorte reagiert — nicht, ob eine Lektion geöffnet wurde."
    proofCopy="Das Pilotreporting kann definierte Entscheidungssignale vor und nach gezieltem Training anhand deutlich unterschiedlicher Szenarien vergleichen."
    faq={[
      { question: "Wie lange dauert eine CoMaSy-Übung?", answer: "Der Pilot ist auf kurze Szenario-Entscheidungen ausgelegt, nicht auf einen langen Kurs. Die genaue Dauer hängt vom vereinbarten Szenario-Set ab." },
      { question: "Können Szenarien rollenspezifisch sein?", answer: "Ein Pilot kann sich auf relevante Arbeitsabläufe und Druckmuster konzentrieren, ohne eine unbegrenzte Autoren-Plattform vorauszusetzen." },
      { question: "Werden Mitarbeitende individuell bewertet?", answer: "Die Reporting-Granularität wird vor dem Pilot vereinbart. Ein Reporting auf Kohortenebene ist möglich, wenn Einzelanalysen nicht erforderlich sind." },
      { question: "Ersetzt das Richtlinien oder technische Kontrollen?", answer: "Nein. CoMaSy ist eine Trainings- und Messebene, kein Ersatz für technische Sicherheitskontrollen, Richtlinien oder Incident Response." },
    ]}
  />;
}
